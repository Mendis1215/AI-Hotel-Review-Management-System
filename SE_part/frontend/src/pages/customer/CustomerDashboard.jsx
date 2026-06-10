import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { BarChart3, CalendarCheck, LogOut, MessageSquare, Plus, Star, UserRound } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const formatDate = (date) => new Date(date).toLocaleDateString('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const CustomerDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [profile, setProfile] = useState(user);
  const [bookings, setBookings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [profileRes, bookingsRes, reviewsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/auth/profile'),
          axios.get('http://localhost:5000/api/bookings/my'),
          axios.get('http://localhost:5000/api/reviews/my'),
        ]);
        setProfile(profileRes.data);
        setBookings(bookingsRes.data);
        setReviews(reviewsRes.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const upcomingCount = useMemo(() => bookings.filter((booking) => new Date(booking.checkIn) >= new Date()).length, [bookings]);

  const stats = [
    { label: 'Total Bookings', value: bookings.length, icon: CalendarCheck },
    { label: 'Upcoming Stays', value: upcomingCount, icon: BarChart3 },
    { label: 'Reviews Sent', value: reviews.length, icon: MessageSquare },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="bg-secondary min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8">
        <aside className="bg-white border border-gray-100 rounded-lg shadow-luxury p-5 h-fit">
          <div className="mb-6">
            <p className="text-sm text-text-muted">Signed in as</p>
            <h2 className="text-xl font-serif text-text-main">{profile?.name || 'Guest'}</h2>
          </div>
          <nav className="space-y-2">
            <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-md bg-accent-light/60 text-accent-dark"><CalendarCheck size={18} /> My Bookings</Link>
            <Link to="/review" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-muted hover:bg-secondary"><Star size={18} /> My Reviews</Link>
            <a href="#profile" className="flex items-center gap-3 px-3 py-2 rounded-md text-text-muted hover:bg-secondary"><UserRound size={18} /> Profile</a>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-red-600 hover:bg-red-50"><LogOut size={18} /> Logout</button>
          </nav>
        </aside>

        <main>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-serif text-text-main">Customer Dashboard</h1>
              <p className="mt-2 text-text-muted">Manage bookings, reviews, and profile details.</p>
            </div>
            <Link to="/booking" className="btn-gold inline-flex items-center justify-center gap-2"><Plus size={18} /> New Booking</Link>
          </div>

          {error && <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
          {loading && <div className="mb-6 bg-white px-4 py-3 rounded-md text-sm text-text-muted">Loading dashboard...</div>}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map(({ label, value, icon: Icon }) => (
              <div key={label} className="luxury-card flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-muted">{label}</p>
                  <p className="text-3xl font-semibold text-text-main mt-1">{value}</p>
                </div>
                <div className="h-12 w-12 rounded-md bg-accent-light/70 text-accent-dark flex items-center justify-center">
                  <Icon size={24} />
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <section className="xl:col-span-2 luxury-card overflow-hidden">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-serif text-text-main">My Bookings</h2>
                <Link to="/booking" className="text-accent-dark text-sm font-medium">Book room</Link>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-secondary text-left text-text-muted">
                    <tr>
                      <th className="px-4 py-3">Room</th>
                      <th className="px-4 py-3">Dates</th>
                      <th className="px-4 py-3">Guests</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {bookings.length === 0 && (
                      <tr><td colSpan="4" className="px-4 py-6 text-text-muted text-center">No bookings yet.</td></tr>
                    )}
                    {bookings.map((booking) => (
                      <tr key={booking._id}>
                        <td className="px-4 py-4 font-medium text-text-main">{booking.roomType}</td>
                        <td className="px-4 py-4 text-text-muted">{formatDate(booking.checkIn)} to {formatDate(booking.checkOut)}</td>
                        <td className="px-4 py-4 text-text-muted">{booking.guests}</td>
                        <td className="px-4 py-4"><span className="rounded-full bg-green-50 px-3 py-1 text-xs text-green-700">{booking.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section id="profile" className="luxury-card">
              <h2 className="text-xl font-serif text-text-main">Profile</h2>
              <div className="mt-5 space-y-3 text-sm">
                <div><span className="text-text-muted">Name</span><p className="font-medium text-text-main">{profile?.name || '-'}</p></div>
                <div><span className="text-text-muted">Email</span><p className="font-medium text-text-main">{profile?.email || '-'}</p></div>
                <div><span className="text-text-muted">Phone</span><p className="font-medium text-text-main">{profile?.phone || '-'}</p></div>
                <div><span className="text-text-muted">Role</span><p className="font-medium text-text-main">{profile?.role || '-'}</p></div>
              </div>
              <div className="mt-8 border-t border-gray-100 pt-6 space-y-3">
                <Link to="/booking" className="btn-gold w-full inline-flex justify-center">Reserve a Room</Link>
                <Link to="/review" className="btn-outline w-full inline-flex justify-center">Submit Review</Link>
              </div>
            </section>
          </div>

          <section className="mt-8 luxury-card">
            <h2 className="text-xl font-serif text-text-main mb-5">My Reviews</h2>
            <div className="space-y-4">
              {reviews.length === 0 && <p className="text-text-muted text-sm">No reviews submitted yet.</p>}
              {reviews.map((review) => (
                <div key={review._id} className="border border-gray-100 rounded-md p-4">
                  <div className="flex items-center justify-between gap-4">
                    <p className="font-medium text-text-main">{review.rating} star review</p>
                    <span className="rounded-full bg-accent-light px-3 py-1 text-xs text-accent-dark">{review.isApproved ? 'Approved' : 'Pending'}</span>
                  </div>
                  <p className="mt-2 text-sm text-text-muted">{review.reviewText}</p>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default CustomerDashboard;
