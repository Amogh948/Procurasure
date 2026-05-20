import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { ChevronRight, Search, Package } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');

  :root {
    --ps-navy:      #090e1a;
    --ps-navy2:     #0f1829;
    --ps-amber:     #f0a500;
    --ps-font-head: 'Syne', sans-serif;
    --ps-font-body: 'DM Sans', sans-serif;
  }

  @keyframes ps-fade-up {
    from { opacity:0; transform:translateY(16px); }
    to   { opacity:1; transform:translateY(0); }
  }
  @keyframes ps-shimmer {
    0%   { background-position:-600px 0; }
    100% { background-position: 600px 0; }
  }

  .ps-cat-btn {
    width: 100%;
    text-align: left;
    padding: 11px 16px;
    border-radius: 9px;
    border: 1px solid transparent;
    cursor: pointer;
    font-family: var(--ps-font-head);
    font-size: 0.84rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: space-between;
    transition: all 0.2s;
    background: transparent;
    color: #64748b;
    position: relative;
  }
  .ps-cat-btn:hover {
    background: rgba(240,165,0,0.06);
    color: #cbd5e1;
  }
  .ps-cat-btn.active {
    background: rgba(240,165,0,0.1);
    border-color: rgba(240,165,0,0.2);
    color: var(--ps-amber);
  }
  .ps-cat-btn.active::before {
    content: '';
    position: absolute;
    left: 0; top: 25%; bottom: 25%;
    width: 3px;
    border-radius: 0 3px 3px 0;
    background: var(--ps-amber);
  }

  .ps-search-input {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 10px;
    padding: 10px 16px 10px 40px;
    font-family: var(--ps-font-body);
    font-size: 0.875rem;
    color: #e2e8f0;
    outline: none;
    width: 220px;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .ps-search-input:focus {
    border-color: rgba(240,165,0,0.4);
    box-shadow: 0 0 0 3px rgba(240,165,0,0.08);
    width: 260px;
  }
  .ps-search-input::placeholder { color: #334155; }

  .ps-product-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 22px;
  }

  .ps-skeleton {
    height: 300px;
    border-radius: 14px;
    background: linear-gradient(90deg, rgba(26,37,64,0.5) 25%, rgba(30,44,72,0.7) 50%, rgba(26,37,64,0.5) 75%);
    background-size: 600px 100%;
    animation: ps-shimmer 1.4s infinite linear;
  }
`;

const Products = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState('');

  const catId = new URLSearchParams(location.search).get('category') || '';
  const searchKeyword = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [prodRes, catRes] = await Promise.all([
          axios.get(`/api/products${catId ? `?category=${catId}` : ''}`),
          axios.get('/api/categories')
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
        setSelectedCategory(catId ? (catRes.data.find(c => c._id === catId) || null) : null);
      } catch (err) {
        console.error('Error fetching products/categories', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [catId]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes((searchKeyword || localSearch).toLowerCase())
  );

  return (
    <div style={{ fontFamily: 'var(--ps-font-body)', background: 'var(--ps-navy)', color: '#e2e8f0', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <style>{STYLES}</style>

      {/* ── Top bar: title left, search right ── */}
      <div style={{
        background: 'linear-gradient(90deg, #0f1829, #1a2540)',
        borderBottom: '1px solid rgba(240,165,0,0.1)',
        padding: '18px 32px 18px 0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
      }}>
        {/* Left: breadcrumb + title aligned to where main content starts (240px sidebar) */}
        <div style={{ paddingLeft: 260 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '0.7rem', fontFamily: 'var(--ps-font-head)', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#334155', marginBottom: 6 }}>
            <span style={{ cursor: 'pointer', color: '#475569' }} onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={10} />
            {selectedCategory
              ? <><span style={{ cursor: 'pointer', color: '#475569' }} onClick={() => navigate('/products')}>All Products</span><ChevronRight size={10} /><span style={{ color: '#f0a500' }}>{selectedCategory.name}</span></>
              : <span style={{ color: '#f0a500' }}>All Products</span>
            }
          </div>
          <h1 style={{ fontFamily: 'var(--ps-font-head)', fontSize: '1.35rem', fontWeight: 800, color: '#f1f5f9', margin: 0, letterSpacing: '-0.01em' }}>
            {selectedCategory ? selectedCategory.name : searchKeyword ? `"${searchKeyword}"` : 'Product Catalog'}
          </h1>
          <div style={{ marginTop: 5, fontSize: '0.78rem', color: '#334155', fontFamily: 'var(--ps-font-head)', fontWeight: 600 }}>
            {loading ? 'Loading…' : `${filteredProducts.length} product${filteredProducts.length !== 1 ? 's' : ''}`}
          </div>
        </div>

        {/* Right: search */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#475569', pointerEvents: 'none' }} />
          <input
            className="ps-search-input"
            placeholder="Search products…"
            value={localSearch}
            onChange={e => setLocalSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', flex: 1 }}>

        {/* Sidebar */}
        <aside style={{
          background: 'linear-gradient(180deg, #0f1829, #090e1a)',
          borderRight: '1px solid rgba(240,165,0,0.08)',
          padding: '28px 12px',
        }}>
          <div style={{ fontFamily: 'var(--ps-font-head)', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#334155', padding: '0 12px', marginBottom: 10 }}>
            Categories
          </div>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <li>
              <button className={`ps-cat-btn${!selectedCategory ? ' active' : ''}`} onClick={() => navigate('/products')}>
                <span>All Products</span>
                {!selectedCategory && <ChevronRight size={13} />}
              </button>
            </li>
            {categories.map(cat => (
              <li key={cat._id}>
                <button
                  className={`ps-cat-btn${selectedCategory?._id === cat._id ? ' active' : ''}`}
                  onClick={() => navigate(`/products?category=${cat._id}`)}
                >
                  <span>{cat.name}</span>
                  {selectedCategory?._id === cat._id && <ChevronRight size={13} />}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        {/* Product area */}
        <main style={{
          padding: '32px 40px',
          background: 'radial-gradient(ellipse 80% 50% at 80% 20%, rgba(240,165,0,0.03), transparent 60%), var(--ps-navy)',
        }}>
          {loading ? (
            <div className="ps-product-grid">
              {Array.from({ length: 8 }).map((_, i) => <div key={i} className="ps-skeleton" />)}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              padding: '80px 40px', textAlign: 'center',
              background: 'linear-gradient(145deg, rgba(26,37,64,0.5), rgba(15,24,41,0.7))',
              border: '1px dashed rgba(255,255,255,0.06)', borderRadius: 16,
            }}>
              <div style={{ width: 56, height: 56, borderRadius: 14, background: 'rgba(240,165,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
                <Package size={24} color="#f0a500" style={{ opacity: 0.5 }} />
              </div>
              <h3 style={{ fontFamily: 'var(--ps-font-head)', fontWeight: 800, color: '#e2e8f0', marginBottom: 6, fontSize: '1rem' }}>No products found</h3>
              <p style={{ color: '#475569', fontSize: '0.85rem', margin: 0 }}>Try a different search or category.</p>
            </div>
          ) : (
            <div className="ps-product-grid">
              {filteredProducts.map((product, i) => (
                <div key={product._id} style={{ animation: `ps-fade-up 0.45s ease both ${i * 0.04}s` }}>
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Products;