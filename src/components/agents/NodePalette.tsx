import React from 'react';
import { useDrag } from 'react-dnd';
import { 
  Bot, 
  Terminal, 
  Shield, 
  Search, 
  Server, 
  Webhook, 
  Clock, 
  GitBranch, 
  Slack, 
  FileText, 
  Code, 
  Split, 
  Repeat, 
  AlertTriangle 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export const ItemTypes = {
  NODE: 'node'
};

interface PaletteItemProps {
  type: string;
  label: string;
  icon: React.ElementType;
  data: any;
}

function PaletteItem({ type, label, icon: Icon, data }: PaletteItemProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.NODE,
    item: { type, label, data },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  return (
    <div 
      ref={drag}
      className={cn(
        "flex items-center gap-3 p-2 rounded-lg border border-transparent hover:border-zinc-800 hover:bg-zinc-800/50 cursor-grab active:cursor-grabbing transition-all",
        isDragging ? "opacity-50" : "opacity-100"
      )}
    >
      <div className="p-2 rounded bg-zinc-900 border border-zinc-800 text-zinc-400 group-hover:text-zinc-200">
        <Icon className="size-4" />
      </div>
      <div className="text-sm text-zinc-400 font-medium">{label}</div>
    </div>
  );
}

export function NodePalette() {
  return (
    <div className="w-64 bg-[#09090b] border-r border-zinc-800 flex flex-col h-full">
      <div className="p-4 border-b border-zinc-800">
        <h2 className="text-sm font-bold text-zinc-100 uppercase tracking-wider">Component Library</h2>
        <p className="text-xs text-zinc-500 mt-1">Drag to add to pipeline</p>
      </div>

      <ScrollArea className="flex-1">
        <Accordion type="multiple" defaultValue={['agents', 'integrations']} className="p-2">
          
          <AccordionItem value="agents" className="border-none mb-2">
            <AccordionTrigger className="px-2 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider hover:no-underline hover:text-zinc-300">
              AI Agents
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-2 pb-2">
              <PaletteItem type="agent" label="Orchestrator" icon={Bot} data={{ role: 'manager', model: 'claude-3-opus' }} />
              <PaletteItem type="agent" label="Planner" icon={GitBranch} data={{ role: 'planner', model: 'claude-3.5-sonnet' }} />
              <PaletteItem type="agent" label="Code Generator" icon={Terminal} data={{ role: 'coder', model: 'gpt-4-turbo' }} />
              <PaletteItem type="agent" label="QA Tester" icon={Shield} data={{ role: 'qa', model: 'gpt-4-turbo' }} />
              <PaletteItem type="agent" label="Reviewer" icon={Search} data={{ role: 'reviewer', model: 'claude-3-opus' }} />
              <PaletteItem type="agent" label="DevOps" icon={Server} data={{ role: 'devops', model: 'claude-3.5-sonnet' }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="integrations" className="border-none mb-2">
            <AccordionTrigger className="px-2 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider hover:no-underline hover:text-zinc-300">
              Integrations
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-2 pb-2">
              <PaletteItem type="integration" label="Jira Epic Parser" icon={FileText} data={{ integration: 'jira' }} />
              <PaletteItem type="integration" label="GitHub PR" icon={GitBranch} data={{ integration: 'github' }} />
              <PaletteItem type="integration" label="Slack Notifier" icon={Slack} data={{ integration: 'slack' }} />
              <PaletteItem type="integration" label="Confluence Doc" icon={FileText} data={{ integration: 'confluence' }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="triggers" className="border-none mb-2">
            <AccordionTrigger className="px-2 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider hover:no-underline hover:text-zinc-300">
              Triggers
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-2 pb-2">
              <PaletteItem type="trigger" label="Webhook" icon={Webhook} data={{ trigger: 'webhook' }} />
              <PaletteItem type="trigger" label="Schedule" icon={Clock} data={{ trigger: 'schedule' }} />
              <PaletteItem type="trigger" label="Manual" icon={Bot} data={{ trigger: 'manual' }} />
            </AccordionContent>
          </AccordionItem>

          <AccordionItem value="logic" className="border-none">
            <AccordionTrigger className="px-2 py-2 text-xs font-bold text-zinc-500 uppercase tracking-wider hover:no-underline hover:text-zinc-300">
              Logic
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-2 pb-2">
              <PaletteItem type="logic" label="Condition" icon={Split} data={{ logic: 'condition' }} />
              <PaletteItem type="logic" label="Loop" icon={Repeat} data={{ logic: 'loop' }} />
              <PaletteItem type="logic" label="Error Handler" icon={AlertTriangle} data={{ logic: 'error' }} />
            </AccordionContent>
          </AccordionItem>

        </Accordion>
      </ScrollArea>
    </div>
  );
}
