import { useEffect, useState } from "react";
import api from "../lib/api";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, Info, AlertTriangle, XCircle, Clock } from "lucide-react";

interface Notification {
    id: number;
    title: string;
    message: string;
    type: string;
    is_read: boolean;
    created_at: string;
}

export default function NotificationCenter() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);

    const fetchNotifications = async () => {
        try {
            const res = await api.get("/notifications/");
            setNotifications(res.data);
            setUnreadCount(res.data.filter((n: any) => !n.is_read).length);
        } catch (err) {
            console.error("Failed to fetch notifications");
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const markAllAsRead = async () => {
        try {
            await api.post("/notifications/read-all");
            setNotifications(notifications.map(n => ({ ...n, is_read: true })));
            setUnreadCount(0);
        } catch (err) {
            console.error("Failed to mark all as read");
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'SUCCESS': return <CheckCircle className="w-4 h-4 text-emerald-500" />;
            case 'WARNING': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
            case 'DANGER': return <XCircle className="w-4 h-4 text-rose-500" />;
            default: return <Info className="w-4 h-4 text-blue-500" />;
        }
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2.5 text-gray-500 dark:text-gray-400 hover:text-gold-600 dark:hover:text-gold-400 transition-colors rounded-xl hover:bg-gray-100 dark:hover:bg-appcard"
            >
                <Bell className="w-5 h-5" />
                {unreadCount > 0 && (
                    <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-appbg animate-pulse"></span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute right-0 mt-3 w-80 sm:w-96 bg-white dark:bg-appcard border border-gray-100 dark:border-appborder/50 rounded-2xl shadow-2xl z-50 overflow-hidden"
                        >
                            <div className="p-4 border-b border-gray-100 dark:border-appborder/50 flex justify-between items-center bg-gray-50/50 dark:bg-appbg/50">
                                <h3 className="text-sm font-bold text-gray-900 dark:text-white uppercase tracking-widest">Notifications</h3>
                                {unreadCount > 0 && (
                                    <button 
                                        onClick={markAllAsRead}
                                        className="text-[10px] font-bold text-gold-600 hover:text-gold-700 uppercase"
                                    >
                                        Mark all as read
                                    </button>
                                )}
                            </div>

                            <div className="max-h-[400px] overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map((n) => (
                                        <div 
                                            key={n.id} 
                                            className={`p-4 border-b border-gray-50 dark:border-appborder/30 hover:bg-gray-50/50 dark:hover:bg-appbg/50 transition-colors ${!n.is_read ? 'bg-gold-50/20 dark:bg-gold-500/5' : ''}`}
                                        >
                                            <div className="flex gap-3">
                                                <div className="mt-1">{getTypeIcon(n.type)}</div>
                                                <div className="flex-1">
                                                    <p className="text-sm font-bold text-gray-900 dark:text-white mb-1">{n.title}</p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{n.message}</p>
                                                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-gray-400">
                                                        <Clock className="w-3 h-3" />
                                                        {new Date(n.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </div>
                                                </div>
                                                {!n.is_read && (
                                                    <div className="w-2 h-2 bg-gold-500 rounded-full mt-2 shrink-0"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-10 text-center">
                                        <Bell className="w-8 h-8 text-gray-200 dark:text-gray-800 mx-auto mb-3" />
                                        <p className="text-sm text-gray-400 italic font-light">No new notifications</p>
                                    </div>
                                )}
                            </div>

                            <div className="p-3 bg-gray-50/30 dark:bg-appbg/30 text-center">
                                <button className="text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:text-gray-600 dark:hover:text-gray-300">
                                    View All Alerts
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
