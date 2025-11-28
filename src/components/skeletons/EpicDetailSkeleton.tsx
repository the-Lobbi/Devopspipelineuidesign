import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function EpicDetailSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Header */}
      <div className="border-b border-zinc-800 bg-zinc-900/50 p-6 pb-0">
        <div className="flex items-start justify-between mb-6">
            <div className="space-y-4 flex-1">
                <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-24 rounded-full" />
                    <Skeleton className="h-6 w-24 rounded-full" />
                </div>
                <Skeleton className="h-8 w-3/4" />
                <div className="flex items-center gap-6">
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                    <Skeleton className="h-5 w-32" />
                </div>
            </div>
            <div className="flex gap-3">
                <Skeleton className="h-9 w-24" />
                <Skeleton className="h-9 w-24" />
            </div>
        </div>
        
        {/* Tabs */}
        <div className="flex gap-6 mt-8">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="pb-3 border-b-2 border-transparent">
                    <Skeleton className="h-5 w-24" />
                </div>
            ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 grid grid-cols-12 gap-6">
         {/* Main Column */}
         <div className="col-span-8 space-y-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-24 w-full" />
                <div className="space-y-2">
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-full" />
                     <Skeleton className="h-4 w-2/3" />
                </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
                <Skeleton className="h-40 w-full rounded-xl" />
                <Skeleton className="h-40 w-full rounded-xl" />
            </div>
         </div>

         {/* Side Column */}
         <div className="col-span-4 space-y-6">
            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                <Skeleton className="h-5 w-32" />
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        <Skeleton className="size-8 rounded-full" />
                        <div className="flex-1">
                             <Skeleton className="h-4 w-full" />
                             <Skeleton className="h-3 w-2/3" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/30 space-y-4">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-2 w-full rounded-full" />
                <div className="space-y-2">
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                    <div className="flex justify-between">
                        <Skeleton className="h-4 w-20" />
                        <Skeleton className="h-4 w-10" />
                    </div>
                </div>
            </div>
         </div>
      </div>
    </div>
  );
}
