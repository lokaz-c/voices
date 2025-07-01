'use client';
import React, { useState, useRef, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import * as mammoth from 'mammoth';
import TurndownService from 'turndown';
import { EditorContent, useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import Table from '@tiptap/extension-table';
import TableRow from '@tiptap/extension-table-row';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import Placeholder from '@tiptap/extension-placeholder';
import { categories } from '@/data/mockData';
import { BlogCategory } from '@/types/blog';
import { uploadImageToStorage, blogService, uploadImageToCloudinary } from '@/lib/firebaseServices';
import { useAuth } from '@/contexts/AuthContext';
import { FaBold, FaItalic, FaListUl, FaListOl, FaQuoteRight, FaAlignLeft, FaAlignCenter, FaAlignRight, FaLink, FaTable } from 'react-icons/fa';
import { MdFormatQuote } from 'react-icons/md';
import { Menu, Transition } from '@headlessui/react';

export default function NewPostPage() {
  const { user, isAuthenticated, isAuthor } = useAuth();
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [category, setCategory] = useState<BlogCategory>(categories[0]?.name as BlogCategory || 'Art');
  const [tags, setTags] = useState('');
  const [featuredImage, setFeaturedImage] = useState<string>('');
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [readTime, setReadTime] = useState(5);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        allowBase64: true,
        HTMLAttributes: { class: 'max-w-full h-auto rounded-lg my-4' },
      }),
      Link.configure({
        openOnClick: false,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableCell,
      TableHeader,
      Placeholder.configure({
        placeholder: 'Write your blog content here or upload a file to start...',
      }),
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      },
    },
  });

  const blockTypes = [
    { label: 'Paragraph', command: 'setParagraph' },
    { label: 'Heading 1', command: 'setHeading', level: 1 },
    { label: 'Heading 2', command: 'setHeading', level: 2 },
    { label: 'Heading 3', command: 'setHeading', level: 3 },
    { label: 'Blockquote', command: 'setBlockquote' },
    { label: 'Code Block', command: 'setCodeBlock' },
  ] as const;

  if (!isAuthenticated || !isAuthor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-700">You must be logged in as an author or admin to create a new post.</p>
        </div>
      </div>
    );
  }

  const handleFeaturedImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFeaturedFile(file);
    setLoading(true);
    try {
      const url = await uploadImageToCloudinary(file);
      setFeaturedImage(url);
    } catch (err) {
      setError('Failed to upload featured image.');
    } finally {
      setLoading(false);
    }
  };

  const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setLoading(true);
    try {
      if (!file.type.startsWith('image/')) {
        throw new Error('Please select an image file.');
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Image size should be less than 5MB.');
      }
      const url = await uploadImageToCloudinary(file);
      if (!url) {
        throw new Error('Failed to get Cloudinary image URL');
      }
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      if (mediaInputRef.current) {
        mediaInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to upload image';
      setError(errorMessage);
      console.error('Image upload error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInsertMedia = () => {
    mediaInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const uploadedFile = e.target.files?.[0] || null;
    if (!uploadedFile) return;
    setLoading(true);
    try {
      let markdown = '';
      if (uploadedFile.name.endsWith('.docx')) {
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const result = await mammoth.convertToHtml({ arrayBuffer });
        const turndownService = new TurndownService();
        markdown = turndownService.turndown(result.value);
      } else if ((uploadedFile.type === 'application/pdf' || uploadedFile.name.endsWith('.pdf')) && typeof window !== 'undefined') {
        // @ts-ignore
        const pdfjs = await import('pdfjs-dist');
        pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
        const arrayBuffer = await uploadedFile.arrayBuffer();
        const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          text += content.items.map((item: any) => item.str).join(' ') + '\n\n';
        }
        markdown = text.trim();
      } else {
        setError('Unsupported file type. Please upload a .docx or .pdf file.');
      }
      if (editor && markdown) {
        editor.commands.setContent(markdown);
      }
    } catch (err) {
      setError('Failed to extract content. Please try another file.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (status: 'draft' | 'published') => {
    if (!editor) {
      setError('Editor not ready.');
      return;
    }
    setSaving(true);
    setError(null);
    const postData = {
      title,
      excerpt,
      category,
      imageUrl: featuredImage,
      readTime,
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      content: editor.getHTML(),
      author: user?.name || 'Unknown',
      status,
    };
    try {
      await blogService.createPost(postData);
      alert('Post saved!');
    } catch (err) {
      setError('Failed to save post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="flex flex-col md:flex-row max-w-6xl mx-auto px-4 py-10 gap-8">
        {/* Main Content */}
        <section className="flex-1 bg-white rounded-lg shadow-md p-8 mb-8">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full text-3xl font-bold mb-4 border-none focus:ring-0 focus:outline-none bg-transparent"
            placeholder="Add Title Here..."
            required
          />
          <div className="flex items-center gap-2 mb-2">
            <button
              type="button"
              className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md flex items-center gap-1"
              onClick={handleInsertMedia}
              disabled={loading}
              title="Add Media"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Add Media
            </button>
            <input
              type="file"
              accept="image/*"
              ref={mediaInputRef}
              style={{ display: 'none' }}
              onChange={handleMediaUpload}
            />
            <label className="bg-lime-500 hover:bg-lime-600 text-white px-4 py-2 rounded-md cursor-pointer">
              <input
                type="file"
                accept=".docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={loading}
              />
              Upload Word/PDF
            </label>
            {loading && <span className="text-blue-600 ml-2">Uploading...</span>}
          </div>
          
          {mounted && (
            <>
              {/* Editor Toolbar */}
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-t-md px-2 py-1">
                {/* Block Type Dropdown */}
                <Menu as="div" className="relative inline-block text-left">
                  <Menu.Button className="px-3 py-1.5 text-sm font-medium rounded hover:bg-gray-100 border-r border-gray-200 mr-2">
                    {(() => {
                      if (!editor) return 'Paragraph';
                      if (editor.isActive('heading', { level: 1 })) return 'Heading 1';
                      if (editor.isActive('heading', { level: 2 })) return 'Heading 2';
                      if (editor.isActive('heading', { level: 3 })) return 'Heading 3';
                      if (editor.isActive('blockquote')) return 'Blockquote';
                      if (editor.isActive('codeBlock')) return 'Code Block';
                      return 'Paragraph';
                    })()}
                    <span className="ml-1">▼</span>
                  </Menu.Button>
                  <Transition
                    as={React.Fragment}
                    enter="transition ease-out duration-100"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition ease-in duration-75"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Menu.Items className="absolute left-0 mt-2 w-40 origin-top-left bg-white border border-gray-200 divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none z-10">
                      {blockTypes.map((type) => (
                        <Menu.Item key={type.label}>
                          {({ active }) => (
                            <button
                              className={`w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100' : ''}`}
                              onClick={() => {
                                if (!editor) return;
                                if (type.command === 'setHeading') {
                                  editor.chain().focus().setHeading({ level: type.level as 1 | 2 | 3 | 4 | 5 | 6 }).run();
                                } else {
                                  editor.chain().focus()[type.command]().run();
                                }
                              }}
                            >
                              {type.label}
                            </button>
                          )}
                        </Menu.Item>
                      ))}
                    </Menu.Items>
                  </Transition>
                </Menu>

                {/* Formatting Buttons */}
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive('bold') ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  title="Bold"
                >
                  <FaBold />
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive('italic') ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  title="Italic"
                >
                  <FaItalic />
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive('bulletList') ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  title="Bullet List"
                >
                  <FaListUl />
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive('orderedList') ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  title="Ordered List"
                >
                  <FaListOl />
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive('blockquote') ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().toggleBlockquote().run()}
                  title="Blockquote"
                >
                  <MdFormatQuote />
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive({ textAlign: 'left' }) ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().setTextAlign('left').run()}
                  title="Align Left"
                >
                  <FaAlignLeft />
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive({ textAlign: 'center' }) ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().setTextAlign('center').run()}
                  title="Align Center"
                >
                  <FaAlignCenter />
                </button>
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive({ textAlign: 'right' }) ? 'active' : ''}`}
                  onClick={() => editor?.chain().focus().setTextAlign('right').run()}
                  title="Align Right"
                >
                  <FaAlignRight />
                </button>
                <div className="h-4 w-px bg-gray-200 mx-1" />
                <button
                  type="button"
                  className={`toolbar-btn ${editor?.isActive('link') ? 'active' : ''}`}
                  onClick={() => {
                    const url = prompt('Enter URL');
                    if (url) editor?.chain().focus().setLink({ href: url }).run();
                  }}
                  title="Insert Link"
                >
                  <FaLink />
                </button>
                <button
                  type="button"
                  className="toolbar-btn"
                  onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}
                  title="Insert Table"
                >
                  <FaTable />
                </button>
              </div>

              {error && <div className="text-red-600 mb-2">{error}</div>}
              <div className="border border-t-0 rounded-b-lg bg-gray-50 p-2 min-h-[300px]">
                <EditorContent editor={editor} />
              </div>
            </>
          )}
        </section>
        {/* Sidebar */}
        <aside className="w-full md:w-80 flex-shrink-0">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="font-semibold mb-2">Post Settings</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value as BlogCategory)}
                className="input-field"
                required
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags</label>
              <input
                type="text"
                value={tags}
                onChange={e => setTags(e.target.value)}
                className="input-field"
                placeholder="tag1, tag2, tag3"
              />
              <p className="text-sm text-gray-500 mt-1">Separate tags with commas</p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt *</label>
              <textarea
                value={excerpt}
                onChange={e => setExcerpt(e.target.value)}
                className="input-field"
                rows={3}
                placeholder="Brief description of the post"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Featured Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFeaturedImageChange}
                className="mb-2"
              />
              {featuredImage ? (
                <img src={featuredImage} alt="Featured" className="w-full h-40 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-40 bg-gray-100 flex items-center justify-center rounded-lg text-gray-400">No image selected</div>
              )}
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Read Time (minutes) *</label>
              <input
                type="number"
                min="1"
                value={readTime}
                onChange={e => setReadTime(Number(e.target.value))}
                className="input-field"
                required
              />
            </div>
            <div className="flex gap-2 mt-4">
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => handleSave('draft')}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Draft'}
              </button>
              <button
                type="button"
                className="btn-primary flex-1"
                onClick={() => handleSave('published')}
                disabled={saving}
              >
                {saving ? 'Publishing...' : 'Publish'}
              </button>
            </div>
          </div>
        </aside>
      </main>
      <style jsx global>{`
        .toolbar-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0.35rem 0.5rem;
          border-radius: 0.25rem;
          background: none;
          border: none;
          color: #374151;
          font-size: 1.1rem;
          cursor: pointer;
          transition: background 0.1s;
          margin-right: 0.15rem;
        }
        .toolbar-btn:hover, .toolbar-btn.active {
          background: #e5e7eb;
          color: #2563eb;
        }
        .toolbar-btn.active {
          font-weight: bold;
          box-shadow: 0 0 0 2px #2563eb33;
        }
      `}</style>
    </div>
  );
} 