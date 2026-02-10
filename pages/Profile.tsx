
import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { User, Save, LogOut, Camera, BookOpen, Building, GraduationCap, Mail, Phone, Loader2, Bell, Smartphone, Monitor, MapPin, Plus, Trash2, Home, Briefcase } from 'lucide-react';
import { Department, Address } from '../types';

const Profile = () => {
  const { user, updateProfile, logout, addAddress, removeAddress } = useAuth();
  const { addToast } = useNotification();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
  
  // Profile Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: '',
    semester: ''
  });

  // Address Form State
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState<Partial<Address>>({
    label: 'Home',
    country: 'India'
  });

  const [notificationPrefs, setNotificationPrefs] = useState({
    email: true,
    sms: true,
    push: false,
    promo: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        college: user.college || '',
        department: user.department || '',
        semester: user.semester || ''
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleToggle = (key: keyof typeof notificationPrefs) => {
    setNotificationPrefs(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      updateProfile(formData);
      setLoading(false);
      addToast('success', 'Profile updated successfully!');
    }, 1000);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      addToast('error', 'Please fill all required address fields');
      return;
    }
    const address: Address = {
      id: `addr_${Date.now()}`,
      label: newAddress.label || 'Home',
      name: user?.name || '',
      phone: user?.phone || '',
      street: newAddress.street || '',
      city: newAddress.city || '',
      state: newAddress.state || '',
      zip: newAddress.zip || '',
      country: 'India'
    };
    addAddress(address);
    setShowAddressForm(false);
    setNewAddress({ label: 'Home', country: 'India' });
    addToast('success', 'Address added to book!');
  };

  if (!user) return <div>Please login first</div>;

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200 text-center">
            <div className="relative inline-block mb-4 group">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-32 h-32 rounded-full object-cover border-4 border-slate-100 mx-auto"
              />
              <button className="absolute bottom-0 right-0 bg-orange-600 text-white p-2 rounded-full shadow-lg hover:bg-orange-700 transition-colors">
                <Camera className="w-4 h-4" />
              </button>
            </div>
            <h2 className="text-xl font-bold text-slate-900">{user.name}</h2>
            <p className="text-slate-500 text-sm">{user.department} Student</p>
            
            <div className="mt-6 space-y-2">
              <button 
                onClick={() => setActiveTab('profile')}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center transition-colors ${activeTab === 'profile' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <User className="w-4 h-4 mr-3" /> Profile Settings
              </button>
              <button 
                onClick={() => setActiveTab('addresses')}
                className={`w-full py-2 px-4 rounded-lg text-sm font-medium flex items-center transition-colors ${activeTab === 'addresses' ? 'bg-orange-50 text-orange-700' : 'text-slate-600 hover:bg-slate-50'}`}
              >
                <MapPin className="w-4 h-4 mr-3" /> Address Book
              </button>
            </div>

            <button 
              onClick={logout}
              className="mt-6 w-full py-2 px-4 border border-red-200 text-red-600 rounded-lg text-sm font-medium hover:bg-red-50 flex items-center justify-center transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="w-full md:w-2/3">
          {activeTab === 'profile' ? (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Profile Settings</h3>
              </div>
              
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <User className="w-4 h-4 mr-2 text-slate-400" /> Full Name
                    </label>
                    <input 
                      name="name" 
                      value={formData.name} 
                      onChange={handleChange} 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <Mail className="w-4 h-4 mr-2 text-slate-400" /> Email Address
                    </label>
                    <input 
                      name="email" 
                      value={formData.email} 
                      disabled 
                      className="w-full border border-slate-200 bg-slate-50 text-slate-500 rounded-lg p-2.5 text-sm cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <Phone className="w-4 h-4 mr-2 text-slate-400" /> Phone Number
                    </label>
                    <input 
                      name="phone" 
                      value={formData.phone} 
                      onChange={handleChange} 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="+91"
                    />
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Academic Details</h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <Building className="w-4 h-4 mr-2 text-slate-400" /> College Name
                    </label>
                    <input 
                      name="college" 
                      value={formData.college} 
                      onChange={handleChange} 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      placeholder="Enter your college/university"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <BookOpen className="w-4 h-4 mr-2 text-slate-400" /> Department
                    </label>
                    <select 
                      name="department" 
                      value={formData.department} 
                      onChange={handleChange} 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">Select Dept</option>
                      {Object.values(Department).map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center">
                      <GraduationCap className="w-4 h-4 mr-2 text-slate-400" /> Semester
                    </label>
                    <select 
                      name="semester" 
                      value={formData.semester} 
                      onChange={handleChange} 
                      className="w-full border border-slate-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="">Select Semester</option>
                      {[1,2,3,4,5,6,7,8].map(s => <option key={s} value={s}>Semester {s}</option>)}
                    </select>
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />
                <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wide">Notification Preferences</h4>
                
                <div className="space-y-4">
                  {/* ... Notification toggles (same as before) ... */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Mail className="w-5 h-5 text-slate-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-slate-800">Email Notifications</p>
                        <p className="text-xs text-slate-500">Receive order updates and invoices</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" checked={notificationPrefs.email} onChange={() => handleToggle('email')} className="sr-only peer" />
                      <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-orange-600"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 transition-colors flex items-center shadow-md disabled:opacity-70"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden min-h-[500px]">
              <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-lg text-slate-900">Address Book</h3>
                <button onClick={() => setShowAddressForm(!showAddressForm)} className="text-sm font-medium text-orange-600 hover:bg-orange-50 px-3 py-1.5 rounded-lg transition-colors flex items-center">
                  <Plus className="w-4 h-4 mr-1" /> Add New
                </button>
              </div>

              {showAddressForm && (
                <form onSubmit={handleAddAddress} className="p-6 bg-slate-50 border-b border-slate-100 animate-fadeIn">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Label</label>
                         <div className="flex gap-4">
                            {['Home', 'Hostel', 'Office'].map(l => (
                               <label key={l} className="flex items-center cursor-pointer">
                                  <input type="radio" name="label" value={l} checked={newAddress.label === l} onChange={(e) => setNewAddress({...newAddress, label: e.target.value})} className="mr-2 text-orange-600 focus:ring-orange-500" />
                                  <span className="text-sm text-slate-700">{l}</span>
                               </label>
                            ))}
                         </div>
                      </div>
                      <div className="md:col-span-2">
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Street Address</label>
                         <input required className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="Flat No, Building, Street" value={newAddress.street || ''} onChange={e => setNewAddress({...newAddress, street: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">City</label>
                         <input required className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="City" value={newAddress.city || ''} onChange={e => setNewAddress({...newAddress, city: e.target.value})} />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">Pincode</label>
                         <input required className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="6-digit Pincode" maxLength={6} value={newAddress.zip || ''} onChange={e => setNewAddress({...newAddress, zip: e.target.value.replace(/\D/g,'')})} />
                      </div>
                      <div>
                         <label className="block text-xs font-bold text-slate-500 uppercase mb-1">State</label>
                         <input required className="w-full border border-slate-300 rounded p-2 text-sm" placeholder="State" value={newAddress.state || ''} onChange={e => setNewAddress({...newAddress, state: e.target.value})} />
                      </div>
                   </div>
                   <div className="flex justify-end gap-3 mt-4">
                      <button type="button" onClick={() => setShowAddressForm(false)} className="px-4 py-2 text-slate-500 hover:bg-slate-200 rounded text-sm">Cancel</button>
                      <button type="submit" className="px-4 py-2 bg-slate-900 text-white rounded text-sm hover:bg-slate-800">Save Address</button>
                   </div>
                </form>
              )}

              <div className="p-6 space-y-4">
                {user.addresses && user.addresses.length > 0 ? (
                  user.addresses.map(addr => (
                    <div key={addr.id} className="border border-slate-200 rounded-xl p-4 flex justify-between items-start hover:border-orange-200 transition-colors group">
                       <div className="flex items-start">
                          <div className={`p-2 rounded-full mr-4 ${addr.label === 'Home' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                             {addr.label === 'Home' ? <Home className="w-5 h-5" /> : <Briefcase className="w-5 h-5" />}
                          </div>
                          <div>
                             <div className="flex items-center">
                                <span className="font-bold text-slate-900 text-sm mr-2">{addr.label}</span>
                                {addr.isDefault && <span className="bg-slate-100 text-slate-500 text-[10px] px-1.5 py-0.5 rounded uppercase font-bold">Default</span>}
                             </div>
                             <p className="text-sm text-slate-600 mt-1">{addr.street}, {addr.city}</p>
                             <p className="text-sm text-slate-600">{addr.state} - {addr.zip}</p>
                             <p className="text-xs text-slate-400 mt-2 font-mono">India</p>
                          </div>
                       </div>
                       <button onClick={() => removeAddress(addr.id)} className="text-slate-300 hover:text-red-500 p-2 opacity-0 group-hover:opacity-100 transition-all">
                          <Trash2 className="w-4 h-4" />
                       </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-12">
                     <MapPin className="w-12 h-12 text-slate-200 mx-auto mb-3" />
                     <p className="text-slate-500">No saved addresses yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
