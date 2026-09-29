import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  HelpCircle,
  Package,
  ShieldCheck,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  ChevronRight,
  Send,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

export const HelpSupportPage: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [message, setMessage] = useState('');

  const faqs = [
    {
      q: 'How does DastKar Hub guarantee that products are 100% authentically handmade?',
      a: 'Every artisan on DastKar Hub undergoes rigorous verification, including CNIC identity checks and workshop craft verification. We prohibit factory mass-produced items and machine prints. Over 90% of your payment goes directly to the genuine craftsperson.',
    },
    {
      q: 'What are the delivery timelines and courier charges across Pakistan?',
      a: 'Ready-to-ship items are typically dispatched within 24 to 48 hours and arrive in major cities (Lahore, Karachi, Islamabad) within 2-4 business days via reputable couriers (TCS, Leopard, PostEx). Made-to-order crafts require specified artisan crafting lead times displayed on the product page.',
    },
    {
      q: 'What should I do if a fragile item (e.g. Multani Blue Pottery) arrives damaged?',
      a: 'We provide specialized packaging for fragile crafts. In the rare event of transit damage, simply take a photo of the parcel and item within 48 hours of delivery and contact us at support@dastkarhub.pk or via this form. We issue a prompt artisan replacement or full refund.',
    },
    {
      q: 'How does Cash on Delivery (COD) work on DastKar Hub?',
      a: 'You can order with Cash on Delivery nationwide. When the courier delivers your parcel, inspect the outer packaging and hand over the exact cash amount. We also support online card payments and bank transfers.',
    },
    {
      q: 'How can I register as a craft maker / artisan on DastKar Hub?',
      a: 'Click "Sell on DastKar" or visit /auth?mode=register&role=seller. Submit your workshop details, craft discipline, and sample product photos. New verified artisans receive our 30-Day 20% Visibility Boost to launch their handmade business.',
    },
    {
      q: 'How does the 30-Day New Seller 20% Boost work?',
      a: 'To support emerging rural and independent artisans, our discovery ranking engine automatically applies a 20% search boost during the first month. Artisans who stay active and maintain swift fulfillment retain their boosted visibility.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitted(true);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500 overflow-x-auto pb-1 scrollbar-none">
        <Link to="/" className="hover:text-gray-900 shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate">Help &amp; Support Center</span>
      </div>

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#8B3514] via-[#C25E34] to-[#A0441E] text-white p-6 sm:p-12 rounded-3xl relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center space-x-1.5 px-3 py-1 bg-white/20 backdrop-blur-xs rounded-full text-xs font-semibold">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Dedicated Patron &amp; Artisan Assistance</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight">
            How can we assist your craft journey?
          </h1>
          <p className="text-xs sm:text-sm text-amber-100 max-w-xl leading-relaxed">
            From tracking your generational craft shipment to getting help with made-to-order customizations, our craft concierge team is here for you.
          </p>
        </div>
      </div>

      {/* Quick Action Tiles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <Link
          to="/account/orders"
          className="bg-white p-5 rounded-2xl border border-[#EBE5DA] hover:border-[#C25E34] hover:shadow-md transition-all group flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#C25E34] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Package className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-[#C25E34] transition-colors">
            Track Your Shipment
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Check real-time courier status and tracking codes for active artisan orders.
          </p>
        </Link>

        <Link
          to="/ethics-charter"
          className="bg-white p-5 rounded-2xl border border-[#EBE5DA] hover:border-emerald-600 hover:shadow-md transition-all group flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-emerald-700 transition-colors">
            Handcrafted Guarantee
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Read our 100% authenticity policy and artisan protection ethics charter.
          </p>
        </Link>

        <Link
          to="/auth?mode=register&role=seller"
          className="bg-white p-5 rounded-2xl border border-[#EBE5DA] hover:border-amber-600 hover:shadow-md transition-all group flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-amber-700 transition-colors">
            Artisan Onboarding
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Guides on opening a craft shop, CNIC verification, and the 20% search boost.
          </p>
        </Link>

        <a
          href="https://wa.me/923001234567"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-white p-5 rounded-2xl border border-[#EBE5DA] hover:border-green-600 hover:shadow-md transition-all group flex flex-col"
        >
          <div className="w-10 h-10 rounded-xl bg-green-50 text-green-700 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
            <MessageSquare className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-sm text-gray-900 group-hover:text-green-700 transition-colors">
            WhatsApp Craft Helpline
          </h3>
          <p className="text-xs text-gray-500 mt-1 leading-relaxed">
            Chat directly with our Lahore concierge desk for instant order assistance.
          </p>
        </a>
      </div>

      {/* Main Content: FAQs + Contact Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* FAQs */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-6 bg-[#C25E34] rounded-full" />
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden transition-all shadow-2xs"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 cursor-pointer hover:bg-gray-50/50 transition-colors"
                  >
                    <span className="font-serif font-bold text-xs sm:text-sm text-gray-900 leading-snug">
                      {faq.q}
                    </span>
                    <span className="p-1 rounded-lg bg-gray-100 text-gray-500 shrink-0">
                      {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </span>
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 sm:px-5 sm:pb-5 text-xs sm:text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Contact Form & Direct Channels */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-[#EBE5DA] shadow-xs space-y-5">
            <div>
              <h3 className="font-serif font-bold text-lg text-gray-900">
                Send Us a Message
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Typical response time: Within 2 to 4 hours.
              </p>
            </div>

            {formSubmitted ? (
              <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-900 animate-in fade-in">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="font-serif font-bold text-sm">Message Dispatched</h4>
                <p className="text-xs text-emerald-700">
                  Thank you, {name || 'craft patron'}! Our support officer has received your request and will reach out to {email || 'your email'}.
                </p>
                <button
                  type="button"
                  onClick={() => setFormSubmitted(false)}
                  className="mt-2 text-xs font-semibold text-emerald-800 underline hover:text-emerald-900"
                >
                  Send another inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Fatima Ali"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="patron@example.com"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    Order ID <span className="text-gray-400 font-normal">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    placeholder="e.g. DAST-2026-9481"
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-700 mb-1">
                    How can we help?
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Describe your inquiry, order question, or craft customization details..."
                    className="w-full px-3 py-2 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl text-xs text-gray-900 focus:outline-hidden focus:ring-1 focus:ring-[#C25E34] resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-[#C25E34] hover:bg-[#A0441E] text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Submit Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Direct channels */}
          <div className="bg-[#FAF8F5] p-5 rounded-2xl border border-[#EBE5DA] space-y-3 text-xs text-gray-600">
            <h4 className="font-serif font-bold text-gray-900 text-sm">Direct Contact Desk</h4>
            <div className="space-y-2">
              <a href="mailto:support@dastkarhub.pk" className="flex items-center space-x-2.5 hover:text-[#C25E34] transition-colors">
                <Mail className="w-4 h-4 text-[#C25E34] shrink-0" />
                <span>support@dastkarhub.pk</span>
              </a>
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 text-[#C25E34] shrink-0" />
                <span>+92 (21) 111-DASTKAR (Mon - Sat, 9am - 7pm PKT)</span>
              </div>
              <div className="flex items-center space-x-2.5 text-gray-500">
                <Clock className="w-4 h-4 shrink-0" />
                <span>Average response window: Under 3 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
