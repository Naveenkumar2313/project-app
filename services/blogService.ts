
import { BLOG_POSTS } from './mockData';
import { BlogPost, BlogComment } from '../types';

// In-memory comment store (mocking a database)
// Key: postId, Value: Array of BlogComment
const COMMENT_STORE: Record<string, BlogComment[]> = {};

// Helper to get from local storage or memory
const getCommentsFromStorage = (postId: string): BlogComment[] => {
  if (COMMENT_STORE[postId]) return COMMENT_STORE[postId];
  
  const stored = localStorage.getItem(`comments_${postId}`);
  if (stored) {
    COMMENT_STORE[postId] = JSON.parse(stored);
    return COMMENT_STORE[postId];
  }
  
  // Seed some dummy comments for demo
  const dummyComments: BlogComment[] = [
    {
      id: 'c1',
      postId,
      userId: 'u99',
      userName: 'Student Explorer',
      userAvatar: 'https://ui-avatars.com/api/?name=SE&background=random',
      content: 'This was really helpful! I was confused between Arduino and ESP32.',
      date: new Date(Date.now() - 86400000 * 2).toISOString()
    }
  ];
  COMMENT_STORE[postId] = dummyComments;
  return dummyComments;
};

const saveCommentsToStorage = (postId: string, comments: BlogComment[]) => {
  COMMENT_STORE[postId] = comments;
  localStorage.setItem(`comments_${postId}`, JSON.stringify(comments));
};

export const BlogService = {
  getAllPosts: async (): Promise<BlogPost[]> => {
    // Simulate API Fetch
    await new Promise(resolve => setTimeout(resolve, 300));
    return BLOG_POSTS;
  },

  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    return BLOG_POSTS.find(p => p.slug === slug);
  },

  getRelatedPosts: async (currentPost: BlogPost): Promise<BlogPost[]> => {
    await new Promise(resolve => setTimeout(resolve, 300));
    // Simple matching algorithm: same category or matching tags
    return BLOG_POSTS.filter(p => 
      p.id !== currentPost.id && 
      (p.category === currentPost.category || p.tags.some(t => currentPost.tags.includes(t)))
    ).slice(0, 3);
  },

  getCategories: (): string[] => {
    const categories = new Set(BLOG_POSTS.map(p => p.category));
    return Array.from(categories);
  },

  // Comment System Methods
  getComments: async (postId: string): Promise<BlogComment[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    return getCommentsFromStorage(postId);
  },

  addComment: async (postId: string, user: { name: string; id: string; avatar?: string }, content: string): Promise<BlogComment> => {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const newComment: BlogComment = {
      id: `c_${Date.now()}`,
      postId,
      userId: user.id,
      userName: user.name,
      userAvatar: user.avatar || `https://ui-avatars.com/api/?name=${user.name}`,
      content,
      date: new Date().toISOString()
    };

    const currentComments = getCommentsFromStorage(postId);
    const updatedComments = [newComment, ...currentComments];
    saveCommentsToStorage(postId, updatedComments);
    
    return newComment;
  }
};
