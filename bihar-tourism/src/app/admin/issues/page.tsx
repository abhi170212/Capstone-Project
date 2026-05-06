'use client';

import React, { useState, useEffect } from 'react';
import { Loader2, MessageSquareWarning, Eye, Trash2, X, Send } from 'lucide-react';
import { issueApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Issue {
  _id: string;
  user: { _id: string; name: string; email: string };
  subject: string;
  category: string;
  message: string;
  status: string;
  adminReply: string;
  createdAt: string;
}

export default function AdminIssues() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Issue | null>(null);
  const [replyText, setReplyText] = useState('');
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => { fetchIssues(); }, []);

  const fetchIssues = async () => {
    try {
      const res = await issueApi.getAll();
      if (res.success) setIssues(res.data);
    } catch { toast.error('Failed to fetch issues'); }
    setLoading(false);
  };

  const handleUpdate = async () => {
    if (!selected) return;
    try {
      await issueApi.update(selected._id, {
        status: newStatus || selected.status,
        adminReply: replyText || selected.adminReply,
      });
      toast.success('Issue updated!');
      setSelected(null);
      fetchIssues();
    } catch { toast.error('Failed to update'); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this issue?')) return;
    try {
      await issueApi.delete(id);
      toast.success('Issue deleted');
      fetchIssues();
    } catch { toast.error('Failed to delete'); }
  };

  const openDetail = (issue: Issue) => {
    setSelected(issue);
    setReplyText(issue.adminReply || '');
    setNewStatus(issue.status);
  };

  const statusColor = (s: string) => {
    if (s === 'Open') return 'bg-yellow-400 text-black';
    if (s === 'In Progress') return 'bg-blue-500 text-white';
    if (s === 'Resolved') return 'bg-green-500 text-white';
    return 'bg-gray-400 text-white';
  };

  if (loading) {
    return (
      <div className="flex h-[80vh] items-center justify-center">
        <Loader2 className="w-16 h-16 text-[#546B41] animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="bg-[#FFF8EC] border-4 border-black p-8 rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tight flex items-center gap-4">
            <MessageSquareWarning className="w-10 h-10 text-[#546B41]" />
            User Issues
          </h1>
          <p className="text-[#546B41] font-bold mt-2">
            View and respond to issues raised by users.
          </p>
        </div>
        <div className="bg-[#546B41] text-white border-2 border-black px-6 py-3 rounded-xl font-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]">
          {issues.length} Total
        </div>
      </div>

      <div className="bg-white border-4 border-black rounded-2xl shadow-[8px_8px_0_0_rgba(0,0,0,1)] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#99AD7A] border-b-4 border-black text-black uppercase tracking-wider text-sm font-black">
                <th className="p-4 border-r-4 border-black">User</th>
                <th className="p-4 border-r-4 border-black">Subject</th>
                <th className="p-4 border-r-4 border-black">Category</th>
                <th className="p-4 border-r-4 border-black">Status</th>
                <th className="p-4 border-r-4 border-black">Date</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {issues.map((issue) => (
                <tr key={issue._id} className="border-b-4 border-black hover:bg-gray-50 transition-colors font-bold text-black">
                  <td className="p-4 border-r-4 border-black">
                    <div className="font-black text-sm">{issue.user?.name || 'Unknown'}</div>
                    <div className="text-xs text-[#546B41]">{issue.user?.email || ''}</div>
                  </td>
                  <td className="p-4 border-r-4 border-black text-sm max-w-[200px] truncate">{issue.subject}</td>
                  <td className="p-4 border-r-4 border-black">
                    <span className="bg-[#DCCCAC] text-black text-xs font-black px-2 py-1 rounded-lg border border-black">{issue.category}</span>
                  </td>
                  <td className="p-4 border-r-4 border-black">
                    <span className={`text-xs font-black px-2 py-1 rounded-lg border border-black ${statusColor(issue.status)}`}>{issue.status}</span>
                  </td>
                  <td className="p-4 border-r-4 border-black text-xs">{new Date(issue.createdAt).toLocaleDateString()}</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button onClick={() => openDetail(issue)} className="p-2 bg-[#DCCCAC] text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
                        <Eye size={16} />
                      </button>
                      <button onClick={() => handleDelete(issue._id)} className="p-2 bg-red-400 text-black border-2 border-black rounded-lg hover:-translate-y-1 shadow-[2px_2px_0_0_rgba(0,0,0,1)] transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {issues.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest border-b-4 border-black">
                    No issues found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail / Reply Modal */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-[#FFF8EC] border-4 border-black rounded-3xl p-8 w-full max-w-2xl shadow-[16px_16px_0_0_rgba(0,0,0,1)] max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Issue Details</h2>
              <button onClick={() => setSelected(null)} className="p-2 bg-white border-2 border-black rounded-lg hover:bg-gray-100">
                <X size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white border-2 border-black rounded-xl p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-[#546B41] mb-1">User</p>
                  <p className="font-black">{selected.user?.name}</p>
                  <p className="text-sm text-[#546B41] font-bold">{selected.user?.email}</p>
                </div>
                <div className="bg-white border-2 border-black rounded-xl p-4">
                  <p className="text-xs font-black uppercase tracking-widest text-[#546B41] mb-1">Category</p>
                  <p className="font-black">{selected.category}</p>
                  <p className="text-sm text-gray-500 font-bold">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-[#546B41] mb-1">Subject</p>
                <p className="font-black">{selected.subject}</p>
              </div>
              <div className="bg-white border-2 border-black rounded-xl p-4">
                <p className="text-xs font-black uppercase tracking-widest text-[#546B41] mb-1">Message</p>
                <p className="font-bold text-sm leading-relaxed">{selected.message}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">Update Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] cursor-pointer"
                >
                  {['Open', 'In Progress', 'Resolved', 'Closed'].map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-black uppercase tracking-wider mb-2">Admin Reply</label>
                <textarea
                  rows={3}
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full bg-white border-4 border-black rounded-xl p-3 font-bold text-black focus:outline-none shadow-[4px_4px_0_0_rgba(0,0,0,1)] resize-none"
                  placeholder="Type your reply to the user..."
                />
              </div>
              <div className="flex justify-end gap-4">
                <button onClick={() => setSelected(null)} className="px-6 py-3 font-black uppercase tracking-widest hover:bg-black/5 rounded-xl border-2 border-transparent transition-colors">
                  Cancel
                </button>
                <button onClick={handleUpdate} className="bg-[#546B41] text-[#FFF8EC] border-4 border-black px-8 py-3 rounded-xl font-black uppercase tracking-widest hover:-translate-y-1 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all flex items-center gap-2">
                  <Send size={16} /> Update
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
