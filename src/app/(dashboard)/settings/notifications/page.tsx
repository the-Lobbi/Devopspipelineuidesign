"use client"

import { Separator } from "@/components/ui/separator"

export default function NotificationsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Notifications</h3>
        <p className="text-sm text-muted-foreground">
          Manage your email and webhook notification preferences.
        </p>
      </div>
      <Separator />
      <div className="p-8 text-center text-muted-foreground border border-dashed rounded-lg">
        Notification settings content will go here.
      </div>
    </div>
  )
}
