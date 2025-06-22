import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User,
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  serverTimestamp,
  Timestamp,
  setDoc
} from 'firebase/firestore';
import { BlogPost, Comment, Author, AuthorApplication } from '@/types/blog';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Check if Firebase is properly configured
const isFirebaseConfigured = firebaseConfig.apiKey && 
  firebaseConfig.apiKey !== 'your_api_key_here' && 
  firebaseConfig.projectId && 
  firebaseConfig.projectId !== 'your_project_id';

let app: unknown = null;
let auth: unknown = null;
let db: unknown = null;

if (isFirebaseConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getFirestore(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
} else {
  console.warn('Firebase not configured. Please set up your .env.local file with Firebase credentials.');
}

// User Management Service
export const userService = {
  // Create user with role
  createUser: async (email: string, password: string, name: string, role: 'user' | 'author' | 'admin' = 'user') => {
    if (!auth || !db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update profile with name
      await updateProfile(user, { displayName: name });

      // Create user document in Firestore with role
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name,
        role: role,
        createdAt: serverTimestamp()
      });

      return user;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  },

  // Get user role
  getUserRole: async (uid: string): Promise<string> => {
    if (!db) {
      console.warn('Firebase not configured. Cannot fetch user role.');
      return 'user';
    }
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return docSnap.data().role || 'user';
      }
      return 'user';
    } catch (error) {
      console.error('Error getting user role:', error);
      return 'user';
    }
  },

  // Update user role
  updateUserRole: async (uid: string, role: 'user' | 'author' | 'admin'): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'users', uid);
      await updateDoc(docRef, { role });
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  }
};

// Auth Service
export const authService = {
  signIn: async (email: string, password: string) => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      console.error('Sign in error:', error);
      throw error;
    }
  },

  signOut: async () => {
    if (!auth) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw error;
    }
  },

  onAuthStateChanged: (callback: (user: User | null) => void) => {
    if (!auth) {
      console.warn('Firebase not configured. Auth state changes will not work.');
      return () => {};
    }
    return onAuthStateChanged(auth, callback);
  }
};

// Blog Posts Service
export const blogService = {
  // Get all posts
  getAllPosts: async (): Promise<BlogPost[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(collection(db, 'posts'), orderBy('publishedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
    } catch (error) {
      console.error('Error getting posts:', error);
      return [];
    }
  },

  // Get post by ID
  getPostById: async (id: string): Promise<BlogPost | null> => {
    if (!db) {
      console.warn('Firebase not configured. Cannot fetch post.');
      return null;
    }
    try {
      const docRef = doc(db, 'posts', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as BlogPost;
      }
      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      return null;
    }
  },

  // Get posts by category
  getPostsByCategory: async (category: string): Promise<BlogPost[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(
        collection(db, 'posts'), 
        where('category', '==', category),
        orderBy('publishedAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
    } catch (error) {
      console.error('Error getting posts by category:', error);
      return [];
    }
  },

  // Create new post
  createPost: async (post: Omit<BlogPost, 'id' | 'publishedAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = await addDoc(collection(db, 'posts'), {
        ...post,
        publishedAt: serverTimestamp()
      });
      return docRef.id;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  },

  // Update post
  updatePost: async (id: string, updates: Partial<BlogPost>): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'posts', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  },

  // Delete post
  deletePost: async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'posts', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  },

  // Get featured posts
  getFeaturedPosts: async (limitCount: number = 6): Promise<BlogPost[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(
        collection(db, 'posts'), 
        orderBy('publishedAt', 'desc'),
        limit(limitCount)
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as BlogPost[];
    } catch (error) {
      console.error('Error getting featured posts:', error);
      return [];
    }
  }
};

