import Link from 'next/link';
import { format } from 'date-fns';
import { ClockIcon, UserIcon } from '@heroicons/react/24/outline';
import { BlogPost } from '@/types/blog';

interface BlogCardProps {
  post: BlogPost;
}

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <article className="card overflow-hidden group">
      {post.imageUrl && (
        <div className="aspect-video overflow-hidden">
          <div className="w-full h-48 bg-gradient-to-br from-blue-100 to-green-100 flex items-center justify-center">
            <span className="text-gray-500 text-sm">Image placeholder</span>
          </div>
        </div>
      )}
      
      <div className="p-6">
        <div className="flex items-center space-x-2 mb-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            {post.category}
          </span>
          <div className="flex items-center text-sm text-gray-500">
            <ClockIcon className="h-4 w-4 mr-1" />
            {post.readTime} min read
          </div>
        </div>
        
        <Link href={`/post/${post.id}`}>
          <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
            {post.title}
          </h3>
        </Link>
        
        <p className="text-gray-600 mb-4 line-clamp-3 leading-relaxed">
          {post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <UserIcon className="h-4 w-4 mr-1" />
            {post.author}
          </div>
          <time className="text-sm text-gray-500">
            {post.publishedAt && !isNaN(new Date(post.publishedAt).getTime())
              ? format(new Date(post.publishedAt), 'MMM dd, yyyy')
              : 'Unpublished'}
          </time>
        </div>
        
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </article>
  );
} 