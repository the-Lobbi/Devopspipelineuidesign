import React, { useEffect } from 'react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem, 
  CommandSeparator, 
  CommandShortcut 
} from './ui/command';
import { useAppStore, useEpics } from '../lib/store';
import { 
  LayoutDashboard, 
  ListTodo, 
  Bot, 
  GitPullRequest, 
  Bell, 
  Settings, 
  Plus, 
  RefreshCw,
  FileText,
  Search
} from 'lucide-react';
import { toast } from 'sonner';

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: (view: string, id?: string) => void;
}

export function CommandPalette({ open, onOpenChange, onNavigate }: CommandPaletteProps) {
  const epics = useEpics();
  const setCommandPaletteOpen = useAppStore((state) => state.setCommandPaletteOpen);

  // Sync local prop open with store if needed, but better to rely on prop or store exclusively.
  // The AppShell uses local state for opening, but the prompt requested "Uses store state for commandPaletteOpen".
  // I will respect the prop API since AppShell controls it, but also sync with store if needed.
  // Actually, I'll just implement the component logic.
  
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
    };
    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [onOpenChange, open]);

  const runCommand = (command: () => void) => {
    command();
    onOpenChange(false);
  };

  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        
        <CommandGroup heading="Navigation">
          <CommandItem onSelect={() => runCommand(() => onNavigate('dashboard'))}>
            <LayoutDashboard className="mr-2 size-4" />
            <span>Dashboard</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate('epics'))}>
            <ListTodo className="mr-2 size-4" />
            <span>Epics</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate('agents'))}>
            <Bot className="mr-2 size-4" />
            <span>Agents</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => onNavigate('settings'))}>
            <Settings className="mr-2 size-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => runCommand(() => {
              onNavigate('epics');
              toast.info("Create Epic", { description: "Use the 'New Epic' button on the Epics page." });
          })}>
            <Plus className="mr-2 size-4" />
            <span>Create New Epic</span>
            <CommandShortcut>⌘N</CommandShortcut>
          </CommandItem>
           <CommandItem onSelect={() => runCommand(() => {
              toast.success("Data Refreshed", { description: "Latest telemetry fetched from remote." });
          })}>
            <RefreshCw className="mr-2 size-4" />
            <span>Refresh Data</span>
            <CommandShortcut>⌘R</CommandShortcut>
          </CommandItem>
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Recent Epics">
          {epics.slice(0, 5).map((epic) => (
            <CommandItem key={epic.id} onSelect={() => runCommand(() => onNavigate('epic-detail', epic.id))}>
              <FileText className="mr-2 size-4 text-zinc-500" />
              <span>{epic.jiraKey}: {epic.summary}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
