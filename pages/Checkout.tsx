
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { DataManager } from '../services/dataManager';
import { ShippingService } from '../services/shippingService';
import { Address, ShippingRate } from '../types';
import { Loader2, CreditCard, ShieldCheck, MapPin, Smartphone, User, AlertCircle, Plus, Truck, Check } from 'lucide-react';

declare global {
  interface Window {
    Razorpay: any;
  }
}

const Checkout = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { items, clearCart } = useCart();
  const { user, addAddress } = useAuth();
  const { addToast, addNotification } = useNotification();
  
  // Totals
  const subTotal = state?.total || 0; // Passed from Cart
  
  // Component State
  const [step, setStep] = useState(1); // 1: Address, 2: Shipping, 3: Payment
  const [loading, setLoading] = useState(false);
  const [validatingPincode, setValidatingPincode] = useState(false);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);
  const [selectedRate, setSelectedRate] = useState<ShippingRate | null>(null);
  
  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [showNewAddress, setShowNewAddress] = useState(false);
  const [newAddress, setNewAddress] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: '',
    city: '',
    state: '',
    zip: '',
    country: 'India'
  });

  const grandTotal = subTotal + (selectedRate?.price || 0);

  // Initial Address Selection
  useEffect(() => {
    if (user?.addresses && user.addresses.length > 0) {
      setSelectedAddressId(user.addresses[0].id);
    } else {
      setShowNewAddress(true);
    }
  }, [user]);

  // Handle Pincode Validation for New Address
  const handlePincodeBlur = async () => {
    if (newAddress.zip.length === 6) {
      setValidatingPincode(true);
      const result = await ShippingService.validatePincode(newAddress.zip);
      setValidatingPincode(false);
      
      if (result.valid) {
        setNewAddress(prev => ({
          ...prev,
          city: result.city || prev.city,
          state: result.state || prev.state
        }));
      } else {
        addToast('error', result.error || 'Invalid Pincode');
      }
    }
  };

  // Calculate Rates when moving to Step 2
  const handleContinueToShipping = async () => {
    // Determine active address
    let activeAddress: Address | undefined;
    
    if (showNewAddress || !user?.addresses?.length) {
      // Validate Form
      if (!newAddress.street || !newAddress.city || !newAddress.zip || !newAddress.phone) {
        addToast('error', 'Please fill all required address fields.');
        return;
      }
      
      // Save this address temporarily or permanently
      activeAddress = {
        id: `temp_${Date.now()}`,
        label: 'New Address',
        name: `${newAddress.firstName} ${newAddress.lastName}`,
        phone: newAddress.phone,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state,
        zip: newAddress.zip,
        country: newAddress.country
      };
      
      // If user is logged in, save it to profile
      if (user) {
        addAddress({ ...activeAddress, id: `addr_${Date.now()}` });
      }
    } else {
      activeAddress = user.addresses.find(a => a.id === selectedAddressId);
    }

    if (!activeAddress) return;

    setLoading(true);
    // Determine order weight (mock logic: physical items add weight)
    const weight = items.reduce((acc, item) => acc + (item.packageType.includes('Digital') ? 0 : 1.5), 0);
    
    const rates = await ShippingService.calculateRates(activeAddress, weight);
    setShippingRates(rates);
    setSelectedRate(rates[0]); // Default to cheapest
    setLoading(false);
    setStep(2);
  };

  const loadRazorpay = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handlePayment = async () => {
    setLoading(true);
    const isScriptLoaded = await loadRazorpay();

    if (!isScriptLoaded) {
      addToast('error', 'Payment gateway failed to load.');
      setLoading(false);
      return;
    }

    const options = {
      key: "rzp_test_sample_key",
      amount: Math.round(grandTotal * 100),
      currency: "INR",
      name: "Pygenicarc Technologies",
      description: "Project Order Payment",
      image: "https://ui-avatars.com/api/?name=Pygenicarc&background=ea580c&color=fff",
      handler: function (response: any) {
        completeOrder(response.razorpay_payment_id);
      },
      prefill: {
        name: `${newAddress.firstName} ${newAddress.lastName}`,
        email: newAddress.email,
        contact: newAddress.phone
      },
      theme: { color: "#ea580c" },
      modal: {
        ondismiss: function() {
          setLoading(false);
          addToast('warning', 'Payment Cancelled');
        }
      }
    };

    try {
      const paymentObject = new window.Razorpay(options);
      paymentObject.open();
    } catch (error) {
      setLoading(false);
      addToast('error', 'Payment initialization error.');
    }
  };

  const completeOrder = (paymentId: string) => {
    items.forEach(item => {
        DataManager.reduceStock(item.projectId, item.packageType, item.quantity);
    });

    clearCart();
    setLoading(false);
    
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    addToast('success', 'Order placed successfully!');
    addNotification('Order Confirmed', `Order #${orderId} confirmed. We will ship it soon!`, 'order');

    navigate('/order-confirmation', { 
      state: { orderId, amount: grandTotal, paymentId } 
    });
  };

  return (
    <div className="max-w-6xl mx-auto py-8">
       {/* Checkout Progress Stepper */}
       <div className="flex items-center justify-center mb-10">
         <div className={`flex items-center ${step >= 1 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 1 ? 'bg-orange-600 text-white border-orange-600' : 'border-slate-300'}`}>1</div>
           Details
         </div>
         <div className={`w-16 h-1 mx-2 ${step >= 2 ? 'bg-orange-600' : 'bg-slate-200'}`}></div>
         <div className={`flex items-center ${step >= 2 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 2 ? 'bg-orange-600 text-white border-orange-600' : 'border-slate-300'}`}>2</div>
           Shipping
         </div>
         <div className={`w-16 h-1 mx-2 ${step >= 3 ? 'bg-orange-600' : 'bg-slate-200'}`}></div>
         <div className={`flex items-center ${step >= 3 ? 'text-orange-600 font-bold' : 'text-slate-400'}`}>
           <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 border-2 ${step >= 3 ? 'bg-orange-600 text-white border-orange-600' : 'border-slate-300'}`}>3</div>
           Payment
         </div>
       </div>

       <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* Main Form Area */}
         <div className="lg:col-span-2 space-y-6">
            
            {/* Step 1: Address */}
            {step === 1 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fadeIn">
                 <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center">
                   <MapPin className="w-5 h-5 mr-2 text-orange-500" /> Delivery Address
                 </h2>

                 {/* Saved Addresses */}
                 {user?.addresses && user.addresses.length > 0 && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                     {user.addresses.map(addr => (
                       <div 
                         key={addr.id}
                         onClick={() => { setSelectedAddressId(addr.id); setShowNewAddress(false); }}
                         className={`p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedAddressId === addr.id && !showNewAddress ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                       >
                         <div className="flex justify-between items-start">
                           <span className="font-bold text-slate-800">{addr.label}</span>
                           {selectedAddressId === addr.id && !showNewAddress && <Check className="w-5 h-5 text-orange-600" />}
                         </div>
                         <p className="text-sm text-slate-600 mt-1">{addr.street}, {addr.city}</p>
                         <p className="text-sm text-slate-600">{addr.state} - {addr.zip}</p>
                       </div>
                     ))}
                     
                     <div 
                        onClick={() => setShowNewAddress(true)}
                        className={`p-4 border-2 border-dashed rounded-xl cursor-pointer flex items-center justify-center text-slate-500 font-medium hover:bg-slate-50 hover:text-orange-600 hover:border-orange-300 transition-all ${showNewAddress ? 'border-orange-500 bg-orange-50 text-orange-700' : 'border-slate-300'}`}
                     >
                        <Plus className="w-5 h-5 mr-2" /> Add New Address
                     </div>
                   </div>
                 )}

                 {/* New Address Form */}
                 {(showNewAddress || !user?.addresses?.length) && (
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fadeIn">
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">First Name</label>
                        <input required value={newAddress.firstName} onChange={e => setNewAddress({...newAddress, firstName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Last Name</label>
                        <input required value={newAddress.lastName} onChange={e => setNewAddress({...newAddress, lastName: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-slate-700 mb-1">Address</label>
                        <input required value={newAddress.street} onChange={e => setNewAddress({...newAddress, street: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" placeholder="Street, Sector, Apartment" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Pincode</label>
                        <div className="relative">
                          <input 
                            required 
                            maxLength={6} 
                            value={newAddress.zip} 
                            onChange={e => setNewAddress({...newAddress, zip: e.target.value.replace(/\D/g,'')})} 
                            onBlur={handlePincodeBlur}
                            className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" 
                          />
                          {validatingPincode && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin text-slate-400" />}
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">City</label>
                        <input required value={newAddress.city} onChange={e => setNewAddress({...newAddress, city: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" readOnly={validatingPincode} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">State</label>
                        <input required value={newAddress.state} onChange={e => setNewAddress({...newAddress, state: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 bg-slate-50" readOnly={validatingPincode} />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Phone</label>
                        <input required type="tel" value={newAddress.phone} onChange={e => setNewAddress({...newAddress, phone: e.target.value})} className="w-full border border-slate-300 rounded-lg p-2.5 outline-none focus:ring-2 focus:ring-orange-500" />
                      </div>
                   </div>
                 )}

                 <button onClick={handleContinueToShipping} disabled={loading} className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all flex justify-center">
                   {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Continue to Shipping'}
                 </button>
              </div>
            )}

            {/* Step 2: Shipping Method */}
            {step === 2 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fadeIn">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <Truck className="w-5 h-5 mr-2 text-orange-500" /> Shipping Method
                    </h2>
                    <button onClick={() => setStep(1)} className="text-sm text-slate-500 hover:text-orange-600 underline">Change Address</button>
                 </div>

                 <div className="space-y-4">
                    {shippingRates.map(rate => (
                      <div 
                        key={rate.id}
                        onClick={() => setSelectedRate(rate)}
                        className={`flex items-center justify-between p-4 border-2 rounded-xl cursor-pointer transition-all ${selectedRate?.id === rate.id ? 'border-orange-500 bg-orange-50' : 'border-slate-200 hover:border-slate-300'}`}
                      >
                         <div className="flex items-center">
                            <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${selectedRate?.id === rate.id ? 'border-orange-600' : 'border-slate-400'}`}>
                               {selectedRate?.id === rate.id && <div className="w-2.5 h-2.5 bg-orange-600 rounded-full"></div>}
                            </div>
                            <div>
                               <p className="font-bold text-slate-800">{rate.name}</p>
                               <p className="text-sm text-slate-500">{rate.carrier} • {rate.estimatedDays}</p>
                            </div>
                         </div>
                         <span className="font-bold text-slate-900">{rate.price === 0 ? 'Free' : `₹${rate.price}`}</span>
                      </div>
                    ))}
                 </div>

                 <button onClick={() => setStep(3)} className="mt-8 w-full bg-slate-900 text-white py-3 rounded-xl font-bold hover:bg-slate-800 transition-all">
                   Continue to Payment
                 </button>
              </div>
            )}

            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200 animate-fadeIn">
                 <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-slate-900 flex items-center">
                      <CreditCard className="w-5 h-5 mr-2 text-orange-500" /> Secure Payment
                    </h2>
                    <button onClick={() => setStep(2)} className="text-sm text-slate-500 hover:text-orange-600 underline">Change Shipping</button>
                 </div>

                 <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg mb-6">
                    <div className="flex justify-between mb-2">
                       <span className="text-sm text-slate-600">Contact</span>
                       <span className="text-sm font-medium">{newAddress.email}</span>
                    </div>
                    <div className="flex justify-between mb-2">
                       <span className="text-sm text-slate-600">Ship to</span>
                       <span className="text-sm font-medium max-w-[200px] truncate">{newAddress.street}, {newAddress.city}</span>
                    </div>
                    <div className="flex justify-between">
                       <span className="text-sm text-slate-600">Method</span>
                       <span className="text-sm font-medium">{selectedRate?.name} ({selectedRate?.estimatedDays})</span>
                    </div>
                 </div>

                 <button onClick={handlePayment} disabled={loading} className="w-full bg-orange-600 text-white py-4 rounded-xl font-bold hover:bg-orange-700 transition-all flex items-center justify-center shadow-lg">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Pay ₹${grandTotal.toFixed(0)}`}
                 </button>
                 
                 <div className="mt-4 flex justify-center items-center text-xs text-slate-400">
                    <ShieldCheck className="w-3 h-3 mr-1" /> Payments are 256-bit SSL Encrypted
                 </div>
              </div>
            )}
         </div>

         {/* Right Sidebar: Summary */}
         <div className="lg:col-span-1">
            <div className="bg-slate-50 p-6 rounded-xl border border-slate-200 sticky top-24">
              <h3 className="font-bold text-slate-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                 {items.map(item => (
                    <div key={item.projectId + item.packageType} className="flex justify-between text-sm">
                       <div className="flex items-start">
                          <div className="bg-white border border-slate-200 w-5 h-5 flex items-center justify-center rounded text-xs font-bold mr-2 text-slate-500">{item.quantity}</div>
                          <span className="text-slate-600 w-32 truncate">{item.title}</span>
                       </div>
                       <span className="font-medium">₹{item.price * item.quantity}</span>
                    </div>
                 ))}
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-2">
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Subtotal</span>
                  <span>₹{subTotal}</span>
                </div>
                <div className="flex justify-between text-sm text-slate-600">
                  <span>Shipping</span>
                  {step > 1 && selectedRate ? (
                     <span className="font-medium">{selectedRate.price === 0 ? 'Free' : `₹${selectedRate.price}`}</span>
                  ) : (
                     <span className="text-xs text-slate-400">Calculated next step</span>
                  )}
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
                <span className="font-bold text-lg text-slate-900">Total</span>
                <div className="text-right">
                   <span className="text-xs text-slate-400 block font-normal">INR</span>
                   <span className="font-black text-2xl text-slate-900">₹{grandTotal.toFixed(0)}</span>
                </div>
              </div>
            </div>
         </div>
       </div>
    </div>
  );
};

export default Checkout;
