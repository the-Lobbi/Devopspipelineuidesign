import React, { useState } from 'react';
import { Sidebar, SidebarContent } from './Sidebar';
import { CommandPalette } from '@/components/command-palette';
import { EpicDetailDrawer } from '@/components/epics/epic-detail-drawer';
import { NotificationCenter } from '@/components/notifications/NotificationCenter';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu } from 'lucide-react';
import { useAppStore } from '@/lib/store';

interface AppShellProps {
  children: React.ReactNode;
  currentView: string;
  onChangeView: (view: string, id?: string) => void;
}

export function AppShell({ children, currentView, onChangeView }: AppShellProps) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const isCommandOpen = useAppStore((state) => state.commandPaletteOpen);
  const setIsCommandOpen = useAppStore((state) => state.setCommandPaletteOpen);

  const handleNavigate = (view: string, id?: string) => {
    onChangeView(view, id);
    setIsMobileOpen(false);
  };

  return (
    <div className="flex h-screen bg-zinc-950 text-zinc-200 font-sans selection:bg-white/20">
      <Sidebar 
        currentView={currentView} 
        onChangeView={(v) => handleNavigate(v)} 
        onOpenCommand={() => setIsCommandOpen(true)}
      />
      
      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 bg-[#0d0d0d] border-b border-zinc-800/50 flex items-center px-4 z-30">
        <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
            <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white">
                    <Menu className="size-5" />
                </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-[280px] bg-[#0d0d0d] border-zinc-800">
                <SidebarContent 
                    currentView={currentView} 
                    onChangeView={(v) => handleNavigate(v)} 
                    onOpenCommand={() => {
                        setIsCommandOpen(true);
                        setIsMobileOpen(false);
                    }}
                />
            </SheetContent>
        </Sheet>
        <span className="ml-3 font-semibold text-zinc-100">Golden Armada</span>
      </div>

      <main className="flex-1 flex flex-col min-w-0 bg-[#09090b] overflow-hidden relative pt-14 md:pt-0">
        {/* Global Header Actions */}
        <div className="absolute top-4 right-6 z-20">
            <NotificationCenter />
        </div>
        {children}
      </main>
      
      <CommandPalette 
        open={isCommandOpen} 
        onOpenChange={setIsCommandOpen} 
        onNavigate={handleNavigate} 
      />
      
      <EpicDetailDrawer />
    </div>
  );
}
