import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem('userInfo'));
    if (userInfo) {
      setUser(userInfo);
      axios.defaults.headers.common['Authorization'] = `Bearer ${userInfo.token}`;
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('/api/users/login', { email, password });
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const loginWithToken = async (token) => {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    const { data } = await axios.get('/api/users/profile');
    const fullUserInfo = { ...data, token };
    setUser(fullUserInfo);
    localStorage.setItem('userInfo', JSON.stringify(fullUserInfo));
    return fullUserInfo;
  };

  const register = async (userData) => {
    const { data } = await axios.post('/api/users', userData);
    setUser(data);
    localStorage.setItem('userInfo', JSON.stringify(data));
    axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithToken, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
