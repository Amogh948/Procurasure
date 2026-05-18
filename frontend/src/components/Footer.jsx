import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import axios from 'axios';

const Footer = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(data.slice(0, 5)); // Show up to 5 categories
      } catch (err) {
        console.error('Error fetching footer categories', err);
      }
    };
    fetchCategories();
  }, []);

  return (
    <footer style={{ backgroundColor: 'var(--primary)', color: 'white', padding: '60px 0 20px' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '40px', marginBottom: '40px' }}>
          {/* Brand Info */}
          <div>
            <h3 style={{ marginBottom: '20px', fontSize: '1.5rem' }}>PROCURASURE</h3>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: '20px' }}>
              Your trusted partner in industrial procurement. Providing high-quality products and categories for your business needs.
            </p>
            <div className="flex gap-4">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ cursor: 'pointer' }}><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ marginBottom: '20px' }}>Quick Links</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <li><Link to="/" style={{ color: '#94a3b8' }}>Home</Link></li>
              <li><Link to="/products" style={{ color: '#94a3b8' }}>Products</Link></li>
              <li><Link to="/about" style={{ color: '#94a3b8' }}>About Us</Link></li>
              <li><Link to="/contact" style={{ color: '#94a3b8' }}>Contact Us</Link></li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 style={{ marginBottom: '20px' }}>Categories</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {categories.map(cat => (
                <li key={cat._id}>
                  <Link to={`/products?category=${cat._id}`} style={{ color: '#94a3b8' }}>
                    {cat.name}
                  </Link>
                </li>
              ))}
              {categories.length === 0 && (
                <li><Link to="/products" style={{ color: '#94a3b8' }}>All Products</Link></li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 style={{ marginBottom: '20px' }}>Contact Us</h4>
            <ul style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <li className="flex gap-2 items-center" style={{ color: '#94a3b8' }}>
                <MapPin size={18} />
                <span>123 Industrial Way, Business District</span>
              </li>
              <li className="flex gap-2 items-center" style={{ color: '#94a3b8' }}>
                <Phone size={18} />
                <span>+1 (555) 000-1234</span>
              </li>
              <li className="flex gap-2 items-center" style={{ color: '#94a3b8' }}>
                <Mail size={18} />
                <span>sales.procurasure@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '20px', textAlign: 'center', fontSize: '0.875rem', color: '#64748b' }}>
          <p>&copy; {new Date().getFullYear()} Procurasure. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
