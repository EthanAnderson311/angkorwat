import React, { useState, useRef } from 'react';
import { BasReliefDetail } from '../data/angkorHistoryData';
import { Search, Eye, Sparkles, Layers, Info } from 'lucide-react';

interface BasReliefViewerProps {
  basReliefs: BasReliefDetail[];
}

export const BasReliefViewer: React.FC<BasReliefViewerProps> = ({ basReliefs }) => {
  const [selectedRelief, setSelectedRelief] = useState<BasReliefDetail>(basReliefs[0] || {
    id: 'ocean-milk',
    title: 'The Churning of the Ocean of Milk',
    location: 'East Gallery, South Wing',
    description: '88 Asuras and 92 Devas churning the cosmic sea using serpent Vasuki around Mount Mandara.',
    historicalSignificance: 'Represents the eternal quest for order, immortality, and cosmic harmony under Vishnu.',
    carvingTechnique: 'Shallow bas-relief carving depth between 1.5 cm and 3 cm into solid sandstone.'
  });

  const [filterMode, setFilterMode] = useState<'natural' | 'depth' | 'gold'>('natural');
  const [magnifierPos, setMagnifierPos] = useState({ px: 0, py: 0, xPct: 50, yPct: 50, containerW: 800, containerH: 400 });
  const [isHovering, setIsHovering] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const updateMagnifierPosition = (clientX: number, clientY: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const px = Math.max(0, Math.min(rect.width, clientX - rect.left));
    const py = Math.max(0, Math.min(rect.height, clientY - rect.top));
    const xPct = (px / rect.width) * 100;
    const yPct = (py / rect.height) * 100;

    setMagnifierPos({ px, py, xPct, yPct, containerW: rect.width, containerH: rect.height });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    updateMagnifierPosition(e.clientX, e.clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length > 0) {
      updateMagnifierPosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  };

  const getFilterStyle = () => {
    switch (filterMode) {
      case 'depth':
        return 'contrast(160%) brightness(85%) sepia(20%) grayscale(30%)';
      case 'gold':
        return 'sepia(100%) saturate(300%) hue-rotate(5deg) brightness(110%) contrast(120%)';
      default:
        return 'contrast(110%) brightness(100%)';
    }
  };

  const currentImage = selectedRelief.image || '/src/assets/images/angkor_bas_relief_1786454789992.jpg';

  return (
    <div className="bg-neutral-900 border border-amber-900/40 rounded-3xl p-6 md:p-8 shadow-2xl my-12 backdrop-blur-md">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest mb-1">
            <Sparkles className="w-4 h-4" />
            <span>High-Fidelity Sandstone Carving Inspector</span>
          </div>
          <h3 className="text-2xl font-serif font-bold text-amber-100">
            Intricate Sandstone Bas-Reliefs
          </h3>
        </div>

        {/* Filter Mode Selector */}
        <div className="flex items-center gap-1.5 bg-neutral-950 p-1.5 rounded-2xl border border-amber-900/40 text-xs">
          <button
            id="filter-natural-btn"
            onClick={() => setFilterMode('natural')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterMode === 'natural'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-amber-300 hover:bg-neutral-800'
            }`}
          >
            Natural Sandstone
          </button>
          <button
            id="filter-depth-btn"
            onClick={() => setFilterMode('depth')}
            className={`px-3 py-1.5 rounded-xl transition-all ${
              filterMode === 'depth'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-amber-300 hover:bg-neutral-800'
            }`}
          >
            Depth & Shadows
          </button>
          <button
            id="filter-gold-btn"
            onClick={() => setFilterMode('gold')}
            className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1 ${
              filterMode === 'gold'
                ? 'bg-amber-500 text-neutral-950 font-bold'
                : 'text-amber-300 hover:bg-neutral-800'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            12th C. Gold Leaf
          </button>
        </div>
      </div>

      {/* Main Interactive Magnifier Canvas */}
      <div 
        ref={containerRef}
        className="relative w-full h-80 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden cursor-crosshair border border-amber-800/40 group shadow-inner select-none"
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onTouchStart={(e) => {
          setIsHovering(true);
          if (e.touches.length > 0) updateMagnifierPosition(e.touches[0].clientX, e.touches[0].clientY);
        }}
        onTouchEnd={() => setIsHovering(false)}
      >
        {/* Base Sandstone Carving Image */}
        <img
          src={currentImage}
          alt={selectedRelief.title}
          style={{ filter: getFilterStyle() }}
          className="w-full h-full object-cover transition-all duration-300"
        />

        {/* Magnifying Lens Glass Overlay (3x Zoom Pixel-Accurate Follow) */}
        {isHovering && (
          <div
            className="absolute w-48 h-48 rounded-full border-2 border-amber-400 shadow-2xl pointer-events-none overflow-hidden z-20"
            style={{
              left: `${magnifierPos.px}px`,
              top: `${magnifierPos.py}px`,
              transform: 'translate(-50%, -50%)',
              boxShadow: '0 0 35px rgba(245, 158, 11, 0.5), inset 0 0 20px rgba(0,0,0,0.7)',
            }}
          >
            {/* Zoomed Image replica rendered at 3x scale */}
            <img
              src={currentImage}
              alt="Magnified Sandstone Detail"
              style={{
                width: `${magnifierPos.containerW * 3}px`,
                height: `${magnifierPos.containerH * 3}px`,
                maxWidth: 'none',
                maxHeight: 'none',
                position: 'absolute',
                left: `-${magnifierPos.px * 3 - 96}px`,
                top: `-${magnifierPos.py * 3 - 96}px`,
                filter: getFilterStyle() + ' contrast(135%) brightness(105%)',
              }}
              className="object-cover"
            />

            {/* Lens Reflection Glass Highlight */}
            <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-amber-200/20 pointer-events-none rounded-full border border-amber-300/50" />
            
            {/* Crosshair indicator */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
              <div className="w-4 h-[1px] bg-amber-400" />
              <div className="h-4 w-[1px] bg-amber-400 absolute" />
            </div>

            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 text-[9px] font-mono font-bold uppercase tracking-wider text-amber-300 bg-neutral-950/90 px-2.5 py-0.5 rounded-full border border-amber-500/40 backdrop-blur-md shadow-md">
              3x Micro Detail Lens
            </div>
          </div>
        )}

        {/* Instructions Overlay badge */}
        <div className="absolute top-4 left-4 bg-neutral-950/80 backdrop-blur-md px-3 py-1.5 rounded-xl border border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 pointer-events-none">
          <Search className="w-3.5 h-3.5 text-amber-400" />
          <span>Hover / Touch to magnify sandstone chiseling detail</span>
        </div>
      </div>

      {/* Carving Detail Selector Tabs & Educational Breakdown */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Gallery Tab Options */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-amber-400/80 uppercase tracking-wider block mb-2">
            Select Bas-Relief Gallery Wall
          </label>
          {basReliefs.map((relief) => (
            <button
              key={relief.id}
              onClick={() => setSelectedRelief(relief)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all text-xs ${
                selectedRelief.id === relief.id
                  ? 'bg-amber-500/20 border-amber-500 text-amber-100 font-semibold shadow-lg'
                  : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-amber-900 hover:text-amber-200'
              }`}
            >
              <div className="font-serif text-sm font-bold text-amber-300 mb-0.5">
                {relief.title}
              </div>
              <div className="text-[11px] text-amber-200/60">{relief.location}</div>
            </button>
          ))}
        </div>

        {/* Selected Relief Detailed Analysis */}
        <div className="lg:col-span-2 bg-neutral-950/80 border border-amber-900/30 rounded-2xl p-5 text-amber-100 text-xs leading-relaxed space-y-3">
          <div className="flex items-center gap-2 text-amber-400 font-serif font-bold text-base border-b border-amber-900/40 pb-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>{selectedRelief.title}</span>
          </div>

          <p className="text-amber-100/90 font-serif text-sm">
            {selectedRelief.description}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="bg-neutral-900/80 p-3 rounded-xl border border-amber-900/30">
              <span className="text-amber-400 font-semibold block mb-1">Historical Significance:</span>
              <span className="text-neutral-300">{selectedRelief.historicalSignificance}</span>
            </div>
            <div className="bg-neutral-900/80 p-3 rounded-xl border border-amber-900/30">
              <span className="text-amber-400 font-semibold block mb-1">Stonemason Technique:</span>
              <span className="text-neutral-300">{selectedRelief.carvingTechnique}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
