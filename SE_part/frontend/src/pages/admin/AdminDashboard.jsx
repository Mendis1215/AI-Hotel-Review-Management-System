import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart3, CalendarCheck, MessageSquareWarning, Users, BrainCircuit } from 'lucide-react';
import axios from 'axios';

const AdminDashboard = () => {
  const [summaryData, setSummaryData] = useState({
    totalCustomers: 0,
    activeBookings: 0,
    pendingReviews: 0,
    occupancyRate: '0%',
    todayOperations: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/analytics/summary');
        setSummaryData(data);
      } catch (error) {
        console.error('Error fetching dashboard summary', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, []);

  const cards = [
    { label: 'Total Customers', value: summaryData.totalCustomers, icon: Users, color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Bookings', value: summaryData.activeBookings, icon: CalendarCheck, color: 'bg-green-50 text-green-700' },
    { label: 'Pending Reviews', value: summaryData.pendingReviews, icon: MessageSquareWarning, color: 'bg-yellow-50 text-yellow-700' },
    { label: 'Occupancy Rate', value: summaryData.occupancyRate, icon: BarChart3, color: 'bg-accent-light text-accent-dark' },
  ];

  return (
    <div className="bg-secondary min-h-screen flex flex-col">
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 flex-grow">
        <aside className="bg-white border border-gray-100 rounded-lg shadow-luxury p-5 h-fit">
          <h2 className="text-xl font-serif text-text-main mb-5">Admin Panel</h2>
          <nav className="space-y-2">
            <Link to="/admin" className="block px-3 py-2 rounded-md bg-accent-light/60 text-accent-dark font-medium">Dashboard</Link>
            <Link to="/admin/analytics" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary flex items-center gap-2"><BrainCircuit size={18} /> AI Analytics</Link>
            <Link to="/admin/reviews" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Review Management</Link>
            <Link to="/admin/bookings" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Booking Management</Link>
            <Link to="/admin/customers" className="block px-3 py-2 rounded-md text-text-muted hover:bg-secondary">Customer Management</Link>
          </nav>
        </aside>

        <main>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-serif text-text-main">Admin Dashboard</h1>
            <p className="mt-2 text-text-muted">Hotel management system overview for bookings, customers, and AI review insights.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64"><p className="text-text-muted">Loading dashboard data...</p></div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                {cards.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="luxury-card flex items-center justify-between">
                    <div>
                      <p className="text-sm text-text-muted">{label}</p>
                      <p className="text-3xl font-semibold text-text-main mt-1">{value}</p>
                    </div>
                    <div className={`h-12 w-12 rounded-md flex items-center justify-center ${color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <section className="lg:col-span-2 luxury-card">
                  <h2 className="text-xl font-serif text-text-main mb-5">Today Operations</h2>
                  <div className="space-y-4">
                    {summaryData.todayOperations.map((op, index) => (
                      <div key={index} className="flex items-center justify-between border border-gray-100 rounded-md px-4 py-3 bg-white">
                        <span className="text-text-muted">{op.task}</span>
                        <span className="text-accent-dark text-sm font-medium">{op.status}</span>
                      </div>
                    ))}
                    {summaryData.todayOperations.length === 0 && (
                      <p className="text-sm text-text-muted italic">No operations pending today.</p>
                    )}
                  </div>
                </section>
                <section className="luxury-card">
                  <h2 className="text-xl font-serif text-text-main mb-5">Quick Links</h2>
                  <div className="space-y-3">
                    <Link to="/admin/analytics" className="btn-gold w-full inline-flex justify-center flex items-center gap-2"><BrainCircuit size={18}/> View AI Insights</Link>
                    <Link to="/admin/reviews" className="btn-outline w-full inline-flex justify-center">Manage Reviews</Link>
                    <Link to="/admin/bookings" className="btn-outline w-full inline-flex justify-center">Manage Bookings</Link>
                  </div>
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
