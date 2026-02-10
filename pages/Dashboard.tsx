
import React, { useState, useEffect } from 'react';
import { DataManager } from '../services/dataManager';
import { ShippingService } from '../services/shippingService';
import { useNotification } from '../contexts/NotificationContext';
import { OrderStatus, Order, PackageType, ProjectTier, TrackingEvent } from '../types';
import { generatePlagiarismScore, getStatusColor } from '../services/reportUtils';
import { 
  Package, Lock, Unlock, CheckCircle, Clock, ShieldAlert, Download, 
  Settings, Ticket, MessageSquare, Map, Eye, Video, ThumbsUp, X, Star, MapPin, Gift, Award, Wifi, WifiOff, FileText, FileCode, Printer, ShieldCheck, AlertTriangle, ScanLine, Wrench, FileSpreadsheet,
  AlertOctagon, ArrowRight
} from 'lucide-react';
import { CodeViewer, CircuitViewer, ModelViewer3D } from '../components/TechViewers';
import { PlagiarismReport } from '../components/PlagiarismReport';
import { QualityCertificate } from '../components/QualityCertificate';
import { GSTInvoice } from '../components/GSTInvoice';
import { Link } from 'react-router-dom';

// Simulated File Types for Demo
const MOCK_FILES = {
  CODE: 'main.py',
  CIRCUIT: 'schematic.svg',
  MODEL: 'chassis.obj',
  REPORT: 'report.pdf'
};

const SAMPLE_CODE = `
import cv2
import face_recognition

# Initialize Camera
video_capture = cv2.VideoCapture(0)

while True:
    ret, frame = video_capture.read()
    
    # Detect faces
    face_locations = face_recognition.face_locations(frame)
    
    for (top, right, bottom, left) in face_locations:
        cv2.rectangle(frame, (left, top), (right, bottom), (0, 0, 255), 2)

    cv2.imshow('Video', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break
`;

