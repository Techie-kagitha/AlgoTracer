import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus, CallStackFrame } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'int partition(int arr[], int low, int high) {', indent: 0, comment: 'Partition array arr[] using arr[high] as pivot' },
  { lineNumber: 4, code: '    int pivot = arr[high];', indent: 1, comment: 'Pick last element as pivot' },
  { lineNumber: 5, code: '    int i = low - 1;', indent: 1, comment: 'Boundary of elements smaller than pivot' },
  { lineNumber: 6, code: '    for (int j = low; j < high; j++) {', indent: 1, comment: 'Scan from index low up to high - 1' },
  { lineNumber: 7, code: '        if (arr[j] <= pivot) {', indent: 2, comment: 'If element belongs on the left of pivot' },
  { lineNumber: 8, code: '            i++;', indent: 3, comment: 'Expand smaller partition' },
  { lineNumber: 9, code: '            int temp = arr[i];', indent: 3, comment: 'Swap arr[i] and arr[j]' },
  { lineNumber: 10, code: '            arr[i] = arr[j];', indent: 3 },
  { lineNumber: 11, code: '            arr[j] = temp;', indent: 3 },
  { lineNumber: 12, code: '        }', indent: 2 },
  { lineNumber: 13, code: '    }', indent: 1 },
  { lineNumber: 14, code: '    int temp = arr[i + 1];', indent: 1, comment: 'Swap pivot into its final sorted position at index i+1' },
  { lineNumber: 15, code: '    arr[i + 1] = arr[high];', indent: 1 },
  { lineNumber: 16, code: '    arr[high] = temp;', indent: 1 },
  { lineNumber: 17, code: '    return i + 1;', indent: 1, comment: 'Return partition index' },
  { lineNumber: 18, code: '}', indent: 0 },
  { lineNumber: 19, code: '', indent: 0 },
  { lineNumber: 20, code: 'void quickSort(int arr[], int low, int high) {', indent: 0, comment: 'Recursive divide-and-conquer function' },
  { lineNumber: 21, code: '    if (low < high) {', indent: 1, comment: 'Base case: 0 or 1 element subarray is already sorted' },
  { lineNumber: 22, code: '        int pi = partition(arr, low, high);', indent: 2, comment: 'Partition array and get pivot index' },
  { lineNumber: 23, code: '        quickSort(arr, low, pi - 1);', indent: 2, comment: 'Recursively sort left subarray' },
  { lineNumber: 24, code: '        quickSort(arr, pi + 1, high);', indent: 2, comment: 'Recursively sort right subarray' },
  { lineNumber: 25, code: '    }', indent: 1 },
  { lineNumber: 26, code: '}', indent: 0 }
];

