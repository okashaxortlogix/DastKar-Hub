import React, { useEffect, useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  CreditCard,
  Sliders,
  Check,
  X,
  Clock,
  ArrowUpRight,
  UserCheck,
  Scale
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';
import { Toast, ToastType } from '../components/ui/Toast';

export const AdminDashboardPage: React.FC = () => {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'verifications' | 'disputes' | 'payouts' | 'governance'>('verifications');
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  // Mock operational state for Disputes and Payouts
  const [disputes, setDisputes] = useState([
    {
      id: 101,
      order_id: 'ORD-8942',
      buyer_name: 'Zahra Khan',
      seller_name: 'Multan Kashigar Guild',
      amount: 14500,
      reason: 'Damaged in transit — Blue Pottery Vase cracked on delivery',
      status: 'under_review',
      date: '2026-09-28',
    },
    {
      id: 102,
      order_id: 'ORD-8931',
      buyer_name: 'Bilal Farooq',
      seller_name: 'Hala Ajrak Workshop',
      amount: 6800,
      reason: 'Dimension mismatch — Block print runner shorter than catalog listing',
      status: 'pending_maker_response',
      date: '2026-09-26',
    },
  ]);

  const [payouts, setPayouts] = useState([
    {
      id: 201,
      artisan: 'Chiniot Carvers',
      orders_count: 8,
      net_amount: 142000,
      iban: 'PK45HABB00001234567890',
      bank: 'Habib Bank Limited',
      status: 'ready_for_release',
    },
    {
      id: 202,
      artisan: 'Swat Valley Weavers',
      orders_count: 5,
      net_amount: 68500,
      iban: 'PK12MEZN00009876543210',
      bank: 'Meezan Bank',
      status: 'ready_for_release',
    },
    {
      id: 203,
      artisan: 'Peshawar Brass Guild',
      orders_count: 12,
      net_amount: 198000,
      iban: 'PK88BAHL00005544332211',
      bank: 'Bank AL Habib',
      status: 'escrow_cleared',
    },
  ]);

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
      setToast({ message: `Artisan verification updated to ${status}.`, type: 'success' });
      loadStats();
    } catch (err: any) {
      setToast({ message: err.message || 'Verification update failed', type: 'error' });
    }
  };

  const handleResolveDispute = (disputeId: number, decision: 'refund_buyer' | 'release_to_seller') => {
    setDisputes((prev) =>
      prev.map((d) => (d.id === disputeId ? { ...d, status: decision === 'refund_buyer' ? 'refunded' : 'dismissed' } : d))
    );
    setToast({
      message: decision === 'refund_buyer' ? 'Dispute resolved: Refund approved to buyer from escrow.' : 'Dispute resolved: Funds released to artisan.',
      type: 'success',
    });
  };

  const handleReleasePayout = (payoutId: number) => {
    setPayouts((prev) =>
      prev.map((p) => (p.id === payoutId ? { ...p, status: 'dispatched' } : p))
    );
    setToast({ message: 'Direct IBFT payout batch dispatched via Raast / 1Link.', type: 'success' });
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-3 bg-white p-8 rounded-2xl border border-gray-200">
        <ShieldCheck className="w-12 h-12 text-purple-600 mx-auto" />
        <h2 className="font-serif text-xl font-bold text-gray-900">Admin Privileges Required</h2>
        <p className="text-xs text-gray-500 leading-relaxed">
          This portal is restricted to DastKar Hub platform moderators and operations managers.
        </p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 animate-pulse space-y-6">
        <div className="h-16 bg-gray-200 rounded-2xl" />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded-2xl" />
          ))}
        </div>
        <div className="h-64 bg-gray-200 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-8 space-y-5 sm:space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              DastKar Hub Platform Operations
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Platform Operator
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">Platform overview, artisan vetting, disputes, and escrow governance</p>
        </div>

        {/* Operational Navigation Tabs (AD-01) */}
        <div role="tablist" aria-label="Admin Operations Tabs" className="flex items-center space-x-1 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#EBE5DA] text-xs font-semibold overflow-x-auto scrollbar-none">
          <button
            role="tab"
            aria-selected={activeTab === 'verifications'}
            onClick={() => {
              setActiveTab('verifications');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'verifications' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Vetting ({stats?.pending_verifications?.length || 0})</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'disputes'}
            onClick={() => {
              setActiveTab('disputes');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'disputes' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Scale className="w-3.5 h-3.5" />
            <span>Disputes ({disputes.filter((d) => d.status !== 'refunded' && d.status !== 'dismissed').length})</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'payouts'}
            onClick={() => {
              setActiveTab('payouts');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'payouts' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Payouts &amp; Escrow</span>
          </button>
          <button
            role="tab"
            aria-selected={activeTab === 'governance'}
            onClick={() => {
              setActiveTab('governance');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors flex items-center space-x-1.5 cursor-pointer ${
              activeTab === 'governance' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Governance</span>
          </button>
        </div>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Marketplace GMV</span>
          <div className="text-2xl font-bold font-sans text-gray-900">
            PKR {Number(stats?.gmv || 0).toLocaleString('en-PK')}
          </div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-emerald-700 font-semibold flex items-center">
              <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
              +18.4% MoM
            </span>
            <span className="text-gray-400">All-time</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Total Orders</span>
          <div className="text-2xl font-bold font-serif text-gray-900">{stats?.orders_count || 0}</div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-gray-600 font-medium">98.2% fulfillment rate</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Registered Makers</span>
          <div className="text-2xl font-bold font-serif text-gray-900">{stats?.sellers_count || 0}</div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-emerald-700 font-semibold">{stats?.verified_sellers_count || 0} verified</span>
            <span className="text-gray-400">Pakistan-wide</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1 shadow-2xs">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400">Craft Catalog</span>
          <div className="text-2xl font-bold font-serif text-gray-900">{stats?.products_count || 0}</div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="text-purple-700 font-semibold">12 craft clusters</span>
          </div>
        </div>
      </div>

      {/* Tab 1: Artisan Verification Queue */}
      {activeTab === 'verifications' && (
        <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden shadow-2xs">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Artisan Verification Queue</h2>
              <p className="text-xs text-gray-500">Vet workshops, review craft history, and assign trust badges</p>
            </div>
            <span className="text-xs text-purple-700 font-semibold bg-purple-50 px-2.5 py-1 rounded-full">
              {stats?.pending_verifications?.length || 0} In Review
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {stats?.pending_verifications && stats.pending_verifications.length > 0 ? (
              stats.pending_verifications.map((s: any) => (
                <div key={s.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-700 font-bold flex items-center justify-center border border-purple-200 shrink-0">
                      {s.business_name?.charAt(0) || 'M'}
                    </div>
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
                      type="button"
                      onClick={() => handleVerify(s.id, 'verified')}
                      className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-semibold shadow-2xs transition-colors"
                    >
                      Verify Artisan
                    </button>
                    <button
                      type="button"
                      onClick={() => handleVerify(s.id, 'established')}
                      className="px-3 py-1.5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold shadow-2xs transition-colors"
                    >
                      Award Established Badge
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-8 text-center text-xs text-gray-500">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2 opacity-80" />
                <p className="font-medium text-gray-700">All artisan applications are up to date</p>
                <p className="text-gray-400 mt-0.5">New maker registrations will appear here for review and badge verification.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab 2: Disputes & Moderation */}
      {activeTab === 'disputes' && (
        <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden shadow-2xs space-y-4">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Escrow &amp; Order Disputes</h2>
              <p className="text-xs text-gray-500">Resolve buyer claims, transit damages, and escrow holds</p>
            </div>
            <span className="text-xs text-amber-700 font-semibold bg-amber-50 px-2.5 py-1 rounded-full flex items-center">
              <AlertTriangle className="w-3 h-3 mr-1 text-amber-600" />
              {disputes.filter((d) => d.status !== 'refunded' && d.status !== 'dismissed').length} Pending Resolution
            </span>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {disputes.map((dispute) => (
              <div key={dispute.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <span className="font-mono font-bold text-gray-900">{dispute.order_id}</span>
                    <span className="text-gray-400">•</span>
                    <span className="font-semibold text-gray-800">{dispute.buyer_name} vs {dispute.seller_name}</span>
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      dispute.status === 'refunded'
                        ? 'bg-red-50 text-red-700'
                        : dispute.status === 'dismissed'
                        ? 'bg-emerald-50 text-emerald-700'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {dispute.status.replaceAll('_', ' ')}
                    </span>
                  </div>
                  <p className="text-gray-600">{dispute.reason}</p>
                  <div className="text-[11px] text-gray-400">
                    Disputed Escrow Amount: <strong className="text-gray-900 font-sans">PKR {dispute.amount.toLocaleString('en-PK')}</strong> • Filed {dispute.date}
                  </div>
                </div>

                {dispute.status !== 'refunded' && dispute.status !== 'dismissed' && (
                  <div className="flex items-center space-x-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => handleResolveDispute(dispute.id, 'refund_buyer')}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Refund Buyer</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => handleResolveDispute(dispute.id, 'release_to_seller')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center space-x-1"
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Release to Maker</span>
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 3: Payouts & Escrow Ledger */}
      {activeTab === 'payouts' && (
        <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden shadow-2xs space-y-4">
          <div className="p-5 border-b border-gray-100 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Direct Artisan Escrow Settlements</h2>
              <p className="text-xs text-gray-500">Scheduled payouts to verified makers with zero middleman deductions</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                0% Platform Commission Promise
              </span>
            </div>
          </div>

          <div className="divide-y divide-gray-100 text-xs">
            {payouts.map((p) => (
              <div key={p.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-900 text-sm">{p.artisan}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-sky-50 text-sky-800">
                      {p.orders_count} orders cleared
                    </span>
                  </div>
                  <div className="text-gray-500 font-mono text-[11px]">
                    IBAN: {p.iban} • {p.bank}
                  </div>
                  <div className="text-base font-bold font-sans text-gray-900 pt-0.5">
                    PKR {p.net_amount.toLocaleString('en-PK')}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  {p.status === 'dispatched' ? (
                    <span className="flex items-center text-emerald-700 font-semibold space-x-1">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>Dispatched via Raast</span>
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleReleasePayout(p.id)}
                      className="px-4 py-2 bg-[#C25E34] hover:bg-[#A0441E] text-white font-semibold rounded-lg shadow-2xs transition-colors flex items-center space-x-1.5"
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Release Settlement</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Platform Governance */}
      {activeTab === 'governance' && (
        <div className="bg-white rounded-2xl border border-[#EBE5DA] p-6 shadow-2xs space-y-6 text-xs">
          <div className="border-b border-gray-100 pb-4">
            <h2 className="font-serif text-lg font-bold text-gray-900">Platform Governance &amp; Policies</h2>
            <p className="text-gray-500 mt-1">Configure transparent escrow rules and artisan support frameworks</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5DA] space-y-2">
              <h3 className="font-serif font-bold text-gray-900 text-sm flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Fair Trade &amp; 0% Middleman Rule</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                DastKar Hub operates on direct artisan payouts. 100% of the listed craft price goes to the workshop maker. Platform operational costs are subsidized via cultural preservation grants.
              </p>
              <div className="pt-2 text-emerald-800 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Active policy enforced on all transactions</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-[#EBE5DA] space-y-2">
              <h3 className="font-serif font-bold text-gray-900 text-sm flex items-center space-x-2">
                <Clock className="w-4 h-4 text-sky-600" />
                <span>Escrow Hold Period</span>
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Funds are held in escrow for 48 hours post courier delivery confirmation to allow buyers to inspect fragile pottery and handcrafted items for transit damage before settlement release.
              </p>
              <div className="pt-2 text-sky-800 font-semibold flex items-center space-x-1">
                <Check className="w-3.5 h-3.5" />
                <span>Standard window: 48 hours post-dispatch</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};
