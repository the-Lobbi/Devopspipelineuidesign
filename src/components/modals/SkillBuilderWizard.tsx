import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
    GraduationCap, ArrowRight, Check, BookOpen, Code, 
    Layers, Zap, FileText, Box
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SkillBuilderWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function SkillBuilderWizard({ isOpen, onClose }: SkillBuilderWizardProps) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        instruction: '# Skill Instructions\n\n1. Step one...',
        code: '',
        dependencies: [] as string[]
    });

    const handleNext = () => { if (step < 4) setStep(step + 1); };
    const handleBack = () => { if (step > 1) setStep(step - 1); };
    
    const handleFinish = () => {
        toast.success("Skill Created", {
            description: `${formData.name} is now available for agents.`
        });
        onClose();
        setStep(1);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[700px] h-[650px] p-0 gap-0 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <GraduationCap className="size-4 text-amber-400" />
                            Create Agent Skill
                        </DialogTitle>
                        <div className="text-xs font-mono text-zinc-500">STEP {step} OF 4</div>
                    </div>

                    <div className="relative flex items-center justify-between px-4">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-800 -z-10" />
                        <div className="absolute left-0 top-1/2 h-0.5 bg-amber-500 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                        {[
                            { n: 1, label: 'Identity' },
                            { n: 2, label: 'Blueprint' },
                            { n: 3, label: 'Logic' },
                            { n: 4, label: 'Review' }
                        ].map((s) => (
                            <div key={s.n} className="flex flex-col items-center gap-2 bg-zinc-950 px-2">
                                <div className={cn(
                                    "size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                    step >= s.n ? "bg-amber-500 border-amber-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                )}>
                                    {step > s.n ? <Check className="size-4" /> : s.n}
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold tracking-wider transition-colors", step >= s.n ? "text-amber-400" : "text-zinc-600")}>{s.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <ScrollArea className="flex-1 bg-[#09090b]">
                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Skill Name</Label>
                                        <Input 
                                            value={formData.name} 
                                            onChange={(e) => updateField('name', e.target.value)} 
                                            className="bg-zinc-900 border-zinc-800"
                                            placeholder="e.g. Incident Triage Protocol"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Description (Trigger)</Label>
                                        <Textarea 
                                            value={formData.description} 
                                            onChange={(e) => updateField('description', e.target.value)} 
                                            className="bg-zinc-900 border-zinc-800 min-h-[100px]"
                                            placeholder="Describe when the agent should use this skill. This text is used for semantic routing."
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Category</Label>
                                        <Select defaultValue="procedure">
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                <SelectItem value="procedure">Standard Procedure (SOP)</SelectItem>
                                                <SelectItem value="analysis">Analysis Method</SelectItem>
                                                <SelectItem value="creative">Creative Strategy</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center justify-between mb-2">
                                    <Label className="text-zinc-400">Instructional Blueprint (SKILL.md)</Label>
                                    <Badge variant="outline" className="text-amber-400 border-amber-500/20 bg-amber-500/10 text-[10px]">MARKDOWN</Badge>
                                </div>
                                <Textarea 
                                    value={formData.instruction} 
                                    onChange={(e) => updateField('instruction', e.target.value)} 
                                    className="bg-zinc-950 border-zinc-800 font-mono text-xs min-h-[300px] leading-relaxed text-zinc-300"
                                    placeholder="# Skill Instructions..."
                                />
                                <p className="text-xs text-zinc-500">
                                    These instructions are loaded into context only when the skill is invoked.
                                </p>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Deterministic Code (Optional)</Label>
                                        <Textarea 
                                            value={formData.code} 
                                            onChange={(e) => updateField('code', e.target.value)} 
                                            className="bg-zinc-950 border-zinc-800 font-mono text-xs min-h-[200px] text-emerald-400"
                                            placeholder="# Python script for reliable execution..."
                                        />
                                    </div>
                                    
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Required Dependencies</Label>
                                        <div className="flex flex-wrap gap-2">
                                            {['Jira MCP', 'GitHub MCP', 'Postgres Tool'].map(tool => (
                                                <div key={tool} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs text-zinc-400 cursor-pointer hover:border-zinc-600">
                                                    <Box className="size-3" /> {tool}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-6 border border-zinc-800 bg-zinc-900/20 rounded-xl space-y-6">
                                    <div className="flex items-start gap-4">
                                        <div className="size-12 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                                            <FileText className="size-6 text-amber-400" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{formData.name}</h3>
                                            <p className="text-sm text-zinc-400 mt-1">{formData.description}</p>
                                        </div>
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Blueprint Preview</div>
                                        <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg font-mono text-xs text-zinc-400 h-[100px] overflow-hidden relative">
                                            {formData.instruction}
                                            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-zinc-950 to-transparent" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </ScrollArea>

                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                    <Button variant="ghost" onClick={step === 1 ? onClose : handleBack} className="text-zinc-400 hover:text-zinc-200">
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    {step < 4 ? (
                        <Button onClick={handleNext} disabled={!formData.name} className="bg-zinc-100 hover:bg-white text-zinc-900">
                            Next Step <ArrowRight className="size-4 ml-2" />
                        </Button>
                    ) : (
                        <Button onClick={handleFinish} className="bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                            Publish Skill <Zap className="size-4 ml-2 fill-current" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}