
import React from 'react';
import { Epic } from '@/lib/types';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Checkbox } from '@/components/ui/checkbox';
import { MoreHorizontal, Github, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface EpicTableRowProps {
  epic: Epic;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  onClick: () => void;
}

export function EpicTableRow({ epic, isSelected, onSelect, onClick }: EpicTableRowProps) {
  return (
    <div 
        className={`group flex items-center gap-4 p-4 border-b border-zinc-800/50 hover:bg-zinc-900/30 transition-colors ${isSelected ? 'bg-zinc-900/50' : ''}`}
    >
      <div className="flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
        <Checkbox 
            checked={isSelected} 
            onCheckedChange={onSelect}
            className="border-zinc-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600" 
        />
      </div>

      <div className="w-24 shrink-0" onClick={onClick}>
        <span className="font-mono text-xs font-medium text-zinc-500 bg-zinc-900 px-1.5 py-0.5 rounded border border-zinc-800 group-hover:border-zinc-700 group-hover:text-zinc-400 transition-colors cursor-pointer">
            {epic.jiraKey}
        </span>
      </div>

      <div className="flex-1 min-w-0 cursor-pointer" onClick={onClick}>
        <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-zinc-200 truncate">{epic.summary}</span>
            {epic.labels?.slice(0, 2).map(tag => (
                <span key={tag} className="px-1.5 py-0.5 rounded text-[10px] bg-zinc-800/50 text-zinc-500 border border-zinc-800">
                    {tag}
                </span>
            ))}
        </div>
        <div className="flex items-center gap-4 text-xs text-zinc-500">
            <span className="flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-zinc-700" />
                {epic.targetRepo}
            </span>
            {epic.currentAgent && (
                <span className="flex items-center gap-1.5 text-violet-400/80">
                    <span className="size-1.5 rounded-full bg-violet-500" />
                    {epic.currentAgent}
                </span>
            )}
        </div>
      </div>

      <div className="w-32 shrink-0" onClick={onClick}>
        <StatusBadge status={epic.status} size="sm" />
      </div>

      <div className="w-32 shrink-0 flex flex-col justify-center gap-1" onClick={onClick}>
        <div className="flex justify-between text-[10px] text-zinc-500">
            <span>Step {epic.currentStep}/{epic.totalSteps}</span>
            <span>{Math.round((epic.currentStep / epic.totalSteps) * 100)}%</span>
        </div>
        <ProgressBar value={(epic.currentStep / epic.totalSteps) * 100} size="sm" className="h-1.5" />
      </div>

      <div className="w-24 shrink-0 flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
        <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-zinc-200">
            <Github className="size-4" />
        </Button>
        <Button variant="ghost" size="icon" className="size-8 text-zinc-500 hover:text-zinc-200">
            <MoreHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
