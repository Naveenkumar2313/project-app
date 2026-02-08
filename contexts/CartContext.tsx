import React, { createContext, useContext, useState, ReactNode } from 'react';
import { PackageType } from '../types';

export interface CartItem {
  projectId: string;
  title: string;
  packageType: PackageType;
  price: number;
  imageUrl: string;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (projectId: string, packageType: PackageType) => void;
  updateQuantity: (projectId: string, packageType: PackageType, delta: number) => void;
  clearCart: () => void;
  totalAmount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: CartItem) => {
    setItems((prev) => {
      const existingItem = prev.find(
        (item) => item.projectId === newItem.projectId && item.packageType === newItem.packageType
      );

      if (existingItem) {
        return prev.map((item) =>
          item.projectId === newItem.projectId && item.packageType === newItem.packageType
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      }
      return [...prev, newItem];
    });
  };

  const removeFromCart = (projectId: string, packageType: PackageType) => {
    setItems((prev) => prev.filter((item) => !(item.projectId === projectId && item.packageType === packageType)));
  };

  const updateQuantity = (projectId: string, packageType: PackageType, delta: number) => {
    setItems((prev) => 
      prev.map((item) => {
        if (item.projectId === projectId && item.packageType === packageType) {
          const newQuantity = Math.max(1, item.quantity + delta);
          return { ...item, quantity: newQuantity };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, totalAmount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};