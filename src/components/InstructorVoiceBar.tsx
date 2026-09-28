import React, { useState, useEffect } from 'react';
import { instructorVoice } from '../services/instructorVoice';
import { Volume2, VolumeX, Mic, Play, Pause, Settings2, Sparkles, GraduationCap, FastForward } from 'lucide-react';

interface InstructorVoiceBarProps {
  currentTitle: string;
  currentExplanation: string;
  currentAction: string;
  onAutoAdvanceStep?: () => void;
  isLectureMode: boolean;
  onToggleLectureMode: () => void;
}

export const InstructorVoiceBar: React.FC<InstructorVoiceBarProps> = ({
  currentTitle,
  currentExplanation,
  currentAction,
  onAutoAdvanceStep,
  isLectureMode,
  onToggleLectureMode,
}) => {
  const [isEnabled, setIsEnabled] = useState(instructorVoice.isVoiceEnabled());
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [spokenTranscript, setSpokenTranscript] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [selectedVoiceURI, setSelectedVoiceURI] = useState(instructorVoice.getSelectedVoiceURI());
  const [rate, setRate] = useState(instructorVoice.getRate());

  useEffect(() => {
    const unsub = instructorVoice.subscribe((speaking, text) => {
      setIsSpeaking(speaking);
      if (speaking) {
        setSpokenTranscript(text);
      }
    });

    const updateVoices = () => {
      const v = instructorVoice.getVoices();
      setVoices(v);
      setSelectedVoiceURI(instructorVoice.getSelectedVoiceURI());
    };

    updateVoices();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }

    return () => {
      unsub();
    };
  }, []);

  const handleToggleVoice = () => {
    const next = !isEnabled;
    instructorVoice.setEnabled(next);
    setIsEnabled(next);
    if (next) {
      handleReplayExplanation();
    } else {
      instructorVoice.stop();
    }
  };

  const handleReplayExplanation = () => {
    instructorVoice.explainStep(
      currentTitle,
      currentExplanation,
      currentAction,
      isLectureMode ? onAutoAdvanceStep : undefined
    );
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const uri = e.target.value;
    instructorVoice.setVoice(uri);
    setSelectedVoiceURI(uri);
    instructorVoice.explainStep(
      'Voice updated',
      'This voice will now guide you through the C++ sorting operations.'
    );
  };

  const handleRateChange = (val: number) => {
    instructorVoice.setRate(val);
    setRate(val);
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3.5 shadow-lg backdrop-blur-md">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Left: Instructor Identity & Speaking indicator */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
              isSpeaking
                ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                : 'bg-slate-800 border-slate-700 text-slate-400'
            }`}>
              <GraduationCap className="w-5 h-5" />
            </div>
            {isSpeaking && (
              <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
              </span>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
                C++ Algorithm Instructor
              </span>
              {isSpeaking ? (
                <div className="flex items-center gap-0.5 ml-1">
                  <span className="w-1 h-3 bg-cyan-400 rounded-full animate-pulse"></span>
                  <span className="w-1 h-4 bg-cyan-300 rounded-full animate-pulse delay-75"></span>
                  <span className="w-1 h-2 bg-cyan-400 rounded-full animate-pulse delay-150"></span>
                  <span className="text-[10px] text-cyan-300 font-mono ml-1 font-semibold">Speaking...</span>
                </div>
              ) : (
                <span className="text-[10px] text-slate-500 font-mono">
                  {isEnabled ? 'Ready' : 'Muted'}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-400 line-clamp-1 max-w-md">
              {isSpeaking ? spokenTranscript : currentTitle}
            </p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Lecture Mode Auto-Advance Toggle */}
          <button
            onClick={onToggleLectureMode}
            title={
              isLectureMode
                ? 'Lecture Mode active: Automatically advances to next step after instructor finishes speaking'
                : 'Enable Lecture Mode: Auto-step at the instructor\'s speaking pace'
            }
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${
              isLectureMode
                ? 'bg-purple-950/80 text-purple-300 border-purple-700 shadow-sm'
                : 'bg-slate-800/80 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
          >
            <FastForward className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Lecture Auto-Step</span>
            <span className="md:hidden">Auto</span>
          </button>

          {/* Replay speech button */}
          <button
            onClick={handleReplayExplanation}
            title="Replay Instructor Voice Explanation for this step"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-800 rounded-lg transition-colors shadow-sm"
          >
            <Volume2 className="w-3.5 h-3.5" />
            <span>Replay Voice</span>
          </button>

          {/* Voice on/off toggle */}
          <button
            onClick={handleToggleVoice}
            title={isEnabled ? 'Mute Instructor Voice' : 'Enable Instructor Voice'}
            className={`p-2 rounded-lg border transition-colors ${
              isEnabled
                ? 'bg-slate-800 border-slate-700 text-cyan-300 hover:bg-slate-750'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
            }`}
          >
            {isEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Settings modal toggle */}
          <button
            onClick={() => setShowSettings(!showSettings)}
            title="Instructor Voice Settings"
            className={`p-2 rounded-lg border transition-colors ${
              showSettings
                ? 'bg-slate-800 border-slate-600 text-white'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
          >
            <Settings2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Voice Settings Expandable Drawer */}
      {showSettings && (
        <div className="mt-3 pt-3 border-t border-slate-800/90 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <label className="block text-slate-400 mb-1 font-mono">
              Instructor Voice:
            </label>
            <select
              value={selectedVoiceURI}
              onChange={handleVoiceChange}
              className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500 text-xs font-mono"
            >
              {voices.map((v) => (
                <option key={v.voiceURI} value={v.voiceURI}>
                  {v.name} ({v.lang})
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex items-center justify-between text-slate-400 mb-1 font-mono">
              <span>Speech Pace:</span>
              <span className="text-cyan-300 font-bold">{rate}x</span>
            </div>
            <div className="flex items-center gap-1.5">
              {[0.8, 1.0, 1.2, 1.4].map((r) => (
                <button
                  key={r}
                  onClick={() => handleRateChange(r)}
                  className={`flex-1 py-1 rounded text-xs font-mono border transition-colors ${
                    rate === r
                      ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {r}x
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
