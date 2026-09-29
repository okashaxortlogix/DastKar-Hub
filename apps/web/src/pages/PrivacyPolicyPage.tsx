import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Lock } from 'lucide-react';

export const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500 overflow-x-auto pb-1 scrollbar-none">
        <Link to="/" className="hover:text-gray-900 shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate">Privacy Policy</span>
      </div>

      <div className="border-b border-[#EBE5DA] pb-6 space-y-2">
        <div className="inline-flex items-center space-x-1.5 text-xs text-[#C25E34] font-semibold">
          <Lock className="w-4 h-4" />
          <span>Data Protection &amp; Confidentiality</span>
        </div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-500">
          Effective Date: September 2026 • DastKar Hub Marketplace
        </p>
      </div>

      <div className="space-y-8 text-xs sm:text-sm text-gray-700 leading-relaxed">
        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">1. Information We Collect</h2>
          <p>
            When you register, place orders, or list handcrafted products on DastKar Hub, we collect necessary information to fulfill orders and ensure authentic artisan identity:
          </p>
          <ul className="space-y-1.5 text-xs text-gray-600 pl-4 list-disc">
            <li><strong>Patron Details:</strong> Full name, Pakistani delivery address, email, and mobile phone number for courier delivery confirmation.</li>
            <li><strong>Maker Information:</strong> Workshop name, craft discipline, CNIC verification documentation, workshop address, and banking disbursement credentials.</li>
          </ul>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">2. How Your Data is Used</h2>
          <p>
            Your information is strictly used for order fulfillment, courier routing across Pakistan (TCS, Leopard, PostEx), fraud prevention, and platform integrity.
          </p>
          <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>We NEVER sell, rent, or trade your personal data or phone number to third-party telemarketers or advertisers.</span>
          </div>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">3. Data Security &amp; Encryption</h2>
          <p>
            All network communication is secured using TLS 1.3 encryption. Passwords and financial credentials are cryptographically hashed using industry-standard bcrypt algorithms.
          </p>
        </section>

        <section className="space-y-3 bg-white p-6 rounded-2xl border border-[#EBE5DA]">
          <h2 className="font-serif font-bold text-base text-gray-900">4. Contact Our Data Protection Team</h2>
          <p>
            For inquiries regarding your personal data or to request account deletion, reach out to our privacy officer at <a href="mailto:privacy@dastkarhub.pk" className="text-[#C25E34] hover:underline font-medium">privacy@dastkarhub.pk</a>.
          </p>
        </section>
      </div>
    </div>
  );
};
