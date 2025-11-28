"use client"

import { Separator } from "@/components/ui/separator"

export default function RepositoriesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Repositories</h3>
        <p className="text-sm text-muted-foreground">
          Manage whitelisted repositories for the agent armada.
        </p>
      </div>
      <Separator />
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
        Repository management content will go here.
      </div>
    </div>
  )
}
