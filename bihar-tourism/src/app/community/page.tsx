'use client';

import React, { useEffect, useState } from 'react';
import PostCard from '@/components/PostCard';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { Camera, Compass } from 'lucide-react';
import Link from 'next/link';

export default function CommunityPage() {
  const { user, isLoading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const res = await api.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to fetch posts', err);
    } finally {
      setLoadingPosts(false);
    }
  };

  if (loadingPosts || isLoading) {
    return (
      <div className="min-h-screen bg-[#FFF8EC] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-[#546B41] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8EC] py-12 font-poppins">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        {/* Header Block */}
        <div className="bg-[#546B41] rounded-3xl p-8 mb-8 text-center border-4 border-[#DCCCAC] shadow-xl relative overflow-hidden text-[#FFF8EC]">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Compass size={120} />
          </div>
          <h1 className="text-4xl font-extrabold mb-3">Traveler Community</h1>
          <p className="text-lg font-medium opacity-90 mb-6 max-w-lg mx-auto">
            Discover Bihar through the lens of fellow explorers. Share your experiences and uncover hidden gems!
          </p>
          
          {user ? (
            <Link 
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-[#DCCCAC] text-black font-bold px-6 py-3 rounded-full hover:bg-white transition-colors"
            >
              <Camera size={18} /> Share Your Journey
            </Link>
          ) : (
            <Link 
              href="/login"
              className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-full hover:bg-gray-800 transition-colors border border-white/20"
            >
              Log in to Post
            </Link>
          )}
        </div>

        {/* Feed */}
        <div className="space-y-8">
          {posts.length > 0 ? (
            posts.map(post => (
              <PostCard 
                key={post._id} 
                post={post} 
                currentUser={user} 
              />
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-[#546B41]/30">
              <Camera size={48} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-xl font-bold text-black mb-2">No Posts Yet</h2>
              <p className="text-gray-500">Be the first to share your Bihar experience!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
