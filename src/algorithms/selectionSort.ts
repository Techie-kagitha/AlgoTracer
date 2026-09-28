import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'void selectionSort(int arr[], int n) {', indent: 0, comment: 'Takes raw array arr[] and length n' },
  { lineNumber: 4, code: '    for (int i = 0; i < n - 1; i++) {', indent: 1, comment: 'i marks beginning of the unsorted part of the array' },
  { lineNumber: 5, code: '        int min_idx = i;', indent: 2, comment: 'Assume first unsorted element is the smallest' },
  { lineNumber: 6, code: '        for (int j = i + 1; j < n; j++) {', indent: 2, comment: 'Scan the rest of the array for a smaller value' },
  { lineNumber: 7, code: '            if (arr[j] < arr[min_idx]) {', indent: 3, comment: 'Found a smaller element' },
  { lineNumber: 8, code: '                min_idx = j;', indent: 4, comment: 'Save the index of the new minimum' },
  { lineNumber: 9, code: '            }', indent: 3 },
  { lineNumber: 10, code: '        }', indent: 2 },
  { lineNumber: 11, code: '        if (min_idx != i) {', indent: 2, comment: 'If a smaller element was found, swap it into arr[i]' },
  { lineNumber: 12, code: '            int temp = arr[i];', indent: 3, comment: 'Classic 3-step swap using temp' },
  { lineNumber: 13, code: '            arr[i] = arr[min_idx];', indent: 3 },
  { lineNumber: 14, code: '            arr[min_idx] = temp;', indent: 3 },
  { lineNumber: 15, code: '        }', indent: 2 },
  { lineNumber: 16, code: '    }', indent: 1 },
  { lineNumber: 17, code: '}', indent: 0 }
];

