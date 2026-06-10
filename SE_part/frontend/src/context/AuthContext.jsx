import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      const userInfo = localStorage.getItem('userInfo');
      if (userInfo) {
        setUser(JSON.parse(userInfo));
        // Configure axios defaults
        axios.defaults.headers.common['Authorization'] = `Bearer ${JSON.parse(userInfo).token}`;
      }
      setLoading(false);
    };
    checkUser();
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Login failed';
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, phone });
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      return data;
    } catch (error) {
      throw error.response?.data?.message || 'Registration failed';
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
