/**
 * Instructor Voice Service for Algorithm Explanation.
 * Uses Web Speech API with pedagogical phrasing, speech queues,
 * voice selection, and auto-progression hooks.
 */

export interface InstructorVoiceSettings {
  enabled: boolean;
  autoAdvance: boolean; // Auto advance to next step when instructor finishes explaining
  rate: number; // 0.8 to 1.4
  pitch: number; // 0.8 to 1.2
  voiceURI: string;
}

class InstructorVoiceService {
  private enabled: boolean = true;
  private autoAdvance: boolean = false;
  private rate: number = 1.0;
  private pitch: number = 1.0;
  private selectedVoice: SpeechSynthesisVoice | null = null;
  private availableVoices: SpeechSynthesisVoice[] = [];
  private isSpeaking: boolean = false;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private listeners: Set<(speaking: boolean, text: string) => void> = new Set();
  private currentText: string = '';
  private onEndCallback: (() => void) | null = null;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
      window.speechSynthesis.onvoiceschanged = () => this.loadVoices();
    }
  }

  private loadVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    const voices = window.speechSynthesis.getVoices();
    // Prioritize English voices for clean instructor delivery
    this.availableVoices = voices.filter((v) => v.lang.startsWith('en'));
    if (this.availableVoices.length === 0) {
      this.availableVoices = voices;
    }

    // Try to pick a natural-sounding default English voice if available
    const preferred = this.availableVoices.find(
      (v) =>
        v.name.includes('Natural') ||
        v.name.includes('Google') ||
        v.name.includes('Samantha') ||
        v.name.includes('Daniel') ||
        v.name.includes('Karen')
    );
    this.selectedVoice = preferred || this.availableVoices[0] || null;
  }

  public getVoices(): SpeechSynthesisVoice[] {
    if (this.availableVoices.length === 0 && typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.loadVoices();
    }
    return this.availableVoices;
  }

  public setVoice(voiceURI: string) {
    const v = this.availableVoices.find((voice) => voice.voiceURI === voiceURI);
    if (v) this.selectedVoice = v;
  }

  public getSelectedVoiceURI(): string {
    return this.selectedVoice?.voiceURI || '';
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (!val) {
      this.stop();
    }
  }

  public isVoiceEnabled(): boolean {
    return this.enabled;
  }

  public setAutoAdvance(val: boolean) {
    this.autoAdvance = val;
  }

  public isAutoAdvance(): boolean {
    return this.autoAdvance;
  }

  public setRate(val: number) {
    this.rate = Math.max(0.6, Math.min(1.6, val));
  }

  public getRate(): number {
    return this.rate;
  }

  public setPitch(val: number) {
    this.pitch = Math.max(0.7, Math.min(1.3, val));
  }

  public getPitch(): number {
    return this.pitch;
  }

  public subscribe(listener: (speaking: boolean, text: string) => void) {
    this.listeners.add(listener);
    listener(this.isSpeaking, this.currentText);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(speaking: boolean, text: string) {
    this.isSpeaking = speaking;
    this.currentText = text;
    this.listeners.forEach((l) => l(speaking, text));
  }

  public stop() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    this.onEndCallback = null;
    this.notify(false, '');
  }

  /**
   * Translates code identifiers and math notation into smooth, natural spoken English
   */
  public formatForSpeech(rawText: string, action?: string): string {
    let clean = rawText
      // Translate code syntax and 3-step swaps
      .replace(/Swap:\s*temp\s*=\s*arr\[(\d+)\];\s*arr\[\1\]\s*=\s*arr\[(\d+)\];\s*arr\[\2\]\s*=\s*temp;/gi, 'Swapping array element at index $1 with element at index $2 using a temporary variable.')
      .replace(/std::swap\(arr\[(\d+)\],\s*arr\[(\d+)\]\)/g, 'swapping array element at index $1 with element at index $2')
      .replace(/int\s+arr\[\],\s*int\s+n/g, 'array arr and size n')
      .replace(/int\s+arr\[\]/g, 'array arr')
      .replace(/arr\[(\w+)\]/g, 'array element at index $1')
      .replace(/arr\[(\w+)\s*\+\s*1\]/g, 'the next array element')
      .replace(/min_idx\s*=\s*(\w+)/g, 'minimum index updated to $1')
      .replace(/key\s*=\s*(\d+)/g, 'key value $1')
      .replace(/O\(N\s*\*\s*log\s*N\)/gi, 'O of N log N')
      .replace(/O\(N\^2\)/gi, 'O of N squared')
      .replace(/O\(N\)/gi, 'O of N')
      .replace(/O\(1\)/gi, 'O of 1 space')
      .replace(/<=/g, 'is less than or equal to')
      .replace(/>=/g, 'is greater than or equal to')
      .replace(/>/g, 'is greater than')
      .replace(/</g, 'is less than')
      .replace(/!=/g, 'does not equal')
      .replace(/==/g, 'equals')
      .replace(/\+\+/g, 'incremented')
      .replace(/--/g, 'decremented')
      .replace(/pi\s*=/g, 'partition index equals');

    // Add instructor conversational touch
    if (action === 'compare') {
      clean = 'Checking condition: ' + clean;
    } else if (action === 'swap') {
      clean = 'In C++, we swap these elements: ' + clean;
    } else if (action === 'partition') {
      clean = 'Partition complete: ' + clean;
    } else if (action === 'done') {
      clean = 'Congratulations! ' + clean;
    }

    return clean;
  }

  /**
   * Speak the pedagogical instructor explanation
   */
  public explainStep(
    title: string,
    explanation: string,
    action?: string,
    onSpeechEnd?: () => void
  ) {
    if (!this.enabled) {
      if (onSpeechEnd) onSpeechEnd();
      return;
    }
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      if (onSpeechEnd) onSpeechEnd();
      return;
    }

    // Cancel any previous speech
    window.speechSynthesis.cancel();

    // Construct clear instructor script
    const spokenTitle = this.formatForSpeech(title, action);
    const spokenExplanation = this.formatForSpeech(explanation);
    const fullScript = `${spokenTitle}. ${spokenExplanation}`;

    this.currentUtterance = new SpeechSynthesisUtterance(fullScript);
    if (this.selectedVoice) {
      this.currentUtterance.voice = this.selectedVoice;
    }
    this.currentUtterance.rate = this.rate;
    this.currentUtterance.pitch = this.pitch;

    this.onEndCallback = onSpeechEnd || null;

    this.currentUtterance.onstart = () => {
      this.notify(true, fullScript);
    };

    this.currentUtterance.onend = () => {
      this.notify(false, '');
      if (this.onEndCallback) {
        const cb = this.onEndCallback;
        this.onEndCallback = null;
        cb();
      }
    };

    this.currentUtterance.onerror = () => {
      this.notify(false, '');
      if (this.onEndCallback) {
        const cb = this.onEndCallback;
        this.onEndCallback = null;
        cb();
      }
    };

    window.speechSynthesis.speak(this.currentUtterance);
  }
}

export const instructorVoice = new InstructorVoiceService();
