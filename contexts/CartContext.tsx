
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { PackageType, Coupon } from '../types';
import { VALID_COUPONS } from '../services/mockData';
import { useAuth } from './AuthContext';

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
  
  // Pricing Calculations
  subTotal: number;
  discountTotal: number;
  finalTotal: number;
  
  // Promotions
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => Promise<{success: boolean, message: string}>;
  removeCoupon: () => void;
  
  // Loyalty
  pointsBalance: number;
  pointsRedeemed: number;
  togglePoints: (use: boolean) => void;
  
  // Student Verification
  isStudentVerified: boolean;
  verifyStudent: (file: File) => Promise<void>;
  
  // Dynamic info
  bulkDiscountPercent: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const { user, updateProfile } = useAuth();
  
  // Promotion States
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [pointsRedeemed, setPointsRedeemed] = useState(0);
  const [isStudentVerified, setIsStudentVerified] = useState(false);

  // Sync verification status with user profile
  useEffect(() => {
    if (user?.isStudentVerified) {
      setIsStudentVerified(true);
    }
  }, [user]);

  // Derived Totals
  const subTotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  // Bulk Discount Logic: 5% off for 2 items, 10% off for 3+ items
  let bulkDiscountPercent = 0;
  if (totalItems >= 3) bulkDiscountPercent = 10;
  else if (totalItems === 2) bulkDiscountPercent = 5;
  
  const bulkDiscountAmount = (subTotal * bulkDiscountPercent) / 100;

  // Coupon Logic
  let couponDiscountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      couponDiscountAmount = (subTotal * appliedCoupon.value) / 100;
    } else {
      couponDiscountAmount = appliedCoupon.value;
    }
  }

  // Student Discount Logic (Auto-applies if verified and better than current coupon)
  // Note: Usually student discount is a specific coupon. We'll treat verification as enabling a special coupon.
  useEffect(() => {
    if (isStudentVerified && !appliedCoupon) {
       const studentCoupon = VALID_COUPONS.find(c => c.code === 'STUDENT15');
       if (studentCoupon) setAppliedCoupon(studentCoupon);
    }
  }, [isStudentVerified, appliedCoupon]);

  // Points Logic (1 point = ₹1)
  // Points are applied after other discounts
  const payableBeforePoints = Math.max(0, subTotal - bulkDiscountAmount - couponDiscountAmount);
  
  // Ensure points don't exceed payable amount
  const actualPointsRedeemed = Math.min(pointsRedeemed, payableBeforePoints);
  
  const discountTotal = bulkDiscountAmount + couponDiscountAmount + actualPointsRedeemed;
  const finalTotal = Math.max(0, subTotal - discountTotal);

  // Actions
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
    setAppliedCoupon(null);
    setPointsRedeemed(0);
  };

  const applyCoupon = async (code: string): Promise<{success: boolean, message: string}> => {
    // Simulate API check
    await new Promise(r => setTimeout(r, 500));
    
    const coupon = VALID_COUPONS.find(c => c.code === code.toUpperCase());
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code.' };
    }
    
    if (subTotal < coupon.minOrder) {
      return { success: false, message: `Minimum order of ₹${coupon.minOrder} required.` };
    }

    setAppliedCoupon(coupon);
    return { success: true, message: `Coupon '${coupon.code}' applied!` };
  };

  const removeCoupon = () => setAppliedCoupon(null);

  const togglePoints = (use: boolean) => {
    if (use && user?.points) {
      setPointsRedeemed(user.points); // Logic above clamps this to max needed
    } else {
      setPointsRedeemed(0);
    }
  };

  const verifyStudent = async (file: File): Promise<void> => {
    // Mock verification delay
    await new Promise(r => setTimeout(r, 2000));
    setIsStudentVerified(true);
    if (user) {
        updateProfile({ isStudentVerified: true });
    }
  };

  return (
    <CartContext.Provider value={{ 
        items, addToCart, removeFromCart, updateQuantity, clearCart, 
        subTotal, discountTotal, finalTotal,
        appliedCoupon, applyCoupon, removeCoupon,
        pointsBalance: user?.points || 0, pointsRedeemed: actualPointsRedeemed, togglePoints,
        isStudentVerified, verifyStudent,
        bulkDiscountPercent
    }}>
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
