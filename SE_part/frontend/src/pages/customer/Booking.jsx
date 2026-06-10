import React, { useContext, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { CalendarDays, Users } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { rooms } from '../../data/hotelData';

const Booking = () => {
  const { user } = useContext(AuthContext);
  const [roomId, setRoomId] = useState(String(rooms[0].id));
  const [checkIn, setCheckIn] = useState('2026-06-12');
  const [checkOut, setCheckOut] = useState('2026-06-15');
  const [guests, setGuests] = useState(2);
  const [specialRequest, setSpecialRequest] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const selectedRoom = useMemo(() => rooms.find((room) => String(room.id) === roomId), [roomId]);
  const nights = Math.max(1, Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) || 1);
  const total = selectedRoom.price * nights;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!user) {
      setError('Please log in before confirming a booking.');
      return;
    }

    setSubmitting(true);
    try {
      await axios.post('http://localhost:5000/api/bookings', {
        roomType: selectedRoom.type,
        checkIn,
        checkOut,
        guests: Number(guests),
        specialRequest,
      });
      setMessage('Booking submitted successfully. Admin approval is pending.');
      setSpecialRequest('');
    } catch (err) {
      setError(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-accent-dark font-medium">Booking</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-text-main">Confirm Your Stay</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8">
          <form onSubmit={handleSubmit} className="luxury-card space-y-6">
            {message && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm">{message}</div>}
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-2">Room Type</label>
              <select value={roomId} onChange={(e) => setRoomId(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                {rooms.map((room) => <option key={room.id} value={room.id}>{room.type}</option>)}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-2">Check-in</label>
                <input type="date" value={checkIn} onChange={(e) => setCheckIn(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Check-out</label>
                <input type="date" value={checkOut} onChange={(e) => setCheckOut(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Guests</label>
              <select value={guests} onChange={(e) => setGuests(e.target.value)} className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent">
                {[1, 2, 3, 4, 5, 6].map((count) => <option key={count} value={count}>{count} guest{count > 1 ? 's' : ''}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Special Request</label>
              <textarea value={specialRequest} onChange={(e) => setSpecialRequest(e.target.value)} rows="4" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none" placeholder="Arrival time, meal preference, or celebration notes" />
            </div>
            {user ? (
              <button type="submit" disabled={submitting} className="btn-gold w-full py-3 disabled:opacity-60">
                {submitting ? 'Submitting...' : 'Confirm Booking'}
              </button>
            ) : (
              <Link to="/login" className="btn-gold w-full py-3 inline-flex justify-center">Log In to Book</Link>
            )}
          </form>

          <aside className="bg-white rounded-lg shadow-luxury border border-gray-100 overflow-hidden h-fit">
            <img src={selectedRoom.image} alt={selectedRoom.type} className="h-56 w-full object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-serif text-text-main">{selectedRoom.type}</h2>
              <div className="mt-5 space-y-3 text-sm text-text-muted">
                <p className="flex items-center gap-2"><CalendarDays size={16} /> {checkIn} to {checkOut}</p>
                <p className="flex items-center gap-2"><Users size={16} /> {guests} guest{Number(guests) > 1 ? 's' : ''}</p>
              </div>
              <div className="mt-6 border-t border-gray-100 pt-5 space-y-2 text-sm">
                <div className="flex justify-between"><span>Room rate</span><span>${selectedRoom.price}</span></div>
                <div className="flex justify-between"><span>Nights</span><span>{nights}</span></div>
                <div className="flex justify-between text-lg font-semibold text-text-main pt-3"><span>Total</span><span>${total}</span></div>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default Booking;
