const mongoose = require('mongoose');

const bookingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    roomType: {
      type: String,
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    guests: {
      type: Number,
      required: true,
      default: 1,
    },
    status: {
      type: String,
      enum: ['Pending', 'Approved', 'Rejected'],
      default: 'Pending',
    },
    specialRequest: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
