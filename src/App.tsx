import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Header from './components/Header';
import BottomNavBar from './components/BottomNavBar';
import HomeFeed from './components/HomeFeed';
import Marketplace from './components/Marketplace';
import CommunityFeed from './components/CommunityFeed';
import AlertsPanel from './components/AlertsPanel';
import ProfileView from './components/ProfileView';

import {
  currentUser as initialUser,
  initialPosts,
  initialListings,
  sampleCommunities,
  initialNotifications,
  sampleStories,
} from './data';
import { User, Post, Listing, Community, Notification, Story } from './types';

export default function App() {
  // Theme state
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('nexus_dark_mode');
    if (saved) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Main persistent state engines
  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem('nexus_current_user');
    return saved ? JSON.parse(saved) : initialUser;
  });

  const [posts, setPosts] = useState<Post[]>(() => {
    const saved = localStorage.getItem('nexus_posts');
    return saved ? JSON.parse(saved) : initialPosts;
  });

  const [listings, setListings] = useState<Listing[]>(() => {
    const saved = localStorage.getItem('nexus_listings');
    return saved ? JSON.parse(saved) : initialListings;
  });

  const [communities, setCommunities] = useState<Community[]>(() => {
    const saved = localStorage.getItem('nexus_communities');
    return saved ? JSON.parse(saved) : sampleCommunities;
  });

  const [notifications, setNotifications] = useState<Notification[]>(() => {
    const saved = localStorage.getItem('nexus_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [stories] = useState<Story[]>(sampleStories);

  // Active navigation tab
  const [activeTab, setActiveTab] = useState<string>('home');

  // Search filter
  const [searchFilter, setSearchFilter] = useState('');

  // Synchronize storage
  useEffect(() => {
    localStorage.setItem('nexus_dark_mode', String(darkMode));
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('nexus_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('nexus_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('nexus_listings', JSON.stringify(listings));
  }, [listings]);

  useEffect(() => {
    localStorage.setItem('nexus_communities', JSON.stringify(communities));
  }, [communities]);

  useEffect(() => {
    localStorage.setItem('nexus_notifications', JSON.stringify(notifications));
  }, [notifications]);

  // Global Actions
  const handleToggleJoinCommunity = (id: string) => {
    setCommunities((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const joined = !c.joined;
          if (joined) {
            handleNewNotification(`You joined the "${c.name}" community!`, 'marketplace');
          }
          return {
            ...c,
            joined,
            membersCount: joined
              ? `${(parseInt(c.membersCount) + 1).toLocaleString()} Members`
              : `${(parseInt(c.membersCount) - 1).toLocaleString()} Members`,
          };
        }
        return c;
      })
    );
  };

  const handleNewNotification = (text: string, type: 'like' | 'comment' | 'follow' | 'mention' | 'marketplace', linkId?: string) => {
    const newNotif: Notification = {
      id: `notification_${Date.now()}`,
      type,
      sender: {
        id: 'system',
        name: 'Nexus Bot',
        handle: 'nexus_social',
        avatar: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&auto=format&fit=crop&q=80',
        followers: 1000000,
        following: 1,
        verified: true,
      },
      text,
      timestamp: 'Just now',
      read: false,
      linkId,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Render Sub view
  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeFeed
            posts={posts}
            setPosts={setPosts}
            stories={stories}
            communities={communities}
            currentUser={currentUser}
            onJoinCommunity={handleToggleJoinCommunity}
            searchFilter={searchFilter}
          />
        );
      case 'community':
        return (
          <CommunityFeed
            communities={communities}
            onToggleJoin={handleToggleJoinCommunity}
            searchFilter={searchFilter}
          />
        );
      case 'marketplace':
        return (
          <Marketplace
            listings={listings}
            setListings={setListings}
            currentUser={currentUser}
            onNewNotification={handleNewNotification}
            searchFilter={searchFilter}
          />
        );
      case 'alerts':
        return (
          <AlertsPanel
            notifications={notifications}
            setNotifications={setNotifications}
            onMarkAllAsRead={handleMarkAllAsRead}
          />
        );
      case 'profile':
        return (
          <ProfileView
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            posts={posts}
            listings={listings}
          />
        );
      default:
        return (
          <HomeFeed
            posts={posts}
            setPosts={setPosts}
            stories={stories}
            communities={communities}
            currentUser={currentUser}
            onJoinCommunity={handleToggleJoinCommunity}
            searchFilter={searchFilter}
          />
        );
    }
  };

  return (
    <div className={`min-h-screen pb-20 font-sans transition-colors duration-300 ${
      darkMode ? 'bg-[rgba(15,17,20,1)] text-zinc-100 dark' : 'bg-[rgba(244,246,249,1)] text-[rgba(25,28,30,1)]'
    }`} id="nexus-social-app-root">
      
      {/* 1. Header component */}
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onSearch={setSearchFilter}
      />

      {/* 2. Primary Layout Container framing inside max constraints */}
      <main className="mx-auto max-w-5xl px-4 py-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. Bottom persistent navigation buttons */}
      <BottomNavBar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notificationsCount={notifications.filter((n) => !n.read).length}
        currentUserAvatar={currentUser.avatar}
      />
    </div>
  );
}
