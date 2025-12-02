import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { WizardLayout } from '../wizards/WizardLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Switch } from '../ui/switch';
import { cn } from '../../lib/utils';
import { 
    Database, BarChart, Plus
} from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

interface KnowledgeBaseWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const STEPS = [
    { id: 'source', title: 'Source', description: 'Connect data source' },
    { id: 'storage', title: 'Storage', description: 'Vector database config' },
    { id: 'strategy', title: 'Strategy', description: 'Indexing & retrieval' },
    { id: 'review', title: 'Review', description: 'Verify settings' }
];

export function KnowledgeBaseWizard({ isOpen, onClose }: KnowledgeBaseWizardProps) {
    const [step, setStep] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        sourceType: 'confluence',
        sourceUrl: '',
        chunkSize: 1000,
        chunkOverlap: 200,
        vectorStore: 'pinecone',
        embeddingModel: 'text-embedding-3-small',
        hybridSearch: true,
    });

    const handleNext = () => { if (step < STEPS.length - 1) setStep(step + 1); };
    const handleBack = () => { if (step > 0) setStep(step - 1); };
    
    const handleFinish = () => {
        toast.success("Knowledge Base Created", {
            description: "Indexing pipeline has been scheduled."
        });
        onClose();
        setStep(0);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[600px] p-0 bg-zinc-950 border-zinc-800 overflow-hidden">
                <WizardLayout
                    title="Create Knowledge Base"
                    description="Connect external data for agent context."
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
                                        <Label className="text-zinc-400">Knowledge Base Name</Label>
                                        <Input 
                                            value={formData.name} 
                                            onChange={(e) => updateField('name', e.target.value)} 
                                            className="bg-zinc-900 border-zinc-800"
                                            placeholder="e.g. Engineering Docs"
                                        />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Source Type</Label>
                                        <Select value={formData.sourceType} onValueChange={(v) => updateField('sourceType', v)}>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                <SelectItem value="confluence">Confluence Space</SelectItem>
                                                <SelectItem value="github">GitHub Repository</SelectItem>
                                                <SelectItem value="pdf">PDF Documents</SelectItem>
                                                <SelectItem value="web">Website Crawler</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Source URL / Path</Label>
                                        <Input 
                                            value={formData.sourceUrl} 
                                            onChange={(e) => updateField('sourceUrl', e.target.value)} 
                                            className="bg-zinc-900 border-zinc-800 font-mono text-xs"
                                            placeholder={formData.sourceType === 'confluence' ? 'https://wiki.company.com/spaces/ENG' : 'https://github.com/org/repo'}
                                        />
                                    </div>
                                    
                                    <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-4">
                                        <Label className="text-zinc-400">Chunking Strategy</Label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-zinc-500"><span>Size</span><span>{formData.chunkSize} chars</span></div>
                                                <Slider value={[formData.chunkSize]} max={4000} step={100} onValueChange={([v]) => updateField('chunkSize', v)} className="[&_.bg-primary]:bg-emerald-500" />
                                            </div>
                                            <div className="space-y-2">
                                                <div className="flex justify-between text-xs text-zinc-500"><span>Overlap</span><span>{formData.chunkOverlap} chars</span></div>
                                                <Slider value={[formData.chunkOverlap]} max={500} step={10} onValueChange={([v]) => updateField('chunkOverlap', v)} className="[&_.bg-primary]:bg-emerald-500" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 1 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="space-y-4">
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Vector Database</Label>
                                        <div className="grid grid-cols-2 gap-3">
                                            {['pinecone', 'weaviate', 'redis', 'milvus'].map((db) => (
                                                <div 
                                                    key={db} 
                                                    onClick={() => updateField('vectorStore', db)}
                                                    className={cn(
                                                        "cursor-pointer p-3 rounded border text-center capitalize transition-all",
                                                        formData.vectorStore === db ? "border-emerald-500 bg-emerald-500/10 text-emerald-100" : "border-zinc-800 bg-zinc-900/30 text-zinc-400"
                                                    )}
                                                >
                                                    {db}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="grid gap-2">
                                        <Label className="text-zinc-400">Embedding Model</Label>
                                        <Select value={formData.embeddingModel} onValueChange={(v) => updateField('embeddingModel', v)}>
                                            <SelectTrigger className="bg-zinc-900 border-zinc-800"><SelectValue /></SelectTrigger>
                                            <SelectContent className="bg-zinc-900 border-zinc-800">
                                                <SelectItem value="text-embedding-3-small">OpenAI v3 Small (Cost Effective)</SelectItem>
                                                <SelectItem value="text-embedding-3-large">OpenAI v3 Large (High Precision)</SelectItem>
                                                <SelectItem value="cohere-embed-v3">Cohere v3 (Multilingual)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 2 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-4 border border-zinc-800 rounded-lg bg-zinc-900/20 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-zinc-200">Hybrid Search</div>
                                            <div className="text-xs text-zinc-500">Combine vector similarity with keyword matching</div>
                                        </div>
                                        <Switch checked={formData.hybridSearch} onCheckedChange={(c) => updateField('hybridSearch', c)} />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <div className="text-sm font-bold text-zinc-200">Semantic Reranking</div>
                                            <div className="text-xs text-zinc-500">Re-order results for higher relevance</div>
                                        </div>
                                        <Switch defaultChecked />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Evaluation Metrics (LangSmith)</Label>
                                    <div className="flex gap-2">
                                        {['Faithfulness', 'Answer Relevance', 'Context Recall'].map(m => (
                                            <Badge key={m} variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 font-normal">{m}</Badge>
                                        ))}
                                        <Button variant="ghost" size="sm" className="h-5 px-2 text-xs text-emerald-500"><Plus className="size-3 mr-1"/> Add</Button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {step === 3 && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="p-6 border border-zinc-800 bg-zinc-900/20 rounded-xl text-center space-y-4">
                                    <div className="size-16 rounded-full bg-zinc-800 mx-auto flex items-center justify-center">
                                        <Database className="size-8 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-bold text-white">{formData.name}</h3>
                                        <p className="text-sm text-zinc-500">{formData.sourceType} • {formData.vectorStore}</p>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs border-t border-zinc-800 pt-4">
                                        <div>
                                            <div className="text-zinc-500 uppercase tracking-wider font-bold mb-1">Chunk</div>
                                            <div className="font-mono text-zinc-300">{formData.chunkSize}</div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-500 uppercase tracking-wider font-bold mb-1">Embed</div>
                                            <div className="font-mono text-zinc-300">{formData.embeddingModel.split('-')[2]}</div>
                                        </div>
                                        <div>
                                            <div className="text-zinc-500 uppercase tracking-wider font-bold mb-1">Search</div>
                                            <div className="font-mono text-zinc-300">{formData.hybridSearch ? 'Hybrid' : 'Vector'}</div>
                                        </div>
                                    </div>
                                </div>
                                <Button className="w-full bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-400">
                                    <BarChart className="size-4 mr-2" /> View Evaluation Pipeline Config
                                </Button>
                            </div>
                        )}
                    </div>
                </WizardLayout>
            </DialogContent>
        </Dialog>
    );
}
