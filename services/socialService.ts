
import { CommunityPost, User } from '../types';
import { COMMUNITY_POSTS } from './mockData';

const POSTS_KEY = 'pygenic_community_posts';

const getStoredPosts = (): CommunityPost[] => {
  const stored = localStorage.getItem(POSTS_KEY);
  if (stored) return JSON.parse(stored);
  // Initial seed
  localStorage.setItem(POSTS_KEY, JSON.stringify(COMMUNITY_POSTS));
  return COMMUNITY_POSTS;
};

const savePosts = (posts: CommunityPost[]) => {
  localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
};

export const SocialService = {
  getPosts: async (): Promise<CommunityPost[]> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return getStoredPosts();
  },

  createPost: async (post: Omit<CommunityPost, 'id' | 'likes' | 'commentsCount' | 'date'>): Promise<CommunityPost> => {
    await new Promise(resolve => setTimeout(resolve, 800));
    const newPost: CommunityPost = {
      ...post,
      id: `cp-${Date.now()}`,
      likes: 0,
      commentsCount: 0,
      date: 'Just now'
    };
    const posts = getStoredPosts();
    const updatedPosts = [newPost, ...posts];
    savePosts(updatedPosts);
    return newPost;
  },

  likePost: async (postId: string): Promise<void> => {
    const posts = getStoredPosts();
    const updated = posts.map(p => {
        if (p.id === postId) {
            return { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked };
        }
        return p;
    });
    savePosts(updated);
  },

  getLeaderboard: async (): Promise<User[]> => {
    await new Promise(resolve => setTimeout(resolve, 400));
    // Mock leaderboard generation
    const names = ['Aarav Gupta', 'Sneha Reddy', 'Vikram Singh', 'Priya Sharma', 'Rahul Verma'];
    return names.map((name, i) => ({
        id: `u-${i}`,
        name,
        email: 'user@example.com',
        points: 1000 - (i * 150),
        avatar: `https://ui-avatars.com/api/?name=${name}&background=random`,
        completedProjectIds: Array(5 - i).fill('p1') // Mock count
    }));
  }
};
