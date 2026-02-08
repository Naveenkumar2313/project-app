
import React, { useState, useEffect } from 'react';
import { MY_ORDERS, MY_TICKETS } from '../services/mockData';
import { OrderStatus, Order, PackageType, ProjectTier } from '../types';
import { generatePlagiarismScore, getStatusColor } from '../services/reportUtils';
import { 
  Package, Lock, Unlock, CheckCircle, Clock, ShieldAlert, Download, 
  Settings, Ticket, MessageSquare, Map, Eye, Video, ThumbsUp, X, Star, MapPin, Gift, Award, Wifi, WifiOff, FileText, FileCode, Printer, ShieldCheck, AlertTriangle, ScanLine, Wrench, FileSpreadsheet
} from 'lucide-react';
import { CodeViewer, CircuitViewer, ModelViewer3D } from '../components/TechViewers';
import { PlagiarismReport } from '../components/PlagiarismReport';
import { QualityCertificate } from '../components/QualityCertificate';
import { GSTInvoice } from '../components/GSTInvoice';
import { PROJECTS } from '../services/mockData';

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

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'support'>('orders');
  const [orders, setOrders] = useState<Order[]>(MY_ORDERS);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  
  // Modal States
  const [trackingModalOpen, setTrackingModalOpen] = useState(false);
  const [viewerType, setViewerType] = useState<'NONE' | 'CODE' | 'CIRCUIT' | '3D' | 'REPORT' | 'CERTIFICATE' | 'INVOICE'>('NONE');
  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [defectModalOpen, setDefectModalOpen] = useState(false);
  const [verifyModalOpen, setVerifyModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Download State
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);

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
    if (downloadingFile) return; // Prevent multiple downloads
    setDownloadingFile(filename);
    setDownloadProgress(0);

    const interval = setInterval(() => {
      setDownloadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setDownloadingFile(null);
            alert(`${filename} downloaded successfully!`);
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

  const handleCopyReferral = () => {
      navigator.clipboard.writeText("PYG-8821-XREF");
      alert("Referral Code copied to clipboard!");
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative">
      {/* Network Status Banner */}
      {isOffline && (
        <div className="bg-slate-800 text-white px-4 py-2 rounded-lg flex items-center justify-center animate-pulse">
           <WifiOff className="w-4 h-4 mr-2" />
           <span className="text-sm font-medium">You are currently offline. Viewing cached content.</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
        <div>
           <h1 className="text-3xl font-bold text-slate-900">Student Dashboard</h1>
           <span className="text-xs text-slate-400 font-mono">Session ID: PYG-8821X</span>
        </div>
        
        {/* Tab Switcher */}
        <div className="flex bg-white p-1 rounded-lg border border-slate-200 shadow-sm">
           <button 
             onClick={() => setActiveTab('orders')}
             className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'orders' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <Package className="w-4 h-4 mr-2" /> My Orders
           </button>
           <button 
             onClick={() => setActiveTab('support')}
             className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${activeTab === 'support' ? 'bg-slate-900 text-white shadow-sm' : 'text-slate-600 hover:bg-slate-50'}`}
           >
             <Ticket className="w-4 h-4 mr-2" /> Support Tickets
           </button>
        </div>
      </div>

      {/* Rewards & Referral Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
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

        <div className="bg-gradient-to-br from-orange-500 to-red-500 rounded-xl p-6 text-white shadow-lg relative overflow-hidden">
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
        <div className="space-y-8 animate-fadeIn">
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

                       {order.status !== OrderStatus.DELIVERED && (
                          <button onClick={() => advanceStatus(order.id)} className="flex items-center space-x-2 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded-full border border-slate-300 transition-colors">
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
                       {/* Replacement Badge for Full Build/Kit */}
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
                               <button onClick={() => { setSelectedOrder(order); setTrackingModalOpen(true); }} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 hover:bg-green-200 cursor-pointer"><Map className="w-3 h-3 mr-1" /> Track Shipment</button>
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
                        <button 
                          onClick={() => handleViewAsset(order, 'REPORT')}
                          className="text-xs bg-white/80 hover:bg-white border border-current px-4 py-2 rounded-md font-semibold transition-colors shadow-sm flex items-center"
                        >
                           <FileText className="w-3 h-3 mr-1" /> View
                        </button>
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
                          <button 
                            onClick={() => { setSelectedOrder(order); setVerifyModalOpen(true); }}
                            className="text-xs bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 px-4 py-2 rounded-md font-semibold transition-colors shadow-sm"
                          >
                             Verify
                          </button>
                       </div>
                     )}
                   </div>
                   
                   {/* Defect Reporting (Only if delivered recently) */}
                   {isDefectReportEligible(order) && (
                     <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex justify-between items-center animate-fadeIn">
                       <div className="flex items-center text-red-700 text-sm">
                         <AlertTriangle className="w-5 h-5 mr-2" />
                         <span><strong>Defect Reporting Active:</strong> You can report damaged components for free replacement within 48 hours.</span>
                       </div>
                       <button onClick={() => { setSelectedOrder(order); setDefectModalOpen(true); }} className="px-3 py-1.5 bg-white border border-red-200 text-red-600 rounded text-xs font-bold hover:bg-red-50">Report Issue</button>
                     </div>
                   )}

                </div>

                {/* Digital Assets & Installation Hub */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-lg font-bold text-slate-900 flex items-center"><Package className="w-5 h-5 mr-2 text-orange-500" /> Project Assets Vault</h2>
                      {!isDispatched && <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded border border-red-100 flex items-center"><Lock className="w-3 h-3 mr-1" /> Vault Locked</span>}
                    </div>
                    
                    <div className="space-y-4">
                       {/* Mock Files List with specific viewers */}
                       {[
                           { name: 'Source Code (main.py)', type: 'CODE' },
                           { name: 'Circuit Diagram (schematic.svg)', type: 'CIRCUIT' },
                           { name: '3D Chassis Model (model.obj)', type: '3D' },
                           { name: 'Project Synopsis.pdf', type: 'NONE' },
                           // Conditional QA Certificate
                           ...(isFullBuild ? [{ name: 'Quality Assurance Certificate.pdf', type: 'CERTIFICATE' }] : [])
                       ].map((file, i) => (
                         <div key={i} className="flex items-center justify-between p-4 rounded-lg border bg-slate-50 border-slate-200 hover:border-orange-200 transition-colors">
                           <div className="flex items-center">
                             {isDispatched ? <Unlock className="w-5 h-5 text-green-500 mr-3" /> : <Lock className="w-5 h-5 text-slate-400 mr-3" />}
                             <span className="text-sm font-medium text-slate-700">{file.name}</span>
                             {downloadingFile === file.name && (
                               <span className="ml-3 text-xs font-bold text-orange-600">{downloadProgress}%</span>
                             )}
                           </div>
                           
                           {isDispatched ? (
                             <div className="flex space-x-2">
                               {file.type !== 'NONE' && (
                                   <button 
                                      onClick={() => handleViewAsset(order, file.type as any)}
                                      className="flex items-center text-xs font-bold text-slate-600 bg-white px-3 py-1.5 rounded shadow-sm border border-slate-300 hover:bg-slate-50"
                                   >
                                      <Eye className="w-3 h-3 mr-1.5" /> Preview
                                   </button>
                               )}
                               <button 
                                 onClick={() => handleDownload(file.name)}
                                 className="flex items-center text-xs font-bold text-orange-600 bg-white px-3 py-1.5 rounded shadow-sm border border-orange-100 hover:bg-orange-50"
                               >
                                 <Download className="w-3 h-3 mr-1.5" /> 
                                 {downloadingFile === file.name ? 'Downloading...' : 'Download'}
                               </button>
                             </div>
                           ) : (
                             <span className="text-xs text-slate-400 italic">Locked</span>
                           )}
                         </div>
                       ))}
                       {/* Download Progress Bar */}
                       {downloadingFile && (
                          <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden mt-2">
                             <div className="bg-orange-500 h-full transition-all duration-200" style={{ width: `${downloadProgress}%` }}></div>
                          </div>
                       )}
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8 flex flex-col">
                    <div className="flex items-center mb-6"><Video className="w-5 h-5 mr-2 text-orange-500" /><h2 className="text-lg font-bold text-slate-900">Installation Hub</h2></div>
                    <div className="flex-1 space-y-4">
                      {[
                          'Component Setup Guide', 
                          'Software Compilation', 
                          ...(isFullBuild ? ['Full Build Assembly Masterclass'] : []),
                          'Final Output Demo'
                        ].map((video, idx) => (
                        <div key={idx} className="relative rounded-lg overflow-hidden aspect-video bg-slate-900 group">
                           {isDispatched ? (
                             <>
                               <div className="absolute inset-0 flex items-center justify-center">
                                 <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm group-hover:bg-white/30 transition-colors cursor-pointer">
                                   <div className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1"></div>
                                 </div>
                               </div>
                               <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/60 text-white text-xs font-medium">{video}</div>
                             </>
                           ) : (
                             <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800 text-slate-400">
                               <Lock className="w-6 h-6 mb-2" /><span className="text-xs text-center px-4">Unlock after Dispatch</span>
                             </div>
                           )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Support Tickets Tab */}
      {activeTab === 'support' && (
         <div className="space-y-6 animate-fadeIn">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
               <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
                  <h3 className="font-bold text-slate-800">Recent Support Tickets</h3>
                  <button className="text-xs font-semibold text-orange-600 hover:text-orange-700">+ Raise New Ticket</button>
               </div>
               {MY_TICKETS.length > 0 ? (
                 <div className="divide-y divide-slate-100">
                   {MY_TICKETS.map(ticket => (
                     <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                           <div>
                              <div className="flex items-center space-x-3 mb-1">
                                <span className="text-xs font-mono text-slate-400">{ticket.id}</span>
                                <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${getTicketStatusColor(ticket.status)}`}>{ticket.status}</span>
                                <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase">{ticket.type}</span>
                              </div>
                              <h4 className="text-lg font-semibold text-slate-900">{ticket.subject}</h4>
                           </div>
                           <span className="text-xs text-slate-400 whitespace-nowrap">{ticket.date}</span>
                        </div>
                        <p className="text-slate-600 text-sm mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">"{ticket.message}"</p>
                     </div>
                   ))}
                 </div>
               ) : (
                 <div className="p-12 text-center text-slate-500"><Ticket className="w-12 h-12 mx-auto text-slate-300 mb-3" /><p>No support tickets raised yet.</p></div>
               )}
            </div>
         </div>
      )}

      {/* --- MODALS --- */}
      {/* Map Tracking Modal */}
      {trackingModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl overflow-hidden animate-fadeIn">
              <div className="p-4 border-b flex justify-between items-center bg-slate-50">
                 <h3 className="font-bold text-slate-900 flex items-center"><Map className="w-4 h-4 mr-2" /> Live Order Tracking</h3>
                 <button onClick={() => setTrackingModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
              </div>
              <div className="relative h-80 bg-slate-200">
                 <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')] bg-cover opacity-50"></div>
                 <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-slate-900 rounded-full animate-ping"></div>
                 <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-slate-900 rounded-full border-2 border-white shadow-lg"></div>
                 <div className="absolute top-1/3 right-1/4 w-4 h-4 text-red-600"><MapPin className="w-6 h-6 fill-current" /></div>
                 <svg className="absolute inset-0 w-full h-full pointer-events-none"><path d="M 180 160 Q 300 120 450 110" stroke="#f97316" strokeWidth="3" fill="none" strokeDasharray="5,5" /></svg>
                 <div className="absolute bottom-4 left-4 right-4 bg-white p-3 rounded-lg shadow-lg text-sm flex justify-between items-center">
                    <div><p className="font-bold text-slate-900">In Transit</p><p className="text-xs text-slate-500">Arriving by 8:00 PM Tomorrow</p></div>
                    <span className="font-mono bg-slate-100 px-2 py-1 rounded text-xs">{selectedOrder.trackingNumber || 'TRK-PENDING'}</span>
                 </div>
              </div>
           </div>
        </div>
      )}

      {/* Tech Viewer Modal */}
      {viewerType !== 'NONE' && selectedOrder && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className={`bg-white rounded-xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col animate-fadeIn ${viewerType === '3D' ? 'bg-slate-900' : ''}`}>
              <div className={`p-4 border-b flex justify-between items-center ${viewerType === '3D' ? 'border-slate-800 text-white' : 'border-slate-200 text-slate-900'}`}>
                 <h3 className="font-bold flex items-center">
                    {viewerType === 'CODE' && <FileCode className="w-5 h-5 mr-2" />}
                    {viewerType === 'CIRCUIT' && <Wifi className="w-5 h-5 mr-2" />}
                    {viewerType === '3D' && <Package className="w-5 h-5 mr-2" />}
                    {viewerType === 'REPORT' && <FileText className="w-5 h-5 mr-2" />}
                    {viewerType === 'CERTIFICATE' && <ShieldCheck className="w-5 h-5 mr-2" />}
                    {viewerType === 'INVOICE' && <FileSpreadsheet className="w-5 h-5 mr-2" />}
                    
                    {viewerType === 'CODE' && 'Source Code Viewer'}
                    {viewerType === 'CIRCUIT' && 'Interactive Circuit Schematic'}
                    {viewerType === '3D' && '3D Model Preview'}
                    {viewerType === 'REPORT' && 'Plagiarism Verification Report'}
                    {viewerType === 'CERTIFICATE' && 'Quality Assurance Certificate'}
                    {viewerType === 'INVOICE' && 'Tax Invoice'}
                 </h3>
                 <div className="flex items-center space-x-2">
                   {(viewerType === 'REPORT' || viewerType === 'CERTIFICATE' || viewerType === 'INVOICE') && (
                     <button className="text-xs flex items-center bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-md transition-colors" onClick={() => window.print()}>
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
                      project={PROJECTS.find(p => p.id === selectedOrder.projectId) || PROJECTS[0]} 
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
                      customerName="Student" // Placeholder
                      projectTitle={selectedOrder.projectTitle}
                      packageType={selectedOrder.packageType}
                      amount={
                         selectedOrder.packageType === PackageType.DIGITAL ? 999 : 
                         selectedOrder.packageType === PackageType.HARDWARE_KIT ? 2499 : 3999
                      } // Approximated for mock data
                      date={selectedOrder.orderDate}
                    />
                 )}
              </div>
           </div>
        </div>
      )}

      {/* Feedback Modal */}
      {feedbackModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
              <div className="text-center mb-6"><h3 className="text-xl font-bold text-slate-900">Rate Your Experience</h3><p className="text-sm text-slate-500 mt-1">How was your experience with {selectedOrder.projectTitle}?</p></div>
              <div className="flex justify-center space-x-2 mb-6">
                 {[1, 2, 3, 4, 5].map((star) => (<button key={star} className="text-yellow-400 hover:scale-110 transition-transform"><Star className="w-8 h-8 fill-current" /></button>))}
              </div>
              <textarea className="w-full border border-slate-300 rounded-lg p-3 text-sm mb-4 focus:ring-2 focus:ring-orange-500 focus:outline-none" rows={4} placeholder="Write your review here..."></textarea>
              <div className="flex gap-3">
                 <button onClick={() => setFeedbackModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg font-medium text-slate-600 hover:bg-slate-50">Cancel</button>
                 <button onClick={() => { setOrders(orders.map(o => o.id === selectedOrder.id ? { ...o, isFeedbackSubmitted: true } : o)); setFeedbackModalOpen(false); alert("Thank you for your feedback!"); }} className="flex-1 py-2 bg-slate-900 text-white rounded-lg font-medium hover:bg-slate-800">Submit Review</button>
              </div>
           </div>
        </div>
      )}

      {/* Verify Authenticity Modal */}
      {verifyModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
           <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6 animate-fadeIn">
             <div className="flex justify-between items-center mb-6">
               <h3 className="text-lg font-bold text-slate-900 flex items-center"><ScanLine className="w-5 h-5 mr-2" /> Component Verification</h3>
               <button onClick={() => setVerifyModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
             </div>
             
             <div className="space-y-4 mb-6">
               {['Microcontroller Unit', 'Sensor Module', 'Motor Driver'].map((part, i) => (
                 <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg">
                    <div>
                      <div className="font-bold text-sm text-slate-800">{part}</div>
                      <div className="text-xs text-slate-500 font-mono">SN: PYG-{Math.floor(Math.random()*9000)+1000}</div>
                    </div>
                    <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                       <CheckCircle className="w-3 h-3 mr-1" /> Authentic
                    </span>
                 </div>
               ))}
             </div>
             <p className="text-xs text-center text-slate-500">Scan QR code on physical component to verify details.</p>
           </div>
        </div>
      )}

      {/* Defect Reporting Modal */}
      {defectModalOpen && selectedOrder && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg p-6 animate-fadeIn">
               <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                 <div>
                   <h3 className="text-lg font-bold text-red-600 flex items-center"><Wrench className="w-5 h-5 mr-2" /> Report Defect</h3>
                   <p className="text-xs text-slate-500 mt-1">Order #{selectedOrder.id}</p>
                 </div>
                 <button onClick={() => setDefectModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               
               <div className="bg-red-50 text-red-800 p-3 rounded-lg text-sm mb-4">
                  Request must include photos of the damaged part. Replacements are approved within 24 hours.
               </div>

               <div className="space-y-4">
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Affected Component</label>
                   <select className="w-full border border-slate-300 rounded-lg p-2.5 text-sm">
                     <option>Select Component...</option>
                     <option>Microcontroller Board</option>
                     <option>Sensors / Modules</option>
                     <option>Motors / Actuators</option>
                     <option>Chassis / Body</option>
                   </select>
                 </div>
                 <div>
                   <label className="block text-sm font-medium text-slate-700 mb-1">Description of Defect</label>
                   <textarea rows={3} className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="Describe the issue..."></textarea>
                 </div>
                 <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:bg-slate-50 cursor-pointer">
                    <div className="text-sm text-slate-500">Upload Photos of Damage</div>
                 </div>
               </div>

               <div className="flex gap-3 mt-6">
                  <button onClick={() => setDefectModalOpen(false)} className="flex-1 py-2 border border-slate-300 rounded-lg text-slate-600 font-medium">Cancel</button>
                  <button onClick={() => { alert('Defect Report Submitted. Ticket #DEF-9921 created.'); setDefectModalOpen(false); }} className="flex-1 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700">Submit Report</button>
               </div>
            </div>
         </div>
      )}
    </div>
  );
};

export default Dashboard;
