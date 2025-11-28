'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { GlassCard } from '@/components/ui/glass-card'
import { AlertTriangle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
        <GlassCard className="flex max-w-md flex-col items-center text-center p-8">
            <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
                <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Something went wrong!</h2>
            <p className="mb-6 text-sm text-muted-foreground">
                {error.message || "An unexpected error occurred."}
            </p>
            <Button
                onClick={() => reset()}
                className="gap-2"
            >
                <RefreshCw className="h-4 w-4" />
                Try again
            </Button>
        </GlassCard>
    </div>
  )
}
