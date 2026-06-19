import React, { useState } from 'react';
import { Network, Search, MessageSquare, Sun, Moon, Bell, Sparkles, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from '../types';

interface HeaderProps {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  activeTab: string;
  setActiveTab: (val: string) => void;
  currentUser: User;
  onSearch: (query: string) => void;
}

export default function Header({
  darkMode,
  setDarkMode,
  activeTab,
  setActiveTab,
  currentUser,
  onSearch,
}: HeaderProps) {
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showDMs, setShowDMs] = useState(false);
  const [dmText, setDmText] = useState('');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex Rivera', text: 'Hey there! Loved your latest post on interface design trends.' },
    { id: 2, sender: 'Maya Zen', text: 'Are we still collaborating on the new visual collection tomorrow?' },
  ]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    onSearch(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery('');
    onSearch('');
    setShowSearch(false);
  };

  const handleSendDM = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dmText.trim()) return;
    setMessages((prev) => [...prev, { id: Date.now(), sender: currentUser.name, text: dmText }]);
    setDmText('');
    
    // Simulate auto response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: 'Maya Zen',
          text: "That sounds awesome! I'll review and ping you back with some design specs. 🚀",
        },
      ]);
    }, 1500);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-white/80 dark:bg-zinc-900/80 backdrop-blur-xl border-b border-zinc-100 dark:border-zinc-800 transition-colors duration-300">
      <div className="mx-auto max-w-5xl px-4 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Identity */}
        <div 
          onClick={() => { setActiveTab('home'); clearSearch(); }}
          className="flex items-center gap-2 cursor-pointer group"
          id="brand-logo"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/10 group-hover:scale-105 transition-transform">
            <Network className="w-5.5 h-5.5" />
          </div>
          <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent font-sans">
            NexusSocial
          </span>
        </div>

        {/* Center: Expandable Desktop Search */}
        <div className="hidden sm:flex items-center flex-1 max-w-sm relative">
          <div className="absolute left-3 text-zinc-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search posts, marketplace, creators..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-sm bg-zinc-100 dark:bg-zinc-800/80 rounded-full border border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-blue-100 dark:focus:ring-zinc-800 transition-all text-zinc-800 dark:text-zinc-100"
          />
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search toggler */}
          <button
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 sm:hidden rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            title="Search"
            id="mobile-search-btn"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Theme Toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors"
            title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            id="theme-toggle-btn"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5" />}
          </button>

          {/* DMs / Messaging Tool */}
          <div className="relative">
            <button
              onClick={() => setShowDMs(!showDMs)}
              className={`p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-300 transition-colors relative ${
                showDMs ? 'bg-zinc-100 dark:bg-zinc-800 text-blue-600' : ''
              }`}
              id="messaging-btn"
              title="Direct Messages"
            >
              <MessageSquare className="w-5 h-5" />
              <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-[10px] font-bold text-white flex items-center justify-center rounded-full border border-white dark:border-zinc-900 shadow-sm">
                3
              </div>
            </button>

            {/* DM Dropdown Card */}
            <AnimatePresence>
              {showDMs && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  className="absolute right-0 mt-2 w-80 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-zinc-100 dark:border-zinc-800 overflow-hidden"
                  id="direct-messages-panel"
                >
                  <div className="p-4 border-b border-zinc-100 dark:border-zinc-800 flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/50">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-zinc-900 dark:text-white text-sm">Direct Messages</span>
                    </div>
                    <span className="text-[10px] font-bold bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      Live Sim
                    </span>
                  </div>

                  {/* Messages Feed */}
                  <div className="max-h-60 overflow-y-auto p-3 flex flex-col gap-2">
                    {messages.map((m) => {
                      const isMe = m.sender === currentUser.name;
                      return (
                        <div
                          key={m.id}
                          className={`flex flex-col max-w-[85%] rounded-2xl px-3 py-2 text-xs ${
                            isMe
                              ? 'bg-blue-600 text-white self-end rounded-tr-sm'
                              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 self-start rounded-tl-sm'
                          }`}
                        >
                          {!isMe && <span className="font-bold text-[10px] mb-0.5 text-blue-600 dark:text-blue-400">{m.sender}</span>}
                          <span>{m.text}</span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Reply Input Form */}
                  <form onSubmit={handleSendDM} className="p-2 border-t border-zinc-100 dark:border-zinc-800 flex gap-2">
                    <input
                      type="text"
                      className="flex-1 text-xs bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-100 dark:border-zinc-800 rounded-full px-3 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:border-blue-500"
                      placeholder="Type a message..."
                      value={dmText}
                      onChange={(e) => setDmText(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors flex items-center justify-center shadow-md shadow-blue-500/10"
                    >
                      <Send className="w-3 h-3" />
                    </button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quick Profile avatar link */}
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-transform active:scale-95 ${
              activeTab === 'profile' ? 'border-blue-500 ring-2 ring-blue-100 dark:ring-zinc-800' : 'border-zinc-200 dark:border-zinc-700'
            }`}
            id="header-profile-avatar-btn"
          >
            <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          </button>
        </div>
      </div>

      {/* Mobile Search Overlay Panel */}
      <AnimatePresence>
        {showSearch && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="sm:hidden w-full bg-white dark:bg-zinc-900 border-b border-zinc-100 dark:border-zinc-800 overflow-hidden px-4 py-3"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search NexusSocial..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-9 pr-10 py-2 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-full focus:outline-none text-zinc-900 dark:text-white"
                autoFocus
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-400" />
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-2 text-xs text-zinc-400 hover:text-zinc-600 font-semibold"
                >
                  Clear
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
