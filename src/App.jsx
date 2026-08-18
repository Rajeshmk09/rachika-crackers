import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ShopProvider } from './context/ShopContext';
import MainHeader from './components/MainHeader';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home';
import About from './pages/About';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Contact from './pages/Contact';
import SafetyTips from './pages/SafetyTips';
import Wishlist from './pages/Wishlist';
import Cart from './pages/Cart';
import AdminLayout, { AdminLogin, AdminDashboard, AdminCategories, AdminProducts, AdminOrders, AdminAnnouncement, AdminHeroBanners } from './pages/Admin';

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

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ShopProvider>
        <Router>
          <ScrollToTop />
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
              <Route index element={<AdminDashboard />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="orders" element={<AdminOrders />} />
              <Route path="banners" element={<AdminHeroBanners />} />
              <Route path="announcement" element={<AdminAnnouncement />} />
            </Route>
          </Routes>
        </Router>
      </ShopProvider>
    </QueryClientProvider>
  );
}

export default App;
