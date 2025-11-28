
import React from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { Button } from '@/components/ui/button';
import { X, Copy, Check, Terminal, User } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface AgentConversationProps {
  agent: any;
  onClose: () => void;
}

export function AgentConversation({ agent, onClose }: AgentConversationProps) {
  if (!agent) return null;

  const messages = [
    { role: 'user', content: 'Implement the OAuth2 login flow using Google provider.', time: '10:00 AM' },
    { role: 'agent', content: 'I will start by creating the necessary database schema for User accounts, then implement the API route handlers.', time: '10:01 AM', thoughts: 'Planning phase...' },
    { role: 'agent', content: 'Here is the schema update:', code: 'model User {\n  id String @id @default(cuid())\n  email String @unique\n  ... \n}', time: '10:02 AM' },
    { role: 'user', content: 'Looks good. Proceed with the implementation.', time: '10:05 AM' }
  ];

  return (
    <GlassCard 
        className="fixed inset-y-0 right-0 w-[600px] z-40 flex flex-col rounded-l-2xl rounded-r-none border-r-0 animate-in slide-in-from-right duration-300 shadow-2xl"
        variant="elevated"
        padding="none"
    >
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 backdrop-blur">
        <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
            <Terminal className="size-4 text-violet-400" />
            Conversation: {agent.name}
        </h3>
        <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
            <X className="size-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1 p-0">
        <div className="p-6 space-y-6">
            {messages.map((msg, i) => (
                <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                    <div className={cn(
                        "size-8 rounded-full flex items-center justify-center shrink-0 mt-1",
                        msg.role === 'user' ? "bg-zinc-700 text-zinc-300" : "bg-violet-600 text-white"
                    )}>
                        {msg.role === 'user' ? <User className="size-4" /> : <Terminal className="size-4" />}
                    </div>
                    
                    <div className={cn(
                        "flex-1 max-w-[80%] space-y-2",
                        msg.role === 'user' ? "items-end" : "items-start"
                    )}>
                        {msg.thoughts && (
                            <div className="text-xs text-zinc-500 italic bg-zinc-900/50 p-2 rounded border border-zinc-800/50 mb-2">
                                💭 {msg.thoughts}
                            </div>
                        )}
                        
                        <div className={cn(
                            "p-4 rounded-2xl text-sm leading-relaxed border",
                            msg.role === 'user' ? "bg-zinc-800 border-zinc-700 text-zinc-200 rounded-tr-sm" : "bg-[#18181b] border-zinc-800 text-zinc-300 rounded-tl-sm"
                        )}>
                            <p>{msg.content}</p>
                            {msg.code && (
                                <div className="mt-3 relative group">
                                    <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="p-1.5 rounded bg-zinc-700 text-zinc-300 hover:text-white hover:bg-zinc-600">
                                            <Copy className="size-3" />
                                        </button>
                                    </div>
                                    <pre className="bg-black/50 p-3 rounded-lg overflow-x-auto font-mono text-xs text-zinc-400 border border-zinc-800">
                                        {msg.code}
                                    </pre>
                                </div>
                            )}
                        </div>
                        <span className="text-[10px] text-zinc-600 block px-1">{msg.time}</span>
                    </div>
                </div>
            ))}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="relative">
            <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full pl-4 pr-12 py-3 text-sm text-zinc-200 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none"
                placeholder="Send a message to the agent..."
            />
            <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors">
                <Terminal className="size-4" />
            </button>
        </div>
      </div>
    </GlassCard>
  );
}
