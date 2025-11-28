
import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterChipProps {
  label: string;
  value: string;
  onRemove: () => void;
  className?: string;
}

export function FilterChip({ label, value, onRemove, className }: FilterChipProps) {
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/50 border border-zinc-700 text-zinc-200 animate-in fade-in zoom-in-95 duration-200",
      className
    )}>
      <span className="text-zinc-500">{label}:</span>
      <span>{value}</span>
      <button 
        onClick={onRemove}
        className="ml-0.5 p-0.5 rounded-full hover:bg-zinc-700 text-zinc-500 hover:text-zinc-300 transition-colors"
      >
        <X className="size-3" />
      </button>
    </div>
  );
}
