import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Users, Network, Share2, AlertTriangle, CheckCircle2 } from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { Card } from '../ui/card';
import { Switch } from '../ui/switch';

// Mock Agents Data
const AVAILABLE_AGENTS = [
  { id: '1', name: 'Architect-Alpha', role: 'Architect', avatar: 'A' },
  { id: '2', name: 'Dev-Beta', role: 'Developer', avatar: 'D' },
  { id: '3', name: 'QA-Gamma', role: 'QA Engineer', avatar: 'Q' },
  { id: '4', name: 'Sec-Delta', role: 'Security', avatar: 'S' },
  { id: '5', name: 'Ops-Epsilon', role: 'DevOps', avatar: 'O' },
];

interface OrchestrationData {
  name: string;
  description: string;
  selectedAgents: string[];
  protocol: 'hierarchical' | 'sequential' | 'broadcast' | 'autonomous';
  managerAgent?: string;
  sharedResources: {
    memory: boolean;
    filesystem: boolean;
    envVars: boolean;
  };
  conflictResolution: 'manager-decides' | 'voting' | 'human-in-loop';
  maxLoops: number;
}

const INITIAL_DATA: OrchestrationData = {
  name: '',
  description: '',
  selectedAgents: [],
  protocol: 'hierarchical',
  sharedResources: {
    memory: true,
    filesystem: false,
    envVars: false,
  },
  conflictResolution: 'manager-decides',
  maxLoops: 10,
};

const STEPS = [
  { id: 'team', title: 'Team Composition', description: 'Select the agents involved in this orchestration.' },
  { id: 'protocol', title: 'Interaction Protocol', description: 'Define how agents communicate and coordinate.' },
  { id: 'resources', title: 'Shared Resources', description: 'Manage access to memory and environment.' },
  { id: 'governance', title: 'Governance', description: 'Set conflict resolution and limits.' },
  { id: 'review', title: 'Review', description: 'Verify orchestration setup.' },
];

