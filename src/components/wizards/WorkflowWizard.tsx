import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { Clock, Zap, MousePointer, Plus, Trash2, ArrowRight, Settings, CheckCircle2 } from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { Card } from '../ui/card';

interface WorkflowStep {
  id: string;
  name: string;
  type: 'agent' | 'script' | 'approval' | 'notification';
  config: any;
}

interface WorkflowData {
  name: string;
  triggerType: 'webhook' | 'schedule' | 'manual';
  triggerConfig: any;
  steps: WorkflowStep[];
}

const INITIAL_DATA: WorkflowData = {
  name: '',
  triggerType: 'manual',
  triggerConfig: {},
  steps: [],
};

const STEPS = [
  { id: 'trigger', title: 'Trigger', description: 'What starts this workflow?' },
  { id: 'actions', title: 'Actions', description: 'Define the sequence of steps.' },
  { id: 'config', title: 'Configuration', description: 'Set parameters for each step.' },
  { id: 'review', title: 'Review', description: 'Verify workflow logic.' },
];

export function WorkflowWizard({ onCancel, onComplete }: { onCancel: () => void; onComplete: (data: WorkflowData) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<WorkflowData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof WorkflowData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const addStep = () => {
    const newStep: WorkflowStep = {
      id: crypto.randomUUID(),
      name: `Step ${formData.steps.length + 1}`,
      type: 'agent',
      config: {},
    };
    setFormData((prev) => ({ ...prev, steps: [...prev.steps, newStep] }));
  };

  const removeStep = (id: string) => {
    setFormData((prev) => ({ ...prev, steps: prev.steps.filter((s) => s.id !== id) }));
  };

  const updateStep = (id: string, field: keyof WorkflowStep, value: any) => {
    setFormData((prev) => ({
      ...prev,
      steps: prev.steps.map((s) => (s.id === id ? { ...s, [field]: value } : s)),
    }));
  };

  const handleNext = () => {
    if (currentStep === 1 && formData.steps.length === 0) {
        toast.error("Please add at least one step.");
        return;
    }
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleFinish = async () => {
    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Workflow published');
    setIsSubmitting(false);
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Trigger
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
                <Label>Workflow Name</Label>
                <Input 
                    value={formData.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    placeholder="e.g., Daily Code Review"
                    className="bg-white/5 border-white/10"
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    { id: 'manual', title: 'Manual', icon: MousePointer, desc: 'Triggered by user click' },
                    { id: 'schedule', title: 'Schedule', icon: Clock, desc: 'Runs at specific times' },
                    { id: 'webhook', title: 'Webhook', icon: Zap, desc: 'Triggered by external API' },
                ].map(trigger => (
                    <div
                        key={trigger.id}
                        onClick={() => updateField('triggerType', trigger.id)}
                        className={`p-6 rounded-xl border cursor-pointer flex flex-col items-center text-center gap-3 transition-all ${
                            formData.triggerType === trigger.id
                            ? 'border-amber-500 bg-amber-500/10'
                            : 'border-white/10 bg-white/5 hover:bg-white/10'
                        }`}
                    >
                        <div className={`p-3 rounded-full ${formData.triggerType === trigger.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                            <trigger.icon className="h-6 w-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-white">{trigger.title}</h3>
                            <p className="text-xs text-zinc-500">{trigger.desc}</p>
                        </div>
                    </div>
                ))}
            </div>

            {formData.triggerType === 'schedule' && (
                <div className="p-4 bg-black/30 rounded-lg border border-white/10 animate-in fade-in">
                    <Label>Cron Expression</Label>
                    <Input placeholder="0 9 * * 1-5" className="mt-2 bg-white/5 font-mono" />
                    <p className="text-xs text-muted-foreground mt-1">Run at 09:00 on every day-of-week from Monday through Friday.</p>
                </div>
            )}
             {formData.triggerType === 'webhook' && (
                <div className="p-4 bg-black/30 rounded-lg border border-white/10 animate-in fade-in">
                    <Label>Webhook URL</Label>
                    <div className="flex gap-2 mt-2">
                        <Input value="https://api.goldenarmada.ai/hooks/wh_12345" readOnly className="bg-white/5 font-mono text-muted-foreground" />
                        <Button variant="outline">Copy</Button>
                    </div>
                </div>
            )}
          </div>
        );

      case 1: // Actions
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-white">Workflow Sequence</h3>
                <Button onClick={addStep} size="sm" className="bg-amber-500 text-black hover:bg-amber-400">
                    <Plus className="h-4 w-4 mr-1" /> Add Step
                </Button>
            </div>

            <div className="space-y-4 relative">
                {formData.steps.length === 0 && (
                    <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl">
                        <p className="text-zinc-500">No steps defined. Add one to get started.</p>
                    </div>
                )}

                {formData.steps.map((step, index) => (
                    <div key={step.id} className="relative flex gap-4 items-start group">
                         <div className="flex flex-col items-center mt-2">
                            <div className="h-6 w-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center text-xs text-zinc-300 font-mono">
                                {index + 1}
                            </div>
                            {index < formData.steps.length - 1 && (
                                <div className="w-0.5 h-full bg-zinc-800 my-2 min-h-[40px]" />
                            )}
                         </div>
                         
                         <Card className="flex-1 p-4 bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                            <div className="flex items-start justify-between gap-4">
                                <div className="grid gap-4 flex-1 md:grid-cols-2">
                                    <div className="space-y-1">
                                        <Label className="text-xs">Step Name</Label>
                                        <Input 
                                            value={step.name} 
                                            onChange={(e) => updateStep(step.id, 'name', e.target.value)}
                                            className="h-8 bg-black/20 border-white/10"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <Label className="text-xs">Action Type</Label>
                                        <Select value={step.type} onValueChange={(v) => updateStep(step.id, 'type', v)}>
                                            <SelectTrigger className="h-8 bg-black/20 border-white/10">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="agent">Execute Agent</SelectItem>
                                                <SelectItem value="script">Run Script</SelectItem>
                                                <SelectItem value="approval">Wait for Approval</SelectItem>
                                                <SelectItem value="notification">Send Notification</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <Button 
                                    variant="ghost" 
                                    size="icon" 
                                    onClick={() => removeStep(step.id)}
                                    className="text-zinc-500 hover:text-red-400 -mt-1 -mr-2"
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </div>
                         </Card>
                    </div>
                ))}
            </div>
          </div>
        );

      case 2: // Config
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
             <h3 className="text-lg font-medium text-white mb-4">Configure Steps</h3>
             {formData.steps.map((step, index) => (
                 <Card key={step.id} className="p-6 bg-white/5 border-white/10">
                    <div className="flex items-center gap-3 mb-4 border-b border-white/5 pb-4">
                        <div className="h-6 w-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold">
                            {index + 1}
                        </div>
                        <h4 className="font-medium text-white">{step.name}</h4>
                        <span className="text-xs bg-white/10 px-2 py-1 rounded text-zinc-400 uppercase">{step.type}</span>
                    </div>
                    
                    {/* Dynamic config based on type - Mocked for visual */}
                    {step.type === 'agent' && (
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label>Select Agent</Label>
                                <Select>
                                    <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Choose agent..." /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="1">Architect-Alpha</SelectItem>
                                        <SelectItem value="2">Dev-Beta</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Task Prompt</Label>
                                <Input placeholder="What should the agent do?" className="bg-black/20 border-white/10" />
                            </div>
                        </div>
                    )}
                    
                     {step.type === 'approval' && (
                        <div className="space-y-2">
                            <Label>Approver Role</Label>
                             <Select>
                                <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select role..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="lead">Team Lead</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    {step.type === 'notification' && (
                        <div className="space-y-2">
                            <Label>Channel</Label>
                             <Select>
                                <SelectTrigger className="bg-black/20 border-white/10"><SelectValue placeholder="Select channel..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="slack">Slack</SelectItem>
                                    <SelectItem value="email">Email</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                    
                    {step.type === 'script' && (
                        <div className="p-4 bg-black/40 rounded font-mono text-xs text-zinc-400 border border-white/5">
                            // Script configuration placeholder
                        </div>
                    )}
                 </Card>
             ))}
          </div>
        );

      case 3: // Review
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center">
                <div className="inline-flex items-center justify-center p-4 rounded-full bg-emerald-500/10 text-emerald-400 mb-4">
                    <CheckCircle2 className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Ready to Launch</h2>
                <p className="text-zinc-400">
                    Workflow <span className="text-white font-medium">"{formData.name}"</span> is configured with {formData.steps.length} steps.
                </p>
                
                <div className="mt-8 flex items-center justify-center gap-2">
                    {formData.steps.map((step, i) => (
                        <React.Fragment key={step.id}>
                            <div className="h-2 w-2 rounded-full bg-amber-500" title={step.name} />
                            {i < formData.steps.length - 1 && <div className="h-0.5 w-8 bg-zinc-700" />}
                        </React.Fragment>
                    ))}
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
      title="Create Workflow"
      description="Automate processes with multi-step agentic workflows."
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
