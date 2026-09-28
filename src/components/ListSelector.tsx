import React from 'react';
import { NumberListPreset } from '../types/sorting';
import { ListPlus, ChevronDown, ListOrdered } from 'lucide-react';

interface ListSelectorProps {
  lists: NumberListPreset[];
  activeListId: string;
  onSelectList: (id: string) => void;
  onOpenModal: () => void;
}

export const ListSelector: React.FC<ListSelectorProps> = ({
  lists,
  activeListId,
  onSelectList,
  onOpenModal,
}) => {
  const activeList = lists.find((l) => l.id === activeListId) || lists[0];

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 border border-slate-800 p-3 rounded-xl">
      <div className="flex items-center gap-2">
        <ListOrdered className="w-4 h-4 text-cyan-400" />
        <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
          Active Number List:
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {/* Quick select pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto max-w-full py-0.5">
          {lists.map((list) => {
            const isSelected = list.id === activeListId;
            return (
              <button
                key={list.id}
                onClick={() => onSelectList(list.id)}
                className={`px-3 py-1 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isSelected
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 font-semibold shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border border-slate-700/60 hover:bg-slate-700/60'
                }`}
              >
                <span>{list.name}</span>
                <span className="ml-1.5 text-[10px] opacity-70 font-mono">
                  ({list.data.length})
                </span>
              </button>
            );
          })}
        </div>

        <button
          onClick={onOpenModal}
          className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-cyan-300 bg-cyan-950/80 hover:bg-cyan-900/80 border border-cyan-700/60 rounded-lg transition-colors shadow-sm ml-1"
        >
          <ListPlus className="w-3.5 h-3.5" />
          <span>Add Custom List</span>
        </button>
      </div>
    </div>
  );
};
