import React, { useState } from 'react';
import { SORTING_ALGORITHMS, SEARCHING_ALGORITHMS, ALL_ALGORITHMS } from '../algorithms';
import { BookOpen, Cpu, ShieldCheck, Zap, Code2, HelpCircle, ArrowUpDown, Search } from 'lucide-react';
import { AlgorithmCategory } from '../types/sorting';

export const AlgorithmGuide: React.FC = () => {
  const [guideCategory, setGuideCategory] = useState<AlgorithmCategory>('sorting');
  const algos = guideCategory === 'sorting' ? SORTING_ALGORITHMS : SEARCHING_ALGORITHMS;
  const [selectedAlgoId, setSelectedAlgoId] = useState(algos[0].id);

  const selectedAlgo = ALL_ALGORITHMS.find((a) => a.id === selectedAlgoId) || algos[0];

  const handleCategorySwitch = (cat: AlgorithmCategory) => {
    setGuideCategory(cat);
    const newAlgos = cat === 'sorting' ? SORTING_ALGORITHMS : SEARCHING_ALGORITHMS;
    setSelectedAlgoId(newAlgos[0].id);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 shadow-lg backdrop-blur-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Beginner C++ Sorting & Searching Manual (Array Based)
          </h2>
          <p className="text-xs text-slate-300 mt-1 leading-relaxed">
            Designed specifically for beginner computer science students learning raw C++ arrays (<code className="text-cyan-300 font-mono">int arr[]</code>), index bounds, and algorithmic efficiency.
          </p>
        </div>

        {/* Category Pill */}
        <div className="flex items-center p-0.5 bg-slate-950 border border-slate-800 rounded-lg shrink-0">
          <button
            onClick={() => handleCategorySwitch('sorting')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              guideCategory === 'sorting'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sorting (5)</span>
          </button>
          <button
            onClick={() => handleCategorySwitch('searching')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              guideCategory === 'searching'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Searching (5)</span>
          </button>
        </div>
      </div>

      {/* Beginner Array Concepts Callout */}
      <div className="bg-cyan-950/40 border border-cyan-800/70 rounded-xl p-4 text-xs space-y-2.5">
        <h3 className="font-bold text-cyan-200 flex items-center gap-2 text-sm">
          <HelpCircle className="w-4 h-4 text-cyan-400" />
          {guideCategory === 'sorting'
            ? 'Sorting Fundamentals in C++: Array Decay & 3-Step Swap'
            : 'Searching Fundamentals in C++: Unsorted vs Sorted Searches'}
        </h3>
        {guideCategory === 'sorting' ? (
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
        ) : (
          <ul className="space-y-1.5 text-slate-300 list-disc list-inside leading-relaxed">
            <li>
              <strong className="text-white">Linear vs Binary:</strong> Linear Search requires no prior order and takes $O(N)$ comparisons. Binary Search requires the array to be sorted and takes only $O(\log N)$ comparisons.
            </li>
            <li>
              <strong className="text-white">Return Values:</strong> If the target value is found in the array, the function returns its 0-based index (<code className="font-mono text-cyan-300">0 &lt;= return &lt; n</code>). If the target does not exist, the function returns <code className="font-mono text-cyan-300">-1</code>.
            </li>
            <li>
              <strong className="text-white">Integer Overflow Guard:</strong> In Binary Search, always compute the midpoint using <code className="font-mono text-cyan-300">mid = low + (high - low) / 2</code> rather than <code className="font-mono text-slate-400 line-through">(low + high) / 2</code> to prevent 32-bit integer overflow!
            </li>
            <li>
              <strong className="text-white">Interpolation Formula:</strong> While Binary Search always probes the middle ($50\%$), Interpolation Search probes based on value fraction: <code className="font-mono text-cyan-300">pos = low + [(target - arr[low]) * (high - low) / (arr[high] - arr[low])]</code>.
            </li>
          </ul>
        )}
      </div>

      {/* Algorithm Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {algos.map((algo) => (
          <button
            key={algo.id}
            onClick={() => setSelectedAlgoId(algo.id)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              selectedAlgo.id === algo.id
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
              {selectedAlgo.cppFunctionName}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              Avg: <strong className="text-amber-300">{selectedAlgo.complexity.average}</strong>
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              Worst: <strong className="text-rose-400">{selectedAlgo.complexity.worst}</strong>
            </span>
            <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
              Space: <strong className="text-emerald-300">{selectedAlgo.complexity.space}</strong>
            </span>
            {selectedAlgo.requiresSorted !== undefined && (
              <span className="px-2.5 py-1 text-xs font-mono rounded bg-slate-950 text-slate-300 border border-slate-800">
                Sorted Req: <strong className={selectedAlgo.requiresSorted ? 'text-amber-300' : 'text-emerald-300'}>
                  {selectedAlgo.requiresSorted ? 'Yes' : 'No'}
                </strong>
              </span>
            )}
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
            Theoretical Guarantees & Invariants
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

        {/* Classroom C++ Implementation Notes */}
        <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
            <Code2 className="w-4 h-4 text-cyan-400" />
            Classroom Analysis & Big-O Notes
          </h4>
          <div className="text-xs text-slate-400 space-y-2 leading-relaxed">
            {selectedAlgo.id === 'linear' && (
              <p>
                Linear Search requires examining elements one by one. In the best case (target is at index 0), it takes only 1 comparison. In the average case, it takes approximately $N / 2$ comparisons. In the worst case (target at index $n - 1$ or absent), it takes $N$ comparisons.
              </p>
            )}
            {selectedAlgo.id === 'binary' && (
              <p>
                Binary Search continually eliminates half the search space. For an array of 1,000,000 elements, Binary Search takes at most $\lceil\log_2(1,000,000)\rceil \approx 20$ comparisons, compared to 1,000,000 for Linear Search! However, it strictly requires the array to be pre-sorted.
              </p>
            )}
            {selectedAlgo.id === 'jump' && (
              <p>
                Jump Search jumps forward in blocks of &radic;N. If the block boundary value is smaller than the target, it jumps again. Once a block boundary value is &ge; the target, it performs a short linear search inside that block. Total time is bounded by O(&radic;N).
              </p>
            )}
            {selectedAlgo.id === 'interpolation' && (
              <p>
                Interpolation Search uses the mathematical ratio of the target relative to the endpoints. For phone books or evenly spaced student ID numbers, it finds elements in $O(\log \log N)$ average time—substantially faster than Binary Search. If data is heavily skewed or exponential, it degrades to $O(N)$.
              </p>
            )}
            {selectedAlgo.id === 'exponential' && (
              <p>
                Exponential Search checks indices $1, 2, 4, 8, 16, \dots$ until finding an index where $arr[i] \ge target$. Then it performs a Binary Search in the range $[i / 2, \min(i, n - 1)]$. It is especially efficient when searching unbounded data or when the target is located near the start of the array.
              </p>
            )}
            {selectedAlgo.id === 'bubble' && (
              <p>
                In Bubble Sort, the outer loop <code className="text-cyan-300 font-mono">for (int i = 0; i &lt; n - 1; i++)</code> controls the passes. The inner loop compares adjacent elements <code className="text-cyan-300 font-mono">arr[j]</code> and <code className="text-cyan-300 font-mono">arr[j + 1]</code>.
              </p>
            )}
            {selectedAlgo.id === 'selection' && (
              <p>
                Selection Sort searches for the index of the minimum element in the unsorted suffix <code className="text-cyan-300 font-mono">arr[i...n-1]</code>. When the inner loop finishes scanning, it performs a single 3-step swap with <code className="text-cyan-300 font-mono">arr[i]</code>. It makes at most N - 1 swaps total.
              </p>
            )}
            {selectedAlgo.id === 'insertion' && (
              <p>
                Insertion Sort treats <code className="text-cyan-300 font-mono">arr[0]</code> as an already-sorted 1-element subarray, then extracts <code className="text-cyan-300 font-mono">int key = arr[i]</code> and shifts elements larger than <code className="text-cyan-300 font-mono">key</code> to the right.
              </p>
            )}
            {selectedAlgo.id === 'quick' && (
              <p>
                Quick Sort uses divide-and-conquer on array indices <code className="text-cyan-300 font-mono">low</code> and <code className="text-cyan-300 font-mono">high</code>. The function <code className="text-cyan-300 font-mono">partition(arr, low, high)</code> chooses <code className="text-cyan-300 font-mono">arr[high]</code> as the pivot.
              </p>
            )}
            {selectedAlgo.id === 'merge' && (
              <p>
                Merge Sort recursively splits the array into two halves, then uses temporary arrays <code className="text-cyan-300 font-mono">L[]</code> and <code className="text-cyan-300 font-mono">R[]</code> to merge them back into <code className="text-cyan-300 font-mono">arr[]</code> in ascending order.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
