import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Brain, Terminal, Zap, Shield } from 'lucide-react';
import { AgentNode } from '../AgentTree';

interface AgentConfigFormProps {
    node: AgentNode;
    onChange: (data: any) => void;
}

export function AgentConfigForm({ node, onChange }: AgentConfigFormProps) {
    return (
        <div className="space-y-6">
            {/* Model Selection */}
            <div className="space-y-3">
                <Label className="text-xs text-zinc-400 uppercase tracking-wider font-bold">Inference Model</Label>
                <Select 
                    defaultValue={node.model || 'gpt-4-turbo'} 
                    onValueChange={(val) => onChange({ model: val })}
                >
                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-200">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                        <SelectItem value="claude-sonnet-3.5">Claude 3.5 Sonnet</SelectItem>
                        <SelectItem value="llama-3-70b">Llama 3 70B (Local)</SelectItem>
                    </SelectContent>
                </Select>
                <div className="flex items-center justify-between text-[10px] text-zinc-500 px-1">
                    <span>Context Window: 128k</span>
                    <span>Cost: $0.01/1k tokens</span>
                </div>
            </div>

            {/* System Prompt */}
            <div className="space-y-3">
                 <Label className="text-xs text-zinc-400 uppercase tracking-wider font-bold flex items-center justify-between">
                    <span>System Persona</span>
                    <Badge variant="outline" className="text-[9px] border-zinc-800 text-zinc-600">v2.4</Badge>
                 </Label>
                 <Textarea 
                    className="bg-zinc-900 border-zinc-800 font-mono text-xs text-zinc-300 min-h-[120px] leading-relaxed"
                    placeholder="You are a senior DevOps engineer responsible for..."
                    defaultValue={node.data?.systemPrompt || `You are a ${node.role} agent specialized in high-reliability execution.`}
                    onChange={(e) => onChange({ systemPrompt: e.target.value })}
                 />
            </div>

            {/* Parameters */}
            <div className="space-y-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                <Label className="text-xs text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <Brain className="size-3" /> Parameters
                </Label>
                
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Temperature</span>
                        <span className="text-xs font-mono text-zinc-300">0.7</span>
                    </div>
                    <Slider defaultValue={[0.7]} max={1} step={0.1} className="[&_.bg-primary]:bg-violet-500" />
                </div>

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-zinc-400">Max Tokens</span>
                        <span className="text-xs font-mono text-zinc-300">4096</span>
                    </div>
                    <Slider defaultValue={[4096]} max={8192} step={128} className="[&_.bg-primary]:bg-violet-500" />
                </div>
            </div>

            {/* Tools */}
            <div className="space-y-3">
                <Label className="text-xs text-zinc-400 uppercase tracking-wider font-bold flex items-center gap-2">
                    <Terminal className="size-3" /> Active Toolset
                </Label>
                <div className="space-y-2">
                    {[
                        { id: 'git', label: 'Git Access', icon: Terminal },
                        { id: 'fs', label: 'File System', icon: Database },
                        { id: 'net', label: 'Network Access', icon: Zap },
                        { id: 'sec', label: 'Security Scan', icon: Shield },
                    ].map((tool) => (
                        <div key={tool.id} className="flex items-center justify-between p-3 bg-zinc-900/40 border border-zinc-800 rounded-md">
                            <div className="flex items-center gap-3">
                                <tool.icon className="size-4 text-zinc-500" />
                                <span className="text-sm text-zinc-300">{tool.label}</span>
                            </div>
                            <Switch defaultChecked={['git', 'fs'].includes(tool.id)} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}