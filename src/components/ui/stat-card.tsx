
import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { GlassCard } from './glass-card';

interface StatCardProps {
  label: string;
  value: string | number;
  previousValue?: string | number;
  icon?: LucideIcon;
  trend?: 'up' | 'down' | 'neutral';
  trendLabel?: string;
  accentColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  icon: Icon,
  trend,
  trendLabel,
  accentColor = "bg-blue-500",
  className
}: StatCardProps) {
  return (
    <GlassCard 
        variant="default" 
        padding="md" 
        hoverable 
        className={cn("flex flex-col justify-between overflow-hidden group", className)}
    >
        {/* Accent Line */}
        <div className={cn("absolute bottom-0 left-0 w-full h-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300", accentColor)} />

        <div className="flex items-start justify-between mb-4">
            <div className="text-sm font-medium text-zinc-400">{label}</div>
            {Icon && (
                <div className="p-2 rounded-lg bg-white/5 text-zinc-300 border border-white/5">
                    <Icon className="size-4" />
                </div>
            )}
        </div>

        <div>
            <div className="text-3xl font-bold text-zinc-100 tracking-tight mb-1">
                {value}
            </div>
            
            {(trend || trendLabel) && (
                <div className="flex items-center gap-2 text-xs">
                    {trend === 'up' && <TrendingUp className="size-3 text-emerald-400" />}
                    {trend === 'down' && <TrendingDown className="size-3 text-red-400" />}
                    {trend === 'neutral' && <Minus className="size-3 text-zinc-500" />}
                    
                    <span className={cn(
                        trend === 'up' ? "text-emerald-400" :
                        trend === 'down' ? "text-red-400" :
                        "text-zinc-500"
                    )}>
                        {trendLabel}
                    </span>
                </div>
            )}
        </div>
    </GlassCard>
  );
}
