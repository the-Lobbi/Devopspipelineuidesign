import React from 'react';
import { X, Settings, Database, GitBranch } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { JiraNodeForm } from './forms/JiraNodeForm';
import { GitHubNodeForm } from './forms/GitHubNodeForm';
import { LogicNodeForm } from './forms/LogicNodeForm';
import { AgentConfigForm } from './forms/AgentConfigForm';
import { AgentNode, AgentLink } from './AgentTree';

interface NodePropertiesPanelProps {
  node: AgentNode | null;
  links?: AgentLink[];
  onClose: () => void;
  onUpdate: (nodeId: string, data: any) => void;
  onLinksUpdate?: (links: AgentLink[]) => void;
  onSimulateApproval?: () => void;
  onBindOutput?: (label: string) => void;
}

export function NodePropertiesPanel({ node, links = [], onClose, onUpdate, onLinksUpdate, onSimulateApproval, onBindOutput }: NodePropertiesPanelProps) {
  if (!node) return null;

  const handleUpdate = (data: any) => {
      onUpdate(node.id, data);
  };
  
  const handleLinksUpdate = (newLinks: AgentLink[]) => {
      if (onLinksUpdate) {
          onLinksUpdate(newLinks);
      }
  };

  const renderConfiguration = () => {
      // Integration Logic
      if (node.role === 'integration') {
          const integrationType = (node as any).integration || '';
          if (integrationType === 'jira' || node.name.toLowerCase().includes('jira')) {
              return <JiraNodeForm node={node} onChange={handleUpdate} />;
          }
          if (integrationType === 'github' || node.name.toLowerCase().includes('github') || node.name.toLowerCase().includes('pr')) {
              return <GitHubNodeForm node={node} onChange={handleUpdate} />;
          }
      }

      // Logic Nodes
      if (node.role === 'logic') {
          return (
            <LogicNodeForm 
                node={node} 
                onChange={handleUpdate} 
                onSimulateApproval={onSimulateApproval} 
                links={links}
                onLinksUpdate={handleLinksUpdate}
                onBindOutput={onBindOutput}
            />
          );
      }

      // Default Agent Config (Generic)
      return <AgentConfigForm node={node} onChange={handleUpdate} />;
  };

  return (
    <div className="flex flex-col h-full bg-[#09090b] border-l border-zinc-800/50 backdrop-blur-xl w-[400px]">
      {/* Header */}
      <div className="px-6 py-5 border-b border-zinc-800 flex items-start justify-between bg-zinc-900/20">
        <div>
            <h3 className="text-lg font-bold text-zinc-100 tracking-tight">{node.name}</h3>
            <div className="flex items-center gap-2 text-xs mt-1 text-zinc-500 font-mono uppercase tracking-wider">
                <span>{node.role}</span>
                <span className="text-zinc-700">•</span>
                <span>{node.id.split('-')[1]}</span>
            </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
            <X className="size-4" />
        </Button>
      </div>

      {/* Content */}
      <Tabs defaultValue="config" className="flex-1 flex flex-col min-h-0">
        <div className="px-6 pt-4 border-b border-zinc-800/50">
            <TabsList className="bg-transparent h-auto p-0 gap-6 w-full justify-start">
                <TabsTrigger value="config" className="data-[state=active]:text-indigo-400 data-[state=active]:border-indigo-500 border-b-2 border-transparent pb-3 px-0 text-zinc-500 hover:text-zinc-300 transition-all uppercase tracking-widest text-[10px] font-semibold rounded-none">
                    Configuration
                </TabsTrigger>
                <TabsTrigger value="io" className="data-[state=active]:text-indigo-400 data-[state=active]:border-indigo-500 border-b-2 border-transparent pb-3 px-0 text-zinc-500 hover:text-zinc-300 transition-all uppercase tracking-widest text-[10px] font-semibold rounded-none">
                    Input/Output
                </TabsTrigger>
            </TabsList>
        </div>

        <ScrollArea className="flex-1 bg-[#09090b]">
            <div className="p-6">
                <TabsContent value="config" className="mt-0 focus-visible:ring-0 animate-in fade-in slide-in-from-bottom-2">
                    {renderConfiguration()}
                </TabsContent>
                
                <TabsContent value="io" className="mt-0 space-y-4">
                    <div className="space-y-2">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Input Schema</h4>
                        <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg font-mono text-[10px] text-zinc-400">
                            <pre>{JSON.stringify({
                                "epic_id": "string",
                                "project_key": "string"
                            }, null, 2)}</pre>
                        </div>
                    </div>
                </TabsContent>
            </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
}