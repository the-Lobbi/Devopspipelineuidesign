import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { X, Play, Pause, FileText, Clock, MessageSquare, Terminal, Cpu, Activity, GitBranch, Box, Database, Server } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { AgUiEventStream, AgEvent } from './AgUiEventStream';
import { cn } from '@/lib/utils';

import { PromptEditor } from './PromptEditor';
import { TrainingPanel } from './TrainingPanel';
import { AgentTerminal } from './AgentTerminal';

import { PLAN_DATA } from '@/lib/plan-data';

import { ToolRegistryDialog } from '@/components/tools/ToolRegistryDialog';

interface AgentDetailPanelProps {
  agent: any;
  onClose: () => void;
  onViewConversation: () => void;
}

const MOCK_EVENTS: AgEvent[] = [
    { id: '1', type: 'RUN_STARTED', timestamp: '10:00:00', content: 'Automated PR Review Sequence' },
    { id: '2', type: 'STEP_STARTED', timestamp: '10:00:01', stepName: 'Context Analysis' },
    { id: '3', type: 'TEXT_MESSAGE', timestamp: '10:00:01', content: 'I will begin by analyzing the changes in this pull request against our style guide and testing requirements.' },
    { id: '4', type: 'TOOL_CALL', timestamp: '10:00:02', toolName: 'git_diff_stat', toolInput: { base: 'main', head: 'feature/auth-v2' } },
    { id: '5', type: 'TOOL_RESULT', timestamp: '10:00:03', toolName: 'git_diff_stat', toolOutput: { files: 12, insertions: 450, deletions: 120 }, duration: '450ms' },
    { id: '6', type: 'TEXT_MESSAGE', timestamp: '10:00:03', content: 'The diff shows significant changes in the authentication module. I should verify that all new endpoints are secured.' },
    { id: '7', type: 'STEP_STARTED', timestamp: '10:00:04', stepName: 'Security Audit' },
    { id: '8', type: 'TOOL_CALL', timestamp: '10:00:05', toolName: 'scan_endpoints', toolInput: { pattern: 'src/auth/**/*.ts' } },
    { id: '9', type: 'TOOL_RESULT', timestamp: '10:00:08', toolName: 'scan_endpoints', toolOutput: { vulnerabilities: 0, warnings: 2 }, duration: '3.2s' },
    { id: '10', type: 'TEXT_MESSAGE', timestamp: '10:00:09', content: 'Security scan passed with minor warnings. Proceeding to generate the review summary.' },
];

