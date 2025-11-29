import React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2, ChevronRight, ZoomIn, ZoomOut, RotateCcw, Play, Pause, FastForward } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface TimelineStep {
    id: string;
    label: string;
    status: 'pending' | 'running' | 'completed' | 'error' | 'paused';
    duration?: string;
    timestamp?: string;
}

interface PipelineTimelineProps {
    steps: TimelineStep[];
    startTime?: string;
    totalDuration?: string;
    onReplay?: () => void;
    isReplaying?: boolean;
}

export function PipelineTimeline({ steps, startTime, totalDuration, onReplay, isReplaying }: PipelineTimelineProps) {
    
    const getStatusIcon = (status: TimelineStep['status']) => {
        switch (status) {
            case 'completed': return <CheckCircle2 className="size-3.5 text-emerald-400" />;
            case 'running': return <Loader2 className="size-3.5 text-indigo-400 animate-spin" />;
            case 'error': return <AlertCircle className="size-3.5 text-red-400" />;
            case 'paused': return <Clock className="size-3.5 text-amber-400" />;
            default: return <Circle className="size-3.5 text-zinc-600" />;
        }
    };

    const getStatusColor = (status: TimelineStep['status']) => {
        switch (status) {
            case 'completed': return "bg-emerald-500/20 border-emerald-500/30 text-emerald-200";
            case 'running': return "bg-indigo-500/20 border-indigo-500/30 text-indigo-200 shadow-[0_0_15px_rgba(99,102,241,0.2)]";
            case 'error': return "bg-red-500/20 border-red-500/30 text-red-200";
            case 'paused': return "bg-amber-500/20 border-amber-500/30 text-amber-200";
            default: return "bg-zinc-900 border-zinc-800 text-zinc-500";
        }
    };

    return (
        <div className="h-14 bg-[#09090b] border-t border-zinc-800 flex items-center px-4 relative z-20">
            {/* Left: Timeline Info */}
            <div className="flex flex-col mr-6 min-w-[120px]">
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">EXECUTION</span>
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                    <span>{startTime || "00:00:00"}</span>
                    <span className="text-zinc-600">•</span>
                    <span>{totalDuration || "0s"}</span>
                </div>
            </div>

            {/* Center: Steps Visualization */}
            <div className="flex-1 flex items-center gap-2 overflow-x-auto no-scrollbar px-2">
                {steps.map((step, index) => (
                    <React.Fragment key={step.id}>
                        {/* Connector Line */}
                        {index > 0 && (
                            <div className={cn(
                                "h-px w-6 min-w-[24px]",
                                step.status === 'pending' ? "bg-zinc-800" : 
                                step.status === 'running' ? "bg-gradient-to-r from-emerald-500/50 to-zinc-800" :
                                "bg-emerald-500/30"
                            )} />
                        )}
                        
                        {/* Step Node */}
                        <div className={cn(
                            "flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all cursor-pointer whitespace-nowrap",
                            getStatusColor(step.status),
                            step.status === 'running' && "scale-105"
                        )}>
                            {getStatusIcon(step.status)}
                            <span className="text-xs font-medium">{step.label}</span>
                            {step.duration && (
                                <span className="text-[10px] opacity-60 font-mono ml-1 border-l border-current pl-2">
                                    {step.duration}
                                </span>
                            )}
                        </div>
                    </React.Fragment>
                ))}
            </div>

            {/* Right: Controls */}
            <div className="flex items-center gap-2 ml-4 pl-4 border-l border-zinc-800">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className={cn("h-8 w-8 hover:bg-zinc-800", isReplaying ? "text-amber-400 animate-pulse" : "text-zinc-500 hover:text-zinc-300")}
                    onClick={onReplay}
                    title="Replay Execution"
                >
                    {isReplaying ? <RotateCcw className="size-3.5 animate-spin-slow" /> : <Play className="size-3.5 ml-0.5" />}
                </Button>
                 <div className="w-px h-4 bg-zinc-800 mx-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                    <ZoomOut className="size-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                    <ZoomIn className="size-3.5" />
                </Button>
            </div>
        </div>
    );
}