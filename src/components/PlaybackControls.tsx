import React from 'react';
import { Play, Pause, SkipBack, SkipForward, RotateCcw, FastForward, Gauge } from 'lucide-react';

interface PlaybackControlsProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepForward: () => void;
  onStepBack: () => void;
  onReset: () => void;
  onJumpToEnd: () => void;
  currentStepIndex: number;
  totalSteps: number;
  onScrub: (stepIndex: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
}

export const PlaybackControls: React.FC<PlaybackControlsProps> = ({
  isPlaying,
  onTogglePlay,
  onStepForward,
  onStepBack,
  onReset,
  onJumpToEnd,
  currentStepIndex,
  totalSteps,
  onScrub,
  speed,
  onSpeedChange,
}) => {
  const speedOptions = [0.25, 0.5, 1, 2, 4];
  const progressPercent = totalSteps > 1 ? Math.round((currentStepIndex / (totalSteps - 1)) * 100) : 0;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm flex flex-col gap-3">
      {/* Top row: Scrubber and Step Counter */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-slate-300 shrink-0">
          <span className="text-cyan-400 font-semibold">Step {currentStepIndex + 1}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{totalSteps}</span>
          <span className="text-[11px] text-slate-500 font-sans">({progressPercent}%)</span>
        </div>

        {/* Scrubber slider */}
        <div className="flex-1 w-full flex items-center gap-2">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStepIndex}
            onChange={(e) => onScrub(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400 focus:outline-none"
          />
        </div>
      </div>

      {/* Bottom row: Control buttons and speed switcher */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-slate-800/80">
        {/* Main Transport Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            onClick={onReset}
            disabled={currentStepIndex === 0}
            title="Reset to beginning"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={onStepBack}
            disabled={currentStepIndex === 0}
            title="Step Backward (Previous C++ line)"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 rounded-lg transition-colors shadow-sm"
          >
            <SkipBack className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Prev Step</span>
          </button>

          <button
            onClick={onTogglePlay}
            className={`flex items-center gap-2 px-4 py-1.5 text-xs font-semibold rounded-lg transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-cyan-500/20'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>Play Animation</span>
              </>
            )}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Step Forward (Next C++ line)"
            className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-750 border border-slate-700 disabled:opacity-40 disabled:hover:bg-slate-800/80 rounded-lg transition-colors shadow-sm"
          >
            <span className="hidden sm:inline">Next Step</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={onJumpToEnd}
            disabled={currentStepIndex >= totalSteps - 1}
            title="Fast forward to completed sort"
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-transparent rounded-lg transition-colors"
          >
            <FastForward className="w-4 h-4" />
          </button>
        </div>

        {/* Speed Selector Segmented Control */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Gauge className="w-3.5 h-3.5 text-slate-400" />
            <span className="hidden md:inline font-mono">Speed:</span>
          </div>
          <div className="flex items-center p-0.5 bg-slate-950 rounded-lg border border-slate-800">
            {speedOptions.map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-1 text-[11px] font-mono font-medium rounded-md transition-colors ${
                  speed === s
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
