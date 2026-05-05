'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Calendar, X, Image as ImageIcon } from 'lucide-react';
import api, { adminApi, festivalApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Festival {
  _id: string;
  name: string;
  location: string;
  month: string;
  category: string;
  highlight: string;
  description: string;
  images: string[];
}

export default function AdminFestivals() {
  const [festivals, setFestivals] = useState<Festival[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFestival, setEditingFestival] = useState<Festival | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    location: '',
    month: '',
    category: '',
    highlight: '',
    description: '',
    images: [] as string[],
  });

  const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const CATEGORIES = ['Religious', 'Cultural', 'Harvest', 'Folk', 'General'];

  useEffect(() => {
    fetchFestivals();
  }, []);

  const fetchFestivals = async () => {
    try {
      const res = await festivalApi.getAll();
      if (res.success) {
        setFestivals(res.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to fetch festivals');
    } finally {
      setLoading(false);
    }
  };

  const openModal = (festival?: Festival) => {
    if (festival) {
      setEditingFestival(festival);
      setFormData({
        name: festival.name,
        location: festival.location,
        month: festival.month,
        category: festival.category || 'General',
        highlight: festival.highlight || '',
        description: festival.description,
        images: festival.images || [],
      });
    } else {
      setEditingFestival(null);
      setFormData({
        name: '',
        location: '',
        month: 'January',
        category: 'General',
        highlight: '',
        description: '',
        images: [],
      });
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    
    const files = Array.from(e.target.files);
    const uploadData = new FormData();
    files.forEach(file => {
      uploadData.append('images', file);
    });

    setUploadingImage(true);
    try {
      const res = await api.post('/upload', uploadData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setFormData(prev => ({ ...prev, images: [...prev.images, ...res.data.paths] }));
      toast.success('Images uploaded successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload images');
    } finally {
      setUploadingImage(false);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingFestival) {
        await adminApi.updateFestival(editingFestival._id, formData);
        toast.success('Festival updated successfully!');
      } else {
        await adminApi.addFestival(formData);
        toast.success('Festival added successfully!');
      }
      setIsModalOpen(false);
      fetchFestivals();
    } catch (err) {
      console.error(err);
      toast.error('Failed to save festival.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this festival?')) {
      try {
        await adminApi.deleteFestival(id);
        toast.success('Festival deleted successfully!');
        fetchFestivals();
      } catch (err) {
        console.error(err);
        toast.error('Failed to delete festival');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#546B41] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-[#FFF8EC] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight flex items-center gap-4">
            <Calendar className="w-10 h-10 text-[#546B41]" />
            Manage Festivals
          </h1>
          <p className="text-[#546B41] font-bold mt-2">
            Add, edit, and remove cultural festivals of Bihar.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#DCCCAC] border-2 border-black px-6 py-3 rounded-xl font-bold hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black whitespace-nowrap uppercase tracking-wider"
        >
          <Plus size={20} /> Add Festival
        </button>
      </div>

      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#99AD7A] border-b-4 border-black text-black uppercase tracking-wider text-sm font-black">
                <th className="p-4 border-r-4 border-black">Image</th>
                <th className="p-4 border-r-4 border-black">Name</th>
                <th className="p-4 border-r-4 border-black">Month</th>
                <th className="p-4 border-r-4 border-black">Location</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {festivals.map((festival) => (
                <tr key={festival._id} className="border-b-4 border-black hover:bg-gray-50 transition-colors font-bold text-black">
                  <td className="p-4 border-r-4 border-black">
                    <img src={festival.images && festival.images.length > 0 ? festival.images[0] : 'https://placehold.co/100x100?text=No+Image'} alt={festival.name} className="w-16 h-16 object-cover border-2 border-black rounded" />
                  </td>
                  <td className="p-4 border-r-4 border-black">{festival.name}</td>
                  <td className="p-4 border-r-4 border-black">{festival.month}</td>
                  <td className="p-4 border-r-4 border-black">{festival.location}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openModal(festival)}
                        className="p-2 bg-[#DCCCAC] text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(festival._id)}
                        className="p-2 bg-red-400 text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {festivals.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest border-b-4 border-black">
                    No festivals found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFF8EC] border-4 border-black rounded-3xl p-8 w-full max-w-3xl shadow-[16px_16px_0_0_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-8">
              {editingFestival ? 'Edit Festival' : 'Add New Festival'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Statewide, Patna"
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Month</label>
                  <select
                    required
                    value={formData.month}
                    onChange={(e) => setFormData({ ...formData, month: e.target.value })}
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  >
                    {MONTHS.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Category</label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  >
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Highlight (Short Tag)</label>
                <input
                  type="text"
                  value={formData.highlight}
                  onChange={(e) => setFormData({ ...formData, highlight: e.target.value })}
                  placeholder="e.g. Festival of Lights, UNESCO Site"
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Images</label>
                
                <div className="flex flex-wrap gap-4 mb-4">
                  {formData.images.map((img, idx) => (
                    <div key={idx} className="relative w-24 h-24 border-2 border-black rounded-xl overflow-hidden shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
                      <img src={img} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                      <button 
                        type="button" 
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full border border-black hover:bg-red-600"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                  
                  <label className="w-24 h-24 flex flex-col items-center justify-center bg-white border-4 border-dashed border-black rounded-xl cursor-pointer hover:bg-gray-50 transition-colors">
                    {uploadingImage ? (
                      <Loader2 className="animate-spin text-black" size={24} />
                    ) : (
                      <>
                        <ImageIcon size={24} className="text-black mb-1" />
                        <span className="text-xs font-bold text-black uppercase">Add</span>
                      </>
                    )}
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                    />
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-6 border-t-4 border-black">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-black text-black uppercase tracking-widest hover:bg-black/5 rounded-xl border-2 border-transparent transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#546B41] text-[#FFF8EC] border-4 border-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
                >
                  {editingFestival ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
