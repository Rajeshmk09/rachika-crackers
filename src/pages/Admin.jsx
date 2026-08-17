import React, { useState, useEffect, useCallback } from 'react';
import {
  LayoutDashboard, Package, Tag, ShoppingCart, LogOut, Menu, X,
  Search, Plus, Edit2, Trash2, ToggleLeft, ToggleRight, Phone,
  MessageCircle, Eye, EyeOff, Zap, Sun, Star, Flame,
  Sparkles, Box, Gift, Layers, Shield, TrendingUp, Users, DollarSign,
  CheckCircle, Clock, XCircle, AlertCircle, ArrowUpRight, Filter,
  RefreshCw, Save, Lock, Mail
} from 'lucide-react';

const SUPABASE_URL = 'https://iplfsscpeixfxzbouhlp.supabase.co';
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlwbGZzc2NwZWl4Znh6Ym91aGxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY5NDQwNzksImV4cCI6MjEwMjUyMDA3OX0.nr2an5w0nX_L37C3g03HgzpFitueRNeOJ346TYvakZ8';

const headers = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  'Content-Type': 'application/json',
  Prefer: 'return=representation',
};

const api = async (path, options = {}) => {
  const res = await fetch(`${SUPABASE_URL}/rest/v1${path}`, { headers, ...options });
  if (!res.ok) throw new Error(await res.text());
  const text = await res.text();
  return text ? JSON.parse(text) : null;
};

const getCategoryIcon = (name = '') => {
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

const STATUS_CONFIG = {
  Pending: { color: '#f59e0b', bg: 'rgba(245,158,11,0.15)', icon: Clock },
  Processing: { color: '#3b82f6', bg: 'rgba(59,130,246,0.15)', icon: RefreshCw },
  Completed: { color: '#10b981', bg: 'rgba(16,185,129,0.15)', icon: CheckCircle },
  Cancelled: { color: '#ef4444', bg: 'rgba(239,68,68,0.15)', icon: XCircle },
};

const fmt = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);

