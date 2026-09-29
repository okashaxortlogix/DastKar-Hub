import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Building,
  CheckCircle2,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useCart } from '../lib/cartContext';
import { useAuth } from '../lib/authContext';
import { api } from '../lib/api';
import { Order } from '../types';

export const CheckoutPage: React.FC = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingMethod, setShippingMethod] = useState<'standard' | 'express'>('standard');
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'jazzcash_easypaisa' | 'card' | 'bank_transfer'>('cod');

  const [address, setAddress] = useState({
    full_name: user?.name || '',
    phone: user?.phone || '',
    address_line1: '',
    address_line2: '',
    city: 'Karachi',
    postal_code: '',
  });

  const [notes, setNotes] = useState('');
  const [quote, setQuote] = useState<any>(null);
  const [loadingQuote, setLoadingQuote] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [errorMsg, setErrorMsg] = useState('');

  // Fetch authoritative quote from backend on item or shipping change
  useEffect(() => {
    if (items.length === 0 && !completedOrder) {
      navigate('/cart');
      return;
    }

    setLoadingQuote(true);
    const quotePayload = {
      items: items.map((i) => ({
        product_id: i.product.id,
        variant_id: i.variant?.id ?? null,
        quantity: i.quantity,
        customization: i.customization || null,
      })),
      shipping_method: shippingMethod,
    };

    api.getQuote(quotePayload)
      .then((res) => {
        setQuote(res.data);
      })
      .catch((err) => {
        setErrorMsg(err.message || 'Failed to calculate quote');
      })
      .finally(() => {
        setLoadingQuote(false);
      });
  }, [items, shippingMethod, completedOrder]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!user) {
      // Prompt user to sign in or register
      navigate('/auth?redirect=/checkout');
      return;
    }

    if (!address.full_name || !address.phone || !address.address_line1 || !address.city) {
      setErrorMsg('Please complete all required shipping address fields.');
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({
          product_id: i.product.id,
          variant_id: i.variant?.id ?? null,
          quantity: i.quantity,
          customization: i.customization || null,
        })),
        shipping_method: shippingMethod,
        payment_method: paymentMethod,
        shipping_address: address,
        notes,
      };

      const res = await api.placeOrder(orderPayload);
      setCompletedOrder(res.data);
      clearCart();
    } catch (err: any) {
      setErrorMsg(err.message || 'Order processing failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (completedOrder) {
    return (
      <div className="max-w-2xl mx-auto my-12 px-4 space-y-6">
        <div className="bg-white rounded-2xl border border-[#EBE5DA] p-8 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full">
            Order Confirmed & Sent to Artisans
          </span>
          <h1 className="font-serif text-3xl font-bold text-gray-900">
            Shukriya for Supporting Pakistani Crafts!
          </h1>
          <p className="text-xs text-gray-600 max-w-md mx-auto leading-relaxed">
            Your handcrafted order has been assigned to the makers. You will receive SMS & courier updates as each piece is prepared.
          </p>

          <div className="bg-[#FAF8F5] p-4 rounded-xl border border-[#EBE5DA] text-xs text-left space-y-2 max-w-md mx-auto">
            <div className="flex justify-between">
              <span className="text-gray-500">Order Number:</span>
              <span className="font-mono font-bold text-gray-900">{completedOrder.order_number}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Total Amount:</span>
              <span className="font-bold text-gray-900 font-sans">
                PKR {Number(completedOrder.total_amount).toLocaleString('en-PK')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Payment:</span>
              <span className="uppercase font-semibold text-amber-800">{completedOrder.payment_method}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500">Destination:</span>
              <span className="text-gray-800">{completedOrder.shipping_address_snapshot?.city}, Pakistan</span>
            </div>
          </div>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to={`/account/orders`}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#C25E34] text-white text-xs font-semibold rounded-xl hover:bg-[#A0441E] transition-colors"
            >
              View Order Tracking
            </Link>
            <Link
              to="/products"
              className="w-full sm:w-auto px-6 py-2.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl hover:bg-gray-200 transition-colors"
            >
              Continue Exploring
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Checkout Header */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Secure Artisan Checkout
          </h1>
          <p className="text-xs text-gray-500 mt-1">Direct from makers across Pakistan to your doorstep</p>
        </div>
        <div className="flex items-center space-x-1.5 text-xs text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-full border border-emerald-200 font-medium">
          <Lock className="w-3.5 h-3.5" />
          <span>256-bit Encrypted</span>
        </div>
      </div>

      {errorMsg && (
        <div className="p-4 bg-red-50 text-red-700 text-xs rounded-xl border border-red-200">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Step 1 Address + Step 2 Shipping + Step 3 Payment */}
        <div className="lg:col-span-8 space-y-6">
          {/* Step 1: Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-[#EBE5DA] space-y-4">
            <div className="flex items-center space-x-2 font-serif text-base font-bold text-gray-900">
              <span className="w-6 h-6 rounded-full bg-[#C25E34] text-white flex items-center justify-center text-xs">
                1
              </span>
              <span>Shipping Address</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1">
                <label className="font-medium text-gray-700">Full Name *</label>
                <input
                  type="text"
                  required
                  value={address.full_name}
                  onChange={(e) => setAddress({ ...address, full_name: e.target.value })}
                  placeholder="e.g. Ayesha Siddiqui"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-gray-700">Phone Number (for Courier Delivery) *</label>
                <input
                  type="tel"
                  required
                  value={address.phone}
                  onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                  placeholder="e.g. +92 301 4443322"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div className="sm:col-span-2 space-y-1">
                <label className="font-medium text-gray-700">Street Address / House No / Area *</label>
                <input
                  type="text"
                  required
                  value={address.address_line1}
                  onChange={(e) => setAddress({ ...address, address_line1: e.target.value })}
                  placeholder="e.g. House 42-B, Street 7, Clifton"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-medium text-gray-700">City *</label>
                <select
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                >
                  {['Karachi', 'Lahore', 'Islamabad', 'Rawalpindi', 'Peshawar', 'Quetta', 'Multan', 'Faisalabad', 'Sialkot', 'Hyderabad', 'Chiniot', 'Gilgit'].map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-gray-700">Postal Code (Optional)</label>
                <input
                  type="text"
                  value={address.postal_code}
                  onChange={(e) => setAddress({ ...address, postal_code: e.target.value })}
                  placeholder="e.g. 75600"
                  className="w-full p-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                />
              </div>
            </div>
          </div>

          {/* Step 2: Shipping Method */}
          <div className="bg-white p-6 rounded-2xl border border-[#EBE5DA] space-y-4">
            <div className="flex items-center space-x-2 font-serif text-base font-bold text-gray-900">
              <span className="w-6 h-6 rounded-full bg-[#C25E34] text-white flex items-center justify-center text-xs">
                2
              </span>
              <span>Delivery Method</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                  shippingMethod === 'standard'
                    ? 'border-[#C25E34] bg-amber-50/50 ring-1 ring-[#C25E34]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping_method"
                  checked={shippingMethod === 'standard'}
                  onChange={() => setShippingMethod('standard')}
                  className="mt-0.5 text-[#C25E34]"
                />
                <div>
                  <div className="font-semibold text-gray-900">Standard Courier (3–5 Days)</div>
                  <div className="text-gray-500 mt-0.5">Nationwide delivery with tracking</div>
                  <div className="text-[#C25E34] font-bold mt-1">
                    {quote?.shipping_fee === 0 ? 'FREE' : 'PKR 250'}
                  </div>
                </div>
              </label>

              <label
                className={`p-4 rounded-xl border cursor-pointer transition-all flex items-start space-x-3 ${
                  shippingMethod === 'express'
                    ? 'border-[#C25E34] bg-amber-50/50 ring-1 ring-[#C25E34]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="shipping_method"
                  checked={shippingMethod === 'express'}
                  onChange={() => setShippingMethod('express')}
                  className="mt-0.5 text-[#C25E34]"
                />
                <div>
                  <div className="font-semibold text-gray-900">Priority Express (1–2 Days)</div>
                  <div className="text-gray-500 mt-0.5">Expedited courier dispatch</div>
                  <div className="text-[#C25E34] font-bold mt-1">PKR 450</div>
                </div>
              </label>
            </div>
          </div>

          {/* Step 3: Payment Method */}
          <div className="bg-white p-6 rounded-2xl border border-[#EBE5DA] space-y-4">
            <div className="flex items-center space-x-2 font-serif text-base font-bold text-gray-900">
              <span className="w-6 h-6 rounded-full bg-[#C25E34] text-white flex items-center justify-center text-xs">
                3
              </span>
              <span>Payment Option</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  paymentMethod === 'cod'
                    ? 'border-[#C25E34] bg-amber-50/50 ring-1 ring-[#C25E34]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="text-[#C25E34]"
                />
                <Banknote className="w-4 h-4 text-emerald-600" />
                <span className="font-medium text-gray-900">Cash on Delivery (COD)</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  paymentMethod === 'jazzcash_easypaisa'
                    ? 'border-[#C25E34] bg-amber-50/50 ring-1 ring-[#C25E34]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === 'jazzcash_easypaisa'}
                  onChange={() => setPaymentMethod('jazzcash_easypaisa')}
                  className="text-[#C25E34]"
                />
                <Smartphone className="w-4 h-4 text-[#C25E34]" />
                <span className="font-medium text-gray-900">JazzCash / Easypaisa</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  paymentMethod === 'card'
                    ? 'border-[#C25E34] bg-amber-50/50 ring-1 ring-[#C25E34]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === 'card'}
                  onChange={() => setPaymentMethod('card')}
                  className="text-[#C25E34]"
                />
                <CreditCard className="w-4 h-4 text-sky-600" />
                <span className="font-medium text-gray-900">Debit / Credit Card (Visa/Mastercard)</span>
              </label>

              <label
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center space-x-3 ${
                  paymentMethod === 'bank_transfer'
                    ? 'border-[#C25E34] bg-amber-50/50 ring-1 ring-[#C25E34]'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <input
                  type="radio"
                  name="payment_method"
                  checked={paymentMethod === 'bank_transfer'}
                  onChange={() => setPaymentMethod('bank_transfer')}
                  className="text-[#C25E34]"
                />
                <Building className="w-4 h-4 text-purple-600" />
                <span className="font-medium text-gray-900">Direct Bank Transfer (1Link/Raast)</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Authoritative Order Review Sidebar */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-[#EBE5DA] space-y-5">
          <h2 className="font-serif text-lg font-bold text-gray-900 pb-3 border-b border-gray-100">
            Order Review
          </h2>

          <div className="divide-y divide-gray-100 max-h-64 overflow-y-auto pr-1">
            {items.map((item, idx) => (
              <div key={idx} className="py-2.5 flex items-center space-x-3 text-xs">
                <img
                  src={item.product.primary_image?.image_url || item.product.images?.[0]?.image_url || ''}
                  alt={item.product.title}
                  className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-100 shrink-0"
                />
                <div className="flex-1 truncate">
                  <p className="font-semibold text-gray-900 truncate">{item.product.title}</p>
                  <p className="text-gray-400 text-[11px]">Qty: {item.quantity}</p>
                </div>
                <div className="font-bold text-gray-900 font-sans">
                  PKR {Number(item.unit_price * item.quantity).toLocaleString('en-PK')}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-3 space-y-2 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">
                PKR {quote ? Number(quote.subtotal).toLocaleString('en-PK') : '...'}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Courier Shipping</span>
              <span className="font-semibold text-gray-900">
                {quote?.shipping_fee === 0 ? (
                  <span className="text-emerald-700 font-bold">FREE</span>
                ) : (
                  `PKR ${quote?.shipping_fee || 250}`
                )}
              </span>
            </div>
            <div className="border-t border-gray-100 pt-2 flex justify-between items-baseline">
              <span className="font-serif text-base font-bold text-gray-900">Final Total</span>
              <span className="text-2xl font-bold font-sans text-gray-900">
                PKR {quote ? Number(quote.total_amount).toLocaleString('en-PK') : '...'}
              </span>
            </div>
          </div>

          {!user ? (
            <div className="space-y-2">
              <p className="text-xs text-amber-800 bg-amber-50 p-2.5 rounded-lg border border-amber-200">
                Please sign in or register to complete your order.
              </p>
              <Link
                to="/auth?redirect=/checkout"
                className="w-full py-3 bg-[#C25E34] text-white text-xs font-bold uppercase tracking-wider rounded-xl block text-center shadow-sm"
              >
                Sign In to Place Order
              </Link>
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting || loadingQuote}
              className="w-full py-3.5 px-4 bg-[#C25E34] hover:bg-[#A0441E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              <span>{submitting ? 'Confirming Order...' : 'Confirm & Place Order'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}

          <div className="pt-2 text-[11px] text-gray-400 text-center space-y-1">
            <p>Direct maker payout protected by DastKar Escrow.</p>
          </div>
        </div>
      </form>
    </div>
  );
};
