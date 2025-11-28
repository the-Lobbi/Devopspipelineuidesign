
import React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'bordered' | 'gradient';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hoverable?: boolean;
  clickable?: boolean;
}

export function GlassCard({ 
  variant = 'default', 
  padding = 'md', 
  hoverable = false, 
  clickable = false,
  className, 
  children,
  ...props 
}: GlassCardProps) {
  
  const variants = {
    default: "bg-[hsla(0,0%,12%,0.7)] border-white/10 shadow-lg backdrop-blur-xl",
    elevated: "bg-[hsla(0,0%,16%,0.8)] border-white/10 shadow-xl backdrop-blur-2xl",
    bordered: "bg-transparent border-white/20 shadow-sm backdrop-blur-md",
    gradient: "gradient-border bg-[hsla(0,0%,10%,0.9)] shadow-lg backdrop-blur-xl",
  };

  const paddings = {
    none: "p-0",
    sm: "p-3",
    md: "p-5",
    lg: "p-8",
  };

  return (
    <div 
      className={cn(
        "relative rounded-2xl border transition-all duration-300",
        variants[variant],
        paddings[padding],
        hoverable && "hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] hover:border-white/20",
        clickable && "cursor-pointer active:scale-[0.98]",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
