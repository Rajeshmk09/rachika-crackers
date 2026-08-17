import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Package, ClipboardList, TrendingUp, IndianRupee } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ products: 0, orders: 0, revenue: 0, pending: 0 });
  const [recentOrders, setRecentOrders] = useState([]);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    const [{ count: products }, { data: orders }] = await Promise.all([
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('*').order('created_at', { ascending: false })
    ]);
    const revenue = (orders || []).reduce((s, o) => s + o.total, 0);
    const pending = (orders || []).filter(o => o.status === 'pending').length;
    setStats({ products: products || 0, orders: (orders || []).length, revenue, pending });
    setRecentOrders((orders || []).slice(0, 5));
  }

  const cards = [
    { label: 'Total Products', value: stats.products, icon: <Package size={28} />, color: '#ff6b35' },
    { label: 'Total Orders', value: stats.orders, icon: <ClipboardList size={28} />, color: '#7c3aed' },
    { label: 'Revenue', value: `₹${stats.revenue.toFixed(0)}`, icon: <IndianRupee size={28} />, color: '#059669' },
    { label: 'Pending Orders', value: stats.pending, icon: <TrendingUp size={28} />, color: '#dc2626' },
  ];

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">📊 Dashboard</h1>
      <div className="stats-grid">
        {cards.map((c, i) => (
          <div className="stat-card" key={i} style={{ '--accent': c.color }}>
            <div className="stat-icon">{c.icon}</div>
            <div>
              <p className="stat-label">{c.label}</p>
              <h3 className="stat-value">{c.value}</h3>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-orders">
        <h2>🕐 Recent Orders</h2>
        {recentOrders.length === 0 ? (
          <p className="no-data">No orders yet</p>
        ) : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Customer</th>
                <th>Phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map(o => (
                <tr key={o.id}>
                  <td>{o.customer_name}</td>
                  <td>{o.phone}</td>
                  <td>₹{o.total.toFixed(2)}</td>
                  <td><span className={`status-badge ${o.status}`}>{o.status}</span></td>
                  <td>{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
