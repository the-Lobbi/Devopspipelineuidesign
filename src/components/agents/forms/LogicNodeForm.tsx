import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Split, Plus, Trash2, ExternalLink } from 'lucide-react';
import { AgentLink } from '../AgentTree';

interface Condition {
    id: string;
    expression: string;
    result: string;
}

interface LogicNodeFormProps {
    node: any;
    onChange: (data: any) => void;
    onSimulateApproval?: () => void;
    links?: AgentLink[];
    onLinksUpdate?: (links: AgentLink[]) => void;
    onBindOutput?: (label: string) => void;
}

export function LogicNodeForm({ node, onChange, onSimulateApproval, links = [], onLinksUpdate, onBindOutput }: LogicNodeFormProps) {
    const [conditions, setConditions] = useState<Condition[]>([
        { id: '1', expression: node.data?.condition || "epic.storyPoints > 20", result: 'HIGH' },
        { id: '2', expression: "epic.priority == 'Critical'", result: 'CRITICAL' }
    ]);

    const outgoingLinks = links.filter(l => l.source === node.id);

    const addCondition = () => {
        const newId = Math.random().toString(36).substr(2, 9);
        setConditions([...conditions, { id: newId, expression: '', result: 'NORMAL' }]);
    };

    const removeCondition = (id: string) => {
        setConditions(conditions.filter(c => c.id !== id));
    };

    const updateCondition = (id: string, field: keyof Condition, value: string) => {
        setConditions(conditions.map(c => c.id === id ? { ...c, [field]: value } : c));
        // In a real app, we'd propagate this up via onChange
        onChange({ ...node.data, conditions }); 
    };

    const updateLink = (linkId: string, updates: Partial<AgentLink>) => {
        if (!onLinksUpdate) return;
        const newLinks = links.map(l => l.id === linkId ? { ...l, ...updates } : l);
        onLinksUpdate(newLinks);
    };

    return (
        <div className="space-y-6 p-1">
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Condition Logic</h4>
                
                <div className="p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg space-y-3">
                     <div className="flex items-center gap-2 mb-2">
                        <Split className="size-4 text-indigo-500" />
                        <span className="text-xs font-medium text-zinc-200">Branching Rules</span>
                     </div>
                     
                     <div className="space-y-2">
                         {conditions.map((condition, index) => (
                             <div key={condition.id} className="flex gap-2 items-center group animate-in fade-in slide-in-from-left-2 duration-300">
                                 <div className="flex-1">
                                    <div className="text-[10px] uppercase text-zinc-500 mb-1">{index === 0 ? 'If' : 'Else If'}</div>
                                    <Input 
                                        className="bg-zinc-950 border-zinc-800 h-7 text-xs font-mono focus:ring-indigo-500/20" 
                                        value={condition.expression}
                                        onChange={(e) => updateCondition(condition.id, 'expression', e.target.value)}
                                        placeholder="e.g. variable == true"
                                    />
                                 </div>
                                 <div className="w-24">
                                    <div className="text-[10px] uppercase text-zinc-500 mb-1">Then</div>
                                    <div className="flex gap-1">
                                        <Input 
                                            className="bg-indigo-500/5 border-indigo-500/20 h-7 text-xs font-mono text-indigo-300 focus:ring-indigo-500/20"
                                            value={condition.result}
                                            onChange={(e) => updateCondition(condition.id, 'result', e.target.value)}
                                        />
                                        {onBindOutput && (
                                            <Button 
                                                size="icon"
                                                variant="ghost"
                                                className="h-7 w-7 text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/20"
                                                title="Bind to Node on Canvas"
                                                onClick={() => onBindOutput(condition.result)}
                                            >
                                                <ExternalLink className="size-3" />
                                            </Button>
                                        )}
                                    </div>
                                 </div>
                                 {index > 0 && (
                                     <Button 
                                        size="icon" 
                                        variant="ghost" 
                                        className="h-7 w-7 text-zinc-600 hover:text-red-400 mt-5 opacity-0 group-hover:opacity-100 transition-opacity"
                                        onClick={() => removeCondition(condition.id)}
                                     >
                                        <Trash2 className="size-3" />
                                     </Button>
                                 )}
                             </div>
                         ))}
                     </div>

                     <Button 
                        variant="outline" 
                        className="w-full h-7 text-xs border-zinc-800 text-zinc-400 hover:text-zinc-200 mt-2 border-dashed hover:border-zinc-700 hover:bg-zinc-900"
                        onClick={addCondition}
                    >
                        <Plus className="size-3 mr-1" /> Add Condition
                     </Button>
                </div>
            </div>

            {/* Link Bindings */}
            {outgoingLinks.length > 0 && (
                 <div className="space-y-4">
                    <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Route Bindings</h4>
                    <div className="space-y-2">
                        {outgoingLinks.map(link => (
                            <div key={link.id} className="p-3 border border-zinc-800 rounded-lg bg-zinc-900/20 flex flex-col gap-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <ExternalLink className="size-3 text-zinc-500" />
                                        <span className="text-xs text-zinc-300 font-mono">To: {link.target}</span>
                                    </div>
                                    <Button 
                                        size="sm" 
                                        variant="ghost" 
                                        className="h-5 text-[10px] text-red-400 hover:bg-red-400/10 px-1.5"
                                        onClick={() => {
                                             if (onLinksUpdate) {
                                                 onLinksUpdate(links.filter(l => l.id !== link.id));
                                             }
                                        }}
                                    >
                                        Unlink
                                    </Button>
                                </div>
                                
                                <div className="flex gap-2">
                                    <div className="flex-1">
                                        <Label className="text-[10px] text-zinc-500 uppercase mb-1 block">Label</Label>
                                        <Input 
                                            className="h-7 bg-zinc-950 border-zinc-800 text-xs" 
                                            value={link.label || ''} 
                                            placeholder="Label on canvas"
                                            onChange={(e) => updateLink(link.id, { label: e.target.value })}
                                        />
                                    </div>
                                    <div className="w-24">
                                        <Label className="text-[10px] text-zinc-500 uppercase mb-1 block">Variant</Label>
                                        <Select 
                                            value={link.variant || 'default'} 
                                            onValueChange={(v) => updateLink(link.id, { variant: v as any })}
                                        >
                                            <SelectTrigger className="h-7 bg-zinc-950 border-zinc-800 text-xs">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-950 border-zinc-800 text-zinc-200">
                                                <SelectItem value="default">Default</SelectItem>
                                                <SelectItem value="success">Success</SelectItem>
                                                <SelectItem value="danger">Danger</SelectItem>
                                                <SelectItem value="warning">Warning</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Default Path</h4>
                <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/20">
                    <span className="text-xs text-zinc-400">Fallback Action</span>
                    <div className="h-6 px-2 flex items-center bg-zinc-800 rounded text-[10px] font-mono text-zinc-400">
                        NORMAL
                    </div>
                </div>
            </div>

            {onSimulateApproval && (
                <div className="pt-4 border-t border-zinc-800">
                    <Button 
                        className="w-full bg-amber-600 hover:bg-amber-500 text-white text-xs h-8 shadow-[0_0_10px_rgba(217,119,6,0.2)]"
                        onClick={onSimulateApproval}
                    >
                        Simulate Approval Required
                    </Button>
                </div>
            )}
        </div>
    );
}