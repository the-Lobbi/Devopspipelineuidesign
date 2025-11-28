import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ActivityFeedSkeleton } from "./ActivityFeedSkeleton";

export function DashboardSkeleton() {
  return (
    <div className="flex h-full bg-[#09090b] overflow-hidden">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-2">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <div className="flex gap-2">
                <Skeleton className="h-9 w-32" />
                <Skeleton className="h-9 w-9" />
            </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-6 pt-4">
            {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="p-6 rounded-xl border border-zinc-800 bg-zinc-900/50 space-y-4">
                    <div className="flex justify-between items-start">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-5 w-5 rounded-full" />
                    </div>
                    <div className="space-y-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
            ))}
        </div>

        {/* Kanban Board Skeleton */}
        <div className="flex-1 min-h-0 overflow-x-auto px-6 pb-6">
            <div className="flex gap-6 h-full min-w-max">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="w-80 flex flex-col h-full rounded-xl bg-zinc-900/20 border border-zinc-800/50">
                        <div className="p-3 border-b border-zinc-800/50 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Skeleton className="size-2 rounded-full" />
                                <Skeleton className="h-4 w-24" />
                            </div>
                            <Skeleton className="h-5 w-8 rounded-full" />
                        </div>
                        <div className="p-3 space-y-3 flex-1">
                            {Array.from({ length: 2 }).map((_, j) => (
                                <div key={j} className="p-4 rounded-lg border border-zinc-800 bg-zinc-900/80 space-y-3">
                                    <div className="flex justify-between items-start">
                                        <Skeleton className="h-4 w-20" />
                                        <Skeleton className="h-4 w-4 rounded-full" />
                                    </div>
                                    <Skeleton className="h-5 w-full" />
                                    <div className="flex justify-between items-center pt-2">
                                        <Skeleton className="h-6 w-16 rounded-full" />
                                        <Skeleton className="size-6 rounded-full" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>

      {/* Right Sidebar: Activity Feed */}
      <ActivityFeedSkeleton />
    </div>
  );
}
