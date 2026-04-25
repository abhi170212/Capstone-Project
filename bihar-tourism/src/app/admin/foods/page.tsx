'use client';

import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Loader2, Utensils, X } from 'lucide-react';
import api from '@/lib/api';

interface Shop {
  name: string;
  address: string;
}

interface Food {
  _id: string;
  name: string;
  description: string;
  location: string;
  ingredients: string[];
  recipe: string;
  famousShops: Shop[];
  image: string;
}

export default function AdminFoods() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFood, setEditingFood] = useState<Food | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    location: '',
    ingredients: '', // comma separated string for form
    recipe: '',
    famousShops: [{ name: '', address: '' }],
    image: '',
  });

  useEffect(() => {
    fetchFoods();
  }, []);

  const fetchFoods = async () => {
    try {
      const res = await api.get('/foods');
      setFoods(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (food?: Food) => {
    if (food) {
      setEditingFood(food);
      setFormData({
        name: food.name,
        description: food.description,
        location: food.location,
        ingredients: food.ingredients.join(', '),
        recipe: food.recipe,
        famousShops: food.famousShops.length > 0 ? [...food.famousShops] : [{ name: '', address: '' }],
        image: food.image,
      });
    } else {
      setEditingFood(null);
      setFormData({
        name: '',
        description: '',
        location: '',
        ingredients: '',
        recipe: '',
        famousShops: [{ name: '', address: '' }],
        image: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleShopChange = (index: number, field: keyof Shop, value: string) => {
    const newShops = [...formData.famousShops];
    newShops[index][field] = value;
    setFormData({ ...formData, famousShops: newShops });
  };

  const addShopField = () => {
    setFormData({ ...formData, famousShops: [...formData.famousShops, { name: '', address: '' }] });
  };

  const removeShopField = (index: number) => {
    const newShops = formData.famousShops.filter((_, i) => i !== index);
    setFormData({ ...formData, famousShops: newShops });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...formData,
      ingredients: formData.ingredients.split(',').map((s) => s.trim()).filter(s => s),
      famousShops: formData.famousShops.filter(s => s.name.trim() && s.address.trim())
    };

    try {
      if (editingFood) {
        await api.put(`/foods/${editingFood._id}`, payload);
      } else {
        await api.post('/foods', payload);
      }
      setIsModalOpen(false);
      fetchFoods();
    } catch (err) {
      console.error(err);
      alert('Failed to save food');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this food item?')) {
      try {
        await api.delete(`/foods/${id}`);
        fetchFoods();
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
      <div className="bg-[#FFF8EC] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight flex items-center gap-4">
            <Utensils className="w-10 h-10 text-[#546B41]" />
            Manage Cuisine
          </h1>
          <p className="text-[#546B41] font-bold mt-2">
            Add, edit, and remove traditional foods and famous shops.
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="bg-[#DCCCAC] border-2 border-black px-6 py-3 rounded-xl font-bold hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all flex items-center gap-2 text-black whitespace-nowrap uppercase tracking-wider"
        >
          <Plus size={20} /> Add Food
        </button>
      </div>

      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#99AD7A] border-b-4 border-black text-black uppercase tracking-wider text-sm font-black">
                <th className="p-4 border-r-4 border-black">Image</th>
                <th className="p-4 border-r-4 border-black">Name</th>
                <th className="p-4 border-r-4 border-black">Destination</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {foods.map((food) => (
                <tr key={food._id} className="border-b-4 border-black hover:bg-gray-50 transition-colors font-bold text-black">
                  <td className="p-4 border-r-4 border-black">
                    <img src={food.image} alt={food.name} className="w-16 h-16 object-cover border-2 border-black rounded" />
                  </td>
                  <td className="p-4 border-r-4 border-black">{food.name}</td>
                  <td className="p-4 border-r-4 border-black">{food.location}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => openModal(food)}
                        className="p-2 bg-[#DCCCAC] text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(food._id)}
                        className="p-2 bg-red-400 text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {foods.length === 0 && (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest border-b-4 border-black">
                    No foods found.
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
              {editingFood ? 'Edit Food' : 'Add New Food'}
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
                  <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Destination</label>
                  <input
                    type="text"
                    required
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g. Patna, Gaya, Nalanda"
                    className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Description</label>
                <textarea
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Ingredients (comma separated)</label>
                <input
                  type="text"
                  value={formData.ingredients}
                  onChange={(e) => setFormData({ ...formData, ingredients: e.target.value })}
                  placeholder="Wheat flour, Sattu, Ghee"
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
                />
              </div>

              <div>
                <label className="block text-sm font-black text-black mb-2 uppercase tracking-wider">Recipe</label>
                <textarea
                  required
                  value={formData.recipe}
                  onChange={(e) => setFormData({ ...formData, recipe: e.target.value })}
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

              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-black text-black uppercase tracking-wider">Famous Shops</label>
                  <button type="button" onClick={addShopField} className="text-xs font-bold uppercase tracking-wider bg-black text-white px-2 py-1 rounded">
                    + Add Shop
                  </button>
                </div>
                <div className="space-y-3">
                  {formData.famousShops.map((shop, index) => (
                    <div key={index} className="flex gap-2 items-center">
                      <input
                        type="text"
                        placeholder="Shop Name"
                        value={shop.name}
                        onChange={(e) => handleShopChange(index, 'name', e.target.value)}
                        className="flex-1 bg-white border-2 border-black rounded-lg p-2 font-bold text-black focus:outline-none"
                      />
                      <input
                        type="text"
                        placeholder="Address"
                        value={shop.address}
                        onChange={(e) => handleShopChange(index, 'address', e.target.value)}
                        className="flex-1 bg-white border-2 border-black rounded-lg p-2 font-bold text-black focus:outline-none"
                      />
                      {formData.famousShops.length > 1 && (
                        <button type="button" onClick={() => removeShopField(index)} className="p-2 bg-red-400 border-2 border-black rounded-lg text-black">
                          <X size={16} />
                        </button>
                      )}
                    </div>
                  ))}
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
                  {editingFood ? 'Update' : 'Save'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
