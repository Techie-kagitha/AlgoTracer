import React, { useState } from 'react';
import { ALGORITHM_LIST } from '../algorithms';
import { BookOpen, Cpu, ShieldCheck, Zap, Code2, HelpCircle } from 'lucide-react';

export const AlgorithmGuide: React.FC = () => {
  const [selectedAlgoId, setSelectedAlgoId] = useState(ALGORITHM_LIST[0].id);
  const selectedAlgo = ALGORITHM_LIST.find((a) => a.id === selectedAlgoId) || ALGORITHM_LIST[0];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm">
        <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-cyan-400" />
          Beginner C++ Sorting Algorithms Manual (Array Based)
        </h2>
        <p className="text-xs text-slate-300 mt-1 leading-relaxed">
          Designed specifically for beginner computer science students learning raw C++ arrays (<code className="text-cyan-300 font-mono">int arr[]</code>), array indexing, and pass-by-reference mechanics.
        </p>
      </div>

      {/* Beginner Array Concepts Callout */}
      <div className="bg-cyan-950/40 border border-cyan-800/70 rounded-xl p-4 text-xs space-y-2.5">
        <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          Classroom Note: Why do we pass <code className="font-mono bg-cyan-950 px-1 py-0.5 rounded text-cyan-300">int arr[], int n</code>?
        </h3>
        <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
          <li>
            <strong className="text-white">Contiguous Memory:</strong> A raw array in C++ is a consecutive series of memory slots. Indexing starts at 0, so valid indices are <code className="font-mono text-cyan-300">0, 1, 2, ..., n - 1</code>.
          </li>
          <li>
            <strong className="text-white">Array Decay:</strong> When you pass <code className="font-mono text-cyan-300">int arr[]</code> into a C++ function, it automatically decays into a pointer to the first element. Any modification to <code className="font-mono text-cyan-300">arr[i]</code> directly alters the original caller&apos;s array in memory!
          </li>
          <li>
            <strong className="text-white">Why length parameter n is required:</strong> Because a raw array does not store its own length inside functions (unlike objects), we must pass <code className="font-mono text-cyan-300">int n</code> so the loops know where the array ends.
          </li>
          <li>
            <strong className="text-white">The Classic 3-Step Swap:</strong> To exchange two array elements without losing data:
            <code className="block mt-1 font-mono text-cyan-300 bg-slate-950 p-2 rounded border border-slate-800">
              int temp = arr[i]; // 1. Save original value of arr[i]<br />
              arr[i] = arr[j];   // 2. Overwrite arr[i] with arr[j]<br />
              arr[j] = temp;     // 3. Put saved temp value into arr[j]
            </code>
          </li>
        </ul>
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {ALGORITHM_LIST.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setSelectedAlgoId(algo.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedAlgoId === algo.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900/90 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            {algo.name}
          </button>
        ))}
      </div>

      {/* Selected Algorithm Deep Dive Card */}
      <div className="bg-slate-900/70 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-4 border-b border-slate-800 gap-3">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {selectedAlgo.name}
            </h3>
            <p className="text-xs font-mono text-cyan-300 mt-0.5">
              void {selectedAlgo.cppFunctionName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              Avg: <strong className="text-amber-300">{selectedAlgo.complexity.average}</strong>
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              Extra Space: <strong className="text-emerald-300">{selectedAlgo.complexity.space}</strong>
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              Stability: <strong className={selectedAlgo.complexity.stable ? 'text-emerald-300' : 'text-slate-400'}>
                {selectedAlgo.complexity.stable ? 'Stable' : 'Unstable'}
              </strong>
            </span>
          </div>
        </div>

        {/* Narrative Description */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-cyan-400" />
            Algorithm Mechanics & Intuition
          </h4>
          <p className="text-xs text-slate-300 leading-relaxed">
            {selectedAlgo.description}
          </p>
        </div>

        {/* Key Invariants & Correctness */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Loop Invariants & Guarantees
          </h4>
          <ul className="space-y-2">
            {selectedAlgo.keyInvariants.map((inv, idx) => (
              <li key={idx} className="text-xs text-slate-300 flex items-start gap-2 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/80">
                <span className="text-cyan-400 font-mono font-bold mt-0.5">•</span>
                <span className="leading-relaxed">{inv}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Practical C++ Array Implementation Notes */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Array Behavior & Loop Tracing
          </h4>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            {selectedAlgo.id === 'bubble' && (
              <p>
                In Bubble Sort, the outer loop <code className="text-cyan-300 font-mono">for (int i = 0; i &lt; n - 1; i++)</code> controls the passes. The inner loop compares adjacent elements <code className="text-cyan-300 font-mono">arr[j]</code> and <code className="text-cyan-300 font-mono">arr[j + 1]</code>. Notice how the inner loop bound decreases to <code className="text-cyan-300 font-mono">n - i - 1</code> because the largest <code className="text-cyan-300 font-mono">i</code> elements are already locked into place at the end of the array.
              </p>
            )}
            {selectedAlgo.id === 'selection' && (
              <p>
                Selection Sort searches for the index of the minimum element in the unsorted suffix <code className="text-cyan-300 font-mono">arr[i...n-1]</code>. It stores the position in <code className="text-cyan-300 font-mono">int min_idx</code>. When the inner loop finishes scanning, it performs a single 3-step swap with <code className="text-cyan-300 font-mono">arr[i]</code>. It makes at most N - 1 swaps total.
              </p>
            )}
            {selectedAlgo.id === 'insertion' && (
              <p>
                Insertion Sort treats <code className="text-cyan-300 font-mono">arr[0]</code> as an already-sorted 1-element subarray. Then for each index from 1 to n - 1, it extracts <code className="text-cyan-300 font-mono">int key = arr[i]</code> and shifts all elements larger than <code className="text-cyan-300 font-mono">key</code> one position to the right (<code className="text-cyan-300 font-mono">arr[j + 1] = arr[j]</code>). Finally, <code className="text-cyan-300 font-mono">arr[j + 1] = key</code> places the key in its correct spot.
              </p>
            )}
            {selectedAlgo.id === 'quick' && (
              <p>
                Quick Sort uses divide-and-conquer on array indices <code className="text-cyan-300 font-mono">low</code> and <code className="text-cyan-300 font-mono">high</code>. The function <code className="text-cyan-300 font-mono">partition(arr, low, high)</code> chooses <code className="text-cyan-300 font-mono">arr[high]</code> as the pivot. It rearranges the array so that all values smaller than or equal to the pivot are placed to its left, and values greater are placed to its right, then returns the pivot&apos;s index.
              </p>
            )}
            {selectedAlgo.id === 'merge' && (
              <p>
                Merge Sort recursively splits the array into two halves by calculating the midpoint <code className="text-cyan-300 font-mono">mid = left + (right - left) / 2</code>. To combine the two sorted halves, <code className="text-cyan-300 font-mono">merge()</code> copies the elements into two small temporary arrays <code className="text-cyan-300 font-mono">L[]</code> and <code className="text-cyan-300 font-mono">R[]</code>, and writes them back into <code className="text-cyan-300 font-mono">arr[]</code> in ascending order.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
