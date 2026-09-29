import React, { useEffect, useState } from 'react';
import { ShieldCheck, CheckCircle2, AlertCircle, BarChart3, Users, Store, Package } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState('');

  const loadStats = () => {
    setLoading(true);
    api.getAdminStats()
      .then((res) => {
        setStats(res.data);
      })
      .catch((err) => {
        console.error('Failed to load admin stats', err);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleVerify = async (sellerId: number, status: string) => {
    try {
      await api.verifySeller(sellerId, status);
      setActionMsg(`Artisan verification updated to ${status}.`);
      loadStats();
    } catch (err: any) {
      alert(err.message || 'Verification update failed');
    }
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-3 bg-white p-8 rounded-2xl border border-gray-200">
        <ShieldCheck className="w-12 h-12 text-purple-600 mx-auto" />
        <h2 className="font-serif text-xl font-bold text-gray-900">Admin Privileges Required</h2>
        <p className="text-xs text-gray-500">
          This portal is restricted to DastKar Hub platform moderators and operations managers.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      <div>
        <div className="flex items-center space-x-2">
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            DastKar Hub Platform Operations
          </h1>
          <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
            Platform Operator
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">Platform overview, artisan vetting, and marketplace governance</p>
      </div>

      {actionMsg && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          {actionMsg}
        </div>
      )}

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Marketplace GMV</span>
          <div className="text-2xl font-bold font-sans text-gray-900">
            PKR {Number(stats?.gmv || 0).toLocaleString('en-PK')}
          </div>
          <p className="text-[11px] text-gray-500">Gross Merchandise Volume</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
          <div className="text-2xl font-bold font-serif text-gray-900">{stats?.orders_count || 0}</div>
          <p className="text-[11px] text-gray-500">Transacted orders</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Registered Makers</span>
          <div className="text-2xl font-bold font-serif text-gray-900">{stats?.sellers_count || 0}</div>
          <p className="text-[11px] text-emerald-700 font-semibold">{stats?.verified_sellers_count || 0} verified</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Craft Catalog</span>
          <div className="text-2xl font-bold font-serif text-gray-900">{stats?.products_count || 0}</div>
          <p className="text-[11px] text-gray-500">Published pieces</p>
        </div>
      </div>

      {/* Verification Queue Table */}
      <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900">Artisan Verification Queue</h2>
            <p className="text-xs text-gray-500">Vet workshops and assign trust badges</p>
          </div>
          <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full">
            {stats?.pending_verifications?.length || 0} In Review
          </span>
        </div>

        <div className="divide-y divide-gray-100 text-xs">
          {stats?.pending_verifications?.map((s: any) => (
            <div key={s.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-3">
                <img
                  src={s.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=150&q=80'}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-bold text-gray-900">{s.business_name}</div>
                  <div className="text-gray-500">{s.craft_description || s.bio}</div>
                  <div className="text-gray-400 text-[11px]">
                    Location: {s.location_city} • Contact: {s.user?.email || s.user?.phone}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-2 py-0.5 rounded text-[11px] font-bold uppercase bg-amber-50 text-amber-800">
                  {s.verification_status}
                </span>

                <button
                  onClick={() => handleVerify(s.id, 'verified')}
                  className="px-3 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold"
                >
                  Verify Artisan
                </button>
                <button
                  onClick={() => handleVerify(s.id, 'established')}
                  className="px-3 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                  Award Established Badge
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
