"use client"

import { useState, useEffect } from "react"
import { Link } from "@/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { apiClient } from "@/lib/api"
import { formatDistanceToNow } from "date-fns"
import {
    Bell,
    Briefcase,
    Star,
    MessageSquare,
    FileText,
    DollarSign,
    CheckCircle,
    XCircle,
    Clock,
    Loader2,
} from "lucide-react"

interface Notification {
    _id: string
    type: string
    title: string
    message: string
    isRead: boolean
    actionUrl: string
    createdAt: string
    metadata?: any
}

interface NotificationDropdownProps {
    onClose: () => void
    onUpdate: () => void
}

const getNotificationIcon = (type: string) => {
    if (type.includes("application") || type.includes("hire")) return Briefcase
    if (type.includes("rating")) return Star
    if (type.includes("message")) return MessageSquare
    if (type.includes("document")) return FileText
    if (type.includes("payment")) return DollarSign
    if (type.includes("work")) return Clock
    return Bell
}

const getNotificationColor = (type: string) => {
    if (type.includes("approved") || type.includes("hired") || type.includes("accepted")) return "text-green-500"
    if (type.includes("rejected") || type.includes("declined")) return "text-red-500"
    if (type.includes("pending") || type.includes("prompt")) return "text-yellow-500"
    return "text-blue-500"
}

export function NotificationDropdown({ onClose, onUpdate }: NotificationDropdownProps) {
    const [notifications, setNotifications] = useState<Notification[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchNotifications()
    }, [])

    const fetchNotifications = async () => {
        try {
            setLoading(true)
            const response: any = await apiClient.getNotifications({ limit: 5 })
            setNotifications(response.notifications || [])
        } catch (error) {
            console.error("Error fetching notifications:", error)
        } finally {
            setLoading(false)
        }
    }

    const handleMarkAsRead = async (notificationId: string) => {
        try {
            await apiClient.markNotificationAsRead(notificationId)
            setNotifications(prev =>
                prev.map(n => (n._id === notificationId ? { ...n, isRead: true } : n))
            )
            onUpdate()
        } catch (error) {
            console.error("Error marking notification as read:", error)
        }
    }

    const handleMarkAllAsRead = async () => {
        try {
            await apiClient.markAllNotificationsAsRead()
            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            onUpdate()
        } catch (error) {
            console.error("Error marking all as read:", error)
        }
    }

    const handleNotificationClick = (notification: Notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification._id)
        }
        onClose()
    }

    return (
        <div className="w-full bg-card text-card-foreground">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border/80">
                <h3 className="font-semibold text-sm">Notifications</h3>
                {notifications.some(n => !n.isRead) && (
                    <button
                        type="button"
                        onClick={handleMarkAllAsRead}
                        className="text-xs font-medium text-primary hover:text-primary/80 transition-colors cursor-pointer"
                    >
                        Mark all as read
                    </button>
                )}
            </div>

            <ScrollArea className="h-[360px]">
                {loading ? (
                    <div className="flex items-center justify-center h-40">
                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-40 text-center p-4">
                        <Bell className="h-10 w-10 text-muted-foreground/40 mb-2" />
                        <p className="text-xs text-muted-foreground">No notifications yet</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/60">
                        {notifications.map((notification) => {
                            const Icon = getNotificationIcon(notification.type)
                            const iconColor = getNotificationColor(notification.type)

                            return (
                                <Link
                                    key={notification._id}
                                    href={notification.actionUrl || "/notifications"}
                                    onClick={() => handleNotificationClick(notification)}
                                    className="block"
                                >
                                    <div
                                        className={`p-3.5 hover:bg-accent/50 transition-colors ${
                                            !notification.isRead ? "bg-primary/[0.06] dark:bg-primary/[0.12]" : ""
                                        }`}
                                    >
                                        <div className="flex gap-3">
                                            <div className={`mt-0.5 ${iconColor}`}>
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 space-y-1">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className={`text-xs font-medium text-foreground ${!notification.isRead ? "font-semibold" : ""}`}>
                                                        {notification.title}
                                                    </p>
                                                    {!notification.isRead && (
                                                        <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1" />
                                                    )}
                                                </div>
                                                <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                                                    {notification.message}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground/80">
                                                    {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </ScrollArea>

            <div className="p-2 border-t border-border/80 bg-muted/20">
                <Link href="/notifications" onClick={onClose} className="block">
                    <button
                        type="button"
                        className="w-full py-2 text-center text-xs font-semibold text-muted-foreground hover:text-foreground hover:bg-accent/80 rounded-xl transition-colors cursor-pointer"
                    >
                        View all notifications
                    </button>
                </Link>
            </div>
        </div>
    )
}
