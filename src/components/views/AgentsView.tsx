import React, { useState, useEffect } from 'react';
import { AgentTree, AgentNode, AgentLink } from '@/components/agents/AgentTree';
import { AgentDetailPanel } from '@/components/agents/AgentDetailPanel';
import { AgentConversation } from '@/components/agents/AgentConversation';
import { CreateAgentDialog } from '@/components/agents/CreateAgentDialog';
import { GlobalConsole } from '@/components/ui/global-console';
import { Search, Filter, RefreshCw, Cpu, Activity, Zap, Network, Plus, GitMerge, LayoutList, CircleDashed, MousePointer2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { cn } from '@/lib/utils';

// Initial Data converted to Graph format
const INITIAL_NODES: AgentNode[] = [
    { id: 'root', name: 'Orchestrator', role: 'manager', model: 'claude-opus-3', status: 'running', activity: 'Coordinating fleet', x: 400, y: 100 },
    { id: 'agent-1', name: 'Planner Agent', role: 'planner', model: 'claude-sonnet-3.5', status: 'running', activity: 'Analyzing deps', x: 200, y: 300 },
    { id: 'agent-2', name: 'Code Generator', role: 'coder', model: 'gpt-4-turbo', status: 'idle', activity: 'Waiting for task', x: 600, y: 300 },
    { id: 'agent-3', name: 'DevOps Agent', role: 'devops', model: 'claude-sonnet-3.5', status: 'running', activity: 'Checking Docker', x: 400, y: 500 },
];

const INITIAL_LINKS: AgentLink[] = [
    { id: 'link-1', source: 'root', target: 'agent-1', type: 'command' },
    { id: 'link-2', source: 'root', target: 'agent-2', type: 'command' },
    { id: 'link-3', source: 'agent-1', target: 'agent-3', type: 'data' },
];

export function AgentsView() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<AgentLink[]>(INITIAL_LINKS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);

  const selectedAgent = nodes.find(n => n.id === selectedAgentId);

  const handleRefresh = () => {
    toast.success("Fleet Status Synced", {
      description: "Telemetry updated from all active nodes."
    });
  };

  const handleCreateAgent = (newAgent: any) => {
    const id = `agent-${Date.now()}`;
    const newNode: AgentNode = {
        ...newAgent,
        id,
        x: 400 + (Math.random() * 100 - 50),
        y: 300 + (Math.random() * 100 - 50),
        status: 'idle',
        activity: 'Initializing...',
    };
    
    setNodes(prev => [...prev, newNode]);
    
    // Auto-link to root for now
    setLinks(prev => [...prev, {
        id: `link-${Date.now()}`,
        source: 'root',
        target: id,
        type: 'command'
    }]);

    toast.success("Agent Provisioned", {
        description: `${newAgent.name} is online.`
    });
  };

  const handleNodeMove = (id: string, x: number, y: number) => {
      setNodes(prev => prev.map(node => 
          node.id === id ? { ...node, x, y } : node
      ));
  };

  const handleConnect = (sourceId: string, targetId: string) => {
      // Check if link already exists
      if (links.some(l => l.source === sourceId && l.target === targetId)) {
          toast.info("Link already exists");
          return;
      }

      const newLink: AgentLink = {
          id: `link-${Date.now()}`,
          source: sourceId,
          target: targetId,
          type: 'data' // Default type
      };

      setLinks(prev => [...prev, newLink]);
      toast.success("Agents Linked", {
          description: `Connection established between agents.`
      });
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Header / Status Bar */}
      <div className="px-6 py-4 border-b border-zinc-800/50 bg-[#09090b] z-20 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-violet-500/10 rounded-lg border border-violet-500/20">
                <Network className="size-5 text-violet-500" />
            </div>
            <div>
                <h1 className="text-lg font-bold text-zinc-100 tracking-tight">
                    Mission Control
                </h1>
                <div className="flex items-center gap-2 text-xs text-zinc-500">
                    <span className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" /> ONLINE</span>
                    <span>•</span>
                    <span className="font-mono">v2.4.0-alpha</span>
                </div>
            </div>
            
            <div className="h-8 w-px bg-zinc-800 mx-2" />
            
            <div className="flex items-center gap-6 text-sm">
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">CPU Load</span>
                    <span className="font-mono text-zinc-200">24%</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Memory</span>
                    <span className="font-mono text-zinc-200">12.4GB</span>
                </div>
                <div className="flex flex-col">
                    <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Throughput</span>
                    <span className="font-mono text-zinc-200">842 t/s</span>
                </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Button 
                variant="outline" 
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-9"
                onClick={handleRefresh}
            >
              <RefreshCw className="size-3.5 mr-2" />
              Sync
            </Button>
            <Button 
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white h-9 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-shadow hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="size-3.5 mr-2" />
              Provision Agent
            </Button>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2 border-b border-zinc-800 flex items-center justify-between bg-[#0d0d0e] z-10 relative">
          <div className="flex items-center gap-3">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
              <Input 
                className="pl-9 h-8 text-xs bg-zinc-900/50 border-zinc-800 focus:ring-violet-500/20 focus:border-violet-500/50 placeholder:text-zinc-600 font-mono" 
                placeholder="FILTER_AGENTS..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="h-4 w-px bg-zinc-800" />
             <div className="flex items-center gap-1 text-xs text-zinc-500">
                <MousePointer2 className="size-3" />
                <span>DRAG TO MOVE / CONNECT</span>
             </div>
          </div>
          <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-zinc-900/50 text-emerald-400 border-zinc-800 font-mono text-[10px] tracking-wider">
                  {nodes.filter(n => n.status === 'running').length} ACTIVE
              </Badge>
              <Badge variant="outline" className="bg-zinc-900/50 text-zinc-500 border-zinc-800 font-mono text-[10px] tracking-wider">
                  {nodes.length} TOTAL
              </Badge>
          </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Main Canvas */}
        <div className="flex-1 relative bg-[#050506] flex flex-col">
            <AgentTree 
                nodes={nodes}
                links={links}
                selectedId={selectedAgentId}
                onSelect={setSelectedAgentId}
                onNodeMove={handleNodeMove}
                onConnect={handleConnect}
            />
            
            {/* Global Console Drawer */}
            <GlobalConsole />
        </div>

        {/* Right: Details Panel (Slide-over) */}
        <div className={cn(
            "absolute top-0 right-0 bottom-0 z-30 w-[450px] border-l border-zinc-800 bg-[#09090b]/95 backdrop-blur-xl transition-transform duration-300 shadow-2xl",
            selectedAgent ? "translate-x-0" : "translate-x-full"
        )}>
            <AgentDetailPanel 
                agent={selectedAgent} 
                onClose={() => setSelectedAgentId(null)}
                onViewConversation={() => setShowConversation(true)}
            />
        </div>
      </div>

      {/* Overlays */}
      {showConversation && selectedAgent && (
         <AgentConversation 
             agent={selectedAgent} 
             onClose={() => setShowConversation(false)} 
         />
      )}
      
      <CreateAgentDialog 
        open={showCreateDialog} 
        onOpenChange={setShowCreateDialog} 
        onCreate={handleCreateAgent}
      />
    </div>
  );
}