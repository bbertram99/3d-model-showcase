/**
 * Forged in Pixels - Google Sheets Guestbook Web App
 *
 * Setup:
 * 1. Open https://sheets.new to create a Google Sheet.
 * 2. Go to Extensions -> Apps Script, delete any starter code, and paste this file.
 * 3. Click Deploy -> New deployment -> Web app:
 *      - Execute as: Me
 *      - Who has access: Anyone
 * 4. Copy the Web App URL (ends in /exec) and paste it into siteConfig.guestbookApiUrl.
 */

const SHEET_NAME = 'Guestbook';
const MAX_ENTRIES = 100;

function getOrCreateSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow(['Timestamp', 'Name', 'Favorite', 'Message', 'Approved']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function jsonResponse(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(
    ContentService.MimeType.JSON
  );
}

function doGet() {
  try {
    const sheet = getOrCreateSheet();
    const values = sheet.getDataRange().getValues();
    if (values.length <= 1) {
      return jsonResponse({ ok: true, entries: [] });
    }

    const entries = [];
    for (let i = values.length - 1; i >= 1; i--) {
      const [timestamp, name, favorite, message, approved] = values[i];
      const status = String(approved || 'YES').trim().toUpperCase();
      if (status === 'NO' || status === 'FALSE') {
        continue;
      }
      const cleanName = String(name || '').trim();
      const cleanMessage = String(message || '').trim();
      if (!cleanName || !cleanMessage) {
        continue;
      }
      entries.push({
        id: 'row-' + (i + 1),
        timestamp: timestamp instanceof Date ? timestamp.toISOString() : String(timestamp || ''),
        name: cleanName,
        favorite: String(favorite || '').trim(),
        message: cleanMessage,
      });
      if (entries.length >= MAX_ENTRIES) {
        break;
      }
    }

    return jsonResponse({ ok: true, entries: entries });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}

function doPost(e) {
  try {
    const raw = (e && e.postData && e.postData.contents) || '{}';
    const body = JSON.parse(raw);

    // Silent honeypot check against automated bots
    if (body.website && String(body.website).trim() !== '') {
      return jsonResponse({ ok: true, ignored: true });
    }

    const name = String(body.name || '').trim().slice(0, 60);
    const favorite = String(body.favorite || '').trim().slice(0, 80);
    const message = String(body.message || '').trim().slice(0, 400);

    if (!name || !message) {
      return jsonResponse({ ok: false, error: 'Name and message are required.' });
    }

    const sheet = getOrCreateSheet();
    const timestamp = new Date().toISOString();
    sheet.appendRow([timestamp, name, favorite, message, 'YES']);

    return jsonResponse({
      ok: true,
      entry: {
        id: 'row-' + sheet.getLastRow(),
        timestamp: timestamp,
        name: name,
        favorite: favorite,
        message: message,
      },
    });
  } catch (err) {
    return jsonResponse({ ok: false, error: String(err) });
  }
}
