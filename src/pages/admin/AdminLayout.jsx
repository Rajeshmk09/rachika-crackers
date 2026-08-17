import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Package, ClipboardList, ArrowLeft, Sparkles } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <Sparkles size={24} />
          <span>Admin Panel</span>
        </div>
        <nav className="admin-nav">
          <NavLink to="/admin" end className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
            <LayoutDashboard size={20} /> Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
            <Package size={20} /> Products
          </NavLink>
          <NavLink to="/admin/orders" className={({ isActive }) => isActive ? 'admin-link active' : 'admin-link'}>
            <ClipboardList size={20} /> Orders
          </NavLink>
        </nav>
        <button className="admin-back-btn" onClick={() => navigate('/')}>
          <ArrowLeft size={16} /> Back to Shop
        </button>
      </aside>
      <main className="admin-main">
        <Outlet />
      </main>
    </div>
  );
}
