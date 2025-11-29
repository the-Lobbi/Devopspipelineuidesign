import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { Card } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Brain, Shield, Zap, Bot, Code, MessageSquare, Database } from 'lucide-react';
import { toast } from 'sonner';

// Types
interface AgentFormData {
  name: string;
  role: string;
  description: string;
  model: string;
  temperature: number;
  contextWindow: number;
  tools: string[];
  permissions: {
    canReadCode: boolean;
    canWriteCode: boolean;
    canExecuteCommands: boolean;
    canAccessInternet: boolean;
  };
  knowledgeBases: string[];
}

const INITIAL_DATA: AgentFormData = {
  name: '',
  role: 'Developer',
  description: '',
  model: 'gpt-4-turbo',
  temperature: 0.7,
  contextWindow: 128000,
  tools: [],
  permissions: {
    canReadCode: true,
    canWriteCode: false,
    canExecuteCommands: false,
    canAccessInternet: false,
  },
  knowledgeBases: [],
};

const STEPS = [
  { id: 'identity', title: 'Identity', description: 'Define the agent persona and role.' },
  { id: 'intelligence', title: 'Intelligence', description: 'Configure the LLM and reasoning parameters.' },
  { id: 'capabilities', title: 'Capabilities', description: 'Select tools and permissions.' },
  { id: 'knowledge', title: 'Knowledge', description: 'Connect knowledge bases and data sources.' },
  { id: 'review', title: 'Review', description: 'Verify and create the agent.' },
];

