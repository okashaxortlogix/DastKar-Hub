import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShieldCheck, MapPin, Star, Package, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { SellerProfile } from '../types';
import { ProductCard } from '../components/commerce/ProductCard';

export const MakerProfilePage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [maker, setMaker] = useState<SellerProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getMakerBySlug(slug)
      .then((res) => {
        setMaker(res.data);
      })
      .catch((err) => {
        console.error('Failed to load maker', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse space-y-4">
        <div className="h-48 bg-gray-200 rounded-2xl" />
        <div className="h-8 bg-gray-200 rounded w-1/3" />
      </div>
    );
  }

  if (!maker) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-3 bg-white p-8 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold font-serif text-gray-800">Artisan Profile Not Found</h2>
        <Link to="/makers" className="inline-block px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-lg">
          Browse All Makers
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/makers" className="hover:text-gray-900">Artisans</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium">{maker.business_name}</span>
      </div>

      {/* Storefront Hero Card */}
      <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden shadow-xs">
        <div className="h-48 sm:h-64 bg-[#F2EDE4] relative">
          {maker.cover_url && (
            <img src={maker.cover_url} alt={maker.business_name} className="w-full h-full object-cover" />
          )}
          <div className="absolute top-4 right-4 px-3 py-1 bg-white/95 backdrop-blur-xs rounded-full text-xs font-bold text-emerald-800 flex items-center space-x-1.5 shadow-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="capitalize">{maker.verification_status} Maker</span>
          </div>
        </div>

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12 sm:-mt-16 mb-4">
            <div className="flex items-end space-x-4">
              <img
                src={maker.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=300&q=80'}
                alt={maker.business_name}
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl border-4 border-white object-cover bg-white shadow-md"
              />
              <div className="pb-1">
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
                  {maker.business_name}
                </h1>
                <div className="flex items-center space-x-2 text-xs text-gray-500 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C25E34]" />
                  <span>{maker.location_city}, {maker.location_region}, Pakistan</span>
                </div>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center space-x-6 text-xs text-gray-600 bg-[#FAF8F5] px-4 py-2.5 rounded-xl border border-[#EBE5DA]">
              <div className="text-center">
                <div className="font-bold text-gray-900 text-sm">{maker.completed_orders}</div>
                <div className="text-[11px] text-gray-400">Orders Fulfilled</div>
              </div>
              <div className="w-px h-8 bg-gray-200" />
              <div className="text-center">
                <div className="font-bold text-amber-700 text-sm flex items-center justify-center">
                  <Star className="w-3.5 h-3.5 fill-current mr-0.5" />
                  {Number(maker.rating_average).toFixed(1)}
                </div>
                <div className="text-[11px] text-gray-400">{maker.rating_count} reviews</div>
              </div>
            </div>
          </div>

          {/* Story & Craft Heritage */}
          <div className="max-w-3xl space-y-3 pt-2">
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-500">About the Craft & Workshop</h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              {maker.bio}
            </p>
            {maker.craft_description && (
              <p className="text-xs text-amber-900 bg-amber-50/70 p-3 rounded-xl border border-amber-200">
                <strong>Craft Specialties:</strong> {maker.craft_description}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Maker's Products */}
      <div className="space-y-4">
        <div className="flex items-center justify-between border-b border-gray-200 pb-3">
          <h2 className="font-serif text-xl font-bold text-gray-900">
            Handcrafted Creations by {maker.business_name}
          </h2>
          <span className="text-xs text-gray-500">
            {maker.products?.length || 0} pieces available
          </span>
        </div>

        {maker.products && maker.products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {maker.products.map((p) => (
              <ProductCard key={p.id} product={{ ...p, seller: maker }} />
            ))}
          </div>
        ) : (
          <div className="bg-white p-8 rounded-xl border border-gray-200 text-center text-xs text-gray-500">
            No products published at this time.
          </div>
        )}
      </div>
    </div>
  );
};
