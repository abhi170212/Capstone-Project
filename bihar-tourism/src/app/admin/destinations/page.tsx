'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi, destinationApi } from '@/lib/api';
import api from '@/lib/api';
import { MapPin, Plus, Edit2, Trash2, Search, X, Save, UploadCloud } from 'lucide-react';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingDestination, setEditingDestination] = useState<any>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
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
    setImageFile(null);
    setShowModal(true);
  };

  const handleAddNew = () => {
    setEditingDestination(null);
    setImageFile(null);
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
      let submitData = { ...formData };
      
      // Handle Image Upload if file is selected
      if (imageFile) {
        const fileData = new FormData();
        fileData.append('images', imageFile);
        const uploadRes = await api.post('/upload', fileData, {
           headers: { 'Content-Type': 'multipart/form-data' }
        });
        submitData.images = uploadRes.data.paths;
      }

      if (editingDestination) {
        await adminApi.updateDestination(editingDestination._id, submitData);
        alert('Destination updated successfully');
      } else {
        await adminApi.addDestination(submitData);
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
          <h1 className="text-3xl font-black text-black mb-2 uppercase tracking-tight">Destination Management</h1>
          <p className="text-[#546B41] font-medium tracking-wide">Manage all tourism destinations ({filteredDestinations.length} total)</p>
        </div>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 px-6 py-3 bg-[#546B41] text-[#FFF8EC] rounded-xl font-bold hover:bg-[#DCCCAC] hover:text-black transition-all shadow-sm"
        >
          <Plus size={20} />
          Add Destination
        </button>
      </div>

      {/* Search */}
      <div className="bg-[#FFF8EC] rounded-2xl p-4 shadow-sm border border-[#546B41]/20">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#546B41]" size={20} />
          <input
            type="text"
            placeholder="Search destinations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-[#546B41]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#546B41] bg-white font-medium text-black"
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
            className="bg-[#FFF8EC] rounded-2xl overflow-hidden shadow-sm border border-[#546B41]/20 hover:border-[#546B41] transition-all"
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
              <h3 className="text-xl font-black text-black mb-2 uppercase tracking-wider">{dest.name}</h3>
              <p className="text-sm font-bold text-black mb-3 line-clamp-2">{dest.description}</p>
              
              <div className="flex items-center justify-between text-sm text-black font-bold mb-4">
                <span className="flex items-center gap-1">
                  <MapPin size={14} />
                  {dest.location}
                </span>
                <span className="flex items-center gap-1">
                  ⭐ {dest.rating}
                </span>
              </div>

              <div className="flex gap-2 font-bold">
                <button
                  onClick={() => handleEdit(dest)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#DCCCAC] text-[#546B41] rounded-lg hover:bg-[#99AD7A] hover:text-black transition-colors border border-[#546B41]/20"
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
        <div className="text-center py-12 bg-[#FFF8EC] rounded-2xl border-2 border-dashed border-[#546B41]/20">
          <MapPin size={64} className="mx-auto text-black mb-4" />
          <p className="text-black font-bold text-lg">No destinations found</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#FFF8EC] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto border-2 border-[#546B41]"
          >
            <div className="sticky top-0 bg-[#FFF8EC] border-b border-[#546B41]/20 p-6 flex justify-between items-center z-10">
              <h2 className="text-2xl font-black text-black uppercase tracking-tight">
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
                <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                />
              </div>

              {/* Image Upload Input */}
              <div className="bg-white border-2 border-dashed border-[#546B41]/30 rounded-xl p-4 text-center hover:bg-[#DCCCAC]/10 transition-colors cursor-pointer relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    if(e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <UploadCloud size={24} className="mx-auto text-[#546B41] mb-2" />
                <p className="text-xs font-black text-[#546B41] uppercase tracking-wider">
                  {imageFile ? imageFile.name : 'Upload High-Res Cover Image'}
                </p>
                {editingDestination && editingDestination.images?.[0] && !imageFile && (
                  <p className="text-[10px] text-gray-400 mt-1">Leaves existing image unchanged if empty</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Description *</label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Location *</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Type *</label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  >
                    <option value="cultural">Cultural</option>
                    <option value="eco">Eco</option>
                    <option value="historical">Historical</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Eco Score</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.ecoScore}
                    onChange={(e) => setFormData({ ...formData, ecoScore: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  >
                    <option value="Budget">Budget</option>
                    <option value="Mid-range">Mid-range</option>
                    <option value="Luxury">Luxury</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Best Season</label>
                  <input
                    type="text"
                    value={formData.bestSeason}
                    onChange={(e) => setFormData({ ...formData, bestSeason: e.target.value })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-black uppercase tracking-widest mb-1">Entry Fee</label>
                  <input
                    type="text"
                    value={formData.entryFee}
                    onChange={(e) => setFormData({ ...formData, entryFee: e.target.value })}
                    className="w-full px-4 py-2 border border-[#546B41]/30 rounded-lg focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-6 py-3 border-2 border-[#546B41] text-[#546B41] font-bold rounded-lg hover:bg-[#DCCCAC] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#546B41] font-bold text-[#FFF8EC] rounded-lg hover:bg-[#DCCCAC] hover:text-black transition-all border border-[#546B41]"
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
