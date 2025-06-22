# Voices and Viewpoints

A modern blog-style website where ordinary people tell their not-so-ordinary stories. Built with Next.js, TypeScript, and Tailwind CSS.

## Features

### 🎨 Design & User Experience
- **Modern, responsive design** with a blue and pale/lime green color scheme
- **Beautiful typography** using Geist fonts
- **Fully responsive** layout that works on all devices
- **Smooth animations** and hover effects
- **Accessible** design with proper contrast and navigation

### 📝 Content Management
- **Six main categories**: Art, Books, Culture and Tourism, Health and Nutrition, Analysis, About Us
- **Rich blog posts** with support for images, videos, and other media
- **Text-to-speech** functionality on all posts
- **Comment system** with moderation capabilities
- **Author profiles** with bios and social links

### 👥 User Features
- **Author section** showcasing all contributors
- **Become an Author** application form
- **Newsletter signup** for staying connected
- **Category browsing** with filtered views
- **Search and filtering** capabilities

### 🔧 Admin Backend
- **Comprehensive dashboard** with analytics and quick actions
- **Post management** with CRUD operations
- **Author management** system
- **Comment moderation** with approval/rejection workflow
- **Application management** for new author requests
- **Authentication system** for admin access

### 🛠 Technical Features
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Firebase** integration for authentication and database
- **Component-based architecture**
- **SEO optimized** with proper metadata

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Firebase project (see SETUP.md for detailed instructions)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd voices-and-viewpoints
```

2. Install dependencies:
```bash
npm install
```

3. Set up Firebase (see SETUP.md):
   - Create Firebase project
   - Enable Authentication, Firestore, and Storage
   - Add environment variables to `.env.local`

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Admin Access
- **URL**: `/login`
- **Email**: `admin@voicesandviewpoints.com`
- **Password**: `admin123`

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin dashboard and management
│   ├── author/            # Author portal and dashboard
│   ├── authors/           # Author listing page
│   ├── become-author/     # Author application form
│   ├── category/          # Category pages
│   ├── login/             # Admin login
│   └── post/              # Individual blog posts
├── components/            # Reusable React components
├── contexts/              # React contexts (Auth)
├── data/                  # Mock data and types
├── lib/                   # Firebase configuration and services
└── types/                 # TypeScript type definitions
```

## Key Components

### Navigation
- Responsive navigation with category links
- Admin menu for authenticated users
- Mobile-friendly hamburger menu

### BlogCard
- Displays blog post previews
- Shows author, category, read time, and excerpt
- Hover effects and responsive design

### TextToSpeech
- Browser-based text-to-speech functionality
- Play/pause controls
- Speed adjustment options

### CommentSection
- Comment display and submission
- Moderation status indicators
- Responsive design

### Admin Dashboard
- Overview statistics
- Quick action buttons
- Recent activity feed

## Styling

The project uses Tailwind CSS with a custom color scheme:
- **Primary Blue**: `blue-600`, `blue-800`
- **Accent Green**: `green-500`, `green-50`
- **Text Colors**: `slate-900`, `gray-600`
- **Background**: `gray-50`, `white`

## Data Structure

### BlogPost
```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  category: BlogCategory;
  publishedAt: string;
  imageUrl?: string;
  readTime: number;
  tags: string[];
}
```

### Comment
```typescript
interface Comment {
  id: string;
  postId: string;
  author: string;
  content: string;
  createdAt: string;
  email?: string;
  status: 'pending' | 'approved' | 'rejected';
}
```

### CategoryInfo
```typescript
interface CategoryInfo {
  name: BlogCategory;
  description: string;
  color: string;
  slug: string;
}
```

## Future Enhancements

### Database Integration
- **Firebase** - Real-time database and authentication
- **Supabase** - PostgreSQL with real-time features
- **PlanetScale** - MySQL-compatible serverless database

### Advanced Features
- **Search functionality** with filters
- **User profiles** and preferences
- **Email notifications** for comments and updates
- **Social sharing** buttons
- **Related posts** suggestions
- **Reading lists** and bookmarks

### Performance
- **Image optimization** with Next.js Image component
- **Caching strategies** for better performance
- **SEO improvements** with structured data
- **Analytics integration**

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Contact

For questions or support, please contact the development team.

---

**Voices and Viewpoints** - A place where ordinary people tell their not-so-ordinary stories.
# voices
