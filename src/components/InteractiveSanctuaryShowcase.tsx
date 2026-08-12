import React, { useState } from 'react';
import { StoryChapter } from '../data/angkorHistoryData';
import imgSunriseHero from '../assets/images/angkor_sunrise_hero_1786454818680.jpg';
import { Compass, Sun, Moon, Sparkles, MapPin, ShieldCheck } from 'lucide-react';

interface InteractiveSanctuaryShowcaseProps {
  currentChapter: StoryChapter;
  activeHotspotId: string | null;
  onSelectHotspot: (hotspotId: string) => void;
  timeOfDay: number;
  onChangeTimeOfDay: (time: number) => void;
}

export const InteractiveSanctuaryShowcase: React.FC<InteractiveSanctuaryShowcaseProps> = ({
  currentChapter,
  activeHotspotId,
  onSelectHotspot,
  timeOfDay,
  onChangeTimeOfDay,
}) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    e.currentTarget.src = imgSunriseHero;
  };

  const getTimeOverlayClass = () => {
    if (timeOfDay < 0.2) return 'bg-amber-600/20 mix-blend-color-dodge'; // Dawn
    if (timeOfDay < 0.6) return 'bg-sky-400/10 mix-blend-soft-light'; // Day
    if (timeOfDay < 0.85) return 'bg-rose-600/30 mix-blend-overlay'; // Sunset
    return 'bg-indigo-950/60 mix-blend-multiply'; // Night
  };

  const selectedHotspot = currentChapter.hotspots.find(h => h.id === activeHotspotId) || currentChapter.hotspots[0];

  return (
    <div className="relative w-full h-full bg-neutral-950 flex flex-col justify-between overflow-hidden group">
      
      {/* Background Image with Time-of-Day Filter */}
      <div className="absolute inset-0 z-0">
        <img
          src={currentChapter.bgImage}
          alt={currentChapter.title}
          onError={handleImageError}
          className="w-full h-full object-cover transition-all duration-700 brightness-90 contrast-110 scale-100 group-hover:scale-105"
        />
        {/* Dynamic Atmospheric Tint Overlay */}
        <div className={`absolute inset-0 transition-colors duration-700 ${getTimeOverlayClass()}`} />
        <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/30 to-neutral-950/60" />
      </div>

      {/* Top Bar Floating Controls */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-neutral-900/90 border border-amber-500/40 text-amber-200 text-xs backdrop-blur-md shadow-xl">
          <Compass className="w-4 h-4 text-amber-400" />
          <span className="font-mono font-bold tracking-wider uppercase text-[11px]">
            {currentChapter.title}
          </span>
        </div>

        {/* Time of Day Presets */}
        <div className="flex items-center gap-1.5 bg-neutral-900/90 border border-amber-900/50 p-1 rounded-2xl backdrop-blur-md shadow-xl">
          <button
            onClick={() => onChangeTimeOfDay(0.0)}
            className={`px-3 py-1 rounded-xl text-[11px] font-sans transition-all flex items-center gap-1 ${
              timeOfDay === 0.0 ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Dawn</span>
          </button>
          <button
            onClick={() => onChangeTimeOfDay(0.5)}
            className={`px-3 py-1 rounded-xl text-[11px] font-sans transition-all flex items-center gap-1 ${
              timeOfDay === 0.5 ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-amber-200" />
            <span className="hidden sm:inline">Noon</span>
          </button>
          <button
            onClick={() => onChangeTimeOfDay(0.75)}
            className={`px-3 py-1 rounded-xl text-[11px] font-sans transition-all flex items-center gap-1 ${
              timeOfDay === 0.75 ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Sun className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Sunset</span>
          </button>
          <button
            onClick={() => onChangeTimeOfDay(1.0)}
            className={`px-3 py-1 rounded-xl text-[11px] font-sans transition-all flex items-center gap-1 ${
              timeOfDay === 1.0 ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-amber-200/80 hover:text-amber-100'
            }`}
          >
            <Moon className="w-3.5 h-3.5 text-indigo-300" />
            <span className="hidden sm:inline">Night</span>
          </button>
        </div>
      </div>

      {/* Center Interactive Hotspots Pins Overlay */}
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="relative w-full max-w-2xl h-48 sm:h-64 rounded-2xl border border-amber-500/30 bg-neutral-950/60 backdrop-blur-md shadow-2xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between border-b border-amber-900/40 pb-2">
            <span className="text-xs font-mono uppercase text-amber-400 tracking-wider flex items-center gap-1.5 font-bold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Interactive Sanctuary Feature Explorer
            </span>
            <span className="text-[10px] font-mono text-amber-300/80">
              Chapter {currentChapter.number} of 6
            </span>
          </div>

          {/* Hotspot details panel */}
          {selectedHotspot && (
            <div className="my-auto space-y-2 text-left">
              <h4 className="text-lg font-serif font-bold text-amber-100 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{selectedHotspot.label}</span>
              </h4>
              <p className="text-xs sm:text-sm text-amber-200/90 font-serif leading-relaxed line-clamp-3">
                {selectedHotspot.description}
              </p>
            </div>
          )}

          {/* Hotspot selector chips */}
          <div className="flex flex-wrap gap-2 pt-2 border-t border-amber-900/40">
            {currentChapter.hotspots.map((hs) => (
              <button
                key={hs.id}
                onClick={() => onSelectHotspot(hs.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-sans transition-all flex items-center gap-1.5 border ${
                  activeHotspotId === hs.id
                    ? 'bg-amber-500 text-neutral-950 font-bold border-amber-300 shadow-lg scale-105'
                    : 'bg-neutral-900/80 text-amber-200 border-amber-900/40 hover:bg-neutral-800'
                }`}
              >
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>{hs.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Architectural Info Banner */}
      <div className="relative z-10 p-4 bg-neutral-950/90 border-t border-amber-900/40 backdrop-blur-md flex flex-wrap items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <span className="px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 font-mono text-[11px] font-bold border border-amber-500/30">
            {currentChapter.timeframe}
          </span>
          <span className="text-amber-200 font-serif italic text-xs hidden sm:inline-block">
            {currentChapter.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2 text-neutral-400 text-[11px] font-mono">
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Authentic Khmer Historical Documentation</span>
        </div>
      </div>

    </div>
  );
};
