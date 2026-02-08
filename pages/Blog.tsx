
import React from 'react';
import { BLOG_POSTS } from '../services/mockData';
import { Calendar, User, ArrowRight, Tag } from 'lucide-react';

const Blog = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <div className="text-center py-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Engineering Insights & Guides</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">
          Expert advice on project selection, technical tutorials, and career guidance for engineering students.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {BLOG_POSTS.map((post) => (
          <article key={post.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full">
            <div className="h-48 overflow-hidden relative">
              <img src={post.image} alt={post.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" />
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
              
              <h2 className="text-xl font-bold text-slate-900 mb-3 line-clamp-2 hover:text-orange-600 transition-colors cursor-pointer">
                {post.title}
              </h2>
              
              <p className="text-slate-600 text-sm mb-4 line-clamp-3 flex-1">
                {post.excerpt}
              </p>
              
              <button className="text-orange-600 font-semibold text-sm flex items-center hover:underline mt-auto">
                Read Article <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          </article>
        ))}
      </div>

      <div className="bg-orange-50 rounded-2xl p-8 text-center border border-orange-100">
        <h3 className="text-xl font-bold text-slate-900 mb-2">Want technical tutorials in your inbox?</h3>
        <p className="text-slate-600 mb-6">Join our newsletter for weekly project ideas and coding tips.</p>
        <div className="max-w-md mx-auto flex gap-2">
          <input 
            type="email" 
            placeholder="Enter your email" 
            className="flex-1 border border-slate-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />
          <button className="bg-slate-900 text-white px-6 py-2 rounded-lg font-medium hover:bg-slate-800 transition-colors">
            Subscribe
          </button>
        </div>
      </div>
    </div>
  );
};

export default Blog;
