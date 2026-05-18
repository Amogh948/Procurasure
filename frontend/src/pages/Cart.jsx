import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Trash2, ShoppingCart, Minus, Plus, ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, updateCartQty, removeFromCart, clearCart } = useCart();
  const { user } = useAuth();
  const [showCheckoutSuccess, setShowCheckoutSuccess] = useState(false);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

  // Math calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const isFreeShipping = subtotal > 200;
  const shippingFee = subtotal === 0 ? 0 : isFreeShipping ? 0 : 15.00;
  const total = subtotal + shippingFee;

  const handleQtyChange = (id, currentQty, maxStock, type) => {
    if (type === 'inc') {
      if (currentQty < maxStock) {
        updateCartQty(id, currentQty + 1);
      }
    } else if (type === 'dec') {
      if (currentQty > 1) {
        updateCartQty(id, currentQty - 1);
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length > 0) {
      if (!user) {
        setShowLoginPrompt(true);
      } else {
        setShowCheckoutSuccess(true);
      }
    }
  };

  const confirmCheckout = () => {
    clearCart();
    setShowCheckoutSuccess(false);
    navigate('/');
  };

  // EMPTY STATE VIEW
  if (cartItems.length === 0) {
    return (
      <div className="section-padding" style={{ minHeight: 'calc(100vh - 80px)', backgroundColor: 'var(--background)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="card text-center" style={{ maxWidth: '500px', width: '100%', padding: '50px 30px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            backgroundColor: 'rgba(37, 99, 235, 0.1)',
            color: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 25px auto'
          }}>
            <ShoppingCart size={36} />
          </div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '10px', color: 'var(--primary)' }}>Your Cart is Empty</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '35px', fontSize: '0.95rem' }}>
            Looks like you haven't added any products to your cart yet. Visit our product catalog to select business supplies.
          </p>
          <Link to="/products" className="btn btn-primary" style={{ padding: '12px 25px', gap: '8px', width: '100%' }}>
            <ArrowLeft size={16} />
            Explore Products Catalog
          </Link>
        </div>
      </div>
    );
  }

  // CART VIEW
  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--background)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        
        {/* Page Title */}
        <div style={{ marginBottom: '40px' }}>
          <h1 style={{ fontSize: '2rem', marginBottom: '10px' }}>Your Shopping Cart</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review and manage the items you've added for quotation/order</p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid-cart-layout">
          
          {/* Left Column: Cart Items list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cartItems.map((item) => (
              <div key={item.product} className="card cart-item-card">
                
                {/* Product Image */}
                <div style={{ width: '80px', height: '80px', borderRadius: 'var(--radius)', overflow: 'hidden', border: '1px solid var(--border)' }}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>

                {/* Product Info */}
                <div>
                  <Link to={`/product/${item.product}`}>
                    <h4 style={{ fontSize: '1.05rem', color: 'var(--primary)', marginBottom: '4px' }}>{item.name}</h4>
                  </Link>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '10px' }}>Brand: {item.brand}</p>
                  
                  {/* Inline Price */}
                  <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--accent)' }}>
                    ${item.price.toFixed(2)}
                  </span>
                </div>

                {/* Quantity adjustments & Remove action */}
                <div className="cart-item-actions">
                  
                  {/* +/- Quantity picker widget */}
                  <div className="flex items-center" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                    <button 
                      onClick={() => handleQtyChange(item.product, item.qty, item.countInStock, 'dec')}
                      disabled={item.qty <= 1}
                      style={{ 
                        padding: '6px 10px', 
                        backgroundColor: 'var(--background)', 
                        color: item.qty <= 1 ? 'var(--text-muted)' : 'var(--text-main)',
                        opacity: item.qty <= 1 ? 0.5 : 1
                      }}
                    >
                      <Minus size={12} />
                    </button>
                    <span style={{ padding: '6px 12px', fontWeight: '700', minWidth: '35px', textAlign: 'center', fontSize: '0.875rem' }}>
                      {item.qty}
                    </span>
                    <button 
                      onClick={() => handleQtyChange(item.product, item.qty, item.countInStock, 'inc')}
                      disabled={item.qty >= item.countInStock}
                      style={{ 
                        padding: '6px 10px', 
                        backgroundColor: 'var(--background)', 
                        color: item.qty >= item.countInStock ? 'var(--text-muted)' : 'var(--text-main)',
                        opacity: item.qty >= item.countInStock ? 0.5 : 1
                      }}
                    >
                      <Plus size={12} />
                    </button>
                  </div>

                  {/* Line Total */}
                  <span style={{ fontSize: '1.05rem', fontWeight: '700', minWidth: '80px', textAlign: 'right' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>

                  {/* Remove Button */}
                  <button 
                    onClick={() => removeFromCart(item.product)}
                    style={{ color: 'var(--text-muted)', backgroundColor: 'transparent', padding: '5px' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--error)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}

            {/* Back to Products link */}
            <Link to="/products" className="flex items-center gap-2" style={{ color: 'var(--text-muted)', fontWeight: '600', width: 'fit-content' }}>
              <ArrowLeft size={16} /> Continue Shopping
            </Link>
          </div>

          {/* Right Column: Summary Card */}
          <aside className="card" style={{ padding: '25px', position: 'sticky', top: '100px' }}>
            <h3 style={{ fontSize: '1.25rem', borderBottom: '1px solid var(--border)', paddingBottom: '15px', marginBottom: '20px' }}>
              Order Summary
            </h3>

            {/* Subtotal row */}
            <div className="flex justify-between items-center" style={{ marginBottom: '15px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Subtotal ({cartItems.reduce((acc, x) => acc + x.qty, 0)} items)</span>
              <span style={{ fontWeight: '600' }}>${subtotal.toFixed(2)}</span>
            </div>

            {/* Shipping row */}
            <div className="flex justify-between items-center" style={{ marginBottom: '20px', fontSize: '0.95rem' }}>
              <span style={{ color: 'var(--text-muted)' }}>Shipping Est.</span>
              <span style={{ fontWeight: '600' }}>
                {shippingFee === 0 ? (
                  <span style={{ color: 'var(--success)', fontWeight: '700' }}>FREE</span>
                ) : (
                  `$${shippingFee.toFixed(2)}`
                )}
              </span>
            </div>

            {/* Free shipping banner promotion */}
            {!isFreeShipping && (
              <div style={{ 
                backgroundColor: 'rgba(37, 99, 235, 0.05)', 
                color: 'var(--accent)', 
                padding: '10px 15px', 
                borderRadius: 'var(--radius)', 
                fontSize: '0.8rem', 
                fontWeight: '500', 
                marginBottom: '20px',
                lineHeight: '1.4'
              }}>
                Add <strong>${(200 - subtotal).toFixed(2)}</strong> more to unlock <strong>FREE SHIPPING</strong>!
              </div>
            )}

            {/* Total Row */}
            <div className="flex justify-between items-center" style={{ borderTop: '1px solid var(--border)', paddingTop: '20px', marginBottom: '30px' }}>
              <span style={{ fontWeight: '700', fontSize: '1.1rem' }}>Total Cost</span>
              <span style={{ fontWeight: '800', fontSize: '1.4rem', color: 'var(--accent)' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            {/* Checkout Action Button */}
            <button 
              onClick={handleCheckout}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '14px', gap: '8px', fontSize: '1rem' }}
            >
              Proceed to Checkout
              <ArrowRight size={18} />
            </button>
          </aside>
        </div>
      </div>

      {/* Checkout Success Modal Overlay */}
      {showCheckoutSuccess && (
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
            maxWidth: '450px',
            textAlign: 'center',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              color: 'var(--success)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <CheckCircle size={30} strokeWidth={2.5} />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Checkout Successful!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
              Your order quotation request has been placed. Our sales team will get back to you shortly.
            </p>

            <button 
              type="button" 
              onClick={confirmCheckout} 
              className="btn btn-primary"
              style={{ width: '100%', padding: '12px' }}
            >
              Return to Homepage
            </button>
          </div>
        </div>
      )}

      {/* Login Prompt Modal Overlay */}
      {showLoginPrompt && (
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
            maxWidth: '450px',
            textAlign: 'center',
            padding: '40px',
            boxShadow: 'var(--shadow-lg)'
          }}>
            <div style={{ 
              width: '60px', 
              height: '60px', 
              borderRadius: '50%', 
              backgroundColor: 'rgba(37, 99, 235, 0.1)', 
              color: 'var(--accent)', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              margin: '0 auto 20px auto'
            }}>
              <ShoppingCart size={30} />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Authentication Required</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
              Please login to continue with your purchase. Your shopping cart items will be securely saved.
            </p>

            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                onClick={() => setShowLoginPrompt(false)} 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button 
                type="button" 
                onClick={() => {
                  setShowLoginPrompt(false);
                  navigate('/login?redirect=cart');
                }} 
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Login to Continue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
