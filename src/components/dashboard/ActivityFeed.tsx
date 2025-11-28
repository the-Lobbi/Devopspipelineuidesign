"use client"

import React, { useState, useEffect } from 'react';
import { useActivities, useConnectionStatus } from '@/lib/store';
import { cn } from '@/lib/utils';
import { Terminal, CheckCircle2, MessageSquare, Activity, Zap, GitPullRequest, FileText } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner@2.0.3';

export function ActivityFeed({ className }: { className?: string }) {
  const activities = useActivities();
  const connectionStatus = useConnectionStatus();
  const isConnected = connectionStatus === 'connected';

  // Track which items are "new" (added in last 3 seconds)
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activities.length > 0) {
      const latestId = activities[0].id;
      setNewItemIds((prev) => new Set([...prev, latestId]));
      const timer = setTimeout(() => {
        setNewItemIds((prev) => {
          const next = new Set(prev);
          next.delete(latestId);
          return next;
        });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [activities]);

  return (
    <div className={cn("w-80 border-l border-zinc-800/50 bg-[#09090b] flex flex-col", className)}>
        <div className="p-5 border-b border-zinc-800/50 flex items-center justify-between bg-[#09090b]/95 backdrop-blur sticky top-0 z-10">
            <h3 className="text-sm font-medium text-zinc-400">Live Activity</h3>
            <div className={cn(
                "flex items-center gap-1.5 px-2 py-0.5 rounded-full border transition-colors duration-300",
                isConnected 
                    ? "bg-emerald-500/10 border-emerald-500/20" 
                    : "bg-amber-500/10 border-amber-500/20"
            )}>
                <div className={cn(
                    "size-1.5 rounded-full",
                    isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                )} />
                <span className={cn(
                    "text-[10px] font-medium",
                    isConnected ? "text-emerald-500" : "text-amber-500"
                )}>
                    {isConnected ? "Live" : "Connecting..."}
                </span>
            </div>
        </div>
        
        <ScrollArea className="flex-1 p-5">
            <div aria-live="polite" aria-label="Activity feed" className="space-y-8 relative">
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-zinc-800/50" />
                
                {activities.slice(0, 20).map((item) => {
                    let Icon = Activity;
                    let colorClass = "bg-zinc-500";
                    
                    if (item.type === 'code' || item.description?.includes('Created') || item.description?.includes('Updated')) {
                        Icon = Terminal;
                        colorClass = "bg-emerald-500";
                    } else if (item.type === 'test' || item.description?.includes('test')) {
                        Icon = CheckCircle2;
                        colorClass = "bg-blue-500";
                    } else if (item.type === 'human' || item.agentName === 'Markus' || item.agentName?.startsWith('@')) {
                        Icon = MessageSquare;
                        colorClass = "bg-amber-500";
                    } else if (item.type === 'pr') {
                        Icon = GitPullRequest;
                        colorClass = "bg-purple-500";
                    } else if (item.type === 'system') {
                        Icon = Zap;
                        colorClass = "bg-zinc-500";
                    }

                    const isNew = newItemIds.has(item.id);

                    return (
                        <div 
                            key={item.id} 
                            className={cn(
                                "relative pl-12 group transition-all duration-500",
                                isNew ? "animate-in slide-in-from-left-4 fade-in" : ""
                            )}
                        >
                            <div className={cn(
                                "absolute left-0 top-0.5 size-9 rounded-full border-4 border-[#09090b] flex items-center justify-center z-10 shadow-sm transition-transform group-hover:scale-110",
                                "bg-zinc-900 text-zinc-400"
                            )}>
                                <Icon className={cn("size-4")} />
                                <div className={cn("absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#09090b]", colorClass)} />
                            </div>
                            
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-semibold text-zinc-200">{item.agentName}</span>
                                    <span className="text-[10px] text-zinc-600 font-mono">{item.timestamp}</span>
                                </div>
                                
                                <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors">
                                    {item.description}
                                </p>
                                
                                {item.context && (
                                    <div className="flex items-center gap-1.5 mt-1">
                                        <FileText className="size-3 text-zinc-600" />
                                        <span 
                                            className="text-[10px] text-zinc-500 font-mono truncate max-w-[180px] hover:text-zinc-400 cursor-pointer"
                                            onClick={() => toast.info(`Viewing context`, { description: item.context })}
                                        >
                                            {item.context}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </ScrollArea>
    </div>
  );
}
