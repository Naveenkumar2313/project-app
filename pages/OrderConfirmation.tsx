
import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Download, ArrowRight, LayoutDashboard } from 'lucide-react';

const OrderConfirmation = () => {
  const { state } = useLocation();
  const orderId = state?.orderId || 'ORD-UNKNOWN';
  const amount = state?.amount || 0;
  const paymentId = state?.paymentId || 'PAY-PENDING';

  const handleDownloadInvoice = () => {
    // In a real app, this would fetch a PDF blob from the backend
    window.print();
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center max-w-2xl mx-auto animate-fadeIn">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6 animate-bounce">
        <CheckCircle className="w-12 h-12 text-green-600" />
      </div>
      
      <h1 className="text-4xl font-bold text-slate-900 mb-2">Order Confirmed!</h1>
      <p className="text-slate-500 text-lg mb-8">Thank you for trusting Pygenicarc Technologies.</p>

      <div className="bg-white border border-slate-200 rounded-xl p-8 w-full shadow-sm mb-8">
         <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
           <span className="text-slate-500">Order ID</span>
           <span className="font-mono font-bold text-slate-900">{orderId}</span>
         </div>
         <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
           <span className="text-slate-500">Transaction ID</span>
           <span className="font-mono font-bold text-slate-900 text-sm">{paymentId}</span>
         </div>
         <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
           <span className="text-slate-500">Amount Paid</span>
           <span className="font-bold text-slate-900">₹{amount.toFixed(0)}</span>
         </div>
         <div className="flex justify-between items-center border-b border-slate-100 pb-4 mb-4">
           <span className="text-slate-500">Status</span>
           <span className="px-2 py-1 bg-green-100 text-green-800 text-xs font-bold rounded uppercase">Processing</span>
         </div>
         <div className="text-left text-sm text-slate-500">
           A confirmation email has been sent to your registered email address. Our engineering team will start working on your order immediately.
         </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 w-full">
        <button 
          onClick={handleDownloadInvoice}
          className="flex-1 flex items-center justify-center px-6 py-3 border border-slate-300 rounded-lg font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
        >
          <Download className="w-5 h-5 mr-2" /> Download Invoice
        </button>
        <Link to="/dashboard" className="flex-1 flex items-center justify-center px-6 py-3 bg-slate-900 text-white rounded-lg font-semibold hover:bg-slate-800 transition-colors">
          <LayoutDashboard className="w-5 h-5 mr-2" /> Go to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmation;
