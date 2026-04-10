'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Heart, Trash2, Route as RouteIcon, FileDown, Navigation } from 'lucide-react';
import { jsPDF } from 'jspdf';

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

  const removeRoute = async (routeId: string) => {
    if (!confirm('Are you sure you want to delete this saved route?')) return;
    try {
      const response = await api.delete(`/users/routes/${routeId}`);
      setDashboardData((prev: any) => ({
        ...prev,
        savedRoutes: response.data.savedRoutes
      }));
    } catch (error) {
      console.error('Failed to remove route', error);
      alert('Failed to delete route.');
    }
  };

  const generatePDF = (route: any) => {
    const doc = new jsPDF();
    const date = new Date(route.dateSaved).toLocaleDateString();

    // Custom Styling mimicking our 4-colors
    doc.setFillColor(84, 107, 65); // #546B41 Olive
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 248, 236); // #FFF8EC Cream
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Bihar Tourism - Trip Route", 105, 25, { align: "center" });

    doc.setTextColor(0, 0, 0); // Black
    doc.setFontSize(16);
    doc.text(`Destination: ${route.destinationName}`, 20, 60);
    
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${date}`, 20, 75);
    doc.text(`Transit Mode: ${route.mode.toUpperCase()}`, 20, 85);
    
    doc.setFont("helvetica", "bold");
    doc.text(`Total Distance:`, 20, 105);
    doc.setFont("helvetica", "normal");
    doc.text(route.distance, 60, 105);

    doc.setFont("helvetica", "bold");
    doc.text(`Estimated Time:`, 20, 115);
    doc.setFont("helvetica", "normal");
    doc.text(route.duration, 60, 115);
    
    doc.setDrawColor(220, 204, 172); // #DCCCAC Sand
    doc.setLineWidth(1);
    doc.line(20, 130, 190, 130);

    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.text("Travel safely! Route calculations are strictly estimates.", 105, 145, { align: "center" });

    doc.save(`Bihar-Route-${route.destinationName.replace(/\s+/g, '-')}.pdf`);
  };

  const generateDestinationPDF = (dest: any) => {
    if (!dest) return;
    const doc = new jsPDF();
    
    doc.setFillColor(84, 107, 65);
    doc.rect(0, 0, 210, 40, 'F');
    
    doc.setTextColor(255, 248, 236);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Bihar Tourism - Destination Guide", 105, 25, { align: "center" });

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(18);
    doc.text(dest.name, 20, 60);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Location: ${dest.location || 'Bihar'}`, 20, 75);
    doc.text(`Best Season: ${dest.bestSeason || 'Year-round'}`, 20, 85);
    doc.text(`Entry Fee: ${dest.entryFee || 'Free/Varies'}`, 20, 95);

    doc.setFont("helvetica", "bold");
    doc.text(`About:`, 20, 115);
    
    doc.setFont("helvetica", "normal");
    const splitDescription = doc.splitTextToSize(dest.description || 'A beautiful destination in Bihar.', 170);
    doc.text(splitDescription, 20, 125);

    doc.save(`Destination-${dest.name.replace(/\s+/g, '-')}.pdf`);
  };

  if (isLoading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF8EC]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-[#546B41]"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#FFF8EC] py-12 font-poppins text-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#546B41] rounded-3xl shadow-xl overflow-hidden mb-8 border-4 border-[#DCCCAC]">
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-4xl font-extrabold text-[#FFF8EC]">Welcome, {user.name}!</h1>
            <p className="mt-2 text-[#DCCCAC] font-medium text-lg">Manage your trips, reviews, and saved routes below.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Favorites Section */}
          <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-[#546B41]/10 h-max">
            <h2 className="text-xl font-bold text-black mb-6 border-b border-[#546B41]/20 pb-4 flex items-center">
              <Heart className="w-6 h-6 mr-3 text-red-500 fill-current" /> My Saved Destinations
            </h2>
            {dashboardData?.favorites && dashboardData.favorites.length > 0 ? (
              <ul className="divide-y divide-gray-100">
                {dashboardData.favorites.map((dest: any) => (
                  <li key={dest._id} className="py-4 flex flex-col group">
                    <div className="flex justify-between items-start w-full">
                      <div>
                        <Link href={`/destinations/${dest._id}`} className="hover:text-[#546B41] font-bold text-gray-800 text-lg block transition">
                          {dest.name}
                        </Link>
                        <span className="text-sm text-gray-500 flex items-center mt-1 font-medium">
                          <MapPin className="w-4 h-4 mr-1 inline" /> {dest.location || dest.type}
                        </span>
                      </div>
                      <button 
                        onClick={() => removeFavorite(dest._id)} 
                        className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition"
                        title="Remove Destination"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                    <button
                      onClick={() => generateDestinationPDF(dest)}
                      className="mt-3 w-full bg-[#DCCCAC]/50 hover:bg-[#DCCCAC] text-black border border-[#546B41]/20 p-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-sm"
                    >
                      <FileDown size={14} /> Download PDF Guide
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 font-medium px-2">You haven't saved any destinations yet.</p>
            )}
            <div className="mt-6 px-2">
              <Link href="/destinations" className="text-[#546B41] hover:text-[#99AD7A] font-bold text-sm flex items-center transition">
                Explore Destinations <span aria-hidden="true" className="ml-1">&rarr;</span>
              </Link>
            </div>
          </div>

          {/* Saved Routes Section */}
          <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-[#546B41]/10 lg:col-span-2">
            <h2 className="text-xl font-bold text-black mb-6 border-b border-[#546B41]/20 pb-4 flex items-center">
              <RouteIcon className="w-6 h-6 mr-3 text-[#546B41]" /> My Saved Routes
            </h2>
            {dashboardData?.savedRoutes && dashboardData.savedRoutes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dashboardData.savedRoutes.slice().reverse().map((route: any) => (
                  <div key={route._id} className="bg-[#FFF8EC] rounded-2xl p-5 border border-[#546B41]/30 hover:shadow-lg transition-shadow relative overflow-hidden group">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#546B41]"></div>
                    
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="font-extrabold text-lg text-black line-clamp-1 flex items-center gap-2">
                        <Navigation size={18} className="text-[#546B41]"/> {route.destinationName}
                      </h3>
                      <button 
                        onClick={() => removeRoute(route._id)}
                        className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition opacity-0 group-hover:opacity-100"
                        title="Delete Route"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-black/60 font-bold uppercase tracking-wider mb-4 border-b border-[#546B41]/10 pb-2">Travel Mode: {route.mode}</p>
                    
                    <div className="flex justify-between items-end mb-6">
                      <div>
                        <p className="text-[10px] text-black/50 font-bold uppercase">Distance</p>
                        <p className="font-bold text-black">{route.distance}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-black/50 font-bold uppercase">Est. Time</p>
                        <p className="font-bold text-black">{route.duration}</p>
                      </div>
                    </div>

                    <button
                      onClick={() => generatePDF(route)}
                      className="w-full bg-[#546B41] hover:bg-[#99AD7A] text-[#FFF8EC] hover:text-black py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-sm"
                    >
                      <FileDown size={16} /> Export PDF
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 bg-[#FFF8EC] rounded-2xl border border-[#546B41]/20 border-dashed">
                <RouteIcon size={48} className="text-[#99AD7A] mb-4" />
                <p className="text-black font-bold text-lg mb-2">No Routes Saved</p>
                <p className="text-black/60 text-sm font-medium text-center">Use the Interactive Map to trace and save navigation paths.</p>
                <Link href="/map" className="mt-4 px-6 py-2 bg-[#546B41] text-[#FFF8EC] hover:bg-[#99AD7A] hover:text-black font-bold rounded-full transition-colors">
                  Go to Map
                </Link>
              </div>
            )}
          </div>
          
        </div>
      </div>
    </div>
  );
}
