
import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, MessageSquare, CornerDownRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export function FeedbackThread() {
  const threads = [
    {
        id: 1,
        author: { name: 'Markus', avatar: '' },
        content: 'Should we implement a retry mechanism for the API calls here?',
        file: 'src/lib/api.ts',
        line: 42,
        timestamp: '2 hours ago',
        status: 'resolved',
        reply: {
            author: { name: 'Code Generator', avatar: 'AI' },
            content: 'Added exponential backoff retry logic in commit 8f2a1c.',
            timestamp: '1 hour ago'
        }
    },
    {
        id: 2,
        author: { name: 'Sarah', avatar: '' },
        content: 'Please add proper type definitions for the response object.',
        file: 'src/types/index.ts',
        line: 15,
        timestamp: '3 hours ago',
        status: 'pending',
    }
  ];

  return (
    <div className="space-y-6">
        <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wider">Review Comments</h3>
        {threads.map(thread => (
            <div key={thread.id} className="bg-[#121214] border border-zinc-800 rounded-xl overflow-hidden">
                <div className="p-3 bg-zinc-900/50 border-b border-zinc-800 flex items-center justify-between text-xs">
                    <span className="font-mono text-zinc-500">{thread.file}:{thread.line}</span>
                    {thread.status === 'resolved' ? (
                        <span className="flex items-center gap-1 text-emerald-500">
                            <CheckCircle2 className="size-3" /> Resolved
                        </span>
                    ) : (
                        <span className="flex items-center gap-1 text-amber-500">
                            <MessageSquare className="size-3" /> Pending
                        </span>
                    )}
                </div>
                
                <div className="p-4 space-y-4">
                    <div className="flex gap-3">
                        <Avatar className="size-8">
                            <AvatarFallback>{thread.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                                <span className="text-sm font-medium text-zinc-200">{thread.author.name}</span>
                                <span className="text-xs text-zinc-500">{thread.timestamp}</span>
                            </div>
                            <p className="text-sm text-zinc-400">{thread.content}</p>
                        </div>
                    </div>

                    {thread.reply && (
                        <div className="flex gap-3 pl-8 relative">
                            <CornerDownRight className="absolute left-2 top-0 size-4 text-zinc-700" />
                            <div className="size-8 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 border border-violet-500/30">
                                AI
                            </div>
                            <div className="flex-1">
                                <div className="flex items-center justify-between mb-1">
                                    <span className="text-sm font-medium text-zinc-200">{thread.reply.author.name}</span>
                                    <span className="text-xs text-zinc-500">{thread.reply.timestamp}</span>
                                </div>
                                <p className="text-sm text-zinc-400">{thread.reply.content}</p>
                            </div>
                        </div>
                    )}
                </div>

                {thread.status === 'pending' && (
                    <div className="p-3 border-t border-zinc-800 bg-zinc-900/20 flex justify-end gap-2">
                        <Button variant="ghost" size="sm" className="text-zinc-400 hover:text-white">Reply</Button>
                        <Button size="sm" className="bg-violet-600 hover:bg-violet-500 text-white">Resolve</Button>
                    </div>
                )}
            </div>
        ))}
    </div>
  );
}
