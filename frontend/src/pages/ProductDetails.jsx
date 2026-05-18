import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, ShoppingCart, Minus, Plus, Check, Eye } from 'lucide-react';
import { useCart } from '../context/CartContext';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1);
  const [showAddedModal, setShowAddedModal] = useState(false);

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
    if (type === 'inc') {
      if (qty < product.countInStock) {
        setQty(qty + 1);
      }
    } else if (type === 'dec') {
      if (qty > 1) {
        setQty(qty - 1);
      }
    }
  };

  const handleAddToCart = () => {
    if (product && product.countInStock > 0) {
      addToCart(product, qty);
      setShowAddedModal(true);
    }
  };

  if (loading) {
    return (
      <div className="section-padding flex items-center justify-center" style={{ minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Loading product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="section-padding container text-center" style={{ minHeight: '60vh' }}>
        <div className="card" style={{ padding: '40px', maxWidth: '500px', margin: '0 auto' }}>
          <h3 style={{ color: 'var(--error)', marginBottom: '15px' }}>Error</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '25px' }}>{error || 'Could not load product.'}</p>
          <Link to="/products" className="btn btn-primary" style={{ gap: '8px' }}>
            <ArrowLeft size={18} />
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section-padding" style={{ backgroundColor: 'var(--background)', minHeight: 'calc(100vh - 80px)' }}>
      <div className="container">
        {/* Back Link */}
        <Link 
          to="/products" 
          className="flex items-center gap-2" 
          style={{ marginBottom: '30px', fontWeight: '600', color: 'var(--text-muted)' }}
          onMouseOver={(e) => e.currentTarget.style.color = 'var(--accent)'}
          onMouseOut={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
        >
          <ArrowLeft size={16} />
          Back to Catalog
        </Link>

        {/* Product Layout Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '40px' }}>
          
          {/* Left: Product Image */}
          <div>
            <div className="card" style={{ padding: 0, overflow: 'hidden', aspectRatio: '1/1' }}>
              <img 
                src={product.image || 'https://via.placeholder.com/600'} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* Right: Product Meta & Purchase Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {/* Category Tag */}
            <span style={{ 
              alignSelf: 'flex-start',
              padding: '6px 12px', 
              borderRadius: '20px', 
              fontSize: '0.75rem', 
              fontWeight: '700', 
              textTransform: 'uppercase',
              backgroundColor: 'rgba(37, 99, 235, 0.1)', 
              color: 'var(--accent)',
              marginBottom: '15px'
            }}>
              {product.category?.name || 'Category'}
            </span>

            {/* Title & Brand */}
            <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '8px', color: 'var(--primary)' }}>
              {product.name}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '500', marginBottom: '25px' }}>
              Brand: <strong style={{ color: 'var(--text-main)' }}>{product.brand || 'Procurasure'}</strong>
            </p>

            {/* Pricing Section */}
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '15px', marginBottom: '30px' }}>
              <span style={{ fontSize: '2.25rem', fontWeight: '800', color: 'var(--accent)' }}>
                ${product.price?.toFixed(2)}
              </span>
            </div>

            {/* Description */}
            <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', padding: '25px 0', marginBottom: '35px' }}>
              <h4 style={{ marginBottom: '10px', fontSize: '1rem' }}>Product Description</h4>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', fontSize: '0.95rem' }}>
                {product.description}
              </p>
            </div>

            {/* Purchase Details Panel */}
            <div className="card" style={{ padding: '25px', backgroundColor: 'white', border: '1px solid var(--border)' }}>
              
              {/* Stock Indicator */}
              <div className="flex items-center justify-between" style={{ marginBottom: '20px' }}>
                <span style={{ fontWeight: '600' }}>Stock Status:</span>
                {product.countInStock > 0 ? (
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    backgroundColor: 'rgba(16, 185, 129, 0.1)', 
                    color: 'var(--success)' 
                  }}>
                    In Stock ({product.countInStock} units)
                  </span>
                ) : (
                  <span style={{ 
                    padding: '6px 12px', 
                    borderRadius: '12px', 
                    fontSize: '0.8rem', 
                    fontWeight: '700', 
                    backgroundColor: 'rgba(239, 68, 68, 0.1)', 
                    color: 'var(--error)' 
                  }}>
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Quantity Selector and Add button */}
              {product.countInStock > 0 && (
                <>
                  <div className="flex items-center justify-between" style={{ marginBottom: '25px' }}>
                    <span style={{ fontWeight: '600' }}>Quantity:</span>
                    
                    {/* Quantity Custom +/- Control */}
                    <div className="flex items-center" style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
                      <button 
                        onClick={() => handleQtyChange('dec')}
                        disabled={qty <= 1}
                        style={{ 
                          padding: '10px 15px', 
                          backgroundColor: 'var(--background)', 
                          color: qty <= 1 ? 'var(--text-muted)' : 'var(--text-main)',
                          opacity: qty <= 1 ? 0.5 : 1
                        }}
                      >
                        <Minus size={14} />
                      </button>
                      <span style={{ padding: '10px 20px', fontWeight: '700', minWidth: '50px', textAlign: 'center', backgroundColor: 'white' }}>
                        {qty}
                      </span>
                      <button 
                        onClick={() => handleQtyChange('inc')}
                        disabled={qty >= product.countInStock}
                        style={{ 
                          padding: '10px 15px', 
                          backgroundColor: 'var(--background)', 
                          color: qty >= product.countInStock ? 'var(--text-muted)' : 'var(--text-main)',
                          opacity: qty >= product.countInStock ? 0.5 : 1
                        }}
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                  </div>

                  <button 
                    onClick={handleAddToCart}
                    className="btn btn-primary" 
                    style={{ width: '100%', padding: '14px', gap: '10px', fontSize: '1rem' }}
                  >
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Product Added Success Modal overlay */}
      {showAddedModal && (
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
              <Check size={30} strokeWidth={3} />
            </div>
            
            <h3 style={{ fontSize: '1.25rem', marginBottom: '10px' }}>Added to Cart!</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '30px', fontSize: '0.9rem' }}>
              Successfully added {qty} x "{product.name}" to your shopping cart.
            </p>

            <div className="flex gap-3 justify-center">
              <button 
                type="button" 
                onClick={() => setShowAddedModal(false)} 
                className="btn btn-outline"
                style={{ flex: 1 }}
              >
                Continue Shopping
              </button>
              <button 
                type="button" 
                onClick={() => navigate('/cart')} 
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                View Cart
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