const fmtDate = (d) =>
  new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
  .adm * { box-sizing: border-box; margin: 0; padding: 0; }
  .adm { font-family: 'Inter', sans-serif; background: #f1f5f9; color: #1e293b; min-height: 100vh; }
  body { overflow-y: scroll !important; }
  .adm ::-webkit-scrollbar { width: 6px; height: 6px; }
  .adm ::-webkit-scrollbar-track { background: #f1f5f9; }
  .adm ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
  .adm ::-webkit-scrollbar-thumb:hover { background: #ff6b35; }
  .adm-layout { display: flex; min-height: 100vh; }
  .adm-sidebar {
    width: 260px; background: #ffffff; border-right: 1px solid #e2e8f0;
    display: flex; flex-direction: column; position: fixed; top: 0; left: 0; z-index: 100;
    height: 100vh; overflow-y: auto; transition: transform 0.3s ease;
    box-shadow: 2px 0 12px rgba(0,0,0,0.05);
  }
  .adm-sidebar.sb-hidden { transform: translateX(-260px); }
  .adm-sidebar.sb-open { transform: translateX(0); }
  .sb-logo { padding: 22px 20px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; gap: 12px; }
  .sb-brand { font-size: 13px; font-weight: 800; background: linear-gradient(135deg,#ff6b35,#e85d23); -webkit-background-clip: text; -webkit-text-fill-color: transparent; text-transform: uppercase; letter-spacing: 0.5px; }
  .sb-sub { font-size: 10px; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase; margin-top: 2px; }
  .sb-section { font-size: 10px; font-weight: 600; color: #94a3b8; letter-spacing: 1.5px; text-transform: uppercase; padding: 18px 20px 8px; }
  .sb-nav { flex: 1; }
  .sb-item {
    display: flex; align-items: center; gap: 12px; padding: 11px 20px;
    color: #64748b; font-size: 14px; font-weight: 500; cursor: pointer;
    border-left: 3px solid transparent; transition: all 0.2s;
  }
  .sb-item:hover { background: #fff7f4; color: #ff6b35; border-left-color: rgba(255,107,53,0.4); }
  .sb-item.active { background: #fff3ee; color: #ff6b35; border-left-color: #ff6b35; }
  .sb-item svg { width: 18px; height: 18px; flex-shrink: 0; }
  .sb-badge { margin-left: auto; background: #ff6b35; color: white; font-size: 10px; font-weight: 700; padding: 2px 7px; border-radius: 20px; }
  .sb-footer { padding: 16px; border-top: 1px solid #f1f5f9; }
  .logout-btn { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #fff1f2; color: #ef4444; border: 1px solid #fecaca; border-radius: 8px; cursor: pointer; font-size: 13px; font-weight: 600; width: 100%; transition: all 0.2s; }
  .logout-btn:hover { background: #ffe4e6; }
  .adm-main { margin-left: 260px; flex: 1; display: flex; flex-direction: column; min-height: 100vh; }
  .adm-header {
    position: sticky; top: 0; z-index: 50; background: rgba(255,255,255,0.95); backdrop-filter: blur(12px);
    border-bottom: 1px solid #e2e8f0; padding: 0 24px; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  }
  .hdr-left { display: flex; align-items: center; gap: 14px; }
  .menu-toggle { background: none; border: 1px solid #e2e8f0; color: #64748b; border-radius: 8px; padding: 8px; cursor: pointer; display: none; transition: all 0.2s; }
  .menu-toggle:hover { border-color: #ff6b35; color: #ff6b35; }
  .pg-title { font-size: 17px; font-weight: 700; color: #0f172a; }
  .pg-sub { font-size: 11px; color: #94a3b8; margin-top: 1px; }
  .hdr-right { display: flex; align-items: center; gap: 12px; }
  .avatar { width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg,#ff6b35,#f7c59f); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: white; }
  .adm-name { font-size: 13px; font-weight: 600; color: #0f172a; }
  .adm-role { font-size: 11px; color: #94a3b8; }
  .adm-content { padding: 24px; flex: 1; }
  .card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .card-hdr { padding: 18px 22px 14px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; }
  .card-title { font-size: 15px; font-weight: 700; color: #0f172a; }
  .card-sub { font-size: 12px; color: #94a3b8; margin-top: 2px; }
  .card-body { padding: 20px 22px; }
  .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-bottom: 24px; }
  .stat-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px 22px; position: relative; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.05); }
  .stat-card::before { content: ''; position: absolute; top: 0; right: 0; width: 100px; height: 100px; border-radius: 50%; opacity: 0.06; transform: translate(30px,-30px); }
  .stat-card.c-orange::before { background: #ff6b35; }
  .stat-card.c-blue::before { background: #3b82f6; }
  .stat-card.c-green::before { background: #10b981; }
  .stat-card.c-purple::before { background: #8b5cf6; }
  .stat-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .stat-icon.c-orange { background: #fff3ee; color: #ff6b35; }
  .stat-icon.c-blue { background: #eff6ff; color: #3b82f6; }
  .stat-icon.c-green { background: #ecfdf5; color: #10b981; }
  .stat-icon.c-purple { background: #f5f3ff; color: #8b5cf6; }
  .stat-icon svg { width: 20px; height: 20px; }
  .stat-val { font-size: 26px; font-weight: 800; color: #0f172a; margin-bottom: 4px; letter-spacing: -0.5px; }
  .stat-lbl { font-size: 12px; color: #64748b; font-weight: 500; }
  .stat-trend { font-size: 11px; color: #10b981; margin-top: 8px; font-weight: 500; }
  .adm-table { width: 100%; border-collapse: collapse; }
  .adm-table th { padding: 12px 16px; text-align: left; font-size: 11px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.8px; border-bottom: 1px solid #f1f5f9; white-space: nowrap; background: #fafafa; }
  .adm-table td { padding: 14px 16px; font-size: 13px; color: #475569; border-bottom: 1px solid #f8fafc; vertical-align: middle; }
  .adm-table tr:last-child td { border-bottom: none; }
  .adm-table tr:hover td { background: #fafbff; }
  .badge { display: inline-flex; align-items: center; gap: 5px; padding: 4px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; white-space: nowrap; }
  .dot { width: 7px; height: 7px; border-radius: 50%; display: inline-block; flex-shrink: 0; }
  .btn { display: inline-flex; align-items: center; gap: 8px; padding: 9px 16px; border-radius: 9px; font-size: 13px; font-weight: 600; cursor: pointer; border: none; transition: all 0.2s; white-space: nowrap; }
  .btn svg { width: 15px; height: 15px; }
  .btn-primary { background: linear-gradient(135deg,#ff6b35,#e85d23); color: white; }
  .btn-primary:hover { transform: translateY(-1px); box-shadow: 0 4px 14px rgba(255,107,53,0.3); }
  .btn-secondary { background: #f8fafc; color: #64748b; border: 1px solid #e2e8f0; }
  .btn-secondary:hover { background: #f1f5f9; color: #334155; border-color: #cbd5e1; }
  .btn-danger { background: #fff1f2; color: #ef4444; border: 1px solid #fecaca; }
  .btn-danger:hover { background: #ffe4e6; }
  .btn-icon { padding: 8px; border-radius: 8px; }
  .btn-sm { padding: 6px 12px; font-size: 12px; }
  .form-group { margin-bottom: 18px; }
  .form-lbl { display: block; font-size: 12px; font-weight: 600; color: #475569; margin-bottom: 7px; }
  .form-input { width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 9px; padding: 10px 14px; color: #1e293b; font-size: 13px; transition: all 0.2s; outline: none; }
  .form-input:focus { border-color: #ff6b35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); }
  .form-input::placeholder { color: #94a3b8; }
  .form-select { width: 100%; background: #ffffff; border: 1px solid #e2e8f0; border-radius: 9px; padding: 10px 36px 10px 14px; color: #1e293b; font-size: 13px; cursor: pointer; outline: none; transition: all 0.2s; appearance: none; background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394a3b8' viewBox='0 0 16 16'%3E%3Cpath d='M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z'/%3E%3C/svg%3E"); background-repeat: no-repeat; background-position: right 14px center; }
  .form-select:focus { border-color: #ff6b35; box-shadow: 0 0 0 3px rgba(255,107,53,0.1); outline: none; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .form-row-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 16px; }
  .modal-ov { position: fixed; inset: 0; background: rgba(15,23,42,0.5); backdrop-filter: blur(4px); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 20px; animation: admFadeIn 0.2s; }
  .modal { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; width: 100%; max-width: 640px; max-height: 90vh; overflow-y: auto; animation: admSlideUp 0.25s ease; box-shadow: 0 20px 60px rgba(0,0,0,0.15); }
  .modal-sm { max-width: 420px; }
  .modal-hdr { padding: 22px 26px 18px; border-bottom: 1px solid #f1f5f9; display: flex; align-items: center; justify-content: space-between; position: sticky; top: 0; background: #ffffff; z-index: 1; border-radius: 18px 18px 0 0; }
  .modal-title { font-size: 17px; font-weight: 700; color: #0f172a; }
  .modal-body { padding: 24px 26px; }
  .modal-ftr { padding: 18px 26px; border-top: 1px solid #f1f5f9; display: flex; gap: 10px; justify-content: flex-end; }
  .close-btn { background: #f8fafc; border: none; color: #94a3b8; border-radius: 8px; padding: 7px; cursor: pointer; transition: all 0.2s; display: flex; }
  .close-btn:hover { background: #f1f5f9; color: #475569; }
  .search-bar { display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; }
  .search-wrap { position: relative; flex: 1; min-width: 200px; }
  .search-wrap .si { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); width: 15px; height: 15px; color: #94a3b8; pointer-events: none; }
  .search-wrap .form-input { padding-left: 38px; }
  .cats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 14px; }
  .cat-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 14px; padding: 22px 20px; cursor: pointer; transition: all 0.25s; position: relative; overflow: hidden; box-shadow: 0 1px 4px rgba(0,0,0,0.04); }
  .cat-card:hover { border-color: #ff6b35; transform: translateY(-3px); box-shadow: 0 8px 24px rgba(255,107,53,0.12); }
  .cat-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; margin-bottom: 14px; }
  .cat-name { font-size: 13px; font-weight: 700; color: #1e293b; margin-bottom: 5px; line-height: 1.3; }
  .cat-cnt { font-size: 12px; color: #94a3b8; }
  .cat-arrow { position: absolute; top: 18px; right: 18px; color: #cbd5e1; transition: all 0.25s; width: 16px; height: 16px; }
  .cat-card:hover .cat-arrow { color: #ff6b35; transform: translateX(3px); }
  .prod-thumb { width: 44px; height: 44px; border-radius: 8px; object-fit: cover; background: #f8fafc; border: 1px solid #e2e8f0; flex-shrink: 0; }
  .prod-thumb-ph { width: 44px; height: 44px; border-radius: 8px; background: #f8fafc; border: 1px solid #e2e8f0; display: flex; align-items: center; justify-content: center; color: #cbd5e1; flex-shrink: 0; }
  .prod-name { font-size: 13px; font-weight: 600; color: #1e293b; }
  .prod-code { font-size: 11px; color: #94a3b8; margin-top: 2px; font-family: monospace; }
  .tog-btn { background: none; border: none; cursor: pointer; padding: 4px; display: flex; transition: transform 0.2s; }
  .tog-btn:hover { transform: scale(1.1); }
  .order-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 20px; margin-bottom: 12px; box-shadow: 0 1px 4px rgba(0,0,0,0.04); transition: all 0.2s; }
  .order-card:hover { border-color: #ff6b35; box-shadow: 0 4px 14px rgba(255,107,53,0.08); }
  .order-hdr { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 12px; gap: 12px; flex-wrap: wrap; }
  .order-id { font-size: 12px; color: #94a3b8; font-family: monospace; }
  .order-cust { font-size: 15px; font-weight: 700; color: #0f172a; margin-bottom: 3px; }
  .order-meta { font-size: 12px; color: #94a3b8; }
  .order-contact { display: flex; align-items: center; gap: 8px; margin-top: 8px; flex-wrap: wrap; }
  .chip { display: inline-flex; align-items: center; gap: 6px; padding: 5px 11px; border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; text-decoration: none; transition: all 0.2s; }
  .chip-phone { background: #eff6ff; color: #3b82f6; border: 1px solid #bfdbfe; }
  .chip-phone:hover { background: #dbeafe; }
  .chip-wa { background: #f0fdf4; color: #16a34a; border: 1px solid #bbf7d0; }
  .chip-wa:hover { background: #dcfce7; }
  .order-items { background: #f8fafc; border: 1px solid #f1f5f9; border-radius: 8px; padding: 10px 14px; margin-top: 12px; }
  .order-item-row { display: flex; justify-content: space-between; padding: 4px 0; font-size: 12px; color: #64748b; }
  .order-item-row:not(:last-child) { border-bottom: 1px solid #f1f5f9; padding-bottom: 6px; margin-bottom: 2px; }
  .order-total { display: flex; justify-content: space-between; padding: 8px 0 0; font-size: 13px; font-weight: 700; color: #ff6b35; border-top: 1px solid #e2e8f0; margin-top: 8px; }
  .status-sel { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 7px 12px; color: #475569; font-size: 12px; cursor: pointer; outline: none; }
  .bd-item { display: flex; align-items: center; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #f1f5f9; }
  .bd-item:last-child { border-bottom: none; }
  .bd-name { font-size: 13px; color: #475569; }
  .bd-cnt { font-size: 13px; font-weight: 600; color: #ff6b35; }
  .login-root { display: flex; align-items: center; justify-content: center; min-height: 100vh; background: linear-gradient(135deg, #fff7f4 0%, #fef3ee 50%, #fff1eb 100%); position: relative; overflow: hidden; }
  .login-glow { position: absolute; width: 600px; height: 600px; border-radius: 50%; background: radial-gradient(circle, rgba(255,107,53,0.1) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); }
  .login-card { background: #ffffff; border: 1px solid #e2e8f0; border-radius: 20px; padding: 40px 44px; width: 100%; max-width: 420px; position: relative; z-index: 1; box-shadow: 0 20px 60px rgba(255,107,53,0.1), 0 4px 20px rgba(0,0,0,0.08); }
  .login-logo { text-align: center; margin-bottom: 28px; }
  .login-icon { width: 60px; height: 60px; border-radius: 16px; margin: 0 auto 14px; background: linear-gradient(135deg,#ff6b35,#e85d23); display: flex; align-items: center; justify-content: center; box-shadow: 0 8px 20px rgba(255,107,53,0.3); }
  .login-brand { font-size: 20px; font-weight: 800; color: #0f172a; }
  .login-sub2 { font-size: 12px; color: #94a3b8; margin-top: 4px; }
  .login-title { font-size: 22px; font-weight: 700; color: #0f172a; margin-bottom: 6px; }
  .login-desc { font-size: 13px; color: #64748b; margin-bottom: 28px; }
  .inp-wrap { position: relative; }
  .inp-icon { position: absolute; left: 13px; top: 50%; transform: translateY(-50%); width: 16px; height: 16px; color: #94a3b8; pointer-events: none; }
  .inp-wrap .form-input { padding-left: 40px; }
  .inp-eye { position: absolute; right: 13px; top: 50%; transform: translateY(-50%); background: none; border: none; color: #94a3b8; cursor: pointer; padding: 2px; display: flex; align-items: center; }
  .inp-eye:hover { color: #64748b; }
  .login-btn { width: 100%; padding: 12px; background: linear-gradient(135deg,#ff6b35,#e85d23); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 700; cursor: pointer; transition: all 0.2s; }
  .login-btn:hover { transform: translateY(-1px); box-shadow: 0 6px 20px rgba(255,107,53,0.35); }
  .login-btn:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
  .err-box { background: #fff1f2; border: 1px solid #fecaca; color: #dc2626; font-size: 12px; padding: 10px 14px; border-radius: 8px; margin-bottom: 16px; text-align: center; }
  .price-calc { background: #fff7f4; border: 1px solid #fed7c3; border-radius: 8px; padding: 10px 14px; font-size: 12px; color: #9a3412; margin-top: 4px; margin-bottom: 14px; }
  .empty-state { text-align: center; padding: 48px 20px; color: #94a3b8; }
  .empty-state svg { width: 48px; height: 48px; margin: 0 auto 14px; opacity: 0.4; display: block; }
  .loading { text-align: center; padding: 40px; color: #94a3b8; font-size: 13px; }
  .sb-ov { position: fixed; inset: 0; background: rgba(15,23,42,0.4); z-index: 99; }
  @media(max-width:1024px){.stats-grid{grid-template-columns:repeat(2,1fr)}.form-row-3{grid-template-columns:1fr 1fr;}}
  @media(max-width:768px){
    .adm-sidebar{transform:translateX(-260px);}.adm-sidebar.sb-open{transform:translateX(0);}
    .adm-main{margin-left:0!important;}.menu-toggle{display:flex!important;}
    .stats-grid{grid-template-columns:1fr 1fr;}.form-row{grid-template-columns:1fr;}.form-row-3{grid-template-columns:1fr;}
    .search-bar{flex-direction:column;}.hdr-adm-info{display:none;}
    .adm-content{padding:16px 14px;}
  }
  @media(max-width:480px){.stats-grid{grid-template-columns:1fr;}.login-card{padding:28px 22px;margin:16px;}}
  @keyframes admFadeIn{from{opacity:0}to{opacity:1}}
  @keyframes admSlideUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}
  @keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}
  .spinning{animation:spin 1s linear infinite;}
  .db-grid{display:grid;grid-template-columns:2fr 1fr;gap:16px;}
  @media(max-width:900px){.db-grid{grid-template-columns:1fr;}}
`;

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    await new Promise(r => setTimeout(r, 500));
    if (email === 'arjunansri21@gmail.com' && password === '12345678') {
      sessionStorage.setItem('admin_logged_in', 'true');
      onLogin();
    } else {
      setError('Invalid email or password. Please try again.');
    }
    setLoading(false);
  };

  return (
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
        {error && <div className="err-box">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-lbl">Email Address</label>
            <div className="inp-wrap">
              <Mail className="inp-icon" />
              <input className="form-input" type="email" placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)} required />
            </div>
          </div>
          <div className="form-group">
            <label className="form-lbl">Password</label>
            <div className="inp-wrap">
              <Lock className="inp-icon" />
              <input className="form-input" type={showPw?'text':'password'} placeholder="Enter password" value={password} onChange={e=>setPassword(e.target.value)} required />
              <button type="button" className="inp-eye" onClick={()=>setShowPw(!showPw)}>
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
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
  return (
    <div className="modal-ov">
      <div className="modal modal-sm">
        <div className="modal-hdr">
          <div className="modal-title" style={{color:'#ef4444'}}>⚠ Confirm Delete</div>
          <button className="close-btn" onClick={onCancel}><X style={{width:16,height:16}} /></button>
        </div>
        <div className="modal-body">
          <div style={{fontSize:16,fontWeight:700,color:'#f1f5f9',marginBottom:8}}>{title}</div>
          <div style={{fontSize:13,color:'#94a3b8',lineHeight:1.6}}>{message}</div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Yes, Delete</button>
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
      const m = parseFloat(k === 'mrp' ? v : next.mrp);
      const d = parseFloat(k === 'discount' ? v : next.discount);
      if (!isNaN(m) && !isNaN(d)) next.price = Math.round(m * (1 - d / 100));
      else if (k === 'mrp' && isNaN(m)) next.price = '';
    }
    return next;
  });

  const save = async () => {
    if (!form.product_code || !form.name || !form.category) { setErr('Product Code, Name and Category are required.'); return; }
    setSaving(true); setErr('');
    try {
      const body = { ...form, mrp: form.mrp || null, discount: form.discount || null, price: form.price || null };
      if (isEdit) await api(`/products?id=eq.${product.id}`, { method: 'PATCH', body: JSON.stringify(body) });
      else await api('/products', { method: 'POST', body: JSON.stringify(body) });
      onSaved();
    } catch (e) { setErr(e.message); }
    setSaving(false);
  };

  return (
    <div className="modal-ov">
      <div className="modal">
        <div className="modal-hdr">
          <div className="modal-title">{isEdit ? '✏ Edit Product' : '＋ Add New Product'}</div>
          <button className="close-btn" onClick={onClose}><X style={{width:16,height:16}} /></button>
        </div>
        <div className="modal-body">
          {err && <div className="err-box" style={{marginBottom:16}}>{err}</div>}
          <div className="form-row">
            <div className="form-group">
              <label className="form-lbl">Product Code *</label>
              <input className="form-input" placeholder="e.g. A001" value={form.product_code} onChange={e=>set('product_code',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-lbl">Category *</label>
              <select className="form-select" value={form.category} onChange={e=>set('category',e.target.value)}>
                {categories.map(c=><option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-lbl">Product Name *</label>
            <input className="form-input" placeholder="e.g. Premium Sparklers 4 inch" value={form.name} onChange={e=>set('name',e.target.value)} />
          </div>
          <div className="form-row-3">
            <div className="form-group">
              <label className="form-lbl">MRP Price (₹)</label>
              <input className="form-input" type="number" placeholder="0" value={form.mrp} onChange={e=>set('mrp',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-lbl">Discount (%)</label>
              <input className="form-input" type="number" placeholder="0" min="0" max="100" value={form.discount} onChange={e=>set('discount',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-lbl">Selling Price (₹)</label>
              <input className="form-input" type="number" placeholder="Auto-calculated" value={form.price} onChange={e=>set('price',e.target.value)} style={{background:'#0a0e17'}} />
            </div>
          </div>
          {form.mrp && form.discount && (
            <div className="price-calc">
              Auto-calc: ₹{form.mrp} × (1 − {form.discount}%) = <strong style={{color:'#ff6b35'}}>₹{form.price}</strong>
            </div>
          )}
          <div className="form-row">
            <div className="form-group">
              <label className="form-lbl">Unit / Pack Size</label>
              <input className="form-input" placeholder="e.g. 1 Box, 10 Pcs" value={form.unit} onChange={e=>set('unit',e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-lbl">Image URL</label>
              <input className="form-input" placeholder="https://..." value={form.image_url} onChange={e=>set('image_url',e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label className="form-lbl">Status</label>
            <select className="form-select" value={form.is_active?'true':'false'} onChange={e=>set('is_active',e.target.value==='true')}>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
        <div className="modal-ftr">
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn btn-primary" onClick={save} disabled={saving}>
            <Save style={{width:14,height:14}} />
            {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
          </button>
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ products, categories, orders, onTabChange }) {
  const totalSales = orders.reduce((s, o) => {
    try { const items = typeof o.items === 'string' ? JSON.parse(o.items) : (o.items||[]); return s + items.reduce((a,i)=>a+((i.price||0)*(i.quantity||1)),0); }
    catch { return s; }
  }, 0);
  const recentOrders = orders.slice(0,5);
  const breakdown = categories.map(cat=>({ name:cat, count:products.filter(p=>p.category===cat&&p.is_active!==false).length })).filter(b=>b.count>0).sort((a,b)=>b.count-a.count);
  const stats = [
    { label:'Total Products', value:products.length, icon:Package, color:'orange', trend:`${products.filter(p=>p.is_active!==false).length} active` },
    { label:'Categories', value:categories.length, icon:Tag, color:'blue', trend:`${breakdown.length} non-empty` },
    { label:'Total Sales', value:fmt(totalSales), icon:DollarSign, color:'green', trend:`From ${orders.length} orders` },
    { label:'Total Orders', value:orders.length, icon:ShoppingCart, color:'purple', trend:`${orders.filter(o=>o.status==='Pending').length} pending` },
  ];
  return (
    <>
      <div className="stats-grid">
        {stats.map(s=>(
          <div key={s.label} className={`stat-card c-${s.color}`}>
            <div className={`stat-icon c-${s.color}`}><s.icon /></div>
            <div className="stat-val">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
            <div className="stat-trend">↑ {s.trend}</div>
          </div>
        ))}
      </div>
      <div className="db-grid">
        <div className="card">
          <div className="card-hdr">
            <div><div className="card-title">Recent Orders</div><div className="card-sub">Latest 5 customer orders</div></div>
            <button className="btn btn-secondary btn-sm" onClick={()=>onTabChange('orders')}>
              View All <ArrowUpRight style={{width:12,height:12}} />
            </button>
          </div>
          <div style={{overflowX:'auto'}}>
            <table className="adm-table">
              <thead><tr><th>Customer</th><th>Date</th><th>Amount</th><th>Status</th></tr></thead>
              <tbody>
                {recentOrders.length===0 ? (
                  <tr><td colSpan={4} style={{textAlign:'center',color:'#475569',padding:32}}>No orders yet</td></tr>
                ) : recentOrders.map(o=>{
                  const items = (()=>{ try { return typeof o.items==='string'?JSON.parse(o.items):(o.items||[]); } catch{return[];} })();
                  const total = items.reduce((a,i)=>a+((i.price||0)*(i.quantity||1)),0);
                  const cfg = STATUS_CONFIG[o.status]||STATUS_CONFIG.Pending;
                  return (
                    <tr key={o.id}>
                      <td><div style={{fontWeight:600,color:'#e2e8f0'}}>{o.name||'—'}</div><div style={{fontSize:11,color:'#475569'}}>{o.phone||''}</div></td>
                      <td style={{fontSize:12}}>{fmtDate(o.created_at)}</td>
                      <td style={{fontWeight:600,color:'#ff6b35'}}>{fmt(total)}</td>
                      <td><span className="badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}33`}}><span className="dot" style={{background:cfg.color}} />{o.status||'Pending'}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
        <div className="card">
          <div className="card-hdr"><div><div className="card-title">Product Breakdown</div><div className="card-sub">Active products per category</div></div></div>
          <div className="card-body" style={{paddingTop:12}}>
            {breakdown.length===0 ? <div style={{textAlign:'center',color:'#475569',fontSize:13,padding:'24px 0'}}>No active products</div>
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

function CategoriesTab({ categories, products, onCategoryClick }) {
  const colors = ['#ff6b35','#3b82f6','#10b981','#8b5cf6','#f59e0b','#ec4899','#14b8a6','#f97316'];
  return (
    <>
      <div style={{marginBottom:20,fontSize:13,color:'#64748b'}}>{categories.length} categories found</div>
      <div className="cats-grid">
        {categories.map((cat,i)=>{
          const Icon = getCategoryIcon(cat);
          const count = products.filter(p=>p.category===cat).length;
          const activeCount = products.filter(p=>p.category===cat&&p.is_active!==false).length;
          const color = colors[i%colors.length];
          return (
            <div key={cat} className="cat-card" onClick={()=>onCategoryClick(cat)}>
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

function ProductsTab({ products, categories, filterCat, onFilterCatChange, onRefresh }) {
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState(filterCat||'');
  const [modalProd, setModalProd] = useState(null);
  const [confirm, setConfirm] = useState(null);
  const [toggling, setToggling] = useState(null);

  useEffect(()=>{ setCatFilter(filterCat||''); },[filterCat]);

  const filtered = products.filter(p=>{
    const q=search.toLowerCase();
    return (!q||((p.product_code||'').toLowerCase().includes(q)||(p.name||'').toLowerCase().includes(q)))&&(!catFilter||p.category===catFilter);
  });

  const toggleActive = async (prod) => {
    setToggling(prod.id);
    try { await api(`/products?id=eq.${prod.id}`,{method:'PATCH',body:JSON.stringify({is_active:!prod.is_active})}); onRefresh(); }
    catch(e){alert(e.message);}
    setToggling(null);
  };

  const deleteProduct = async (id) => {
    try { await api(`/products?id=eq.${id}`,{method:'DELETE'}); onRefresh(); }
    catch(e){alert(e.message);}
    setConfirm(null);
  };

  return (
    <>
      {modalProd!==null&&<ProductModal product={modalProd||null} categories={categories} onClose={()=>setModalProd(null)} onSaved={()=>{setModalProd(null);onRefresh();}} />}
      {confirm&&<ConfirmDialog title="Delete Product?" message={`Permanently delete "${confirm.name}"? This cannot be undone.`} onConfirm={()=>deleteProduct(confirm.id)} onCancel={()=>setConfirm(null)} />}
      <div className="search-bar">
        <div className="search-wrap">
          <Search className="si" />
          <input className="form-input" placeholder="Search by name or product code..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <div style={{position:'relative',minWidth:220}}>
          <Filter style={{position:'absolute',left:12,top:'50%',transform:'translateY(-50%)',width:15,height:15,color:'#475569',pointerEvents:'none'}} />
          <select className="form-select" value={catFilter} onChange={e=>{setCatFilter(e.target.value);onFilterCatChange(e.target.value);}} style={{paddingLeft:36}}>
            <option value="">All Categories</option>
            {categories.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <button className="btn btn-primary" onClick={()=>setModalProd(false)}><Plus />Add Product</button>
      </div>
      <div style={{marginBottom:12,fontSize:13,color:'#64748b'}}>
        Showing {filtered.length} of {products.length} products{catFilter&&<span> in <strong style={{color:'#ff6b35'}}>{catFilter}</strong></span>}
      </div>
      <div className="card">
        <div style={{overflowX:'auto'}}>
          <table className="adm-table">
            <thead><tr><th>#</th><th>Product</th><th>Category</th><th>MRP</th><th>Discount</th><th>Price</th><th>Unit</th><th>Status</th><th style={{textAlign:'right'}}>Actions</th></tr></thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={9}><div className="empty-state"><Package /><p>No products found</p></div></td></tr>
              ) : filtered.map((p,idx)=>(
                <tr key={p.id}>
                  <td style={{color:'#475569',fontFamily:'monospace',fontSize:11}}>{idx+1}</td>
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
                    <button className="tog-btn" onClick={()=>toggleActive(p)} disabled={toggling===p.id} title={p.is_active!==false?'Deactivate':'Activate'}>
                      {p.is_active!==false ? <ToggleRight style={{width:28,height:28,color:'#10b981'}} /> : <ToggleLeft style={{width:28,height:28,color:'#475569'}} />}
                    </button>
                  </td>
                  <td>
                    <div style={{display:'flex',gap:6,justifyContent:'flex-end'}}>
                      <button className="btn btn-secondary btn-icon btn-sm" onClick={()=>setModalProd(p)} title="Edit"><Edit2 style={{width:14,height:14}} /></button>
                      <button className="btn btn-danger btn-icon btn-sm" onClick={()=>setConfirm(p)} title="Delete"><Trash2 style={{width:14,height:14}} /></button>
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

function OrdersTab({ orders, onRefresh }) {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState(null);

  const filtered = orders.filter(o=>{
    const q=search.toLowerCase();
    return (!q||((o.name||'').toLowerCase().includes(q)||(o.phone||'').includes(q)))&&(!statusFilter||o.status===statusFilter);
  });

  const renderItems = (raw) => { try { return typeof raw==='string'?JSON.parse(raw):(raw||[]); } catch{return[];} };

  const updateStatus = async (id,status) => {
    setUpdatingStatus(id);
    try { await api(`/orders?id=eq.${id}`,{method:'PATCH',body:JSON.stringify({status})}); onRefresh(); }
    catch(e){alert(e.message);}
    setUpdatingStatus(null);
  };

  return (
    <>
      <div className="search-bar">
        <div className="search-wrap">
          <Search className="si" />
          <input className="form-input" placeholder="Search by name or phone..." value={search} onChange={e=>setSearch(e.target.value)} />
        </div>
        <select className="form-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)} style={{minWidth:160}}>
          <option value="">All Statuses</option>
          {Object.keys(STATUS_CONFIG).map(s=><option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <div style={{marginBottom:12,fontSize:13,color:'#64748b'}}>{filtered.length} orders{statusFilter&&` with status "${statusFilter}"`}</div>
      {filtered.length===0 ? (
        <div className="empty-state"><ShoppingCart /><p>No orders found</p></div>
      ) : filtered.map(o=>{
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
                    <a href={`tel:${o.phone}`} className="chip chip-phone"><Phone style={{width:12,height:12}} />{o.phone}</a>
                    <a href={`https://wa.me/${ph}`} target="_blank" rel="noreferrer" className="chip chip-wa"><MessageCircle style={{width:12,height:12}} />WhatsApp</a>
                  </div>
                )}
              </div>
              <div style={{display:'flex',flexDirection:'column',alignItems:'flex-end',gap:8}}>
                <span className="badge" style={{background:cfg.bg,color:cfg.color,border:`1px solid ${cfg.color}33`}}>
                  <span className="dot" style={{background:cfg.color}} />{o.status||'Pending'}
                </span>
                <select className="status-sel" value={o.status||'Pending'} onChange={e=>updateStatus(o.id,e.target.value)} disabled={updatingStatus===o.id}>
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

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(sessionStorage.getItem('admin_logged_in')==='true');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [catFilter, setCatFilter] = useState('');

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [prods, ords] = await Promise.all([api('/products?order=product_code.asc'), api('/orders?order=created_at.desc')]);
      const ps = prods||[];
      setProducts(ps);
      setCategories([...new Set(ps.map(p=>p.category).filter(Boolean))].sort());
      setOrders(ords||[]);
    } catch(e){ console.error(e); }
    setLoading(false);
  }, []);

  useEffect(()=>{ if(isLoggedIn) fetchAll(); },[isLoggedIn,fetchAll]);

  // Force scrolling to work — global CSS may lock body/html
  useEffect(() => {
    const prev = {
      bodyOverflow: document.body.style.overflow,
      bodyHeight: document.body.style.height,
      htmlOverflow: document.documentElement.style.overflow,
      htmlHeight: document.documentElement.style.height,
    };
    document.body.style.overflow = 'auto';
    document.body.style.height = 'auto';
    document.documentElement.style.overflow = 'auto';
    document.documentElement.style.height = 'auto';
    const root = document.getElementById('root');
    let prevRootOverflow = '', prevRootHeight = '';
    if (root) {
      prevRootOverflow = root.style.overflow;
      prevRootHeight = root.style.height;
      root.style.overflow = 'auto';
      root.style.height = 'auto';
    }
    return () => {
      document.body.style.overflow = prev.bodyOverflow;
      document.body.style.height = prev.bodyHeight;
      document.documentElement.style.overflow = prev.htmlOverflow;
      document.documentElement.style.height = prev.htmlHeight;
      if (root) {
        root.style.overflow = prevRootOverflow;
        root.style.height = prevRootHeight;
      }
    };
  }, []);

  const handleLogout = () => { sessionStorage.removeItem('admin_logged_in'); setIsLoggedIn(false); };

  const navItems = [
    { id:'dashboard', label:'Dashboard', icon:LayoutDashboard },
    { id:'categories', label:'Categories', icon:Tag, badge:categories.length||null },
    { id:'products', label:'Products', icon:Package, badge:products.length||null },
    { id:'orders', label:'Orders', icon:ShoppingCart, badge:orders.filter(o=>o.status==='Pending').length||null },
  ];

  const tabInfo = {
    dashboard: { title:'Dashboard', sub:'Welcome back! Here\'s what\'s happening.' },
    categories: { title:'Categories', sub:`${categories.length} product categories` },
    products: { title:'Products', sub:`${products.length} products in catalog` },
    orders: { title:'Orders', sub:`${orders.length} total orders` },
  };

  if (!isLoggedIn) return (
    <>
      <style>{STYLES}</style>
      <div className="adm"><LoginScreen onLogin={()=>setIsLoggedIn(true)} /></div>
    </>
  );

  return (
    <>
      <style>{STYLES}</style>
      <div className="adm">
        <div className="adm-layout">
          {sidebarOpen&&<div className="sb-ov" onClick={()=>setSidebarOpen(false)} />}
          <aside className={`adm-sidebar${sidebarOpen?' sb-open':''}`}>
            <div className="sb-logo">
              <div style={{width:36,height:36,borderRadius:10,background:'linear-gradient(135deg,#ff6b35,#e85d23)',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                <Flame style={{width:18,height:18,color:'white'}} />
              </div>
              <div><div className="sb-brand">Sethu Pyro Park</div><div className="sb-sub">Admin Dashboard</div></div>
            </div>
            <div className="sb-section">Navigation</div>
            <nav className="sb-nav">
              {navItems.map(item=>(
                <div key={item.id} className={`sb-item${activeTab===item.id?' active':''}`} onClick={()=>{setActiveTab(item.id);setSidebarOpen(false);}}>
                  <item.icon />
                  <span>{item.label}</span>
                  {item.badge?<span className="sb-badge">{item.badge}</span>:null}
                </div>
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

          <main className="adm-main" style={{marginLeft:260}}>
            <header className="adm-header">
              <div className="hdr-left">
                <button className="menu-toggle" style={{display:'flex'}} onClick={()=>setSidebarOpen(!sidebarOpen)}>
                  {sidebarOpen?<X style={{width:18,height:18}} />:<Menu style={{width:18,height:18}} />}
                </button>
                <div>
                  <div className="pg-title">{tabInfo[activeTab]?.title}</div>
                  <div className="pg-sub">{tabInfo[activeTab]?.sub}</div>
                </div>
              </div>
              <div className="hdr-right">
                <button className="btn btn-secondary btn-sm" onClick={fetchAll} disabled={loading}>
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

            <div className="adm-content">
              {loading&&<div className="loading">Loading data from Supabase...</div>}
              {!loading&&activeTab==='dashboard'&&<DashboardTab products={products} categories={categories} orders={orders} onTabChange={setActiveTab} />}
              {!loading&&activeTab==='categories'&&<CategoriesTab categories={categories} products={products} onCategoryClick={cat=>{setCatFilter(cat);setActiveTab('products');setSidebarOpen(false);}} />}
              {!loading&&activeTab==='products'&&<ProductsTab products={products} categories={categories} filterCat={catFilter} onFilterCatChange={setCatFilter} onRefresh={fetchAll} />}
              {!loading&&activeTab==='orders'&&<OrdersTab orders={orders} onRefresh={fetchAll} />}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
