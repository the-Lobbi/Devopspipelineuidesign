import React, { useState } from 'react';
import { WizardLayout } from './WizardLayout';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';
import { 
    Key, Globe, Github, Slack, RefreshCw, Shield, Check
} from 'lucide-react@0.469.0?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';
import { toast } from 'sonner@2.0.3?deps=react@18.3.1,react-dom@18.3.1&external=react,react-dom';

const PROVIDERS = [
    { id: 'jira', name: 'Jira Cloud', icon: Globe, color: 'text-blue-500', bg: 'bg-blue-500/10', border: 'border-blue-500/20' },
    { id: 'github', name: 'GitHub', icon: Github, color: 'text-zinc-200', bg: 'bg-zinc-800', border: 'border-zinc-700' },
    { id: 'slack', name: 'Slack', icon: Slack, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' },
];

const STEPS = [
    { id: 'select', title: 'Select Provider', description: 'Choose a service to connect.' },
    { id: 'configure', title: 'Configuration', description: 'Enter credentials and settings.' },
    { id: 'validate', title: 'Validation', description: 'Test and verify connection.' },
];

export function IntegrationWizard({ onCancel, onComplete }: { onCancel: () => void; onComplete: () => void }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [providerId, setProviderId] = useState<string | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleNext = () => {
        if (currentStep === 0 && !providerId) {
            toast.error("Please select a provider");
            return;
        }
        if (currentStep < STEPS.length - 1) {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handleBack = () => {
        if (currentStep > 0) {
            setCurrentStep(prev => prev - 1);
        }
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

    const handleFinish = async () => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        toast.success("Integration Added", {
            description: `${PROVIDERS.find(p => p.id === providerId)?.name} is now active.`
        });
        setIsSubmitting(false);
        onComplete();
    };

    const selectedProvider = PROVIDERS.find(p => p.id === providerId);

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return (
                    <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="grid gap-3">
                            {PROVIDERS.map(provider => (
                                <div 
                                    key={provider.id}
                                    onClick={() => setProviderId(provider.id)}
                                    className={cn(
                                        "cursor-pointer p-4 rounded-xl border flex items-center justify-between transition-all hover:bg-zinc-900",
                                        providerId === provider.id
                                            ? "border-amber-500 bg-amber-500/10" 
                                            : "border-white/10 bg-white/5"
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
                                    {providerId === provider.id && <Check className="size-5 text-amber-500" />}
                                </div>
                            ))}
                        </div>
                    </div>
                );

            case 1:
                return (
                    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                        {selectedProvider && (
                            <div className="flex items-center gap-3 p-4 rounded-lg bg-white/5 border border-white/10">
                                <selectedProvider.icon className={cn("size-6", selectedProvider.color)} />
                                <div>
                                    <div className="font-bold text-sm text-white">Configure {selectedProvider.name}</div>
                                    <div className="text-xs text-zinc-400">Enter your credentials securely.</div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-4">
                            {providerId === 'jira' && (
                                <>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Instance URL</Label>
                                        <Input className="bg-white/5 border-white/10 focus:border-amber-400/50" placeholder="https://company.atlassian.net" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">Email</Label>
                                        <Input className="bg-white/5 border-white/10 focus:border-amber-400/50" placeholder="user@company.com" />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-zinc-400">API Token</Label>
                                        <Input type="password" className="bg-white/5 border-white/10 focus:border-amber-400/50" placeholder="••••••••••••" />
                                    </div>
                                </>
                            )}
                            {providerId === 'github' && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Personal Access Token (PAT)</Label>
                                    <Input type="password" className="bg-white/5 border-white/10 focus:border-amber-400/50" placeholder="ghp_••••••••••••" />
                                    <p className="text-[10px] text-zinc-500">Requires <code>repo</code> and <code>workflow</code> scopes.</p>
                                </div>
                            )}
                            {providerId === 'slack' && (
                                <div className="space-y-2">
                                    <Label className="text-zinc-400">Bot User OAuth Token</Label>
                                    <Input type="password" className="bg-white/5 border-white/10 focus:border-amber-400/50" placeholder="xoxb-••••••••••••" />
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 2:
                return (
                    <div className="flex flex-col items-center justify-center h-full py-8 animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className={cn(
                            "size-20 rounded-full flex items-center justify-center mb-6 transition-all duration-500",
                            connectionStatus === 'success' 
                                ? "bg-emerald-500/20 text-emerald-400" 
                                : "bg-white/5 text-zinc-600"
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
                );

            default:
                return null;
        }
    };

    return (
        <WizardLayout
            title="Connect Integration"
            description="Add external services to your Golden Armada workspace."
            steps={STEPS}
            currentStep={currentStep}
            onStepClick={setCurrentStep}
            onNext={handleNext}
            onBack={handleBack}
            onFinish={handleFinish}
            isSubmitting={isSubmitting}
        >
            {renderStepContent()}
        </WizardLayout>
    );
}
