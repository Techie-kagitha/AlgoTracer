import React, { useState } from 'react';
import { CppCodeLine } from '../types/sorting';
import { Code2, Copy, Check, Info } from 'lucide-react';

interface CppCodeViewerProps {
  codeLines: CppCodeLine[];
  activeLine: number;
  algorithmName: string;
}

export const CppCodeViewer: React.FC<CppCodeViewerProps> = ({
  codeLines,
  activeLine,
  algorithmName,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedLineInfo, setSelectedLineInfo] = useState<CppCodeLine | null>(null);

  const handleCopy = () => {
    const fullCode = codeLines.map((l) => l.code).join('\n');
    navigator.clipboard.writeText(fullCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Helper for syntax highlighting of C++ tokens
  const renderHighlightedCode = (text: string) => {
    // If it's a comment line or contains comment
    const commentIndex = text.indexOf('//');
    let codePart = text;
    let commentPart = '';

    if (commentIndex !== -1) {
      codePart = text.slice(0, commentIndex);
      commentPart = text.slice(commentIndex);
    }

    // Tokenize keywords, types, numbers
    const tokens = codePart.split(/(\b(?:void|int|bool|true|false|for|while|if|else|return|break|size_t)\b|\bstd::(?:vector|swap)\b|\b\d+\b)/g);

    return (
      <span>
        {tokens.map((token, i) => {
          if (['void', 'int', 'bool', 'true', 'false', 'for', 'while', 'if', 'else', 'return', 'break', 'size_t'].includes(token)) {
            return (
              <span key={i} className="text-cyan-400 font-semibold">
                {token}
              </span>
            );
          }
          if (['std::vector', 'std::swap'].includes(token)) {
            return (
              <span key={i} className="text-amber-300 font-medium">
                {token}
              </span>
            );
          }
          if (/^\d+$/.test(token)) {
            return (
              <span key={i} className="text-emerald-300">
                {token}
              </span>
            );
          }
          return <span key={i} className="text-slate-200">{token}</span>;
        })}
        {commentPart && (
          <span className="text-slate-500 italic ml-2">
            {commentPart}
          </span>
        )}
      </span>
    );
  };

  return (
    <div className="flex flex-col h-full bg-[#080d1a] border border-slate-800 rounded-xl overflow-hidden shadow-lg font-mono">
      {/* Code Header Bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-800/90 bg-slate-950/80">
        <div className="flex items-center gap-2">
          <Code2 className="w-4 h-4 text-cyan-400" />
          <span className="text-xs font-semibold text-slate-200">
            {algorithmName}.cpp
          </span>
          <span className="text-[11px] text-slate-500 font-sans">
            (C++ Arrays · Beginner Friendly)
          </span>
        </div>

        <button
          onClick={handleCopy}
          title="Copy C++ Source Code"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs text-slate-400 hover:text-slate-200 bg-slate-900 hover:bg-slate-800 rounded border border-slate-800 transition-colors"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Lines with Execution Pointer */}
      <div className="flex-1 overflow-y-auto p-2 text-xs leading-relaxed select-text">
        {codeLines.map((line) => {
          const isActive = line.lineNumber === activeLine;
          return (
            <div
              key={line.lineNumber}
              onClick={() => setSelectedLineInfo(line)}
              className={`flex items-center group py-0.5 px-2 rounded cursor-pointer transition-colors duration-150 ${
                isActive
                  ? 'bg-cyan-500/15 border-l-2 border-cyan-400 font-medium text-white'
                  : 'hover:bg-slate-800/50 text-slate-300'
              }`}
            >
              {/* Pointer indicator & Line number */}
              <div className="w-12 shrink-0 flex items-center justify-between pr-2 text-slate-600 select-none">
                <span className="text-cyan-400 text-[10px] w-3">
                  {isActive ? '▶' : ''}
                </span>
                <span
                  className={`tabular-nums text-[11px] ${
                    isActive ? 'text-cyan-300 font-bold' : 'group-hover:text-slate-400'
                  }`}
                >
                  {line.lineNumber}
                </span>
              </div>

              {/* Code line content */}
              <div
                style={{ paddingLeft: `${line.indent * 1.25}rem` }}
                className="flex-1 overflow-x-auto whitespace-pre font-mono"
              >
                {line.code ? renderHighlightedCode(line.code) : <span className="opacity-0">.</span>}
              </div>

              {/* Comment badge on hover if available */}
              {line.comment && (
                <div className="hidden group-hover:flex items-center text-[10px] text-slate-500 pl-2">
                  <Info className="w-3 h-3 mr-1" />
                  <span className="truncate max-w-[140px] font-sans">{line.comment}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Line explanation footer drawer */}
      {selectedLineInfo && (
        <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/90 text-xs flex items-center justify-between text-slate-300 font-sans">
          <div className="flex items-center gap-2">
            <span className="font-mono text-cyan-300 font-semibold">
              Line {selectedLineInfo.lineNumber}:
            </span>
            <span>
              {selectedLineInfo.comment || 'Core C++ algorithm loop/operation.'}
            </span>
          </div>
          <button
            onClick={() => setSelectedLineInfo(null)}
            className="text-[11px] text-slate-500 hover:text-slate-300 ml-2"
          >
            Dismiss
          </button>
        </div>
      )}
    </div>
  );
};
