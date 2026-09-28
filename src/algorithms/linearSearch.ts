import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'int linearSearch(int arr[], int n, int target) {', indent: 0, comment: 'Scans array sequentially from index 0 to n-1' },
  { lineNumber: 4, code: '    for (int i = 0; i < n; i++) {', indent: 1, comment: 'Inspect element at index i' },
  { lineNumber: 5, code: '        if (arr[i] == target) {', indent: 2, comment: 'Check if current element matches target' },
  { lineNumber: 6, code: '            return i; // Found! Return matching index', indent: 3 },
  { lineNumber: 7, code: '        }', indent: 2 },
  { lineNumber: 8, code: '    }', indent: 1 },
  { lineNumber: 9, code: '    return -1; // Target not found in array', indent: 1 },
  { lineNumber: 10, code: '}', indent: 0 }
];

export function generateLinearSearchSteps(initialArray: number[], targetVal = 25): SortStep[] {
  const arr = [...initialArray];
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
    title: `Call linearSearch(arr, ${n}, target = ${targetVal})`,
    explanation: `Begin Linear Search for target value ${targetVal} across array arr[] of size ${n}. Does not require the array to be sorted.`,
    variables: [
      { name: 'n', value: n, type: 'int' },
      { name: 'target', value: targetVal, type: 'int' }
    ],
    comparisons,
    swaps: 0,
    target: targetVal
  });

  let foundIndex = -1;

  for (let i = 0; i < n; i++) {
    comparisons++;
    const isMatch = arr[i] === targetVal;

    const currentStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < i) currentStatus[k] = 'eliminated';
      else if (k === i) currentStatus[k] = isMatch ? 'found' : 'comparing';
      else currentStatus[k] = 'idle';
    }

    // Line 5: if (arr[i] == target)
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...currentStatus },
      pointers: { i },
      line: 5,
      action: isMatch ? 'found' : 'compare',
      title: `Compare arr[${i}] (${arr[i]}) == target (${targetVal})`,
      explanation: `Testing if arr[${i}] (${arr[i]}) == ${targetVal}. Condition is ${isMatch ? 'TRUE! Target found!' : 'FALSE. Move pointer i to next slot.'}`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'arr[i]', value: arr[i], type: 'int' },
        { name: 'target', value: targetVal, type: 'int' }
      ],
      comparisons,
      swaps: 0,
      target: targetVal,
      foundIndex: isMatch ? i : undefined
    });

    if (isMatch) {
      foundIndex = i;

      // Line 6: return i;
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...currentStatus, [i]: 'found' },
        pointers: { i },
        line: 6,
        action: 'done',
        title: `Return index ${i} (arr[${i}] = ${targetVal})`,
        explanation: `Target value ${targetVal} successfully found at index ${i} after ${comparisons} comparison${comparisons === 1 ? '' : 's'}. Function returns ${i}.`,
        variables: [
          { name: 'return', value: i, type: 'int' },
          { name: 'target', value: targetVal, type: 'int' }
        ],
        comparisons,
        swaps: 0,
        target: targetVal,
        foundIndex: i
      });
      return steps;
    }
  }

  // Not found - line 9: return -1;
  const notFoundStatus: Record<number, ElementStatus> = {};
  for (let k = 0; k < n; k++) notFoundStatus[k] = 'eliminated';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: notFoundStatus,
    pointers: {},
    line: 9,
    action: 'not_found',
    title: `Target ${targetVal} Not Found -> return -1`,
    explanation: `Scanned all ${n} elements in the array. None matched target ${targetVal}. Function returns -1 to indicate target is absent.`,
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

export const linearSearchDefinition: AlgorithmDefinition = {
  id: 'linear',
  category: 'searching',
  name: 'Linear Search',
  cppFunctionName: 'linearSearch(int arr[], int n, int target)',
  complexity: {
    best: 'O(1)',
    average: 'O(N)',
    worst: 'O(N)',
    space: 'O(1)',
    summary: 'Sequentially checks each element of the array until a match is found or the whole array has been searched. Does NOT require array to be sorted.'
  },
  description: 'Linear Search is the most fundamental search algorithm. It checks every array item from left to right one by one until it finds the target or reaches the end of the array.',
  cppCode,
  generateSteps: generateLinearSearchSteps,
  keyInvariants: [
    'No assumptions about array ordering: works equally on sorted or unsorted arrays.',
    'Best case O(1) when target is at index 0.',
    'Worst case O(N) when target is at index n - 1 or not present at all.'
  ],
  requiresSorted: false
};
