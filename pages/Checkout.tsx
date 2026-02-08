import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { Loader2, CreditCard, ShieldCheck, MapPin, Smartphone } from 'lucide-react';

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const totalAmount = state?.total || 0;
  
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: ''
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Simulate Payment Gateway Delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock Success
    clearCart();
    setLoading(false);
    
    // Random Order ID
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    navigate('/order-confirmation', { state: { orderId, amount: totalAmount } });
  };

  return (
    <div className="max-w-6xl mx-auto">
       <div className="flex items-center justify-center mb-8">
         <div className="flex items-center text-orange-600 font-semibold">
           <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center mr-2">1</div>
           Cart
         </div>
         <div className="w-16 h-1 bg-orange-200 mx-2"></div>
         <div className="flex items-center text-orange-600 font-semibold">
           <div className="w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center mr-2">2</div>
           Checkout
         </div>
         <div className="w-16 h-1 bg-slate-200 mx-2"></div>
         <div className="flex items-center text-slate-400 font-semibold">
           <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center mr-2">3</div>
           Confirm
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-8">
               
               {/* Shipping Address */}
               <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-orange-500" /> Shipping Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">First Name *</label>
                      <input required name="firstName" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Last Name *</label>
                      <input required name="lastName" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Email Address *</label>
                      <input required type="email" name="email" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Phone Number *</label>
                      <input required type="tel" name="phone" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-slate-700 mb-1">Street Address *</label>
                      <input required name="address" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                      <input required name="city" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">State *</label>
                         <input required name="state" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                       </div>
                       <div>
                         <label className="block text-sm font-medium text-slate-700 mb-1">Pincode *</label>
                         <input required name="zip" onChange={handleInputChange} className="w-full border border-slate-300 rounded-lg p-2.5 focus:ring-2 focus:ring-orange-500 focus:outline-none" />
                       </div>
                    </div>
                  </div>
               </div>

               {/* Payment Method */}
               <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                  <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                    <CreditCard className="w-5 h-5 mr-2 text-orange-500" /> Payment Method
                  </h2>
                  <div className="space-y-4">
                     <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'upi' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                       <input type="radio" name="payment" value="upi" checked={paymentMethod === 'upi'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-orange-600 focus:ring-orange-500" />
                       <div className="ml-4">
                         <span className="block font-bold text-slate-900">UPI (GPay, PhonePe, Paytm)</span>
                         <span className="text-sm text-slate-500">Fast and secure payment via your favorite UPI app.</span>
                       </div>
                       <Smartphone className="ml-auto text-slate-400 w-6 h-6" />
                     </label>

                     <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-orange-500 bg-orange-50' : 'border-slate-200'}`}>
                       <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="text-orange-600 focus:ring-orange-500" />
                       <div className="ml-4">
                         <span className="block font-bold text-slate-900">Credit / Debit Card</span>
                         <span className="text-sm text-slate-500">Visa, Mastercard, RuPay supported.</span>
                       </div>
                       <CreditCard className="ml-auto text-slate-400 w-6 h-6" />
                     </label>
                  </div>

                  <div className="mt-6 flex items-center bg-green-50 text-green-800 p-3 rounded-lg text-sm">
                    <ShieldCheck className="w-5 h-5 mr-2" />
                    Payments are secured with 256-bit SSL encryption.
                  </div>
               </div>

               <button 
                 type="submit" 
                 disabled={loading}
                 className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-4 rounded-xl shadow-lg transition-all flex justify-center items-center text-lg disabled:opacity-70 disabled:cursor-not-allowed"
               >
                 {loading ? <><Loader2 className="w-5 h-5 mr-3 animate-spin" /> Processing Payment...</> : `Pay ₹${totalAmount.toFixed(0)}`}
               </button>

            </form>
         </div>

         {/* Right Sidebar */}
         <div className="lg:col-span-1">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
              <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200">
                <span className="text-slate-600">Total Amount</span>
                <span className="font-bold text-xl text-slate-900">₹{totalAmount.toFixed(0)}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                By clicking "Pay", you agree to Pygenicarc Technologies' Terms of Service and Cancellation Policy. 
                Refunds are processed within 5-7 business days for failed transactions.
              </p>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Checkout;