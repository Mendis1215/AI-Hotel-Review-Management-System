import React from 'react';
import { Star } from 'lucide-react';
import { testimonials } from '../../data/hotelData';

const Reviews = () => {
  return (
    <div className="bg-secondary min-h-screen py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-12">
          <p className="text-accent-dark font-medium">Guest reviews</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-text-main">Trusted by happy guests</h1>
          <p className="mt-4 text-text-muted">Public feedback from recent Y&I Villa customers.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((item) => (
            <article key={item.name} className="luxury-card">
              <div className="flex text-accent mb-5">
                {Array.from({ length: item.rating }).map((_, index) => (
                  <Star key={index} size={20} fill="currentColor" />
                ))}
              </div>
              <p className="text-text-muted leading-7">"{item.text}"</p>
              <p className="mt-6 font-medium text-text-main">{item.name}</p>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reviews;
