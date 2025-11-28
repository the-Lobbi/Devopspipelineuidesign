import React from 'react';
import { cn } from '@/lib/utils';
import { Epic } from '@/lib/types';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { ProgressBar } from '@/components/ui/progress-bar';
import { Avatar } from '@/components/ui/avatar';
import { MoreHorizontal, GitPullRequest, Bot } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface EpicCardProps {
  epic: Epic;
  onClick?: () => void;
}

export function EpicCard({ epic, onClick }: EpicCardProps) {
  const selectEpic = useAppStore((state) => state.selectEpic);

  const handleClick = () => {
    selectEpic(epic.id);
    onClick?.();
  };

  return (
    <GlassCard 
      variant="bordered" 
      padding="md" 
      hoverable 
      clickable 
      className="group bg-[#121214]/80 hover:bg-[#18181b] border-zinc-800/50"
      onClick={handleClick}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-500 border border-zinc-800 font-medium group-hover:border-zinc-700 transition-colors">
          {epic.jiraKey}
        </span>
        <button className="p-1 -mr-1 -mt-1 rounded-full opacity-0 group-hover:opacity-100 hover:bg-zinc-800 text-zinc-500 transition-all">
          <MoreHorizontal className="size-4" />
        </button>
      </div>

      <h3 className="text-sm font-medium text-zinc-200 mb-3 leading-snug line-clamp-2 min-h-[2.5em]">
        {epic.summary}
      </h3>

      <div className="flex flex-wrap gap-1.5 mb-4">
        {epic.labels?.slice(0, 3).map((tag) => (
          <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900/50 text-zinc-500 border border-zinc-800/50">
            {tag}
          </span>
        ))}
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-1.5 text-zinc-500">
            {epic.currentAgent ? (
                <>
                    <div className="relative">
                        <Bot className="size-3.5 text-violet-400" />
                        <span className="absolute -top-0.5 -right-0.5 size-1.5 bg-green-500 rounded-full border border-[#121214]" />
                    </div>
                    <span className="text-zinc-400">{epic.currentAgent}</span>
                </>
            ) : (
                <span className="text-zinc-600 italic">Unassigned</span>
            )}
          </div>
          <span className="font-mono text-zinc-600">{epic.currentStep}/{epic.totalSteps}</span>
        </div>

        <ProgressBar value={(epic.currentStep / epic.totalSteps) * 100} size="sm" colorClass={getStatusColor(epic.status)} />
      </div>
    </GlassCard>
  );
}

function getStatusColor(status: string) {
    const s = status.toLowerCase();
    if (s === 'executing') return 'bg-blue-500';
    if (s === 'planning') return 'bg-violet-500';
    if (s === 'review') return 'bg-amber-500';
    if (s === 'done') return 'bg-emerald-500';
    if (s === 'failed') return 'bg-red-500';
    return 'bg-zinc-600';
}
