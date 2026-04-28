'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Heart, Trash2, Route as RouteIcon, FileDown, Navigation, Camera, ShieldAlert, CheckCircle, Ban, Edit3, Image as ImageIcon, Sparkles, UploadCloud, User as UserIcon, Star, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { jsPDF } from 'jspdf';
import PostCard from '@/components/PostCard';
import toast from 'react-hot-toast';

type TabState = 'routes' | 'social' | 'admin';

export default function DashboardPage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabState>('routes');
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Social State
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [myItineraries, setMyItineraries] = useState<any[]>([]);
  const [selectedItinerary, setSelectedItinerary] = useState<any>(null);
  const [newPost, setNewPost] = useState({ caption: '', location: '', category: 'General' });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  // Admin State
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Pre-load location options to avoid mismatch
  const [destinations, setDestinations] = useState<any[]>([]);

  // Profile State Setup (AI Avatar + Info)
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [activeProfileTab, setActiveProfileTab] = useState<'upload' | 'generate'>('upload');
  const [editBio, setEditBio] = useState('');
  const [aiPrompt, setAiPrompt] = useState('');
  const [profileAvatarFile, setProfileAvatarFile] = useState<File | null>(null);
  const [previewAvatar, setPreviewAvatar] = useState('');
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  useEffect(() => {
    if(user) {
      setPreviewAvatar(user.avatar || '');
      setEditBio(user.bio || '');
    }
  }, [user]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchMyPosts();
      fetchMyItineraries();
      fetchDestinationsList();
      if (user.role === 'admin') {
        fetchAllUsers();
      }
    }
  }, [user]);

  const fetchDestinationsList = async () => {
    try {
      const res = await api.get('/destinations');
      setDestinations(res.data.data || []);
      if(res.data.data?.length > 0) {
        setNewPost(prev => ({...prev, location: res.data.data[0].name}));
      }
    } catch(err){}
  };

  // --- Core API Fetches ---
  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/users/dashboard');
      setDashboardData(response.data);
    } catch (error) {
      console.error('Failed to fetch dashboard', error);
    } finally {
      setLoadingData(false);
    }
  };

  const fetchMyPosts = async () => {
    if(!user) return;
    try {
      const res = await api.get(`/posts/user/${user._id}`);
      setMyPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch my posts', err);
    }
  };

  const fetchMyItineraries = async () => {
    if(!user) return;
    try {
      const res = await api.get('/itineraries/my');
      setMyItineraries(res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch itineraries', err);
    }
  };

  const fetchAllUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setAllUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users', err);
    }
  };

  // --- Handlers ---
  const removeFavorite = async (destId: string) => {
    if (!confirm('Are you sure you want to remove this favorite?')) return;
    try {
      const response = await api.post(`/users/favorites/${destId}`);
      updateUser({ favorites: response.data.favorites });
      setDashboardData((prev: any) => ({
        ...prev,
        favorites: prev.favorites.filter((dest: any) => dest._id !== destId)
      }));
      toast.success('Destination removed from favorites.');
    } catch (error) {
      console.error('Failed to remove favorite', error);
      toast.error('Failed to remove favorite.');
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
      toast.success('Route deleted successfully.');
    } catch (error) {
      console.error('Failed to remove route', error);
      toast.error('Failed to delete route.');
    }
  };

  const deleteItinerary = async (id: string) => {
    if (!confirm('Are you sure you want to delete this trip itinerary?')) return;
    try {
      await api.delete(`/itineraries/${id}`);
      setMyItineraries(myItineraries.filter(itin => itin._id !== id));
      toast.success('Itinerary deleted.');
    } catch (err) {
      console.error('Failed to delete itinerary', err);
      toast.error('Failed to delete itinerary.');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) {
      toast.error('Please select at least one image.');
      return;
    }
    
    setIsPosting(true);
    try {
      const formData = new FormData();
      selectedFiles.forEach(file => formData.append('images', file));

      // 1. Upload files to disk
      const uploadRes = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const validImages = uploadRes.data.paths;

      // 2. Transmit metadata payload
      const res = await api.post('/posts', {
        ...newPost,
        images: validImages
      });
      // Immediately inject new post with current user populated manually to avoid immediate refetch
      setMyPosts([{ ...res.data, user: { _id: user?._id, name: user?.name, avatar: '' }, comments: [] }, ...myPosts]);
      
      setNewPost({ caption: '', location: '', category: 'General' });
      setSelectedFiles([]);
      toast.success('Post successfully uploaded!');
    } catch(err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const deletePost = async (id: string) => {
    if(!confirm("Erase this post permanently?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setMyPosts(myPosts.filter(p => p._id !== id));
      toast.success('Post deleted.');
    } catch(err) {
      toast.error("Failed to delete post");
    }
  };

  const toggleBan = async (uId: string, currentBanState: boolean) => {
    if(!confirm(`Are you sure you want to ${currentBanState ? 'Unban' : 'Ban'} this user?`)) return;
    try {
      await api.put(`/admin/users/${uId}/${currentBanState ? 'unban' : 'ban'}`);
      setAllUsers(allUsers.map(u => u._id === uId ? {...u, isBanned: !currentBanState} : u));
      toast.success(`User ${currentBanState ? 'unbanned' : 'banned'} successfully.`);
    } catch(err: any) {
      toast.error(err.response?.data?.message || "Failed changing ban state");
    }
  };

  const handleGenerateAvatar = async () => {
    if(!aiPrompt.trim()) {
      toast.error("Enter an AI generation prompt style!");
      return;
    }
    setIsUpdatingProfile(true);
    try {
      const res = await api.post('/users/generate-avatar', { prompt: aiPrompt });
      setPreviewAvatar(res.data.url);
      setProfileAvatarFile(null); // Clear physical upload context
      toast.success('AI avatar generated!');
    } catch(err) {
      toast.error("AI Image generation failure");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const handleSaveProfile = async () => {
    setIsUpdatingProfile(true);
    let finalAvatar = previewAvatar;
    try {
      if (profileAvatarFile) {
        const formData = new FormData();
        formData.append('images', profileAvatarFile);
        const uploadRes = await api.post('/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' }});
        finalAvatar = uploadRes.data.paths[0]; // Intercept file from standard multi-uploader bounds
      }
      const res = await api.put('/users/profile', { avatar: finalAvatar, bio: editBio });
      updateUser({ ...user, avatar: res.data.avatar, bio: res.data.bio, name: res.data.name });
      setShowProfileModal(false);
      toast.success('Profile updated successfully!');
    } catch(err) {
      toast.error("Failed to commit profile updates");
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const generatePDF = (route: any) => {
    const doc = new jsPDF();
    const date = new Date(route.dateSaved).toLocaleDateString();
    doc.setFillColor(84, 107, 65); 
    doc.rect(0, 0, 210, 40, 'F');
    doc.setTextColor(255, 248, 236);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Bihar Tourism - Trip Route", 105, 25, { align: "center" });
    doc.setTextColor(0, 0, 0); 
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
    doc.setDrawColor(220, 204, 172); 
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
        
        {/* Layered Profile Banner replacing basic Header Ribbon */}
        <motion.div 
           initial={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
           animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
           className="relative bg-[#546B41] rounded-3xl shadow-2xl mb-8 border-4 border-[#DCCCAC] overflow-hidden group"
        >
          {/* Layered Glass Map Background Component via SVG Data */}
          <div 
             className="absolute inset-0 opacity-[0.15] bg-cover bg-center transition-transform duration-[1500ms] group-hover:scale-110 ease-out mix-blend-overlay"
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill='%23FFF8EC' d='M44.7,-76.4C58.8,-69.2,71.8,-59.1,81.4,-46.2C91,-33.3,97.3,-16.6,98.1,0.5C98.9,17.6,94.2,35.2,84.1,50.1C74.1,65,58.7,77.3,42,83.8C25.3,90.3,7.3,91,-9.7,88C-26.7,85,-42.6,78.3,-56.9,67.8C-71.1,57.3,-83.7,43,-90.6,26.2C-97.4,9.4,-98.6,-9.9,-92.9,-27C-87.3,-44.1,-75,-59,-60.1,-66.5C-45.2,-74,-22.6,-74.1,-3.5,-68.2C15.6,-62.3,31.2,-60,44.7,-76.4Z' transform='translate(100 100)' /%3E%3C/svg%3E")` }}
          />
          <div className="absolute inset-x-0 bottom-0 top-1/2 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"/>

          <div className="relative px-6 py-12 sm:px-12 flex flex-col md:flex-row items-center gap-8 md:gap-12">
            {/* Massive Extruded Avatar */}
            <div className="relative z-10 flex-shrink-0">
              <div className="w-32 h-32 md:w-44 md:h-44 rounded-full border-[6px] border-[#DCCCAC] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] bg-[#FFF8EC] group-hover:border-[#99AD7A] transition-colors duration-500 relative">
                {user.role === 'guest' && (
                  <div className="absolute inset-[2px] rounded-full border-[6px] border-dashed border-[#546B41] animate-[spin_8s_linear_infinite] z-20 pointer-events-none" />
                )}
                {user.avatar ? (
                   <img src={user.avatar} className="w-full h-full object-cover relative z-10" alt="Profile"/>
                ) : (
                   <div className="w-full h-full flex items-center justify-center bg-black/10 text-[#546B41] relative z-10">
                     <UserIcon size={72}/>
                   </div>
                )}
            </div>
            </div>

            {/* Profile Info Metadata */}
            <div className="text-center md:text-left flex-1 text-[#FFF8EC] z-10">
               <h1 className="text-4xl md:text-6xl font-black mb-1 flex flex-wrap justify-center md:justify-start items-center gap-4 tracking-tighter">
                 {user.name ? user.name.charAt(0).toUpperCase() + user.name.slice(1).toLowerCase() : ''}
                 
                 <button 
                   onClick={() => setShowProfileModal(true)}
                   className="bg-white/10 hover:bg-[#DCCCAC] hover:text-black text-white px-4 py-2 rounded-full text-sm font-black tracking-widest uppercase shadow-lg inline-flex items-center gap-2 border border-white/20 transition-all ml-2"
                   title="Edit Profile"
                 >
                   <Edit3 size={16} /> Edit Profile
                 </button>
                 {user.role === 'admin' && (
                    <span className="bg-red-600 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] shadow-lg inline-flex items-center gap-2 uppercase border border-red-400/50 -translate-y-1">
                      <ShieldAlert size={14}/> Systems Administrator
                    </span>
                 )}
                 {user.role === 'coadmin' && (
                    <span className="bg-orange-500 text-white px-4 py-1.5 rounded-full text-[10px] sm:text-xs font-black tracking-[0.2em] shadow-lg inline-flex items-center gap-2 uppercase border border-orange-400/50 -translate-y-1">
                      <ShieldAlert size={14}/> Co-Administrator
                    </span>
                 )}
               </h1>
               <div className="flex justify-center md:justify-start gap-1 mb-4">
                 {user.role === 'admin' && [...Array(3)].map((_, i) => <Star key={i} size={20} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />)}
                 {user.role === 'coadmin' && [...Array(2)].map((_, i) => <Star key={i} size={20} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />)}
                 {user.role === 'guest' && <Star size={20} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />}
               </div>
               <p className="text-[#FFF8EC] font-medium text-lg md:text-xl max-w-2xl mb-8 opacity-95 border-l-4 border-[#99AD7A] pl-5 md:pl-6 leading-relaxed">
                 {user.bio || "Explorer of Bihar. Uncovering hidden histories and spiritual sanctuaries. Add a biography to introduce your traveler journey!"}
               </p>
               
               <div className="flex flex-wrap justify-center md:justify-start gap-4 md:gap-6 w-full">
                 <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-lg group-hover:bg-black/60 transition-colors">
                   <Navigation className="text-[#99AD7A]" size={20}/>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Navigations</p>
                     <p className="font-black text-xl">{dashboardData?.savedRoutes?.length || 0}</p>
                   </div>
                 </div>
                 <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-lg group-hover:bg-black/60 transition-colors">
                   <Camera className="text-[#DCCCAC]" size={20}/>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Publications</p>
                     <p className="font-black text-xl">{myPosts.length}</p>
                   </div>
                 </div>
                 <div className="bg-black/40 backdrop-blur-md px-6 py-3 rounded-2xl flex items-center gap-3 border border-white/10 shadow-lg group-hover:bg-black/60 transition-colors">
                   <MapPin className="text-red-400" size={20}/>
                   <div>
                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Bookmarked</p>
                     <p className="font-black text-xl">{dashboardData?.favorites?.length || 0}</p>
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 overflow-x-auto mb-8 border-b-2 border-[#546B41]/10 pb-4 no-scrollbar">
          <button 
            onClick={() => setActiveTab('routes')}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ${activeTab === 'routes' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
          >
            Planning & Routes
          </button>
          <button 
            onClick={() => setActiveTab('social')}
            className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'social' ? 'bg-[#546B41] text-[#FFF8EC] shadow-md' : 'bg-white text-gray-500 hover:bg-gray-100'}`}
          >
            <Camera size={18}/> My Social Posts
          </button>
          
          {user.role === 'admin' && (
            <button 
              onClick={() => setActiveTab('admin')}
              className={`px-6 py-3 rounded-full font-bold whitespace-nowrap transition-colors ml-auto grid-flow-col gap-2 flex items-center border ${activeTab === 'admin' ? 'bg-red-50 border-red-500 text-red-600 shadow-md' : 'bg-white text-gray-500 hover:bg-red-50 hover:text-red-600 border-transparent'}`}
            >
              <ShieldAlert size={18}/> Moderation Panel
            </button>
          )}
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div 
             key={activeTab}
             initial={{ opacity: 0, y: 30 }}
             animate={{ opacity: 1, y: 0 }}
             exit={{ opacity: 0, scale: 0.98 }}
             transition={{ duration: 0.3 }}
          >
            {/* TAB 1: ROUTES AND SAVES */}
            {activeTab === 'routes' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Favorites Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#546B41]/10 h-max">
                  <h2 className="text-xl font-black text-black mb-6 border-b-2 border-gray-100 pb-4 flex items-center tracking-tight">
                    <Heart className="w-6 h-6 mr-3 text-red-500 fill-current" /> Saved Destinations
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
                              <span className="text-sm text-gray-500 flex items-center mt-1 font-medium bg-gray-50 w-max px-2 py-0.5 rounded-md">
                                <MapPin className="w-3 h-3 mr-1 inline text-[#546B41]" /> {dest.location || dest.type}
                              </span>
                            </div>
                            <button onClick={() => removeFavorite(dest._id)}  className="text-gray-300 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition" title="Remove Destination">
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>
                          <button onClick={() => generateDestinationPDF(dest)} className="mt-4 w-full bg-[#DCCCAC]/20 hover:bg-[#546B41] text-black hover:text-[#FFF8EC] border border-[#546B41]/10 p-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-sm">
                            <FileDown size={14} /> Download PDF Guide
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 font-medium px-2 py-8 text-center bg-gray-50 rounded-2xl">You haven't bookmarked anything yet.</p>
                  )}
                </div>

                {/* Saved Routes Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#546B41]/10 lg:col-span-2">
                  <h2 className="text-xl font-black text-black mb-6 border-b-2 border-gray-100 pb-4 flex items-center tracking-tight">
                    <RouteIcon className="w-6 h-6 mr-3 text-[#546B41]" /> Generated Navigations
                  </h2>
                  {dashboardData?.savedRoutes && dashboardData.savedRoutes.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      {dashboardData.savedRoutes.slice().reverse().map((route: any) => (
                        <div key={route._id} className="bg-[#FFF8EC] rounded-2xl p-6 border border-[#546B41]/20 hover:shadow-xl hover:border-[#546B41]/50 transition-all relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#546B41] to-[#DCCCAC]"></div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-extrabold text-lg text-black line-clamp-1 flex items-center gap-2">
                              <Navigation size={18} className="text-[#546B41]"/> {route.destinationName}
                            </h3>
                            <button onClick={() => removeRoute(route._id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-full bg-white hover:bg-red-50 transition opacity-0 group-hover:opacity-100 shadow-sm" title="Delete Route">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <p className="text-xs text-[#546B41] font-black uppercase tracking-widest mb-5 border-b border-[#546B41]/10 pb-3">Mode: {route.mode}</p>
                          <button onClick={() => generatePDF(route)} className="w-full bg-black hover:bg-[#99AD7A] text-[#FFF8EC] hover:text-black py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-md">
                            <FileDown size={16} /> Export Route Matrix
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-[#FFF8EC] rounded-3xl border-2 border-[#546B41]/20 border-dashed">
                      <RouteIcon size={48} className="mx-auto text-[#DCCCAC] mb-4"/>
                      <p className="text-black font-extrabold text-xl mb-2">No Routes Available</p>
                      <p className="text-gray-500">Go to Destinations to generate your first travel map.</p>
                    </div>
                  )}
                </div>

                {/* Custom Itineraries Section */}
                <div className="bg-white rounded-3xl shadow-xl p-6 border border-[#546B41]/10 lg:col-span-3">
                  <h2 className="text-xl font-black text-black mb-6 border-b-2 border-gray-100 pb-4 flex items-center tracking-tight">
                    <Calendar className="w-6 h-6 mr-3 text-[#546B41]" /> Custom Trip Itineraries
                  </h2>
                  {myItineraries.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                      {myItineraries.map((itin: any) => (
                        <div key={itin._id} className="bg-[#FFF8EC] rounded-2xl p-6 border border-[#546B41]/20 hover:shadow-xl hover:border-[#546B41]/50 transition-all relative overflow-hidden group">
                          <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-[#DCCCAC] to-[#546B41]"></div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="font-extrabold text-lg text-black line-clamp-1">{itin.name}</h3>
                            <button onClick={() => deleteItinerary(itin._id)} className="text-gray-300 hover:text-red-500 p-1.5 rounded-full bg-white hover:bg-red-50 transition opacity-0 group-hover:opacity-100 shadow-sm" title="Delete Itinerary">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          <div className="flex justify-between items-center text-xs text-[#546B41] font-black uppercase tracking-widest mb-5 border-b border-[#546B41]/10 pb-3">
                            <span>{itin.days.length} Days Planned</span>
                            {itin.createdAt && (
                              <span className="text-[10px] text-gray-400 tracking-wider">
                                {new Date(itin.createdAt).toLocaleDateString()} • {new Date(itin.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                              </span>
                            )}
                          </div>
                          <div className="space-y-2 mb-4">
                            {itin.days.slice(0, 2).map((day: any) => (
                              <p key={day.day} className="text-xs text-gray-600 font-medium line-clamp-1">
                                <span className="font-bold text-black">Day {day.day}:</span> {day.activities.length} activities
                              </p>
                            ))}
                            {itin.days.length > 2 && <p className="text-xs text-gray-400 italic">...and more</p>}
                          </div>
                          <button onClick={() => setSelectedItinerary(itin)} className="w-full bg-[#546B41] text-[#FFF8EC] py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black transition-colors shadow-md group-hover:-translate-y-0.5">
                            Open Matrix
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center p-12 bg-[#FFF8EC] rounded-3xl border-2 border-[#546B41]/20 border-dashed">
                      <Calendar size={48} className="mx-auto text-[#DCCCAC] mb-4"/>
                      <p className="text-black font-extrabold text-xl mb-2">No Trip Plans</p>
                      <p className="text-gray-500 mb-4">Use the Strategic Planner to build your custom itinerary.</p>
                      <Link href="/trip-planner" className="inline-block bg-[#546B41] text-white px-6 py-2 rounded-xl font-bold hover:bg-black transition-colors">Go to Planner</Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: SOCIAL */}
            {activeTab === 'social' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Upload Module */}
                <div className="bg-white rounded-3xl shadow-xl p-8 border border-[#546B41]/10 h-max lg:col-span-1">
                  <h2 className="text-xl font-black text-black mb-6 border-b-2 border-gray-100 pb-4 flex items-center tracking-tight">
                    <Camera className="w-6 h-6 mr-3 text-[#546B41]" /> Deploy Content
                  </h2>
                  <form onSubmit={handleCreatePost} className="space-y-6">
                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Select Media (Max 10)</label>
                      <input 
                        type="file" 
                        accept="image/*"
                        multiple
                        className="w-full text-sm text-black file:mr-4 file:py-3 file:px-6 file:rounded-xl file:border-0 file:text-sm file:font-black file:bg-[#546B41]/10 file:text-[#546B41] hover:file:bg-[#546B41] hover:file:text-white cursor-pointer transition-colors"
                        onChange={(e) => {
                           if(e.target.files) {
                             setSelectedFiles(Array.from(e.target.files).slice(0, 10));
                           }
                        }}
                      />
                      {selectedFiles.length > 0 && <p className="text-sm font-bold text-[#546B41] mt-3">✔️ {selectedFiles.length} file(s) attached</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Pin Location</label>
                      <select 
                        value={newPost.location} 
                        onChange={e => setNewPost({...newPost, location: e.target.value})} 
                        className="w-full border-2 border-gray-100 rounded-xl p-3.5 bg-gray-50 text-sm font-bold text-black outline-none focus:border-[#546B41] focus:bg-white transition-all shadow-inner" 
                        required
                      >
                        <option value="" disabled>Exact Database Match Required</option>
                        {destinations.map(d => (
                           <option key={d._id} value={d.name}>{d.name}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-black text-gray-500 uppercase tracking-widest mb-2">Caption Story</label>
                      <textarea rows={4} value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} className="w-full border-2 border-gray-100 rounded-xl p-3.5 bg-gray-50 text-sm font-bold text-black outline-none focus:border-[#546B41] focus:bg-white transition-all shadow-inner resize-none" placeholder="What did you discover today?"/>
                    </div>

                    <div className="pt-4">
                      <button type="submit" disabled={isPosting} className="w-full py-4 bg-[#546B41] text-[#FFF8EC] rounded-2xl font-black text-lg tracking-widest hover:bg-black transition-all disabled:opacity-50 shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        {isPosting ? 'UPLOADING...' : 'PUBLISH LIVE'}
                      </button>
                    </div>
                  </form>
                </div>

                {/* My Feed */}
                <div className="lg:col-span-2 space-y-8">
                  <h2 className="text-3xl font-black text-black mb-4 flex items-center">
                    Digital Experience Feed
                  </h2>
                  {myPosts.length > 0 ? (
                    <div className="space-y-8">
                      {myPosts.map(post => (
                        <PostCard 
                          key={post._id} 
                          post={post} 
                          currentUser={user} 
                          onDelete={deletePost}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="bg-white rounded-3xl p-16 text-center border-2 border-dashed border-[#546B41]/20 shadow-sm">
                      <Camera size={64} className="mx-auto text-[#DCCCAC] mb-6" />
                      <p className="text-black font-black text-2xl mb-2">Empty Gallery</p>
                      <p className="text-gray-500 font-medium">Publish your first travel snapshot to build your identity.</p>
                    </div>
                  )}
                </div>
                
              </div>
            )}

            {/* TAB 3: ADMIN MODERATION */}
            {activeTab === 'admin' && user.role === 'admin' && (
              <div className="bg-white border-2 border-red-500/20 rounded-3xl shadow-2xl overflow-hidden p-8 relative">
                <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-red-600 to-orange-500"></div>
                <h2 className="text-3xl font-black text-black mb-8 flex items-center gap-4 pb-6 border-b-2 border-gray-100">
                  <ShieldAlert className="text-red-500 w-10 h-10"/> Administrative Enforcements
                </h2>
                
                <div className="overflow-x-auto rounded-2xl border border-gray-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-100 text-gray-500 text-xs font-black uppercase tracking-widest">
                        <th className="p-5 border-b">Matrix ID</th>
                        <th className="p-5 border-b">Communications</th>
                        <th className="p-5 border-b">Override</th>
                        <th className="p-5 border-b">Status</th>
                        <th className="p-5 border-b">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allUsers.map((u: any) => (
                        <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-5 font-black text-[#546B41] text-sm tabular-nums">{u.name}</td>
                          <td className="p-5 text-gray-500 font-medium text-sm">{u.email}</td>
                          <td className="p-5">
                            <span className={`px-3 py-1.5 rounded-lg text-xs font-black tracking-wider ${u.role === 'admin' ? 'bg-purple-100 text-purple-700 shadow-sm' : 'bg-blue-50 text-blue-600'}`}>
                              {u.role.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-5">
                            {u.isBanned ? (
                              <span className="flex items-center gap-1.5 text-red-600 font-black text-xs bg-red-100 px-3 py-1.5 rounded-lg shadow-sm w-max uppercase tracking-wider">
                                <Ban size={14}/> Banned Layer
                              </span>
                            ) : (
                              <span className="flex items-center gap-1.5 text-emerald-600 font-black text-xs bg-emerald-100 px-3 py-1.5 rounded-lg shadow-sm w-max uppercase tracking-wider">
                                <CheckCircle size={14}/> Secure
                              </span>
                            )}
                          </td>
                          <td className="p-5">
                            {u.role !== 'admin' && (
                              <button 
                                onClick={() => toggleBan(u._id, !!u.isBanned)}
                                className={`px-5 py-2.5 rounded-xl font-black text-[10px] tracking-widest uppercase transition-all shadow-md ${u.isBanned ? 'bg-black text-white hover:bg-gray-800' : 'bg-red-500 text-white hover:bg-red-600 hover:-translate-y-0.5'}`}
                              >
                               {u.isBanned ? 'Authorize Key' : 'Initiate Ban'}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Modal Interceptor Profile Editor */}
        <AnimatePresence>
           {showProfileModal && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div 
                   initial={{ scale: 0.9, y: 20, opacity: 0 }}
                   animate={{ scale: 1, y: 0, opacity: 1 }}
                   exit={{ scale: 0.9, y: 20, opacity: 0 }}
                   className="bg-[#FFF8EC] rounded-[2rem] w-full max-w-xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col relative border border-[#546B41]/20"
                >
                  {/* Modal Header */}
                  <div className="bg-[#546B41] text-[#FFF8EC] px-8 py-6 flex justify-between items-center relative overflow-hidden">
                    <div className="absolute -right-4 -top-10 opacity-20"><Sparkles size={120}/></div>
                    <h3 className="text-2xl font-black flex items-center gap-3 relative z-10 tracking-tight">Studio Configuration</h3>
                    <button onClick={() => setShowProfileModal(false)} className="relative z-10 text-[#DCCCAC] hover:text-white font-black text-sm uppercase tracking-widest transition-colors bg-black/20 px-4 py-2 rounded-full hover:bg-black/40">Close</button>
                  </div>
                  
                  <div className="p-8 flex flex-col gap-6 relative">
                    {/* Live Preview Display Engine */}
                    <div className="mx-auto w-36 h-36 rounded-full border-4 border-[#546B41] bg-[#DCCCAC] overflow-hidden shadow-xl mb-4 relative z-10">
                       {previewAvatar ? (
                          <img src={previewAvatar} className="w-full h-full object-cover" />
                       ) : (
                          <div className="w-full h-full flex items-center justify-center"><UserIcon size={48} className="text-[#546B41]"/></div>
                       )}
                       
                       {/* Upload Spinner Overlay */}
                       <AnimatePresence>
                         {isUpdatingProfile && (
                           <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-full">
                             <div className="animate-spin rounded-full border-4 border-[#DCCCAC] border-t-transparent w-10 h-10"></div>
                           </motion.div>
                         )}
                       </AnimatePresence>
                    </div>

                    {/* Mode Switching Tabs */}
                    <div className="grid grid-cols-2 bg-[#DCCCAC]/30 p-1.5 rounded-2xl">
                      <button onClick={() => setActiveProfileTab('generate')} className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeProfileTab === 'generate' ? 'bg-[#546B41] text-[#FFF8EC] shadow-[0_5px_15px_rgba(84,107,65,0.4)]' : 'text-[#546B41] hover:bg-[#DCCCAC]/50'}`}>AI Prompt</button>
                      <button onClick={() => setActiveProfileTab('upload')} className={`py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeProfileTab === 'upload' ? 'bg-[#546B41] text-[#FFF8EC] shadow-[0_5px_15px_rgba(84,107,65,0.4)]' : 'text-[#546B41] hover:bg-[#DCCCAC]/50'}`}>Disk Upload</button>
                    </div>

                    <div className="min-h-[140px]">
                      <AnimatePresence mode="wait">
                        {activeProfileTab === 'generate' ? (
                           <motion.div key="generate" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}} className="flex flex-col gap-3">
                             <label className="text-xs font-black text-[#546B41] uppercase tracking-widest">Generative AI Persona Configurator</label>
                             <div className="flex gap-2">
                               <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="Wait! Type 'anime' or 'cyberpunk'..." className="flex-1 border-2 border-[#546B41]/20 rounded-2xl p-4 outline-none focus:border-[#546B41] bg-white text-black font-bold shadow-inner placeholder:font-normal"/>
                               <button onClick={handleGenerateAvatar} disabled={isUpdatingProfile} className="bg-black text-[#DCCCAC] px-6 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 disabled:opacity-50 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all"><Sparkles size={16}/> Render</button>
                             </div>
                             <div className="flex items-center gap-1.5 text-xs text-gray-500 font-bold mt-1">
                               <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                               API Mock Pipeline Active
                             </div>
                           </motion.div>
                        ) : (
                           <motion.div key="upload" initial={{opacity:0, x:20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-20}} className="flex flex-col gap-3">
                             <label className="text-xs font-black text-[#546B41] uppercase tracking-widest">Manual Data Payload Transfer</label>
                             <div className="border-2 border-dashed border-[#546B41]/40 rounded-2xl p-8 bg-white text-center hover:bg-[#DCCCAC]/20 transition-colors cursor-pointer relative shadow-inner group">
                               <input type="file" accept="image/*" onChange={(e)=>{
                                  if(e.target.files && e.target.files[0]) {
                                    setProfileAvatarFile(e.target.files[0]);
                                    setPreviewAvatar(URL.createObjectURL(e.target.files[0]));
                                  }
                               }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"/>
                               <UploadCloud size={40} className="mx-auto text-[#546B41] mb-2 group-hover:scale-110 transition-transform" />
                               <p className="text-sm font-black tracking-tight text-[#546B41]">Drag & Drop High-Resolution Asset</p>
                               {profileAvatarFile && <p className="text-xs text-emerald-600 font-bold mt-2">File Locked: {profileAvatarFile.name}</p>}
                             </div>
                           </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    <div className="flex flex-col gap-3 pt-6 border-t-2 border-[#DCCCAC]/50">
                       <label className="text-xs font-black text-[#546B41] uppercase tracking-widest">Public Biography Display</label>
                       <textarea value={editBio} onChange={e => setEditBio(e.target.value)} maxLength={160} rows={2} className="w-full border-2 border-[#546B41]/20 rounded-2xl p-4 outline-none focus:border-[#546B41] focus:bg-[#546B41]/5 bg-white text-black font-medium resize-none shadow-inner" placeholder="Tell the traveler community about your history..."></textarea>
                    </div>

                    <button onClick={handleSaveProfile} disabled={isUpdatingProfile} className="w-full py-5 mt-4 bg-[#546B41] text-[#FFF8EC] rounded-2xl font-black tracking-widest uppercase hover:bg-black hover:text-[#DCCCAC] transition-all disabled:opacity-50 shadow-[0_10px_20px_rgba(84,107,65,0.3)] hover:-translate-y-1 hover:shadow-[0_15px_30px_rgba(84,107,65,0.4)] relative overflow-hidden text-lg group">
                      <div className="absolute inset-0 w-full bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-out skew-x-12"></div>
                      {isUpdatingProfile ? 'Applying Secure Overrides...' : 'Publish Identity Update'}
                    </button>
                  </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>

        {/* Modal Interceptor for Itinerary Matrix */}
        <AnimatePresence>
           {selectedItinerary && (
             <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
                <motion.div 
                   initial={{ scale: 0.9, y: 20, opacity: 0 }}
                   animate={{ scale: 1, y: 0, opacity: 1 }}
                   exit={{ scale: 0.9, y: 20, opacity: 0 }}
                   className="bg-[#FFF8EC] rounded-[2rem] w-full max-w-2xl shadow-[0_30px_60px_rgba(0,0,0,0.6)] overflow-hidden flex flex-col relative border border-[#546B41]/20 max-h-[90vh]"
                >
                  <div className="bg-[#546B41] text-[#FFF8EC] px-8 py-6 flex justify-between items-center relative overflow-hidden shrink-0">
                    <h3 className="text-2xl font-black flex items-center gap-3 relative z-10 tracking-tight">{selectedItinerary.name}</h3>
                    <button onClick={() => setSelectedItinerary(null)} className="relative z-10 text-[#DCCCAC] hover:text-white font-black text-sm uppercase tracking-widest transition-colors bg-black/20 px-4 py-2 rounded-full hover:bg-black/40">Close</button>
                  </div>
                  
                  <div className="p-8 overflow-y-auto space-y-6 custom-scrollbar">
                    {selectedItinerary.days.map((day: any) => (
                      <div key={day.day} className="bg-white rounded-2xl p-6 border border-[#546B41]/10 shadow-sm hover:border-[#546B41]/30 transition-colors">
                        <h4 className="font-black text-lg text-[#546B41] uppercase tracking-widest mb-4 border-b border-gray-100 pb-2 flex items-center gap-2">
                          <Calendar size={18} /> Day {day.day}
                        </h4>
                        {day.activities.length > 0 ? (
                          <div className="space-y-4">
                            {day.activities.map((act: any, idx: number) => (
                              <div key={idx} className="flex gap-4 items-start">
                                <div className="bg-[#DCCCAC]/30 text-[#546B41] px-3 py-1.5 rounded-lg text-xs font-black tracking-widest uppercase shrink-0 mt-0.5 border border-[#546B41]/10">
                                  {act.time || 'Anytime'}
                                </div>
                                <div className="bg-[#FFF8EC] p-4 rounded-xl flex-1 border border-[#546B41]/5">
                                  <p className="font-black text-black text-base">{act.location}</p>
                                  {act.description && <p className="text-sm text-gray-600 mt-2 leading-relaxed">{act.description}</p>}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-sm">No activities planned for this day.</p>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
             </div>
           )}
        </AnimatePresence>

      </div>
    </div>
  );
}
