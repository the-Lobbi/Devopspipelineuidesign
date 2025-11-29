import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { useDrop } from 'react-dnd';
import { ItemTypes } from './NodePalette';
import { PipelineMinimap } from './PipelineMinimap';
import { Bot, Terminal, Shield, Search, Server, Zap, MoreHorizontal, Play, Square, Activity, Trash, Webhook, FileText, GitBranch, Slack, Split, Repeat, AlertTriangle } from 'lucide-react';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";

export interface AgentNode {
  id: string;
  name: string;
  role: string;
  model: string;
  status: 'running' | 'idle' | 'paused' | 'error' | 'waiting';
  activity: string;
  x: number;
  y: number;
  data?: any;
}

export interface AgentLink {
  id: string;
  source: string;
  target: string;
  type: 'data' | 'command' | 'signal';
  label?: string;
  variant?: 'default' | 'success' | 'danger' | 'warning';
  active?: boolean;
}

interface AgentTreeProps {
  nodes: AgentNode[];
  links: AgentLink[];
  selectedId?: string;
  onSelect: (nodeId: string | null) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onConnect: (sourceId: string, targetId: string) => void;
  onAddNode?: (node: AgentNode) => void;
  isBinding?: boolean;
}

const NODE_WIDTH = 260;
const NODE_HEIGHT = 100;

