
import React from 'react';
import { BadgeCheck, PenTool } from 'lucide-react';

interface CertificateProps {
  orderId: string;
  projectTitle: string;
  date: string;
}

export const QualityCertificate: React.FC<CertificateProps> = ({ orderId, projectTitle, date }) => {
  return (
    <div className="bg-white w-full h-full p-8 max-w-[210mm] mx-auto shadow-2xl overflow-y-auto print:shadow-none flex flex-col justify-between border-[16px] border-double border-slate-900">
      
      {/* Header */}
      <div className="text-center pt-8">
        <div className="inline-block mb-4">
           <BadgeCheck className="w-20 h-20 text-orange-600 mx-auto" />
        </div>
        <h1 className="text-4xl font-serif font-bold text-slate-900 uppercase tracking-widest mb-2">Certificate of Quality</h1>
        <p className="text-slate-500 font-serif italic text-lg">Pygenicarc Technologies Quality Assurance</p>
      </div>

      {/* Body */}
      <div className="text-center my-12 space-y-6">
        <p className="text-xl text-slate-700 font-serif">This is to certify that the engineering project kit</p>
        
        <div className="py-4 border-b-2 border-slate-200 inline-block min-w-[60%]">
           <h2 className="text-2xl font-bold text-slate-900 font-mono">{projectTitle}</h2>
        </div>
        
        <p className="text-xl text-slate-700 font-serif">Associated with Order ID <span className="font-bold">{orderId}</span></p>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
           Has successfully passed our rigorous 25-point quality inspection process, including continuity testing, microcontroller functionality, sensor calibration, and structural integrity checks.
        </p>
      </div>

      {/* Footer / Signatures */}
      <div className="flex justify-between items-end px-12 pb-12 mt-auto">
         <div className="text-center">
            <div className="mb-2 font-script text-3xl text-blue-900 transform -rotate-3">Rajesh Kumar</div>
            <div className="border-t border-slate-900 w-48 mx-auto pt-2 font-bold text-xs uppercase tracking-wider">Lead Engineer</div>
         </div>

         <div className="text-center">
             <div className="w-24 h-24 border-4 border-slate-900 rounded-full flex items-center justify-center mx-auto mb-2 opacity-80">
                <span className="font-bold text-xs text-center leading-tight">OFFICIAL<br/>SEAL<br/>2024</span>
             </div>
         </div>

         <div className="text-center">
            <div className="mb-2 font-mono text-sm text-slate-500">{new Date(date).toLocaleDateString()}</div>
            <div className="border-t border-slate-900 w-48 mx-auto pt-2 font-bold text-xs uppercase tracking-wider">Date of Inspection</div>
         </div>
      </div>
      
      <div className="text-center text-[10px] text-slate-400 font-mono">
         Certificate Unique ID: {orderId}-QA-VERIFIED
      </div>
    </div>
  );
};