export function AgentCreationWizard({ onCancel, onComplete }: { onCancel: () => void; onComplete: (data: AgentFormData) => void }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<AgentFormData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field: keyof AgentFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updatePermission = (key: keyof AgentFormData['permissions'], value: boolean) => {
    setFormData((prev) => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: value },
    }));
  };

  const toggleTool = (toolId: string) => {
    setFormData((prev) => {
      const tools = prev.tools.includes(toolId)
        ? prev.tools.filter((t) => t !== toolId)
        : [...prev.tools, toolId];
      return { ...prev, tools };
    });
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
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    toast.success('Agent created successfully');
    setIsSubmitting(false);
    onComplete(formData);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Identity
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Agent Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., CodeArchitect-Alpha"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  className="bg-white/5 border-white/10 focus:border-amber-400/50"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Primary Role</Label>
                <Select value={formData.role} onValueChange={(v) => updateField('role', v)}>
                  <SelectTrigger className="bg-white/5 border-white/10">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Developer">Developer</SelectItem>
                    <SelectItem value="Architect">Architect</SelectItem>
                    <SelectItem value="QA Engineer">QA Engineer</SelectItem>
                    <SelectItem value="Product Manager">Product Manager</SelectItem>
                    <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description & Persona</Label>
              <Textarea
                id="description"
                placeholder="Describe the agent's personality, specialized knowledge, and behavior patterns..."
                className="min-h-[150px] bg-white/5 border-white/10 focus:border-amber-400/50 resize-none"
                value={formData.description}
                onChange={(e) => updateField('description', e.target.value)}
              />
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
              <div className="flex items-center gap-3 text-amber-400 mb-2">
                <Bot className="h-5 w-5" />
                <h4 className="font-medium">Pro Tip</h4>
              </div>
              <p className="text-sm text-amber-200/70">
                Specific personas yield better results. Instead of "a generic helper", try "a senior React performance specialist who prefers functional patterns."
              </p>
            </div>
          </div>
        );

      case 1: // Intelligence
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <Label>Model Architecture</Label>
                <div className="grid gap-3">
                  {['gpt-4-turbo', 'claude-3-opus', 'llama-3-70b'].map((model) => (
                    <div
                      key={model}
                      onClick={() => updateField('model', model)}
                      className={`cursor-pointer rounded-lg border p-4 transition-all ${
                        formData.model === model
                          ? 'border-amber-500 bg-amber-500/10 shadow-[0_0_10px_rgba(245,158,11,0.1)]'
                          : 'border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-white">{model}</span>
                        {formData.model === model && <Brain className="h-4 w-4 text-amber-400" />}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Temperature (Creativity)</Label>
                    <span className="text-sm text-muted-foreground">{formData.temperature}</span>
                  </div>
                  <Slider
                    value={[formData.temperature]}
                    min={0}
                    max={1}
                    step={0.1}
                    onValueChange={([val]) => updateField('temperature', val)}
                    className="py-4"
                  />
                  <p className="text-xs text-muted-foreground">
                    Lower values are more deterministic, higher values are more creative.
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Label>Context Window</Label>
                    <span className="text-sm text-muted-foreground">{formData.contextWindow.toLocaleString()} tokens</span>
                  </div>
                  <Slider
                    value={[formData.contextWindow]}
                    min={4096}
                    max={200000}
                    step={1000}
                    onValueChange={([val]) => updateField('contextWindow', val)}
                    className="py-4"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Capabilities
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-white">Permissions</Label>
              <div className="grid gap-4 md:grid-cols-2">
                <Card className="p-4 bg-white/5 border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-500/20 text-blue-400">
                      <Code className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Read Codebase</h4>
                      <p className="text-xs text-muted-foreground">Allow analyzing source files</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.permissions.canReadCode}
                    onCheckedChange={(c) => updatePermission('canReadCode', c)}
                  />
                </Card>

                <Card className="p-4 bg-white/5 border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-red-500/20 text-red-400">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Write Code</h4>
                      <p className="text-xs text-muted-foreground">Allow modifying source files</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.permissions.canWriteCode}
                    onCheckedChange={(c) => updatePermission('canWriteCode', c)}
                  />
                </Card>

                <Card className="p-4 bg-white/5 border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-purple-500/20 text-purple-400">
                      <Shield className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Execute Commands</h4>
                      <p className="text-xs text-muted-foreground">Run shell commands</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.permissions.canExecuteCommands}
                    onCheckedChange={(c) => updatePermission('canExecuteCommands', c)}
                  />
                </Card>

                <Card className="p-4 bg-white/5 border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-emerald-500/20 text-emerald-400">
                      <Database className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="font-medium text-white">Access Internet</h4>
                      <p className="text-xs text-muted-foreground">Fetch external data</p>
                    </div>
                  </div>
                  <Switch
                    checked={formData.permissions.canAccessInternet}
                    onCheckedChange={(c) => updatePermission('canAccessInternet', c)}
                  />
                </Card>
              </div>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-white">Tools</Label>
              <div className="grid gap-3 md:grid-cols-3">
                {['Git Integration', 'Jira Connector', 'Slack Notifier', 'Postgres Client', 'Docker Control', 'AWS SDK'].map((tool) => (
                  <div
                    key={tool}
                    onClick={() => toggleTool(tool)}
                    className={`cursor-pointer rounded-md border p-3 text-sm transition-colors ${
                      formData.tools.includes(tool)
                        ? 'border-amber-500 bg-amber-500/10 text-amber-100'
                        : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${formData.tools.includes(tool) ? 'bg-amber-500' : 'bg-zinc-600'}`} />
                      {tool}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3: // Knowledge
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="text-center py-12 border-2 border-dashed border-white/10 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
              <Database className="h-12 w-12 text-zinc-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-white">Connect Knowledge Base</h3>
              <p className="text-zinc-400 max-w-sm mx-auto mt-2">
                Upload documents, connect repositories, or link vector databases to ground this agent's responses.
              </p>
              <Button variant="outline" className="mt-6 border-amber-500/50 text-amber-400 hover:bg-amber-500/10">
                Add Source
              </Button>
            </div>
            
             <div className="space-y-2">
                <Label>Connected Sources</Label>
                <div className="rounded-lg border border-white/10 bg-black/20 p-4 text-sm text-zinc-500 text-center italic">
                    No knowledge sources connected yet.
                </div>
             </div>
          </div>
        );

      case 4: // Review
        return (
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            <div className="rounded-xl border border-white/10 bg-white/5 p-6 space-y-6">
              <div className="flex items-center gap-4 pb-6 border-b border-white/10">
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-2xl font-bold text-white shadow-lg">
                  {formData.name.charAt(0) || <Bot />}
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">{formData.name || 'Unnamed Agent'}</h2>
                  <p className="text-amber-400">{formData.role}</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">Model Configuration</h4>
                  <div className="space-y-1">
                    <p className="text-white"><span className="text-zinc-400">Model:</span> {formData.model}</p>
                    <p className="text-white"><span className="text-zinc-400">Temp:</span> {formData.temperature}</p>
                    <p className="text-white"><span className="text-zinc-400">Context:</span> {formData.contextWindow}</p>
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-zinc-500 mb-2">Permissions</h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(formData.permissions).map(([key, value]) => (
                      value && (
                        <span key={key} className="px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs border border-emerald-500/20">
                            {key.replace('can', '')}
                        </span>
                      )
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-zinc-500 mb-2">Tools</h4>
                <div className="flex flex-wrap gap-2">
                    {formData.tools.length > 0 ? (
                        formData.tools.map(tool => (
                            <span key={tool} className="px-2 py-1 rounded-md bg-white/10 text-white text-xs">
                                {tool}
                            </span>
                        ))
                    ) : (
                        <span className="text-zinc-500 text-sm italic">No tools selected</span>
                    )}
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
      title="Create New Agent"
      description="Design a specialized AI agent with specific roles, capabilities, and knowledge."
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
