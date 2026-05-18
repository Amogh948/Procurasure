import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Shield, Zap, Globe } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        
        // Retrieve dynamic cart popularity
        const localPopularity = localStorage.getItem('cartPopularity');
        const popularity = localPopularity ? JSON.parse(localPopularity) : {};

        // Sort by popularity score descending
        const sorted = data.sort((a, b) => {
          const scoreA = popularity[a._id] || 0;
          const scoreB = popularity[b._id] || 0;
          return scoreB - scoreA;
        });

        // Limit to top 3 featured products
        setFeaturedProducts(sorted.slice(0, 3));
      } catch (error) {
        console.error('Error fetching popular products', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularProducts();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section style={{ 
        backgroundColor: 'var(--primary)', 
        color: 'white', 
        padding: '100px 0',
        backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.8)), url("https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=2000")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}>
        <div className="container" style={{ textAlign: 'center' }}>
          <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', maxWidth: '800px', margin: '0 auto 20px' }}>
            Precision Procurement for Modern Industries
          </h1>
          <p style={{ fontSize: '1.25rem', color: '#94a3b8', marginBottom: '40px', maxWidth: '600px', margin: '0 auto 40px' }}>
            Procurasure connects you with high-quality industrial products and verified suppliers globally.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/products" className="btn btn-primary" style={{ backgroundColor: 'var(--accent)', padding: '15px 30px' }}>
              Browse Catalog
              <ArrowRight size={20} style={{ marginLeft: '10px' }} />
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ color: 'white', borderColor: 'white', padding: '15px 30px' }}>
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="section-padding">
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '30px' }}>
            <div className="text-center">
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Shield size={30} />
              </div>
              <h3 style={{ marginBottom: '10px' }}>Verified Suppliers</h3>
              <p style={{ color: 'var(--text-muted)' }}>Every supplier on our platform undergoes a rigorous 10-point verification process.</p>
            </div>
            <div className="text-center">
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Zap size={30} />
              </div>
              <h3 style={{ marginBottom: '10px' }}>Fast Procurement</h3>
              <p style={{ color: 'var(--text-muted)' }}>Streamlined workflow to get your orders from warehouse to your doorstep in record time.</p>
            </div>
            <div className="text-center">
              <div style={{ backgroundColor: 'rgba(37, 99, 235, 0.1)', color: 'var(--accent)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <Globe size={30} />
              </div>
              <h3 style={{ marginBottom: '10px' }}>Global Reach</h3>
              <p style={{ color: 'var(--text-muted)' }}>Access markets and products from across the globe with transparent shipping and logistics.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="section-padding" style={{ backgroundColor: 'white' }}>
        <div className="container">
          <div className="flex items-center justify-between" style={{ marginBottom: '40px' }}>
            <div>
              <h2 style={{ fontSize: '2rem' }}>Featured Products</h2>
              <p style={{ color: 'var(--text-muted)' }}>Our top-selling industrial essentials</p>
            </div>
            <Link to="/products" className="flex items-center gap-2" style={{ fontWeight: '600', color: 'var(--accent)' }}>
              View All <ArrowRight size={18} />
            </Link>
          </div>
          {loading ? (
            <div className="text-center" style={{ padding: '40px 0', width: '100%', color: 'var(--text-muted)' }}>
              <p>Loading featured products...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="text-center" style={{ padding: '40px 0', width: '100%', color: 'var(--text-muted)' }}>
              <p>No products available yet.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '30px', width: '100%' }}>
              {featuredProducts.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
