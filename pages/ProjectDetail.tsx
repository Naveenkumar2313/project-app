import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PackageType } from '../types';
import { PROJECTS } from '../services/mockData';
import { useCart } from '../contexts/CartContext';
import { Check, ShieldCheck, Download, Truck, Cpu, FileText, UploadCloud, Loader2 } from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const project = PROJECTS.find(p => p.id === id);
  const [selectedPkg, setSelectedPkg] = useState<PackageType>(PackageType.DIGITAL);
  
  // Custom Request State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customRequestText, setCustomRequestText] = useState('');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customSubmitSuccess, setCustomSubmitSuccess] = useState(false);

  if (!project) return <div>Project not found</div>;

  const getPrice = () => {
    switch(selectedPkg) {
      case PackageType.DIGITAL: return project.priceDigital;
      case PackageType.HARDWARE_KIT: return project.priceKit;
      case PackageType.FULL_BUILD: return project.priceBuild;
    }
  };

  const features = {
    [PackageType.DIGITAL]: ['Source Code', 'Circuit Diagrams', 'Project Report (Soft Copy)', 'Setup Guide'],
    [PackageType.HARDWARE_KIT]: ['All Digital Assets', 'Tested Hardware Components', 'PCB (if applicable)', 'Connection Wires'],
    [PackageType.FULL_BUILD]: ['All Kit Assets', 'Fully Assembled Model', 'Video Demonstration', 'Priority Support']
  };

  const handleBooking = () => {
    addToCart({
      projectId: project.id,
      title: project.title,
      packageType: selectedPkg,
      price: getPrice(),
      imageUrl: project.imageUrl
    });
    // Visual feedback handled by cart counter update, but let's show a simple browser alert or better, just rely on the UI update for now as user didn't specify toast
    alert("Added to Cart!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCustomFile(e.target.files[0]);
    }
  };

  const handleCustomSubmit = async () => {
    if (!customRequestText) {
      alert("Please describe your requirement.");
      return;
    }

    setIsSubmittingCustom(true);

    // Mock API Call
    await new Promise(resolve => setTimeout(resolve, 1500));

    // "Save" to local state logic (simulated)
    console.log("Custom Request Saved:", {
      projectId: project.id,
      requirement: customRequestText,
      fileName: customFile?.name || 'No file'
    });

    setIsSubmittingCustom(false);
    setCustomSubmitSuccess(true);
    
    // Reset after delay
    setTimeout(() => {
      setShowCustomForm(false);
      setCustomSubmitSuccess(false);
      setCustomRequestText('');
      setCustomFile(null);
    }, 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Project Info */}
      <div className="lg:col-span-2 space-y-8">
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <img src={project.imageUrl} alt={project.title} className="w-full h-64 object-cover" />
          <div className="p-8">
            <div className="flex items-center space-x-2 mb-4">
              <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md font-bold uppercase">{project.department}</span>
              <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-md font-bold uppercase">{project.tier}</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-900 mb-4">{project.title}</h1>
            <p className="text-slate-600 leading-relaxed mb-6">{project.description}</p>
            
            <h3 className="font-semibold text-slate-900 mb-3">Components Required:</h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {project.components.map(c => (
                <span key={c} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-600">{c}</span>
              ))}
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
              <ShieldCheck className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-semibold text-blue-900">Plagiarism Free Guarantee</h4>
                <p className="text-xs text-blue-700 mt-1">
                  We provide a unique modification guide with every order to ensure your project stands out. 
                  Digital assets are watermarked until payment confirmation to protect intellectual property.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Custom Request Form */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
           <div className="flex justify-between items-center mb-4">
             <h3 className="text-lg font-bold text-slate-900">Have a custom requirement?</h3>
             <button 
                onClick={() => setShowCustomForm(!showCustomForm)}
                className="text-sm text-orange-600 hover:text-orange-700 font-medium"
             >
               {showCustomForm ? 'Cancel' : 'Request Customization'}
             </button>
           </div>
           
           {showCustomForm && (
             <div className="animate-fadeIn">
                {customSubmitSuccess ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700">
                    <Check className="w-8 h-8 mx-auto mb-2" />
                    <p className="font-semibold">Request Received!</p>
                    <p className="text-sm">Our engineering team will review your requirements and contact you shortly.</p>
                  </div>
                ) : (
                  <form className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-1">Problem Statement / Requirement</label>
                      <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        rows={4} 
                        placeholder="Describe the changes or new project idea..."
                        value={customRequestText}
                        onChange={(e) => setCustomRequestText(e.target.value)}
                      ></textarea>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Upload Reference File (PDF/Doc)</label>
                        <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                          <input 
                            type="file" 
                            onChange={handleFileChange} 
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                            accept=".pdf,.doc,.docx"
                          />
                          <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-orange-500 transition-colors" />
                          <span className="text-xs text-slate-500">
                            {customFile ? customFile.name : 'Click to upload or drag and drop'}
                          </span>
                        </div>
                    </div>
                    <button 
                      type="button" 
                      onClick={handleCustomSubmit}
                      disabled={isSubmittingCustom}
                      className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center"
                    >
                      {isSubmittingCustom ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Submitting...
                        </>
                      ) : 'Submit Request'}
                    </button>
                  </form>
                )}
             </div>
           )}
        </div>
      </div>

      {/* Right Column: Booking Engine */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Configure Order</h3>
          
          <div className="space-y-3 mb-8">
            {/* Digital Option */}
            <div 
              onClick={() => setSelectedPkg(PackageType.DIGITAL)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${selectedPkg === PackageType.DIGITAL ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center"><Download className="w-4 h-4 mr-2" /> Digital Only</span>
                <span className="text-sm font-bold text-slate-900">₹{project.priceDigital}</span>
              </div>
              <p className="text-xs text-slate-500">Code, Report & Synopsis</p>
            </div>

            {/* Hardware Kit Option */}
            <div 
              onClick={() => setSelectedPkg(PackageType.HARDWARE_KIT)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${selectedPkg === PackageType.HARDWARE_KIT ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center"><Cpu className="w-4 h-4 mr-2" /> Hardware Kit</span>
                <span className="text-sm font-bold text-slate-900">₹{project.priceKit}</span>
              </div>
              <p className="text-xs text-slate-500">Components + Digital Assets</p>
            </div>

            {/* Full Build Option */}
            <div 
              onClick={() => setSelectedPkg(PackageType.FULL_BUILD)}
              className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${selectedPkg === PackageType.FULL_BUILD ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
            >
              <div className="flex justify-between items-center mb-1">
                <span className="font-semibold text-slate-900 flex items-center"><Truck className="w-4 h-4 mr-2" /> Full Build</span>
                <span className="text-sm font-bold text-slate-900">₹{project.priceBuild}</span>
              </div>
              <p className="text-xs text-slate-500">Assembled & Tested Model</p>
            </div>
          </div>

          <div className="mb-8">
            <h4 className="text-sm font-semibold text-slate-900 mb-3">Includes:</h4>
            <ul className="space-y-2">
              {features[selectedPkg].map((feat, i) => (
                <li key={i} className="flex items-start text-sm text-slate-600">
                  <Check className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  {feat}
                </li>
              ))}
            </ul>
          </div>

          <div className="pt-4 border-t border-slate-100">
            <div className="flex justify-between items-end mb-4">
              <span className="text-slate-500 text-sm">Total Amount</span>
              <span className="text-3xl font-bold text-slate-900">₹{getPrice()}</span>
            </div>
            <button 
              onClick={handleBooking}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg shadow-md transition-colors flex justify-center items-center"
            >
              Add to Cart
            </button>
            <p className="text-xs text-center text-slate-400 mt-3">Secure payment via UPI / Card</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;