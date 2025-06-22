'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { authors as initialAuthors, AuthorProfile } from '@/data/mockData';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminAuthorsPage() {
  const [authors, setAuthors] = useState<AuthorProfile[]>(initialAuthors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAuthor, setEditingAuthor] = useState<AuthorProfile | null>(null);
  const [formData, setFormData] = useState<Partial<AuthorProfile>>({
    name: '',
    bio: '',
    avatarUrl: '',
    email: '',
    social: ''
  });

  const handleOpenModal = (author?: AuthorProfile) => {
    if (author) {
      setEditingAuthor(author);
      setFormData(author);
    } else {
      setEditingAuthor(null);
      setFormData({ name: '', bio: '', avatarUrl: '', email: '', social: '' });
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAuthor(null);
    setFormData({ name: '', bio: '', avatarUrl: '', email: '', social: '' });
  };

  const handleChange = (field: keyof AuthorProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (!formData.name || !formData.bio) return;
    if (editingAuthor) {
      setAuthors(authors.map(a => a.id === editingAuthor.id ? { ...editingAuthor, ...formData } as AuthorProfile : a));
    } else {
      setAuthors([
        {
          id: Date.now().toString(),
          name: formData.name!,
          bio: formData.bio!,
          avatarUrl: formData.avatarUrl,
          email: formData.email,
          social: formData.social
        },
        ...authors
      ]);
    }
    handleCloseModal();
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this author?')) {
      setAuthors(authors.filter(a => a.id !== id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900">Manage Authors</h1>
          <button onClick={() => handleOpenModal()} className="btn-primary flex items-center space-x-2">
            <PlusIcon className="h-5 w-5" />
            <span>Add Author</span>
          </button>
        </div>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bio</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {authors.map(author => (
                <tr key={author.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{author.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-700">{author.bio}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-500">{author.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button onClick={() => handleOpenModal(author)} className="text-green-600 hover:text-green-900 mr-2">
                      <PencilIcon className="h-4 w-4 inline" />
                    </button>
                    <button onClick={() => handleDelete(author.id)} className="text-red-600 hover:text-red-900">
                      <TrashIcon className="h-4 w-4 inline" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-lg w-full p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">{editingAuthor ? 'Edit Author' : 'Add Author'}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={e => handleChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bio *</label>
                <textarea
                  value={formData.bio || ''}
                  onChange={e => handleChange('bio', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={e => handleChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Avatar URL</label>
                <input
                  type="url"
                  value={formData.avatarUrl || ''}
                  onChange={e => handleChange('avatarUrl', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Social Link</label>
                <input
                  type="url"
                  value={formData.social || ''}
                  onChange={e => handleChange('social', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 pt-6">
              <button onClick={handleCloseModal} className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300">Cancel</button>
              <button onClick={handleSave} className="btn-primary">{editingAuthor ? 'Update' : 'Add'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 