import { motion } from 'framer-motion';
import { X, Trash2, Calendar, MessageSquare, ImageIcon } from 'lucide-react';
import { adminApi } from '@/lib/api';

interface UserDetailsModalProps {
  user: any;
  onClose: () => void;
  onDeletePost: (postId: string) => void;
  onDeleteComment: (postId: string, commentId: string) => void;
}

export default function UserDetailsModal({ user, onClose, onDeletePost, onDeleteComment }: UserDetailsModalProps) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#FFF8EC] border border-[#DCCCAC] rounded-2xl shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-[#DCCCAC] flex justify-between items-center bg-[#DCCCAC]/20">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#546B41] flex items-center justify-center text-[#FFF8EC] border border-[#DCCCAC] text-2xl font-bold">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
              ) : (
                user.name.charAt(0).toUpperCase()
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">{user.name}</h2>
              <p className="text-black font-medium opacity-80">{user.email}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-[#DCCCAC]/50 rounded-full transition-colors border border-transparent hover:border-[#DCCCAC]"
          >
            <X size={24} className="text-[#546B41]" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* Posts Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <ImageIcon className="text-[#546B41]" />
              <h3 className="text-xl font-bold text-black">User's Posts ({user.posts?.length || 0})</h3>
            </div>
            {user.posts?.length === 0 ? (
              <p className="text-black opacity-70 italic font-medium">No posts found.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.posts?.map((post: any) => (
                  <div key={post._id} className="bg-[#FFF8EC] border border-[#DCCCAC] rounded-xl p-4 flex flex-col gap-3 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start">
                      <p className="text-black font-bold line-clamp-2">{post.caption || 'No caption'}</p>
                      <button
                        onClick={() => onDeletePost(post._id)}
                        className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 border border-transparent hover:border-red-200"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                    {post.images && post.images.length > 0 && (
                      <div className="h-32 w-full rounded-lg overflow-hidden border border-[#DCCCAC] bg-[#DCCCAC]/20">
                        <img src={post.images[0]} alt="Post" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-black font-medium opacity-80 mt-auto">
                      <Calendar size={14} />
                      <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          {/* Comments Section */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <MessageSquare className="text-[#546B41]" />
              <h3 className="text-xl font-bold text-black">User's Comments ({user.comments?.length || 0})</h3>
            </div>
            {user.comments?.length === 0 ? (
              <p className="text-black opacity-70 italic font-medium">No comments found.</p>
            ) : (
              <div className="space-y-3">
                {user.comments?.map((comment: any) => (
                  <div key={comment._id} className="bg-[#FFF8EC] border border-[#DCCCAC] rounded-xl p-4 flex justify-between items-start gap-4 hover:shadow-md transition-shadow">
                    <div className="flex-1 min-w-0">
                      <p className="text-black font-medium break-words">{comment.text}</p>
                      <div className="flex items-center gap-4 mt-2 text-sm text-black font-medium opacity-80">
                        <span className="truncate max-w-[200px]">On: {comment.postCaption || 'A post'}</span>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />
                          <span>{new Date(comment.date).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onDeleteComment(comment.postId, comment._id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors flex-shrink-0 border border-transparent hover:border-red-200"
                      title="Delete Comment"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

        </div>
      </motion.div>
    </div>
  );
}
