"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../../ui/dialog"
import { Button } from "../../ui/button"
import { Input } from "../../ui/input"
import { Textarea } from "../../ui/textarea"
import { Label } from "../../ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select"
import { useCreateEpic } from "../../lib/queries/epics"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const createEpicSchema = z.object({
  summary: z.string().min(5, "Summary must be at least 5 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  targetRepo: z.string().min(1, "Please select a repository"),
  labels: z.string().optional(), // Simplified for this demo
})

type CreateEpicForm = z.infer<typeof createEpicSchema>

const REPOSITORIES = [
  "golden-armada/auth-service",
  "golden-armada/notification-service", 
  "golden-armada/data-layer",
  "golden-armada/api-gateway",
  "golden-armada/ui-dashboard",
  "golden-armada/devops",
]

interface NewEpicDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewEpicDialog({ open, onOpenChange }: NewEpicDialogProps) {
  const createEpic = useCreateEpic()
  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<CreateEpicForm>({
      resolver: zodResolver(createEpicSchema)
  })

  const onSubmit = async (data: CreateEpicForm) => {
      try {
          await createEpic.mutateAsync({
              ...data,
              labels: data.labels ? data.labels.split(',').map(s => s.trim()) : []
          });
          reset();
          onOpenChange(false);
      } catch (error) {
          toast.error("Failed to create epic");
      }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#121214] border-zinc-800 text-zinc-100 sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Epic</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Initialize a new autonomous workflow agent chain.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
            <div className="space-y-2">
                <Label htmlFor="summary">Summary</Label>
                <Input 
                    id="summary" 
                    placeholder="e.g. Refactor Authentication Service" 
                    className="bg-zinc-900 border-zinc-800"
                    {...register('summary')}
                />
                {errors.summary && <span className="text-xs text-red-400">{errors.summary.message}</span>}
            </div>

            <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                    id="description" 
                    placeholder="Describe the objective..." 
                    className="bg-zinc-900 border-zinc-800 min-h-[100px]"
                    {...register('description')}
                />
                 {errors.description && <span className="text-xs text-red-400">{errors.description.message}</span>}
            </div>

            <div className="space-y-2">
                <Label>Target Repository</Label>
                <Select onValueChange={(val) => setValue('targetRepo', val)}>
                    <SelectTrigger className="bg-zinc-900 border-zinc-800">
                        <SelectValue placeholder="Select repository" />
                    </SelectTrigger>
                    <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-200">
                        {REPOSITORIES.map(repo => (
                            <SelectItem key={repo} value={repo}>{repo}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                {errors.targetRepo && <span className="text-xs text-red-400">{errors.targetRepo.message}</span>}
            </div>

             <div className="space-y-2">
                <Label htmlFor="labels">Labels (comma separated)</Label>
                <Input 
                    id="labels" 
                    placeholder="backend, urgent, v2" 
                    className="bg-zinc-900 border-zinc-800"
                    {...register('labels')}
                />
            </div>
            
            <DialogFooter className="pt-4">
                <Button type="button" variant="ghost" onClick={() => onOpenChange(false)} className="text-zinc-400 hover:text-zinc-200">
                    Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting} className="bg-violet-600 hover:bg-violet-700 text-white">
                    {isSubmitting && <Loader2 className="mr-2 size-4 animate-spin" />}
                    Provision Epic
                </Button>
            </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
