
import React from 'react';
import { 
  AlertTriangle, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  CheckCircle,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { PLAN_DATA } from '@/lib/plan-data';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  epicKey: string;
  epicTitle: string;
}

export function ApprovalModal({ isOpen, onClose, epicKey, epicTitle }: ApprovalModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto bg-zinc-950 border-zinc-800 text-zinc-200 p-0 gap-0">
        <div className="p-6 border-b border-zinc-800 sticky top-0 bg-zinc-950 z-10">
             <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 rounded-full border border-amber-500/20">
                    <AlertTriangle className="size-6 text-amber-500 animate-pulse" />
                </div>
                <div className="flex-1">
                    <DialogTitle className="text-xl font-semibold text-white mb-1">Plan Review Required</DialogTitle>
                    <DialogDescription className="text-zinc-400 text-sm">
                        <span className="font-mono text-zinc-300">{epicKey}</span>: {epicTitle}
                    </DialogDescription>
                </div>
             </div>
        </div>
        
        <div className="p-6 space-y-6">
            <div className="p-4 bg-zinc-900/50 border border-zinc-800 rounded-lg">
                <p className="text-zinc-300 text-sm mb-4">
                    The AI Planner has generated a complete breakdown for this epic. 
                    Please review the proposed stories, tasks, and subtasks below.
                </p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <MetricBox label="Sprints" value="2" />
                    <MetricBox label="Stories" value="6" />
                    <MetricBox label="Tasks" value="18" />
                    <MetricBox label="Effort" value="~24 pts" />
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider">Proposed Plan Hierarchy</h3>
                <div className="border border-zinc-800 rounded-lg bg-zinc-900/30 max-h-[300px] overflow-y-auto p-2">
                    {PLAN_DATA.map(sprint => (
                        <div key={sprint.id} className="mb-4 last:mb-0">
                            <div className="flex items-center gap-2 px-2 py-1 text-zinc-200 font-medium">
                                <ChevronDown className="size-4" /> {sprint.title}
                            </div>
                            <div className="pl-6 mt-1 space-y-2">
                                {sprint.stories.map((story: any) => (
                                    <div key={story.id} className="text-sm text-zinc-400 border-l border-zinc-800 pl-3 py-1">
                                        <div className="flex items-center justify-between">
                                            <span>{story.title}</span>
                                            <span className="text-xs bg-zinc-800 px-1.5 py-0.5 rounded">{story.points} pts</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-sm font-medium text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="size-4" /> Change Requests
                </h3>
                
                <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4">
                    <div className="flex gap-4 mb-4">
                        <div className="w-1/3 space-y-3">
                             <select className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300">
                                <option>Scope Change</option>
                                <option>Technical Details</option>
                             </select>
                             <select className="w-full bg-zinc-950 border border-zinc-800 rounded px-3 py-2 text-sm text-zinc-300">
                                <option>Story 2: User Login</option>
                                <option>Story 1: User Registration</option>
                             </select>
                        </div>
                        <div className="flex-1">
                            <textarea 
                                className="w-full h-full min-h-[80px] bg-zinc-950 border border-zinc-800 rounded p-3 text-sm text-zinc-300 resize-none focus:ring-1 focus:ring-violet-500 outline-none"
                                placeholder="Describe the change you want the AI to make..."
                            />
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <Button variant="secondary" size="sm" className="text-zinc-200 bg-zinc-800 hover:bg-zinc-700">
                            <Plus className="size-4 mr-1" /> Add Request
                        </Button>
                    </div>
                </div>

                {/* Pending Requests Example */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between p-3 bg-zinc-800/30 rounded border border-zinc-800/50">
                        <span className="text-sm text-zinc-300">1. Add OAuth support to Login story</span>
                        <button className="text-zinc-500 hover:text-red-400"><X className="size-4" /></button>
                    </div>
                </div>
            </div>
        </div>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 sticky bottom-0 flex items-center justify-between gap-4">
            <Button 
                variant="ghost" 
                onClick={onClose}
                className="text-zinc-400 hover:text-white hover:bg-zinc-800"
            >
                Cancel
            </Button>
            <div className="flex gap-3">
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700">
                    Reject & Replan
                </Button>
                <Button className="bg-amber-600 hover:bg-amber-500 text-white border-amber-600">
                    Revise with Changes
                </Button>
                <Button className="bg-green-600 hover:bg-green-500 text-white border-green-600 gap-2" onClick={onClose}>
                    <CheckCircle className="size-4" />
                    Approve Plan
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function MetricBox({ label, value }: { label: string, value: string }) {
    return (
        <div className="bg-zinc-950 rounded p-3 text-center border border-zinc-800">
            <div className="text-xl font-bold text-zinc-200 mb-1">{value}</div>
            <div className="text-xs text-zinc-500 uppercase tracking-wider">{label}</div>
        </div>
    );
}
