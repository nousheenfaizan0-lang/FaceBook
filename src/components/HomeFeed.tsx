import React, { useState } from 'react';
import { Sparkles, MessageCircle, Heart, Share2, Bookmark, Plus, MapPin, Tag, Film, Video, Image as ImageIcon, Smile, Send, X, MoreHorizontal, MessageSquare, Flame } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Post, User, Story, Community, Comment } from '../types';

interface HomeFeedProps {
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  stories: Story[];
  communities: Community[];
  currentUser: User;
  onJoinCommunity: (id: string) => void;
  searchFilter: string;
}

export default function HomeFeed({
  posts,
  setPosts,
  stories,
  communities,
  currentUser,
  onJoinCommunity,
  searchFilter,
}: HomeFeedProps) {
  // New post states
  const [newPostText, setNewPostText] = useState('');
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
  const [showAiModal, setShowAiModal] = useState(false);
  
  // Interactive UI states
  const [activeStory, setActiveStory] = useState<Story | null>(null);
  const [activeStoryIdx, setActiveStoryIdx] = useState<number>(0);
  const [expandedCommentsPostId, setExpandedCommentsPostId] = useState<string | null>(null);
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  // Preset Unsplash pictures for selection
  const photoPresets = [
    { name: 'Abstract Art', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&auto=format&fit=crop&q=80' },
    { name: 'Tech Layout', url: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=800&auto=format&fit=crop&q=80' },
    { name: 'Workspace', url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?w=800&auto=format&fit=crop&q=80' },
    { name: 'Scenic Coast', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=800&auto=format&fit=crop&q=80' },
    { name: 'Cozy Interior', url: 'https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=800&auto=format&fit=crop&q=80' },
  ];

  // Story click handler
  const handleOpenStory = (story: Story, index: number) => {
    setActiveStory(story);
    setActiveStoryIdx(index);
  };

  const handleNextStory = () => {
    if (activeStoryIdx < stories.length - 1) {
      const nextIdx = activeStoryIdx + 1;
      setActiveStory(stories[nextIdx]);
      setActiveStoryIdx(nextIdx);
    } else {
      setActiveStory(null);
    }
  };

  const handlePrevStory = () => {
    if (activeStoryIdx > 0) {
      const prevIdx = activeStoryIdx - 1;
      setActiveStory(stories[prevIdx]);
      setActiveStoryIdx(prevIdx);
    } else {
      setActiveStory(null);
    }
  };

  // Create Post
  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPostText.trim() && !selectedPhoto) return;

    const newPost: Post = {
      id: `post_${Date.now()}`,
      author: currentUser,
      content: newPostText,
      images: selectedPhoto ? [selectedPhoto] : [],
      likes: 0,
      shares: 0,
      timestamp: 'Just now',
      comments: [],
      likedByMe: false,
    };

    setPosts([newPost, ...posts]);
    setNewPostText('');
    setSelectedPhoto(null);
  };

  // AI Content Suggestion
  const handleAiWriterRefine = () => {
    if (!newPostText.trim()) {
      alert('Please write a seed sentence first, then tap AI Refine!');
      return;
    }
    setIsEnhancing(true);
    // Simulate smart writing helper
    setTimeout(() => {
      const prompts = [
        `🧠 **Thought Leader**: "${newPostText} In 2026, we're seeing an unprecedented convergence of high-fidelity interaction design and spatial layers. Let's build the future together."`,
        `✨ **Aesthetic Accent**: "Designing at the speed of thought. ⚡ ${newPostText} The gradient flows, the canvas feels tactile, and the vibe is completely dialed in."`,
        `🔥 **Hype Launch**: "Interface update unlocked! 🚀 ${newPostText} Built using pristine layout architecture, ultra-fine micro-animations, and full color-sync."`,
      ];
      setAiSuggestions(prompts);
      setIsEnhancing(false);
      setShowAiModal(true);
    }, 1200);
  };

  const applyAiSuggestion = (suggestion: string) => {
    // Strip bullet icon
    const cleaned = suggestion.replace(/^(\s*[^:]+:\s*")/i, '').replace(/"\s*$/, '');
    setNewPostText(cleaned);
    setShowAiModal(false);
  };

  // Like Toggle
  const handleLike = (postId: string) => {
    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          const isLiking = !p.likedByMe;
          return {
            ...p,
            likedByMe: isLiking,
            likes: isLiking ? p.likes + 1 : p.likes - 1,
          };
        }
        return p;
      })
    );
  };

  // Bookmark Toggle
  const handleBookmark = (postId: string) => {
    setPosts(prev =>
      prev.map(p => (p.id === postId ? { ...p, bookmarkedByMe: !p.bookmarkedByMe } : p))
    );
  };

  // Add Comment
  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      author: currentUser,
      content: text,
      timestamp: 'Just now',
    };

    setPosts(prev =>
      prev.map(p => {
        if (p.id === postId) {
          return { ...p, comments: [...p.comments, newComment] };
        }
        return p;
      })
    );

    setCommentInputs(prev => ({ ...prev, [postId]: '' }));
  };

  const filteredPosts = posts.filter(
    p =>
      p.content.toLowerCase().includes(searchFilter.toLowerCase()) ||
      p.author.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (p.location && p.location.toLowerCase().includes(searchFilter.toLowerCase()))
  );

  return (
    <div className="flex flex-col gap-6 pb-24 max-w-[680px] mx-auto">
      {/* 1. Highlights / Stories Section */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 transition-colors shadow-sm">
        <div className="flex items-center justify-between mb-3 px-1">
          <span className="font-bold text-zinc-900 dark:text-white text-base tracking-tight flex items-center gap-1.5">
            <Flame className="w-5 h-5 text-orange-500 fill-orange-500" />
            Highlights
          </span>
          <button className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline">Watch all</button>
        </div>

        {/* Stories Horizontal loop */}
        <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar scroll-smooth">
          {stories.map((story, idx) => {
            const isOwn = story.author.id === 'me';
            return (
              <div
                key={story.id}
                onClick={() => handleOpenStory(story, idx)}
                className="flex flex-col items-center flex-shrink-0 cursor-pointer group"
              >
                <div className="relative w-18 h-26 rounded-xl overflow-hidden hover:scale-102 transition-transform shadow-xs flex flex-col justify-end p-2 bg-zinc-100 dark:bg-zinc-800 border dark:border-zinc-800">
                  <img
                    src={story.image}
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle darkening vignette overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                  {/* Profile avatar overlay at top-left block */}
                  <div className="absolute top-2 left-2 z-10">
                    <img
                      src={story.author.avatar}
                      alt={story.author.name}
                      className={`w-7 h-7 rounded-full object-cover border-2 ${
                        story.viewed ? 'border-zinc-300' : 'border-blue-500'
                      }`}
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  {/* Center Add button if item is "Your Story" */}
                  {isOwn && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg transform scale-100 group-hover:scale-110 transition-transform border-2 border-white dark:border-zinc-900 pointer-events-auto">
                        <Plus className="w-4 h-4 stroke-[3px]" />
                      </div>
                    </div>
                  )}

                  {/* Handle text label */}
                  <span className="relative z-10 text-[9px] font-bold text-white text-center truncate w-full antialiased filter drop-shadow-md">
                    {isOwn ? 'Your Story' : story.author.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. "What's on your mind?" Input Box */}
      <section className="bg-white dark:bg-zinc-900 rounded-2xl p-4 border border-zinc-100 dark:border-zinc-800 transition-colors shadow-sm">
        <form onSubmit={handleCreatePost} className="flex flex-col gap-3">
          <div className="flex gap-3 items-start">
            <img
              src={currentUser.avatar}
              alt=""
              className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <textarea
                value={newPostText}
                onChange={(e) => setNewPostText(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent border-0 resize-none focus:ring-0 text-sm placeholder-zinc-400 dark:placeholder-zinc-500 text-zinc-900 dark:text-zinc-100 h-14 pr-2 outline-none"
              />
            </div>
          </div>

          {/* Selected photo preview pane */}
          {selectedPhoto && (
            <div className="relative rounded-xl overflow-hidden self-start max-h-48 border border-zinc-100 dark:border-zinc-800 shadow-sm mt-1">
              <img src={selectedPhoto} alt="Selected" className="max-h-48 object-contain" referrerPolicy="no-referrer" />
              <button
                type="button"
                onClick={() => setSelectedPhoto(null)}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-black/80 text-white rounded-full transition-colors"
                title="Remove image"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* Quick preset selector tray */}
          <div className="flex flex-wrap gap-1.5 py-1 border-y border-zinc-50 dark:border-zinc-800/60">
            <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center pr-1.5 uppercase tracking-wider">
              Add Photo Preset:
            </span>
            {photoPresets.map((photo) => (
              <button
                key={photo.name}
                type="button"
                onClick={() => setSelectedPhoto(photo.url)}
                className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                  selectedPhoto === photo.url
                    ? 'bg-blue-50 dark:bg-zinc-800 border-blue-500 text-blue-600 dark:text-blue-400 font-semibold shadow-xs'
                    : 'bg-zinc-50 dark:bg-zinc-800/50 border-zinc-100 dark:border-zinc-850 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-600 dark:text-zinc-400'
                }`}
              >
                {photo.name}
              </button>
            ))}
          </div>

          {/* Buttons and AI enhance bar */}
          <div className="flex items-center justify-between pt-1 gap-2">
            <div className="flex gap-2">
              <button
                type="button"
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1.5"
                title="Live stream (Sim)"
                onClick={() => alert('Starting a simulated broadcast! Feature is currently operating in demo status.')}
              >
                <Video className="w-4 h-4 text-red-500" />
                <span className="hidden md:inline text-xs font-bold text-zinc-600 dark:text-zinc-400">Live</span>
              </button>
              <button
                type="button"
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1.5"
                title="Photos"
              >
                <ImageIcon className="w-4 h-4 text-emerald-500" />
                <span className="hidden md:inline text-xs font-bold text-zinc-600 dark:text-zinc-400">Photo</span>
              </button>
              <button
                type="button"
                className="p-2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-350 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full transition-colors flex items-center gap-1.5"
                title="Activities"
              >
                <Smile className="w-4 h-4 text-amber-500" />
                <span className="hidden md:inline text-xs font-bold text-zinc-600 dark:text-zinc-400">Activity</span>
              </button>
            </div>

            {/* Post actions & AI refinement */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleAiWriterRefine}
                disabled={isEnhancing}
                className="px-3 py-1.5 text-xs font-bold text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-full transition-colors flex items-center gap-1 shadow-xs"
                title="Refining with local AI Assist"
              >
                <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-500" />
                {isEnhancing ? 'Enhancing...' : 'AI Refine'}
              </button>

              <button
                type="submit"
                disabled={!newPostText.trim() && !selectedPhoto}
                className="px-4 py-1.5 text-xs font-bold bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded-full transition-all shadow-md shadow-blue-500/10"
              >
                Post
              </button>
            </div>
          </div>
        </form>
      </section>

      {/* 3. Main Stream Feed */}
      <div className="flex flex-col gap-6">
        {filteredPosts.length === 0 ? (
          <div className="text-center py-10 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl p-6">
            <span className="text-sm text-zinc-400 dark:text-zinc-500 block">No matching posts found.</span>
            <button
              onClick={() => setNewPostText("Testing the new NexusSocial interface upgrade!")}
              className="mt-3 text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full"
            >
              Reset Seed Content (Write simulation post)
            </button>
          </div>
        ) : (
          filteredPosts.map((post, postIdx) => {
            const hasGrid = post.images.length > 1;
            const areCommentsExpanded = expandedCommentsPostId === post.id;

            return (
              <React.Fragment key={post.id}>
                <motion.article
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(postIdx * 0.05, 0.3) }}
                  className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 transition-colors shadow-sm overflow-hidden"
                >
                  {/* Item top row: User details */}
                  <div className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src={post.author.avatar}
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-100 dark:border-zinc-800"
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                          <span className="font-bold text-zinc-900 dark:text-white text-sm hover:underline cursor-pointer">
                            {post.author.name}
                          </span>
                          {post.author.verified && (
                            <svg className="w-3.5 h-3.5 text-blue-500 fill-current" viewBox="0 0 24 24">
                              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                            </svg>
                          )}
                        </div>
                        {/* Sub headers (Location/Tags, Timestamp) */}
                        <div className="flex items-center gap-1.5 text-zinc-400 dark:text-zinc-500 text-[11px] font-medium">
                          {post.tag ? (
                            <span className="text-zinc-500 dark:text-zinc-400 font-semibold">{post.tag}</span>
                          ) : post.location ? (
                            <span className="flex items-center gap-0.5 text-zinc-500">
                              <MapPin className="w-2.5 h-2.5" />
                              {post.location}
                            </span>
                          ) : (
                            <span>Active Creator</span>
                          )}
                          <span className="w-1 h-1 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
                          <span>{post.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    <button className="p-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-800 rounded-full text-zinc-400 dark:text-zinc-500">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </div>

                  {/* Body Text */}
                  <div className="px-4 pb-3">
                    <p className="text-sm leading-relaxed text-zinc-800 dark:text-zinc-200 text-left antialiased whitespace-pre-wrap">
                      {post.content}
                    </p>
                  </div>

                  {/* Image Grid / Bleed display */}
                  {post.images.length > 0 && (
                    <div className="relative w-full border-t border-zinc-50 dark:border-zinc-800/40">
                      {hasGrid ? (
                        <div className="grid grid-cols-2 gap-0.5 bg-zinc-100 dark:bg-zinc-950">
                          {post.images.map((img, index) => (
                            <div key={index} className="aspect-[4/5] bg-zinc-100 dark:bg-zinc-850 overflow-hidden relative">
                              <img
                                src={img}
                                alt={`Grid visual ${index}`}
                                className="w-full h-full object-cover hover:scale-101 transition-transform duration-300"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="relative aspect-[4/5] bg-zinc-100 dark:bg-zinc-850 overflow-hidden">
                          {post.id === 'post_maya_zen' && (
                            <div className="absolute top-4 right-4 z-10">
                              <span className="bg-black/60 text-white font-bold text-[10px] px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md flex items-center gap-1">
                                <Film className="w-3 h-3 text-sky-400" />
                                REEL
                              </span>
                            </div>
                          )}
                          <img
                            src={post.images[0]}
                            alt="Visual Post Asset"
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                      )}
                    </div>
                  )}

                  {/* Actions Bar (Likes, Comments Count info) */}
                  <div className="px-4 py-2 flex items-center justify-between text-xs text-zinc-400 dark:text-zinc-500 border-t border-zinc-50 dark:border-zinc-800/40">
                    <div className="flex items-center gap-1">
                      <div className="flex -space-x-1.5">
                        <span className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white dark:ring-zinc-900">
                          👍
                        </span>
                        <span className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-[10px] text-white font-bold ring-2 ring-white dark:ring-zinc-900">
                          ❤️
                        </span>
                      </div>
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                        {post.likedByMe ? 'You and ' : ''}{(post.likes - (post.likedByMe ? 1 : 0)).toLocaleString()}{' '}
                        others
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setExpandedCommentsPostId(areCommentsExpanded ? null : post.id)}
                        className="hover:underline font-bold text-zinc-500"
                      >
                        {post.comments.length} Comment{post.comments.length !== 1 ? 's' : ''}
                      </button>
                      <span>{post.shares || 0} Share{post.shares !== 1 ? 's' : ''}</span>
                    </div>
                  </div>

                  {/* Interaction Action Buttons */}
                  <div className="px-1 py-1 flex items-center justify-around border-t border-zinc-50 dark:border-zinc-800/40 bg-zinc-50/50 dark:bg-zinc-800/20">
                    <button
                      onClick={() => handleLike(post.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 ${
                        post.likedByMe
                          ? 'text-blue-600 dark:text-blue-400'
                          : 'text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${post.likedByMe ? 'fill-blue-600 text-blue-600 dark:fill-blue-400 dark:text-blue-400' : ''}`} />
                      Like
                    </button>

                    <button
                      onClick={() => setExpandedCommentsPostId(areCommentsExpanded ? null : post.id)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors flex items-center justify-center gap-1.5 text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 ${
                        areCommentsExpanded ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-800 dark:text-white' : ''
                      }`}
                    >
                      <MessageSquare className="w-4 h-4" />
                      Comment
                    </button>

                    <button
                      onClick={() => {
                        setPosts(prev =>
                          prev.map(p =>
                            p.id === post.id
                              ? { ...p, shares: p.shares + 1 }
                              : p
                          )
                        );
                        alert('Link copied to clipboard! Share simulation completed successfully.');
                      }}
                      className="flex-1 py-2 rounded-xl text-xs font-bold text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 flex items-center justify-center gap-1.5"
                    >
                      <Share2 className="w-4 h-4" />
                      Share
                    </button>

                    <button
                      onClick={() => handleBookmark(post.id)}
                      className={`px-3 py-2 rounded-xl text-xs font-semibold transition-colors ${
                        post.bookmarkedByMe ? 'text-amber-500' : 'text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                      title={post.bookmarkedByMe ? 'Bookmarked' : 'Bookmark'}
                    >
                      <Bookmark className={`w-4 h-4 ${post.bookmarkedByMe ? 'fill-amber-500' : ''}`} />
                    </button>
                  </div>

                  {/* Expanded Comments log drawer list */}
                  <AnimatePresence>
                    {areCommentsExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-zinc-50/50 dark:bg-zinc-800/10 border-t border-zinc-100 dark:border-zinc-800 overflow-hidden"
                      >
                        <div className="p-4 flex flex-col gap-3">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3 text-xs items-start">
                              <img
                                src={comment.author.avatar}
                                alt=""
                                className="w-8 h-8 rounded-full object-cover border"
                                referrerPolicy="no-referrer"
                              />
                              <div className="flex-1 bg-zinc-100 dark:bg-zinc-800/80 rounded-2xl px-3 py-2 relative">
                                <div className="flex items-center justify-between mb-0.5">
                                  <span className="font-bold text-zinc-900 dark:text-white">{comment.author.name}</span>
                                  <span className="text-[9px] text-zinc-400">{comment.timestamp}</span>
                                </div>
                                <p className="text-zinc-700 dark:text-zinc-300 text-left leading-relaxed">{comment.content}</p>
                              </div>
                            </div>
                          ))}

                          {/* Write Comment tool input */}
                          <div className="flex gap-3 items-center mt-1 pt-2 border-t border-zinc-100 dark:border-zinc-800">
                            <img
                              src={currentUser.avatar}
                              alt=""
                              className="w-8 h-8 rounded-full object-cover border"
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 flex gap-2 relative">
                              <input
                                type="text"
                                value={commentInputs[post.id] || ''}
                                onChange={(e) =>
                                  setCommentInputs((prev) => ({ ...prev, [post.id]: e.target.value }))
                                }
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') handleAddComment(post.id);
                                }}
                                placeholder="Add a comment..."
                                className="w-full text-xs bg-zinc-100 dark:bg-zinc-800 border-0 rounded-full px-4 py-2 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                              <button
                                onClick={() => handleAddComment(post.id)}
                                className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded-full transition-colors"
                              >
                                <Send className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.article>

                {/* Insertion: Trending Communities after Post 1 (Matches Screen 1 visual) */}
                {postIdx === 0 && (
                  <section className="bg-zinc-100/55 dark:bg-zinc-950/40 rounded-2xl p-4 border border-transparent flex flex-col gap-3">
                    <span className="font-extrabold text-sm text-zinc-800 dark:text-zinc-200 tracking-tight flex items-center pr-1.5 uppercase">
                      Trending Communities
                    </span>

                    <div className="grid grid-cols-2 gap-3.5">
                      {/* Left card: Keeb Eenthusiasts */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs cursor-pointer group">
                        <img
                          src="https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=80"
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                        <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-left">
                          <span className="text-[10px] font-extrabold text-blue-400 uppercase tracking-widest leading-none mb-1">
                            TECH & GEAR
                          </span>
                          <span className="text-white font-extrabold text-base leading-tight">Keeb Enthusiasts</span>
                          <span className="text-[10px] text-zinc-300 font-medium mt-0.5">12k Active Now</span>
                        </div>
                      </div>

                      {/* Right card: Urban Jungle */}
                      <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xs cursor-pointer group" id="card-urban-jungle">
                        <img
                          src="https://images.unsplash.com/photo-1463936575829-25148e1db1b8?w=500&auto=format&fit=crop&q=80"
                          alt=""
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-104 transition-transform duration-300"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-transparent" />
                        <div className="absolute inset-0 p-3.5 flex flex-col justify-end text-left">
                          <span className="text-[10px] font-extrabold text-emerald-400 uppercase tracking-widest leading-none mb-1">
                            LIFESTYLE
                          </span>
                          <span className="text-white font-extrabold text-base leading-tight">Urban Jungle</span>
                          <span className="text-[10px] text-zinc-300 font-medium mt-0.5">45k Members</span>
                        </div>
                      </div>
                    </div>
                  </section>
                )}

                {/* Insertion: 2026 Gaming Expo banner after Post 2 (Matches Screen 1 visual) */}
                {postIdx === 1 && (
                  <section className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 rounded-2xl p-5 border-none text-white shadow-md flex items-center justify-between gap-4">
                    <div className="flex flex-col text-left">
                      <span className="font-extrabold text-lg tracking-tight mb-1">2026 Gaming Expo</span>
                      <p className="text-xs text-emerald-100/90 font-medium">Join the live discussion arena.</p>
                    </div>
                    <button
                      onClick={() => alert('Welcome to the 2026 Gaming Expo Hub! Real-time group chat syncing successfully.')}
                      className="px-5 py-2.5 bg-white text-blue-700 hover:bg-emerald-50 text-xs font-bold rounded-full shadow-sm transition-all flex items-center gap-1"
                    >
                      Enter Hub
                    </button>
                  </section>
                )}
              </React.Fragment>
            );
          })
        )}
      </div>

      {/* 4. Full screen Story Viewer Overlay */}
      <AnimatePresence>
        {activeStory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col items-center justify-center p-4 touch-none"
            id="story-viewer-overlay"
          >
            {/* Story Card Frame Container */}
            <div className="relative w-full max-w-sm aspect-[9/16] bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl flex flex-col justify-between p-4">
              <img
                src={activeStory.image}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/60" />

              {/* Progress Bar Indicator stacks */}
              <div className="absolute top-4 left-4 right-4 z-20 flex gap-1">
                {stories.map((story, sIdx) => (
                  <div key={story.id} className="h-1 flex-1 bg-white/20 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-white transition-all duration-3000 ${
                        sIdx < activeStoryIdx
                          ? 'w-full'
                          : sIdx === activeStoryIdx
                          ? 'w-full animate-pulse'
                          : 'w-0'
                      }`}
                    />
                  </div>
                ))}
              </div>

              {/* Top row: User details */}
              <div className="relative z-10 flex items-center justify-between pt-4 mt-2">
                <div className="flex items-center gap-2">
                  <img
                    src={activeStory.author.avatar}
                    alt=""
                    className="w-9 h-9 rounded-full object-cover border-2 border-white"
                    referrerPolicy="no-referrer"
                  />
                  <div className="flex flex-col text-left">
                    <span className="text-white font-bold text-xs">{activeStory.author.name}</span>
                    <span className="text-white/70 text-[10px] font-medium">@ {activeStory.author.handle}</span>
                  </div>
                </div>
                <button
                  onClick={() => setActiveStory(null)}
                  className="p-1 text-white/80 hover:text-white rounded-full bg-black/20"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Left/Right click triggers */}
              <div className="absolute inset-x-0 top-20 bottom-20 flex justify-between z-10 px-2">
                <button
                  onClick={handlePrevStory}
                  className="w-1/3 h-full cursor-left text-left flex items-center text-white/50 hover:text-white opacity-0 hover:opacity-100 transition-opacity"
                  title="Previous"
                >
                  ‹
                </button>
                <button
                  onClick={handleNextStory}
                  className="w-1/3 h-full cursor-right text-right flex items-center justify-end text-white/50 hover:text-white opacity-0 hover:opacity-100 transition-opacity"
                  title="Next"
                >
                  ›
                </button>
              </div>

              {/* Bottom Row text action entry */}
              <div className="relative z-10 flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Reply to ${activeStory.author.name}...`}
                  className="flex-1 bg-white/10 backdrop-blur-md text-xs placeholder-white/80 text-white border-0 rounded-full px-4 py-2.5 pr-10 focus:outline-none focus:ring-1 focus:ring-white"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      alert('Reply sent! Creator will be notified.');
                      setActiveStory(null);
                    }
                  }}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* AI Content Refinement Dialogue Modal */}
      <AnimatePresence>
        {showAiModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 w-full max-w-md shadow-2xl"
              id="ai-content-refine-modal"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-100 dark:bg-zinc-800 rounded-lg text-blue-600 dark:text-blue-400">
                    <Sparkles className="w-5 h-5 text-indigo-500 fill-indigo-200" />
                  </div>
                  <span className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight">AI Writer Assistant</span>
                </div>
                <button
                  onClick={() => setShowAiModal(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="mb-4">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block mb-1">Your seed sentence</span>
                <p className="text-xs bg-zinc-50 dark:bg-zinc-850 p-2.5 rounded-lg text-zinc-600 dark:text-zinc-300 italic border">
                  "{newPostText}"
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest block">Choose style direction</span>
                {aiSuggestions.map((sug, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => applyAiSuggestion(sug)}
                    className="p-3 text-left text-xs bg-zinc-50 dark:bg-zinc-850 hover:bg-indigo-50 dark:hover:bg-zinc-800 dark:border-zinc-800 border rounded-xl hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all text-zinc-800 dark:text-zinc-200 leading-relaxed font-sans"
                  >
                    {sug.split(':').map((chunk, chunkIdx) => (
                      <span key={chunkIdx} className={chunkIdx === 0 ? 'font-bold' : ''}>
                        {chunkIdx === 0 ? chunk + ':' : chunk}
                      </span>
                    ))}
                  </button>
                ))}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
