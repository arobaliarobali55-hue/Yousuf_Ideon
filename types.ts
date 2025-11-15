export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  title: string;
  email: string;
  phone: string;
  bio: string;
  password?: string;
  emailVerified: boolean;
  verificationCode?: string | null;
  verificationCodeExpires?: number | null;
}

export interface Comment {
  id: string;
  user: User;
  text: string;
  createdAt: number;
  likes: number;
  likedBy: string[]; // Array of user IDs
  parentId: string | null;
}

export interface Idea {
  id:string;
  title: string;
  summary: string;
  description: string;
  market: string; // The target market/audience for the idea
  author: User;
  tags: string[];
  likes: number;
  likedBy: string[]; // Array of user IDs
  comments: Comment[];
  isForSale: boolean;
  price?: number;
  team: User[];
  lookingFor: string[];
  createdAt: number;
  isSeekingCoFounder: boolean;
  views: number;
  shares: number;
}