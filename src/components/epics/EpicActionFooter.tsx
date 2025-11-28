
import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Play, Pause, ExternalLink } from 'lucide-react';
import { EpicState } from '@/lib/types';

interface EpicActionFooterProps {
  status: EpicState | string;
  onAction: (action: string) => void;
}

export function EpicActionFooter({ status, onAction }: EpicActionFooterProps) {
  if (status === 'done' || status === 'cancelled') return null;

  return (
    <div className="sticky bottom-0 left-0 right-0 p-4 bg-[#09090b]/80 backdrop-blur-xl border-t border-zinc-800 flex items-center justify-between z-20 animate-in slide-in-from-bottom-4">
      <div className="text-sm text-zinc-500">
        Current Phase: <span className="text-zinc-200 font-medium uppercase">{status.replace(/_/g, ' ')}</span>
      </div>

      <div className="flex items-center gap-3">
        {status === 'planning_review' && (
            <>
                <Button variant="outline" onClick={() => onAction('revise')} className="border-zinc-700 text-zinc-300">
                    Request Changes
                </Button>
                <Button onClick={() => onAction('approve_plan')} className="bg-emerald-600 hover:bg-emerald-500 text-white">
                    <CheckCircle className="size-4 mr-2" />
                    Approve Plan
                </Button>
            </>
        )}

        {status === 'code_review' && (
            <>
                <Button variant="outline" onClick={() => onAction('view_pr')} className="border-zinc-700 text-zinc-300">
                    <ExternalLink className="size-4 mr-2" />
                    View in GitHub
                </Button>
                <Button onClick={() => onAction('merge')} className="bg-purple-600 hover:bg-purple-500 text-white">
                    <GitMerge className="size-4 mr-2" />
                    Approve Merge
                </Button>
            </>
        )}

        {status === 'executing' && (
            <>
                <Button variant="destructive" onClick={() => onAction('cancel')} size="sm">
                    <XCircle className="size-4 mr-2" />
                    Cancel
                </Button>
                <Button variant="secondary" onClick={() => onAction('pause')} size="sm">
                    <Pause className="size-4 mr-2" />
                    Pause
                </Button>
            </>
        )}
        
        {/* Fallback/Default Actions */}
        {['open', 'planning', 'failed'].includes(status) && (
             <Button onClick={() => onAction('retry')} className="bg-zinc-100 text-zinc-950 hover:bg-white">
                {status === 'failed' ? 'Retry Workflow' : 'Start Workflow'}
             </Button>
        )}
      </div>
    </div>
  );
}

function GitMerge({ className }: { className?: string }) {
    return (
        <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="18" cy="18" r="3" />
            <circle cx="6" cy="6" r="3" />
            <path d="M6 21V9a9 9 0 0 0 9 9" />
        </svg>
    );
}
