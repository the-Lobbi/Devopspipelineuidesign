import React, { useState, useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Bot, Terminal, Shield, Search, Server, Zap, MoreHorizontal, Play, Square, Activity, Trash } from 'lucide-react';
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
  status: 'running' | 'idle' | 'paused' | 'error';
  activity: string;
  x: number;
  y: number;
}

export interface AgentLink {
  id: string;
  source: string;
  target: string;
  type: 'data' | 'command' | 'signal';
}

interface AgentTreeProps {
  nodes: AgentNode[];
  links: AgentLink[];
  selectedId?: string;
  onSelect: (nodeId: string | null) => void;
  onNodeMove: (id: string, x: number, y: number) => void;
  onConnect: (sourceId: string, targetId: string) => void;
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
    if (node.role === 'coder' || node.name.includes('Code')) Icon = Terminal;
    if (node.role === 'qa' || node.name.includes('Test')) Icon = Shield;
    if (node.role === 'reviewer' || node.name.includes('Review')) Icon = Search;
    if (node.role === 'devops' || node.name.includes('DevOps')) Icon = Server;

    return (
        <ContextMenu>
            <ContextMenuTrigger asChild>
                <g 
                    transform={`translate(${node.x - NODE_WIDTH / 2}, ${node.y - NODE_HEIGHT / 2})`}
                    onMouseDown={(e) => {
                        e.stopPropagation();
                        onSelect();
                        onMouseDown(e);
                    }}
                    onMouseUp={() => onConnectEnd(node.id)}
                    className="cursor-grab active:cursor-grabbing group"
                >
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
                            "w-full h-full relative transition-all duration-200 select-none",
                            isSelected ? "scale-[1.02]" : "hover:scale-[1.01]"
                        )}>
                            {/* Main Card Body */}
                            <div className={cn(
                                "absolute inset-0 border-2 rounded-xl backdrop-blur-md transition-colors duration-300 overflow-hidden",
                                isSelected 
                                    ? "border-violet-500 bg-violet-950/20" 
                                    : "border-zinc-800 bg-[#09090b] group-hover:border-zinc-700"
                            )}>
                                {/* Tech Decor */}
                                <div className="absolute top-0 right-0 p-2">
                                    <div className={cn("size-1.5 rounded-full", 
                                        node.status === 'running' ? "bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" : 
                                        node.status === 'error' ? "bg-red-500" : "bg-zinc-700"
                                    )} />
                                </div>

                                <div className="p-4 h-full flex flex-col justify-between relative z-10">
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
    nodes, 
    links, 
    selectedId, 
    onSelect,
    onNodeMove,
    onConnect
}: AgentTreeProps) {
  const [scale, setScale] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  // Node dragging state
  const [draggingNode, setDraggingNode] = useState<string | null>(null);
  const [nodeDragOffset, setNodeDragOffset] = useState({ x: 0, y: 0 });

  // Linking state
  const [connectingNodeId, setConnectingNodeId] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  
  const svgRef = useRef<SVGSVGElement>(null);

  // Helper to get SVG coords
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
      const node = nodes.find(n => n.id === nodeId);
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
            ref={svgRef}
            className={cn("w-full h-full outline-none", isDraggingCanvas ? "cursor-grabbing" : "cursor-default")}
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
                {links.map(link => {
                    const source = nodes.find(n => n.id === link.source);
                    const target = nodes.find(n => n.id === link.target);
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

                    return (
                        <g key={link.id}>
                            <path 
                                d={d} 
                                fill="none" 
                                stroke="#27272a" 
                                strokeWidth="2" 
                                markerEnd="url(#arrowhead)"
                            />
                            <circle r="3" fill="#8b5cf6">
                                <animateMotion dur="1.5s" repeatCount="indefinite" path={d} keyPoints="0;1" keyTimes="0;1" calcMode="linear" />
                            </circle>
                        </g>
                    );
                })}

                {/* Temp Connection Line */}
                {connectingNodeId && (
                    <path 
                        d={`M ${nodes.find(n => n.id === connectingNodeId)?.x || 0} ${(nodes.find(n => n.id === connectingNodeId)?.y || 0) + NODE_HEIGHT/2} L ${mousePos.x} ${mousePos.y}`}
                        fill="none"
                        stroke="#8b5cf6"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                        className="animate-pulse"
                    />
                )}

                {/* Nodes Layer */}
                {nodes.map(node => (
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
    </div>
  );
}