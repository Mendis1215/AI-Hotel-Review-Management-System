import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const StaffLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const userData = await login(email, password);
      if (userData.role === 'admin') {
        navigate('/admin');
      } else {
        logout();
        setError('Unauthorized access. Admin privileges required.');
      }
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-160px)] px-4">
      <div className="w-full max-w-md luxury-card">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-accent/10 p-4 rounded-full mb-4">
            <ShieldCheck className="h-10 w-10 text-accent" />
          </div>
          <h2 className="text-2xl font-serif font-semibold text-text-main">Staff Portal</h2>
          <p className="text-text-muted mt-2 text-sm text-center">Authorized hotel personnel only.</p>
        </div>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-md mb-4 text-sm text-center">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Username / Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="L&I@gmail.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text-main mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent"
              placeholder="Enter staff password"
              required
            />
          </div>

          <button type="submit" className="w-full btn-gold mt-6">
            Access Portal
          </button>
        </form>
      </div>
    </div>
  );
};

export default StaffLogin;
