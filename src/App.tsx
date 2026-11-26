import React, { useMemo, useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { PipelineSection } from './components/PipelineSection';
import { ModelsGallery } from './components/ModelsGallery';
import { ArtGallery } from './components/ArtGallery';
import { ModelDetailModal, ModelModalTab } from './components/ModelDetailModal';
import { ArtDetailModal } from './components/ArtDetailModal';
import { Footer } from './components/Footer';
import { CollectiblesModel, modelsCatalog } from './data/modelsData';
import { ArtProject, artProjects } from './data/artData';

export const App: React.FC = () => {
  const [selectedModel, setSelectedModel] = useState<CollectiblesModel | null>(null);
  const [modelModalTab, setModelModalTab] = useState<ModelModalTab>('concept');
  const [selectedArt, setSelectedArt] = useState<ArtProject | null>(null);

  const featuredModels = useMemo(
    () =>
      modelsCatalog.filter((m) =>
        ['king-graham', 'gorath', 'roger-wilco', 'sonny-bonds', 'qfg-paladin'].includes(m.slug)
      ),
    []
  );

  const handleSelectModel = (model: CollectiblesModel, initialTab: ModelModalTab = 'concept') => {
    setSelectedArt(null);
    setModelModalTab(initialTab);
    setSelectedModel(model);
  };

  const handleSelectArt = (art: ArtProject) => {
    setSelectedModel(null);
    setSelectedArt(art);
  };

  const cycleModel = (delta: number) => {
    if (!selectedModel) return;
    const idx = modelsCatalog.findIndex((m) => m.id === selectedModel.id);
    const nextIdx = (idx + delta + modelsCatalog.length) % modelsCatalog.length;
    setSelectedModel(modelsCatalog[nextIdx]);
  };

  const cycleArt = (delta: number) => {
    if (!selectedArt) return;
    const idx = artProjects.findIndex((a) => a.id === selectedArt.id);
    const nextIdx = (idx + delta + artProjects.length) % artProjects.length;
    setSelectedArt(artProjects[nextIdx]);
  };

  const isModalOpen = Boolean(selectedModel || selectedArt);

  return (
    <div className="min-h-screen bg-[#0B0E13] text-[#F1F5F9]">
      <Navbar modelCount={modelsCatalog.length} artCount={artProjects.length} />

      <main>
        <HeroSection
          featuredModels={featuredModels}
          isModalOpen={isModalOpen}
          onInspectModel={(m) => handleSelectModel(m, 'concept')}
        />
        <PipelineSection />
        <ModelsGallery models={modelsCatalog} onSelectModel={handleSelectModel} />
        <ArtGallery artworks={artProjects} onSelectArt={handleSelectArt} />
      </main>

      <Footer />

      <ModelDetailModal
        model={selectedModel}
        initialTab={modelModalTab}
        onClose={() => setSelectedModel(null)}
        onPrev={() => cycleModel(-1)}
        onNext={() => cycleModel(1)}
      />

      <ArtDetailModal
        artwork={selectedArt}
        onClose={() => setSelectedArt(null)}
        onPrev={() => cycleArt(-1)}
        onNext={() => cycleArt(1)}
      />
    </div>
  );
};

export default App;
