
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export function WorkflowStepper() {
  const steps = [
    { id: 1, label: 'Analyze', status: 'complete' },
    { id: 2, label: 'Branch', status: 'complete' },
    { id: 3, label: 'Code', status: 'active' },
    { id: 4, label: 'Tests', status: 'pending' },
    { id: 5, label: 'Linter', status: 'pending' },
    { id: 6, label: 'Commit', status: 'pending' },
    { id: 7, label: 'PR', status: 'pending' },
    { id: 8, label: 'Docs', status: 'pending' },
  ];

  return (
    <div className="w-full py-6 px-4 overflow-x-auto">
        <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-4">Workflow Progress</h3>
        
        <div className="flex items-start min-w-[600px]">
            {steps.map((step, index) => {
                const isLast = index === steps.length - 1;
                
                return (
                    <div key={step.id} className="flex-1 flex relative">
                        <div className="flex flex-col items-center relative z-10">
                            <div className={cn(
                                "flex items-center justify-center size-8 rounded-full border-2 transition-all duration-300",
                                step.status === 'complete' ? "bg-green-500 border-green-500 text-zinc-950" :
                                step.status === 'active' ? "bg-violet-500 border-violet-500 text-white animate-pulse shadow-[0_0_15px_rgba(139,92,246,0.5)]" :
                                "bg-zinc-900 border-zinc-700 text-zinc-600"
                            )}>
                                {step.status === 'complete' ? (
                                    <Check className="size-4 stroke-[3]" />
                                ) : step.status === 'active' ? (
                                    <div className="size-2.5 bg-white rounded-full" />
                                ) : (
                                    <div className="size-2 bg-zinc-700 rounded-full" />
                                )}
                            </div>
                            
                            <div className="mt-2 text-center">
                                <span className="text-[10px] text-zinc-500 font-mono mb-0.5 block">0{step.id}</span>
                                <span className={cn(
                                    "text-sm font-medium whitespace-nowrap",
                                    step.status === 'active' ? "text-violet-400" : 
                                    step.status === 'complete' ? "text-zinc-300" : "text-zinc-500"
                                )}>
                                    {step.label}
                                </span>
                                {step.status === 'active' && (
                                    <span className="text-[10px] text-violet-400/80 mt-0.5 block font-medium tracking-wider uppercase">Active</span>
                                )}
                            </div>
                        </div>
                        
                        {!isLast && (
                            <div className="flex-1 pt-4 px-2">
                                <div className={cn(
                                    "h-0.5 w-full rounded-full",
                                    step.status === 'complete' ? "bg-green-500" : 
                                    step.status === 'active' ? "bg-gradient-to-r from-green-500 to-zinc-700" : 
                                    "bg-zinc-700"
                                )} />
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
        
        <div className="mt-6 p-3 bg-zinc-900/50 border-l-2 border-violet-500 rounded-r text-sm flex justify-between items-center">
            <span className="text-zinc-400">
                <span className="text-zinc-500 mr-2">Current:</span>
                Generating code for <span className="text-zinc-200">Story 2, Task 3</span>
            </span>
            <span className="text-zinc-500 text-xs font-mono">Elapsed: 12m 30s</span>
        </div>
    </div>
  );
}
