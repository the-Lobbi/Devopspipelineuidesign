
import React, { useState } from 'react';
import { ExternalLink, ChevronLeft, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ApprovalModal } from '../modals/ApprovalModal';

interface EpicHeaderProps {
  epic: any;
  onBack: () => void;
}

export function EpicHeader({ epic, onBack }: EpicHeaderProps) {
  const [showApproval, setShowApproval] = useState(false);

  return (
    <div className="mb-6">
      <ApprovalModal 
        isOpen={showApproval} 
        onClose={() => setShowApproval(false)} 
        epicKey={epic.key}
        epicTitle={epic.title}
      />

      <Button 
        variant="ghost" 
        className="mb-4 pl-0 text-zinc-500 hover:text-zinc-300 hover:bg-transparent"
        onClick={onBack}
      >
        <ChevronLeft className="mr-1 size-4" />
        Back to Epics
      </Button>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <span className="text-sm text-zinc-500 font-mono mb-1 block">{epic.key}</span>
            <h1 className="text-2xl font-semibold text-zinc-100 mb-2">{epic.title}</h1>
            <p className="text-zinc-400 max-w-2xl line-clamp-2">{epic.description}</p>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg flex flex-col items-center min-w-[100px]">
              <span className="text-xs font-bold">{epic.status}</span>
              <span className="text-[10px] opacity-80">🤖 {epic.agent?.split(' ')[0] || 'Agent'}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mb-6">
          {epic.tags?.map((tag: string) => (
             <span key={tag} className="px-2.5 py-1 rounded-md text-xs font-medium bg-zinc-800 text-zinc-400 border border-zinc-700">
                {tag}
             </span>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-zinc-800/50">
          <div className="flex flex-wrap gap-x-8 gap-y-2 text-sm text-zinc-400">
             <div>
                <span className="text-zinc-500 mr-2">Repository:</span>
                <span className="text-zinc-200">{epic.repo}</span>
             </div>
             <div>
                <span className="text-zinc-500 mr-2">Branch:</span>
                <span className="font-mono text-zinc-200">{epic.branch}</span>
             </div>
             <div>
                <span className="text-zinc-500 mr-2">Assignee:</span>
                <span className="text-zinc-200">{epic.assignee}</span>
             </div>
          </div>

          <div className="flex gap-4">
            {(epic.status === 'PLANNING' || epic.status === 'REVIEW') && (
                <Button 
                    onClick={() => setShowApproval(true)}
                    className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 hover:text-amber-400 border border-amber-500/50"
                >
                    <ShieldCheck className="size-4 mr-2" />
                    Review Plan
                </Button>
            )}

            {['Jira Ticket', 'GitHub PR', 'Confluence'].map((link) => (
              <a key={link} href="#" className="flex items-center gap-1 text-sm text-zinc-500 hover:text-violet-400 transition-colors">
                {link} <ExternalLink className="size-3" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
