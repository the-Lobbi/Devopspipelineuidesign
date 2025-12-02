import React from 'react';
import { 
  ShieldAlert, 
  Clock, 
  AlertTriangle,
  CheckCircle,
  XCircle
} from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';

interface ApprovalQueueProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectApproval: (id: string) => void;
}

interface ApprovalItem {
  id: string;
  title: string;
  agent: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'approved' | 'rejected';
  timestamp: string;
  description: string;
}

const MOCK_APPROVALS: ApprovalItem[] = [
  {
    id: '1',
    title: 'Deploy to Production',
    agent: 'DevOps Agent',
    priority: 'high',
    status: 'pending',
    timestamp: '2 min ago',
    description: 'Requesting approval to deploy version 2.3.1 to production environment'
  },
  {
    id: '2',
    title: 'Database Migration',
    agent: 'Planner Agent',
    priority: 'high',
    status: 'pending',
    timestamp: '5 min ago',
    description: 'Schema changes require manual review before execution'
  },
  {
    id: '3',
    title: 'Budget Approval',
    agent: 'Orchestrator',
    priority: 'medium',
    status: 'pending',
    timestamp: '12 min ago',
    description: 'Cloud infrastructure costs exceeding threshold ($500/month)'
  }
];

export function ApprovalQueue({ isOpen, onClose, onSelectApproval }: ApprovalQueueProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-500/10 border-red-500/20';
      case 'medium': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'low': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      default: return 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        aria-describedby={undefined} 
        className="max-w-3xl max-h-[80vh] overflow-hidden bg-[#09090b] border-zinc-800 text-zinc-200 p-0 gap-0 flex flex-col shadow-2xl"
      >
        {/* Header */}
        <div className="p-6 border-b border-zinc-800 bg-zinc-900/50 flex items-start gap-5">
          <div className="p-3 bg-amber-500/10 rounded-xl border border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.2)]">
            <ShieldAlert className="size-6 text-amber-500 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-white tracking-tight">
                Pending Approvals
              </DialogTitle>
              <Badge variant="outline" className="bg-zinc-900 border-zinc-700 text-amber-400">
                {MOCK_APPROVALS.filter(a => a.status === 'pending').length} Pending
              </Badge>
            </div>
            <DialogDescription className="text-zinc-400 text-sm mt-1">
              Review and approve agent actions requiring human oversight
            </DialogDescription>
          </div>
        </div>
        
        {/* Content */}
        <ScrollArea className="flex-1 bg-[#0c0c0e]">
          <div className="p-6 space-y-3">
            {MOCK_APPROVALS.map((approval) => (
              <div
                key={approval.id}
                className="bg-zinc-900/50 border border-zinc-800 rounded-lg p-4 hover:border-zinc-700 transition-colors cursor-pointer"
                onClick={() => onSelectApproval(approval.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-white">{approval.title}</h3>
                      <Badge className={getPriorityColor(approval.priority)}>
                        {approval.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-zinc-400 mb-2">{approval.description}</p>
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <span className="flex items-center gap-1">
                        <Clock className="size-3" />
                        {approval.timestamp}
                      </span>
                      <span>Agent: {approval.agent}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle approve action
                      }}
                    >
                      <CheckCircle className="size-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Handle reject action
                      }}
                    >
                      <XCircle className="size-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/50 flex justify-end gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-zinc-900 border-zinc-700 text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