function Node({ 
    node, 
    isSelected, 
    onSelect,
    onMouseDown,
    onConnectStart,
    onConnectEnd
}: { 
    node: AgentNode; 
    isSelected: boolean; 
    onSelect: () => void;
    onMouseDown: (e: React.MouseEvent) => void;
    onConnectStart: (e: React.MouseEvent, nodeId: string) => void;
    onConnectEnd: (nodeId: string) => void;
}) {
    let Icon = Bot;
    // Agent Roles
    if (node.role === 'coder' || node.name.includes('Code')) Icon = Terminal;
    if (node.role === 'qa' || node.name.includes('Test')) Icon = Shield;
    if (node.role === 'reviewer' || node.name.includes('Review')) Icon = Search;
    if (node.role === 'devops' || node.name.includes('DevOps')) Icon = Server;
    
    // Integrations
    if (node.role === 'integration' || (node as any).integration) {
        const i = (node as any).integration || '';
        if (i === 'jira' || node.name.includes('Jira')) Icon = FileText;
        if (i === 'github' || node.name.includes('GitHub')) Icon = GitBranch;
        if (i === 'slack' || node.name.includes('Slack')) Icon = Slack;
        if (i === 'confluence' || node.name.includes('Confluence')) Icon = FileText;
    }

    // Triggers
    if (node.role === 'trigger') Icon = Webhook;

    // Logic
    if (node.role === 'logic') {
        const l = (node as any).logic || node.data?.logic || 'condition'; // Default to condition
        if (l === 'condition') Icon = Split;
        if (l === 'loop') Icon = Repeat;
        if (l === 'error') Icon = AlertTriangle;
    }

    const isLogic = node.role === 'logic';
    const statusColor = node.status === 'running' ? '#10b981' : 
                       node.status === 'waiting' ? '#f59e0b' :
                       node.status === 'error' ? '#ef4444' : '#27272a';

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <g 
                    transform={`translate(${node.x - (isLogic ? 60 : NODE_WIDTH / 2)}, ${node.y - (isLogic ? 60 : NODE_HEIGHT / 2)})`}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onSelect();
                        onMouseDown(e);
                    }}
                    onMouseUp={() => onConnectEnd(node.id)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            onSelect();
                        }
                    }}
                    className="cursor-grab active:cursor-grabbing group focus:outline-none"
                    tabIndex={0}
                    role="button"
                    aria-label={`Agent ${node.name}. Role: ${node.role}. Status: ${node.status}. Activity: ${node.activity}`}
                >
                    {isLogic ? (
                        // LOGIC NODE (DIAMOND SHAPE)
                        <g>
                            {/* Focus Ring */}
                            <rect 
                                x="0" y="0" 
                                width="120" height="120" 
                                rx="10"
                                transform="rotate(45, 60, 60)"
                                fill="none" 
                                stroke="#8b5cf6" 
                                strokeWidth="2"
                                className="opacity-0 group-focus-visible:opacity-100 transition-opacity"
                            />
                             {/* Glow Effect */}
                             {isSelected && (
                                 <rect 
                                    x="0" y="0" 
                                    width="124" height="124" 
                                    rx="12"
                                    transform="translate(-2, -2) rotate(45, 62, 62)"
                                    fill="none" 
                                    stroke="#8b5cf6" 
                                    strokeWidth="1"
                                    strokeOpacity="0.5"
                                    strokeDasharray="4 4"
                                    className="animate-pulse"
                                />
                            )}
                            
                            <foreignObject width="120" height="120" style={{ overflow: 'visible' }}>
                                <div className="w-[120px] h-[120px] flex items-center justify-center">
                                    <div className={cn(
                                        "w-[84px] h-[84px] rotate-45 border-2 flex items-center justify-center backdrop-blur-md transition-colors duration-300 shadow-lg",
                                        isSelected 
                                            ? "border-violet-500 bg-violet-950/40" 
                                            : "border-zinc-700 bg-[#09090b] group-hover:border-zinc-500"
                                    )}>
                                        <div className="-rotate-45 flex flex-col items-center gap-1">
                                            <Icon className={cn("size-6", isSelected ? "text-white" : "text-zinc-400")} />
                                            <div className="text-[9px] font-bold uppercase tracking-widest text-zinc-500">{node.name}</div>
                                        </div>
                                    </div>
                                </div>
                            </foreignObject>

                            {/* Output Handle (Bottom) */}
                            <circle 
                                cx="60" cy="120" r="5" 
                                className="fill-zinc-500 stroke-zinc-900 stroke-2 cursor-crosshair hover:fill-violet-400 transition-colors"
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    onConnectStart(e, node.id);
                                }}
                            />
                            {/* Input Visual (Top) */}
                            <circle cx="60" cy="0" r="4" className="fill-zinc-700 stroke-zinc-900 stroke-2" />
                            {/* Logic Output Handles (Left/Right for True/False) */}
                            <circle cx="0" cy="60" r="4" className="fill-zinc-700 stroke-zinc-900 stroke-2" />
                            <circle 
                                cx="120" cy="60" r="5" 
                                className="fill-zinc-500 stroke-zinc-900 stroke-2 cursor-crosshair hover:fill-violet-400 transition-colors" 
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    onConnectStart(e, node.id);
                                }}
                            />
                        </g>
                    ) : (
                        // STANDARD NODE (CARD SHAPE)
                        <g>
                            {/* Focus Ring */}
                            <rect 
                                x={-6} y={-6} 
                                width={NODE_WIDTH + 12} height={NODE_HEIGHT + 12} 
                                rx={18} 
                                fill="none" 
                                stroke="#8b5cf6" 
                                strokeWidth="2"
                                className="opacity-0 group-focus-visible:opacity-100 transition-opacity"
                            />

                            {/* Glow Effect */}
                            {isSelected && (
                                 <rect 
                                    x={-4} y={-4} 
                                    width={NODE_WIDTH + 8} height={NODE_HEIGHT + 8} 
                                    rx={16} 
                                    fill="none" 
                                    stroke="#8b5cf6" 
                                    strokeWidth="1"
                                    strokeOpacity="0.5"
                                    strokeDasharray="4 4"
                                    className="animate-pulse"
                                />
                            )}

                            <foreignObject width={NODE_WIDTH} height={NODE_HEIGHT}>
                                <div className={cn(
                                    "w-full h-full relative transition-all duration-200 select-none group-hover:shadow-lg",
                                    isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                                )}>
                                    {/* Main Card Body */}
                                    <div className={cn(
                                        "absolute inset-0 border-2 border-l-4 rounded-xl backdrop-blur-md transition-all duration-300 overflow-hidden",
                                        isSelected 
                                            ? "border-violet-500 border-l-violet-500 bg-violet-950/20" 
                                            : "border-zinc-800 bg-[#09090b] group-hover:border-zinc-700"
                                    )}
                                    style={{ borderLeftColor: node.status === 'running' ? '#10b981' : node.status === 'waiting' ? '#f59e0b' : node.status === 'error' ? '#ef4444' : undefined }}
                                    >
                                        {/* Tech Decor */}
                                        <div className="absolute top-0 right-0 p-2">
                                            <div className={cn("size-1.5 rounded-full", 
                                                node.status === 'running' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : 
                                                node.status === 'waiting' ? "bg-amber-500 animate-pulse" :
                                                node.status === 'error' ? "bg-red-500" : "bg-zinc-700"
                                            )} />
                                        </div>

                                        <div className="p-4 h-full flex flex-col justify-between relative z-10 pl-5">
                                            {/* Header */}
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "p-2 rounded-lg border",
                                                    isSelected ? "bg-violet-500/20 border-violet-500/30 text-violet-300" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                                )}>
                                                    <Icon className="size-5" />
                                                </div>
                                                <div>
                                                    <div className={cn("text-sm font-bold leading-none mb-1", isSelected ? "text-white" : "text-zinc-200")}>
                                                        {node.name}
                                                    </div>
                                                    <div className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider flex items-center gap-1.5">
                                                        <span className="text-violet-500/50">ID:</span> {node.id.split('-')[1]}
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Footer / Stats */}
                                            <div className="space-y-2">
                                                <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                                                    <span className="uppercase tracking-wider">{node.status}</span>
                                                    <span>{node.model}</span>
                                                </div>
                                                {/* Mini Load Bar */}
                                                <div className="h-0.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                                                    <div className={cn(
                                                        "h-full transition-all duration-1000 w-[60%]",
                                                        node.status === 'running' ? "bg-emerald-500" : "bg-zinc-600"
                                                    )} />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </foreignObject>
                            
                            {/* Connection Handle (Bottom) - Output */}
                            <circle 
                                cx={NODE_WIDTH/2} 
                                cy={NODE_HEIGHT} 
                                r={6} 
                                className="fill-zinc-500 stroke-zinc-900 stroke-2 cursor-crosshair hover:fill-violet-400 transition-colors" 
                                onMouseDown={(e) => {
                                    e.stopPropagation();
                                    onConnectStart(e, node.id);
                                }}
                            />
                            
                            {/* Connection Handle (Top) - Input Visual Only */}
                             <circle 
                                cx={NODE_WIDTH/2} 
                                cy={0} 
                                r={4} 
                                className="fill-zinc-700 stroke-zinc-900 stroke-2" 
                            />
                        </g>
                    )}
                </g>
            </ContextMenuTrigger>
            <ContextMenuContent className="bg-zinc-900 border-zinc-800 text-zinc-200 w-48">
                <ContextMenuItem>
                    <Play className="size-3.5 mr-2 text-emerald-400" /> Start Agent
                </ContextMenuItem>
                <ContextMenuItem>
                    <Square className="size-3.5 mr-2 text-red-400" /> Stop Agent
                </ContextMenuItem>
                <ContextMenuSeparator className="bg-zinc-800" />
                <ContextMenuSub>
                    <ContextMenuSubTrigger><Activity className="size-3.5 mr-2" /> Diagnostics</ContextMenuSubTrigger>
                    <ContextMenuSubContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                        <ContextMenuItem>View Logs</ContextMenuItem>
                        <ContextMenuItem>Inspect Memory</ContextMenuItem>
                        <ContextMenuItem>Check Network</ContextMenuItem>
                    </ContextMenuSubContent>
                </ContextMenuSub>
                <ContextMenuSeparator className="bg-zinc-800" />
                <ContextMenuItem className="text-red-400 focus:text-red-400 focus:bg-red-900/10">
                    <Trash className="size-3.5 mr-2" /> Terminate
                </ContextMenuItem>
            </ContextMenuContent>
        </ContextMenu>
    );
}

