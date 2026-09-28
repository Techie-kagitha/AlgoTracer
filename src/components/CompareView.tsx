import React, { useState, useEffect } from 'react';
import { AlgorithmDefinition, NumberListPreset, AlgorithmCategory } from '../types/sorting';
import { SORTING_ALGORITHMS, SEARCHING_ALGORITHMS } from '../algorithms';
import { Play, Pause, RotateCcw, GitCompare, Target, CheckCircle2, XCircle } from 'lucide-react';
import { soundManager } from '../services/soundEffects';

interface CompareViewProps {
  currentList: NumberListPreset;
  category: AlgorithmCategory;
  target?: number;
  onTargetChange?: (t: number) => void;
}

export const CompareView: React.FC<CompareViewProps> = ({
  currentList,
  category,
  target = 25,
  onTargetChange,
}) => {
  const availableAlgos = category === 'searching' ? SEARCHING_ALGORITHMS : SORTING_ALGORITHMS;

  const [algoAId, setAlgoAId] = useState<string>(category === 'searching' ? 'linear' : 'bubble');
  const [algoBId, setAlgoBId] = useState<string>(category === 'searching' ? 'binary' : 'quick');

  // When category changes, reset defaults
  useEffect(() => {
    if (category === 'searching') {
      setAlgoAId('linear');
      setAlgoBId('binary');
    } else {
      setAlgoAId('bubble');
      setAlgoBId('quick');
    }
  }, [category]);

  const algoA = availableAlgos.find((a) => a.id === algoAId) || availableAlgos[0];
  const algoB = availableAlgos.find((a) => a.id === algoBId) || availableAlgos[1] || availableAlgos[0];

  const [stepsA, setStepsA] = useState(() => algoA.generateSteps(currentList.data, target));
  const [stepsB, setStepsB] = useState(() => algoB.generateSteps(currentList.data, target));

  const [indexA, setIndexA] = useState(0);
  const [indexB, setIndexB] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);

  // Recompute when list, target, or algorithms change
  useEffect(() => {
    setStepsA(algoA.generateSteps(currentList.data, target));
    setStepsB(algoB.generateSteps(currentList.data, target));
    setIndexA(0);
    setIndexB(0);
    setIsPlaying(false);
  }, [algoAId, algoBId, currentList, target]);

  // Animation tick
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      let doneA = false;
      let doneB = false;

      setIndexA((prev) => {
        if (prev < stepsA.length - 1) {
          const next = prev + 1;
          const s = stepsA[next];
          if (s && s.action === 'swap') soundManager.playTone(400, 45, 0.4);
          else if (s && (s.action === 'compare' || s.action === 'found')) soundManager.playTone(320, 35, 0.3);
          return next;
        }
        doneA = true;
        return prev;
      });

      setIndexB((prev) => {
        if (prev < stepsB.length - 1) {
          const next = prev + 1;
          const s = stepsB[next];
          if (s && s.action === 'swap') soundManager.playTone(600, 45, 0.4);
          else if (s && (s.action === 'compare' || s.action === 'found')) soundManager.playTone(520, 35, 0.3);
          return next;
        }
        doneB = true;
        return prev;
      });

      if (doneA && doneB) {
        setIsPlaying(false);
        soundManager.playCompletionSweep(currentList.data);
      }
    }, 400 / speed);

    return () => clearInterval(interval);
  }, [isPlaying, speed, stepsA.length, stepsB.length, currentList.data]);

  const stepA = stepsA[indexA] || stepsA[0];
  const stepB = stepsB[indexB] || stepsB[0];
  const maxVal = Math.max(...currentList.data, 100);

  const handleReset = () => {
    setIndexA(0);
    setIndexB(0);
    setIsPlaying(false);
  };

  return (
    <div className="space-y-6">
      {/* Comparison Controls Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <GitCompare className="w-5 h-5 text-cyan-400" />
            Side-by-Side {category === 'searching' ? 'Search' : 'Algorithm'} Race Arena
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Running concurrently on input: [{currentList.data.join(', ')}]
          </p>
        </div>

        {/* Global Controls & Target input if searching */}
        <div className="flex flex-wrap items-center gap-3">
          {category === 'searching' && onTargetChange && (
            <div className="flex items-center gap-1.5 bg-slate-950 border border-amber-800/80 px-2.5 py-1 rounded-lg">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-xs text-slate-400 font-mono">Target:</span>
              <input
                type="number"
                value={target}
                onChange={(e) => onTargetChange(Number(e.target.value))}
                className="w-16 px-1 text-xs font-mono font-bold text-amber-300 bg-transparent text-center focus:outline-none"
              />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={handleReset}
              className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
              title="Reset Race"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg shadow-md transition-colors ${
                isPlaying
                  ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                  : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
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
                  <span>Start Race</span>
                </>
              )}
            </button>

            <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 ml-1">
              {[0.5, 1, 2, 4].map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-1 text-[11px] font-mono font-medium rounded ${
                    speed === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  {s}x
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Visualizers */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Slot A */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Algorithm A
              </label>
              <select
                value={algoAId}
                onChange={(e) => setAlgoAId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
              >
                {availableAlgos.map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.name} ({algo.complexity.average})
                  </option>
                ))}
              </select>
            </div>

            {/* Bars for Slot A */}
            <div className="h-44 bg-slate-950/60 border border-slate-850 rounded-lg p-4 flex items-end justify-center gap-2 mb-4">
              {stepA.array.map((val, idx) => {
                const status = stepA.statusMap[idx] || 'idle';
                const h = Math.max(15, Math.round((val / maxVal) * 94));
                const isComparing = status === 'comparing';
                const isSwapping = status === 'swapping' || status === 'overwriting';
                const isSorted = status === 'sorted';
                const isFound = status === 'found';
                const isEliminated = status === 'eliminated';
                const isProbe = status === 'probe';

                let bgClass = 'bg-slate-700';
                if (isFound) bgClass = 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]';
                else if (isProbe) bgClass = 'bg-purple-500';
                else if (isComparing) bgClass = 'bg-cyan-500';
                else if (isSwapping) bgClass = 'bg-rose-500';
                else if (isSorted) bgClass = 'bg-emerald-500';
                else if (isEliminated) bgClass = 'bg-slate-800 opacity-25';

                return (
                  <div key={idx} className="flex-1 max-w-[40px] flex flex-col items-center justify-end h-full">
                    <span className={`text-[10px] font-mono mb-1 ${isFound ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
                      {val}
                    </span>
                    <div
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-t-sm transition-all duration-150 ${bgClass}`}
                    />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            {/* Current Step Description */}
            <div className="text-xs text-slate-300 font-mono bg-slate-950/80 p-2.5 rounded border border-slate-800/80 mb-4 truncate">
              {stepA.title}
            </div>
          </div>

          {/* Slot A Counters */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-slate-800">
            <div className="p-2 bg-slate-950/60 rounded">
              <div className="text-[10px] text-slate-500 font-sans">Step</div>
              <div className="font-bold text-white tabular-nums">
                {indexA + 1} / {stepsA.length}
              </div>
            </div>
            <div className="p-2 bg-slate-950/60 rounded">
              <div className="text-[10px] text-slate-500 font-sans">Comparisons</div>
              <div className="font-bold text-cyan-300 tabular-nums">{stepA.comparisons}</div>
            </div>
            <div className="p-2 bg-slate-950/60 rounded">
              <div className="text-[10px] text-slate-500 font-sans">
                {category === 'searching' ? 'Status' : 'Swaps'}
              </div>
              <div className="font-bold text-rose-300 tabular-nums">
                {category === 'searching' ? (
                  stepA.foundIndex !== undefined && stepA.foundIndex >= 0 ? (
                    <span className="text-emerald-400 font-bold">Found [{stepA.foundIndex}]</span>
                  ) : stepA.action === 'not_found' ? (
                    <span className="text-rose-400">Not Found</span>
                  ) : (
                    <span className="text-slate-400">Searching</span>
                  )
                ) : (
                  stepA.swaps
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Slot B */}
        <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Algorithm B
              </label>
              <select
                value={algoBId}
                onChange={(e) => setAlgoBId(e.target.value)}
                className="bg-slate-950 border border-slate-700 text-white text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-cyan-500 font-mono"
              >
                {availableAlgos.map((algo) => (
                  <option key={algo.id} value={algo.id}>
                    {algo.name} ({algo.complexity.average})
                  </option>
                ))}
              </select>
            </div>

            {/* Bars for Slot B */}
            <div className="h-44 bg-slate-950/60 border border-slate-850 rounded-lg p-4 flex items-end justify-center gap-2 mb-4">
              {stepB.array.map((val, idx) => {
                const status = stepB.statusMap[idx] || 'idle';
                const h = Math.max(15, Math.round((val / maxVal) * 94));
                const isComparing = status === 'comparing';
                const isSwapping = status === 'swapping' || status === 'overwriting';
                const isSorted = status === 'sorted';
                const isFound = status === 'found';
                const isEliminated = status === 'eliminated';
                const isProbe = status === 'probe';

                let bgClass = 'bg-slate-700';
                if (isFound) bgClass = 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]';
                else if (isProbe) bgClass = 'bg-purple-500';
                else if (isComparing) bgClass = 'bg-cyan-500';
                else if (isSwapping) bgClass = 'bg-rose-500';
                else if (isSorted) bgClass = 'bg-emerald-500';
                else if (isEliminated) bgClass = 'bg-slate-800 opacity-25';

                return (
                  <div key={idx} className="flex-1 max-w-[40px] flex flex-col items-center justify-end h-full">
                    <span className={`text-[10px] font-mono mb-1 ${isFound ? 'text-emerald-300 font-bold' : 'text-slate-400'}`}>
                      {val}
                    </span>
                    <div
                      style={{ height: `${h}%` }}
                      className={`w-full rounded-t-sm transition-all duration-150 ${bgClass}`}
                    />
                    <span className="text-[9px] font-mono text-slate-500 mt-1">[{idx}]</span>
                  </div>
                );
              })}
            </div>

            {/* Current Step Description */}
            <div className="text-xs text-slate-300 font-mono bg-slate-950/80 p-2.5 rounded border border-slate-800/80 mb-4 truncate">
              {stepB.title}
            </div>
          </div>

          {/* Slot B Counters */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono pt-3 border-t border-slate-800">
            <div className="p-2 bg-slate-950/60 rounded">
              <div className="text-[10px] text-slate-500 font-sans">Step</div>
              <div className="font-bold text-white tabular-nums">
                {indexB + 1} / {stepsB.length}
              </div>
            </div>
            <div className="p-2 bg-slate-950/60 rounded">
              <div className="text-[10px] text-slate-500 font-sans">Comparisons</div>
              <div className="font-bold text-cyan-300 tabular-nums">{stepB.comparisons}</div>
            </div>
            <div className="p-2 bg-slate-950/60 rounded">
              <div className="text-[10px] text-slate-500 font-sans">
                {category === 'searching' ? 'Status' : 'Swaps'}
              </div>
              <div className="font-bold text-rose-300 tabular-nums">
                {category === 'searching' ? (
                  stepB.foundIndex !== undefined && stepB.foundIndex >= 0 ? (
                    <span className="text-emerald-400 font-bold">Found [{stepB.foundIndex}]</span>
                  ) : stepB.action === 'not_found' ? (
                    <span className="text-rose-400">Not Found</span>
                  ) : (
                    <span className="text-slate-400">Searching</span>
                  )
                ) : (
                  stepB.swaps
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