export function AgentDetailPanel({ agent, onClose, onViewConversation }: AgentDetailPanelProps) {
  const [events, setEvents] = useState<AgEvent[]>([]);
  const [showToolRegistry, setShowToolRegistry] = useState(false);
  const [commandInput, setCommandInput] = useState('');

  // Simulate streaming events
  useEffect(() => {
      if (!agent) return;
      setEvents([]);
      let i = 0;
      const interval = setInterval(() => {
          if (i >= MOCK_EVENTS.length) {
              clearInterval(interval);
              return;
          }
          setEvents(prev => [...prev, MOCK_EVENTS[i]]);
          i++;
      }, 800); // Add a new event every 800ms
      
      return () => clearInterval(interval);
  }, [agent]);

  const handleCommand = () => {
      if (!commandInput.trim()) return;
      
      const cmd = commandInput.trim();
      const isTool = cmd.includes('_') || cmd.startsWith('/');
      
      // Add user command
      setEvents(prev => [...prev, {
          id: `cmd-${Date.now()}`,
          type: 'TEXT_MESSAGE',
          timestamp: new Date().toLocaleTimeString(),
          content: `> ${cmd}`
      }]);

      if (isTool) {
          // Simulate Tool Execution
          const toolName = cmd.startsWith('/') ? cmd.slice(1).split(' ')[0] : cmd.split(' ')[0];
          
          setTimeout(() => {
             setEvents(prev => [...prev, {
                  id: `tool-${Date.now()}`,
                  type: 'TOOL_CALL',
                  timestamp: new Date().toLocaleTimeString(),
                  toolName: toolName,
                  toolInput: { args: cmd.split(' ').slice(1) }
             }]);
          }, 400);

          setTimeout(() => {
              let mockOutput: any = { status: 'success', output: 'Simulated execution result.' };
              
              // Mock Responses based on Tool Name
              if (toolName === 'git_status') {
                  mockOutput = {
                      files: 3,
                      insertions: 124,
                      deletions: 45,
                      fileList: ['src/auth.ts', 'package.json', 'README.md']
                  };
              } else if (toolName.includes('scan')) {
                  mockOutput = {
                      vulnerabilities: Math.random() > 0.5 ? 2 : 0,
                      warnings: 5
                  };
              } else if (toolName.includes('db') || toolName.includes('query')) {
                  mockOutput = [
                      { id: 1, email: 'user@example.com', role: 'admin' },
                      { id: 2, email: 'dev@test.com', role: 'developer' },
                      { id: 3, email: 'bot@system.local', role: 'service_account' }
                  ];
              } else if (toolName.includes('http')) {
                  mockOutput = {
                      status: 200,
                      url: 'https://api.stripe.com/v1/charges',
                      data: { id: 'ch_123', amount: 2000, currency: 'usd' }
                  };
              }

              setEvents(prev => [...prev, {
                   id: `res-${Date.now()}`,
                   type: 'TOOL_RESULT',
                   timestamp: new Date().toLocaleTimeString(),
                   toolName: toolName,
                   toolOutput: mockOutput,
                   duration: `${Math.floor(Math.random() * 500 + 100)}ms`
              }]);
          }, 1200);
      }

      setCommandInput('');
  };

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
                {['overview', 'logs', 'terminal', 'tools', 'memory', 'prompts', 'training'].map(tab => (
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
            <div className="p-6 space-y-8 h-full">
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

                    {/* Planner Specific: Plan Summary */}
                    {agent.role === 'planner' && (
                        <div className="space-y-3">
                            <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity className="size-3" /> Execution Plan Status
                            </label>
                            <div className="bg-zinc-900/30 border border-zinc-800 rounded-xl p-4 space-y-4">
                                {PLAN_DATA.map(sprint => (
                                    <div key={sprint.id} className="space-y-2">
                                        <div className="flex items-center justify-between text-xs">
                                            <span className="text-zinc-300 font-medium">{sprint.title}</span>
                                            <Badge variant="outline" className={cn(
                                                "text-[9px] uppercase",
                                                sprint.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-zinc-800 text-zinc-500 border-zinc-700"
                                            )}>
                                                {sprint.status}
                                            </Badge>
                                        </div>
                                        <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                            <div 
                                                className="h-full bg-emerald-500 transition-all duration-1000" 
                                                style={{ width: sprint.status === 'active' ? '45%' : '0%' }} 
                                            />
                                        </div>
                                        <div className="grid grid-cols-3 gap-2">
                                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800/50">
                                                <div className="text-zinc-400 text-[10px] uppercase">Stories</div>
                                                <div className="text-zinc-200 font-mono text-sm font-bold">{sprint.stories.length}</div>
                                            </div>
                                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800/50">
                                                <div className="text-zinc-400 text-[10px] uppercase">Points</div>
                                                <div className="text-zinc-200 font-mono text-sm font-bold">
                                                    {sprint.stories.reduce((acc, s) => acc + s.points, 0)}
                                                </div>
                                            </div>
                                            <div className="bg-zinc-950 rounded p-2 text-center border border-zinc-800/50">
                                                <div className="text-zinc-400 text-[10px] uppercase">Completion</div>
                                                <div className="text-zinc-200 font-mono text-sm font-bold">
                                                    {sprint.status === 'active' ? '45%' : '0%'}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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
                    <AgUiEventStream events={events} className="flex-1" />
                    
                    {/* Command Injection */}
                    <div className="mt-4 flex items-center gap-2 bg-[#0c0c0e] border border-zinc-800 rounded-xl p-3">
                         <span className="text-violet-500 animate-pulse">❯</span>
                         <input 
                            className="bg-transparent border-none outline-none text-zinc-300 w-full placeholder:text-zinc-700 font-mono text-sm" 
                            placeholder="Inject supervisor command (e.g. /git_status)..." 
                            value={commandInput}
                            onChange={(e) => setCommandInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
                        />
                         <Button size="sm" variant="ghost" className="h-6 text-xs text-zinc-500 hover:text-zinc-300" onClick={handleCommand}>SEND</Button>
                    </div>
                </TabsContent>

                <TabsContent value="terminal" className="mt-0 h-[500px] focus-visible:ring-0">
                    <AgentTerminal agent={agent} />
                </TabsContent>

                <TabsContent value="tools" className="mt-0 space-y-6 focus-visible:ring-0">
                    <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-zinc-300">Installed Capabilities</h4>
                        <Button size="sm" variant="outline" className="h-7 text-xs border-zinc-700 hover:bg-zinc-800 text-zinc-300" onClick={() => setShowToolRegistry(true)}>
                            <Activity className="size-3 mr-1.5 text-emerald-400" /> Browse Registry
                        </Button>
                    </div>

                    <div className="space-y-3">
                        {[
                            { name: 'git_suite', version: '2.4.0', desc: 'Core git operations' },
                            { name: 'fs_access', version: '1.0.0', desc: 'Workspace file IO' },
                            { name: 'http_client', version: '0.5.2', desc: 'Universal request adapter' },
                        ].map((tool) => (
                            <div key={tool.name} className="p-3 bg-zinc-900/30 border border-zinc-800 rounded-xl flex items-center justify-between group hover:border-zinc-700 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 rounded-lg bg-[#0c0c0e] border border-zinc-800 flex items-center justify-center">
                                        <Terminal className="size-4 text-zinc-500 group-hover:text-violet-400 transition-colors" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-mono font-medium text-zinc-300">{tool.name}</div>
                                        <div className="text-[10px] text-zinc-500">{tool.desc}</div>
                                    </div>
                                </div>
                                <Badge variant="secondary" className="bg-zinc-900 border-zinc-800 text-zinc-600 font-mono text-[10px]">
                                    v{tool.version}
                                </Badge>
                            </div>
                        ))}
                        
                        <div 
                            className="p-4 border border-dashed border-zinc-800 rounded-xl flex flex-col items-center justify-center gap-2 text-zinc-600 hover:text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/20 transition-all cursor-pointer"
                            onClick={() => setShowToolRegistry(true)}
                        >
                            <Box className="size-5" />
                            <span className="text-xs font-medium">Install New Tool</span>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="memory" className="mt-0 space-y-4 h-full flex flex-col">
                    <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/20 flex-1 flex flex-col min-h-[300px]">
                        <div className="flex items-center justify-between mb-4">
                            <h4 className="text-sm font-medium text-zinc-300">Vector Memory Space</h4>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="border-zinc-700 text-zinc-500 bg-zinc-900">RAG Enabled</Badge>
                                <Badge variant="outline" className="border-zinc-700 text-zinc-500 bg-zinc-900">Top-K: 5</Badge>
                            </div>
                        </div>
                        
                        {/* Vector Visualizer */}
                        <div className="flex-1 relative bg-zinc-950 rounded-lg border border-zinc-800/50 overflow-hidden group">
                            {/* Grid Background */}
                            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                                style={{ 
                                    backgroundImage: 'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                                    backgroundSize: '20px 20px'
                                }} 
                            />
                            
                            {/* Simulated Embeddings */}
                            <svg className="w-full h-full">
                                {[
                                    { x: 30, y: 40, type: 'Goal', content: 'Refactor AuthController' },
                                    { x: 35, y: 45, type: 'Fact', content: 'User model has email field' },
                                    { x: 70, y: 20, type: 'Context', content: 'NextJS 14 App Router' },
                                    { x: 75, y: 25, type: 'Context', content: 'Server Actions' },
                                    { x: 20, y: 80, type: 'History', content: 'Previous run failed at step 4' },
                                    { x: 50, y: 50, type: 'Fact', content: 'API Rate Limit: 1000/hr' },
                                    { x: 80, y: 80, type: 'Goal', content: 'Optimize database queries' },
                                ].map((point, i) => (
                                    <g key={i} className="group/point cursor-pointer">
                                        <circle 
                                            cx={`${point.x}%`} 
                                            cy={`${point.y}%`} 
                                            r="4" 
                                            className={cn(
                                                "transition-all duration-300",
                                                point.type === 'Goal' ? "fill-violet-500" :
                                                point.type === 'Fact' ? "fill-emerald-500" :
                                                point.type === 'Context' ? "fill-blue-500" : "fill-zinc-500"
                                            )}
                                        />
                                        <circle 
                                            cx={`${point.x}%`} 
                                            cy={`${point.y}%`} 
                                            r="12" 
                                            className={cn(
                                                "opacity-0 group-hover/point:opacity-20 transition-opacity",
                                                point.type === 'Goal' ? "fill-violet-500" :
                                                point.type === 'Fact' ? "fill-emerald-500" :
                                                point.type === 'Context' ? "fill-blue-500" : "fill-zinc-500"
                                            )}
                                        />
                                        
                                        {/* Tooltip */}
                                        <foreignObject x={`${point.x}%`} y={`${point.y}%`} width="150" height="60" className="overflow-visible pointer-events-none">
                                            <div className="transform translate-x-3 -translate-y-3 opacity-0 group-hover/point:opacity-100 transition-opacity bg-zinc-900 border border-zinc-800 p-2 rounded shadow-xl z-10 w-max max-w-[200px]">
                                                <div className="text-[10px] font-bold uppercase text-zinc-500 mb-1">{point.type}</div>
                                                <div className="text-[10px] text-zinc-200 font-mono">{point.content}</div>
                                            </div>
                                        </foreignObject>
                                    </g>
                                ))}
                            </svg>
                        </div>

                        {/* Legend */}
                        <div className="mt-4 flex gap-4 justify-center">
                             <div className="flex items-center gap-2">
                                 <div className="size-2 rounded-full bg-violet-500" />
                                 <span className="text-[10px] text-zinc-500 uppercase">Goals</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="size-2 rounded-full bg-emerald-500" />
                                 <span className="text-[10px] text-zinc-500 uppercase">Facts</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="size-2 rounded-full bg-blue-500" />
                                 <span className="text-[10px] text-zinc-500 uppercase">Context</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <div className="size-2 rounded-full bg-zinc-500" />
                                 <span className="text-[10px] text-zinc-500 uppercase">History</span>
                             </div>
                        </div>
                    </div>
                </TabsContent>

                <TabsContent value="prompts" className="mt-0 h-[500px] focus-visible:ring-0">
                    <PromptEditor agent={agent} />
                </TabsContent>

                <TabsContent value="training" className="mt-0 space-y-6">
                     <TrainingPanel agent={agent} />
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

      <ToolRegistryDialog 
        isOpen={showToolRegistry}
        onClose={() => setShowToolRegistry(false)}
      />
    </div>
  );
}