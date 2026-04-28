'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { Music, Plus, Trash2, Link as LinkIcon, Image as ImageIcon, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminMusicPage() {
  const [songs, setSongs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newSong, setNewSong] = useState({ title: '', artist: '' });
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const res = await api.get('/songs');
      setSongs(res.data.data);
    } catch (error) {
      console.error('Failed to fetch songs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSong = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!audioFile) {
      toast.error('Please select an audio file.');
      return;
    }

    setIsSubmitting(true);
    try {
      let coverImage = '';
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append('images', imageFile);
        const imageRes = await api.post('/upload', imageFormData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        coverImage = imageRes.data.paths[0];
      }

      const audioFormData = new FormData();
      audioFormData.append('audio', audioFile);
      const audioRes = await api.post('/upload/audio', audioFormData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const audioUrl = audioRes.data.path;

      await api.post('/songs', {
        title: newSong.title,
        artist: newSong.artist,
        audioUrl,
        coverImage,
      });

      setNewSong({ title: '', artist: '' });
      setAudioFile(null);
      setImageFile(null);
      // Reset file inputs visually by form reset not cleanly possible here without ref, but value='' could work if we had refs.
      const audioInput = document.getElementById('audio-upload') as HTMLInputElement;
      if (audioInput) audioInput.value = '';
      const imageInput = document.getElementById('image-upload') as HTMLInputElement;
      if (imageInput) imageInput.value = '';

      fetchSongs();
      toast.success('Track published successfully!');
    } catch (error) {
      console.error('Failed to add song:', error);
      toast.error((error as any).response?.data?.message || 'Failed to add song. Ensure all required fields are filled.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSong = async (id: string) => {
    if (!confirm('Are you sure you want to delete this song?')) return;
    try {
      await api.delete(`/songs/${id}`);
      setSongs(songs.filter(s => s._id !== id));
      toast.success('Song deleted successfully.');
    } catch (error) {
      console.error('Failed to delete song:', error);
      toast.error('Failed to delete song.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-[#546B41] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 border-b-4 border-black pb-6">
        <div className="w-16 h-16 bg-[#546B41] rounded-2xl flex items-center justify-center border-4 border-black shadow-[4px_4px_0px_#000]">
          <Music size={32} className="text-[#FFF8EC]" />
        </div>
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight">Music Management</h1>
          <p className="text-[#546B41] font-bold mt-1">Manage the cultural songs displayed across the platform</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add New Song Form */}
        <div className="lg:col-span-1">
          <form onSubmit={handleAddSong} className="bg-[#FFF8EC] border-4 border-black p-6 shadow-[8px_8px_0px_#000] rounded-xl sticky top-24">
            <h2 className="text-xl font-black uppercase border-b-2 border-black pb-3 mb-6">Add New Track</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black uppercase mb-1">Song Title</label>
                <input 
                  type="text" 
                  required
                  value={newSong.title}
                  onChange={e => setNewSong({...newSong, title: e.target.value})}
                  className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#546B41]/20 transition-all"
                  placeholder="e.g. Jiya Ho Bihar Ke Lala"
                />
              </div>
              
              <div>
                <label className="block text-xs font-black uppercase mb-1">Artist / Singer</label>
                <input 
                  type="text" 
                  required
                  value={newSong.artist}
                  onChange={e => setNewSong({...newSong, artist: e.target.value})}
                  className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#546B41]/20 transition-all"
                  placeholder="e.g. Manoj Tiwari"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1 flex items-center gap-1"><LinkIcon size={12}/> Audio File (MP3, WAV)</label>
                <input 
                  type="file" 
                  id="audio-upload"
                  required
                  accept="audio/*"
                  onChange={e => setAudioFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#546B41]/20 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#546B41] file:text-white hover:file:bg-[#3f5231]"
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase mb-1 flex items-center gap-1"><ImageIcon size={12}/> Cover Image (Optional)</label>
                <input 
                  type="file" 
                  id="image-upload"
                  accept="image/*"
                  onChange={e => setImageFile(e.target.files ? e.target.files[0] : null)}
                  className="w-full bg-white border-2 border-black p-3 font-bold focus:outline-none focus:ring-4 focus:ring-[#546B41]/20 transition-all text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#546B41] file:text-white hover:file:bg-[#3f5231]"
                />
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-[#546B41] text-[#FFF8EC] font-black uppercase py-4 border-2 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <><Plus size={20} /> Publish Track</>}
              </button>
            </div>
          </form>
        </div>

        {/* Existing Songs List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-black uppercase border-b-4 border-black pb-2 mb-6">Active Playlist ({songs.length})</h2>
          
          {songs.length === 0 ? (
             <div className="bg-[#DCCCAC]/30 border-4 border-dashed border-black p-12 text-center rounded-xl">
                <Music className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-black uppercase">No Songs Found</h3>
                <p className="font-bold opacity-75">Add a song using the form to populate the global playlist.</p>
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {songs.map((song) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={song._id} 
                  className="bg-white border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_#000] flex flex-col group"
                >
                  <div className="h-32 bg-gray-200 relative overflow-hidden border-b-4 border-black">
                     <img src={song.coverImage} alt={song.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                     <div className="absolute top-2 right-2">
                        <button 
                          onClick={() => handleDeleteSong(song._id)}
                          className="bg-red-500 text-white p-2 rounded-full border-2 border-black shadow-[2px_2px_0px_#000] hover:bg-red-600 transition-colors tooltip"
                          title="Delete Song"
                        >
                           <Trash2 size={16} />
                        </button>
                     </div>
                  </div>
                  <div className="p-4 flex-1 flex flex-col justify-between">
                     <div>
                       <h3 className="font-black text-lg leading-tight mb-1 line-clamp-1" title={song.title}>{song.title}</h3>
                       <p className="font-bold text-gray-500 text-sm mb-4">{song.artist}</p>
                     </div>
                     <a 
                       href={song.audioUrl} 
                       target="_blank" 
                       rel="noopener noreferrer"
                       className="text-xs font-black uppercase tracking-widest text-[#546B41] flex items-center gap-1 hover:underline"
                     >
                       <Music size={12} /> Play Audio
                     </a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
