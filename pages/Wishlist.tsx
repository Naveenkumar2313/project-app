
import React from 'react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { PROJECTS } from '../services/mockData';
import { PackageType } from '../types';
import { Link } from 'react-router-dom';
import { Heart, Trash2, ShoppingCart, ArrowRight, Eye, Star } from 'lucide-react';

const Wishlist = () => {
  const { wishlistItems, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  // Filter projects that are in the wishlist
  const savedProjects = PROJECTS.filter(p => wishlistItems.includes(p.id));

  const handleMoveToCart = (project: typeof PROJECTS[0]) => {
    addToCart({
      projectId: project.id,
      title: project.title,
      packageType: PackageType.DIGITAL, // Default to Digital, user can change later or we prompt
      price: project.priceDigital,
      imageUrl: project.imageUrl,
      quantity: 1
    });
    removeFromWishlist(project.id);
  };

  if (savedProjects.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center animate-fadeIn">
        <div className="w-32 h-32 bg-red-50 rounded-full flex items-center justify-center mb-6 animate-pop">
          <Heart className="w-16 h-16 text-red-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Wishlist is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Save projects you're interested in to view them later. Start exploring our collection!</p>
        <Link to="/" className="bg-slate-900 hover:bg-slate-800 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all transform hover:-translate-y-1">
          Explore Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex items-center justify-between mb-8 animate-slideUp">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center">
          <Heart className="w-8 h-8 text-red-500 fill-current mr-3" /> 
          Saved Projects 
          <span className="ml-3 text-lg font-normal text-slate-500 bg-slate-100 px-3 py-1 rounded-full">{savedProjects.length}</span>
        </h1>
        <Link to="/" className="text-orange-600 font-semibold hover:underline flex items-center">
          Continue Shopping <ArrowRight className="w-4 h-4 ml-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fadeIn">
        {savedProjects.map((project) => (
          <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden group flex flex-col">
            <div className="relative h-48 bg-slate-100 overflow-hidden">
                <img src={project.imageUrl} alt={project.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <button onClick={() => removeFromWishlist(project.id)} className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur rounded-full text-red-500 hover:bg-red-50 transition-colors shadow-sm" title="Remove">
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>
            <div className="p-5 flex-1 flex flex-col">
                <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{project.title}</h3>
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">{project.description}</p>
                
                <div className="flex items-center gap-2 mb-4">
                    <span className="text-xs font-bold bg-slate-100 px-2 py-1 rounded text-slate-600">{project.department}</span>
                    <div className="flex items-center text-xs text-yellow-500 font-bold">
                        <Star className="w-3 h-3 fill-current mr-1" /> {project.rating}
                    </div>
                </div>

                <div className="mt-auto flex gap-3 pt-4 border-t border-slate-100">
                    <Link to={`/project/${project.id}`} className="flex-1 py-2 text-center text-sm font-medium text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
                        View Details
                    </Link>
                    <button onClick={() => handleMoveToCart(project)} className="flex-1 py-2 bg-slate-900 text-white rounded-lg text-sm font-medium hover:bg-slate-800 flex items-center justify-center">
                        <ShoppingCart className="w-4 h-4 mr-2" /> Add to Cart
                    </button>
                </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
