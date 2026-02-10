
import React, { useState, useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useNotification } from '../contexts/NotificationContext';
import { Trash2, Minus, Plus, ShoppingCart, Tag, ArrowRight, UploadCloud, CheckCircle, Gift, Info, Percent, AlertCircle } from 'lucide-react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Cart = () => {
  const { 
    items, removeFromCart, updateQuantity, 
    subTotal, discountTotal, finalTotal, 
    appliedCoupon, applyCoupon, removeCoupon,
    pointsBalance, pointsRedeemed, togglePoints,
    isStudentVerified, verifyStudent,
    bulkDiscountPercent
  } = useCart();
  
  const { addToast } = useNotification();
  const [couponCode, setCouponCode] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  // Student Verify Modal
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [idFile, setIdFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Auto-apply referral coupon
  useEffect(() => {
    const refCode = searchParams.get('ref');
    if (refCode && !appliedCoupon) {
       applyCoupon(refCode).then(res => {
           if (res.success) addToast('success', 'Referral discount applied!');
       });
    }
  }, [searchParams]);

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    setIsApplyingCoupon(true);
    const result = await applyCoupon(couponCode);
    setIsApplyingCoupon(false);
    if (result.success) {
        addToast('success', result.message);
        setCouponCode('');
    } else {
        addToast('error', result.message);
    }
  };

  const handleVerifyStudent = async () => {
      if (!idFile) return;
      setIsVerifying(true);
      await verifyStudent(idFile);
      setIsVerifying(false);
      setShowVerifyModal(false);
      addToast('success', 'ID Verified! 15% Student Discount Unlocked.');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingCart className="w-10 h-10 text-slate-400" aria-hidden="true" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Your Cart is Empty</h2>
        <p className="text-slate-500 mb-8 max-w-md">Looks like you haven't added any projects yet. Browse our gallery to find the perfect engineering project.</p>
        <Link to="/" className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-8 rounded-lg shadow-md transition-all">
          Browse Projects
        </Link>
      </div>
    );
  }

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
  const nextBulkTier = totalItems < 2 ? 2 : (totalItems < 3 ? 3 : 0);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">Shopping Cart</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Left Column: Items & Promos */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Bulk Discount Progress */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 p-4 rounded-xl flex items-center justify-between">
             <div className="flex items-center">
                <div className="bg-blue-100 p-2 rounded-full mr-3"><Percent className="w-5 h-5 text-blue-600" aria-hidden="true" /></div>
                <div>
                   <h3 className="font-bold text-slate-800 text-sm">Bulk Savings Unlocked!</h3>
                   <p className="text-xs text-slate-600">
                      {bulkDiscountPercent > 0 
                        ? `You are saving ${bulkDiscountPercent}% on this order.` 
                        : "Add more items to unlock discounts."}
                   </p>
                </div>
             </div>
             {nextBulkTier > 0 ? (
                 <div className="text-right">
                    <span className="text-xs font-bold text-blue-700">Add {nextBulkTier - totalItems} more for {nextBulkTier === 2 ? '5%' : '10%'} OFF</span>
                    <div className="w-24 h-1.5 bg-blue-200 rounded-full mt-1 ml-auto">
                       <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${(totalItems / 3) * 100}%` }}></div>
                    </div>
                 </div>
             ) : (
                 <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">Max Discount Active</span>
             )}
          </div>

          {/* Cart Items List */}
          <div className="space-y-4">
            {items.map((item) => (
              <div key={`${item.projectId}-${item.packageType}`} className="flex flex-col sm:flex-row items-center bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                <img src={item.imageUrl} alt={item.title} loading="lazy" className="w-full sm:w-24 h-24 object-cover rounded-lg mb-4 sm:mb-0 sm:mr-6" />
                
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                  <span className="inline-block px-2 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded mt-1">{item.packageType}</span>
                  <p className="text-orange-600 font-bold mt-2">₹{item.price}</p>
                </div>

                <div className="flex items-center mt-4 sm:mt-0 space-x-6">
                  <div className="flex items-center border border-slate-300 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.projectId, item.packageType, -1)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-l-lg"
                      disabled={item.quantity <= 1}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3 h-3" aria-hidden="true" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-slate-900">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.projectId, item.packageType, 1)}
                      className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-r-lg"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3 h-3" aria-hidden="true" />
                    </button>
                  </div>
                  
                  <button 
                    onClick={() => removeFromCart(item.projectId, item.packageType)}
                    className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    title="Remove Item"
                    aria-label={`Remove ${item.title} from cart`}
                  >
                    <Trash2 className="w-5 h-5" aria-hidden="true" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Student Discount Section */}
          {!isStudentVerified && (
             <div className="bg-white border border-slate-200 p-6 rounded-xl flex flex-col md:flex-row items-center justify-between shadow-sm">
                <div className="flex items-center mb-4 md:mb-0">
                   <div className="bg-purple-100 p-3 rounded-full mr-4"><UploadCloud className="w-6 h-6 text-purple-600" aria-hidden="true" /></div>
                   <div>
                      <h3 className="font-bold text-slate-900">Student? Get 15% Off</h3>
                      <p className="text-sm text-slate-500">Upload your valid college ID to unlock instant discount.</p>
                   </div>
                </div>
                <button onClick={() => setShowVerifyModal(true)} className="px-6 py-2 bg-purple-600 text-white rounded-lg font-bold text-sm hover:bg-purple-700 transition-colors shadow-md">
                   Verify Now
                </button>
             </div>
          )}
        </div>

        {/* Right Column: Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-slate-900 mb-6">Order Summary</h2>
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-slate-600 text-sm">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(0)}</span>
              </div>
              
              {bulkDiscountPercent > 0 && (
                  <div className="flex justify-between text-blue-600 text-sm">
                    <span>Bulk Discount ({bulkDiscountPercent}%)</span>
                    <span>- ₹{((subTotal * bulkDiscountPercent)/100).toFixed(0)}</span>
                  </div>
              )}

              {appliedCoupon && (
                  <div className="flex justify-between text-green-600 text-sm bg-green-50 p-2 rounded-lg items-center">
                    <span className="flex items-center"><Tag className="w-3 h-3 mr-1" aria-hidden="true" /> {appliedCoupon.code}</span>
                    <div className="flex items-center">
                        <span className="mr-2">- ₹{appliedCoupon.type === 'percent' ? ((subTotal * appliedCoupon.value)/100).toFixed(0) : appliedCoupon.value}</span>
                        <button onClick={removeCoupon} className="text-green-800 hover:text-green-900" aria-label="Remove coupon"><Trash2 className="w-3 h-3" aria-hidden="true" /></button>
                    </div>
                  </div>
              )}

              {pointsRedeemed > 0 && (
                  <div className="flex justify-between text-orange-600 text-sm">
                    <span>Loyalty Points</span>
                    <span>- ₹{pointsRedeemed}</span>
                  </div>
              )}

              <div className="border-t border-slate-100 pt-4 flex justify-between font-bold text-xl text-slate-900">
                <span>Total</span>
                <span>₹{finalTotal.toFixed(0)}</span>
              </div>
            </div>

            {/* Loyalty Points Redemption */}
            {pointsBalance > 0 && (
               <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-100">
                  <div className="flex items-center justify-between mb-2">
                     <span className="text-sm font-bold text-orange-800 flex items-center"><Gift className="w-4 h-4 mr-1" aria-hidden="true" /> Use Points</span>
                     <span className="text-xs font-medium text-orange-600">Bal: {pointsBalance}</span>
                  </div>
                  <label className="flex items-center cursor-pointer">
                     <input 
                        type="checkbox" 
                        className="sr-only peer"
                        checked={pointsRedeemed > 0}
                        onChange={(e) => togglePoints(e.target.checked)}
                        aria-label="Redeem available points"
                     />
                     <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600 relative mr-2"></div>
                     <span className="text-xs text-slate-600">Redeem available points</span>
                  </label>
               </div>
            )}

            {/* Coupon Code Input */}
            <div className="mb-6">
              <label htmlFor="coupon-code" className="block text-xs font-semibold text-slate-500 uppercase mb-2">Gift Card / Promo Code</label>
              <div className="flex space-x-2">
                <input 
                  id="coupon-code"
                  type="text" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  className="block w-full px-3 py-2 border border-slate-300 rounded-lg text-sm placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-orange-500" 
                  placeholder="Enter Code" 
                />
                <button 
                  onClick={handleApplyCoupon}
                  disabled={isApplyingCoupon || !couponCode}
                  className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-50"
                >
                  Apply
                </button>
              </div>
            </div>

            <button 
              onClick={() => navigate('/checkout', { state: { total: finalTotal } })}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-lg shadow-md transition-all flex justify-center items-center group"
            >
              Proceed to Checkout <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      {/* Verify Student Modal */}
      {showVerifyModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="verify-student-title">
              <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
                  <div className="text-center mb-6">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <UploadCloud className="w-8 h-8 text-purple-600" aria-hidden="true" />
                      </div>
                      <h3 id="verify-student-title" className="text-xl font-bold text-slate-900">Verify Student ID</h3>
                      <p className="text-sm text-slate-500 mt-1">Upload your ID card to unlock 15% off.</p>
                  </div>
                  
                  <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 text-center cursor-pointer hover:bg-slate-50 transition-colors relative mb-6">
                      <input type="file" accept="image/*" onChange={(e) => setIdFile(e.target.files?.[0] || null)} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Upload ID Card" />
                      {idFile ? (
                          <div className="flex flex-col items-center text-green-600">
                              <CheckCircle className="w-8 h-8 mb-2" aria-hidden="true" />
                              <span className="font-medium text-sm">{idFile.name}</span>
                          </div>
                      ) : (
                          <div className="text-slate-400">
                              <p className="text-sm font-medium">Click to upload image</p>
                              <p className="text-xs">JPG, PNG up to 5MB</p>
                          </div>
                      )}
                  </div>

                  <div className="flex gap-3">
                      <button onClick={() => setShowVerifyModal(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                      <button 
                          onClick={handleVerifyStudent} 
                          disabled={!idFile || isVerifying}
                          className="flex-1 py-2 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 disabled:opacity-70"
                      >
                          {isVerifying ? 'Verifying...' : 'Submit & Save'}
                      </button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default Cart;
