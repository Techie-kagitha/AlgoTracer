import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O library for beginner C++' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'void bubbleSort(int arr[], int n) {', indent: 0, comment: 'Takes raw integer array and its size n' },
  { lineNumber: 4, code: '    for (int i = 0; i < n - 1; i++) {', indent: 1, comment: 'Pass i: largest unsorted item bubbles to the right' },
  { lineNumber: 5, code: '        bool swapped = false;', indent: 2, comment: 'Flag to check if any swap happens in this pass' },
  { lineNumber: 6, code: '        for (int j = 0; j < n - i - 1; j++) {', indent: 2, comment: 'Compare adjacent elements arr[j] and arr[j+1]' },
  { lineNumber: 7, code: '            if (arr[j] > arr[j + 1]) {', indent: 3, comment: 'If left is greater than right, they are out of order' },
  { lineNumber: 8, code: '                int temp = arr[j];', indent: 4, comment: 'Store arr[j] in temporary variable' },
  { lineNumber: 9, code: '                arr[j] = arr[j + 1];', indent: 4, comment: 'Copy right value into left slot' },
  { lineNumber: 10, code: '                arr[j + 1] = temp;', indent: 4, comment: 'Place saved temp value into right slot' },
  { lineNumber: 11, code: '                swapped = true;', indent: 4, comment: 'Record that a swap took place' },
  { lineNumber: 12, code: '            }', indent: 3 },
  { lineNumber: 13, code: '        }', indent: 2 },
  { lineNumber: 14, code: '        if (!swapped) break;', indent: 2, comment: 'If no swaps occurred, array is already sorted' },
  { lineNumber: 15, code: '    }', indent: 1 },
  { lineNumber: 16, code: '}', indent: 0 }
];

export function generateBubbleSortSteps(initialArray: number[]): SortStep[] {
  const arr = [...initialArray];
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;

  // Step 0: Initial state
  const initialStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) initialStatus[idx] = 'idle';

  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: { ...initialStatus },
    pointers: {},
    line: 3,
    action: 'init',
    title: 'Call bubbleSort(int arr[], int n)',
    explanation: `Array has size n = ${n}. We pass the array and its length into the function to begin sorting.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
  });

  const sortedIndices = new Set<number>();

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;

    // Line 5: Start of outer loop pass
    const passStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      passStatus[k] = sortedIndices.has(k) ? 'sorted' : 'idle';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...passStatus },
      pointers: { i },
      line: 5,
      action: 'init',
      title: `Begin Pass i = ${i}`,
      explanation: `Outer loop iteration i = ${i}. Set swapped = false. The largest elements will bubble to index ${n - 1 - i}.`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'n', value: n, type: 'int' },
        { name: 'swapped', value: 'false', type: 'bool' }
      ],
      comparisons,
      swaps,
    });

    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;

      // Line 7: Comparison step
      const compareStatus: Record<number, ElementStatus> = {};
      for (let k = 0; k < n; k++) {
        if (sortedIndices.has(k)) compareStatus[k] = 'sorted';
        else if (k === j || k === j + 1) compareStatus[k] = 'comparing';
        else compareStatus[k] = 'idle';
      }

      const conditionMet = arr[j] > arr[j + 1];

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: { ...compareStatus },
        pointers: { i, j, 'j+1': j + 1 },
        line: 7,
        action: 'compare',
        title: `Compare arr[${j}] and arr[${j + 1}]`,
        explanation: `Check if (arr[${j}] > arr[${j + 1}]): ${arr[j]} > ${arr[j + 1]} is ${conditionMet ? 'TRUE. Need to swap them.' : 'FALSE. Already in correct relative order.'}`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'j', value: j, type: 'int' },
          { name: 'arr[j]', value: arr[j], type: 'int' },
          { name: 'arr[j+1]', value: arr[j + 1], type: 'int' },
          { name: 'swapped', value: String(swapped), type: 'bool' }
        ],
        comparisons,
        swaps,
      });

      if (conditionMet) {
        swaps++;
        swapped = true;
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        // Line 9: Swap executed using temp
        const swapStatus: Record<number, ElementStatus> = {};
        for (let k = 0; k < n; k++) {
          if (sortedIndices.has(k)) swapStatus[k] = 'sorted';
          else if (k === j || k === j + 1) swapStatus[k] = 'swapping';
          else swapStatus[k] = 'idle';
        }

        steps.push({
          stepNumber: steps.length,
          array: [...arr],
          statusMap: { ...swapStatus },
          pointers: { i, j, 'j+1': j + 1 },
          line: 9,
          action: 'swap',
          title: `Swap: temp = arr[${j}]; arr[${j}] = arr[${j + 1}]; arr[${j + 1}] = temp;`,
          explanation: `Used a 3-step swap with temporary variable 'temp' to exchange ${temp} and ${arr[j]}. Larger value ${temp} moves to the right.`,
          variables: [
            { name: 'temp', value: temp, type: 'int' },
            { name: 'arr[j]', value: arr[j], type: 'int' },
            { name: 'arr[j+1]', value: arr[j + 1], type: 'int' },
            { name: 'swapped', value: 'true', type: 'bool' }
          ],
          comparisons,
          swaps,
        });
      }
    }

    // Mark the element placed at n - i - 1 as sorted
    sortedIndices.add(n - i - 1);

    // Line 14: Check swapped flag
    const endPassStatus: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      endPassStatus[k] = sortedIndices.has(k) ? 'sorted' : 'idle';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: { ...endPassStatus },
      pointers: { i },
      line: 14,
      action: 'init',
      title: `End of Pass ${i + 1}`,
      explanation: swapped
        ? `Pass ${i + 1} finished. arr[${n - i - 1}] (${arr[n - i - 1]}) is now permanently sorted at the end. Next pass begins.`
        : `Early exit triggered: No swaps were made in this pass! The array is already completely sorted.`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'swapped', value: String(swapped), type: 'bool' }
      ],
      comparisons,
      swaps,
    });

    if (!swapped) {
      break;
    }
  }

  // Final step: entire array is sorted
  const finalStatus: Record<number, ElementStatus> = {};
  for (let k = 0; k < n; k++) finalStatus[k] = 'sorted';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: finalStatus,
    pointers: {},
    line: 16,
    action: 'done',
    title: 'Bubble Sort Complete',
    explanation: `Array is fully sorted in ascending order! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
  });

  return steps;
}

export const bubbleSortDefinition: AlgorithmDefinition = {
  id: 'bubble',
  category: 'sorting',
  name: 'Bubble Sort',
  cppFunctionName: 'bubbleSort(int arr[], int n)',
  complexity: {
    best: 'O(N)',
    average: 'O(N²)',
    worst: 'O(N²)',
    space: 'O(1)',
    stable: true,
    inPlace: true,
    summary: 'Iteratively compares adjacent elements in the array and swaps them if they are in the wrong order. With the boolean swapped flag, it achieves O(N) when the input is already sorted.'
  },
  description: 'Bubble Sort repeatedly steps through the array, compares adjacent items, and swaps them if they are in the wrong order. Larger values "bubble" to the end of the array on each pass.',
  cppCode,
  generateSteps: generateBubbleSortSteps,
  keyInvariants: [
    'After pass i, the last i + 1 elements in arr[] are guaranteed to be in their final sorted positions.',
    'If an entire pass completes with zero swaps, the array is already sorted.'
  ]
};
