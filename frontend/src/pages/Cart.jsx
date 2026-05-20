import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingCart, Minus, Plus, ArrowRight, ArrowLeft, CheckCircle, Truck, Tag } from 'lucide-react';

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&display=swap');
  :root {
    --ps-navy:#090e1a; --ps-navy2:#0f1829; --ps-slate:#1a2540;
    --ps-amber:#f0a500; --ps-teal:#0fcfb0; --ps-muted:#6b7a99;
    --ps-font-head:'Syne',sans-serif; --ps-font-body:'DM Sans',sans-serif;
  }
  @keyframes ps-fade-up { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ps-modal-in { from{opacity:0;transform:scale(0.94) translateY(10px)} to{opacity:1;transform:scale(1) translateY(0)} }
  @keyframes ps-slide-out {
    from{opacity:1;transform:translateX(0)} to{opacity:0;transform:translateX(40px)}
  }
  @keyframes ps-progress {
    from{width:0} to{width:var(--prog-w)}
  }

  .ps-cart-item {
    display:grid; grid-template-columns:80px 1fr auto;
    gap:20px; align-items:center;
    background:linear-gradient(145deg,rgba(26,37,64,0.7),rgba(15,24,41,0.8));
    border:1px solid rgba(255,255,255,0.06);
    border-radius:14px; padding:20px;
    transition:all 0.25s; animation:ps-fade-up 0.5s ease both;
  }
  .ps-cart-item:hover { border-color:rgba(240,165,0,0.15); }

  .ps-remove-btn {
    background:transparent; border:none; cursor:pointer;
    color:#334155; padding:8px; border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    transition:all 0.2s;
  }
  .ps-remove-btn:hover { background:rgba(239,68,68,0.1); color:#ef4444; }

  .ps-qty-btn {
    padding:8px 12px; border:none; cursor:pointer;
    background:rgba(255,255,255,0.04); color:#64748b;
    transition:all 0.2s; display:flex; align-items:center;
  }
  .ps-qty-btn:hover:not(:disabled) { background:rgba(240,165,0,0.12); color:#f0a500; }
  .ps-qty-btn:disabled { opacity:0.3; cursor:not-allowed; }

  .ps-checkout-btn {
    width:100%; padding:16px; border:none; cursor:pointer; border-radius:10px;
    background:linear-gradient(135deg,#f0a500,#d97706);
    font-family:var(--ps-font-head); font-size:1rem; font-weight:700; letter-spacing:0.02em;
    color:#090e1a; display:flex; align-items:center; justify-content:center; gap:10px;
    box-shadow:0 4px 20px rgba(240,165,0,0.3); transition:all 0.25s;
  }
  .ps-checkout-btn:hover { transform:translateY(-2px); box-shadow:0 8px 32px rgba(240,165,0,0.45); }
  .ps-checkout-btn:active { transform:translateY(0); }

  .ps-modal-overlay {
    position:fixed; inset:0; z-index:1000;
    background:rgba(9,14,26,0.78); backdrop-filter:blur(10px);
    display:flex; align-items:center; justify-content:center; padding:20px;
  }
  .ps-modal-card {
    width:100%; max-width:460px; text-align:center; padding:48px 40px;
    background:linear-gradient(145deg,#1a2540,#0f1829);
    border:1px solid rgba(255,255,255,0.08);
    border-radius:20px; box-shadow:0 40px 100px rgba(0,0,0,0.6);
    animation:ps-modal-in 0.35s ease;
  }
  .ps-modal-icon {
    width:68px; height:68px; border-radius:50%;
    display:flex; align-items:center; justify-content:center; margin:0 auto 24px;
  }
  .ps-modal-actions { display:grid; grid-template-columns:1fr 1fr; gap:12px; }
  .ps-modal-btn-outline {
    padding:13px; border:1px solid rgba(255,255,255,0.1); border-radius:10px;
    background:transparent; color:#94a3b8; cursor:pointer;
    font-family:var(--ps-font-head); font-weight:600; font-size:0.88rem;
    transition:border-color 0.2s;
  }
  .ps-modal-btn-outline:hover { border-color:rgba(255,255,255,0.25); }
  .ps-modal-btn-primary {
    padding:13px; border:none; border-radius:10px;
    background:linear-gradient(135deg,#f0a500,#d97706); color:#090e1a; cursor:pointer;
    font-family:var(--ps-font-head); font-weight:700; font-size:0.88rem;
    display:flex; align-items:center; justify-content:center; gap:8px;
    transition:all 0.2s; box-shadow:0 4px 16px rgba(240,165,0,0.3);
  }
  .ps-modal-btn-primary:hover { box-shadow:0 6px 24px rgba(240,165,0,0.45); }
`;

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  const subtotal    = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const isFreeShip  = subtotal > 200;
  const shippingFee = subtotal === 0 ? 0 : isFreeShip ? 0 : 15;
  const total       = subtotal + shippingFee;
  const freeShipPct = Math.min(100, (subtotal / 200) * 100);
  const totalItems  = cartItems.reduce((acc, x) => acc + x.qty, 0);

  const handleQtyChange = (id, cur, max, type) => {
    if (type==='inc' && cur < max) updateCartQty(id, cur+1);
    if (type==='dec' && cur > 1)   updateCartQty(id, cur-1);
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      if (!user) setShowLoginPrompt(true);
      else        setShowCheckoutSuccess(true);
    }
  };

  const confirmCheckout = () => { clearCart(); setShowCheckoutSuccess(false); navigate('/'); };

  /* ── Empty state ── */
  if (cartItems.length === 0) return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0', minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <style>{STYLES}</style>
      <div style={{
        textAlign:'center', padding:'60px 40px', maxWidth:480,
        background:'linear-gradient(145deg,rgba(26,37,64,0.8),rgba(15,24,41,0.9))',
        border:'1px solid rgba(255,255,255,0.06)', borderRadius:20,
        animation:'ps-fade-up 0.6s ease',
      }}>
        <div style={{ width:80, height:80, borderRadius:'50%', background:'rgba(240,165,0,0.08)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 28px' }}>
          <ShoppingCart size={36} color="#f0a500" style={{ opacity:0.6 }}/>
        </div>
        <h2 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.6rem', fontWeight:800, color:'#f1f5f9', marginBottom:12 }}>Your Cart is Empty</h2>
        <p style={{ color:'#475569', marginBottom:36, lineHeight:1.7, fontSize:'0.92rem' }}>
          You haven't added any products yet. Explore our industrial catalog and start building your order.
        </p>
        <Link to="/products" style={{
          display:'inline-flex', alignItems:'center', gap:10, padding:'14px 28px',
          background:'linear-gradient(135deg,#f0a500,#d97706)', color:'#090e1a',
          fontFamily:'var(--ps-font-head)', fontWeight:700, borderRadius:8, textDecoration:'none',
          boxShadow:'0 4px 20px rgba(240,165,0,0.3)', transition:'all 0.2s',
        }}>
          <ArrowLeft size={16}/> Explore Products
        </Link>
      </div>
    </div>
  );

  return (
    <div style={{ fontFamily:'var(--ps-font-body)', background:'#090e1a', color:'#e2e8f0', minHeight:'100vh' }}>
      <style>{STYLES}</style>

      {/* Header */}
      <div style={{ background:'linear-gradient(180deg,#0f1829,#090e1a)', borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'32px 40px' }}>
        <div style={{ maxWidth:1200, margin:'0 auto' }}>
          <h1 style={{ fontFamily:'var(--ps-font-head)', fontSize:'clamp(1.5rem,3vw,2.2rem)', fontWeight:800, color:'#f1f5f9', margin:'0 0 6px' }}>
            Shopping Cart
          </h1>
          <p style={{ color:'#475569', fontSize:'0.88rem' }}>{totalItems} item{totalItems!==1?'s':''} in your cart</p>
        </div>
      </div>

      <div style={{ maxWidth:1200, margin:'0 auto', padding:'36px 40px', display:'grid', gridTemplateColumns:'1fr 360px', gap:28, alignItems:'start' }}>

        {/* Left: Items */}
        <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
          {cartItems.map((item, idx) => (
            <div key={item.product} className="ps-cart-item" style={{ animationDelay:`${idx*0.05}s` }}>
              {/* Thumbnail */}
              <div style={{ width:80, height:80, borderRadius:10, overflow:'hidden', border:'1px solid rgba(255,255,255,0.08)', flexShrink:0 }}>
                <img src={item.image} alt={item.name} style={{ width:'100%', height:'100%', objectFit:'cover' }}/>
              </div>

              {/* Info */}
              <div>
                <Link to={`/product/${item.product}`} style={{ textDecoration:'none' }}>
                  <h4 style={{ fontFamily:'var(--ps-font-head)', fontSize:'0.98rem', fontWeight:700, color:'#f1f5f9', marginBottom:4, transition:'color 0.2s' }}
                  onMouseOver={e=>e.currentTarget.style.color='#f0a500'}
                  onMouseOut={e=>e.currentTarget.style.color='#f1f5f9'}>
                    {item.name}
                  </h4>
                </Link>
                <p style={{ color:'#475569', fontSize:'0.78rem', marginBottom:12 }}>Brand: {item.brand}</p>
                <div style={{ display:'flex', alignItems:'center', gap:16 }}>
                  {/* Qty control */}
                  <div style={{ display:'flex', border:'1px solid rgba(255,255,255,0.08)', borderRadius:8, overflow:'hidden' }}>
                    <button className="ps-qty-btn" onClick={()=>handleQtyChange(item.product,item.qty,item.countInStock,'dec')} disabled={item.qty<=1}><Minus size={12}/></button>
                    <span style={{ padding:'8px 14px', fontFamily:'var(--ps-font-head)', fontWeight:700, fontSize:'0.9rem', color:'#f1f5f9', minWidth:36, textAlign:'center' }}>{item.qty}</span>
                    <button className="ps-qty-btn" onClick={()=>handleQtyChange(item.product,item.qty,item.countInStock,'inc')} disabled={item.qty>=item.countInStock}><Plus size={12}/></button>
                  </div>
                  <span style={{ fontFamily:'var(--ps-font-head)', fontSize:'1rem', fontWeight:700, color:'#f0a500' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                  <span style={{ fontSize:'0.78rem', color:'#334155' }}>${item.price.toFixed(2)} ea.</span>
                </div>
              </div>

              {/* Remove */}
              <button className="ps-remove-btn" onClick={()=>removeFromCart(item.product)}>
                <Trash2 size={16}/>
              </button>
            </div>
          ))}

          <Link to="/products" style={{ display:'inline-flex', alignItems:'center', gap:8, color:'#475569', fontFamily:'var(--ps-font-head)', fontWeight:600, fontSize:'0.85rem', textDecoration:'none', paddingTop:8, transition:'color 0.2s' }}
          onMouseOver={e=>e.currentTarget.style.color='#f0a500'}
          onMouseOut={e=>e.currentTarget.style.color='#475569'}>
            <ArrowLeft size={15}/> Continue Shopping
          </Link>
        </div>

        {/* Right: Summary */}
        <aside style={{
          background:'linear-gradient(145deg,rgba(26,37,64,0.9),rgba(15,24,41,0.95))',
          border:'1px solid rgba(255,255,255,0.07)',
          borderRadius:16, padding:24, position:'sticky', top:90,
        }}>
          <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.05rem', fontWeight:800, color:'#f1f5f9', marginBottom:20, paddingBottom:16, borderBottom:'1px solid rgba(255,255,255,0.06)' }}>
            Order Summary
          </h3>

          {/* Free shipping progress */}
          {!isFreeShip && (
            <div style={{ marginBottom:20 }}>
              <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:8, fontSize:'0.82rem', color:'#64748b' }}>
                <Truck size={14} color="#f0a500"/>
                <span>Add <strong style={{ color:'#f0a500' }}>${(200-subtotal).toFixed(2)}</strong> for FREE shipping</span>
              </div>
              <div style={{ height:4, background:'rgba(255,255,255,0.06)', borderRadius:4, overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${freeShipPct}%`, background:'linear-gradient(90deg,#f0a500,#fbbf24)', borderRadius:4, transition:'width 0.5s ease' }}/>
              </div>
            </div>
          )}
          {isFreeShip && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:16, padding:'8px 12px', borderRadius:8, background:'rgba(16,185,129,0.08)', border:'1px solid rgba(16,185,129,0.15)', fontSize:'0.82rem', color:'#10b981', fontWeight:600 }}>
              <Truck size={14}/> You've unlocked FREE shipping!
            </div>
          )}

          {/* Rows */}
          {[
            ['Subtotal', `$${subtotal.toFixed(2)}`],
            ['Shipping', shippingFee===0 ? 'FREE' : `$${shippingFee.toFixed(2)}`],
          ].map(([label, val]) => (
            <div key={label} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12, fontSize:'0.9rem' }}>
              <span style={{ color:'#64748b' }}>{label}</span>
              <span style={{ fontWeight:600, color: val==='FREE' ? '#10b981' : '#e2e8f0' }}>{val}</span>
            </div>
          ))}

          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'16px 0', borderTop:'1px solid rgba(255,255,255,0.07)', marginTop:8, marginBottom:24 }}>
            <span style={{ fontFamily:'var(--ps-font-head)', fontWeight:700, color:'#f1f5f9' }}>Total</span>
            <span style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.5rem', fontWeight:800, background:'linear-gradient(135deg,#f0a500,#fbbf24)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>
              ${total.toFixed(2)}
            </span>
          </div>

          <button className="ps-checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout <ArrowRight size={18}/>
          </button>
          <p style={{ textAlign:'center', marginTop:12, fontSize:'0.76rem', color:'#334155' }}>
            Secure checkout · SSL encrypted
          </p>
        </aside>
      </div>

      {/* ── Success Modal ── */}
      {showCheckoutSuccess && (
        <div className="ps-modal-overlay" onClick={()=>setShowCheckoutSuccess(false)}>
          <div className="ps-modal-card" onClick={e=>e.stopPropagation()}>
            <div className="ps-modal-icon" style={{ background:'rgba(16,185,129,0.12)' }}>
              <CheckCircle size={30} color="#10b981" strokeWidth={2}/>
            </div>
            <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.3rem', fontWeight:800, color:'#f1f5f9', marginBottom:10 }}>Order Placed!</h3>
            <p style={{ color:'#64748b', marginBottom:32, fontSize:'0.9rem', lineHeight:1.65 }}>
              Your procurement request has been submitted. Our sales team will follow up with you shortly.
            </p>
            <button className="ps-modal-btn-primary" onClick={confirmCheckout} style={{ width:'100%', padding:14 }}>
              Return to Homepage
            </button>
          </div>
        </div>
      )}

      {/* ── Login Modal ── */}
      {showLoginPrompt && (
        <div className="ps-modal-overlay" onClick={()=>setShowLoginPrompt(false)}>
          <div className="ps-modal-card" onClick={e=>e.stopPropagation()}>
            <div className="ps-modal-icon" style={{ background:'rgba(240,165,0,0.1)' }}>
              <ShoppingCart size={28} color="#f0a500"/>
            </div>
            <h3 style={{ fontFamily:'var(--ps-font-head)', fontSize:'1.3rem', fontWeight:800, color:'#f1f5f9', marginBottom:10 }}>Sign In Required</h3>
            <p style={{ color:'#64748b', marginBottom:32, fontSize:'0.9rem', lineHeight:1.65 }}>
              Please log in to continue with your purchase. Your cart items will be saved.
            </p>
            <div className="ps-modal-actions">
              <button className="ps-modal-btn-outline" onClick={()=>setShowLoginPrompt(false)}>Cancel</button>
              <button className="ps-modal-btn-primary" onClick={()=>{ setShowLoginPrompt(false); navigate('/login?redirect=cart'); }}>
                <ArrowRight size={15}/> Login to Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;