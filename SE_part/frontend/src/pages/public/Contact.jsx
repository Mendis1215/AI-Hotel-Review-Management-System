import React from 'react';
import { Mail, MapPin, Phone } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-secondary min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div>
          <p className="text-accent-dark font-medium">Contact</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-text-main">Speak with Y&I Villa</h1>
          <p className="mt-4 text-text-muted max-w-xl">
            Reach the hotel team for reservations, special requests, event stays, and guest support.
          </p>
          <div className="mt-10 space-y-4">
            <div className="luxury-card flex gap-4">
              <Phone className="text-accent-dark" />
              <div><p className="font-medium">Phone</p><p className="text-text-muted">+94 77 123 4567</p></div>
            </div>
            <div className="luxury-card flex gap-4">
              <Mail className="text-accent-dark" />
              <div><p className="font-medium">Email</p><p className="text-text-muted">reservations@yivilla.com</p></div>
            </div>
            <div className="luxury-card flex gap-4">
              <MapPin className="text-accent-dark" />
              <div><p className="font-medium">Address</p><p className="text-text-muted">Y&I Villa, Colombo Road, Sri Lanka</p></div>
            </div>
          </div>
        </div>
        <form className="luxury-card space-y-5">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message</label>
            <textarea rows="6" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
          </div>
          <button type="button" className="btn-gold w-full">Send Message</button>
        </form>
      </div>
    </div>
  );
};

export default Contact;
