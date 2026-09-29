import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ArrowLeft, ShoppingBag, Users } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-xl w-full text-center">
        {/* Cultural emblem / decorative badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-[#FBF0EB] text-[#C25E34] border border-[#EBE5DA] mb-6 shadow-xs">
          <Compass className="w-10 h-10 animate-pulse" />
        </div>

        <p className="text-sm font-semibold tracking-wider uppercase text-[#C25E34] mb-2">
          Error 404
        </p>
        <h1 className="text-4xl sm:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-4">
          Craft Lost in Transit
        </h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-md mx-auto mb-8 leading-relaxed">
          The page or artisan craft you are looking for has been moved or does not exist. Let&apos;s guide you back to Pakistan&apos;s authentic heritage.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#C25E34] hover:bg-[#A0441E] text-white font-medium rounded-xl shadow-xs transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Marketplace
          </Link>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl border border-[#EBE5DA] shadow-xs transition-colors"
          >
            <ShoppingBag className="w-4 h-4 text-[#C25E34]" />
            Explore Crafts
          </Link>
          <Link
            to="/makers"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-white hover:bg-gray-50 text-gray-800 font-medium rounded-xl border border-[#EBE5DA] shadow-xs transition-colors"
          >
            <Users className="w-4 h-4 text-emerald-700" />
            Meet Artisans
          </Link>
        </div>
      </div>
    </div>
  );
};
