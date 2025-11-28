
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { StatusBadge } from '@/components/ui/status-badge';
import { Button } from '@/components/ui/button';
import { GitPullRequest, GitCommit, FileDiff, ExternalLink, ArrowRight } from 'lucide-react';

interface PRDetailCardProps {
  prNumber: number;
  title: string;
  sourceBranch: string;
  targetBranch: string;
  status: string;
  additions: number;
  deletions: number;
  filesChanged: number;
}

export function PRDetailCard({ 
  prNumber, title, sourceBranch, targetBranch, status, additions, deletions, filesChanged 
}: PRDetailCardProps) {
  return (
    <GlassCard variant="bordered" className="p-6 mb-6">
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-start gap-4">
            <div className="p-3 bg-purple-500/10 rounded-xl border border-purple-500/20 text-purple-400">
                <GitPullRequest className="size-6" />
            </div>
            <div>
                <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-zinc-200">
                        {title} <span className="text-zinc-500 font-mono">#{prNumber}</span>
                    </h3>
                    <StatusBadge status={status} size="sm" />
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-400 font-mono">
                    <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300">{sourceBranch}</span>
                    <ArrowRight className="size-3.5 text-zinc-600" />
                    <span className="bg-zinc-900 px-2 py-0.5 rounded text-zinc-300">{targetBranch}</span>
                </div>
            </div>
        </div>
        <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white">
            <ExternalLink className="size-4 mr-2" />
            Open in GitHub
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4 border-t border-zinc-800 pt-4">
        <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500">
                <GitCommit className="size-4" />
            </div>
            <div>
                <div className="text-sm font-medium text-zinc-200">Total Changes</div>
                <div className="text-xs text-zinc-500">
                    <span className="text-emerald-500">+{additions}</span> / <span className="text-red-500">-{deletions}</span> lines
                </div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500">
                <FileDiff className="size-4" />
            </div>
            <div>
                <div className="text-sm font-medium text-zinc-200">Files Changed</div>
                <div className="text-xs text-zinc-500">{filesChanged} files modified</div>
            </div>
        </div>
        <div className="flex items-center gap-3">
            <div className="p-2 bg-zinc-900 rounded-lg text-zinc-500">
                <GitPullRequest className="size-4" />
            </div>
            <div>
                <div className="text-sm font-medium text-zinc-200">Review Status</div>
                <div className="text-xs text-zinc-500">2 approvals required</div>
            </div>
        </div>
      </div>
    </GlassCard>
  );
}
