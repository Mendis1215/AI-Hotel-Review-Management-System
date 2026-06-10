import React, { useState } from 'react';
import axios from 'axios';
import { Bot, Send, Star } from 'lucide-react';

const SubmitReview = () => {
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);

    try {
      await axios.post('http://localhost:5000/api/reviews', { rating, reviewText });
      setMessage('Review submitted successfully. It is waiting for admin approval.');
      setReviewText('');
      setRating(5);
    } catch (err) {
      setError(err.response?.data?.message || 'Review submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <p className="text-accent-dark font-medium">Submit review</p>
          <h1 className="mt-3 text-4xl md:text-5xl font-serif text-text-main">Share Your Experience</h1>
          <p className="mt-4 text-text-muted">Your feedback helps Y&I Villa improve every stay.</p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-8">
          <form onSubmit={handleSubmit} className="luxury-card space-y-6">
            {message && <div className="bg-green-50 text-green-700 px-4 py-3 rounded-md text-sm">{message}</div>}
            {error && <div className="bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
            <div>
              <label className="block text-sm font-medium mb-2">Star Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} className={rating >= star ? 'text-accent' : 'text-gray-300'}>
                    <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Feedback</label>
              <textarea value={reviewText} onChange={(e) => setReviewText(e.target.value)} rows="8" className="w-full px-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent resize-none" placeholder="Tell us about the room, staff, food, facilities, or booking experience." required />
            </div>
            <button type="submit" disabled={submitting} className="btn-gold inline-flex items-center justify-center gap-2 w-full py-3 disabled:opacity-60">
              <Send size={18} /> {submitting ? 'Submitting...' : 'Submit Review'}
            </button>
          </form>
          <aside className="luxury-card h-fit">
            <Bot className="text-accent-dark mb-4" size={32} />
            <h2 className="text-xl font-serif text-text-main">AI Review Processing</h2>
            <p className="mt-3 text-sm text-text-muted leading-6">
              Submitted reviews are analyzed for sentiment, category, and service improvement recommendations before admin review.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SubmitReview;
