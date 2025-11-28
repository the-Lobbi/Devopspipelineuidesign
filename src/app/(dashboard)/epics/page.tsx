'use client'

import { useState, useEffect } from 'react'
import { useFilteredEpics, useAppStore } from "@/lib/store"
import { EpicCard } from "@/components/dashboard/EpicCard"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"

export default function EpicsPage() {
  const [search, setSearch] = useState('')
  
  // Use store hooks as requested
  // Note: In a real implementation, we would ensure lib/store.ts exists and exports these.
  // Since I cannot see/edit lib/store.ts, this code assumes it matches the user's request.
  const filteredEpics = useFilteredEpics()
  const setFilters = useAppStore((s) => s.setFilters)

  useEffect(() => {
    setFilters({ search: search || undefined })
  }, [search, setFilters])

  return (
    <div className="h-full flex flex-col space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Epics</h2>
          <p className="text-muted-foreground">
            Manage your high-level initiatives and workflows.
          </p>
        </div>
        <div className="flex items-center space-x-2">
           <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search epics..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-8 w-[250px]"
            />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredEpics?.length > 0 ? (
          filteredEpics.map((epic) => (
            <EpicCard 
                key={epic.id} 
                epic={epic} 
                onClick={() => console.log('Navigate to epic', epic.id)} 
            />
          ))
        ) : (
             <div className="col-span-full text-center text-zinc-500 py-12">
                No epics found matching your filters.
             </div>
        )}
      </div>
    </div>
  )
}
