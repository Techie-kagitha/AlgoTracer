export type AlgorithmId = 'bubble' | 'selection' | 'insertion' | 'quick' | 'merge';

export type ElementStatus = 
  | 'idle' 
  | 'comparing' 
  | 'swapping' 
  | 'sorted' 
  | 'pivot' 
  | 'key' 
  | 'subrange' 
  | 'overwriting';

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
  pointers: Record<string, number>; // e.g. { i: 2, j: 3, pivot: 5, min_idx: 1 }
  line: number; // 1-based line number in C++ code
  action: 'init' | 'compare' | 'swap' | 'shift' | 'assign' | 'partition' | 'call' | 'return' | 'done';
  title: string;
  explanation: string;
  codeSnippet?: string;
  variables: StepVariable[];
  comparisons: number;
  swaps: number;
  auxArray?: (number | null)[]; // for Merge Sort temporary buffer
  subRange?: [number, number]; // [start, end] inclusive
  callStack?: CallStackFrame[];
}

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
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
  name: string;
  cppFunctionName: string;
  complexity: ComplexityInfo;
  description: string;
  cppCode: CppCodeLine[];
  generateSteps: (initialArray: number[]) => SortStep[];
  keyInvariants: string[];
}

export interface NumberListPreset {
  id: string;
  name: string;
  description: string;
  data: number[];
}
