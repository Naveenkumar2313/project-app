
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {  Cpu, BookOpen, LayoutDashboard, ShoppingCart, Menu, X, Search, MessageCircle, HelpCircle, Award, Book, Info, Gift, ArrowRight, ShoppingBag, Users, Instagram, Send, Cookie, Home } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const [showBanner, setShowBanner] = useState(true);

  const navLinks = [
    { name: 'Projects', path: '/', icon: <Cpu className="w-4 h-4 mr-2" /> },
    { name: 'Viva Prep', path: '/viva', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Stories', path: '/success-stories', icon: <Award className="w-4 h-4 mr-2" /> },
    { name: 'Blog', path: '/blog', icon: <Book className="w-4 h-4 mr-2" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  const isActive = (path: string) => location.pathname === path ? 'text-orange-600 font-semibold bg-orange-50' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50';

  return (
    <>
    {showBanner && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 relative z-50">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs md:text-sm">
             <div className="flex items-center font-medium">
               <Gift className="w-4 h-4 mr-2 animate-bounce" />
               <span className="hidden md:inline mr-1">Final Year Special: </span>
               <span>Get <span className="font-bold text-yellow-300">10% OFF</span> on bulk orders of 3+ projects!</span>
             </div>
             <div className="flex items-center gap-4">
                <Link to="/" className="underline hover:text-yellow-200 font-semibold">Shop Now</Link>
                <button onClick={() => setShowBanner(false)} className="hover:bg-white/20 rounded-full p-1"><X className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
    )}
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 flex items-center mr-6">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
                  P
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">Pygenicarc<span className="text-orange-600">Tech</span></span>
                  <span className="text-[0.65rem] text-slate-500 font-medium tracking-wide uppercase">Innovating India</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Navigation Links */}
            <div className="hidden xl:flex items-center space-x-1 mr-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.path)}`}
                >
                  {link.icon}
                  {link.name}
                </Link>
              ))}
            </div>

             {/* Tablet/Laptop Compact Navigation (hides some links if needed, or keeps them if space allows) */}
             <div className="hidden lg:flex xl:hidden items-center space-x-1 mr-6">
              {navLinks.slice(0, 3).map((link) => (
                 <Link key={link.name} to={link.path} className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${isActive(link.path)}`}>
                   {link.icon} {link.name}
                 </Link>
              ))}
             </div>

            {/* Global Search Bar */}
            <div className="flex-1 max-w-lg hidden md:block">
              <form onSubmit={handleSearch} className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all shadow-sm"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          <div className="flex items-center">
            <Link to="/about" className="hidden lg:inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mr-4 transition-colors">
              <Info className="w-4 h-4 mr-1" /> About Us
            </Link>

            {/* Make in India Badge */}
            <div className="hidden xl:flex items-center mr-6 px-2 py-1 bg-orange-50 border border-orange-100 rounded-full">
              <span className="text-[10px] font-bold text-orange-700 flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-1.5 animate-pulse"></span>
                Make in India 🇮🇳
              </span>
            </div>

            <div className="hidden sm:flex sm:items-center">
              <Link 
                to="/cart"
                className="relative bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center shadow-md"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Cart 
                {items.length > 0 && (
                  <span className="ml-2 bg-orange-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
            
            <div className="-mr-2 flex items-center lg:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
              >
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="lg:hidden bg-white border-t border-slate-100">
          <div className="p-4 border-b border-slate-100">
             <form onSubmit={handleSearch} className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-1 focus:ring-orange-500"
                  placeholder="Search projects..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
          </div>
          <div className="pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`block pl-3 pr-4 py-2 border-l-4 text-base font-medium ${
                  location.pathname === link.path
                    ? 'border-orange-500 text-orange-700 bg-orange-50'
                    : 'border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700'
                }`}
              >
                <div className="flex items-center">
                   {link.icon} {link.name}
                </div>
              </Link>
            ))}
             <Link
                to="/about"
                onClick={() => setIsOpen(false)}
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 text-base font-medium"
             >
                <div className="flex items-center">
                  <Info className="w-4 h-4 mr-2" /> About Us
                </div>
             </Link>
            <Link
               to="/cart"
               onClick={() => setIsOpen(false)}
               className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 text-base font-medium"
            >
               <div className="flex items-center">
                 <ShoppingCart className="w-4 h-4 mr-2" /> Cart ({items.length})
               </div>
            </Link>
            <Link
               to="/help"
               onClick={() => setIsOpen(false)}
               className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-slate-500 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-700 text-base font-medium"
            >
               <div className="flex items-center">
                 <HelpCircle className="w-4 h-4 mr-2" /> Help Center
               </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
    </>
  );
};

const BottomNav: React.FC<{ isOpen: boolean, setIsOpen: (v: boolean) => void }> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  const { items } = useCart();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Viva', path: '/viva', icon: BookOpen },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: items.length },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-50 shadow-[0_-1px_10px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link 
          key={item.name} 
          to={item.path} 
          onClick={() => setIsOpen(false)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(item.path) ? 'text-orange-600' : 'text-slate-400'}`}
        >
          <div className="relative">
            <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'stroke-[2.5px]' : 'stroke-2'}`} />
            {item.badge && item.badge > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-white">
                {item.badge}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium">{item.name}</span>
        </Link>
      ))}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isOpen ? 'text-orange-600' : 'text-slate-400'}`}
      >
        <Menu className={`w-6 h-6 ${isOpen ? 'stroke-[2.5px]' : 'stroke-2'}`} />
        <span className="text-[10px] font-medium">Menu</span>
      </button>
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<{name: string, location: string, project: string} | null>(null);
  const [showCookieConsent, setShowCookieConsent] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    // Check for cookie consent
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
        setShowCookieConsent(true);
    }

    // Mock Sales Data for Live Notifications
    const cities = ['Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Hyderabad', 'Pune', 'Kolkata', 'Ahmedabad', 'Jaipur'];
    const names = ['Amit', 'Priya', 'Rahul', 'Sneha', 'Vikram', 'Anjali', 'Rohan', 'Kavya', 'Deepak', 'Meera'];
    const projects = ['IoT Smart Agriculture', 'Face Recognition System', 'Robotic Arm', 'Solar Tracker', '5G Traffic System', 'Voting App'];

    const showNotification = () => {
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomProject = projects[Math.floor(Math.random() * projects.length)];
      
      setNotification({ name: randomName, location: randomCity, project: randomProject });
      
      setTimeout(() => setNotification(null), 5000); // Hide after 5s
    };

    // Initial delay then recurring interval
    const initialTimeout = setTimeout(showNotification, 5000);
    const interval = setInterval(showNotification, 20000); // Show every 20s

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, []);

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/919876543210?text=I%20need%20help%20with%20my%20project', '_blank');
  };

  const acceptCookies = () => {
    localStorage.setItem('cookie_consent', 'true');
    setShowCookieConsent(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 md:pb-8">
        {children}
      </main>
      
      {/* Real-time Order Notification Toast */}
      {notification && (
        <div className="fixed bottom-24 left-6 z-40 bg-white border-l-4 border-green-500 shadow-xl rounded-r-lg p-4 animate-slideIn max-w-sm transform transition-all duration-500 hidden md:block">
           <div className="flex items-start">
              <div className="bg-green-100 p-2 rounded-full mr-3 flex-shrink-0">
                 <ShoppingBag className="w-5 h-5 text-green-600" />
              </div>
              <div>
                 <p className="text-sm text-slate-800 font-medium leading-snug">
                   <span className="font-bold">{notification.name}</span> from {notification.location}
                 </p>
                 <p className="text-xs text-slate-500 mt-0.5">just ordered <span className="font-semibold text-orange-600">{notification.project}</span></p>
                 <p className="text-[10px] text-slate-400 mt-1 flex items-center"><span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span> Just now</p>
              </div>
           </div>
        </div>
      )}

      {/* Floating WhatsApp Live Chat Button */}
      <div className="fixed bottom-24 right-6 md:bottom-6 md:right-6 z-40">
        <button 
          onClick={handleWhatsAppClick}
          className="bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center"
          title="Chat on WhatsApp"
        >
          <MessageCircle className="w-8 h-8" />
        </button>
      </div>
      
      {/* Cookie Consent Banner */}
      {showCookieConsent && (
        <div className="fixed bottom-16 md:bottom-0 inset-x-0 z-[60] bg-slate-900 text-white p-4 shadow-2xl animate-slideUp">
           <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center">
                 <Cookie className="w-6 h-6 text-orange-400 mr-3 flex-shrink-0" />
                 <p className="text-sm text-slate-300">
                    We use cookies to improve your experience and analyze traffic. By using our site, you agree to our <Link to="/legal?tab=privacy" className="text-white underline hover:text-orange-300">Privacy Policy</Link>.
                 </p>
              </div>
              <div className="flex space-x-3">
                 <button onClick={() => setShowCookieConsent(false)} className="px-4 py-2 text-sm text-slate-400 hover:text-white">Decline</button>
                 <button onClick={acceptCookies} className="px-6 py-2 bg-orange-600 hover:bg-orange-700 rounded text-sm font-bold shadow-md transition-colors">Accept</button>
              </div>
           </div>
        </div>
      )}

      <BottomNav isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />

      <footer className="bg-white border-t border-slate-200 mt-auto mb-16 md:mb-0">
        <div className="max-w-7xl mx-auto py-10 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div className="md:col-span-1">
              <span className="font-bold text-lg text-slate-900 tracking-tight leading-none block mb-4">Pygenicarc<span className="text-orange-600">Tech</span></span>
              <p className="text-sm text-slate-500 mb-4">
                Empowering engineering students with premium projects, kits, and mentorship since 2020.
              </p>
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-xs font-bold text-orange-600 bg-orange-50 px-2 py-1 rounded border border-orange-100">Made in India 🇮🇳</span>
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-slate-900 mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/success-stories" className="hover:text-orange-600">Success Stories</Link></li>
                <li><Link to="/blog" className="hover:text-orange-600">Blog & Tutorials</Link></li>
                <li><Link to="/viva" className="hover:text-orange-600">Viva Prep Tool</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/legal?tab=terms" className="hover:text-orange-600">Terms & Conditions</Link></li>
                <li><Link to="/legal?tab=privacy" className="hover:text-orange-600">Privacy Policy</Link></li>
                <li><Link to="/legal?tab=refund" className="hover:text-orange-600">Return & Refund Policy</Link></li>
                <li><Link to="/legal?tab=academic" className="hover:text-orange-600">Academic Integrity</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-slate-900 mb-4">Join Community</h4>
              <ul className="space-y-3 text-sm text-slate-500">
                <li>
                  <a href="#" className="flex items-center hover:text-green-600 group">
                    <MessageCircle className="w-4 h-4 mr-2 text-green-500 group-hover:scale-110 transition-transform" /> 
                    WhatsApp Group
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-blue-500 group">
                    <Send className="w-4 h-4 mr-2 text-blue-400 group-hover:scale-110 transition-transform" /> 
                    Telegram Channel
                  </a>
                </li>
                <li>
                  <a href="#" className="flex items-center hover:text-pink-600 group">
                    <Instagram className="w-4 h-4 mr-2 text-pink-500 group-hover:scale-110 transition-transform" /> 
                    Follow on Instagram
                  </a>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-200 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-center text-sm text-slate-500">
              © 2024 Pygenicarc Technologies. All rights reserved.
            </p>
            <div className="flex space-x-4 text-slate-400">
               {/* Social Icons Placeholder */}
               <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center hover:bg-slate-200 cursor-pointer"><Users className="w-4 h-4" /></div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
