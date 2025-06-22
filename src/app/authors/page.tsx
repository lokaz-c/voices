'use client';

import { useState, useEffect } from 'react';
import { UserIcon, CalendarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Navigation from '@/components/Navigation';
import { blogPosts } from '@/data/mockData';
import Link from 'next/link';

interface Author {
  name: string;
  bio: string;
  postCount: number;
  firstPostDate: string;
  latestPostDate: string;
  categories: string[];
  avatar?: string;
}

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);

  useEffect(() => {
    // Generate author data from blog posts
    const authorMap = new Map<string, Author>();
    
    blogPosts.forEach(post => {
      if (!authorMap.has(post.author)) {
        authorMap.set(post.author, {
          name: post.author,
          bio: `${post.author} is a passionate contributor to Views and Viewpoints, sharing insights and stories that matter.`,
          postCount: 0,
          firstPostDate: post.publishedAt,
          latestPostDate: post.publishedAt,
          categories: [],
          avatar: undefined
        });
      }
      
      const author = authorMap.get(post.author)!;
      author.postCount++;
      author.categories.push(post.category);
      
      if (new Date(post.publishedAt) < new Date(author.firstPostDate)) {
        author.firstPostDate = post.publishedAt;
      }
      if (new Date(post.publishedAt) > new Date(author.latestPostDate)) {
        author.latestPostDate = post.publishedAt;
      }
    });
    
    // Remove duplicates from categories
    authorMap.forEach(author => {
      author.categories = [...new Set(author.categories)];
    });
    
    setAuthors(Array.from(authorMap.values()));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Our Authors
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Meet the talented writers and storytellers who bring diverse perspectives and compelling narratives to Views and Viewpoints.
          </p>
        </div>
      </section>

      {/* Authors Grid */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {authors.map((author) => (
              <div key={author.name} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-full flex items-center justify-center mr-4">
                    <UserIcon className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{author.name}</h3>
                    <p className="text-sm text-gray-500">
                      {author.postCount} {author.postCount === 1 ? 'article' : 'articles'}
                    </p>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed">
                  {author.bio}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <CalendarIcon className="h-4 w-4 mr-2" />
                    <span>Contributing since {new Date(author.firstPostDate).getFullYear()}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DocumentTextIcon className="h-4 w-4 mr-2" />
                    <span>Latest: {new Date(author.latestPostDate).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {author.categories.map((category) => (
                    <span
                      key={category}
                      className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">
            Want to Join Our Community?
          </h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            We&apos;re always looking for new voices and perspectives. If you have a story to tell, we&apos;d love to hear from you.
          </p>
          <Link
            href="/become-author"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <span>Become an Author</span>
          </Link>
        </div>
      </section>
    </div>
  );
} 