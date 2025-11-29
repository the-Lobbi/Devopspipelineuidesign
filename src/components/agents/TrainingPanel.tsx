import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { ScrollArea } from '../ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Brain, Play, RefreshCw, Upload, FileText, AlertCircle, CheckCircle2, Activity } from 'lucide-react';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';

interface TrainingPanelProps {
    agent: any;
}

export function TrainingPanel({ agent }: TrainingPanelProps) {
    const [isTraining, setIsTraining] = useState(false);
    const [progress, setProgress] = useState(0);
    const [currentEpoch, setCurrentEpoch] = useState(0);
    const [lossHistory, setLossHistory] = useState<number[]>([]);
    
    // Config State
    const [epochs, setEpochs] = useState(10);
    const [batchSize, setBatchSize] = useState("32");
    const [learningRate, setLearningRate] = useState("0.001");

    const canvasRef = useRef<HTMLDivElement>(null);

    const handleStartTraining = () => {
        if (isTraining) return;
        setIsTraining(true);
        setProgress(0);
        setCurrentEpoch(0);
        setLossHistory([2.5]); // Initial high loss
        
        toast.info("Training Job Queued", {
            description: "Initializing GPU cluster for fine-tuning..."
        });
    };

    useEffect(() => {
        if (!isTraining) return;

        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    setIsTraining(false);
                    toast.success("Fine-tuning Complete", {
                        description: "New weights deployed to agent model."
                    });
                    clearInterval(interval);
                    return 100;
                }
                
                // Update Loss
                setLossHistory(history => {
                    const lastLoss = history[history.length - 1];
                    // Simulate loss reduction with some noise
                    const reduction = Math.random() * 0.15;
                    const noise = (Math.random() - 0.5) * 0.05;
                    const newLoss = Math.max(0.1, lastLoss - reduction + noise);
                    return [...history, newLoss];
                });

                return prev + (100 / epochs); // Increment based on epochs
            });

            setCurrentEpoch(prev => Math.min(prev + 1, epochs));

        }, 800);

        return () => clearInterval(interval);
    }, [isTraining, epochs]);

    // Render Loss Chart
    const renderChart = () => {
        if (lossHistory.length < 2) return null;
        
        const height = 120;
        const width = 300;
        const maxLoss = Math.max(...lossHistory, 2.5);
        
        const points = lossHistory.map((loss, i) => {
            const x = (i / (epochs)) * width; // Scale x to total epochs roughly
            const y = height - ((loss / maxLoss) * height);
            return `${x},${y}`;
        }).join(' ');

        return (
            <svg width="100%" height="100%" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
                {/* Grid lines */}
                <line x1="0" y1={height} x2={width} y2={height} stroke="#3f3f46" strokeWidth="1" />
                <line x1="0" y1="0" x2="0" y2={height} stroke="#3f3f46" strokeWidth="1" />
                
                {/* Path */}
                <polyline 
                    points={points} 
                    fill="none" 
                    stroke="#8b5cf6" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    className="drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                />
                
                {/* Current Point */}
                {lossHistory.length > 0 && (
                    <circle 
                        cx={(lossHistory.length - 1) / epochs * width} 
                        cy={height - ((lossHistory[lossHistory.length - 1] / maxLoss) * height)} 
                        r="4" 
                        fill="#fff" 
                        className="animate-pulse"
                    />
                )}
            </svg>
        );
    };

    return (
        <div className="flex flex-col h-full space-y-6">
            {/* Header / Status */}
            <div className="p-4 border border-zinc-800 rounded-xl bg-zinc-900/20 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className={cn(
                        "size-10 rounded-lg flex items-center justify-center border",
                        isTraining ? "bg-violet-500/10 border-violet-500/30" : "bg-zinc-900 border-zinc-800"
                    )}>
                        <Brain className={cn("size-5", isTraining ? "text-violet-400 animate-pulse" : "text-zinc-500")} />
                    </div>
                    <div>
                        <h4 className="text-sm font-bold text-zinc-200">Model Fine-tuning</h4>
                        <p className="text-xs text-zinc-500">Customize agent behavior with domain data</p>
                    </div>
                </div>
                <Badge variant="outline" className={cn(
                    "font-mono uppercase tracking-wider text-[10px]",
                    isTraining ? "bg-violet-500/10 text-violet-400 border-violet-500/30" : "bg-zinc-900 text-zinc-500 border-zinc-800"
                )}>
                    {isTraining ? 'Training Active' : 'Idle'}
                </Badge>
            </div>

            {/* Configuration */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900/10">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Hyperparameters</label>
                    
                    <div className="space-y-3">
                        <div className="space-y-1">
                            <div className="flex justify-between text-xs text-zinc-400">
                                <span>Epochs</span>
                                <span className="font-mono text-zinc-200">{epochs}</span>
                            </div>
                            <Slider 
                                value={[epochs]} 
                                max={50} 
                                min={1} 
                                step={1} 
                                onValueChange={([v]) => setEpochs(v)} 
                                disabled={isTraining}
                                className="[&_.bg-primary]:bg-violet-500"
                            />
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Learning Rate</span>
                            <Select value={learningRate} onValueChange={setLearningRate} disabled={isTraining}>
                                <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectItem value="0.01">0.01 (Fast)</SelectItem>
                                    <SelectItem value="0.001">0.001 (Standard)</SelectItem>
                                    <SelectItem value="0.0001">0.0001 (Precise)</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-1">
                            <span className="text-xs text-zinc-400">Batch Size</span>
                            <Select value={batchSize} onValueChange={setBatchSize} disabled={isTraining}>
                                <SelectTrigger className="h-8 bg-zinc-900 border-zinc-800 text-xs">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                                    <SelectItem value="16">16</SelectItem>
                                    <SelectItem value="32">32</SelectItem>
                                    <SelectItem value="64">64</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                <div className="space-y-4 p-4 border border-zinc-800 rounded-xl bg-zinc-900/10 flex flex-col">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Dataset</label>
                    
                    <div className="flex-1 border-2 border-dashed border-zinc-800 rounded-lg flex flex-col items-center justify-center gap-2 hover:bg-zinc-900/30 hover:border-zinc-700 transition-all cursor-pointer group">
                        <div className="p-2 rounded-full bg-zinc-900 group-hover:scale-110 transition-transform">
                            <Upload className="size-4 text-zinc-500 group-hover:text-zinc-300" />
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-medium text-zinc-400 group-hover:text-zinc-200">Drop JSONL files</div>
                            <div className="text-[10px] text-zinc-600">or click to browse</div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                         <div className="flex items-center gap-2 text-xs text-zinc-400 p-2 bg-zinc-900 border border-zinc-800 rounded">
                             <FileText className="size-3 text-zinc-500" />
                             <span className="truncate flex-1">previous_chats.jsonl</span>
                             <span className="text-zinc-600 text-[10px]">2.4MB</span>
                         </div>
                    </div>
                </div>
            </div>

            {/* Training Visualizer */}
            <div className="flex-1 border border-zinc-800 rounded-xl bg-[#050506] p-4 relative overflow-hidden flex flex-col min-h-[200px]">
                <div className="flex items-center justify-between mb-4 z-10">
                    <h5 className="text-xs font-bold text-zinc-400 uppercase flex items-center gap-2">
                        <Activity className="size-3" /> Loss Curve
                    </h5>
                    {isTraining && (
                         <div className="font-mono text-[10px] text-zinc-500">
                             EPOCH {currentEpoch}/{epochs} • LOSS: {lossHistory[lossHistory.length-1]?.toFixed(4)}
                         </div>
                    )}
                </div>
                
                <div className="flex-1 relative z-10 px-2 pb-2" ref={canvasRef}>
                    {lossHistory.length > 0 ? renderChart() : (
                        <div className="absolute inset-0 flex items-center justify-center text-zinc-700 text-xs italic">
                            Start training to visualize loss
                        </div>
                    )}
                </div>

                {/* Background Grid Effect */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" 
                     style={{ backgroundImage: 'radial-gradient(#4c1d95 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />
            </div>

            <Button 
                className={cn(
                    "w-full font-bold tracking-wide shadow-lg transition-all",
                    isTraining 
                        ? "bg-zinc-800 text-zinc-500 cursor-not-allowed" 
                        : "bg-violet-600 hover:bg-violet-500 text-white shadow-violet-900/20"
                )}
                onClick={handleStartTraining}
                disabled={isTraining}
            >
                {isTraining ? (
                    <>
                        <RefreshCw className="size-4 mr-2 animate-spin" /> Training in Progress...
                    </>
                ) : (
                    <>
                        <Play className="size-4 mr-2 fill-current" /> Start Fine-tuning Job
                    </>
                )}
            </Button>
        </div>
    );
}