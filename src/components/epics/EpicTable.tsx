
import React from 'react';
import { EPICS } from '@/lib/data';
import { cn } from '@/lib/utils';
import { MoreHorizontal, Bot, AlertTriangle, CornerDownRight } from 'lucide-react';

interface EpicTableProps {
    onEpicClick: (id: string) => void;
}

export function EpicTable({ onEpicClick }: EpicTableProps) {
  return (
    <div className="flex-1 overflow-auto">
      <table className="w-full text-left border-collapse">
        <thead className="sticky top-0 bg-zinc-950 z-10 text-xs font-medium text-zinc-500 uppercase tracking-wider border-b border-zinc-800">
          <tr>
            <th className="px-4 py-3 w-10"><input type="checkbox" className="rounded bg-zinc-900 border-zinc-700" /></th>
            <th className="px-4 py-3">Epic Key</th>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Progress</th>
            <th className="px-4 py-3">Updated</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {EPICS.map((epic) => {
            const isPlanning = epic.status === 'planning';
            const isReview = epic.status === 'approval';
            const isExecuting = epic.status === 'executing';
            
            return (
              <React.Fragment key={epic.id}>
                <tr 
                    onClick={() => onEpicClick(epic.id)}
                    className="group hover:bg-zinc-900/50 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3 w-10" onClick={e => e.stopPropagation()}>
                    <input type="checkbox" className="rounded bg-zinc-900 border-zinc-700" />
                  </td>
                  <td className="px-4 py-3 font-mono text-sm text-zinc-400 group-hover:text-violet-400 transition-colors">
                    {epic.jiraKey}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-zinc-200 mb-0.5">{epic.summary}</div>
                    <div className="flex gap-1">
                        {epic.labels?.map(tag => (
                            <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 text-zinc-500 rounded">{tag}</span>
                        ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge status={epic.status} agent={epic.assignee || 'Unassigned'} />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-col gap-1 w-24">
                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                            <div 
                                className={cn(
                                    "h-full rounded-full",
                                    isReview ? "bg-amber-500" : "bg-gradient-to-r from-blue-500 to-violet-500"
                                )}
                                style={{ width: `${epic.progress}%` }}
                            />
                        </div>
                        <span className="text-[10px] text-zinc-500">{epic.currentStep}/{epic.totalSteps}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-zinc-500">
                    2m ago
                  </td>
                </tr>
                
                {/* Context Row (expanded-like detail) */}
                <tr className="bg-zinc-900/20 border-b border-transparent">
                    <td colSpan={2}></td>
                    <td colSpan={4} className="px-4 pb-3 pt-0">
                        <div className="flex items-center gap-2 text-xs text-zinc-500 pl-4 border-l border-zinc-800 relative">
                            <CornerDownRight className="size-3 absolute -left-[5px] top-0 text-zinc-700" />
                            {isReview ? (
                                <span className="flex items-center gap-1.5 text-amber-500/90">
                                    <AlertTriangle className="size-3" />
                                    Awaiting approval
                                </span>
                            ) : isPlanning ? (
                                <span className="flex items-center gap-1.5 text-zinc-400">
                                    <Bot className="size-3" />
                                    Planner Agent analyzing epic requirements
                                </span>
                            ) : (
                                <span className="flex items-center gap-1.5 text-zinc-400">
                                    <Bot className="size-3" />
                                    Code Generator working on {epic.targetRepo}
                                </span>
                            )}
                        </div>
                    </td>
                </tr>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function Badge({ status, agent }: { status: string, agent: string | null }) {
    let styles = "bg-zinc-800 text-zinc-400 border-zinc-700";
    
    if (status === 'planning') styles = "bg-blue-500/20 text-blue-400 border-blue-500/30";
    if (status === 'approval') styles = "bg-amber-500/20 text-amber-400 border-amber-500/30";
    if (status === 'executing') styles = "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
    if (status === 'code_review') styles = "bg-violet-500/20 text-violet-400 border-violet-500/30";
    if (status === 'done') styles = "bg-green-500/20 text-green-400 border-green-500/30";
    
    return (
        <div className={cn("inline-flex flex-col items-start justify-center px-2 py-1 rounded-md border text-[10px] font-medium leading-tight", styles)}>
            <span className="uppercase">{status.replace('_', ' ')}</span>
            {agent && <span className="opacity-70 flex items-center gap-1 mt-0.5">👤 {agent}</span>}
        </div>
    );
}
