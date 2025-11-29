import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { 
    Key, ArrowRight, Check, Globe, Lock, Shield, 
    Github, Slack, RefreshCw, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface IntegrationWizardProps {
    isOpen: boolean;
    onClose: () => void;
}

const PROVIDERS = [
    { id: 'jira', name: 'Jira Cloud', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-zinc-200', bg: 'bg-zinc-800', border: 'border-zinc-700' },
    { id: 'slack', name: 'Slack', icon: Slack, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

export function IntegrationWizard({ isOpen, onClose }: IntegrationWizardProps) {
    const [step, setStep] = useState(1);
    const [providerId, setProviderId] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleNext = () => {
        if (step < 3) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 1) setStep(step - 1);
    };

    const handleTestConnection = () => {
        setIsValidating(true);
        setConnectionStatus('idle');
        setTimeout(() => {
            setIsValidating(false);
            setConnectionStatus('success');
            toast.success("Connection Verified");
        }, 1500);
    };

    const handleFinish = () => {
        onClose();
        setStep(1);
        setConnectionStatus('idle');
        setProviderId(null);
        toast.success("Integration Added", {
            description: `${PROVIDERS.find(p => p.id === providerId)?.name} is now active.`
        });
    };

    const selectedProvider = PROVIDERS.find(p => p.id === providerId);

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[600px] h-[500px] p-0 gap-0 flex flex-col overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <div className="flex items-center justify-between mb-6">
                        <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                            <Key className="size-4 text-violet-400" />
                            Connect Integration
                        </DialogTitle>
                        <div className="text-xs font-mono text-zinc-500">
                            STEP {step} OF 3
                        </div>
                    </div>

                    {/* Progress */}
                    <div className="flex gap-2">
                        {[1, 2, 3].map(n => (
                            <div key={n} className={cn(
                                "h-1 flex-1 rounded-full transition-colors",
                                step >= n ? "bg-violet-500" : "bg-zinc-800"
                            )} />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <ScrollArea className="flex-1 bg-[#09090b]">
                    <div className="p-8">
                        {step === 1 && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
                                <div className="text-sm text-zinc-400 mb-4">Select a platform to connect:</div>
                                <div className="grid gap-3">
                                    {PROVIDERS.map(provider => (
                                        <div 
                                            key={provider.id}
                                            onClick={() => setProviderId(provider.id)}
                                            className={cn(
                                                "cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all hover:bg-zinc-900",
                                                providerId === provider.id
                                                    ? `border-violet-500 bg-violet-500/5` 
                                                    : "border-zinc-800 bg-zinc-900/20"
                                            )}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div className={cn("p-2 rounded-lg border", provider.bg, provider.border)}>
                                                    <provider.icon className={cn("size-5", provider.color)} />
                                                </div>
                                                <div>
                                                    <div className="font-bold text-zinc-200">{provider.name}</div>
                                                    <div className="text-xs text-zinc-500">Connect via OAuth or API Token</div>
                                                </div>
                                            </div>
                                            {providerId === provider.id && <Check className="size-5 text-violet-500" />}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {step === 2 && selectedProvider && (
                            <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                                <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-900 border border-zinc-800">
                                    <selectedProvider.icon className={cn("size-6", selectedProvider.color)} />
                                    <div>
                                        <div className="font-bold text-sm">Configure {selectedProvider.name}</div>
                                        <div className="text-xs text-zinc-500">Enter your credentials securely.</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {providerId === 'jira' && (
                                        <>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-400">Instance URL</Label>
                                                <Input className="bg-zinc-950 border-zinc-800" placeholder="https://company.atlassian.net" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-400">Email</Label>
                                                <Input className="bg-zinc-950 border-zinc-800" placeholder="user@company.com" />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="text-zinc-400">API Token</Label>
                                                <Input type="password" className="bg-zinc-950 border-zinc-800" placeholder="••••••••••••" />
                                            </div>
                                        </>
                                    )}
                                    {providerId === 'github' && (
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">Personal Access Token (PAT)</Label>
                                            <Input type="password" className="bg-zinc-950 border-zinc-800" placeholder="ghp_••••••••••••" />
                                            <p className="text-[10px] text-zinc-500">Requires <code>repo</code> and <code>workflow</code> scopes.</p>
                                        </div>
                                    )}
                                    {providerId === 'slack' && (
                                        <div className="space-y-2">
                                            <Label className="text-zinc-400">Bot User OAuth Token</Label>
                                            <Input type="password" className="bg-zinc-950 border-zinc-800" placeholder="xoxb-••••••••••••" />
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {step === 3 && selectedProvider && (
                            <div className="flex flex-col items-center justify-center h-full py-8 animate-in fade-in slide-in-from-right-4">
                                <div className={cn(
                                    "size-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500",
                                    connectionStatus === 'success' 
                                        ? "bg-emerald-500/20 text-emerald-400" 
                                        : "bg-zinc-900 text-zinc-600"
                                )}>
                                    {isValidating ? (
                                        <RefreshCw className="size-8 animate-spin" />
                                    ) : connectionStatus === 'success' ? (
                                        <Check className="size-10" />
                                    ) : (
                                        <Shield className="size-10" />
                                    )}
                                </div>

                                <h3 className="text-lg font-bold text-zinc-200 mb-2">
                                    {connectionStatus === 'success' ? 'Ready to Connect' : 'Validate Credentials'}
                                </h3>
                                <p className="text-sm text-zinc-500 text-center max-w-[250px] mb-8">
                                    {connectionStatus === 'success' 
                                        ? "Connection verified successfully. Click Finish to save."
                                        : "Test the connection to ensure permissions are correct."}
                                </p>

                                {connectionStatus !== 'success' && (
                                    <Button 
                                        onClick={handleTestConnection}
                                        disabled={isValidating}
                                        className="w-full max-w-[200px] bg-zinc-800 hover:bg-zinc-700 text-zinc-200"
                                    >
                                        {isValidating ? 'Verifying...' : 'Test Connection'}
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                </ScrollArea>

                {/* Footer */}
                <div className="p-6 border-t border-zinc-800 bg-zinc-900/50 flex items-center justify-between">
                    <Button 
                        variant="ghost" 
                        onClick={step === 1 ? onClose : handleBack}
                        className="text-zinc-400 hover:text-zinc-200"
                    >
                        {step === 1 ? 'Cancel' : 'Back'}
                    </Button>
                    
                    {step < 3 ? (
                        <Button 
                            onClick={handleNext}
                            disabled={!providerId}
                            className="bg-zinc-100 hover:bg-white text-zinc-900"
                        >
                            Next Step <ArrowRight className="size-4 ml-2" />
                        </Button>
                    ) : (
                        <Button 
                            onClick={handleFinish}
                            disabled={connectionStatus !== 'success'}
                            className="bg-violet-600 hover:bg-violet-500 text-white shadow-[0_0_15px_rgba(139,92,246,0.3)]"
                        >
                            Finish Setup <Check className="size-4 ml-2" />
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}