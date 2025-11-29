import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  CheckCircle2, 
  Terminal, 
  MessageSquare, 
  Wrench, 
  ChevronDown, 
  ChevronRight, 
  Clock, 
  AlertCircle,
  Cpu
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

import { ToolResultRenderer } from './ToolResultRenderer';

export type AgEventType = 
  | 'RUN_STARTED' 
  | 'STEP_STARTED' 
  | 'TEXT_MESSAGE' 
  | 'TOOL_CALL' 
  | 'TOOL_RESULT'
  | 'STATE_DELTA' 
  | 'RUN_FINISHED'
  | 'ERROR';

export interface AgEvent {
  id: string;
  type: AgEventType;
  timestamp: string;
  content?: string; // For text messages
  stepName?: string; // For step start
  toolName?: string; // For tool calls
  toolInput?: Record<string, any>;
  toolOutput?: any;
  delta?: any; // For state deltas
  duration?: string;
}

interface AgUiEventStreamProps {
  events: AgEvent[];
  className?: string;
}

export function AgUiEventStream({ events, className }: AgUiEventStreamProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  return (
    <div className={cn("flex flex-col h-full bg-[#0c0c0e] rounded-xl overflow-hidden border border-zinc-800", className)}>
      {/* Header */}
      <div className="h-10 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between px-4">
         <div className="flex items-center gap-2">
            <Cpu className="size-3.5 text-violet-400" />
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider font-mono">Protocol Stream</span>
         </div>
         <Badge variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-600 text-[10px] font-mono">
            AG-UI v2.1
         </Badge>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-4 pb-8 space-y-0 relative min-h-full">
            {/* Vertical Timeline Line */}
            <div className="absolute left-[27px] top-4 bottom-4 w-px bg-zinc-800/50" />

            {events.map((event, index) => (
                <EventItem key={event.id} event={event} isLast={index === events.length - 1} />
            ))}
            <div ref={bottomRef} />
        </div>
      </ScrollArea>
    </div>
  );
}

