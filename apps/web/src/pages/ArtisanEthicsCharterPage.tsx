import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, Award, Users, CheckCircle, ChevronRight, Scale, Handshake, Leaf, Lock } from 'lucide-react';

export const ArtisanEthicsCharterPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 sm:py-12 space-y-8 sm:space-y-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500 overflow-x-auto pb-1 scrollbar-none">
        <Link to="/" className="hover:text-gray-900 shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate">Artisan Ethics Charter</span>
      </div>

      {/* Hero Header */}
      <div className="bg-gradient-to-br from-[#1C2028] via-[#2A1D17] to-[#1C2028] text-white p-6 sm:p-12 rounded-3xl border border-amber-900/30 relative overflow-hidden shadow-xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#C25E34]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
            <Award className="w-3.5 h-3.5" />
            <span>Official DastKar Hub Living Standard</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight text-white leading-tight">
            Artisan Ethics Charter &amp; Fair Livelihood Pledge
          </h1>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            DastKar Hub is founded on an uncompromising principle: traditional Pakistani handicraft cannot survive without direct economic dignity for the craftsperson. This charter binds our platform, our patrons, and our makers.
          </p>
        </div>
      </div>

      {/* 5 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-[#C25E34] flex items-center justify-center">
            <Scale className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900">1. 90%+ Direct Maker Compensation</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Unlike exploitative middleman cartels in traditional bazaars who capture up to 80% of retail value, DastKar Hub guarantees that over 90% of item revenue goes directly into the registered artisan&apos;s bank account or mobile wallet upon delivery.
          </p>
          <ul className="text-xs text-gray-500 space-y-1 pt-1">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Zero hidden listing fees or predatory monthly retainers.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Full payout transparency tracked via double-entry seller ledgers.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900">2. Strict Anti-Counterfeit &amp; Handcrafted Integrity</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We operate zero tolerance against mass-produced factory knockoffs, screen prints disguised as genuine block-prints, or plastic imitations sold as Multani ceramic tilework.
          </p>
          <ul className="text-xs text-gray-500 space-y-1 pt-1">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>CNIC &amp; workshop verification for every artisan onboarded.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Community audit rights to delist machine-manufactured goods.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900">3. Cultural Intellectual Property &amp; Provenance</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            Every product listing must celebrate the generational lineage of the craft, acknowledging regional origin (e.g. Hala, Multan, Chiniot, Swat, Quetta) and attributing the artisan by their genuine name or workshop guild.
          </p>
          <ul className="text-xs text-gray-500 space-y-1 pt-1">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Artisans retain full copyright and ownership of their motifs.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>No unauthorized commercial licensing of indigenous folk patterns.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
            <Leaf className="w-5 h-5" />
          </div>
          <h3 className="font-serif font-bold text-lg text-gray-900">4. Sustainable Materials &amp; Safe Workshop Standards</h3>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
            We champion natural indigenous resources: organic dyes, vegetable-tanned leather, ethically sourced Sheesham wood from certified plantations, and lead-free food-safe ceramic glazes.
          </p>
          <ul className="text-xs text-gray-500 space-y-1 pt-1">
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Ban on endangered wildlife materials or toxic unregulated pigments.</span>
            </li>
            <li className="flex items-center space-x-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Safe working environments free of forced or under-age labor.</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Fair Mediation & Escrow */}
      <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#EBE5DA] shadow-xs space-y-4">
        <div className="flex items-center space-x-3 text-[#C25E34]">
          <Handshake className="w-6 h-6" />
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            5. Escrow Protection &amp; Fair Dispute Mediation
          </h2>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
          Artisans spend days or weeks pouring their soul into custom, made-to-order crafts. To protect both buyers and sellers, DastKar Hub employs escrow payment protection: funds are securely held until successful courier confirmation. In the rare case of damage in transit or dispute, platform administrators mediate with empathy, ensuring no artisan suffers arbitrary chargebacks for authentic handcrafted nuances.
        </p>
        <div className="pt-4 flex flex-wrap gap-4 items-center">
          <Link
            to="/makers"
            className="px-5 py-2.5 bg-[#C25E34] hover:bg-[#A0441E] text-white text-xs font-semibold rounded-xl shadow-xs transition-colors"
          >
            Meet Our Certified Artisans
          </Link>
          <Link
            to="/support"
            className="px-5 py-2.5 bg-[#FAF8F5] hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-xl border border-gray-300 transition-colors"
          >
            Contact Ethics Committee
          </Link>
        </div>
      </div>
    </div>
  );
};
