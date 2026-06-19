import React, { useState } from 'react';
import { Car, Home as HomeIcon, Laptop, Armchair, Shirt, Search, Tag, MapPin, Heart, Plus, Sparkles, X, User as UserIcon, MessageSquare, Send, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Listing, User } from '../types';

interface MarketplaceProps {
  listings: Listing[];
  setListings: React.Dispatch<React.SetStateAction<Listing[]>>;
  currentUser: User;
  onNewNotification: (text: string, type: 'marketplace', linkId?: string) => void;
  searchFilter: string;
}

export default function Marketplace({
  listings,
  setListings,
  currentUser,
  onNewNotification,
  searchFilter,
}: MarketplaceProps) {
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showSellModal, setShowSellModal] = useState(false);
  const [activeListing, setActiveListing] = useState<Listing | null>(null);

  // Listing creation form states
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<'Vehicles' | 'Property' | 'Electronics' | 'Home' | 'Apparel'>('Electronics');
  const [location, setLocation] = useState('San Francisco, CA');
  const [description, setDescription] = useState('');
  const [selectedPresetUrl, setSelectedPresetUrl] = useState<string>('');

  // Ask Seller query
  const [offerText, setOfferText] = useState('Is this item still available?');
  const [isSuccessMessage, setIsSuccessMessage] = useState(false);

  // Product preset images
  const itemPresets = [
    { name: 'Tesla Model S Plaid', url: 'https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?w=800&auto=format&fit=crop&q=80', cat: 'Vehicles' },
    { name: 'Ergonomic Desk Chair', url: 'https://images.unsplash.com/photo-1581539250439-c96689b516dd?w=800&auto=format&fit=crop&q=80', cat: 'Home' },
    { name: 'Custom mechanical keyboard', url: 'https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&auto=format&fit=crop&q=80', cat: 'Electronics' },
    { name: 'Vintage Leather coat', url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&auto=format&fit=crop&q=80', cat: 'Apparel' },
  ];

  const categories = [
    { id: 'Vehicles', label: 'Vehicles', icon: Car },
    { id: 'Property', label: 'Property', icon: HomeIcon },
    { id: 'Electronics', label: 'Electronics', icon: Laptop },
    { id: 'Home', label: 'Home', icon: Armchair },
    { id: 'Apparel', label: 'Apparel', icon: Shirt },
  ];

  // Like Listing toggle
  const handleLikeListing = (e: React.MouseEvent, listingId: string) => {
    e.stopPropagation();
    setListings(prev =>
      prev.map(item => {
        if (item.id === listingId) {
          const liked = !item.likedByMe;
          return {
            ...item,
            likedByMe: liked,
            likes: liked ? item.likes + 1 : item.likes - 1,
          };
        }
        return item;
      })
    );
  };

  // Submit Listing
  const handleCreateListing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) {
      alert('Please fill out the item title and price.');
      return;
    }

    const newListing: Listing = {
      id: `list_${Date.now()}`,
      title,
      price: Number(price),
      category,
      location,
      image: selectedPresetUrl || 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&auto=format&fit=crop&q=80',
      description: description || 'No description listed by seller.',
      likes: 0,
      status: 'active',
      seller: currentUser,
      timestamp: 'Just now',
    };

    setListings([newListing, ...listings]);
    setShowSellModal(false);

    // Reset fields
    setTitle('');
    setPrice('');
    setSelectedPresetUrl('');
    setDescription('');

    // Trigger notification
    onNewNotification(`Successfully created your marketplace listing "${title}"!`, 'marketplace', newListing.id);
  };

  // Offer submission
  const handleSendOfferMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!offerText.trim() || !activeListing) return;

    setIsSuccessMessage(true);
    setTimeout(() => {
      setIsSuccessMessage(false);
      setOfferText('Is this item still available?');
      setActiveListing(null);
    }, 2000);
  };

  // Apply Filtered list
  const filteredListings = listings.filter((item) => {
    const matchCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchQuery =
      item.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.category.toLowerCase().includes(searchFilter.toLowerCase()) ||
      item.location.toLowerCase().includes(searchFilter.toLowerCase());
    return matchCategory && matchQuery;
  });

  return (
    <div className="flex flex-col gap-6 pb-28 max-w-[680px] mx-auto text-left">
      {/* 1. Header with marketplace details */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-3xl text-zinc-900 dark:text-white tracking-tight">Marketplace</h1>
          <span className="text-xs text-zinc-400 dark:text-zinc-500 font-medium">Local trade, completely transparent</span>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => alert(`Active account listings: ${listings.filter((l) => l.seller.id === 'me').length}`)}
            className="px-4 py-2 text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-700 dark:text-zinc-200 rounded-full transition-colors flex items-center gap-1.5"
            title="Overview of your products"
          >
            <UserIcon className="w-3.5 h-3.5" />
            Account
          </button>
          <button
            onClick={() => setShowSellModal(true)}
            className="px-4 py-2 text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-shadow flex items-center gap-1.5 shadow-md shadow-blue-500/10"
            id="market-sell-top-btn"
          >
            <Plus className="w-4 h-4 stroke-[2.5px]" />
            Sell
          </button>
        </div>
      </div>

      {/* 2. Horizontal scrollable category list */}
      <div className="flex gap-2.5 overflow-x-auto pb-1.5 no-scrollbar scroll-smooth">
        <button
          onClick={() => setSelectedCategory(null)}
          className={`flex-shrink-0 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
            selectedCategory === null
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
          }`}
          id="btn-category-all"
        >
          All Items
        </button>
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold transition-all ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-zinc-100 dark:bg-zinc-800 text-zinc-650 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700'
              }`}
              id={`btn-category-${cat.id}`}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* 3. Today's Picks head & location */}
      <div className="flex items-center justify-between border-t border-zinc-150 dark:border-zinc-800 pt-5">
        <span className="font-bold text-base text-zinc-900 dark:text-white tracking-tight">Today's Picks</span>
        <button
          onClick={() => alert('Map coverage filters. Custom search distance adjustment.')}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline font-bold flex items-center gap-1"
        >
          <MapPin className="w-3.5 h-3.5" />
          San Francisco, CA • 20 mi
        </button>
      </div>

      {/* 4. Product listings Grid */}
      <div className="grid grid-cols-2 gap-4">
        {filteredListings.length === 0 ? (
          <div className="col-span-2 text-center py-12 bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800">
            <span className="text-sm text-zinc-400 dark:text-zinc-500 block">No listings found in this category.</span>
            <button
              onClick={() => setSelectedCategory(null)}
              className="mt-3 text-xs bg-blue-100 text-blue-700 font-bold px-3 py-1.5 rounded-full"
            >
              Clear Categories Group
            </button>
          </div>
        ) : (
          filteredListings.map((item, idx) => (
            <motion.div
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(idx * 0.05, 0.3) }}
              key={item.id}
              onClick={() => setActiveListing(item)}
              className="bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-100 dark:border-zinc-800 hover:border-zinc-200 dark:hover:border-zinc-700 shadow-xs cursor-pointer group flex flex-col justify-between overflow-hidden transition-all duration-320 hover:-translate-y-0.5"
              id={`listing-card-${item.id}`}
            >
              {/* Image & Price Overlay */}
              <div className="relative aspect-[4/3] bg-zinc-100 dark:bg-zinc-850 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-300"
                  referrerPolicy="no-referrer"
                />

                {/* Price pill sticker absolute at top left */}
                <div className="absolute top-2.5 left-2.5 z-10">
                  <span className="bg-blue-600 text-white font-extrabold text-xs px-2.5 py-1 rounded-full shadow-md">
                    ${item.price.toLocaleString()}
                  </span>
                </div>

                {/* Favorite Heart top right */}
                <button
                  onClick={(e) => handleLikeListing(e, item.id)}
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  title="Favorite"
                  id={`btn-fav-listing-${item.id}`}
                >
                  <Heart className={`w-3.5 h-3.5 ${item.likedByMe ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                </button>
              </div>

              {/* Title Location info section */}
              <div className="p-3.5 flex flex-col gap-0.5">
                <span className="font-extrabold text-sm text-zinc-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {item.title}
                </span>
                <span className="text-[11px] text-zinc-400 dark:text-zinc-500 font-medium flex items-center gap-0.5 mt-0.5">
                  <MapPin className="w-2.5 h-2.5" />
                  {item.location}
                </span>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Floating Action Button (FAB) at Bottom corner to list item */}
      <div className="fixed bottom-20 right-4 z-30">
        <button
          onClick={() => setShowSellModal(true)}
          className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 text-white rounded-full flex items-center justify-center shadow-lg shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
          title="Sell on Marketplace"
        >
          <Plus className="w-7 h-7 stroke-[2.5px]" />
        </button>
      </div>

      {/* 5. Create Listing Modal panel Overlay */}
      <AnimatePresence>
        {showSellModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl p-5 border border-zinc-100 dark:border-zinc-800 w-full max-w-md shadow-2xl max-h-[90vh] overflow-y-auto"
              id="marketplace-create-modal"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Tag className="w-5 h-5 text-blue-600" />
                  <span className="font-extrabold text-base text-zinc-900 dark:text-white tracking-tight">Create Listing</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSellModal(false)}
                  className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-400 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="flex flex-col gap-4 text-xs font-sans">
                {/* Title */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Item Title</label>
                  <input
                    type="text"
                    required
                    maxLength={40}
                    placeholder="e.g. MacBook Pro M3 Max"
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>

                {/* Pricing & Location info rows */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-zinc-750 dark:text-zinc-300">Price ($)</label>
                    <input
                      type="number"
                      required
                      placeholder="e.g. 1800"
                      className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-zinc-750 dark:text-zinc-300">Location</label>
                    <input
                      type="text"
                      placeholder="e.g. San Francisco, CA"
                      className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Category & Cover presets */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-bold text-zinc-750 dark:text-zinc-300">Category</label>
                    <select
                      className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white"
                      value={category}
                      onChange={(e) => setCategory(e.target.value as any)}
                    >
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1 justify-end">
                    <span className="text-[10px] font-bold text-indigo-500 block mb-1">💡 Smart suggestion</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (title) {
                          alert(`Suggested optimum price ranges based on market demand matching title "${title}": $${(800).toLocaleString()} - $${(2500).toLocaleString()}`);
                        } else {
                          alert('Please write an item title. Our AI scan detects prices based on names!');
                        }
                      }}
                      className="text-left font-semibold text-blue-600 dark:text-blue-400 py-2.5 underline"
                    >
                      View AI price guide
                    </button>
                  </div>
                </div>

                {/* Preset image selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Select Image Preset</label>
                  <div className="grid grid-cols-4 gap-2">
                    {itemPresets.map((preset) => (
                      <div
                        key={preset.name}
                        onClick={() => {
                          setSelectedPresetUrl(preset.url);
                          setCategory(preset.cat as any);
                        }}
                        className={`relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          selectedPresetUrl === preset.url ? 'border-blue-500 scale-98 shadow-sm' : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Description */}
                <div className="flex flex-col gap-1">
                  <label className="font-bold text-zinc-750 dark:text-zinc-300">Description</label>
                  <textarea
                    placeholder="Describe condition, specifications, and reason for trade..."
                    className="w-full bg-zinc-50 dark:bg-zinc-850 p-3 h-20 rounded-xl border border-zinc-150 dark:border-zinc-800 focus:outline-none focus:border-blue-500 text-zinc-900 dark:text-white resize-none"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                {/* Confirm Publish */}
                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-extrabold rounded-2xl transition-all shadow-md mt-2 shadow-blue-500/10 text-sm"
                >
                  Publish Listing
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* 6. Detail View Drawer modal for active listing click */}
      <AnimatePresence>
        {activeListing && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden border border-zinc-100 dark:border-zinc-800 w-full max-w-lg shadow-2xl max-h-[92vh] flex flex-col"
              id="marketplace-details-drawer"
            >
              {/* Image banner */}
              <div className="relative aspect-[16/10] bg-zinc-100 dark:bg-zinc-850 overflow-hidden shrink-0">
                <img src={activeListing.image} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                <div className="absolute top-4 left-4 z-10 font-bold bg-blue-600 text-white px-3 py-1.5 rounded-full text-sm">
                  ${activeListing.price.toLocaleString()}
                </div>
                <button
                  onClick={() => setActiveListing(null)}
                  className="absolute top-4 right-4 z-10 p-2 bg-black/50 hover:bg-black/75 text-white rounded-full transition-colors backdrop-blur-xs"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Main Content scroll window */}
              <div className="flex-1 overflow-y-auto p-5 text-sm flex flex-col gap-4">
                {/* Title and metadata */}
                <div className="flex flex-col text-left gap-1 border-b border-zinc-100 dark:border-zinc-800 pb-3">
                  <h3 className="font-extrabold text-lg text-zinc-900 dark:text-white leading-tight">
                    {activeListing.title}
                  </h3>
                  <div className="flex items-center gap-1.5 text-zinc-400 font-semibold text-xs mt-1">
                    <span className="text-zinc-650 dark:text-zinc-300 bg-zinc-100 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
                      {activeListing.category}
                    </span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span className="flex items-center gap-0.5">
                      <MapPin className="w-3 h-3 text-zinc-400" />
                      {activeListing.location}
                    </span>
                    <span className="w-1 h-1 bg-zinc-300 rounded-full" />
                    <span>{activeListing.timestamp}</span>
                  </div>
                </div>

                {/* Seller information */}
                <div className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800/20 p-3.5 rounded-2xl border">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeListing.seller.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover border"
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex flex-col text-left">
                      <span className="font-bold text-zinc-900 dark:text-white leading-tight text-xs">
                        {activeListing.seller.name}
                      </span>
                      <span className="text-[10px] text-zinc-400">@ {activeListing.seller.handle}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`Following @${activeListing.seller.handle}! They will be prioritized in your feed alerts.`)}
                    className="px-3.5 py-1.5 bg-blue-50 text-blue-700 dark:bg-zinc-800 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-zinc-700 text-[11.5px] font-bold rounded-full transition-colors"
                  >
                    Follow
                  </button>
                </div>

                {/* Description content */}
                <div className="flex flex-col text-left gap-1.5 pb-2">
                  <span className="font-bold text-zinc-900 dark:text-white text-xs uppercase tracking-wider">
                    Product Description
                  </span>
                  <p className="text-zinc-650 dark:text-zinc-300 leading-relaxed text-xs">
                    {activeListing.description}
                  </p>
                </div>

                {/* Contact Seller chat simulation panel */}
                <div className="border-t border-zinc-100 dark:border-zinc-800 pt-4 flex flex-col gap-2 bg-gradient-to-tr from-blue-50/20 to-transparent p-3 rounded-2xl">
                  <div className="flex items-center gap-1.5 text-blue-600 dark:text-blue-400 mb-1">
                    <MessageSquare className="w-4 h-4" />
                    <span className="font-bold text-xs">Simulate Chat Inquiry</span>
                  </div>

                  {isSuccessMessage ? (
                    <motion.div
                      initial={{ scale: 0.95 }}
                      animate={{ scale: 1 }}
                      className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl flex items-center justify-center gap-1.5 text-emerald-800 font-semibold"
                    >
                      <CheckCircle2 className="w-5 h-5 text-emerald-650" />
                      <span>Inquiry message sent successfully!</span>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSendOfferMessage} className="flex gap-2">
                      <input
                        type="text"
                        className="flex-1 px-4 py-2 bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 text-zinc-800 dark:text-zinc-200 border-0"
                        value={offerText}
                        onChange={(e) => setOfferText(e.target.value)}
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-full text-xs transition-colors shadow-sm flex items-center gap-1"
                      >
                        <Send className="w-3.5 h-3.5" />
                        Send
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
