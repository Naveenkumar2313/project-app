
import React, { useState, useEffect } from 'react';
import { BlogPost } from '../types';
import { BlogService } from '../services/blogService';
import { Calendar, User, ArrowRight, Tag, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const loadData = async () => {
      const data = await BlogService.getAllPosts();
      setPosts(data);
      setCategories(['All', ...BlogService.getCategories()]);
    };
    loadData();
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory = activeCategory === 'All' || post.category === activeCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Engineering Insights & Guides</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Expert advice on project selection, technical tutorials, and career guidance for engineering students.
        </p>
        
        {/* Search & Filter */}
        <div className="mt-8 max-w-3xl mx-auto flex flex-col md:flex-row gap-4 items-center">
           <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
              {categories.map(cat => (
                <button 
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    activeCategory === cat 
                      ? 'bg-slate-900 text-white' 
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
           </div>
        </div>
      </div>

      {filteredPosts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredPosts.map((post) => (
            <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full group">
              <div className="h-48 overflow-hidden relative">
                <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4">
                  <span className="bg-white/90 backdrop-blur text-slate-800 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center">
                    <Tag className="w-3 h-3 mr-1 text-orange-500" /> {post.category}
                  </span>
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-slate-500 mb-3 space-x-4">
                  <span className="flex items-center"><Calendar className="w-3 h-3 mr-1" /> {post.date}</span>
                  <span className="flex items-center"><User className="w-3 h-3 mr-1" /> {post.author}</span>
                </div>
                
                <Link to={`/blog/${post.slug}`}>
                  <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                  {post.excerpt}
                </p>
                
                <Link to={`/blog/${post.slug}`} className="text-orange-600 font-semibold text-sm flex items-center hover:underline mt-auto">
                  Read Article <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
           <p className="text-slate-500 text-lg">No articles found matching your search.</p>
           <button onClick={() => {setSearchQuery(''); setActiveCategory('All');}} className="mt-4 text-orange-600 font-bold hover:underline">Clear Filters</button>
        </div>
      )}

      {/* Newsletter Subscription */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 md:p-12 text-center border border-orange-200 relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Want technical tutorials in your inbox?</h3>
          <p className="text-slate-600 mb-8 max-w-lg mx-auto">Join our newsletter for weekly project ideas, coding tips, and exclusive discounts on hardware kits.</p>
          <form className="max-w-md mx-auto flex flex-col sm:flex-row gap-3" onSubmit={(e) => { e.preventDefault(); alert('Subscribed!'); }}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              required
              className="flex-1 border border-orange-200 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-orange-500 shadow-sm"
            />
            <button type="submit" className="bg-slate-900 text-white px-8 py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors shadow-lg">
              Subscribe
            </button>
          </form>
          <p className="text-xs text-slate-500 mt-4">We respect your privacy. Unsubscribe at any time.</p>
        </div>
      </div>
    </div>
  );
};

export default Blog;