export function AgentTree({ 
    nodes = [], 
    links = [], 
    selectedId, 
    onSelect,
    onNodeMove,
    onConnect,
    onAddNode,
    isBinding
}: AgentTreeProps) {
  const safeNodes = nodes || [];
  const safeLinks = links || [];

  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });
  const [viewport, setViewport] = useState({ width: 0, height: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
      if (!svgRef.current) return;
      const updateViewport = () => {
          const rect = svgRef.current?.getBoundingClientRect();
          if (rect) {
              setViewport({ width: rect.width, height: rect.height });
          }
      };
      
      updateViewport();
      window.addEventListener('resize', updateViewport);
      return () => window.removeEventListener('resize', updateViewport);
  }, []);

  // Drop Handling
  const [{ isOver }, drop] = useDrop(() => ({
      accept: ItemTypes.NODE,
      drop: (item: any, monitor) => {
          if (!onAddNode || !svgRef.current) return;
          
          const clientOffset = monitor.getClientOffset();
          if (!clientOffset) return;
          
          const rect = svgRef.current.getBoundingClientRect();
          const x = (clientOffset.x - rect.left - pan.x) / scale;
          const y = (clientOffset.y - rect.top - pan.y) / scale;
          
          const newNode: AgentNode = {
              id: `node-${Date.now()}`,
              name: item.label,
              role: item.type === 'integration' ? 'integration' : 
                    item.type === 'trigger' ? 'trigger' : 
                    item.type === 'logic' ? 'logic' : 
                    item.data.role || 'agent',
              model: item.data.model || 'gpt-4-turbo',
              status: 'idle',
              activity: 'Provisioned',
              x,
              y,
              ...item.data // spread extra data like logic type or integration type
          };
          
          onAddNode(newNode);
      },
      collect: monitor => ({
          isOver: !!monitor.isOver(),
      }),
  }), [pan, scale, onAddNode]);
  
  // Combine refs for drop and svg
  const setRefs = (element: SVGSVGElement | null) => {
      // @ts-ignore
      drop(element);
      // @ts-ignore
      svgRef.current = element;
  };
  
  // Node dragging state
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const getSVGPoint = (clientX: number, clientY: number) => {
      if (!svgRef.current) return { x: 0, y: 0 };
      const rect = svgRef.current.getBoundingClientRect();
      return {
          x: (clientX - rect.left - pan.x) / scale,
          y: (clientY - rect.top - pan.y) / scale
      };
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    if (draggingNode || connectingNodeId) return;
    setIsDraggingCanvas(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleCanvasMouseMove = (e: React.MouseEvent) => {
    const svgPoint = getSVGPoint(e.clientX, e.clientY);
    setMousePos(svgPoint);

    if (isDraggingCanvas) {
        setPan({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    } else if (draggingNode) {
        onNodeMove(
            draggingNode, 
            svgPoint.x - nodeDragOffset.x, 
            svgPoint.y - nodeDragOffset.y
        );
    }
  };

  const handleCanvasMouseUp = () => {
    setIsDraggingCanvas(false);
    setDraggingNode(null);
    setConnectingNodeId(null);
  };

  // Node Drag Handlers
  const handleNodeMouseDown = (e: React.MouseEvent, nodeId: string) => {
      e.stopPropagation(); // Prevent canvas pan
      const svgPoint = getSVGPoint(e.clientX, e.clientY);
      const node = safeNodes.find(n => n.id === nodeId);
      if (node) {
          setNodeDragOffset({
              x: svgPoint.x - node.x,
              y: svgPoint.y - node.y
          });
      }
      setDraggingNode(nodeId);
  };

  // Connection Handlers
  const handleConnectStart = (e: React.MouseEvent, nodeId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setConnectingNodeId(nodeId);
  };

  const handleConnectEnd = (targetNodeId: string) => {
      if (connectingNodeId && connectingNodeId !== targetNodeId) {
          onConnect(connectingNodeId, targetNodeId);
      }
      setConnectingNodeId(null);
  };

  const handleWheel = (e: React.WheelEvent) => {
      if (e.ctrlKey || e.metaKey) {
          e.preventDefault();
          const zoomSensitivity = 0.001;
          const delta = -e.deltaY * zoomSensitivity;
          const newScale = Math.min(Math.max(0.1, scale + delta), 3);
          setScale(newScale);
      }
  };

  return (
    <div className="relative h-full w-full bg-[#050506] overflow-hidden select-none">
        {/* Background Grid */}
        <div className="absolute inset-0 opacity-20 pointer-events-none" 
             style={{ 
                 backgroundImage: `
                    linear-gradient(#333 1px, transparent 1px), 
                    linear-gradient(90deg, #333 1px, transparent 1px)
                 `, 
                 backgroundSize: `${40 * scale}px ${40 * scale}px`,
                 backgroundPosition: `${pan.x}px ${pan.y}px`
             }} 
        />

        <svg 
            ref={setRefs}
            className={cn("w-full h-full outline-none", 
                isDraggingCanvas ? "cursor-grabbing" : 
                isBinding ? "cursor-crosshair" :
                "cursor-default", 
                isOver && "bg-zinc-900/30"
            )}
            onMouseDown={handleCanvasMouseDown}
            onMouseMove={handleCanvasMouseMove}
            onMouseUp={handleCanvasMouseUp}
            onMouseLeave={handleCanvasMouseUp}
            onWheel={handleWheel}
        >
            <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#52525b" />
                </marker>
                 <filter id="glow">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>

            <g transform={`translate(${pan.x},${pan.y}) scale(${scale})`}>
                {/* Links Layer */}
                {safeLinks.map(link => {
                    const source = safeNodes.find(n => n.id === link.source);
                    const target = safeNodes.find(n => n.id === link.target);
                    if (!source || !target) return null;

                    // Calculate path
                    // Start from bottom of source, end at top of target
                    const sx = source.x;
                    const sy = source.y + NODE_HEIGHT/2;
                    const tx = target.x;
                    const ty = target.y - NODE_HEIGHT/2;
                    
                    const dy = Math.abs(ty - sy);
                    const controlStrength = dy * 0.5 + 50;

                    const d = `M ${sx} ${sy} C ${sx} ${sy + controlStrength}, ${tx} ${ty - controlStrength}, ${tx} ${ty}`;

                    // Calculate midpoint for label
                    // Bezier midpoint approx (t=0.5)
                    const mx = 0.125 * sx + 0.375 * sx + 0.375 * tx + 0.125 * tx;
                    const my = 0.125 * sy + 0.375 * (sy + controlStrength) + 0.375 * (ty - controlStrength) + 0.125 * ty;

                    const strokeColor = link.variant === 'success' ? '#10b981' : // emerald-500
                                      link.variant === 'danger' ? '#ef4444' : // red-500
                                      link.variant === 'warning' ? '#f59e0b' : // amber-500
                                      '#27272a'; // zinc-800

                    return (
                        <g key={link.id} className="group/link">
                            <path 
                                d={d} 
                                fill="none" 
                                stroke={strokeColor} 
                                strokeWidth={link.active ? "3" : "2"} 
                                strokeOpacity={link.active ? "1" : "0.5"}
                                markerEnd="url(#arrowhead)"
                                className="transition-all duration-300"
                            />
                            {link.active && (
                                <circle r="4" fill={link.variant ? strokeColor : "#8b5cf6"}>
                                    <animateMotion dur="1s" repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                                </circle>
                            )}
                            
                            {link.label && (
                                <foreignObject x={mx - 40} y={my - 10} width={80} height={20} className="overflow-visible">
                                    <div className={cn(
                                        "flex justify-center",
                                        "transform transition-all duration-300 hover:scale-110"
                                    )}>
                                        <span className={cn(
                                            "px-2 py-0.5 rounded text-[9px] font-mono font-bold uppercase tracking-wider border shadow-sm whitespace-nowrap",
                                            link.variant === 'success' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" :
                                            link.variant === 'danger' ? "bg-red-500/10 text-red-400 border-red-500/20" :
                                            link.variant === 'warning' ? "bg-amber-500/10 text-amber-400 border-amber-500/20" :
                                            "bg-zinc-900 text-zinc-500 border-zinc-800"
                                        )}>
                                            {link.label}
                                        </span>
                                    </div>
                                </foreignObject>
                            )}
                        </g>
                    );
                })}

                {/* Temp Connection Line */}
                {connectingNodeId && (
                    <path 
                        d={`M ${safeNodes.find(n => n.id === connectingNodeId)?.x || 0} ${(safeNodes.find(n => n.id === connectingNodeId)?.y || 0) + NODE_HEIGHT/2} L ${mousePos.x} ${mousePos.y}`}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                    />
                )}

                {/* Nodes Layer */}
                {safeNodes.map(node => (
                    <Node 
                        key={node.id} 
                        node={node} 
                        isSelected={selectedId === node.id}
                        onSelect={() => onSelect(node.id)}
                        onMouseDown={(e) => handleNodeMouseDown(e, node.id)}
                        onConnectStart={handleConnectStart}
                        onConnectEnd={handleConnectEnd}
                    />
                ))}
            </g>
        </svg>

        {/* Overlay Controls */}
        <div className="absolute top-6 right-6 flex flex-col gap-2 pointer-events-none">
            <div className="pointer-events-auto flex flex-col gap-1 bg-zinc-900/90 border border-zinc-800 p-1 rounded-lg">
                <div className="text-[9px] text-zinc-500 font-mono text-center py-1">ZOOM {Math.round(scale * 100)}%</div>
            </div>
        </div>

        <PipelineMinimap 
            nodes={safeNodes} 
            pan={pan} 
            scale={scale} 
            viewport={viewport}
            onNavigate={(x, y) => setPan({ x, y })}
        />
    </div>
  );
}