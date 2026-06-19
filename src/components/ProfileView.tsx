import React, { useState } from 'react';
import { Camera, Edit2, Settings, UserCheck, Flame, BookOpen, MessageSquare, Plus, Save, X, Sparkles, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User, Post, Listing } from '../types';

interface ProfileViewProps {
  currentUser: User;
  setCurrentUser: React.Dispatch<React.SetStateAction<User>>;
  posts: Post[];
  listings: Listing[];
}

export default function ProfileView({
  currentUser,
  setCurrentUser,
  posts,
  listings,
}: ProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [handle, setHandle] = useState(currentUser.handle);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [cover, setCover] = useState(currentUser.coverImage || '');

  // Feed tabs
  const [profileFeedTab, setProfileFeedTab] = useState<'posts' | 'favorites'>('posts');

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentUser((prev) => ({
      ...prev,
      name,
      handle,
      bio,
      avatar,
      coverImage: cover,
    }));
    setIsEditing(false);
  };

  // Filter content
  const myPosts = posts.filter((p) => p.author.id === 'me');
  const favListings = listings.filter((l) => l.likedByMe);

  return (
    <div className="flex flex-col max-w-[680px] mx-auto pb-24 text-left">
      {/* 1. Header Hero section */}
      <div className="relative rounded-3xl overflow-hidden bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 shadow-sm">
        {/* Cover image banner */}
        <div className="h-36 bg-gradient-to-r from-blue-600 via-indigo-600 to-indigo-800 relative select-none">
          {currentUser.coverImage && (
            <img src={currentUser.coverImage} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
          )}
          {/* Subtle overlay shading */}
          <div className="absolute inset-0 bg-black/20" />
        </div>

        {/* User absolute positioning profile circle block & trigger buttons */}
        <div className="px-6 pb-6 relative flex flex-col gap-4">
          <div className="flex justify-between items-end -mt-10">
            {/* Massive avatar circle */}
            <div className="w-22 h-22 rounded-full border-4 border-white dark:border-zinc-900 overflow-hidden shadow-md shrink-0 bg-zinc-200">
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
            </div>

            {/* Options bar row */}
            <div className="flex gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-xs font-bold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-full transition-colors flex items-center gap-1.5"
                id="edit-profile-action-btn"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                onClick={() => alert('Opening advanced privacy, accessibility, and account settings panels.')}
                className="p-2 bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-650 dark:text-zinc-350 rounded-full transition-colors"
                title="Privacy & system settings"
              >
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User names handles details */}
          <div className="flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <h2 className="font-extrabold text-xl text-zinc-900 dark:text-white tracking-tight">{currentUser.name}</h2>
              {currentUser.verified && (
                <span className="w-4.5 h-4.5 rounded-full bg-blue-500 text-white flex items-center justify-center text-[11px] font-bold">
                  ✓
                </span>
              )}
            </div>
            <span className="text-xs text-zinc-400 dark:text-zinc-500 font-bold mt-1">@{currentUser.handle}</span>

            {currentUser.bio && (
              <p className="text-zinc-750 dark:text-zinc-300 text-xs leading-relaxed mt-2.5 max-w-md font-sans">
                {currentUser.bio}
              </p>
            )}

            {/* Micro stats summary */}
            <div className="flex items-center gap-4 mt-3 pt-3.5 border-t border-zinc-50 dark:border-zinc-805/60 text-xs">
              <div className="flex gap-1">
                <span className="font-extrabold text-zinc-900 dark:text-white">{currentUser.followers.toLocaleString()}</span>
                <span className="text-zinc-400 font-medium">Followers</span>
              </div>
              <div className="flex gap-1">
                <span className="font-extrabold text-zinc-900 dark:text-white">{currentUser.following.toLocaleString()}</span>
                <span className="text-zinc-400 font-medium">Following</span>
              </div>
              <div className="flex gap-1">
                <span className="font-extrabold text-zinc-900 dark:text-white">{myPosts.length}</span>
                <span className="text-zinc-400 font-medium">Posts</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Interactive authored feed toggle links */}
      <div className="flex border-b border-zinc-100 dark:border-zinc-800 mt-6 mb-4">
        <button
          onClick={() => setProfileFeedTab('posts')}
          className={`flex-1 text-center py-2.5 text-xs font-bold transition-all relative ${
            profileFeedTab === 'posts' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          My Posts ({myPosts.length})
          {profileFeedTab === 'posts' && (
            <motion.div layoutId="profileToggleLine" className="absolute bottom-0 inset-x-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>
        <button
          onClick={() => setProfileFeedTab('favorites')}
          className={`flex-1 text-center py-2.5 text-xs font-bold transition-all relative ${
            profileFeedTab === 'favorites' ? 'text-blue-600 dark:text-blue-400' : 'text-zinc-400 hover:text-zinc-650'
          }`}
        >
          Favorites ({favListings.length})
          {profileFeedTab === 'favorites' && (
            <motion.div layoutId="profileToggleLine" className="absolute bottom-0 inset-x-8 h-0.5 bg-blue-600 dark:bg-blue-400 rounded-full" />
          )}
        </button>
      </div>

      {/* 3. Render list according to chosen tab selection */}
      <div className="flex flex-col gap-4">
        {profileFeedTab === 'posts' ? (
          myPosts.length === 0 ? (
            <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
              <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">You haven't posted anything yet.</span>
            </div>
          ) : (
            myPosts.map((post) => (
              <div
                key={post.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 transition-colors"
              >
                <div className="flex items-center gap-3 mb-2.5">
                  <img src={currentUser.avatar} alt="" className="w-8 h-8 rounded-full object-cover" />
                  <div className="flex flex-col text-left">
                    <span className="font-bold text-xs text-zinc-900 dark:text-whiteLeadingTight">{currentUser.name}</span>
                    <span className="text-[10px] text-zinc-400 font-semibold">{post.timestamp}</span>
                  </div>
                </div>

                <p className="text-xs text-zinc-700 dark:text-zinc-300 antialiased whitespace-pre-wrap leading-relaxed">
                  {post.content}
                </p>

                {post.images.length > 0 && (
                  <div className="mt-3 rounded-xl overflow-hidden aspect-[16/10] bg-zinc-100">
                    <img src={post.images[0]} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                )}
              </div>
            ))
          )
        ) : favListings.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">No favorited marketplace items yet.</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {favListings.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-105 dark:border-zinc-800 overflow-hidden relative shadow-xs"
              >
                <div className="aspect-[4/3] bg-zinc-150 relative">
                  <img src={item.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  <div className="absolute top-2 left-2 z-10 bg-blue-600 text-white font-extrabold text-[10px] px-2 py-0.5 rounded-full">
                    ${item.price.toLocaleString()}
                  </div>
                </div>
                <div className="p-3">
                  <span className="font-extrabold text-xs text-zinc-900 dark:text-zinc-100 block truncate">{item.title}</span>
                  <span className="text-[10px] text-zinc-400 font-medium block mt-0.5">{item.location}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4. Edit dialog modal window drawer */}
      <AnimatePresence>
        {isEditing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 w-full max-w-sm shadow-2xl max-h-[90vh] overflow-y-auto text-left"
              id="profile-editing-modal"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight">Modify Profile</span>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4 text-xs font-sans">
                {/* Name */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Display Name</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                {/* Handle */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Handle (@)</label>
                  <input
                    type="text"
                    required
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                    value={handle}
                    onChange={(e) => setHandle(e.target.value)}
                  />
                </div>

                {/* Cover Asset url Preset */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Coverpreset URL</label>
                  <input
                    type="text"
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                    value={cover}
                    onChange={(e) => setCover(e.target.value)}
                  />
                </div>

                {/* Bio */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Short Bio</label>
                  <textarea
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 h-16 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white resize-none"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-md mt-2 shadow-blue-500/10 text-xs"
                >
                  Save Profile Details
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