const OrderSkeleton = () => (
  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 space-y-6 animate-pulse">
     <div className="flex justify-between">
        <div className="space-y-2">
           <div className="h-4 w-24 bg-slate-200 rounded"></div>
           <div className="h-8 w-64 bg-slate-200 rounded"></div>
        </div>
        <div className="h-10 w-32 bg-slate-200 rounded"></div>
     </div>
     <div className="h-2 bg-slate-100 rounded"></div>
     <div className="flex gap-4">
        <div className="h-24 w-1/2 bg-slate-100 rounded"></div>
        <div className="h-24 w-1/2 bg-slate-100 rounded"></div>
     </div>
  </div>
);

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'support'>('orders');
  const { addToast } = useNotification();
  // Load data from Manager
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState(DataManager.getTickets());
  const [projects] = useState(DataManager.getProjects());
  const [isLoading, setIsLoading] = useState(true);
  
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Modal States
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [trackingTimeline, setTrackingTimeline] = useState<TrackingEvent[]>([]);
  
  const [viewerType, setViewerType] = useState<'NONE' | 'CODE' | 'CIRCUIT' | '3D' | 'REPORT' | 'CERTIFICATE' | 'INVOICE'>('NONE');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [defectModalOpen, setDefectModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Download State
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

  // Initial Load
  useEffect(() => {
    setIsLoading(true);
    // Simulate data fetch delay
    setTimeout(() => {
        setOrders(DataManager.getOrders());
        setTickets(DataManager.getTickets());
        setIsLoading(false);
    }, 800);
  }, []);

  // Offline Detection
  useEffect(() => {
    const handleOnline = () => setIsOffline(false);
    const handleOffline = () => setIsOffline(true);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const steps = [
    OrderStatus.PAYMENT_VERIFIED,
    OrderStatus.PROCURING,
    OrderStatus.CODING,
    OrderStatus.TESTING,
    OrderStatus.DISPATCHED,
    OrderStatus.DELIVERED
  ];

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    );
    setOrders(updatedOrders);
    const updatedOrder = updatedOrders.find(o => o.id === orderId);
    if (updatedOrder) DataManager.updateOrder(updatedOrder);
  };

  const advanceStatus = (orderId: string) => {
    const order = orders.find(o => o.id === orderId);
    if (!order) return;
    
    const currentIndex = steps.indexOf(order.status);
    if (currentIndex < steps.length - 1) {
      updateOrderStatus(orderId, steps[currentIndex + 1]);
    }
  };

  const getTicketStatusColor = (status: string) => {
    switch(status) {
      case 'Open': return 'bg-red-100 text-red-800';
      case 'In Progress': return 'bg-blue-100 text-blue-800';
      case 'Resolved': return 'bg-green-100 text-green-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getDaysLeft = (dateStr?: string) => {
    if (!dateStr) return 0;
    const diff = new Date(dateStr).getTime() - new Date().getTime();
    return Math.max(0, Math.ceil(diff / (1000 * 3600 * 24)));
  };

  // Check if order was delivered within last 48 hours for defect reporting
  const isDefectReportEligible = (order: Order) => {
    if (order.status !== OrderStatus.DELIVERED || !order.deliveryDate) return false;
    const deliveryTime = new Date(order.deliveryDate).getTime();
    const now = new Date().getTime();
    const hoursSinceDelivery = (now - deliveryTime) / (1000 * 60 * 60);
    return hoursSinceDelivery <= 48;
  };

  const handleDownload = (filename: string) => {
    if (downloadingFile) return; 
    setDownloadingFile(filename);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingFile(null);
            addToast('success', `${filename} downloaded successfully!`);
          }, 500);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleViewAsset = (order: Order, type: 'CODE' | 'CIRCUIT' | '3D' | 'REPORT' | 'CERTIFICATE' | 'INVOICE') => {
    setSelectedOrder(order);
    setViewerType(type);
  };

  const openTracking = (order: Order) => {
    setSelectedOrder(order);
    setTrackingTimeline(ShippingService.getTrackingDetails(order.id));
    setTrackingModalOpen(true);
  };

  const handleCopyReferral = () => {
      navigator.clipboard.writeText("PYG-8821-XREF");
      addToast('info', 'Referral Code copied to clipboard!');
  }

  // Only show simulate button in dev mode or for demo purposes explicitly allowed
  const showDevTools = process.env.NODE_ENV === 'development' || true; // Keeping true for this demo as requested

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* ... Network Status ... */}
      {isOffline && (
        <div className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center justify-center animate-pulse">
           <WifiOff className="w-4 h-4 mr-2" />
           <span className="text-sm font-medium">You are currently offline. Viewing cached content.</span>
        </div>
      )}

      {/* ... Header & Widgets ... */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 animate-slideUp">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
           <span className="text-xs text-slate-400 font-mono">Session ID: PYG-8821X</span>
        </div>
        
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <button onClick={() => setActiveTab('orders')} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}><Package className="w-4 h-4 mr-2" /> My Orders</button>
           <button onClick={() => setActiveTab('support')} className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'support' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}><Ticket className="w-4 h-4 mr-2" /> Support Tickets</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slideUp" style={{animationDelay: '0.1s'}}>
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden transform hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Award className="w-24 h-24" /></div>
            <div className="flex justify-between items-start mb-4 relative z-10">
                <div>
                    <h3 className="text-sm font-medium text-indigo-200 uppercase tracking-wide">Pygenic Rewards</h3>
                    <p className="text-3xl font-bold mt-1">450 <span className="text-sm font-normal text-indigo-200">Points</span></p>
                </div>
                <div className="bg-white/10 p-2 rounded-lg"><Award className="w-6 h-6" /></div>
            </div>
            <div className="text-xs text-indigo-200 relative z-10">Earn 1 point for every ₹100 spent. Redeemable on next purchase.</div>
        </div>

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden transform hover:scale-[1.02] transition-transform">
            <div className="absolute top-0 right-0 p-4 opacity-10"><Gift className="w-24 h-24" /></div>
            <h3 className="text-lg font-bold mb-1 relative z-10">Refer a Friend & Earn ₹200</h3>
            <p className="text-xs text-orange-100 mb-4 relative z-10">They get ₹200 off their first kit order, and you get ₹200 in credits!</p>
            <div className="flex bg-white/20 backdrop-blur-sm rounded-lg p-1 relative z-10">
                <input readOnly value="PYG-8821-XREF" className="bg-transparent border-none text-white text-sm font-mono font-bold px-3 py-1 flex-1 focus:outline-none" />
                <button onClick={handleCopyReferral} className="bg-white text-orange-600 px-3 py-1 rounded-md text-xs font-bold hover:bg-orange-50">Copy</button>
            </div>
        </div>
      </div>
      
      {/* Active Orders Tab */}
      {activeTab === 'orders' && (
        <div className="space-y-8">
          {isLoading ? (
              <>
                <OrderSkeleton />
                <OrderSkeleton />
              </>
          ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-300 animate-fadeIn">
                  <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Package className="w-12 h-12 text-slate-300" />
                  </div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-2">No orders yet</h3>
                  <p className="text-slate-500 mb-8">Start building your dream project today!</p>
                  <Link to="/" className="inline-flex items-center px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white font-bold rounded-lg transition-colors shadow-lg">
                      Browse Projects <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
              </div>
          ) : (
            <div className="animate-fadeIn space-y-8">
                {orders.map((order) => {
                    const currentStepIndex = steps.indexOf(order.status);
                    const plagiarismScore = generatePlagiarismScore(order.projectId);
                    const isDispatched = order.status === OrderStatus.DISPATCHED || order.status === OrderStatus.DELIVERED;
                    const daysLeft = getDaysLeft(order.supportExpiryDate);
                    const isPhysical = order.packageType !== PackageType.DIGITAL;
                    const isFullBuild = order.packageType === PackageType.FULL_BUILD;
                    
                    return (
                    <div key={order.id} className="space-y-6">
                        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 relative overflow-hidden">
                        {/* Header Actions */}
                        <div className="absolute top-4 right-4 z-20 flex flex-col items-end gap-2">
                            <div className="flex gap-2">
                            <button onClick={() => handleViewAsset(order, 'INVOICE')} className="flex items-center space-x-2 text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50 px-3 py-1.5 rounded-full border border-slate-300 shadow-sm transition-colors">
                                <FileSpreadsheet className="w-3 h-3 text-green-600" /><span>Invoice</span>
                            </button>

                            {showDevTools && order.status !== OrderStatus.DELIVERED && (
                                <button onClick={() => advanceStatus(order.id)} className="flex items-center space-x-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full border border-slate-300 transition-colors" title="Developer Tool: Advance Status">
                                    <Settings className="w-3 h-3" /><span>Simulate Admin</span>
                                </button>
                            )}
                            {order.status === OrderStatus.DELIVERED && !order.isFeedbackSubmitted && (
                                <button onClick={() => { setSelectedOrder(order); setFeedbackModalOpen(true); }} className="flex items-center space-x-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-700 px-3 py-1.5 rounded-full shadow-sm transition-colors">
                                    <ThumbsUp className="w-3 h-3" /><span>Leave Review</span>
                                </button>
                            )}
                            </div>

                            <div className="flex gap-2">
                            {isPhysical && (
                                <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 bg-purple-50 px-3 py-1.5 rounded-full border border-purple-200" title="7-Day Replacement Guarantee">
                                <ShieldCheck className="w-3 h-3" />
                                <span>Replacement Guarantee</span>
                                </div>
                            )}
                            {daysLeft > 0 ? (
                                <div className="flex items-center space-x-2 text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full border border-blue-200"><Clock className="w-3 h-3" /><span>Support: {daysLeft} Days Left</span></div>
                            ) : (
                                <div className="flex items-center space-x-2 text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200"><Clock className="w-3 h-3" /><span>Support Expired</span></div>
                            )}
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10">
                            <div>
                            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Order #{order.id}</span>
                            <h3 className="text-2xl font-bold text-slate-900 mt-1">{order.projectTitle}</h3>
                            <div className="flex items-center mt-3 gap-2">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{order.packageType}</span>
                                {isPhysical && (
                                <>
                                    {order.status !== OrderStatus.DELIVERED ? (
                                    <button onClick={() => openTracking(order)} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer transition-colors"><Map className="w-3 h-3 mr-1" /> Track Shipment</button>
                                    ) : (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" /> Delivered</span>
                                    )}
                                </>
                                )}
                            </div>
                            </div>
                            <div className="mt-4 md:mt-0 text-right pr-4 md:pr-0">
                            <p className="text-sm text-slate-500">Est. Delivery</p> 
                            <span className="text-lg font-semibold text-slate-900">{order.estimatedDelivery}</span>
                            </div>
                        </div>

                        {/* Stepper UI */}
                        <div className="relative mb-12 px-4">
                            <div className="absolute top-1/2 left-0 w-full h-1 bg-slate-100 -translate-y-1/2 rounded-full"></div>
                            <div className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 rounded-full transition-all duration-700 ease-in-out" style={{ width: `${(currentStepIndex / (steps.length - 1)) * 100}%` }}></div>
                            <div className="relative flex justify-between w-full">
                                {steps.map((step, idx) => {
                                const isCompleted = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                return (
                                    <div key={step} className="flex flex-col items-center group">
                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 border-4 transition-all duration-300 ${isCompleted ? 'bg-orange-500 border-orange-200 text-white shadow-md scale-110' : 'bg-white border-slate-200 text-slate-300'}`}>
                                        {isCompleted ? <CheckCircle className="w-5 h-5" /> : <div className="w-2.5 h-2.5 rounded-full bg-slate-200" />}
                                    </div>
                                    <span className={`text-xs mt-3 font-medium transition-colors duration-300 ${isCurrent ? 'text-orange-600 font-bold' : isCompleted ? 'text-slate-700' : 'text-slate-400'}`}>{step}</span>
                                    </div>
                                );
                                })}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Plagiarism Report Section */}
                            <div className={`rounded-lg p-5 flex items-center justify-between border ${getStatusColor(plagiarismScore)}`}>
                                <div className="flex items-center">
                                <ShieldAlert className="w-6 h-6 mr-4 opacity-80" />
                                <div>
                                    <h4 className="text-sm font-bold">Plagiarism Report</h4>
                                    <p className="text-xs mt-1 opacity-90">Similarity: <span className="font-mono font-bold">{plagiarismScore}%</span> (Safe)</p>
                                </div>
                                </div>
                                <button onClick={() => handleViewAsset(order, 'REPORT')} className="text-xs bg-white/80 hover:bg-white border border-current px-4 py-2 rounded-md font-semibold transition-colors shadow-sm flex items-center"><FileText className="w-3 h-3 mr-1" /> View</button>
                            </div>

                            {/* QA & Verification (Full Build Only) */}
                            {isFullBuild && (
                            <div className="rounded-lg p-5 flex items-center justify-between border bg-slate-50 border-slate-200">
                                <div className="flex items-center">
                                    <ScanLine className="w-6 h-6 mr-4 text-slate-500" />
                                    <div>
                                    <h4 className="text-sm font-bold text-slate-900">Quality & Authenticity</h4>
                                    <p className="text-xs mt-1 text-slate-500">Verify components & certificate</p>
                                    </div>
                                </div>
                                <button onClick={() => { setSelectedOrder(order); setVerifyModalOpen(true); }} className="text-xs bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-semibold transition-colors shadow-sm">Verify</button>
                            </div>
                            )}
                        </div>
                        
                        {/* Defect Reporting */}
                        {isDefectReportEligible(order) && (
                            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center animate-fadeIn">
                            <div className="flex items-center text-red-700 text-sm"><AlertTriangle className="w-5 h-5 mr-2" /><span><strong>Defect Reporting Active:</strong> You can report damaged components for free replacement within 48 hours.</span></div>
                            <button onClick={() => { setSelectedOrder(order); setDefectModalOpen(true); }} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded text-xs font-bold hover:bg-red-50">Report Issue</button>
                            </div>
                        )}
                        </div>
                    </div>
                    );
                })}
            </div>
          )}
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'support' && (
         <div className="space-y-6 animate-fadeIn">
            {/* ... Ticket UI ... */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Recent Support Tickets</h3>
                  <Link to="/help" className="text-xs font-semibold text-orange-600 hover:text-orange-700">+ Raise New Ticket</Link>
               </div>
               {tickets.length > 0 ? (
                 <div className="divide-y divide-slate-100">
                   {tickets.map(ticket => (
                     <Link to={`/ticket/${ticket.id}`} key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors block group">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">{ticket.type}</span>
                              </div>
                              <h4 className="text-lg font-semibold text-slate-900 group-hover:text-orange-600 transition-colors">{ticket.subject}</h4>
                           </div>
                           <span className="text-xs text-slate-400 whitespace-nowrap">{new Date(ticket.date).toLocaleDateString()}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100 truncate">"{ticket.message}"</p>
                     </Link>
                   ))}
                 </div>
               ) : (
                 <div className="p-12 text-center text-slate-500"><Ticket className="w-12 h-12 mx-auto text-slate-300 mb-3" /><p>No support tickets raised yet.</p></div>
               )}
            </div>
         </div>
      )}

      {/* --- MODALS --- */}
      {/* Robust Tracking Modal */}
      {trackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setTrackingModalOpen(false)}>
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-pop flex flex-col max-h-[85vh]" onClick={e => e.stopPropagation()}>
              <div className="p-4 border-b flex justify-between items-center bg-slate-50 shrink-0">
                 <div>
                    <h3 className="font-bold text-slate-900 flex items-center"><Map className="w-4 h-4 mr-2" /> Shipment Tracking</h3>
                    <p className="text-xs text-slate-500 mt-0.5">AWB: {selectedOrder.trackingNumber || 'PENDING'}</p>
                 </div>
                 <button onClick={() => setTrackingModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6">
                 {/* Visual Map Header */}
                 <div className="relative h-40 bg-slate-200 rounded-lg mb-8 overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-60"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                       <div className="bg-white/90 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-bold text-slate-800 flex items-center">
                          <span className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></span>
                          {selectedOrder.status}
                       </div>
                    </div>
                 </div>

                 {/* Timeline */}
                 <div className="relative pl-4 border-l-2 border-slate-200 space-y-8">
                    {trackingTimeline.map((event, idx) => (
                       <div key={idx} className="relative animate-slideUp" style={{animationDelay: `${idx * 0.1}s`}}>
                          <div className={`absolute -left-[21px] top-0 w-4 h-4 rounded-full border-2 ${idx === 0 ? 'bg-orange-500 border-orange-500' : 'bg-white border-slate-300'}`}></div>
                          <div>
                             <span className="text-xs text-slate-400 font-mono mb-1 block">{event.date}</span>
                             <h4 className={`text-sm font-bold ${idx === 0 ? 'text-slate-900' : 'text-slate-600'}`}>{event.status}</h4>
                             <p className="text-xs text-slate-500">{event.location}</p>
                             <p className="text-xs text-slate-500 mt-1">{event.description}</p>
                          </div>
                       </div>
                    ))}
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Tech Viewer Modal */}
      {viewerType !== 'NONE' && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className={`bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-pop ${viewerType === '3D' ? 'bg-slate-900' : ''}`}>
              <div className={`p-4 border-b flex justify-between items-center ${viewerType === '3D' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'}`}>
                 <h3 className="font-bold flex items-center">
                    {/* ... Icon Logic ... */}
                    {viewerType} Viewer
                 </h3>
                 <div className="flex items-center space-x-2">
                   {(viewerType === 'REPORT' || viewerType === 'CERTIFICATE' || viewerType === 'INVOICE') && (
                     <button className="text-xs flex items-center bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors text-slate-800" onClick={() => window.print()}>
                        <Printer className="w-3 h-3 mr-1" /> Print / Save PDF
                     </button>
                   )}
                   <button onClick={() => setViewerType('NONE')}><X className="w-5 h-5 opacity-70 hover:opacity-100" /></button>
                 </div>
              </div>
              <div className="flex-1 overflow-hidden relative bg-slate-100">
                 {viewerType === 'CODE' && <div className="h-full p-4"><CodeViewer code={SAMPLE_CODE} language="python" /></div>}
                 {viewerType === 'CIRCUIT' && <CircuitViewer />}
                 {viewerType === '3D' && <div className="h-full p-4 bg-black"><ModelViewer3D /></div>}
                 {viewerType === 'REPORT' && (
                   <PlagiarismReport 
                      project={projects.find(p => p.id === selectedOrder.projectId) || projects[0]} 
                      orderId={selectedOrder.id} 
                      score={generatePlagiarismScore(selectedOrder.projectId)} 
                    />
                 )}
                 {viewerType === 'CERTIFICATE' && (
                    <QualityCertificate 
                      orderId={selectedOrder.id}
                      projectTitle={selectedOrder.projectTitle}
                      date={selectedOrder.deliveryDate || new Date().toISOString()}
                    />
                 )}
                 {viewerType === 'INVOICE' && (
                    <GSTInvoice 
                      orderId={selectedOrder.id}
                      customerName="Student" 
                      projectTitle={selectedOrder.projectTitle}
                      packageType={selectedOrder.packageType}
                      amount={999}
                      date={selectedOrder.orderDate}
                    />
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Feedback & Other Modals */}
      {feedbackModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-pop">
              {/* ... Feedback Form ... */}
              <div className="text-center mb-6"><h3 className="text-xl font-bold text-slate-900">Rate Your Experience</h3></div>
              <div className="flex justify-center space-x-2 mb-6">
                 {[1, 2, 3, 4, 5].map((star) => (<button key={star} className="text-yellow-400 hover:scale-110 transition-transform"><Star className="w-8 h-8 fill-current" /></button>))}
              </div>
              <div className="flex gap-3">
                 <button onClick={() => setFeedbackModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                 <button onClick={() => { setFeedbackModalOpen(false); addToast('success', "Thank you!"); }} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">Submit</button>
              </div>
           </div>
        </div>
      )}

      {verifyModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-pop">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 flex items-center"><ScanLine className="w-5 h-5 mr-2" /> Component Verification</h3>
               <button onClick={() => setVerifyModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
             </div>
             {/* ... Verification List ... */}
             <div className="space-y-4 mb-6">
               {['Microcontroller', 'Sensor', 'Driver'].map((part, i) => (
                 <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg animate-slideUp" style={{animationDelay: `${i*0.1}s`}}>
                    <span className="font-bold text-sm text-slate-800">{part}</span>
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded"><CheckCircle className="w-3 h-3 mr-1" /> Authentic</span>
                 </div>
               ))}
             </div>
           </div>
        </div>
      )}

      {defectModalOpen && selectedOrder && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-pop">
               {/* ... Defect Form ... */}
               <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                 <h3 className="text-lg font-bold text-red-600">Report Defect</h3>
                 <button onClick={() => setDefectModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               <div className="space-y-4">
                 <textarea rows={3} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="Describe the issue..."></textarea>
               </div>
               <div className="flex gap-3 mt-6">
                  <button onClick={() => setDefectModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium hover:bg-slate-50">Cancel</button>
                  <button onClick={() => { addToast('warning', 'Report Submitted'); setDefectModalOpen(false); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Submit</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
