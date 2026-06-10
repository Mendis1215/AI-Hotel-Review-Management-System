const Booking = require('../models/Booking');

const createBooking = async (req, res) => {
  const { roomType, checkIn, checkOut, guests, specialRequest } = req.body;

  if (!roomType || !checkIn || !checkOut || !guests) {
    return res.status(400).json({ message: 'Please provide room type, dates, and guest count' });
  }

  if (new Date(checkOut) <= new Date(checkIn)) {
    return res.status(400).json({ message: 'Check-out date must be after check-in date' });
  }

  try {
    const booking = await Booking.create({
      user: req.user._id,
      roomType,
      checkIn,
      checkOut,
      guests,
      specialRequest,
    });

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({}).populate('user', 'name email phone').sort({ createdAt: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  const { status } = req.body;

  if (!['Pending', 'Approved', 'Rejected'].includes(status)) {
    return res.status(400).json({ message: 'Invalid booking status' });
  }

  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.status = status;
    const updatedBooking = await booking.save();
    res.json(updatedBooking);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { createBooking, getMyBookings, getAllBookings, updateBookingStatus };
