import React from 'react';
import { Award, HeartHandshake, Sparkles } from 'lucide-react';

const About = () => {
  return (
    <div className="bg-white min-h-screen">
      <section className="grid grid-cols-1 lg:grid-cols-2">
        <div className="px-4 sm:px-6 lg:px-16 py-20 flex items-center">
          <div className="max-w-xl">
            <p className="text-accent-dark font-medium">About Y&I Villa</p>
            <h1 className="mt-3 text-4xl md:text-5xl font-serif text-text-main">Quiet luxury with attentive service.</h1>
            <p className="mt-6 text-text-muted leading-7">
              Y&I Villa brings boutique comfort, elegant interiors, and modern hotel management into one calm guest experience.
              Every room, request, booking, and review is handled with care.
            </p>
          </div>
        </div>
        <img
          src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1400&q=80"
          alt="Elegant villa exterior"
          className="h-full min-h-[420px] w-full object-cover"
        />
      </section>

      <section className="py-16 bg-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Award, title: 'Premium Rooms', text: 'Polished interiors, soft bedding, and carefully selected amenities.' },
            { icon: HeartHandshake, title: 'Personal Service', text: 'A guest-first team focused on smooth stays and fast support.' },
            { icon: Sparkles, title: 'Smart Feedback', text: 'AI-assisted review insights help the hotel improve service quality.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="luxury-card">
              <Icon className="text-accent-dark mb-4" size={28} />
              <h2 className="text-xl font-serif text-text-main">{title}</h2>
              <p className="mt-3 text-text-muted">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;
