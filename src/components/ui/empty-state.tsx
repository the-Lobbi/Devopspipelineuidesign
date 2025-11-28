
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({ 
  icon: Icon, 
  title, 
  description, 
  actionLabel, 
  onAction,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-8 text-center border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20", className)}>
      <div className="p-4 rounded-full bg-zinc-900 mb-4 border border-zinc-800">
        <Icon className="size-8 text-zinc-500" />
      </div>
      <h3 className="text-lg font-medium text-zinc-200 mb-2">{title}</h3>
      <p className="text-sm text-zinc-500 max-w-xs mb-6 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction} variant="outline" className="border-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-800">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
