'use client';

import { useEffect, useState, use } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api, { destinationApi } from '@/lib/api';
import { Destination } from '@/types';
import MapComponent from '@/components/MapComponent';
import ImageGallery from '@/components/ImageGallery';
import WeatherWidget from '@/components/WeatherWidget';
import ShareButton from '@/components/ShareButton';
import NearbyAttractions from '@/components/NearbyAttractions';
import BookingForm from '@/components/BookingForm';
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
  Heart,
  FileDown
} from 'lucide-react';
import Link from 'next/link';
import { jsPDF } from 'jspdf';

// Calculator icon component
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
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [communityPosts, setCommunityPosts] = useState<any[]>([]);

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
      alert("Please login to save destinations.");
      return;
    }
    try {
      const res = await api.post(`/users/favorites/${id}`);
      updateUser({ favorites: res.data.favorites });
      setIsFavorite(res.data.favorites.includes(id));
    } catch (err: any) {
      console.error('Failed to toggle favorite', err);
      alert('Error saving destination: ' + (err.response?.data?.message || err.message));
    }
  };

  const downloadDestinationPDF = () => {
    if (!destination) return;
    const doc = new jsPDF();
    
    doc.setFillColor(84, 107, 65);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 248, 236);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Bihar Tourism - Destination Guide", 105, 25, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(destination.name, 20, 60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Location: ${destination.location}`, 20, 75);
    doc.text(`Best Season: ${destination.bestSeason}`, 20, 85);
    doc.text(`Entry Fee: ${destination.entryFee}`, 20, 95);

    doc.setFont("helvetica", "bold");
    doc.text(`About:`, 20, 115);
    
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(destination.description, 170);
    doc.text(splitDescription, 20, 125);

    doc.save(`Destination-${destination.name.replace(/\s+/g, '-')}.pdf`);
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
        
        // Fetch community posts relating to this location
        try {
          const postRes = await api.get(`/posts?location=${encodeURIComponent(res.data.name)}`);
          setCommunityPosts(postRes.data);
        } catch (postErr) {
          console.error('Failed to fetch community posts', postErr);
        }

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
    <div className="min-h-screen bg-[#FFF8EC] pb-20">
      {/* Hero Section */}
      <div className="relative h-[60vh] min-h-[400px]">
        <img
          src={destination.images[0] || 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=1200&q=80'}
          alt={destination.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-[#FFF8EC]/60 backdrop-blur-[2px] flex items-end">
          <div className="max-w-7xl mx-auto px-4 py-12 w-full">
            <Link href="/destinations" className="inline-flex items-center text-black font-bold mb-6 bg-[#DCCCAC] border border-[#546B41] px-4 py-2 rounded-full hover:bg-[#99AD7A] transition-colors shadow-none">
              <ArrowLeft size={20} className="mr-2" /> Back to Explore
            </Link>
            <div className="flex justify-between items-end">
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-5xl md:text-7xl font-bold text-black mb-4 drop-shadow-sm"
              >
                {destination.name}
              </motion.h1>
              <div className="flex gap-3 mb-4">
                <button 
                  onClick={toggleFavorite}
                  className={`px-6 py-3 rounded-full flex items-center font-bold transition-colors shadow-none ${isFavorite ? 'bg-[#99AD7A] text-black border-2 border-[#546B41]' : 'bg-[#DCCCAC] text-black border border-[#546B41] hover:bg-[#FFF8EC]'}`}
                >
                  <Heart size={20} className={`mr-2 stroke-black ${isFavorite ? 'fill-[#546B41]' : ''}`} />
                  {isFavorite ? 'Destination Saved' : 'Save Destination'}
                </button>
                <button
                  onClick={downloadDestinationPDF}
                  className="px-6 py-3 rounded-full flex items-center font-bold transition-colors shadow-none bg-[#DCCCAC] text-black border border-[#546B41] hover:bg-[#FFF8EC]"
                >
                  <FileDown size={20} className="mr-2" />
                  PDF Guide
                </button>
                <ShareButton 
                  url={typeof window !== 'undefined' ? window.location.href : ''}
                  title={`Visit ${destination.name} - Bihar Tourism`}
                  description={destination.description}
                  image={destination.images[0] || 'https://images.unsplash.com/photo-1623945032589-1c7c8987f52e?w=1200'}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-4 text-black font-bold">
              <span className="flex items-center gap-1 bg-[#DCCCAC] border border-[#546B41] px-3 py-1 rounded-full text-sm">
                <MapPin size={16} /> {destination.location}
              </span>
              <span className="flex items-center gap-1 bg-[#FFF8EC] border border-[#546B41] px-3 py-1 rounded-full text-sm">
                <Star size={16} className="text-black fill-black" /> {destination.rating} Rating
              </span>
              <span className="flex items-center gap-1 bg-[#99AD7A] border border-[#546B41] px-3 py-1 rounded-full text-sm">
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
              <h2 className="text-3xl font-bold text-black mb-6">About the Destination</h2>
              <p className="text-lg text-black font-medium leading-relaxed">
                {destination.description}
              </p>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Experience & Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {destination.activities && destination.activities.map((activity, i) => (
                  <div key={i} className="flex items-center gap-3 p-4 bg-[#DCCCAC] rounded-2xl border border-[#546B41]/30 italic transition-transform hover:-translate-y-0.5">
                    <div className="w-10 h-10 bg-[#FFF8EC] border border-[#546B41] rounded-full flex items-center justify-center text-black">
                      <Activity size={20} />
                    </div>
                    <span className="text-black font-bold">{activity}</span>
                  </div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-3xl font-bold text-black mb-6">Visual Journey</h2>
              <ImageGallery images={destination.images} />
            </section>

            <section>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-black">Location Map</h2>
                <a 
                  href={`https://www.google.com/maps/search/?api=1&query=${destination.coordinates.lat},${destination.coordinates.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-black font-bold hover:text-[#546B41] underline decoration-[#546B41] flex items-center gap-1"
                >
                  <Navigation size={18} /> Open in Google Maps
                </a>
              </div>
              <div className="rounded-3xl overflow-hidden border-4 border-gray-100 shadow-xl">
                <MapComponent destinations={[destination]} height="400px" />
              </div>
            </section>

            {/* Reviews Section */}
            <section className="bg-[#DCCCAC] rounded-3xl p-8 border border-[#546B41]/30 mt-12 shadow-none">
              <h2 className="text-3xl font-bold text-black mb-6 border-b border-[#546B41]/20 pb-4">Traveler Reviews</h2>
              
              {/* Review Form */}
              {user ? (
                <form onSubmit={submitReview} className="mb-8 bg-[#FFF8EC] p-6 rounded-2xl shadow-none border border-[#546B41]/30">
                  <h3 className="font-bold text-black text-lg mb-4">Write a Review</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-black mb-1">Rating</label>
                    <select 
                      value={newReview.rating} 
                      onChange={(e) => setNewReview({...newReview, rating: Number(e.target.value)})}
                      className="w-full border-[#546B41]/50 rounded-lg shadow-none focus:border-[#546B41] focus:ring-[#546B41] p-2 border bg-[#FFF8EC] font-bold text-black"
                    >
                      {[5,4,3,2,1].map(num => <option key={num} value={num} className="font-bold">{num} Stars</option>)}
                    </select>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-bold text-black mb-1">Your Experience</label>
                    <textarea 
                      required
                      rows={3}
                      value={newReview.comment}
                      onChange={(e) => setNewReview({...newReview, comment: e.target.value})}
                      className="w-full border-[#546B41]/50 rounded-lg shadow-none focus:border-[#546B41] focus:ring-[#546B41] p-2 border bg-[#FFF8EC] text-black font-medium placeholder:text-black/50"
                      placeholder="Share your thoughts..."
                    ></textarea>
                  </div>
                  <button 
                    type="submit" 
                    disabled={submittingReview}
                    className="bg-[#99AD7A] text-black border border-[#546B41] px-6 py-2 rounded-lg font-bold hover:bg-[#DCCCAC] transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              ) : (
                <div className="bg-[#FFF8EC] p-6 rounded-2xl shadow-none border border-[#546B41]/30 mb-8 text-center text-black font-medium mt-6">
                  Please <Link href="/login" className="text-black font-bold underline decoration-[#546B41]">log in</Link> to leave a review.
                </div>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map(review => (
                  <div key={review._id} className="bg-[#FFF8EC] p-6 rounded-2xl shadow-none border border-[#546B41]/20">
                    <div className="flex justify-between items-start mb-2">
                      <div className="font-bold text-black">{review.userId?.name || 'Anonymous'}</div>
                      <div className="flex text-black">
                        {[...Array(review.rating)].map((_, i) => <Star key={i} size={16} className="fill-black" />)}
                      </div>
                    </div>
                    <p className="text-black font-medium mt-2">{review.comment}</p>
                    <div className="text-xs text-black/70 font-bold mt-4">{new Date(review.date).toLocaleDateString()}</div>
                  </div>
                )) : (
                  <p className="text-black font-bold italic text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </section>

            {/* Smart Finder Community Features */}
            {communityPosts.length > 0 && (
              <section className="bg-white rounded-3xl p-8 shadow-xl mt-12 border-2 border-[#546B41]">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-black text-black">Traveler Experiences</h2>
                  <Link href="/community" className="text-[#546B41] font-bold hover:underline">View All &rarr;</Link>
                </div>
                <div className="flex overflow-x-auto gap-6 snap-x snap-mandatory pb-4">
                  {communityPosts.map(post => {
                    const imageUrl = Array.isArray(post.images) && post.images.length > 0 
                      ? (typeof post.images[0] === 'string' ? post.images[0] : post.images[0].url) 
                      : 'https://images.unsplash.com/photo-1596414272183-5ee9acabf333?q=80&w=800';
                    return (
                      <div key={post._id} className="min-w-[300px] flex-shrink-0 snap-center bg-black rounded-2xl overflow-hidden relative group h-[400px]">
                        <img src={imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" alt="Post"/>
                        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                          <p className="text-white font-bold mb-1 line-clamp-2">{post.caption || 'Exploring Bihar'}</p>
                          <p className="text-gray-300 text-xs font-medium">By {post.user?.name || 'Traveler'}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-8">
              {/* Weather Widget */}
              <WeatherWidget 
                lat={destination.coordinates.lat}
                lng={destination.coordinates.lng}
                location={destination.name}
              />

              {/* Nearby Attractions */}
              <NearbyAttractions 
                destinationId={destination._id}
                radius={100}
              />

              <div className="bg-[#DCCCAC] rounded-3xl p-8 border border-[#546B41]/30 shadow-none">
                <h3 className="text-2xl font-bold text-black mb-6">Trip Essentials</h3>
                
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#FFF8EC] border border-[#546B41] rounded-2xl flex items-center justify-center text-black flex-shrink-0">
                      <Calendar size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-black font-bold uppercase tracking-wider">Best Time to Visit</p>
                      <p className="text-lg font-bold text-black">{destination.bestSeason}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#FFF8EC] border border-[#546B41] rounded-2xl flex items-center justify-center text-black flex-shrink-0">
                      <Calculator size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-black font-bold uppercase tracking-wider">Entry Fee</p>
                      <p className="text-lg font-bold text-black">{destination.entryFee}</p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="w-12 h-12 bg-[#FFF8EC] border border-[#546B41] rounded-2xl flex items-center justify-center text-black flex-shrink-0">
                      <Leaf size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-black font-bold uppercase tracking-wider">Sustainability</p>
                      <p className="text-lg font-bold text-black">{destination.budget} Choice</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setShowBookingForm(true)}
                  className="mt-6 block w-full bg-[#99AD7A] border border-[#546B41] text-black text-center py-4 rounded-2xl font-bold text-lg hover:bg-[#FFF8EC] transition-colors shadow-none"
                >
                  Book Now
                </button>

                <Link
                  href="/trip-planner"
                  className="mt-4 block w-full bg-[#FFF8EC] border border-[#546B41] text-black text-center py-4 rounded-2xl font-bold text-lg hover:bg-[#99AD7A] transition-colors shadow-none"
                >
                  Add to My Trip Plan
                </Link>
              </div>

              <div className="bg-[#99AD7A] border border-[#546B41]/30 rounded-3xl p-8 text-black">
                <h3 className="text-xl font-bold mb-4">Why visit {destination.name}?</h3>
                <div className="space-y-3">
                  {destination.interests.map((interest, i) => (
                    <div key={i} className="flex items-center gap-2">
                       <div className="w-2 h-2 bg-[#546B41] rounded-full"></div>
                       <span className="font-bold">{interest} Focused Experience</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Modal */}
      <AnimatePresence>
        {showBookingForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setShowBookingForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-2xl"
            >
              <BookingForm
                destinationId={destination._id}
                destinationName={destination.name}
                pricePerPerson={500}
                onClose={() => setShowBookingForm(false)}
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
