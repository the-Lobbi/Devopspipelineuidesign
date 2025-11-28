"use client"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { useSelectedEpic, useAppStore } from "@/lib/store"
import { StatusBadge } from "@/components/ui/status-badge"
import { WorkflowStepper } from "@/components/ui/workflow-stepper"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ExternalLink, XCircle, RefreshCw, FileText, GitPullRequest, Bot, Layers, Activity } from "lucide-react"
import { useCancelEpic, useRetryEpic } from "@/lib/queries/epics"
import { workflowSteps } from "@/lib/mock-data"

export function EpicDetailDrawer() {
  const epic = useSelectedEpic()
  const selectEpic = useAppStore((state) => state.selectEpic)
  const cancelEpic = useCancelEpic()
  const retryEpic = useRetryEpic()

  if (!epic) return null

  return (
    <Sheet open={!!epic} onOpenChange={(open) => !open && selectEpic(null)}>
      <SheetContent className="w-[400px] sm:w-[540px] bg-[#09090b] border-l border-zinc-800 p-0 text-zinc-200">
        <SheetHeader className="px-6 py-4 border-b border-zinc-800 bg-[#0d0d0e]">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400 font-mono">
                        {epic.jiraKey}
                    </Badge>
                    <StatusBadge status={epic.status} />
                </div>
                <SheetTitle className="text-lg font-semibold leading-snug text-zinc-100">
                    {epic.summary}
                </SheetTitle>
            </div>
          </div>
        </SheetHeader>

        <ScrollArea className="h-[calc(100vh-140px)]">
            <div className="px-6 py-6 space-y-8">
                {/* Workflow Progress */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4">Workflow Progress</h3>
                    <WorkflowStepper steps={workflowSteps} currentStep={epic.currentStep || 1} />
                </section>

                {/* Details */}
                <section className="space-y-4">
                     <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-2">Description</h3>
                     <p className="text-sm text-zinc-400 leading-relaxed">
                        {epic.description || "No description provided for this epic."}
                     </p>
                </section>

                <Separator className="bg-zinc-800" />

                {/* Metadata */}
                <section className="grid grid-cols-2 gap-4">
                    <div className="space-y-1">
                         <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Repository</h3>
                         <div className="flex items-center gap-2 text-sm text-zinc-300">
                             <Layers className="size-3.5" />
                             <span>golden-armada/core</span>
                         </div>
                    </div>
                    <div className="space-y-1">
                         <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Branch</h3>
                         <div className="flex items-center gap-2 text-sm text-zinc-300">
                             <GitPullRequest className="size-3.5" />
                             <span>feature/{epic.jiraKey.toLowerCase()}</span>
                         </div>
                    </div>
                    <div className="space-y-1">
                         <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Owner</h3>
                         <div className="flex items-center gap-2 text-sm text-zinc-300">
                             <Bot className="size-3.5" />
                             <span>Orchestrator</span>
                         </div>
                    </div>
                    <div className="space-y-1">
                         <h3 className="text-[10px] font-bold uppercase tracking-wider text-zinc-600">Links</h3>
                         <div className="flex items-center gap-2">
                             <Button variant="link" size="sm" className="h-auto p-0 text-violet-400 hover:text-violet-300">
                                 Jira Issue <ExternalLink className="ml-1 size-3" />
                             </Button>
                         </div>
                    </div>
                </section>

                <Separator className="bg-zinc-800" />

                {/* Activity Mock */}
                <section>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-500 mb-4 flex items-center gap-2">
                        <Activity className="size-3.5" /> Recent Activity
                    </h3>
                    <div className="space-y-4">
                        <div className="flex gap-3 text-sm">
                            <div className="mt-0.5 min-w-[2px] h-full bg-zinc-800 relative">
                                <div className="absolute top-1.5 -left-[3px] size-2 rounded-full bg-zinc-600" />
                            </div>
                            <div className="pb-4">
                                <p className="text-zinc-300">Planner Agent analyzed requirements</p>
                                <span className="text-xs text-zinc-600">2 hours ago</span>
                            </div>
                        </div>
                        <div className="flex gap-3 text-sm">
                             <div className="mt-0.5 min-w-[2px] h-full bg-zinc-800 relative">
                                <div className="absolute top-1.5 -left-[3px] size-2 rounded-full bg-violet-600" />
                            </div>
                            <div>
                                <p className="text-zinc-300">Created 4 sub-tasks for implementation</p>
                                <span className="text-xs text-zinc-600">1 hour ago</span>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </ScrollArea>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-zinc-800 bg-[#0d0d0e] flex items-center justify-between">
            <Button variant="outline" size="sm" className="border-zinc-700 text-zinc-400 hover:bg-zinc-800" onClick={() => selectEpic(null)}>
                Close
            </Button>
            <div className="flex items-center gap-2">
                 <Button variant="destructive" size="sm" className="h-8 bg-red-950/50 text-red-400 border border-red-900/50 hover:bg-red-900/50" onClick={() => cancelEpic.mutate(epic.id)}>
                    <XCircle className="mr-2 size-3.5" /> Cancel
                </Button>
                <Button size="sm" className="h-8 bg-violet-600 hover:bg-violet-700 text-white" onClick={() => retryEpic.mutate(epic.id)}>
                    <RefreshCw className="mr-2 size-3.5" /> Retry
                </Button>
            </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
