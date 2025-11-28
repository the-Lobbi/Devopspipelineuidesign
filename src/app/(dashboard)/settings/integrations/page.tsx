"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"

export default function IntegrationsPage() {
  const [jiraConnected, setJiraConnected] = useState(false)
  const [githubConnected, setGithubConnected] = useState(true)
  const [confluenceConnected, setConfluenceConnected] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Integrations</h3>
        <p className="text-sm text-muted-foreground">
          Connect your favorite tools to Golden Armada.
        </p>
      </div>
      <Separator />
      
      <div className="space-y-8">
        {/* Jira Integration */}
        <div className="flex items-start justify-between space-x-4 border p-4 rounded-lg border-border/50 bg-secondary/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">Jira Software</h4>
              {jiraConnected && <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Connected</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              Sync epics, stories, and track progress directly from Jira.
            </p>
            {jiraConnected && (
              <div className="grid gap-2 mt-4">
                <div className="grid gap-1">
                  <Label htmlFor="jira-domain" className="text-xs">Domain</Label>
                  <Input id="jira-domain" defaultValue="company.atlassian.net" className="h-8" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="jira-email" className="text-xs">Email</Label>
                  <Input id="jira-email" defaultValue="user@company.com" className="h-8" />
                </div>
                <div className="grid gap-1">
                  <Label htmlFor="jira-token" className="text-xs">API Token</Label>
                  <Input id="jira-token" type="password" value="••••••••••••" className="h-8" />
                </div>
              </div>
            )}
          </div>
          <Switch checked={jiraConnected} onCheckedChange={setJiraConnected} />
        </div>

        {/* GitHub Integration */}
        <div className="flex items-start justify-between space-x-4 border p-4 rounded-lg border-border/50 bg-secondary/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">GitHub</h4>
              {githubConnected && <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Connected</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              Link repositories, branches, and pull requests.
            </p>
             {githubConnected && (
              <div className="grid gap-2 mt-4">
                <div className="grid gap-1">
                  <Label htmlFor="github-token" className="text-xs">Personal Access Token</Label>
                  <Input id="github-token" type="password" value="ghp_••••••••••••••••••••" className="h-8" />
                </div>
              </div>
            )}
          </div>
          <Switch checked={githubConnected} onCheckedChange={setGithubConnected} />
        </div>

        {/* Confluence Integration */}
        <div className="flex items-start justify-between space-x-4 border p-4 rounded-lg border-border/50 bg-secondary/10">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold">Confluence</h4>
              {confluenceConnected && <Badge variant="secondary" className="bg-green-500/10 text-green-500 hover:bg-green-500/20">Connected</Badge>}
            </div>
            <p className="text-sm text-muted-foreground">
              Access documentation and link pages to epics.
            </p>
          </div>
          <Switch checked={confluenceConnected} onCheckedChange={setConfluenceConnected} />
        </div>

        <div className="flex justify-end">
            <Button>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
