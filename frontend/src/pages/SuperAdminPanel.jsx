import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Package, Grid, ShoppingBag, Plus, Trash2, Edit, CheckCircle, XCircle, X, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

/* ─── Shared styles matching Home component theme ─── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --ps-navy:   #090e1a;
    --ps-navy2:  #0f1829;
    --ps-slate:  #1a2540;
    --ps-amber:  #f0a500;
    --ps-amber2: #fbbf24;
    --ps-teal:   #0fcfb0;
    --ps-muted:  #6b7a99;
    --ps-line:   rgba(240,165,0,0.18);
    --ps-success: #10b981;
    --ps-error:   #ef4444;
    --ps-warning: #f59e0b;
    --ps-font-head: 'Syne', sans-serif;
    --ps-font-body: 'DM Sans', sans-serif;
  }

  @keyframes ps-fade-up {
    from { opacity:0; transform:translateY(20px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ps-shimmer {
    0%   { background-position: -600px 0; }
    100% { background-position:  600px 0; }
  }
  @keyframes ps-modal-in {
    from { opacity:0; transform:scale(0.96) translateY(10px); }
    to   { opacity:1; transform:scale(1) translateY(0); }
  }

  .ps-admin-wrap {
    font-family: var(--ps-font-body);
    background: var(--ps-navy);
    min-height: 100vh;
    color: #e2e8f0;
  }

  /* ── Header ── */
  .ps-admin-header {
    background: linear-gradient(90deg, #0f1829, #1a2540);
    border-bottom: 1px solid rgba(240,165,0,0.12);
    padding: 28px 48px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .ps-admin-header h1 {
    font-family: var(--ps-font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: #f1f5f9;
    margin: 0;
    letter-spacing: -0.01em;
  }
  .ps-admin-header p {
    font-size: 0.82rem;
    color: #64748b;
    margin: 4px 0 0;
    font-weight: 400;
  }
  .ps-admin-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(240,165,0,0.1);
    border: 1px solid rgba(240,165,0,0.25);
    border-radius: 20px;
    padding: 6px 14px;
    font-family: var(--ps-font-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--ps-amber);
  }
  .ps-admin-badge::before {
    content: '';
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--ps-amber);
    box-shadow: 0 0 6px var(--ps-amber);
  }

  /* ── Layout ── */
  .ps-admin-body {
    display: grid;
    grid-template-columns: 240px 1fr;
    min-height: calc(100vh - 97px);
  }

  /* ── Sidebar ── */
  .ps-sidebar {
    background: linear-gradient(180deg, #0f1829, #090e1a);
    border-right: 1px solid rgba(240,165,0,0.08);
    padding: 32px 16px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .ps-sidebar-label {
    font-family: var(--ps-font-head);
    font-size: 0.65rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: #334155;
    padding: 0 12px;
    margin-bottom: 8px;
  }
  .ps-nav-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 12px 16px;
    border-radius: 10px;
    background: transparent;
    border: none;
    cursor: pointer;
    font-family: var(--ps-font-head);
    font-size: 0.875rem;
    font-weight: 600;
    color: #64748b;
    transition: all 0.2s;
    text-align: left;
    position: relative;
  }
  .ps-nav-btn:hover {
    background: rgba(240,165,0,0.06);
    color: #f1f5f9;
  }
  .ps-nav-btn.active {
    background: rgba(240,165,0,0.1);
    color: var(--ps-amber);
    border: 1px solid rgba(240,165,0,0.2);
  }
  .ps-nav-btn.active::before {
    content: '';
    position: absolute;
    left: 0; top: 25%; bottom: 25%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--ps-amber);
  }

  /* ── Main Content ── */
  .ps-main {
    padding: 40px 48px;
    background: radial-gradient(ellipse 80% 50% at 80% 20%, rgba(240,165,0,0.03) 0%, transparent 60%), var(--ps-navy);
  }

  /* ── Section title ── */
  .ps-section-label {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--ps-font-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--ps-amber);
    margin-bottom: 8px;
  }
  .ps-section-label::before {
    content: '';
    display: block;
    width: 20px; height: 2px;
    background: var(--ps-amber);
  }
  .ps-panel-title {
    font-family: var(--ps-font-head);
    font-size: 1.5rem;
    font-weight: 800;
    color: #f1f5f9;
    margin: 0 0 32px;
    letter-spacing: -0.01em;
  }

  /* ── Card ── */
  .ps-card {
    background: linear-gradient(145deg, rgba(26,37,64,0.7), rgba(15,24,41,0.9));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 16px;
    padding: 32px;
    animation: ps-fade-up 0.5s ease both;
  }
  .ps-card-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .ps-card-header h3 {
    font-family: var(--ps-font-head);
    font-size: 1.1rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0;
  }

  /* ── Table ── */
  .ps-table {
    width: 100%;
    border-collapse: collapse;
    text-align: left;
  }
  .ps-table thead tr {
    border-bottom: 1px solid rgba(240,165,0,0.12);
  }
  .ps-table thead th {
    padding: 12px 16px;
    font-family: var(--ps-font-head);
    font-size: 0.68rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #475569;
  }
  .ps-table tbody tr {
    border-bottom: 1px solid rgba(255,255,255,0.04);
    transition: background 0.15s;
  }
  .ps-table tbody tr:hover {
    background: rgba(240,165,0,0.03);
  }
  .ps-table tbody td {
    padding: 16px;
    font-size: 0.875rem;
    color: #cbd5e1;
  }

  /* ── Badges ── */
  .ps-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-family: var(--ps-font-head);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0.05em;
  }
  .ps-badge-success { background: rgba(16,185,129,0.1); color: var(--ps-success); border: 1px solid rgba(16,185,129,0.2); }
  .ps-badge-error   { background: rgba(239,68,68,0.1);  color: var(--ps-error);   border: 1px solid rgba(239,68,68,0.2); }
  .ps-badge-warning { background: rgba(245,158,11,0.1); color: var(--ps-warning); border: 1px solid rgba(245,158,11,0.2); }

  /* ── Buttons ── */
  .ps-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    border-radius: 8px;
    border: none;
    cursor: pointer;
    font-family: var(--ps-font-head);
    font-size: 0.82rem;
    font-weight: 700;
    letter-spacing: 0.03em;
    transition: all 0.2s;
  }
  .ps-btn-primary {
    background: linear-gradient(135deg, var(--ps-amber), #d97706);
    color: var(--ps-navy);
    box-shadow: 0 4px 16px rgba(240,165,0,0.25);
  }
  .ps-btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 24px rgba(240,165,0,0.4);
  }
  .ps-btn-ghost {
    background: transparent;
    color: #64748b;
    border: 1px solid transparent;
  }
  .ps-btn-ghost:hover {
    background: rgba(255,255,255,0.05);
    color: #f1f5f9;
    border-color: rgba(255,255,255,0.08);
  }
  .ps-btn-danger {
    background: transparent;
    color: var(--ps-error);
    border: 1px solid transparent;
  }
  .ps-btn-danger:hover {
    background: rgba(239,68,68,0.08);
    border-color: rgba(239,68,68,0.2);
  }
  .ps-btn-verify {
    background: rgba(240,165,0,0.1);
    color: var(--ps-amber);
    border: 1px solid rgba(240,165,0,0.25);
    padding: 6px 14px;
    font-size: 0.75rem;
  }
  .ps-btn-verify:hover {
    background: rgba(240,165,0,0.18);
  }
  .ps-btn-outline-sm {
    background: transparent;
    border: 1px solid rgba(255,255,255,0.1);
    color: #94a3b8;
    padding: 7px 14px;
    font-size: 0.78rem;
    border-radius: 8px;
  }
  .ps-btn-outline-sm:hover {
    border-color: rgba(255,255,255,0.2);
    color: #f1f5f9;
  }

  /* ── Categories grid ── */
  .ps-cat-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 20px;
  }
  .ps-cat-card {
    background: linear-gradient(145deg, rgba(26,37,64,0.8), rgba(15,24,41,0.9));
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 14px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: all 0.25s;
  }
  .ps-cat-card:hover {
    border-color: rgba(240,165,0,0.2);
    transform: translateY(-4px);
    box-shadow: 0 12px 40px rgba(0,0,0,0.3);
  }
  .ps-cat-img {
    height: 140px;
    background: rgba(15,24,41,0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    overflow: hidden;
  }
  .ps-cat-body {
    padding: 20px;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .ps-cat-body h4 {
    font-family: var(--ps-font-head);
    font-size: 0.975rem;
    font-weight: 700;
    color: #f1f5f9;
    margin: 0 0 8px;
  }
  .ps-cat-body p {
    font-size: 0.8rem;
    color: #64748b;
    line-height: 1.6;
    flex: 1;
    margin: 0 0 16px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .ps-cat-actions {
    display: flex;
    gap: 8px;
    border-top: 1px solid rgba(255,255,255,0.05);
    padding-top: 16px;
  }
  .ps-cat-actions button {
    flex: 1;
  }

  /* ── Product image in table ── */
  .ps-product-img {
    width: 42px; height: 42px;
    border-radius: 8px;
    object-fit: cover;
    border: 1px solid rgba(255,255,255,0.08);
  }
  .ps-product-name {
    font-weight: 600;
    color: #f1f5f9;
    font-size: 0.875rem;
  }
  .ps-product-brand {
    font-size: 0.72rem;
    color: #475569;
    margin-top: 3px;
  }

  /* ── Modal ── */
  .ps-modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(9,14,26,0.85);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }
  .ps-modal {
    background: linear-gradient(145deg, #1a2540, #0f1829);
    border: 1px solid rgba(240,165,0,0.15);
    border-radius: 18px;
    width: 100%;
    max-height: 90vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(240,165,0,0.05);
    animation: ps-modal-in 0.25s ease;
    padding: 36px;
  }
  .ps-modal h3 {
    font-family: var(--ps-font-head);
    font-size: 1.2rem;
    font-weight: 800;
    color: #f1f5f9;
    margin: 0 0 28px;
    letter-spacing: -0.01em;
  }
  .ps-modal-close {
    position: absolute;
    top: 20px; right: 20px;
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    color: #64748b;
    padding: 8px;
    cursor: pointer;
    display: flex;
    transition: all 0.2s;
  }
  .ps-modal-close:hover {
    background: rgba(255,255,255,0.1);
    color: #f1f5f9;
  }

  /* ── Form fields ── */
  .ps-form-group {
    margin-bottom: 18px;
  }
  .ps-form-label {
    display: block;
    font-family: var(--ps-font-head);
    font-size: 0.72rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #64748b;
    margin-bottom: 8px;
  }
  .ps-form-input {
    width: 100%;
    background: rgba(9,14,26,0.6);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    padding: 12px 14px;
    color: #f1f5f9;
    font-family: var(--ps-font-body);
    font-size: 0.9rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    box-sizing: border-box;
  }
  .ps-form-input:focus {
    outline: none;
    border-color: rgba(240,165,0,0.4);
    box-shadow: 0 0 0 3px rgba(240,165,0,0.08);
  }
  .ps-form-input::placeholder { color: #334155; }
  .ps-form-input option { background: #1a2540; }
  .ps-form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 16px;
  }
  .ps-form-footer {
    display: flex;
    gap: 12px;
    justify-content: flex-end;
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }

  /* ── Empty state ── */
  .ps-empty {
    text-align: center;
    padding: 60px 40px;
    color: #334155;
    border: 1px dashed rgba(255,255,255,0.06);
    border-radius: 12px;
  }
  .ps-empty p { margin: 12px 0 0; font-size: 0.875rem; }

  /* ── Loading ── */
  .ps-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    background: var(--ps-navy);
    font-family: var(--ps-font-head);
    font-size: 0.9rem;
    font-weight: 600;
    color: #475569;
  }
`;

const GridBg = () => (
  <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', opacity:0.04, pointerEvents:'none' }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="admingrid" width="60" height="60" patternUnits="userSpaceOnUse">
        <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#f0a500" strokeWidth="0.5"/>
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#admingrid)" />
  </svg>
);

const SuperAdminPanel = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  const [categoryForm, setCategoryForm] = useState({ name: '', description: '', image: '' });
  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', image: '',
    category: '', countInStock: '', brand: 'Procurasure'
  });

  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'superadmin') {
        navigate('/login?redirect=admin');
      } else {
        fetchData();
      }
    }
  }, [activeTab, user, authLoading, navigate]);

  if (authLoading) return <div className="ps-loading"><style>{STYLES}</style>Loading authorization…</div>;
  if (!user || user.role !== 'superadmin') return null;

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const { data } = await axios.get('/api/orders');
        setOrders(data);
      } else if (activeTab === 'products') {
        const [prodRes, catRes] = await Promise.all([axios.get('/api/products'), axios.get('/api/categories')]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } else if (activeTab === 'categories') {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      }
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/pay`, { id: 'VERIFIED_MANUAL', status: 'COMPLETED', update_time: new Date().toISOString() });
      fetchData();
    } catch { alert('Failed to verify payment'); }
  };

  const openCategoryModal = (cat = null) => {
    setEditingCategory(cat);
    setCategoryForm(cat ? { name: cat.name, description: cat.description || '', image: cat.image || '' } : { name: '', description: '', image: '' });
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) await axios.put(`/api/categories/${editingCategory._id}`, categoryForm);
      else await axios.post('/api/categories', categoryForm);
      setShowCategoryModal(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error saving category'); }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Delete this category?')) {
      try { await axios.delete(`/api/categories/${catId}`); fetchData(); }
      catch (err) { alert(err.response?.data?.message || 'Error deleting category'); }
    }
  };

  const openProductModal = (prod = null) => {
    setEditingProduct(prod);
    setProductForm(prod
      ? { name: prod.name, price: prod.price, description: prod.description, image: prod.image, category: prod.category?._id || prod.category || '', countInStock: prod.countInStock, brand: prod.brand || 'Procurasure' }
      : { name: '', price: '', description: '', image: '', category: categories[0]?._id || '', countInStock: '0', brand: 'Procurasure' }
    );
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) await axios.put(`/api/products/${editingProduct._id}`, productForm);
      else await axios.post('/api/products', productForm);
      setShowProductModal(false);
      fetchData();
    } catch (err) { alert(err.response?.data?.message || 'Error saving product'); }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Delete this product?')) {
      try { await axios.delete(`/api/products/${prodId}`); fetchData(); }
      catch (err) { alert(err.response?.data?.message || 'Error deleting product'); }
    }
  };

  const NAV = [
    { id: 'orders',     label: 'Manage Orders',     icon: ShoppingBag },
    { id: 'products',   label: 'Manage Products',   icon: Package },
    { id: 'categories', label: 'Manage Categories', icon: Grid },
  ];

  return (
    <div className="ps-admin-wrap">
      <style>{STYLES}</style>

      {/* Header */}
      <header className="ps-admin-header" style={{ position: 'relative', overflow: 'hidden' }}>
        <GridBg />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
            <LayoutDashboard size={20} color="#f0a500" />
            <h1>Superadmin Dashboard</h1>
          </div>
          <p>Manage Procurasure operations, orders, and products</p>
        </div>
        <div className="ps-admin-badge" style={{ position: 'relative', zIndex: 1 }}>Superadmin</div>
      </header>

      <div className="ps-admin-body">
        {/* Sidebar */}
        <aside className="ps-sidebar">
          <div className="ps-sidebar-label">Navigation</div>
          {NAV.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              className={`ps-nav-btn${activeTab === id ? ' active' : ''}`}
              onClick={() => setActiveTab(id)}
            >
              <Icon size={17} />
              {label}
            </button>
          ))}
        </aside>

        {/* Main */}
        <main className="ps-main">

          {/* ── ORDERS ── */}
          {activeTab === 'orders' && (
            <div>
              <div className="ps-section-label">Operations</div>
              <div className="ps-card">
                <div className="ps-card-header">
                  <h3>All Orders</h3>
                  <span style={{ fontSize: '0.78rem', color: '#475569', fontFamily: 'var(--ps-font-head)', fontWeight: 700 }}>
                    {orders.length} total
                  </span>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th>Order ID</th>
                        <th>Customer</th>
                        <th>Date</th>
                        <th>Total</th>
                        <th>Status</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id}>
                          <td style={{ fontFamily: 'monospace', fontSize: '0.78rem', color: '#64748b' }}>
                            #{order._id.substring(0, 8).toUpperCase()}
                          </td>
                          <td style={{ color: '#e2e8f0', fontWeight: 500 }}>{order.user?.name}</td>
                          <td>{new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                          <td style={{ fontFamily: 'var(--ps-font-head)', fontWeight: 700, color: '#f1f5f9' }}>
                            ${order.totalPrice.toFixed(2)}
                          </td>
                          <td>
                            {order.isPaid
                              ? <span className="ps-badge ps-badge-success"><CheckCircle size={11} /> Paid</span>
                              : <span className="ps-badge ps-badge-error"><XCircle size={11} /> Pending</span>
                            }
                          </td>
                          <td>
                            {!order.isPaid && (
                              <button className="ps-btn ps-btn-verify" onClick={() => handleVerifyPayment(order._id)}>
                                Verify Payment
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && !loading && (
                        <tr><td colSpan="6" style={{ padding: 0 }}>
                          <div className="ps-empty"><ShoppingBag size={32} style={{ opacity: 0.2 }} /><p>No orders found</p></div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── PRODUCTS ── */}
          {activeTab === 'products' && (
            <div>
              <div className="ps-section-label">Catalog</div>
              <div className="ps-card">
                <div className="ps-card-header">
                  <h3>Products Catalog</h3>
                  <button className="ps-btn ps-btn-primary" onClick={() => openProductModal()}>
                    <Plus size={16} /> Add Product
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product</th>
                        <th>Category</th>
                        <th>Price</th>
                        <th>Stock</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod._id}>
                          <td>
                            <img src={prod.image || 'https://via.placeholder.com/42'} alt={prod.name} className="ps-product-img" />
                          </td>
                          <td>
                            <div className="ps-product-name">{prod.name}</div>
                            <div className="ps-product-brand">{prod.brand || 'Procurasure'}</div>
                          </td>
                          <td style={{ color: '#64748b', fontSize: '0.82rem' }}>{prod.category?.name || 'Uncategorized'}</td>
                          <td style={{ fontFamily: 'var(--ps-font-head)', fontWeight: 700, color: '#f0a500' }}>
                            ${prod.price?.toFixed(2)}
                          </td>
                          <td>
                            {prod.countInStock > 10
                              ? <span className="ps-badge ps-badge-success">{prod.countInStock} in stock</span>
                              : prod.countInStock > 0
                              ? <span className="ps-badge ps-badge-warning">{prod.countInStock} low</span>
                              : <span className="ps-badge ps-badge-error">Out of stock</span>
                            }
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: 4 }}>
                              <button className="ps-btn ps-btn-ghost" style={{ padding: '7px' }} onClick={() => openProductModal(prod)}>
                                <Edit size={15} />
                              </button>
                              <button className="ps-btn ps-btn-danger" style={{ padding: '7px' }} onClick={() => handleDeleteProduct(prod._id)}>
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && !loading && (
                        <tr><td colSpan="6" style={{ padding: 0 }}>
                          <div className="ps-empty"><Package size={32} style={{ opacity: 0.2 }} /><p>No products found. Click "Add Product" to get started.</p></div>
                        </td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ── CATEGORIES ── */}
          {activeTab === 'categories' && (
            <div>
              <div className="ps-section-label">Catalog</div>
              <div className="ps-card">
                <div className="ps-card-header">
                  <h3>Product Categories</h3>
                  <button className="ps-btn ps-btn-primary" onClick={() => openCategoryModal()}>
                    <Plus size={16} /> Add Category
                  </button>
                </div>
                <div className="ps-cat-grid">
                  {categories.map(cat => (
                    <div key={cat._id} className="ps-cat-card">
                      <div className="ps-cat-img">
                        {cat.image
                          ? <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <Grid size={36} color="#334155" />
                        }
                        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, transparent 50%, rgba(9,14,26,0.6))' }} />
                      </div>
                      <div className="ps-cat-body">
                        <h4>{cat.name}</h4>
                        <p>{cat.description || 'No description provided.'}</p>
                        <div className="ps-cat-actions">
                          <button className="ps-btn ps-btn-outline-sm" onClick={() => openCategoryModal(cat)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                            <Edit size={13} /> Edit
                          </button>
                          <button className="ps-btn ps-btn-danger" onClick={() => handleDeleteCategory(cat._id)}
                            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              background: 'transparent', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8,
                              padding: '7px 14px', fontSize: '0.78rem', fontFamily: 'var(--ps-font-head)', fontWeight: 700 }}>
                            <Trash2 size={13} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && !loading && (
                    <div style={{ gridColumn: '1/-1' }}>
                      <div className="ps-empty">
                        <Grid size={32} style={{ opacity: 0.2 }} />
                        <p>No categories found. Click "Add Category" to get started.</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ── Category Modal ── */}
      {showCategoryModal && (
        <div className="ps-modal-overlay">
          <div className="ps-modal" style={{ maxWidth: 500 }}>
            <button className="ps-modal-close" onClick={() => setShowCategoryModal(false)}><X size={18} /></button>
            <h3>{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <form onSubmit={handleCategorySubmit}>
              <div className="ps-form-group">
                <label className="ps-form-label">Category Name</label>
                <input type="text" className="ps-form-input" required placeholder="e.g. Office Stationery"
                  value={categoryForm.name} onChange={e => setCategoryForm({ ...categoryForm, name: e.target.value })} />
              </div>
              <div className="ps-form-group">
                <label className="ps-form-label">Description</label>
                <textarea className="ps-form-input" rows="3" placeholder="Describe this category…"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  value={categoryForm.description} onChange={e => setCategoryForm({ ...categoryForm, description: e.target.value })} />
              </div>
              <div className="ps-form-group">
                <label className="ps-form-label">Image URL</label>
                <input type="text" className="ps-form-input" placeholder="https://images.unsplash.com/…"
                  value={categoryForm.image} onChange={e => setCategoryForm({ ...categoryForm, image: e.target.value })} />
              </div>
              <div className="ps-form-footer">
                <button type="button" className="ps-btn ps-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => setShowCategoryModal(false)}>Cancel</button>
                <button type="submit" className="ps-btn ps-btn-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Product Modal ── */}
      {showProductModal && (
        <div className="ps-modal-overlay">
          <div className="ps-modal" style={{ maxWidth: 560 }}>
            <button className="ps-modal-close" onClick={() => setShowProductModal(false)}><X size={18} /></button>
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={handleProductSubmit}>
              <div className="ps-form-row">
                <div className="ps-form-group">
                  <label className="ps-form-label">Product Name</label>
                  <input type="text" className="ps-form-input" required placeholder="e.g. Ergonomic Chair"
                    value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} />
                </div>
                <div className="ps-form-group">
                  <label className="ps-form-label">Brand</label>
                  <input type="text" className="ps-form-input" placeholder="Procurasure"
                    value={productForm.brand} onChange={e => setProductForm({ ...productForm, brand: e.target.value })} />
                </div>
              </div>
              <div className="ps-form-row">
                <div className="ps-form-group">
                  <label className="ps-form-label">Price ($)</label>
                  <input type="number" step="0.01" min="0" className="ps-form-input" required placeholder="199.99"
                    value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} />
                </div>
                <div className="ps-form-group">
                  <label className="ps-form-label">Count In Stock</label>
                  <input type="number" min="0" className="ps-form-input" required placeholder="50"
                    value={productForm.countInStock} onChange={e => setProductForm({ ...productForm, countInStock: e.target.value })} />
                </div>
              </div>
              <div className="ps-form-group">
                <label className="ps-form-label">Category</label>
                <select className="ps-form-input" required value={productForm.category}
                  onChange={e => setProductForm({ ...productForm, category: e.target.value })}>
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
                </select>
              </div>
              <div className="ps-form-group">
                <label className="ps-form-label">Image URL</label>
                <input type="text" className="ps-form-input" required placeholder="https://images.unsplash.com/…"
                  value={productForm.image} onChange={e => setProductForm({ ...productForm, image: e.target.value })} />
              </div>
              <div className="ps-form-group">
                <label className="ps-form-label">Description</label>
                <textarea className="ps-form-input" rows="3" required placeholder="Describe the product features, materials, dimensions…"
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                  value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} />
              </div>
              <div className="ps-form-footer">
                <button type="button" className="ps-btn ps-btn-ghost" style={{ border: '1px solid rgba(255,255,255,0.08)' }} onClick={() => setShowProductModal(false)}>Cancel</button>
                <button type="submit" className="ps-btn ps-btn-primary">
                  {editingProduct ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SuperAdminPanel;