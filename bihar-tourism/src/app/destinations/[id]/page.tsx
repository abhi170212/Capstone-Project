'use client';

import { useEffect, useState, use } from 'react';
import { motion } from 'framer-motion';
import api, { destinationApi } from '@/lib/api';
import { Destination } from '@/types';
import MapComponent from '@/components/MapComponent';
import ImageGallery from '@/components/ImageGallery';
import { useAuth } from '@/context/AuthContext';
import { 
  Calendar, 
  MapPin, 
  Navigation, 
  Star, 
  Leaf, 
  Award, 
  Activity,
  ArrowLeft,
  Heart
} from 'lucide-react';
import Link from 'next/link';

export default function DestinationDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);

  // New states for Auth & Reviews
  const { user, updateUser } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);
  const [newReview, setNewReview] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    if (user && user.favorites) {
      setIsFavorite(user.favorites.includes(id));
    }
  }, [user, id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await api.get(`/reviews/${id}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews', err);
      }
    };
    fetchReviews();
  }, [id]);

  const toggleFavorite = async () => {
    if (!user) {
      alert("Please login to save favorites.");
      return;
    }
    try {
      const res = await api.post(`/users/favorites/${id}`);
      updateUser({ favorites: res.data.favorites });
      setIsFavorite(res.data.favorites.includes(id));
    } catch (err: any) {
      console.error('Failed to toggle favorite', err);
      alert('Error saving favorite: ' + (err.response?.data?.message || err.message));
    }
  };

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Please login to submit a review.");
      return;
    }
    setSubmittingReview(true);
    try {
      const res = await api.post('/reviews', {
        destinationId: id,
        rating: newReview.rating,
        comment: newReview.comment
      });
      setReviews([res.data, ...reviews]);
      setNewReview({ rating: 5, comment: '' });
    } catch (err) {
      console.error('Failed to submit review', err);
    } finally {
      setSubmittingReview(false);
    }
  };

  useEffect(() => {
    const fetchDestination = async () => {
      try {
        const res = await destinationApi.getById(id);
        setDestination(res.data);
      } catch (err) {
        console.error('Failed to fetch destination:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestination();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">Destination not found</h1>
        <Link href="/destinations" className="text-green-600 hover:underline">Back to Destinations</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={destination.images[0] || 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=1200&q=80'}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-12 w-full">
            <Link href="/destinations" className="inline-flex items-center text-white/80 hover:text-white mb-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all">
              <ArrowLeft size={20} className="mr-2" /> Back to Explore
            </Link>
            <div className="flex justify-between items-end">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold text-white mb-4"
              >
                {destination.name}
              </motion.h1>
              <button 
                onClick={toggleFavorite}
                className={`mb-4 px-6 py-3 rounded-full flex items-center font-semibold transition shadow-lg ${isFavorite ? 'bg-red-500 text-white hover:bg-red-600' : 'bg-white text-gray-800 hover:bg-gray-100'}`}
              >
                <Heart size={20} className={`mr-2 ${isFavorite ? 'fill-white' : ''}`} />
                {isFavorite ? 'Saved to Favorites' : 'Save to Favorites'}
              </button>
            </div>
            <div className="flex flex-wrap gap-4 text-white">
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                <MapPin size={16} /> {destination.location}
              </span>
              <span className="flex items-center gap-1 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                <Star size={16} className="text-yellow-400 fill-yellow-400" /> {destination.rating} Rating
              </span>
              <span className="flex items-center gap-1 bg-green-600/80 backdrop-blur-md px-3 py-1 rounded-full text-sm">
                <Award size={16} /> Eco Score: {destination.ecoScore}%
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">About the Destination</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                {destination.description}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Experience & Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.activities && destination.activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl border border-gray-100 italic transition-transform hover:scale-[1.02]">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                      <Activity size={20} />
                    </div>
                    <span className="text-gray-700 font-medium">{activity}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-gray-800 mb-6">Visual Journey</h2>
              <ImageGallery images={destination.images} />
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-800">Location Map</h2>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${destination.coordinates.lat},${destination.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 flex items-center gap-1 font-semibold hover:underline"
                >
                  <Navigation size={18} /> Open in Google Maps
                </a>
              </div>
              <div className="rounded-3xl overflow-hidden border-4 border-gray-100 shadow-xl">
                <MapComponent destinations={[destination]} height="400px" />
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm mt-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">Traveler Reviews</h2>
              
              {/* Review Form */}
              {user ? (
                <form onSubmit={submitReview} className="mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                  <h3 className="font-semibold text-lg mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                    <select 
                      value={newReview.rating} 
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border bg-white"
                    >
                      {[5,4,3,2,1].map(num => <option key={num} value={num}>{num} Stars</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Your Experience</label>
                    <textarea 
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-green-500 focus:ring-green-500 p-2 border"
                      placeholder="Share your thoughts..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="bg-green-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8 text-center text-gray-600">
                  Please <Link href="/login" className="text-green-600 font-semibold hover:underline">log in</Link> to leave a review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review._id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-semibold text-gray-800">{review.userId?.name || 'Anonymous'}</div>
                      <div className="flex text-yellow-400">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="fill-yellow-400" />)}
                      </div>
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                    <div className="text-xs text-gray-400 mt-4">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                )) : (
                  <p className="text-gray-500 italic text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100 shadow-sm">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Trip Essentials</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 flex-shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Best Time to Visit</p>
                      <p className="text-lg font-bold text-gray-800">{destination.bestSeason}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 flex-shrink-0">
                      <Calculator size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Entry Fee</p>
                      <p className="text-lg font-bold text-gray-800">{destination.entryFee}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 flex-shrink-0">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 font-medium uppercase tracking-wider">Sustainability</p>
                      <p className="text-lg font-bold text-gray-800">{destination.budget} Choice</p>
                    </div>
                  </div>
                </div>

                <Link
                  href="/trip-planner"
                  className="mt-10 block w-full bg-gradient-to-r from-green-600 to-blue-600 text-white text-center py-4 rounded-2xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Add to My Trip Plan
                </Link>
              </div>

              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Why visit {destination.name}?</h3>
                <div className="space-y-3">
                  {destination.interests.map((interest, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                       <span className="opacity-80">{interest} Focused Experience</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Calculator icon replacement since I used Calculator by mistake in the sidebar loop
function Calculator({ size }: { size: number }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>
    </svg>
  );
}
