'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { Users, Search, Trash2, Shield, User as UserIcon, Mail, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import UserDetailsModal from './UserDetailsModal';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await adminApi.getAllUsers();
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      await adminApi.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      toast.success('User deleted successfully.');
    } catch (err: any) {
      toast.error('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      toast.success('User role updated successfully.');
    } catch (err: any) {
      toast.error('Failed to update role: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleUserClick = async (userId: string) => {
    try {
      const res = await adminApi.getUserById(userId);
      setSelectedUser(res.data);
    } catch (err: any) {
      toast.error('Failed to fetch user details.');
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await adminApi.deletePost(postId);
      setSelectedUser((prev: any) => ({
        ...prev,
        posts: prev.posts.filter((p: any) => p._id !== postId)
      }));
      toast.success('Post deleted.');
    } catch (err: any) {
      toast.error('Failed to delete post: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteComment = async (postId: string, commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;
    try {
      await adminApi.deleteComment(postId, commentId);
      setSelectedUser((prev: any) => ({
        ...prev,
        comments: prev.comments.filter((c: any) => c._id !== commentId)
      }));
      toast.success('Comment deleted.');
    } catch (err: any) {
      toast.error('Failed to delete comment: ' + (err.response?.data?.message || err.message));
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !selectedRole || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-black text-black uppercase tracking-tight mb-2">User Management</h1>
          <p className="text-[#546B41] font-medium tracking-wide">Manage all registered users ({filteredUsers.length} total)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-[#FFF8EC] rounded-2xl p-4 shadow-sm border border-[#546B41]/20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#546B41]" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-[#546B41]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#546B41] bg-white text-black font-medium"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 border border-[#546B41]/30 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#546B41] bg-white text-black font-medium"
          >
            <option value="">All Roles</option>
            <option value="user">Users</option>
            <option value="guest">Guests</option>
            <option value="coadmin">Co-Admins</option>
            <option value="admin">Admins</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#FFF8EC] rounded-2xl shadow-sm border border-[#546B41]/20 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#DCCCAC]/20 border-b border-[#546B41]/20">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-black text-[#546B41] uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[#546B41] uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[#546B41] uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[#546B41] uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-black text-[#546B41] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#546B41]/10">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-[#DCCCAC]/10 transition-colors cursor-pointer"
                  onClick={() => handleUserClick(user._id)}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-[#FFF8EC] font-bold ${
                        user.role === 'admin' 
                          ? 'bg-[#546B41]' 
                          : user.role === 'coadmin' 
                          ? 'bg-[#99AD7A]'
                          : user.role === 'guest'
                          ? 'bg-[#DCCCAC] text-[#546B41]'
                          : 'bg-[#546B41]'
                      }`}>
                        {user.role === 'guest' && (
                          <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#546B41] animate-[spin_4s_linear_infinite]" />
                        )}
                        {user.avatar ? (
                          <img src={user.avatar} alt={user.name} className="w-full h-full object-cover rounded-full" />
                        ) : (
                          user.name.charAt(0).toUpperCase()
                        )}
                        <div className="absolute -bottom-2 flex gap-[1px] justify-center w-full">
                           {user.role === 'admin' && [...Array(3)].map((_, i) => <Star key={i} size={10} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />)}
                           {user.role === 'coadmin' && [...Array(2)].map((_, i) => <Star key={i} size={10} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />)}
                           {user.role === 'guest' && <Star size={10} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />}
                        </div>
                      </div>
                      <span className="font-bold text-black ml-2 uppercase tracking-wide text-sm">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-black font-medium">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={user.role === 'admin' || (currentUser?.role === 'coadmin' && user.role === 'coadmin')}
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider border border-transparent focus:ring-2 focus:ring-[#546B41] ${
                        user.role === 'admin' || (currentUser?.role === 'coadmin' && user.role === 'coadmin')
                          ? 'bg-[#546B41] text-[#FFF8EC] cursor-not-allowed opacity-80'
                          : user.role === 'coadmin'
                          ? 'bg-[#99AD7A] text-[#FFF8EC] cursor-pointer hover:opacity-80'
                          : user.role === 'guest'
                          ? 'bg-[#DCCCAC] text-[#546B41] cursor-pointer hover:opacity-80'
                          : 'bg-[#546B41]/10 text-[#546B41] border-[#546B41]/20 cursor-pointer hover:bg-[#546B41]/20'
                      }`}
                    >
                      <option value="user">User</option>
                      {user.role === 'admin' && <option value="admin">Admin</option>}
                      {currentUser?.role === 'admin' && <option value="coadmin">Co-admin</option>}
                      <option value="guest">Guest</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-black font-medium text-sm">
                      <Calendar size={16} />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 border border-transparent hover:border-red-200 p-2 rounded-lg transition-all"
                      title="Delete User"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <Users size={64} className="mx-auto text-[#546B41]/30 mb-4" />
            <p className="text-black font-bold text-lg">No users found</p>
            <p className="text-[#546B41] font-medium text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#546B41] rounded-2xl p-6 text-[#FFF8EC] shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[#DCCCAC] text-sm mb-1 uppercase tracking-widest font-bold">Total Users</p>
              <p className="text-3xl font-black">{users.length}</p>
            </div>
            <Users size={40} className="opacity-50" />
          </div>
        </div>
        <div className="bg-[#99AD7A] rounded-2xl p-6 text-black shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black font-bold text-sm mb-1 uppercase tracking-widest">Regular Users</p>
              <p className="text-3xl font-black">{users.filter(u => u.role === 'user').length}</p>
            </div>
            <UserIcon size={40} className="opacity-50" />
          </div>
        </div>
        <div className="bg-[#DCCCAC] rounded-2xl p-6 text-black shadow-[0_4px_0_0_rgba(0,0,0,1)] border-2 border-black">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-black font-bold text-sm mb-1 uppercase tracking-widest">Admins / Co-Admins</p>
              <p className="text-3xl font-black">{users.filter(u => ['admin', 'coadmin'].includes(u.role)).length}</p>
            </div>
            <Shield size={40} className="opacity-50" />
          </div>
        </div>
      </div>

      {selectedUser && (
        <UserDetailsModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onDeletePost={handleDeletePost}
          onDeleteComment={handleDeleteComment}
        />
      )}
    </div>
  );
}
