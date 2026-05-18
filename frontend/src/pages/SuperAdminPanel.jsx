import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Package, Grid, ShoppingBag, Plus, Trash2, Edit, CheckCircle, XCircle, X } from 'lucide-react';

const SuperAdminPanel = () => {
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modals state
  const [showProductModal, setShowProductModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [editingCategory, setEditingCategory] = useState(null);

  // Forms state
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    description: '',
    image: ''
  });

  const [productForm, setProductForm] = useState({
    name: '',
    price: '',
    description: '',
    image: '',
    category: '',
    countInStock: '',
    brand: 'Procurasure'
  });

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'orders') {
        const { data } = await axios.get('/api/orders');
        setOrders(data);
      } else if (activeTab === 'products') {
        const [prodRes, catRes] = await Promise.all([
          axios.get('/api/products'),
          axios.get('/api/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } else if (activeTab === 'categories') {
        const { data } = await axios.get('/api/categories');
        setCategories(data);
      }
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyPayment = async (orderId) => {
    try {
      await axios.put(`/api/orders/${orderId}/pay`, { 
        id: 'VERIFIED_MANUAL', 
        status: 'COMPLETED', 
        update_time: new Date().toISOString() 
      });
      fetchData();
    } catch (error) {
      alert('Failed to verify payment');
    }
  };

  // Category CRUD Handlers
  const openCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryForm({
        name: cat.name,
        description: cat.description || '',
        image: cat.image || ''
      });
    } else {
      setEditingCategory(null);
      setCategoryForm({
        name: '',
        description: '',
        image: ''
      });
    }
    setShowCategoryModal(true);
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory._id}`, categoryForm);
      } else {
        await axios.post('/api/categories', categoryForm);
      }
      setShowCategoryModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving category');
    }
  };

  const handleDeleteCategory = async (catId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${catId}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting category');
      }
    }
  };

  // Product CRUD Handlers
  const openProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setProductForm({
        name: prod.name,
        price: prod.price,
        description: prod.description,
        image: prod.image,
        category: prod.category?._id || prod.category || '',
        countInStock: prod.countInStock,
        brand: prod.brand || 'Procurasure'
      });
    } else {
      setEditingProduct(null);
      setProductForm({
        name: '',
        price: '',
        description: '',
        image: '',
        category: categories[0]?._id || '',
        countInStock: '0',
        brand: 'Procurasure'
      });
    }
    setShowProductModal(true);
  };

  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productForm);
      } else {
        await axios.post('/api/products', productForm);
      }
      setShowProductModal(false);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Error saving product');
    }
  };

  const handleDeleteProduct = async (prodId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${prodId}`);
        fetchData();
      } catch (error) {
        alert(error.response?.data?.message || 'Error deleting product');
      }
    }
  };

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--background)', minHeight: '100vh' }}>
      <div className="container">
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Superadmin Dashboard</h1>
          <p style={{ color: 'var(--text-muted)' }}>Manage Procurasure operations, orders, and products</p>
        </div>

        <div className="grid-admin-layout">
          {/* Admin Sidebar */}
          <aside>
            <div className="card" style={{ padding: '10px' }}>
              <button 
                onClick={() => setActiveTab('orders')}
                className="flex items-center gap-3"
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: 'var(--radius)', 
                  backgroundColor: activeTab === 'orders' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'orders' ? 'white' : 'var(--text-main)',
                  fontWeight: '600'
                }}
              >
                <ShoppingBag size={20} />
                Manage Orders
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className="flex items-center gap-3"
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: 'var(--radius)', 
                  backgroundColor: activeTab === 'products' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'products' ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  marginTop: '5px'
                }}
              >
                <Package size={20} />
                Manage Products
              </button>
              <button 
                onClick={() => setActiveTab('categories')}
                className="flex items-center gap-3"
                style={{ 
                  width: '100%', 
                  padding: '15px', 
                  borderRadius: 'var(--radius)', 
                  backgroundColor: activeTab === 'categories' ? 'var(--primary)' : 'transparent',
                  color: activeTab === 'categories' ? 'white' : 'var(--text-main)',
                  fontWeight: '600',
                  marginTop: '5px'
                }}
              >
                <Grid size={20} />
                Manage Categories
              </button>
            </div>
          </aside>

          {/* Admin Content */}
          <main>
            {activeTab === 'orders' && (
              <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>All Orders</h3>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '15px' }}>ID</th>
                        <th style={{ padding: '15px' }}>USER</th>
                        <th style={{ padding: '15px' }}>DATE</th>
                        <th style={{ padding: '15px' }}>TOTAL</th>
                        <th style={{ padding: '15px' }}>PAID</th>
                        <th style={{ padding: '15px' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order._id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '15px', fontSize: '0.875rem' }}>{order._id.substring(0, 8)}...</td>
                          <td style={{ padding: '15px' }}>{order.user?.name}</td>
                          <td style={{ padding: '15px' }}>{new Date(order.createdAt).toLocaleDateString()}</td>
                          <td style={{ padding: '15px', fontWeight: '600' }}>${order.totalPrice.toFixed(2)}</td>
                          <td style={{ padding: '15px' }}>
                            {order.isPaid ? (
                              <span className="flex items-center gap-1" style={{ color: 'var(--success)', fontWeight: '600' }}>
                                <CheckCircle size={16} /> Paid
                              </span>
                            ) : (
                              <span className="flex items-center gap-1" style={{ color: 'var(--error)', fontWeight: '600' }}>
                                <XCircle size={16} /> Pending
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '15px' }}>
                            {!order.isPaid && (
                              <button 
                                onClick={() => handleVerifyPayment(order._id)}
                                className="btn btn-primary" 
                                style={{ padding: '5px 12px', fontSize: '0.75rem' }}
                              >
                                Verify Payment
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                      {orders.length === 0 && !loading && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No orders found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'products' && (
              <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Products Catalog</h3>
                  <button onClick={() => openProductModal()} className="btn btn-primary" style={{ gap: '8px' }}>
                    <Plus size={18} />
                    Add Product
                  </button>
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                        <th style={{ padding: '15px' }}>IMAGE</th>
                        <th style={{ padding: '15px' }}>NAME</th>
                        <th style={{ padding: '15px' }}>CATEGORY</th>
                        <th style={{ padding: '15px' }}>PRICE</th>
                        <th style={{ padding: '15px' }}>STOCK</th>
                        <th style={{ padding: '15px' }}>ACTION</th>
                      </tr>
                    </thead>
                    <tbody>
                      {products.map(prod => (
                        <tr key={prod._id} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{ padding: '15px' }}>
                            <img 
                              src={prod.image || 'https://via.placeholder.com/50'} 
                              alt={prod.name} 
                              style={{ width: '40px', height: '40px', borderRadius: 'var(--radius)', objectFit: 'cover', border: '1px solid var(--border)' }}
                            />
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div style={{ fontWeight: '600' }}>{prod.name}</div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{prod.brand || 'Procurasure'}</div>
                          </td>
                          <td style={{ padding: '15px', fontSize: '0.875rem' }}>
                            {prod.category?.name || 'Uncategorized'}
                          </td>
                          <td style={{ padding: '15px', fontWeight: '600' }}>${prod.price?.toFixed(2)}</td>
                          <td style={{ padding: '15px' }}>
                            {prod.countInStock > 10 ? (
                              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)' }}>
                                {prod.countInStock} in stock
                              </span>
                            ) : prod.countInStock > 0 ? (
                              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)' }}>
                                {prod.countInStock} low stock
                              </span>
                            ) : (
                              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: '600', backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)' }}>
                                Out of stock
                              </span>
                            )}
                          </td>
                          <td style={{ padding: '15px' }}>
                            <div className="flex gap-2">
                              <button 
                                onClick={() => openProductModal(prod)}
                                style={{ color: 'var(--text-muted)', backgroundColor: 'transparent', padding: '5px' }}
                              >
                                <Edit size={16} />
                              </button>
                              <button 
                                onClick={() => handleDeleteProduct(prod._id)}
                                style={{ color: 'var(--error)', backgroundColor: 'transparent', padding: '5px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {products.length === 0 && !loading && (
                        <tr><td colSpan="6" style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>No products found</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="card">
                <div className="flex justify-between items-center" style={{ marginBottom: '30px' }}>
                  <h3 style={{ fontSize: '1.25rem' }}>Product Categories</h3>
                  <button onClick={() => openCategoryModal()} className="btn btn-primary" style={{ gap: '8px' }}>
                    <Plus size={18} />
                    Add Category
                  </button>
                </div>
                {/* Category list */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
                  {categories.map(cat => (
                    <div key={cat._id} className="card" style={{ padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column', height: '100%' }}>
                      <div style={{ height: '140px', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--background)' }}>
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                            <Grid size={40} />
                          </div>
                        )}
                      </div>
                      <div style={{ padding: '20px', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        <h4 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{cat.name}</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '20px', flexGrow: 1, lineClamp: 2, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                          {cat.description || 'No description provided.'}
                        </p>
                        <div className="flex gap-2 justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '15px', marginTop: 'auto' }}>
                          <button 
                            onClick={() => openCategoryModal(cat)}
                            className="btn btn-outline" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '5px', width: '48%' }}
                          >
                            <Edit size={14} /> Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteCategory(cat._id)}
                            className="btn btn-outline" 
                            style={{ padding: '6px 12px', fontSize: '0.8rem', gap: '5px', width: '48%', color: 'var(--error)', borderColor: 'rgba(239, 68, 68, 0.2)' }}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {categories.length === 0 && !loading && (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)', border: '1px dashed var(--border)', borderRadius: 'var(--radius)' }}>
                      No categories found. Click "Add Category" to get started.
                    </div>
                  )}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Category Modal */}
      {showCategoryModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '500px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <button 
              onClick={() => setShowCategoryModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)', backgroundColor: 'transparent' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
              {editingCategory ? 'Edit Category' : 'Add New Category'}
            </h3>
            <form onSubmit={handleCategorySubmit}>
              <div className="form-group">
                <label className="form-label">Category Name</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required 
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  placeholder="e.g. Office Stationery"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  placeholder="Provide a detailed description of this category..."
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={categoryForm.image}
                  onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })}
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                />
              </div>
              <div className="flex gap-2 justify-end" style={{ marginTop: '30px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowCategoryModal(false)} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Product Modal */}
      {showProductModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.6)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div className="card" style={{
            width: '100%',
            maxWidth: '550px',
            maxHeight: '90vh',
            overflowY: 'auto',
            position: 'relative',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <button 
              onClick={() => setShowProductModal(false)}
              style={{ position: 'absolute', top: '20px', right: '20px', color: 'var(--text-muted)', backgroundColor: 'transparent' }}
            >
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>
              {editingProduct ? 'Edit Product' : 'Add New Product'}
            </h3>
            <form onSubmit={handleProductSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Product Name</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    required 
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Ergonomic Office Chair"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Brand</label>
                  <input 
                    type="text" 
                    className="form-input" 
                    value={productForm.brand}
                    onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                    placeholder="e.g. Procurasure"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <div className="form-group">
                  <label className="form-label">Price ($)</label>
                  <input 
                    type="number" 
                    step="0.01"
                    min="0"
                    className="form-input" 
                    required 
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    placeholder="e.g. 199.99"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Count In Stock</label>
                  <input 
                    type="number" 
                    min="0"
                    className="form-input" 
                    required 
                    value={productForm.countInStock}
                    onChange={(e) => setProductForm({ ...productForm, countInStock: e.target.value })}
                    placeholder="e.g. 50"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Category</label>
                <select 
                  className="form-input" 
                  required
                  value={productForm.category}
                  onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                >
                  <option value="" disabled>Select a category</option>
                  {categories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Image URL</label>
                <input 
                  type="text" 
                  className="form-input" 
                  required
                  value={productForm.image}
                  onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                  placeholder="e.g. https://images.unsplash.com/photo-..."
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea 
                  className="form-input" 
                  rows="3"
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Provide a detailed description of the product features, measurements, materials..."
                  style={{ fontFamily: 'inherit', resize: 'vertical' }}
                />
              </div>

              <div className="flex gap-2 justify-end" style={{ marginTop: '30px' }}>
                <button 
                  type="button" 
                  onClick={() => setShowProductModal(false)} 
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
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
