import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BookOpen, MessageSquare, RefreshCw, Send, Sparkles } from 'lucide-react';
import { artProjects } from '../data/artData';
import { modelsCatalog } from '../data/modelsData';
import { siteConfig } from '../data/siteConfig';

export interface GuestbookEntry {
  id: string;
  timestamp: string;
  name: string;
  favorite?: string;
  message: string;
}

const LOCAL_STORAGE_KEY = 'fip_guestbook_local';

const STARTER_ENTRY: GuestbookEntry = {
  id: 'starter-brent',
  timestamp: '2026-11-25T23:00:00.000Z',
  name: 'Brent (Creator)',
  favorite: "King's Quest V - Daventry Horizon",
  message:
    'Welcome to the showcase! Thanks for checking out my 3D prints and stained-glass wall art. Drop a note below and let me know your favorite piece!',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function formatDate(iso: string): string {
  if (!iso) return 'Just now';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export const GuestbookSection: React.FC = () => {
  const apiUrl = siteConfig.guestbookApiUrl.trim();
  const isLive = apiUrl.length > 0;

  const favoriteOptions = useMemo(
    () => [
      'All of them!',
      ...modelsCatalog.map((m) => m.title),
      ...artProjects.map((a) => a.title),
      'Just browsing',
    ],
    []
  );

  const [entries, setEntries] = useState<GuestbookEntry[]>([STARTER_ENTRY]);
  const [loading, setLoading] = useState<boolean>(isLive);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [statusNotice, setStatusNotice] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  const [name, setName] = useState('');
  const [favorite, setFavorite] = useState(favoriteOptions[0]);
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState(''); // Honeypot

  const loadLocalEntries = useCallback(() => {
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as GuestbookEntry[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setEntries([...parsed, STARTER_ENTRY]);
          return;
        }
      }
    } catch {
      // Ignore storage errors
    }
    setEntries([STARTER_ENTRY]);
  }, []);

  const fetchLiveEntries = useCallback(async () => {
    if (!apiUrl) return;
    setLoading(true);
    try {
      const res = await fetch(apiUrl, { method: 'GET', cache: 'no-store' });
      const data = (await res.json()) as { ok?: boolean; entries?: GuestbookEntry[] };
      if (data.ok && Array.isArray(data.entries)) {
        setEntries(data.entries.length > 0 ? data.entries : [STARTER_ENTRY]);
      }
    } catch {
      setStatusNotice({
        type: 'error',
        text: 'Could not load guestbook entries right now. Please try refreshing.',
      });
    } finally {
      setLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (isLive) {
      fetchLiveEntries();
    } else {
      loadLocalEntries();
    }
  }, [isLive, fetchLiveEntries, loadLocalEntries]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatusNotice(null);

    const cleanName = name.trim();
    const cleanMessage = message.trim();
    if (!cleanName || !cleanMessage) {
      setStatusNotice({ type: 'error', text: 'Please enter both your name and a message.' });
      return;
    }

    if (website.trim() !== '') {
      // Silent honeypot trip
      setName('');
      setMessage('');
      return;
    }

    setSubmitting(true);

    if (!isLive) {
      const localEntry: GuestbookEntry = {
        id: `local-${Date.now()}`,
        timestamp: new Date().toISOString(),
        name: cleanName,
        favorite,
        message: cleanMessage,
      };
      try {
        const existingRaw = localStorage.getItem(LOCAL_STORAGE_KEY);
        const existing = existingRaw ? (JSON.parse(existingRaw) as GuestbookEntry[]) : [];
        const updated = [localEntry, ...(Array.isArray(existing) ? existing : [])];
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        setEntries([localEntry, ...existing, STARTER_ENTRY]);
      } catch {
        setEntries((prev) => [localEntry, ...prev]);
      }
      setName('');
      setMessage('');
      setSubmitting(false);
      setStatusNotice({
        type: 'success',
        text: 'Signed locally! Connect your Google Sheet Web App URL in siteConfig.ts to save entries globally for all visitors.',
      });
      return;
    }

    try {
      const res = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({
          name: cleanName,
          favorite,
          message: cleanMessage,
          website,
        }),
      });
      const data = (await res.json()) as {
        ok?: boolean;
        entry?: GuestbookEntry;
        error?: string;
      };
      if (data.ok && data.entry) {
        setEntries((prev) => {
          const withoutStarter = prev.filter((item) => item.id !== STARTER_ENTRY.id);
          return [data.entry!, ...withoutStarter];
        });
        setName('');
        setMessage('');
        setStatusNotice({ type: 'success', text: 'Thanks for signing the guestbook!' });
      } else {
        setStatusNotice({
          type: 'error',
          text: data.error || 'Unable to submit entry right now.',
        });
      }
    } catch {
      setStatusNotice({
        type: 'error',
        text: 'Network error while signing the guestbook. Please try again.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="guestbook" className="border-t border-slate-800/80 bg-[#0B0E13] py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#2DD4BF]/30 bg-[#2DD4BF]/10 px-3 py-1 text-xs font-mono-tech uppercase tracking-wider text-[#2DD4BF]">
              <BookOpen className="h-3.5 w-3.5" />
              Classic Web Guestbook
            </div>
            <h2 className="mt-3 font-display text-3xl font-bold text-[#F1F5F9] sm:text-4xl">
              Sign the Guestbook
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-[#94A3B8] sm:text-base">
              Stopped by from Facebook or MakerWorld? Leave a note, tell me which hero or
              stained-glass piece is your favorite, or suggest a classic character to sculpt next.
            </p>
          </div>

          <div className="flex items-center gap-2 font-mono-tech text-xs text-[#94A3B8]">
            <span className="rounded-lg border border-slate-800 bg-[#11161F] px-3 py-2">
              {entries.length} {entries.length === 1 ? 'Entry' : 'Entries'}
            </span>
            {isLive && (
              <button
                type="button"
                onClick={fetchLiveEntries}
                disabled={loading}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-800 bg-[#11161F] px-3 py-2 text-[#CBD5E1] transition hover:border-[#2DD4BF]/50 hover:text-[#2DD4BF] disabled:opacity-50"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            )}
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[400px_1fr]">
          {/* Left: Sign Form */}
          <form
            onSubmit={handleSubmit}
            className="flex h-fit flex-col gap-4 rounded-2xl border border-slate-800 bg-[#11161F] p-6 shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <span className="font-display text-base font-semibold text-[#F1F5F9]">
                Leave a Note
              </span>
              <span className="font-mono-tech text-[10px] uppercase tracking-wider text-[#64748B]">
                No login required
              </span>
            </div>

            <div>
              <label
                htmlFor="gb-name"
                className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
              >
                Your Name
              </label>
              <input
                id="gb-name"
                type="text"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Graham from Daventry"
                className="w-full rounded-xl border border-slate-700/80 bg-[#0B0E13] px-3.5 py-2.5 text-sm text-[#F1F5F9] placeholder-[#64748B] focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>

            <div>
              <label
                htmlFor="gb-favorite"
                className="mb-1.5 block text-xs font-medium text-[#CBD5E1]"
              >
                Favorite Piece
              </label>
              <select
                id="gb-favorite"
                value={favorite}
                onChange={(e) => setFavorite(e.target.value)}
                className="w-full rounded-xl border border-slate-700/80 bg-[#0B0E13] px-3.5 py-2.5 text-sm text-[#F1F5F9] focus:border-[#2DD4BF] focus:outline-none"
              >
                {favoriteOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="gb-message" className="text-xs font-medium text-[#CBD5E1]">
                  Message
                </label>
                <span className="font-mono-tech text-[10px] text-[#64748B]">
                  {message.length}/400
                </span>
              </div>
              <textarea
                id="gb-message"
                required
                rows={4}
                maxLength={400}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share what you think or suggest the next retro game character..."
                className="w-full resize-y rounded-xl border border-slate-700/80 bg-[#0B0E13] px-3.5 py-2.5 text-sm text-[#F1F5F9] placeholder-[#64748B] focus:border-[#2DD4BF] focus:outline-none"
              />
            </div>

            {/* Honeypot input */}
            <input
              type="text"
              name="website"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              className="hidden"
            />

            {statusNotice && (
              <div
                className={`rounded-xl border px-3.5 py-2.5 text-xs ${
                  statusNotice.type === 'success'
                    ? 'border-[#2DD4BF]/40 bg-[#2DD4BF]/10 text-[#99F6E4]'
                    : 'border-[#F59E0B]/40 bg-[#F59E0B]/10 text-[#FDE68A]'
                }`}
              >
                {statusNotice.text}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#2DD4BF] px-5 py-3 text-sm font-semibold text-[#081014] shadow-[0_8px_25px_rgba(45,212,191,0.22)] transition hover:bg-[#5EEAD4] disabled:opacity-60"
            >
              <Send className="h-4 w-4" />
              {submitting ? 'Signing…' : 'Sign Guestbook'}
            </button>
          </form>

          {/* Right: Entries Feed */}
          <div className="flex flex-col gap-3.5">
            {!isLive && (
              <div className="rounded-xl border border-[#F59E0B]/25 bg-[#F59E0B]/5 px-4 py-3 text-xs text-[#CBD5E1]">
                <span className="font-semibold text-[#F59E0B]">Preview Mode:</span> Guestbook
                UI is live and ready. Connect your Google Sheet Apps Script URL in{' '}
                <code className="font-mono-tech text-[#2DD4BF]">src/data/siteConfig.ts</code>{' '}
                to sync visitor entries globally.
              </div>
            )}

            {loading ? (
              <div className="flex min-h-[220px] items-center justify-center rounded-2xl border border-slate-800 bg-[#11161F]/60 text-sm font-mono-tech text-[#94A3B8]">
                Loading guestbook entries…
              </div>
            ) : (
              <div className="grid gap-3.5">
                {entries.map((entry) => (
                  <article
                    key={entry.id}
                    className="rounded-2xl border border-slate-800 bg-[#18202C]/70 p-5 transition hover:border-slate-700"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#2DD4BF]/30 bg-[#11161F] font-mono-tech text-xs font-bold text-[#2DD4BF]">
                          {getInitials(entry.name)}
                        </div>
                        <div>
                          <h3 className="font-display text-sm font-bold text-[#F1F5F9]">
                            {entry.name}
                          </h3>
                          <span className="font-mono-tech text-[11px] text-[#64748B]">
                            {formatDate(entry.timestamp)}
                          </span>
                        </div>
                      </div>

                      {entry.favorite && (
                        <span className="inline-flex items-center gap-1 rounded-full border border-[#F59E0B]/30 bg-[#F59E0B]/10 px-2.5 py-0.5 font-mono-tech text-[10px] text-[#F59E0B]">
                          <Sparkles className="h-3 w-3" />
                          {entry.favorite}
                        </span>
                      )}
                    </div>

                    <p className="mt-3 flex items-start gap-2 text-sm leading-relaxed text-[#CBD5E1]">
                      <MessageSquare className="mt-1 h-3.5 w-3.5 shrink-0 text-[#64748B]" />
                      <span>{entry.message}</span>
                    </p>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
