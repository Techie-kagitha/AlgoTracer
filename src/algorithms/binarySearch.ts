import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'int binarySearch(int arr[], int n, int target) {', indent: 0, comment: 'Requires array arr[] to be sorted in ascending order' },
  { lineNumber: 4, code: '    int low = 0;', indent: 1, comment: 'Left boundary of search window' },
  { lineNumber: 5, code: '    int high = n - 1;', indent: 1, comment: 'Right boundary of search window' },
  { lineNumber: 6, code: '    while (low <= high) {', indent: 1, comment: 'Continue while search window is non-empty' },
  { lineNumber: 7, code: '        int mid = low + (high - low) / 2;', indent: 2, comment: 'Calculate midpoint safely (prevents integer overflow)' },
  { lineNumber: 8, code: '        if (arr[mid] == target) {', indent: 2, comment: 'Target found at midpoint!' },
  { lineNumber: 9, code: '            return mid;', indent: 3 },
  { lineNumber: 10, code: '        }', indent: 2 },
  { lineNumber: 11, code: '        if (arr[mid] < target) {', indent: 2, comment: 'Target must be in the right half' },
  { lineNumber: 12, code: '            low = mid + 1;', indent: 3, comment: 'Discard left half [low ... mid]' },
  { lineNumber: 13, code: '        } else {', indent: 2, comment: 'Target must be in the left half' },
  { lineNumber: 14, code: '            high = mid - 1;', indent: 3, comment: 'Discard right half [mid ... high]' },
  { lineNumber: 15, code: '        }', indent: 2 },
  { lineNumber: 16, code: '    }', indent: 1 },
  { lineNumber: 17, code: '    return -1; // Target not found' , indent: 1 },
  { lineNumber: 18, code: '}', indent: 0 }
];

export function generateBinarySearchSteps(initialArray: number[], targetVal = 25): SortStep[] {
  // Binary search requires sorted array
  const arr = [...initialArray].sort((a, b) => a - b);
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;

  // Step 0: Initial call
  const initialStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) initialStatus[idx] = 'idle';

  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: {},
    line: 3,
    action: 'init',
    title: `Call binarySearch(arr, ${n}, target = ${targetVal})`,
    explanation: `Start Binary Search for target value ${targetVal} on sorted array of size ${n}. At each step, we cut the search space in half!`,
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

  // Line 4-5: Initialize boundaries
  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: { low, high },
    line: 5,
    action: 'init',
    title: `Initialize boundaries: low = ${low}, high = ${high}`,
    explanation: `Search space initialized to full range [${low}...${high}]. Array length is ${n}.`,
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

    // Mark current active window
    const windowStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < low || k > high) windowStatus[k] = 'eliminated';
      else if (k === mid) windowStatus[k] = 'probe';
      else windowStatus[k] = 'subrange';
    }

    // Line 7: Compute midpoint
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...windowStatus },
      pointers: { low, mid, high },
      line: 7,
      action: 'compare',
      title: `Compute mid = ${low} + (${high} - ${low})/2 = ${mid} (arr[${mid}] = ${arr[mid]})`,
      explanation: `Inspecting midpoint index ${mid} with value ${arr[mid]}. Active search range contains ${high - low + 1} candidate elements.`,
      variables: [
        { name: 'low', value: low, type: 'int' },
        { name: 'mid', value: mid, type: 'int' },
        { name: 'high', value: high, type: 'int' },
        { name: 'arr[mid]', value: arr[mid], type: 'int' },
        { name: 'target', value: targetVal, type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      subRange: [low, high]
    });

    // Line 8: Check if match
    if (arr[mid] === targetVal) {
      windowStatus[mid] = 'found';

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...windowStatus },
        pointers: { mid },
        line: 9,
        action: 'found',
        title: `Match Found! arr[${mid}] == ${targetVal} -> return ${mid}`,
        explanation: `Target value ${targetVal} found at index ${mid} after only ${comparisons} comparison${comparisons === 1 ? '' : 's'}. Function returns ${mid}.`,
        variables: [
          { name: 'return', value: mid, type: 'int' },
          { name: 'target', value: targetVal, type: 'int' }
        ],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: mid
      });
      return steps;
    }

    if (arr[mid] < targetVal) {
      // Discard left half
      const nextLow = mid + 1;
      const discardedStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (k <= mid || k > high) discardedStatus[k] = 'eliminated';
        else discardedStatus[k] = 'subrange';
      }

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...discardedStatus },
        pointers: { low: nextLow, high },
        line: 12,
        action: 'eliminate',
        title: `arr[${mid}] (${arr[mid]}) < ${targetVal} -> low = ${nextLow}`,
        explanation: `Since ${arr[mid]} < ${targetVal} and the array is sorted, the target CANNOT be in [${low}...${mid}]. Discard left half and set low = ${nextLow}.`,
        variables: [
          { name: 'low', value: nextLow, type: 'int' },
          { name: 'high', value: high, type: 'int' },
          { name: 'target', value: targetVal, type: 'int' }
        ],
        comparisons,
        swaps: 0,
        target: targetVal,
        subRange: [nextLow, high]
      });

      low = nextLow;
    } else {
      // Discard right half
      const nextHigh = mid - 1;
      const discardedStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (k < low || k >= mid) discardedStatus[k] = 'eliminated';
        else discardedStatus[k] = 'subrange';
      }

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...discardedStatus },
        pointers: { low, high: nextHigh },
        line: 14,
        action: 'eliminate',
        title: `arr[${mid}] (${arr[mid]}) > ${targetVal} -> high = ${nextHigh}`,
        explanation: `Since ${arr[mid]} > ${targetVal} and the array is sorted, the target CANNOT be in [${mid}...${high}]. Discard right half and set high = ${nextHigh}.`,
        variables: [
          { name: 'low', value: low, type: 'int' },
          { name: 'high', value: nextHigh, type: 'int' },
          { name: 'target', value: targetVal, type: 'int' }
        ],
        comparisons,
        swaps: 0,
        target: targetVal,
        subRange: [low, nextHigh]
      });

      high = nextHigh;
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
    line: 17,
    action: 'not_found',
    title: `low (${low}) > high (${high}) -> return -1`,
    explanation: `Search range is empty! Target ${targetVal} is not in the array. Function returns -1. Total comparisons: ${comparisons}.`,
    variables: [
      { name: 'return', value: -1, type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal,
    foundIndex: -1
  });

  return steps;
}

export const binarySearchDefinition: AlgorithmDefinition = {
  id: 'binary',
  category: 'searching',
  name: 'Binary Search',
  cppFunctionName: 'binarySearch(int arr[], int n, int target)',
  complexity: {
    best: 'O(1)',
    average: 'O(log N)',
    worst: 'O(log N)',
    space: 'O(1)',
    summary: 'Repeatedly divides the search interval in half. Requires the array to be sorted.'
  },
  description: 'Binary Search is an exceptionally efficient algorithm for finding an item in a sorted array. By comparing the target with the middle element, it eliminates half of the remaining array on every step.',
  cppCode,
  generateSteps: generateBinarySearchSteps,
  keyInvariants: [
    'Requires array to be pre-sorted in ascending order.',
    'Halves the remaining candidate elements at each step (log₂ N comparisons maximum).',
    'Uses mid = low + (high - low) / 2 to avoid 32-bit signed integer overflow in C++.'
  ],
  requiresSorted: true
};
