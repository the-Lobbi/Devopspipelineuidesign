
import React, { useState } from 'react';
import { PLAN_DATA } from '@/lib/plan-data';
import { cn } from '@/lib/utils';
import { ChevronRight, ChevronDown, CheckCircle, Loader2, Circle, AlertCircle, XCircle, Plus } from 'lucide-react';

export function PlanView() {
  return (
    <div className="space-y-4 p-1">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-zinc-200">Epic Breakdown</h3>
        <div className="flex gap-2">
             <button className="text-xs text-zinc-500 hover:text-zinc-300">Expand All</button>
             <button className="text-xs text-zinc-500 hover:text-zinc-300">Collapse All</button>
        </div>
      </div>

      {PLAN_DATA.map((sprint) => (
        <SprintItem key={sprint.id} sprint={sprint} />
      ))}
    </div>
  );
}

function SprintItem({ sprint }: { sprint: any }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="border border-zinc-800 rounded-lg overflow-hidden mb-4">
      <div 
        className="flex items-center justify-between p-3 bg-zinc-900/80 cursor-pointer hover:bg-zinc-800 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-2">
          {isExpanded ? <ChevronDown className="size-4 text-zinc-500" /> : <ChevronRight className="size-4 text-zinc-500" />}
          <span className="font-medium text-zinc-200">📋 {sprint.title}</span>
        </div>
        <div className="text-xs text-zinc-500">{sprint.stories.length} Stories</div>
      </div>
      
      {isExpanded && (
        <div className="p-4 bg-zinc-950/30 border-t border-zinc-800 space-y-4">
          {sprint.stories.map((story: any) => (
            <StoryItem key={story.id} story={story} />
          ))}
        </div>
      )}
    </div>
  );
}

function StoryItem({ story }: { story: any }) {
    return (
        <div className="bg-zinc-900/40 rounded-lg border border-zinc-800/50 p-4">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                    <span className="font-medium text-zinc-200">📖 {story.title}</span>
                </div>
                <div className="flex items-center gap-3 text-xs">
                    <StatusPill status={story.status} />
                    <span className="px-2 py-0.5 bg-zinc-800 rounded text-zinc-400">{story.points} pts</span>
                    <span className="text-zinc-500">Agent: <span className="text-zinc-300">{story.agent}</span></span>
                </div>
            </div>
            
            {story.tasks && (
                <div className="ml-4 pl-4 border-l border-zinc-800 space-y-3 mt-2">
                    {story.tasks.map((task: any) => (
                        <TaskItem key={task.id} task={task} />
                    ))}
                </div>
            )}
        </div>
    );
}

function TaskItem({ task }: { task: any }) {
    return (
        <div className="bg-zinc-950 rounded border border-zinc-800 p-3">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                   <StatusIcon status={task.status} size={16} />
                   <span className="text-sm font-medium text-zinc-300">{task.title}</span>
                </div>
                {task.agent && (
                    <span className="text-[10px] text-violet-400 bg-violet-500/10 px-1.5 py-0.5 rounded border border-violet-500/20">
                        {task.agent}
                    </span>
                )}
            </div>
            
            {task.subtasks && (
                <div className="space-y-1 mt-2 ml-1">
                    {task.subtasks.map((sub: any) => (
                        <div key={sub.id} className="flex items-center gap-2 pl-6 relative">
                             {/* Connector lines would go here conceptually */}
                             <div className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-px bg-zinc-800" />
                             <div className="absolute left-2 top-0 bottom-1/2 w-px bg-zinc-800" />
                             
                             <StatusIcon status={sub.status} size={12} />
                             <span className="text-sm text-zinc-500">{sub.title}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function StatusIcon({ status, size = 14 }: { status: string, size?: number }) {
    if (status === 'complete') return <CheckCircle className="text-green-500" size={size} />;
    if (status === 'in-progress') return <Loader2 className="text-blue-500 animate-spin" size={size} />;
    if (status === 'failed') return <XCircle className="text-red-500" size={size} />;
    return <Circle className="text-zinc-600" size={size} />;
}

function StatusPill({ status }: { status: string }) {
    if (status === 'complete') return <span className="text-green-400 flex items-center gap-1"><CheckCircle size={12} /> Complete</span>;
    if (status === 'in-progress') return <span className="text-blue-400 flex items-center gap-1"><Loader2 size={12} className="animate-spin" /> In Progress</span>;
    return <span className="text-zinc-500 flex items-center gap-1"><Circle size={12} /> Pending</span>;
}
