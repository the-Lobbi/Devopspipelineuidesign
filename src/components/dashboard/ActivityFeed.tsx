"use client"

import React, { useState, useEffect, useRef } from 'react';
import { useActivities, useConnectionStatus } from '../../lib/store';
import { cn } from '../../lib/utils';
import { Terminal, CheckCircle2, MessageSquare, Activity, Zap, GitPullRequest, FileText, Pause, Play, Hash } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Button } from '../ui/button';

export function ActivityFeed({ className }: { className?: string }) {
  const activities = useActivities();
  const connectionStatus = useConnectionStatus();
  const isConnected = connectionStatus === 'connected';
  const [isLive, setIsLive] = useState(true);
  const scrollEndRef = useRef<HTMLDivElement>(null);

  // Track which items are "new" (added in last 3 seconds)
  const [newItemIds, setNewItemIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (activities.length > 0) {
      const latestId = activities[0].id;
      setNewItemIds((prev) => new Set([...prev, String(latestId)]));
      
      const timer = setTimeout(() => {
        setNewItemIds((prev) => {
          const next = new Set(prev);
          next.delete(String(latestId));
          return next;
        });
      }, 3000);

      if (isLive && scrollEndRef.current) {
         // Use a slight delay to ensure DOM is updated
         setTimeout(() => {
             scrollEndRef.current?.scrollIntoView({ behavior: 'smooth' });
         }, 100);
      }

      return () => clearTimeout(timer);
    }
  }, [activities, isLive]);

  const parseContent = (text: string) => {
      if (!text) return null;
      
      // Simple tokenizer for file paths and hashes
      // This regex matches words that look like file paths or git hashes
      const regex = /((?:[\w-]+\/)+[\w-]+\.\w+)|(\b[0-9a-f]{7,40}\b)|(GA-\d+)/g;
      
      const parts = [];
      let lastIndex = 0;
      let match;

      while ((match = regex.exec(text)) !== null) {
          if (match.index > lastIndex) {
              parts.push(text.substring(lastIndex, match.index));
          }

          const [fullMatch, filePath, hash, ticket] = match;

          if (filePath) {
              parts.push(
                  <span 
                    key={match.index} 
                    className="text-emerald-400 font-mono hover:underline cursor-pointer mx-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`Opening file: ${filePath}`);
                    }}
                  >
                      {filePath}
                  </span>
              );
          } else if (hash) {
              parts.push(
                  <span 
                    key={match.index} 
                    className="text-purple-400 font-mono mx-1"
                  >
                      <Hash className="inline-block size-3 mr-0.5" />
                      {hash.substring(0, 7)}
                  </span>
              );
          } else if (ticket) {
              parts.push(
                  <span 
                    key={match.index} 
                    className="text-blue-400 font-mono font-bold hover:underline cursor-pointer mx-1"
                    onClick={(e) => {
                        e.stopPropagation();
                        toast.info(`Navigating to Epic ${ticket}`);
                    }}
                  >
                      {ticket}
                  </span>
              );
          }

          lastIndex = regex.lastIndex;
      }

      if (lastIndex < text.length) {
          parts.push(text.substring(lastIndex));
      }

      return parts.length > 0 ? parts : text;
  };

  return (
    <div className={cn("w-80 border-l border-zinc-800/50 bg-[#09090b] flex flex-col h-full", className)}>
        <div className="p-4 border-b border-zinc-800/50 flex items-center justify-between bg-[#09090b]/95 backdrop-blur sticky top-0 z-10">
            <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium text-zinc-400">Live Activity</h3>
                <div className={cn(
                    "flex items-center gap-1.5 px-1.5 py-0.5 rounded-full border transition-colors duration-300",
                    isConnected 
                        ? "bg-emerald-500/10 border-emerald-500/20" 
                        : "bg-amber-500/10 border-amber-500/20"
                )}>
                    <div className={cn(
                        "size-1.5 rounded-full",
                        isConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"
                    )} />
                </div>
            </div>
            
            <Button 
                variant="ghost" 
                size="icon" 
                className={cn("h-6 w-6 rounded-full", isLive ? "text-emerald-500 bg-emerald-500/10" : "text-zinc-500")}
                onClick={() => setIsLive(!isLive)}
                title={isLive ? "Pause Live Feed" : "Resume Live Feed"}
            >
                {isLive ? <Pause className="size-3" /> : <Play className="size-3" />}
            </Button>
        </div>
        
        <ScrollArea className="flex-1 p-5">
            <div aria-live="polite" aria-label="Activity feed" className="space-y-8 relative min-h-full">
                <div className="absolute left-[19px] top-3 bottom-3 w-px bg-zinc-800/50" />
                
                {/* We reverse the array for display so latest is at bottom if we want 'terminal style', 
                    BUT the design usually has latest at top. 
                    The requirement 'stick-to-bottom' implies terminal style (latest at bottom).
                    However, the current store adds new items to the START of the array.
                    If we want 'stick-to-bottom', we should render in reverse order (oldest first) 
                    OR just scroll to top? 
                    'Stick-to-bottom' usually means new items appear at the bottom.
                    I will reverse the slice for display to match 'terminal' feel.
                */}
                {[...activities].reverse().slice(-50).map((item) => {
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

                    const isNew = newItemIds.has(String(item.id));

                    return (
                        <div 
                            key={item.id} 
                            className={cn(
                                "relative pl-12 group transition-all duration-500",
                                isNew ? "animate-in slide-in-from-right-4 fade-in" : ""
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
                                
                                <p className="text-sm text-zinc-400 leading-relaxed group-hover:text-zinc-300 transition-colors break-words">
                                    {parseContent(item.description)}
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
                <div ref={scrollEndRef} />
            </div>
        </ScrollArea>
    </div>
  );
}
