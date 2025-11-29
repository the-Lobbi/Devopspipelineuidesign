import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
    Workflow, ArrowRight, Check, GitBranch, LayoutList, 
    RefreshCw, Shield, Zap, GitMerge, Repeat, Users
} from 'lucide-react';
import { toast } from 'sonner';
import { AgentNode, AgentLink } from '@/components/agents/AgentTree';

interface PipelineWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onCreate: (nodes: AgentNode[], links: AgentLink[]) => void;
}

export function PipelineWizard({ isOpen, onClose, onCreate }: PipelineWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        pattern: 'sequential',
        checkpointing: true,
        humanInTheLoop: false,
        stateSchema: 'default',
        persistence: 'postgres'
    });

    const handleNext = () => { if (step < 4) setStep(step + 1); };
    const handleBack = () => { if (step > 1) setStep(step - 1); };
    
    const handleFinish = () => {
        // Generate mock nodes based on selection
        let nodes: AgentNode[] = [];
        let links: AgentLink[] = [];

        if (formData.pattern === 'sequential') {
            nodes = [
                { id: 'start', name: 'Input Trigger', role: 'trigger', model: 'system', status: 'idle', activity: 'Ready', x: 100, y: 300 },
                { id: 'step-1', name: 'Processor', role: 'agent', model: 'gpt-4-turbo', status: 'idle', activity: 'Pending', x: 350, y: 300 },
                { id: 'end', name: 'Output Handler', role: 'manager', model: 'claude-sonnet-3.5', status: 'idle', activity: 'Pending', x: 600, y: 300 },
            ];
            links = [
                { id: 'l1', source: 'start', target: 'step-1', type: 'command' },
                { id: 'l2', source: 'step-1', target: 'end', type: 'data' },
            ];
        } else if (formData.pattern === 'hierarchical') {
            nodes = [
                { id: 'super', name: 'Supervisor', role: 'manager', model: 'claude-3-opus', status: 'idle', activity: 'Coordinating', x: 400, y: 100 },
                { id: 'w1', name: 'Worker Alpha', role: 'coder', model: 'gpt-4-turbo', status: 'idle', activity: 'Waiting', x: 200, y: 300 },
                { id: 'w2', name: 'Worker Beta', role: 'qa', model: 'claude-sonnet-3.5', status: 'idle', activity: 'Waiting', x: 600, y: 300 },
            ];
            links = [
                { id: 'l1', source: 'super', target: 'w1', type: 'command' },
                { id: 'l2', source: 'super', target: 'w2', type: 'command' },
                { id: 'l3', source: 'w1', target: 'super', type: 'data' },
                { id: 'l4', source: 'w2', target: 'super', type: 'data' },
            ];
        }

        onCreate(nodes, links);
        toast.success("Pipeline Created", {
            description: `Generated new ${formData.pattern} workflow structure.`
        });
        onClose();
        setStep(1);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const ORCHESTRATION_PATTERNS = [
        { id: 'sequential', label: 'Sequential', icon: GitMerge, desc: 'Linear chain of steps. Best for clear SOPs.' },
        { id: 'hierarchical', label: 'Hierarchical', icon: LayoutList, desc: 'Supervisor delegating to specialized workers.' },
        { id: 'cyclic', label: 'Cyclic / Loop', icon: Repeat, desc: 'Iterative process for refinement or self-correction.' },
        { id: 'chat', label: 'Multi-Agent Chat', icon: Users, desc: 'Dynamic conversation between multiple personas.' },
    ];

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[700px] h-[600px] p-0 gap-0 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <Workflow className="size-4 text-cyan-400" />
                            Pipeline Builder
                        </DialogTitle>
                        <div className="text-xs font-mono text-zinc-500">STEP {step} OF 4</div>
                    </div>

                    <div className="relative flex items-center justify-between px-4">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-800 -z-10" />
                        <div className="absolute left-0 top-1/2 h-0.5 bg-cyan-500 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                        {[
                            { n: 1, label: 'Architecture' },
                            { n: 2, label: 'Settings' },
                            { n: 3, label: 'State' },
                            { n: 4, label: 'Review' }
                        ].map((s) => (
                            <div key={s.n} className="flex flex-col items-center gap-2 bg-zinc-950 px-2">
                                <div className={cn(
                                    "size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                    step >= s.n ? "bg-cyan-500 border-cyan-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                )}>
                                    {step > s.n ? <Check className="size-4" /> : s.n}
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold tracking-wider transition-colors", step >= s.n ? "text-cyan-400" : "text-zinc-600")}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 bg-[#09090b]">
                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="grid gap-2">
                                    <Label className="text-zinc-400">Pipeline Name</Label>
                                    <Input 
                                        value={formData.name}
                                        onChange={(e) => updateField('name', e.target.value)}
                                        className="bg-zinc-900 border-zinc-800"
                                        placeholder="e.g. Daily Code Review"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Orchestration Pattern</Label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {ORCHESTRATION_PATTERNS.map(pat => (
                                            <div 
                                                key={pat.id}
                                                onClick={() => updateField('pattern', pat.id)}
                                                className={cn(
                                                    "cursor-pointer p-3 rounded-lg border transition-all hover:bg-zinc-900",
                                                    formData.pattern === pat.id 
                                                        ? "border-cyan-500 bg-cyan-500/10 text-cyan-100" 
                                                        : "border-zinc-800 bg-zinc-900/20 text-zinc-400 hover:border-zinc-700"
                                                )}
                                            >
                                                <div className="flex items-center gap-2 mb-1">
                                                    <pat.icon className={cn("size-4", formData.pattern === pat.id ? "text-cyan-400" : "text-zinc-500")} />
                                                    <span className="font-bold text-sm">{pat.label}</span>
                                                </div>
                                                <p className="text-[10px] opacity-70 leading-tight">{pat.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/20 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-zinc-200">Checkpointing (Time Travel)</div>
                                            <div className="text-xs text-zinc-500">Save state at every step to allow debugging and resumption.</div>
                                        </div>
                                        <Switch checked={formData.checkpointing} onCheckedChange={(c) => updateField('checkpointing', c)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-zinc-200">Human-in-the-Loop (HITL)</div>
                                            <div className="text-xs text-zinc-500">Require approval before sensitive actions (interrupt).</div>
                                        </div>
                                        <Switch checked={formData.humanInTheLoop} onCheckedChange={(c) => updateField('humanInTheLoop', c)} />
                                    </div>
                                </div>

                                <div className="grid gap-2">
                                    <Label className="text-zinc-400">Persistence Layer</Label>
                                    <Select value={formData.persistence} onValueChange={(v) => updateField('persistence', v)}>
                                        <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="postgres">PostgreSQL (Recommended)</SelectItem>
                                            <SelectItem value="redis">Redis (Fast ephemeral)</SelectItem>
                                            <SelectItem value="memory">In-Memory (Dev only)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Global State Schema</Label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {['Default', 'Minimal', 'Chat History', 'Custom'].map(schema => (
                                            <div key={schema} className="cursor-pointer p-2 rounded border border-zinc-800 text-center text-xs hover:bg-zinc-900 text-zinc-300">
                                                {schema}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-400">
                                    <div className="text-cyan-400 mb-2">// State Interface</div>
                                    <pre>{`interface GraphState {
  messages: BaseMessage[];
  user_input: string;
  artifacts: Record<string, any>;
  next_step: string;
}`}</pre>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-6 border border-zinc-800 bg-zinc-900/20 rounded-xl text-center space-y-4">
                                    <div className="size-16 rounded-full bg-cyan-500/10 border border-cyan-500/20 mx-auto flex items-center justify-center">
                                        <Workflow className="size-8 text-cyan-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                                        <p className="text-sm text-zinc-500 capitalize">{formData.pattern} Architecture</p>
                                    </div>
                                    <div className="flex items-center justify-center gap-4 text-xs">
                                        <Badge variant="outline" className={cn("border-zinc-700", formData.checkpointing ? "text-emerald-400 bg-emerald-500/10" : "text-zinc-500")}>
                                            {formData.checkpointing ? 'Checkpointing ON' : 'Checkpointing OFF'}
                                        </Badge>
                                        <Badge variant="outline" className={cn("border-zinc-700", formData.humanInTheLoop ? "text-amber-400 bg-amber-500/10" : "text-zinc-500")}>
                                            {formData.humanInTheLoop ? 'HITL Enabled' : 'Autonomous'}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                    <Button variant="ghost" onClick={step === 1 ? onClose : handleBack} className="text-zinc-400 hover:text-zinc-200">
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    {step < 4 ? (
                        <Button onClick={handleNext} disabled={!formData.name} className="bg-zinc-100 hover:bg-white text-zinc-900">
                            Next Step <ArrowRight className="size-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleFinish} className="bg-cyan-600 hover:bg-cyan-500 text-white shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                            Generate Graph <Zap className="size-4 ml-2 fill-current" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}