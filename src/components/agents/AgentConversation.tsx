
import React, { useRef, useState, useEffect } from 'react';
import { GlassCard } from '../ui/glass-card';
import { Button } from '../ui/button';
import { X, Copy, Check, Terminal, User, Send, Plus, Users, MessageSquare } from 'lucide-react';
import { ScrollArea } from '../ui/scroll-area';
import { cn } from '../../lib/utils';
import { toast } from 'sonner';
import { AgentNode } from './AgentTree';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface AgentConversationProps {
  agent: AgentNode;
  allAgents?: AgentNode[];
  onClose: () => void;
}

interface Message {
    id: string;
    role: 'user' | 'agent';
    agentId?: string; // If role is agent
    content: string;
    time: string;
    thoughts?: string;
    code?: string;
}

export function AgentConversation({ agent, allAgents = [], onClose }: AgentConversationProps) {
  if (!agent) return null;

  const [participants, setParticipants] = useState<AgentNode[]>([agent]);
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'user', content: 'Implement the OAuth2 login flow using Google provider.', time: '10:00 AM' },
    { id: '2', role: 'agent', agentId: agent.id, content: 'I will start by creating the necessary database schema for User accounts, then implement the API route handlers.', time: '10:01 AM', thoughts: 'Planning phase...' },
  ]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [inputMessage, setInputMessage] = useState('');

  // Auto-scroll
  useEffect(() => {
      if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
      }
  }, [messages]);

  const handleSendMessage = () => {
      if (!inputMessage.trim()) return;
      
      const newMessage: Message = {
          id: Date.now().toString(),
          role: 'user',
          content: inputMessage,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, newMessage]);
      setInputMessage('');

      // Simulate Response
      setTimeout(() => {
          // Pick a random agent to respond if multiple
          const responder = participants[Math.floor(Math.random() * participants.length)];
          
          const responses = [
              "I'll get right on that.",
              "Analyzing the requirements...",
              "I've identified a potential dependency issue.",
              "Updating the codebase now.",
              "Can you clarify the scope for this task?"
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];

          const responseMsg: Message = {
              id: (Date.now() + 1).toString(),
              role: 'agent',
              agentId: responder.id,
              content: randomResponse,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              thoughts: participants.length > 1 ? `Collaborating with ${participants.filter(p => p.id !== responder.id).map(p => p.name).join(', ') || 'team'}` : 'Processing request...'
          };
          
          setMessages(prev => [...prev, responseMsg]);
      }, 1500);
  };

  const addParticipant = (newAgent: AgentNode) => {
      if (participants.some(p => p.id === newAgent.id)) return;
      setParticipants(prev => [...prev, newAgent]);
      
      setMessages(prev => [...prev, {
          id: Date.now().toString(),
          role: 'agent',
          agentId: newAgent.id,
          content: `Joining conversation. I am the ${newAgent.role}.`,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
      
      toast.success(`${newAgent.name} joined`, {
          description: "Now collaborating in multi-agent mode."
      });
  };

  return (
    <GlassCard 
        className="fixed inset-y-0 right-0 w-[600px] z-40 flex flex-col rounded-l-2xl rounded-r-none border-r-0 animate-in slide-in-from-right duration-300 shadow-2xl"
        variant="elevated"
        padding="none"
    >
      <div className="p-4 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/80 backdrop-blur">
        <div className="flex flex-col">
            <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                <Users className="size-4 text-violet-400" />
                {participants.length > 1 ? 'Team Collaboration' : `Conversation: ${agent.name}`}
            </h3>
            <div className="flex items-center gap-1 mt-1">
                {participants.map(p => (
                    <span key={p.id} className="text-[10px] px-1.5 py-0.5 bg-zinc-800 rounded text-zinc-400 border border-zinc-700">
                        {p.name}
                    </span>
                ))}
            </div>
        </div>
        <div className="flex items-center gap-2">
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="h-8 text-xs border-zinc-700 text-zinc-400">
                        <Plus className="size-3 mr-1.5" /> Invite
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800 text-zinc-200">
                    {allAgents.filter(a => !participants.some(p => p.id === a.id)).map(a => (
                        <DropdownMenuItem key={a.id} onClick={() => addParticipant(a)} className="text-xs cursor-pointer hover:bg-zinc-800">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2" />
                            {a.name}
                        </DropdownMenuItem>
                    ))}
                    {allAgents.filter(a => !participants.some(p => p.id === a.id)).length === 0 && (
                        <div className="px-2 py-1.5 text-xs text-zinc-500 italic">No other agents available</div>
                    )}
                </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-zinc-500 hover:text-zinc-300">
                <X className="size-4" />
            </Button>
        </div>
      </div>

      <ScrollArea className="flex-1 p-0" ref={scrollRef}>
        <div className="p-6 space-y-6">
            {messages.map((msg, i) => {
                const msgAgent = participants.find(p => p.id === msg.agentId);
                return (
                    <div key={i} className={cn("flex gap-4", msg.role === 'user' ? "flex-row-reverse" : "")}>
                        <div className={cn(
                            "size-8 rounded-full flex items-center justify-center shrink-0 mt-1 border border-white/10",
                            msg.role === 'user' ? "bg-zinc-700 text-zinc-300" : "bg-violet-600 text-white"
                        )} title={msgAgent?.name}>
                            {msg.role === 'user' ? <User className="size-4" /> : <Terminal className="size-4" />}
                        </div>
                        
                        <div className={cn(
                            "flex-1 max-w-[80%] space-y-2",
                            msg.role === 'user' ? "items-end" : "items-start"
                        )}>
                            {msg.role === 'agent' && msgAgent && (
                                <div className="text-[10px] text-zinc-500 ml-1 font-bold uppercase tracking-wider">
                                    {msgAgent.name}
                                </div>
                            )}

                            {msg.thoughts && (
                                <div className="text-xs text-zinc-500 italic bg-zinc-900/50 p-2 rounded border border-zinc-800/50 mb-2 w-full">
                                    💭 {msg.thoughts}
                                </div>
                            )}
                            
                            <div className={cn(
                                "p-4 rounded-2xl text-sm leading-relaxed border shadow-sm",
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
                );
            })}
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t border-zinc-800 bg-zinc-900/50">
        <div className="relative">
            <input 
                className="w-full bg-zinc-950 border border-zinc-800 rounded-full pl-4 pr-12 py-3 text-sm text-zinc-200 focus:ring-1 focus:ring-violet-500 focus:border-violet-500 outline-none transition-all"
                placeholder={participants.length > 1 ? "Message the team..." : `Message ${agent.name}...`}
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-violet-600 text-white hover:bg-violet-500 transition-colors shadow-lg shadow-violet-500/20"
            >
                <Send className="size-4" />
            </button>
        </div>
      </div>
    </GlassCard>
  );
}
