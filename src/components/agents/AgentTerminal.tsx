import React, { useEffect, useRef, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Terminal, Copy, Trash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgentTerminalProps {
    agent: any;
}

const LOG_TEMPLATES = [
    "Analyzing dependency tree...",
    "Fetching remote refs from origin...",
    "Compiling source files (tsc)...",
    "Running linter checks (eslint)...",
    "Docker build started: sha256:8273...",
    "Pushing layer 8d73a...",
    "Verifying checksums...",
    "Connection established to postgres-primary.",
    "Query execution time: 24ms",
    "Cache hit ratio: 94%",
    "Generating AST for code analysis...",
    "Finding references in workspace...",
    "Optimizing bundle size...",
    "[WARN] Deprecated API usage detected in utils.ts",
    "[INFO] Service mesh sidecar injected.",
];

export function AgentTerminal({ agent }: AgentTerminalProps) {
    const [lines, setLines] = useState<string[]>([
        `System initialized: ${agent.name}`,
        `Role: ${agent.role}`,
        `Kernel: v5.15.0-generic`,
        `----------------------------------------`
    ]);
    const [isAutoScroll, setIsAutoScroll] = useState(true);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (agent.status !== 'running') return;

        const interval = setInterval(() => {
            const newLine = `[${new Date().toLocaleTimeString()}] ${LOG_TEMPLATES[Math.floor(Math.random() * LOG_TEMPLATES.length)]}`;
            setLines(prev => [...prev.slice(-100), newLine]); // Keep last 100 lines
        }, 2000);

        return () => clearInterval(interval);
    }, [agent.status]);

    useEffect(() => {
        if (isAutoScroll && scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [lines, isAutoScroll]);

    const handleCopy = () => {
        navigator.clipboard.writeText(lines.join('\n'));
    };

    const handleClear = () => {
        setLines([`> Console cleared at ${new Date().toLocaleTimeString()}`]);
    };

    return (
        <div className="flex flex-col h-full bg-[#0c0c0e] rounded-md border border-zinc-800 overflow-hidden font-mono text-xs">
            {/* Header */}
            <div className="flex items-center justify-between px-3 py-2 bg-zinc-900 border-b border-zinc-800">
                <div className="flex items-center gap-2">
                    <Terminal className="size-3.5 text-zinc-400" />
                    <span className="text-zinc-300 font-bold">tty1</span>
                    {agent.status === 'running' && (
                        <span className="flex items-center gap-1.5 text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            LIVE
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-1">
                     <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300" onClick={handleCopy} title="Copy Output">
                        <Copy className="size-3" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-6 w-6 text-zinc-500 hover:text-zinc-300" onClick={handleClear} title="Clear Console">
                        <Trash className="size-3" />
                    </Button>
                </div>
            </div>

            {/* Terminal Body */}
            <div 
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-3 space-y-1 text-zinc-300 font-mono select-text"
                onScroll={(e) => {
                    const target = e.target as HTMLDivElement;
                    const isBottom = Math.abs(target.scrollHeight - target.scrollTop - target.clientHeight) < 10;
                    setIsAutoScroll(isBottom);
                }}
            >
                {lines.map((line, i) => (
                    <div key={i} className="break-all whitespace-pre-wrap">
                        <span className="text-zinc-600 select-none mr-2">$</span>
                        {line}
                    </div>
                ))}
                {agent.status === 'running' && (
                    <div className="animate-pulse text-emerald-500">_</div>
                )}
            </div>
        </div>
    );
}