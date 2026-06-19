import React from 'react';
import { Bell, Heart, MessageSquare, UserPlus, ShoppingBag, Check, Trash2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Notification } from '../types';

interface AlertsPanelProps {
  notifications: Notification[];
  setNotifications: React.Dispatch<React.SetStateAction<Notification[]>>;
  onMarkAllAsRead: () => void;
}

export default function AlertsPanel({
  notifications,
  setNotifications,
  onMarkAllAsRead,
}: AlertsPanelProps) {
  const getIconClass = (type: string) => {
    switch (type) {
      case 'like':
        return { bg: 'bg-rose-50 dark:bg-rose-950/20 text-rose-600', icon: Heart };
      case 'comment':
        return { bg: 'bg-sky-50 dark:bg-sky-950/20 text-sky-600', icon: MessageSquare };
      case 'follow':
        return { bg: 'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600', icon: UserPlus };
      case 'marketplace':
        return { bg: 'bg-amber-50 dark:bg-amber-950/20 text-amber-600', icon: ShoppingBag };
      default:
        return { bg: 'bg-zinc-50 dark:bg-zinc-850 text-blue-600', icon: Bell };
    }
  };

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const handleDeleteNotification = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleClearAll = () => {
    setNotifications([]);
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col gap-6 pb-24 max-w-[680px] mx-auto text-left">
      {/* Title Header rows */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">Alerts</h2>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Keep pace with activities across your nodes</span>
        </div>

        <div className="flex gap-2">
          {unreadCount > 0 && (
            <button
              onClick={onMarkAllAsRead}
              className="px-3.5 py-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1"
            >
              <Check className="w-3.5 h-3.5" />
              Catch Up
            </button>
          )}
          {notifications.length > 0 && (
            <button
              onClick={handleClearAll}
              className="px-3.5 py-1.5 text-xs font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded-full transition-colors flex items-center gap-1"
            >
              <Trash2 className="w-3.5 h-3.5" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Main Flow List */}
      <div className="bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-50 dark:border-zinc-805 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-800/20">
          <span className="font-bold text-xs text-zinc-500 tracking-wider uppercase">Notifications Feed</span>
          <span className="text-xs font-semibold bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded-full">
            {unreadCount} Unread
          </span>
        </div>

        {notifications.length === 0 ? (
          <div className="text-center py-14 p-6">
            <div className="w-12 h-12 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 dark:text-zinc-500 mx-auto mb-3">
              <Bell className="w-6 h-6" />
            </div>
            <span className="font-bold text-sm text-zinc-400 dark:text-zinc-500 block">Your log is completely clear!</span>
            <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-1 font-medium font-sans">
              No new interactions detected at this moment. You are caught up!
            </p>
          </div>
        ) : (
          <div className="divide-y divide-zinc-50 dark:divide-zinc-800">
            <AnimatePresence initial={false}>
              {notifications.map((item) => {
                const { bg, icon: Icon } = getIconClass(item.type);

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    onClick={() => handleToggleRead(item.id)}
                    className={`p-4 flex gap-3.5 items-start cursor-pointer transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/40 relative ${
                      !item.read ? 'bg-blue-50/20 dark:bg-zinc-800/10' : ''
                    }`}
                  >
                    {/* Inline unread dot */}
                    {!item.read && (
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    )}

                    {/* Left Icon badge wrapper */}
                    <div className={`w-9 h-9 rounded-xl shrink-0 flex items-center justify-center ${bg} ml-1`}>
                      <Icon className="w-5 h-5" />
                    </div>

                    {/* Sender avatar */}
                    <div className="w-8 h-8 rounded-full overflow-hidden shrink-0 border relative">
                      <img src={item.sender.avatar} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>

                    {/* Main content body details */}
                    <div className="flex-1 min-w-0 flex flex-col text-left gap-0.5">
                      <p className="text-xs text-zinc-700 dark:text-zinc-300 leading-normal">
                        <span className="font-extrabold text-zinc-900 dark:text-white mr-1 select-all cursor-pointer">
                          {item.sender.name}
                        </span>
                        {item.text}
                      </p>
                      <span className="text-[10px] text-zinc-400 font-semibold">{item.timestamp}</span>
                    </div>

                    {/* Close action button */}
                    <button
                      onClick={(e) => handleDeleteNotification(e, item.id)}
                      className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 hover:text-zinc-650 rounded-full transition-colors shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
}
