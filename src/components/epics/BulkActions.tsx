
import React from 'react';
import { X, RefreshCw, Trash2, Archive } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface BulkActionsProps {
  selectedCount: number;
  onClearSelection: () => void;
}

export function BulkActions({ selectedCount, onClearSelection }: BulkActionsProps) {
  if (selectedCount === 0) return null;

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 p-2 pl-4 bg-[#121214] border border-zinc-800 shadow-2xl shadow-black/50 rounded-full animate-in slide-in-from-bottom-10 fade-in duration-300">
      <div className="flex items-center gap-2 mr-2 border-r border-zinc-800 pr-4">
        <span className="bg-violet-600 text-white text-xs font-bold px-2 py-0.5 rounded-full">
            {selectedCount}
        </span>
        <span className="text-sm font-medium text-zinc-200">Selected</span>
      </div>

      <div className="flex items-center gap-1">
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 rounded-full px-3">
            <RefreshCw className="size-3.5 mr-2" />
            Retry
        </Button>
        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 rounded-full px-3">
            <Archive className="size-3.5 mr-2" />
            Archive
        </Button>
        <Button variant="ghost" size="sm" className="text-red-400 hover:text-red-300 hover:bg-red-950/30 h-8 rounded-full px-3">
            <Trash2 className="size-3.5 mr-2" />
            Delete
        </Button>
      </div>

      <Button 
        variant="ghost" 
        size="icon" 
        onClick={onClearSelection}
        className="ml-2 size-8 rounded-full text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800"
      >
        <X className="size-4" />
      </Button>
    </div>
  );
}
