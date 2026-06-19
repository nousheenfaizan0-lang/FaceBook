export interface User {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  coverImage?: string;
  bio?: string;
  followers: number;
  following: number;
  verified: boolean;
  isMe?: boolean;
}

export interface Comment {
  id: string;
  author: User;
  content: string;
  timestamp: string;
}

export interface Post {
  id: string;
  author: User;
  content: string;
  images: string[];
  likes: number;
  comments: Comment[];
  shares: number;
  timestamp: string;
  likedByMe?: boolean;
  sharedByMe?: boolean;
  bookmarkedByMe?: boolean;
  location?: string;
  tag?: string;
}

export interface Listing {
  id: string;
  title: string;
  price: number;
  category: 'Vehicles' | 'Property' | 'Electronics' | 'Home' | 'Apparel';
  location: string;
  image: string;
  description: string;
  likes: number;
  likedByMe?: boolean;
  status: 'active' | 'sold';
  seller: User;
  timestamp: string;
}

export interface Community {
  id: string;
  name: string;
  category: string;
  membersCount: string;
  activeCount?: string;
  image: string;
  joined: boolean;
  description: string;
}

export interface Story {
  id: string;
  author: User;
  image: string;
  viewed: boolean;
  contentUrl?: string;
}

export interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'marketplace';
  sender: User;
  text: string;
  timestamp: string;
  read: boolean;
  linkId?: string; // id of reference post or listing
}
