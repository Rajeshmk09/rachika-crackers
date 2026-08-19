import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShopProvider } from './context/ShopContext';
import MainHeader from './components/MainHeader';
import CartModal from './components/CartModal';
import ScrollToTop from './components/ScrollToTop';
import SiteFooter from './components/SiteFooter';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import SafetyTips from './pages/SafetyTips';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import AdminLayout, { AdminLogin, AdminCategories, AdminProducts, AdminAnnouncement, AdminHeroBanners, AdminSettings, AdminOrders } from './pages/Admin';

// Global query client — staleTime=5min means cached data shows instantly on navigation
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,   // 5 minutes — cached data used without re-fetching
      gcTime: 10 * 60 * 1000,     // 10 minutes — keep in memory after unmount
      refetchOnWindowFocus: false, // Don't refetch just because user switches tabs
      retry: 1,
    },
  },
});

import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <Router>
          <ScrollToTop />
          <Toaster 
            position="top-center" 
            reverseOrder={false} 
            containerStyle={{
              zIndex: 1000000,
            }}
          />
          <CartModal />
          <MainHeader />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/safetytips" element={<SafetyTips />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="/admin/orders" replace />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />

              <Route path="banners" element={<AdminHeroBanners />} />
              <Route path="announcement" element={<AdminAnnouncement />} />
              <Route path="settings" element={<AdminSettings />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Routes>
          <SiteFooter />
        </Router>
      </ShopProvider>
    </QueryClientProvider>
  );
}

export default App;
