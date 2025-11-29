import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Play, Clock, Shield, Terminal } from 'lucide-react';

interface RunPipelineModalProps {
    isOpen: boolean;
    onClose: () => void;
    onRun: (config: any) => void;
}

export function RunPipelineModal({ isOpen, onClose, onRun }: RunPipelineModalProps) {
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-200 sm:max-w-[500px] p-0 gap-0 overflow-hidden">
                <div className="p-6 border-b border-zinc-800 bg-zinc-900/30">
                    <DialogTitle className="text-lg font-bold text-zinc-100 flex items-center gap-2">
                        <Play className="size-4 text-indigo-400 fill-indigo-400/20" />
                        Run Pipeline
                    </DialogTitle>
                    <DialogDescription className="text-zinc-500 mt-1">
                        Configure execution parameters for "Epic to PR Pipeline"
                    </DialogDescription>
                </div>

                <div className="p-6 space-y-6">
                    {/* Input Parameters */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Terminal className="size-3.5" /> Input Parameters
                        </h4>
                        <div className="grid gap-4">
                            <div className="grid gap-2">
                                <Label className="text-xs text-zinc-400">Epic Key</Label>
                                <Input className="bg-zinc-900 border-zinc-800 font-mono text-sm" placeholder="GA-101" defaultValue="GA-33" />
                            </div>
                            <div className="grid gap-2">
                                <Label className="text-xs text-zinc-400">Target Sprint</Label>
                                <Select defaultValue="current">
                                    <SelectTrigger className="bg-zinc-900 border-zinc-800 text-zinc-300">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="bg-zinc-900 border-zinc-800">
                                        <SelectItem value="current">Sprint 24 (Current)</SelectItem>
                                        <SelectItem value="next">Sprint 25</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    {/* Environment */}
                    <div className="space-y-4">
                        <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                            <Shield className="size-3.5" /> Environment
                        </h4>
                        <div className="p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg space-y-4">
                             <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Execution Env</Label>
                                    <Select defaultValue="dev">
                                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="dev">Development</SelectItem>
                                            <SelectItem value="staging">Staging</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-xs text-zinc-400">Log Level</Label>
                                    <Select defaultValue="info">
                                        <SelectTrigger className="bg-zinc-950 border-zinc-800 h-8 text-xs">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-zinc-900 border-zinc-800">
                                            <SelectItem value="info">Info</SelectItem>
                                            <SelectItem value="debug">Debug</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                             </div>
                        </div>
                    </div>

                    {/* Options */}
                    <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/20">
                        <div className="space-y-0.5">
                            <Label className="text-sm text-zinc-300">Dry Run Mode</Label>
                            <p className="text-xs text-zinc-500">Simulate execution without side effects</p>
                        </div>
                        <Switch />
                    </div>
                </div>

                <DialogFooter className="p-4 border-t border-zinc-800 bg-zinc-900/30">
                    <Button variant="ghost" onClick={onClose} className="text-zinc-400 hover:text-zinc-200">Cancel</Button>
                    <div className="flex gap-2">
                        <Button variant="outline" className="border-zinc-700 text-zinc-300 bg-transparent hover:bg-zinc-800">
                            <Clock className="size-3.5 mr-2" /> Schedule
                        </Button>
                        <Button 
                            className="bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)] transition-shadow hover:shadow-[0_0_25px_rgba(99,102,241,0.5)]"
                            onClick={() => {
                                onRun({});
                                onClose();
                            }}
                        >
                            <Play className="size-3.5 mr-2 fill-current" /> Run Pipeline
                        </Button>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}