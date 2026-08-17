import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { Outlet, NavLink, useNavigate, Navigate } from 'react-router-dom';
import {
  LayoutDashboard, Package, Tag, ShoppingCart, LogOut, Menu, X,
  Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Phone,
  MessageCircle, Eye, EyeOff, Zap, Sun, Star, Flame,
  Sparkles, Box, Gift, Layers, Shield, TrendingUp, Users, DollarSign,
  CheckCircle, Clock, XCircle, AlertCircle, ArrowUpRight, Filter,
  RefreshCw, Save, Lock, Mail
} from 'lucide-react';
import './Admin.css';

/* ── Supabase ─────────────────────────────────────── */
const SUPABASE_URL = 'https://iplfsscpeixfxzbouhlp.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';
const headers = { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, 'Content-Type': 'application/json', Prefer: 'return=representation' };
export const api = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, { headers, ...options });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

/* ── Helpers ──────────────────────────────────────── */
export const fmt = (n) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
export const fmtDate = (d) => new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

export const STATUS_CONFIG = {
  Pending:    { color: '#f59e0b', bg: 'rgba(245,158,11,0.12)',  icon: Clock },
  Processing: { color: '#3b82f6', bg: 'rgba(59,130,246,0.12)',  icon: RefreshCw },
  Completed:  { color: '#10b981', bg: 'rgba(16,185,129,0.12)',  icon: CheckCircle },
  Cancelled:  { color: '#ef4444', bg: 'rgba(239,68,68,0.12)',   icon: XCircle },
};

export const getCategoryIcon = (name = '') => {
  const n = name.toLowerCase();
  if (n.includes('sparkler') || n.includes('star')) return Sparkles;
  if (n.includes('pot') || n.includes('fountain')) return Sun;
  if (n.includes('bomb') || n.includes('sound')) return Zap;
  if (n.includes('chakkar') || n.includes('wheel') || n.includes('chakkara')) return RefreshCw;
  if (n.includes('gift') || n.includes('combo')) return Gift;
  if (n.includes('sky') || n.includes('rocket')) return ArrowUpRight;
  if (n.includes('kids') || n.includes('children')) return Shield;
  if (n.includes('fancy')) return Flame;
  return Layers;
};

/* ── Admin Data Context ───────────────────────────── */
export const AdminCtx = createContext(null);
export const useAdmin = () => useContext(AdminCtx);

