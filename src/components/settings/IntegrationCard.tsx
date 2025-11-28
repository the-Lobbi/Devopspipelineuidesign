
import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, AlertTriangle, Settings, Globe } from 'lucide-react';
import { GlassCard } from '@/components/ui/glass-card';

interface IntegrationCardProps {
  name: string;
  icon: React.ElementType;
  status: 'connected' | 'disconnected' | 'error';
  description: string;
  meta?: string;
  onConnect?: () => void;
  onConfigure?: () => void;
}

export function IntegrationCard({ 
  name, 
  icon: Icon, 
  status, 
  description, 
  meta,
  onConnect,
  onConfigure
}: IntegrationCardProps) {
  
  const statusConfig = {
    connected: { color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2, label: 'Connected' },
    disconnected: { color: 'text-zinc-500', bg: 'bg-zinc-500/10', icon: XCircle, label: 'Disconnected' },
    error: { color: 'text-red-500', bg: 'bg-red-500/10', icon: AlertTriangle, label: 'Connection Error' },
  };

  const currentStatus = statusConfig[status];
  const StatusIcon = currentStatus.icon;

  return (
    <GlassCard variant="bordered" className="p-5 flex flex-col justify-between">
        <div>
            <div className="flex items-start justify-between mb-4">
                <div className="p-2.5 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-300">
                    <Icon className="size-6" />
                </div>
                <div className={cn(
                    "flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium border",
                    currentStatus.bg,
                    currentStatus.color,
                    status === 'connected' ? 'border-emerald-500/20' : 'border-zinc-800'
                )}>
                    <StatusIcon className="size-3" />
                    {currentStatus.label}
                </div>
            </div>
            
            <h3 className="text-base font-medium text-zinc-200 mb-1">{name}</h3>
            <p className="text-sm text-zinc-500 mb-4 min-h-[2.5em]">{description}</p>
            
            {meta && (
                <div className="flex items-center gap-2 text-xs text-zinc-500 mb-4">
                    <Globe className="size-3" />
                    <span className="truncate max-w-[200px]">{meta}</span>
                </div>
            )}
        </div>

        <div className="flex gap-2 mt-2">
            {status === 'connected' ? (
                <>
                    <Button variant="outline" size="sm" className="w-full border-zinc-700 text-zinc-300 hover:text-white" onClick={onConfigure}>
                        <Settings className="size-3.5 mr-2" />
                        Configure
                    </Button>
                    <Button variant="ghost" size="sm" className="w-8 px-0 text-zinc-500 hover:text-red-400">
                        <XCircle className="size-4" />
                    </Button>
                </>
            ) : (
                <Button variant="default" size="sm" className="w-full bg-zinc-100 text-zinc-950 hover:bg-white" onClick={onConnect}>
                    Connect
                </Button>
            )}
        </div>
    </GlassCard>
  );
}
