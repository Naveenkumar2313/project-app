
import React, { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Trash2, Minus, Plus, ShoppingCart, Tag, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const Cart = () => {
  const { items, removeFromCart, updateQuantity, totalAmount } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [discountPercent, setDiscountPercent] = useState(0);
  const [couponMessage, setCouponMessage] = useState('');
  const navigate = useNavigate();

  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === 'PYGENIC10') {
      setDiscountPercent(10);
      setCouponMessage('Coupon Applied! You saved 10%.');
    } else {
      setDiscountPercent(0);
      setCouponMessage('Invalid Coupon Code.');
    }
  };

  const discountAmount = (totalAmount * discountPercent) / 100;
  const finalTotal = totalAmount - discountAmount;

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-400" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any projects yet. Browse our gallery to find the perfect engineering project.</p>
        <Link to="/" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Browse Projects
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => (
            <div key={`${item.projectId}-${item.packageType}`} className="flex flex-col sm:flex-row items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
              <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full sm:w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded mt-1">{item.packageType}</span>
                <p className="text-orange-600 font-bold mt-2">₹{item.price}</p>
              </div>

              <div className="flex items-center mt-4 sm:mt-0 space-x-6">
                <div className="flex items-center border border-slate-300 rounded-lg">
                  <button 
                    onClick={() => updateQuantity(item.projectId, item.packageType, -1)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-l-lg"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                  <button 
                    onClick={() => updateQuantity(item.projectId, item.packageType, 1)}
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-r-lg"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
                
                <button 
                  onClick={() => removeFromCart(item.projectId, item.packageType)}
                  className="p-2 text-red-400 hover:text-red-600 transition-colors"
                  title="Remove Item"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal</span>
                <span>₹{totalAmount}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Discount {discountPercent > 0 && `(${discountPercent}%)`}</span>
                <span>- ₹{discountAmount.toFixed(0)}</span>
              </div>
              <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-xl text-slate-900">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Coupon Code */}
            <div className="mb-6">
              <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Coupon Code</label>
              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-4 w-4 text-slate-400" />
                  </div>
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500" 
                    placeholder="Try PYGENIC10" 
                  />
                </div>
                <button 
                  onClick={handleApplyCoupon}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                >
                  Apply
                </button>
              </div>
              {couponMessage && (
                <p className={`text-xs mt-2 ${discountPercent > 0 ? 'text-green-600' : 'text-red-500'}`}>
                  {couponMessage}
                </p>
              )}
            </div>

            <button 
              onClick={() => navigate('/checkout', { state: { total: finalTotal } })}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center group"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
