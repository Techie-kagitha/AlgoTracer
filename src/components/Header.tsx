import React, { useState } from 'react';
import { Layers, GitCompare, BookOpen, ListFilter, GraduationCap, Share2, Check } from 'lucide-react';
import { AudioControls } from './AudioControls';
import { ClassroomModal } from './ClassroomModal';

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
  const [isClassroomOpen, setIsClassroomOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const liveUrl = 'https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app';

  const handleQuickCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <header className="flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-950/80 backdrop-blur-md sticky top-0 z-40">
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <a href="/" className="text-lg font-bold tracking-tight text-white hover:text-cyan-300 transition-colors">
            AlgoTrace C++
          </a>
          <span className="hidden sm:inline text-xs text-slate-500 font-mono">
            Prof. Vinay Kagitha · OCCC
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

        {/* Zone 3: Primary Actions (Audio Controls + Share / Classroom + Manage Lists) */}
        <div className="flex items-center gap-2">
          <AudioControls />

          {/* Share & Classroom Link */}
          <button
            onClick={() => setIsClassroomOpen(true)}
            title="Classroom Info & Student Live App Link"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-cyan-300 bg-cyan-950/70 hover:bg-cyan-900/80 border border-cyan-800/80 rounded-lg transition-colors shadow-sm"
          >
            <GraduationCap className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Play Online</span>
            <span
              onClick={handleQuickCopy}
              title="Copy live link"
              className="ml-1 p-0.5 hover:text-white"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Share2 className="w-3 h-3" />}
            </span>
          </button>

          <button
            onClick={onOpenListManager}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800/90 border border-slate-700 hover:bg-slate-700/80 hover:border-slate-600 rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Manage Lists ({listCount})</span>
          </button>
        </div>
      </header>

      {/* Classroom & Share Modal */}
      <ClassroomModal
        isOpen={isClassroomOpen}
        onClose={() => setIsClassroomOpen(false)}
      />
    </>
  );
};


