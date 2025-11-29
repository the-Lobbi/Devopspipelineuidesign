import React, { useState } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Save, RotateCcw, Sparkles, Wand2 } from 'lucide-react';
import { toast } from 'sonner';

interface PromptEditorProps {
    agent: any;
}

const DEFAULT_PROMPTS: Record<string, string> = {
    'planner': `You are an expert Software Architect and Project Planner.
Your goal is to break down complex requirements into manageable, sequential tasks.
- Analyze the input request carefully.
- Identify dependencies between tasks.
- Estimate complexity (Story Points) for each task.
- Output a structured JSON plan.`,
    'coder': `You are a Senior Software Engineer specializing in TypeScript and React.
Your goal is to write clean, efficient, and type-safe code.
- Follow the project's style guide strictly.
- Ensure all components have proper type definitions.
- Write unit tests for complex logic.`,
    'manager': `You are the Orchestrator of the Golden Armada fleet.
Your role is to coordinate specialized agents to achieve the user's goal.
- Delegate tasks to the most suitable agent.
- Monitor progress and intervene if an agent gets stuck.
- Synthesize results into a final report.`
};

export function PromptEditor({ agent }: PromptEditorProps) {
    const role = agent.role || 'manager';
    const initialPrompt = DEFAULT_PROMPTS[role] || DEFAULT_PROMPTS['manager'];
    
    const [prompt, setPrompt] = useState(initialPrompt);
    const [isDirty, setIsDirty] = useState(false);
    const [version, setVersion] = useState(1);

    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setPrompt(e.target.value);
        setIsDirty(true);
    };

    const handleSave = () => {
        setIsDirty(false);
        setVersion(prev => prev + 1);
        toast.success("System Prompt Updated", {
            description: `v${version + 1} deployed to ${agent.name}`
        });
    };

    const handleOptimize = () => {
        toast.promise(
            new Promise((resolve) => setTimeout(resolve, 2000)),
            {
                loading: 'Optimizing prompt with meta-prompting...',
                success: 'Prompt Optimized',
                error: 'Optimization failed'
            }
        );
    };

    const handleInsertVariable = (variable: string) => {
        setPrompt(prev => prev + " " + variable);
        setIsDirty(true);
    };

    return (
        <div className="flex flex-col h-full border border-zinc-800 rounded-xl bg-[#0c0c0e] overflow-hidden">
            {/* Toolbar */}
            <div className="h-12 px-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/30">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <Wand2 className="size-4 text-violet-400" />
                        <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">System Prompt</span>
                    </div>
                    <Badge variant="secondary" className="bg-zinc-800 text-zinc-500 border-zinc-700 font-mono text-[10px]">
                        v{version}.0
                    </Badge>
                    {isDirty && (
                        <Badge variant="secondary" className="bg-amber-500/10 text-amber-500 border-amber-500/20 font-mono text-[10px]">
                            UNSAVED
                        </Badge>
                    )}
                </div>
                <div className="flex gap-2">
                     <Button 
                        variant="outline" 
                        size="sm" 
                        className="h-7 text-xs border-zinc-700 text-zinc-400 hover:text-white hover:bg-zinc-800"
                        onClick={handleOptimize}
                    >
                        <Sparkles className="size-3 mr-1.5 text-indigo-400" /> Auto-Optimize
                    </Button>
                    <Button 
                        size="sm" 
                        className="h-7 text-xs bg-zinc-100 text-zinc-900 hover:bg-white"
                        onClick={handleSave}
                        disabled={!isDirty}
                    >
                        <Save className="size-3 mr-1.5" /> Save Changes
                    </Button>
                </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 relative group">
                <textarea
                    value={prompt}
                    onChange={handleChange}
                    className="w-full h-full bg-transparent border-none p-4 resize-none focus:ring-0 font-mono text-sm text-zinc-300 leading-relaxed custom-scrollbar"
                    spellCheck={false}
                />
                
                {/* Line Numbers (Visual Only) */}
                <div className="absolute top-4 right-4 text-xs text-zinc-600 font-mono pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    {prompt.length} chars
                </div>
            </div>

            {/* Variables Footer */}
            <div className="p-3 bg-zinc-900/50 border-t border-zinc-800">
                <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider mb-2">Available Variables</div>
                <div className="flex gap-2 flex-wrap">
                    {['{{user_input}}', '{{context_memory}}', '{{tool_outputs}}', '{{current_time}}'].map(v => (
                        <code 
                            key={v} 
                            className="px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 text-[10px] font-mono border border-zinc-700 cursor-pointer hover:border-zinc-500 hover:text-zinc-300 transition-colors"
                            onClick={() => handleInsertVariable(v)}
                        >
                            {v}
                        </code>
                    ))}
                </div>
            </div>
        </div>
    );
}