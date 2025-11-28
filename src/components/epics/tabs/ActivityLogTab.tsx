
import React from 'react';
import { useActivity } from '@/lib/context/activity-provider';
import { Activity, Terminal, CheckCircle2, MessageSquare, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ActivityLogTab() {
  const { activities } = useActivity();

  return (
    <div className="space-y-8 max-w-3xl mx-auto py-4">
        {activities.map((item, index) => {
            let Icon = Activity;
            let colorClass = "bg-zinc-500";
            
            if (item.type === 'code') {
                Icon = Terminal;
                colorClass = "bg-emerald-500";
            } else if (item.type === 'test') {
                Icon = CheckCircle2;
                colorClass = "bg-blue-500";
            } else if (item.type === 'human') {
                Icon = MessageSquare;
                colorClass = "bg-amber-500";
            }

            return (
                <div key={item.id} className="relative pl-8 group">
                    {/* Timeline Line */}
                    {index !== activities.length - 1 && (
                        <div className="absolute left-[11px] top-8 bottom-[-32px] w-px bg-zinc-800 group-hover:bg-zinc-700 transition-colors" />
                    )}
                    
                    <div className={cn(
                        "absolute left-0 top-1 size-6 rounded-full border-4 border-[#09090b] flex items-center justify-center z-10",
                        colorClass
                    )}>
                        <Icon className="size-3 text-white" />
                    </div>
                    
                    <div className="bg-[#121214] border border-zinc-800/50 rounded-xl p-4 hover:border-zinc-700 transition-colors">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium text-zinc-200">{item.agentName}</span>
                                <span className="text-xs text-zinc-600 bg-zinc-900 px-1.5 py-0.5 rounded">{item.type}</span>
                            </div>
                            <span className="text-xs text-zinc-500 font-mono">{item.timestamp}</span>
                        </div>
                        
                        <p className="text-sm text-zinc-400">
                            {item.description}
                        </p>
                        
                        {item.context && (
                            <div className="mt-3 pt-2 border-t border-zinc-800/50">
                                <span className="text-xs font-mono text-zinc-600 flex items-center gap-1">
                                    <Zap className="size-3" /> {item.context}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            );
        })}
    </div>
  );
}
