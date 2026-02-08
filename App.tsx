
import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Gallery from './pages/Gallery';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';
import VivaHub from './pages/VivaHub';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import HelpCenter from './pages/HelpCenter';
import SuccessStories from './pages/SuccessStories';
import Blog from './pages/Blog';
import About from './pages/About';
import Legal from './pages/Legal';
import { CartProvider } from './contexts/CartContext';

const App: React.FC = () => {
  return (
    <CartProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Gallery />} />
            <Route path="/project/:id" element={<ProjectDetail />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/viva" element={<VivaHub />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation" element={<OrderConfirmation />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/about" element={<About />} />
            <Route path="/legal" element={<Legal />} />
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;
