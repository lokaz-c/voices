export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: BlogCategory;
  publishedAt: string;
  imageUrl?: string;
  readTime: number;
  tags: string[];
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface Author {
  id: string;
  name: string;
  email: string;
  bio: string;
  expertise?: string;
  avatar?: string;
  socialLinks?: {
    twitter?: string;
    linkedin?: string;
    website?: string;
  };
  postsCount: number;
  joinedAt: string;
}

export interface AuthorApplication {
  id: string;
  name: string;
  email: string;
  bio: string;
  expertise?: string;
  avatar?: string;
  userId?: string;
  writingSamples: string;
  motivation: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
  authorId?: string;
  rejectionReason?: string;
}

export type BlogCategory = 'Art' | 'Books' | 'Culture and Tourism' | 'Health and Nutrition' | 'Analysis';

export interface CategoryInfo {
  name: BlogCategory;
  description: string;
  color: string;
  slug: string;
} 