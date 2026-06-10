import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Filter, Search, XCircle } from 'lucide-react';

const AdminBookingManagement = () => {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const loadBookings = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/bookings/all');
      setBookings(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load bookings');
    }
  };

  useEffect(() => {
    loadBookings();
  }, []);

  const updateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/bookings/${id}/status`, { status });
      setBookings(bookings.map((booking) => booking._id === id ? { ...booking, status: data.status } : booking));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not update booking');
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-serif text-text-main">Booking Management</h1>
          <p className="mt-2 text-text-muted">Approve, reject, search, and filter hotel bookings.</p>
        </div>
        {error && <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
        <div className="luxury-card mb-6 grid grid-cols-1 md:grid-cols-[1fr_220px] gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-3.5 text-text-muted" size={18} />
            <input placeholder="Search customer, booking ID, or room" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <button className="btn-outline inline-flex items-center justify-center gap-2"><Filter size={18} /> Filter</button>
        </div>
        <div className="luxury-card overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-secondary text-left text-text-muted">
              <tr>
                {['Customer', 'Room', 'Check-in', 'Check-out', 'Guests', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {bookings.length === 0 && <tr><td colSpan="7" className="px-4 py-6 text-center text-text-muted">No bookings found.</td></tr>}
              {bookings.map((booking) => (
                <tr key={booking._id}>
                  <td className="px-4 py-4 font-medium">{booking.user?.name || 'Customer'}</td>
                  <td className="px-4 py-4 text-text-muted">{booking.roomType}</td>
                  <td className="px-4 py-4 text-text-muted">{new Date(booking.checkIn).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-text-muted">{new Date(booking.checkOut).toLocaleDateString()}</td>
                  <td className="px-4 py-4 text-text-muted">{booking.guests}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-accent-light px-3 py-1 text-xs text-accent-dark">{booking.status}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => updateStatus(booking._id, 'Approved')} className="text-green-600 hover:text-green-800"><CheckCircle size={20} /></button>
                      <button onClick={() => updateStatus(booking._id, 'Rejected')} className="text-red-600 hover:text-red-800"><XCircle size={20} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingManagement;
