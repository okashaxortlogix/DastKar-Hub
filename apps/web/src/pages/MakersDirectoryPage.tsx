import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, Package, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { SellerProfile } from '../types';

export const MakersDirectoryPage: React.FC = () => {
  const [makers, setMakers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getMakers()
      .then((res) => {
        setMakers(res.data || []);
      })
      .catch((err) => {
        console.error('Failed to load makers', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium">Pakistani Artisan Directory</span>
      </div>

      <div>
        <h1 className="font-serif text-3xl font-bold text-gray-900">
          Independent Makers & Craft Guilds
        </h1>
        <p className="text-xs text-gray-500 mt-1 max-w-xl">
          Meet the genuine artisans, generational woodcarvers, ceramicists, and textile weavers keeping Pakistani cultural heritage alive.
        </p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {makers.map((maker) => (
            <Link
              key={maker.id}
              to={`/makers/${maker.slug}`}
              className="group bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden hover:border-[#C25E34] hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-32 bg-[#F0EAE1] relative overflow-hidden">
                {maker.cover_url && (
                  <img
                    src={maker.cover_url}
                    alt={maker.business_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2.5 right-2.5 px-2.5 py-0.5 bg-white/95 backdrop-blur-xs rounded-full text-[11px] font-bold text-emerald-800 flex items-center space-x-1 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="capitalize">{maker.verification_status} Maker</span>
                </div>
              </div>

              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-start space-x-3 -mt-10 mb-3">
                  <img
                    src={maker.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
                    alt={maker.business_name}
                    className="w-16 h-16 rounded-2xl border-4 border-white object-cover bg-white shadow-sm shrink-0"
                  />
                  <div className="pt-6">
                    <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#C25E34] transition-colors leading-tight">
                      {maker.business_name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
                      <span>{maker.location_city}, {maker.location_region}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed mb-4">
                  {maker.bio || maker.craft_description}
                </p>

                <div className="mt-auto pt-3 border-t border-[#F5F2EB] flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Package className="w-3.5 h-3.5 text-gray-400" />
                    <span>{maker.completed_orders} orders fulfilled</span>
                  </div>
                  <div className="flex items-center space-x-1 font-bold text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>{Number(maker.rating_average).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};
