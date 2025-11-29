import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, RefreshCw, Search } from 'lucide-react';

export function JiraNodeForm({ node, onChange }: { node: any, onChange: (data: any) => void }) {
    return (
        <div className="space-y-6 p-1">
            <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Configuration</h4>
                
                <div className="grid gap-2">
                    <Label className="text-xs text-zinc-400">Jira Instance</Label>
                    <Select defaultValue="corp-jira">
                        <SelectTrigger className="bg-zinc-900/50 border-zinc-800 text-zinc-300 h-8 text-xs">
                            <SelectValue placeholder="Select instance" />
                        </SelectTrigger>
                        <SelectContent className="bg-zinc-900 border-zinc-800">
                            <SelectItem value="corp-jira">corp.atlassian.net</SelectItem>
                            <SelectItem value="dev-jira">dev.atlassian.net</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="grid gap-2">
                    <Label className="text-xs text-zinc-400">Epic Key</Label>
                    <div className="flex gap-2">
                        <Input 
                            className="bg-zinc-900/50 border-zinc-800 text-zinc-300 h-8 text-xs font-mono" 
                            placeholder="PROJ-123"
                            defaultValue={node.data?.epicKey}
                            onChange={(e) => onChange({ ...node.data, epicKey: e.target.value })}
                        />
                        <Button size="icon" variant="outline" className="h-8 w-8 border-zinc-800 bg-zinc-900/50">
                            <Search className="size-3.5 text-zinc-500" />
                        </Button>
                    </div>
                </div>

                <div className="flex items-center justify-between p-3 border border-zinc-800 rounded-lg bg-zinc-900/20">
                    <div className="space-y-0.5">
                        <Label className="text-xs text-zinc-300">Include Subtasks</Label>
                        <p className="text-[10px] text-zinc-500">Parse full hierarchy</p>
                    </div>
                    <Switch id="subtasks" defaultChecked />
                </div>
            </div>

            <div className="space-y-4">
                <h4 className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Advanced Filter</h4>
                <div className="grid gap-2">
                    <Label className="text-xs text-zinc-400">JQL Query (Optional)</Label>
                    <Textarea 
                        className="bg-zinc-900/50 border-zinc-800 text-zinc-300 text-xs font-mono min-h-[80px] resize-none" 
                        placeholder="project = 'GA' AND status = 'To Do'..."
                    />
                </div>
            </div>

            <div className="pt-4 border-t border-zinc-800">
                 <Button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs h-8">
                    <RefreshCw className="size-3.5 mr-2" /> Test Connection
                </Button>
            </div>
        </div>
    );
}