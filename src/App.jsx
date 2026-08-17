import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Cart from './components/Cart';
import Home from './pages/Home';
import Order from './pages/Order';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import Orders from './pages/admin/Orders';

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: '#1a1a2e',
              color: '#fff',
              border: '1px solid #ff6b35',
              borderRadius: '12px',
            }
          }}
        />
        <Routes>
          {/* Shop Routes */}
          <Route path="/" element={
            <>
              <Navbar />
              <Cart />
              <Home />
            </>
          } />
          <Route path="/order" element={
            <>
              <Navbar />
              <Cart />
              <Order />
            </>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="products" element={<Products />} />
            <Route path="orders" element={<Orders />} />
          </Route>
        </Routes>
      </CartProvider>
    </BrowserRouter>
  );
}
