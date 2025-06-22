# Firebase Setup Guide for Voices and Viewpoints

This guide will help you set up Firebase for the Voices and Viewpoints blog application. The app uses Firebase Authentication and Firestore Database, but does NOT require Firebase Storage (to avoid paid services).

## 🚀 Quick Start

### 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter project name: `voices-and-viewpoints`
4. Choose whether to enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Authentication

1. In your Firebase project, go to "Authentication" in the left sidebar
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" authentication
5. Click "Save"

### 3. Create Admin User

1. In Authentication, go to "Users" tab
2. Click "Add user"
3. Enter:
   - **Email**: `admin@voicesandviewpoints.com`
   - **Password**: `admin123`
4. Click "Add user"

### 4. Set Up Firestore Database

1. Go to "Firestore Database" in the left sidebar
2. Click "Create database"
3. Choose "Start in test mode" (we'll add security rules later)
4. Select a location close to your users
5. Click "Enable"

### 5. Configure Environment Variables

1. In your Firebase project, go to "Project settings" (gear icon)
2. Scroll down to "Your apps" section
3. Click the web icon (</>) to add a web app
4. Register app with name: `voices-and-viewpoints-web`
5. Copy the configuration object

6. Create a `.env.local` file in your project root:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 6. Database Structure

The app will automatically create the following collections in Firestore:

#### `posts` Collection
```javascript
{
  id: "auto-generated",
  title: "Post Title",
  excerpt: "Brief description",
  content: "Full post content",
  author: "Author Name",
  category: "Art" | "Books" | "Culture and Tourism" | "Health and Nutrition" | "Analysis" | "About Us",
  publishedAt: "timestamp",
  imageUrl: "https://example.com/image.jpg", // Optional
  readTime: 5,
  tags: ["tag1", "tag2"]
}
```

#### `comments` Collection
```javascript
{
  id: "auto-generated",
  postId: "post_id",
  author: "Commenter Name",
  content: "Comment text",
  email: "commenter@email.com", // Optional
  createdAt: "timestamp",
  status: "pending" | "approved" | "rejected"
}
```

#### `authors` Collection
```javascript
{
  id: "auto-generated",
  name: "Author Name",
  email: "author@email.com",
  bio: "Author biography",
  avatar: "https://example.com/avatar.jpg", // Optional
  socialLinks: {
    twitter: "https://twitter.com/author",
    linkedin: "https://linkedin.com/in/author",
    website: "https://author-website.com"
  },
  postsCount: 5,
  joinedAt: "timestamp"
}
```

#### `applications` Collection
```javascript
{
  id: "auto-generated",
  name: "Applicant Name",
  email: "applicant@email.com",
  bio: "Applicant biography",
  writingSamples: "Sample writing content",
  motivation: "Why they want to be an author",
  submittedAt: "timestamp",
  status: "pending" | "approved" | "rejected"
}
```

### 7. Security Rules

Update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Posts - anyone can read, only admins can write
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'admin@voicesandviewpoints.com';
    }
    
    // Comments - anyone can read approved comments, anyone can create
    match /comments/{commentId} {
      allow read: if resource.data.status == 'approved';
      allow create: if true;
      allow update, delete: if request.auth != null && 
        request.auth.token.email == 'admin@voicesandviewpoints.com';
    }
    
    // Authors - anyone can read, only admins can write
    match /authors/{authorId} {
      allow read: if true;
      allow write: if request.auth != null && 
        request.auth.token.email == 'admin@voicesandviewpoints.com';
    }
    
    // Applications - only admins can read/write
    match /applications/{applicationId} {
      allow read, write: if request.auth != null && 
        request.auth.token.email == 'admin@voicesandviewpoints.com';
    }
  }
}
```

## 🖼️ Image Handling (No Firebase Storage)

Since we're not using Firebase Storage to avoid costs, the app handles images through:

### 1. External Image URLs
- Users can paste image URLs from external sources
- Supports any publicly accessible image URL
- No file upload functionality

### 2. Recommended Free Image Services
- **Unsplash**: `https://unsplash.com/photos/...`
- **Pexels**: `https://images.pexels.com/photos/...`
- **Pixabay**: `https://cdn.pixabay.com/photo/...`
- **Imgur**: `https://i.imgur.com/...`

### 3. Image Usage
- Featured images for blog posts
- Author avatars
- Any image that can be referenced via URL

## 🔐 Authentication Flow

### Admin Access
- **URL**: `/login`
- **Email**: `admin@voicesandviewpoints.com`
- **Password**: `admin123`
- **Access**: Full admin dashboard, post management, user management

### Author Access
- Authors can be created through the admin dashboard
- They can access the author portal at `/author/login`
- Authors can create and manage their own posts

### Public Access
- Anyone can read blog posts and leave comments
- Comments require moderation by admin before appearing

## 🚀 Deployment

### Vercel (Recommended)
1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Other Platforms
- **Netlify**: Build command: `npm run build`
- **Railway**: Supports Next.js out of the box
- **DigitalOcean App Platform**: Easy deployment

## 🔧 Troubleshooting

### Common Issues

1. **Authentication not working**
   - Check environment variables are correct
   - Ensure admin user is created in Firebase
   - Verify email/password match exactly

2. **Database connection issues**
   - Check Firestore is enabled
   - Verify security rules allow read/write
   - Ensure project ID is correct

3. **Images not loading**
   - Check image URLs are publicly accessible
   - Verify URLs are complete (include https://)
   - Test URLs in browser directly

### Environment Variables Check
Make sure all these are set in your `.env.local`:
```env
NEXT_PUBLIC_FIREBASE_API_KEY=✓
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=✓
NEXT_PUBLIC_FIREBASE_PROJECT_ID=✓
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=✓
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=✓
NEXT_PUBLIC_FIREBASE_APP_ID=✓
```

## 📱 Features Available

### ✅ Working Features
- ✅ User authentication (admin/author/user)
- ✅ Blog post creation and management
- ✅ Comment system with moderation
- ✅ Author management
- ✅ Category filtering
- ✅ Text-to-speech functionality
- ✅ Responsive design
- ✅ Admin dashboard with analytics
- ✅ Author applications

### 🖼️ Image Features
- ✅ External image URLs for featured images
- ✅ Author avatar URLs
- ✅ No file upload (cost-effective)
- ✅ Support for any public image URL

## 💰 Cost Considerations

### Free Tier Limits
- **Firebase Authentication**: 10,000 users/month
- **Firestore**: 1GB storage, 50,000 reads/day, 20,000 writes/day
- **No Firebase Storage**: No storage costs

### Scaling Considerations
- For high traffic, consider upgrading Firestore plan
- Monitor usage in Firebase Console
- Implement caching strategies if needed

---

**Voices and Viewpoints** is now ready to use with Firebase! The application provides a complete blog platform without requiring paid Firebase Storage services. 