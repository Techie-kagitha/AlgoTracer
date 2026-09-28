import React, { useState } from 'react';
import { NumberListPreset } from '../types/sorting';
import { X, Plus, Trash2, Copy, Sparkles, Check } from 'lucide-react';

interface ListManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  lists: NumberListPreset[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onAddList: (list: NumberListPreset) => void;
  onDeleteList: (id: string) => void;
}

export const ListManagerModal: React.FC<ListManagerModalProps> = ({
  isOpen,
  onClose,
  lists,
  activeListId,
  onSelectList,
  onAddList,
  onDeleteList,
}) => {
  const [newListName, setNewListName] = useState('');
  const [numbersInput, setNumbersInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [randomSize, setRandomSize] = useState(8);

  if (!isOpen) return null;

  const handleCreateCustom = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const parsed = numbersInput
      .split(/[,\s]+/)
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map(Number);

    if (parsed.length < 3) {
      setErrorMsg('Please provide at least 3 numbers for meaningful visualization.');
      return;
    }
    if (parsed.length > 16) {
      setErrorMsg('Maximum recommended size is 16 numbers for clear step tracing.');
      return;
    }
    if (parsed.some(isNaN)) {
      setErrorMsg('All entries must be valid integers.');
      return;
    }

    const newList: NumberListPreset = {
      id: 'custom-' + Date.now(),
      name: newListName.trim() || `Custom List (${parsed.length})`,
      description: `User-defined array of ${parsed.length} integers.`,
      data: parsed,
    };

    onAddList(newList);
    onSelectList(newList.id);
    setNewListName('');
    setNumbersInput('');
    onClose();
  };

  const handleGenerateRandom = (type: 'random' | 'nearly' | 'reverse') => {
    let arr: number[] = [];
    if (type === 'random') {
      arr = Array.from({ length: randomSize }, () => Math.floor(Math.random() * 90) + 5);
    } else if (type === 'nearly') {
      arr = Array.from({ length: randomSize }, (_, i) => (i + 1) * 10 + Math.floor(Math.random() * 5));
      // swap two adjacent elements
      if (arr.length > 2) {
        const idx = Math.floor(arr.length / 2);
        const tmp = arr[idx];
        arr[idx] = arr[idx + 1];
        arr[idx + 1] = tmp;
      }
    } else if (type === 'reverse') {
      arr = Array.from({ length: randomSize }, (_, i) => (randomSize - i) * 12 + 5);
    }

    const labels = {
      random: 'Generated Random',
      nearly: 'Generated Nearly-Sorted',
      reverse: 'Generated Inverted',
    };

    const newList: NumberListPreset = {
      id: 'gen-' + Date.now(),
      name: `${labels[type]} (${randomSize})`,
      description: `Auto-generated ${type} test case.`,
      data: arr,
    };

    onAddList(newList);
    onSelectList(newList.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/80">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">
              Manage Number Lists (Test Suites)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Select or generate lists to observe how the sorting algorithm behaves across different data distributions.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Current Lists Section */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3">
              Available Lists of Numbers ({lists.length})
            </h4>
            <div className="space-y-2">
              {lists.map((list) => {
                const isActive = list.id === activeListId;
                const isPreset = !list.id.startsWith('custom-') && !list.id.startsWith('gen-');

                return (
                  <div
                    key={list.id}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-colors ${
                      isActive
                        ? 'bg-cyan-950/40 border-cyan-700/80'
                        : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div
                      onClick={() => {
                        onSelectList(list.id);
                        onClose();
                      }}
                      className="flex-1 cursor-pointer pr-3"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-white">
                          {list.name}
                        </span>
                        {isActive && (
                          <span className="flex items-center gap-1 text-[10px] font-mono text-cyan-400 font-semibold">
                            <Check className="w-3 h-3" /> Active
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-slate-400 mt-1 font-mono">
                        [{list.data.join(', ')}]
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isPreset && (
                        <button
                          onClick={() => onDeleteList(list.id)}
                          title="Delete this custom list"
                          className="p-2 text-slate-500 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Generator Box */}
          <div className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2 mb-2">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              Quick Array Generator
            </h4>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-xs text-slate-400">Array Size:</span>
              <input
                type="range"
                min={5}
                max={15}
                value={randomSize}
                onChange={(e) => setRandomSize(Number(e.target.value))}
                className="w-32 accent-cyan-400 h-1.5 bg-slate-800 rounded cursor-pointer"
              />
              <span className="text-xs font-mono font-bold text-cyan-300 tabular-nums">
                {randomSize} items
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => handleGenerateRandom('random')}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              >
                Random Distribution
              </button>
              <button
                type="button"
                onClick={() => handleGenerateRandom('nearly')}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              >
                Nearly-Sorted Set
              </button>
              <button
                type="button"
                onClick={() => handleGenerateRandom('reverse')}
                className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg border border-slate-700 transition-colors"
              >
                Reverse-Sorted Set
              </button>
            </div>
          </div>

          {/* Create Custom Form */}
          <form onSubmit={handleCreateCustom} className="p-4 bg-slate-950/70 border border-slate-800 rounded-xl space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <Plus className="w-3.5 h-3.5 text-cyan-400" />
              Create Custom Number List
            </h4>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                List Name (optional)
              </label>
              <input
                type="text"
                placeholder="e.g. My Homework Dataset"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-xs text-slate-400 mb-1">
                Numbers (comma or space separated, e.g. 45, 12, 89, 23, 7, 52)
              </label>
              <input
                type="text"
                placeholder="45, 12, 89, 23, 7, 52"
                value={numbersInput}
                onChange={(e) => setNumbersInput(e.target.value)}
                className="w-full px-3 py-2 text-xs font-mono bg-slate-900 border border-slate-700 rounded-lg text-cyan-300 placeholder-slate-600 focus:outline-none focus:border-cyan-500"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-rose-400 font-medium">
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-2 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors shadow-md mt-2"
            >
              Add and Visualize This List
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
