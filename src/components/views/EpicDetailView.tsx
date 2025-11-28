
import React, { useState } from 'react';
import { useEpics } from '@/lib/context/epics-provider';
import { EpicHeader } from '@/components/epics/EpicHeader';
import { EpicActionFooter } from '@/components/epics/EpicActionFooter';
import { WorkflowStepper } from '@/components/ui/workflow-stepper';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PlanTab } from '@/components/epics/tabs/PlanTab';
import { AgentsTab } from '@/components/epics/tabs/AgentsTab';
import { ActivityLogTab } from '@/components/epics/tabs/ActivityLogTab';
import { PRDetailCard } from '@/components/pr/PRDetailCard';
import { FeedbackThread } from '@/components/pr/FeedbackThread';
import { DiffViewer } from '@/components/pr/DiffViewer';
import { ChangeRequestQueue } from '@/components/pr/ChangeRequestQueue';
import { ApprovalModal } from '@/components/modals/ApprovalModal';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface EpicDetailViewProps {
  epicId: string;
  onBack: () => void;
}

export function EpicDetailView({ epicId, onBack }: EpicDetailViewProps) {
  const { state, dispatch } = useEpics();
  const epic = state.items[epicId] || Object.values(state.items).find(e => e.id === epicId) || Object.values(state.items)[0];
  const [approvalModalOpen, setApprovalModalOpen] = useState(false);

  if (!epic) return <div className="p-10 text-center">Epic not found</div>;

  const handleAction = (action: string) => {
    console.log('Action:', action);
    if (action === 'approve_plan') {
        // Update state to next step
        dispatch({ 
            type: 'UPDATE_EPIC', 
            payload: { ...epic, status: 'executing', currentStep: epic.currentStep + 1 } 
        });
    } else if (action === 'revise') {
        setApprovalModalOpen(true);
    }
  };

  // Mock Workflow Steps
  const workflowSteps = [
    { id: '1', label: 'Inception', status: 'completed' },
    { id: '2', label: 'Planning', status: ['planning', 'planning_review'].includes(epic.status) ? 'active' : 'completed' },
    { id: '3', label: 'Execution', status: epic.status === 'executing' ? 'active' : 'pending' },
    { id: '4', label: 'Review', status: 'pending' },
    { id: '5', label: 'Deployment', status: 'pending' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#09090b] relative">
      {/* Top Nav */}
      <div className="flex items-center gap-2 p-4 pb-0">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-zinc-500 hover:text-zinc-200">
            <ArrowLeft className="size-4 mr-1" /> Back to Epics
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto p-6 pb-20">
        <div className="max-w-6xl mx-auto">
            <EpicHeader epic={epic} />

            <div className="mb-8 px-2">
                <WorkflowStepper 
                    steps={workflowSteps as any} 
                    currentStep={['planning', 'planning_review'].includes(epic.status) ? 1 : epic.status === 'executing' ? 2 : 0} 
                />
            </div>

            <Tabs defaultValue="plan" className="w-full">
                <div className="border-b border-zinc-800 mb-6">
                    <TabsList className="bg-transparent p-0 h-auto gap-6">
                        <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none pb-3 px-1 text-zinc-500 data-[state=active]:text-violet-400">Overview</TabsTrigger>
                        <TabsTrigger value="plan" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none pb-3 px-1 text-zinc-500 data-[state=active]:text-violet-400">Plan</TabsTrigger>
                        <TabsTrigger value="agents" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none pb-3 px-1 text-zinc-500 data-[state=active]:text-violet-400">Agents</TabsTrigger>
                        <TabsTrigger value="changes" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none pb-3 px-1 text-zinc-500 data-[state=active]:text-violet-400">Code Changes</TabsTrigger>
                        <TabsTrigger value="activity" className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:border-b-2 data-[state=active]:border-violet-500 rounded-none pb-3 px-1 text-zinc-500 data-[state=active]:text-violet-400">Activity Log</TabsTrigger>
                    </TabsList>
                </div>

                <TabsContent value="overview" className="animate-in slide-in-from-left-2 duration-200">
                    <div className="p-10 text-center text-zinc-500 border border-dashed border-zinc-800 rounded-xl bg-zinc-900/20">
                        Overview Content Placeholder
                    </div>
                </TabsContent>
                <TabsContent value="plan">
                    <PlanTab />
                </TabsContent>
                <TabsContent value="agents">
                    <AgentsTab />
                </TabsContent>
                <TabsContent value="changes">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2 space-y-6">
                            <PRDetailCard 
                                prNumber={42} 
                                title="Implement User Authentication" 
                                sourceBranch="feature/auth-flow" 
                                targetBranch="main" 
                                status="open"
                                additions={124} 
                                deletions={45} 
                                filesChanged={8} 
                            />
                            <DiffViewer />
                        </div>
                        <div className="space-y-6">
                            <ChangeRequestQueue />
                            <FeedbackThread />
                        </div>
                    </div>
                </TabsContent>
                <TabsContent value="activity">
                    <ActivityLogTab />
                </TabsContent>
            </Tabs>
        </div>
      </div>

      <EpicActionFooter status={epic.status} onAction={handleAction} />
      
      <ApprovalModal 
        isOpen={approvalModalOpen} 
        onClose={() => setApprovalModalOpen(false)}
        epicKey={epic.jiraKey}
        epicTitle={epic.summary}
      />
    </div>
  );
}
