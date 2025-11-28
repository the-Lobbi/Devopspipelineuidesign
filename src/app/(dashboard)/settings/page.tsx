"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">General Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your workspace and profile preferences.
        </p>
      </div>
      <Separator />
      <form className="space-y-8">
        <div className="grid gap-4 max-w-xl">
          <div className="grid gap-2">
            <Label htmlFor="workspace-name">Workspace Name</Label>
            <Input id="workspace-name" defaultValue="Golden Armada" />
            <p className="text-[0.8rem] text-muted-foreground">
              This is the name of your organization or project visible to others.
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="display-name">Display Name</Label>
            <Input id="display-name" placeholder="Enter your name" />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="Enter your email" />
          </div>
        </div>
        
        <Button>Save Changes</Button>
      </form>
    </div>
  )
}
