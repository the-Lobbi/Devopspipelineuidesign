"use client"

import type React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Settings, Plug, GitBranch, Bot, Bell } from "lucide-react"
import { GlassCard } from "@/components/ui/glass-card"

const settingsNav = [
  { href: "/settings", icon: Settings, label: "General" },
  { href: "/settings/integrations", icon: Plug, label: "Integrations" },
  { href: "/settings/repositories", icon: GitBranch, label: "Repositories" },
  { href: "/settings/agents", icon: Bot, label: "Agents" },
  { href: "/settings/notifications", icon: Bell, label: "Notifications" },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mt-6">
      <nav className="space-y-1">
        {settingsNav.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <item.icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          )
        })}
      </nav>
      <GlassCard className="p-4 md:p-6">
        {children}
      </GlassCard>
    </div>
  )
}
