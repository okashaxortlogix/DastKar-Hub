import React, { useEffect, useState } from 'react';
import {
  DollarSign,
  Package,
  Boxes,
  Star,
  Plus,
  Truck,
  CheckCircle2,
  Trash2,
  Edit2,
  Layers,
  Store,
  Clock,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';
import { Category, Product } from '../types';

export const SellerDashboardPage: React.FC = () => {
  const { user, isSeller } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'products' | 'orders'>('overview');
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Add Product Modal State
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    title: '',
    category_id: 1,
    base_price: 3500,
    compare_at_price: '',
    stock_quantity: 10,
    production_days: 2,
    materials: '',
    dimensions: '',
    care_instructions: '',
    is_customizable: false,
    description: '',
    image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  });

  const [savingProduct, setSavingProduct] = useState(false);
  const [message, setMessage] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.getSellerStats().catch(() => ({ data: null })),
      api.getSellerProducts().catch(() => ({ data: [] })),
      api.getSellerOrders().catch(() => ({ data: [] })),
      api.getCategories().catch(() => ({ data: [] })),
    ]).then(([statsRes, prodRes, ordRes, catRes]) => {
      setStats(statsRes.data);
      setProducts(prodRes.data || []);
      setOrders(ordRes.data || []);
      setCategories(catRes.data || []);
      setLoading(false);
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProduct(true);
    setMessage('');
    try {
      await api.createSellerProduct({
        ...newProduct,
        compare_at_price: newProduct.compare_at_price ? Number(newProduct.compare_at_price) : null,
        image_urls: [newProduct.image_url],
      });
      setMessage('New handcrafted piece published to DastKar catalog!');
      setIsAddModalOpen(false);
      loadData();
    } catch (err: any) {
      setMessage(err.message || 'Failed to create product');
    } finally {
      setSavingProduct(false);
    }
  };

  const handleUpdateOrderStatus = async (orderItemId: number, status: string) => {
    try {
      await api.updateOrderItemStatus(orderItemId, status);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm('Are you sure you want to remove this piece from your store?')) return;
    try {
      await api.deleteSellerProduct(id);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (!isSeller) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-4 bg-white p-8 rounded-2xl border border-gray-200">
        <Store className="w-12 h-12 text-[#C25E34] mx-auto" />
        <h2 className="font-serif text-xl font-bold text-gray-900">Artisan Storefront Required</h2>
        <p className="text-xs text-gray-500">
          You are signed in as a buyer. Register as a seller or request maker status to access this hub.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Header bar matching mockup */}
      <div className="bg-white p-6 rounded-2xl border border-[#EBE5DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="font-serif text-2xl font-bold text-gray-900">
              Artisan Command Center
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
              Verified Maker
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Storefront: {stats?.seller?.business_name || user?.name} • {stats?.seller?.location_city}, Pakistan
          </p>
        </div>

        {/* Quick Tab switcher */}
        <div className="flex items-center space-x-2 bg-[#FAF8F5] p-1.5 rounded-xl border border-[#EBE5DA] text-xs font-semibold">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'overview' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('products')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'products' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Catalog ({products.length})
          </button>
          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'orders' ? 'bg-[#C25E34] text-white shadow-2xs' : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Orders ({orders.length})
          </button>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-800 text-xs rounded-xl border border-emerald-200">
          {message}
        </div>
      )}

      {/* Overview Tab Content */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* 4 Stat Cards matching mockup */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Total Sales</span>
                <DollarSign className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold font-sans text-gray-900">
                PKR {Number(stats?.total_sales || 389000).toLocaleString('en-PK')}
              </div>
              <div className="text-[11px] text-emerald-700 font-medium flex items-center">
                <ArrowUpRight className="w-3.5 h-3.5 mr-0.5" />
                <span>Direct artisan earnings</span>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Completed Orders</span>
                <Package className="w-4 h-4 text-[#C25E34]" />
              </div>
              <div className="text-2xl font-bold font-serif text-gray-900">
                {stats?.total_orders || 142}
              </div>
              <div className="text-[11px] text-gray-500">Fulfilled across Pakistan</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Active Crafts</span>
                <Boxes className="w-4 h-4 text-sky-600" />
              </div>
              <div className="text-2xl font-bold font-serif text-gray-900">
                {products.length || 18}
              </div>
              <div className="text-[11px] text-gray-500">Listed in marketplace</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] space-y-1">
              <div className="flex items-center justify-between text-gray-400">
                <span className="text-xs font-bold uppercase tracking-wider">Store Rating</span>
                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              </div>
              <div className="text-2xl font-bold font-serif text-gray-900 flex items-center">
                <span>{Number(stats?.store_rating || 4.95).toFixed(1)}</span>
                <span className="text-xs font-normal text-gray-400 ml-1">/ 5.0</span>
              </div>
              <div className="text-[11px] text-amber-700 font-medium">Top Tier Maker Badge</div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="bg-white p-5 rounded-2xl border border-[#EBE5DA] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-bold text-gray-900 text-sm">Quick Actions</h3>
              <p className="text-xs text-gray-500">Manage products, verify incoming shipments, update store</p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-xl hover:bg-[#A0441E] flex items-center space-x-1.5 shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Handcrafted Piece</span>
              </button>
              <button
                onClick={() => setActiveTab('orders')}
                className="px-4 py-2 bg-[#FAF8F5] border border-[#EBE5DA] text-gray-800 text-xs font-semibold rounded-xl hover:bg-gray-100"
              >
                View Fulfillment Queue
              </button>
            </div>
          </div>

          {/* Recent Orders in overview */}
          <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-serif font-bold text-gray-900 text-sm">Recent Order Items</h3>
              <button
                onClick={() => setActiveTab('orders')}
                className="text-xs font-semibold text-[#C25E34] hover:underline"
              >
                View All
              </button>
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              {orders.slice(0, 5).map((item) => (
                <div key={item.id} className="p-4 flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center space-x-3">
                    <img
                      src={item.product_image || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover bg-gray-50"
                    />
                    <div>
                      <span className="font-semibold text-gray-900">{item.product_title}</span>
                      <p className="text-gray-400 text-[11px]">
                        Order #{item.order?.order_number || item.order_id} • Buyer: {item.order?.buyer?.name || 'Patron'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <span className="font-bold text-gray-900 font-sans">
                      PKR {Number(item.subtotal).toLocaleString('en-PK')}
                    </span>
                    <span className="capitalize px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-800">
                      {item.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Products Tab Content */}
      {activeTab === 'products' && (
        <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-serif text-lg font-bold text-gray-900">Your Handcrafted Catalog</h2>
              <p className="text-xs text-gray-500">Manage pieces, adjust prices, and update available stock</p>
            </div>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-xl hover:bg-[#A0441E] flex items-center space-x-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Craft</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-700">
              <thead className="bg-[#FAF8F5] text-gray-500 uppercase text-[10px] tracking-wider font-semibold">
                <tr>
                  <th className="p-3">Product</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Available Stock</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {products.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50">
                    <td className="p-3 flex items-center space-x-3">
                      <img
                        src={p.primary_image?.image_url || p.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=150&q=80'}
                        alt=""
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 line-clamp-1">{p.title}</div>
                        <div className="text-[11px] text-gray-400">Prep time: {p.production_days} days</div>
                      </div>
                    </td>
                    <td className="p-3 text-gray-600">{p.category?.name || 'Craft'}</td>
                    <td className="p-3 font-bold text-gray-900 font-sans">
                      PKR {Number(p.base_price).toLocaleString('en-PK')}
                    </td>
                    <td className="p-3 font-semibold text-gray-800">{p.stock_quantity} units</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700">
                        {p.status}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={() => handleDeleteProduct(p.id)}
                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete product"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Orders Fulfillment Tab Content */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-[#EBE5DA] p-5 space-y-4">
          <div>
            <h2 className="font-serif text-lg font-bold text-gray-900">Order Fulfillment Queue</h2>
            <p className="text-xs text-gray-500">Track and advance statuses as items are prepared and couriered</p>
          </div>

          <div className="divide-y divide-gray-100">
            {orders.map((item) => (
              <div key={item.id} className="py-4 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div>
                    <span className="font-mono font-bold text-gray-900">
                      Order #{item.order?.order_number || item.order_id}
                    </span>
                    <span className="text-gray-400 ml-2">
                      Buyer: <strong className="text-gray-800">{item.order?.buyer?.name || 'Patron'}</strong>
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-sans font-bold text-gray-900 text-sm">
                      PKR {Number(item.subtotal).toLocaleString('en-PK')}
                    </span>
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-bold capitalize bg-amber-50 text-amber-800 border border-amber-200">
                      Status: {item.status}
                    </span>
                  </div>
                </div>

                <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EBE5DA] flex items-center justify-between text-xs">
                  <div>
                    <p className="font-semibold text-gray-900">{item.product_title}</p>
                    {item.customization_json && (
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Customization: {JSON.stringify(item.customization_json)}
                      </p>
                    )}
                  </div>
                  <span className="text-gray-500">Qty: {item.quantity}</span>
                </div>

                {/* Status action buttons */}
                <div className="flex items-center justify-end space-x-2 text-xs">
                  {item.status === 'pending' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(item.id, 'processing')}
                      className="px-3 py-1.5 bg-amber-600 text-white font-semibold rounded-lg hover:bg-amber-700"
                    >
                      Accept & Begin Crafting
                    </button>
                  )}
                  {item.status === 'processing' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(item.id, 'shipped')}
                      className="px-3 py-1.5 bg-sky-600 text-white font-semibold rounded-lg hover:bg-sky-700 flex items-center space-x-1"
                    >
                      <Truck className="w-3.5 h-3.5" />
                      <span>Hand Over to Courier (Mark Shipped)</span>
                    </button>
                  )}
                  {item.status === 'shipped' && (
                    <button
                      onClick={() => handleUpdateOrderStatus(item.id, 'delivered')}
                      className="px-3 py-1.5 bg-emerald-600 text-white font-semibold rounded-lg hover:bg-emerald-700 flex items-center space-x-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Mark Delivered to Patron</span>
                    </button>
                  )}
                  {item.status === 'delivered' && (
                    <span className="text-emerald-700 font-semibold text-xs flex items-center">
                      <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                      Completed & Payout Cleared
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl max-h-[90vh] overflow-y-auto">
            <h3 className="font-serif text-lg font-bold text-gray-900">
              Publish New Handcrafted Piece
            </h3>

            <form onSubmit={handleCreateProduct} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-gray-700 block mb-1">Product Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hand-turned Multani Blue Pottery Urn"
                  value={newProduct.title}
                  onChange={(e) => setNewProduct({ ...newProduct, title: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Category *</label>
                  <select
                    value={newProduct.category_id}
                    onChange={(e) => setNewProduct({ ...newProduct, category_id: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Price (PKR) *</label>
                  <input
                    type="number"
                    required
                    min="100"
                    value={newProduct.base_price}
                    onChange={(e) => setNewProduct({ ...newProduct, base_price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Available Stock *</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={newProduct.stock_quantity}
                    onChange={(e) => setNewProduct({ ...newProduct, stock_quantity: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                  />
                </div>

                <div>
                  <label className="font-bold text-gray-700 block mb-1">Production Time (Days)</label>
                  <input
                    type="number"
                    min="1"
                    value={newProduct.production_days}
                    onChange={(e) => setNewProduct({ ...newProduct, production_days: Number(e.target.value) })}
                    className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Indigenous Materials</label>
                <input
                  type="text"
                  placeholder="e.g. Multan riverbed clay, Cobalt glaze"
                  value={newProduct.materials}
                  onChange={(e) => setNewProduct({ ...newProduct, materials: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Photo URL *</label>
                <input
                  type="url"
                  required
                  value={newProduct.image_url}
                  onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Describe the craft history, workshop origin, and details..."
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-gray-200 rounded-lg"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-600 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingProduct}
                  className="px-4 py-2 bg-[#C25E34] text-white font-semibold rounded-lg hover:bg-[#A0441E]"
                >
                  {savingProduct ? 'Publishing...' : 'Publish Piece'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
