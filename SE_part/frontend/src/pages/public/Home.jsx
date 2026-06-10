import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Car, Coffee, ShieldCheck, Sparkles, Star, Utensils, Waves, Wifi } from 'lucide-react';
import { rooms, testimonials } from '../../data/hotelData';

const services = [
  { icon: Wifi, title: 'High-Speed Wi-Fi', text: 'Reliable connectivity across rooms, lobby, and dining spaces.' },
  { icon: Utensils, title: 'Fine Dining', text: 'Fresh breakfast, private dining, and locally inspired menus.' },
  { icon: Car, title: 'Airport Pickup', text: 'Comfortable transfers arranged for smooth arrivals and departures.' },
  { icon: Waves, title: 'Relaxation Areas', text: 'Quiet terraces, garden corners, and calm spaces for slow mornings.' },
];

const Home = () => {
  return (
    <div className="bg-white">
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1800&q=80"
          alt="Luxury hotel suite at Y&I Villa"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/75 to-white/20" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[calc(100vh-5rem)] flex items-center">
          <div className="max-w-2xl py-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-white/80 px-4 py-2 text-sm text-accent-dark mb-6">
              <Sparkles size={16} />
              Boutique luxury hospitality
            </div>
            <h1 className="text-5xl md:text-7xl font-serif text-text-main leading-tight">
              Y&I Villa
            </h1>
            <p className="mt-6 text-lg md:text-xl text-text-muted max-w-xl">
              A quiet luxury hotel experience with elegant rooms, thoughtful service, and effortless online booking.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link to="/booking" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3">
                Book Your Stay <ArrowRight size={18} />
              </Link>
              <Link to="/rooms" className="btn-outline inline-flex items-center justify-center px-8 py-3">
                View Rooms
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-text-main">Hotel Services</h2>
            <p className="mt-3 text-text-muted">Designed for restful stays, smooth arrivals, and memorable guest moments.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map(({ icon: Icon, title, text }) => (
              <div key={title} className="luxury-card">
                <div className="h-11 w-11 rounded-md bg-accent-light/70 text-accent-dark flex items-center justify-center mb-5">
                  <Icon size={22} />
                </div>
                <h3 className="text-lg font-serif text-text-main">{title}</h3>
                <p className="mt-2 text-sm text-text-muted">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-serif text-text-main">Featured Rooms</h2>
              <p className="mt-3 text-text-muted">Warm textures, soft lighting, and details made for comfort.</p>
            </div>
            <Link to="/rooms" className="text-accent-dark font-medium inline-flex items-center gap-2">
              Explore all rooms <ArrowRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rooms.slice(0, 3).map((room) => (
              <article key={room.id} className="bg-white rounded-lg shadow-luxury overflow-hidden border border-gray-100">
                <img src={room.image} alt={room.type} className="h-60 w-full object-cover" />
                <div className="p-6">
                  <h3 className="text-xl font-serif text-text-main">{room.type}</h3>
                  <p className="mt-2 text-text-muted">${room.price} per night</p>
                  <Link to="/booking" className="mt-5 btn-gold inline-flex items-center gap-2">
                    Book Now <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <h2 className="text-3xl md:text-4xl font-serif text-text-main">Guest Testimonials</h2>
            <p className="mt-3 text-text-muted">What customers say after staying with Y&I Villa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((item) => (
              <div key={item.name} className="luxury-card">
                <div className="flex text-accent mb-4">
                  {Array.from({ length: item.rating }).map((_, index) => (
                    <Star key={index} size={18} fill="currentColor" />
                  ))}
                </div>
                <p className="text-text-muted">"{item.text}"</p>
                <p className="mt-5 font-medium text-text-main">{item.name}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-accent-light/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-accent-dark mb-2">
              <ShieldCheck size={20} />
              <span className="font-medium">Secure hotel reservations</span>
            </div>
            <h2 className="text-3xl font-serif text-text-main">Plan your next stay today.</h2>
          </div>
          <Link to="/booking" className="btn-gold inline-flex items-center justify-center gap-2 px-8 py-3">
            Book Your Stay <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
