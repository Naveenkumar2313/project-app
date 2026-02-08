import React, { useState } from 'react';
import { MY_ORDERS } from '../services/mockData';
import { OrderStatus, Order } from '../types';
import { generatePlagiarismScore, getStatusColor } from '../services/reportUtils';
import { Package, Lock, Unlock, FileText, CheckCircle, Clock, ShieldAlert, Download, Settings } from 'lucide-react';

const Dashboard = () => {
  const [orders, setOrders] = useState<Order[]>(MY_ORDERS);

  const steps = [
    OrderStatus.PAYMENT_VERIFIED,
    OrderStatus.PROCURING,
    OrderStatus.CODING,
    OrderStatus.TESTING,
    OrderStatus.DISPATCHED
  ];

  // Mock Admin Function to advance status
  const advanceStatus = (orderId: string) => {
    setOrders(currentOrders => currentOrders.map(order => {
      if (order.id !== orderId) return order;
      
      const currentIndex = steps.indexOf(order.status);
      if (currentIndex < steps.length - 1) {
        return { ...order, status: steps[currentIndex + 1] };
      }
      return order;
    }));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
        <span className="text-xs text-slate-400 font-mono">Session ID: PYG-8821X</span>
      </div>
      
      {/* Active Orders */}
      {orders.map((order) => {
        const currentStepIndex = steps.indexOf(order.status);
        const plagiarismScore = generatePlagiarismScore(order.projectId); // Dynamic generation
        const isDispatched = order.status === OrderStatus.DISPATCHED;
        
        return (
          <div key={order.id} className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
               {/* Admin Simulator Control */}
               <div className="absolute top-4 right-4 z-20">
                 {order.status !== OrderStatus.DISPATCHED ? (
                    <button 
                      onClick={() => advanceStatus(order.id)}
                      className="flex items-center space-x-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full border border-slate-300 transition-colors"
                      title="Mock Admin Action"
                    >
                      <Settings className="w-3 h-3" />
                      <span>Simulate Admin: Advance Status</span>
                    </button>
                 ) : (
                   <span className="flex items-center space-x-2 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
                     <CheckCircle className="w-3 h-3" />
                     <span>Order Completed</span>
                   </span>
                 )}
               </div>

               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                 <div>
                   <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Order #{order.id}</span>
                   <h3 className="text-2xl font-bold text-slate-900 mt-1">{order.projectTitle}</h3>
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-3">
                      {order.packageType}
                   </span>
                 </div>
                 <div className="mt-4 md:mt-0 text-right pr-4 md:pr-0">
                   <p className="text-sm text-slate-500">Est. Delivery</p> 
                   <span className="text-lg font-semibold text-slate-900">{order.estimatedDelivery}</span>
                 </div>
               </div>

               {/* Stepper UI */}
               <div className="relative mb-12 px-4">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  ></div>
                  
                  <div className="relative flex justify-between w-full">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step} className="flex flex-col items-center group">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-300 ${
                            isCompleted ? 'bg-orange-500 border-orange-200 text-white shadow-md scale-110' : 'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                          </div>
                          <span className={`text-xs mt-3 font-medium transition-colors duration-300 ${isCurrent ? 'text-orange-600 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
               </div>

               {/* Plagiarism Report Section */}
               <div className={`rounded-lg p-5 flex items-center justify-between border ${getStatusColor(plagiarismScore)}`}>
                  <div className="flex items-center">
                    <ShieldAlert className="w-6 h-6 mr-4 opacity-80" />
                    <div>
                      <h4 className="text-sm font-bold">Plagiarism Report Generated</h4>
                      <p className="text-xs mt-1 opacity-90">
                        Similarity Index: <span className="font-mono font-bold">{plagiarismScore}%</span> (Safe limit &lt; 20%)
                      </p>
                    </div>
                  </div>
                  <button className="text-xs bg-white/80 hover:bg-white border border-current px-4 py-2 rounded-md font-semibold transition-colors shadow-sm">
                    Download PDF Report
                  </button>
               </div>
            </div>

            {/* Digital Assets Vault */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-lg font-bold text-slate-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-orange-500" />
                    Project Assets Vault
                  </h2>
                  {!isDispatched && (
                    <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 flex items-center">
                      <Lock className="w-3 h-3 mr-1" /> Vault Locked
                    </span>
                  )}
                </div>
                
                <div className="space-y-4">
                   {['Source Code & Libraries.zip', 'Complete Circuit Diagram.pdf', 'Installation & Setup Manual.pdf', 'Project Synopsis.docx'].map((file, i) => (
                     <div key={i} className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                       isDispatched 
                        ? 'bg-slate-50 border-slate-200 hover:border-orange-200 hover:bg-orange-50 cursor-pointer group' 
                        : 'bg-slate-50 border-slate-100 opacity-60 cursor-not-allowed'
                     }`}>
                       <div className="flex items-center">
                         {isDispatched ? (
                           <Unlock className="w-5 h-5 text-green-500 mr-3" />
                         ) : (
                           <Lock className="w-5 h-5 text-slate-400 mr-3" />
                         )}
                         <span className={`text-sm font-medium ${isDispatched ? 'text-slate-700 group-hover:text-orange-700' : 'text-slate-500'}`}>{file}</span>
                       </div>
                       
                       {isDispatched ? (
                         <span className="flex items-center text-xs font-bold text-orange-600 bg-white px-3 py-1.5 rounded shadow-sm border border-orange-100">
                           <Download className="w-3 h-3 mr-1.5" /> Download
                         </span>
                       ) : (
                         <span className="text-xs bg-slate-200 text-slate-500 px-2 py-1 rounded">
                           Unlock at Dispatch
                         </span>
                       )}
                     </div>
                   ))}
                </div>
                <p className="text-xs text-slate-400 mt-4 text-center border-t border-slate-100 pt-3">
                  {isDispatched 
                    ? "All assets are available for download. License keys are included in the ZIP." 
                    : "Security Protocol: Digital assets remain encrypted until the physical/digital delivery is confirmed."}
                </p>
              </div>

              <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-xl shadow-lg p-8 text-white flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 bg-white/10 rounded-lg flex items-center justify-center mb-4">
                    <Clock className="w-6 h-6 text-orange-400" />
                  </div>
                  <h2 className="text-lg font-bold mb-2">Need Urgent Help?</h2>
                  <p className="text-slate-300 text-sm mb-6 leading-relaxed">
                    Stuck during the "Coding" or "Testing" phase? Our engineers can jump on a remote session.
                  </p>
                </div>
                <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg text-sm transition-colors shadow-lg">
                  Request Priority Support
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Dashboard;
