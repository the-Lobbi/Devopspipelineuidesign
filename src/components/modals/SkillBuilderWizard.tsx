import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { WizardLayout } from '../wizards/WizardLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Box, FileText } from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

interface SkillBuilderWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { id: 'identity', title: 'Identity', description: 'Define skill metadata' },
    { id: 'blueprint', title: 'Blueprint', description: 'Instructional guide' },
    { id: 'logic', title: 'Logic', description: 'Code and dependencies' },
    { id: 'review', title: 'Review', description: 'Verify and publish' }
];

export function SkillBuilderWizard({ isOpen, onClose }: SkillBuilderWizardProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        instruction: '# Skill Instructions\n\n1. Step one...',
        code: '',
        dependencies: [] as string[]
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleNext = () => { if (step < STEPS.length - 1) setStep(step + 1); };
    const handleBack = () => { if (step > 0) setStep(step - 1); };
    
    const handleFinish = () => {
        toast.success("Skill Created", {
            description: `${formData.name} is now available for agents.`
        });
        onClose();
        setStep(0);
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[650px] p-0 bg-zinc-950 border-zinc-800 overflow-hidden">
                <WizardLayout
                    title="Create Agent Skill"
                    description="Teach agents new capabilities with instructional blueprints."
                    steps={STEPS}
                    currentStep={step}
                    onStepClick={setStep}
                    onNext={handleNext}
                    onBack={handleBack}
                    onFinish={handleFinish}
                    isNextDisabled={step === 0 && !formData.name}
                    className="min-h-0 h-full border-none shadow-none rounded-none bg-transparent"
                >
                    <div className="space-y-6">
                        {step === 0 && (
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

                        {step === 1 && (
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

                        {step === 2 && (
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

                        {step === 3 && (
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
                </WizardLayout>
            </DialogContent>
        </Dialog>
    );
}