/* ── Skeletons ────────────────────────────────────── */
export function DashboardSkeleton() {
  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="adm-skeleton" style={{width:120,height:24,marginBottom:8}} />
        <div className="adm-skeleton" style={{width:240,height:14}} />
      </div>
      <div className="stats-grid">
        {[1,2,3,4].map(i => (
          <div key={i} className="adm-sk-stat-card">
            <div className="adm-skeleton" style={{width:40,height:40,borderRadius:10}} />
            <div className="adm-skeleton" style={{width:100,height:32}} />
            <div className="adm-skeleton" style={{width:120,height:14}} />
            <div className="adm-skeleton" style={{width:80,height:12}} />
          </div>
        ))}
      </div>
      <div className="db-grid">
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div>
              <div className="adm-skeleton" style={{width:140,height:18,marginBottom:6}} />
              <div className="adm-skeleton" style={{width:180,height:12}} />
            </div>
          </div>
          <div style={{padding:20}}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="adm-sk-space-between" style={{padding:'14px 0',borderBottom:i===5?'none':'1px solid #f1f5f9'}}>
                <div className="adm-sk-flex">
                  <div className="adm-skeleton" style={{width:32,height:32,borderRadius:'50%'}} />
                  <div>
                    <div className="adm-skeleton" style={{width:120,height:14,marginBottom:6}} />
                    <div className="adm-skeleton" style={{width:80,height:10}} />
                  </div>
                </div>
                <div className="adm-skeleton" style={{width:70,height:20,borderRadius:20}} />
              </div>
            ))}
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div>
              <div className="adm-skeleton" style={{width:150,height:18,marginBottom:6}} />
              <div className="adm-skeleton" style={{width:200,height:12}} />
            </div>
          </div>
          <div className="adm-card-body" style={{paddingTop:12}}>
            {[1,2,3,4,5].map(i => (
              <div key={i} className="adm-sk-space-between" style={{padding:'12px 0',borderBottom:i===5?'none':'1px solid #f1f5f9'}}>
                <div className="adm-skeleton" style={{width:100,height:14}} />
                <div className="adm-skeleton" style={{width:30,height:14}} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export function CategoriesSkeleton() {
  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="adm-skeleton" style={{width:120,height:24,marginBottom:8}} />
        <div className="adm-skeleton" style={{width:200,height:14}} />
      </div>
      <div className="adm-skeleton" style={{width:150,height:14,marginBottom:20}} />
      <div className="cats-grid">
        {[1,2,3,4,5,6,7,8].map(i => (
          <div key={i} className="cat-card" style={{pointerEvents:'none'}}>
            <div className="adm-skeleton" style={{width:48,height:48,borderRadius:12,marginBottom:14}} />
            <div className="adm-skeleton" style={{width:120,height:16,marginBottom:8}} />
            <div className="adm-skeleton" style={{width:140,height:12}} />
          </div>
        ))}
      </div>
    </>
  );
}

export function ProductsSkeleton() {
  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="adm-skeleton" style={{width:100,height:24,marginBottom:8}} />
        <div className="adm-skeleton" style={{width:180,height:14}} />
      </div>
      <div className="adm-search-bar">
        <div className="adm-skeleton" style={{flex:1,height:40,borderRadius:9}} />
        <div className="adm-skeleton" style={{width:220,height:40,borderRadius:9}} />
        <div className="adm-skeleton" style={{width:130,height:40,borderRadius:9}} />
      </div>
      <div className="adm-skeleton" style={{width:180,height:14,marginBottom:12}} />
      <div className="adm-card">
        {[1,2,3,4,5].map(i => (
          <div key={i} className="adm-sk-table-row">
            <div className="adm-sk-flex" style={{flex:1}}>
              <div className="adm-skeleton" style={{width:44,height:44,borderRadius:8}} />
              <div>
                <div className="adm-skeleton" style={{width:180,height:14,marginBottom:6}} />
                <div className="adm-skeleton" style={{width:100,height:10}} />
              </div>
            </div>
            <div className="adm-skeleton" style={{width:120,height:14,marginRight:30}} />
            <div className="adm-skeleton" style={{width:60,height:14,marginRight:30}} />
            <div className="adm-skeleton" style={{width:40,height:14,marginRight:30}} />
            <div className="adm-skeleton" style={{width:28,height:28,borderRadius:'50%'}} />
          </div>
        ))}
      </div>
    </>
  );
}

export function OrdersSkeleton() {
  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="adm-skeleton" style={{width:90,height:24,marginBottom:8}} />
        <div className="adm-skeleton" style={{width:150,height:14}} />
      </div>
      <div className="adm-search-bar">
        <div className="adm-skeleton" style={{flex:1,height:40,borderRadius:9}} />
        <div className="adm-skeleton" style={{width:160,height:40,borderRadius:9}} />
      </div>
      <div className="adm-skeleton" style={{width:150,height:14,marginBottom:12}} />
      {[1,2,3].map(i => (
        <div key={i} className="adm-sk-order-card">
          <div className="adm-sk-space-between" style={{marginBottom:12}}>
            <div>
              <div className="adm-skeleton" style={{width:80,height:12,marginBottom:8}} />
              <div className="adm-skeleton" style={{width:180,height:18,marginBottom:8}} />
              <div className="adm-skeleton" style={{width:240,height:12}} />
            </div>
            <div className="adm-sk-flex" style={{flexDirection:'column',alignItems:'flex-end'}}>
              <div className="adm-skeleton" style={{width:80,height:22,borderRadius:20,marginBottom:8}} />
              <div className="adm-skeleton" style={{width:100,height:32,borderRadius:8}} />
            </div>
          </div>
          <div className="adm-sk-flex" style={{gap:8,marginBottom:12}}>
            <div className="adm-skeleton" style={{width:110,height:28,borderRadius:20}} />
            <div className="adm-skeleton" style={{width:110,height:28,borderRadius:20}} />
          </div>
          <div style={{background:'#f8fafc',borderRadius:8,padding:14}}>
            <div className="adm-sk-space-between" style={{marginBottom:8}}><div className="adm-skeleton" style={{width:150,height:12}} /><div className="adm-skeleton" style={{width:40,height:12}} /></div>
            <div className="adm-sk-space-between" style={{borderTop:'1px solid #e2e8f0',paddingTop:8}}><div className="adm-skeleton" style={{width:60,height:14}} /><div className="adm-skeleton" style={{width:50,height:14}} /></div>
          </div>
        </div>
      ))}
    </>
  );
}

