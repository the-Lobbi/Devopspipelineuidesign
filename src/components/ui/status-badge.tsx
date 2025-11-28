
import React from 'react';
import { cn } from '@/lib/utils';
import { 
  Circle, 
  Brain, 
  Eye, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { EpicState } from '@/lib/types';

interface StatusBadgeProps {
  status: EpicState | string;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  animated?: boolean;
  className?: string;
}

export function StatusBadge({ 
  status, 
  size = 'md', 
  showIcon = true, 
  animated = true,
  className 
}: StatusBadgeProps) {
  
  const getStatusConfig = (s: string) => {
    switch (s.toLowerCase()) {
      case 'open': return { color: 'text-blue-400 bg-blue-400/10 border-blue-400/20', icon: Circle };
      case 'planning': return { color: 'text-violet-400 bg-violet-400/10 border-violet-400/20', icon: Brain };
      case 'planning_review': return { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Eye };
      case 'executing': return { color: 'text-sky-400 bg-sky-400/10 border-sky-400/20', icon: Loader2 };
      case 'review': return { color: 'text-amber-400 bg-amber-400/10 border-amber-400/20', icon: Eye };
      case 'code_review': return { color: 'text-purple-400 bg-purple-400/10 border-purple-400/20', icon: Eye };
      case 'done': return { color: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20', icon: CheckCircle2 };
      case 'failed': return { color: 'text-red-400 bg-red-400/10 border-red-400/20', icon: XCircle };
      default: return { color: 'text-zinc-400 bg-zinc-400/10 border-zinc-400/20', icon: Circle };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-1.5 py-0.5 text-[10px] gap-1',
    md: 'px-2.5 py-0.5 text-xs gap-1.5',
    lg: 'px-3 py-1 text-sm gap-2',
  };

  const isExecuting = status.toLowerCase() === 'executing';

  return (
    <span className={cn(
      "inline-flex items-center rounded-full border font-medium transition-all duration-200 hover:brightness-110",
      config.color,
      sizeClasses[size],
      animated && isExecuting && "animate-pulse",
      className
    )}>
      {showIcon && (
        <Icon className={cn(
          "shrink-0", 
          size === 'sm' ? "size-3" : size === 'md' ? "size-3.5" : "size-4",
          animated && isExecuting && "animate-spin"
        )} />
      )}
      <span className="uppercase tracking-wide">{status.replace(/_/g, ' ')}</span>
    </span>
  );
}
