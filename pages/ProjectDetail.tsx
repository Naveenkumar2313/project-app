
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PackageType, Project } from '../types';
import { PROJECTS } from '../services/mockData';
import { useCart } from '../contexts/CartContext';
import { 
  Check, ShieldCheck, Download, Truck, Cpu, FileText, UploadCloud, 
  Loader2, Star, PlayCircle, MapPin, Share2, Facebook, Twitter, Linkedin, MessageCircle,
  ChevronDown, ChevronUp, AlertCircle, Clock, Users, TrendingUp
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  
  const project = PROJECTS.find(p => p.id === id);
  const [selectedPkg, setSelectedPkg] = useState<PackageType>(PackageType.DIGITAL);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faqs'>('description');
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  
  // Custom Request State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customRequestText, setCustomRequestText] = useState('');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customSubmitSuccess, setCustomSubmitSuccess] = useState(false);
  
  // Social Proof State
  const [viewersCount, setViewersCount] = useState(12);

  // Initialize active image and simulate viewer count
  useEffect(() => {
    if (project && project.images && project.images.length > 0) {
      setActiveImage(project.images[0]);
    } else if (project) {
      setActiveImage(project.imageUrl);
    }

    // Simulate fluctuation in viewer count
    const interval = setInterval(() => {
        setViewersCount(prev => Math.max(5, prev + Math.floor(Math.random() * 3) - 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [project]);

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
      imageUrl: activeImage,
      quantity: 1
    });
    navigate('/cart');
  };

  const calculateDelivery = () => {
    if (pincode.length !== 6) {
      alert("Please enter a valid 6-digit Pincode");
      return;
    }
    // Mock delivery calculation
    const days = Math.floor(Math.random() * 4) + 4; // 4-7 days
    const date = new Date();
    date.setDate(date.getDate() + days);
    setDeliveryDate(date.toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short' }));
  };

  const handleShare = (platform: string) => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Check out this project: ${project.title}`);
    let shareLink = '';

    switch(platform) {
      case 'twitter': shareLink = `https://twitter.com/intent/tweet?url=${url}&text=${text}`; break;
      case 'facebook': shareLink = `https://www.facebook.com/sharer/sharer.php?u=${url}`; break;
      case 'linkedin': shareLink = `https://www.linkedin.com/shareArticle?mini=true&url=${url}&title=${text}`; break;
      case 'whatsapp': shareLink = `https://wa.me/?text=${text}%20${url}`; break;
    }
    window.open(shareLink, '_blank');
  };

  // Custom Form Handlers
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setCustomFile(e.target.files[0]);
  };
  const handleCustomSubmit = async () => {
    if (!customRequestText) return alert("Please describe your requirement.");
    setIsSubmittingCustom(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingCustom(false);
    setCustomSubmitSuccess(true);
    setTimeout(() => { setShowCustomForm(false); setCustomSubmitSuccess(false); setCustomRequestText(''); setCustomFile(null); }, 2000);
  };

  return (
    <div className="space-y-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Media & Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Gallery Section */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="relative aspect-video bg-slate-100">
              <img src={activeImage} alt={project.title} loading="lazy" className="w-full h-full object-cover" />
              {project.isPreOrder && (
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Pre-Order
                  </div>
              )}
            </div>
            
            {/* Social Proof Bar */}
            <div className="bg-red-50 px-6 py-2 flex items-center justify-between text-sm border-t border-b border-red-100">
               <div className="flex items-center text-red-600 font-medium">
                  <TrendingUp className="w-4 h-4 mr-2 animate-pulse" />
                  Ordered {Math.floor(Math.random() * 15) + 5} times in the last 24 hours
               </div>
               <div className="flex items-center text-slate-600">
                  <Users className="w-4 h-4 mr-2" />
                  <span className="font-bold mr-1">{viewersCount}</span> people viewing this now
               </div>
            </div>

            {project.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {project.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <img src={img} alt="" loading="lazy" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            <div className="p-8">
              <div className="flex justify-between items-start">
                 <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded-md font-bold uppercase">{project.department}</span>
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-md font-bold uppercase">{project.tier}</span>
                      {project.rating > 0 && <span className="flex items-center text-yellow-500 text-sm font-bold">
                        <Star className="w-4 h-4 fill-current mr-1" /> {project.rating}
                      </span>}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.title}</h1>
                 </div>
                 
                 {/* Social Share */}
                 <div className="flex items-center space-x-2">
                   <button onClick={() => handleShare('whatsapp')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100"><MessageCircle className="w-5 h-5" /></button>
                   <button onClick={() => handleShare('linkedin')} className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100"><Linkedin className="w-5 h-5" /></button>
                   <button onClick={() => handleShare('twitter')} className="p-2 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100"><Twitter className="w-5 h-5" /></button>
                 </div>
              </div>
            </div>
          </div>

          {/* Content Tabs */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="flex border-b border-slate-200 overflow-x-auto">
                {['description', 'specs', 'reviews', 'faqs'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-6 py-4 text-sm font-medium capitalize whitespace-nowrap border-b-2 transition-colors ${
                      activeTab === tab 
                        ? 'border-orange-500 text-orange-600 bg-orange-50/50' 
                        : 'border-transparent text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    {tab === 'specs' ? 'Specifications' : tab === 'faqs' ? 'FAQs' : tab}
                  </button>
                ))}
             </div>
             
             <div className="p-8 min-h-[300px]">
                {activeTab === 'description' && (
                  <div className="animate-fadeIn space-y-6">
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 mb-3">Project Overview</h3>
                       <p className="text-slate-600 leading-relaxed">{project.description}</p>
                    </div>
                    
                    {project.videoUrl && (
                      <div className="mt-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center"><PlayCircle className="w-5 h-5 mr-2 text-red-500" /> Video Demonstration</h3>
                        <div className="aspect-video rounded-lg overflow-hidden bg-slate-900">
                          <iframe 
                            src={project.videoUrl} 
                            title="Project Demo"
                            className="w-full h-full"
                            allowFullScreen
                          ></iframe>
                        </div>
                      </div>
                    )}

                    <div className="mt-6">
                      <h3 className="text-lg font-bold text-slate-900 mb-3">Components Required</h3>
                      <div className="flex flex-wrap gap-2">
                        {project.components.map(c => (
                          <span key={c} className="px-3 py-1 bg-slate-50 border border-slate-200 rounded-full text-sm text-slate-600">{c}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'specs' && (
                  <div className="animate-fadeIn">
                     <h3 className="text-lg font-bold text-slate-900 mb-6">Technical Specifications</h3>
                     {project.specifications && project.specifications.length > 0 ? (
                       <div className="border border-slate-200 rounded-lg overflow-hidden">
                         <table className="w-full text-sm text-left">
                           <tbody className="divide-y divide-slate-200">
                             {project.specifications.map((spec, i) => (
                               <tr key={i} className={i % 2 === 0 ? 'bg-slate-50' : 'bg-white'}>
                                 <td className="px-6 py-4 font-medium text-slate-900 w-1/3 border-r border-slate-200">{spec.label}</td>
                                 <td className="px-6 py-4 text-slate-600 font-mono">{spec.value}</td>
                               </tr>
                             ))}
                           </tbody>
                         </table>
                       </div>
                     ) : (
                       <p className="text-slate-500 italic">No detailed specifications available for this project.</p>
                     )}
                     
                     <div className="mt-6 flex items-start p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
                       <FileText className="w-5 h-5 mr-2 flex-shrink-0" />
                       <p>Full datasheets for all components are included in the <strong>Documentation Package</strong> provided with every order.</p>
                     </div>
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-fadeIn">
                     <div className="flex items-center mb-8">
                       <div className="bg-yellow-50 p-4 rounded-xl text-center mr-8">
                         <span className="block text-4xl font-bold text-slate-900">{project.rating || '-'}</span>
                         <div className="flex text-yellow-400 justify-center my-1">
                           {[...Array(5)].map((_, i) => <Star key={i} className={`w-4 h-4 ${i < Math.floor(project.rating) ? 'fill-current' : 'text-slate-300'}`} />)}
                         </div>
                         <span className="text-xs text-slate-500">{project.reviewCount} Reviews</span>
                       </div>
                       <div>
                         <h3 className="text-lg font-bold text-slate-900">Student Feedback</h3>
                         <p className="text-slate-500 text-sm">Real reviews from engineering students who built this project.</p>
                       </div>
                     </div>

                     <div className="space-y-6">
                       {project.reviews && project.reviews.length > 0 ? (
                         project.reviews.map((review) => (
                           <div key={review.id} className="border-b border-slate-100 pb-6 last:border-0 last:pb-0">
                             <div className="flex justify-between items-start mb-2">
                               <div className="flex items-center">
                                 <div className="w-8 h-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs mr-3">
                                   {review.user.charAt(0)}
                                 </div>
                                 <span className="font-semibold text-slate-900 text-sm">{review.user}</span>
                               </div>
                               <span className="text-xs text-slate-400">{review.date}</span>
                             </div>
                             <div className="flex text-yellow-400 mb-2">
                               {[...Array(5)].map((_, i) => <Star key={i} className={`w-3 h-3 ${i < review.rating ? 'fill-current' : 'text-slate-300'}`} />)}
                             </div>
                             <p className="text-slate-600 text-sm">{review.comment}</p>
                           </div>
                         ))
                       ) : (
                         <p className="text-slate-500 italic">No reviews yet. Be the first to review!</p>
                       )}
                     </div>
                  </div>
                )}

                {activeTab === 'faqs' && (
                  <div className="animate-fadeIn space-y-4">
                     <h3 className="text-lg font-bold text-slate-900 mb-6">Frequently Asked Questions</h3>
                     {project.faqs && project.faqs.length > 0 ? (
                       project.faqs.map((faq, i) => (
                         <details key={i} className="group border border-slate-200 rounded-lg open:bg-slate-50">
                           <summary className="flex items-center justify-between p-4 cursor-pointer font-medium text-slate-900 list-none">
                             {faq.question}
                             <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform" />
                           </summary>
                           <div className="px-4 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-200/50 pt-2">
                             {faq.answer}
                           </div>
                         </details>
                       ))
                     ) : (
                       <p className="text-slate-500 italic">No specific FAQs for this project.</p>
                     )}
                     <div className="mt-8 pt-6 border-t border-slate-100">
                       <h4 className="font-bold text-slate-900 mb-2 text-sm">Still have questions?</h4>
                       <p className="text-sm text-slate-500 mb-4">Our support team is just a click away.</p>
                       <button className="text-orange-600 font-semibold text-sm hover:underline">Contact Support</button>
                     </div>
                  </div>
                )}
             </div>
          </div>

          {/* Custom Request Form */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-900">Have a custom requirement?</h3>
               <button onClick={() => setShowCustomForm(!showCustomForm)} className="text-sm text-orange-600 hover:text-orange-700 font-medium">
                 {showCustomForm ? 'Cancel' : 'Request Customization'}
               </button>
             </div>
             {showCustomForm && (
               <div className="animate-fadeIn">
                  {customSubmitSuccess ? (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center text-green-700">
                      <Check className="w-8 h-8 mx-auto mb-2" />
                      <p className="font-semibold">Request Received!</p>
                    </div>
                  ) : (
                    <form className="space-y-4">
                      <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        rows={4} placeholder="Describe requirement..." value={customRequestText} onChange={(e) => setCustomRequestText(e.target.value)}
                      ></textarea>
                      <div className="relative border-2 border-dashed border-slate-300 rounded-lg p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                        <input type="file" onChange={handleFileChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" />
                        <UploadCloud className="w-8 h-8 text-slate-400 mb-2 group-hover:text-orange-500 transition-colors" />
                        <span className="text-xs text-slate-500">{customFile ? customFile.name : 'Upload Reference File'}</span>
                      </div>
                      <button type="button" onClick={handleCustomSubmit} disabled={isSubmittingCustom} className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium flex justify-center items-center">
                        {isSubmittingCustom ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit Request'}
                      </button>
                    </form>
                  )}
               </div>
             )}
          </div>
        </div>

        {/* Right Column: Booking & Delivery */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-lg border border-slate-200 p-6 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">{project.isPreOrder ? 'Pre-Order Configuration' : 'Configure Order'}</h3>
            
            {project.isPreOrder && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                    <p className="font-bold flex items-center mb-1"><Clock className="w-4 h-4 mr-1" /> Releasing on {project.releaseDate}</p>
                    <p>Secure your kit today at current prices. Shipping starts from release date.</p>
                </div>
            )}
            
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
                <p className="text-xs text-slate-500">Kit + Code + Synopsis</p>
              </div>

              {/* Full Build Option */}
              <div 
                onClick={() => setSelectedPkg(PackageType.FULL_BUILD)}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${selectedPkg === PackageType.FULL_BUILD ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" /> Full Build</span>
                  <span className="text-sm font-bold text-slate-900">₹{project.priceBuild}</span>
                </div>
                <p className="text-xs text-slate-500">Ready to Demo Model</p>
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
               <h4 className="font-bold text-slate-900 text-sm mb-3">Package Inclusions:</h4>
               <ul className="space-y-2">
                 {features[selectedPkg].map((feat, i) => (
                   <li key={i} className="flex items-start text-xs text-slate-600">
                     <Check className="w-3 h-3 text-green-500 mr-2 mt-0.5" />
                     {feat}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="space-y-4">
               <div className="flex space-x-2">
                 <input 
                   type="text" 
                   maxLength={6}
                   placeholder="Enter Pincode"
                   value={pincode}
                   onChange={(e) => setPincode(e.target.value.replace(/\D/g,''))}
                   className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                 />
                 <button 
                   onClick={calculateDelivery}
                   className="bg-slate-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-slate-800"
                 >
                   Check
                 </button>
               </div>
               
               {deliveryDate && (
                 <div className="flex items-center text-sm text-green-700 bg-green-50 p-3 rounded-lg">
                   <Truck className="w-4 h-4 mr-2" />
                   Delivery by <strong>{deliveryDate}</strong>
                 </div>
               )}

               <button 
                 onClick={handleBooking}
                 className={`w-full py-4 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex justify-center items-center ${
                   !project.inStock && !project.isPreOrder 
                     ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                     : 'bg-orange-600 hover:bg-orange-700 text-white'
                 }`}
                 disabled={!project.inStock && !project.isPreOrder}
               >
                 {!project.inStock && !project.isPreOrder ? 'Out of Stock' : (project.isPreOrder ? 'Pre-Order Now' : 'Book Project Kit')}
               </button>
               
               <p className="text-center text-xs text-slate-400">
                 Secure payment via UPI, Card, or Netbanking
               </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
