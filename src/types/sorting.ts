export type AlgorithmCategory = 'sorting' | 'searching';

export type SortingAlgorithmId = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';
export type SearchingAlgorithmId = 'linear' | 'binary' | 'jump' | 'interpolation' | 'exponential';

export type AlgorithmId = SortingAlgorithmId | SearchingAlgorithmId;

export type ElementStatus = 
  | 'idle' 
  | 'comparing' 
  | 'swapping' 
  | 'sorted' 
  | 'pivot' 
  | 'key' 
  | 'subrange' 
  | 'overwriting'
  | 'found'
  | 'eliminated'
  | 'probe';

export interface StepVariable {
  name: string;
  value: string | number | boolean;
  type?: string;
  description?: string;
}

export interface CallStackFrame {
  id: string;
  functionName: string;
  params: Record<string, number | string>;
  active?: boolean;
}

export interface SortStep {
  stepNumber: number;
  array: number[];
  statusMap: Record<number, ElementStatus>;
  pointers: Record<string, number>; // e.g. { i: 2, j: 3, mid: 4, low: 0, high: 6 }
  line: number; // 1-based line number in C++ code
  action: 'init' | 'compare' | 'swap' | 'shift' | 'assign' | 'partition' | 'call' | 'return' | 'done' | 'found' | 'not_found' | 'eliminate';
  title: string;
  explanation: string;
  codeSnippet?: string;
  variables: StepVariable[];
  comparisons: number;
  swaps: number;
  auxArray?: (number | null)[]; // for Merge Sort temporary buffer
  subRange?: [number, number]; // [start, end] inclusive
  callStack?: CallStackFrame[];
  target?: number;
  foundIndex?: number;
}

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable?: boolean;
  inPlace?: boolean;
  summary: string;
}

export interface CppCodeLine {
  lineNumber: number;
  code: string;
  indent: number;
  comment?: string;
}

export interface AlgorithmDefinition {
  id: AlgorithmId;
  category: AlgorithmCategory;
  name: string;
  cppFunctionName: string;
  complexity: ComplexityInfo;
  description: string;
  cppCode: CppCodeLine[];
  generateSteps: (initialArray: number[], target?: number) => SortStep[];
  keyInvariants: string[];
  requiresSorted?: boolean;
}

export interface NumberListPreset {
  id: string;
  name: string;
  description: string;
  data: number[];
}
