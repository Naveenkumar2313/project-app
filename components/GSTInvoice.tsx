
import React from 'react';
import { PackageType } from '../types';

interface InvoiceProps {
  orderId: string;
  customerName: string;
  projectTitle: string;
  packageType: PackageType;
  amount: number;
  date: string;
}

export const GSTInvoice: React.FC<InvoiceProps> = ({ orderId, customerName, projectTitle, packageType, amount, date }) => {
  // Mock GST Calculations (Inclusive)
  const taxRate = 18;
  const baseAmount = amount / (1 + taxRate / 100);
  const gstAmount = amount - baseAmount;
  const cgst = gstAmount / 2;
  const sgst = gstAmount / 2;

  return (
    <div className="bg-white w-full h-full p-10 max-w-[210mm] mx-auto shadow-2xl overflow-y-auto print:shadow-none font-serif text-slate-900">
      
      {/* Invoice Header */}
      <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-8">
        <div>
           <h1 className="text-2xl font-bold uppercase tracking-widest text-orange-600 mb-1">Tax Invoice</h1>
           <p className="text-xs text-slate-500">Original for Recipient</p>
        </div>
        <div className="text-right">
           <h2 className="text-xl font-bold text-slate-900">Pygenicarc Technologies</h2>
           <p className="text-sm text-slate-600">123, Tech Park, Electronic City</p>
           <p className="text-sm text-slate-600">Bangalore, Karnataka - 560100</p>
           <p className="text-sm font-bold mt-1">GSTIN: 29AAECP1234F1Z5</p>
        </div>
      </div>

      {/* Bill To & Invoice Details */}
      <div className="flex justify-between mb-8">
         <div>
            <h3 className="text-sm font-bold uppercase text-slate-500 mb-2">Bill To</h3>
            <p className="font-bold text-lg">{customerName}</p>
            <p className="text-sm text-slate-600">Engineering Student</p>
            <p className="text-sm text-slate-600">India</p>
         </div>
         <div className="text-right">
            <div className="mb-2">
               <span className="text-sm font-bold text-slate-500 mr-4">Invoice No:</span>
               <span className="font-mono font-bold">{orderId}/INV</span>
            </div>
            <div className="mb-2">
               <span className="text-sm font-bold text-slate-500 mr-4">Date:</span>
               <span>{new Date(date).toLocaleDateString()}</span>
            </div>
            <div>
               <span className="text-sm font-bold text-slate-500 mr-4">State Code:</span>
               <span>29 (Karnataka)</span>
            </div>
         </div>
      </div>

      {/* Line Items */}
      <table className="w-full mb-8 border-collapse">
         <thead>
            <tr className="bg-slate-100 border-y border-slate-300">
               <th className="py-3 px-4 text-left text-sm font-bold uppercase">Description</th>
               <th className="py-3 px-4 text-center text-sm font-bold uppercase">HSN/SAC</th>
               <th className="py-3 px-4 text-right text-sm font-bold uppercase">Qty</th>
               <th className="py-3 px-4 text-right text-sm font-bold uppercase">Amount</th>
            </tr>
         </thead>
         <tbody>
            <tr className="border-b border-slate-200">
               <td className="py-4 px-4">
                  <p className="font-bold">{projectTitle}</p>
                  <p className="text-xs text-slate-500">Package: {packageType}</p>
                  <p className="text-xs text-slate-500">Educational Engineering Kit</p>
               </td>
               <td className="py-4 px-4 text-center text-sm">9023</td>
               <td className="py-4 px-4 text-right text-sm">1</td>
               <td className="py-4 px-4 text-right font-mono">₹{baseAmount.toFixed(2)}</td>
            </tr>
         </tbody>
      </table>

      {/* Totals */}
      <div className="flex justify-end mb-12">
         <div className="w-1/2 space-y-2">
            <div className="flex justify-between text-sm">
               <span className="text-slate-600">Taxable Value</span>
               <span className="font-mono">₹{baseAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="text-slate-600">CGST (9%)</span>
               <span className="font-mono">₹{cgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
               <span className="text-slate-600">SGST (9%)</span>
               <span className="font-mono">₹{sgst.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold border-t-2 border-slate-900 pt-2 mt-2">
               <span>Total Amount</span>
               <span>₹{amount.toFixed(0)}</span>
            </div>
            <p className="text-xs text-right text-slate-500 italic mt-1">(Amount in words: Rupees {amount} Only)</p>
         </div>
      </div>

      {/* Footer */}
      <div className="mt-auto">
         <div className="flex justify-between items-end mb-8">
            <div className="text-xs text-slate-500 max-w-sm">
               <p className="font-bold mb-1">Terms & Conditions:</p>
               <ol className="list-decimal pl-4 space-y-1">
                  <li>Goods once sold cannot be returned except for manufacturing defects.</li>
                  <li>Interest @ 18% p.a. will be charged if payment is delayed.</li>
                  <li>Subject to Bangalore Jurisdiction only.</li>
               </ol>
            </div>
            <div className="text-center">
               <div className="h-16 mb-2"></div> {/* Space for signature */}
               <p className="font-bold text-sm">For Pygenicarc Technologies</p>
               <p className="text-xs text-slate-500">Authorized Signatory</p>
            </div>
         </div>
         <div className="text-center border-t border-slate-200 pt-4 text-xs text-slate-400">
            This is a computer generated invoice. No signature required.
         </div>
      </div>
    </div>
  );
};
