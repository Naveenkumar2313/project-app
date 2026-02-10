
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BlogService } from '../services/blogService';
import { BlogPost, BlogComment } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { Calendar, Clock, User, Tag, Share2, MessageCircle, Send, ArrowLeft, Loader2, Bookmark } from 'lucide-react';

const BlogPostDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const { addToast } = useNotification();
  
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [comments, setComments] = useState<BlogComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      if (!slug) return;
      setLoading(true);
      try {
        const foundPost = await BlogService.getPostBySlug(slug);
        if (foundPost) {
          setPost(foundPost);
          const related = await BlogService.getRelatedPosts(foundPost);
          setRelatedPosts(related);
          const postComments = await BlogService.getComments(foundPost.id);
          setComments(postComments);
        }
      } catch (error) {
        console.error("Failed to load blog post", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPostData();
    // Scroll to top on slug change
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        text: post?.excerpt,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      addToast('info', 'Link copied to clipboard!');
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      addToast('warning', 'Please login to leave a comment.');
      return;
    }
    if (!commentText.trim()) return;

    setIsSubmittingComment(true);
    try {
      const newComment = await BlogService.addComment(post!.id, { id: user.id, name: user.name, avatar: user.avatar }, commentText);
      setComments([newComment, ...comments]);
      setCommentText('');
      addToast('success', 'Comment posted!');
    } catch (err) {
      addToast('error', 'Failed to post comment.');
    } finally {
      setIsSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-orange-600" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Article Not Found</h2>
        <Link to="/blog" className="text-orange-600 hover:underline flex items-center">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Blog
        </Link>
      </div>
    );
  }

  return (
    <article className="max-w-4xl mx-auto pb-16">
      {/* Hero Section */}
      <div className="mb-8">
        <Link to="/blog" className="inline-flex items-center text-sm text-slate-500 hover:text-orange-600 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to all articles
        </Link>
        
        <div className="aspect-video w-full rounded-2xl overflow-hidden mb-8 shadow-md">
          <img src={post.image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="flex flex-wrap items-center gap-4 mb-4 text-sm">
          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-medium">{post.category}</span>
          <span className="flex items-center text-slate-500"><Calendar className="w-4 h-4 mr-1" /> {post.date}</span>
          <span className="flex items-center text-slate-500"><Clock className="w-4 h-4 mr-1" /> {post.readTime}</span>
        </div>

        <h1 className="text-3xl md:text-5xl font-bold text-slate-900 mb-6 leading-tight">{post.title}</h1>

        <div className="flex items-center justify-between border-b border-slate-200 pb-8">
          <div className="flex items-center">
            <img src={post.authorAvatar} alt={post.author} className="w-12 h-12 rounded-full mr-4 border border-slate-200" />
            <div>
              <div className="font-bold text-slate-900">{post.author}</div>
              <div className="text-xs text-slate-500">{post.authorRole}</div>
            </div>
          </div>
          <div className="flex gap-2">
             <button onClick={() => addToast('info', 'Article saved to bookmarks')} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><Bookmark className="w-5 h-5" /></button>
             <button onClick={handleShare} className="p-2 text-slate-400 hover:bg-slate-100 rounded-full transition-colors"><Share2 className="w-5 h-5" /></button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="prose prose-lg prose-slate max-w-none mb-12">
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-2 mb-12">
        {post.tags.map(tag => (
          <span key={tag} className="inline-flex items-center text-sm bg-slate-100 text-slate-600 px-3 py-1 rounded-md">
            <Tag className="w-3 h-3 mr-1" /> {tag}
          </span>
        ))}
      </div>

      {/* Author Box */}
      <div className="bg-slate-50 p-8 rounded-2xl mb-12 flex items-center gap-6 border border-slate-100">
         <img src={post.authorAvatar} alt={post.author} className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-sm" />
         <div>
            <h3 className="font-bold text-slate-900 text-lg">About {post.author}</h3>
            <p className="text-slate-600 text-sm mt-1">Passionate about bridging the gap between theory and practice in engineering education. Has guided over 500+ student projects.</p>
         </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-slate-900 mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedPosts.map(p => (
              <Link key={p.id} to={`/blog/${p.slug}`} className="group block">
                <div className="aspect-[4/3] rounded-xl overflow-hidden mb-3">
                  <img src={p.image} alt={p.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <h4 className="font-bold text-slate-900 group-hover:text-orange-600 transition-colors line-clamp-2">{p.title}</h4>
                <div className="text-xs text-slate-500 mt-1">{p.readTime}</div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Comments Section */}
      <div id="comments" className="scroll-mt-24">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
          <h3 className="text-2xl font-bold text-slate-900 mb-8 flex items-center">
            <MessageCircle className="w-6 h-6 mr-2" /> Comments ({comments.length})
          </h3>

          {/* Comment Form */}
          <form onSubmit={handleCommentSubmit} className="mb-10">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex-shrink-0 overflow-hidden">
                 {user ? <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" /> : <User className="w-6 h-6 m-2 text-slate-400" />}
              </div>
              <div className="flex-1">
                <textarea 
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder={user ? "Join the discussion..." : "Please login to comment"}
                  disabled={!user || isSubmittingComment}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none min-h-[100px] resize-y disabled:bg-slate-50"
                />
                <div className="flex justify-end mt-2">
                  <button 
                    type="submit"
                    disabled={!user || isSubmittingComment || !commentText.trim()}
                    className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors disabled:opacity-50 flex items-center"
                  >
                    {isSubmittingComment ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-2" /> Post Comment</>}
                  </button>
                </div>
              </div>
            </div>
          </form>

          {/* Comments List */}
          <div className="space-y-8">
            {comments.map(comment => (
              <div key={comment.id} className="flex gap-4 animate-fadeIn">
                <img src={comment.userAvatar} alt={comment.userName} className="w-10 h-10 rounded-full object-cover border border-slate-200" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-bold text-slate-900 text-sm">{comment.userName}</h4>
                    <span className="text-xs text-slate-400">{new Date(comment.date).toLocaleDateString()}</span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-center text-slate-500 italic py-4">No comments yet. Be the first to share your thoughts!</p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default BlogPostDetail;
