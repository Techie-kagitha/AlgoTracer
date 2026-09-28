import React from 'react';
import { AlgorithmDefinition, NumberListPreset } from '../types/sorting';
import { Play, ArrowRight, BarChart3, Zap, CheckCircle2 } from 'lucide-react';

interface MultiListLabProps {
  lists: NumberListPreset[];
  algorithm: AlgorithmDefinition;
  onSelectAndDebugList: (listId: string) => void;
  onOpenListManager: () => void;
}

export const MultiListLab: React.FC<MultiListLabProps> = ({
  lists,
  algorithm,
  onSelectAndDebugList,
  onOpenListManager,
}) => {
  // Precompute metrics for every list with the selected algorithm
  const results = lists.map((list) => {
    const steps = algorithm.generateSteps(list.data);
    const finalStep = steps[steps.length - 1];
    return {
      list,
      totalSteps: steps.length,
      comparisons: finalStep ? finalStep.comparisons : 0,
      swaps: finalStep ? finalStep.swaps : 0,
      sortedData: finalStep ? finalStep.array : [...list.data].sort((a, b) => a - b),
    };
  });

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-cyan-400" />
              Multi-List Test Suite Analysis · {algorithm.name}
            </h2>
            <p className="text-xs text-slate-300 mt-1 leading-relaxed max-w-2xl">
              Observe how {algorithm.name} handles various input lists with differing distributions (reversed, nearly-sorted, duplicates, small vs large). Notice how comparisons and memory writes vary based on input ordering.
            </p>
          </div>

          <button
            onClick={onOpenListManager}
            className="self-start md:self-auto px-4 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            + Add New List to Suite
          </button>
        </div>
      </div>

      {/* Grid of Lists */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map(({ list, totalSteps, comparisons, swaps, sortedData }) => {
          const maxVal = Math.max(...list.data, 100);

          return (
            <div
              key={list.id}
              className="bg-slate-900/70 border border-slate-800 hover:border-cyan-700/60 rounded-xl p-4 flex flex-col justify-between transition-all duration-150 shadow-md group"
            >
              <div>
                {/* List Header */}
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-sm font-bold text-white group-hover:text-cyan-300 transition-colors">
                    {list.name}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    {list.data.length} elements
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                  {list.description}
                </p>

                {/* Mini Visual Bar Chart Preview */}
                <div className="h-20 bg-slate-950/60 border border-slate-850 rounded-lg p-2 flex items-end justify-center gap-1.5 mb-3">
                  {list.data.map((val, idx) => {
                    const h = Math.max(15, Math.round((val / maxVal) * 100));
                    return (
                      <div
                        key={idx}
                        style={{ height: `${h}%` }}
                        className="flex-1 max-w-[20px] bg-cyan-600/70 rounded-t-sm group-hover:bg-cyan-400/90 transition-colors"
                        title={`[${idx}]: ${val}`}
                      />
                    );
                  })}
                </div>

                {/* Initial array raw representation */}
                <div className="text-[11px] font-mono text-slate-400 bg-slate-950/40 px-2 py-1 rounded border border-slate-800/80 mb-3 truncate">
                  Input: [{list.data.join(', ')}]
                </div>

                {/* Resulting telemetry stats */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono mb-4">
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-sans">Steps</div>
                    <div className="font-bold text-slate-200 tabular-nums">{totalSteps}</div>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-sans">Compares</div>
                    <div className="font-bold text-cyan-300 tabular-nums">{comparisons}</div>
                  </div>
                  <div className="p-2 bg-slate-950/80 rounded border border-slate-800">
                    <div className="text-[10px] text-slate-500 font-sans">Swaps</div>
                    <div className="font-bold text-rose-300 tabular-nums">{swaps}</div>
                  </div>
                </div>
              </div>

              {/* Action Button: Debug this specific list */}
              <button
                onClick={() => onSelectAndDebugList(list.id)}
                className="w-full flex items-center justify-center gap-2 py-2 text-xs font-semibold text-cyan-300 bg-cyan-950/60 hover:bg-cyan-900/60 border border-cyan-800/60 rounded-lg transition-colors group-hover:border-cyan-600/80"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Step-by-Step Debug This List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};
