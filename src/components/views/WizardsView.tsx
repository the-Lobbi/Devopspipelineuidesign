import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Network, Workflow, X } from 'lucide-react';
import { AgentCreationWizard } from '../wizards/AgentCreationWizard';
import { OrchestrationWizard } from '../wizards/OrchestrationWizard';
import { WorkflowWizard } from '../wizards/WorkflowWizard';
import { cn } from '../../lib/utils';

type WizardType = 'agent' | 'orchestration' | 'workflow' | null;

export function WizardsView() {
  const [activeWizard, setActiveWizard] = useState<WizardType>(null);

  const cards = [
    {
      id: 'agent',
      title: 'Create Agent',
      description: 'Design a new AI agent with specific capabilities, personality, and knowledge.',
      icon: Bot,
      color: 'amber',
    },
    {
      id: 'orchestration',
      title: 'Orchestration',
      description: 'Define how a team of agents collaborates on complex tasks.',
      icon: Network,
      color: 'emerald',
    },
    {
      id: 'workflow',
      title: 'Workflow',
      description: 'Automate repetitive processes with triggered agent pipelines.',
      icon: Workflow,
      color: 'blue',
    },
  ];

  return (
    <div className="relative h-full w-full p-8 overflow-hidden">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white">
          Command Center
        </h1>
        <p className="text-muted-foreground">
          Initialize new agents, orchestrations, and workflows.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {cards.map((card) => (
          <motion.div
            key={card.id}
            whileHover={{ y: -5 }}
            className={cn(
              "group relative flex cursor-pointer flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-white/5 p-6 transition-colors hover:bg-white/10",
              card.color === 'amber' && "hover:border-amber-500/50",
              card.color === 'emerald' && "hover:border-emerald-500/50",
              card.color === 'blue' && "hover:border-blue-500/50"
            )}
            onClick={() => setActiveWizard(card.id as WizardType)}
          >
            <div className={cn(
              "absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br opacity-10 blur-3xl transition-opacity group-hover:opacity-20",
              card.color === 'amber' && "from-amber-500 to-orange-500",
              card.color === 'emerald' && "from-emerald-500 to-teal-500",
              card.color === 'blue' && "from-blue-500 to-indigo-500"
            )} />
            
            <div>
              <div className={cn(
                "mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg border bg-white/5",
                card.color === 'amber' && "border-amber-500/20 text-amber-400",
                card.color === 'emerald' && "border-emerald-500/20 text-emerald-400",
                card.color === 'blue' && "border-blue-500/20 text-blue-400"
              )}>
                <card.icon className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-white">{card.title}</h3>
              <p className="text-sm text-muted-foreground">{card.description}</p>
            </div>

            <div className="mt-6 flex items-center text-sm font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
              Launch Wizard <span className="ml-2">→</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Wizard Overlay */}
      <AnimatePresence>
        {activeWizard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="relative w-full max-w-5xl h-full max-h-[90vh]"
            >
              <button
                onClick={() => setActiveWizard(null)}
                className="absolute -right-4 -top-4 z-50 rounded-full bg-zinc-800 p-2 text-white hover:bg-zinc-700 border border-white/10"
              >
                <X className="h-5 w-5" />
              </button>

              {activeWizard === 'agent' && (
                <AgentCreationWizard
                  onCancel={() => setActiveWizard(null)}
                  onComplete={(data) => {
                    console.log('Agent Data:', data);
                    setActiveWizard(null);
                  }}
                />
              )}

              {activeWizard === 'orchestration' && (
                <OrchestrationWizard
                    onCancel={() => setActiveWizard(null)}
                    onComplete={(data) => {
                        console.log('Orchestration Data:', data);
                        setActiveWizard(null);
                    }}
                />
              )}

              {activeWizard === 'workflow' && (
                <WorkflowWizard
                    onCancel={() => setActiveWizard(null)}
                    onComplete={(data) => {
                        console.log('Workflow Data:', data);
                        setActiveWizard(null);
                    }}
                />
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
