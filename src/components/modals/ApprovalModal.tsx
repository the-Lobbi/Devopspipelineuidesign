
import React from 'react';
import { 
  AlertTriangle, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  CheckCircle,
  MessageSquare,
  GitPullRequest,
  FileDiff,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PLAN_DATA } from '@/lib/plan-data';

interface ApprovalModalProps {
  isOpen: boolean;
  onClose: () => void;
  epicKey: string;
  epicTitle: string;
}

export function ApprovalModal({ isOpen, onClose, epicKey, epicTitle }: ApprovalModalProps) {
  const [confidence, setConfidence] = React.useState(87);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby={undefined} className="max-w-4xl max-h-[90vh] overflow-hidden bg-[#09090b] border-zinc-800 text-zinc-200 p-0 gap-0 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-start gap-5">
             <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
                <ShieldAlert className="size-6 text-amber-500 animate-pulse" />
            </div>
            <div className="flex-1">
                <div className="flex items-center justify-between">
                    <DialogTitle className="text-xl font-bold text-white tracking-tight">Human Approval Required</DialogTitle>
                    <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3 py-1">
                        <span className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Agent Confidence</span>
                        <span className={`text-sm font-bold font-mono ${confidence > 80 ? 'text-emerald-400' : 'text-amber-400'}`}>{confidence}%</span>
                    </div>
                </div>
                <DialogDescription className="text-zinc-400 text-sm mt-1 flex items-center gap-2">
                    Step: <Badge variant="outline" className="text-zinc-300 border-zinc-700 bg-zinc-900">PR Generator</Badge>
                    <ArrowRight className="size-3 text-zinc-600" />
                    Target: <span className="font-mono text-zinc-300 bg-zinc-800/50 px-1.5 py-0.5 rounded">main</span>
                </DialogDescription>
            </div>
        </div>
        
        <Tabs defaultValue="diff" className="flex-1 flex flex-col min-h-0">
            <div className="px-6 border-b border-zinc-800 bg-zinc-900/20">
                <TabsList className="bg-transparent h-auto p-0 gap-6 w-full justify-start">
                    <TabsTrigger value="diff" className="data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-400 border-b-2 border-transparent pb-3 px-0 text-zinc-500 hover:text-zinc-300 rounded-none uppercase tracking-widest text-[10px] font-bold">
                        <FileDiff className="size-3.5 mr-2" /> Code Changes
                    </TabsTrigger>
                    <TabsTrigger value="plan" className="data-[state=active]:border-indigo-500 data-[state=active]:text-indigo-400 border-b-2 border-transparent pb-3 px-0 text-zinc-500 hover:text-zinc-300 rounded-none uppercase tracking-widest text-[10px] font-bold">
                        <GitPullRequest className="size-3.5 mr-2" /> PR Details
                    </TabsTrigger>
                </TabsList>
            </div>

            <ScrollArea className="flex-1 bg-[#0c0c0e]">
                <div className="p-6">
                    <TabsContent value="diff" className="mt-0 space-y-4">
                        <div className="flex items-center justify-between mb-2">
                             <div className="text-sm text-zinc-400 font-mono">src/controllers/AuthController.ts</div>
                             <div className="flex gap-4 text-xs font-mono">
                                <span className="text-emerald-400">+42 lines</span>
                                <span className="text-red-400">-12 lines</span>
                             </div>
                        </div>
                        
                        <div className="font-mono text-xs border border-zinc-800 rounded-lg overflow-hidden">
                            {[
                                { type: 'context', num: 24, code: '  public async login(req: Request, res: Response) {' },
                                { type: 'context', num: 25, code: '    const { email, password } = req.body;' },
                                { type: 'remove', num: 26, code: '    // TODO: Implement rate limiting' },
                                { type: 'add', num: 26, code: '    // Rate limiting implementation' },
                                { type: 'add', num: 27, code: '    await this.rateLimiter.consume(req.ip);' },
                                { type: 'context', num: 28, code: '    const user = await this.authService.validate(email, password);' },
                                { type: 'context', num: 29, code: '    if (!user) {' },
                                { type: 'add', num: 30, code: '      this.logger.warn(`Failed login attempt for ${email}`);' },
                                { type: 'context', num: 31, code: '      throw new UnauthorizedError("Invalid credentials");' },
                            ].map((line, i) => (
                                <div key={i} className={`flex ${
                                    line.type === 'add' ? 'bg-emerald-500/10' : 
                                    line.type === 'remove' ? 'bg-red-500/10' : 'bg-zinc-950'
                                }`}>
                                    <div className="w-10 text-right pr-3 py-1 text-zinc-600 border-r border-zinc-800 bg-zinc-900/50 select-none">{line.num}</div>
                                    <div className={`flex-1 px-4 py-1 whitespace-pre ${
                                        line.type === 'add' ? 'text-emerald-300' : 
                                        line.type === 'remove' ? 'text-red-400 line-through opacity-60' : 'text-zinc-400'
                                    }`}>
                                        <span className="select-none w-4 inline-block text-zinc-600 opacity-50">
                                            {line.type === 'add' ? '+' : line.type === 'remove' ? '-' : ''}
                                        </span>
                                        {line.code}
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        <div className="p-4 rounded-lg border border-amber-900/30 bg-amber-900/10 mt-4 flex gap-3">
                            <AlertTriangle className="size-5 text-amber-500 shrink-0" />
                            <div className="space-y-1">
                                <h4 className="text-sm font-bold text-amber-400">Security Warning</h4>
                                <p className="text-xs text-amber-200/70 leading-relaxed">
                                    The agent detected a potential race condition in the rate limiter implementation. 
                                    Consider adding a distributed lock if running in a cluster.
                                </p>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="plan" className="mt-0 space-y-6">
                         <div className="space-y-4">
                            <div className="grid gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Title</label>
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-200">
                                    feat(auth): Implement rate limiting and logging
                                </div>
                            </div>
                            <div className="grid gap-2">
                                <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Description</label>
                                <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg text-sm text-zinc-300 min-h-[100px] leading-relaxed whitespace-pre-wrap">
                                    {`Implements token bucket rate limiting for the login endpoint.\n\nChanges:\n- Added RateLimiter service\n- Integrated Redis storage\n- Added audit logging for failed attempts\n\nFixes #42`}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Subtasks Verified</label>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <CheckCircle className="size-4 text-emerald-500" />
                                    <span>Unit tests passed (12/12)</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <CheckCircle className="size-4 text-emerald-500" />
                                    <span>Linter checks passed</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-zinc-400">
                                    <AlertTriangle className="size-4 text-amber-500" />
                                    <span>Integration tests skipped (No env)</span>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </div>
            </ScrollArea>
        </Tabs>

        <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 sticky bottom-0 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
                <div className="text-xs text-zinc-500 font-medium uppercase tracking-wider">Confidence Impact</div>
                <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 w-[87%]" />
                </div>
            </div>
            <div className="flex gap-3">
                <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-white hover:bg-zinc-800">
                    Skip
                </Button>
                <Button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700">
                    Request Changes
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]" onClick={onClose}>
                    <CheckCircle className="size-4 mr-2" />
                    Approve & Deploy
                </Button>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
