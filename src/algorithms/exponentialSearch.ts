import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '#include <algorithm>', indent: 0, comment: 'For std::min' },
  { lineNumber: 3, code: '', indent: 0 },
  { lineNumber: 4, code: 'int exponentialSearch(int arr[], int n, int target) {', indent: 0, comment: 'Requires sorted array. Useful for unbounded search spaces' },
  { lineNumber: 5, code: '    if (arr[0] == target) return 0; // Check first element', indent: 1 },
  { lineNumber: 6, code: '    int i = 1;', indent: 1, comment: 'Find range by repeated doubling' },
  { lineNumber: 7, code: '    while (i < n && arr[i] <= target) {', indent: 1 },
  { lineNumber: 8, code: '        i = i * 2;', indent: 2, comment: 'Exponential growth: 1, 2, 4, 8, 16...' },
  { lineNumber: 9, code: '    }', indent: 1 },
  { lineNumber: 10, code: '    // Binary search within bounded range [i/2, min(i, n-1)]:', indent: 1 },
  { lineNumber: 11, code: '    int low = i / 2, high = std::min(i, n - 1);', indent: 1 },
  { lineNumber: 12, code: '    while (low <= high) {', indent: 1 },
  { lineNumber: 13, code: '        int mid = low + (high - low) / 2;', indent: 2 },
  { lineNumber: 14, code: '        if (arr[mid] == target) return mid;', indent: 2 },
  { lineNumber: 15, code: '        if (arr[mid] < target) low = mid + 1;', indent: 2 },
  { lineNumber: 16, code: '        else high = mid - 1;', indent: 2 },
  { lineNumber: 17, code: '    }', indent: 1 },
  { lineNumber: 18, code: '    return -1;', indent: 1 },
  { lineNumber: 19, code: '}', indent: 0 }
];

export function generateExponentialSearchSteps(initialArray: number[], targetVal = 25): SortStep[] {
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
    line: 4,
    action: 'init',
    title: `Call exponentialSearch(arr, ${n}, target = ${targetVal})`,
    explanation: `Start Exponential Search for target ${targetVal}. First checks index 0, then repeatedly doubles search boundary (1, 2, 4, 8...) before binary searching the identified interval.`,
    variables: [
      { name: 'n', value: n, type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal
  });

  // Check index 0
  comparisons++;
  const matchZero = arr[0] === targetVal;

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: { 0: matchZero ? 'found' : 'comparing' },
    pointers: { 0: 0 },
    line: 5,
    action: matchZero ? 'found' : 'compare',
    title: `Check index 0: arr[0] == ${targetVal}?`,
    explanation: matchZero
      ? `Found target ${targetVal} immediately at index 0!`
      : `arr[0] = ${arr[0]} is not equal to ${targetVal}. Begin exponential range doubling.`,
    variables: [
      { name: 'arr[0]', value: arr[0], type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal,
    foundIndex: matchZero ? 0 : undefined
  });

  if (matchZero) return steps;

  // Range doubling phase
  let i = 1;
  while (i < n && arr[i] <= targetVal) {
    comparisons++;
    const isExact = arr[i] === targetVal;

    const expStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k === i) expStatus[k] = isExact ? 'found' : 'probe';
      else if (k < i) expStatus[k] = 'subrange';
      else expStatus[k] = 'idle';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: expStatus,
      pointers: { i },
      line: 7,
      action: isExact ? 'found' : 'compare',
      title: `Double Range Probe: i = ${i} (arr[${i}] = ${arr[i]})`,
      explanation: isExact
        ? `Direct hit at boundary index ${i}!`
        : `arr[${i}] = ${arr[i]} <= ${targetVal}. Target is still further to the right. Double index: i = ${i * 2}.`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'arr[i]', value: arr[i], type: 'int' },
        { name: 'target', value: targetVal, type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      foundIndex: isExact ? i : undefined
    });

    if (isExact) return steps;
    i = i * 2;
  }

  // Binary search in bounded range [i/2, min(i, n - 1)]
  let low = Math.floor(i / 2);
  let high = Math.min(i, n - 1);

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: initialStatus,
    pointers: { low, high },
    line: 11,
    action: 'init',
    title: `Bounded Range Found: [${low} ... ${high}]`,
    explanation: `Target must lie between low = ${low} and high = ${high}. Switch to Binary Search in this sub-array.`,
    variables: [
      { name: 'low', value: low, type: 'int' },
      { name: 'high', value: high, type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal,
    subRange: [low, high]
  });

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);
    comparisons++;

    const binStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < low || k > high) binStatus[k] = 'eliminated';
      else if (k === mid) binStatus[k] = arr[mid] === targetVal ? 'found' : 'probe';
      else binStatus[k] = 'subrange';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: binStatus,
      pointers: { low, mid, high },
      line: 13,
      action: arr[mid] === targetVal ? 'found' : 'compare',
      title: `Binary Search mid = ${mid} (arr[${mid}] = ${arr[mid]})`,
      explanation: `Testing midpoint arr[${mid}] = ${arr[mid]} against target ${targetVal}.`,
      variables: [
        { name: 'low', value: low, type: 'int' },
        { name: 'mid', value: mid, type: 'int' },
        { name: 'high', value: high, type: 'int' },
        { name: 'arr[mid]', value: arr[mid], type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      subRange: [low, high],
      foundIndex: arr[mid] === targetVal ? mid : undefined
    });

    if (arr[mid] === targetVal) {
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...binStatus, [mid]: 'found' },
        pointers: { mid },
        line: 14,
        action: 'done',
        title: `Target Found! return ${mid}`,
        explanation: `Target ${targetVal} found at index ${mid} in ${comparisons} comparisons using Exponential Search.`,
        variables: [{ name: 'return', value: mid, type: 'int' }],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: mid
      });
      return steps;
    }

    if (arr[mid] < targetVal) {
      low = mid + 1;
    } else {
      high = mid - 1;
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
    line: 18,
    action: 'not_found',
    title: `Target ${targetVal} Not Found -> return -1`,
    explanation: `Target ${targetVal} is not present in the array. Return -1. Total comparisons: ${comparisons}.`,
    variables: [{ name: 'return', value: -1, type: 'int' }],
    comparisons,
    swaps: 0,
    target: targetVal,
    foundIndex: -1
  });

  return steps;
}

export const exponentialSearchDefinition: AlgorithmDefinition = {
  id: 'exponential',
  category: 'searching',
  name: 'Exponential Search',
  cppFunctionName: 'exponentialSearch(int arr[], int n, int target)',
  complexity: {
    best: 'O(1)',
    average: 'O(log i)',
    worst: 'O(log N)',
    space: 'O(1)',
    summary: 'Finds range where element resides by powers of 2 (1, 2, 4, 8...), then performs binary search. Particularly efficient when target is near the beginning.'
  },
  description: 'Exponential Search works by finding the range where the target resides through repeated doubling (1, 2, 4, 8, ...), then narrowing down with Binary Search inside that range.',
  cppCode,
  generateSteps: generateExponentialSearchSteps,
  keyInvariants: [
    'Requires array to be pre-sorted in ascending order.',
    'Takes O(log i) time where i is the index of the element being searched.',
    'Outperforms standard Binary Search when target is close to index 0.'
  ],
  requiresSorted: true
};
