import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, User, Menu, Search, X, LogOut } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  const { cartItems } = useCart();
  const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    navigate('/login');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
  };

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/products?search=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate('/products', { replace: true });
    }
  };

  // Sync search input value with URL parameter on navigation (e.g. category filter changes)
  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchKeyword = searchParams.get('search') || '';
    setSearchQuery(searchKeyword);
  }, [location.search]);

  return (
    <header style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="header-container">
        {/* Logo */}
        <Link to="/" style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--primary)', letterSpacing: '-0.5px' }} onClick={() => setMobileMenuOpen(false)}>
          PROCURASURE
        </Link>

        {/* Right side actions and links */}
        <div className="flex items-center" style={{ gap: '32px' }}>
          {/* Navigation Links */}
          <nav className="nav-links flex items-center" style={{ gap: '28px' }}>
            <Link to="/" style={{ fontWeight: '500' }}>Home</Link>
            <Link to="/products" style={{ fontWeight: '500' }}>Products</Link>
            <Link to="/about" style={{ fontWeight: '500' }}>About</Link>
            <Link to="/contact" style={{ fontWeight: '500' }}>Contact</Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearchSubmit} className="desktop-only" style={{ position: 'relative' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                padding: '8px 16px 8px 36px',
                borderRadius: '20px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                fontSize: '0.85rem',
                width: '160px',
                transition: 'all 0.3s ease'
              }}
              onFocus={(e) => e.target.style.width = '220px'}
              onBlur={(e) => e.target.style.width = '160px'}
            />
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </form>

          {/* Cart Icon */}
          <Link to="/cart" className="flex items-center gap-2" style={{ fontWeight: '500' }} onClick={() => setMobileMenuOpen(false)}>
            <ShoppingCart size={20} />
            <span style={{ backgroundColor: 'var(--accent)', color: 'white', borderRadius: '50%', width: '20px', height: '20px', display: 'flex', alignItems: 'center', justifySelf: 'center', fontSize: '0.75rem', justifyContent: 'center' }}>
              {cartCount}
            </span>
          </Link>

          {/* Auth Button */}
          {user ? (
            <div className="desktop-only" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
              <div 
                id="user-menu-btn"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '10px', 
                  cursor: 'pointer',
                  padding: '6px 12px',
                  borderRadius: '20px',
                  backgroundColor: 'var(--background)',
                  border: '1px solid var(--border)',
                  userSelect: 'none',
                  transition: 'all 0.2s ease-in-out'
                }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border)'}
              >
                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text)' }}>
                  Welcome, {user.name.split(' ')[0]}!
                </span>
                <span style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center' }}>
                  👤
                </span>
              </div>
              {/* Dropdown Menu */}
              {dropdownOpen && (
                <div 
                  id="user-dropdown-menu"
                  style={{
                    position: 'absolute',
                    top: '45px',
                    right: '0px',
                    backgroundColor: 'var(--surface)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow)',
                    padding: '5px',
                    zIndex: 1001,
                    minWidth: '130px'
                  }}
                >
                  <button 
                    id="logout-btn"
                    onClick={() => { handleLogout(); setDropdownOpen(false); }} 
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      width: '100%',
                      padding: '8px 12px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: 'var(--error)',
                      cursor: 'pointer',
                      fontWeight: '600',
                      borderRadius: 'var(--radius)',
                      textAlign: 'left',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.1)'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="btn btn-primary desktop-only" style={{ gap: '8px' }}>
              <User size={18} />
              Login
            </Link>
          )}

          <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu overlay */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--surface)',
          borderBottom: '1px solid var(--border)',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '15px',
          position: 'absolute',
          top: '80px',
          left: 0,
          right: 0,
          zIndex: 999,
          boxShadow: 'var(--shadow)'
        }}>
          {/* Mobile Search input */}
          <form onSubmit={handleSearchSubmit} style={{ position: 'relative', width: '100%', marginBottom: '10px' }}>
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={handleSearchChange}
              style={{
                padding: '10px 16px 10px 40px',
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                fontSize: '0.9rem',
                width: '100%'
              }}
            />
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          </form>

          <Link to="/" style={{ fontWeight: '500', padding: '10px 0', borderBottom: '1px solid var(--border)' }} onClick={() => setMobileMenuOpen(false)}>Home</Link>
          <Link to="/products" style={{ fontWeight: '500', padding: '10px 0', borderBottom: '1px solid var(--border)' }} onClick={() => setMobileMenuOpen(false)}>Products</Link>
          <Link to="/about" style={{ fontWeight: '500', padding: '10px 0', borderBottom: '1px solid var(--border)' }} onClick={() => setMobileMenuOpen(false)}>About</Link>
          <Link to="/contact" style={{ fontWeight: '500', padding: '10px 0', borderBottom: '1px solid var(--border)' }} onClick={() => setMobileMenuOpen(false)}>Contact</Link>

          {user ? (
            <button
              onClick={handleLogout}
              className="btn btn-outline"
              style={{ gap: '8px', marginTop: '10px', width: '100%', justifyContent: 'center' }}
            >
              <LogOut size={18} />
              Logout ({user.name})
            </button>
          ) : (
            <Link to="/login" className="btn btn-primary" style={{ gap: '8px', marginTop: '10px' }} onClick={() => setMobileMenuOpen(false)}>
              <User size={18} />
              Login
            </Link>
          )}
        </div>
      )}
    </header>
  );
};

export default Header;
