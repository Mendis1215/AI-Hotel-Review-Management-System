import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { Hotel, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src="/src/assets/logo.png" alt="Y&I Villa Logo" className="h-12 w-auto object-contain" />
              <span className="font-serif text-2xl font-bold tracking-wider text-text-main hidden sm:block">
                Y&I VILLA
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-8">
            <Link to="/" className="text-text-main hover:text-accent transition">Home</Link>
            <Link to="/rooms" className="text-text-main hover:text-accent transition">Rooms</Link>
            
            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.role === 'admin' ? "/admin" : "/dashboard"} 
                  className="flex items-center gap-2 text-text-muted hover:text-accent"
                >
                  <User size={18} />
                  <span>{user.name}</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center gap-2 text-red-500 hover:text-red-700 transition"
                >
                  <LogOut size={18} />
                </button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Link to="/login" className="text-text-main hover:text-accent transition pt-2">Log In</Link>
                <Link to="/register" className="btn-gold">Book Now</Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
