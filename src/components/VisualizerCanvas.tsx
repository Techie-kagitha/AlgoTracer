import React from 'react';
import { SortStep, ElementStatus } from '../types/sorting';
import { ArrowDown, CheckCircle2, RefreshCw, Sparkles, Target, KeyRound, Volume2 } from 'lucide-react';

interface VisualizerCanvasProps {
  currentStep: SortStep;
  algorithmName: string;
  onSpeakExplanation?: () => void;
  isSpeaking?: boolean;
}

export const VisualizerCanvas: React.FC<VisualizerCanvasProps> = ({
  currentStep,
  algorithmName,
  onSpeakExplanation,
  isSpeaking = false,
}) => {
  const { array, statusMap, pointers, title, explanation, auxArray, subRange } = currentStep;
  const maxValue = Math.max(...array, 100);

  // Map status to semantic color & glow
  const getStatusStyles = (status: ElementStatus) => {
    switch (status) {
      case 'comparing':
        return {
          barBg: 'bg-cyan-500 border-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
          textColor: 'text-cyan-300',
          badgeText: 'Comparing',
          badgeBg: 'bg-cyan-950/80 text-cyan-300 border-cyan-800'
        };
      case 'swapping':
        return {
          barBg: 'bg-rose-500 border-rose-300 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
          textColor: 'text-rose-300',
          badgeText: 'Swapping',
          badgeBg: 'bg-rose-950/80 text-rose-300 border-rose-800'
        };
      case 'overwriting':
        return {
          barBg: 'bg-amber-500 border-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
          textColor: 'text-amber-300',
          badgeText: 'Writing',
          badgeBg: 'bg-amber-950/80 text-amber-300 border-amber-800'
        };
      case 'sorted':
        return {
          barBg: 'bg-emerald-500 border-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]',
          textColor: 'text-emerald-300',
          badgeText: 'Sorted',
          badgeBg: 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
        };
      case 'pivot':
        return {
          barBg: 'bg-purple-500 border-purple-300 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
          textColor: 'text-purple-300',
          badgeText: 'Pivot/Min',
          badgeBg: 'bg-purple-950/80 text-purple-300 border-purple-800'
        };
      case 'key':
        return {
          barBg: 'bg-amber-400 border-amber-200 shadow-[0_0_15px_rgba(251,191,36,0.4)]',
          textColor: 'text-amber-200',
          badgeText: 'Key',
          badgeBg: 'bg-amber-950/80 text-amber-200 border-amber-800'
        };
      case 'subrange':
        return {
          barBg: 'bg-slate-600 border-slate-400',
          textColor: 'text-slate-300',
          badgeText: 'Active Subarray',
          badgeBg: 'bg-slate-800 text-slate-300 border-slate-700'
        };
      default:
        return {
          barBg: 'bg-slate-700/80 border-slate-600 hover:bg-slate-600/80',
          textColor: 'text-slate-400',
          badgeText: 'Idle',
          badgeBg: 'bg-slate-900 text-slate-400 border-slate-800'
        };
    }
  };

  // Group pointers by index for rendering beneath bars
  const pointersByIndex: Record<number, string[]> = {};
  Object.entries(pointers).forEach(([name, idx]) => {
    if (idx >= 0 && idx < array.length) {
      if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
      pointersByIndex[idx].push(name);
    }
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-lg backdrop-blur-sm">
      {/* Top visual canvas status strip */}
      <div className="flex flex-wrap items-center justify-between px-5 py-3 border-b border-slate-800/90 bg-slate-950/50 gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            {algorithmName} Stage
          </span>
          {subRange && (
            <span className="text-xs text-cyan-400/90 font-mono bg-cyan-950/50 px-2 py-0.5 rounded border border-cyan-800/50">
              Active Range: [{subRange[0]} ... {subRange[1]}]
            </span>
          )}
        </div>

        {/* Legend with explicit text tags */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-cyan-500"></span>
            <span>Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500"></span>
            <span>Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-purple-500"></span>
            <span>Pivot / Min</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-400"></span>
            <span>Key / Write</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500"></span>
            <span>Sorted</span>
          </div>
        </div>
      </div>

      {/* Main Bar Chart Visualization Canvas */}
      <div className="flex-1 min-h-[260px] p-6 flex flex-col justify-end relative">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b15_1px,transparent_1px),linear-gradient(to_bottom,#1e293b15_1px,transparent_1px)] bg-[size:2rem_2rem] pointer-events-none"></div>

        {/* Range highlight brackets if subrange exists */}
        {subRange && array.length > 0 && (
          <div className="absolute top-4 left-6 right-6 text-xs text-slate-500 flex justify-between pointer-events-none">
            <span>Range Start: index {subRange[0]}</span>
            <span>Range End: index {subRange[1]}</span>
          </div>
        )}

        {/* The Animated Bars Area */}
        <div className="relative z-10 flex items-end justify-center gap-2 sm:gap-3 md:gap-4 h-56 w-full max-w-4xl mx-auto">
          {array.map((value, idx) => {
            const status = statusMap[idx] || 'idle';
            const style = getStatusStyles(status);
            // Minimum height 14%, maximum 96%
            const heightPercent = Math.max(14, Math.round((value / maxValue) * 94));
            const activePointers = pointersByIndex[idx] || [];
            const isInSubRange = !subRange || (idx >= subRange[0] && idx <= subRange[1]);

            return (
              <div
                key={idx}
                className={`flex-1 max-w-[56px] flex flex-col items-center justify-end h-full transition-opacity duration-200 ${
                  isInSubRange ? 'opacity-100' : 'opacity-35'
                }`}
              >
                {/* Value label on top of bar */}
                <div
                  className={`text-xs font-mono font-semibold mb-1.5 tabular-nums transition-colors duration-150 ${style.textColor}`}
                >
                  {value}
                </div>

                {/* The Bar */}
                <div
                  style={{ height: `${heightPercent}%` }}
                  className={`w-full rounded-t-md border-t-2 border-x transition-all duration-200 flex items-start justify-center pt-1.5 ${style.barBg}`}
                >
                  {status === 'pivot' && (
                    <Target className="w-3 h-3 text-white/90 animate-pulse" />
                  )}
                  {status === 'key' && (
                    <KeyRound className="w-3 h-3 text-white/90" />
                  )}
                  {status === 'sorted' && (
                    <CheckCircle2 className="w-3 h-3 text-white/90" />
                  )}
                  {status === 'swapping' && (
                    <RefreshCw className="w-3 h-3 text-white/90 animate-spin" />
                  )}
                </div>

                {/* Index label */}
                <div className="mt-2 text-[11px] font-mono text-slate-400 tabular-nums">
                  [{idx}]
                </div>

                {/* Pointers / Variables pointing to this index */}
                <div className="min-h-[38px] flex flex-col items-center mt-1 gap-0.5">
                  {activePointers.length > 0 && (
                    <>
                      <ArrowDown className="w-3 h-3 text-cyan-400 animate-bounce" />
                      <div className="flex flex-wrap items-center justify-center gap-1 max-w-[80px]">
                        {activePointers.map((pName) => (
                          <span
                            key={pName}
                            className="px-1 py-0.5 text-[10px] font-mono font-bold rounded bg-slate-800 text-cyan-300 border border-cyan-800/80 leading-none shadow-sm"
                          >
                            {pName}
                          </span>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Auxiliary Array Display (Merge Sort temporary vector L and R) */}
        {auxArray && auxArray.length > 0 && (
          <div className="relative z-10 mt-3 pt-3 border-t border-slate-800 bg-slate-950/40 rounded-lg p-3 max-w-2xl mx-auto w-full">
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span className="font-mono text-cyan-300 font-medium flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Temporary Arrays (int L[] & int R[])
              </span>
              <span className="text-[11px] text-slate-500">
                O(N) Extra Array Memory
              </span>
            </div>
            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {auxArray.map((val, aIdx) => (
                <div
                  key={aIdx}
                  className="flex flex-col items-center px-2 py-1 rounded bg-slate-800 border border-slate-700 text-xs font-mono"
                >
                  <span className="text-[10px] text-slate-400 font-sans">tmp[{aIdx}]</span>
                  <span className="font-semibold text-cyan-200 tabular-nums">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Step Delta & Plain-English Explanation Banner */}
      <div className="px-5 py-4 border-t border-slate-800 bg-slate-950/70">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 flex-1">
            <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 shrink-0 animate-pulse"></div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                {title}
              </h4>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {explanation}
              </p>
            </div>
          </div>

          {onSpeakExplanation && (
            <button
              onClick={onSpeakExplanation}
              title="Listen to Instructor Explanation"
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-colors ${
                isSpeaking
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500 shadow-sm'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700 hover:text-white'
              }`}
            >
              <Volume2 className={`w-3.5 h-3.5 ${isSpeaking ? 'animate-bounce text-cyan-400' : ''}`} />
              <span className="hidden sm:inline">{isSpeaking ? 'Speaking...' : 'Listen'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
