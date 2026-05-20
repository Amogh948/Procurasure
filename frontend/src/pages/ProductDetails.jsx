import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Shield, Zap, RefreshCw, Package } from 'lucide-react';
import { useCart } from '../context/CartContext';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --ps-navy:#090e1a; --ps-navy2:#0f1829; --ps-slate:#1a2540;
    --ps-amber:#f0a500; --ps-amber2:#fbbf24; --ps-teal:#0fcfb0;
    --ps-muted:#6b7a99;
    --ps-font-head:'Syne',sans-serif; --ps-font-body:'DM Sans',sans-serif;
  }
  @keyframes ps-fade-up { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ps-scale-in { from{opacity:0;transform:scale(0.92)} to{opacity:1;transform:scale(1)} }
  @keyframes ps-modal-in { from{opacity:0;transform:scale(0.94) translateY(12px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes ps-check-pop { 0%{transform:scale(0)} 60%{transform:scale(1.2)} 100%{transform:scale(1)} }
  @keyframes ps-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
  @keyframes ps-shimmer { 0%{background-position:-600px 0} 100%{background-position:600px 0} }

  .ps-qty-btn {
    padding:10px 16px; border:none; cursor:pointer;
    background:rgba(255,255,255,0.04); color:#94a3b8;
    transition:all 0.2s; display:flex; align-items:center; justify-content:center;
  }
  .ps-qty-btn:hover:not(:disabled) {
    background:rgba(240,165,0,0.12); color:#f0a500;
  }
  .ps-qty-btn:disabled { opacity:0.3; cursor:not-allowed; }

  .ps-trust-badge {
    display:flex; align-items:center; gap:10px;
    padding:12px 16px; border-radius:10px;
    background:rgba(255,255,255,0.03);
    border:1px solid rgba(255,255,255,0.05);
    transition:border-color 0.2s;
  }
  .ps-trust-badge:hover { border-color:rgba(240,165,0,0.2); }

  .ps-add-btn {
    width:100%; padding:16px; border:none; cursor:pointer; border-radius:10px;
    background:linear-gradient(135deg,#f0a500,#d97706);
    font-family:var(--ps-font-head); font-size:1rem; font-weight:700; letter-spacing:0.02em;
    color:#090e1a; display:flex; align-items:center; justify-content:center; gap:10px;
    transition:all 0.25s;
    box-shadow:0 4px 20px rgba(240,165,0,0.3);
  }
  .ps-add-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(240,165,0,0.45); }
  .ps-add-btn:active { transform:translateY(0); }
`;

const TRUST_ITEMS = [
  { icon: Shield, label: 'Verified Supplier',  color: '#f0a500' },
  { icon: Zap,    label: 'Fast Dispatch',       color: '#0fcfb0' },
  { icon: RefreshCw, label: '30-Day Returns',  color: '#818cf8' },
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [showAddedModal, setShowAddedModal] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [activeTab, setActiveTab] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || 'Product not found');
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleQtyChange = (type) => {
    if (type === 'inc' && qty < product.countInStock) setQty(q => q + 1);
    if (type === 'dec' && qty > 1) setQty(q => q - 1);
  };

  const handleAddToCart = () => {
    if (product?.countInStock > 0) {
      addToCart(product, qty);
      setShowAddedModal(true);
    }
  };

  /* ─ Loading skeleton ─ */
  if (loading) return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', minHeight:'100vh', padding:'40px' }}>
      <style>{STYLES}</style>
      <div style={{ maxWidth:1100, margin:'0 auto', display:'grid', gridTemplateColumns:'1fr 1fr', gap:40 }}>
        {[1,2].map(i=>(
          <div key={i} style={{ height:480, borderRadius:20,
            background:'linear-gradient(90deg,rgba(26,37,64,0.5) 25%,rgba(30,44,72,0.7) 50%,rgba(26,37,64,0.5) 75%)',
            backgroundSize:'600px 100%', animation:'ps-shimmer 1.4s infinite linear' }}/>
        ))}
      </div>
    </div>
  );

  /* ─ Error state ─ */
  if (error || !product) return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{STYLES}</style>
      <div style={{ textAlign:'center', padding:40 }}>
        <div style={{ fontSize:'3rem', marginBottom:16 }}>⚠️</div>
        <h3 style={{ color:'#e2e8f0', fontFamily:'var(--ps-font-head)', marginBottom:8 }}>Product Not Found</h3>
        <p style={{ color:'#475569', marginBottom:24 }}>{error}</p>
        <Link to="/products" style={{
          display:'inline-flex', alignItems:'center', gap:8, padding:'12px 24px',
          background:'linear-gradient(135deg,#f0a500,#d97706)', color:'#090e1a',
          fontFamily:'var(--ps-font-head)', fontWeight:700, borderRadius:8, textDecoration:'none',
        }}>
          <ArrowLeft size={16}/> Back to Products
        </Link>
      </div>
    </div>
  );

  const stockPct = Math.min(100, (product.countInStock / 50) * 100);

  return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0', minHeight:'100vh' }}>
      <style>{STYLES}</style>

      {/* Breadcrumb */}
      <div style={{ background:'linear-gradient(180deg,#0f1829,#090e1a)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'16px 40px' }}>
        <div style={{ maxWidth:1100, margin:'0 auto' }}>
          <button onClick={()=>navigate('/products')} style={{
            display:'inline-flex', alignItems:'center', gap:8, background:'transparent', border:'none',
            color:'#475569', cursor:'pointer', fontFamily:'var(--ps-font-body)', fontSize:'0.88rem', fontWeight:500,
            transition:'color 0.2s', padding:0,
          }}
          onMouseOver={e=>e.currentTarget.style.color='#f0a500'}
          onMouseOut={e=>e.currentTarget.style.color='#475569'}>
            <ArrowLeft size={15}/> Back to Catalog
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'48px 40px', animation:'ps-fade-up 0.6s ease both' }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:52, alignItems:'start' }}>

          {/* Left: Image */}
          <div>
            <div style={{
              borderRadius:20, overflow:'hidden',
              border:'1px solid rgba(255,255,255,0.06)',
              background:'linear-gradient(145deg,rgba(26,37,64,0.8),rgba(15,24,41,0.9))',
              aspectRatio:'1/1', position:'relative',
            }}>
              {!imgLoaded && (
                <div style={{
                  position:'absolute', inset:0,
                  background:'linear-gradient(90deg,rgba(26,37,64,0.5) 25%,rgba(30,44,72,0.7) 50%,rgba(26,37,64,0.5) 75%)',
                  backgroundSize:'600px 100%', animation:'ps-shimmer 1.4s infinite linear',
                }}/>
              )}
              <img
                src={product.image || 'https://via.placeholder.com/600'}
                alt={product.name}
                onLoad={()=>setImgLoaded(true)}
                style={{ width:'100%', height:'100%', objectFit:'cover', display:imgLoaded?'block':'none', animation:'ps-scale-in 0.5s ease' }}
              />
              {/* Floating badge */}
              <div style={{
                position:'absolute', top:16, left:16,
                padding:'6px 14px', borderRadius:20,
                background:'rgba(240,165,0,0.15)', backdropFilter:'blur(8px)',
                border:'1px solid rgba(240,165,0,0.3)',
                fontFamily:'var(--ps-font-head)', fontSize:'0.72rem', fontWeight:700,
                color:'#f0a500', textTransform:'uppercase', letterSpacing:'0.1em',
              }}>
                {product.category?.name || 'Industrial'}
              </div>
            </div>

            {/* Trust badges below image */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:10, marginTop:16 }}>
              {TRUST_ITEMS.map(({ icon:Icon, label, color }) => (
                <div key={label} className="ps-trust-badge" style={{ flexDirection:'column', textAlign:'center', gap:8 }}>
                  <Icon size={18} color={color}/>
                  <span style={{ fontSize:'0.72rem', color:'#64748b', fontWeight:500 }}>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Details */}
          <div style={{ animation:'ps-fade-up 0.7s ease both 0.1s' }}>
            <h1 style={{
              fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.6rem,3vw,2.4rem)',
              fontWeight:800, color:'#f1f5f9', margin:'0 0 8px', lineHeight:1.15, letterSpacing:'-0.02em',
            }}>
              {product.name}
            </h1>
            <p style={{ color:'#475569', fontSize:'0.88rem', marginBottom:24 }}>
              Brand: <strong style={{ color:'#94a3b8', fontWeight:600 }}>{product.brand || 'Procurasure'}</strong>
            </p>

            {/* Price */}
            <div style={{ marginBottom:28 }}>
              <span style={{
                fontFamily:'var(--ps-font-head)', fontSize:'2.2rem', fontWeight:800,
                background:'linear-gradient(135deg,#f0a500,#fbbf24)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent',
              }}>
                ${product.price?.toFixed(2)}
              </span>
              <span style={{ fontSize:'0.82rem', color:'#475569', marginLeft:10 }}>/ unit</span>
            </div>

            {/* Tabs */}
            <div style={{ borderBottom:'1px solid rgba(255,255,255,0.07)', marginBottom:20 }}>
              <div style={{ display:'flex', gap:0 }}>
                {['description', 'specs'].map(tab => (
                  <button key={tab} onClick={()=>setActiveTab(tab)} style={{
                    padding:'10px 20px', border:'none', background:'transparent', cursor:'pointer',
                    fontFamily:'var(--ps-font-head)', fontSize:'0.82rem', fontWeight:700,
                    textTransform:'capitalize', letterSpacing:'0.04em',
                    color: activeTab===tab ? '#f0a500' : '#475569',
                    borderBottom: activeTab===tab ? '2px solid #f0a500' : '2px solid transparent',
                    transition:'all 0.2s',
                  }}>
                    {tab}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ minHeight:80, marginBottom:28 }}>
              {activeTab==='description' ? (
                <p style={{ color:'#94a3b8', lineHeight:1.75, fontSize:'0.93rem' }}>{product.description}</p>
              ) : (
                <div style={{ display:'grid', gap:10 }}>
                  {[['SKU', product._id?.substring(0,10).toUpperCase()], ['Brand', product.brand||'Procurasure'], ['Category', product.category?.name||'N/A'], ['Stock', product.countInStock]].map(([k,v])=>(
                    <div key={k} style={{ display:'flex', justifyContent:'space-between', padding:'8px 0', borderBottom:'1px solid rgba(255,255,255,0.04)', fontSize:'0.87rem' }}>
                      <span style={{ color:'#475569', fontWeight:500 }}>{k}</span>
                      <span style={{ color:'#e2e8f0', fontWeight:600 }}>{v}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Stock */}
            <div style={{
              background:'linear-gradient(145deg,rgba(26,37,64,0.8),rgba(15,24,41,0.9))',
              border:'1px solid rgba(255,255,255,0.06)',
              borderRadius:14, padding:20, marginBottom:20,
            }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
                <span style={{ fontSize:'0.85rem', color:'#94a3b8', fontWeight:500 }}>Stock Status</span>
                {product.countInStock > 0 ? (
                  <span style={{ display:'flex', alignItems:'center', gap:6, fontSize:'0.82rem', fontWeight:700, color:'#10b981' }}>
                    <span style={{ width:7, height:7, borderRadius:'50%', background:'#10b981', display:'inline-block' }}/>
                    In Stock ({product.countInStock} units)
                  </span>
                ) : (
                  <span style={{ fontSize:'0.82rem', fontWeight:700, color:'#ef4444' }}>Out of Stock</span>
                )}
              </div>
              {/* Stock bar */}
              <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4, overflow:'hidden' }}>
                <div style={{
                  height:'100%', borderRadius:4, width:`${stockPct}%`,
                  background: stockPct > 50 ? 'linear-gradient(90deg,#10b981,#34d399)' : stockPct > 20 ? 'linear-gradient(90deg,#f59e0b,#fbbf24)' : 'linear-gradient(90deg,#ef4444,#f87171)',
                  transition:'width 0.8s ease',
                }}/>
              </div>

              {/* Qty + Add */}
              {product.countInStock > 0 && (
                <div style={{ marginTop:20, display:'flex', gap:12, alignItems:'center' }}>
                  <div style={{ display:'flex', border:'1px solid rgba(255,255,255,0.08)', borderRadius:10, overflow:'hidden' }}>
                    <button className="ps-qty-btn" onClick={()=>handleQtyChange('dec')} disabled={qty<=1}><Minus size={14}/></button>
                    <span style={{ padding:'10px 20px', fontFamily:'var(--ps-font-head)', fontWeight:700, fontSize:'1rem', color:'#f1f5f9', minWidth:50, textAlign:'center', background:'rgba(255,255,255,0.02)' }}>{qty}</span>
                    <button className="ps-qty-btn" onClick={()=>handleQtyChange('inc')} disabled={qty>=product.countInStock}><Plus size={14}/></button>
                  </div>
                  <button className="ps-add-btn" onClick={handleAddToCart} style={{ flex:1 }}>
                    <ShoppingCart size={18}/>
                    Add to Cart — ${(product.price * qty).toFixed(2)}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Added-to-Cart Modal ── */}
      {showAddedModal && (
        <div style={{
          position:'fixed', inset:0, zIndex:1000,
          background:'rgba(9,14,26,0.75)', backdropFilter:'blur(8px)',
          display:'flex', alignItems:'center', justifyContent:'center', padding:20,
        }} onClick={()=>setShowAddedModal(false)}>
          <div onClick={e=>e.stopPropagation()} style={{
            width:'100%', maxWidth:440, textAlign:'center', padding:'48px 40px',
            background:'linear-gradient(145deg,#1a2540,#0f1829)',
            border:'1px solid rgba(240,165,0,0.2)',
            borderRadius:20, boxShadow:'0 40px 100px rgba(0,0,0,0.6)',
            animation:'ps-modal-in 0.35s ease',
          }}>
            <div style={{
              width:64, height:64, borderRadius:'50%',
              background:'rgba(16,185,129,0.12)',
              display:'flex', alignItems:'center', justifyContent:'center',
              margin:'0 auto 24px', animation:'ps-check-pop 0.4s ease 0.1s both',
            }}>
              <Check size={28} color="#10b981" strokeWidth={2.5}/>
            </div>
            <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.3rem', fontWeight:800, color:'#f1f5f9', marginBottom:10 }}>Added to Cart!</h3>
            <p style={{ color:'#64748b', marginBottom:32, fontSize:'0.9rem', lineHeight:1.6 }}>
              {qty}× <strong style={{ color:'#94a3b8' }}>{product.name}</strong> has been added to your cart.
            </p>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <button onClick={()=>setShowAddedModal(false)} style={{
                padding:'12px', border:'1px solid rgba(255,255,255,0.1)', borderRadius:10, background:'transparent',
                color:'#94a3b8', cursor:'pointer', fontFamily:'var(--ps-font-head)', fontWeight:600, fontSize:'0.9rem',
                transition:'all 0.2s',
              }}
              onMouseOver={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.25)'}
              onMouseOut={e=>e.currentTarget.style.borderColor='rgba(255,255,255,0.1)'}>
                Continue
              </button>
              <button onClick={()=>navigate('/cart')} style={{
                padding:'12px', border:'none', borderRadius:10,
                background:'linear-gradient(135deg,#f0a500,#d97706)',
                color:'#090e1a', cursor:'pointer', fontFamily:'var(--ps-font-head)', fontWeight:700, fontSize:'0.9rem',
                display:'flex', alignItems:'center', justifyContent:'center', gap:8,
                transition:'all 0.2s', boxShadow:'0 4px 16px rgba(240,165,0,0.3)',
              }}>
                <ShoppingCart size={16}/> View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;