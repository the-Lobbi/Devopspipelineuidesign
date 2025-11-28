"use client"

import { Separator } from "@/components/ui/separator"

export default function AgentsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Agents</h3>
        <p className="text-sm text-muted-foreground">
          Configure agent capabilities, limits, and timeouts.
        </p>
      </div>
      <Separator />
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
        Agent configuration content will go here.
      </div>
    </div>
  )
}
