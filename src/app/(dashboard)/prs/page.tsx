"use client"

import { Header } from "@/components/layout/Header"
import { GlassCard } from "@/components/ui/glass-card"
import { EmptyState } from "@/components/ui/empty-state"
import { StatusBadge } from "@/components/ui/status-badge"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { GitPullRequest, ExternalLink, ArrowUpRight } from "lucide-react"
import { useEpics } from "@/lib/store"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link"

export default function PullRequestsPage() {
  const epics = useEpics()
  const epicsWithPRs = epics.filter((e) => e.prUrl)

  return (
    <div className="flex flex-col h-full">
      <Header title="Pull Requests" description="Monitor and review active pull requests across repositories." />
      
      <div className="flex-1 p-6 overflow-auto">
        {epicsWithPRs.length === 0 ? (
          <EmptyState
            icon={GitPullRequest}
            title="No Active Pull Requests"
            description="There are currently no epics with associated pull requests. Start a new epic or move one to the coding phase."
            className="mt-12 mx-auto max-w-lg"
          />
        ) : (
          <GlassCard className="overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-white/10">
                  <TableHead className="w-[100px]">Epic Key</TableHead>
                  <TableHead>Summary</TableHead>
                  <TableHead>Repository</TableHead>
                  <TableHead>PR #</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {epicsWithPRs.map((epic) => (
                  <TableRow key={epic.id} className="hover:bg-white/5 border-white/10 transition-colors">
                    <TableCell className="font-medium font-mono text-xs text-muted-foreground">
                      {epic.jiraKey}
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-sm line-clamp-1">{epic.summary}</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="font-mono text-xs border-white/10 bg-white/5">
                          {epic.targetRepo}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>
                       <div className="flex items-center gap-1 text-muted-foreground text-sm">
                         <GitPullRequest className="size-3" />
                         <span className="font-mono">#{epic.prNumber || '?'}</span>
                       </div>
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={epic.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {epic.prUrl && (
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0" asChild>
                          <Link href={epic.prUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4" />
                            <span className="sr-only">Open PR</span>
                          </Link>
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </GlassCard>
        )}
      </div>
    </div>
  )
}
