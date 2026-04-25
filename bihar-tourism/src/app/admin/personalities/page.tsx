'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, UserCircle } from 'lucide-react';
import api from '@/lib/api';

interface Personality {
  _id: string;
  name: string;
  era: string;
  description: string;
  image: string;
}

export default function AdminPersonalities() {
  const [personalities, setPersonalities] = useState<Personality[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPersonality, setEditingPersonality] = useState<Personality | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    era: 'Ancient Era',
    description: '',
    image: '',
  });

  useEffect(() => {
    fetchPersonalities();
  }, []);

  const fetchPersonalities = async () => {
    try {
      const res = await api.get('/personalities');
      setPersonalities(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (personality?: Personality) => {
    if (personality) {
      setEditingPersonality(personality);
      setFormData({
        name: personality.name,
        era: personality.era,
        description: personality.description,
        image: personality.image,
      });
    } else {
      setEditingPersonality(null);
      setFormData({
        name: '',
        era: 'Ancient Era',
        description: '',
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingPersonality) {
        await api.put(`/personalities/${editingPersonality._id}`, formData);
      } else {
        await api.post('/personalities', formData);
      }
      setIsModalOpen(false);
      fetchPersonalities();
    } catch (err) {
      console.error(err);
      alert('Failed to save personality');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this personality?')) {
      try {
        await api.delete(`/personalities/${id}`);
        fetchPersonalities();
      } catch (err) {
        console.error(err);
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
      {/* Header */}
      <div className="bg-[#FFF8EC] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight flex items-center gap-4">
            <UserCircle className="w-10 h-10 text-[#546B41]" />
            Manage Personalities
          </h1>
          <p className="text-[#546B41] font-bold mt-2">
            Add, edit, and remove famous historical and modern figures of Bihar.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#DCCCAC] border-2 border-black px-6 py-3 rounded-xl font-bold hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black whitespace-nowrap uppercase tracking-wider"
        >
          <Plus size={20} /> Add Personality
        </button>
      </div>

      {/* Data Table */}
      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#99AD7A] border-b-4 border-black text-black uppercase tracking-wider text-sm font-black">
                <th className="p-4 border-r-4 border-black">Image</th>
                <th className="p-4 border-r-4 border-black">Name</th>
                <th className="p-4 border-r-4 border-black">Era / Category</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {personalities.map((person) => (
                <tr key={person._id} className="border-b-4 border-black hover:bg-gray-50 transition-colors font-bold text-black">
                  <td className="p-4 border-r-4 border-black">
                    <img src={person.image} alt={person.name} className="w-16 h-16 object-cover border-2 border-black rounded" />
                  </td>
                  <td className="p-4 border-r-4 border-black">{person.name}</td>
                  <td className="p-4 border-r-4 border-black">{person.era}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openModal(person)}
                        className="p-2 bg-[#DCCCAC] text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(person._id)}
                        className="p-2 bg-red-400 text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {personalities.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest border-b-4 border-black">
                    No personalities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFF8EC] border-4 border-black rounded-3xl p-8 w-full max-w-2xl shadow-[16px_16px_0_0_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            <h2 className="text-3xl font-black text-black uppercase tracking-tight mb-8">
              {editingPersonality ? 'Edit Personality' : 'Add New Personality'}
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
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Era / Category</label>
                  <select
                    value={formData.era}
                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  >
                    <option value="Ancient Era">Ancient Era</option>
                    <option value="Medieval & Pre-Independence">Medieval & Pre-Independence</option>
                    <option value="Post-Independence">Post-Independence</option>
                    <option value="Modern Day">Modern Day</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Biography / Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                />
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
                  {editingPersonality ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
