
import React from 'react';
import { Bell, Check } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNotifications } from '@/lib/context/notifications-provider';
import { NotificationItem } from './NotificationItem';

export function NotificationCenter() {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative rounded-full text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800">
          <Bell className="size-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 size-2 rounded-full bg-red-500 border-2 border-[#09090b]" />
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0 bg-[#121214] border-zinc-800">
        <div className="flex items-center justify-between p-4 border-b border-zinc-800">
            <h3 className="font-semibold text-zinc-200">Notifications</h3>
            {unreadCount > 0 && (
                <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={markAllAsRead}
                    className="h-auto p-0 text-xs text-zinc-500 hover:text-violet-400"
                >
                    Mark all read
                </Button>
            )}
        </div>

        <ScrollArea className="h-[300px]">
            <div className="p-2 space-y-1">
                {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-32 text-center text-zinc-500">
                        <Bell className="size-8 mb-2 opacity-20" />
                        <p className="text-sm">No notifications</p>
                    </div>
                ) : (
                    notifications.map(notif => (
                        <NotificationItem 
                            key={notif.id}
                            {...notif}
                            onClick={() => markAsRead(notif.id)}
                        />
                    ))
                )}
            </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
