
import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {  Cpu, BookOpen, LayoutDashboard, ShoppingCart, Menu, X, Search, MessageCircle, HelpCircle, Award, Book, Info, Gift, ArrowRight, ShoppingBag, Users, Instagram, Send, Cookie, Home, User, LogOut, Heart, Clock, Bell, Trash2, Check, Globe, Eye } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useNotification } from '../contexts/NotificationContext';
import { useTheme } from '../contexts/ThemeContext';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const location = useLocation();
  const navigate = useNavigate();
  const { items } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const { wishlistItems } = useWishlist();
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotification();
  const { highContrast, toggleHighContrast, fontSize, toggleFontSize } = useTheme();
  
  const [showBanner, setShowBanner] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showA11yMenu, setShowA11yMenu] = useState(false);
  const notificationRef = useRef<HTMLDivElement>(null);
  const a11yRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedHistory = localStorage.getItem('pygenicarc_search_history');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }

    // Click outside to close history and notifications
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowHistory(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
      if (a11yRef.current && !a11yRef.current.contains(event.target as Node)) {
        setShowA11yMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { name: 'Projects', path: '/', icon: <Cpu className="w-4 h-4 mr-2" aria-hidden="true" /> },
    { name: 'Viva Prep', path: '/viva', icon: <BookOpen className="w-4 h-4 mr-2" aria-hidden="true" /> },
    { name: 'Community', path: '/community', icon: <Globe className="w-4 h-4 mr-2" aria-hidden="true" /> },
    { name: 'Stories', path: '/success-stories', icon: <Award className="w-4 h-4 mr-2" aria-hidden="true" /> },
    { name: 'Blog', path: '/blog', icon: <Book className="w-4 h-4 mr-2" aria-hidden="true" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" aria-hidden="true" /> },
  ];

  const handleSearch = (e: React.FormEvent | null, query: string) => {
    if (e) e.preventDefault();
    const term = query.trim();
    if (term) {
      navigate(`/?q=${encodeURIComponent(term)}`);
      setShowHistory(false);
      setSearchQuery(term);
      
      // Update history
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 5);
      setSearchHistory(newHistory);
      localStorage.setItem('pygenicarc_search_history', JSON.stringify(newHistory));
    }
  };

  const clearHistory = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSearchHistory([]);
    localStorage.removeItem('pygenicarc_search_history');
  };

  const isActive = (path: string) => location.pathname === path ? 'text-orange-600 font-semibold bg-orange-50' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50';

  return (
    <>
    <a href="#main-content" className="skip-link">Skip to main content</a>
    
    {showBanner && (
        <div className="bg-gradient-to-r from-orange-600 to-red-600 text-white py-2 px-4 relative z-50" role="banner">
          <div className="max-w-7xl mx-auto flex justify-between items-center text-xs md:text-sm">
             <div className="flex items-center font-medium">
               <Gift className="w-4 h-4 mr-2 animate-bounce" aria-hidden="true" />
               <span className="hidden md:inline mr-1">Final Year Special: </span>
               <span>Get <span className="font-bold text-yellow-300">10% OFF</span> on bulk orders of 3+ projects!</span>
             </div>
             <div className="flex items-center gap-4">
                <Link to="/" className="underline hover:text-yellow-200 font-semibold">Shop Now</Link>
                <button onClick={() => setShowBanner(false)} className="hover:bg-white/20 rounded-full p-1" aria-label="Close banner"><X className="w-4 h-4" /></button>
             </div>
          </div>
        </div>
    )}
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center flex-1">
            <div className="flex-shrink-0 flex items-center mr-6">
              <Link to="/" className="flex items-center" aria-label="Pygenicarc Technologies Home">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2" aria-hidden="true">
                  P
                </div>
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-lg text-slate-900 tracking-tight leading-none">Pygenicarc<span className="text-orange-600">Tech</span></span>
                  <span className="text-[0.65rem] text-slate-500 font-medium tracking-wide uppercase">Innovating India</span>
                </div>
              </Link>
            </div>
            
            {/* Global Search Bar with History */}
            <div className="flex-1 max-w-lg hidden md:block relative" ref={searchRef}>
              <form onSubmit={(e) => handleSearch(e, searchQuery)} className="relative group" role="search">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" aria-hidden="true" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-full leading-5 bg-slate-50 placeholder-slate-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all shadow-sm"
                  placeholder="Search projects..."
                  aria-label="Search projects"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowHistory(true)}
                />
              </form>
              
              {/* Search History Dropdown */}
              {showHistory && searchHistory.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-slate-100 py-2 z-50 animate-fadeIn">
                  <div className="flex justify-between items-center px-4 py-1 text-xs text-slate-400 uppercase font-bold tracking-wider">
                    <span>Recent Searches</span>
                    <button onClick={clearHistory} className="hover:text-red-500" aria-label="Clear search history">Clear</button>
                  </div>
                  {searchHistory.map((term, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(null, term)}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center"
                    >
                      <Clock className="w-3 h-3 mr-2 text-slate-400" aria-hidden="true" />
                      {term}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <Link to="/about" className="hidden lg:inline-flex items-center text-sm font-medium text-slate-500 hover:text-orange-600 mr-4 transition-colors">
              <Info className="w-4 h-4 mr-1" aria-hidden="true" /> About Us
            </Link>

            {/* Accessibility Menu */}
            <div className="relative mr-4 hidden sm:block" ref={a11yRef}>
               <button 
                 onClick={() => setShowA11yMenu(!showA11yMenu)}
                 className="p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                 title="Accessibility Settings"
                 aria-label="Accessibility settings"
                 aria-expanded={showA11yMenu}
               >
                 <Eye className="w-5 h-5" />
               </button>
               {showA11yMenu && (
                 <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fadeIn p-4">
                    <h3 className="text-sm font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">Accessibility</h3>
                    <div className="space-y-3">
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">High Contrast</span>
                          <button 
                            onClick={toggleHighContrast}
                            aria-pressed={highContrast}
                            className={`w-10 h-5 rounded-full relative transition-colors ${highContrast ? 'bg-orange-600' : 'bg-slate-200'}`}
                          >
                             <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${highContrast ? 'left-6' : 'left-1'}`}></div>
                          </button>
                       </div>
                       <div className="flex items-center justify-between">
                          <span className="text-sm text-slate-600">Large Text</span>
                          <button 
                            onClick={toggleFontSize}
                            aria-pressed={fontSize === 'large'}
                            className={`w-10 h-5 rounded-full relative transition-colors ${fontSize === 'large' ? 'bg-orange-600' : 'bg-slate-200'}`}
                          >
                             <div className={`w-3 h-3 bg-white rounded-full absolute top-1 transition-transform ${fontSize === 'large' ? 'left-6' : 'left-1'}`}></div>
                          </button>
                       </div>
                    </div>
                 </div>
               )}
            </div>

            {/* Notification Bell */}
            <div className="relative mr-4 hidden sm:block" ref={notificationRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-full hover:bg-slate-100"
                aria-label={`Notifications ${unreadCount > 0 ? `, ${unreadCount} unread` : ''}`}
              >
                <Bell className="w-6 h-6" aria-hidden="true" />
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-slate-100 z-50 overflow-hidden animate-fadeIn">
                  <div className="p-3 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800 text-sm">Notifications</h3>
                    <div className="flex space-x-2">
                      <button onClick={markAllAsRead} className="text-xs text-blue-600 hover:underline" title="Mark all as read" aria-label="Mark all as read"><Check className="w-4 h-4" /></button>
                      <button onClick={clearNotifications} className="text-xs text-red-600 hover:underline" title="Clear all" aria-label="Clear all notifications"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map(notif => (
                        <div 
                          key={notif.id} 
                          onClick={() => markAsRead(notif.id)}
                          onKeyDown={(e) => e.key === 'Enter' && markAsRead(notif.id)}
                          tabIndex={0}
                          role="button"
                          className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${!notif.read ? 'bg-blue-50/50' : ''}`}
                        >
                          <div className="flex justify-between items-start mb-1">
                            <span className={`text-xs font-bold px-1.5 py-0.5 rounded uppercase ${
                              notif.type === 'order' ? 'bg-green-100 text-green-700' : 
                              notif.type === 'promotion' ? 'bg-purple-100 text-purple-700' : 
                              'bg-slate-200 text-slate-600'
                            }`}>
                              {notif.type}
                            </span>
                            <span className="text-[10px] text-slate-400">{new Date(notif.date).toLocaleDateString()}</span>
                          </div>
                          <h4 className={`text-sm font-semibold text-slate-800 ${!notif.read ? 'text-blue-700' : ''}`}>{notif.title}</h4>
                          <p className="text-xs text-slate-500 mt-1 line-clamp-2">{notif.message}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-8 text-center text-slate-400 text-sm">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                        No notifications yet
                      </div>
                    )}
                  </div>
                  <div className="p-2 border-t border-slate-100 text-center">
                    <Link to="/profile" onClick={() => setShowNotifications(false)} className="text-xs font-bold text-orange-600 hover:underline">Notification Settings</Link>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <div className="hidden sm:flex sm:items-center mr-4">
              <Link 
                to="/wishlist"
                className="relative text-slate-600 hover:text-red-500 transition-colors"
                title="Wishlist"
                aria-label={`Wishlist, ${wishlistItems.length} items`}
              >
                <Heart className="w-6 h-6" aria-hidden="true" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-white">
                    {wishlistItems.length}
                  </span>
                )}
              </Link>
            </div>

            {/* Cart Icon */}
            <div className="hidden sm:flex sm:items-center mr-4">
              <Link 
                to="/cart"
                className="relative text-slate-600 hover:text-slate-900 transition-colors"
                aria-label={`Shopping cart, ${items.length} items`}
              >
                <ShoppingCart className="w-6 h-6" aria-hidden="true" />
                {items.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-orange-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                    {items.reduce((acc, item) => acc + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>

            {/* User Auth Section */}
            <div className="hidden sm:flex items-center">
              {isAuthenticated && user ? (
                <div className="relative">
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center space-x-2 focus:outline-none"
                    aria-expanded={showUserMenu}
                    aria-label="User menu"
                  >
                    <img 
                      src={user.avatar} 
                      alt="" 
                      className="w-8 h-8 rounded-full border border-slate-200"
                    />
                    <span className="text-sm font-medium text-slate-700">{user.name.split(' ')[0]}</span>
                  </button>
                  
                  {/* Dropdown */}
                  {showUserMenu && (
                    <div 
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-slate-100 py-1 z-50 animate-fadeIn"
                      onMouseLeave={() => setShowUserMenu(false)}
                    >
                      <Link to="/profile" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Profile Settings</Link>
                      <Link to="/dashboard" className="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-50">Dashboard</Link>
                      <div className="border-t border-slate-100 my-1"></div>
                      <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50">Log Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <Link 
                  to="/login"
                  className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors shadow-md transform hover:-translate-y-0.5"
                >
                  Login
                </Link>
              )}
            </div>
            
            <div className="-mr-2 flex items-center ml-4">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
                aria-expanded={isOpen}
                aria-label="Main menu"
              >
                {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-40">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsOpen(false)}></div>
          
          {/* Menu Panel */}
          <div className="fixed inset-y-0 left-0 w-3/4 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ease-in-out overflow-y-auto">
            <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
               <span className="font-bold text-lg text-slate-900">Menu</span>
               <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-slate-200 rounded-full"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-4 border-b border-slate-100">
               <form onSubmit={(e) => { handleSearch(e, searchQuery); setIsOpen(false); }} className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-3 border border-slate-300 rounded-lg bg-slate-50 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                    placeholder="Search projects..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    aria-label="Search"
                  />
                </form>
            </div>
            <div className="py-2 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`block pl-4 pr-4 py-3 border-l-4 text-base font-medium ${
                    location.pathname === link.path
                      ? 'border-orange-500 text-orange-700 bg-orange-50'
                      : 'border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center">
                     {link.icon} <span className="ml-2">{link.name}</span>
                  </div>
                </Link>
              ))}
               <Link
                  to="/wishlist"
                  onClick={() => setIsOpen(false)}
                  className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 text-base font-medium"
               >
                  <div className="flex items-center">
                    <Heart className="w-4 h-4 mr-2" aria-hidden="true" /> Wishlist ({wishlistItems.length})
                  </div>
               </Link>
               <Link
                  to="/about"
                  onClick={() => setIsOpen(false)}
                  className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 text-base font-medium"
               >
                  <div className="flex items-center">
                    <Info className="w-4 h-4 mr-2" aria-hidden="true" /> About Us
                  </div>
               </Link>
               {!isAuthenticated && (
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="block pl-4 pr-4 py-3 border-l-4 border-transparent text-slate-600 hover:bg-slate-50 hover:border-slate-300 hover:text-slate-900 text-base font-medium"
                  >
                    <div className="flex items-center">
                      <User className="w-4 h-4 mr-2" aria-hidden="true" /> Login / Signup
                    </div>
                  </Link>
               )}
            </div>
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
  const { isAuthenticated } = useAuth();
  
  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Viva', path: '/viva', icon: BookOpen },
    { name: 'Comm', path: '/community', icon: Globe },
    { name: 'Cart', path: '/cart', icon: ShoppingCart, badge: items.length },
    { name: isAuthenticated ? 'Profile' : 'Login', path: isAuthenticated ? '/profile' : '/login', icon: User },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around items-center h-16 pb-safe z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
      {navItems.map((item) => (
        <Link 
          key={item.name} 
          to={item.path} 
          onClick={() => setIsOpen(false)}
          className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive(item.path) ? 'text-orange-600' : 'text-slate-400 hover:text-slate-600'}`}
        >
          <div className="relative">
            <item.icon className={`w-6 h-6 ${isActive(item.path) ? 'fill-current' : ''}`} aria-hidden="true" />
            {item.badge ? (
              <span className="absolute -top-1.5 -right-1.5 bg-orange-600 text-white text-[10px] font-bold px-1 py-0.5 rounded-full min-w-[16px] text-center border-2 border-white">
                {item.badge}
              </span>
            ) : null}
          </div>
          <span className="text-[10px] font-medium">{item.name}</span>
        </Link>
      ))}
    </div>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900" id="main-content">
      <Navbar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
      <div className="flex-grow pt-4 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        {children}
      </div>
      <footer className="bg-white border-t border-slate-200 py-12 mt-auto hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Pygenicarc Technologies. All rights reserved.</p>
          <div className="mt-4 space-x-4">
            <Link to="/legal?tab=privacy" className="hover:text-orange-600 transition-colors">Privacy Policy</Link>
            <Link to="/legal?tab=terms" className="hover:text-orange-600 transition-colors">Terms of Service</Link>
            <Link to="/help" className="hover:text-orange-600 transition-colors">Support Center</Link>
          </div>
        </div>
      </footer>
      <BottomNav isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />
    </div>
  );
};
