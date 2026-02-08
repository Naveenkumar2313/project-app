
import React, { useState } from 'react';
import { Search, ChevronRight, MessageSquare, Book, AlertCircle, CheckCircle, Send, FileQuestion } from 'lucide-react';
import { HELP_ARTICLES } from '../services/mockData';

const HelpCenter = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Ticket Form State
  const [ticketForm, setTicketForm] = useState({ subject: '', type: 'Technical', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const categories = ['All', ...Array.from(new Set(HELP_ARTICLES.map(a => a.category)))];

  const filteredArticles = HELP_ARTICLES.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || article.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleTicketSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSuccessMessage(`Ticket #${Math.floor(1000 + Math.random() * 9000)} Created Successfully! Notification sent to email & SMS.`);
    setTicketForm({ subject: '', type: 'Technical', message: '' });
    setIsSubmitting(false);

    // Clear success message after 5 seconds
    setTimeout(() => setSuccessMessage(''), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-12">
      {/* Hero Section */}
      <div className="text-center space-y-4 py-8">
        <h1 className="text-4xl font-bold text-slate-900">How can we help you?</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Browse our knowledge base for quick answers or raise a ticket for personalized support.</p>
        
        <div className="relative max-w-xl mx-auto mt-6">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-11 pr-4 py-4 border border-slate-300 rounded-full leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent shadow-sm text-base"
            placeholder="Search for articles, guides, or troubleshooting..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Knowledge Base */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
         <div className="md:col-span-1 space-y-2">
            <h3 className="font-bold text-slate-900 mb-4 px-2">Categories</h3>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeCategory === cat ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                {cat}
              </button>
            ))}
         </div>

         <div className="md:col-span-2">
            <h3 className="font-bold text-slate-900 mb-4 flex items-center">
              <Book className="w-5 h-5 mr-2 text-orange-500" /> 
              {activeCategory === 'All' ? 'Popular Articles' : `${activeCategory} Articles`}
            </h3>
            
            {filteredArticles.length > 0 ? (
              <div className="space-y-3">
                {filteredArticles.map(article => (
                  <div key={article.id} className="group bg-white p-4 rounded-lg border border-slate-200 hover:border-orange-200 hover:shadow-sm transition-all cursor-pointer flex justify-between items-center">
                    <div className="flex items-center">
                       <FileQuestion className="w-5 h-5 text-slate-400 mr-3 group-hover:text-orange-500" />
                       <span className="text-slate-700 font-medium group-hover:text-orange-700">{article.title}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-orange-400" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 bg-slate-50 rounded-lg border border-dashed border-slate-300">
                <p className="text-slate-500">No articles found matching your search.</p>
              </div>
            )}
         </div>
      </div>

      {/* Ticket System */}
      <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
         <div className="bg-slate-900 p-8 text-white">
            <h2 className="text-2xl font-bold flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-orange-500" /> 
              Submit a Support Ticket
            </h2>
            <p className="text-slate-300 mt-2">Can't find what you're looking for? Our engineering team is here to help.</p>
         </div>
         
         <div className="p-8">
            {successMessage ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center animate-fadeIn">
                 <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle className="w-8 h-8 text-green-600" />
                 </div>
                 <h3 className="text-xl font-bold text-green-800 mb-2">Ticket Submitted!</h3>
                 <p className="text-green-700">{successMessage}</p>
                 <button 
                   onClick={() => setSuccessMessage('')}
                   className="mt-6 text-sm font-semibold text-green-700 hover:underline"
                 >
                   Submit another ticket
                 </button>
              </div>
            ) : (
              <form onSubmit={handleTicketSubmit} className="space-y-6 max-w-3xl mx-auto">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Topic / Subject</label>
                      <input 
                        required
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        placeholder="e.g., Code Compilation Error"
                        value={ticketForm.subject}
                        onChange={e => setTicketForm({...ticketForm, subject: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Issue Type</label>
                      <select 
                        className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                        value={ticketForm.type}
                        onChange={e => setTicketForm({...ticketForm, type: e.target.value})}
                      >
                        <option value="Technical">Technical Issue</option>
                        <option value="Billing">Billing / Invoice</option>
                        <option value="Shipping">Shipping / Delivery</option>
                        <option value="General">General Inquiry</option>
                      </select>
                    </div>
                 </div>
                 
                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Detailed Description</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Please describe your issue in detail. Include error logs if applicable."
                      value={ticketForm.message}
                      onChange={e => setTicketForm({...ticketForm, message: e.target.value})}
                    ></textarea>
                 </div>

                 <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start text-sm text-blue-800">
                    <AlertCircle className="w-5 h-5 mr-2 flex-shrink-0 mt-0.5" />
                    <p>Response time is typically 24 hours. Critical technical issues are prioritized.</p>
                 </div>

                 <button 
                   type="submit"
                   disabled={isSubmitting}
                   className="w-full md:w-auto px-8 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg shadow-md transition-all flex items-center justify-center disabled:opacity-70"
                 >
                   {isSubmitting ? 'Submitting...' : <><Send className="w-4 h-4 mr-2" /> Submit Ticket</>}
                 </button>
              </form>
            )}
         </div>
      </div>
    </div>
  );
};

export default HelpCenter;
