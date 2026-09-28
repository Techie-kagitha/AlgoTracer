import React, { useState } from 'react';
import { X, Copy, Check, ExternalLink, GraduationCap, School, Code, Sparkles, BookOpen } from 'lucide-react';

interface ClassroomModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ClassroomModal: React.FC<ClassroomModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const liveUrl = 'https://ais-pre-qjy3k3vwzmqpzf665ivibh-838265961928.us-east1.run.app';

  if (!isOpen) return null;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(liveUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const markdownSnippet = `[![Play Online](https://img.shields.io/badge/Play%20Online-Live%20Visualizer-06b6d4?style=for-the-badge)](${liveUrl})`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-950/80 border border-cyan-800/80 text-cyan-400 flex items-center justify-center">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-tight">
                Classroom & Live Play Info
              </h3>
              <p className="text-xs text-slate-400">
                Created by Prof. Vinay Kagitha · Oklahoma City Community College (OCCC)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Live Link Box */}
          <div className="p-4 bg-cyan-950/30 border border-cyan-700/60 rounded-xl space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Live Student Web App URL
              </span>
              <span className="text-[10px] text-cyan-400 font-mono">
                No Installation Required
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={liveUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-slate-950/90 border border-cyan-800/80 rounded-lg text-cyan-200 select-all focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-sm shrink-0"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-slate-950" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Link</span>
                  </>
                )}
              </button>
              <a
                href={liveUrl}
                target="_blank"
                rel="noreferrer"
                className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors shrink-0"
                title="Open in new window"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Share this link directly in your syllabus, Canvas / Blackboard / Moodle course announcements, or GitHub repository so students can open and run the tool on any browser.
            </p>
          </div>

          {/* GitHub Badge Snippet */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Code className="w-3.5 h-3.5 text-cyan-400" />
              Add This Badge to Your GitHub README:
            </span>
            <div className="relative">
              <pre className="p-2.5 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-cyan-300 overflow-x-auto select-all">
                {markdownSnippet}
              </pre>
            </div>
            <p className="text-[11px] text-slate-500">
              When pasted into your GitHub README, this displays a clickable badge that opens the live app!
            </p>
          </div>

          {/* Instructor & Course Info */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <School className="w-3.5 h-3.5 text-cyan-400" />
              Course & Academic Attribution
            </span>
            <div className="text-xs text-slate-300 space-y-1 leading-relaxed">
              <div>
                <strong>Instructor:</strong> Prof. Vinay Kagitha
              </div>
              <div>
                <strong>Title:</strong> Professor of Computer Science – Programming
              </div>
              <div>
                <strong>Institution:</strong> Oklahoma City Community College (OCCC)
              </div>
              <div>
                <strong>Target Courses:</strong> Intro to C++, CS1 / CS2 Programming, Algorithms & Data Structures
              </div>
            </div>
          </div>

          {/* Key Classroom Features */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-2">
            <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
              Classroom Design Features
            </span>
            <ul className="text-xs text-slate-400 space-y-1.5 list-disc list-inside">
              <li>
                <strong className="text-slate-200">Raw C++ Arrays:</strong> Functions use standard <code className="text-cyan-300 font-mono">int arr[], int n</code> — no vectors or complex STL libraries.
              </li>
              <li>
                <strong className="text-slate-200">3-Step Swap:</strong> Visualizes <code className="text-cyan-300 font-mono">temp = arr[j]; arr[j] = arr[j+1]; arr[j+1] = temp;</code> step-by-step.
              </li>
              <li>
                <strong className="text-slate-200">Custom Homework Arrays:</strong> Students can click <em>Manage Lists</em> to type in their assigned homework numbers and verify their hand traces.
              </li>
              <li>
                <strong className="text-slate-200">Spoken Voice Instructor:</strong> Reads every line and explains the why behind comparisons and swaps.
              </li>
            </ul>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-slate-800 bg-slate-950/90 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