export function generateSelectionSortSteps(initialArray: number[]): SortStep[] {
  const arr = [...initialArray];
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  const initialStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) initialStatus[idx] = 'idle';

  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: {},
    line: 3,
    action: 'init',
    title: 'Call selectionSort(int arr[], int n)',
    explanation: `Array has size n = ${n}. We will divide arr[] into a sorted prefix [0...i-1] and unsorted suffix [i...${n - 1}].`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
  });

  const sortedIndices = new Set<number>();

  for (let i = 0; i < n - 1; i++) {
    let min_idx = i;

    // Line 5: set min_idx = i
    const step5Status: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (sortedIndices.has(k)) step5Status[k] = 'sorted';
      else if (k === i) step5Status[k] = 'pivot'; // use pivot color for current minimum
      else step5Status[k] = 'idle';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...step5Status },
      pointers: { i, min_idx },
      line: 5,
      action: 'init',
      title: `Set min_idx = ${i} (value: ${arr[i]})`,
      explanation: `Assume current element at index ${i} (${arr[i]}) is the smallest in unsorted range [${i}...${n - 1}].`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'min_idx', value: min_idx, type: 'int' },
        { name: 'arr[min_idx]', value: arr[min_idx], type: 'int' }
      ],
      comparisons,
      swaps,
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;

      // Line 7: compare arr[j] with arr[min_idx]
      const compareStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (sortedIndices.has(k)) compareStatus[k] = 'sorted';
        else if (k === min_idx) compareStatus[k] = 'pivot';
        else if (k === j) compareStatus[k] = 'comparing';
        else compareStatus[k] = 'idle';
      }

      const isSmaller = arr[j] < arr[min_idx];

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...compareStatus },
        pointers: { i, min_idx, j },
        line: 7,
        action: 'compare',
        title: `Compare arr[${j}] (${arr[j]}) with arr[min_idx] (${arr[min_idx]})`,
        explanation: `Checking if arr[${j}] < arr[min_idx]: ${arr[j]} < ${arr[min_idx]} is ${isSmaller ? 'TRUE. Found new candidate minimum!' : 'FALSE. Keep current minimum.'}`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'j', value: j, type: 'int' },
          { name: 'min_idx', value: min_idx, type: 'int' },
          { name: 'arr[j]', value: arr[j], type: 'int' },
          { name: 'arr[min_idx]', value: arr[min_idx], type: 'int' }
        ],
        comparisons,
        swaps,
      });

      if (isSmaller) {
        min_idx = j;
        // Line 8: update min_idx
        const updateStatus: Record<number, ElementStatus> = {};
        for (let k = 0; k < n; k++) {
          if (sortedIndices.has(k)) updateStatus[k] = 'sorted';
          else if (k === min_idx) updateStatus[k] = 'pivot';
          else updateStatus[k] = 'idle';
        }

        steps.push({
          stepNumber: steps.length,
          array: [...arr],
          statusMap: { ...updateStatus },
          pointers: { i, min_idx, j },
          line: 8,
          action: 'assign',
          title: `Update min_idx = ${min_idx}`,
          explanation: `New minimum candidate is ${arr[min_idx]} at index ${min_idx}.`,
          variables: [
            { name: 'i', value: i, type: 'int' },
            { name: 'min_idx', value: min_idx, type: 'int' },
            { name: 'arr[min_idx]', value: arr[min_idx], type: 'int' }
          ],
          comparisons,
          swaps,
        });
      }
    }

    // Line 11 to 14: Swap min_idx with i if needed
    if (min_idx !== i) {
      swaps++;
      const valI = arr[i];
      const valMin = arr[min_idx];
      arr[i] = valMin;
      arr[min_idx] = valI;

      const swapStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (sortedIndices.has(k)) swapStatus[k] = 'sorted';
        else if (k === i || k === min_idx) swapStatus[k] = 'swapping';
        else swapStatus[k] = 'idle';
      }

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...swapStatus },
        pointers: { i, min_idx },
        line: 12,
        action: 'swap',
        title: `Swap: temp = arr[${i}]; arr[${i}] = arr[${min_idx}]; arr[${min_idx}] = temp;`,
        explanation: `Swapped minimum element ${valMin} from index ${min_idx} into its final sorted position at index ${i}.`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'min_idx', value: min_idx, type: 'int' },
          { name: 'arr[i]', value: arr[i], type: 'int' },
          { name: 'arr[min_idx]', value: arr[min_idx], type: 'int' }
        ],
        comparisons,
        swaps,
      });
    } else {
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...step5Status, [i]: 'sorted' },
        pointers: { i },
        line: 11,
        action: 'init',
        title: `arr[${i}] is already the minimum`,
        explanation: `arr[${i}] (${arr[i]}) was already the minimum in the unsorted suffix. No swap needed.`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'min_idx', value: min_idx, type: 'int' }
        ],
        comparisons,
        swaps,
      });
    }

    sortedIndices.add(i);
  }

  // The last element is automatically sorted
  sortedIndices.add(n - 1);
  const finalStatus: Record<number, ElementStatus> = {};
  for (let k = 0; k < n; k++) finalStatus[k] = 'sorted';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: finalStatus,
    pointers: {},
    line: 17,
    action: 'done',
    title: 'Selection Sort Complete',
    explanation: `All ${n} elements placed into final positions. Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
  });

  return steps;
}

export const selectionSortDefinition: AlgorithmDefinition = {
  id: 'selection',
  category: 'sorting',
  name: 'Selection Sort',
  cppFunctionName: 'selectionSort(int arr[], int n)',
  complexity: {
    best: 'O(N²)',
    average: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: false,
    inPlace: true,
    summary: 'Always performs N*(N-1)/2 comparisons regardless of initial array arrangement, but performs at most N-1 swaps (minimal memory writes).'
  },
  description: 'Selection Sort divides the array into a sorted prefix and unsorted suffix. In each pass, it scans the unsorted suffix to locate the minimum element and swaps it to the front.',
  cppCode,
  generateSteps: generateSelectionSortSteps,
  keyInvariants: [
    'Prefix arr[0...i-1] is sorted and contains the i smallest elements in the entire array.',
    'No element in arr[i...n-1] is smaller than any element in arr[0...i-1].',
    'Performs at most N - 1 swaps, making it useful when write operations are costly.'
  ]
};
