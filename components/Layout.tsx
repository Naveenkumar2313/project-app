import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {  Cpu, BookOpen, LayoutDashboard, ShoppingCart, Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Projects', path: '/', icon: <Cpu className="w-4 h-4 mr-2" /> },
    { name: 'Viva Prep', path: '/viva', icon: <BookOpen className="w-4 h-4 mr-2" /> },
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard className="w-4 h-4 mr-2" /> },
  ];

  const isActive = (path: string) => location.pathname === path ? 'text-orange-600 font-semibold bg-orange-50' : 'text-slate-600 hover:text-orange-600 hover:bg-slate-50';

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-md flex items-center justify-center text-white font-bold text-lg mr-2">
                  T
                </div>
                <span className="font-bold text-xl text-slate-900 tracking-tight">Techno<span className="text-orange-600">Scholars</span></span>
              </Link>
            </div>
            <div className="hidden sm:ml-8 sm:flex sm:space-x-8">
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
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            <button className="bg-slate-900 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-slate-800 transition-colors flex items-center">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Cart (0)
            </button>
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none"
            >
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="sm:hidden bg-white border-t border-slate-100">
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
          </div>
        </div>
      )}
    </nav>
  );
};

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <footer className="bg-white border-t border-slate-200 mt-auto">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-slate-500">
            © 2024 TechnoScholars. Built for Engineering Excellence. Made in India 🇮🇳
          </p>
        </div>
      </footer>
    </div>
  );
};
