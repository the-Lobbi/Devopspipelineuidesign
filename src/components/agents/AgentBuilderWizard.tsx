import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { Slider } from '../ui/slider';
import { cn } from '../../lib/utils';
import { 
    Bot, ArrowRight, Check, Terminal, Brain, Sparkles, 
    Shield, Search, Server, Zap, Box
} from 'lucide-react';
import { toast } from 'sonner';

interface AgentBuilderWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (agentData: any) => void;
}

const ROLES = [
    { id: 'coder', label: 'Coder', icon: Terminal, desc: 'Specialized in writing and debugging code' },
    { id: 'qa', label: 'QA / Test', icon: Shield, desc: 'Focuses on verification and testing scenarios' },
    { id: 'reviewer', label: 'Reviewer', icon: Search, desc: 'Analyzes content for quality and compliance' },
    { id: 'devops', label: 'DevOps', icon: Server, desc: 'Manages infrastructure and deployment pipelines' },
    { id: 'planner', label: 'Planner', icon: Brain, desc: 'Breaks down complex tasks into sub-steps' },
];

const MOCK_TOOLS = [
    { id: 'git-suite', name: 'Git Suite', category: 'devops' },
    { id: 'jira-api', name: 'Jira Connector', category: 'integration' },
    { id: 'fs-access', name: 'File System', category: 'system' },
    { id: 'web-search', name: 'Web Search', category: 'network' },
    { id: 'docker-ops', name: 'Docker Ops', category: 'devops' },
];

