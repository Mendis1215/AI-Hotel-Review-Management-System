import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LockKeyhole, Mail, Phone, UserRound } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password, phone);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    }
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] bg-white grid grid-cols-1 lg:grid-cols-2">
      <div className="hidden lg:block relative">
        <img
          src="https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1400&q=80"
          alt="Elegant hotel suite"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
      <div className="flex items-center justify-center px-4 sm:px-8 py-16">
        <div className="w-full max-w-md">
          <p className="text-accent-dark font-medium">Create account</p>
          <h1 className="mt-3 text-4xl font-serif text-text-main">Start Your Stay</h1>
          <p className="mt-3 text-text-muted">Register to book rooms and submit reviews after your visit.</p>

          {error && <div className="mt-6 bg-red-50 text-red-600 p-3 rounded-md text-sm">{error}</div>}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Full Name</label>
              <div className="relative">
                <UserRound className="absolute left-3 top-3.5 text-text-muted" size={18} />
                <input value={name} onChange={(e) => setName(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 text-text-muted" size={18} />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Phone</label>
              <div className="relative">
                <Phone className="absolute left-3 top-3.5 text-text-muted" size={10} />
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+94 " className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-text-main mb-1">Password</label>
              <div className="relative">
                <LockKeyhole className="absolute left-3 top-3.5 text-text-muted" size={18} />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" required />
              </div>
            </div>
            <button type="submit" className="w-full btn-gold py-3">Register</button>
          </form>

          <p className="mt-8 text-sm text-text-muted">
            Already have an account? <Link to="/login" className="text-accent-dark font-medium hover:underline">Log in here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
