import React from 'react';
import { StepVariable, CallStackFrame, ComplexityInfo } from '../types/sorting';
import { Eye, Layers, Activity, GitBranch } from 'lucide-react';

interface VariableWatchProps {
  variables: StepVariable[];
  callStack?: CallStackFrame[];
  comparisons: number;
  swaps: number;
  complexity: ComplexityInfo;
}

export const VariableWatch: React.FC<VariableWatchProps> = ({
  variables,
  callStack,
  comparisons,
  swaps,
  complexity,
}) => {
  return (
    <div className="flex flex-col gap-4">
      {/* Real-time Counters & Complexity Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
          <Activity className="w-3.5 h-3.5 text-cyan-400" />
          <span>Execution Telemetry</span>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-sans">Comparisons</div>
            <div className="text-xl font-bold font-mono text-cyan-300 tabular-nums">
              {comparisons}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
              Element tests (arr[i] &gt; arr[j])
            </div>
          </div>

          <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800/80">
            <div className="text-[11px] text-slate-400 font-sans">Swaps / Writes</div>
            <div className="text-xl font-bold font-mono text-rose-300 tabular-nums">
              {swaps}
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5 font-sans">
              Memory modifications
            </div>
          </div>
        </div>

        {/* Complexity Summary */}
        <div className="pt-2 border-t border-slate-800/80 text-xs font-mono space-y-1.5">
          <div className="flex justify-between text-slate-400">
            <span>Time Complexity:</span>
            <span className="text-amber-300 font-medium">Avg: {complexity.average}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Worst Case:</span>
            <span className="text-rose-400 font-medium">{complexity.worst}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Auxiliary Space:</span>
            <span className="text-emerald-400 font-medium">{complexity.space}</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Stability:</span>
            <span className={complexity.stable ? 'text-emerald-400' : 'text-slate-400'}>
              {complexity.stable ? 'Stable' : 'Unstable'}
            </span>
          </div>
        </div>
      </div>

      {/* C++ Variable Watch Window */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
            <Eye className="w-3.5 h-3.5 text-cyan-400" />
            <span>Local Variables (C++ Frame)</span>
          </div>
          <span className="text-[11px] font-mono text-slate-500">
            {variables.length} active
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs font-mono">
            <thead>
              <tr className="border-b border-slate-800 text-slate-500 text-left">
                <th className="pb-1.5 font-medium">Name</th>
                <th className="pb-1.5 font-medium">Type</th>
                <th className="pb-1.5 font-medium text-right">Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {variables.length === 0 ? (
                <tr>
                  <td colSpan={3} className="py-3 text-center text-slate-500 italic font-sans">
                    No active scope variables
                  </td>
                </tr>
              ) : (
                variables.map((v, i) => (
                  <tr key={i} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-1.5 text-cyan-300 font-semibold">{v.name}</td>
                    <td className="py-1.5 text-slate-400">{v.type || 'auto'}</td>
                    <td className="py-1.5 text-right font-bold text-amber-300 tabular-nums">
                      {String(v.value)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Call Stack Window for Recursive Algorithms (Quick & Merge) */}
      {callStack && callStack.length > 0 && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-4 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Call Stack (Depth: {callStack.length})</span>
            </div>
            <span className="text-[11px] font-mono text-purple-300">
              Recursion
            </span>
          </div>

          <div className="flex flex-col gap-1.5 max-h-40 overflow-y-auto">
            {callStack.map((frame, index) => {
              const isTop = index === callStack.length - 1;
              return (
                <div
                  key={frame.id + index}
                  className={`flex items-center justify-between px-2.5 py-1.5 rounded text-xs font-mono transition-colors ${
                    isTop
                      ? 'bg-purple-950/70 border border-purple-800/80 text-purple-200'
                      : 'bg-slate-950/40 text-slate-400 border border-slate-800/60'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <GitBranch className="w-3 h-3 text-purple-400" />
                    <span>{frame.functionName}(</span>
                    <span className="text-slate-300">
                      {Object.entries(frame.params)
                        .map(([k, val]) => `${k}=${val}`)
                        .join(', ')}
                    </span>
                    <span>)</span>
                  </div>
                  {isTop && (
                    <span className="text-[10px] px-1 py-0.5 rounded bg-purple-900/80 text-purple-300 font-sans">
                      Active
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
