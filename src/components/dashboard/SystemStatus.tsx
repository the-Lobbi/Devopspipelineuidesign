import React from 'react';
import { useConnectionStatus, useServices } from '@/lib/store';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Activity, Wifi, WifiOff, AlertCircle, CheckCircle2, Clock, Server } from 'lucide-react';
import { cn } from '@/lib/utils';

export function SystemStatus() {
  const status = useConnectionStatus();
  const services = useServices();

  const config = {
    connecting: { color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/20', icon: Activity, label: 'Connecting' },
    connected: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20', icon: Wifi, label: 'System Operational' },
    disconnected: { color: 'text-zinc-500', bg: 'bg-zinc-500/10', border: 'border-zinc-500/20', icon: WifiOff, label: 'Disconnected' },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', border: 'border-red-500/20', icon: AlertCircle, label: 'Connection Error' },
  };

  const current = config[status];
  const Icon = current.icon;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className={cn(
          "flex items-center gap-2 px-3 py-1 rounded-full border transition-all duration-300 hover:brightness-110 cursor-pointer",
          current.bg,
          current.border
        )}>
          <div className="relative flex items-center justify-center">
            <Icon className={cn("size-3.5", current.color)} />
            {status === 'connected' && (
              <span className="absolute inset-0 rounded-full animate-ping bg-emerald-500 opacity-20" />
            )}
          </div>
          <span className={cn("text-xs font-medium", current.color)}>
            {current.label}
          </span>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#121214] border-zinc-800 p-0" align="end">
        <div className="p-4 border-b border-zinc-800 bg-[#09090b]">
           <div className="flex items-center justify-between mb-1">
               <span className="text-sm font-medium text-zinc-100">System Health</span>
               <span className={cn("text-xs px-2 py-0.5 rounded-full bg-zinc-900 border", current.border, current.color)}>
                   {current.label}
               </span>
           </div>
           <div className="text-xs text-zinc-500">
               Real-time telemetry from fleet nodes.
           </div>
        </div>
        <div className="p-2">
            {services.map((service) => (
                <div key={service.name} className="flex items-center justify-between p-2 rounded hover:bg-zinc-900/50 transition-colors">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "size-2 rounded-full",
                            service.status === 'operational' ? "bg-emerald-500 shadow-[0_0_8px_#10b981]" :
                            service.status === 'degraded' ? "bg-amber-500" : "bg-red-500"
                        )} />
                        <div>
                            <div className="text-sm text-zinc-200">{service.name}</div>
                            <div className="text-[10px] text-zinc-500 flex items-center gap-2">
                                <span className="flex items-center gap-1"><Clock className="size-3" /> {service.lastCheck}</span>
                            </div>
                        </div>
                    </div>
                    <div className="text-xs font-mono text-zinc-500">
                        {service.latency}
                    </div>
                </div>
            ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
