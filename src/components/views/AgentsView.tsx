import React, { useState, useEffect } from 'react';
import { AgentTree, AgentNode, AgentLink } from '@/components/agents/AgentTree';
import { AgentDetailPanel } from '@/components/agents/AgentDetailPanel';
import { NodePropertiesPanel } from '@/components/agents/NodePropertiesPanel';
import { AgentConversation } from '@/components/agents/AgentConversation';
import { ApprovalModal } from '@/components/modals/ApprovalModal';
import { RunPipelineModal } from '@/components/modals/RunPipelineModal';
import { IntegrationWizard } from '@/components/modals/IntegrationWizard';
import { ToolRegistryDialog } from '@/components/tools/ToolRegistryDialog';
import { AgentBuilderWizard } from '@/components/agents/AgentBuilderWizard';
import { PipelineWizard } from '@/components/modals/PipelineWizard';
import { KnowledgeBaseWizard } from '@/components/modals/KnowledgeBaseWizard';
import { SkillBuilderWizard } from '@/components/modals/SkillBuilderWizard';
import { NodePalette } from '@/components/agents/NodePalette';
import { PipelineTimeline, TimelineStep } from '@/components/agents/PipelineTimeline';
import { GlobalConsole, LogEntry } from '@/components/ui/global-console';
import { Search, Filter, RefreshCw, Cpu, Activity, Zap, Network, Plus, GitMerge, LayoutList, CircleDashed, MousePointer2, Play, Wrench, Library, GraduationCap, Workflow } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner@2.0.3';
import { cn } from '@/lib/utils';

// Initial Data converted to Graph format
const INITIAL_NODES: AgentNode[] = [
    { id: 'root', name: 'Orchestrator', role: 'manager', model: 'claude-opus-3', status: 'running', activity: 'Coordinating fleet', x: 400, y: 50 },
    { id: 'logic-1', name: 'Budget Check', role: 'logic', model: 'rule-engine', status: 'running', activity: 'Evaluating cost', x: 400, y: 250, data: { logic: 'condition' } },
    { id: 'agent-1', name: 'Planner Agent', role: 'planner', model: 'claude-sonnet-3.5', status: 'running', activity: 'Analyzing deps', x: 200, y: 450 },
    { id: 'agent-2', name: 'Code Generator', role: 'coder', model: 'gpt-4-turbo', status: 'idle', activity: 'Waiting for task', x: 600, y: 450 },
    { id: 'agent-3', name: 'DevOps Agent', role: 'devops', model: 'claude-sonnet-3.5', status: 'running', activity: 'Checking Docker', x: 400, y: 650 },
];

const INITIAL_LINKS: AgentLink[] = [
    { id: 'link-1', source: 'root', target: 'logic-1', type: 'command' },
    { id: 'link-2', source: 'logic-1', target: 'agent-1', type: 'command', label: 'APPROVED', variant: 'success' },
    { id: 'link-3', source: 'logic-1', target: 'agent-2', type: 'command', label: 'REJECTED', variant: 'danger' },
    { id: 'link-4', source: 'agent-1', target: 'agent-3', type: 'data', label: 'SPECS', variant: 'default' },
];

const MOCK_TIMELINE_STEPS: TimelineStep[] = [
    { id: '1', label: 'Initialize Fleet', status: 'completed', duration: '2.4s' },
    { id: '2', label: 'Planner Agent', status: 'completed', duration: '8.1s' },
    { id: '3', label: 'Code Generator', status: 'running' },
    { id: '4', label: 'DevOps Check', status: 'pending' },
    { id: '5', label: 'Integration Tests', status: 'pending' },
];