// Comments Service
export const commentService = {
  // Get comments for a post
  getCommentsForPost: async (postId: string): Promise<Comment[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(
        collection(db, 'comments'), 
        where('postId', '==', postId),
        where('status', '==', 'approved'),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : (data.createdAt || ''),
          // Ensure email is undefined if not present
          email: data.email || undefined
        } as Comment;
      });
    } catch (error) {
      console.error('Error getting comments:', error);
      return [];
    }
  },

  // Get all comments (for admin)
  getAllComments: async (): Promise<Comment[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(collection(db, 'comments'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt && typeof data.createdAt.toDate === 'function' ? data.createdAt.toDate().toISOString() : (data.createdAt || ''),
          // Ensure email is undefined if not present
          email: data.email || undefined
        } as Comment;
      });
    } catch (error) {
      console.error('Error getting all comments:', error);
      return [];
    }
  },

  // Add comment
  addComment: async (comment: Omit<Comment, 'id' | 'createdAt'>): Promise<string> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      // Filter out undefined values and empty strings
      const cleanComment = Object.fromEntries(
        Object.entries(comment).filter(([_, value]) => 
          value !== undefined && value !== null && value !== ''
        )
      );
      
      const docRef = await addDoc(collection(db, 'comments'), {
        ...cleanComment,
        createdAt: serverTimestamp(),
        status: 'approved' // Default to approved for instant posting
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  // Update comment status
  updateCommentStatus: async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'comments', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating comment status:', error);
      throw error;
    }
  },

  // Delete comment
  deleteComment: async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'comments', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  }
};

// Authors Service
export const authorService = {
  // Get all authors
  getAllAuthors: async (): Promise<Author[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(collection(db, 'authors'), orderBy('name'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Author[];
    } catch (error) {
      console.error('Error getting authors:', error);
      return [];
    }
  },

  // Get author by ID
  getAuthorById: async (id: string): Promise<Author | null> => {
    if (!db) {
      console.warn('Firebase not configured. Cannot fetch author.');
      return null;
    }
    try {
      const docRef = doc(db, 'authors', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() } as Author;
      }
      return null;
    } catch (error) {
      console.error('Error getting author:', error);
      return null;
    }
  },

  // Create author
  createAuthor: async (author: Omit<Author, 'id'>): Promise<string> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      // Remove undefined values from socialLinks
      let cleanSocialLinks = undefined;
      if (author.socialLinks) {
        cleanSocialLinks = Object.fromEntries(
          Object.entries(author.socialLinks).filter(([_, value]) => value !== undefined && value !== null && value !== '')
        );
      }
      // Remove undefined/null/empty from author
      const cleanAuthor = Object.fromEntries(
        Object.entries({ ...author, socialLinks: cleanSocialLinks })
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
      );
      const docRef = await addDoc(collection(db, 'authors'), cleanAuthor);
      return docRef.id;
    } catch (error) {
      console.error('Error creating author:', error);
      throw error;
    }
  },

  // Update author
  updateAuthor: async (id: string, updates: Partial<Author>): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'authors', id);
      await updateDoc(docRef, updates);
    } catch (error) {
      console.error('Error updating author:', error);
      throw error;
    }
  },

  // Delete author
  deleteAuthor: async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'authors', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting author:', error);
      throw error;
    }
  }
};

