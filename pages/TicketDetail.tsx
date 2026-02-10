
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DataManager } from '../services/dataManager';
import { SupportTicket, TicketReply } from '../types';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  ArrowLeft, Clock, Paperclip, Send, User, Monitor, AlertTriangle, 
  CheckCircle, FileText, Activity 
} from 'lucide-react';

const TicketDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToast } = useNotification();
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) {
      const foundTicket = DataManager.getTicketById(id);
      setTicket(foundTicket || null);
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [ticket?.replies]);

  const handleReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !ticket || !user) return;

    const newReply: TicketReply = {
      id: `rep-${Date.now()}`,
      sender: 'user',
      senderName: user.name,
      message: replyText,
      date: new Date().toISOString()
    };

    const updatedTicket = DataManager.addReplyToTicket(ticket.id, newReply);
    if (updatedTicket) {
      setTicket(updatedTicket);
      setReplyText('');
      addToast('success', 'Reply posted successfully');
    }
  };

  const handleScreenRecord = () => {
    addToast('info', 'Screen recording started... (Mock functionality)');
    // In a real app, this would trigger LogRocket or a media stream API
  };

  const handleAttach = () => {
    // Mock file input click
    const input = document.createElement('input');
    input.type = 'file';
    input.onchange = () => {
      addToast('success', 'File attached successfully (Mock)');
    };
    input.click();
  };

  const getPriorityColor = (p: string) => {
    switch(p) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-blue-100 text-blue-800 border-blue-200';
    }
  };

  const getSLAHours = (priority: string) => {
    switch(priority) {
      case 'Critical': return 4;
      case 'High': return 12;
      case 'Medium': return 24;
      default: return 48;
    }
  };

  if (loading) return <div className="p-8 text-center">Loading ticket details...</div>;
  if (!ticket) return <div className="p-8 text-center">Ticket not found</div>;

  const slaHours = getSLAHours(ticket.priority);
  const createdTime = new Date(ticket.date).getTime();
  const slaTime = createdTime + slaHours * 60 * 60 * 1000;
  const now = new Date().getTime();
  const timeLeft = slaTime - now;
  const isSLAbreached = timeLeft < 0;
  const hoursLeft = Math.floor(timeLeft / (1000 * 60 * 60));

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 flex flex-col lg:flex-row gap-8 h-[calc(100vh-100px)]">
      
      {/* Main Conversation Area */}
      <div className="flex-1 flex flex-col bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
          <div>
            <Link to="/dashboard" className="text-xs text-slate-500 hover:text-orange-600 flex items-center mb-2">
              <ArrowLeft className="w-3 h-3 mr-1" /> Back to Dashboard
            </Link>
            <h1 className="text-xl font-bold text-slate-900 flex items-center">
              {ticket.subject} 
              <span className="ml-3 text-sm font-normal text-slate-400 font-mono">#{ticket.id}</span>
            </h1>
          </div>
          <div className="flex items-center gap-3">
             <div className={`px-3 py-1 rounded-full text-xs font-bold border ${getPriorityColor(ticket.priority)}`}>
               {ticket.priority}
             </div>
             <div className={`px-3 py-1 rounded-full text-xs font-bold ${ticket.status === 'Resolved' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
               {ticket.status}
             </div>
          </div>
        </div>

        {/* Messages List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-50/50">
           {/* Original Message */}
           <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                 <User className="w-5 h-5 text-slate-500" />
              </div>
              <div className="flex-1">
                 <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm">You (Original Request)</span>
                    <span className="text-xs text-slate-400">{new Date(ticket.date).toLocaleString()}</span>
                 </div>
                 <div className="bg-white border border-slate-200 p-4 rounded-r-xl rounded-bl-xl text-sm text-slate-700 shadow-sm leading-relaxed">
                    {ticket.message}
                    {ticket.attachments && ticket.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100">
                           <p className="text-xs font-bold text-slate-500 mb-2">Attachments:</p>
                           <div className="flex gap-2">
                              {ticket.attachments.map((att, i) => (
                                <div key={i} className="flex items-center bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-xs text-blue-600 cursor-pointer hover:bg-blue-50">
                                   <Paperclip className="w-3 h-3 mr-1" /> {att}
                                </div>
                              ))}
                           </div>
                        </div>
                    )}
                 </div>
              </div>
           </div>

           {/* Replies */}
           {ticket.replies && ticket.replies.map(reply => (
             <div key={reply.id} className={`flex gap-4 ${reply.sender === 'user' ? '' : 'flex-row-reverse'}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${reply.sender === 'user' ? 'bg-slate-200' : 'bg-orange-100'}`}>
                   {reply.sender === 'user' ? <User className="w-5 h-5 text-slate-500" /> : <div className="font-bold text-orange-600 text-xs">SUP</div>}
                </div>
                <div className="flex-1">
                   <div className={`flex items-baseline mb-1 ${reply.sender === 'user' ? 'justify-between' : 'justify-between flex-row-reverse'}`}>
                      <span className="font-bold text-slate-900 text-sm">{reply.senderName}</span>
                      <span className="text-xs text-slate-400">{new Date(reply.date).toLocaleString()}</span>
                   </div>
                   <div className={`p-4 text-sm text-slate-700 shadow-sm leading-relaxed ${reply.sender === 'user' ? 'bg-white border border-slate-200 rounded-r-xl rounded-bl-xl' : 'bg-orange-50 border border-orange-100 rounded-l-xl rounded-br-xl'}`}>
                      {reply.message}
                      {reply.attachments && reply.attachments.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-slate-100/50">
                           <div className="flex gap-2">
                              {reply.attachments.map((att, i) => (
                                <div key={i} className="flex items-center bg-white border border-slate-200 px-3 py-1.5 rounded text-xs text-blue-600">
                                   <Paperclip className="w-3 h-3 mr-1" /> {att}
                                </div>
                              ))}
                           </div>
                        </div>
                      )}
                   </div>
                </div>
             </div>
           ))}
           <div ref={messagesEndRef} />
        </div>

        {/* Reply Box */}
        {ticket.status !== 'Resolved' ? (
          <div className="p-4 bg-white border-t border-slate-200">
             <form onSubmit={handleReply}>
                <textarea 
                  className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                  rows={3}
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                ></textarea>
                <div className="flex justify-between items-center mt-3">
                   <div className="flex space-x-2">
                      <button type="button" onClick={handleAttach} className="flex items-center text-xs font-medium text-slate-500 hover:text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full transition-colors">
                         <Paperclip className="w-3 h-3 mr-1" /> Attach File
                      </button>
                      <button type="button" onClick={handleScreenRecord} className="flex items-center text-xs font-medium text-red-500 hover:text-red-700 bg-red-50 px-3 py-1.5 rounded-full transition-colors">
                         <Monitor className="w-3 h-3 mr-1" /> Record Screen (Bug)
                      </button>
                   </div>
                   <button type="submit" className="bg-slate-900 text-white px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-800 transition-colors flex items-center">
                      <Send className="w-4 h-4 mr-2" /> Send Reply
                   </button>
                </div>
             </form>
          </div>
        ) : (
          <div className="p-4 bg-slate-50 border-t border-slate-200 text-center">
             <p className="text-sm text-slate-500 flex items-center justify-center">
               <CheckCircle className="w-4 h-4 mr-2 text-green-500" /> This ticket has been marked as resolved.
             </p>
             <button onClick={() => { setTicket({...ticket, status: 'Open'}); DataManager.updateTicket({...ticket, status: 'Open'}); }} className="text-xs text-orange-600 underline mt-1">Reopen Ticket</button>
          </div>
        )}
      </div>

      {/* Sidebar Info */}
      <div className="w-full lg:w-80 flex flex-col gap-6">
         {/* SLA Timer */}
         <div className={`p-6 rounded-xl border ${isSLAbreached ? 'bg-red-50 border-red-200' : 'bg-white border-slate-200'} shadow-sm`}>
            <h3 className="font-bold text-slate-900 mb-2 flex items-center">
               <Activity className="w-4 h-4 mr-2" /> Response Target
            </h3>
            {ticket.status === 'Resolved' ? (
               <p className="text-sm text-green-600 font-medium">SLA Met</p>
            ) : (
               <>
                 <div className="flex items-end mb-1">
                    <span className={`text-3xl font-black ${isSLAbreached ? 'text-red-600' : 'text-slate-800'}`}>
                       {isSLAbreached ? 'Overdue' : `${hoursLeft}h`}
                    </span>
                    {!isSLAbreached && <span className="text-sm text-slate-500 ml-1 mb-1">remaining</span>}
                 </div>
                 <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                    <div className={`h-full ${isSLAbreached ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: '60%' }}></div>
                 </div>
                 <p className="text-xs text-slate-400 mt-2">Expected response within {slaHours} hours for {ticket.priority} priority.</p>
               </>
            )}
         </div>

         {/* Meta Data */}
         <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wide">Ticket Details</h3>
            <div className="space-y-4 text-sm">
               <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Department</span>
                  <span className="font-medium text-slate-800">{ticket.type}</span>
               </div>
               <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Created</span>
                  <span className="font-medium text-slate-800">{new Date(ticket.date).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between border-b border-slate-50 pb-2">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-medium text-slate-800">{new Date(ticket.lastUpdated).toLocaleDateString()}</span>
               </div>
               <div className="flex justify-between">
                  <span className="text-slate-500">Assigned To</span>
                  <span className="font-medium text-slate-800">Support Team</span>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default TicketDetail;
