import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import toast from 'react-hot-toast';
import { Eye } from 'lucide-react';

const STATUS_OPTIONS = ['pending', 'confirmed', 'packed', 'delivered', 'cancelled'];

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrders(); }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    setOrders(data || []);
    setLoading(false);
  }

  async function updateStatus(id, status) {
    await supabase.from('orders').update({ status }).eq('id', id);
    toast.success('Status updated!');
    fetchOrders();
  }

  return (
    <div className="admin-page">
      <h1 className="admin-page-title">📋 Orders</h1>

      {loading ? <p className="no-data">Loading...</p> : orders.length === 0 ? (
        <p className="no-data">No orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map(o => (
            <div className="order-card-admin" key={o.id}>
              <div className="order-card-header">
                <div>
                  <h3>👤 {o.customer_name}</h3>
                  <p>📞 {o.phone}</p>
                  <p>📍 {o.address}</p>
                  <p>🕐 {new Date(o.created_at).toLocaleString('en-IN')}</p>
                </div>
                <div className="order-meta">
                  <strong className="order-total">₹{o.total.toFixed(2)}</strong>
                  <select
                    className={`status-select ${o.status}`}
                    value={o.status}
                    onChange={e => updateStatus(o.id, e.target.value)}
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                  <button
                    className="view-items-btn"
                    onClick={() => setExpanded(expanded === o.id ? null : o.id)}
                  >
                    <Eye size={16} /> {expanded === o.id ? 'Hide' : 'View'} Items
                  </button>
                </div>
              </div>

              {expanded === o.id && (
                <div className="order-items-expand">
                  <table className="admin-table">
                    <thead><tr><th>Product</th><th>Qty</th><th>Price</th><th>Subtotal</th></tr></thead>
                    <tbody>
                      {(o.items || []).map((item, i) => (
                        <tr key={i}>
                          <td>{item.name}</td>
                          <td>{item.qty}</td>
                          <td>₹{item.price}</td>
                          <td>₹{(item.price * item.qty).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
