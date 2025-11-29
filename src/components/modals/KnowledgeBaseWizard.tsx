import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { 
    Database, ArrowRight, Check, Library, Filter, 
    BarChart, Layers, RefreshCw, Plus
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface KnowledgeBaseWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

export function KnowledgeBaseWizard({ isOpen, onClose }: KnowledgeBaseWizardProps) {
    const [step, setStep] = useState(1);
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

    const handleNext = () => { if (step < 4) setStep(step + 1); };
    const handleBack = () => { if (step > 1) setStep(step - 1); };
    
    const handleFinish = () => {
        toast.success("Knowledge Base Created", {
            description: "Indexing pipeline has been scheduled."
        });
        onClose();
        setStep(1);
    };

    const updateField = (field: string, value: any) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[700px] h-[600px] p-0 gap-0 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <Library className="size-4 text-emerald-400" />
                            Create Knowledge Base
                        </DialogTitle>
                        <div className="text-xs font-mono text-zinc-500">STEP {step} OF 4</div>
                    </div>

                    <div className="relative flex items-center justify-between px-4">
                        <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-zinc-800 -z-10" />
                        <div className="absolute left-0 top-1/2 h-0.5 bg-emerald-500 -z-10 transition-all duration-500" style={{ width: `${((step - 1) / 3) * 100}%` }} />
                        {[
                            { n: 1, label: 'Source' },
                            { n: 2, label: 'Storage' },
                            { n: 3, label: 'Strategy' },
                            { n: 4, label: 'Review' }
                        ].map((s) => (
                            <div key={s.n} className="flex flex-col items-center gap-2 bg-zinc-950 px-2">
                                <div className={cn(
                                    "size-8 rounded-full flex items-center justify-center text-xs font-bold border-2 transition-all",
                                    step >= s.n ? "bg-emerald-500 border-emerald-500 text-white" : "bg-zinc-900 border-zinc-800 text-zinc-500"
                                )}>
                                    {step > s.n ? <Check className="size-4" /> : s.n}
                                </div>
                                <span className={cn("text-[10px] uppercase font-bold tracking-wider transition-colors", step >= s.n ? "text-emerald-400" : "text-zinc-600")}>{s.label}</span>
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

                        {step === 2 && (
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

                        {step === 3 && (
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

                        {step === 4 && (
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
                        <Button onClick={handleFinish} className="bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                            Start Indexing <RefreshCw className="size-4 ml-2" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}