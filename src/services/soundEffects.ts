/**
 * Web Audio API synthesizer & Sonification service for Sorting Algorithms.
 * Provides authentic "Sound of Sorting" pitch mapping and optional voice narration.
 */

class SoundService {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.35;
  private enableNarration: boolean = false;
  private soundType: 'sine' | 'triangle' | 'chime' = 'triangle';
  private synthUtterance: SpeechSynthesisUtterance | null = null;
  private lastSpokenTime: number = 0;

  constructor() {
    // AudioContext will be instantiated on first user gesture
  }

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public init() {
    this.getAudioContext();
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public getVolume(): number {
    return this.volume;
  }

  public setNarration(enable: boolean) {
    this.enableNarration = enable;
    if (!enable && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  public getNarration(): boolean {
    return this.enableNarration;
  }

  public setSoundType(type: 'sine' | 'triangle' | 'chime') {
    this.soundType = type;
  }

  public getSoundType() {
    return this.soundType;
  }

  /**
   * Convert an array item value into an audible musical frequency.
   * Maps values typically from 1 to 100 into a friendly frequency range (180 Hz to 900 Hz).
   */
  private valueToFrequency(value: number, minVal = 0, maxVal = 100): number {
    const clamped = Math.max(minVal, Math.min(maxVal, value));
    const normalized = (clamped - minVal) / Math.max(1, maxVal - minVal);
    // Exponential pitch mapping gives natural musical perception
    const baseFreq = 180;
    const topFreq = 880;
    return baseFreq * Math.pow(topFreq / baseFreq, normalized);
  }

  /**
   * Play a clean tone with ADSR envelope
   */
  public playTone(freq: number, durationMs = 80, gainMultiplier = 1) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = this.soundType === 'chime' ? 'sine' : this.soundType;
      osc.frequency.setValueAtTime(freq, now);

      // If chime mode, add a subtle overtone
      if (this.soundType === 'chime') {
        const overtone = ctx.createOscillator();
        const overGain = ctx.createGain();
        overtone.type = 'sine';
        overtone.frequency.setValueAtTime(freq * 2, now);
        overGain.gain.setValueAtTime(this.volume * 0.15 * gainMultiplier, now);
        overGain.gain.exponentialRampToValueAtTime(0.0001, now + (durationMs * 1.5) / 1000);
        overtone.connect(overGain);
        overGain.connect(ctx.destination);
        overtone.start(now);
        overtone.stop(now + (durationMs * 1.5) / 1000);
      }

      const peakGain = this.volume * 0.4 * gainMultiplier;
      gain.gain.setValueAtTime(0.0001, now);
      // Quick attack
      gain.gain.exponentialRampToValueAtTime(peakGain, now + 0.008);
      // Smooth decay
      gain.gain.exponentialRampToValueAtTime(0.0001, now + durationMs / 1000);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + durationMs / 1000);
    } catch {
      // Ignore transient audio error
    }
  }

  /**
   * Play comparison chord/dual tone
   */
  public playCompare(val1: number, val2?: number, maxVal = 100) {
    const f1 = this.valueToFrequency(val1, 0, maxVal);
    this.playTone(f1, 65, 0.7);
    if (val2 !== undefined) {
      const f2 = this.valueToFrequency(val2, 0, maxVal);
      setTimeout(() => this.playTone(f2, 65, 0.7), 20);
    }
  }

  /**
   * Play swap tone (pitch glide or double tone)
   */
  public playSwap(val1: number, val2: number, maxVal = 100) {
    if (this.isMuted) return;
    const ctx = this.getAudioContext();
    if (!ctx) return;

    try {
      const f1 = this.valueToFrequency(val1, 0, maxVal);
      const f2 = this.valueToFrequency(val2, 0, maxVal);
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(f1, now);
      osc.frequency.exponentialRampToValueAtTime(f2, now + 0.08);

      const peak = this.volume * 0.3;
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.linearRampToValueAtTime(peak, now + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch {
      // Fallback
      this.playTone(this.valueToFrequency(val1, 0, maxVal), 70);
    }
  }

  /**
   * Play element locked into sorted position chime
   */
  public playSorted(val: number, maxVal = 100) {
    const freq = this.valueToFrequency(val, 0, maxVal);
    this.playTone(freq, 120, 0.9);
  }

  /**
   * Play victory arpeggio sweep across sorted array
   */
  public playCompletionSweep(array: number[]) {
    if (this.isMuted || array.length === 0) return;
    const maxVal = Math.max(...array, 100);
    const delayStep = Math.min(60, Math.max(25, 400 / array.length));

    array.forEach((val, idx) => {
      setTimeout(() => {
        const freq = this.valueToFrequency(val, 0, maxVal);
        this.playTone(freq, 110, 0.85);
      }, idx * delayStep);
    });
  }

  /**
   * Speak voice narration for the current step (throttled to avoid stutter)
   */
  public speak(text: string) {
    if (!this.enableNarration || this.isMuted) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const now = Date.now();
    // Throttle narration so speech doesn't overlap excessively
    if (now - this.lastSpokenTime < 900) return;
    this.lastSpokenTime = now;

    try {
      window.speechSynthesis.cancel();
      // Keep utterance short and sweet
      const cleanText = text.replace(/arr\[\d+\]/g, 'array element').slice(0, 90);
      const utterance = new SpeechSynthesisUtterance(cleanText);
      utterance.rate = 1.2;
      utterance.pitch = 1.0;
      utterance.volume = Math.min(1, this.volume * 1.5);
      window.speechSynthesis.speak(utterance);
    } catch {
      // SpeechSynthesis may fail silently in some restricted environments
    }
  }
}

export const soundManager = new SoundService();
