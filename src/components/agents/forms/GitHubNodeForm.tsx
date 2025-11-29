import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { GitBranch, Github, Users } from 'lucide-react';

export function GitHubNodeForm({ node, onChange }: { node: any, onChange: (data: any) => void }) {
    return (
        <div className="space-y-6 p-1">
             <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Repository Config</h4>
                
                <div className="grid gap-2">
                    <Label className="text-xs text-zinc-400">Repository</Label>
                    <Select defaultValue="golden-armada">
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-300 h-8 text-xs">
                            <SelectValue placeholder="Select repo" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="golden-armada">the-lobbi/golden-armada</SelectItem>
                            <SelectItem value="core-api">the-lobbi/core-api</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="grid gap-2">
                        <Label className="text-xs text-zinc-400">Base Branch</Label>
                         <div className="relative">
                            <GitBranch className="absolute left-2.5 top-2 size-3.5 text-zinc-600" />
                            <Input 
                                className="bg-zinc-900/50 border-zinc-800 text-zinc-300 h-8 text-xs pl-8 font-mono" 
                                defaultValue="main"
                            />
                        </div>
                    </div>
                    <div className="grid gap-2">
                        <Label className="text-xs text-zinc-400">Target Prefix</Label>
                        <Input 
                            className="bg-zinc-900/50 border-zinc-800 text-zinc-300 h-8 text-xs font-mono" 
                            defaultValue="feature/"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Review Process</h4>
                
                <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/20">
                    <div className="space-y-0.5">
                        <Label className="text-xs text-zinc-300">Require Approval</Label>
                        <p className="text-[10px] text-zinc-500">Human review before creation</p>
                    </div>
                    <Switch id="approval" defaultChecked />
                </div>

                 <div className="grid gap-2">
                    <Label className="text-xs text-zinc-400">Default Reviewers</Label>
                    <div className="flex items-center gap-2 p-2 bg-zinc-900/50 border border-zinc-800 rounded-md text-xs text-zinc-400">
                        <Users className="size-3.5" />
                        <span>@security-team, @tech-leads</span>
                    </div>
                </div>
            </div>
        </div>
    );
}