import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { cn } from '../../lib/utils';
import { 
    GitMerge, LayoutList, Repeat, Users, Workflow
} from 'lucide-react';
import { toast } from 'sonner';
import { AgentNode, AgentLink } from '../../components/agents/AgentTree';

interface PipelineWizardProps {
    onCancel: () => void;
    onComplete: (nodes: AgentNode[], links: AgentLink[]) => void;
}

const ORCHESTRATION_PATTERNS = [
    { id: 'sequential', label: 'Sequential', icon: GitMerge, desc: 'Linear chain of steps. Best for clear SOPs.' },
    { id: 'hierarchical', label: 'Hierarchical', icon: LayoutList, desc: 'Supervisor delegating to specialized workers.' },
    { id: 'cyclic', label: 'Cyclic / Loop', icon: Repeat, desc: 'Iterative process for refinement or self-correction.' },
    { id: 'chat', label: 'Multi-Agent Chat', icon: Users, desc: 'Dynamic conversation between multiple personas.' },
];

const STEPS = [
    { id: 'architecture', title: 'Architecture', description: 'Choose the structural pattern.' },
    { id: 'settings', title: 'Settings', description: 'Configure execution parameters.' },
    { id: 'state', title: 'State', description: 'Define state management schema.' },
    { id: 'review', title: 'Review', description: 'Verify and generate graph.' },
];

export function PipelineWizard({ onCancel, onComplete }: PipelineWizardProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        pattern: 'sequential',
        checkpointing: true,
        humanInTheLoop: false,
        stateSchema: 'default',
        persistence: 'postgres'
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => {
        if (currentStep === 0 && !formData.name) {
             toast.error("Please name your pipeline");
             return;
        }
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
    };

    const handleFinish = async () => {
        setIsSubmitting(true);
        
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

        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Pipeline Created", {
            description: `Generated new ${formData.pattern} workflow structure.`
        });
        setIsSubmitting(false);
        onComplete(nodes, links);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid gap-2">
                            <Label className="text-zinc-400">Pipeline Name</Label>
                            <Input 
                                value={formData.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                className="bg-white/5 border-white/10 focus:border-cyan-500/50"
                                placeholder="e.g. Daily Code Review"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label className="text-zinc-400">Orchestration Pattern</Label>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {ORCHESTRATION_PATTERNS.map(pat => (
                                    <div 
                                        key={pat.id}
                                        onClick={() => updateField('pattern', pat.id)}
                                        className={cn(
                                            "cursor-pointer p-3 rounded-lg border transition-all hover:bg-white/5",
                                            formData.pattern === pat.id 
                                                ? "border-cyan-500 bg-cyan-500/10 text-cyan-100" 
                                                : "border-white/10 bg-white/5 text-zinc-400"
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
                );

            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-4 border border-white/10 rounded-lg bg-white/5 space-y-4">
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
                                <SelectTrigger className="bg-white/5 border-white/10"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="postgres">PostgreSQL (Recommended)</SelectItem>
                                    <SelectItem value="redis">Redis (Fast ephemeral)</SelectItem>
                                    <SelectItem value="memory">In-Memory (Dev only)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="space-y-2">
                            <Label className="text-zinc-400">Global State Schema</Label>
                            <div className="grid grid-cols-3 gap-3">
                                {['Default', 'Minimal', 'Chat History', 'Custom'].map(schema => (
                                    <div key={schema} className="cursor-pointer p-2 rounded border border-white/10 text-center text-xs hover:bg-white/5 text-zinc-300">
                                        {schema}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 bg-black/40 border border-white/10 rounded-lg font-mono text-xs text-zinc-400">
                            <div className="text-cyan-400 mb-2">// State Interface</div>
                            <pre>{`interface GraphState {
  messages: BaseMessage[];
  user_input: string;
  artifacts: Record<string, any>;
  next_step: string;
}`}</pre>
                        </div>
                    </div>
                );

            case 3:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="p-6 border border-white/10 bg-white/5 rounded-xl text-center space-y-4">
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
                );

            default:
                return null;
        }
    };

    return (
        <WizardLayout
            title="Pipeline Builder"
            description="Create advanced agentic workflows with state management."
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
            isSubmitting={isSubmitting}
        >
            {renderStepContent()}
        </WizardLayout>
    );
}
