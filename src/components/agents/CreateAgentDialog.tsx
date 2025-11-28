import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Bot, Terminal, Shield, Search, Server } from 'lucide-react';

interface CreateAgentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (agent: any) => void;
}

export function CreateAgentDialog({ open, onOpenChange, onCreate }: CreateAgentDialogProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;
    const role = formData.get('role') as string;
    const model = formData.get('model') as string;

    onCreate({
      name,
      role,
      model,
      status: 'idle',
      activity: 'Initializing...',
      children: []
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Bot className="size-5 text-violet-500" />
            Provision New Agent
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-400">Agent Name</Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="e.g. Security Auditor" 
              className="bg-zinc-900 border-zinc-800 text-zinc-100 focus:ring-violet-500 focus:border-violet-500" 
              required 
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
                <Label htmlFor="role" className="text-zinc-400">Role</Label>
                <Select name="role" defaultValue="coder">
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="coder"><div className="flex items-center gap-2"><Terminal className="size-3" /> Coder</div></SelectItem>
                        <SelectItem value="qa"><div className="flex items-center gap-2"><Shield className="size-3" /> QA</div></SelectItem>
                        <SelectItem value="reviewer"><div className="flex items-center gap-2"><Search className="size-3" /> Reviewer</div></SelectItem>
                        <SelectItem value="devops"><div className="flex items-center gap-2"><Server className="size-3" /> DevOps</div></SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label htmlFor="model" className="text-zinc-400">Model</Label>
                <Select name="model" defaultValue="claude-3.5-sonnet">
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-100">
                        <SelectItem value="claude-3.5-sonnet">Claude 3.5 Sonnet</SelectItem>
                        <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                        <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                    </SelectContent>
                </Select>
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400 hover:text-white">Cancel</Button>
            <Button type="submit" className="bg-violet-600 hover:bg-violet-500 text-white">Provision Agent</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}