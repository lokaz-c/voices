# Firebase Setup Guide for Voices and Viewpoints

This guide will help you set up Firebase for the Voices and Viewpoints blog platform with proper security rules and automated author approval.

## 1. Firebase Project Setup

### Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: "voices-and-viewpoints"
4. Enable Google Analytics (optional)
5. Click "Create project"

### Enable Authentication
1. In Firebase Console, go to "Authentication" → "Sign-in method"
2. Enable "Email/Password" authentication
3. Click "Save"

### Create Firestore Database
1. Go to "Firestore Database" → "Create database"
2. Choose "Start in test mode" (we'll add security rules later)
3. Select a location close to your users
4. Click "Done"

## 2. Security Rules Setup

### Deploy Security Rules
1. Install Firebase CLI if you haven't:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase in your project:
   ```bash
   firebase init
   ```
   - Select "Firestore" and "Hosting"
   - Choose your project
   - Use default settings

4. The security rules are already created in `firestore.rules`. Deploy them:
   ```bash
   firebase deploy --only firestore:rules
   ```

### Security Rules Explanation
The rules provide:
- **Public read access** to posts, comments, and author profiles
- **Authenticated users** can create comments
- **Authors and admins** can create posts
- **Authors** can edit their own posts
- **Admins** can manage all content and users
- **Applications** are only visible to admins
- **User profiles** are protected

## 3. Database Structure

### Collections Structure
```
firestore/
├── posts/           # Blog posts
├── comments/        # Post comments
├── authors/         # Author profiles
├── applications/    # Author applications
├── users/           # User accounts with roles
└── notifications/   # User notifications
```

### Sample Data Structure

#### Posts Collection
```json
{
  "title": "Sample Post",
  "excerpt": "Post excerpt...",
  "content": "Full post content...",
  "author": "author_id",
  "category": "Art",
  "publishedAt": "timestamp",
  "imageUrl": "https://example.com/image.jpg",
  "readTime": 5,
  "tags": ["art", "culture"]
}
```

#### Authors Collection
```json
{
  "name": "Author Name",
  "email": "author@example.com",
  "bio": "Author biography...",
  "expertise": "Art, Culture",
  "avatar": "https://example.com/avatar.jpg",
  "postsCount": 10,
  "joinedAt": "timestamp",
  "socialLinks": {
    "twitter": "https://twitter.com/author",
    "linkedin": "https://linkedin.com/in/author"
  }
}
```

#### Applications Collection
```json
{
  "name": "Applicant Name",
  "email": "applicant@example.com",
  "bio": "Applicant bio...",
  "expertise": "Writing, Journalism",
  "userId": "firebase_auth_uid",
  "writingSamples": "Sample writing...",
  "motivation": "Why they want to write...",
  "submittedAt": "timestamp",
  "status": "pending",
  "approvedAt": "timestamp",
  "rejectedAt": "timestamp",
  "authorId": "created_author_id",
  "rejectionReason": "Reason for rejection"
}
```

#### Users Collection
```json
{
  "uid": "firebase_auth_uid",
  "email": "user@example.com",
  "name": "User Name",
  "role": "user|author|admin",
  "createdAt": "timestamp"
}
```

#### Notifications Collection
```json
{
  "userId": "firebase_auth_uid",
  "type": "application_approved|application_rejected",
  "title": "Notification Title",
  "message": "Notification message...",
  "isRead": false,
  "createdAt": "timestamp",
  "data": {
    "authorId": "author_id",
    "applicationId": "application_id"
  }
}
```

## 4. Environment Variables

Create a `.env.local` file in your project root:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## 5. Automated Author Approval System

### How It Works
1. **User submits application** via `/become-author` page
2. **Admin reviews application** in `/admin/applications`
3. **Admin approves/rejects** with one click
4. **System automatically**:
   - Creates author profile in `authors` collection
   - Updates application status
   - Sends notification to user
   - Updates user role (if user account exists)

### Approval Process
```javascript
// When admin clicks "Approve"
await applicationService.approveApplication(applicationId);

// This automatically:
// 1. Creates author profile
// 2. Updates application status
// 3. Sends notification
// 4. Links application to author
```

### Rejection Process
```javascript
// When admin clicks "Reject"
await applicationService.rejectApplication(applicationId, reason);

// This automatically:
// 1. Updates application status
// 2. Sends notification with reason
// 3. Stores rejection reason
```

## 6. User Roles and Permissions

### Role Hierarchy
- **User**: Can read posts, comment, submit applications
- **Author**: Can create and edit their own posts, read all posts
- **Admin**: Full access to all features and management

### Role Assignment
- New users default to "user" role
- Authors are created when applications are approved
- Admins must be manually assigned in Firebase Console

### Creating Admin Users
1. Go to Firebase Console → Authentication
2. Find the user you want to make admin
3. Go to Firestore → users collection
4. Find the user document
5. Update the "role" field to "admin"

## 7. Testing the Setup

### Test Authentication
1. Go to `/login` page
2. Try signing in with test credentials
3. Verify user role is loaded correctly

### Test Author Application
1. Go to `/become-author` page
2. Submit a test application
3. Check Firestore for the new application

### Test Admin Approval
1. Sign in as admin
2. Go to `/admin/applications`
3. Approve a test application
4. Verify author profile is created
5. Check notifications collection

### Test Blog Post Creation
1. Sign in as author/admin
2. Go to `/admin` or `/author/dashboard`
3. Create a new post
4. Verify post appears on homepage

## 8. Troubleshooting

### Common Issues

#### "Missing or insufficient permissions"
- Check that security rules are deployed
- Verify user authentication
- Check user role in Firestore

#### "Firebase not configured"
- Verify `.env.local` file exists
- Check environment variable names
- Restart development server

#### "Application not found"
- Check Firestore for application document
- Verify application ID is correct
- Check Firestore rules for applications collection

### Debug Mode
Enable debug logging by adding to your code:
```javascript
console.log('Firebase config:', firebaseConfig);
console.log('User role:', await userService.getUserRole(userId));
```

## 9. Production Deployment

### Deploy to Vercel
1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Update Security Rules for Production
Consider updating rules to be more restrictive:
```javascript
// Only allow authenticated users to read posts
allow read: if isAuthenticated();
```

### Monitor Usage
- Check Firebase Console for usage metrics
- Monitor authentication attempts
- Review Firestore usage

## 10. Maintenance

### Regular Tasks
- Review and clean up old applications
- Monitor user roles and permissions
- Check notification delivery
- Backup important data

### Security Updates
- Regularly review security rules
- Update Firebase SDK versions
- Monitor for security alerts

---

## Quick Start Checklist

- [ ] Create Firebase project
- [ ] Enable Authentication (Email/Password)
- [ ] Create Firestore database
- [ ] Deploy security rules
- [ ] Set up environment variables
- [ ] Test authentication
- [ ] Test author application flow
- [ ] Test admin approval system
- [ ] Test blog post creation
- [ ] Deploy to production

Your Voices and Viewpoints blog is now ready with full Firebase integration and automated author approval! 