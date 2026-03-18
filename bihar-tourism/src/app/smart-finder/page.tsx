'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import DestinationCard from '@/components/DestinationCard';
import { Destination } from '@/data/destinations';

export default function SmartFinder() {
  const [formData, setFormData] = useState({
    travelType: 'all',
    budget: 'all',
    season: 'all',
    interests: [] as string[]
  });
  
  const [results, setResults] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const interestOptions = [
    { id: 'wildlife', label: 'Wildlife' },
    { id: 'history', label: 'History' },
    { id: 'nature', label: 'Nature' },
    { id: 'religious', label: 'Religious' },
    { id: 'culture', label: 'Culture' },
    { id: 'photography', label: 'Photography' }
  ];

  const handleInterestChange = (interestId: string) => {
    setFormData(prev => {
      const isSelected = prev.interests.includes(interestId);
      if (isSelected) {
        return { ...prev, interests: prev.interests.filter(i => i !== interestId) };
      } else {
        return { ...prev, interests: [...prev.interests, interestId] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiUrl}/api/recommendations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      setResults(data);
      setHasSearched(true);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
            Smart Destination Finder
          </h1>
          <p className="text-xl text-gray-600">
            Tell us your preferences, and we&apos;ll find the perfect Bihar destination for you.
          </p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-xl p-8 mb-12">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Travel Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Travel Type</label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                  value={formData.travelType}
                  onChange={(e) => setFormData({...formData, travelType: e.target.value})}
                >
                  <option value="all">All Types</option>
                  <option value="eco">Eco Tourism</option>
                  <option value="cultural">Cultural</option>
                </select>
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                  value={formData.budget}
                  onChange={(e) => setFormData({...formData, budget: e.target.value})}
                >
                  <option value="all">Any Budget</option>
                  <option value="low">Low Budget</option>
                  <option value="medium">Medium Budget</option>
                  <option value="high">High Budget</option>
                </select>
              </div>

              {/* Season */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Season</label>
                <select
                  className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-green-500 focus:border-green-500 block p-2.5"
                  value={formData.season}
                  onChange={(e) => setFormData({...formData, season: e.target.value})}
                >
                  <option value="all">Any Season</option>
                  <option value="winter">Winter (Oct-Feb)</option>
                  <option value="spring">Spring (Feb-Mar)</option>
                  <option value="summer">Summer (Apr-Jun)</option>
                  <option value="monsoon">Monsoon (Jul-Sep)</option>
                </select>
              </div>
            </div>

            {/* Interests */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Interests</label>
              <div className="flex flex-wrap gap-3">
                {interestOptions.map(interest => (
                  <button
                    key={interest.id}
                    type="button"
                    onClick={() => handleInterestChange(interest.id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      formData.interests.includes(interest.id)
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {interest.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                type="submit"
                disabled={loading}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white font-bold rounded-full hover:from-green-700 hover:to-blue-700 focus:ring-4 focus:ring-green-300 transition-all shadow-lg text-lg disabled:opacity-50"
              >
                {loading ? 'Finding Destinations...' : 'Discover Destinations'}
              </button>
            </div>
          </form>
        </div>

        {/* Results */}
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-2">
              {results.length > 0 ? `We found ${results.length} perfect matches` : 'No destinations match your criteria'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {results.map((destination) => (
                <DestinationCard key={destination.id} destination={destination} />
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
