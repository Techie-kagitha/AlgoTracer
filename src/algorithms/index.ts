import { AlgorithmDefinition, AlgorithmId, NumberListPreset } from '../types/sorting';
import { bubbleSortDefinition } from './bubbleSort';
import { selectionSortDefinition } from './selectionSort';
import { insertionSortDefinition } from './insertionSort';
import { quickSortDefinition } from './quickSort';
import { mergeSortDefinition } from './mergeSort';

export const ALGORITHMS: Record<AlgorithmId, AlgorithmDefinition> = {
  bubble: bubbleSortDefinition,
  selection: selectionSortDefinition,
  insertion: insertionSortDefinition,
  quick: quickSortDefinition,
  merge: mergeSortDefinition,
};

export const ALGORITHM_LIST: AlgorithmDefinition[] = [
  bubbleSortDefinition,
  selectionSortDefinition,
  insertionSortDefinition,
  quickSortDefinition,
  mergeSortDefinition,
];

export const DEFAULT_LIST_PRESETS: NumberListPreset[] = [
  {
    id: 'classic',
    name: 'Classic Textbook',
    description: 'General 7-element unsorted array with mixed small and large numbers.',
    data: [64, 34, 25, 12, 22, 11, 90]
  },
  {
    id: 'compact',
    name: 'Compact 5-Node',
    description: 'Short array ideal for detailed step-by-step C++ line tracing.',
    data: [29, 10, 14, 37, 13]
  },
  {
    id: 'nearly-sorted',
    name: 'Nearly Sorted',
    description: 'Demonstrates Insertion Sort and Bubble Sort early-break optimizations.',
    data: [5, 12, 18, 24, 21, 35, 42, 50]
  },
  {
    id: 'reversed',
    name: 'Reversed Order',
    description: 'Worst-case inversion profile for Bubble, Insertion, and Selection sorts.',
    data: [88, 72, 60, 45, 33, 21, 9]
  },
  {
    id: 'duplicates',
    name: 'With Duplicates',
    description: 'Multiple identical values to explore algorithm stability.',
    data: [30, 15, 45, 30, 60, 15, 20]
  },
  {
    id: 'large-spread',
    name: 'Varied Dynamic Range',
    description: 'Values spanning from 3 up to 99 for pronounced bar heights.',
    data: [42, 8, 99, 17, 63, 25, 74, 3, 51]
  }
];
