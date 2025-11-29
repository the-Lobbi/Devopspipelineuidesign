import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, Circle, Clock, AlertCircle, Loader2, ZoomIn, RotateCcw, Play, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

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
    const [scrubIndex, setScrubIndex] = useState<number>(steps.length - 1);

    useEffect(() => {
        if (!isReplaying) {
            setScrubIndex(steps.length - 1);
        }
    }, [steps.length, isReplaying]);

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
        <div className="h-16 bg-[#09090b] border-t border-zinc-800 flex items-center px-4 relative z-20 gap-4">
            {/* Left: Timeline Info */}
            <div className="flex flex-col min-w-[140px] shrink-0">
                <div className="flex items-center gap-2 mb-1">
                    <History className="size-3 text-zinc-500" />
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Time Travel</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-zinc-300 font-mono">
                    <span>{startTime || "00:00:00"}</span>
                    <span className="text-zinc-600">•</span>
                    <span>{totalDuration || "0s"}</span>
                </div>
            </div>

            {/* Center: Scrubbing Slider */}
            <div className="flex-1 flex flex-col justify-center px-4 relative group">
                <div className="flex justify-between text-[10px] text-zinc-500 font-mono mb-1.5 px-1">
                    <span>START</span>
                    <span>NOW</span>
                </div>
                <div className="relative h-6 flex items-center">
                    {/* Checkpoint Markers */}
                    <div className="absolute inset-x-0 h-full flex items-center justify-between px-0.5 pointer-events-none z-10">
                        {steps.map((step, i) => (
                            <div 
                                key={step.id}
                                className={cn(
                                    "w-1.5 h-1.5 rounded-full transition-colors",
                                    i <= scrubIndex ? 
                                        (step.status === 'error' ? "bg-red-500" : "bg-emerald-500") : 
                                        "bg-zinc-800"
                                )}
                            />
                        ))}
                    </div>
                    
                    <Slider 
                        value={[scrubIndex]}
                        max={Math.max(0, steps.length - 1)}
                        step={1}
                        onValueChange={([val]) => setScrubIndex(val)}
                        className="z-20 [&_.bg-primary]:bg-indigo-500 [&_.border-primary]:border-indigo-500"
                    />
                </div>
            </div>

            {/* Right: Current State & Controls */}
            <div className="flex items-center gap-4 shrink-0 border-l border-zinc-800 pl-4">
                {steps[scrubIndex] && (
                    <div className={cn(
                        "flex items-center gap-2 px-3 py-1.5 rounded-lg border min-w-[160px]",
                        getStatusColor(steps[scrubIndex].status)
                    )}>
                        {getStatusIcon(steps[scrubIndex].status)}
                        <div className="flex flex-col">
                            <span className="text-xs font-bold leading-none mb-0.5">{steps[scrubIndex].label}</span>
                            <span className="text-[9px] opacity-70 font-mono uppercase">State #{scrubIndex + 1}</span>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-1">
                    <Button 
                        variant="ghost" 
                        size="icon" 
                        className={cn("h-8 w-8 hover:bg-zinc-800", isReplaying ? "text-amber-400 animate-pulse" : "text-zinc-500 hover:text-zinc-300")}
                        onClick={onReplay}
                        title="Replay Execution"
                    >
                        {isReplaying ? <RotateCcw className="size-3.5 animate-spin-slow" /> : <Play className="size-3.5 ml-0.5" />}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                        <ZoomIn className="size-3.5" />
                    </Button>
                </div>
            </div>
        </div>
    );
}