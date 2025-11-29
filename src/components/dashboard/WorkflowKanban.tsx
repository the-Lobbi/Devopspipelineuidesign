import React from 'react';
import { useFilteredEpics } from '@/lib/store';
import { EpicCard } from './EpicCard';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

interface WorkflowKanbanProps {
  onEpicClick: (epicId: string) => void;
}

export function WorkflowKanban({ onEpicClick }: WorkflowKanbanProps) {
  const filteredEpics = useFilteredEpics();

  const columns = [
    { id: 'PLANNING', label: 'Planning', status: ['planning', 'queued_for_planning', 'open'] },
    { id: 'REVIEW', label: 'Approval', status: ['planning_review', 'review', 'revising'] },
    { id: 'EXECUTING', label: 'Executing', status: ['executing', 'assigning'] },
    { id: 'CODE_REVIEW', label: 'Code Review', status: ['code_review', 'pr_created', 'approved_for_merge'] },
    { id: 'DONE', label: 'Done', status: ['done', 'documenting', 'merging'] },
  ];

  return (
    <div className="flex-1 min-h-0 flex flex-col">
        <div className="flex items-center justify-between mb-6 px-6">
            <h2 className="text-lg font-medium text-zinc-200">Workflow Overview</h2>
            <Button variant="outline" size="sm" className="h-8 rounded-full border-zinc-700 bg-zinc-900/50 text-zinc-300 hover:text-white hover:bg-zinc-800">
                <Plus className="size-3.5 mr-1.5" />
                New Epic
            </Button>
        </div>

        <ScrollArea className="flex-1 w-full">
            <div className="flex gap-6 px-6 pb-6 min-w-max">
                {columns.map((col) => {
                    const colEpics = filteredEpics.filter(e => col.status.includes(e.status.toLowerCase()));
                    
                    return (
                        <div key={col.id} className="w-[300px] flex flex-col">
                            <div className="flex items-center justify-between mb-4 px-1">
                                <div className="flex items-center gap-2">
                                    <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider" id={`col-header-${col.id}`}>{col.label}</span>
                                    <span className="text-[10px] font-medium text-zinc-400 bg-zinc-900 border border-zinc-800 px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
                                        {colEpics.length}
                                    </span>
                                </div>
                            </div>

                            <div className="flex flex-col gap-3" role="list" aria-labelledby={`col-header-${col.id}`}>
                                {colEpics.map(epic => (
                                    <div key={epic.id} role="listitem">
                                        <EpicCard epic={epic} onClick={() => onEpicClick(epic.id)} />
                                    </div>
                                ))}
                                {colEpics.length === 0 && (
                                    <div className="h-32 rounded-2xl border border-dashed border-zinc-800/50 bg-zinc-900/20 flex items-center justify-center">
                                        <span className="text-xs text-zinc-700">No active items</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
            <ScrollBar orientation="horizontal" />
        </ScrollArea>
    </div>
  );
}
