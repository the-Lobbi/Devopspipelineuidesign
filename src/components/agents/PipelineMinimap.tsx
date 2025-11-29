import React, { useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { AgentNode } from './AgentTree';

interface PipelineMinimapProps {
    nodes: AgentNode[];
    pan: { x: number, y: number };
    scale: number;
    viewport: { width: number, height: number };
    onNavigate: (x: number, y: number) => void;
}

export function PipelineMinimap({ nodes, pan, scale, viewport, onNavigate }: PipelineMinimapProps) {
    // Calculate bounds of all nodes
    const getBounds = () => {
        if (nodes.length === 0) return { minX: 0, minY: 0, maxX: 1000, maxY: 1000 };
        
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        
        nodes.forEach(node => {
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + 260); // NODE_WIDTH
            maxY = Math.max(maxY, node.y + 100); // NODE_HEIGHT
        });
        
        // Add padding
        const padding = 200;
        return {
            minX: minX - padding,
            minY: minY - padding,
            maxX: maxX + padding,
            maxY: maxY + padding,
            width: (maxX + padding) - (minX - padding),
            height: (maxY + padding) - (minY - padding)
        };
    };

    const bounds = getBounds();
    const minimapWidth = 200;
    const minimapScale = minimapWidth / Math.max(bounds.width, 1);
    const minimapHeight = bounds.height * minimapScale;

    // Viewport Rect Calculation
    // The pan represents the translation of the canvas. 
    // Visible area in canvas coordinates:
    // x = -pan.x / scale
    // y = -pan.y / scale
    // w = viewport.width / scale
    // h = viewport.height / scale
    
    const viewportRect = {
        x: (-pan.x / scale - bounds.minX) * minimapScale,
        y: (-pan.y / scale - bounds.minY) * minimapScale,
        w: (viewport.width / scale) * minimapScale,
        h: (viewport.height / scale) * minimapScale
    };

    const handleMinimapClick = (e: React.MouseEvent) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const clickY = e.clientY - rect.top;
        
        // Convert click position back to canvas coordinates
        const canvasX = (clickX / minimapScale) + bounds.minX;
        const canvasY = (clickY / minimapScale) + bounds.minY;
        
        // Center the view on this point
        // pan.x = -canvasX * scale + viewport.width / 2
        
        const newPanX = -canvasX * scale + viewport.width / 2;
        const newPanY = -canvasY * scale + viewport.height / 2;
        
        onNavigate(newPanX, newPanY);
    };

    return (
        <div className="absolute bottom-6 right-6 w-[200px] bg-[#09090b] border border-zinc-800 rounded-lg shadow-2xl overflow-hidden select-none z-20 group">
            <div 
                className="relative cursor-crosshair"
                style={{ height: minimapHeight }}
                onMouseDown={handleMinimapClick}
            >
                {/* Background */}
                <div className="absolute inset-0 opacity-20" 
                     style={{ 
                         backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', 
                         backgroundSize: '4px 4px' 
                     }} 
                />

                {/* Nodes */}
                {nodes.map(node => {
                    const x = (node.x - bounds.minX) * minimapScale;
                    const y = (node.y - bounds.minY) * minimapScale;
                    const w = 260 * minimapScale;
                    const h = 100 * minimapScale;
                    
                    let color = "#3f3f46"; // Default gray
                    if (node.status === 'running') color = "#8b5cf6"; // Indigo
                    if (node.status === 'error') color = "#ef4444"; // Red
                    if (node.status === 'waiting') color = "#f59e0b"; // Amber

                    return (
                        <div 
                            key={node.id}
                            className="absolute rounded-sm transition-colors"
                            style={{
                                left: x,
                                top: y,
                                width: w,
                                height: h,
                                backgroundColor: color
                            }}
                        />
                    );
                })}

                {/* Viewport Indicator */}
                <div 
                    className="absolute border-2 border-indigo-500/50 bg-indigo-500/10 rounded-sm transition-all duration-75 pointer-events-none"
                    style={{
                        left: viewportRect.x,
                        top: viewportRect.y,
                        width: viewportRect.w,
                        height: viewportRect.h,
                    }}
                />
            </div>
            
            <div className="px-2 py-1 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between text-[10px] text-zinc-500">
                <span>MINIMAP</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400">CLICK TO NAVIGATE</span>
            </div>
        </div>
    );
}