function EventItem({ event, isLast }: { event: AgEvent, isLast: boolean }) {
    const [isExpanded, setIsExpanded] = useState(false);

    // Auto-expand tool calls if they are the last item
    useEffect(() => {
        if (isLast && event.type === 'TOOL_CALL') {
            setIsExpanded(true);
        }
    }, [isLast, event.type]);

    const getEventIcon = () => {
        switch (event.type) {
            case 'RUN_STARTED': return Play;
            case 'STEP_STARTED': return CheckCircle2; // Or a step icon
            case 'TEXT_MESSAGE': return MessageSquare;
            case 'TOOL_CALL': return Wrench;
            case 'TOOL_RESULT': return Terminal;
            case 'RUN_FINISHED': return CheckCircle2;
            case 'ERROR': return AlertCircle;
            default: return Clock;
        }
    };

    const getEventColor = () => {
        switch (event.type) {
            case 'RUN_STARTED': return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case 'STEP_STARTED': return "text-blue-400 bg-blue-500/10 border-blue-500/20";
            case 'TEXT_MESSAGE': return "text-zinc-400 bg-zinc-800/50 border-zinc-700/50";
            case 'TOOL_CALL': return "text-amber-400 bg-amber-500/10 border-amber-500/20";
            case 'TOOL_RESULT': return "text-purple-400 bg-purple-500/10 border-purple-500/20";
            case 'RUN_FINISHED': return "text-emerald-400 bg-emerald-500/10 border-emerald-500/20";
            case 'ERROR': return "text-red-400 bg-red-500/10 border-red-500/20";
            default: return "text-zinc-500 bg-zinc-800/30 border-zinc-800";
        }
    };

    const Icon = getEventIcon();
    const colorClass = getEventColor();

    return (
        <div className="relative pl-14 py-2 group animate-in fade-in slide-in-from-left-2 duration-300">
            {/* Timestamp */}
            <div className="absolute left-0 top-3 text-[9px] font-mono text-zinc-600 w-12 text-right">
                {event.timestamp}
            </div>

            {/* Icon Bubble */}
            <div className={cn(
                "absolute left-[18px] top-2 size-5 rounded-full border flex items-center justify-center z-10 bg-[#0c0c0e] transition-colors",
                colorClass.split(' ')[0].replace('text-', 'border-') // Use the color for border
            )}>
                 <Icon className={cn("size-2.5", colorClass.split(' ')[0])} />
            </div>

            {/* Content Card */}
            <div className={cn(
                "rounded-lg border text-sm overflow-hidden transition-all",
                event.type === 'TEXT_MESSAGE' ? "bg-transparent border-transparent px-0 py-0" : "bg-zinc-900/30 border-zinc-800/50"
            )}>
                {/* Render Logic based on Type */}
                
                {event.type === 'RUN_STARTED' && (
                    <div className="px-3 py-2 flex items-center gap-2">
                        <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Pipeline Started</span>
                        <span className="text-zinc-500 text-xs">- {event.content}</span>
                    </div>
                )}

                {event.type === 'STEP_STARTED' && (
                    <div className="px-3 py-2 flex items-center gap-2">
                        <Badge variant="outline" className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] uppercase">Step</Badge>
                        <span className="text-zinc-200 font-mono text-xs font-semibold">{event.stepName}</span>
                    </div>
                )}

                {event.type === 'TEXT_MESSAGE' && (
                    <div className="text-zinc-300 leading-relaxed font-mono text-xs pl-2 border-l-2 border-zinc-700">
                        {event.content}
                        {isLast && <span className="inline-block w-1.5 h-3 bg-zinc-500 ml-1 animate-pulse align-middle" />}
                    </div>
                )}

                {event.type === 'TOOL_CALL' && (
                    <div className="text-xs font-mono">
                        <div 
                            className="flex items-center justify-between px-3 py-2 bg-amber-500/5 cursor-pointer hover:bg-amber-500/10 transition-colors"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-amber-400 font-bold">call_tool</span>
                                <span className="text-zinc-300">{event.toolName}</span>
                            </div>
                            {isExpanded ? <ChevronDown className="size-3 text-zinc-500" /> : <ChevronRight className="size-3 text-zinc-500" />}
                        </div>
                        
                        {isExpanded && (
                            <div className="p-3 bg-zinc-950 border-t border-zinc-800/50">
                                <pre className="text-[10px] text-zinc-400 overflow-x-auto">
                                    {JSON.stringify(event.toolInput, null, 2)}
                                </pre>
                            </div>
                        )}
                    </div>
                )}

                {event.type === 'TOOL_RESULT' && (
                    <div className="text-xs font-mono">
                        <div 
                            className="flex items-center justify-between px-3 py-2 bg-purple-500/5 cursor-pointer hover:bg-purple-500/10 transition-colors"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-purple-400 font-bold">tool_output</span>
                                <span className="text-zinc-500 text-[10px]">({event.duration})</span>
                            </div>
                            {isExpanded ? <ChevronDown className="size-3 text-zinc-500" /> : <ChevronRight className="size-3 text-zinc-500" />}
                        </div>
                        
                        {isExpanded && (
                            <div className="p-3 bg-zinc-950 border-t border-zinc-800/50">
                                <ToolResultRenderer toolName={event.toolName} output={event.toolOutput} />
                            </div>
                        )}
                    </div>
                )}

                {event.type === 'ERROR' && (
                    <div className="px-3 py-2 bg-red-500/5 text-red-300 text-xs font-mono border border-red-500/20 rounded-lg">
                        <div className="font-bold mb-1">Execution Error</div>
                        {event.content}
                    </div>
                )}
                
                {event.type === 'RUN_FINISHED' && (
                    <div className="px-3 py-2 flex items-center gap-2">
                         <span className="text-emerald-400 font-bold text-xs uppercase tracking-wider">Completed</span>
                         <Badge variant="secondary" className="bg-zinc-800 text-zinc-400 text-[9px]">Total Time: {event.duration}</Badge>
                    </div>
                )}
            </div>
        </div>
    );
}
