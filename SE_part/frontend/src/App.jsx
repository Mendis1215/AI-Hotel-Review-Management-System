import React, { useContext } from 'react';
import { BrowserRouter as Router, Navigate, Route, Routes } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

import Home from './pages/public/Home';
import About from './pages/public/About';
import Rooms from './pages/public/Rooms';
import Reviews from './pages/public/Reviews';
import Contact from './pages/public/Contact';
import StaffLogin from './pages/public/StaffLogin';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import CustomerDashboard from './pages/customer/CustomerDashboard';
import Booking from './pages/customer/Booking';
import SubmitReview from './pages/customer/SubmitReview';
import AdminDashboard from './pages/admin/AdminDashboard';
import AIAnalyticsDashboard from './pages/admin/AIAnalyticsDashboard';
import AdminReviewManagement from './pages/admin/AdminReviewManagement';
import AdminBookingManagement from './pages/admin/AdminBookingManagement';
import AdminCustomerManagement from './pages/admin/AdminCustomerManagement';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'admin') return <Navigate to="/" replace />;

  return children;
};

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow bg-secondary">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/rooms" element={<Rooms />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/staff/login" element={<StaffLogin />} />

            <Route path="/dashboard" element={<ProtectedRoute><CustomerDashboard /></ProtectedRoute>} />
            <Route path="/review" element={<ProtectedRoute><SubmitReview /></ProtectedRoute>} />

            {/* Admin Routes */}
            <Route 
              path="/admin" 
              element={<ProtectedRoute adminOnly={true}><AdminDashboard /></ProtectedRoute>} 
            />
            <Route 
              path="/admin/analytics" 
              element={<ProtectedRoute adminOnly={true}><AIAnalyticsDashboard /></ProtectedRoute>} 
            />
            <Route path="/admin/reviews" element={<ProtectedRoute adminOnly><AdminReviewManagement /></ProtectedRoute>} />
            <Route path="/admin/bookings" element={<ProtectedRoute adminOnly><AdminBookingManagement /></ProtectedRoute>} />
            <Route path="/admin/customers" element={<ProtectedRoute adminOnly><AdminCustomerManagement /></ProtectedRoute>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
