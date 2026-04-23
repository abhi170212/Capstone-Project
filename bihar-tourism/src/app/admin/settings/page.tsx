'use client';

import { useAuth } from '@/context/AuthContext';

export default function AdminSettingsPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-[#FFF8EC] p-6 rounded-2xl shadow-sm border border-[#546B41]/20">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-black mb-2">Platform Settings</h1>
          <p className="text-[#546B41] font-medium tracking-wide">Configure globals, theme preferences, and security.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Security Settings Area */}
        <div className="bg-[#FFF8EC] p-6 rounded-2xl shadow-sm border border-[#546B41]/20">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#546B41] mb-4 border-b border-[#546B41]/20 pb-2">Security</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Two-Factor Authentication</span>
              <button className="px-4 py-2 bg-[#DCCCAC] text-[#546B41] font-bold rounded-lg hover:bg-[#99AD7A] hover:text-black transition-colors border border-[#546B41]/20">Setup</button>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Session Timeout</span>
              <select className="px-3 py-2 border border-[#546B41]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#546B41] focus:border-transparent font-medium bg-white text-black">
                <option>15 Minutes</option>
                <option>30 Minutes</option>
                <option>1 Hour</option>
              </select>
            </div>
          </div>
        </div>

        {/* General Options */}
        <div className="bg-[#FFF8EC] p-6 rounded-2xl shadow-sm border border-[#546B41]/20">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#546B41] mb-4 border-b border-[#546B41]/20 pb-2">General</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Maintenance Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#99AD7A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#546B41]"></div>
              </label>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-black font-bold">Allow New Registrations</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-[#99AD7A] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#546B41]"></div>
              </label>
            </div>
          </div>
        </div>

        {/* Developer Info (Credentials Reference) */}
        <div className="md:col-span-2 bg-[#DCCCAC]/30 p-6 rounded-2xl shadow-sm border border-[#546B41]/20">
          <h2 className="text-xl font-black uppercase tracking-widest text-[#546B41] mb-4 border-b border-[#546B41]/20 pb-2">Developer Information</h2>
          <p className="text-[#546B41] font-bold mb-4 text-sm tracking-wide">
            This module is restricted strictly to Developer operations. Note the current environment administration login details below.
          </p>
          <div className="bg-white p-4 rounded-lg font-mono text-sm max-w-sm border-2 border-[#546B41]/20">
            <p><span className="text-[#546B41]/60 mr-2 font-bold uppercase tracking-widest text-[10px]">Admin Email:</span> <strong className="text-black">admin@bihartourism.com</strong></p>
            <p><span className="text-[#546B41]/60 mr-2 font-bold uppercase tracking-widest text-[10px]">Admin Password:</span> <strong className="text-black">admin123</strong></p>
          </div>
        </div>

      </div>
    </div>
  );
}
