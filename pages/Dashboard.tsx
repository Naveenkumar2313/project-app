import React from 'react';
import { MY_ORDERS } from '../services/mockData';
import { OrderStatus } from '../types';
import { Package, Lock, FileText, CheckCircle, Clock } from 'lucide-react';

const Dashboard = () => {
  const steps = [
    OrderStatus.PAYMENT_VERIFIED,
    OrderStatus.PROCURING,
    OrderStatus.CODING,
    OrderStatus.TESTING,
    OrderStatus.DISPATCHED
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-6">Student Dashboard</h1>
        
        {/* Active Orders */}
        {MY_ORDERS.map((order) => {
          const currentStepIndex = steps.indexOf(order.status);
          
          return (
            <div key={order.id} className="border border-slate-200 rounded-lg p-6 mb-6 last:mb-0">
               <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
                 <div>
                   <span className="text-xs font-mono text-slate-400 uppercase">Order ID: {order.id}</span>
                   <h3 className="text-xl font-bold text-slate-900">{order.projectTitle}</h3>
                   <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mt-2">
                      {order.packageType}
                   </span>
                 </div>
                 <div className="mt-4 md:mt-0 text-right">
                   <p className="text-sm text-slate-500">Est. Delivery: <span className="font-semibold text-slate-900">{order.estimatedDelivery}</span></p>
                 </div>
               </div>

               {/* Stepper UI */}
               <div className="relative mb-10">
                  <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                  <div 
                    className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-500"
                    style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
                  ></div>
                  
                  <div className="relative flex justify-between w-full">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isCurrent = idx === currentStepIndex;

                      return (
                        <div key={step} className="flex flex-col items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center z-10 border-2 transition-colors ${
                            isCompleted ? 'bg-orange-500 border-orange-500 text-white' : 'bg-white border-slate-200 text-slate-300'
                          }`}>
                            {isCompleted ? <CheckCircle className="w-4 h-4" /> : <div className="w-2 h-2 rounded-full bg-slate-200" />}
                          </div>
                          <span className={`text-xs mt-2 font-medium ${isCurrent ? 'text-orange-600' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>
                            {step}
                          </span>
                        </div>
                      );
                    })}
                  </div>
               </div>

               {/* Plagiarism Report Section */}
               <div className="bg-slate-50 rounded-lg p-4 flex items-center justify-between border border-slate-200">
                  <div className="flex items-center">
                    <FileText className="w-5 h-5 text-slate-500 mr-3" />
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Plagiarism Check Report</h4>
                      <p className="text-xs text-slate-500">Unique content score: <span className="font-mono text-green-600 font-bold">{100 - order.plagiarismScore}%</span></p>
                    </div>
                  </div>
                  <button className="text-xs bg-white border border-slate-300 px-3 py-1.5 rounded-md hover:bg-slate-50 font-medium">
                    View Report
                  </button>
               </div>
            </div>
          );
        })}
      </div>

      {/* Digital Assets Vault */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <h2 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
            <Package className="w-5 h-5 mr-2 text-orange-500" />
            Project Assets
          </h2>
          <div className="space-y-3">
             {['Source Code.zip', 'Circuit Diagram.pdf', 'Setup Manual.pdf'].map((file, i) => (
               <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                 <div className="flex items-center">
                   <Lock className="w-4 h-4 text-slate-400 mr-3" />
                   <span className="text-sm text-slate-600">{file}</span>
                 </div>
                 <span className="text-xs bg-slate-200 text-slate-600 px-2 py-1 rounded">Locked</span>
               </div>
             ))}
             <p className="text-xs text-slate-400 mt-2 text-center">Assets unlock after "Dispatched" status</p>
          </div>
        </div>

        <div className="bg-gradient-to-br from-blue-900 to-slate-900 rounded-xl shadow-sm p-8 text-white">
          <h2 className="text-lg font-bold mb-4">Support & FAQ</h2>
          <p className="text-blue-200 text-sm mb-6">Need help with your circuit setup or coding logic? Our engineers are here to assist.</p>
          <button className="w-full bg-white text-blue-900 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">
            Raise Ticket
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;