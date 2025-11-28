import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Button } from '../ui/button';

interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

interface WizardLayoutProps {
  title: string;
  description?: string;
  steps: WizardStep[];
  currentStep: number;
  onStepClick?: (step: number) => void;
  onNext: () => void;
  onBack: () => void;
  onFinish: () => void;
  children: React.ReactNode;
  isSubmitting?: boolean;
}

export function WizardLayout({
  title,
  description,
  steps,
  currentStep,
  onStepClick,
  onNext,
  onBack,
  onFinish,
  children,
  isSubmitting = false,
}: WizardLayoutProps) {
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className="flex h-full min-h-[600px] w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl">
      {/* Header */}
      <div className="border-b border-white/10 bg-white/5 px-8 py-6">
        <h2 className="text-2xl font-bold tracking-tight text-white">{title}</h2>
        {description && <p className="mt-1 text-muted-foreground">{description}</p>}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar / Stepper */}
        <div className="w-64 border-r border-white/10 bg-white/5 p-6 hidden md:block">
          <div className="space-y-6">
            {steps.map((step, index) => {
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;

              return (
                <div
                  key={step.id}
                  className={cn(
                    "relative flex items-start gap-3 transition-colors",
                    isActive ? "text-amber-400" : isCompleted ? "text-emerald-400" : "text-zinc-500",
                    onStepClick && index <= currentStep ? "cursor-pointer" : "cursor-default"
                  )}
                  onClick={() => {
                    if (onStepClick && index <= currentStep) {
                      onStepClick(index);
                    }
                  }}
                >
                  <div className="flex flex-col items-center">
                    <div
                      className={cn(
                        "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-bold transition-all",
                        isActive
                          ? "border-amber-400 bg-amber-400/10 shadow-[0_0_15px_rgba(251,191,36,0.3)]"
                          : isCompleted
                          ? "border-emerald-400 bg-emerald-400/10"
                          : "border-zinc-700 bg-zinc-800"
                      )}
                    >
                      {isCompleted ? <Check className="h-4 w-4" /> : index + 1}
                    </div>
                    {index !== steps.length - 1 && (
                      <div
                        className={cn(
                          "h-full min-h-[32px] w-[2px] my-1 rounded-full",
                          isCompleted ? "bg-emerald-400/50" : "bg-zinc-800"
                        )}
                      />
                    )}
                  </div>
                  <div className="pt-1">
                    <p className={cn("font-medium leading-none", isActive && "text-amber-400")}>
                      {step.title}
                    </p>
                    {step.description && (
                      <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
                        {step.description}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 flex flex-col relative overflow-hidden bg-black/20">
          <div className="flex-1 overflow-y-auto p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="h-full"
              >
                {children}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer / Actions */}
          <div className="flex items-center justify-between border-t border-white/10 bg-white/5 px-8 py-4">
            <Button
              variant="ghost"
              onClick={onBack}
              disabled={currentStep === 0 || isSubmitting}
              className="text-zinc-400 hover:text-white hover:bg-white/10"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            <div className="flex items-center gap-2">
                {/* Optional secondary actions can go here */}
            </div>

            <Button
              onClick={isLastStep ? onFinish : onNext}
              disabled={isSubmitting}
              className={cn(
                "min-w-[120px]",
                isLastStep
                  ? "bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)]"
                  : "bg-amber-500 hover:bg-amber-400 text-black font-semibold shadow-[0_0_20px_rgba(245,158,11,0.3)]"
              )}
            >
              {isSubmitting ? (
                "Processing..."
              ) : isLastStep ? (
                <>
                  Complete <Check className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  Next Step <ChevronRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
