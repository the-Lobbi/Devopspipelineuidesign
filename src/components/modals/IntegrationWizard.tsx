import React, { useState } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';
import { WizardLayout } from '../wizards/WizardLayout';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { cn } from '../../lib/utils';
import { 
    Key, Globe, Github, Slack, RefreshCw, Check, Shield, AlertCircle 
} from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

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
    const [step, setStep] = useState(0);
    const [providerId, setProviderId] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const steps = [
        { id: 'select', title: 'Select Platform', description: 'Choose an integration provider' },
        { id: 'configure', title: 'Configuration', description: 'Enter credentials securely' },
        { id: 'verify', title: 'Verification', description: 'Test and validate connection' }
    ];

    const handleNext = () => {
        if (step < steps.length - 1) setStep(step + 1);
    };

    const handleBack = () => {
        if (step > 0) setStep(step - 1);
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
        setStep(0);
        setConnectionStatus('idle');
        setProviderId(null);
        toast.success("Integration Added", {
            description: `${PROVIDERS.find(p => p.id === providerId)?.name} is now active.`
        });
    };

    const selectedProvider = PROVIDERS.find(p => p.id === providerId);

    const isNextDisabled = 
        (step === 0 && !providerId) ||
        (step === 2 && connectionStatus !== 'success');

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-4xl h-[600px] p-0 bg-zinc-950 border-zinc-800 overflow-hidden">
                <WizardLayout
                    title="Connect Integration"
                    description="Add new capabilities to your agent fleet"
                    steps={steps}
                    currentStep={step}
                    onNext={handleNext}
                    onBack={handleBack}
                    onFinish={handleFinish}
                    isSubmitting={isValidating}
                    isNextDisabled={isNextDisabled}
                    className="min-h-0 h-full border-none shadow-none rounded-none bg-transparent"
                >
                    <div className="space-y-6">
                        {step === 0 && (
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

                        {step === 1 && selectedProvider && (
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

                        {step === 2 && selectedProvider && (
                            <div className="flex flex-col items-center justify-center py-8 animate-in fade-in slide-in-from-right-4">
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
                                        ? "Connection verified successfully. Click Complete to save."
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
                </WizardLayout>
            </DialogContent>
        </Dialog>
    );
}
