import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Music, Volume1, Sparkles } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface AudioControlsProps {
  onAudioTriggered?: () => void;
}

export const AudioControls: React.FC<AudioControlsProps> = ({ onAudioTriggered }) => {
  const [isMuted, setIsMuted] = useState(soundManager.getMuted());
  const [volume, setVolume] = useState(soundManager.getVolume());
  const [narration, setNarration] = useState(soundManager.getNarration());
  const [toneType, setToneType] = useState(soundManager.getSoundType());
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    soundManager.setMuted(nextMuted);
    setIsMuted(nextMuted);
    if (!nextMuted) {
      soundManager.init();
      soundManager.playTone(440, 90);
    }
    if (onAudioTriggered) onAudioTriggered();
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    soundManager.setVolume(val);
    setVolume(val);
    if (isMuted && val > 0) {
      soundManager.setMuted(false);
      setIsMuted(false);
    }
  };

  const handleToggleNarration = () => {
    soundManager.init();
    const next = !narration;
    soundManager.setNarration(next);
    setNarration(next);
    if (next) {
      soundManager.speak('Voice narration enabled.');
    }
  };

  const handleToneTypeChange = (type: 'sine' | 'triangle' | 'chime') => {
    soundManager.setSoundType(type);
    setToneType(type);
    soundManager.init();
    soundManager.playTone(523.25, 120); // C5
  };

  const handleTestAudio = () => {
    soundManager.init();
    if (isMuted) {
      soundManager.setMuted(false);
      setIsMuted(false);
    }
    soundManager.playCompletionSweep([20, 35, 50, 65, 80, 95]);
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5 p-1 bg-slate-900/90 border border-slate-800 rounded-lg">
        {/* Main Mute / Unmute Button */}
        <button
          onClick={handleToggleMute}
          title={isMuted ? 'Unmute Audio Sonification' : 'Mute Audio'}
          className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
            !isMuted
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-800/80 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          {isMuted ? (
            <>
              <VolumeX className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Audio Off</span>
            </>
          ) : (
            <>
              <Volume2 className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span className="hidden sm:inline font-mono">Audio On</span>
            </>
          )}
        </button>

        {/* Voice Narration Quick Toggle */}
        <button
          onClick={handleToggleNarration}
          title={narration ? 'Disable Spoken Step Narration' : 'Enable Spoken Step Narration (Voice)'}
          className={`p-1.5 text-xs rounded-md transition-colors ${
            narration
              ? 'bg-purple-950/80 text-purple-300 border border-purple-800'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          {narration ? (
            <Mic className="w-3.5 h-3.5 text-purple-400" />
          ) : (
            <MicOff className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Expand Audio Settings */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          title="Audio Settings & Waveforms"
          className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-md transition-colors"
        >
          <Music className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Popover Settings Dropdown */}
      {isExpanded && (
        <div className="absolute right-0 top-full mt-2 w-72 p-4 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl z-50 space-y-3.5 backdrop-blur-md">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <span className="text-xs font-bold text-white tracking-tight flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Audio & Sonification Settings
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-xs text-slate-400 hover:text-white"
            >
              Done
            </button>
          </div>

          {/* Volume Slider */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1 font-mono">
              <span className="flex items-center gap-1">
                <Volume1 className="w-3.5 h-3.5" /> Volume
              </span>
              <span>{Math.round(volume * 100)}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1.5 bg-slate-800 rounded appearance-none cursor-pointer accent-cyan-400"
            />
          </div>

          {/* Tone Waveform */}
          <div>
            <span className="block text-xs text-slate-400 mb-1.5 font-mono">
              Synthesizer Timbre:
            </span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['triangle', 'sine', 'chime'] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => handleToneTypeChange(t)}
                  className={`py-1 text-[11px] font-mono capitalize rounded border transition-colors ${
                    toneType === t
                      ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-semibold'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          {/* Spoken Voice Toggle */}
          <div className="flex items-center justify-between pt-1 border-t border-slate-800">
            <div>
              <div className="text-xs font-semibold text-slate-200">
                Spoken Voice Narration
              </div>
              <div className="text-[10px] text-slate-400">
                Speaks C++ algorithm actions out loud
              </div>
            </div>
            <input
              type="checkbox"
              checked={narration}
              onChange={handleToggleNarration}
              className="w-4 h-4 accent-purple-500 cursor-pointer rounded"
            />
          </div>

          {/* Test Sound Button */}
          <button
            onClick={handleTestAudio}
            className="w-full py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700 transition-colors"
          >
            Play Test Arpeggio ♫
          </button>
        </div>
      )}
    </div>
  );
};