/* ══════════════════════════════════════════════════
   LOGIN PAGE  →  /admin/login
══════════════════════════════════════════════════ */
export function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem('admin_logged_in') === 'true') navigate('/admin', { replace: true });
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault(); setError(''); setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (email === 'arjunansri21@gmail.com' && password === '12345678') {
      sessionStorage.setItem('admin_logged_in', 'true');
      navigate('/admin', { replace: true });
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
    <div className="adm">
      <div className="login-root">
        <div className="login-glow" />
        <div className="login-card">
          <div className="login-logo">
            <div className="login-icon"><Flame style={{width:28,height:28,color:'white'}} /></div>
            <div className="login-brand">SETHU PYRO PARK</div>
            <div className="login-sub2">RACHIKA CRACKERS</div>
          </div>
          <div className="login-title">Admin Sign In</div>
          <div className="login-desc">Enter your credentials to access the dashboard</div>
          {error && <div className="adm-err-box">{error}</div>}
          <form onSubmit={handleLogin}>
            <div className="adm-form-group">
              <label className="adm-form-lbl">Email Address</label>
              <div className="adm-inp-wrap">
                <Mail className="adm-inp-icon" />
                <input className="adm-form-input" type="email" placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
              </div>
            </div>
            <div className="adm-form-group">
              <label className="adm-form-lbl">Password</label>
              <div className="adm-inp-wrap">
                <Lock className="adm-inp-icon" />
                <input className="adm-form-input" type={showPw?'text':'password'} placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required />
                <button type="button" className="adm-inp-eye" onClick={()=>setShowPw(!showPw)}>
                  {showPw ? <EyeOff style={{width:16,height:16}} /> : <Eye style={{width:16,height:16}} />}
                </button>
              </div>
            </div>
            <button className="login-btn" type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In to Dashboard'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════
   SHARED LAYOUT  →  /admin/*
   Provides sidebar + header + data context
══════════════════════════════════════════════════ */
export function AdminLayout() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const [orders, setOrders]     = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading]   = useState(false);

  // Auth guard
  if (sessionStorage.getItem('admin_logged_in') !== 'true') {
    return <Navigate to="/admin/login" replace />;
  }

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([
        api('/products?order=product_code.asc'),
        api('/orders?order=created_at.desc'),
      ]);
      const ps = prods || [];
      setProducts(ps);
      setCategories([...new Set(ps.map(p => p.category).filter(Boolean))].sort());
      setOrders(ords || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const handleLogout = () => {
    sessionStorage.removeItem('admin_logged_in');
    navigate('/admin/login', { replace: true });
  };

  const navItems = [
    { to: '/admin',            label: 'Dashboard',  icon: LayoutDashboard, end: true },
    { to: '/admin/categories', label: 'Categories', icon: Tag,             badge: categories.length || null },
    { to: '/admin/products',   label: 'Products',   icon: Package,         badge: products.length || null },
    { to: '/admin/orders',     label: 'Orders',     icon: ShoppingCart,    badge: orders.filter(o=>o.status==='Pending').length || null },
  ];

  return (
    <AdminCtx.Provider value={{ products, orders, categories, loading, fetchAll }}>
      <div className="adm">
        <div className="adm-layout">
          {sidebarOpen && <div className="sb-ov" onClick={()=>setSidebarOpen(false)} />}

          {/* Sidebar */}
          <aside className={`adm-sidebar${sidebarOpen ? ' sb-open' : ''}`}>
            <div className="sb-logo">
              <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#ff6b35,#e85d23)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Flame style={{width:18,height:18,color:'white'}} />
              </div>
              <div><div className="sb-brand">Sethu Pyro Park</div><div className="sb-sub">Admin Panel</div></div>
            </div>
            <div className="sb-section">Navigation</div>
            <nav className="sb-nav">
              {navItems.map(item => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  className={({isActive})=>`sb-item${isActive?' active':''}`}
                  onClick={()=>setSidebarOpen(false)}
                >
                  <item.icon />
                  <span>{item.label}</span>
                  {item.badge ? <span className="sb-badge">{item.badge}</span> : null}
                </NavLink>
              ))}
            </nav>
            <div className="sb-section">Account</div>
            <div style={{padding:'4px 20px 12px',fontSize:12,color:'#64748b'}}>
              <div style={{fontWeight:600,color:'#94a3b8',marginBottom:2}}>arjunansri21@gmail.com</div>
              <div>Super Administrator</div>
            </div>
            <div className="sb-footer">
              <button className="logout-btn" onClick={handleLogout}><LogOut style={{width:16,height:16}} />Sign Out</button>
            </div>
          </aside>

          {/* Main */}
          <main className="adm-main">
            <header className="adm-header">
              <div className="hdr-left">
                <button className="menu-toggle" style={{display:'flex'}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen ? <X style={{width:18,height:18}} /> : <Menu style={{width:18,height:18}} />}
                </button>
              </div>
              <div className="hdr-right">
                <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={fetchAll} disabled={loading}>
                  <RefreshCw style={{width:14,height:14}} className={loading?'spinning':''} />
                  {loading?'Loading...':'Refresh'}
                </button>
                <div className="hdr-adm-info" style={{textAlign:'right'}}>
                  <div className="adm-name">Admin</div>
                  <div className="adm-role">Super Administrator</div>
                </div>
                <div className="avatar">A</div>
              </div>
            </header>

            {/* Page content rendered here */}
            <div className="adm-content">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </AdminCtx.Provider>
  );
}

