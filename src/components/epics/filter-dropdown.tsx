"use client"

import { useState, useMemo } from "react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Filter, X, Check } from "lucide-react"
import { useAppStore, useEpics, useEpicFilters } from "@/lib/store"
import { cn } from "@/lib/utils"

const STATUS_GROUPS = {
  "Planning": ["open", "queued_for_planning", "planning", "planning_review", "revising"],
  "Execution": ["approved", "assigning", "executing"],
  "Review": ["pr_created", "code_review", "approved_for_merge", "merging"],
  "Complete": ["documenting", "done"],
  "Other": ["failed", "cancelled"],
} as const

export function FilterDropdown() {
  const filters = useEpicFilters()
  const setFilters = useAppStore((s) => s.setFilters)
  const epics = useEpics()
  
  // Extract available labels/repos from epics for dynamic filter options
  const availableLabels = useMemo(() => {
      const set = new Set<string>();
      epics.forEach(e => e.labels?.forEach(l => set.add(l)));
      return Array.from(set);
  }, [epics]);

  const activeCount = filters.status.length + filters.labels.length + (filters.repositories?.length || 0);

  const toggleStatus = (status: string) => {
      const current = filters.status;
      const next = current.includes(status) 
        ? current.filter(s => s !== status)
        : [...current, status];
      setFilters({ status: next });
  };

  const toggleLabel = (label: string) => {
      const current = filters.labels;
      const next = current.includes(label)
        ? current.filter(l => l !== label)
        : [...current, label];
      setFilters({ labels: next });
  };

  const clearAll = () => {
      setFilters({ status: [], labels: [], repositories: [] });
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className={cn(
            "h-8 border-dashed border-zinc-700 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800",
            activeCount > 0 && "bg-zinc-800 text-zinc-200 border-solid border-zinc-600"
        )}>
          <Filter className="mr-2 size-3.5" />
          Filter
          {activeCount > 0 && (
              <span className="ml-2 flex size-5 items-center justify-center rounded-full bg-violet-600 text-[10px] font-medium text-white">
                  {activeCount}
              </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-[#121214] border-zinc-800 p-0" align="start">
        <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-[#09090b]">
            <span className="font-medium text-sm text-zinc-200">Filters</span>
            {activeCount > 0 && (
                <Button variant="ghost" size="sm" onClick={clearAll} className="h-auto p-0 text-xs text-zinc-500 hover:text-white">
                    Reset
                </Button>
            )}
        </div>
        
        <ScrollArea className="h-[300px]">
            <div className="p-4 space-y-6">
                {/* Status Section */}
                <div className="space-y-3">
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Status</h4>
                    <div className="space-y-4">
                        {Object.entries(STATUS_GROUPS).map(([group, statuses]) => (
                            <div key={group} className="space-y-2">
                                <div className="text-[10px] text-zinc-600 font-semibold">{group}</div>
                                {statuses.map(status => (
                                    <div key={status} className="flex items-center space-x-2">
                                        <Checkbox 
                                            id={`status-${status}`} 
                                            checked={filters.status.includes(status)}
                                            onCheckedChange={() => toggleStatus(status)}
                                            className="border-zinc-700 data-[state=checked]:bg-violet-600 data-[state=checked]:border-violet-600"
                                        />
                                        <Label htmlFor={`status-${status}`} className="text-sm text-zinc-300 capitalize cursor-pointer select-none">
                                            {status.replace(/_/g, ' ')}
                                        </Label>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-zinc-800" />

                {/* Labels Section */}
                 <div className="space-y-3">
                    <h4 className="text-xs font-medium text-zinc-500 uppercase tracking-wider">Labels</h4>
                    <div className="flex flex-wrap gap-2">
                        {availableLabels.map(label => {
                            const isActive = filters.labels.includes(label);
                            return (
                                <Badge 
                                    key={label}
                                    variant="outline" 
                                    className={cn(
                                        "cursor-pointer hover:border-zinc-500 transition-colors",
                                        isActive ? "bg-violet-500/20 border-violet-500 text-violet-300" : "bg-zinc-900 text-zinc-400 border-zinc-800"
                                    )}
                                    onClick={() => toggleLabel(label)}
                                >
                                    {label}
                                    {isActive && <Check className="ml-1 size-3" />}
                                </Badge>
                            )
                        })}
                        {availableLabels.length === 0 && (
                            <span className="text-xs text-zinc-600 italic">No labels found</span>
                        )}
                    </div>
                </div>
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  )
}
