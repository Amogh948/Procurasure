import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Building2 } from 'lucide-react';

const Register = () => {
  const [role, setRole] = useState('user');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    taxId: '',
    address: '',
    website: ''
  });
  const [error, setError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = new URLSearchParams(location.search).get('redirect') || '';

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
        companyDetails: role === 'superadmin' ? {
          companyName: formData.companyName,
          taxId: formData.taxId,
          address: formData.address,
          website: formData.website
        } : undefined
      };
      await register(userData);
      if (redirect) {
        const targetRedirect = redirect.startsWith('/') ? redirect : `/${redirect}`;
        navigate(targetRedirect);
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="section-padding flex items-center justify-center" style={{ minHeight: 'calc(100vh - 80px)' }}>
      <div className="card" style={{ maxWidth: '500px', width: '100%', padding: '40px' }}>
        <div className="text-center" style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '10px' }}>Create Account</h1>
          <p style={{ color: 'var(--text-muted)' }}>Join the Procurasure business network</p>
        </div>

        {/* Role Selection */}
        <div className="flex gap-2" style={{ marginBottom: '30px', backgroundColor: 'var(--background)', padding: '5px', borderRadius: 'var(--radius)' }}>
          <button 
            className="flex-1 btn" 
            style={{ 
              backgroundColor: role === 'user' ? 'white' : 'transparent',
              color: role === 'user' ? 'var(--accent)' : 'var(--text-muted)',
              boxShadow: role === 'user' ? 'var(--shadow)' : 'none',
              gap: '8px'
            }}
            onClick={() => setRole('user')}
          >
            <UserPlus size={18} />
            Regular User
          </button>
          <button 
            className="flex-1 btn" 
            style={{ 
              backgroundColor: role === 'superadmin' ? 'white' : 'transparent',
              color: role === 'superadmin' ? 'var(--accent)' : 'var(--text-muted)',
              boxShadow: role === 'superadmin' ? 'var(--shadow)' : 'none',
              gap: '8px'
            }}
            onClick={() => setRole('superadmin')}
          >
            <Building2 size={18} />
            Superadmin
          </button>
        </div>

        {error && <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--error)', padding: '10px', borderRadius: 'var(--radius)', marginBottom: '20px', fontSize: '0.875rem', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input type="text" name="name" className="form-input" placeholder="John Doe" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input type="email" name="email" className="form-input" placeholder="john@company.com" required onChange={handleChange} />
          </div>
          
          {role === 'superadmin' && (
            <div style={{ border: '1px solid var(--border)', padding: '20px', borderRadius: 'var(--radius)', marginBottom: '20px', backgroundColor: 'var(--background)' }}>
              <h4 style={{ marginBottom: '15px' }}>Company Details</h4>
              <div className="form-group">
                <label className="form-label">Company Name</label>
                <input type="text" name="companyName" className="form-input" placeholder="Procurasure Ltd" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Tax ID / Business Reg</label>
                <input type="text" name="taxId" className="form-input" placeholder="123-456-789" required onChange={handleChange} />
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" name="password" className="form-input" placeholder="••••••••" required onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm</label>
              <input type="password" name="confirmPassword" className="form-input" placeholder="••••••••" required onChange={handleChange} />
            </div>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '12px', marginTop: '10px' }}>
            Register as {role === 'superadmin' ? 'Superadmin' : 'User'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '30px' }}>
          Already have an account? <Link to={redirect ? `/login?redirect=${redirect}` : '/login'} style={{ color: 'var(--accent)', fontWeight: '600' }}>Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
