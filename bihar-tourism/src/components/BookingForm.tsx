'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { bookingApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Calendar, Users, Mail, Phone, User, MessageSquare, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface BookingFormProps {
  destinationId: string;
  destinationName: string;
  pricePerPerson: number;
  onClose: () => void;
}

export default function BookingForm({ destinationId, destinationName, pricePerPerson, onClose }: BookingFormProps) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    bookingType: 'tour' as 'hotel' | 'tour' | 'package',
    startDate: '',
    endDate: '',
    guests: 1,
    contactName: user?.name || '',
    contactEmail: user?.email || '',
    contactPhone: '',
    specialRequests: '',
  });

  const totalPrice = formData.guests * pricePerPerson;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await bookingApi.create({
        bookingType: formData.bookingType,
        destinationId,
        title: `${formData.bookingType} - ${destinationName}`,
        startDate: formData.startDate,
        endDate: formData.endDate,
        guests: formData.guests,
        pricePerPerson,
        contactInfo: {
          name: formData.contactName,
          email: formData.contactEmail,
          phone: formData.contactPhone,
        },
        specialRequests: formData.specialRequests,
      });

      setSuccess(true);
      toast.success('Booking confirmed! A confirmation will be sent to your email.');
      setTimeout(() => {
        onClose();
      }, 3000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create booking');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-2xl p-8 text-center"
      >
        <CheckCircle size={64} className="mx-auto text-green-500 mb-4" />
        <h3 className="text-2xl font-bold text-gray-800 mb-2">Booking Successful!</h3>
        <p className="text-gray-600 mb-4">
          Your booking for {destinationName} has been confirmed.
        </p>
        <p className="text-sm text-gray-500">
          A confirmation email will be sent to {formData.contactEmail}
        </p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl p-6 space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-gray-800">Book Your Trip</h3>
        <button
          type="button"
          onClick={onClose}
          className="text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>
      </div>

      {/* Booking Type */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Booking Type
        </label>
        <select
          value={formData.bookingType}
          onChange={(e) => setFormData({ ...formData, bookingType: e.target.value as any })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
        >
          <option value="tour">Tour</option>
          <option value="hotel">Hotel</option>
          <option value="package">Package</option>
        </select>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            End Date
          </label>
          <input
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
            min={formData.startDate || new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      {/* Guests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <Users size={16} className="inline mr-1" /> Number of Guests
        </label>
        <input
          type="number"
          value={formData.guests}
          onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          required
          min="1"
          max="50"
        />
      </div>

      {/* Contact Info */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <User size={16} className="inline mr-1" /> Full Name
          </label>
          <input
            type="text"
            value={formData.contactName}
            onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Mail size={16} className="inline mr-1" /> Email
          </label>
          <input
            type="email"
            value={formData.contactEmail}
            onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            <Phone size={16} className="inline mr-1" /> Phone Number
          </label>
          <input
            type="tel"
            value={formData.contactPhone}
            onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Special Requests */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <MessageSquare size={16} className="inline mr-1" /> Special Requests (Optional)
        </label>
        <textarea
          value={formData.specialRequests}
          onChange={(e) => setFormData({ ...formData, specialRequests: e.target.value })}
          className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
          rows={3}
          placeholder="Any special requirements or preferences..."
        />
      </div>

      {/* Price Summary */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-xl border border-green-100">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Price per person</span>
          <span className="font-semibold">₹{pricePerPerson}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-600">Guests</span>
          <span className="font-semibold">{formData.guests}</span>
        </div>
        <div className="border-t border-green-200 pt-2 mt-2">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-800">Total Price</span>
            <span className="text-2xl font-bold text-green-600">₹{totalPrice}</span>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
      >
        {loading ? 'Processing...' : `Book Now - ₹${totalPrice}`}
      </button>
    </form>
  );
}
