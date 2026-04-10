'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';
import Link from 'next/link';
import { MapPin, Heart, Trash2, Route as RouteIcon, FileDown, Navigation, Camera, ShieldAlert, CheckCircle, Ban } from 'lucide-react';
import { jsPDF } from 'jspdf';
import PostCard from '@/components/PostCard';

type TabState = 'routes' | 'social' | 'admin';

export default function DashboardPage() {
  const { user, isLoading, updateUser } = useAuth();
  const router = useRouter();
  
  const [activeTab, setActiveTab] = useState<TabState>('routes');
  
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [loadingData, setLoadingData] = useState(true);

  // Social State
  const [myPosts, setMyPosts] = useState<any[]>([]);
  const [newPost, setNewPost] = useState({ caption: '', location: '', category: 'General' });
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isPosting, setIsPosting] = useState(false);

  // Admin State
  const [allUsers, setAllUsers] = useState<any[]>([]);

  // Pre-load location options to avoid mismatch
  const [destinations, setDestinations] = useState<any[]>([]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  useEffect(() => {
    if (user) {
      fetchDashboardData();
      fetchMyPosts();
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

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedFiles.length === 0) return alert('Please select at least one image');
    
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
      alert('Post successfully uploaded!');
    } catch(err: any) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create post');
    } finally {
      setIsPosting(false);
    }
  };

  const deletePost = async (id: string) => {
    if(!confirm("Erase this post permanently?")) return;
    try {
      await api.delete(`/posts/${id}`);
      setMyPosts(myPosts.filter(p => p._id !== id));
    } catch(err) {
      alert("Failed to delete post");
    }
  };

  const toggleBan = async (uId: string, currentBanState: boolean) => {
    if(!confirm(`Are you sure you want to ${currentBanState ? 'Unban' : 'Ban'} this user?`)) return;
    try {
      await api.put(`/admin/users/${uId}/${currentBanState ? 'unban' : 'ban'}`);
      setAllUsers(allUsers.map(u => u._id === uId ? {...u, isBanned: !currentBanState} : u));
    } catch(err: any) {
      alert(err.response?.data?.message || "Failed changing ban state");
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
        
        {/* Header Ribbon */}
        <div className="bg-[#546B41] rounded-3xl shadow-xl overflow-hidden mb-8 border-4 border-[#DCCCAC]">
          <div className="px-6 py-8 sm:p-10 flex justify-between items-center flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-extrabold text-[#FFF8EC]">Welcome, {user.name}!</h1>
              <p className="mt-2 text-[#DCCCAC] font-medium text-lg">Manage your trips, social profile, and settings.</p>
            </div>
            {user.role === 'admin' && (
              <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm tracking-wider flex items-center gap-2 border-2 border-red-800 shadow-xl">
                <ShieldAlert size={16}/> ADMIN ACCESS
              </span>
            )}
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 overflow-x-auto mb-8 border-b-2 border-[#546B41]/10 pb-4">
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
        </div>

        {/* TAB 1: ROUTES AND SAVES */}
        {activeTab === 'routes' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                        <button onClick={() => removeFavorite(dest._id)}  className="text-gray-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 transition" title="Remove Destination">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                      <button onClick={() => generateDestinationPDF(dest)} className="mt-3 w-full bg-[#DCCCAC]/50 hover:bg-[#DCCCAC] text-black border border-[#546B41]/20 p-2 rounded-xl flex items-center justify-center gap-2 text-sm font-bold transition-colors shadow-sm">
                        <FileDown size={14} /> Download PDF Guide
                      </button>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 font-medium px-2">You haven't saved any destinations yet.</p>
              )}
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
                        <button onClick={() => removeRoute(route._id)} className="text-gray-400 hover:text-red-500 p-1.5 rounded-full hover:bg-red-50 transition opacity-0 group-hover:opacity-100" title="Delete Route">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-black/60 font-bold uppercase tracking-wider mb-4 border-b border-[#546B41]/10 pb-2">Travel Mode: {route.mode}</p>
                      <button onClick={() => generatePDF(route)} className="w-full bg-[#546B41] hover:bg-[#99AD7A] text-[#FFF8EC] hover:text-black py-2 rounded-xl flex items-center justify-center gap-2 font-bold transition-colors shadow-sm">
                        <FileDown size={16} /> Export PDF
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 bg-[#FFF8EC] rounded-2xl border border-[#546B41]/20 border-dashed">
                  <p className="text-black font-bold text-lg mb-2">No Routes Saved</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SOCIAL */}
        {activeTab === 'social' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Upload Module */}
            <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-[#546B41]/10 h-max lg:col-span-1">
              <h2 className="text-xl font-bold text-black mb-6 border-b border-[#546B41]/20 pb-4 flex items-center">
                <Camera className="w-6 h-6 mr-3 text-[#546B41]" /> Create Post
              </h2>
              <form onSubmit={handleCreatePost} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Select Images (Max 10)</label>
                  <input 
                    type="file" 
                    accept="image/*"
                    multiple
                    className="w-full text-sm text-black file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#546B41]/10 file:text-[#546B41] hover:file:bg-[#546B41]/20 cursor-pointer"
                    onChange={(e) => {
                       if(e.target.files) {
                         const files = Array.from(e.target.files).slice(0, 10);
                         setSelectedFiles(files);
                       }
                    }}
                  />
                  {selectedFiles.length > 0 && (
                    <p className="text-xs font-bold text-gray-500 mt-2">{selectedFiles.length} file(s) selected</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-1">Destination Location</label>
                  <select 
                    value={newPost.location} 
                    onChange={e => setNewPost({...newPost, location: e.target.value})} 
                    className="w-full border-[#546B41]/30 rounded-lg p-2 border bg-[#FFF8EC] text-sm text-black outline-none focus:border-[#546B41]" 
                    required
                  >
                    <option value="" disabled>Select exact location</option>
                    {destinations.map(d => (
                       <option key={d._id} value={d.name}>{d.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-black mb-1">Caption</label>
                  <textarea rows={3} value={newPost.caption} onChange={e => setNewPost({...newPost, caption: e.target.value})} className="w-full border-[#546B41]/30 rounded-lg p-2 border bg-[#FFF8EC] text-sm text-black outline-none focus:border-[#546B41]" placeholder="Share your experience..."/>
                </div>

                <div className="pt-2">
                  <button type="submit" disabled={isPosting} className="w-full py-3 bg-[#546B41] text-[#FFF8EC] rounded-xl font-bold hover:bg-[#99AD7A] hover:text-black transition-colors disabled:opacity-50">
                    {isPosting ? 'Uploading...' : 'Publish Post'}
                  </button>
                </div>
              </form>
            </div>

            {/* My Feed */}
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-black mb-2 flex items-center">
                Your Digital Album
              </h2>
              {myPosts.length > 0 ? (
                myPosts.map(post => (
                  <PostCard 
                    key={post._id} 
                    post={post} 
                    currentUser={user} 
                    onDelete={deletePost}
                  />
                ))
              ) : (
                <div className="bg-white rounded-3xl p-12 text-center border-2 border-dashed border-[#546B41]/20">
                  <Camera size={48} className="mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 font-bold text-lg">You haven't posted anything yet.</p>
                </div>
              )}
            </div>
            
          </div>
        )}

        {/* TAB 3: ADMIN MODERATION */}
        {activeTab === 'admin' && user.role === 'admin' && (
          <div className="bg-white border-2 border-red-500/20 rounded-3xl shadow-xl overflow-hidden p-6">
            <h2 className="text-2xl font-black text-black mb-6 flex items-center gap-3 border-b-2 border-gray-100 pb-4">
              <ShieldAlert className="text-red-500"/> Social Moderation Enforcement Matrix
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-600 text-sm uppercase tracking-wider">
                    <th className="p-4 border-b font-bold rounded-tl-xl">User Name</th>
                    <th className="p-4 border-b font-bold">Email</th>
                    <th className="p-4 border-b font-bold">Role</th>
                    <th className="p-4 border-b font-bold">Status</th>
                    <th className="p-4 border-b font-bold rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {allUsers.map((u: any) => (
                    <tr key={u._id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-black">{u.name}</td>
                      <td className="p-4 text-gray-500">{u.email}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {u.role.toUpperCase()}
                        </span>
                      </td>
                      <td className="p-4">
                        {u.isBanned ? (
                          <span className="flex items-center gap-1 text-red-600 font-bold text-sm bg-red-50 px-2 py-1 rounded-lg w-max">
                            <Ban size={14}/> Banned
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-green-600 font-bold text-sm bg-green-50 px-2 py-1 rounded-lg w-max">
                            <CheckCircle size={14}/> Safe
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        {u.role !== 'admin' && (
                          <button 
                            onClick={() => toggleBan(u._id, !!u.isBanned)}
                            className={`px-4 py-1.5 rounded-lg font-bold text-xs transition-colors border ${u.isBanned ? 'bg-gray-800 text-white border-black hover:bg-black' : 'bg-red-50 text-red-600 border-red-200 hover:bg-red-500 hover:text-white'}`}
                          >
                           {u.isBanned ? 'RESTORE ACCESS' : 'BAN USER'}
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
      </div>
    </div>
  );
}