export function OrchestrationWizard({ onCancel, onComplete }: { onCancel: () => void; onComplete: (data: OrchestrationData) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<OrchestrationData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof OrchestrationData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const toggleAgent = (agentId: string) => {
    setFormData((prev) => {
      const selected = prev.selectedAgents.includes(agentId)
        ? prev.selectedAgents.filter((id) => id !== agentId)
        : [...prev.selectedAgents, agentId];
      return { ...prev, selectedAgents: selected };
    });
  };

  const updateResource = (key: keyof OrchestrationData['sharedResources'], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      sharedResources: { ...prev.sharedResources, [key]: value },
    }));
  };

  const handleNext = () => {
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
    toast.success('Orchestration flow created');
    setIsSubmitting(false);
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Team
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-2">
              <Label>Orchestration Name</Label>
              <Input
                value={formData.name}
                onChange={(e) => updateField('name', e.target.value)}
                placeholder="e.g., Feature Implementation Squad"
                className="bg-white/5 border-white/10"
              />
            </div>
             <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
                placeholder="What is the purpose of this agent team?"
                className="bg-white/5 border-white/10"
              />
            </div>

            <div className="space-y-3">
              <Label>Select Agents</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {AVAILABLE_AGENTS.map((agent) => {
                  const isSelected = formData.selectedAgents.includes(agent.id);
                  return (
                    <div
                      key={agent.id}
                      onClick={() => toggleAgent(agent.id)}
                      className={`flex items-center gap-4 p-3 rounded-lg border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                          : 'border-white/10 bg-white/5 hover:bg-white/10'
                      }`}
                    >
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center text-white font-bold ${isSelected ? 'bg-amber-600' : 'bg-zinc-700'}`}>
                        {agent.avatar}
                      </div>
                      <div>
                        <p className="font-medium text-white">{agent.name}</p>
                        <p className="text-xs text-zinc-400">{agent.role}</p>
                      </div>
                      {isSelected && <CheckCircle2 className="ml-auto h-5 w-5 text-amber-400" />}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 1: // Protocol
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-4 md:grid-cols-2">
              {[
                {
                  id: 'hierarchical',
                  title: 'Hierarchical',
                  desc: 'One manager agent delegates tasks to subordinates.',
                  icon: Network,
                },
                {
                  id: 'sequential',
                  title: 'Sequential',
                  desc: 'Agents pass context in a predefined chain.',
                  icon: Share2,
                },
                {
                  id: 'broadcast',
                  title: 'Broadcast',
                  desc: 'All agents see all messages and contribute freely.',
                  icon: Users,
                },
                {
                  id: 'autonomous',
                  title: 'Autonomous Swarm',
                  desc: 'Agents self-organize based on task requirements.',
                  icon: AlertTriangle,
                },
              ].map((proto) => (
                <div
                  key={proto.id}
                  onClick={() => updateField('protocol', proto.id)}
                  className={`relative p-6 rounded-xl border cursor-pointer transition-all overflow-hidden group ${
                    formData.protocol === proto.id
                      ? 'border-amber-500 bg-amber-500/5'
                      : 'border-white/10 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${formData.protocol === proto.id ? 'bg-amber-500 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                      <proto.icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className={`font-bold text-lg ${formData.protocol === proto.id ? 'text-white' : 'text-zinc-300'}`}>
                        {proto.title}
                      </h3>
                      <p className="text-sm text-zinc-500 mt-1">{proto.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {formData.protocol === 'hierarchical' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <Label>Select Manager Agent</Label>
                    <Select value={formData.managerAgent} onValueChange={(v) => updateField('managerAgent', v)}>
                        <SelectTrigger className="bg-white/5 border-white/10 mt-2">
                            <SelectValue placeholder="Choose a leader" />
                        </SelectTrigger>
                        <SelectContent>
                            {AVAILABLE_AGENTS.filter(a => formData.selectedAgents.includes(a.id)).map(agent => (
                                <SelectItem key={agent.id} value={agent.id}>{agent.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}
          </div>
        );

      case 2: // Resources
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <Card className="p-6 bg-white/5 border-white/10 space-y-6">
               <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Shared Memory</h4>
                        <p className="text-sm text-zinc-400">Agents share a common context window and history.</p>
                    </div>
                    <Switch checked={formData.sharedResources.memory} onCheckedChange={(c) => updateResource('memory', c)} />
               </div>
               
               <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Shared Filesystem</h4>
                        <p className="text-sm text-zinc-400">Agents can read/write to the same temporary workspace.</p>
                    </div>
                    <Switch checked={formData.sharedResources.filesystem} onCheckedChange={(c) => updateResource('filesystem', c)} />
               </div>

               <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-white">Environment Variables</h4>
                        <p className="text-sm text-zinc-400">Share API keys and secrets across the squad.</p>
                    </div>
                    <Switch checked={formData.sharedResources.envVars} onCheckedChange={(c) => updateResource('envVars', c)} />
               </div>
            </Card>
          </div>
        );
        
      case 3: // Governance
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="space-y-4">
                    <Label>Conflict Resolution Strategy</Label>
                     <div className="grid gap-3">
                        {[
                            { val: 'manager-decides', label: 'Manager Decides', desc: 'The designated leader has final say.' },
                            { val: 'voting', label: 'Democratic Voting', desc: 'Majority vote wins.' },
                            { val: 'human-in-loop', label: 'Human in the Loop', desc: 'Escalate to user for decision.' },
                        ].map(opt => (
                            <div 
                                key={opt.val}
                                onClick={() => updateField('conflictResolution', opt.val)}
                                className={`p-4 border rounded-lg cursor-pointer flex items-center justify-between ${
                                    formData.conflictResolution === opt.val 
                                    ? 'border-amber-500 bg-amber-500/10' 
                                    : 'border-white/10 bg-white/5'
                                }`}
                            >
                                <div>
                                    <p className="font-medium text-white">{opt.label}</p>
                                    <p className="text-xs text-zinc-400">{opt.desc}</p>
                                </div>
                                <div className={`h-4 w-4 rounded-full border ${
                                    formData.conflictResolution === opt.val ? 'border-amber-500 bg-amber-500' : 'border-zinc-600'
                                }`} />
                            </div>
                        ))}
                     </div>
                </div>

                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Label>Max Iteration Loops</Label>
                        <span className="text-zinc-400">{formData.maxLoops}</span>
                    </div>
                    <Input 
                        type="number" 
                        value={formData.maxLoops} 
                        onChange={(e) => updateField('maxLoops', parseInt(e.target.value))}
                        className="bg-white/5 border-white/10"
                    />
                    <p className="text-xs text-muted-foreground">Prevents infinite loops between agents.</p>
                </div>
            </div>
        );

      case 4: // Review
        return (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="rounded-xl border border-white/10 bg-white/5 p-6">
                    <h3 className="text-xl font-bold text-white mb-4">{formData.name}</h3>
                    
                    <div className="grid md:grid-cols-2 gap-8">
                        <div>
                            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Squad</h4>
                            <div className="space-y-2">
                                {formData.selectedAgents.map(id => {
                                    const agent = AVAILABLE_AGENTS.find(a => a.id === id);
                                    return (
                                        <div key={id} className="flex items-center gap-3">
                                            <div className="h-6 w-6 rounded-full bg-zinc-700 flex items-center justify-center text-xs">{agent?.avatar}</div>
                                            <span className="text-white">{agent?.name}</span>
                                            {formData.managerAgent === id && <span className="text-xs bg-amber-500 text-black px-2 rounded-full font-bold">LEADER</span>}
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                        
                        <div>
                            <h4 className="text-sm font-medium text-zinc-500 uppercase tracking-wider mb-3">Configuration</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-zinc-400">Protocol</span>
                                    <span className="text-white capitalize">{formData.protocol}</span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-zinc-400">Shared Memory</span>
                                    <span className={formData.sharedResources.memory ? "text-emerald-400" : "text-red-400"}>
                                        {formData.sharedResources.memory ? "Enabled" : "Disabled"}
                                    </span>
                                </div>
                                <div className="flex justify-between border-b border-white/5 pb-2">
                                    <span className="text-zinc-400">Resolution</span>
                                    <span className="text-white capitalize">{formData.conflictResolution.replace(/-/g, ' ')}</span>
                                </div>
                            </div>
                        </div>
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
      title="Orchestrate Agents"
      description="Define how multiple agents collaborate to solve complex tasks."
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
