import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, BedDouble, Check, Users } from 'lucide-react';
import { rooms } from '../../data/hotelData';

const Rooms = () => {
  return (
    <div className="bg-secondary min-h-screen">
      <section className="bg-white py-16 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-accent-dark font-medium">Luxury rooms</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-text-main">Choose Your Stay</h1>
          <p className="mt-4 max-w-2xl text-text-muted">
            Browse Y&I Villa rooms with transparent nightly pricing, premium amenities, and a clean booking flow.
          </p>
        </div>
      </section>

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <article key={room.id} className="bg-white rounded-lg shadow-luxury overflow-hidden border border-gray-100">
                <div className="relative">
                  <img src={room.image} alt={room.type} className="h-72 w-full object-cover" />
                  <div className="absolute top-4 left-4 rounded-md bg-white/95 px-3 py-2 text-sm font-medium text-accent-dark">
                    ${room.price} / night
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-2xl font-serif text-text-main">{room.type}</h2>
                      <div className="mt-2 flex items-center gap-4 text-sm text-text-muted">
                        <span className="inline-flex items-center gap-1"><BedDouble size={16} /> Suite</span>
                        <span className="inline-flex items-center gap-1"><Users size={16} /> 2-4 guests</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {room.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2 text-sm text-text-muted">
                        <Check size={16} className="text-accent-dark" />
                        {feature}
                      </div>
                    ))}
                  </div>
                  <div className="mt-7 flex gap-3">
                    <Link to="/booking" className="btn-gold inline-flex items-center gap-2">
                      View Details <ArrowRight size={16} />
                    </Link>
                    <Link to="/booking" className="btn-outline">Book Room</Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Rooms;
