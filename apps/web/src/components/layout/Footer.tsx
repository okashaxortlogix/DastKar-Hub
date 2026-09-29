import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Heart, MapPin, Truck, HelpCircle, Layers } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1C2028] text-gray-300 text-sm mt-auto border-t border-gray-800">
      {/* Artisan Value Bar */}
      <div className="border-b border-gray-800 py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-800/40 text-amber-400 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Direct From Authentic Makers</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Every piece is created by verified Pakistani artisans, preserving centuries-old generational craft.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-800/40 text-emerald-400 flex items-center justify-center shrink-0">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Regional Craft Heritage</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                From Multani Kashigari and Chinioti Sheesham to Sindhi Ajrak and Swat gemstone silver.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-950/60 border border-sky-800/40 text-sky-400 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Reliable Safe Delivery</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Specialized craft packaging with nationwide courier tracking and Cash on Delivery support.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3.5">
            <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-800/40 text-rose-400 flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-base">Maker-First Economics</h4>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">
                Over 90% of item price goes straight to the independent maker, empowering rural livelihood.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-2 md:grid-cols-5 gap-8">
        <div className="col-span-2">
          <Link to="/" className="flex items-center space-x-2.5 mb-4">
            <div className="w-8 h-8 rounded-lg bg-[#C25E34] text-white flex items-center justify-center">
              <Layers className="w-4 h-4 text-amber-200" />
            </div>
            <span className="text-xl font-serif font-bold text-white tracking-tight">
              DastKar<span className="text-[#C25E34]">Hub</span>
            </span>
          </Link>
          <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
            DastKar Hub is the digital home for Pakistan's independent makers, bridging indigenous craft workshops with patrons seeking authentic handmade treasures.
          </p>
          <div className="mt-4 flex items-center space-x-3 text-xs text-gray-400">
            <span>Currency:</span>
            <span className="px-2 py-0.5 rounded bg-gray-800 text-amber-300 font-semibold border border-gray-700">
              PKR (₨)
            </span>
            <span className="text-gray-500">|</span>
            <span>Pakistan</span>
          </div>
        </div>

        <div>
          <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Explore Craft</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/products?category=home-decor" className="hover:text-amber-300">Home Décor</Link></li>
            <li><Link to="/products?category=ceramics-pottery" className="hover:text-amber-300">Multani Blue Pottery</Link></li>
            <li><Link to="/products?category=fashion-wearables" className="hover:text-amber-300">Handloom & Ajrak</Link></li>
            <li><Link to="/products?category=jewelry-accessories" className="hover:text-amber-300">Silver & Gemstones</Link></li>
            <li><Link to="/makers" className="hover:text-amber-300">Artisan Directory</Link></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">For Makers</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/auth?mode=register&role=seller" className="hover:text-amber-300">Open Maker Storefront</Link></li>
            <li><Link to="/seller/dashboard" className="hover:text-amber-300">Seller Dashboard</Link></li>
            <li><span className="text-gray-500 cursor-not-allowed">Craft Standards</span></li>
            <li><span className="text-gray-500 cursor-not-allowed">Packaging Guidelines</span></li>
          </ul>
        </div>

        <div>
          <h5 className="font-semibold text-white text-xs uppercase tracking-wider mb-3">Trust & Support</h5>
          <ul className="space-y-2 text-xs">
            <li><Link to="/account/orders" className="hover:text-amber-300">Track Order</Link></li>
            <li><span className="text-gray-400">Returns & Exchanges</span></li>
            <li><span className="text-gray-400">Payment Security</span></li>
            <li><span className="text-gray-400">support@dastkarhub.pk</span></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 py-6 px-4 text-center text-xs text-gray-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 DastKar Hub (Pvt) Ltd. All rights reserved.</p>
          <div className="flex space-x-6">
            <span>Terms of Service</span>
            <span>Privacy Policy</span>
            <span>Artisan Ethics Charter</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
