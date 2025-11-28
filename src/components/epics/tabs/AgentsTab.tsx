
import React from 'react';
import { AGENT_TREE } from '@/lib/plan-data';
import { Bot, Terminal, FileText, Search, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AgentTree } from '@/components/agents/AgentTree';

export function AgentsTab() {
  return (
    <div className="flex items-start justify-center p-6 min-h-[600px]">
        <AgentTree />
    </div>
  );
}
