'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import BlogCard from '@/components/BlogCard';
import { categories } from '@/data/mockData';
import { blogService, addSubscriber } from '@/lib/firebaseServices';
import { BlogPost } from '@/types/blog';
import Link from 'next/link';

export default function HomePage() {
  const [featuredPosts, setFeaturedPosts] = useState<BlogPost[]>([]);
  const [latestPosts, setLatestPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscriberEmail, setSubscriberEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'success' | 'error' | 'loading'>('idle');

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    try {
      const [featured, latest] = await Promise.all([
        blogService.getFeaturedPosts(6),
        blogService.getFeaturedPosts(3)
      ]);
      setFeaturedPosts(featured);
      setLatestPosts(latest);
    } catch (error) {
      console.error('Error loading posts:', error);
      // Fallback to empty arrays if Firebase fails
      setFeaturedPosts([]);
      setLatestPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubscribe = async () => {
    if (!subscriberEmail.trim()) return;
    setSubscribeStatus('loading');
    try {
      await addSubscriber(subscriberEmail);
      setSubscribeStatus('success');
      setSubscriberEmail('');
    } catch (e) {
      setSubscribeStatus('error');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-br from-blue-800 via-blue-600 to-green-500 py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Voices and Viewpoints
          </h1>
          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
            A place where ordinary people tell their not-so-ordinary stories...
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto mb-8">
            Voices from and for those who are unheard. Stories that challenge, reflect, and inspire.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/about-us" className="btn-primary">
              Meet Our Authors
            </Link>
            <Link href="/become-author" className="btn-secondary bg-white/20 hover:bg-white/30 text-white border-white/30">
              Share Your Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Featured Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Discover compelling narratives from diverse perspectives across art, culture, health, and more.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : featuredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No featured posts yet. Be the first to share a story!</p>
              <Link href="/admin" className="btn-primary mt-4">
                Create Your First Post
              </Link>
            </div>
          )}
          
          <div className="text-center mt-12">
            <Link href="/category/all" className="btn-secondary">
              View All Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Explore by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Dive deep into topics that matter to you and discover new perspectives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.slug}`}
                className="bg-gray-50 rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:scale-105 group"
              >
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium mb-4 ${category.color}`}>
                  {category.name}
                </div>
                <p className="text-gray-600 leading-relaxed group-hover:text-gray-800">
                  {category.description}
                </p>
                <div className="mt-4 text-blue-600 font-medium group-hover:text-blue-800">
                  Explore {category.name} →
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Latest Posts */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Latest Stories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Fresh perspectives and new voices added to our collection.
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
                  <div className="h-48 bg-gray-200"></div>
                  <div className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded mb-4 w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : latestPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post) => (
                <BlogCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No posts yet. Start sharing your stories!</p>
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-16 px-4 bg-gradient-to-r from-green-50 to-blue-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">Stay Connected</h2>
          <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
            Get the latest stories and perspectives delivered to your inbox. Join our community of thoughtful readers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              value={subscriberEmail}
              onChange={e => { setSubscriberEmail(e.target.value); setSubscribeStatus('idle'); }}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900"
            />
            <button
              className="btn-secondary whitespace-nowrap"
              onClick={handleSubscribe}
              disabled={subscribeStatus === 'loading'}
            >
              {subscribeStatus === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
          {subscribeStatus === 'success' && (
            <p className="text-green-600 mt-4">Thank you for subscribing!</p>
          )}
          {subscribeStatus === 'error' && (
            <p className="text-red-600 mt-4">Subscription failed. Please try again.</p>
          )}
        </div>
      </section>
    </div>
  );
}
