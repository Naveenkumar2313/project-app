
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { PackageType, Project, Review, FlashSale } from '../types';
import { PROJECTS, MY_ORDERS, FLASH_SALES } from '../services/mockData';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useAuth } from '../contexts/AuthContext';
import { useReviews } from '../contexts/ReviewContext';
import { useNotification } from '../contexts/NotificationContext';
import { 
  Check, ShieldCheck, Download, Truck, Cpu, FileText, UploadCloud, 
  Loader2, Star, PlayCircle, MapPin, Share2, Facebook, Twitter, Linkedin, MessageCircle,
  ChevronDown, ChevronUp, AlertCircle, Clock, Users, TrendingUp, Heart, ThumbsUp, Camera, CheckCircle, Package, X, Zap
} from 'lucide-react';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user, isAuthenticated } = useAuth();
  const { getReviewsByProject, addReview, voteReview } = useReviews();
  const { addToast } = useNotification();
  
  const project = PROJECTS.find(p => p.id === id);
  const flashSale = FLASH_SALES.find(f => f.projectId === id && new Date(f.endTime) > new Date());

  const [selectedPkg, setSelectedPkg] = useState<PackageType>(PackageType.DIGITAL);
  const [activeImage, setActiveImage] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'reviews' | 'faqs'>('description');
  const [pincode, setPincode] = useState('');
  const [deliveryDate, setDeliveryDate] = useState<string | null>(null);
  
  // Reviews State
  const reviews = useMemo(() => project ? getReviewsByProject(project.id) : [], [project, getReviewsByProject]);
  const [sortBy, setSortBy] = useState<'recent' | 'helpful' | 'high' | 'low'>('helpful');
  const [showReviewModal, setShowReviewModal] = useState(false);
  
  // Review Form State
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewImage, setReviewImage] = useState<string | null>(null);
  
  // Custom Request State
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [customRequestText, setCustomRequestText] = useState('');
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [isSubmittingCustom, setIsSubmittingCustom] = useState(false);
  const [customSubmitSuccess, setCustomSubmitSuccess] = useState(false);
  
  // Flash Sale Timer
  const [timeLeft, setTimeLeft] = useState('');

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
    
    // Flash Sale Timer Logic
    if (flashSale) {
        const timer = setInterval(() => {
            const now = new Date().getTime();
            const distance = new Date(flashSale.endTime).getTime() - now;
            
            if (distance < 0) {
                clearInterval(timer);
                setTimeLeft('EXPIRED');
            } else {
                const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((distance % (1000 * 60)) / 1000);
                setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
            }
        }, 1000);
        return () => { clearInterval(interval); clearInterval(timer); };
    }

    return () => clearInterval(interval);
  }, [project, flashSale]);

  if (!project) return <div>Project not found</div>;

  const isWishlisted = isInWishlist(project.id);
  const hasPurchased = isAuthenticated && MY_ORDERS.some(o => o.projectId === project.id); // Check against mock orders for demo

  // Stock Logic
  const currentStock = project.inventory ? project.inventory[selectedPkg] : 0;
  const isOutOfStock = currentStock <= 0;
  
  // Review Calculations
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : '0.0';

  const getPrice = () => {
    // If flash sale is active and package is Digital or Kit (simplified for demo, usually specific variants)
    // Assuming flash sale applies to kit mainly or base price
    if (flashSale && selectedPkg === PackageType.HARDWARE_KIT) return flashSale.discountPrice;
    
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
    addToast('success', 'Added to cart!', 2000);
    navigate('/cart');
  };

  const calculateDelivery = () => {
    if (pincode.length !== 6) {
      addToast('error', "Please enter a valid 6-digit Pincode");
      return;
    }
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
  const handleCustomSubmit = async () => {
    if (!customRequestText) return addToast('warning', "Please describe your requirement.");
    setIsSubmittingCustom(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsSubmittingCustom(false);
    setCustomSubmitSuccess(true);
    addToast('success', 'Customization request sent!');
    setTimeout(() => { setShowCustomForm(false); setCustomSubmitSuccess(false); setCustomRequestText(''); setCustomFile(null); }, 2000);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    addReview({
        projectId: project.id,
        userId: user.id,
        userName: user.name,
        avatar: user.avatar,
        rating: reviewRating,
        comment: reviewComment,
        images: reviewImage ? [reviewImage] : [],
        isVerifiedPurchase: true, 
    });
    setShowReviewModal(false);
    setReviewComment('');
    setReviewRating(5);
    setReviewImage(null);
    addToast('success', 'Review Submitted Successfully!');
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const url = URL.createObjectURL(e.target.files[0]);
          setReviewImage(url);
      }
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
              {flashSale && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg flex items-center animate-pulse">
                      <Zap className="w-4 h-4 mr-2" aria-hidden="true" />
                      Flash Sale: {timeLeft} Left
                  </div>
              )}
              {project.isPreOrder && !flashSale && (
                  <div className="absolute top-4 left-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg flex items-center">
                      <Clock className="w-4 h-4 mr-2" aria-hidden="true" />
                      Pre-Order
                  </div>
              )}
            </div>
            
            {/* Social Proof Bar */}
            <div className="bg-red-50 px-6 py-2 flex items-center justify-between text-sm border-t border-b border-red-100">
               <div className="flex items-center text-red-600 font-medium">
                  <TrendingUp className="w-4 h-4 mr-2 animate-pulse" aria-hidden="true" />
                  Ordered {Math.floor(Math.random() * 15) + 5} times in the last 24 hours
               </div>
               <div className="flex items-center text-slate-600">
                  <Users className="w-4 h-4 mr-2" aria-hidden="true" />
                  <span className="font-bold mr-1">{viewersCount}</span> people viewing this now
               </div>
            </div>

            {project.images.length > 1 && (
              <div className="flex gap-2 p-4 overflow-x-auto">
                {project.images.map((img, idx) => (
                  <button 
                    key={idx} 
                    onClick={() => setActiveImage(img)}
                    aria-label={`View image ${idx + 1}`}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${activeImage === img ? 'border-orange-500 ring-2 ring-orange-200' : 'border-transparent hover:border-slate-300'}`}
                  >
                    <img src={img} alt={`Product view ${idx + 1}`} loading="lazy" className="w-full h-full object-cover" />
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
                      {Number(averageRating) > 0 && <span className="flex items-center text-yellow-500 text-sm font-bold">
                        <Star className="w-4 h-4 fill-current mr-1" aria-hidden="true" /> {averageRating}
                      </span>}
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 mb-2">{project.title}</h1>
                 </div>
                 
                 {/* Social Share */}
                 <div className="flex items-center space-x-2">
                   <button onClick={() => handleShare('whatsapp')} className="p-2 bg-green-50 text-green-600 rounded-full hover:bg-green-100" aria-label="Share on WhatsApp"><MessageCircle className="w-5 h-5" /></button>
                   <button onClick={() => handleShare('linkedin')} className="p-2 bg-blue-50 text-blue-700 rounded-full hover:bg-blue-100" aria-label="Share on LinkedIn"><Linkedin className="w-5 h-5" /></button>
                   <button onClick={() => handleShare('twitter')} className="p-2 bg-sky-50 text-sky-500 rounded-full hover:bg-sky-100" aria-label="Share on Twitter"><Twitter className="w-5 h-5" /></button>
                 </div>
              </div>
            </div>
          </div>

          {/* Content Tabs (Unchanged logic, condensed for brevity) */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
             <div className="flex border-b border-slate-200 overflow-x-auto" role="tablist" aria-label="Project Details">
                {['description', 'specs', 'reviews', 'faqs'].map((tab) => (
                  <button
                    key={tab}
                    role="tab"
                    aria-selected={activeTab === tab}
                    aria-controls={`${tab}-panel`}
                    id={`${tab}-tab`}
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
             
             <div className="p-8 min-h-[300px]" role="tabpanel" id={`${activeTab}-panel`} aria-labelledby={`${activeTab}-tab`}>
                {activeTab === 'description' && (
                  <div className="animate-fadeIn space-y-6">
                    <div>
                       <h3 className="text-lg font-bold text-slate-900 mb-3">Project Overview</h3>
                       <p className="text-slate-600 leading-relaxed">{project.description}</p>
                    </div>
                    
                    {project.videoUrl && (
                      <div className="mt-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-3 flex items-center"><PlayCircle className="w-5 h-5 mr-2 text-red-500" aria-hidden="true" /> Video Demonstration</h3>
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
                  </div>
                )}

                {activeTab === 'reviews' && (
                  <div className="animate-fadeIn">
                     {/* ... reviews content ... */}
                     <div className="flex flex-col md:flex-row items-center mb-8 bg-slate-50 p-6 rounded-xl border border-slate-200">
                       <div className="text-center mr-0 md:mr-8 mb-4 md:mb-0">
                         <span className="block text-5xl font-black text-slate-900">{averageRating}</span>
                         <div className="flex text-yellow-400 justify-center my-2">
                           {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < Math.round(Number(averageRating)) ? 'fill-current' : 'text-slate-300'}`} aria-hidden="true" />)}
                         </div>
                         <span className="text-sm text-slate-500 font-medium">{reviews.length} Verified Reviews</span>
                       </div>
                       
                       <div className="flex-1 w-full">
                          {/* Mock Bars */}
                          {[5, 4, 3, 2, 1].map((star) => {
                             const count = reviews.filter(r => Math.round(r.rating) === star).length;
                             const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                             return (
                               <div key={star} className="flex items-center text-xs mb-1">
                                  <span className="w-8 font-medium text-slate-600">{star} ★</span>
                                  <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden mx-2">
                                     <div className="bg-yellow-400 h-full rounded-full" style={{ width: `${percent}%` }}></div>
                                  </div>
                                  <span className="w-8 text-right text-slate-400">{count}</span>
                               </div>
                             );
                          })}
                       </div>

                       <div className="ml-0 md:ml-8 mt-4 md:mt-0">
                          {hasPurchased ? (
                             <button onClick={() => setShowReviewModal(true)} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md hover:bg-slate-800 transition-transform hover:-translate-y-0.5">Write a Review</button>
                          ) : (
                             <div className="text-center">
                               <p className="text-xs text-slate-500 mb-1">Purchased this project?</p>
                               <Link to="/login" className="text-xs font-bold text-orange-600 hover:underline">Login to Review</Link>
                             </div>
                          )}
                       </div>
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
                      <Check className="w-8 h-8 mx-auto mb-2" aria-hidden="true" />
                      <p className="font-semibold">Request Received!</p>
                    </div>
                  ) : (
                    <form className="space-y-4">
                      <textarea 
                        className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:border-orange-500" 
                        rows={4} placeholder="Describe requirement..." value={customRequestText} onChange={(e) => setCustomRequestText(e.target.value)}
                        aria-label="Description of custom requirement"
                      ></textarea>
                      <button type="button" onClick={handleCustomSubmit} disabled={isSubmittingCustom} className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium flex justify-center items-center">
                        {isSubmittingCustom ? <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" /> : 'Submit Request'}
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
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-slate-900">{project.isPreOrder ? 'Pre-Order Config' : 'Configure Order'}</h3>
                <button 
                  onClick={() => toggleWishlist(project.id)}
                  className={`p-2 rounded-full border transition-all ${isWishlisted ? 'bg-red-50 border-red-200 text-red-500' : 'border-slate-200 text-slate-400 hover:text-red-500'}`}
                  title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                  aria-label={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
                >
                  <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} aria-hidden="true" />
                </button>
            </div>
            
            {project.isPreOrder && (
                <div className="mb-6 p-4 bg-purple-50 border border-purple-100 rounded-lg text-sm text-purple-800">
                    <p className="font-bold flex items-center mb-1"><Clock className="w-4 h-4 mr-1" aria-hidden="true" /> Releasing on {project.releaseDate}</p>
                    <p>Secure your kit today at current prices. Shipping starts from release date.</p>
                </div>
            )}
            
            <div className="space-y-3 mb-8">
              {/* Digital Option */}
              <div 
                onClick={() => setSelectedPkg(PackageType.DIGITAL)}
                onKeyDown={(e) => e.key === 'Enter' && setSelectedPkg(PackageType.DIGITAL)}
                role="button"
                tabIndex={0}
                aria-pressed={selectedPkg === PackageType.DIGITAL}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all ${selectedPkg === PackageType.DIGITAL ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900 flex items-center"><Download className="w-4 h-4 mr-2" aria-hidden="true" /> Digital Only</span>
                  <span className="text-sm font-bold text-slate-900">₹{project.priceDigital}</span>
                </div>
                <p className="text-xs text-slate-500">Code, Report & Synopsis</p>
                <p className="text-[10px] text-green-600 font-bold mt-1">Instant Download</p>
              </div>

              {/* Hardware Kit Option */}
              <div 
                onClick={() => project.inventory[PackageType.HARDWARE_KIT] > 0 ? setSelectedPkg(PackageType.HARDWARE_KIT) : null}
                onKeyDown={(e) => e.key === 'Enter' && project.inventory[PackageType.HARDWARE_KIT] > 0 && setSelectedPkg(PackageType.HARDWARE_KIT)}
                role="button"
                tabIndex={project.inventory[PackageType.HARDWARE_KIT] > 0 ? 0 : -1}
                aria-disabled={project.inventory[PackageType.HARDWARE_KIT] <= 0}
                aria-pressed={selectedPkg === PackageType.HARDWARE_KIT}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all relative ${
                    selectedPkg === PackageType.HARDWARE_KIT ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'
                } ${project.inventory[PackageType.HARDWARE_KIT] <= 0 ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900 flex items-center"><Cpu className="w-4 h-4 mr-2" aria-hidden="true" /> Hardware Kit</span>
                  <span className="text-sm font-bold text-slate-900 flex items-center">
                      {flashSale && <span className="line-through text-slate-400 text-xs mr-2">₹{project.priceKit}</span>}
                      ₹{flashSale ? flashSale.discountPrice : project.priceKit}
                  </span>
                </div>
                <p className="text-xs text-slate-500">Kit + Code + Synopsis</p>
                {project.inventory[PackageType.HARDWARE_KIT] <= 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Out of Stock</span>
                )}
                {flashSale && (
                    <span className="absolute -top-3 -right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold shadow-sm animate-bounce">FLASH DEAL</span>
                )}
              </div>

              {/* Full Build Option */}
              <div 
                onClick={() => project.inventory[PackageType.FULL_BUILD] > 0 ? setSelectedPkg(PackageType.FULL_BUILD) : null}
                onKeyDown={(e) => e.key === 'Enter' && project.inventory[PackageType.FULL_BUILD] > 0 && setSelectedPkg(PackageType.FULL_BUILD)}
                role="button"
                tabIndex={project.inventory[PackageType.FULL_BUILD] > 0 ? 0 : -1}
                aria-disabled={project.inventory[PackageType.FULL_BUILD] <= 0}
                aria-pressed={selectedPkg === PackageType.FULL_BUILD}
                className={`cursor-pointer border-2 rounded-lg p-4 transition-all relative ${
                    selectedPkg === PackageType.FULL_BUILD ? 'border-orange-500 bg-orange-50/50' : 'border-slate-200 hover:border-slate-300'
                } ${project.inventory[PackageType.FULL_BUILD] <= 0 ? 'opacity-50 cursor-not-allowed bg-slate-50' : ''}`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-semibold text-slate-900 flex items-center"><ShieldCheck className="w-4 h-4 mr-2" aria-hidden="true" /> Full Build</span>
                  <span className="text-sm font-bold text-slate-900">₹{project.priceBuild}</span>
                </div>
                <p className="text-xs text-slate-500">Ready to Demo Model</p>
                {project.inventory[PackageType.FULL_BUILD] <= 0 && (
                    <span className="absolute top-2 right-2 bg-red-600 text-white text-[10px] px-2 py-0.5 rounded font-bold">Out of Stock</span>
                )}
              </div>
            </div>

            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 mb-8">
               <h4 className="font-bold text-slate-900 text-sm mb-3">Package Inclusions:</h4>
               <ul className="space-y-2">
                 {features[selectedPkg].map((feat, i) => (
                   <li key={i} className="flex items-start text-xs text-slate-600">
                     <Check className="w-3 h-3 text-green-500 mr-2 mt-0.5" aria-hidden="true" />
                     {feat}
                   </li>
                 ))}
               </ul>
            </div>

            <div className="space-y-4">
               {/* ... pincode input ... */}
               <div className="flex space-x-2">
                 <input 
                   type="text" 
                   maxLength={6}
                   placeholder="Enter Pincode"
                   value={pincode}
                   onChange={(e) => setPincode(e.target.value.replace(/\D/g,''))}
                   className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-orange-500 focus:border-orange-500"
                   aria-label="Enter Delivery Pincode"
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
                   <Truck className="w-4 h-4 mr-2" aria-hidden="true" />
                   Delivery by <strong>{deliveryDate}</strong>
                 </div>
               )}

               <button 
                 onClick={handleBooking}
                 className={`w-full py-4 rounded-xl font-bold shadow-lg transition-transform hover:-translate-y-1 flex justify-center items-center ${
                   isOutOfStock && !project.isPreOrder 
                     ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                     : 'bg-orange-600 hover:bg-orange-700 text-white'
                 }`}
                 disabled={isOutOfStock && !project.isPreOrder}
               >
                 {isOutOfStock && !project.isPreOrder ? 'Out of Stock' : (project.isPreOrder ? 'Pre-Order Now' : 'Book Project Kit')}
               </button>
               
               <p className="text-center text-xs text-slate-400">
                 Secure payment via UPI, Card, or Netbanking
               </p>
            </div>
          </div>
        </div>
      </div>

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby="review-modal-title">
           {/* ... modal content ... */}
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn relative">
              <button onClick={() => setShowReviewModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600" aria-label="Close modal"><X className="w-6 h-6" /></button>
              
              <h2 id="review-modal-title" className="text-xl font-bold text-slate-900 mb-1">Write a Review</h2>
              <p className="text-sm text-slate-500 mb-6">Share your experience with {project.title}</p>
              
              <form onSubmit={handleSubmitReview} className="space-y-5">
                 <div className="flex justify-center space-x-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                       <button key={star} type="button" onClick={() => setReviewRating(star)} aria-label={`Rate ${star} stars`} className={`hover:scale-110 transition-transform p-1`}>
                          <Star className={`w-8 h-8 ${star <= reviewRating ? 'text-yellow-400 fill-current' : 'text-slate-200'}`} aria-hidden="true" />
                       </button>
                    ))}
                 </div>
                 
                 <div>
                    <label htmlFor="review-comment" className="block text-sm font-medium text-slate-700 mb-2">Your Review</label>
                    <textarea 
                       id="review-comment"
                       required
                       value={reviewComment}
                       onChange={(e) => setReviewComment(e.target.value)}
                       rows={4} 
                       className="w-full border border-slate-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                       placeholder="What did you like or dislike?"
                    ></textarea>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Add Photo (Optional)</label>
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-4 text-center hover:bg-slate-50 cursor-pointer relative">
                       <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" aria-label="Upload photo" />
                       {reviewImage ? (
                          <div className="relative inline-block">
                             <img src={reviewImage} alt="Preview" className="h-20 rounded-md border border-slate-200" />
                             <button type="button" onClick={(e) => { e.preventDefault(); setReviewImage(null); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-0.5" aria-label="Remove photo"><X className="w-3 h-3" /></button>
                          </div>
                       ) : (
                          <div className="flex flex-col items-center text-slate-400">
                             <Camera className="w-6 h-6 mb-1" aria-hidden="true" />
                             <span className="text-xs">Click to upload</span>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="pt-2">
                    <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 transition-colors">Submit Review</button>
                 </div>
              </form>
           </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetail;
