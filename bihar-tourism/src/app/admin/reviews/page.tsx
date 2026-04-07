'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { MessageSquare, Trash2, Star, Search, User, MapPin, Calendar } from 'lucide-react';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRating, setSelectedRating] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const res = await adminApi.getAllReviews();
      setReviews(res.data);
    } catch (err) {
      console.error('Failed to fetch reviews:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteReview = async (reviewId: string) => {
    if (!confirm('Are you sure you want to delete this review? This cannot be undone.')) {
      return;
    }

    try {
      await adminApi.deleteReview(reviewId);
      setReviews(reviews.filter(r => r._id !== reviewId));
      alert('Review deleted successfully');
    } catch (err: any) {
      alert('Failed to delete review: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesSearch = 
      review.comment.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.userId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.destinationId?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRating = !selectedRating || review.rating === parseInt(selectedRating);
    return matchesSearch && matchesRating;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Review Moderation</h1>
          <p className="text-gray-600">Manage and moderate user reviews ({filteredReviews.length} total)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <select
            value={selectedRating}
            onChange={(e) => setSelectedRating(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white"
          >
            <option value="">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold">
                    {review.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <User size={16} className="text-gray-500" />
                      <span className="font-semibold text-gray-800">{review.userId?.name || 'Unknown User'}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>{review.userId?.email || 'No email'}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                </div>
                <button
                  onClick={() => handleDeleteReview(review._id)}
                  className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
                  title="Delete Review"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-4 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                <MapPin size={16} className="text-purple-600" />
                <span className="font-semibold">Destination:</span>
                <span>{review.destinationId?.name || 'Unknown Destination'}</span>
              </div>
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Calendar size={14} />
                <span>{new Date(review.date || review.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</span>
              </div>
              <div className="text-xs text-gray-400">
                Review ID: {review._id}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredReviews.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <MessageSquare size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No reviews found</p>
          <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {[5, 4, 3, 2, 1].map(rating => {
          const count = reviews.filter(r => r.rating === rating).length;
          const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
          
          return (
            <div key={rating} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-2">
                <Star size={16} className="text-yellow-400 fill-yellow-400" />
                <span className="font-bold text-gray-800">{rating} Stars</span>
              </div>
              <div className="text-2xl font-bold text-gray-800 mb-1">{count}</div>
              <div className="text-xs text-gray-500">{percentage.toFixed(1)}%</div>
              <div className="mt-2 bg-gray-200 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-yellow-400 to-orange-400 h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary Card */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 text-white">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-purple-100 text-sm mb-1">Total Reviews</p>
            <p className="text-3xl font-bold">{reviews.length}</p>
          </div>
          <div>
            <p className="text-purple-100 text-sm mb-1">Average Rating</p>
            <p className="text-3xl font-bold">
              {reviews.length > 0
                ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
                : '0.0'}
              <span className="text-lg ml-1">/ 5</span>
            </p>
          </div>
          <div>
            <p className="text-purple-100 text-sm mb-1">5-Star Reviews</p>
            <p className="text-3xl font-bold">
              {reviews.filter(r => r.rating === 5).length}
              <span className="text-lg ml-1">
                ({reviews.length > 0 ? ((reviews.filter(r => r.rating === 5).length / reviews.length) * 100).toFixed(0) : 0}%)
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
