
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlistItems: string[]; // Stores project IDs
  addToWishlist: (projectId: string) => void;
  removeFromWishlist: (projectId: string) => void;
  toggleWishlist: (projectId: string) => void;
  isInWishlist: (projectId: string) => boolean;
  clearWishlist: () => void;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  // Load from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('pygenicarc_wishlist');
    if (stored) {
      setWishlistItems(JSON.parse(stored));
    }
  }, []);

  // Update localStorage whenever items change
  useEffect(() => {
    localStorage.setItem('pygenicarc_wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const addToWishlist = (projectId: string) => {
    setWishlistItems((prev) => {
      if (!prev.includes(projectId)) {
        return [...prev, projectId];
      }
      return prev;
    });
  };

  const removeFromWishlist = (projectId: string) => {
    setWishlistItems((prev) => prev.filter((id) => id !== projectId));
  };

  const toggleWishlist = (projectId: string) => {
    if (wishlistItems.includes(projectId)) {
      removeFromWishlist(projectId);
    } else {
      addToWishlist(projectId);
    }
  };

  const isInWishlist = (projectId: string) => {
    return wishlistItems.includes(projectId);
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isInWishlist, clearWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
