import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import Gallery from './pages/Gallery';
import ProjectDetail from './pages/ProjectDetail';
import Dashboard from './pages/Dashboard';
import VivaHub from './pages/VivaHub';
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
          </Routes>
        </Layout>
      </Router>
    </CartProvider>
  );
};

export default App;