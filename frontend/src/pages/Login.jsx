import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, ShieldCheck, Users, Globe2 } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      if (redirect) {
        const targetRedirect = redirect.startsWith('/') ? redirect : `/${redirect}`;
        navigate(targetRedirect);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <div className="split-auth-container">
      {/* Left Column: Industrial Procurement Hero Image Banner */}
      <div 
        className="auth-hero-panel" 
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80')" 
        }}
      >
        <div className="auth-hero-overlay" />
        <div className="auth-hero-content">
          <span style={{
            backgroundColor: 'rgba(255, 255, 255, 0.15)',
            backdropFilter: 'blur(4px)',
            color: 'white',
            padding: '6px 16px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            display: 'inline-block',
            marginBottom: '20px'
          }}>
            Industry Leader
          </span>
          <h2 style={{ fontSize: '2.75rem', fontWeight: '800', lineHeight: '1.2', color: 'white', marginBottom: '20px' }}>
            Providing The Best Industrial Products Globally
          </h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', color: 'rgba(255, 255, 255, 0.9)', marginBottom: '40px' }}>
            Join a massive community of over 50,000+ active businesses who trust Procurasure for their daily operations, bulk sourcing, and precision industrial procurement.
          </p>

          {/* Checklist Key Features */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Users size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>50k+ Satisfied Business Customers</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)' }}>Global operations serving small to enterprise level companies.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>100% Certified Suppliers</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)' }}>Every category and supplier is strictly vetted for maximum precision.</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', padding: '8px', borderRadius: '50%', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe2 size={20} />
              </div>
              <div>
                <h4 style={{ fontWeight: '700', color: 'white', fontSize: '0.95rem' }}>Worldwide Sourcing & Logistics</h4>
                <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.75)' }}>Seamless supply chain integration and fast express shipping.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Form Panel Card centered */}
      <div className="auth-form-panel">
        <div className="card" style={{ maxWidth: '420px', width: '100%', padding: '40px', boxShadow: 'var(--shadow)' }}>
          <div className="text-center" style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '1.75rem', marginBottom: '10px', fontWeight: '800', color: 'var(--primary)' }}>Welcome Back</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Login to your Procurasure account</p>
          </div>

          {error && (
            <div style={{ 
              backgroundColor: 'rgba(239, 68, 68, 0.1)', 
              color: 'var(--error)', 
              padding: '12px', 
              borderRadius: 'var(--radius)', 
              marginBottom: '20px', 
              fontSize: '0.875rem', 
              textAlign: 'center',
              fontWeight: '600'
            }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                placeholder="company@email.com" 
                required 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label className="form-label">Password</label>
              <input 
                type="password" 
                className="form-input" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '14px', marginBottom: '20px', fontSize: '1rem', gap: '8px' }}>
              <LogIn size={18} />
              Login to Account
            </button>
          </form>

          <div style={{ position: 'relative', textAlign: 'center', marginBottom: '20px' }}>
            <hr style={{ border: 'none', borderTop: '1px solid var(--border)' }} />
            <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'var(--surface)', padding: '0 10px', fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Or continue with</span>
          </div>

          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="btn btn-outline" 
            style={{ width: '100%', padding: '12px', display: 'flex', gap: '10px', justifyContent: 'center', alignItems: 'center', marginBottom: '30px' }}
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" style={{ width: '20px' }} />
            Sign in with Google
          </button>

          <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
            Don't have an account yet? <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} style={{ color: 'var(--accent)', fontWeight: '700' }}>Register here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
