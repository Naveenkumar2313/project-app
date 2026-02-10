
import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Robot } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'bot' | 'user';
}

const FAQ_KNOWLEDGE_BASE: Record<string, string> = {
  'hello': 'Hi there! How can I help you today? You can ask about shipping, returns, or technical issues.',
  'shipping': 'We usually ship orders within 24-48 hours. Delivery takes 3-7 business days depending on your location.',
  'return': 'We accept returns for defective hardware within 7 days of delivery. Digital products are non-refundable.',
  'refund': 'Refunds are processed within 5-7 business days after the returned item is verified.',
  'contact': 'You can reach our support team via the ticket system or email us at support@pygenic.com.',
  'track': 'You can track your order in the Dashboard under "My Orders".',
  'default': 'I am not sure I understand. Could you please rephrase or create a support ticket for human assistance?'
};

export const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hello! I'm your AI assistant. Ask me anything about your projects or orders.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMsg: Message = { id: Date.now(), text: input, sender: 'user' };
    setMessages(prev => [...prev, userMsg]);
    setInput('');

    // Simple keyword matching for bot response
    const lowerInput = input.toLowerCase();
    let responseText = FAQ_KNOWLEDGE_BASE['default'];

    for (const key in FAQ_KNOWLEDGE_BASE) {
      if (lowerInput.includes(key)) {
        responseText = FAQ_KNOWLEDGE_BASE[key];
        break;
      }
    }

    setTimeout(() => {
      const botMsg: Message = { id: Date.now() + 1, text: responseText, sender: 'bot' };
      setMessages(prev => [...prev, botMsg]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="fixed bottom-6 right-6 z-[60] flex flex-col items-end">
      {isOpen && (
        <div className="bg-white w-80 h-96 rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden mb-4 animate-fadeIn" role="dialog" aria-label="Chat support">
          <div className="bg-slate-900 p-4 text-white flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 p-1.5 rounded-full">
                <MessageSquare className="w-4 h-4" aria-hidden="true" />
              </div>
              <span className="font-bold text-sm">Support Assistant</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:text-slate-300" aria-label="Close chat">
              <X className="w-5 h-5" aria-hidden="true" />
            </button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50 space-y-3">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl px-4 py-2 text-sm ${msg.sender === 'user' ? 'bg-orange-600 text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-700 rounded-bl-none shadow-sm'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t border-slate-100 bg-white flex gap-2">
            <input 
              className="flex-1 border border-slate-300 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              aria-label="Chat message"
            />
            <button onClick={handleSend} className="bg-slate-900 text-white p-2 rounded-full hover:bg-slate-800 transition-colors" aria-label="Send message">
              <Send className="w-4 h-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      )}

      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="bg-slate-900 hover:bg-slate-800 text-white p-4 rounded-full shadow-lg transition-transform hover:scale-105 flex items-center justify-center group"
        aria-label={isOpen ? "Close chat support" : "Open chat support"}
      >
        {isOpen ? <X className="w-6 h-6" aria-hidden="true" /> : <MessageSquare className="w-6 h-6 group-hover:animate-pulse" aria-hidden="true" />}
      </button>
    </div>
  );
};
