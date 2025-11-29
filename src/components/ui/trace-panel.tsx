import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { ScrollArea } from './scroll-area';
import { Badge } from './badge';
import { Button } from './button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
import {
  Activity,
  ChevronRight,
  ChevronDown,
  Clock,
  Zap,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import { cn } from '../../lib/utils';

export interface TraceSpan {
  id: string;
  name: string;
  agent: string;
  startTime: string;
  duration: string;
  status: 'success' | 'error' | 'running';
  children?: TraceSpan[];
  metadata?: Record<string, any>;
}

interface TracePanelProps {
  spans?: TraceSpan[];
  onSpanClick?: (span: TraceSpan) => void;
}

const MOCK_SPANS: TraceSpan[] = [
  {
    id: '1',
    name: 'Initialize Pipeline',
    agent: 'Orchestrator',
    startTime: '14:32:01',
    duration: '2.4s',
    status: 'success',
    children: [
      {
        id: '1-1',
        name: 'Load Configuration',
        agent: 'Orchestrator',
        startTime: '14:32:01',
        duration: '0.5s',
        status: 'success',
      },
      {
        id: '1-2',
        name: 'Validate Schema',
        agent: 'Orchestrator',
        startTime: '14:32:01',
        duration: '1.9s',
        status: 'success',
      },
    ],
  },
  {
    id: '2',
    name: 'Execute Planner Agent',
    agent: 'Planner Agent',
    startTime: '14:32:03',
    duration: '8.1s',
    status: 'success',
    children: [
      {
        id: '2-1',
        name: 'Analyze Dependencies',
        agent: 'Planner Agent',
        startTime: '14:32:03',
        duration: '3.2s',
        status: 'success',
      },
      {
        id: '2-2',
        name: 'Generate Plan',
        agent: 'Planner Agent',
        startTime: '14:32:06',
        duration: '4.9s',
        status: 'success',
      },
    ],
  },
  {
    id: '3',
    name: 'Code Generation',
    agent: 'Code Generator',
    startTime: '14:32:11',
    duration: '-',
    status: 'running',
  },
];

function TraceSpanRow({
  span,
  level = 0,
  onSpanClick,
}: {
  span: TraceSpan;
  level?: number;
  onSpanClick?: (span: TraceSpan) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const hasChildren = span.children && span.children.length > 0;

  const getStatusIcon = () => {
    switch (span.status) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'running':
        return <Activity className="h-4 w-4 text-blue-500 animate-pulse" />;
    }
  };

  return (
    <>
      <div
        className={cn(
          'flex items-center gap-2 p-2 hover:bg-accent rounded cursor-pointer',
          'border-l-2',
          span.status === 'success' && 'border-l-green-500',
          span.status === 'error' && 'border-l-red-500',
          span.status === 'running' && 'border-l-blue-500'
        )}
        style={{ paddingLeft: `${level * 24 + 8}px` }}
        onClick={() => onSpanClick?.(span)}
      >
        {hasChildren && (
          <Button
            variant="ghost"
            size="sm"
            className="h-4 w-4 p-0"
            onClick={(e) => {
              e.stopPropagation();
              setExpanded(!expanded);
            }}
          >
            {expanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        )}
        {!hasChildren && <div className="w-4" />}
        <div className="flex-1 flex items-center gap-2">
          {getStatusIcon()}
          <span className="font-medium text-sm">{span.name}</span>
          <Badge variant="outline" className="text-xs">
            {span.agent}
          </Badge>
        </div>
        <div className="flex items-center gap-3 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {span.startTime}
          </span>
          <span className="flex items-center gap-1">
            <Zap className="h-3 w-3" />
            {span.duration}
          </span>
        </div>
      </div>
      {expanded &&
        hasChildren &&
        span.children?.map((child) => (
          <TraceSpanRow
            key={child.id}
            span={child}
            level={level + 1}
            onSpanClick={onSpanClick}
          />
        ))}
    </>
  );
}

export function TracePanel({ spans = MOCK_SPANS, onSpanClick }: TracePanelProps) {
  const [selectedView, setSelectedView] = useState<'tree' | 'timeline'>('tree');

  const totalDuration = spans.reduce((acc, span) => {
    const duration = parseFloat(span.duration.replace('s', ''));
    return acc + (isNaN(duration) ? 0 : duration);
  }, 0);

  const successCount = spans.filter((s) => s.status === 'success').length;
  const errorCount = spans.filter((s) => s.status === 'error').length;
  const runningCount = spans.filter((s) => s.status === 'running').length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Execution Trace
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="bg-green-500/10">
              {successCount} success
            </Badge>
            {runningCount > 0 && (
              <Badge variant="outline" className="bg-blue-500/10">
                {runningCount} running
              </Badge>
            )}
            {errorCount > 0 && (
              <Badge variant="outline" className="bg-red-500/10">
                {errorCount} errors
              </Badge>
            )}
            <span className="text-sm text-muted-foreground">
              Total: {totalDuration.toFixed(1)}s
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={selectedView} onValueChange={(v) => setSelectedView(v as any)}>
          <TabsList className="mb-4">
            <TabsTrigger value="tree">Tree View</TabsTrigger>
            <TabsTrigger value="timeline">Timeline</TabsTrigger>
          </TabsList>

          <TabsContent value="tree">
            <ScrollArea className="h-[400px]">
              <div className="space-y-1">
                {spans.map((span) => (
                  <TraceSpanRow key={span.id} span={span} onSpanClick={onSpanClick} />
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="timeline">
            <ScrollArea className="h-[400px]">
              <div className="space-y-2">
                {spans.map((span, idx) => (
                  <div key={span.id} className="flex items-center gap-2">
                    <div className="w-20 text-xs text-muted-foreground text-right">
                      {span.startTime}
                    </div>
                    <div className="flex-1">
                      <div
                        className={cn(
                          'h-8 rounded px-3 flex items-center justify-between',
                          span.status === 'success' && 'bg-green-500/20',
                          span.status === 'error' && 'bg-red-500/20',
                          span.status === 'running' && 'bg-blue-500/20'
                        )}
                      >
                        <span className="text-sm font-medium">{span.name}</span>
                        <span className="text-xs">{span.duration}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
