import { AlgorithmDefinition, AlgorithmId, NumberListPreset } from '../types/sorting';
import { bubbleSortDefinition } from './bubbleSort';
import { selectionSortDefinition } from './selectionSort';
import { insertionSortDefinition } from './insertionSort';
import { quickSortDefinition } from './quickSort';
import { mergeSortDefinition } from './mergeSort';
import { linearSearchDefinition } from './linearSearch';
import { binarySearchDefinition } from './binarySearch';
import { jumpSearchDefinition } from './jumpSearch';
import { interpolationSearchDefinition } from './interpolationSearch';
import { exponentialSearchDefinition } from './exponentialSearch';

export const SORTING_ALGORITHMS: AlgorithmDefinition[] = [
  bubbleSortDefinition,
  selectionSortDefinition,
  insertionSortDefinition,
  quickSortDefinition,
  mergeSortDefinition,
];

export const SEARCHING_ALGORITHMS: AlgorithmDefinition[] = [
  linearSearchDefinition,
  binarySearchDefinition,
  jumpSearchDefinition,
  interpolationSearchDefinition,
  exponentialSearchDefinition,
];

export const ALL_ALGORITHMS: AlgorithmDefinition[] = [
  ...SORTING_ALGORITHMS,
  ...SEARCHING_ALGORITHMS,
];

export const ALGORITHMS: Record<AlgorithmId, AlgorithmDefinition> = {
  bubble: bubbleSortDefinition,
  selection: selectionSortDefinition,
  insertion: insertionSortDefinition,
  quick: quickSortDefinition,
  merge: mergeSortDefinition,
  linear: linearSearchDefinition,
  binary: binarySearchDefinition,
  jump: jumpSearchDefinition,
  interpolation: interpolationSearchDefinition,
  exponential: exponentialSearchDefinition,
};

export const ALGORITHM_LIST = ALL_ALGORITHMS;

export const DEFAULT_LIST_PRESETS: NumberListPreset[] = [
  {
    id: 'classic',
    name: 'Classic Textbook',
    description: 'General 7-element unsorted array with mixed numbers.',
    data: [64, 34, 25, 12, 22, 11, 90]
  },
  {
    id: 'sorted-search',
    name: 'Sorted Array (Search Ready)',
    description: 'Pre-sorted array [11, 12, 22, 25, 34, 64, 90] ready for Binary/Jump/Interpolation search.',
    data: [11, 12, 22, 25, 34, 64, 90]
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
