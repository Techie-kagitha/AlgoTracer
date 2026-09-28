import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'int interpolationSearch(int arr[], int n, int target) {', indent: 0, comment: 'Requires sorted, uniformly distributed values' },
  { lineNumber: 4, code: '    int low = 0, high = n - 1;', indent: 1, comment: 'Initialize boundaries' },
  { lineNumber: 5, code: '    while (low <= high && target >= arr[low] && target <= arr[high]) {', indent: 1, comment: 'Target must fall within [arr[low], arr[high]]' },
  { lineNumber: 6, code: '        if (low == high) {', indent: 2, comment: 'Single element range edge-case' },
  { lineNumber: 7, code: '            if (arr[low] == target) return low;', indent: 3 },
  { lineNumber: 8, code: '            return -1;', indent: 3 },
  { lineNumber: 9, code: '        }', indent: 2 },
  { lineNumber: 10, code: '        // Probe position using linear interpolation formula:', indent: 2 },
  { lineNumber: 11, code: '        int pos = low + (((double)(high - low) / (arr[high] - arr[low])) * (target - arr[low]));', indent: 2 },
  { lineNumber: 12, code: '        if (arr[pos] == target) return pos; // Match found!', indent: 2 },
  { lineNumber: 13, code: '        if (arr[pos] < target) low = pos + 1;', indent: 2, comment: 'Target is in upper portion' },
  { lineNumber: 14, code: '        else high = pos - 1;', indent: 2, comment: 'Target is in lower portion' },
  { lineNumber: 15, code: '    }', indent: 1 },
  { lineNumber: 16, code: '    return -1; // Target not found', indent: 1 },
  { lineNumber: 17, code: '}', indent: 0 }
];

export function generateInterpolationSearchSteps(initialArray: number[], targetVal = 25): SortStep[] {
  const arr = [...initialArray].sort((a, b) => a - b);
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;

  const initialStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) initialStatus[idx] = 'idle';

  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: {},
    line: 3,
    action: 'init',
    title: `Call interpolationSearch(arr, ${n}, target = ${targetVal})`,
    explanation: `Start Interpolation Search on sorted array of size ${n}. Probes positions based on key value like looking up a word in a physical dictionary!`,
    variables: [
      { name: 'n', value: n, type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal
  });

  let low = 0;
  let high = n - 1;

  while (low <= high && targetVal >= arr[low] && targetVal <= arr[high]) {
    if (low === high) {
      comparisons++;
      const isMatch = arr[low] === targetVal;

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { [low]: isMatch ? 'found' : 'comparing' },
        pointers: { low, high },
        line: 7,
        action: isMatch ? 'found' : 'not_found',
        title: `Single element check: arr[${low}] == ${targetVal}?`,
        explanation: isMatch ? `Matched at index ${low}!` : `Does not match target. Return -1.`,
        variables: [{ name: 'pos', value: low, type: 'int' }],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: isMatch ? low : -1
      });

      return steps;
    }

    // Interpolation formula
    const fraction = (targetVal - arr[low]) / (arr[high] - arr[low]);
    const pos = Math.min(high, Math.max(low, Math.floor(low + fraction * (high - low))));
    comparisons++;

    const isMatch = arr[pos] === targetVal;

    const probeStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < low || k > high) probeStatus[k] = 'eliminated';
      else if (k === pos) probeStatus[k] = isMatch ? 'found' : 'probe';
      else probeStatus[k] = 'subrange';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: probeStatus,
      pointers: { low, pos, high },
      line: 11,
      action: isMatch ? 'found' : 'compare',
      title: `Interpolate probe pos = ${pos} (arr[${pos}] = ${arr[pos]})`,
      explanation: `Calculated probe pos = ${pos} using target ratio (${fraction.toFixed(2)}). arr[${pos}] is ${arr[pos]}.`,
      variables: [
        { name: 'low', value: low, type: 'int' },
        { name: 'high', value: high, type: 'int' },
        { name: 'pos', value: pos, type: 'int' },
        { name: 'arr[pos]', value: arr[pos], type: 'int' },
        { name: 'target', value: targetVal, type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      subRange: [low, high],
      foundIndex: isMatch ? pos : undefined
    });

    if (isMatch) {
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...probeStatus, [pos]: 'found' },
        pointers: { pos },
        line: 12,
        action: 'done',
        title: `Target Found! return ${pos}`,
        explanation: `Target ${targetVal} found at index ${pos} in only ${comparisons} interpolation probe${comparisons === 1 ? '' : 's'}!`,
        variables: [{ name: 'return', value: pos, type: 'int' }],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: pos
      });
      return steps;
    }

    if (arr[pos] < targetVal) {
      low = pos + 1;
    } else {
      high = pos - 1;
    }
  }

  // Not found
  const notFoundStatus: Record<number, ElementStatus> = {};
  for (let k = 0; k < n; k++) notFoundStatus[k] = 'eliminated';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: notFoundStatus,
    pointers: {},
    line: 16,
    action: 'not_found',
    title: `Target ${targetVal} is outside current range -> return -1`,
    explanation: `Target ${targetVal} is not present in the array. Return -1. Total comparisons: ${comparisons}.`,
    variables: [{ name: 'return', value: -1, type: 'int' }],
    comparisons,
    swaps: 0,
    target: targetVal,
    foundIndex: -1
  });

  return steps;
}

export const interpolationSearchDefinition: AlgorithmDefinition = {
  id: 'interpolation',
  category: 'searching',
  name: 'Interpolation Search',
  cppFunctionName: 'interpolationSearch(int arr[], int n, int target)',
  complexity: {
    best: 'O(1)',
    average: 'O(log log N)',
    worst: 'O(N)',
    space: 'O(1)',
    summary: 'Probes positions based on key value like looking up a dictionary. Achieves O(log log N) on uniformly distributed sorted data.'
  },
  description: 'Interpolation Search improves upon Binary Search when values are uniformly distributed. Instead of always checking the middle, it calculates a probe position proportional to the value of the target relative to the endpoints.',
  cppCode,
  generateSteps: generateInterpolationSearchSteps,
  keyInvariants: [
    'Requires sorted array with roughly uniform distribution of values.',
    'Probe formula: pos = low + [(target - arr[low]) * (high - low) / (arr[high] - arr[low])].',
    'Average time complexity O(log log N) beats Binary Search on large uniform datasets.'
  ],
  requiresSorted: true
};
