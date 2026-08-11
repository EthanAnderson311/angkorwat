import React from 'react';
import { StoryChapter } from '../data/angkorHistoryData';
import { Compass, Calendar, BookOpen, Quote, CheckCircle, Sparkles, MapPin } from 'lucide-react';

interface StorytellingSectionProps {
  chapter: StoryChapter;
  isActive: boolean;
  onSelectHotspot: (id: string) => void;
  activeHotspotId: string | null;
}

export const StorytellingSection: React.FC<StorytellingSectionProps> = ({
  chapter,
  isActive,
  onSelectHotspot,
  activeHotspotId,
}) => {
  return (
    <section 
      id={`chapter-section-${chapter.id}`}
      className={`relative min-h-screen py-20 px-4 sm:px-6 lg:px-8 transition-all duration-700 rounded-3xl overflow-hidden border border-amber-900/30 shadow-2xl my-12 ${
        isActive ? 'opacity-100 translate-y-0 ring-1 ring-amber-500/40' : 'opacity-60 translate-y-4'
      }`}
    >
      {/* Chapter Background Image Backdrop */}
      <div className="absolute inset-0 -z-10 overflow-hidden">
        <img
          src={chapter.bgImage}
          alt={chapter.title}
          className="w-full h-full object-cover object-center filter brightness-50 contrast-125 scale-105 transition-transform duration-1000 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/85 to-neutral-950" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto space-y-8">
        
        {/* Chapter Header Badge */}
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3.5 py-1.5 rounded-full bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            Chapter {chapter.number} • {chapter.timeframe}
          </span>
          <span className="px-3.5 py-1.5 rounded-full bg-neutral-900/90 border border-amber-900/40 text-amber-200/90 text-xs backdrop-blur-md">
            {chapter.era}
          </span>
        </div>

        {/* Chapter Title & Subtitle */}
        <div className="space-y-2">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-amber-100 leading-tight drop-shadow-lg">
            {chapter.title}
          </h2>
          <p className="text-lg sm:text-xl font-serif italic text-amber-400/90">
            {chapter.subtitle}
          </p>
        </div>

        {/* Chapter Visual Feature Focus Frame */}
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden border border-amber-500/30 shadow-2xl group">
          <img
            src={chapter.bgImage}
            alt={`${chapter.title} Shrine Detail`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/20 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-amber-200 font-serif">
            <span className="bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-amber-900/50 backdrop-blur-md">
              📍 {chapter.title} — Angkor Wat Temple Sanctuary
            </span>
            <span className="hidden sm:inline-block bg-amber-500/20 text-amber-300 px-3 py-1.5 rounded-xl border border-amber-400/30 font-mono uppercase text-[10px] tracking-wider">
              {chapter.timeframe}
            </span>
          </div>
        </div>

        {/* Historical Summary Box */}
        <div className="p-5 rounded-2xl bg-neutral-950/90 border-l-4 border-amber-500 text-amber-200 text-sm md:text-base leading-relaxed font-serif shadow-xl backdrop-blur-md">
          {chapter.summary}
        </div>

        {/* Full Narrative Text */}
        <div className="bg-neutral-950/90 backdrop-blur-xl border border-amber-900/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-amber-100/95 text-sm md:text-base font-serif leading-relaxed">
          {chapter.fullHistory.split('\n\n').map((paragraph, idx) => (
            <p key={idx} className="first-letter:text-3xl first-letter:font-bold first-letter:text-amber-400 first-letter:mr-1">
              {paragraph}
            </p>
          ))}

          {/* Hotspots Interactive Buttons */}
          {chapter.hotspots.length > 0 && (
            <div className="pt-4 border-t border-amber-900/40">
              <span className="text-xs uppercase font-mono tracking-wider text-amber-400 font-semibold block mb-3 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-amber-400" /> Key Features in this Chapter:
              </span>
              <div className="flex flex-wrap gap-2">
                {chapter.hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    onClick={() => onSelectHotspot(hs.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-sans transition-all flex items-center gap-2 border ${
                      activeHotspotId === hs.id
                        ? 'bg-amber-500 text-neutral-950 font-bold border-amber-300 shadow-lg scale-105'
                        : 'bg-neutral-900/90 text-amber-200 border-amber-900/50 hover:bg-neutral-800'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{hs.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Key Historical Facts Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {chapter.keyFacts.map((fact, idx) => (
            <div 
              key={idx}
              className="p-4 rounded-2xl bg-neutral-950/90 border border-amber-900/50 text-xs sm:text-sm text-amber-200/90 flex items-start gap-3 shadow-md backdrop-blur-md"
            >
              <CheckCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <span>{fact}</span>
            </div>
          ))}
        </div>

        {/* Primary Historical Sources Quotes */}
        {chapter.primarySources.map((source, idx) => (
          <blockquote 
            key={idx}
            className="p-6 rounded-3xl bg-neutral-950/95 border border-amber-500/30 text-amber-100 font-serif italic text-sm md:text-base space-y-3 shadow-2xl relative overflow-hidden backdrop-blur-md"
          >
            <Quote className="w-12 h-12 text-amber-500/10 absolute -right-2 -bottom-2 pointer-events-none" />
            <p className="relative z-10">"{source.quote}"</p>
            <footer className="text-xs font-sans not-italic text-amber-400 font-semibold flex items-center justify-between border-t border-amber-900/30 pt-3">
              <span>— {source.author}</span>
              <span className="text-neutral-400 font-normal">{source.context}</span>
            </footer>
          </blockquote>
        ))}

      </div>
    </section>
  );
};
