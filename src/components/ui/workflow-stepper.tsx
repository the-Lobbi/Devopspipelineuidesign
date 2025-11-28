
import React from 'react';
import { cn } from '@/lib/utils';
import { Check, X, Loader2, Circle, Clock } from 'lucide-react';

export interface WorkflowStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'completed' | 'failed';
  description?: string;
}

interface WorkflowStepperProps {
  steps: WorkflowStep[];
  currentStep: number; // 0-based index
  showLabels?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function WorkflowStepper({ 
  steps, 
  currentStep, 
  showLabels = true, 
  size = 'md',
  className 
}: WorkflowStepperProps) {
  
  return (
    <div className={cn("w-full", className)}>
      <div className="relative flex items-center justify-between">
        {/* Connector Line Background */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-zinc-800 -z-10" />
        
        {/* Connector Line Progress */}
        <div 
          className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500 -z-10" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isPending = index > currentStep;
          const isFailed = step.status === 'failed';

          return (
            <div key={step.id} className="relative flex flex-col items-center group">
              <div 
                className={cn(
                  "flex items-center justify-center rounded-full border-2 transition-all duration-300 z-10 bg-[#09090b]",
                  size === 'sm' ? "size-6 text-[10px]" : size === 'md' ? "size-8 text-xs" : "size-10 text-sm",
                  isCompleted ? "border-emerald-500 text-emerald-500 bg-emerald-500/10" :
                  isFailed ? "border-red-500 text-red-500 bg-red-500/10" :
                  isCurrent ? "border-blue-500 text-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.5)] scale-110" :
                  "border-zinc-700 text-zinc-500 bg-zinc-900"
                )}
              >
                {isCompleted ? <Check className="size-1/2" /> :
                 isFailed ? <X className="size-1/2" /> :
                 isCurrent ? <Loader2 className="size-1/2 animate-spin" /> :
                 <span>{index + 1}</span>}
              </div>

              {showLabels && (
                <div className={cn(
                  "absolute top-full mt-2 flex flex-col items-center text-center w-32 transition-opacity duration-300",
                  isCurrent ? "opacity-100" : "opacity-60 group-hover:opacity-100"
                )}>
                  <span className={cn(
                    "text-xs font-medium",
                    isCurrent ? "text-zinc-100" : "text-zinc-500"
                  )}>
                    {step.label}
                  </span>
                  {isCurrent && step.description && (
                    <span className="text-[10px] text-zinc-400 mt-0.5 hidden sm:block">
                      {step.description}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
