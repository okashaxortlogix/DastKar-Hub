import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Package, Heart, Award, Clock, Star, CheckCircle2, ChevronRight } from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';
import { Order } from '../types';

export const CustomerDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewStatus, setReviewStatus] = useState('');

  useEffect(() => {
    api.getOrders()
      .then((res) => {
        setOrders(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load orders', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewOrder || !reviewOrder.items?.[0]?.product_id) return;
    try {
      await api.submitReview(reviewOrder.order_number, {
        product_id: reviewOrder.items[0].product_id,
        rating: reviewRating,
        comment: reviewComment,
      });
      setReviewStatus('Review submitted successfully! Shukriya for supporting Pakistani artisans.');
      setTimeout(() => {
        setReviewOrder(null);
        setReviewStatus('');
      }, 2000);
    } catch (err: any) {
      setReviewStatus(err.message || 'Failed to submit review');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Welcome Bar matching mockup */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBE5DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-gray-900">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs text-gray-500 mt-1">
            Track your artisan craft orders and patron history
          </p>
        </div>
        <div className="flex items-center space-x-2 text-xs">
          <span className="px-3 py-1 rounded-full bg-amber-50 text-[#C25E34] border border-amber-200 font-semibold">
            Patron Account: {user?.email}
          </span>
        </div>
      </div>

      {/* 3 Metric Cards matching mockup */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C25E34] flex items-center justify-center">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-gray-900">{orders.length}</div>
            <div className="text-xs text-gray-500">Total Craft Orders</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <Heart className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-gray-900">12</div>
            <div className="text-xs text-gray-500">Wishlist Pieces</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-2xl font-bold font-serif text-gray-900">240</div>
            <div className="text-xs text-gray-500">Patron Points</div>
          </div>
        </div>
      </div>

      {/* Orders List Table */}
      <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-serif text-lg font-bold text-gray-900">Recent Orders</h2>
          <span className="text-xs text-gray-500">{orders.length} orders recorded</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-400">Loading orders...</div>
        ) : orders.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {orders.map((ord) => (
              <div key={ord.id} className="p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono font-bold text-gray-900">{ord.order_number}</span>
                    <span className="text-gray-400">•</span>
                    <span className="text-gray-500">{new Date(ord.placed_at || ord.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2.5 py-0.5 rounded-full font-semibold capitalize text-[11px] ${
                      ord.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-800'
                        : ord.status === 'shipped'
                        ? 'bg-sky-50 text-sky-800'
                        : 'bg-amber-50 text-amber-800'
                    }`}>
                      {ord.status.replace('_', ' ')}
                    </span>
                    <span className="font-bold text-gray-900 font-sans">
                      PKR {Number(ord.total_amount).toLocaleString('en-PK')}
                    </span>
                  </div>
                </div>

                {/* Items preview in order */}
                <div className="space-y-2 pt-1">
                  {ord.items?.map((item) => (
                    <div key={item.id} className="flex items-center justify-between text-xs bg-[#FAF8F5] p-2.5 rounded-xl border border-[#EBE5DA]">
                      <div className="flex items-center space-x-3">
                        {item.product_image && (
                          <img src={item.product_image} alt={item.product_title} className="w-10 h-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-semibold text-gray-900">{item.product_title}</p>
                          <p className="text-[11px] text-gray-500">Maker: {item.seller?.business_name || 'Artisan'}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-sans font-bold text-gray-800">
                          PKR {Number(item.subtotal).toLocaleString('en-PK')}
                        </span>
                        <span className="text-[11px] text-gray-400 block">Qty: {item.quantity}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end space-x-3 pt-1">
                  {ord.status === 'delivered' && (
                    <button
                      onClick={() => setReviewOrder(ord)}
                      className="px-3 py-1.5 bg-amber-50 text-[#C25E34] border border-amber-200 text-xs font-semibold rounded-lg hover:bg-amber-100 transition-colors flex items-center space-x-1"
                    >
                      <Star className="w-3.5 h-3.5" />
                      <span>Review Artisan</span>
                    </button>
                  )}
                  <span className="text-xs text-gray-400">
                    Payment: <span className="uppercase text-gray-600 font-medium">{ord.payment_method}</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-gray-300 mx-auto" />
            <p className="text-sm font-serif font-bold text-gray-800">No Orders Placed Yet</p>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              When you purchase handmade crafts directly from our Pakistani artisans, your order tracking will appear here.
            </p>
            <Link
              to="/products"
              className="inline-block px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-lg hover:bg-[#A0441E] transition-colors"
            >
              Explore Authentic Crafts
            </Link>
          </div>
        )}
      </div>

      {/* Review Modal */}
      {reviewOrder && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Review Artisan Craft ({reviewOrder.order_number})
            </h3>
            <p className="text-xs text-gray-500">
              Share your feedback to support independent Pakistani makers and guide other patrons.
            </p>

            {reviewStatus && (
              <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-lg border border-emerald-200">
                {reviewStatus}
              </div>
            )}

            <form onSubmit={handleReviewSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Rating</label>
                <div className="flex space-x-1 text-amber-500">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setReviewRating(star)}
                      className="p-1 hover:scale-110 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewRating ? 'fill-amber-500 text-amber-500' : 'text-gray-300'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Your Review</label>
                <textarea
                  rows={3}
                  required
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="How was the craftsmanship, packing, and finish of this piece?"
                  className="w-full text-xs p-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setReviewOrder(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 text-xs font-semibold rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-lg hover:bg-[#A0441E]"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
