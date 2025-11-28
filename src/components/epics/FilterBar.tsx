
import React from 'react';
import { Search, Filter, Calendar, User, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { FilterChip } from '@/components/ui/filter-chip';
import { useEpics } from '@/lib/context/epics-provider';

export function FilterBar() {
  const { state, dispatch } = useEpics();
  
  // Mock filter handling
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch({ type: 'SET_FILTERS', payload: { search: e.target.value } });
  };

  const activeFilters = [
    ...(state.filters.status.length > 0 ? state.filters.status.map(s => ({ label: 'Status', value: s })) : []),
    // Add other filters here
  ];

  return (
    <div className="space-y-4 p-6 pb-0">
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-zinc-500" />
          <Input 
            placeholder="Search epics, keys, or tags..." 
            className="pl-9 bg-zinc-900/50 border-zinc-800 focus:ring-zinc-700 rounded-xl"
            value={state.filters.search}
            onChange={handleSearchChange}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-zinc-800 bg-zinc-900 px-1.5 font-mono text-[10px] font-medium text-zinc-500">
              <span className="text-xs">⌘</span>K
            </kbd>
          </div>
        </div>
        
        <div className="flex items-center gap-2 border-l border-zinc-800 pl-3">
            <Button variant="outline" size="sm" className="border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-zinc-800 rounded-full h-9">
                <Filter className="size-3.5 mr-2" />
                Status
            </Button>
            <Button variant="outline" size="sm" className="border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-zinc-800 rounded-full h-9">
                <User className="size-3.5 mr-2" />
                Assignee
            </Button>
            <Button variant="outline" size="sm" className="border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-zinc-800 rounded-full h-9">
                <Calendar className="size-3.5 mr-2" />
                Date
            </Button>
            <Button variant="ghost" size="sm" className="text-zinc-500 hover:text-zinc-300 rounded-full h-9 w-9 p-0">
                <SlidersHorizontal className="size-4" />
            </Button>
        </div>
      </div>

      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap animate-in slide-in-from-top-2 duration-200">
            {activeFilters.map((filter, i) => (
                <FilterChip 
                    key={i} 
                    label={filter.label} 
                    value={filter.value} 
                    onRemove={() => {
                        // Logic to remove specific filter
                        if (filter.label === 'Status') {
                            const newStatus = state.filters.status.filter(s => s !== filter.value);
                            dispatch({ type: 'SET_FILTERS', payload: { status: newStatus } });
                        }
                    }} 
                />
            ))}
            <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs text-zinc-500 hover:text-zinc-300 h-6 px-2"
                onClick={() => dispatch({ type: 'SET_FILTERS', payload: { status: [], search: '' } })}
            >
                Clear all
            </Button>
        </div>
      )}
    </div>
  );
}
