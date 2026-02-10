
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import Gallery from './pages/Gallery';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';
import VivaHub from './pages/VivaHub';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import HelpCenter from './pages/HelpCenter';
import TicketDetail from './pages/TicketDetail';
import SuccessStories from './pages/SuccessStories';
import Blog from './pages/Blog';
import BlogPostDetail from './pages/BlogPostDetail';
import About from './pages/About';
import Legal from './pages/Legal';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';
import Community from './pages/Community';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { WishlistProvider } from './contexts/WishlistContext';
import { ReviewProvider } from './contexts/ReviewContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ToastContainer } from './components/ToastContainer';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <NotificationProvider>
          <WishlistProvider>
            <CartProvider>
              <ReviewProvider>
                <Router>
                  <Routes>
                    {/* Admin Routes (No Standard Layout) */}
                    <Route path="/admin/login" element={<AdminLogin />} />
                    <Route path="/admin" element={<AdminPanel />} />

                    {/* User Routes (With Standard Layout) */}
                    <Route path="*" element={
                      <Layout>
                        <Routes>
                          {/* Public Routes */}
                          <Route path="/" element={<Gallery />} />
                          <Route path="/project/:id" element={<ProjectDetail />} />
                          <Route path="/viva" element={<VivaHub />} />
                          <Route path="/cart" element={<Cart />} />
                          <Route path="/wishlist" element={<Wishlist />} />
                          <Route path="/checkout" element={<Checkout />} />
                          <Route path="/help" element={<HelpCenter />} />
                          <Route path="/success-stories" element={<SuccessStories />} />
                          <Route path="/blog" element={<Blog />} />
                          <Route path="/blog/:slug" element={<BlogPostDetail />} />
                          <Route path="/about" element={<About />} />
                          <Route path="/legal" element={<Legal />} />
                          <Route path="/login" element={<Login />} />
                          <Route path="/order-confirmation" element={<OrderConfirmation />} />
                          <Route path="/community" element={<Community />} />

                          {/* Protected Routes */}
                          <Route 
                            path="/dashboard" 
                            element={
                              <ProtectedRoute>
                                <Dashboard />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/ticket/:id" 
                            element={
                              <ProtectedRoute>
                                <TicketDetail />
                              </ProtectedRoute>
                            } 
                          />
                          <Route 
                            path="/profile" 
                            element={
                              <ProtectedRoute>
                                <Profile />
                              </ProtectedRoute>
                            } 
                          />
                        </Routes>
                      </Layout>
                    } />
                  </Routes>
                  <ToastContainer />
                </Router>
              </ReviewProvider>
            </CartProvider>
          </WishlistProvider>
        </NotificationProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
