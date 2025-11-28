
import React from 'react';
import { cn } from '@/lib/utils';
import { METRICS } from '@/lib/data';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';

export function MetricsBar() {
  return (
    <div className="w-full p-6 pb-2">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Dashboard</h1>
            <p className="text-zinc-500 text-sm">Overview of your DevOps pipeline performance</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 rounded-full border border-emerald-500/20">
            <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-medium text-emerald-400">System Operational</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {METRICS.map((metric, index) => {
            const isPositive = metric.trend.includes('▲');
            const isWarning = metric.status === 'warning';
            
            return (
              <div 
                key={index}
                className="p-5 rounded-2xl bg-[#121214] hover:bg-[#18181b] transition-colors border border-zinc-800/50 group"
              >
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-zinc-400">{metric.label}</span>
                    <div className={cn(
                        "p-1.5 rounded-lg",
                        metric.status === 'warning' ? "bg-amber-500/10 text-amber-500" : 
                        metric.status === 'error' ? "bg-red-500/10 text-red-500" :
                        "bg-zinc-800 text-zinc-400"
                    )}>
                        <Activity className="size-4" />
                    </div>
                </div>
                
                <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-bold text-zinc-100">{metric.value}</span>
                    <span className={cn(
                        "text-xs font-medium flex items-center",
                        isPositive ? "text-emerald-400" : "text-zinc-500"
                    )}>
                        {isPositive ? <ArrowUpRight className="size-3 mr-1" /> : <ArrowDownRight className="size-3 mr-1" />}
                        {metric.trend}
                    </span>
                </div>
              </div>
            );
        })}
      </div>
    </div>
  );
}
