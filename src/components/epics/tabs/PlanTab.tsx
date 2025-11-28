
import React from 'react';
import { PLAN_DATA } from '@/lib/plan-data';
import { ChevronDown, ChevronRight, CheckCircle2, Circle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export function PlanTab() {
  const [expanded, setExpanded] = React.useState<Set<string>>(new Set(['sprint-alpha', 'sprint-beta']));

  const toggle = (id: string) => {
    const next = new Set(expanded);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setExpanded(next);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex items-center justify-between">
        <div className="flex gap-4 text-sm text-zinc-500">
            <span>Total Stories: <span className="text-zinc-200">3</span></span>
            <span>Total Points: <span className="text-zinc-200">21</span></span>
        </div>
        <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-xs">Expand All</Button>
            <Button variant="ghost" size="sm" className="text-xs">Collapse All</Button>
        </div>
      </div>

      <div className="space-y-4">
        {PLAN_DATA.map((sprint) => (
            <Collapsible 
                key={sprint.id} 
                open={expanded.has(sprint.id)} 
                onOpenChange={() => toggle(sprint.id)}
                className="border border-zinc-800 rounded-xl bg-zinc-900/20 overflow-hidden"
            >
                <div className="flex items-center justify-between p-4 bg-zinc-900/40 border-b border-zinc-800/50">
                    <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-zinc-200 hover:text-white">
                        {expanded.has(sprint.id) ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
                        {sprint.title}
                    </CollapsibleTrigger>
                    <span className={cn(
                        "px-2 py-0.5 text-[10px] uppercase rounded-full border",
                        sprint.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                    )}>
                        {sprint.status}
                    </span>
                </div>
                
                <CollapsibleContent>
                    <div className="p-4 space-y-4">
                        {sprint.stories.map((story: any) => (
                            <div key={story.id} className="flex items-start gap-3 pl-2 border-l-2 border-zinc-800">
                                <div className="mt-0.5">
                                    {story.status === 'complete' ? (
                                        <CheckCircle2 className="size-4 text-emerald-500" />
                                    ) : (
                                        <Circle className="size-4 text-zinc-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-1">
                                        <h4 className="text-sm font-medium text-zinc-300">{story.title}</h4>
                                        <span className="text-xs text-zinc-500">{story.points} pts</span>
                                    </div>
                                    
                                    {story.tasks && story.tasks.length > 0 && (
                                        <div className="mt-3 space-y-2">
                                            {story.tasks.map((task: any) => (
                                                <div key={task.id} className="flex items-center gap-2 text-xs text-zinc-500 bg-zinc-900/50 p-2 rounded border border-zinc-800/50">
                                                    <div className={cn(
                                                        "size-1.5 rounded-full",
                                                        task.status === 'complete' ? "bg-emerald-500" : 
                                                        task.status === 'in-progress' ? "bg-blue-500 animate-pulse" : "bg-zinc-700"
                                                    )} />
                                                    <span>{task.title}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </CollapsibleContent>
            </Collapsible>
        ))}
      </div>
    </div>
  );
}
