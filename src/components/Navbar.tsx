import React, { useState } from 'react';
import { StoryChapter } from '../data/angkorHistoryData';
import { Compass, Menu, X, Bot, Sun, Moon, Volume2, Sparkles, Layers } from 'lucide-react';

interface NavbarProps {
  chapters: StoryChapter[];
  activeChapterId: string;
  onSelectChapter: (id: string) => void;
  onOpenScholar: () => void;
  timeOfDay: number;
  onChangeTimeOfDay: (time: number) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  chapters,
  activeChapterId,
  onSelectChapter,
  onOpenScholar,
  timeOfDay,
  onChangeTimeOfDay,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getTimeOfDayLabel = (t: number) => {
    if (t < 0.2) return 'Dawn Sunrise';
    if (t < 0.6) return 'Zenith Midday';
    if (t < 0.85) return 'Golden Sunset';
    return 'Starry Night';
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-xl border-b border-amber-900/40 text-amber-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => onSelectChapter(chapters[0].id)}>
          <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center text-amber-400 shadow-lg shadow-amber-500/10">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-sm sm:text-base text-amber-200 tracking-wide leading-none">
              ANGKOR WAT
            </h1>
            <p className="text-[10px] text-amber-400/70 tracking-widest uppercase font-mono">
              The Sacred Stone Sanctuary
            </p>
          </div>
        </div>

        {/* Desktop Chapter Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 bg-neutral-900/90 p-1.5 rounded-full border border-amber-900/40 text-xs">
          {chapters.map((ch) => (
            <button
              key={ch.id}
              onClick={() => onSelectChapter(ch.id)}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeChapterId === ch.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'text-amber-200/80 hover:text-amber-100 hover:bg-neutral-800'
              }`}
            >
              Ch. {ch.number}
            </button>
          ))}
        </nav>

        {/* Time of Day & AI Scholar Controls */}
        <div className="hidden sm:flex items-center gap-3">
          {/* Time of Day Atmosphere Slider */}
          <div className="flex items-center gap-2 bg-neutral-900/80 border border-amber-900/40 px-3 py-1.5 rounded-2xl text-xs">
            <Sun className="w-3.5 h-3.5 text-amber-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={timeOfDay}
              onChange={(e) => onChangeTimeOfDay(parseFloat(e.target.value))}
              className="w-20 accent-amber-500 bg-neutral-800 rounded h-1 cursor-pointer"
            />
            <span className="text-[10px] font-mono text-amber-300 min-w-[70px]">
              {getTimeOfDayLabel(timeOfDay)}
            </span>
          </div>

          {/* AI Scholar Button */}
          <button
            id="open-scholar-btn"
            onClick={onOpenScholar}
            className="px-3.5 py-2 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-2xl font-serif text-xs font-semibold flex items-center gap-2 transition-all shadow-lg hover:shadow-amber-500/10"
          >
            <Bot className="w-4 h-4 text-amber-400" />
            <span>AI Historian</span>
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          id="mobile-menu-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-amber-300 hover:text-amber-100 rounded-xl bg-neutral-900 border border-amber-900/40"
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-neutral-950/95 border-b border-amber-900/50 p-4 space-y-4 text-xs animate-fade-in">
          <div className="space-y-1">
            <div className="text-[10px] uppercase font-mono tracking-wider text-amber-400/80 mb-2">
              Historical Chapters
            </div>
            {chapters.map((ch) => (
              <button
                key={ch.id}
                onClick={() => {
                  onSelectChapter(ch.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                  activeChapterId === ch.id
                    ? 'bg-amber-500 text-neutral-950 font-bold border-amber-300'
                    : 'bg-neutral-900 border-neutral-800 text-amber-200'
                }`}
              >
                <span>Ch {ch.number}: {ch.title}</span>
                <span className="text-[10px] opacity-70 font-mono">{ch.era}</span>
              </button>
            ))}
          </div>

          {/* Time of Day Control Mobile */}
          <div className="p-3 bg-neutral-900 rounded-xl border border-amber-900/40 space-y-2">
            <div className="flex justify-between items-center text-amber-300">
              <span className="flex items-center gap-1.5"><Sun className="w-4 h-4 text-amber-400" /> Temple Atmosphere</span>
              <span className="font-mono">{getTimeOfDayLabel(timeOfDay)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={timeOfDay}
              onChange={(e) => onChangeTimeOfDay(parseFloat(e.target.value))}
              className="w-full accent-amber-500 bg-neutral-800 rounded h-1.5"
            />
          </div>

          {/* AI Scholar Mobile */}
          <button
            onClick={() => {
              onOpenScholar();
              setMobileMenuOpen(false);
            }}
            className="w-full p-3 bg-amber-500 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2"
          >
            <Bot className="w-4 h-4" />
            <span>Ask Royal AI Historian</span>
          </button>
        </div>
      )}
    </header>
  );
};
