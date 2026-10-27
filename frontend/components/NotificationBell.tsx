"use client"

import { useState } from "react"
import { Bell } from "lucide-react"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { NotificationDropdown } from "@/components/NotificationDropdown"
import { useNotification } from "@/contexts/NotificationContext"

export function NotificationBell() {
    const { unreadCount, fetchUnreadCount } = useNotification();
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenChange = (open: boolean) => {
        setIsOpen(open);
    }

    return (
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
            <PopoverTrigger asChild>
                <button
                    type="button"
                    className="relative inline-flex items-center justify-center w-9 h-9 rounded-xl border border-border/70 bg-card/80 hover:bg-accent/80 text-muted-foreground hover:text-foreground shadow-xs transition-all duration-150 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 cursor-pointer"
                    aria-label="Notifications"
                >
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                        <span
                            className="absolute -top-1 -right-1 min-w-4 h-4 px-1 flex items-center justify-center rounded-full bg-destructive text-destructive-foreground text-[10px] font-bold shadow-xs animate-pulse"
                        >
                            {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-80 sm:w-96 p-0 rounded-2xl border border-border/80 bg-popover shadow-2xl overflow-hidden" align="end">
                <NotificationDropdown onClose={() => setIsOpen(false)} onUpdate={fetchUnreadCount} />
            </PopoverContent>
        </Popover>
    )
}
