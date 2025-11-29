import React, { useEffect, useRef, useState } from 'react';
import { Terminal, X, Minimize2, Maximize2, Play, Pause, Trash2, Filter, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

import { ToolResultRenderer } from '@/components/agents/ToolResultRenderer';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error' | 'debug' | 'success';
  source: string;
  message: string;
  toolName?: string;
  toolOutput?: any;
  nodeId?: string;
}

interface GlobalConsoleProps {
    logs?: LogEntry[];
    onLogClick?: (log: LogEntry) => void;
}

export function GlobalConsole({ logs: externalLogs, onLogClick }: GlobalConsoleProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [internalLogs, setInternalLogs] = useState<LogEntry[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Use external logs if provided, otherwise use internal simulation
  const logs = externalLogs || internalLogs;

  // Simulate incoming logs only if no external logs provided
  useEffect(() => {
    if (externalLogs || isPaused) return;

    const sources = ['Orchestrator', 'System', 'Network', 'Security', 'Database', 'Phase Manager'];
    const messages = [
      { level: 'info', msg: 'Heartbeat check successful' },
      { level: 'debug', msg: 'Syncing state with remote shards...' },
      { level: 'success', msg: 'Packet delivery confirmed' },
      { level: 'warn', msg: 'Latency spike detected (140ms)' },
      { level: 'info', msg: 'Garbage collection scheduled' },
      { level: 'debug', msg: 'Re-indexing vector store...' },
      { level: 'success', msg: 'PHASE_COMPLETE: Foundation Setup' },
      { level: 'info', msg: 'Transitioning to Phase: Backend Core' },
    ];

    const interval = setInterval(() => {
      const randomSource = sources[Math.floor(Math.random() * sources.length)];
      const randomMsg = messages[Math.floor(Math.random() * messages.length)];
      
      const newLog: LogEntry = {
        id: Math.random().toString(36).substring(7),
        timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
        level: randomMsg.level as any,
        source: randomSource,
        message: randomMsg.msg
      };

      setInternalLogs(prev => [...prev.slice(-99), newLog]);
    }, 2500);

    return () => clearInterval(interval);
  }, [isPaused, externalLogs]);

  // Auto-scroll
  useEffect(() => {
    if (scrollRef.current && !isPaused) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs, isPaused]);

  return (
    <div className={cn(
      "fixed bottom-0 left-0 right-0 bg-[#09090b] border-t border-zinc-800 transition-all duration-300 z-40 flex flex-col shadow-[0_-10px_40px_rgba(0,0,0,0.5)]",
      isExpanded ? "h-80" : "h-10"
    )}>
      {/* Header / Toggle Bar */}
      <div 
        className="h-10 flex items-center justify-between px-4 cursor-pointer hover:bg-zinc-900/50 transition-colors border-b border-zinc-800/0 hover:border-zinc-800"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-zinc-400">
            <Terminal className="size-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider">Global Event Stream</span>
          </div>
          
          {!isExpanded && logs.length > 0 && (
            <div className="flex items-center gap-2 animate-fade-in">
               <span className="text-zinc-600 text-xs">Last:</span>
               <span className={cn(
                 "text-xs font-mono truncate max-w-[300px]",
                 logs[logs.length-1].level === 'error' ? "text-red-400" : 
                 logs[logs.length-1].level === 'warn' ? "text-amber-400" : 
                 logs[logs.length-1].level === 'success' ? "text-emerald-400" : "text-zinc-400"
               )}>
                 {logs[logs.length-1].message}
               </span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1">
            <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-500 font-mono text-[10px] h-5 px-1.5">
                {logs.length} EVENTS
            </Badge>
            <div className="h-4 w-px bg-zinc-800 mx-2" />
            {isExpanded ? <Minimize2 className="size-3.5 text-zinc-500" /> : <Maximize2 className="size-3.5 text-zinc-500" />}
        </div>
      </div>

      {/* Console Content */}
      <div className="flex-1 flex min-h-0">
        <div className="w-48 border-r border-zinc-800 p-2 hidden md:flex flex-col gap-2 bg-[#0c0c0e]">
            <div className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider px-2 py-1">Sources</div>
            {['All Sources', 'Orchestrator', 'System', 'Network', 'Security'].map((s, i) => (
                <button key={s} className={cn(
                    "text-xs text-left px-2 py-1.5 rounded hover:bg-zinc-800/50 transition-colors truncate",
                    i === 0 ? "text-violet-400 bg-violet-500/10" : "text-zinc-500"
                )}>
                    {s}
                </button>
            ))}
        </div>

        <div className="flex-1 flex flex-col bg-[#050506]">
            {/* Toolbar */}
            <div className="h-9 border-b border-zinc-800 flex items-center justify-between px-3 bg-[#0c0c0e]">
                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-zinc-400 hover:text-zinc-200"
                        onClick={(e) => { e.stopPropagation(); setIsPaused(!isPaused); }}
                    >
                        {isPaused ? <Play className="size-3" /> : <Pause className="size-3" />}
                    </Button>
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-zinc-400 hover:text-zinc-200"
                        onClick={(e) => { e.stopPropagation(); setInternalLogs([]); }}
                    >
                        <Trash2 className="size-3" />
                    </Button>
                </div>
                <div className="flex items-center gap-2">
                    <div className="relative">
                        <Filter className="absolute left-2 top-1/2 -translate-y-1/2 size-3 text-zinc-600" />
                        <input 
                            className="bg-zinc-900/50 border border-zinc-800 rounded h-6 w-40 pl-7 pr-2 text-[10px] text-zinc-300 focus:outline-none focus:border-zinc-700 font-mono placeholder:text-zinc-700"
                            placeholder="Filter grep..."
                        />
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-2 space-y-0.5 font-mono text-[11px]"
            >
                {logs.map((log) => (
                    <div 
                        key={log.id} 
                        className={cn(
                            "flex flex-col gap-1 px-2 py-0.5 hover:bg-zinc-900/30 rounded group transition-colors",
                            log.nodeId && "cursor-pointer hover:bg-zinc-900/50"
                        )}
                        onClick={() => onLogClick?.(log)}
                    >
                        <div className="flex items-start gap-3">
                            <span className="text-zinc-600 w-16 shrink-0 select-none">{log.timestamp}</span>
                            <span className={cn(
                                "w-20 shrink-0 uppercase font-bold select-none",
                                log.level === 'info' && "text-blue-400",
                                log.level === 'warn' && "text-amber-400",
                                log.level === 'error' && "text-red-400",
                                log.level === 'success' && "text-emerald-400",
                                log.level === 'debug' && "text-zinc-500",
                            )}>
                                [{log.level}]
                            </span>
                            <span className="w-24 shrink-0 text-violet-400/70 truncate select-none">{log.source}</span>
                            <span className="text-zinc-300 break-all group-hover:text-white transition-colors">
                                {log.message}
                            </span>
                        </div>
                        {log.toolOutput && (
                            <div className="pl-[11rem] pb-2 pr-4">
                                <ToolResultRenderer toolName={log.toolName} output={log.toolOutput} />
                            </div>
                        )}
                    </div>
                ))}
                {logs.length === 0 && (
                    <div className="h-full flex items-center justify-center text-zinc-700 italic">
                        No events recorded
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}