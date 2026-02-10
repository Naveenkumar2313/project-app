import React, { useState, useEffect } from 'react';
import { SocialService } from '../services/socialService';
import { CommunityPost, User } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  Heart, MessageCircle, Share2, Search, Filter, Plus, Image as ImageIcon, 
  Trophy, Medal, Flame, TrendingUp, Camera, MessageSquare, User as UserIcon
} from 'lucide-react';

const Community = () => {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [activeTab, setActiveTab] = useState<'showcase' | 'forum' | 'leaderboard'>('showcase');
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  // Create Post Form
  const [newPostContent, setNewPostContent] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostType, setNewPostType] = useState<'showcase' | 'discussion'>('showcase');
  const [newPostImage, setNewPostImage] = useState<string | null>(null);

  useEffect(() => {
    loadContent();
  }, [activeTab]);

  const loadContent = async () => {
    setLoading(true);
    if (activeTab === 'leaderboard') {
        const users = await SocialService.getLeaderboard();
        setLeaderboard(users);
    } else {
        const data = await SocialService.getPosts();
        // Filter based on tab (Showcase shows only 'showcase', Forum shows 'discussion')
        // For 'showcase' tab, we might want to see discussions too? Let's strictly separate for clarity.
        if (activeTab === 'showcase') {
            setPosts(data.filter(p => p.type === 'showcase'));
        } else {
            setPosts(data.filter(p => p.type === 'discussion'));
        }
    }
    setLoading(false);
  };

  const handleLike = async (postId: string) => {
    await SocialService.likePost(postId);
    // Optimistic update
    setPosts(prev => prev.map(p => 
        p.id === postId ? { ...p, likes: p.isLiked ? p.likes - 1 : p.likes + 1, isLiked: !p.isLiked } : p
    ));
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        addToast('warning', 'Please login to post');
        return;
    }
    if (!newPostContent) return;

    try {
        await SocialService.createPost({
            userId: user.id,
            userName: user.name,
            userAvatar: user.avatar || '',
            type: newPostType,
            title: newPostType === 'discussion' ? newPostTitle : undefined,
            content: newPostContent,
            image: newPostImage || undefined,
            tags: []
        });
        addToast('success', 'Post created successfully!');
        setShowCreateModal(false);
        setNewPostContent('');
        setNewPostTitle('');
        setNewPostImage(null);
        loadContent();
    } catch (err) {
        addToast('error', 'Failed to create post');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setNewPostImage(url);
      }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="text-center py-8 bg-gradient-to-r from-indigo-900 to-slate-900 rounded-3xl text-white mb-8 relative overflow-hidden">
         <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy className="w-64 h-64 text-yellow-300 transform rotate-12" />
         </div>
         <h1 className="text-4xl font-bold mb-2 relative z-10">Community Hub</h1>
         <p className="text-indigo-200 relative z-10">Showcase your builds, discuss ideas, and climb the leaderboard!</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center mb-8">
         <div className="bg-white p-1 rounded-xl shadow-sm border border-slate-200 inline-flex">
            {[
                { id: 'showcase', label: 'Project Showcase', icon: Camera },
                { id: 'forum', label: 'Discussion Forum', icon: MessageSquare },
                { id: 'leaderboard', label: 'Leaderboard', icon: Trophy }
            ].map(tab => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center px-6 py-2.5 rounded-lg text-sm font-medium transition-all ${
                        activeTab === tab.id 
                        ? 'bg-slate-900 text-white shadow-md' 
                        : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                >
                    <tab.icon className="w-4 h-4 mr-2" />
                    {tab.label}
                </button>
            ))}
         </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Sidebar Widgets (Left) */}
         <div className="hidden lg:block space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
               <h3 className="font-bold text-slate-900 mb-4 flex items-center"><Flame className="w-4 h-4 mr-2 text-orange-500" /> Trending Tags</h3>
               <div className="flex flex-wrap gap-2">
                  {['#IoT', '#Robotics', '#ESP32', '#Python', '#FinalYear', '#Help'].map(tag => (
                      <span key={tag} className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-200 transition-colors">
                          {tag}
                      </span>
                  ))}
               </div>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                <h3 className="font-bold text-slate-900 mb-4">Instagram Feed</h3>
                <div className="grid grid-cols-2 gap-2">
                    {[1,2,3,4].map(i => (
                        <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden relative group cursor-pointer">
                            <img src={`https://source.unsplash.com/random/200x200?electronics&sig=${i}`} className="w-full h-full object-cover" alt="" />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors"></div>
                        </div>
                    ))}
                </div>
                <button className="w-full mt-4 text-xs font-bold text-pink-600 hover:underline">View on Instagram</button>
            </div>
         </div>

         {/* Center Feed */}
         <div className="lg:col-span-3">
            {/* Action Bar */}
            {activeTab !== 'leaderboard' && (
                <div className="flex justify-between items-center mb-6">
                    <div className="relative max-w-md w-full">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Search posts..." />
                    </div>
                    <button 
                        onClick={() => setShowCreateModal(true)} 
                        className="ml-4 bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center shadow-lg transform transition hover:-translate-y-0.5"
                    >
                        <Plus className="w-4 h-4 mr-2" /> Create Post
                    </button>
                </div>
            )}

            {loading ? (
                <div className="text-center py-12 text-slate-400">Loading community data...</div>
            ) : (
                <>
                    {activeTab === 'showcase' && (
                        <div className="space-y-6">
                            {posts.map(post => (
                                <div key={post.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                                    <div className="p-4 flex items-center justify-between border-b border-slate-50">
                                        <div className="flex items-center">
                                            <img src={post.userAvatar} className="w-10 h-10 rounded-full mr-3 border border-slate-100" alt="" />
                                            <div>
                                                <h4 className="font-bold text-slate-900 text-sm">{post.userName}</h4>
                                                <p className="text-xs text-slate-500">{post.date}</p>
                                            </div>
                                        </div>
                                        {post.projectTitle && (
                                            <span className="text-xs font-medium bg-blue-50 text-blue-700 px-3 py-1 rounded-full">
                                                Built: {post.projectTitle}
                                            </span>
                                        )}
                                    </div>
                                    {post.image && (
                                        <div className="aspect-video bg-slate-100">
                                            <img src={post.image} className="w-full h-full object-cover" alt="" />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <p className="text-slate-700 leading-relaxed mb-4">{post.content}</p>
                                        <div className="flex items-center space-x-6 pt-2">
                                            <button onClick={() => handleLike(post.id)} className={`flex items-center space-x-2 text-sm font-medium ${post.isLiked ? 'text-red-500' : 'text-slate-500 hover:text-red-500'} transition-colors`}>
                                                <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-current' : ''}`} />
                                                <span>{post.likes}</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-blue-600 transition-colors">
                                                <MessageCircle className="w-5 h-5" />
                                                <span>{post.commentsCount}</span>
                                            </button>
                                            <button className="flex items-center space-x-2 text-sm font-medium text-slate-500 hover:text-green-600 transition-colors ml-auto">
                                                <Share2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'forum' && (
                        <div className="space-y-4">
                            {posts.map(post => (
                                <div key={post.id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-orange-200 transition-colors cursor-pointer animate-fadeIn">
                                    <div className="flex items-start">
                                        <div className="mr-4 flex flex-col items-center space-y-1">
                                            <button onClick={(e) => { e.stopPropagation(); handleLike(post.id); }} className="text-slate-400 hover:text-orange-600"><TrendingUp className="w-6 h-6" /></button>
                                            <span className="font-bold text-slate-700">{post.likes}</span>
                                        </div>
                                        <div className="flex-1">
                                            <h3 className="font-bold text-lg text-slate-900 mb-1">{post.title}</h3>
                                            <p className="text-sm text-slate-600 line-clamp-2 mb-3">{post.content}</p>
                                            <div className="flex items-center text-xs text-slate-500 space-x-4">
                                                <span className="flex items-center"><UserIcon className="w-3 h-3 mr-1" /> {post.userName}</span>
                                                <span>{post.date}</span>
                                                <span className="flex items-center"><MessageCircle className="w-3 h-3 mr-1" /> {post.commentsCount} replies</span>
                                                {post.tags && post.tags.map(t => (
                                                    <span key={t} className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{t}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'leaderboard' && (
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden animate-fadeIn">
                            <div className="p-6 bg-gradient-to-r from-slate-900 to-slate-800 text-white flex justify-between items-end">
                                <div>
                                    <h3 className="font-bold text-xl">Top Contributors</h3>
                                    <p className="text-slate-400 text-sm">Earn points by completing projects and helping others.</p>
                                </div>
                                <Medal className="w-12 h-12 text-yellow-400" />
                            </div>
                            <table className="w-full text-sm text-left">
                                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                                    <tr>
                                        <th className="px-6 py-4">Rank</th>
                                        <th className="px-6 py-4">User</th>
                                        <th className="px-6 py-4 text-center">Projects</th>
                                        <th className="px-6 py-4 text-right">Points</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {leaderboard.map((user, idx) => (
                                        <tr key={user.id} className="hover:bg-slate-50">
                                            <td className="px-6 py-4">
                                                {idx === 0 && <span className="text-xl">🥇</span>}
                                                {idx === 1 && <span className="text-xl">🥈</span>}
                                                {idx === 2 && <span className="text-xl">🥉</span>}
                                                {idx > 2 && <span className="font-bold text-slate-500 ml-2">#{idx + 1}</span>}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <img src={user.avatar} className="w-8 h-8 rounded-full mr-3 border border-slate-200" alt="" />
                                                    <span className="font-bold text-slate-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center font-medium text-slate-600">
                                                {user.completedProjectIds?.length || 0}
                                            </td>
                                            <td className="px-6 py-4 text-right font-mono font-bold text-orange-600">
                                                {user.points?.toLocaleString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </>
            )}
         </div>
      </div>

      {/* Create Post Modal */}
      {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                      <h3 className="text-xl font-bold text-slate-900">Create New Post</h3>
                      <button onClick={() => setShowCreateModal(false)}><span className="text-2xl text-slate-400 hover:text-slate-600">&times;</span></button>
                  </div>
                  
                  <form onSubmit={handleCreatePost} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Post Type</label>
                          <div className="flex gap-4">
                              <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${newPostType === 'showcase' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                  <input type="radio" className="sr-only" checked={newPostType === 'showcase'} onChange={() => setNewPostType('showcase')} />
                                  <Camera className="w-4 h-4 mr-2" /> Showcase
                              </label>
                              <label className={`flex-1 flex items-center justify-center p-3 border rounded-lg cursor-pointer transition-all ${newPostType === 'discussion' ? 'border-orange-500 bg-orange-50 text-orange-700 font-bold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                                  <input type="radio" className="sr-only" checked={newPostType === 'discussion'} onChange={() => setNewPostType('discussion')} />
                                  <MessageSquare className="w-4 h-4 mr-2" /> Discussion
                              </label>
                          </div>
                      </div>

                      {newPostType === 'discussion' && (
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                              <input 
                                  required 
                                  className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500" 
                                  placeholder="What's on your mind?"
                                  value={newPostTitle}
                                  onChange={e => setNewPostTitle(e.target.value)}
                              />
                          </div>
                      )}

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Content</label>
                          <textarea 
                              required 
                              rows={4} 
                              className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500" 
                              placeholder={newPostType === 'showcase' ? "Tell us about your build..." : "Describe your question or topic..."}
                              value={newPostContent}
                              onChange={e => setNewPostContent(e.target.value)}
                          ></textarea>
                      </div>

                      {newPostType === 'showcase' && (
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Photo</label>
                              <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer relative">
                                  <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                                  {newPostImage ? (
                                      <img src={newPostImage} alt="Preview" className="h-32 mx-auto rounded-md object-cover" />
                                  ) : (
                                      <div className="text-slate-400 flex flex-col items-center">
                                          <ImageIcon className="w-8 h-8 mb-2" />
                                          <span className="text-sm">Click to upload image</span>
                                      </div>
                                  )}
                              </div>
                          </div>
                      )}

                      <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">Post</button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Community;