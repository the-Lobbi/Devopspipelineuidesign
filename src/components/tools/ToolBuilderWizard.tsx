import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { WizardLayout } from '../wizards/WizardLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Switch } from '../ui/switch';
import { cn } from '../../lib/utils';
import { 
    Wrench, Check, Code, Globe, Server, Plus, Trash, Play 
} from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

interface ToolBuilderWizardProps {
    isOpen: boolean;
    onClose: () => void;
    onComplete: (toolData: any) => void;
}

const STEPS = [
    { id: 'identity', title: 'Identity', description: 'Basic tool information' },
    { id: 'type', title: 'Type', description: 'Select implementation type' },
    { id: 'schema', title: 'Schema', description: 'Define input parameters' },
    { id: 'ui', title: 'UI', description: 'Frontend interaction' },
    { id: 'review', title: 'Review', description: 'Verify and create' }
];

export function ToolBuilderWizard({ isOpen, onClose, onComplete }: ToolBuilderWizardProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        id: '',
        description: '',
        category: 'devops',
        type: 'api',
        version: '1.0.0',
        schema: [] as { name: string, type: string, required: boolean, desc: string }[],
        code: '',
        apiEndpoint: '',
        apiMethod: 'GET'
    });

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const addSchemaField = () => {
        setFormData(prev => ({
            ...prev,
            schema: [...prev.schema, { name: '', type: 'string', required: true, desc: '' }]
        }));
    };

    const updateSchemaField = (index: number, field: string, value: any) => {
        const newSchema = [...formData.schema];
        // @ts-ignore
        newSchema[index][field] = value;
        setFormData(prev => ({ ...prev, schema: newSchema }));
    };

    const removeSchemaField = (index: number) => {
        setFormData(prev => ({
            ...prev,
            schema: prev.schema.filter((_, i) => i !== index)
        }));
    };

    const handleNext = () => {
        if (step < STEPS.length - 1) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
    };

    const handleFinish = () => {
        onComplete(formData);
        onClose();
        setStep(0);
        toast.success("Tool Created", {
            description: `${formData.name} has been added to the registry.`
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[650px] p-0 bg-zinc-950 border-zinc-800 overflow-hidden">
                <WizardLayout
                    title="Create New Capability"
                    description="Extending agent capabilities with new tools."
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
                                        <Label className="text-zinc-400">Tool Name</Label>
                                        <Input 
                                            value={formData.name}
                                            onChange={(e) => {
                                                updateField('name', e.target.value);
                                                if (!formData.id) {
                                                    updateField('id', e.target.value.toLowerCase().replace(/\s+/g, '-'));
                                                }
                                            }}
                                            className="bg-zinc-900 border-zinc-800" 
                                            placeholder="e.g. Stripe Payment Processor" 
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="grid gap-2">
                                            <Label className="text-zinc-400">Unique ID</Label>
                                            <Input 
                                                value={formData.id}
                                                onChange={(e) => updateField('id', e.target.value)}
                                                className="bg-zinc-900 border-zinc-800 font-mono text-xs" 
                                                placeholder="stripe-processor" 
                                            />
                                        </div>
                                        <div className="grid gap-2">
                                            <Label className="text-zinc-400">Version</Label>
                                            <Input 
                                                value={formData.version}
                                                onChange={(e) => updateField('version', e.target.value)}
                                                className="bg-zinc-900 border-zinc-800 font-mono text-xs" 
                                                placeholder="1.0.0" 
                                            />
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Description</Label>
                                        <Textarea 
                                            value={formData.description}
                                            onChange={(e) => updateField('description', e.target.value)}
                                            className="bg-zinc-900 border-zinc-800 min-h-[100px]" 
                                            placeholder="Describe what this tool does..." 
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Category</Label>
                                        <Select value={formData.category} onValueChange={(val) => updateField('category', val)}>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                <SelectItem value="devops">DevOps</SelectItem>
                                                <SelectItem value="database">Database</SelectItem>
                                                <SelectItem value="security">Security</SelectItem>
                                                <SelectItem value="network">Network</SelectItem>
                                                <SelectItem value="system">System</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="grid grid-cols-3 gap-4">
                                    {[
                                        { id: 'api', label: 'API Wrapper', icon: Globe, desc: 'Connect to external REST/GraphQL APIs' },
                                        { id: 'script', label: 'Script / Code', icon: Code, desc: 'Run Python or Node.js code sandboxed' },
                                        { id: 'mcp', label: 'MCP Server', icon: Server, desc: 'Connect to a Model Context Protocol server' }
                                    ].map((t) => (
                                        <div 
                                            key={t.id}
                                            onClick={() => updateField('type', t.id)}
                                            className={cn(
                                                "cursor-pointer p-4 rounded-xl border-2 transition-all flex flex-col items-center text-center gap-3 hover:bg-zinc-900",
                                                formData.type === t.id 
                                                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-100" 
                                                    : "border-zinc-800 bg-zinc-900/20 text-zinc-500 hover:border-zinc-700"
                                            )}
                                        >
                                            <t.icon className={cn("size-8", formData.type === t.id ? "text-indigo-400" : "text-zinc-600")} />
                                            <div>
                                                <div className="font-bold text-sm">{t.label}</div>
                                                <div className="text-[10px] opacity-70 leading-tight mt-1">{t.desc}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {formData.type === 'api' && (
                                    <div className="space-y-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                                        <Label className="text-zinc-400">Endpoint Configuration</Label>
                                        <div className="flex gap-2">
                                            <Select value={formData.apiMethod} onValueChange={(v) => updateField('apiMethod', v)}>
                                                <SelectTrigger className="w-[100px] bg-zinc-900 border-zinc-800">
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent className="bg-zinc-900 border-zinc-800">
                                                    <SelectItem value="GET">GET</SelectItem>
                                                    <SelectItem value="POST">POST</SelectItem>
                                                    <SelectItem value="PUT">PUT</SelectItem>
                                                    <SelectItem value="DELETE">DELETE</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <Input 
                                                value={formData.apiEndpoint}
                                                onChange={(e) => updateField('apiEndpoint', e.target.value)}
                                                className="flex-1 bg-zinc-900 border-zinc-800 font-mono text-xs" 
                                                placeholder="https://api.example.com/v1/resource" 
                                            />
                                        </div>
                                    </div>
                                )}

                                {formData.type === 'script' && (
                                    <div className="space-y-4 p-4 border border-zinc-800 rounded-lg bg-zinc-900/20">
                                        <Label className="text-zinc-400">Implementation</Label>
                                        <Textarea 
                                            value={formData.code}
                                            onChange={(e) => updateField('code', e.target.value)}
                                            className="bg-zinc-950 border-zinc-800 font-mono text-xs min-h-[200px] text-emerald-400"
                                            placeholder={`async function run(input) {\n  // Your code here\n  return { success: true };\n}`}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center justify-between">
                                    <Label className="text-zinc-400">Input Schema Definition</Label>
                                    <Button size="sm" variant="outline" onClick={addSchemaField} className="text-xs h-7 border-zinc-700">
                                        <Plus className="size-3 mr-1" /> Add Field
                                    </Button>
                                </div>

                                <div className="space-y-3">
                                    {formData.schema.length === 0 && (
                                        <div className="text-center py-8 text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
                                            No input fields defined. Tool will accept no arguments.
                                        </div>
                                    )}
                                    {formData.schema.map((field, idx) => (
                                        <div key={idx} className="flex items-start gap-3 p-3 bg-zinc-900/30 border border-zinc-800 rounded-lg">
                                            <div className="grid gap-2 flex-1">
                                                <div className="flex gap-2">
                                                    <Input 
                                                        value={field.name} 
                                                        onChange={(e) => updateSchemaField(idx, 'name', e.target.value)}
                                                        className="bg-zinc-950 border-zinc-800 h-8 text-xs" 
                                                        placeholder="field_name" 
                                                    />
                                                    <Select value={field.type} onValueChange={(v) => updateSchemaField(idx, 'type', v)}>
                                                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs w-[120px]">
                                                            <SelectValue />
                                                        </SelectTrigger>
                                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                                            <SelectItem value="string">String</SelectItem>
                                                            <SelectItem value="number">Number</SelectItem>
                                                            <SelectItem value="boolean">Boolean</SelectItem>
                                                            <SelectItem value="array">Array</SelectItem>
                                                            <SelectItem value="object">Object</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                                <Input 
                                                    value={field.desc} 
                                                    onChange={(e) => updateSchemaField(idx, 'desc', e.target.value)}
                                                    className="bg-zinc-950 border-zinc-800 h-8 text-xs" 
                                                    placeholder="Description of this field..." 
                                                />
                                            </div>
                                            <div className="flex flex-col gap-2 pt-1">
                                                <div className="flex items-center gap-2">
                                                    <Switch 
                                                        checked={field.required} 
                                                        onCheckedChange={(c) => updateSchemaField(idx, 'required', c)}
                                                    />
                                                    <span className="text-[10px] text-zinc-500">REQ</span>
                                                </div>
                                                <Button 
                                                    variant="ghost" 
                                                    size="icon" 
                                                    className="h-6 w-6 text-zinc-500 hover:text-red-400 ml-auto"
                                                    onClick={() => removeSchemaField(idx)}
                                                >
                                                    <Trash className="size-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/20 space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex items-center justify-between">
                                            <Label className="text-zinc-400">Frontend Interaction (AG-UI)</Label>
                                            <Badge variant="outline" className="text-[10px] bg-indigo-500/10 text-indigo-400 border-indigo-500/20">OPTIONAL</Badge>
                                        </div>
                                        <p className="text-xs text-zinc-500">
                                            Define how this tool should render when the agent requests user input.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-3 gap-3">
                                        {['form', 'confirmation', 'date-picker'].map((ui) => (
                                            <div key={ui} className="cursor-pointer p-3 rounded border border-zinc-800 bg-zinc-950 hover:bg-zinc-900 text-center">
                                                <div className="text-xs font-mono text-zinc-300 capitalize">{ui.replace('-', ' ')}</div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="space-y-2">
                                        <Label className="text-xs text-zinc-400">JSON Schema Payload</Label>
                                        <Textarea 
                                            className="bg-zinc-950 border-zinc-800 font-mono text-xs min-h-[120px] text-emerald-400"
                                            placeholder={`{\n  "type": "form",\n  "fields": [\n    { "name": "reason", "label": "Justification" }\n  ]\n}`}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 4 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-xl space-y-4">
                                    <div className="flex items-center gap-4">
                                        <div className="size-12 rounded-lg bg-zinc-800 flex items-center justify-center text-indigo-400">
                                            {formData.type === 'api' ? <Globe className="size-6" /> : 
                                             formData.type === 'script' ? <Code className="size-6" /> : 
                                             <Server className="size-6" />}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-white">{formData.name}</h3>
                                            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
                                                <Badge variant="outline" className="bg-zinc-900 border-zinc-700 uppercase">{formData.category}</Badge>
                                                <span>v{formData.version}</span>
                                                <span className="text-zinc-600">•</span>
                                                <span>{formData.type.toUpperCase()}</span>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <p className="text-sm text-zinc-400">{formData.description || "No description provided."}</p>
                                    
                                    <div className="space-y-2">
                                        <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Input Schema</label>
                                        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300">
                                            <pre>{JSON.stringify(formData.schema, null, 2)}</pre>
                                        </div>
                                    </div>

                                    {formData.type === 'api' && (
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Endpoint</label>
                                            <div className="flex items-center gap-2 font-mono text-xs">
                                                <Badge>{formData.apiMethod}</Badge>
                                                <span className="text-zinc-300">{formData.apiEndpoint}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 p-4 border border-dashed border-zinc-800 rounded-lg bg-indigo-500/5 text-indigo-300 text-sm">
                                    <Play className="size-4" />
                                    Ready to test? You can run this tool immediately in the Agent Playground.
                                </div>
                            </div>
                        )}
                    </div>
                </WizardLayout>
            </DialogContent>
        </Dialog>
    );
}