export function AgentsView() {
  const [nodes, setNodes] = useState<AgentNode[]>(INITIAL_NODES);
  const [links, setLinks] = useState<AgentLink[]>(INITIAL_LINKS);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [showConversation, setShowConversation] = useState(false);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showRunModal, setShowRunModal] = useState(false);
  const [showIntegrationModal, setShowIntegrationModal] = useState(false);
  const [showToolRegistry, setShowToolRegistry] = useState(false);
  const [showPipelineWizard, setShowPipelineWizard] = useState(false);
  const [showKnowledgeBaseWizard, setShowKnowledgeBaseWizard] = useState(false);
  const [showSkillBuilderWizard, setShowSkillBuilderWizard] = useState(false);
  const [approvalNode, setApprovalNode] = useState<AgentNode | null>(null);
  const [timelineSteps, setTimelineSteps] = useState<TimelineStep[]>(MOCK_TIMELINE_STEPS);
  const [pipelineStartTime, setPipelineStartTime] = useState<string>("00:00:00");
  const [pipelineDuration, setPipelineDuration] = useState<string>("0s");
  const [systemLogs, setSystemLogs] = useState<LogEntry[]>([]);
  
  const [isReplaying, setIsReplaying] = useState(false);
  const [replayStepIndex, setReplayStepIndex] = useState(-1);

  // Helper to add logs
  const addSystemLog = (message: string, level: 'info' | 'warn' | 'error' | 'success' | 'debug' = 'info', source: string = 'Orchestrator', toolName?: string, toolOutput?: any, nodeId?: string) => {
      setSystemLogs(prev => [...prev, {
          id: Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' }),
          level,
          source,
          message,
          toolName,
          toolOutput,
          nodeId
      }]);
  };

  // Replay Effect
  useEffect(() => {
    if (!isReplaying) return;

    const steps = [
        // Step 0: Initial State
        { node: 'root', status: 'running', link: null, log: 'Initializing fleet coordination sequence...', nodeId: 'root' },
        // Step 1: Root -> Logic
        { node: 'root', status: 'idle', link: 'link-1', log: 'Delegating context to Budget Logic Node.', nodeId: 'root' },
        // Step 2: Logic Running
        { node: 'logic-1', status: 'running', link: null, log: 'Evaluating conditions: epic.storyPoints > 20', nodeId: 'logic-1' },
        // Step 3: Logic -> Planner (Approved)
        { node: 'logic-1', status: 'idle', link: 'link-2', log: 'Condition matched: APPROVED. Routing to Planner.', nodeId: 'logic-1' },
        // Step 4: Planner Running
        { node: 'agent-1', status: 'running', link: null, log: 'Planner analyzing dependency graph...', nodeId: 'agent-1' },
        // Step 5: Planner -> DevOps
        { node: 'agent-1', status: 'idle', link: 'link-4', log: 'Architecture specs finalized. Handoff to DevOps.', nodeId: 'agent-1' },
        // Step 6: DevOps Running
        { 
            node: 'agent-3', 
            status: 'running', 
            link: null, 
            log: 'Validating infrastructure requirements.',
            toolName: 'scan_endpoints',
            toolOutput: { vulnerabilities: 0, warnings: 2 },
            nodeId: 'agent-3'
        },
        // Step 7: Finished
        { 
            node: 'agent-3', 
            status: 'idle', 
            link: null, 
            log: 'Pipeline execution completed successfully.',
            toolName: 'git_status',
            toolOutput: { files: 12, insertions: 450, deletions: 32, fileList: ['src/app.ts', 'Dockerfile', 'package.json'] },
            nodeId: 'agent-3'
        }
    ];

    if (replayStepIndex >= steps.length) {
        setIsReplaying(false);
        setReplayStepIndex(-1);
        addSystemLog('Replay visualization finished.', 'success', 'System');
        toast.success("Replay Complete");
        // Reset visual state
        setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
        setLinks(prev => prev.map(l => ({ ...l, active: false })));
        return;
    }

    const timer = setTimeout(() => {
        const step = steps[replayStepIndex];
        
        if (step) {
            // Update Nodes
            setNodes(prev => prev.map(n => ({
                ...n,
                status: n.id === step.node ? step.status as any : (step.status === 'running' ? 'idle' : n.status)
            })));

            // Update Links
            setLinks(prev => prev.map(l => ({
                ...l,
                active: l.id === step.link
            })));
            
            // Add Log
            if (step.log) {
                // @ts-ignore - step might have tool props
                addSystemLog(step.log, 'info', 'ReplayEngine', step.toolName, step.toolOutput, step.nodeId);
            }
        }
        
        setReplayStepIndex(prev => prev + 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [isReplaying, replayStepIndex]);

  const handleReplay = () => {
      if (isReplaying) {
          setIsReplaying(false);
          setReplayStepIndex(-1);
          setNodes(prev => prev.map(n => ({ ...n, status: 'idle' })));
          setLinks(prev => prev.map(l => ({ ...l, active: false })));
          addSystemLog('Replay aborted by user.', 'warn', 'System');
          return;
      }
      
      setIsReplaying(true);
      setReplayStepIndex(0);
      setSystemLogs([]); // Clear logs for clean replay
      addSystemLog('Starting execution replay...', 'info', 'System');
      toast.info("Starting Execution Replay...", {
          description: "Visualizing decision paths and data flow."
      });
  };

  const [bindingData, setBindingData] = useState<{ sourceId: string, label: string } | null>(null);

  const selectedAgent = nodes.find(n => n.id === selectedAgentId);

  const handleBindOutput = (label: string) => {
      if (!selectedAgent) return;
      setBindingData({ sourceId: selectedAgent.id, label });
      toast.info("Select Target Node", {
          description: `Click a node to bind the '${label}' path.`
      });
  };

  const handleNodeSelect = (nodeId: string | null) => {
      if (bindingData && nodeId) {
          if (nodeId === bindingData.sourceId) {
              toast.error("Cannot bind to self");
              return;
          }

          // Create the link
          const newLink: AgentLink = {
              id: `link-${Date.now()}`,
              source: bindingData.sourceId,
              target: nodeId,
              type: 'command',
              label: bindingData.label,
              variant: bindingData.label === 'CRITICAL' || bindingData.label === 'REJECTED' ? 'danger' : 
                       bindingData.label === 'HIGH' || bindingData.label === 'WARNING' ? 'warning' : 
                       bindingData.label === 'APPROVED' ? 'success' : 'default'
          };

          setLinks(prev => [...prev, newLink]);
          setBindingData(null);
          addSystemLog(`Bound logic path '${bindingData.label}' to node ${nodeId}`, 'success', 'Config', undefined, undefined, nodeId);
          toast.success("Path Bound", {
              description: `Connected '${bindingData.label}' to node.`
          });
          return;
      }
      
      setSelectedAgentId(nodeId);
  };

  const handleRefresh = () => {
    addSystemLog('Telemetry sync initiated', 'debug', 'System');
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

    addSystemLog(`Provisioned new agent: ${newAgent.name} (${newAgent.role})`, 'info', 'Provisioner', undefined, undefined, id);
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
      addSystemLog(`Manual connection established: ${sourceId} -> ${targetId}`, 'info', 'Canvas', undefined, undefined, sourceId);
      toast.success("Agents Linked", {
          description: `Connection established between agents.`
      });
  };

  const handleAddNode = (node: AgentNode) => {
      setNodes(prev => [...prev, node]);
      addSystemLog(`Component added to pipeline: ${node.name}`, 'info', 'Palette');
      toast.success("Component Added", {
          description: `${node.name} added to pipeline.`
      });
  };

  const handleNodeUpdate = (nodeId: string, data: any) => {
      setNodes(prev => prev.map(n => 
          n.id === nodeId ? { ...n, data: { ...(n.data || {}), ...data } } : n
      ));
      addSystemLog(`Configuration updated for node ${nodeId}`, 'debug', 'Config', undefined, undefined, nodeId);
  };

  const handleRunPipeline = (config: any) => {
      addSystemLog(`Pipeline execution triggered: exec-8492`, 'info', 'Orchestrator');
      toast.success("Pipeline Started", {
          description: "Execution ID: exec-8492 started on Development environment."
      });
      
      setPipelineStartTime(new Date().toLocaleTimeString());
      setTimelineSteps(prev => prev.map(step => ({ ...step, status: 'pending', duration: undefined })));
      
      // Simulate pipeline progress
      setTimeout(() => {
          setTimelineSteps(prev => prev.map((step, i) => i === 0 ? { ...step, status: 'running' } : step));
      }, 500);
  };

  const handleLoadTemplate = (newNodes: AgentNode[], newLinks: AgentLink[]) => {
      setNodes(newNodes);
      setLinks(newLinks);
      addSystemLog('Blueprint loaded successfully', 'info', 'System');
      toast.success("Blueprint Loaded", {
          description: "Pipeline architecture updated."
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
                variant="ghost" 
                size="sm"
                className="border-transparent text-zinc-500 hover:text-zinc-300 h-9 px-2"
                onClick={() => setShowKnowledgeBaseWizard(true)}
                title="Knowledge Bases"
            >
              <Library className="size-4" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm"
                className="border-transparent text-zinc-500 hover:text-zinc-300 h-9 px-2"
                onClick={() => setShowSkillBuilderWizard(true)}
                title="Skill Library"
            >
              <GraduationCap className="size-4" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm"
                className="border-transparent text-zinc-500 hover:text-zinc-300 h-9 px-2"
                onClick={() => setShowToolRegistry(true)}
                title="Tool Registry"
            >
              <Wrench className="size-4" />
            </Button>
            <Button 
                variant="ghost" 
                size="sm"
                className="border-transparent text-zinc-500 hover:text-zinc-300 h-9 px-2"
                onClick={() => setShowIntegrationModal(true)}
                title="Manage Integrations"
            >
              <Network className="size-4" />
            </Button>
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
                className="bg-emerald-600 hover:bg-emerald-500 text-white h-9 border border-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]"
                onClick={() => setShowRunModal(true)}
            >
              <Play className="size-3.5 mr-2 fill-current" />
              Run Pipeline
            </Button>
            <Button 
                size="sm"
                className="bg-violet-600 hover:bg-violet-700 text-white h-9 shadow-[0_0_15px_rgba(139,92,246,0.3)] transition-shadow hover:shadow-[0_0_25px_rgba(139,92,246,0.5)]"
                onClick={() => setShowCreateDialog(true)}
            >
              <Plus className="size-3.5 mr-2" />
              Provision Agent
            </Button>
            <Button 
                variant="outline" 
                size="sm"
                className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-9"
                onClick={() => setShowPipelineWizard(true)}
            >
              <Workflow className="size-3.5 mr-2" />
              New Pipeline
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
        {/* Left: Node Palette */}
        <NodePalette />

        {/* Main Canvas */}
        <div className="flex-1 relative bg-[#050506] flex flex-col border-l border-zinc-800 min-h-0">
            <div className="flex-1 relative min-h-0">
                <AgentTree 
                    nodes={nodes}
                    links={links}
                    selectedId={selectedAgentId}
                    onSelect={handleNodeSelect}
                    onNodeMove={handleNodeMove}
                    onConnect={handleConnect}
                    onAddNode={handleAddNode}
                    isBinding={!!bindingData}
                />
            </div>

            <PipelineTimeline 
                steps={timelineSteps}
                startTime={pipelineStartTime}
                totalDuration={pipelineDuration}
                onReplay={handleReplay}
                isReplaying={isReplaying}
            />
            
            {/* Global Console Drawer */}
            <GlobalConsole 
                logs={systemLogs} 
                onLogClick={(log) => {
                    if (log.nodeId) setSelectedAgentId(log.nodeId);
                }}
            />
        </div>

        {/* Right: Details Panel (Slide-over) */}
        <div className={cn(
            "absolute top-0 right-0 bottom-0 z-30 w-[450px] border-l border-zinc-800 bg-[#09090b]/95 backdrop-blur-xl transition-transform duration-300 shadow-2xl",
            selectedAgent ? "translate-x-0" : "translate-x-full"
        )}>
            {selectedAgent && (
                (selectedAgent.role === 'integration' || selectedAgent.role === 'logic') ? (
                    <NodePropertiesPanel 
                        node={selectedAgent}
                        links={links}
                        onClose={() => setSelectedAgentId(null)}
                        onUpdate={handleNodeUpdate}
                        onLinksUpdate={setLinks}
                        onSimulateApproval={() => setApprovalNode(selectedAgent)}
                        onBindOutput={handleBindOutput}
                    />
                ) : (
                    <AgentDetailPanel 
                        agent={selectedAgent} 
                        onClose={() => setSelectedAgentId(null)}
                        onViewConversation={() => setShowConversation(true)}
                    />
                )
            )}
        </div>
      </div>

      {/* Overlays */}
      {showConversation && selectedAgent && (
         <AgentConversation 
             agent={selectedAgent} 
             allAgents={nodes}
             onClose={() => setShowConversation(false)} 
         />
      )}
      
      <AgentBuilderWizard 
        isOpen={showCreateDialog} 
        onClose={() => setShowCreateDialog(false)} 
        onComplete={handleCreateAgent}
      />
      
      <RunPipelineModal 
        isOpen={showRunModal}
        onClose={() => setShowRunModal(false)}
        onRun={handleRunPipeline}
      />

      <IntegrationWizard
        isOpen={showIntegrationModal}
        onClose={() => setShowIntegrationModal(false)}
      />

      <ToolRegistryDialog 
        isOpen={showToolRegistry}
        onClose={() => setShowToolRegistry(false)}
      />

      <PipelineWizard
        isOpen={showPipelineWizard}
        onClose={() => setShowPipelineWizard(false)}
        onCreate={handleLoadTemplate}
      />

      <SkillBuilderWizard
        isOpen={showSkillBuilderWizard}
        onClose={() => setShowSkillBuilderWizard(false)}
      />

      <KnowledgeBaseWizard
        isOpen={showKnowledgeBaseWizard}
        onClose={() => setShowKnowledgeBaseWizard(false)}
      />
      
      {approvalNode && (
        <ApprovalModal
            isOpen={!!approvalNode}
            onClose={() => setApprovalNode(null)}
            epicKey="GA-42"
            epicTitle="Frontend Setup (SvelteKit)"
        />
      )}
    </div>
  );
}