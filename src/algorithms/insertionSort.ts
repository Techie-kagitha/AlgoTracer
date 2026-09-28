import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'void insertionSort(int arr[], int n) {', indent: 0, comment: 'Takes raw integer array and its length n' },
  { lineNumber: 4, code: '    for (int i = 1; i < n; i++) {', indent: 1, comment: 'Pick element arr[i] to insert into sorted prefix arr[0...i-1]' },
  { lineNumber: 5, code: '        int key = arr[i];', indent: 2, comment: 'Save the current element as key' },
  { lineNumber: 6, code: '        int j = i - 1;', indent: 2, comment: 'Scan backwards starting from index i-1' },
  { lineNumber: 7, code: '        while (j >= 0 && arr[j] > key) {', indent: 2, comment: 'Shift elements greater than key one spot to the right' },
  { lineNumber: 8, code: '            arr[j + 1] = arr[j];', indent: 3, comment: 'Shift element to the right' },
  { lineNumber: 9, code: '            j = j - 1;', indent: 3, comment: 'Move one index to the left' },
  { lineNumber: 10, code: '        }', indent: 2 },
  { lineNumber: 11, code: '        arr[j + 1] = key;', indent: 2, comment: 'Place key into the vacated correct position' },
  { lineNumber: 12, code: '    }', indent: 1 },
  { lineNumber: 13, code: '}', indent: 0 }
];

export function generateInsertionSortSteps(initialArray: number[]): SortStep[] {
  const arr = [...initialArray];
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0; // counts shifts/writes

  const initialStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) initialStatus[idx] = idx === 0 ? 'sorted' : 'idle';

  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: {},
    line: 3,
    action: 'init',
    title: 'Call insertionSort(int arr[], int n)',
    explanation: `Array has ${n} elements. Index 0 ([${arr[0]}]) is trivially sorted as a 1-element prefix. We begin inserting from index 1.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];

    // Line 5: extract key
    const extractStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (k < i) extractStatus[k] = 'sorted';
      else if (k === i) extractStatus[k] = 'key';
      else extractStatus[k] = 'idle';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...extractStatus },
      pointers: { i },
      line: 5,
      action: 'init',
      title: `Extract key = arr[${i}] (${key})`,
      explanation: `Element at index ${i} with value ${key} is stored in variable 'key' to be inserted into the sorted subarray arr[0...${i - 1}].`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'key', value: key, type: 'int' }
      ],
      comparisons,
      swaps,
    });

    let j = i - 1;

    // Line 6: j = i - 1
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...extractStatus },
      pointers: { i, j },
      line: 6,
      action: 'init',
      title: `Initialize j = ${j}`,
      explanation: `Set pointer j = ${j} to scan backwards through the sorted prefix of the array.`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'j', value: j, type: 'int' },
        { name: 'key', value: key, type: 'int' }
      ],
      comparisons,
      swaps,
    });

    while (j >= 0) {
      comparisons++;
      const whileCondition = arr[j] > key;

      const compStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (k < i) compStatus[k] = 'sorted';
        else compStatus[k] = 'idle';
      }
      compStatus[j] = 'comparing';
      compStatus[i] = 'key';

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...compStatus },
        pointers: { i, j },
        line: 7,
        action: 'compare',
        title: `Compare arr[${j}] (${arr[j]}) > key (${key})`,
        explanation: `Condition (arr[${j}] > key): ${arr[j]} > ${key} is ${whileCondition ? 'TRUE. Need to shift arr[j] to the right.' : 'FALSE. Correct insertion slot found!'}.`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'j', value: j, type: 'int' },
          { name: 'arr[j]', value: arr[j], type: 'int' },
          { name: 'key', value: key, type: 'int' }
        ],
        comparisons,
        swaps,
      });

      if (!whileCondition) {
        break;
      }

      // Line 8: Shift arr[j] to arr[j + 1]
      swaps++;
      arr[j + 1] = arr[j];

      const shiftStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (k < i) shiftStatus[k] = 'sorted';
        else shiftStatus[k] = 'idle';
      }
      shiftStatus[j + 1] = 'overwriting';
      shiftStatus[j] = 'swapping';

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...shiftStatus },
        pointers: { i, j, 'j+1': j + 1 },
        line: 8,
        action: 'shift',
        title: `arr[${j + 1}] = arr[${j}] (Shift ${arr[j]} right)`,
        explanation: `Copied value ${arr[j]} from index ${j} to index ${j + 1} to make space for the key.`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'j', value: j, type: 'int' },
          { name: 'arr[j+1]', value: arr[j + 1], type: 'int' },
          { name: 'key', value: key, type: 'int' }
        ],
        comparisons,
        swaps,
      });

      // Line 9: j = j - 1
      j = j - 1;
    }

    // Line 11: arr[j + 1] = key
    swaps++;
    arr[j + 1] = key;

    const insertStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k <= i; k++) {
      insertStatus[k] = 'sorted';
    }
    for (let k = i + 1; k < n; k++) {
      insertStatus[k] = 'idle';
    }
    insertStatus[j + 1] = 'overwriting';

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...insertStatus },
      pointers: { i, 'j+1': j + 1 },
      line: 11,
      action: 'assign',
      title: `arr[${j + 1}] = key (${key})`,
      explanation: `Inserted key value ${key} into position ${j + 1}. Subarray arr[0...${i}] is now completely sorted!`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'j+1', value: j + 1, type: 'int' },
        { name: 'key', value: key, type: 'int' }
      ],
      comparisons,
      swaps,
    });
  }

  // Final step
  const finalStatus: Record<number, ElementStatus> = {};
  for (let k = 0; k < n; k++) finalStatus[k] = 'sorted';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: finalStatus,
    pointers: {},
    line: 13,
    action: 'done',
    title: 'Insertion Sort Complete',
    explanation: `Array is completely sorted! Total comparisons: ${comparisons}, Total shifts/writes: ${swaps}.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
  });

  return steps;
}

export const insertionSortDefinition: AlgorithmDefinition = {
  id: 'insertion',
  name: 'Insertion Sort',
  cppFunctionName: 'insertionSort(int arr[], int n)',
  complexity: {
    best: 'O(N)',
    average: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    summary: 'Builds sorted array one element at a time by inserting each into its proper position. Highly efficient for small arrays (n ≤ 16) and nearly sorted data.'
  },
  description: 'Insertion Sort works much like sorting a hand of playing cards. You take one card from the unsorted deck and insert it into its correct position relative to the sorted cards in your hand.',
  cppCode,
  generateSteps: generateInsertionSortSteps,
  keyInvariants: [
    'At the start of iteration i, subarray arr[0...i-1] consists of the original elements from those positions, in sorted order.',
    'Adaptive: Requires only O(N) operations when the input array is already sorted or nearly sorted.',
    'Very intuitive for beginners to trace step-by-step with pen and paper.'
  ]
};