export function AgentBuilderWizard({ isOpen, onClose, onComplete }: AgentBuilderWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        role: 'coder',
        description: '',
        model: 'gpt-4-turbo',
        temperature: 0.7,
        systemPrompt: '',
        tools: [] as string[],
    });

    const handleNext = () => {
        if (step < 4) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleFinish = () => {
        onComplete({
            ...formData,
            status: 'idle',
            activity: 'Provisioned via Wizard',
            x: 400,
            y: 300
        });
        onClose();
        setStep(1);
        toast.success("Agent Provisioned", {
            description: `${formData.name} is ready for assignment.`
        });
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const toggleTool = (toolId: string) => {
        setFormData(prev => ({
            ...prev,
            tools: prev.tools.includes(toolId) 
                ? prev.tools.filter(t => t !== toolId)
                : [...prev.tools, toolId]
        }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent aria-describedby={undefined} className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[700px] h-[650px] p-0 gap-0 flex flex-col overflow-hidden">
                {/* Wizard Header */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <Bot className="size-4 text-violet-400" />
                            Agent Provisioning Wizard
                        </DialogTitle>
                        <div className="text-xs font-mono text-zinc-500">
                            STEP {step} OF 4
                        </div>
                    </div>

                    {/* Progress Steps */}
                    <div className="relative flex items-center justify-between px-4">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-800 -z-10" />
                        <div 
                            className="absolute left-0 top-1/2 h-0.5 bg-violet-500 -z-10 transition-all duration-500" 
                            style={{ width: `${((step - 1) / 3) * 100}%` }} 
                        />
                        
                        {[
                            { n: 1, label: 'Persona' }, 
                            { n: 2, label: 'Intelligence' }, 
                            { n: 3, label: 'Capabilities' }, 
                            { n: 4, label: 'Confirm' }
                        ].map((s) => (
                            <div key={s.n} className="flex flex-col items-center gap-2 bg-zinc-950 px-2">
                                <div className={cn(
                                    "size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                    step >= s.n 
                                        ? "bg-violet-500 border-violet-500 text-white" 
                                        : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                )}>
                                    {step > s.n ? <Check className="size-4" /> : s.n}
                                </div>
                                <span className={cn(
                                    "text-[10px] uppercase font-bold tracking-wider transition-colors",
                                    step >= s.n ? "text-violet-400" : "text-zinc-600"
                                )}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <ScrollArea className="flex-1 bg-[#09090b]">
                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Agent Name</Label>
                                        <Input 
                                            value={formData.name}
                                            onChange={(e) => updateField('name', e.target.value)}
                                            className="bg-zinc-900 border-zinc-800" 
                                            placeholder="e.g. Lead Security Auditor" 
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Description</Label>
                                        <Textarea 
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 min-h-[80px]" 
                                            placeholder="Briefly describe this agent's purpose..." 
                                        />
                                    </div>
                                    
                                    <div className="grid gap-3">
                                        <Label className="text-zinc-400">Functional Role</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {ROLES.map(role => (
                                                <div 
                                                    key={role.id}
                                                    onClick={() => updateField('role', role.id)}
                                                    className={cn(
                                                        "cursor-pointer p-3 rounded-lg border flex items-center gap-3 transition-all",
                                                        formData.role === role.id 
                                                            ? "border-violet-500 bg-violet-500/10 text-violet-100" 
                                                            : "border-zinc-800 bg-zinc-900/30 text-zinc-400 hover:border-zinc-700"
                                                    )}
                                                >
                                                    <div className={cn("p-2 rounded-md bg-zinc-950", formData.role === role.id ? "text-violet-400" : "text-zinc-600")}>
                                                        <role.icon className="size-4" />
                                                    </div>
                                                    <div>
                                                        <div className="text-sm font-bold">{role.label}</div>
                                                        <div className="text-[10px] opacity-70">{role.desc}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Foundation Model</Label>
                                        <Select value={formData.model} onValueChange={(val) => updateField('model', val)}>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800 h-10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                <SelectItem value="gpt-4-turbo">GPT-4 Turbo (OpenAI)</SelectItem>
                                                <SelectItem value="claude-3-opus">Claude 3 Opus (Anthropic)</SelectItem>
                                                <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet (Anthropic)</SelectItem>
                                                <SelectItem value="llama-3-70b">Llama 3 70B (Local/Groq)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-3 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-zinc-400">Creativity (Temperature)</Label>
                                            <span className="font-mono text-xs text-zinc-300">{formData.temperature}</span>
                                        </div>
                                        <Slider 
                                            value={[formData.temperature]} 
                                            max={1} 
                                            step={0.1} 
                                            onValueChange={([val]) => updateField('temperature', val)}
                                            className="[&_.bg-primary]:bg-violet-500"
                                        />
                                        <div className="flex justify-between text-[10px] text-zinc-500 uppercase tracking-wider">
                                            <span>Precise</span>
                                            <span>Balanced</span>
                                            <span>Creative</span>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">System Prompt</Label>
                                        <div className="relative">
                                            <Sparkles className="absolute top-3 right-3 size-4 text-violet-500 opacity-50" />
                                            <Textarea 
                                                value={formData.systemPrompt}
                                                onChange={(e) => updateField('systemPrompt', e.target.value)}
                                                className="bg-zinc-950 border-zinc-800 min-h-[150px] font-mono text-xs leading-relaxed"
                                                placeholder={`You are an expert ${formData.role}...`} 
                                                defaultValue={`You are an expert ${formData.role} responsible for executing high-reliability tasks in a DevOps pipeline.`}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-zinc-400">Active Toolset</Label>
                                    <Badge variant="outline" className="bg-zinc-900 border-zinc-800 text-zinc-500">{formData.tools.length} selected</Badge>
                                </div>

                                <div className="grid gap-3">
                                    {MOCK_TOOLS.map(tool => (
                                        <div 
                                            key={tool.id}
                                            onClick={() => toggleTool(tool.id)}
                                            className={cn(
                                                "cursor-pointer p-3 rounded-lg border flex items-center justify-between transition-all",
                                                formData.tools.includes(tool.id)
                                                    ? "border-emerald-500/50 bg-emerald-500/10" 
                                                    : "border-zinc-800 bg-zinc-900/30 hover:border-zinc-700"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={cn(
                                                    "size-8 rounded flex items-center justify-center border",
                                                    formData.tools.includes(tool.id) ? "bg-emerald-500/20 border-emerald-500/30 text-emerald-400" : "bg-zinc-900 border-zinc-800 text-zinc-600"
                                                )}>
                                                    <Box className="size-4" />
                                                </div>
                                                <div>
                                                    <div className={cn("text-sm font-medium", formData.tools.includes(tool.id) ? "text-emerald-100" : "text-zinc-300")}>{tool.name}</div>
                                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider">{tool.category}</div>
                                                </div>
                                            </div>
                                            <Switch checked={formData.tools.includes(tool.id)} className="pointer-events-none data-[state=checked]:bg-emerald-500" />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex flex-col items-center text-center mb-6">
                                    <div className="size-20 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mb-4 shadow-2xl relative">
                                        <div className="absolute inset-0 rounded-2xl bg-violet-500/20 blur-xl" />
                                        <Bot className="size-10 text-violet-400 relative z-10" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                                    <p className="text-sm text-zinc-400 mt-1">{formData.role.toUpperCase()} • {formData.model}</p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Capabilities</div>
                                        <div className="flex flex-wrap gap-2">
                                            {formData.tools.length > 0 ? formData.tools.map(t => (
                                                <Badge key={t} variant="secondary" className="bg-zinc-950 border-zinc-800 text-zinc-400 text-[10px]">{t}</Badge>
                                            )) : <span className="text-xs text-zinc-600 italic">No tools assigned</span>}
                                        </div>
                                    </div>
                                    <div className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800 space-y-2">
                                        <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold">Configuration</div>
                                        <div className="space-y-1 text-xs text-zinc-400 font-mono">
                                            <div className="flex justify-between"><span>Temp:</span> <span className="text-zinc-200">{formData.temperature}</span></div>
                                            <div className="flex justify-between"><span>Ctx:</span> <span className="text-zinc-200">128k</span></div>
                                            <div className="flex justify-between"><span>Mode:</span> <span className="text-zinc-200">Auto</span></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/30">
                                    <div className="text-[10px] text-zinc-500 uppercase tracking-wider font-bold mb-2">System Persona Preview</div>
                                    <div className="font-mono text-xs text-zinc-400 line-clamp-3 leading-relaxed">
                                        {formData.systemPrompt || "No system prompt defined."}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer Controls */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                    <Button 
                        variant="ghost" 
                        onClick={step === 1 ? onClose : handleBack}
                        className="text-zinc-400 hover:text-zinc-200"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    
                    {step < 4 ? (
                        <Button 
                            onClick={handleNext}
                            disabled={!formData.name}
                            className="bg-zinc-100 hover:bg-white text-zinc-900"
                        >
                            Next Step <ArrowRight className="size-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleFinish}
                            className="bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        >
                            Deploy Agent <Zap className="size-4 ml-2 fill-current" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}