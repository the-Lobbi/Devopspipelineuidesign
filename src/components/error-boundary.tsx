"use client"

import { Component, type ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { GlassCard } from "@/components/ui/glass-card"
import { AlertTriangle, RefreshCw } from "lucide-react"

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex h-full w-full items-center justify-center p-6">
          <GlassCard className="flex max-w-md flex-col items-center text-center p-8">
            <div className="mb-4 rounded-full bg-destructive/10 p-4 text-destructive">
              <AlertTriangle className="h-8 w-8" />
            </div>
            <h2 className="mb-2 text-lg font-semibold">Something went wrong</h2>
            <p className="mb-6 text-sm text-muted-foreground">
              {this.state.error?.message || "An unexpected error occurred while rendering this component."}
            </p>
            <Button 
              onClick={() => this.setState({ hasError: false })}
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </Button>
          </GlassCard>
        </div>
      )
    }

    return this.props.children
  }
}
