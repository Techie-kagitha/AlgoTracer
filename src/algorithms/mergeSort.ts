import { AlgorithmDefinition, CppCodeLine, SortStep, ElementStatus, CallStackFrame } from '../types/sorting';

const cppCode: CppCodeLine[] = [
  { lineNumber: 1, code: '#include <iostream>', indent: 0, comment: 'Standard I/O header' },
  { lineNumber: 2, code: '', indent: 0 },
  { lineNumber: 3, code: 'void merge(int arr[], int left, int mid, int right) {', indent: 0, comment: 'Merge two sorted subarrays: arr[left...mid] and arr[mid+1...right]' },
  { lineNumber: 4, code: '    int n1 = mid - left + 1, n2 = right - mid;', indent: 1, comment: 'Sizes of left and right subarrays' },
  { lineNumber: 5, code: '    int L[50], R[50]; // Temporary arrays', indent: 1, comment: 'Temporary arrays to hold values during merge' },
  { lineNumber: 6, code: '    for (int i = 0; i < n1; i++) L[i] = arr[left + i];', indent: 1, comment: 'Copy data into temporary array L[]' },
  { lineNumber: 7, code: '    for (int j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];', indent: 1, comment: 'Copy data into temporary array R[]' },
  { lineNumber: 8, code: '    int i = 0, j = 0, k = left;', indent: 1, comment: 'Pointers for L[], R[], and target array arr[]' },
  { lineNumber: 9, code: '    while (i < n1 && j < n2) {', indent: 1, comment: 'Merge elements back in sorted order' },
  { lineNumber: 10, code: '        if (L[i] <= R[j]) {', indent: 2, comment: 'Compare head of L against head of R' },
  { lineNumber: 11, code: '            arr[k] = L[i++];', indent: 3, comment: 'Take smaller element from L[]' },
  { lineNumber: 12, code: '        } else {', indent: 2 },
  { lineNumber: 13, code: '            arr[k] = R[j++];', indent: 3, comment: 'Take smaller element from R[]' },
  { lineNumber: 14, code: '        }', indent: 2 },
  { lineNumber: 15, code: '        k++;', indent: 2 },
  { lineNumber: 16, code: '    }', indent: 1 },
  { lineNumber: 17, code: '    while (i < n1) arr[k++] = L[i++];', indent: 1, comment: 'Copy any remaining elements from L[]' },
  { lineNumber: 18, code: '    while (j < n2) arr[k++] = R[j++];', indent: 1, comment: 'Copy any remaining elements from R[]' },
  { lineNumber: 19, code: '}', indent: 0 },
  { lineNumber: 20, code: '', indent: 0 },
  { lineNumber: 21, code: 'void mergeSort(int arr[], int left, int right) {', indent: 0, comment: 'Recursive divide-and-conquer function' },
  { lineNumber: 22, code: '    if (left < right) {', indent: 1, comment: 'Base case: 1-element subarray is already sorted' },
  { lineNumber: 23, code: '        int mid = left + (right - left) / 2;', indent: 2, comment: 'Calculate midpoint' },
  { lineNumber: 24, code: '        mergeSort(arr, left, mid);', indent: 2, comment: 'Recursively sort left half' },
  { lineNumber: 25, code: '        mergeSort(arr, mid + 1, right);', indent: 2, comment: 'Recursively sort right half' },
  { lineNumber: 26, code: '        merge(arr, left, mid, right);', indent: 2, comment: 'Merge the two sorted halves' },
  { lineNumber: 27, code: '    }', indent: 1 },
  { lineNumber: 28, code: '}', indent: 0 }
];

