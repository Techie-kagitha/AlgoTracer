import React from 'react';
import { Layers, GitCompare, BookOpen, ListFilter } from 'lucide-react';
import { AudioControls } from './AudioControls';

export type ActiveTab = 'debugger' | 'batch' | 'compare' | 'guide';

interface HeaderProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenListManager: () => void;
  listCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onTabChange,
  onOpenListManager,
  listCount,
}) => {
  return (
    <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark */}
      <div className="flex items-center gap-3">
        <a href="/" className="text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors">
          AlgoTrace C++
        </a>
        <span className="hidden sm:inline text-xs text-slate-500 font-mono">
          Interactive Sorting & Memory Stepper
        </span>
      </div>

      {/* Zone 2: Clean text navigation links */}
      <nav className="flex items-center gap-1 sm:gap-2">
        <button
          onClick={() => onTabChange('debugger')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'debugger'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Step Debugger</span>
        </button>

        <button
          onClick={() => onTabChange('batch')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'batch'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <ListFilter className="w-3.5 h-3.5" />
          <span>Multi-List Lab</span>
        </button>

        <button
          onClick={() => onTabChange('compare')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'compare'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <GitCompare className="w-3.5 h-3.5" />
          <span>Compare Algorithms</span>
        </button>

        <button
          onClick={() => onTabChange('guide')}
          className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'guide'
              ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/50 shadow-sm'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          <span>C++ Guide</span>
        </button>
      </nav>

      {/* Zone 3: Primary Actions (Audio Sonification Controls + Manage Lists) */}
      <div className="flex items-center gap-2.5">
        <AudioControls />
        <button
          onClick={onOpenListManager}
          className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/90 border border-slate-700 hover:bg-slate-700/80 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shadow-sm"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
          <span>Manage Lists ({listCount})</span>
        </button>
      </div>
    </header>
  );
};

