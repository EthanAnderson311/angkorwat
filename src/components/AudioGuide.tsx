import React, { useState, useEffect } from 'react';
import { audioEngine } from '../utils/audioSynthesizer';
import { StoryChapter } from '../data/angkorHistoryData';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Music, FastForward, Settings, Mic, Captions } from 'lucide-react';

interface AudioGuideProps {
  currentChapter: StoryChapter;
  onNextChapter?: () => void;
  onPrevChapter?: () => void;
}

export const AudioGuide: React.FC<AudioGuideProps> = ({
  currentChapter,
  onNextChapter,
  onPrevChapter,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isAmbientOn, setIsAmbientOn] = useState(true);
  const [ambientVolume, setAmbientVolume] = useState(0.35);
  const [playbackRate, setPlaybackRate] = useState(0.95);
  const [highlightCharIndex, setHighlightCharIndex] = useState(0);
  const [showCaptionBar, setShowCaptionBar] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceName, setSelectedVoiceName] = useState<string>('');

  // Initialize Voices & Ambient Audio
  useEffect(() => {
    const updateVoices = () => {
      const availableVoices = audioEngine.getVoices();
      setVoices(availableVoices);
    };

    updateVoices();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    // Connect Audio Engine Progress Callbacks
    audioEngine.onSpeechProgress = (charIndex) => {
      setHighlightCharIndex(charIndex);
    };

    audioEngine.onSpeechEnd = () => {
      setIsPlaying(false);
      setHighlightCharIndex(0);
    };

    return () => {
      audioEngine.stopSpeech();
    };
  }, []);

  // Chapter change effect: auto reset or start if playing
  useEffect(() => {
    if (isPlaying) {
      handlePlayNarration();
    } else {
      setHighlightCharIndex(0);
    }
  }, [currentChapter]);

  // Handle Ambient Sound Toggle
  const handleToggleAmbient = () => {
    const nextState = !isAmbientOn;
    setIsAmbientOn(nextState);
    audioEngine.toggleAmbientSound(nextState, ambientVolume);
  };

  const handleAmbientVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setAmbientVolume(vol);
    audioEngine.setAmbientVolume(vol);
  };

  // Handle Speech Narration
  const handlePlayNarration = () => {
    setIsPlaying(true);
    audioEngine.speakNarration(currentChapter.audioNarrative, {
      rate: playbackRate,
    });
    if (isAmbientOn) {
      audioEngine.toggleAmbientSound(true, ambientVolume);
    }
  };

  const handlePauseNarration = () => {
    setIsPlaying(false);
    audioEngine.pauseSpeech();
  };

  const handleReplay = () => {
    setHighlightCharIndex(0);
    handlePlayNarration();
  };

  const handleVoiceSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const name = e.target.value;
    setSelectedVoiceName(name);
    const voice = voices.find(v => v.name === name);
    if (voice) {
      audioEngine.setVoice(voice);
    }
  };

  // Helper to format synchronized captions
  const formatCaptions = (text: string, charIdx: number) => {
    if (!text) return '';
    const before = text.substring(0, charIdx);
    const wordsBefore = before.split(' ');
    const currentWord = wordsBefore[wordsBefore.length - 1] || '';
    const startIdx = Math.max(0, charIdx - currentWord.length);
    const highlighted = text.substring(startIdx, startIdx + Math.max(currentWord.length, 6));
    const after = text.substring(startIdx + Math.max(currentWord.length, 6));

    return (
      <span>
        <span className="text-amber-100/70">{text.substring(0, startIdx)}</span>
        <span className="text-amber-400 font-bold bg-amber-500/20 px-1 rounded underline decoration-amber-400/60 decoration-2">{highlighted}</span>
        <span className="text-amber-100/70">{after}</span>
      </span>
    );
  };

  return (
    <>
      {/* Floating Synchronized Subtitle / Caption Bar */}
      {showCaptionBar && (
        <div className="fixed bottom-20 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-2xl z-40 bg-neutral-950/90 backdrop-blur-xl border border-amber-500/30 p-4 rounded-2xl shadow-2xl shadow-amber-950/50 animate-fade-in">
          <div className="flex items-start justify-between gap-3 mb-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-widest">
              <Captions className="w-4 h-4 text-amber-400" />
              <span>Audio Guide Walkthrough • Chapter {currentChapter.number}</span>
            </div>
            <button
              id="hide-captions-btn"
              onClick={() => setShowCaptionBar(false)}
              className="text-neutral-400 hover:text-amber-300 text-xs px-2 py-0.5 rounded bg-neutral-800"
            >
              Hide Captions
            </button>
          </div>
          <p className="text-sm md:text-base font-serif leading-relaxed text-amber-100 min-h-[48px] flex items-center">
            {formatCaptions(currentChapter.audioNarrative, highlightCharIndex)}
          </p>
        </div>
      )}

      {/* Main Audio Controller Dock (Bottom Right / Center) */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
        {/* Settings Popover */}
        {showSettings && (
          <div className="bg-neutral-900/95 backdrop-blur-xl border border-amber-900/60 p-4 rounded-2xl shadow-2xl w-72 text-amber-100 text-xs mb-2 animate-scale-up">
            <h4 className="font-serif font-bold text-amber-400 text-sm mb-3 flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Audio Tour Settings
            </h4>

            {/* Voice Selection */}
            {voices.length > 0 && (
              <div className="mb-3">
                <label className="block text-neutral-400 mb-1 flex items-center gap-1">
                  <Mic className="w-3.5 h-3.5 text-amber-400" /> Narrator Voice
                </label>
                <select
                  value={selectedVoiceName}
                  onChange={handleVoiceSelect}
                  className="w-full bg-neutral-800 border border-amber-900/40 rounded-lg p-2 text-amber-200 text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">Default AI Narrator</option>
                  {voices.map(v => (
                    <option key={v.name} value={v.name}>
                      {v.name} ({v.lang})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Ambient Sound Volume */}
            <div className="mb-3">
              <div className="flex justify-between text-neutral-400 mb-1">
                <span className="flex items-center gap-1"><Music className="w-3.5 h-3.5 text-amber-400" /> Temple Atmosphere</span>
                <span>{Math.round(ambientVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={ambientVolume}
                onChange={handleAmbientVolumeChange}
                className="w-full accent-amber-500 bg-neutral-800 rounded h-1.5 cursor-pointer"
              />
            </div>

            {/* Speech Rate */}
            <div>
              <label className="block text-neutral-400 mb-1 flex items-center gap-1">
                <FastForward className="w-3.5 h-3.5 text-amber-400" /> Narration Speed
              </label>
              <div className="flex gap-1">
                {[0.8, 0.95, 1.2].map(rate => (
                  <button
                    key={rate}
                    onClick={() => setPlaybackRate(rate)}
                    className={`flex-1 py-1 rounded text-xs transition-all ${
                      playbackRate === rate
                        ? 'bg-amber-500 text-neutral-950 font-bold'
                        : 'bg-neutral-800 text-amber-300 hover:bg-neutral-700'
                    }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Audio Floating Bar */}
        <div className="flex items-center gap-2 bg-neutral-950/90 backdrop-blur-xl border border-amber-500/40 p-2 pl-3 rounded-full shadow-2xl shadow-amber-950/80">
          {/* Ambient Music Toggle */}
          <button
            id="ambient-sound-toggle-btn"
            onClick={handleToggleAmbient}
            className={`p-2 rounded-full transition-all ${
              isAmbientOn
                ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                : 'text-neutral-500 hover:text-amber-300'
            }`}
            title="Toggle Temple Music Atmosphere"
          >
            <Music className={`w-4 h-4 ${isAmbientOn ? 'animate-pulse' : ''}`} />
          </button>

          {/* Play / Pause Main Narration */}
          {isPlaying ? (
            <button
              id="pause-narration-btn"
              onClick={handlePauseNarration}
              className="p-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-full shadow-lg font-bold transition-all transform active:scale-95"
              title="Pause Audio Walkthrough"
            >
              <Pause className="w-5 h-5 fill-current" />
            </button>
          ) : (
            <button
              id="play-narration-btn"
              onClick={handlePlayNarration}
              className="p-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 rounded-full shadow-lg font-bold transition-all transform active:scale-95 flex items-center gap-1"
              title="Play Audio Guided Walkthrough"
            >
              <Play className="w-5 h-5 fill-current ml-0.5" />
            </button>
          )}

          {/* Replay */}
          <button
            id="replay-narration-btn"
            onClick={handleReplay}
            className="p-2 text-neutral-400 hover:text-amber-300 transition-all"
            title="Replay Chapter Narration"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Toggle Captions Visibility */}
          <button
            id="toggle-captions-bar-btn"
            onClick={() => setShowCaptionBar(!showCaptionBar)}
            className={`p-2 rounded-full transition-all ${
              showCaptionBar ? 'text-amber-400' : 'text-neutral-500 hover:text-amber-300'
            }`}
            title="Toggle Captions Subtitles"
          >
            <Captions className="w-4 h-4" />
          </button>

          {/* Settings Button */}
          <button
            id="audio-settings-btn"
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-full transition-all ${
              showSettings ? 'text-amber-400 bg-neutral-800' : 'text-neutral-400 hover:text-amber-300'
            }`}
            title="Audio Tour Settings"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </>
  );
};
