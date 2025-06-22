'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, PencilIcon, TrashIcon, UserIcon } from '@heroicons/react/24/outline';
import { authorService } from '@/lib/firebaseServices';
import { Author } from '@/types/blog';
import Navigation from '@/components/Navigation';
import ProtectedRoute from '@/components/ProtectedRoute';
import Image from 'next/image';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<Author | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    bio: '',
    avatar: '',
    twitter: '',
    linkedin: '',
    website: '',
    postsCount: 0
  });

  useEffect(() => {
    loadAuthors();
  }, []);

  const loadAuthors = async () => {
    try {
      const authorsData = await authorService.getAllAuthors();
      setAuthors(authorsData);
    } catch (error) {
      console.error('Error loading authors:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const authorData = {
        ...formData,
        postsCount: parseInt(formData.postsCount.toString()),
        joinedAt: new Date().toISOString(),
        socialLinks: {
          twitter: formData.twitter || undefined,
          linkedin: formData.linkedin || undefined,
          website: formData.website || undefined
        }
      };

      if (editingAuthor) {
        await authorService.updateAuthor(editingAuthor.id, authorData);
      } else {
        await authorService.createAuthor(authorData);
      }

      setShowModal(false);
      setEditingAuthor(null);
      resetForm();
      loadAuthors();
    } catch (error) {
      console.error('Error saving author:', error);
    }
  };

  const handleEdit = (author: Author) => {
    setEditingAuthor(author);
    setFormData({
      name: author.name,
      email: author.email,
      bio: author.bio,
      avatar: author.avatar || '',
      twitter: author.socialLinks?.twitter || '',
      linkedin: author.socialLinks?.linkedin || '',
      website: author.socialLinks?.website || '',
      postsCount: author.postsCount
    });
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      try {
        await authorService.deleteAuthor(id);
        loadAuthors();
      } catch (error) {
        console.error('Error deleting author:', error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      bio: '',
      avatar: '',
      twitter: '',
      linkedin: '',
      website: '',
      postsCount: 0
    });
  };

  const openNewAuthorModal = () => {
    setEditingAuthor(null);
    resetForm();
    setShowModal(true);
  };

  if (loading) {
    return (
      <ProtectedRoute requireAdmin>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading authors...</p>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requireAdmin>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900">Manage Authors</h1>
            <button
              onClick={openNewAuthorModal}
              className="btn-primary flex items-center gap-2"
            >
              <PlusIcon className="h-5 w-5" />
              New Author
            </button>
          </div>

          {/* Authors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {authors.map((author) => (
              <div key={author.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center mb-4">
                    {author.avatar ? (
                      <Image 
                        src={author.avatar} 
                        alt={author.name}
                        className="w-16 h-16 rounded-full object-cover mr-4"
                        width={64}
                        height={64}
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <UserIcon className="h-8 w-8 text-blue-600" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-slate-900">{author.name}</h3>
                      <p className="text-sm text-gray-500">{author.email}</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {author.bio}
                  </p>
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm text-gray-500">
                      {author.postsCount} posts
                    </span>
                    <span className="text-sm text-gray-500">
                      Joined {new Date(author.joinedAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Social Links */}
                  {author.socialLinks && (
                    <div className="flex gap-2 mb-4">
                      {author.socialLinks.twitter && (
                        <a 
                          href={author.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Twitter
                        </a>
                      )}
                      {author.socialLinks.linkedin && (
                        <a 
                          href={author.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          LinkedIn
                        </a>
                      )}
                      {author.socialLinks.website && (
                        <a 
                          href={author.socialLinks.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-700 text-sm"
                        >
                          Website
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(author)}
                      className="flex-1 p-2 text-gray-400 hover:text-blue-600 transition-colors border border-gray-200 rounded"
                      title="Edit Author"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(author.id)}
                      className="flex-1 p-2 text-gray-400 hover:text-red-600 transition-colors border border-gray-200 rounded"
                      title="Delete Author"
                    >
                      <TrashIcon className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {authors.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">No authors found. Create your first author!</p>
            </div>
          )}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <h2 className="text-2xl font-bold text-slate-900">
                  {editingAuthor ? 'Edit Author' : 'Create New Author'}
                </h2>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="input-field"
                      placeholder="Author name"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                      placeholder="author@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.bio}
                    onChange={(e) => setFormData({...formData, bio: e.target.value})}
                    className="input-field"
                    placeholder="Author biography"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={formData.avatar}
                    onChange={(e) => setFormData({...formData, avatar: e.target.value})}
                    className="input-field"
                    placeholder="https://example.com/avatar.jpg"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Twitter URL
                    </label>
                    <input
                      type="url"
                      value={formData.twitter}
                      onChange={(e) => setFormData({...formData, twitter: e.target.value})}
                      className="input-field"
                      placeholder="https://twitter.com/author"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      LinkedIn URL
                    </label>
                    <input
                      type="url"
                      value={formData.linkedin}
                      onChange={(e) => setFormData({...formData, linkedin: e.target.value})}
                      className="input-field"
                      placeholder="https://linkedin.com/in/author"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website URL
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => setFormData({...formData, website: e.target.value})}
                      className="input-field"
                      placeholder="https://author-website.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Posts Count
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.postsCount}
                    onChange={(e) => setFormData({...formData, postsCount: parseInt(e.target.value)})}
                    className="input-field"
                  />
                </div>

                <div className="flex justify-end gap-4 pt-6 border-t">
                  <button
                    type="button"
                    onClick={() => {
                      setShowModal(false);
                      setEditingAuthor(null);
                      resetForm();
                    }}
                    className="btn-secondary"
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn-primary">
                    {editingAuthor ? 'Update Author' : 'Create Author'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
} 