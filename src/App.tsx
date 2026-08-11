import React, { useState, useEffect } from 'react';
import { ANGKOR_CHAPTERS, ANGKOR_QUIZ } from './data/angkorHistoryData';
import { InteractiveSanctuaryShowcase } from './components/InteractiveSanctuaryShowcase';
import { AudioGuide } from './components/AudioGuide';
import { BasReliefViewer } from './components/BasReliefViewer';
import { HistoricalQuiz } from './components/HistoricalQuiz';
import { AIHistorianModal } from './components/AIHistorianModal';
import { Navbar } from './components/Navbar';
import { StorytellingSection } from './components/StorytellingSection';
import { Compass, Sparkles, ChevronDown, BookOpen, Globe } from 'lucide-react';

export default function App() {
  const [activeChapterIndex, setActiveChapterIndex] = useState(0);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [timeOfDay, setTimeOfDay] = useState(0.0); // 0.0 = Sunrise Dawn
  const [isScholarOpen, setIsScholarOpen] = useState(false);

  const currentChapter = ANGKOR_CHAPTERS[activeChapterIndex] || ANGKOR_CHAPTERS[0];

  // Scroll Parallax Detection for Active Chapter
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight * 0.4;

      for (let i = ANGKOR_CHAPTERS.length - 1; i >= 0; i--) {
        const el = document.getElementById(`chapter-section-${ANGKOR_CHAPTERS[i].id}`);
        if (el) {
          const top = el.offsetTop;
          if (scrollPosition >= top) {
            if (activeChapterIndex !== i) {
              setActiveChapterIndex(i);
              setActiveHotspotId(null);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [activeChapterIndex]);

  const handleSelectChapter = (chapterId: string) => {
    const idx = ANGKOR_CHAPTERS.findIndex(c => c.id === chapterId);
    if (idx !== -1) {
      setActiveChapterIndex(idx);
      setActiveHotspotId(null);

      const el = document.getElementById(`chapter-section-${chapterId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleSelectHotspot = (hotspotId: string) => {
    setActiveHotspotId(prev => prev === hotspotId ? null : hotspotId);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-amber-100 font-sans selection:bg-amber-500 selection:text-neutral-950">
      
      {/* Fixed Responsive Navigation Bar */}
      <Navbar
        chapters={ANGKOR_CHAPTERS}
        activeChapterId={currentChapter.id}
        onSelectChapter={handleSelectChapter}
        onOpenScholar={() => setIsScholarOpen(true)}
        timeOfDay={timeOfDay}
        onChangeTimeOfDay={setTimeOfDay}
      />

      {/* Hero Header Banner - Chapter 1 Hero Image Preserved */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden pt-16">
        <div className="absolute inset-0 z-0">
          <img
            src="/src/assets/images/angkor_sunrise_hero_1786454818680.jpg"
            alt="Angkor Wat Golden Sunrise"
            className="w-full h-full object-cover brightness-75 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/40 to-neutral-950/70" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center px-4 space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 font-mono text-xs uppercase tracking-widest shadow-2xl backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Sacred Stone Sanctuary & Historical Journey</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-serif font-bold text-amber-100 tracking-tight leading-none drop-shadow-2xl">
            ANGKOR WAT
          </h1>

          <p className="text-lg sm:text-2xl font-serif italic text-amber-300/90 max-w-2xl mx-auto drop-shadow">
            "Paramavishnuloka — The Supreme Abode of Vishnu"
          </p>

          <p className="text-xs sm:text-sm text-neutral-300 max-w-xl mx-auto leading-relaxed font-sans">
            Explore 12th-century Khmer history through authentic sanctuary photography, high-fidelity sandstone bas-reliefs, audio-guided walkthroughs with captions, and true historical research.
          </p>

          <div className="pt-4 flex flex-wrap justify-center gap-3">
            <button
              id="hero-start-tour-btn"
              onClick={() => handleSelectChapter(ANGKOR_CHAPTERS[0].id)}
              className="px-6 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-2xl transition-all shadow-xl shadow-amber-500/20 flex items-center gap-2"
            >
              <BookOpen className="w-4 h-4" />
              <span>Begin Historical Journey</span>
            </button>

            <button
              id="hero-open-scholar-btn"
              onClick={() => setIsScholarOpen(true)}
              className="px-6 py-3.5 bg-neutral-900/80 hover:bg-neutral-800 text-amber-200 border border-amber-900/50 font-semibold text-xs rounded-2xl transition-all backdrop-blur-md flex items-center gap-2"
            >
              <Compass className="w-4 h-4 text-amber-400" />
              <span>Ask AI Royal Scholar</span>
            </button>
          </div>

          <div className="pt-8 animate-bounce text-amber-400/60 flex flex-col items-center gap-1 text-xs font-mono">
            <span>Scroll down for Parallax History</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
      </section>

      {/* Main Interactive Sanctuary Stage (Sticky Header) */}
      <section className="sticky top-16 z-20 w-full h-[50vh] md:h-[58vh] border-y border-amber-900/40 shadow-2xl bg-neutral-900">
        <InteractiveSanctuaryShowcase
          currentChapter={currentChapter}
          activeHotspotId={activeHotspotId}
          onSelectHotspot={handleSelectHotspot}
          timeOfDay={timeOfDay}
          onChangeTimeOfDay={setTimeOfDay}
        />
      </section>

      {/* Parallax Historical Chapters Content */}
      <main className="relative z-30 bg-neutral-950/95 backdrop-blur-xl border-t border-amber-900/40 pt-12 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Chapter 1 through 6 */}
          {ANGKOR_CHAPTERS.map((chapter, index) => (
            <React.Fragment key={chapter.id}>
              <StorytellingSection
                chapter={chapter}
                isActive={activeChapterIndex === index}
                onSelectHotspot={handleSelectHotspot}
                activeHotspotId={activeHotspotId}
              />

              {/* Insert High-Fidelity Bas-Relief Inspector after Chapter 4 */}
              {chapter.id === 'chapter-4' && chapter.basReliefs && (
                <BasReliefViewer basReliefs={chapter.basReliefs} />
              )}
            </React.Fragment>
          ))}

          {/* Historical Knowledge Challenge Quiz */}
          <HistoricalQuiz questions={ANGKOR_QUIZ} />

        </div>
      </main>

      {/* Synchronized Audio Guide Walkthrough Floating Controls */}
      <AudioGuide
        currentChapter={currentChapter}
      />

      {/* AI Scholar Assistant Modal */}
      <AIHistorianModal
        isOpen={isScholarOpen}
        onClose={() => setIsScholarOpen(false)}
      />

      {/* Footer */}
      <footer className="bg-neutral-950 border-t border-amber-900/40 py-12 px-4 text-center text-xs text-amber-300/60 font-serif space-y-4">
        <div className="flex justify-center items-center gap-2 text-amber-400 font-bold">
          <Globe className="w-4 h-4" />
          <span>Angkor Wat: The Sacred Stone Sanctuary</span>
        </div>
        <p className="max-w-xl mx-auto text-neutral-400 leading-relaxed font-sans">
          Historical research cited from post-Khmer inscriptions, the French School of the Far East (EFEO), UNESCO World Heritage Centre, and Dr. Damian Evans' airborne LiDAR archaeology consortium.
        </p>
        <p className="text-[10px] text-neutral-600 uppercase tracking-widest font-mono">
          © 12th Century Khmer Heritage • Built for Interactive Historical Learning
        </p>
      </footer>

    </div>
  );
}
