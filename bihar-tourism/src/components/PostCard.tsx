'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, MapPin, ChevronLeft, ChevronRight, Send, Trash2 } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

interface Post {
  _id: string;
  user: {
    _id: string;
    name: string;
    avatar?: string;
  };
  images: string[];
  caption: string;
  location: string;
  category: string;
  likes: string[];
  comments: {
    _id: string;
    user: { _id: string; name: string };
    text: string;
    date: string;
  }[];
  createdAt: string;
}

interface PostCardProps {
  post: Post;
  currentUser: any;
  onDelete?: (id: string) => void;
  isAdmin?: boolean;
}

export default function PostCard({ post, currentUser, onDelete, isAdmin }: PostCardProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [likes, setLikes] = useState<string[]>(post.likes);
  const [isLiked, setIsLiked] = useState<boolean>(currentUser ? post.likes.includes(currentUser._id) : false);
  
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState(post.comments);
  const [newComment, setNewComment] = useState('');

  const handleNextImage = () => {
    if (currentImageIndex < post.images.length - 1) {
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const handlePrevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const parseTime = (dateString: string) => {
    const diff = new Date().getTime() - new Date(dateString).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  };

  const toggleLike = async () => {
    if (!currentUser) {
      toast('Please login to interact with posts!', { icon: '🔐' });
      return;
    }
    
    // Optimistic Update
    setIsLiked(!isLiked);
    if (!isLiked) {
      setLikes([...likes, currentUser._id]);
    } else {
      setLikes(likes.filter(id => id !== currentUser._id));
    }

    try {
      const res = await api.put(`/posts/${post._id}/like`);
      setLikes(res.data.likes);
      setIsLiked(res.data.likes.includes(currentUser._id));
    } catch (err: any) {
      console.error(err);
      // Revert optimism if failed
      setIsLiked(!isLiked);
      toast.error(err.response?.data?.message || 'Failed to toggle like');
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      toast('Please login to comment!', { icon: '🔐' });
      return;
    }
    if (!newComment.trim()) return;

    try {
      const res = await api.post(`/posts/${post._id}/comment`, { text: newComment });
      setComments(res.data);
      setNewComment('');
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to post comment');
    }
  };

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-[#546B41]/10 overflow-hidden w-full max-w-2xl mx-auto mb-8 font-poppins text-black">
      {/* Header */}
      <div className="p-4 flex items-center justify-between border-b border-gray-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#DCCCAC] text-[#546B41] font-bold flex items-center justify-center border border-[#546B41]">
            {post.user?.avatar ? (
              <img src={post.user.avatar} className="w-full h-full rounded-full object-cover" alt="avatar" />
            ) : (
              post.user?.name?.charAt(0).toUpperCase() || '?'
            )}
          </div>
          <div>
            <h3 className="font-bold text-[15px] leading-none">{post.user?.name || 'Unknown User'}</h3>
            {post.location && (
              <p className="text-xs text-gray-500 mt-1 flex items-center">
                <MapPin size={10} className="mr-0.5" /> {post.location}
              </p>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-full">
            {post.category}
          </span>
          {(isAdmin || (currentUser && currentUser._id === post.user?._id)) && onDelete && (
            <button 
              onClick={() => onDelete(post._id)}
              className="text-gray-400 hover:text-red-500 transition-colors"
              title="Delete Post"
            >
              <Trash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Image Carousel */}
      <div className="relative w-full bg-black aspect-square flex items-center justify-center overflow-hidden group">
        <AnimatePresence initial={false} mode="wait">
          <motion.img
            key={currentImageIndex}
            src={
              Array.isArray(post.images) && post.images.length > currentImageIndex 
                ? (typeof post.images[currentImageIndex] === 'string' ? post.images[currentImageIndex] : (post.images[currentImageIndex] as any).url) 
                : 'https://images.unsplash.com/photo-1596414272183-5ee9acabf333?q=80&w=800'
            }
            alt={`Post Image ${currentImageIndex + 1}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {post.images.length > 1 && (
          <>
            {currentImageIndex > 0 && (
              <button 
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            
            {currentImageIndex < post.images.length - 1 && (
              <button 
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white/70 hover:bg-white flex items-center justify-center text-black opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <ChevronRight size={20} />
              </button>
            )}

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {post.images.map((_, idx) => (
                <div 
                  key={idx} 
                  className={`h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'w-4 bg-white' : 'w-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Action Bar */}
      <div className="p-4 pb-2">
        <div className="flex gap-4">
          <button onClick={toggleLike} className="hover:scale-110 transition-transform">
            <Heart size={26} className={isLiked ? "fill-red-500 text-red-500" : "text-black"} />
          </button>
          <button onClick={() => setShowComments(!showComments)} className="hover:scale-110 transition-transform">
            <MessageCircle size={26} className="text-black" />
          </button>
        </div>
        <p className="font-bold text-sm mt-3">{likes.length} likes</p>
      </div>

      {/* Caption Section */}
      <div className="px-4 pb-2">
        <p className="text-sm">
          <span className="font-bold mr-2">{post.user?.name || 'Unknown User'}</span>
          {post.caption}
        </p>
        <p className="text-[10px] uppercase text-gray-400 font-bold mt-2 tracking-wider">
          {parseTime(post.createdAt)}
        </p>
      </div>

      {/* Comments Preview Container */}
      <div className="px-4 pb-4">
        {comments.length > 0 && !showComments && (
          <button onClick={() => setShowComments(true)} className="text-gray-500 text-sm font-medium mt-1">
            View all {comments.length} comments
          </button>
        )}

        <AnimatePresence>
          {showComments && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="mt-3 overflow-hidden border-t border-gray-100 pt-3 flex flex-col gap-3"
            >
              {comments.map((comment) => (
                <div key={comment._id} className="text-sm flex flex-col">
                  <span><span className="font-bold mr-2">{comment.user?.name}</span>{comment.text}</span>
                  <span className="text-[10px] text-gray-400 mt-0.5">{parseTime(comment.date)}</span>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Comment Input */}
        <form onSubmit={handleAddComment} className="mt-4 flex items-center border border-gray-200 rounded-full pr-1 overflow-hidden group focus-within:border-[#546B41] transition-colors">
          <input 
            type="text" 
            placeholder="Add a comment..." 
            className="w-full text-sm px-4 py-2 outline-none bg-transparent"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
          <button 
            type="submit" 
            disabled={!newComment.trim()} 
            className="p-2 text-[#546B41] hover:bg-[#FFF8EC] rounded-full disabled:opacity-30 transition-colors"
          >
            <Send size={16} />
          </button>
        </form>
      </div>
    </div>
  );
}
