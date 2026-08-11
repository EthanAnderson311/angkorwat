// Web Audio API ambient sound generator and Speech Synthesis wrapper

class AngkorAudioEngine {
  private audioCtx: AudioContext | null = null;
  private isAmbientPlaying = false;
  private ambientGain: GainNode | null = null;
  private ambientOscillators: OscillatorNode[] = [];
  private ambientTimer: number | null = null;

  // Web Speech API properties
  private synth: SpeechSynthesis | null = typeof window !== 'undefined' && 'speechSynthesis' in window ? window.speechSynthesis : null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  
  public onSpeechProgress: ((wordIndex: number, currentText: string) => void) | null = null;
  public onSpeechEnd: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      window.addEventListener('click', () => this.initAudioContext(), { once: true });
    }
  }

  private initAudioContext() {
    if (!this.audioCtx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.audioCtx = new AudioCtxClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (!this.synth) return [];
    return this.synth.getVoices();
  }

  public setVoice(voice: SpeechSynthesisVoice) {
    this.selectedVoice = voice;
  }

  // --- AMBIENT SOUND GENERATOR (Roneat Bamboo & Chimes) ---
  public toggleAmbientSound(enable: boolean, volume = 0.3) {
    this.initAudioContext();
    if (!this.audioCtx) return;

    if (enable && !this.isAmbientPlaying) {
      this.isAmbientPlaying = true;
      this.ambientGain = this.audioCtx.createGain();
      this.ambientGain.gain.setValueAtTime(volume, this.audioCtx.currentTime);
      this.ambientGain.connect(this.audioCtx.destination);

      // Pentatonic Khmer scale notes (D, E, F#, A, B, d)
      const pentatonicFreqs = [293.66, 329.63, 369.99, 440.00, 493.88, 587.33, 659.25, 739.99];

      // Play soft periodic bamboo xylophone notes
      const playRandomTone = () => {
        if (!this.isAmbientPlaying || !this.audioCtx || !this.ambientGain) return;

        const freq = pentatonicFreqs[Math.floor(Math.random() * pentatonicFreqs.length)];
        const osc = this.audioCtx.createOscillator();
        const noteGain = this.audioCtx.createGain();

        osc.type = 'triangle'; // Warm organic bamboo timbre
        osc.frequency.setValueAtTime(freq, this.audioCtx.currentTime);

        noteGain.gain.setValueAtTime(0.001, this.audioCtx.currentTime);
        noteGain.gain.exponentialRampToValueAtTime(0.12, this.audioCtx.currentTime + 0.05);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 2.2);

        osc.connect(noteGain);
        noteGain.connect(this.ambientGain);

        osc.start();
        osc.stop(this.audioCtx.currentTime + 2.3);

        const nextInterval = 800 + Math.random() * 2400;
        this.ambientTimer = window.setTimeout(playRandomTone, nextInterval);
      };

      playRandomTone();
    } else if (!enable && this.isAmbientPlaying) {
      this.isAmbientPlaying = false;
      if (this.ambientTimer) {
        clearTimeout(this.ambientTimer);
        this.ambientTimer = null;
      }
      if (this.ambientGain && this.audioCtx) {
        this.ambientGain.gain.exponentialRampToValueAtTime(0.0001, this.audioCtx.currentTime + 0.5);
        setTimeout(() => {
          this.ambientGain?.disconnect();
          this.ambientGain = null;
        }, 500);
      }
    }
  }

  public setAmbientVolume(volume: number) {
    if (this.ambientGain && this.audioCtx) {
      this.ambientGain.gain.setValueAtTime(Math.max(0.001, volume), this.audioCtx.currentTime);
    }
  }

  // --- NARRATION & SPEECH SYNTHESIS ---
  public speakNarration(
    text: string, 
    options?: { rate?: number; pitch?: number; volume?: number }
  ) {
    this.stopSpeech();

    if (!this.synth) {
      // Fallback timer simulation for progress
      this.simulateSpeechProgress(text);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = options?.rate || 0.95;
    utterance.pitch = options?.pitch || 1.0;
    utterance.volume = options?.volume || 1.0;

    const voices = this.getVoices();
    if (this.selectedVoice) {
      utterance.voice = this.selectedVoice;
    } else {
      // Find an elegant English voice (prefer Google, Natural, or UK/US clear voice)
      const preferred = voices.find(v => v.name.includes('Natural') || v.name.includes('Google') || v.lang.startsWith('en'));
      if (preferred) utterance.voice = preferred;
    }

    utterance.onboundary = (event) => {
      if (event.name === 'word') {
        const charIndex = event.charIndex;
        if (this.onSpeechProgress) {
          this.onSpeechProgress(charIndex, text);
        }
      }
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };

    utterance.onerror = () => {
      this.currentUtterance = null;
      if (this.onSpeechEnd) this.onSpeechEnd();
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  private simulateSpeechProgress(text: string) {
    const words = text.split(' ');
    let currentWord = 0;
    const interval = setInterval(() => {
      currentWord++;
      if (currentWord >= words.length) {
        clearInterval(interval);
        if (this.onSpeechEnd) this.onSpeechEnd();
      } else {
        if (this.onSpeechProgress) {
          const charIndex = words.slice(0, currentWord).join(' ').length;
          this.onSpeechProgress(charIndex, text);
        }
      }
    }, 350);
  }

  public pauseSpeech() {
    if (this.synth && this.synth.speaking) {
      this.synth.pause();
    }
  }

  public resumeSpeech() {
    if (this.synth && this.synth.paused) {
      this.synth.resume();
    }
  }

  public stopSpeech() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.currentUtterance = null;
  }
}

export const audioEngine = new AngkorAudioEngine();
