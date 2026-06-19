import React from 'react';
import { Home, Users, Store, Bell, User } from 'lucide-react';
import { motion } from 'motion/react';

interface BottomNavBarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notificationsCount: number;
  currentUserAvatar: string;
}

export default function BottomNavBar({
  activeTab,
  setActiveTab,
  notificationsCount,
  currentUserAvatar,
}: BottomNavBarProps) {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'community', label: 'Community', icon: Users },
    { id: 'marketplace', label: 'Shop', icon: Store },
    { id: 'alerts', label: 'Alerts', icon: Bell, badge: true },
    { id: 'profile', label: 'Profile', icon: User, useAvatar: true },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-zinc-900/95 backdrop-blur-md border-t border-zinc-100 dark:border-zinc-800 py-2 pb-safe px-4 shadow-[0_-4px_16px_rgba(0,0,0,0.03)] transition-colors">
      <div className="mx-auto max-w-lg flex items-center justify-between">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center relative flex-1 text-center py-1 group"
              id={`nav-tab-${tab.id}`}
            >
              <div className="relative flex items-center justify-center">
                {/* Visual Active Indicator backdrop circle */}
                {isActive && (
                  <motion.div
                    layoutId="navGlowCircle"
                    className="absolute w-12 h-12 bg-blue-50 dark:bg-zinc-800 rounded-full -z-10"
                    transition={{ type: 'spring', stiffness: 350, damping: 25 }}
                  />
                )}

                {tab.useAvatar ? (
                  <div
                    className={`w-6.5 h-6.5 rounded-full overflow-hidden border-2 transition-all group-hover:scale-105 duration-200 ${
                      isActive ? 'border-blue-600 scale-105' : 'border-transparent'
                    }`}
                  >
                    <img
                      src={currentUserAvatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ) : (
                  <Icon
                    className={`w-5.5 h-5.5 transition-all group-hover:scale-110 duration-200 ${
                      isActive
                        ? 'text-blue-600 dark:text-blue-400 stroke-[2.2px]'
                        : 'text-zinc-400 dark:text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300'
                    }`}
                  />
                )}

                {/* Styled Badge bubble for Alerts tab */}
                {tab.badge && notificationsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[17px] h-[17px] bg-red-500 rounded-full text-[9px] font-bold text-white flex items-center justify-center border border-white dark:border-zinc-900 px-1 shadow-sm">
                    {notificationsCount}
                  </span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 font-semibold tracking-wide transition-colors ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 dark:text-zinc-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
