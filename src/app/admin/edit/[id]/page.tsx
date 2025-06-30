"use client";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Navigation from "@/components/Navigation";
import * as mammoth from "mammoth";
import TurndownService from "turndown";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import { categories } from "@/data/mockData";
import { BlogCategory } from "@/types/blog";
import { uploadImageToCloudinary, blogService } from "@/lib/firebaseServices";
import { useAuth } from "@/contexts/AuthContext";

export default function EditPostPage() {
  const { user, isAuthenticated, isAuthor } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { id } = params;
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [category, setCategory] = useState<BlogCategory>(categories[0]?.name as BlogCategory || "Art");
  const [tags, setTags] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [featuredImage, setFeaturedImage] = useState<string>("");
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const [readTime, setReadTime] = useState(5);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setMounted(true); }, []);

  // Fetch post data
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    blogService.getPostById(id as string).then(post => {
      if (!post) {
        setError("Post not found");
        return;
      }
      setTitle(post.title || "");
      setExcerpt(post.excerpt || "");
      setCategory(post.category || categories[0]?.name || "Art");
      setTags(Array.isArray(post.tags) ? post.tags.join(", ") : "");
      setImageUrl(post.imageUrl || "");
      setReadTime(post.readTime || 5);
      if (editor && post.content) {
        editor.commands.setContent(post.content);
      }
    }).catch(() => setError("Failed to load post")).finally(() => setLoading(false));
    // eslint-disable-next-line
  }, [id, mounted]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Image.configure({ allowBase64: true, HTMLAttributes: { class: "max-w-full h-auto rounded-lg my-4" } }),
      Link.configure({ openOnClick: false }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({ resizable: true, HTMLAttributes: { class: "border-collapse table-auto w-full" } }),
      TableRow, TableCell, TableHeader,
      Placeholder.configure({ placeholder: "Edit your blog content here..." })
    ],
    content: "",
    editorProps: { attributes: { class: "prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none" } },
  });

  if (!isAuthenticated || !isAuthor) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-gray-700">You must be logged in as an author or admin to edit a post.</p>
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
      setImageUrl(url);
    } catch (err) {
      setError("Failed to upload featured image.");
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
      if (!file.type.startsWith("image/")) {
        throw new Error("Please select an image file.");
      }
      if (file.size > 5 * 1024 * 1024) {
        throw new Error("Image size should be less than 5MB.");
      }
      const url = await uploadImageToCloudinary(file);
      if (!url) {
        throw new Error("Failed to get Cloudinary image URL");
      }
      if (editor) {
        editor.chain().focus().setImage({ src: url }).run();
      }
      if (mediaInputRef.current) {
        mediaInputRef.current.value = '';
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to upload image";
      setError(errorMessage);
      console.error("Image upload error:", err);
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
        pdfjs.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.2.67/pdf.worker.min.js';
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
      tags: tags.split(',').map(t => t.trim()).filter(Boolean),
      imageUrl,
      readTime,
      content: editor.getHTML(),
      status,
      author: user?.name || '',
      authorId: user?.uid || '',
    };
    try {
      await blogService.updatePost(id as string, postData);
      router.push('/admin/dashboard');
    } catch (err) {
      setError('Failed to update post.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-4">Edit Post</h1>
        {error && <div className="bg-red-100 text-red-700 p-2 rounded mb-4">{error}</div>}
        <div className="space-y-4">
          <input className="w-full p-2 border rounded" placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <textarea className="w-full p-2 border rounded" placeholder="Excerpt" value={excerpt} onChange={e => setExcerpt(e.target.value)} />
          <select className="w-full p-2 border rounded" value={category} onChange={e => setCategory(e.target.value as BlogCategory)}>
            {categories.map(cat => (
              <option key={cat.name} value={cat.name}>{cat.name}</option>
            ))}
          </select>
          <input className="w-full p-2 border rounded" placeholder="Tags (comma separated)" value={tags} onChange={e => setTags(e.target.value)} />
          <input className="w-full p-2 border rounded" type="number" min={1} max={60} placeholder="Read time (min)" value={readTime} onChange={e => setReadTime(Number(e.target.value))} />
          <div className="flex items-center space-x-2">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFeaturedImageChange} className="hidden" />
            <button type="button" className="btn-secondary" onClick={() => fileInputRef.current?.click()}>Upload Featured Image</button>
            {imageUrl && <img src={imageUrl} alt="Featured" className="h-12 rounded" />}
          </div>
          <div className="flex items-center space-x-2">
            <input type="file" accept="image/*" ref={mediaInputRef} onChange={handleMediaUpload} className="hidden" />
            <button type="button" className="btn-secondary" onClick={handleInsertMedia}>Insert Image</button>
          </div>
          <div className="flex items-center space-x-2">
            <input type="file" accept=".pdf,.docx" onChange={handleFileChange} className="hidden" id="file-upload" />
            <label htmlFor="file-upload" className="btn-secondary cursor-pointer">Upload PDF/Word</label>
          </div>
          <EditorContent editor={editor} />
          <div className="flex space-x-2 mt-4">
            <button className="btn-primary" disabled={saving} onClick={() => handleSave('published')}>{saving ? 'Saving...' : 'Save & Publish'}</button>
            <button className="btn-secondary" disabled={saving} onClick={() => handleSave('draft')}>{saving ? 'Saving...' : 'Save as Draft'}</button>
          </div>
        </div>
      </div>
    </div>
  );
} 