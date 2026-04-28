'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Shirt } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Attire {
  _id: string;
  name: string;
  description: string;
  category: string;
  location: string;
  price: number;
  stock: number;
  image: string;
  sizes: string[];
}

export default function AdminAttires() {
  const [attires, setAttires] = useState<Attire[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAttire, setEditingAttire] = useState<Attire | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Unisex',
    location: '',
    price: 0,
    stock: 100,
    image: '',
    sizes: 'S, M, L, XL',
  });

  useEffect(() => {
    fetchAttires();
  }, []);

  const fetchAttires = async () => {
    try {
      const res = await api.get('/attires');
      setAttires(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (attire?: Attire) => {
    if (attire) {
      setEditingAttire(attire);
      setFormData({
        name: attire.name,
        description: attire.description,
        category: attire.category,
        location: attire.location,
        price: attire.price,
        stock: attire.stock,
        image: attire.image,
        sizes: attire.sizes.join(', '),
      });
    } else {
      setEditingAttire(null);
      setFormData({
        name: '',
        description: '',
        category: 'Unisex',
        location: '',
        price: 0,
        stock: 100,
        image: '',
        sizes: 'S, M, L, XL',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      sizes: formData.sizes.split(',').map((s) => s.trim()),
    };

    try {
      if (editingAttire) {
        await api.put(`/attires/${editingAttire._id}`, payload);
      } else {
        await api.post('/attires', payload);
      }
      setIsModalOpen(false);
      fetchAttires();
      toast.success(editingAttire ? 'Attire updated successfully!' : 'Attire added successfully!');
    } catch (err) {
      console.error(err);
      toast.error('Failed to save attire.');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this attire?')) {
      try {
        await api.delete(`/attires/${id}`);
        fetchAttires();
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#546B41] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-[#FFF8EC] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight flex items-center gap-4">
            <Shirt className="w-10 h-10 text-[#546B41]" />
            Manage Attires
          </h1>
          <p className="text-[#546B41] font-bold mt-2">
            Add, edit, and remove traditional clothing from the e-commerce store.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#DCCCAC] border-2 border-black px-6 py-3 rounded-xl font-bold hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black whitespace-nowrap"
        >
          <Plus size={20} /> Add New Attire
        </button>
      </div>

      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#99AD7A] border-b-4 border-black text-black uppercase tracking-wider text-sm font-black">
                <th className="p-4 border-r-4 border-black">Image</th>
                <th className="p-4 border-r-4 border-black">Name</th>
                <th className="p-4 border-r-4 border-black">Region</th>
                <th className="p-4 border-r-4 border-black">Category</th>
                <th className="p-4 border-r-4 border-black">Price (₹)</th>
                <th className="p-4 border-r-4 border-black">Stock</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {attires.map((attire) => (
                <tr key={attire._id} className="border-b-4 border-black hover:bg-gray-50 transition-colors font-bold text-black">
                  <td className="p-4 border-r-4 border-black">
                    <img src={attire.image} alt={attire.name} className="w-16 h-16 object-cover border-2 border-black rounded" />
                  </td>
                  <td className="p-4 border-r-4 border-black">{attire.name}</td>
                  <td className="p-4 border-r-4 border-black">{attire.location}</td>
                  <td className="p-4 border-r-4 border-black">{attire.category}</td>
                  <td className="p-4 border-r-4 border-black">₹{attire.price}</td>
                  <td className="p-4 border-r-4 border-black">{attire.stock}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openModal(attire)}
                        className="p-2 bg-[#DCCCAC] text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(attire._id)}
                        className="p-2 bg-red-400 text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {attires.length === 0 && (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest">
                    No attires found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFF8EC] border-4 border-black rounded-2xl p-6 w-full max-w-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-black uppercase tracking-tight mb-6">
              {editingAttire ? 'Edit Attire' : 'Add New Attire'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Region / Location</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Bhagalpur, Mithila, Patna"
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Unisex">Unisex</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Stock</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Image URL</label>
                <input
                  type="text"
                  required
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://..."
                  className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-black mb-1 uppercase tracking-wider">Sizes (comma separated)</label>
                <input
                  type="text"
                  value={formData.sizes}
                  onChange={(e) => setFormData({ ...formData, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className="w-full bg-white border-2 border-black rounded-lg p-3 font-bold text-black focus:outline-none focus:ring-2 focus:ring-[#99AD7A]"
                />
              </div>

              <div className="flex justify-end gap-4 mt-8 pt-4 border-t-2 border-black/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-3 font-bold text-black uppercase tracking-wider hover:bg-black/5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#546B41] text-[#FFF8EC] border-2 border-black px-6 py-3 rounded-xl font-bold uppercase tracking-wider hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all"
                >
                  {editingAttire ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
