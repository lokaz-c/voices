'use client';

import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';
import Navigation from '@/components/Navigation';
import { categories } from '@/data/mockData';
import { applicationService } from '@/lib/firebaseServices';

interface AuthorApplication {
  firstName: string;
  lastName: string;
  email: string;
  bio: string;
  writingExperience: string;
  preferredCategories: string[];
  sampleTitle: string;
  sampleExcerpt: string;
  socialMedia?: string;
  website?: string;
  portfolio?: string;
}

export default function BecomeAuthorPage() {
  const [formData, setFormData] = useState<AuthorApplication>({
    firstName: '',
    lastName: '',
    email: '',
    bio: '',
    writingExperience: '',
    preferredCategories: [],
    sampleTitle: '',
    sampleExcerpt: '',
    socialMedia: '',
    website: '',
    portfolio: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof AuthorApplication, value: string | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCategoryToggle = (category: string) => {
    const currentCategories = formData.preferredCategories;
    const updatedCategories = currentCategories.includes(category)
      ? currentCategories.filter(c => c !== category)
      : [...currentCategories, category];
    
    handleInputChange('preferredCategories', updatedCategories);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.bio.trim()) newErrors.bio = 'Bio is required';
    if (!formData.writingExperience.trim()) newErrors.writingExperience = 'Writing experience is required';
    if (formData.preferredCategories.length === 0) newErrors.preferredCategories = 'Please select at least one category';
    if (!formData.sampleTitle.trim()) newErrors.sampleTitle = 'Sample article title is required';
    if (!formData.sampleExcerpt.trim()) newErrors.sampleExcerpt = 'Sample excerpt is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setErrors({});
    try {
      // Map form fields to Firestore AuthorApplication type
      const application = {
        name: `${formData.firstName} ${formData.lastName}`.trim(),
        email: formData.email,
        bio: formData.bio,
        expertise: formData.writingExperience,
        writingSamples: formData.sampleExcerpt,
        motivation: formData.sampleTitle,
        preferredCategories: formData.preferredCategories,
        socialMedia: formData.socialMedia,
        website: formData.website,
        portfolio: formData.portfolio,
        avatar: '',
      };
      await applicationService.submitApplication(application);
      setIsSubmitted(true);
    } catch (error) {
      setErrors({ submit: 'Failed to submit application. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-6" />
          <h1 className="text-3xl font-bold text-slate-900 mb-4">
            Application Submitted!
          </h1>
          <p className="text-gray-600 mb-8">
            Thank you for your interest in becoming an author at Views and Viewpoints. We've received your application and will review it carefully.
          </p>
          <div className="bg-blue-50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold text-slate-900 mb-2">What happens next?</h3>
            <ul className="text-left text-gray-600 space-y-2">
              <li>• We'll review your application within 3-5 business days</li>
              <li>• If approved, we'll send you writer guidelines and next steps</li>
              <li>• You'll have access to our content management system</li>
              <li>• We'll help you publish your first article</li>
            </ul>
          </div>
          <a href="/" className="btn-primary">
            Return to Homepage
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      {/* Header */}
      <section className="bg-gradient-to-r from-blue-50 to-green-50 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-slate-900 mb-4">
            Become an Author
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our community of storytellers and share your unique perspective with readers around the world.
          </p>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-6">Author Application</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange('firstName', e.target.value)}
                      className={`input-field ${
                        errors.firstName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {errors.firstName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => handleInputChange('lastName', e.target.value)}
                      className={`input-field ${
                        errors.lastName ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`input-field ${
                      errors.email ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Writing Experience */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Writing Experience</h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bio *
                  </label>
                  <textarea
                    value={formData.bio}
                    onChange={(e) => handleInputChange('bio', e.target.value)}
                    rows={4}
                    className={`textarea-field ${
                      errors.bio ? 'border-red-500' : ''
                    }`}
                    placeholder="Tell us about yourself, your background, and what drives your writing..."
                  />
                  {errors.bio && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      {errors.bio}
                    </p>
                  )}
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Writing Experience *
                  </label>
                  <textarea
                    value={formData.writingExperience}
                    onChange={(e) => handleInputChange('writingExperience', e.target.value)}
                    rows={3}
                    className={`textarea-field ${
                      errors.writingExperience ? 'border-red-500' : ''
                    }`}
                    placeholder="Describe your writing experience, publications, or relevant background..."
                  />
                  {errors.writingExperience && (
                    <p className="text-red-500 text-sm mt-1 flex items-center">
                      <XCircleIcon className="h-4 w-4 mr-1" />
                      {errors.writingExperience}
                    </p>
                  )}
                </div>
              </div>

              {/* Preferred Categories */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Preferred Categories</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Select the categories you'd like to write about (select at least one):
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categories.map((category) => (
                    <label key={category.name} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.preferredCategories.includes(category.name)}
                        onChange={() => handleCategoryToggle(category.name)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{category.name}</span>
                    </label>
                  ))}
                </div>
                {errors.preferredCategories && (
                  <p className="text-red-500 text-sm mt-2 flex items-center">
                    <XCircleIcon className="h-4 w-4 mr-1" />
                    {errors.preferredCategories}
                  </p>
                )}
              </div>

              {/* Sample Article */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Sample Article</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Article Title *
                    </label>
                    <input
                      type="text"
                      value={formData.sampleTitle}
                      onChange={(e) => handleInputChange('sampleTitle', e.target.value)}
                      className={`input-field ${
                        errors.sampleTitle ? 'border-red-500' : ''
                      }`}
                      placeholder="Enter a title for your sample article..."
                    />
                    {errors.sampleTitle && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {errors.sampleTitle}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Article Excerpt *
                    </label>
                    <textarea
                      value={formData.sampleExcerpt}
                      onChange={(e) => handleInputChange('sampleExcerpt', e.target.value)}
                      rows={4}
                      className={`textarea-field ${
                        errors.sampleExcerpt ? 'border-red-500' : ''
                      }`}
                      placeholder="Write a brief excerpt or summary of your sample article..."
                    />
                    {errors.sampleExcerpt && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <XCircleIcon className="h-4 w-4 mr-1" />
                        {errors.sampleExcerpt}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Optional Links */}
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-4">Optional Links</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Website
                    </label>
                    <input
                      type="url"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="input-field"
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Social Media
                    </label>
                    <input
                      type="text"
                      value={formData.socialMedia}
                      onChange={(e) => handleInputChange('socialMedia', e.target.value)}
                      className="input-field"
                      placeholder="@yourusername or profile URL"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Portfolio/Previous Work
                    </label>
                    <input
                      type="url"
                      value={formData.portfolio}
                      onChange={(e) => handleInputChange('portfolio', e.target.value)}
                      className="input-field"
                      placeholder="https://yourportfolio.com"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
            {errors.submit && (
              <p className="text-red-500 text-sm mt-2 flex items-center">
                <XCircleIcon className="h-4 w-4 mr-1" />
                {errors.submit}
              </p>
            )}
          </div>
        </div>
      </section>
    </div>
  );
} 