
import React from 'react';
import { cn } from '@/lib/utils';
import { EPICS } from '@/lib/data';
import { MoreHorizontal, Link2, Bot, Clock, User, Shield, GitPullRequest, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface KanbanBoardProps {
    onEpicClick: (epicId: string) => void;
}

export function KanbanBoard({ onEpicClick }: KanbanBoardProps) {
  const columns = [
    { id: 'PLANNING', label: 'Planning', count: 2 },
    { id: 'REVIEW', label: 'Approval', count: 1 },
    { id: 'EXECUTING', label: 'Executing', count: 2 },
    { id: 'CODE_REVIEW', label: 'Code Review', count: 1 },
    { id: 'DONE', label: 'Done', count: 1 },
  ];

  return (
    <div className="flex-1 p-6 pt-0 overflow-x-auto min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium text-zinc-200">Workflows</h2>
            <Button variant="outline" size="sm" className="h-8 rounded-full border-zinc-700 bg-transparent text-zinc-300 hover:text-white hover:bg-zinc-800">
                <Plus className="size-3.5 mr-1.5" />
                New Epic
            </Button>
        </div>

        <div className="flex gap-4 h-full min-w-[1000px]">
            {columns.map((col) => {
                const colEpics = EPICS.filter(e => e.status === col.id);
                
                return (
                    <div key={col.id} className="flex-1 min-w-[280px] flex flex-col">
                        <div className="flex items-center justify-between mb-3 px-1">
                            <div className="flex items-center gap-2">
                                <span className="text-xs font-medium text-zinc-500 uppercase tracking-wide">{col.label}</span>
                                <span className="text-xs text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded">{colEpics.length}</span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 h-full">
                            {colEpics.map(epic => (
                                <EpicCard key={epic.id} epic={epic} onClick={() => onEpicClick(epic.id)} />
                            ))}
                            {colEpics.length === 0 && (
                                <div className="h-24 rounded-xl border border-dashed border-zinc-800/50 flex items-center justify-center">
                                    <span className="text-xs text-zinc-700">No items</span>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
}

function EpicCard({ epic, onClick }: { epic: any, onClick: () => void }) {
    const isWaiting = epic.status === 'REVIEW';
    
    return (
        <div 
            onClick={onClick}
            className={cn(
                "group relative p-4 rounded-2xl border cursor-pointer transition-all duration-200 hover:-translate-y-1",
                isWaiting 
                    ? "border-amber-900/30 bg-amber-950/10 hover:bg-amber-900/20" 
                    : "bg-[#121214] border-zinc-800/50 hover:border-zinc-700 hover:bg-[#18181b]"
            )}
        >
            <div className="flex items-start justify-between mb-2">
                <span className="px-2 py-0.5 rounded-md bg-zinc-900 text-[10px] font-mono text-zinc-500 border border-zinc-800">
                    {epic.key}
                </span>
                <button className="p-1 -mr-1 -mt-1 rounded-full hover:bg-zinc-800 text-zinc-600 hover:text-zinc-400 transition-colors">
                    <MoreHorizontal className="size-4" />
                </button>
            </div>
            
            <h3 className="text-sm font-medium text-zinc-200 mb-3 leading-snug">
                {epic.title}
            </h3>
            
            <div className="flex flex-wrap gap-1.5 mb-4">
                {epic.tags.map((tag: string) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-zinc-900 text-zinc-500 border border-zinc-800/50">
                        {tag}
                    </span>
                ))}
            </div>
            
            <div className="space-y-3 pt-2 border-t border-zinc-800/30">
                <div className="flex items-center justify-between text-xs">
                   <div className="flex items-center gap-1.5 text-zinc-500">
                        {isWaiting ? <User className="size-3.5" /> : <Bot className="size-3.5" />}
                        <span>{epic.agent}</span>
                   </div>
                   {isWaiting && (
                       <span className="flex items-center gap-1 text-amber-500">
                           <Clock className="size-3" />
                           Action Required
                       </span>
                   )}
                </div>
                
                {/* Progress Bar */}
                <div className="h-1 w-full bg-zinc-900 rounded-full overflow-hidden">
                    <div 
                        className={cn(
                            "h-full rounded-full transition-all duration-500",
                            isWaiting ? "bg-amber-500" : "bg-zinc-100"
                        )}
                        style={{ width: `${epic.progress}%` }}
                    />
                </div>
            </div>
        </div>
    );
}