/* ══════════════════════════════════════════════════
   DASHBOARD  →  /admin
══════════════════════════════════════════════════ */
export function AdminDashboard() {
  const { products, categories, orders, loading } = useAdmin();
  const navigate = useNavigate();

  const totalSales = orders.reduce((s, o) => {
    try { const items = typeof o.items==='string'?JSON.parse(o.items):(o.items||[]); return s+items.reduce((a,i)=>a+((i.price||0)*(i.quantity||1)),0); }
    catch { return s; }
  }, 0);
  const recentOrders = orders.slice(0, 5);
  const breakdown = categories.map(cat=>({ name:cat, count:products.filter(p=>p.category===cat&&p.is_active!==false).length })).filter(b=>b.count>0).sort((a,b)=>b.count-a.count);
  const stats = [
    { label:'Total Products', value:products.length, icon:Package,     color:'orange', trend:`${products.filter(p=>p.is_active!==false).length} active` },
    { label:'Categories',     value:categories.length, icon:Tag,       color:'blue',   trend:`${breakdown.length} non-empty` },
    { label:'Total Sales',    value:fmt(totalSales),   icon:DollarSign, color:'green', trend:`From ${orders.length} orders` },
    { label:'Total Orders',   value:orders.length,     icon:ShoppingCart,color:'purple',trend:`${orders.filter(o=>o.status==='Pending').length} pending` },
  ];

  if (loading) return <DashboardSkeleton />;

  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="pg-title">Dashboard</div>
        <div className="pg-sub">Welcome back! Here's what's happening.</div>
      </div>
      <div className="stats-grid">
        {stats.map(s => (
          <div key={s.label} className={`stat-card c-${s.color}`}>
            <div className={`stat-icon c-${s.color}`}><s.icon /></div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-trend">↑ {s.trend}</div>
          </div>
        ))}
      </div>
      <div className="db-grid">
        <div className="adm-card">
          <div className="adm-card-hdr">
            <div><div className="adm-card-title">Recent Orders</div><div className="adm-card-sub">Latest 5 customer orders</div></div>
            <button className="adm-btn adm-btn-secondary adm-btn-sm" onClick={()=>navigate('/admin/orders')}>
              View All <ArrowUpRight style={{width:12,height:12}} />
            </button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="adm-table">
              <thead><tr><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.length===0 ? (
                  <tr><td colSpan={4} style={{textAlign:'center',color:'#94a3b8',padding:32}}>No orders yet</td></tr>
                ) : recentOrders.map(o => {
                  const items = (()=>{ try { return typeof o.items==='string'?JSON.parse(o.items):(o.items||[]); } catch{return[];} })();
                  const total = items.reduce((a,i)=>a+((i.price||0)*(i.quantity||1)),0);
                  const cfg = STATUS_CONFIG[o.status]||STATUS_CONFIG.Pending;
                  return (
                    <tr key={o.id}>
                      <td><div style={{fontWeight:600,color:'#1e293b'}}>{o.name||'—'}</div><div style={{fontSize:11,color:'#94a3b8'}}>{o.phone||''}</div></td>
                      <td style={{fontSize:12}}>{fmtDate(o.created_at)}</td>
                      <td style={{fontWeight:600,color:'#ff6b35'}}>{fmt(total)}</td>
                      <td><span className="adm-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}33`}}><span className="adm-dot" style={{background:cfg.color}} />{o.status||'Pending'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="adm-card">
          <div className="adm-card-hdr"><div><div className="adm-card-title">Product Breakdown</div><div className="adm-card-sub">Active products per category</div></div></div>
          <div className="adm-card-body" style={{paddingTop:12}}>
            {breakdown.length===0 ? <div style={{textAlign:'center',color:'#94a3b8',fontSize:13,padding:'24px 0'}}>No active products</div>
            : breakdown.map(b=>(
              <div key={b.name} className="bd-item">
                <div className="bd-name">{b.name}</div>
                <div className="bd-cnt">{b.count}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   CATEGORIES  →  /admin/categories
══════════════════════════════════════════════════ */
export function AdminCategories() {
  const { categories, products, loading } = useAdmin();
  const navigate = useNavigate();
  const colors = ['#ff6b35','#3b82f6','#10b981','#8b5cf6','#f59e0b','#ec4899','#14b8a6','#f97316'];

  if (loading) return <CategoriesSkeleton />;

  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="pg-title">Categories</div>
        <div className="pg-sub">{categories.length} product categories</div>
      </div>
      <div style={{marginBottom:16,fontSize:13,color:'#64748b'}}>{categories.length} categories found</div>
      <div className="cats-grid">
        {categories.map((cat, i) => {
          const Icon = getCategoryIcon(cat);
          const count = products.filter(p=>p.category===cat).length;
          const activeCount = products.filter(p=>p.category===cat&&p.is_active!==false).length;
          const color = colors[i % colors.length];
          return (
            <div key={cat} className="cat-card" onClick={()=>navigate(`/admin/products?cat=${encodeURIComponent(cat)}`)}>
              <ArrowUpRight className="cat-arrow" />
              <div className="cat-icon" style={{background:`${color}18`}}><Icon style={{width:22,height:22,color}} /></div>
              <div className="cat-name">{cat}</div>
              <div className="cat-cnt">{activeCount} active · {count} total</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   PRODUCTS  →  /admin/products
══════════════════════════════════════════════════ */
function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="adm-modal-ov">
      <div className="adm-modal adm-modal-sm">
        <div className="adm-modal-hdr">
          <div className="adm-modal-title" style={{color:'#ef4444'}}>⚠ Confirm Delete</div>
          <button className="adm-close-btn" onClick={onCancel}><X style={{width:16,height:16}} /></button>
        </div>
        <div className="adm-modal-body">
          <div style={{fontSize:16,fontWeight:700,color:'#0f172a',marginBottom:8}}>{title}</div>
          <div style={{fontSize:13,color:'#64748b',lineHeight:1.6}}>{message}</div>
        </div>
        <div className="adm-modal-ftr">
          <button className="adm-btn adm-btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="adm-btn adm-btn-danger" onClick={onConfirm}>Yes, Delete</button>
        </div>
      </div>
    </div>
  );
}

function ProductModal({ product, categories, onClose, onSaved }) {
  const isEdit = !!product;
  const [form, setForm] = useState({
    product_code: product?.product_code || '',
    name: product?.name || '',
    category: product?.category || categories[0] || '',
    mrp: product?.mrp || '',
    discount: product?.discount || '',
    price: product?.price || '',
    unit: product?.unit || '',
    image_url: product?.image_url || '',
    is_active: product?.is_active !== false,
  });
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState('');

  const set = (k, v) => setForm(f => {
    const next = { ...f, [k]: v };
    if (k === 'mrp' || k === 'discount') {
      const m = parseFloat(k==='mrp'?v:next.mrp);
      const d = parseFloat(k==='discount'?v:next.discount);
      if (!isNaN(m)&&!isNaN(d)) next.price = Math.round(m*(1-d/100));
      else if (k==='mrp'&&isNaN(m)) next.price = '';
    }
    return next;
  });

  const save = async () => {
    if (!form.product_code||!form.name||!form.category) { setErr('Product Code, Name and Category are required.'); return; }
    setSaving(true); setErr('');
    try {
      const body = { ...form, mrp:form.mrp||null, discount:form.discount||null, price:form.price||null };
      if (isEdit) await api(`/products?id=eq.${product.id}`,{method:'PATCH',body:JSON.stringify(body)});
      else await api('/products',{method:'POST',body:JSON.stringify(body)});
      onSaved();
    } catch(e) { setErr(e.message); }
    setSaving(false);
  };

  return (
    <div className="adm-modal-ov">
      <div className="adm-modal">
        <div className="adm-modal-hdr">
          <div className="adm-modal-title">{isEdit ? '✏ Edit Product' : '＋ Add New Product'}</div>
          <button className="adm-close-btn" onClick={onClose}><X style={{width:16,height:16}} /></button>
        </div>
        <div className="adm-modal-body">
          {err && <div className="adm-err-box" style={{marginBottom:16}}>{err}</div>}
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-lbl">Product Code *</label>
              <input className="adm-form-input" placeholder="e.g. A001" value={form.product_code} onChange={e=>set('product_code',e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-lbl">Category *</label>
              <select className="adm-form-select" value={form.category} onChange={e=>set('category',e.target.value)}>
                {categories.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-form-lbl">Product Name *</label>
            <input className="adm-form-input" placeholder="e.g. Premium Sparklers 4 inch" value={form.name} onChange={e=>set('name',e.target.value)} />
          </div>
          <div className="adm-form-row-3">
            <div className="adm-form-group">
              <label className="adm-form-lbl">MRP Price (₹)</label>
              <input className="adm-form-input" type="number" placeholder="0" value={form.mrp} onChange={e=>set('mrp',e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-lbl">Discount (%)</label>
              <input className="adm-form-input" type="number" placeholder="0" min="0" max="100" value={form.discount} onChange={e=>set('discount',e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-lbl">Selling Price (₹)</label>
              <input className="adm-form-input" type="number" placeholder="Auto-calculated" value={form.price} onChange={e=>set('price',e.target.value)} style={{background:'#f8fafc'}} disabled />
            </div>
          </div>
          {form.mrp && form.discount && (
            <div className="adm-price-calc">
              Auto-calc: ₹{form.mrp} × (1 − {form.discount}%) = <strong style={{color:'#ff6b35'}}>₹{form.price}</strong>
            </div>
          )}
          <div className="adm-form-row">
            <div className="adm-form-group">
              <label className="adm-form-lbl">Unit / Pack Size</label>
              <input className="adm-form-input" placeholder="e.g. 1 Box, 10 Pcs" value={form.unit} onChange={e=>set('unit',e.target.value)} />
            </div>
            <div className="adm-form-group">
              <label className="adm-form-lbl">Image URL</label>
              <input className="adm-form-input" placeholder="https://..." value={form.image_url} onChange={e=>set('image_url',e.target.value)} />
            </div>
          </div>
          <div className="adm-form-group">
            <label className="adm-form-lbl">Status</label>
            <select className="adm-form-select" value={form.is_active?'true':'false'} onChange={e=>set('is_active',e.target.value==='true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="adm-modal-ftr">
          <button className="adm-btn adm-btn-secondary" onClick={onClose}>Cancel</button>
          <button className="adm-btn adm-btn-primary" onClick={save} disabled={saving}>
            <Save style={{width:14,height:14}} />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

export function AdminProducts() {
  const { products, categories, loading, fetchAll } = useAdmin();
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('');
  const [modalProd, setModalProd] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toggling, setToggling] = useState(null);

  // Support ?cat= from categories page
  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get('cat');
    if (p) setCatFilter(decodeURIComponent(p));
  }, []);

  const filtered = products.filter(p => {
    const q = search.toLowerCase();
    return (!q || ((p.product_code||'').toLowerCase().includes(q) || (p.name||'').toLowerCase().includes(q)))
        && (!catFilter || p.category === catFilter);
  });

  const toggleActive = async (prod) => {
    setToggling(prod.id);
    try { await api(`/products?id=eq.${prod.id}`,{method:'PATCH',body:JSON.stringify({is_active:!prod.is_active})}); fetchAll(); }
    catch(e){alert(e.message);}
    setToggling(null);
  };

  const deleteProduct = async (id) => {
    try { await api(`/products?id=eq.${id}`,{method:'DELETE'}); fetchAll(); }
    catch(e){alert(e.message);}
    setConfirm(null);
  };

  if (loading) return <ProductsSkeleton />;

  return (
    <>
      {modalProd !== null && <ProductModal product={modalProd||null} categories={categories} onClose={()=>setModalProd(null)} onSaved={()=>{setModalProd(null);fetchAll();}} />}
      {confirm && <ConfirmDialog title="Delete Product?" message={`Permanently delete "${confirm.name}"? This cannot be undone.`} onConfirm={()=>deleteProduct(confirm.id)} onCancel={()=>setConfirm(null)} />}

      <div style={{marginBottom:24}}>
        <div className="pg-title">Products</div>
        <div className="pg-sub">{products.length} products in catalog</div>
      </div>

      <div className="adm-search-bar">
        <div className="adm-search-wrap">
          <Search className="si" />
          <input className="adm-form-input" placeholder="Search by name or product code..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{position:'relative',minWidth:220}}>
          <Filter style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'#94a3b8',pointerEvents:'none'}} />
          <select className="adm-form-select" value={catFilter} onChange={e=>setCatFilter(e.target.value)} style={{paddingLeft:36}}>
            <option value="">All Categories</option>
            {categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="adm-btn adm-btn-primary" onClick={()=>setModalProd(false)}><Plus />Add Product</button>
      </div>

      <div style={{marginBottom:12,fontSize:13,color:'#64748b'}}>
        Showing {filtered.length} of {products.length} products{catFilter&&<span> in <strong style={{color:'#ff6b35'}}>{catFilter}</strong></span>}
      </div>

      <div className="adm-card">
        <div style={{overflowX:'auto'}}>
          <table className="adm-table">
            <thead><tr><th>#</th><th>Product</th><th>Category</th><th>MRP</th><th>Discount</th><th>Price</th><th>Unit</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={9}><div className="adm-empty-state"><Package /><p>No products found</p></div></td></tr>
              ) : filtered.map((p, idx) => (
                <tr key={p.id}>
                  <td style={{color:'#94a3b8',fontFamily:'monospace',fontSize:11}}>{idx+1}</td>
                  <td>
                    <div style={{display:'flex',alignItems:'center',gap:12}}>
                      {p.image_url ? <img src={p.image_url} alt="" className="prod-thumb" onError={e=>{e.target.style.display='none'}} /> : <div className="prod-thumb-ph"><Box style={{width:18,height:18}} /></div>}
                      <div><div className="prod-name">{p.name}</div><div className="prod-code">{p.product_code}</div></div>
                    </div>
                  </td>
                  <td style={{fontSize:12,color:'#94a3b8',maxWidth:180}}>{p.category}</td>
                  <td style={{fontSize:13,color:'#64748b'}}>{p.mrp?`₹${p.mrp}`:'—'}</td>
                  <td style={{fontSize:13,color:'#f59e0b'}}>{p.discount?`${p.discount}%`:'—'}</td>
                  <td style={{fontSize:13,fontWeight:700,color:'#10b981'}}>{p.price?`₹${p.price}`:'—'}</td>
                  <td style={{fontSize:12,color:'#64748b'}}>{p.unit||'—'}</td>
                  <td>
                    <button className="tog-btn" onClick={()=>toggleActive(p)} disabled={toggling===p.id}>
                      {p.is_active!==false ? <ToggleRight style={{width:28,height:28,color:'#10b981'}} /> : <ToggleLeft style={{width:28,height:28,color:'#cbd5e1'}} />}
                    </button>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                      <button className="adm-btn adm-btn-secondary adm-btn-icon adm-btn-sm" onClick={()=>setModalProd(p)} title="Edit"><Edit2 style={{width:14,height:14}} /></button>
                      <button className="adm-btn adm-btn-danger adm-btn-icon adm-btn-sm" onClick={()=>setConfirm(p)} title="Delete"><Trash2 style={{width:14,height:14}} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

/* ══════════════════════════════════════════════════
   ORDERS  →  /admin/orders
══════════════════════════════════════════════════ */
export function AdminOrders() {
  const { orders, loading, fetchAll } = useAdmin();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    return (!q || ((o.name||'').toLowerCase().includes(q) || (o.phone||'').includes(q)))
        && (!statusFilter || o.status === statusFilter);
  });

  const renderItems = (raw) => { try { return typeof raw==='string'?JSON.parse(raw):(raw||[]); } catch{return[];} };

  const updateStatus = async (id, status) => {
    setUpdatingStatus(id);
    try { await api(`/orders?id=eq.${id}`,{method:'PATCH',body:JSON.stringify({status})}); fetchAll(); }
    catch(e){alert(e.message);}
    setUpdatingStatus(null);
  };

  if (loading) return <OrdersSkeleton />;

  return (
    <>
      <div style={{marginBottom:24}}>
        <div className="pg-title">Orders</div>
        <div className="pg-sub">{orders.length} total orders</div>
      </div>

      <div className="adm-search-bar">
        <div className="adm-search-wrap">
          <Search className="si" />
          <input className="adm-form-input" placeholder="Search by name or phone..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="adm-form-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{minWidth:160}}>
          <option value="">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div style={{marginBottom:12,fontSize:13,color:'#64748b'}}>{filtered.length} orders{statusFilter&&` with status "${statusFilter}"`}</div>

      {filtered.length===0 ? (
        <div className="adm-empty-state"><ShoppingCart /><p>No orders found</p></div>
      ) : filtered.map(o => {
        const items = renderItems(o.items);
        const total = items.reduce((a,i)=>a+((i.price||0)*(i.quantity||1)),0);
        const cfg = STATUS_CONFIG[o.status]||STATUS_CONFIG.Pending;
        const ph = (o.phone||'').replace(/\D/g,'');
        return (
          <div key={o.id} className="order-card">
            <div className="order-hdr">
              <div>
                <div className="order-id">#{o.id}</div>
                <div className="order-cust">{o.name||'Unknown Customer'}</div>
                <div className="order-meta">
                  {o.address&&<span>📍 {o.address}</span>}
                  {o.created_at&&<span style={{marginLeft:12}}>🕐 {fmtDate(o.created_at)}</span>}
                </div>
                {o.phone&&(
                  <div className="order-contact">
                    <a href={`tel:${o.phone}`} className="adm-chip adm-chip-phone"><Phone style={{width:12,height:12}} />{o.phone}</a>
                    <a href={`https://wa.me/${ph}`} target="_blank" rel="noreferrer" className="adm-chip adm-chip-wa"><MessageCircle style={{width:12,height:12}} />WhatsApp</a>
                  </div>
                )}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                <span className="adm-badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}33`}}>
                  <span className="adm-dot" style={{background:cfg.color}} />{o.status||'Pending'}
                </span>
                <select className="adm-status-sel" value={o.status||'Pending'} onChange={e=>updateStatus(o.id,e.target.value)} disabled={updatingStatus===o.id}>
                  {Object.keys(STATUS_CONFIG).map(s=><option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            {items.length>0&&(
              <div className="order-items">
                {items.map((item,i)=>(
                  <div key={i} className="order-item-row">
                    <span>{item.quantity||1}x {item.name||item.product_name||'Product'}</span>
                    <span style={{color:'#ff6b35'}}>₹{(item.price||0)*(item.quantity||1)}</span>
                  </div>
                ))}
                <div className="order-total"><span>Total</span><span>{fmt(total)}</span></div>
              </div>
            )}
          </div>
        );
      })}
    </>
  );
}

/* ── Default export kept for backward compat ─────── */
export default AdminLayout;
