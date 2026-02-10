
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, Address } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password?: string) => Promise<boolean>;
  loginAdmin: (email: string, password?: string) => Promise<boolean>;
  loginWithOtp: (phone: string, otp: string) => Promise<boolean>;
  register: (name: string, email: string, password?: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Restore session from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('pygenicarc_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const saveUser = (u: User) => {
    setUser(u);
    localStorage.setItem('pygenicarc_user', JSON.stringify(u));
  };

  const login = async (email: string, password?: string): Promise<boolean> => {
    // Mock API call
    return new Promise((resolve) => {
      setTimeout(() => {
        // Allow any login for demo purposes if formatted correctly
        if (email.includes('@')) {
          const mockUser: User = {
            id: 'usr_' + Math.floor(Math.random() * 1000),
            name: email.split('@')[0],
            email: email,
            role: 'student',
            avatar: `https://ui-avatars.com/api/?name=${email.split('@')[0]}&background=ea580c&color=fff`,
            addresses: [] // Initialize empty address book
          };
          saveUser(mockUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const loginAdmin = async (email: string, password?: string): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            if (email === 'admin@pygenic.com' && password === 'admin123') {
                const adminUser: User = {
                    id: 'admin_01',
                    name: 'System Admin',
                    email: email,
                    role: 'admin',
                    avatar: 'https://ui-avatars.com/api/?name=Admin&background=1e293b&color=fff'
                };
                saveUser(adminUser);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 1000);
    });
  }

  const loginWithOtp = async (phone: string, otp: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (otp.length === 6) {
           const mockUser: User = {
            id: 'usr_' + Math.floor(Math.random() * 1000),
            name: 'Student',
            email: '',
            phone: phone,
            role: 'student',
            avatar: `https://ui-avatars.com/api/?name=Student&background=ea580c&color=fff`,
            addresses: []
          };
          saveUser(mockUser);
          resolve(true);
        } else {
          resolve(false);
        }
      }, 1000);
    });
  };

  const register = async (name: string, email: string, password?: string): Promise<boolean> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockUser: User = {
          id: 'usr_' + Math.floor(Math.random() * 1000),
          name: name,
          email: email,
          role: 'student',
          avatar: `https://ui-avatars.com/api/?name=${name}&background=ea580c&color=fff`,
          addresses: []
        };
        saveUser(mockUser);
        resolve(true);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('pygenicarc_user');
  };

  const updateProfile = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...data };
      saveUser(updated);
      return updated;
    });
  };

  const addAddress = (address: Address) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = prev.addresses ? [...prev.addresses, address] : [address];
      const updatedUser = { ...prev, addresses: updatedAddresses };
      saveUser(updatedUser);
      return updatedUser;
    });
  };

  const removeAddress = (id: string) => {
    setUser((prev) => {
      if (!prev) return null;
      const updatedAddresses = prev.addresses?.filter(a => a.id !== id) || [];
      const updatedUser = { ...prev, addresses: updatedAddresses };
      saveUser(updatedUser);
      return updatedUser;
    });
  };

  return (
    <AuthContext.Provider value={{ 
        user, login, loginAdmin, loginWithOtp, register, logout, updateProfile, 
        addAddress, removeAddress,
        isAuthenticated: !!user, 
        isAdmin: user?.role === 'admin',
        loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
