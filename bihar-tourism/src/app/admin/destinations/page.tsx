'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi, destinationApi } from '@/lib/api';
import { MapPin, Plus, Edit2, Trash2, Search, X, Save } from 'lucide-react';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    type: 'cultural',
    rating: 4.5,
    bestSeason: 'Winter',
    entryFee: 'Free',
    ecoScore: 80,
    budget: 'Mid-range',
    images: [''],
    interests: [] as string[],
    activities: [] as string[],
    coordinates: { lat: 25.0961, lng: 85.3131 },
  });

  useEffect(() => {
    fetchDestinations();
  }, []);

  const fetchDestinations = async () => {
    try {
      const res = await destinationApi.getAll();
      setDestinations(res.data);
    } catch (err) {
      console.error('Failed to fetch destinations:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"? This cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteDestination(id);
      setDestinations(destinations.filter(d => d._id !== id));
      alert('Destination deleted successfully');
    } catch (err: any) {
      alert('Failed to delete: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleEdit = (destination: any) => {
    setEditingDestination(destination);
    setFormData({
      name: destination.name || '',
      description: destination.description || '',
      location: destination.location || '',
      type: destination.type || 'cultural',
      rating: destination.rating || 4.5,
      bestSeason: destination.bestSeason || 'Winter',
      entryFee: destination.entryFee || 'Free',
      ecoScore: destination.ecoScore || 80,
      budget: destination.budget || 'Mid-range',
      images: destination.images || [''],
      interests: destination.interests || [],
      activities: destination.activities || [],
      coordinates: destination.coordinates || { lat: 25.0961, lng: 85.3131 },
    });
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingDestination(null);
    setFormData({
      name: '',
      description: '',
      location: '',
      type: 'cultural',
      rating: 4.5,
      bestSeason: 'Winter',
      entryFee: 'Free',
      ecoScore: 80,
      budget: 'Mid-range',
      images: [''],
      interests: [],
      activities: [],
      coordinates: { lat: 25.0961, lng: 85.3131 },
    });
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingDestination) {
        await adminApi.updateDestination(editingDestination._id, formData);
        alert('Destination updated successfully');
      } else {
        await adminApi.addDestination(formData);
        alert('Destination added successfully');
      }
      setShowModal(false);
      fetchDestinations();
    } catch (err: any) {
      alert('Failed to save: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredDestinations = destinations.filter(dest =>
    dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dest.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Destination Management</h1>
          <p className="text-gray-600">Manage all tourism destinations ({filteredDestinations.length} total)</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add Destination
        </button>
      </div>

      {/* Search */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </div>

      {/* Destinations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredDestinations.map((dest) => (
          <motion.div
            key={dest._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all"
          >
            <div className="relative h-48">
              <img
                src={dest.images?.[0] || 'https://via.placeholder.com/400'}
                alt={dest.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  dest.type === 'cultural' ? 'bg-blue-100 text-blue-700' :
                  dest.type === 'eco' ? 'bg-green-100 text-green-700' :
                  'bg-purple-100 text-purple-700'
                }`}>
                  {dest.type}
                </span>
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{dest.name}</h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">{dest.description}</p>
              
              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {dest.location}
                </span>
                <span className="flex items-center gap-1">
                  ⭐ {dest.rating}
                </span>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(dest)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Edit2 size={16} />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(dest._id, dest.name)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredDestinations.length === 0 && (
        <div className="text-center py-12 bg-white rounded-2xl border-2 border-dashed border-gray-200">
          <MapPin size={64} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500 text-lg">No destinations found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                {editingDestination ? 'Edit Destination' : 'Add New Destination'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="eco">Eco</option>
                    <option value="historical">Historical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Eco Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ecoScore}
                    onChange={(e) => setFormData({ ...formData, ecoScore: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Mid-range">Mid-range</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Best Season</label>
                  <input
                    type="text"
                    value={formData.bestSeason}
                    onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Entry Fee</label>
                  <input
                    type="text"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  <Save size={20} />
                  {editingDestination ? 'Update' : 'Create'} Destination
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
