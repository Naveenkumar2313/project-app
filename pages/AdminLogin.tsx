
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Lock, User, Loader2, ShieldAlert } from 'lucide-react';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
        const success = await loginAdmin(email, password);
        if (success) {
            navigate('/admin');
        } else {
            setError('Invalid Admin Credentials');
        }
    } catch (err) {
        setError('Login failed');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
       <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
          <div className="bg-slate-800 p-8 text-center border-b-4 border-orange-600">
             <div className="w-16 h-16 bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-orange-500">
                <Lock className="w-8 h-8 text-orange-500" />
             </div>
             <h2 className="text-2xl font-bold text-white">Admin Portal</h2>
             <p className="text-slate-400 text-sm mt-2">Restricted Access Only</p>
          </div>
          
          <form onSubmit={handleLogin} className="p-8 space-y-6">
             {error && (
               <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center">
                 <ShieldAlert className="w-4 h-4 mr-2" /> {error}
               </div>
             )}
             
             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Admin ID</label>
               <div className="relative">
                 <User className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input 
                   type="email" 
                   required
                   className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                   placeholder="admin@pygenic.com"
                   value={email}
                   onChange={e => setEmail(e.target.value)}
                 />
               </div>
             </div>

             <div>
               <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
               <div className="relative">
                 <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-400" />
                 <input 
                   type="password" 
                   required
                   className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-slate-800 focus:border-slate-800 outline-none transition-all"
                   placeholder="••••••••"
                   value={password}
                   onChange={e => setPassword(e.target.value)}
                 />
               </div>
             </div>

             <button 
               type="submit" 
               disabled={loading}
               className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold shadow-lg hover:bg-slate-800 transition-all flex justify-center items-center"
             >
               {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Authenticate System'}
             </button>
             
             <div className="text-center text-xs text-slate-400">
               <p>Unauthorized access is monitored and logged.</p>
               <p>Demo: admin@pygenic.com / admin123</p>
             </div>
          </form>
       </div>
    </div>
  );
};

export default AdminLogin;
