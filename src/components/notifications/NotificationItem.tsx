
import React from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationItemProps {
  title: string;
  description: string;
  timestamp: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  onClick: () => void;
}

export function NotificationItem({ title, description, timestamp, type, read, onClick }: NotificationItemProps) {
  const config = {
    info: { icon: Info, color: 'text-blue-400' },
    success: { icon: CheckCircle2, color: 'text-emerald-400' },
    warning: { icon: AlertTriangle, color: 'text-amber-400' },
    error: { icon: XCircle, color: 'text-red-400' },
  };

  const { icon: Icon, color } = config[type];

  return (
    <div 
        onClick={onClick}
        className={cn(
            "flex gap-3 p-3 rounded-lg transition-colors cursor-pointer relative",
            read ? "bg-transparent hover:bg-zinc-900/50" : "bg-zinc-900/30 hover:bg-zinc-900"
        )}
    >
      {!read && (
        <span className="absolute right-2 top-2 size-2 rounded-full bg-violet-500 animate-pulse" />
      )}
      
      <div className={cn("mt-0.5 shrink-0", color)}>
        <Icon className="size-4" />
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-0.5">
            <h4 className={cn("text-sm font-medium truncate", read ? "text-zinc-400" : "text-zinc-200")}>
                {title}
            </h4>
            <span className="text-[10px] text-zinc-600">{timestamp}</span>
        </div>
        <p className="text-xs text-zinc-500 line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
