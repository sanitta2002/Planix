import React, { useEffect, useRef, useState } from 'react';
import { Bell, CheckCheck, User, Clock, MessageSquare, AlertCircle, Info, Star } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useNotifications } from '../../hooks/notification/notificationHook';
import { NotificationType } from '../../Service/notification/notificationService';
import { cn } from '../../lib/utils';
import { createNotificationSocket } from '../../socket/socket';
import { addNotification } from '../../store/notificationSlice';
import { toast } from 'sonner';
import type { RootState } from '../../store/Store';
import { formatDistanceToNow } from 'date-fns';

export const NotificationDropdown: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const user = useSelector((state: RootState) => state.auth.user);
    const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = useState<'all' | 'unread'>('unread');

    const filteredNotifications = activeTab === 'unread'
        ? notifications?.filter(n => !n.isRead)
        : notifications;

    useEffect(() => {
        if (!user?.id) return;

        const socket = createNotificationSocket(user.id);

        socket.on('newNotification', (notification) => {
            dispatch(addNotification(notification));
            toast.info('New Notification', {
                description: notification.message,
                duration: 5000,
            });
        });

        return () => {
            socket.disconnect();
        };
    }, [user?.id, dispatch]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 rounded-full hover:bg-white/10 transition-all duration-200 group"
            >
                <Bell className={cn(
                    "w-5 h-5 transition-colors duration-200",
                    isOpen ? "text-indigo-400" : "text-gray-400 group-hover:text-white"
                )} />
                {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-600 text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-[#000000]">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-80 md:w-96 bg-[#0F172A] border border-white/10 rounded-2xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/5">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <button
                                onClick={() => markAllAsRead()}
                                className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                            >
                                <CheckCheck className="w-3.5 h-3.5" />
                                Mark all as read
                            </button>
                        )}
                    </div>

                    {/* Tabs */}
                    <div className="flex border-b border-white/10 px-2">
                        <button
                            onClick={() => setActiveTab('unread')}
                            className={cn(
                                "flex-1 py-2.5 text-xs font-medium transition-all relative",
                                activeTab === 'unread' ? "text-white" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            Unread
                            {unreadCount > 0 && (
                                <span className="ml-1.5 px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-md text-[10px]">
                                    {unreadCount}
                                </span>
                            )}
                            {activeTab === 'unread' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />
                            )}
                        </button>
                        <button
                            onClick={() => setActiveTab('all')}
                            className={cn(
                                "flex-1 py-2.5 text-xs font-medium transition-all relative",
                                activeTab === 'all' ? "text-white" : "text-gray-500 hover:text-gray-300"
                            )}
                        >
                            All
                            {activeTab === 'all' && (
                                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-indigo-500 rounded-full" />
                            )}
                        </button>
                    </div>

                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
                        {filteredNotifications && filteredNotifications.length > 0 ? (
                            filteredNotifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    onClick={() => !notification.isRead && markAsRead(notification._id)}
                                    className={cn(
                                        "p-4 border-b border-white/5 flex gap-3 cursor-pointer transition-all duration-200 hover:bg-white/5",
                                        !notification.isRead && "bg-red-500/5 border-l-2 border-l-red-500"
                                    )}
                                >
                                    <div className="flex-shrink-0 mt-1">
                                        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center overflow-hidden">
                                            {notification.sender?.avatarKey ? (
                                                <img src={notification.sender.avatarKey} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold">
                                                    {notification.sender?.firstName?.[0]}{notification.sender?.lastName?.[0]}
                                                </div>
                                            )}
                                        </div>

                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-gray-200 leading-tight mb-1">
                                            <span className="font-semibold">{notification.sender?.firstName} {notification.sender?.lastName}</span>
                                            {" "}{notification.message}
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[11px] text-gray-500">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                            {!notification.isRead && (
                                                <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="p-10 flex flex-col items-center justify-center text-center">
                                <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                                    <Bell className="w-8 h-8 text-gray-600" />
                                </div>
                                <p className="text-gray-400 text-sm">No notifications yet</p>
                                <p className="text-gray-600 text-xs mt-1">We'll let you know when something happens</p>
                            </div>
                        )}
                    </div>


                </div>
            )}
        </div>
    );
};
