import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '#include <cmath>', indent: 0, comment: 'For sqrt() function' },
  { lineNumber: 3, code: '', indent: 0 },
  { lineNumber: 4, code: 'int jumpSearch(int arr[], int n, int target) {', indent: 0, comment: 'Requires sorted array. Steps in blocks of size sqrt(n)' },
  { lineNumber: 5, code: '    int step = std::sqrt(n);', indent: 1, comment: 'Optimal block step size is sqrt(n)' },
  { lineNumber: 6, code: '    int prev = 0;', indent: 1, comment: 'Start of the current block' },
  { lineNumber: 7, code: '    while (arr[std::min(step, n) - 1] < target) {', indent: 1, comment: 'Jump forward block by block' },
  { lineNumber: 8, code: '        prev = step;', indent: 2, comment: 'Advance block boundary' },
  { lineNumber: 9, code: '        step += std::sqrt(n);', indent: 2, comment: 'Jump to next block' },
  { lineNumber: 10, code: '        if (prev >= n) return -1;', indent: 2, comment: 'Jumped past end of array' },
  { lineNumber: 11, code: '    }', indent: 1 },
  { lineNumber: 12, code: '    while (arr[prev] < target) {', indent: 1, comment: 'Linear search within candidate block' },
  { lineNumber: 13, code: '        prev++;', indent: 2 },
  { lineNumber: 14, code: '        if (prev == std::min(step, n)) return -1;', indent: 2, comment: 'Reached end of block without match' },
  { lineNumber: 15, code: '    }', indent: 1 },
  { lineNumber: 16, code: '    if (arr[prev] == target) return prev;', indent: 1, comment: 'Target found!' },
  { lineNumber: 17, code: '    return -1;', indent: 1 },
  { lineNumber: 18, code: '}', indent: 0 }
];

export function generateJumpSearchSteps(initialArray: number[], targetVal = 25): SortStep[] {
  const arr = [...initialArray].sort((a, b) => a - b);
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;

  const initialStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) initialStatus[idx] = 'idle';

  const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));

  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: {},
    line: 4,
    action: 'init',
    title: `Call jumpSearch(arr, ${n}, target = ${targetVal})`,
    explanation: `Begin Jump Search on sorted array of size ${n}. Computed optimal block jump size: sqrt(${n}) ≈ ${blockSize}.`,
    variables: [
      { name: 'n', value: n, type: 'int' },
      { name: 'step', value: blockSize, type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal
  });

  let step = blockSize;
  let prev = 0;

  // Jump phase
  while (true) {
    const checkIdx = Math.min(step, n) - 1;
    comparisons++;
    const isSmaller = arr[checkIdx] < targetVal;

    const statusMap: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < prev) statusMap[k] = 'eliminated';
      else if (k >= prev && k <= checkIdx) statusMap[k] = 'subrange';
      else statusMap[k] = 'idle';
    }
    statusMap[checkIdx] = 'comparing';

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap,
      pointers: { prev, check: checkIdx, step: Math.min(step, n) },
      line: 7,
      action: 'compare',
      title: `Block Boundary Check: arr[${checkIdx}] (${arr[checkIdx]}) < ${targetVal}?`,
      explanation: `Testing right end of block [${prev}...${checkIdx}]. Since arr[${checkIdx}] = ${arr[checkIdx]} ${isSmaller ? '< ' + targetVal + ', jump to next block.' : '>= ' + targetVal + ', target must be in this block!'}`,
      variables: [
        { name: 'prev', value: prev, type: 'int' },
        { name: 'checkIdx', value: checkIdx, type: 'int' },
        { name: 'arr[checkIdx]', value: arr[checkIdx], type: 'int' },
        { name: 'target', value: targetVal, type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      subRange: [prev, checkIdx]
    });

    if (!isSmaller) {
      break;
    }

    prev = step;
    step += blockSize;

    if (prev >= n) {
      // Exceeded array boundary
      const notFoundStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) notFoundStatus[k] = 'eliminated';

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: notFoundStatus,
        pointers: {},
        line: 10,
        action: 'not_found',
        title: `prev (${prev}) >= n (${n}) -> return -1`,
        explanation: `Jumped beyond the end of the array. Target ${targetVal} is larger than all elements. Return -1.`,
        variables: [{ name: 'return', value: -1, type: 'int' }],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: -1
      });
      return steps;
    }
  }

  // Linear search phase within block
  const blockLimit = Math.min(step, n);

  while (prev < blockLimit) {
    comparisons++;
    const isSmaller = arr[prev] < targetVal;
    const isMatch = arr[prev] === targetVal;

    const blockStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < prev) blockStatus[k] = 'eliminated';
      else if (k >= blockLimit) blockStatus[k] = 'eliminated';
      else if (k === prev) blockStatus[k] = isMatch ? 'found' : 'comparing';
      else blockStatus[k] = 'subrange';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: blockStatus,
      pointers: { prev },
      line: 12,
      action: isMatch ? 'found' : 'compare',
      title: `Linear scan in block: arr[${prev}] (${arr[prev]}) == ${targetVal}?`,
      explanation: isMatch
        ? `Target value ${targetVal} matched at index ${prev}!`
        : `arr[${prev}] (${arr[prev]}) < ${targetVal}. Advance prev to ${prev + 1}.`,
      variables: [
        { name: 'prev', value: prev, type: 'int' },
        { name: 'arr[prev]', value: arr[prev], type: 'int' },
        { name: 'target', value: targetVal, type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      subRange: [prev, blockLimit - 1],
      foundIndex: isMatch ? prev : undefined
    });

    if (isMatch) {
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...blockStatus, [prev]: 'found' },
        pointers: { prev },
        line: 16,
        action: 'done',
        title: `Target Found! return ${prev}`,
        explanation: `Target ${targetVal} found at index ${prev} in ${comparisons} comparisons using Jump Search.`,
        variables: [{ name: 'return', value: prev, type: 'int' }],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: prev
      });
      return steps;
    }

    if (!isSmaller) {
      break;
    }

    prev++;
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
    title: `Block searched. Target ${targetVal} not present -> return -1`,
    explanation: `Target is not in the block. Return -1. Total comparisons: ${comparisons}.`,
    variables: [{ name: 'return', value: -1, type: 'int' }],
    comparisons,
    swaps: 0,
    target: targetVal,
    foundIndex: -1
  });

  return steps;
}

export const jumpSearchDefinition: AlgorithmDefinition = {
  id: 'jump',
  category: 'searching',
  name: 'Jump Search',
  cppFunctionName: 'jumpSearch(int arr[], int n, int target)',
  complexity: {
    best: 'O(1)',
    average: 'O(√N)',
    worst: 'O(√N)',
    space: 'O(1)',
    summary: 'Jumps forward in fixed blocks of size √N, then performs a linear search inside the candidate block. Requires sorted array.'
  },
  description: 'Jump Search is a middle ground between Linear Search and Binary Search. It skips ahead in fixed blocks of size √N, checking block boundaries before performing a small linear search.',
  cppCode,
  generateSteps: generateJumpSearchSteps,
  keyInvariants: [
    'Optimal block step size is m = floor(sqrt(n)).',
    'Total comparisons in worst-case: (n/m) jumps + (m - 1) linear steps = O(√N).',
    'Particularly advantageous on hardware where jumping backwards is expensive.'
  ],
  requiresSorted: true
};
