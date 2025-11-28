import React from 'react';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Layers, 
  Bot, 
  Settings, 
  Rocket, 
  ChevronsLeftRight,
  Search,
  Globe,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarContentProps {
  currentView: string;
  onChangeView: (view: string) => void;
  onOpenCommand?: () => void;
}

export function SidebarContent({ currentView, onChangeView, onOpenCommand }: SidebarContentProps) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'epics', label: 'Epics', icon: Layers },
    { id: 'agents', label: 'Agents', icon: Bot },
    { id: 'knowledge', label: 'Knowledge', icon: Globe },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="h-14 flex items-center px-4 border-b border-zinc-800/50 shrink-0">
         <div className="flex items-center gap-2 text-zinc-100 font-semibold text-lg tracking-tight">
            <div className="flex items-center justify-center size-7 bg-white text-black rounded-full">
                <Rocket className="size-4 fill-current" />
            </div>
            <span>Golden Armada</span>
         </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        <div className="mb-4 px-2">
             <button 
                onClick={onOpenCommand}
                className="w-full flex items-center justify-between px-3 py-1.5 text-sm text-zinc-400 border border-zinc-800 rounded-full hover:bg-zinc-800/50 transition-colors text-left"
             >
                <span className="flex items-center gap-2">
                    <Search className="size-3.5" />
                    Search...
                </span>
                <span className="text-xs bg-zinc-800 px-1.5 rounded text-zinc-500">⌘K</span>
             </button>
        </div>

        <div className="px-2 mb-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Platform</div>
        
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onChangeView(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200",
              currentView === item.id
                ? "bg-zinc-800/80 text-white font-medium"
                : "hover:bg-zinc-800/40 hover:text-zinc-200"
            )}
          >
            <item.icon className={cn("size-4", currentView === item.id ? "text-zinc-100" : "text-zinc-500")} />
            {item.label}
          </button>
        ))}

        <div className="mt-8 px-2 mb-2 text-xs font-semibold text-zinc-600 uppercase tracking-wider">Workspaces</div>
         <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800/40 hover:text-zinc-200 transition-all">
            <div className="size-4 rounded bg-violet-500/20 text-violet-400 flex items-center justify-center text-[10px]">GA</div>
            Golden Armada
         </button>
         <button className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm hover:bg-zinc-800/40 hover:text-zinc-200 transition-all">
            <div className="size-4 rounded bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[10px]">API</div>
            Backend API
         </button>
      </div>

      {/* User Footer */}
      <div className="p-3 border-t border-zinc-800/50 shrink-0">
        <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-zinc-800/50 cursor-pointer transition-colors">
          <Avatar className="size-8 rounded-lg border border-zinc-700">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback className="rounded-lg bg-zinc-800">CN</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
             <div className="text-sm font-medium text-zinc-200 truncate">Admin User</div>
             <div className="text-xs text-zinc-500 truncate">admin@goldenarmada.ai</div>
          </div>
          <ChevronsLeftRight className="size-4 text-zinc-600" />
        </div>
      </div>
    </div>
  );
}

export function Sidebar(props: SidebarContentProps) {
  return (
    <aside className="hidden md:flex w-[260px] h-screen flex-col bg-[#0d0d0d] border-r border-zinc-800/50 text-zinc-400 font-medium">
      <SidebarContent {...props} />
    </aside>
  );
}