export function generateQuickSortSteps(initialArray: number[]): SortStep[] {
  const arr = [...initialArray];
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const sortedSet = new Set<number>();
  const callStack: CallStackFrame[] = [];

  const getStatusMap = (
    low: number,
    high: number,
    pivotIdx?: number,
    iIdx?: number,
    jIdx?: number,
    swapIndices?: [number, number]
  ): Record<number, ElementStatus> => {
    const status: Record<number, ElementStatus> = {};
    for (let k = 0; k < n; k++) {
      if (sortedSet.has(k)) {
        status[k] = 'sorted';
      } else if (k >= low && k <= high) {
        status[k] = 'subrange';
      } else {
        status[k] = 'idle';
      }
    }
    if (pivotIdx !== undefined) status[pivotIdx] = 'pivot';
    if (jIdx !== undefined) status[jIdx] = 'comparing';
    if (swapIndices) {
      status[swapIndices[0]] = 'swapping';
      status[swapIndices[1]] = 'swapping';
    }
    return status;
  };

  // Step 0
  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: getStatusMap(0, n - 1),
    pointers: { low: 0, high: n - 1 },
    line: 20,
    action: 'init',
    title: `Call quickSort(arr, 0, ${n - 1})`,
    explanation: `Start Quick Sort on raw array arr[] with low index 0 and high index ${n - 1}.`,
    variables: [
      { name: 'low', value: 0, type: 'int' },
      { name: 'high', value: n - 1, type: 'int' }
    ],
    comparisons,
    swaps,
    subRange: [0, n - 1],
    callStack: [{ id: '0', functionName: 'quickSort', params: { low: 0, high: n - 1 }, active: true }]
  });

  function partition(low: number, high: number): number {
    const pivot = arr[high];
    let i = low - 1;

    // Line 4: pivot = arr[high]
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: getStatusMap(low, high, high),
      pointers: { low, high, pivot: high },
      line: 4,
      action: 'init',
      title: `Select Pivot: arr[${high}] = ${pivot}`,
      explanation: `Lomuto partition picks the rightmost element in the subarray, arr[${high}] (${pivot}), as the pivot.`,
      variables: [
        { name: 'low', value: low, type: 'int' },
        { name: 'high', value: high, type: 'int' },
        { name: 'pivot', value: pivot, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [low, high],
      callStack: [...callStack]
    });

    // Line 5: int i = low - 1;
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: getStatusMap(low, high, high),
      pointers: { low, high, pivot: high, i },
      line: 5,
      action: 'init',
      title: `Initialize partition index i = ${i}`,
      explanation: `Pointer i marks the right boundary of elements known to be ≤ pivot. Currently set to low - 1 (${i}).`,
      variables: [
        { name: 'i', value: i, type: 'int' },
        { name: 'pivot', value: pivot, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [low, high],
      callStack: [...callStack]
    });

    for (let j = low; j < high; j++) {
      comparisons++;
      const isSmallerOrEqual = arr[j] <= pivot;

      // Line 7: if (arr[j] <= pivot)
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: getStatusMap(low, high, high, i >= low ? i : undefined, j),
        pointers: { low, high, pivot: high, i, j },
        line: 7,
        action: 'compare',
        title: `Compare arr[${j}] (${arr[j]}) with pivot (${pivot})`,
        explanation: `Checking arr[${j}] <= pivot: ${arr[j]} <= ${pivot} is ${isSmallerOrEqual ? 'TRUE. Move into left partition.' : 'FALSE. Keep in right partition.'}`,
        variables: [
          { name: 'j', value: j, type: 'int' },
          { name: 'arr[j]', value: arr[j], type: 'int' },
          { name: 'pivot', value: pivot, type: 'int' },
          { name: 'i', value: i, type: 'int' }
        ],
        comparisons,
        swaps,
        subRange: [low, high],
        callStack: [...callStack]
      });

      if (isSmallerOrEqual) {
        i++;
        // Line 9, 10, 11: i++; swap arr[i], arr[j]
        if (i !== j) {
          swaps++;
          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;

          steps.push({
            stepNumber: steps.length,
            array: [...arr],
            statusMap: getStatusMap(low, high, high, undefined, undefined, [i, j]),
            pointers: { low, high, pivot: high, i, j },
            line: 10,
            action: 'swap',
            title: `i = ${i}; Swap: temp = arr[${i}]; arr[${i}] = arr[${j}]; arr[${j}] = temp;`,
            explanation: `Incremented i to ${i} and swapped arr[${i}] (${arr[j]}) with arr[${j}] (${temp}) using a 3-step swap.`,
            variables: [
              { name: 'i', value: i, type: 'int' },
              { name: 'j', value: j, type: 'int' },
              { name: 'arr[i]', value: arr[i], type: 'int' },
              { name: 'arr[j]', value: arr[j], type: 'int' },
              { name: 'pivot', value: pivot, type: 'int' }
            ],
            comparisons,
            swaps,
            subRange: [low, high],
            callStack: [...callStack]
          });
        }
      }
    }

    // Line 14, 15, 16: swap pivot into final index i + 1
    swaps++;
    const finalPivotIdx = i + 1;
    const tempP = arr[finalPivotIdx];
    arr[finalPivotIdx] = arr[high];
    arr[high] = tempP;
    sortedSet.add(finalPivotIdx);

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: getStatusMap(low, high, undefined, undefined, undefined, [finalPivotIdx, high]),
      pointers: { low, high, 'i+1': finalPivotIdx },
      line: 15,
      action: 'partition',
      title: `Place pivot: Swap arr[${finalPivotIdx}] and arr[${high}]`,
      explanation: `Swapped pivot (${pivot}) into its permanent sorted index ${finalPivotIdx}. Everything to the left is ≤ ${pivot}, and everything to the right is > ${pivot}.`,
      variables: [
        { name: 'pi', value: finalPivotIdx, type: 'int' },
        { name: 'pivot', value: pivot, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [low, high],
      callStack: [...callStack]
    });

    return finalPivotIdx;
  }

  function runQuickSort(low: number, high: number) {
    const frameId = `${low}-${high}`;
    callStack.push({
      id: frameId,
      functionName: 'quickSort',
      params: { low, high },
      active: true
    });

    // Line 21: if (low < high)
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: getStatusMap(low, high),
      pointers: { low, high },
      line: 21,
      action: 'call',
      title: `quickSort(arr, ${low}, ${high})`,
      explanation: low < high
        ? `Subarray range [${low}...${high}] has length ${high - low + 1} > 1. Proceed with partition.`
        : `Base case reached: low (${low}) >= high (${high}). Subarray has 1 or 0 elements and is already sorted.`,
      variables: [
        { name: 'low', value: low, type: 'int' },
        { name: 'high', value: high, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [low, high],
      callStack: [...callStack]
    });

    if (low < high) {
      const pi = partition(low, high);

      // Line 23: quickSort(arr, low, pi - 1)
      runQuickSort(low, pi - 1);

      // Line 24: quickSort(arr, pi + 1, high)
      runQuickSort(pi + 1, high);
    } else if (low === high) {
      sortedSet.add(low);
    }

    callStack.pop();
  }

  runQuickSort(0, n - 1);

  // Final step
  const finalStatus: Record<number, ElementStatus> = {};
  for (let k = 0; k < n; k++) finalStatus[k] = 'sorted';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: finalStatus,
    pointers: {},
    line: 26,
    action: 'done',
    title: 'Quick Sort Complete',
    explanation: `All sub-arrays partitioned and sorted! Total comparisons: ${comparisons}, Total swaps: ${swaps}.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
    callStack: []
  });

  return steps;
}

export const quickSortDefinition: AlgorithmDefinition = {
  id: 'quick',
  category: 'sorting',
  name: 'Quick Sort',
  cppFunctionName: 'quickSort(int arr[], int low, int high)',
  complexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N²)',
    space: 'O(log N)',
    stable: false,
    inPlace: true,
    summary: 'Divide-and-conquer algorithm that partitions an array around a chosen pivot element. High-speed general-purpose sorting algorithm.'
  },
  description: 'Quick Sort chooses a "pivot" element from the array and partitions the other elements into two sub-arrays according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.',
  cppCode,
  generateSteps: generateQuickSortSteps,
  keyInvariants: [
    'After partition(arr, low, high) returns pi, arr[pi] is permanently in its correct final sorted position.',
    'For all k in [low ... pi - 1], arr[k] <= arr[pi].',
    'For all k in [pi + 1 ... high], arr[k] >= arr[pi].'
  ]
};
