'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Navigation from '@/components/Navigation';
import TextToSpeech from '@/components/TextToSpeech';
import CommentSection from '@/components/CommentSection';
import { blogService, authorService } from '@/lib/firebaseServices';
import { Author, BlogPost } from '@/types/blog';
import { categories } from '@/data/mockData';
import Link from 'next/link';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import copy from 'copy-to-clipboard';

export default function PostPage() {
  const params = useParams();
  const postId = params.id as string;
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [author, setAuthor] = useState<Author | null>(null);
  const [nextBlog, setNextBlog] = useState<BlogPost | null>(null);
  const [popularPosts, setPopularPosts] = useState<BlogPost[]>([]);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    loadPost();
  }, [postId]);

  useEffect(() => {
    async function fetchExtras() {
      if (post) {
        // Fetch author details
        const authorData = await authorService.getAuthorById(post.author);
        setAuthor(authorData);
        // Fetch next blog in category (excluding current)
        const categoryPosts = (await blogService.getPostsByCategory(post.category)).filter(p => p.id !== post.id);
        setNextBlog(categoryPosts[0] || null);
        // Fetch related posts by author (excluding current)
        const authorPosts = (await blogService.getAllPosts()).filter(p => p.author === post.author && p.id !== post.id);
        setRelatedPosts(authorPosts.slice(0, 2));
        // Fetch popular posts
        setPopularPosts(await blogService.getFeaturedPosts(4));
      }
    }
    fetchExtras();
  }, [post]);

  const loadPost = async () => {
    try {
      const postData = await blogService.getPostById(postId);
      if (postData) {
        setPost(postData);
      } else {
        setError('Post not found');
      }
    } catch (error) {
      console.error('Error loading post:', error);
      setError('Failed to load post');
    } finally {
      setLoading(false);
    }
  };

  const handleCite = () => {
    if (!post) return;
    const citation = `${post.author}. "${post.title}." Voices and Viewpoints, ${new Date(post.publishedAt).toLocaleDateString()}, ${window.location.href}`;
    copy(citation);
    alert('Citation copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading post...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Post Not Found</h1>
            <p className="text-gray-600 mb-6">{error || 'The post you&apos;re looking for doesn&apos;t exist.'}</p>
            <Link href="/" className="btn-primary">
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const category = categories.find(c => c.name === post.category);

  // Support for gallery images (if post.images exists, otherwise fallback to imageUrl)
  const galleryImages = post?.images && post.images.length > 0 ? post.images : post?.imageUrl ? [post.imageUrl] : [];

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navigation />
      <main className="max-w-4xl mx-auto px-4 py-10">
        {/* Gallery Section */}
        {galleryImages.length > 0 && (
          <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {galleryImages.map((img: string, idx: number) => (
              <div key={idx} className="rounded-lg overflow-hidden shadow-md bg-white flex items-center justify-center">
                <Image src={img} alt={post?.title || `Gallery image ${idx + 1}`} width={600} height={350} className="object-cover w-full h-64" />
              </div>
            ))}
          </div>
        )}
        {/* Post Header */}
        <header className="mb-8">
          {category && (
            <div className="mb-4">
              <Link 
                href={`/category/${category.slug}`}
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${category.color} hover:opacity-80 transition-opacity`}
              >
                {category.name}
              </Link>
            </div>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>
          <p className="text-xl text-gray-600 mb-6 leading-relaxed">
            {post.excerpt}
          </p>
          <div className="flex flex-wrap items-center gap-6 text-sm text-gray-500 mb-6">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 mr-2" />
              <span>{post.author}</span>
            </div>
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-2" />
              <span>{isNaN(new Date(post.publishedAt).getTime())
                ? post.publishedAt
                : new Date(post.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
              </span>
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-2" />
              <span>{post.readTime} min read</span>
            </div>
          </div>
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag, index) => (
                <span 
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </header>
        {/* Text-to-Speech Controls */}
        <div className="mb-8">
          <TextToSpeech text={post.content} title={post.title} />
        </div>
        {/* Post Content with Markdown */}
        <div className="prose prose-lg max-w-none mb-12">
          <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>{post.content}</ReactMarkdown>
        </div>
        {/* Post Footer */}
        <footer className="border-t pt-8 mb-12 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
              <UserIcon className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="font-medium text-slate-900">{post.author}</p>
              <p className="text-sm text-gray-500">Author</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="text-gray-400 hover:text-blue-600 transition-colors" onClick={handleCite} title="Cite this article">
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M7.5 7A2.5 2.5 0 005 9.5v1A2.5 2.5 0 007.5 13H9a.75.75 0 000-1.5H7.5a1 1 0 01-1-1v-1a1 1 0 011-1H9A2.5 2.5 0 0011.5 7V6A2.5 2.5 0 009 3.5H7.5A2.5 2.5 0 005 6v.25a.75.75 0 001.5 0V6a1 1 0 011-1H9A1 1 0 0110 6v1a1 1 0 01-1 1H7.5z" />
                <path d="M12.5 7A2.5 2.5 0 0115 9.5v1A2.5 2.5 0 0112.5 13H11a.75.75 0 010-1.5h1.5a1 1 0 001-1v-1a1 1 0 00-1-1H11A2.5 2.5 0 018.5 7V6A2.5 2.5 0 0111 3.5h1.5A2.5 2.5 0 0115 6v.25a.75.75 0 01-1.5 0V6a1 1 0 00-1-1H11A1 1 0 0010 6v1a1 1 0 001 1h1.5z" />
              </svg>
            </button>
          </div>
        </footer>
        {/* About the Author */}
        {author && (
          <div className="flex items-center gap-4 mt-10 p-4 bg-gray-100 rounded-lg">
            {author.avatar && <img src={author.avatar} alt={author.name} className="w-16 h-16 rounded-full object-cover" />}
            <div>
              <div className="font-bold text-lg">{author.name}</div>
              <div className="text-gray-600 text-sm mb-1">{author.bio}</div>
              <div className="flex gap-2 mt-1">
                {author.socialLinks?.twitter && <a href={author.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Twitter</a>}
                {author.socialLinks?.linkedin && <a href={author.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-700 hover:underline">LinkedIn</a>}
                {author.socialLinks?.website && <a href={author.socialLinks.website} target="_blank" rel="noopener noreferrer" className="text-gray-700 hover:underline">Website</a>}
              </div>
            </div>
          </div>
        )}
        {/* Next Blog */}
        {nextBlog && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Read Next</h3>
            <a href={`/post/${nextBlog.id}`} className="block bg-blue-50 hover:bg-blue-100 rounded-lg p-4 transition">
              <div className="font-bold text-blue-700">{nextBlog.title}</div>
              <div className="text-gray-600 text-sm mt-1">by {nextBlog.author}</div>
            </a>
          </div>
        )}
        {/* Related Posts by Author */}
        {relatedPosts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">More from {author?.name}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {relatedPosts.map(rp => (
                <a key={rp.id} href={`/post/${rp.id}`} className="block bg-gray-50 hover:bg-gray-100 rounded-lg p-4 transition">
                  <div className="font-bold">{rp.title}</div>
                  <div className="text-gray-600 text-xs mt-1">{rp.excerpt}</div>
                </a>
              ))}
            </div>
          </div>
        )}
        {/* Popular/Read More Articles */}
        {popularPosts.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold mb-2">Popular Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {popularPosts.map(pp => (
                <a key={pp.id} href={`/post/${pp.id}`} className="block bg-white hover:bg-gray-50 rounded-lg p-4 border transition">
                  <div className="font-bold">{pp.title}</div>
                  <div className="text-gray-600 text-xs mt-1">{pp.excerpt}</div>
                </a>
              ))}
            </div>
          </div>
        )}
        {/* Comments Section */}
        <CommentSection postId={postId} />
      </main>
    </div>
  );
} 