
import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  colorClass?: string;
  className?: string;
}

export function ProgressBar({ 
  value, 
  max = 100, 
  size = 'md', 
  showLabel = false,
  colorClass = "bg-blue-500",
  className 
}: ProgressBarProps) {
  
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));
  
  const heights = {
    sm: "h-1",
    md: "h-2",
    lg: "h-3",
  };

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between text-xs mb-1.5">
          <span className="text-zinc-400 font-medium">Progress</span>
          <span className="text-zinc-200 font-mono">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className={cn("w-full bg-zinc-800 rounded-full overflow-hidden", heights[size])}>
        <div 
          className={cn(
            "h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden",
            colorClass
          )}
          style={{ width: `${percentage}%` }}
        >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/20 skew-x-[-20deg] -translate-x-full animate-[shimmer_2s_infinite]" />
        </div>
      </div>
    </div>
  );
}