// Author Applications Service
export const applicationService = {
  // Get all applications
  getAllApplications: async (): Promise<AuthorApplication[]> => {
    if (!db) {
      console.warn('Firebase not configured. Using mock data.');
      return [];
    }
    try {
      const q = query(collection(db, 'applications'), orderBy('submittedAt', 'desc'));
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AuthorApplication[];
    } catch (error) {
      console.error('Error getting applications:', error);
      return [];
    }
  },

  // Submit application
  submitApplication: async (application: Omit<AuthorApplication, 'id' | 'submittedAt' | 'status'>): Promise<string> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = await addDoc(collection(db, 'applications'), {
        ...application,
        submittedAt: serverTimestamp(),
        status: 'pending'
      });
      return docRef.id;
    } catch (error) {
      console.error('Error submitting application:', error);
      throw error;
    }
  },

  // Approve application and create author account
  approveApplication: async (applicationId: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      // Get the application
      const appRef = doc(db, 'applications', applicationId);
      const appSnap = await getDoc(appRef);
      
      if (!appSnap.exists()) {
        throw new Error('Application not found');
      }
      
      const application = appSnap.data() as AuthorApplication;
      
      // Create author account
      const authorData: Omit<Author, 'id' | 'joinedAt'> = {
        name: application.name,
        email: application.email,
        bio: application.bio,
        expertise: application.expertise || '',
        avatar: application.avatar || '',
        postsCount: 0,
        socialLinks: {}
      };
      
      const authorRef = await addDoc(collection(db, 'authors'), {
        ...authorData,
        joinedAt: serverTimestamp()
      });
      
      // Update application status
      await updateDoc(appRef, { 
        status: 'approved',
        approvedAt: serverTimestamp(),
        authorId: authorRef.id
      });
      
      // Create notification for the user
      await addDoc(collection(db, 'notifications'), {
        userId: application.userId || '',
        type: 'application_approved',
        title: 'Author Application Approved!',
        message: `Congratulations! Your application to become an author has been approved. You can now start writing and publishing posts on Voices and Viewpoints.`,
        isRead: false,
        createdAt: serverTimestamp(),
        data: {
          authorId: authorRef.id,
          applicationId: applicationId
        }
      });
      
    } catch (error) {
      console.error('Error approving application:', error);
      throw error;
    }
  },

  // Reject application
  rejectApplication: async (applicationId: string, reason?: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      // Get the application
      const appRef = doc(db, 'applications', applicationId);
      const appSnap = await getDoc(appRef);
      
      if (!appSnap.exists()) {
        throw new Error('Application not found');
      }
      
      const application = appSnap.data() as AuthorApplication;
      
      // Update application status
      await updateDoc(appRef, { 
        status: 'rejected',
        rejectedAt: serverTimestamp(),
        rejectionReason: reason || 'Application was not approved at this time.'
      });
      
      // Create notification for the user
      await addDoc(collection(db, 'notifications'), {
        userId: application.userId || '',
        type: 'application_rejected',
        title: 'Author Application Update',
        message: reason || 'Your application to become an author was not approved at this time. You can reapply in the future.',
        isRead: false,
        createdAt: serverTimestamp(),
        data: {
          applicationId: applicationId,
          reason: reason
        }
      });
      
    } catch (error) {
      console.error('Error rejecting application:', error);
      throw error;
    }
  },

  // Update application status
  updateApplicationStatus: async (id: string, status: 'pending' | 'approved' | 'rejected'): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'applications', id);
      await updateDoc(docRef, { status });
    } catch (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
  },

  // Delete application
  deleteApplication: async (id: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'applications', id);
      await deleteDoc(docRef);
    } catch (error) {
      console.error('Error deleting application:', error);
      throw error;
    }
  }
};

// Notifications Service
export const notificationService = {
  // Get user notifications
  getUserNotifications: async (userId: string) => {
    if (!db) {
      console.warn('Firebase not configured. Cannot fetch notifications.');
      return [];
    }
    try {
      const q = query(
        collection(db, 'notifications'), 
        where('userId', '==', userId),
        orderBy('createdAt', 'desc')
      );
      const querySnapshot = await getDocs(q);
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error getting notifications:', error);
      return [];
    }
  },

  // Mark notification as read
  markAsRead: async (notificationId: string): Promise<void> => {
    if (!db) {
      throw new Error('Firebase not configured. Please set up your .env.local file.');
    }
    try {
      const docRef = doc(db, 'notifications', notificationId);
      await updateDoc(docRef, { isRead: true });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  }
};

// Utility function to convert Firestore timestamp to string
export const formatTimestamp = (timestamp: Timestamp | null): string => {
  if (!timestamp) return new Date().toISOString();
  return timestamp.toDate().toISOString();
};

export const addSubscriber = async (email: string): Promise<void> => {
  if (!db) {
    throw new Error('Firebase not configured. Please set up your .env.local file.');
  }
  try {
    await addDoc(collection(db, 'subscribers'), {
      email,
      createdAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error adding subscriber:', error);
    throw error;
  }
}; 