import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, AlertCircle, Clock, ArrowRight, GitPullRequest, ShieldAlert, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ApprovalItem {
    id: string;
    title: string;
    type: 'code_review' | 'deploy' | 'access_request' | 'budget';
    severity: 'high' | 'medium' | 'low';
    requester: string;
    time: string;
    description: string;
    confidence: number;
}

const MOCK_APPROVALS: ApprovalItem[] = [
    {
        id: 'req-1',
        title: 'Merge PR #42: Auth Rate Limiting',
        type: 'code_review',
        severity: 'high',
        requester: 'Code Generator Agent',
        time: '2m ago',
        description: 'Implements token bucket algorithm. Modifies auth controller.',
        confidence: 87
    },
    {
        id: 'req-2',
        title: 'Provision Production DB',
        type: 'budget',
        severity: 'medium',
        requester: 'Infra Planner',
        time: '15m ago',
        description: 'Requesting r6g.2xlarge RDS instance. Estimated cost: $450/mo.',
        confidence: 92
    },
    {
        id: 'req-3',
        title: 'Deploy to Staging',
        type: 'deploy',
        severity: 'low',
        requester: 'Release Manager',
        time: '1h ago',
        description: 'Release v2.4.0-rc1. passed all integration tests.',
        confidence: 99
    }
];

interface ApprovalQueueProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectApproval: (id: string) => void;
}

export function ApprovalQueue({ isOpen, onClose, onSelectApproval }: ApprovalQueueProps) {
    return (
        <Sheet open={isOpen} onOpenChange={onClose}>
            <SheetContent className="w-[400px] sm:w-[540px] bg-[#09090b] border-l border-zinc-800 p-0 gap-0 flex flex-col text-zinc-200">
                <SheetHeader className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-amber-500/10 rounded-lg border border-amber-500/20">
                                <ShieldAlert className="size-5 text-amber-500" />
                            </div>
                            <div>
                                <SheetTitle className="text-lg font-bold text-zinc-100">Approval Queue</SheetTitle>
                                <SheetDescription className="text-xs text-zinc-500 font-mono">
                                    {MOCK_APPROVALS.length} PENDING REQUESTS
                                </SheetDescription>
                            </div>
                        </div>
                        <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-zinc-400">
                            HITL MODE
                        </Badge>
                    </div>
                </SheetHeader>

                <ScrollArea className="flex-1 bg-[#050506]">
                    <div className="p-4 space-y-3">
                        {MOCK_APPROVALS.map((item) => (
                            <div 
                                key={item.id} 
                                className="group p-4 rounded-xl border border-zinc-800 bg-zinc-900/40 hover:bg-zinc-900 hover:border-zinc-700 transition-all cursor-pointer relative overflow-hidden"
                                onClick={() => onSelectApproval(item.id)}
                            >
                                {/* Confidence Bar */}
                                <div className="absolute left-0 top-0 bottom-0 w-1 bg-zinc-800">
                                    <div 
                                        className={cn(
                                            "w-full transition-all", 
                                            item.confidence > 90 ? "bg-emerald-500" : 
                                            item.confidence > 70 ? "bg-amber-500" : "bg-red-500"
                                        )} 
                                        style={{ height: `${item.confidence}%`, marginTop: `${100 - item.confidence}%` }}
                                    />
                                </div>

                                <div className="pl-3 flex flex-col gap-3">
                                    <div className="flex items-start justify-between">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="text-sm font-bold text-zinc-200 group-hover:text-indigo-300 transition-colors">
                                                    {item.title}
                                                </h4>
                                                {item.severity === 'high' && (
                                                    <Badge variant="destructive" className="h-4 px-1 text-[9px] uppercase">High</Badge>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-2 text-xs text-zinc-500">
                                                <span className="flex items-center gap-1"><Clock className="size-3" /> {item.time}</span>
                                                <span>•</span>
                                                <span>by {item.requester}</span>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center gap-2">
                                            <div className="text-right">
                                                <div className="text-[10px] uppercase font-bold text-zinc-600">Confidence</div>
                                                <div className={cn(
                                                    "font-mono text-sm font-bold",
                                                    item.confidence > 80 ? "text-emerald-400" : "text-amber-400"
                                                )}>{item.confidence}%</div>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
                                        {item.description}
                                    </p>

                                    <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50 mt-1">
                                        <div className="flex gap-2">
                                            <Badge variant="secondary" className="bg-zinc-950 text-zinc-500 border-zinc-800 text-[10px] uppercase tracking-wider">
                                                {item.type.replace('_', ' ')}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity translate-x-2 group-hover:translate-x-0 duration-300">
                                            <span className="text-xs font-bold text-indigo-400">Review</span>
                                            <ArrowRight className="size-3 text-indigo-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </ScrollArea>

                <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between text-xs text-zinc-500">
                    <span>Auto-escalation enabled for &gt;4h delay</span>
                    <Button variant="ghost" size="sm" className="h-7 text-zinc-400 hover:text-white">History</Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}