'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { adminApi } from '@/lib/api';
import { Users, Search, Trash2, Shield, User as UserIcon, Mail, Calendar, Star } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');

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
      alert('User deleted successfully');
    } catch (err: any) {
      alert('Failed to delete user: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      await adminApi.updateUserRole(userId, newRole);
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole } : u));
      alert('User role updated successfully');
    } catch (err: any) {
      alert('Failed to update role: ' + (err.response?.data?.message || err.message));
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">User Management</h1>
          <p className="text-gray-600">Manage all registered users ({filteredUsers.length} total)</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
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
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">User</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Role</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Joined</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredUsers.map((user) => (
                <motion.tr
                  key={user._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className={`relative w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${
                        user.role === 'admin' 
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500' 
                          : user.role === 'coadmin' 
                          ? 'bg-gradient-to-r from-orange-400 to-red-500'
                          : user.role === 'guest'
                          ? 'bg-gradient-to-r from-gray-400 to-gray-500'
                          : 'bg-gradient-to-r from-green-500 to-blue-500'
                      }`}>
                        {user.role === 'guest' && (
                          <div className="absolute inset-[-4px] rounded-full border border-dashed border-[#546B41] animate-[spin_4s_linear_infinite]" />
                        )}
                        {user.name.charAt(0).toUpperCase()}
                        <div className="absolute -bottom-2 flex gap-[1px] justify-center w-full">
                           {user.role === 'admin' && [...Array(3)].map((_, i) => <Star key={i} size={10} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />)}
                           {user.role === 'coadmin' && [...Array(2)].map((_, i) => <Star key={i} size={10} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />)}
                           {user.role === 'guest' && <Star size={10} className="fill-[#DCCCAC] text-[#DCCCAC] drop-shadow-md" />}
                        </div>
                      </div>
                      <span className="font-semibold text-gray-800 ml-2">{user.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Mail size={16} />
                      <span>{user.email}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.role}
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      disabled={user.role === 'admin' || (currentUser?.role === 'coadmin' && user.role === 'coadmin')}
                      className={`px-3 py-1 rounded-full text-sm font-semibold border-0 focus:ring-2 focus:ring-blue-500 ${
                        user.role === 'admin' || (currentUser?.role === 'coadmin' && user.role === 'coadmin')
                          ? 'bg-purple-100 text-purple-700 cursor-not-allowed opacity-80'
                          : user.role === 'coadmin'
                          ? 'bg-orange-100 text-orange-700 cursor-pointer'
                          : user.role === 'guest'
                          ? 'bg-gray-100 text-gray-700 cursor-pointer'
                          : 'bg-green-100 text-green-700 cursor-pointer'
                      }`}
                    >
                      <option value="user">User</option>
                      {user.role === 'admin' && <option value="admin">Admin</option>}
                      {currentUser?.role === 'admin' && <option value="coadmin">Co-admin</option>}
                      <option value="guest">Guest</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-gray-600 text-sm">
                      <Calendar size={16} />
                      <span>{new Date(user.createdAt).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDeleteUser(user._id, user.name)}
                      className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-all"
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
            <Users size={64} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 text-lg">No users found</p>
            <p className="text-gray-400 text-sm mt-2">Try adjusting your search or filters</p>
          </div>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm mb-1">Total Users</p>
              <p className="text-3xl font-bold">{users.length}</p>
            </div>
            <Users size={40} className="opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm mb-1">Regular Users</p>
              <p className="text-3xl font-bold">{users.filter(u => u.role === 'user').length}</p>
            </div>
            <UserIcon size={40} className="opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm mb-1">Admins / Co-Admins</p>
              <p className="text-3xl font-bold">{users.filter(u => ['admin', 'coadmin'].includes(u.role)).length}</p>
            </div>
            <Shield size={40} className="opacity-50" />
          </div>
        </div>
      </div>
    </div>
  );
}
