import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { CheckCircle, Search, XCircle } from 'lucide-react';

const badge = {
  Positive: 'bg-green-50 text-green-700',
  Neutral: 'bg-yellow-50 text-yellow-700',
  Negative: 'bg-red-50 text-red-700',
  'Pending Analysis': 'bg-gray-100 text-text-muted',
};

const AdminReviewManagement = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState('');

  const loadReviews = async () => {
    try {
      const { data } = await axios.get('http://localhost:5000/api/reviews/all');
      setReviews(data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not load reviews');
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const approveReview = async (id) => {
    try {
      const { data } = await axios.put(`http://localhost:5000/api/reviews/${id}/approve`);
      setReviews(reviews.map((review) => review._id === id ? data : review));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not approve review');
    }
  };

  const rejectReview = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/reviews/${id}`);
      setReviews(reviews.filter((review) => review._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not reject review');
    }
  };

  return (
    <div className="bg-secondary min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-serif text-text-main">Review Management</h1>
            <p className="mt-2 text-text-muted">Approve reviews and inspect AI sentiment recommendations.</p>
          </div>
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-3.5 text-text-muted" size={18} />
            <input placeholder="Search reviews" className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
        </div>
        {error && <div className="mb-6 bg-red-50 text-red-600 px-4 py-3 rounded-md text-sm">{error}</div>}
        <div className="luxury-card overflow-x-auto">
          <table className="min-w-[1100px] w-full text-sm">
            <thead className="bg-secondary text-left text-text-muted">
              <tr>
                {['Customer', 'Review', 'Sentiment', 'Category', 'Cluster', 'AI Recommendation', 'Status', 'Actions'].map((heading) => (
                  <th key={heading} className="px-4 py-3">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.length === 0 && <tr><td colSpan="8" className="px-4 py-6 text-center text-text-muted">No reviews found.</td></tr>}
              {reviews.map((review) => (
                <tr key={review._id}>
                  <td className="px-4 py-4 font-medium text-text-main">{review.user?.name || 'Customer'}</td>
                  <td className="px-4 py-4 text-text-muted max-w-xs">{review.reviewText}</td>
                  <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs ${badge[review.sentiment] || badge['Pending Analysis']}`}>{review.sentiment || 'Pending Analysis'}</span></td>
                  <td className="px-4 py-4">{review.category || '-'}</td>
                  <td className="px-4 py-4 text-text-muted">{review.clusterMeaning || '-'}</td>
                  <td className="px-4 py-4 text-text-muted max-w-xs">{review.aiRecommendation || '-'}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-gray-100 px-3 py-1 text-xs text-text-main">{review.isApproved ? 'Approved' : 'Pending'}</span></td>
                  <td className="px-4 py-4">
                    <div className="flex gap-2">
                      <button onClick={() => approveReview(review._id)} className="text-green-600 hover:text-green-800" title="Approve"><CheckCircle size={20} /></button>
                      <button onClick={() => rejectReview(review._id)} className="text-red-600 hover:text-red-800" title="Reject"><XCircle size={20} /></button>
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

export default AdminReviewManagement;
