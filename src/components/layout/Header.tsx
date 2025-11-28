import React, { useState } from 'react';
import { LayoutDashboard, Layers, Bot, Settings, Plus, Bell, User, Rocket, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/lib/store';
import { NewEpicDialog } from '@/components/epics/new-epic-dialog';

interface HeaderProps {
  currentView: string;
  onChangeView: (view: string) => void;
}

export function Header({ currentView, onChangeView }: HeaderProps) {
  const setCommandPaletteOpen = useAppStore((state) => state.setCommandPaletteOpen);
  const [newEpicOpen, setNewEpicOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'epics', label: 'Epics', icon: Layers },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <header className="h-14 fixed top-0 left-0 right-0 bg-zinc-950 border-b border-zinc-800 z-50 flex items-center justify-between px-4">
      {/* Left Section - Brand */}
      <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onChangeView('dashboard')}>
        <div className="p-1.5 bg-violet-500/10 rounded-lg group-hover:bg-violet-500/20 transition-colors">
          <Rocket className="size-5 text-violet-500" />
        </div>
        <span className="font-semibold text-lg text-zinc-100 group-hover:text-white transition-colors relative">
          Golden Armada
          <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-gradient-to-r from-violet-500 to-transparent group-hover:w-full transition-all duration-300" />
        </span>
      </div>

      {/* Center Section - Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-zinc-900/50 p-1 rounded-lg border border-zinc-800/50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all duration-200",
              currentView === item.id
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            )}
          >
            <item.icon className="size-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Right Section - Actions */}
      <div className="flex items-center gap-3">
        {/* Search Input for Command Palette */}
        <div className="relative hidden lg:block w-64 mr-2">
            <Search className="absolute left-2.5 top-2.5 size-4 text-zinc-500" />
            <Input 
                placeholder="Search... ⌘K" 
                onClick={() => setCommandPaletteOpen(true)}
                readOnly
                className="h-9 pl-9 bg-zinc-900/50 border-zinc-800 focus:ring-violet-500/20 cursor-pointer text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900 transition-colors"
            />
        </div>

        <Button 
          variant="ghost" 
          size="sm" 
          className="text-zinc-400 hover:text-white hover:bg-zinc-800 hidden sm:flex gap-2"
          onClick={() => setNewEpicOpen(true)}
        >
          <Plus className="size-4" />
          <span>New Epic</span>
        </Button>

        <div className="h-6 w-[1px] bg-zinc-800 mx-1" />

        <button className="relative p-2 text-zinc-400 hover:text-white transition-colors rounded-full hover:bg-zinc-800">
          <Bell className="size-5" />
          <span className="absolute top-1.5 right-1.5 size-2 bg-red-500 rounded-full border border-zinc-950" />
        </button>
        
        <Avatar className="size-8 border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors">
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback className="bg-zinc-800 text-zinc-400">UA</AvatarFallback>
        </Avatar>
      </div>

      <NewEpicDialog open={newEpicOpen} onOpenChange={setNewEpicOpen} />
    </header>
  );
}
