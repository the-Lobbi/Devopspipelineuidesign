import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function EpicListSkeleton() {
  return (
    <div className="flex flex-col h-full bg-[#09090b]">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6 pb-2">
        <div className="space-y-2">
            <Skeleton className="h-8 w-32" />
            <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>

      {/* Toolbar / Filter Bar */}
      <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1">
               <Skeleton className="h-9 w-full max-w-md rounded-md" />
               <Skeleton className="h-9 w-32 rounded-md" />
          </div>
          <Skeleton className="h-4 w-24" />
      </div>

      {/* List Content */}
      <div className="flex-1 min-h-0 mt-0">
        <div className="h-full flex flex-col">
            <div className="flex items-center gap-4 px-4 py-2 border-b border-zinc-800 bg-zinc-900/20">
                <Skeleton className="w-8 h-4" />
                <Skeleton className="w-24 h-4" />
                <Skeleton className="flex-1 h-4" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-32 h-4" />
                <Skeleton className="w-24 h-4" />
            </div>

            <div className="flex-1 p-4 space-y-2">
                {Array.from({ length: 10 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-4 px-4 py-3 border border-zinc-800/50 rounded-lg bg-zinc-900/20">
                        <Skeleton className="size-4 rounded" />
                        <Skeleton className="w-24 h-4" />
                        <div className="flex-1 space-y-1">
                            <Skeleton className="w-3/4 h-4" />
                        </div>
                        <Skeleton className="w-24 h-6 rounded-full" />
                        <Skeleton className="w-32 h-2 rounded-full" />
                        <div className="w-24 flex justify-end gap-2">
                            <Skeleton className="size-8 rounded-md" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
