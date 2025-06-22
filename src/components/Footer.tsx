import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white border-t mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Slogan */}
        <div className="text-center md:text-left">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Voices and Viewpoints</h2>
          <p className="text-gray-600 text-sm">A place where ordinary people tell their not-so-ordinary stories...</p>
        </div>
        {/* Links */}
        <nav className="flex flex-col md:flex-row items-center gap-4 text-sm">
          <Link href="/authors" className="text-blue-600 hover:text-blue-800 font-medium">Authors</Link>
          <Link href="/become-author" className="text-blue-600 hover:text-blue-800 font-medium">Become an Author</Link>
          <Link href="/about-us" className="text-blue-600 hover:text-blue-800 font-medium">About Us</Link>
          <Link href="/admin" className="text-blue-600 hover:text-blue-800 font-medium">Post a Blog</Link>
        </nav>
        {/* Copyright */}
        <div className="text-gray-400 text-xs text-center md:text-right">
          &copy; {new Date().getFullYear()} Voices and Viewpoints. All rights reserved.
        </div>
      </div>
    </footer>
  );
} 