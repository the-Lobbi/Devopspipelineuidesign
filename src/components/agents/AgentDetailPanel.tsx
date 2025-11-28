import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, FileText, Clock, MessageSquare, Terminal, Cpu, Activity, GitBranch, Box, Database, Server } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

interface AgentDetailPanelProps {
  agent: any;
  onClose: () => void;
  onViewConversation: () => void;
}

export function AgentDetailPanel({ agent, onClose, onViewConversation }: AgentDetailPanelProps) {
  const logRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll logs
  useEffect(() => {
      if (logRef.current) {
          logRef.current.scrollTop = logRef.current.scrollHeight;
      }
  }, [agent]);

  if (!agent) return (
    <div className="h-full flex flex-col items-center justify-center text-zinc-500 p-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(circle at center, #3f3f46 1px, transparent 1px)', backgroundSize: '24px 24px' }} 
        />
        <div className="size-20 rounded-2xl bg-zinc-900/80 border border-zinc-800 flex items-center justify-center mb-6 shadow-2xl relative group">
            <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl group-hover:blur-2xl transition-all opacity-0 group-hover:opacity-100" />
            <Activity className="size-10 opacity-50 group-hover:text-violet-400 transition-colors relative z-10" />
        </div>
        <h3 className="text-lg font-medium text-zinc-300">Awaiting Target Selection</h3>
        <p className="text-sm text-zinc-500 max-w-[240px] mt-2 leading-relaxed">
            Select an autonomous agent from the fleet graph to inspect telemetry and override protocols.
        </p>
    </div>
  );

  return (
    <div className="flex flex-col h-full bg-[#09090b] border-l border-zinc-800/50 backdrop-blur-xl">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 flex items-start justify-between bg-zinc-900/20">
        <div className="flex items-center gap-4">
            <div className="p-3 bg-violet-500/10 rounded-xl border border-violet-500/20 text-violet-400 shadow-[0_0_15px_rgba(139,92,246,0.15)]">
                <Terminal className="size-6" />
            </div>
            <div>
                <h3 className="text-lg font-bold text-zinc-100 tracking-tight font-mono">{agent.name.toUpperCase()}</h3>
                <div className="flex items-center gap-3 text-xs mt-1.5">
                    <Badge variant="outline" className="bg-zinc-950 text-zinc-400 border-zinc-800 font-mono rounded-md px-1.5 py-0.5 uppercase tracking-wider text-[10px]">
                        {agent.model}
                    </Badge>
                    <span className="flex items-center gap-1.5 text-emerald-400 font-mono text-[10px] tracking-wide uppercase">
                        <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
                        Active
                    </span>
                </div>
            </div>
        </div>
        <div className="flex gap-1">
             <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/50 rounded-lg">
                <X className="size-4" />
            </Button>
        </div>
      </div>

      {/* Content */}
      <Tabs defaultValue="overview" className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-4 border-b border-zinc-800/50">
            <TabsList className="bg-transparent h-auto p-0 gap-8 w-full justify-start">
                {['overview', 'logs', 'memory'].map(tab => (
                    <TabsTrigger 
                        key={tab} 
                        value={tab} 
                        className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-violet-400 data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none pb-3 px-0 text-zinc-500 hover:text-zinc-300 transition-all uppercase tracking-widest text-[10px] font-semibold"
                    >
                        {tab}
                    </TabsTrigger>
                ))}
            </TabsList>
        </div>

        <ScrollArea className="flex-1 bg-[#09090b]">
            <div className="p-6 space-y-8">
                <TabsContent value="overview" className="mt-0 space-y-6 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                    {/* Current Task */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="size-3" /> Current Directive
                            </label>
                            <span className="text-[10px] font-mono text-zinc-600">PID: 8492</span>
                        </div>
                        <div className="p-4 bg-zinc-900/30 border border-zinc-800 rounded-xl text-sm text-zinc-300 leading-relaxed font-mono shadow-inner relative overflow-hidden">
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500/50" />
                            <span className="text-violet-500 font-bold mr-2">❯</span>
                            {agent.activity}
                            <span className="animate-pulse ml-1 inline-block w-2 h-4 bg-violet-500/50 align-middle" />
                        </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-[#121214] border border-zinc-800 rounded-xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-[10px] text-zinc-500 mb-2 flex items-center gap-2 font-mono uppercase tracking-wider">
                                <Cpu className="size-3.5" /> CPU Load
                            </div>
                            <div className="text-2xl font-bold text-zinc-200 tracking-tight font-mono">24<span className="text-sm text-zinc-600 ml-1">%</span></div>
                            
                            {/* Custom Chart Visual */}
                            <div className="flex items-end gap-0.5 h-6 mt-3 opacity-50">
                                {[40, 60, 30, 80, 50, 70, 40, 60, 80, 45].map((h, i) => (
                                    <div key={i} className="w-full bg-violet-500/50 rounded-sm" style={{ height: `${h}%` }} />
                                ))}
                            </div>
                        </div>

                        <div className="p-4 bg-[#121214] border border-zinc-800 rounded-xl relative group overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                            <div className="text-[10px] text-zinc-500 mb-2 flex items-center gap-2 font-mono uppercase tracking-wider">
                                <Database className="size-3.5" /> Memory
                            </div>
                            <div className="text-2xl font-bold text-zinc-200 tracking-tight font-mono">12.4<span className="text-sm text-zinc-600 ml-1">GB</span></div>
                             <div className="w-full bg-zinc-800/50 h-1.5 mt-6 rounded-full overflow-hidden">
                                <div className="bg-emerald-500 h-full w-[65%]" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Files */}
                    <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <GitBranch className="size-3" /> File Operations
                        </label>
                        <div className="space-y-1">
                            {['src/lib/auth.ts', 'src/routes/login/+page.svelte', 'prisma/schema.prisma'].map((file, i) => (
                                <div key={file} className="flex items-center justify-between group text-xs text-zinc-400 p-3 hover:bg-zinc-800/50 rounded-lg border border-transparent hover:border-zinc-800 transition-all cursor-pointer">
                                    <div className="flex items-center gap-3">
                                        <FileText className="size-3.5 text-zinc-600 group-hover:text-violet-400 transition-colors" />
                                        <span className="font-mono text-[11px]">{file}</span>
                                    </div>
                                    <Badge variant="secondary" className={i === 0 ? "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"}>
                                        {i === 0 ? 'MODIFIED' : 'READ'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="logs" className="mt-0 h-[500px] focus-visible:ring-0 flex flex-col">
                    <div className="flex-1 bg-[#0c0c0e] rounded-xl border border-zinc-800 p-4 font-mono text-xs overflow-hidden flex flex-col relative">
                         <div className="absolute top-0 right-0 p-2 z-10">
                             <Badge variant="outline" className="bg-zinc-900/80 backdrop-blur border-zinc-700 text-zinc-500 text-[9px] uppercase tracking-wider">
                                 Live Stream
                             </Badge>
                         </div>
                        <div className="flex-1 overflow-y-auto space-y-2 text-zinc-400 pr-2 scrollbar-hide" ref={logRef}>
                            <div className="text-zinc-500 opacity-50 mb-4">--- Session Started at 10:00:00 ---</div>
                            <div className="flex gap-3">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:01</span>
                                <span className="text-emerald-400">[INFO]</span>
                                <span>Agent initialized successfully</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:02</span>
                                <span className="text-blue-400">[DEBUG]</span>
                                <span>Loading context from vector store...</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:02</span>
                                <span className="text-blue-400">[DEBUG]</span>
                                <span>Retrieved 4 relevant snippets</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:05</span>
                                <span className="text-amber-400">[WARN]</span>
                                <span>Token limit approaching (85%)</span>
                            </div>
                            <div className="flex gap-3">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:06</span>
                                <span className="text-emerald-400">[INFO]</span>
                                <span>Planning next step: Code Analysis</span>
                            </div>
                             <div className="flex gap-3">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:08</span>
                                <span className="text-blue-400">[DEBUG]</span>
                                <span>Parsing abstract syntax tree...</span>
                            </div>
                             <div className="flex gap-3 animate-pulse">
                                <span className="text-zinc-600 w-16 shrink-0">10:00:09</span>
                                <span className="text-violet-400">[EXEC]</span>
                                <span>Generating implementation plan...</span>
                            </div>
                        </div>
                        <div className="mt-4 flex items-center gap-2 border-t border-zinc-800 pt-3">
                             <span className="text-violet-500 animate-pulse">❯</span>
                             <input className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-700 font-mono text-sm" placeholder="Inject command..." />
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="memory" className="mt-0 space-y-4">
                    <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/20">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-zinc-300">Short Term Memory</h4>
                            <Badge variant="outline" className="border-zinc-700 text-zinc-500">4 Items</Badge>
                        </div>
                        <div className="space-y-2">
                             {[
                                 { type: 'Goal', content: 'Refactor AuthController' },
                                 { type: 'Fact', content: 'User model has email field' },
                                 { type: 'Context', content: 'NextJS 14 App Router' },
                             ].map((mem, i) => (
                                 <div key={i} className="flex items-center gap-3 p-2 rounded bg-zinc-900/50 border border-zinc-800/50">
                                     <div className="size-1.5 rounded-full bg-violet-500" />
                                     <span className="text-xs text-zinc-500 font-mono w-16 uppercase">{mem.type}</span>
                                     <span className="text-xs text-zinc-300 font-mono">{mem.content}</span>
                                 </div>
                             ))}
                        </div>
                    </div>
                </TabsContent>
            </div>
        </ScrollArea>
      </Tabs>

      {/* Footer Actions */}
      <div className="p-6 border-t border-zinc-800/50 bg-zinc-900/20 mt-auto space-y-3 backdrop-blur">
        <Button className="w-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-900/20 font-medium tracking-wide" onClick={onViewConversation}>
            <MessageSquare className="size-4 mr-2" />
            Open Channel
        </Button>
        <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 bg-zinc-900/50">
                <Pause className="size-4 mr-2" /> Freeze
            </Button>
            <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800 text-red-400 hover:text-red-400 hover:border-red-900/50 hover:bg-red-900/10 bg-zinc-900/50">
                <Terminal className="size-4 mr-2" /> Reboot
            </Button>
        </div>
      </div>
    </div>
  );
}