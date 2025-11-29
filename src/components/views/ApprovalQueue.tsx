import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle, XCircle, Clock, AlertCircle } from 'lucide-react';

export interface ApprovalRequest {
  id: string;
  title: string;
  description: string;
  requestedBy: string;
  requestedAt: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  type: 'deployment' | 'configuration' | 'access' | 'budget';
  status: 'pending' | 'approved' | 'rejected';
}

interface ApprovalQueueProps {
  requests?: ApprovalRequest[];
  onApprove?: (id: string) => void;
  onReject?: (id: string) => void;
}

const MOCK_REQUESTS: ApprovalRequest[] = [
  {
    id: '1',
    title: 'Deploy to Production',
    description: 'Deploy version 2.1.0 to production environment',
    requestedBy: 'DevOps Agent',
    requestedAt: '2 minutes ago',
    priority: 'high',
    type: 'deployment',
    status: 'pending',
  },
  {
    id: '2',
    title: 'Increase Budget Limit',
    description: 'Increase API call budget from $100 to $150',
    requestedBy: 'Orchestrator',
    requestedAt: '5 minutes ago',
    priority: 'medium',
    type: 'budget',
    status: 'pending',
  },
];

export function ApprovalQueue({
  requests = MOCK_REQUESTS,
  onApprove,
  onReject,
}: ApprovalQueueProps) {
  const getPriorityColor = (priority: ApprovalRequest['priority']) => {
    switch (priority) {
      case 'critical':
        return 'destructive';
      case 'high':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'low':
        return 'outline';
    }
  };

  const getTypeIcon = (type: ApprovalRequest['type']) => {
    switch (type) {
      case 'deployment':
        return '🚀';
      case 'configuration':
        return '⚙️';
      case 'access':
        return '🔐';
      case 'budget':
        return '💰';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Approval Queue
          {requests.filter((r) => r.status === 'pending').length > 0 && (
            <Badge variant="destructive" className="ml-auto">
              {requests.filter((r) => r.status === 'pending').length}
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] pr-4">
          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <CheckCircle className="h-12 w-12 mb-2" />
              <p>No pending approvals</p>
            </div>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-primary">
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-start gap-2">
                        <span className="text-2xl">{getTypeIcon(request.type)}</span>
                        <div>
                          <h4 className="font-semibold">{request.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {request.description}
                          </p>
                        </div>
                      </div>
                      <Badge variant={getPriorityColor(request.priority)}>
                        {request.priority}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="text-xs text-muted-foreground">
                        <span className="font-medium">{request.requestedBy}</span>
                        {' • '}
                        {request.requestedAt}
                      </div>
                      {request.status === 'pending' && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onReject?.(request.id)}
                            className="h-8"
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => onApprove?.(request.id)}
                            className="h-8"
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                        </div>
                      )}
                      {request.status === 'approved' && (
                        <Badge variant="default" className="bg-green-500">
                          Approved
                        </Badge>
                      )}
                      {request.status === 'rejected' && (
                        <Badge variant="destructive">Rejected</Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
