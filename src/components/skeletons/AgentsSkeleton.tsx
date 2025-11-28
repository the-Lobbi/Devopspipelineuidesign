import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function AgentsSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Header / Status Bar */}
      <div className="px-6 py-4 border-b border-zinc-800/50 bg-[#09090b] z-20 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Skeleton className="size-9 rounded-lg" />
            <div className="space-y-1.5">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-3 w-24" />
            </div>
            
            <div className="h-8 w-px bg-zinc-800 mx-2" />
            
            <div className="flex items-center gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex flex-col gap-1">
                        <Skeleton className="h-2 w-12" />
                        <Skeleton className="h-4 w-16" />
                    </div>
                ))}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-32" />
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="px-6 py-2 border-b border-zinc-800 flex items-center justify-between bg-[#0d0d0e] z-10 relative">
          <div className="flex items-center gap-3">
            <Skeleton className="h-8 w-64 rounded-md" />
            <div className="h-4 w-px bg-zinc-800" />
             <Skeleton className="h-3 w-32" />
          </div>
          <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
          </div>
      </div>

      {/* Content Area - Canvas Mockup */}
      <div className="flex-1 relative bg-[#050506] overflow-hidden">
         {/* Mock Nodes */}
         <div className="absolute top-1/4 left-1/4 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 w-64 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="size-4 rounded-full" />
            </div>
         </div>

         <div className="absolute top-1/2 left-1/2 p-4 rounded-xl border border-zinc-800 bg-zinc-900/50 w-64 space-y-3">
            <div className="flex items-center gap-3">
                <Skeleton className="size-10 rounded-lg" />
                <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-3 w-1/2" />
                </div>
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <div className="flex justify-between pt-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="size-4 rounded-full" />
            </div>
         </div>
      </div>
    </div>
  );
}
