import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginSuccess = () => {
  const { loginWithToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  useEffect(() => {
    const handleSuccess = async () => {
      try {
        const token = new URLSearchParams(location.search).get('token');
        if (token) {
          await loginWithToken(token);
          navigate('/');
        } else {
          setError('No token provided');
        }
      } catch (err) {
        console.error('Error in login success', err);
        setError('Failed to authenticate');
      }
    };
    handleSuccess();
  }, [location, loginWithToken, navigate]);

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', flexDirection: 'column', gap: '20px' }}>
      {error ? (
        <div style={{ color: 'var(--error)', fontWeight: '700' }}>{error}</div>
      ) : (
        <>
          <p style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '1.1rem' }}>Authenticating your session...</p>
        </>
      )}
    </div>
  );
};

export default LoginSuccess;
