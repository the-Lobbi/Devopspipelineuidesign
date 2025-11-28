
import React from 'react';
import { Epic } from '@/lib/types';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { Github, ExternalLink, GitBranch, User } from 'lucide-react';

interface EpicHeaderProps {
  epic: Epic;
}

export function EpicHeader({ epic }: EpicHeaderProps) {
  return (
    <GlassCard variant="gradient" padding="lg" className="mb-6">
      <div className="flex items-start justify-between">
        <div className="space-y-4 flex-1">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-1 rounded-md bg-black/40 text-sm font-mono text-zinc-400 border border-white/10 shadow-inner">
              {epic.jiraKey}
            </span>
            <StatusBadge status={epic.status} size="md" />
          </div>
          
          <div>
            <h1 className="text-2xl font-semibold text-white tracking-tight mb-2">
              {epic.summary}
            </h1>
            <p className="text-zinc-400 leading-relaxed max-w-3xl">
              {epic.description}
            </p>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-zinc-400">
                <GitBranch className="size-4" />
                <span className="text-zinc-200 font-mono">{epic.featureBranch || 'feature/main'}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-400">
                <User className="size-4" />
                <span className="text-zinc-200">{epic.assignee || 'Unassigned'}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white">
                <Github className="size-4 mr-2" />
                View PR
            </Button>
            <Button variant="outline" size="sm" className="bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10 hover:text-white">
                <ExternalLink className="size-4 mr-2" />
                Open Jira
            </Button>
        </div>
      </div>
    </GlassCard>
  );
}
