import React, { useState } from 'react';
import { useFilteredEpics, useAppStore } from '@/lib/store';
import { FilterDropdown } from '@/components/epics/filter-dropdown';
import { EpicTableRow } from '@/components/epics/EpicTableRow';
import { BulkActions } from '@/components/epics/BulkActions';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from "@/components/ui/input";
import { NewEpicDialog } from '@/components/epics/new-epic-dialog';

interface EpicListViewProps {
  onEpicClick: (epicId: string) => void;
}

export function EpicListView({ onEpicClick }: EpicListViewProps) {
  const filteredEpics = useFilteredEpics();
  const setFilters = useAppStore((s) => s.setFilters);
  const epicFilters = useAppStore((s) => s.epicFilters);
  
  const [selectedEpics, setSelectedEpics] = useState<Set<string>>(new Set());
  const [newEpicOpen, setNewEpicOpen] = useState(false);

  const toggleSelection = (id: string, checked: boolean) => {
    const newSet = new Set(selectedEpics);
    if (checked) {
      newSet.add(id);
    } else {
      newSet.delete(id);
    }
    setSelectedEpics(newSet);
  };

  const clearSelection = () => setSelectedEpics(new Set());

  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 pb-2">
        <div>
            <h1 className="text-2xl font-semibold text-zinc-100 tracking-tight">Epics</h1>
            <p className="text-zinc-500 text-sm mt-1">Manage your automation workflows</p>
        </div>
        
        <Button className="rounded-full bg-zinc-100 text-zinc-950 hover:bg-white" onClick={() => setNewEpicOpen(true)}>
            <Plus className="size-4 mr-2" />
            New Epic
        </Button>
      </div>

      {/* Toolbar / Filter Bar */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
               <div className="relative max-w-md flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
                  <Input 
                    className="pl-9 h-9 bg-zinc-900/50 border-zinc-800 focus:ring-violet-500/20 text-sm" 
                    placeholder="Filter epics by name or key..." 
                    value={epicFilters.search}
                    onChange={(e) => setFilters({ search: e.target.value })}
                  />
               </div>
               <FilterDropdown />
          </div>
          <div className="text-xs text-zinc-500 font-mono">
              {filteredEpics.length} RECORDS
          </div>
      </div>

      {/* List Content */}
      <div className="flex-1 min-h-0 mt-0">
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 px-4 py-2 border-b border-zinc-800 bg-zinc-900/20 text-xs font-medium text-zinc-500 uppercase tracking-wider sticky top-0 z-10">
                <div className="w-8 text-center">#</div>
                <div className="w-24">Key</div>
                <div className="flex-1">Summary</div>
                <div className="w-32">Status</div>
                <div className="w-32">Progress</div>
                <div className="w-24 text-right">Actions</div>
            </div>

            <ScrollArea className="flex-1">
                {filteredEpics.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center">
                        <div className="p-4 rounded-full bg-zinc-900/50 border border-zinc-800 mb-4">
                            <Plus className="size-8 text-zinc-600" />
                        </div>
                        <h3 className="text-zinc-300 font-medium">No epics found</h3>
                        <p className="text-zinc-500 text-sm mt-1">Try adjusting your filters or create a new one.</p>
                    </div>
                ) : (
                    <div className="pb-20">
                        {filteredEpics.map((epic) => (
                            <EpicTableRow 
                                key={epic.id} 
                                epic={epic} 
                                isSelected={selectedEpics.has(epic.id)}
                                onSelect={(checked) => toggleSelection(epic.id, checked)}
                                onClick={() => onEpicClick(epic.id)}
                            />
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
      </div>

      <BulkActions 
        selectedCount={selectedEpics.size} 
        onClearSelection={clearSelection} 
      />
      
      <NewEpicDialog open={newEpicOpen} onOpenChange={setNewEpicOpen} />
    </div>
  );
}
