import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Clock, Database, Code2, Terminal, Search } from 'lucide-react';

interface TraceSpan {
    id: string;
    name: string;
    type: 'chain' | 'llm' | 'tool' | 'retriever';
    startTime: number;
    duration: number;
    status: 'success' | 'error' | 'running';
    tokens?: number;
    cost?: number;
    depth: number;
}

const MOCK_TRACE: TraceSpan[] = [
    { id: '1', name: 'Orchestrator Execution', type: 'chain', startTime: 0, duration: 2500, status: 'success', depth: 0 },
    { id: '2', name: 'Plan Decomposition', type: 'llm', startTime: 100, duration: 1200, status: 'success', tokens: 450, cost: 0.02, depth: 1 },
    { id: '3', name: 'Context Retrieval', type: 'retriever', startTime: 1300, duration: 400, status: 'success', depth: 1 },
    { id: '4', name: 'Vector Search (Pinecone)', type: 'tool', startTime: 1350, duration: 300, status: 'success', depth: 2 },
    { id: '5', name: 'Code Generation', type: 'llm', startTime: 1800, duration: 600, status: 'success', tokens: 890, cost: 0.04, depth: 1 },
    { id: '6', name: 'Syntax Check', type: 'tool', startTime: 2400, duration: 50, status: 'success', depth: 1 },
];

export function TracePanel() {
    const maxDuration = 2500;

    return (
        <div className="h-64 bg-[#09090b] border-t border-zinc-800 flex flex-col">
            <div className="px-4 py-2 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-2">
                    <div className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Trace Visualization</div>
                    <Badge variant="outline" className="text-[10px] font-mono border-zinc-800 text-zinc-500">
                        ID: tr_8f92a1
                    </Badge>
                </div>
                <div className="flex gap-4 text-[10px] text-zinc-500 font-mono">
                    <span>TOTAL TOKENS: 1,340</span>
                    <span>COST: $0.06</span>
                    <span>LATENCY: 2.5s</span>
                </div>
            </div>
            
            <ScrollArea className="flex-1">
                <div className="relative min-h-full p-4">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 pointer-events-none flex justify-between px-4 opacity-10">
                        {[0, 25, 50, 75, 100].map(p => (
                            <div key={p} className="h-full w-px bg-zinc-500" />
                        ))}
                    </div>

                    <div className="space-y-1 relative z-10">
                        {MOCK_TRACE.map((span) => (
                            <div 
                                key={span.id} 
                                className="group flex items-center gap-4 hover:bg-zinc-900/50 rounded py-1 px-2 -mx-2 transition-colors cursor-pointer"
                            >
                                <div className="w-48 shrink-0 flex items-center gap-2 overflow-hidden">
                                    <div style={{ paddingLeft: `${span.depth * 16}px` }} className="flex items-center gap-2">
                                        {span.type === 'llm' ? <Code2 className="size-3 text-indigo-400" /> :
                                         span.type === 'tool' ? <Terminal className="size-3 text-emerald-400" /> :
                                         span.type === 'retriever' ? <Database className="size-3 text-amber-400" /> :
                                         <Clock className="size-3 text-zinc-400" />}
                                        <span className="text-xs text-zinc-300 font-mono truncate">{span.name}</span>
                                    </div>
                                </div>

                                <div className="flex-1 h-6 relative bg-zinc-900/50 rounded overflow-hidden">
                                    <div 
                                        className={cn(
                                            "absolute top-1 bottom-1 rounded-sm opacity-80 hover:opacity-100 transition-all",
                                            span.type === 'llm' ? "bg-indigo-600" :
                                            span.type === 'tool' ? "bg-emerald-600" :
                                            span.type === 'retriever' ? "bg-amber-600" :
                                            "bg-zinc-600"
                                        )}
                                        style={{ 
                                            left: `${(span.startTime / maxDuration) * 100}%`, 
                                            width: `${Math.max((span.duration / maxDuration) * 100, 0.5)}%` 
                                        }}
                                    />
                                    <div className="absolute right-2 top-1.5 text-[9px] font-mono text-zinc-500 group-hover:text-zinc-300">
                                        {span.duration}ms
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </ScrollArea>
        </div>
    );
}