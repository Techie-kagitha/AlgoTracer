import React from 'react';
import { Target, Search, ArrowRight, ArrowDownUp, AlertCircle, CheckCircle2 } from 'lucide-react';

interface SearchTargetInputProps {
  target: number;
  onTargetChange: (val: number) => void;
  array: number[];
  requiresSorted?: boolean;
  isSorted: boolean;
  onSortArray: () => void;
}

export const SearchTargetInput: React.FC<SearchTargetInputProps> = ({
  target,
  onTargetChange,
  array,
  requiresSorted = false,
  isSorted,
  onSortArray,
}) => {
  // Quick options: pick 3 elements from array, plus one not in array
  const presentValues = Array.from(new Set(array)).slice(0, 4);
  const absentValue = Math.max(...array, 100) + 7;

  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
      {/* Target input control */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <Target className="w-4 h-4 text-amber-400" />
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-300 font-mono">
            Target Value (int target):
          </span>
        </div>

        <div className="flex items-center gap-2">
          <input
            type="number"
            value={target}
            onChange={(e) => onTargetChange(Number(e.target.value))}
            className="w-20 px-2.5 py-1 text-xs font-mono font-bold text-amber-300 bg-slate-950 border border-amber-700/70 rounded-lg text-center focus:outline-none focus:border-amber-400 shadow-inner"
          />

          {/* Quick chip selectors */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 font-sans hidden sm:inline">Try:</span>
            {presentValues.map((val) => (
              <button
                key={val}
                onClick={() => onTargetChange(val)}
                className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors ${
                  target === val
                    ? 'bg-amber-400/20 text-amber-300 border-amber-500 font-bold'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-slate-200'
                }`}
                title={`Search for existing value ${val}`}
              >
                {val}
              </button>
            ))}
            <button
              onClick={() => onTargetChange(absentValue)}
              className={`px-2 py-0.5 text-[11px] font-mono rounded border transition-colors ${
                target === absentValue
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500 font-bold'
                  : 'bg-slate-950 text-rose-400/70 border-slate-800 hover:text-rose-300'
              }`}
              title="Search for absent value to test return -1"
            >
              {absentValue} (absent)
            </button>
          </div>
        </div>
      </div>

      {/* Sorted requirement status badge for binary/jump/interpolation */}
      {requiresSorted && (
        <div className="flex items-center gap-2 text-xs">
          {isSorted ? (
            <span className="flex items-center gap-1.5 text-emerald-400 font-mono bg-emerald-950/40 px-2.5 py-1 rounded-lg border border-emerald-800/60">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Array is Sorted (Required)</span>
            </span>
          ) : (
            <button
              onClick={onSortArray}
              className="flex items-center gap-1.5 text-amber-300 font-semibold bg-amber-950/60 hover:bg-amber-900/60 px-2.5 py-1 rounded-lg border border-amber-700/80 transition-colors shadow-sm"
              title="Sort this array ascending so Binary/Jump search can execute correctly"
            >
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Unsorted Array! Click to Sort First</span>
              <ArrowDownUp className="w-3 h-3 ml-1" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};
