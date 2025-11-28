
import React from 'react';
import { AGENT_TREE } from '@/lib/plan-data';
import { Bot, Terminal, FileText, Search, Play, Pause, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';

export function AgentsView() {
  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-zinc-200">Active Agents Hierarchy</h3>
        <button className="text-xs flex items-center gap-1 text-zinc-400 hover:text-white bg-zinc-800 px-3 py-1.5 rounded-md border border-zinc-700 transition-colors">
             Refresh <span className="text-zinc-500">↻</span>
        </button>
      </div>
      
      <div className="bg-zinc-900/20 rounded-xl p-6 border border-zinc-800/50">
         <AgentNode node={AGENT_TREE} isRoot={true} />
      </div>
    </div>
  );
}

function AgentNode({ node, isRoot = false }: { node: any, isRoot?: boolean }) {
    const isRunning = node.status === 'running';
    
    // Choose icon based on name/role logic
    let Icon = Bot;
    if (node.name.includes('Code')) Icon = Terminal;
    if (node.name.includes('Test')) Icon = FileText;
    if (node.name.includes('Review')) Icon = Search;
    if (node.name.includes('Doc')) Icon = FileText;
    if (node.name.includes('Orch')) Icon = Bot;

    return (
        <div className={cn("relative", !isRoot && "pl-8 pt-4")}>
            {!isRoot && (
                <>
                    <div className="absolute left-0 top-0 bottom-0 w-px bg-zinc-800" />
                    <div className="absolute left-0 top-8 w-8 h-px bg-zinc-800" />
                </>
            )}
            
            <div className="flex items-start gap-4 p-4 rounded-lg border bg-zinc-900 border-zinc-800 relative z-10 hover:border-zinc-700 transition-colors">
                <div className={cn(
                    "p-2.5 rounded-lg border shadow-sm",
                    isRunning 
                        ? "bg-violet-500/10 border-violet-500/30 text-violet-400" 
                        : "bg-zinc-800 border-zinc-700 text-zinc-500"
                )}>
                    <Icon className={cn("size-5", isRunning && "animate-pulse")} />
                </div>
                
                <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                        <h4 className="font-medium text-zinc-200">{node.name}</h4>
                        <div className="flex items-center gap-2">
                             <span className={cn(
                                 "text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded",
                                 isRunning ? "bg-emerald-500/10 text-emerald-400" : "bg-zinc-800 text-zinc-500"
                             )}>
                                 {node.status}
                             </span>
                        </div>
                    </div>
                    
                    <div className="text-xs text-zinc-500 font-mono mb-2">{node.model}</div>
                    <p className="text-sm text-zinc-400 mb-3">{node.activity}</p>
                    
                    <div className="flex items-center gap-4 border-t border-zinc-800/50 pt-2">
                        <button className="text-xs text-zinc-500 hover:text-violet-400 flex items-center gap-1 transition-colors">
                            <MessageSquare className="size-3" /> View Conversation
                        </button>
                        {isRunning && (
                             <button className="text-xs text-zinc-500 hover:text-amber-400 flex items-center gap-1 transition-colors">
                                <Pause className="size-3" /> Pause Agent
                             </button>
                        )}
                    </div>
                </div>
            </div>
            
            {node.children && node.children.length > 0 && (
                <div className="relative">
                    {node.children.map((child: any) => (
                        <AgentNode key={child.id} node={child} />
                    ))}
                </div>
            )}
        </div>
    );
}