export function generateMergeSortSteps(initialArray: number[]): SortStep[] {
  const arr = [...initialArray];
  const n = arr.length;
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0; // counts writes to arr
  const callStack: CallStackFrame[] = [];

  const getStatusMap = (
    left: number,
    right: number,
    mid?: number,
    activeK?: number,
    compareIndices?: number[]
  ): Record<number, ElementStatus> => {
    const status: Record<number, ElementStatus> = {};
    for (let idx = 0; idx < n; idx++) {
      if (idx >= left && idx <= right) {
        status[idx] = 'subrange';
      } else {
        status[idx] = 'idle';
      }
    }
    if (mid !== undefined) {
      status[mid] = 'pivot';
    }
    if (activeK !== undefined) {
      status[activeK] = 'overwriting';
    }
    if (compareIndices) {
      compareIndices.forEach(idx => {
        if (idx >= 0 && idx < n) status[idx] = 'comparing';
      });
    }
    return status;
  };

  // Step 0: Initial call
  steps.push({
    stepNumber: 0,
    array: [...arr],
    statusMap: getStatusMap(0, n - 1),
    pointers: { left: 0, right: n - 1 },
    line: 21,
    action: 'init',
    title: `Call mergeSort(arr, 0, ${n - 1})`,
    explanation: `Call mergeSort on raw array arr[] with left index 0 and right index ${n - 1}.`,
    variables: [
      { name: 'left', value: 0, type: 'int' },
      { name: 'right', value: n - 1, type: 'int' }
    ],
    comparisons,
    swaps,
    subRange: [0, n - 1],
    callStack: [{ id: '0', functionName: 'mergeSort', params: { left: 0, right: n - 1 }, active: true }]
  });

  function merge(left: number, mid: number, right: number) {
    const n1 = mid - left + 1;
    const n2 = right - mid;
    const L = arr.slice(left, mid + 1);
    const R = arr.slice(mid + 1, right + 1);

    // Line 5: int L[50], R[50];
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: getStatusMap(left, right, mid),
      pointers: { left, mid, right },
      line: 5,
      action: 'init',
      title: `Copy to Temporary Arrays: L[${n1}] and R[${n2}]`,
      explanation: `Split range [${left}...${right}] into temporary helper arrays: L = [${L.join(', ')}] and R = [${R.join(', ')}].`,
      variables: [
        { name: 'left', value: left, type: 'int' },
        { name: 'mid', value: mid, type: 'int' },
        { name: 'right', value: right, type: 'int' },
        { name: 'n1', value: n1, type: 'int' },
        { name: 'n2', value: n2, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [left, right],
      callStack: [...callStack],
      auxArray: [...L, ...R]
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < n1 && j < n2) {
      comparisons++;
      const pickL = L[i] <= R[j];

      // Line 10: compare L[i] with R[j]
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: getStatusMap(left, right, mid, k),
        pointers: { left, right, mid, k },
        line: 10,
        action: 'compare',
        title: `Compare L[${i}] (${L[i]}) and R[${j}] (${R[j]})`,
        explanation: `Condition (L[${i}] <= R[${j}]): ${L[i]} <= ${R[j]} is ${pickL ? 'TRUE. Write L[' + i + '] (' + L[i] + ') into arr[' + k + '].' : 'FALSE. Write R[' + j + '] (' + R[j] + ') into arr[' + k + '].'}`,
        variables: [
          { name: 'i', value: i, type: 'int' },
          { name: 'j', value: j, type: 'int' },
          { name: 'k', value: k, type: 'int' },
          { name: 'L[i]', value: L[i], type: 'int' },
          { name: 'R[j]', value: R[j], type: 'int' }
        ],
        comparisons,
        swaps,
        subRange: [left, right],
        callStack: [...callStack]
      });

      if (pickL) {
        swaps++;
        arr[k] = L[i];

        steps.push({
          stepNumber: steps.length,
          array: [...arr],
          statusMap: getStatusMap(left, right, mid, k),
          pointers: { left, right, mid, k },
          line: 11,
          action: 'assign',
          title: `arr[${k}] = L[${i}] (${L[i]})`,
          explanation: `Copied ${L[i]} from helper array L[] back into arr[${k}]. Incremented pointer i to ${i + 1}.`,
          variables: [
            { name: 'k', value: k, type: 'int' },
            { name: 'L[i]', value: L[i], type: 'int' },
            { name: 'i', value: i + 1, type: 'int' }
          ],
          comparisons,
          swaps,
          subRange: [left, right],
          callStack: [...callStack]
        });
        i++;
      } else {
        swaps++;
        arr[k] = R[j];

        steps.push({
          stepNumber: steps.length,
          array: [...arr],
          statusMap: getStatusMap(left, right, mid, k),
          pointers: { left, right, mid, k },
          line: 13,
          action: 'assign',
          title: `arr[${k}] = R[${j}] (${R[j]})`,
          explanation: `Copied ${R[j]} from helper array R[] back into arr[${k}]. Incremented pointer j to ${j + 1}.`,
          variables: [
            { name: 'k', value: k, type: 'int' },
            { name: 'R[j]', value: R[j], type: 'int' },
            { name: 'j', value: j + 1, type: 'int' }
          ],
          comparisons,
          swaps,
          subRange: [left, right],
          callStack: [...callStack]
        });
        j++;
      }
      k++;
    }

    // Line 17: copy remaining of L
    while (i < n1) {
      swaps++;
      arr[k] = L[i];

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: getStatusMap(left, right, mid, k),
        pointers: { left, right, k },
        line: 17,
        action: 'assign',
        title: `Copy remaining L[${i}] (${L[i]}) to arr[${k}]`,
        explanation: `Array R[] was exhausted. Copy leftover element from L[] into arr[${k}].`,
        variables: [
          { name: 'k', value: k, type: 'int' },
          { name: 'L[i]', value: L[i], type: 'int' },
          { name: 'i', value: i + 1, type: 'int' }
        ],
        comparisons,
        swaps,
        subRange: [left, right],
        callStack: [...callStack]
      });
      i++;
      k++;
    }

    // Line 18: copy remaining of R
    while (j < n2) {
      swaps++;
      arr[k] = R[j];

      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: getStatusMap(left, right, mid, k),
        pointers: { left, right, k },
        line: 18,
        action: 'assign',
        title: `Copy remaining R[${j}] (${R[j]}) to arr[${k}]`,
        explanation: `Array L[] was exhausted. Copy leftover element from R[] into arr[${k}].`,
        variables: [
          { name: 'k', value: k, type: 'int' },
          { name: 'R[j]', value: R[j], type: 'int' },
          { name: 'j', value: j + 1, type: 'int' }
        ],
        comparisons,
        swaps,
        subRange: [left, right],
        callStack: [...callStack]
      });
      j++;
      k++;
    }

    // Range [left...right] is merged and sorted
    const mergedStatus: Record<number, ElementStatus> = {};
    for (let idx = 0; idx < n; idx++) {
      if (idx >= left && idx <= right) mergedStatus[idx] = 'sorted';
      else mergedStatus[idx] = 'idle';
    }

    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: mergedStatus,
      pointers: { left, right },
      line: 19,
      action: 'init',
      title: `Subarray [${left}...${right}] Merged Successfully`,
      explanation: `Subarray arr[${left}...${right}] now contains [${arr.slice(left, right + 1).join(', ')}] in sorted order. Returning from merge().`,
      variables: [
        { name: 'left', value: left, type: 'int' },
        { name: 'right', value: right, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [left, right],
      callStack: [...callStack]
    });
  }

  function runMergeSort(left: number, right: number) {
    const frameId = `${left}-${right}`;
    callStack.push({
      id: frameId,
      functionName: 'mergeSort',
      params: { left, right },
      active: true
    });

    // Line 22: if (left < right)
    steps.push({
      stepNumber: steps.length,
      array: [...arr],
      statusMap: getStatusMap(left, right),
      pointers: { left, right },
      line: 22,
      action: 'call',
      title: `mergeSort(arr, ${left}, ${right})`,
      explanation: left < right
        ? `Subarray [${left}...${right}] has length ${right - left + 1} > 1. Compute mid and recurse.`
        : `Base case reached: Subarray [${left}...${right}] has 1 element (${arr[left]}), which is already sorted.`,
      variables: [
        { name: 'left', value: left, type: 'int' },
        { name: 'right', value: right, type: 'int' }
      ],
      comparisons,
      swaps,
      subRange: [left, right],
      callStack: [...callStack]
    });

    if (left < right) {
      const mid = Math.floor(left + (right - left) / 2);

      // Line 23: mid calculation
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: getStatusMap(left, right, mid),
        pointers: { left, mid, right },
        line: 23,
        action: 'init',
        title: `Compute midpoint mid = ${mid}`,
        explanation: `Divide array range [${left}...${right}] at mid = ${mid}. Left half: [${left}...${mid}], Right half: [${mid + 1}...${right}].`,
        variables: [
          { name: 'left', value: left, type: 'int' },
          { name: 'mid', value: mid, type: 'int' },
          { name: 'right', value: right, type: 'int' }
        ],
        comparisons,
        swaps,
        subRange: [left, right],
        callStack: [...callStack]
      });

      runMergeSort(left, mid);
      runMergeSort(mid + 1, right);

      // Line 26: merge call
      steps.push({
        stepNumber: steps.length,
        array: [...arr],
        statusMap: getStatusMap(left, right, mid),
        pointers: { left, mid, right },
        line: 26,
        action: 'call',
        title: `merge(arr, ${left}, ${mid}, ${right})`,
        explanation: `Both halves [${left}...${mid}] and [${mid + 1}...${right}] are sorted. Now merge them together into arr[].`,
        variables: [
          { name: 'left', value: left, type: 'int' },
          { name: 'mid', value: mid, type: 'int' },
          { name: 'right', value: right, type: 'int' }
        ],
        comparisons,
        swaps,
        subRange: [left, right],
        callStack: [...callStack]
      });

      merge(left, mid, right);
    }

    callStack.pop();
  }

  runMergeSort(0, n - 1);

  // Final step
  const finalStatus: Record<number, ElementStatus> = {};
  for (let idx = 0; idx < n; idx++) finalStatus[idx] = 'sorted';

  steps.push({
    stepNumber: steps.length,
    array: [...arr],
    statusMap: finalStatus,
    pointers: {},
    line: 28,
    action: 'done',
    title: 'Merge Sort Complete',
    explanation: `Array is completely sorted! Total comparisons: ${comparisons}, Total array writes: ${swaps}.`,
    variables: [{ name: 'n', value: n, type: 'int' }],
    comparisons,
    swaps,
    callStack: []
  });

  return steps;
}

export const mergeSortDefinition: AlgorithmDefinition = {
  id: 'merge',
  category: 'sorting',
  name: 'Merge Sort',
  cppFunctionName: 'mergeSort(int arr[], int left, int right)',
  complexity: {
    best: 'O(N log N)',
    average: 'O(N log N)',
    worst: 'O(N log N)',
    space: 'O(N)',
    stable: true,
    inPlace: false,
    summary: 'Divide-and-conquer algorithm with guaranteed O(N log N) time in all scenarios. Stable sort that uses auxiliary temporary arrays.'
  },
  description: 'Merge Sort recursively halves the array into single-element subarrays, then merges pairs of sorted subarrays back together in sorted order using temporary arrays.',
  cppCode,
  generateSteps: generateMergeSortSteps,
  keyInvariants: [
    'Subarray arr[left...mid] and arr[mid+1...right] are sorted before merge() is invoked.',
    'Guaranteed O(N log N) worst-case time complexity.',
    'Clear demonstration of recursion and divide-and-conquer using arrays.'
  ]
};
