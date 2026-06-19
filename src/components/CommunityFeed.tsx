import React, { useState } from 'react';
import { Users, Search, PlusCircle, CheckCircle, Tag, Globe, Sparkles, MessageSquare, ArrowRight, ArrowUpRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Community } from '../types';

interface CommunityFeedProps {
  communities: Community[];
  onToggleJoin: (communityId: string) => void;
  searchFilter: string;
}

export default function CommunityFeed({
  communities,
  onToggleJoin,
  searchFilter,
}: CommunityFeedProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [communityTitle, setCommunityTitle] = useState('');
  const [communityCategory, setCommunityCategory] = useState('DESIGN ARCH');
  const [communityDesc, setCommunityDesc] = useState('');
  const [userCreatedCommCurrent, setUserCreatedCommCurrent] = useState<Community[]>([]);

  const handleCreateCommunitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityTitle || !communityDesc) return;

    const newComm: Community = {
      id: `comm_${Date.now()}`,
      name: communityTitle,
      category: communityCategory.toUpperCase(),
      membersCount: '1 Member',
      image: 'https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80',
      joined: true,
      description: communityDesc,
    };

    setUserCreatedCommCurrent([newComm, ...userCreatedCommCurrent]);
    setShowCreateModal(false);

    setCommunityTitle('');
    setCommunityDesc('');
  };

  const combinedCommunities = [...userCreatedCommCurrent, ...communities];

  const filteredCommunities = combinedCommunities.filter(
    (comm) =>
      comm.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      comm.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      comm.description.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6 pb-24 max-w-[680px] mx-auto text-left">
      {/* Top Banner and Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">Community Hubs</h2>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Join vibrant arenas built around passions</span>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full text-xs font-bold shadow-md shadow-blue-500/10 flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" />
          Create Hub
        </button>
      </div>

      {/* Featured Arena Card hero split */}
      <div className="bg-gradient-to-tr from-indigo-900 via-indigo-950 to-purple-950 p-6 rounded-3xl text-white relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 bottom-0 opacity-15 translate-x-12 translate-y-12">
          <Globe className="w-60 h-60 text-indigo-200" />
        </div>

        <div className="flex flex-col text-left max-w-sm relative z-10 gap-1.5">
          <span className="text-[10px] bg-indigo-500/30 text-indigo-300 font-bold px-2.5 py-1 rounded-full uppercase tracking-wider self-start">
            Featured Highlight
          </span>
          <h3 className="text-xl font-extrabold leading-tight tracking-tight mt-1">2026 UI Motion Forum</h3>
          <p className="text-xs text-indigo-250 leading-relaxed font-sans">
            Collaborating on seamless state integrations, web-animations loaders, and next-generation glass design standards.
          </p>
          <button
            onClick={() => alert(`Entered chat lounge of 2026 UI Motion Forum. Active group participants: 42.`)}
            className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-full font-bold text-xs self-start flex items-center gap-1 shadow-md shadow-blue-500/10 hover:bg-blue-700 transition"
          >
            Enter Discussion Arena <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="relative w-28 h-28 shrink-0 bg-indigo-800/40 rounded-2xl border border-indigo-700/60 overflow-hidden flex items-center justify-center">
          <img
            src="https://images.unsplash.com/photo-1508739773434-c26b3d09e071?w=500&auto=format&fit=crop&q=80"
            alt=""
            className="w-full h-full object-cover opacity-80"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Main Grid display of channels list */}
      <div className="flex flex-col gap-4">
        {filteredCommunities.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 rounded-2xl">
            <span className="text-sm text-zinc-400 dark:text-zinc-500 font-medium">No matching communities found.</span>
          </div>
        ) : (
          filteredCommunities.map((item) => (
            <motion.div
              layout
              key={item.id}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 p-4 transition-colors flex gap-4 items-start relative shadow-xs hover:border-zinc-200 dark:hover:border-zinc-700"
            >
              {/* Cover channel avatar circular thumbnail wrapper */}
              <div className="w-14 h-14 rounded-2xl overflow-hidden shrink-0 bg-zinc-100 dark:bg-zinc-850 relative border">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
              </div>

              {/* Text Description and counters block */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1 text-[10px] font-extrabold text-blue-600 dark:text-blue-400 leading-none">
                  <span>{item.category}</span>
                  <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                  <span className="text-zinc-400 font-bold">{item.membersCount}</span>
                </div>

                <h4 className="font-extrabold text-sm text-zinc-900 dark:text-white mb-1 tracking-tight">
                  {item.name}
                </h4>

                <p className="text-zinc-500 dark:text-zinc-400 text-xs leading-relaxed max-w-sm font-sans line-clamp-2">
                  {item.description}
                </p>
              </div>

              {/* Action column button */}
              <button
                onClick={() => onToggleJoin(item.id)}
                className={`py-1.5 px-3.5 rounded-full text-xs font-bold transition-all shrink-0 select-none ${
                  item.joined
                    ? 'bg-zinc-100 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300 hover:bg-zinc-200'
                    : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm shadow-blue-500/10'
                }`}
              >
                {item.joined ? 'Joined' : 'Join'}
              </button>
            </motion.div>
          ))
        )}
      </div>

      {/* Hub Creator overlay dialogue drawer */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 w-full max-w-md shadow-2xl"
              id="community-create-modal"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  <span className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight">Create Community Hub</span>
                </div>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateCommunitySubmit} className="flex flex-col gap-4 text-xs font-sans text-left">
                {/* Channel Title */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Name of Hub</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vintage Capsule collectors"
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white text-xs"
                    value={communityTitle}
                    onChange={(e) => setCommunityTitle(e.target.value)}
                  />
                </div>

                {/* Cover presets Category selecting */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-zinc-700 dark:text-zinc-300">Hub Topic Area</label>
                    <select
                      className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                      value={communityCategory}
                      onChange={(e) => setCommunityCategory(e.target.value)}
                    >
                      <option value="TECH & GEAR">Tech & Hardware</option>
                      <option value="DESIGN ARCH">Design & UX</option>
                      <option value="LIFESTYLE">Lifestyle & Plants</option>
                      <option value="GAMING SITE">Gaming & Expo</option>
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 items-start justify-end pb-1 text-[11px] leading-relaxed text-zinc-400">
                    <span>💡 Creators represent 100% authoritative governance of custom hubs. Connect rules inside profile.</span>
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-700 dark:text-zinc-300">Hub Bio / Description</label>
                  <textarea
                    required
                    placeholder="Introduce what this hub is built around, cap guides, cap rules, active setups..."
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 h-24 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white resize-none"
                    value={communityDesc}
                    onChange={(e) => setCommunityDesc(e.target.value)}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-md mt-1 shadow-blue-500/10 text-xs"
                >
                  Establish Hub Arena
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
