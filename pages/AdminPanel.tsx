
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { DataManager } from '../services/dataManager';
import { Project, Order, SupportTicket, Department, ProjectTier, Difficulty, PackageType } from '../types';
import { 
  LayoutDashboard, ShoppingBag, Box, Users, Ticket, BarChart3, Settings, 
  LogOut, Plus, Search, Edit2, Trash2, CheckCircle, XCircle, AlertTriangle, 
  Truck, Mail, Save, X, DollarSign, TrendingUp, Package, AlertOctagon
} from 'lucide-react';

const AdminPanel = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'orders' | 'support'>('dashboard');
  
  // Data State
  const [projects, setProjects] = useState<Project[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, pendingOrders: 0, activeTickets: 0 });

  // Modals
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form State for Project
  const [projectForm, setProjectForm] = useState<Partial<Project>>({});

  useEffect(() => {
    if (!isAdmin) {
      navigate('/admin/login');
      return;
    }
    refreshData();
  }, [isAdmin, navigate]);

  const refreshData = () => {
    setProjects(DataManager.getProjects());
    setOrders(DataManager.getOrders());
    setTickets(DataManager.getTickets());
    setStats(DataManager.getStats());
  };

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  // --- Project Management ---
  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Construct or update inventory object
    const inventory = projectForm.inventory || {
        [PackageType.DIGITAL]: 9999,
        [PackageType.HARDWARE_KIT]: 0,
        [PackageType.FULL_BUILD]: 0
    };

    const newProject: Project = {
      id: editingProject ? editingProject.id : `p${Date.now()}`,
      title: projectForm.title || 'Untitled Project',
      description: projectForm.description || '',
      department: projectForm.department as Department || Department.CSE,
      tier: projectForm.tier as ProjectTier || ProjectTier.MINI,
      difficulty: projectForm.difficulty as Difficulty || Difficulty.MODERATE,
      components: projectForm.components || [],
      priceDigital: Number(projectForm.priceDigital) || 999,
      priceKit: Number(projectForm.priceKit) || 2999,
      priceBuild: Number(projectForm.priceBuild) || 4999,
      imageUrl: projectForm.imageUrl || 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80',
      images: [],
      rating: editingProject ? editingProject.rating : 0,
      reviewCount: editingProject ? editingProject.reviewCount : 0,
      popularity: editingProject ? editingProject.popularity : 0,
      dateAdded: editingProject ? editingProject.dateAdded : new Date().toISOString().split('T')[0],
      inStock: (inventory[PackageType.HARDWARE_KIT] > 0 || inventory[PackageType.FULL_BUILD] > 0),
      inventory: inventory,
      reorderLevel: Number(projectForm.reorderLevel) || 10,
      specifications: [],
      faqs: [],
      reviews: []
    };

    DataManager.saveProject(newProject);
    setShowProjectModal(false);
    setEditingProject(null);
    setProjectForm({});
    refreshData();
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      DataManager.deleteProject(id);
      refreshData();
    }
  };

  // --- Order Management ---
  const handleOrderStatus = (order: Order, newStatus: any) => {
    const updatedOrder = { ...order, status: newStatus };
    DataManager.updateOrder(updatedOrder);
    refreshData();
  };

  // --- Ticket Management ---
  const handleTicketStatus = (ticket: SupportTicket, newStatus: any) => {
    const updatedTicket = { ...ticket, status: newStatus };
    DataManager.updateTicket(updatedTicket);
    refreshData();
  };

  const SidebarItem = ({ id, icon: Icon, label }: any) => (
    <button 
      onClick={() => setActiveTab(id)}
      className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors ${
        activeTab === id 
          ? 'bg-slate-800 text-white border-r-4 border-orange-500' 
          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
      }`}
    >
      <Icon className="w-5 h-5 mr-3" />
      {label}
    </button>
  );

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 flex-shrink-0 flex flex-col">
        <div className="p-6 border-b border-slate-800">
           <h1 className="text-xl font-bold text-white tracking-tight">Pygenicarc<span className="text-orange-500">Admin</span></h1>
        </div>
        
        <nav className="flex-1 py-6 space-y-1">
           <SidebarItem id="dashboard" icon={LayoutDashboard} label="Dashboard" />
           <SidebarItem id="orders" icon={ShoppingBag} label="Orders" />
           <SidebarItem id="projects" icon={Box} label="Inventory" />
           <SidebarItem id="support" icon={Ticket} label="Support" />
        </nav>

        <div className="p-4 border-t border-slate-800">
           <div className="flex items-center mb-4 px-2">
              <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold mr-3">A</div>
              <div>
                 <p className="text-sm font-medium text-white">Administrator</p>
                 <p className="text-xs text-slate-500">Super User</p>
              </div>
           </div>
           <button onClick={handleLogout} className="w-full flex items-center justify-center px-4 py-2 bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white rounded-lg transition-colors text-sm font-bold">
              <LogOut className="w-4 h-4 mr-2" /> Logout
           </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
         <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8">
            <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab} Overview</h2>
            <div className="flex items-center space-x-4">
               <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Mail className="w-5 h-5" /></button>
               <button className="p-2 text-slate-400 hover:bg-slate-100 rounded-full"><Settings className="w-5 h-5" /></button>
            </div>
         </header>

         <div className="p-8">
            {/* --- DASHBOARD VIEW --- */}
            {activeTab === 'dashboard' && (
               <div className="space-y-8 animate-fadeIn">
                  {/* Stats Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-sm font-medium text-slate-500">Total Revenue</p>
                              <h3 className="text-2xl font-bold text-slate-900">₹{stats.revenue.toLocaleString()}</h3>
                           </div>
                           <div className="p-2 bg-green-50 rounded-lg"><DollarSign className="w-5 h-5 text-green-600" /></div>
                        </div>
                        <div className="flex items-center text-xs text-green-600 font-bold"><TrendingUp className="w-3 h-3 mr-1" /> +12% from last month</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-sm font-medium text-slate-500">Pending Orders</p>
                              <h3 className="text-2xl font-bold text-slate-900">{stats.pendingOrders}</h3>
                           </div>
                           <div className="p-2 bg-orange-50 rounded-lg"><Truck className="w-5 h-5 text-orange-600" /></div>
                        </div>
                        <div className="text-xs text-slate-500">Needs dispatching</div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-sm font-medium text-slate-500">Active Projects</p>
                              <h3 className="text-2xl font-bold text-slate-900">{projects.length}</h3>
                           </div>
                           <div className="p-2 bg-blue-50 rounded-lg"><Package className="w-5 h-5 text-blue-600" /></div>
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <div className="flex justify-between items-start mb-4">
                           <div>
                              <p className="text-sm font-medium text-slate-500">Open Tickets</p>
                              <h3 className="text-2xl font-bold text-slate-900">{stats.activeTickets}</h3>
                           </div>
                           <div className="p-2 bg-red-50 rounded-lg"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                        </div>
                     </div>
                  </div>

                  {/* Inventory Alerts Mockup */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">Low Stock Alerts</h3>
                        <div className="space-y-3">
                           {projects.filter(p => p.inventory[PackageType.HARDWARE_KIT] <= p.reorderLevel || p.inventory[PackageType.FULL_BUILD] <= p.reorderLevel).map(p => (
                              <div key={p.id} className="flex items-center justify-between p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-100">
                                 <div className="flex items-center">
                                    <AlertOctagon className="w-4 h-4 mr-2" />
                                    <span className="font-medium">{p.title}</span>
                                 </div>
                                 <div className="flex space-x-3 text-xs">
                                    <span className={p.inventory[PackageType.HARDWARE_KIT] <= p.reorderLevel ? "font-bold text-red-800" : ""}>
                                        Kit: {p.inventory[PackageType.HARDWARE_KIT]}
                                    </span>
                                    <span className={p.inventory[PackageType.FULL_BUILD] <= p.reorderLevel ? "font-bold text-red-800" : ""}>
                                        Build: {p.inventory[PackageType.FULL_BUILD]}
                                    </span>
                                 </div>
                              </div>
                           ))}
                           {projects.every(p => p.inventory[PackageType.HARDWARE_KIT] > p.reorderLevel && p.inventory[PackageType.FULL_BUILD] > p.reorderLevel) && (
                               <p className="text-slate-500 text-sm text-center py-4">All inventory levels are healthy.</p>
                           )}
                        </div>
                     </div>
                     <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="font-bold text-slate-900 mb-6">Recent Sales</h3>
                        <div className="space-y-4">
                           {orders.slice(0, 5).map(order => (
                              <div key={order.id} className="flex items-center justify-between pb-4 border-b border-slate-50 last:border-0 last:pb-0">
                                 <div>
                                    <p className="font-medium text-slate-800">{order.projectTitle}</p>
                                    <p className="text-xs text-slate-500">Order #{order.id}</p>
                                 </div>
                                 <span className="font-mono text-sm font-bold">₹{order.packageType === 'Full Build' ? 4999 : 2499}</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>
               </div>
            )}

            {/* --- INVENTORY VIEW --- */}
            {activeTab === 'projects' && (
               <div className="animate-fadeIn">
                  <div className="flex justify-between items-center mb-6">
                     <div className="relative w-64">
                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                        <input className="w-full pl-9 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Search projects..." />
                     </div>
                     <button onClick={() => { setEditingProject(null); setProjectForm({}); setShowProjectModal(true); }} className="bg-slate-900 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center hover:bg-slate-800">
                        <Plus className="w-4 h-4 mr-2" /> Add Project
                     </button>
                  </div>

                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                           <tr>
                              <th className="px-6 py-4">Project</th>
                              <th className="px-6 py-4">Kit Stock</th>
                              <th className="px-6 py-4">Build Stock</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {projects.map(project => (
                              <tr key={project.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center">
                                       <img src={project.imageUrl} className="w-10 h-10 rounded object-cover mr-3" alt="" />
                                       <div>
                                           <span className="font-medium text-slate-900 line-clamp-1 w-64">{project.title}</span>
                                           <span className="text-xs text-slate-500">{project.department}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 font-mono">
                                     <span className={project.inventory[PackageType.HARDWARE_KIT] <= project.reorderLevel ? "text-red-600 font-bold" : "text-slate-700"}>
                                         {project.inventory[PackageType.HARDWARE_KIT]}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4 font-mono">
                                     <span className={project.inventory[PackageType.FULL_BUILD] <= project.reorderLevel ? "text-red-600 font-bold" : "text-slate-700"}>
                                         {project.inventory[PackageType.FULL_BUILD]}
                                     </span>
                                 </td>
                                 <td className="px-6 py-4">
                                    {(project.inventory[PackageType.HARDWARE_KIT] > 0 || project.inventory[PackageType.FULL_BUILD] > 0) ? 
                                       <span className="text-green-600 flex items-center text-xs font-bold"><CheckCircle className="w-3 h-3 mr-1" /> Active</span> : 
                                       <span className="text-red-600 flex items-center text-xs font-bold"><XCircle className="w-3 h-3 mr-1" /> Out of Stock</span>
                                    }
                                 </td>
                                 <td className="px-6 py-4 text-right space-x-2">
                                    <button onClick={() => { setEditingProject(project); setProjectForm(project); setShowProjectModal(true); }} className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                                    <button onClick={() => handleDeleteProject(project.id)} className="p-2 text-slate-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* --- ORDERS VIEW --- */}
            {activeTab === 'orders' && (
               <div className="animate-fadeIn">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <table className="w-full text-sm text-left">
                        <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-200">
                           <tr>
                              <th className="px-6 py-4">Order ID</th>
                              <th className="px-6 py-4">Project / Package</th>
                              <th className="px-6 py-4">Date</th>
                              <th className="px-6 py-4">Status</th>
                              <th className="px-6 py-4 text-right">Actions</th>
                           </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                           {orders.map(order => (
                              <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                                 <td className="px-6 py-4 font-mono text-slate-600">{order.id}</td>
                                 <td className="px-6 py-4">
                                    <p className="font-bold text-slate-900">{order.projectTitle}</p>
                                    <p className="text-xs text-slate-500">{order.packageType}</p>
                                 </td>
                                 <td className="px-6 py-4">{order.orderDate}</td>
                                 <td className="px-6 py-4">
                                    <select 
                                       value={order.status} 
                                       onChange={(e) => handleOrderStatus(order, e.target.value)}
                                       className="bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium focus:ring-2 focus:ring-orange-500"
                                    >
                                       {['Payment Verified', 'Procuring', 'Coding', 'Testing', 'Dispatched', 'Delivered'].map(s => (
                                          <option key={s} value={s}>{s}</option>
                                       ))}
                                    </select>
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <button className="text-xs font-bold text-blue-600 hover:underline">View Invoice</button>
                                 </td>
                              </tr>
                           ))}
                        </tbody>
                     </table>
                  </div>
               </div>
            )}

            {/* --- SUPPORT VIEW --- */}
            {activeTab === 'support' && (
               <div className="animate-fadeIn">
                  <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                     <div className="p-6 border-b border-slate-200 bg-slate-50">
                        <h3 className="font-bold text-slate-800">Support Ticket Queue</h3>
                     </div>
                     <div className="divide-y divide-slate-100">
                        {tickets.map(ticket => (
                           <div key={ticket.id} className="p-6 hover:bg-slate-50 transition-colors">
                              <div className="flex justify-between items-start mb-2">
                                 <div className="flex items-center space-x-3">
                                    <span className="font-mono text-xs font-bold text-slate-500">{ticket.id}</span>
                                    <span className="bg-slate-100 px-2 py-0.5 rounded text-[10px] font-bold uppercase text-slate-600">{ticket.type}</span>
                                 </div>
                                 <select 
                                    value={ticket.status} 
                                    onChange={(e) => handleTicketStatus(ticket, e.target.value)}
                                    className={`text-xs font-bold uppercase border-none bg-transparent focus:ring-0 cursor-pointer ${ticket.status === 'Resolved' ? 'text-green-600' : ticket.status === 'Open' ? 'text-red-600' : 'text-blue-600'}`}
                                 >
                                    <option value="Open">Open</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Resolved">Resolved</option>
                                 </select>
                              </div>
                              <h4 className="font-bold text-slate-900 mb-1">{ticket.subject}</h4>
                              <p className="text-sm text-slate-600 mb-3">{ticket.message}</p>
                              <div className="text-xs text-slate-400">Raised on {ticket.date}</div>
                           </div>
                        ))}
                     </div>
                  </div>
               </div>
            )}
         </div>
      </main>

      {/* Project Modal */}
      {showProjectModal && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-fadeIn">
               <div className="p-6 border-b border-slate-200 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h3>
                  <button onClick={() => setShowProjectModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
               </div>
               <form onSubmit={handleSaveProject} className="p-6 space-y-6">
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Title</label>
                     <input required className="w-full border border-slate-300 rounded p-2" value={projectForm.title || ''} onChange={e => setProjectForm({...projectForm, title: e.target.value})} />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-1">Description</label>
                     <textarea required className="w-full border border-slate-300 rounded p-2" rows={3} value={projectForm.description || ''} onChange={e => setProjectForm({...projectForm, description: e.target.value})} />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Department</label>
                        <select className="w-full border border-slate-300 rounded p-2" value={projectForm.department || ''} onChange={e => setProjectForm({...projectForm, department: e.target.value as any})}>
                           {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                     </div>
                     <div>
                        <label className="block text-sm font-bold text-slate-700 mb-1">Low Stock Alert Level</label>
                        <input type="number" className="w-full border border-slate-300 rounded p-2" value={projectForm.reorderLevel || ''} onChange={e => setProjectForm({...projectForm, reorderLevel: Number(e.target.value)})} />
                     </div>
                  </div>
                  
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-900 mb-3">Pricing & Inventory</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                          <div>
                             <label className="block text-xs font-bold text-slate-600 mb-1">Hardware Kit Price</label>
                             <input type="number" className="w-full border border-slate-300 rounded p-2 text-sm" value={projectForm.priceKit || ''} onChange={e => setProjectForm({...projectForm, priceKit: Number(e.target.value)})} />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-600 mb-1">Full Build Price</label>
                             <input type="number" className="w-full border border-slate-300 rounded p-2 text-sm" value={projectForm.priceBuild || ''} onChange={e => setProjectForm({...projectForm, priceBuild: Number(e.target.value)})} />
                          </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                             <label className="block text-xs font-bold text-slate-600 mb-1">Hardware Kit Stock</label>
                             <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded p-2 text-sm" 
                                value={projectForm.inventory?.[PackageType.HARDWARE_KIT] || 0} 
                                onChange={e => setProjectForm({
                                    ...projectForm, 
                                    inventory: { 
                                        ...projectForm.inventory, 
                                        [PackageType.HARDWARE_KIT]: Number(e.target.value),
                                        [PackageType.DIGITAL]: projectForm.inventory?.[PackageType.DIGITAL] || 9999,
                                        [PackageType.FULL_BUILD]: projectForm.inventory?.[PackageType.FULL_BUILD] || 0
                                    } 
                                })} 
                             />
                          </div>
                          <div>
                             <label className="block text-xs font-bold text-slate-600 mb-1">Full Build Stock</label>
                             <input 
                                type="number" 
                                className="w-full border border-slate-300 rounded p-2 text-sm" 
                                value={projectForm.inventory?.[PackageType.FULL_BUILD] || 0} 
                                onChange={e => setProjectForm({
                                    ...projectForm, 
                                    inventory: { 
                                        ...projectForm.inventory, 
                                        [PackageType.FULL_BUILD]: Number(e.target.value),
                                        [PackageType.DIGITAL]: projectForm.inventory?.[PackageType.DIGITAL] || 9999,
                                        [PackageType.HARDWARE_KIT]: projectForm.inventory?.[PackageType.HARDWARE_KIT] || 0
                                    } 
                                })} 
                             />
                          </div>
                      </div>
                  </div>

                  <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800">Save Project</button>
               </form>
            </div>
         </div>
      )}
    </div>
  );
};

export default AdminPanel;
