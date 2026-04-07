'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth, User } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Star, Heart, Trash2 } from 'lucide-react';

export default function DashboardPage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard data', error);
    } finally {
      setLoadingData(false);
    }
  };

  const removeFavorite = async (destId: string) => {
    if (!confirm('Are you sure you want to remove this favorite?')) return;
    try {
      const response = await api.post(`/users/favorites/${destId}`);
      updateUser({ favorites: response.data.favorites });
      setDashboardData((prev: any) => ({
        ...prev,
        favorites: prev.favorites.filter((dest: any) => dest._id !== destId)
      }));
    } catch (error) {
      console.error('Failed to remove favorite', error);
      alert('Failed to remove favorite.');
    }
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-700"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="bg-green-700 px-6 py-8 sm:p-10">
            <h1 className="text-3xl font-bold text-white">Welcome, {user.name}!</h1>
            <p className="mt-2 text-green-100">Manage your trips, reviews, and favorite destinations below.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Favorites Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4 flex items-center">
              <Heart className="w-5 h-5 mr-2 text-red-500" /> My Favorite Destinations
            </h2>
            {dashboardData?.favorites && dashboardData.favorites.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {dashboardData.favorites.map((dest: any) => (
                  <li key={dest._id} className="py-4 flex justify-between items-center group">
                    <div>
                      <Link href={`/destinations/${dest._id}`} className="hover:text-green-600 font-medium text-gray-800 text-lg block">
                        {dest.name}
                      </Link>
                      <span className="text-sm text-gray-500 flex items-center mt-1">
                        <MapPin className="w-4 h-4 mr-1 inline" /> {dest.location || dest.type}
                      </span>
                    </div>
                    <button 
                      onClick={() => removeFavorite(dest._id)} 
                      className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none"
                      title="Remove Favorite"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic px-2">You haven't saved any destinations yet.</p>
            )}
            <div className="mt-6 px-2">
              <Link href="/destinations" className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center transition">
                Explore Destinations <span aria-hidden="true" className="ml-1">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Planned Trips Section */}
          <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-100">
            <h2 className="text-xl font-semibold text-gray-900 mb-6 border-b pb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2 text-blue-500" /> My Trip Plans
            </h2>
            {dashboardData?.createdTrips && dashboardData.createdTrips.length > 0 ? (
              <ul className="divide-y divide-gray-200">
                {dashboardData.createdTrips.map((trip: any) => (
                  <li key={trip._id} className="py-4">
                    <div className="font-medium text-gray-800">{trip.name}</div>
                    <div className="text-sm text-gray-500">{trip.days?.length || 0} days planned</div>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">You haven't created any trip plans yet.</p>
            )}
            <div className="mt-6">
              <Link href="/trip-planner" className="text-green-600 hover:text-green-800 font-medium text-sm flex items-center">
                Create a Trip Plan <span aria-hidden="true" className="ml-1">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
