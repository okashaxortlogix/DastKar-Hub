import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  Home,
  Shirt,
  Gem,
  Palette,
  Utensils,
  MapPin
} from 'lucide-react';
import { api } from '../lib/api';
import { Category, Product, SellerProfile } from '../types';
import { ProductCard } from '../components/commerce/ProductCard';

export const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [makers, setMakers] = useState<SellerProfile[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      api.getFeaturedProducts().catch(() => ({ data: [] })),
      api.getCategories().catch(() => ({ data: [] })),
      api.getMakers().catch(() => ({ data: [] })),
    ]).then(([featuredRes, catRes, makersRes]) => {
      setFeaturedProducts(featuredRes.data || []);
      setCategories(catRes.data || []);
      setMakers(makersRes.data || []);
      setLoading(false);
    });
  }, []);

  const categoryIcons: Record<string, any> = {
    'home-decor': Home,
    'ceramics-pottery': Sparkles,
    'fashion-wearables': Shirt,
    'jewelry-accessories': Gem,
    'art-collectibles': Palette,
    'kitchen-dining': Utensils,
  };

  return (
    <div className="space-y-12 pb-16">
      {/* 1. Hero Section matching mockup */}
      <section className="relative bg-[#F4EFE6] border-b border-[#E7DECF] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 py-12 md:py-18 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#C25E34]" />
              <span>Preserving Indigenous Pakistani Crafts</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-[1.15]">
              Handcrafted with Heart
            </h1>

            <p className="text-base sm:text-lg text-gray-600 max-w-xl leading-relaxed">
              Discover authentic, handmade treasures created by skilled independent artisans across Multan, Chiniot, Sindh, Khyber, and Northern Pakistan.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/products"
                className="px-6 py-3 bg-[#C25E34] text-white font-semibold text-sm rounded-xl hover:bg-[#A0441E] shadow-sm hover:shadow transition-all inline-flex items-center space-x-2"
              >
                <span>Explore Crafts</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/makers"
                className="px-6 py-3 bg-white text-gray-800 font-semibold text-sm rounded-xl border border-[#DCD3C3] hover:bg-gray-50 transition-colors"
              >
                Meet the Artisans
              </Link>
            </div>

            {/* Micro stats banner */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#E2D8C6] max-w-md">
              <div>
                <p className="text-2xl font-bold font-serif text-gray-900">500+</p>
                <p className="text-xs text-gray-500">Verified Artisans</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-gray-900">100%</p>
                <p className="text-xs text-gray-500">Pure Handmade</p>
              </div>
              <div>
                <p className="text-2xl font-bold font-serif text-gray-900">₨ 0</p>
                <p className="text-xs text-gray-500">Middleman Markup</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-xl aspect-4/3 sm:aspect-square bg-amber-900/10 border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80"
                alt="Artisan shaping ceramic pottery with traditional wheel"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs font-semibold text-amber-300 uppercase tracking-wider">Master of Kashigari</span>
                <p className="font-serif text-lg font-bold">Ustad Fayyaz Multani</p>
                <p className="text-xs text-gray-300">Shaping hand-thrown cobalt earthenware in Multan, Pakistan</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Craft Categories Ribbon */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Explore Craft Categories</h2>
            <p className="text-xs text-gray-500 mt-1">Browse indigenous craft traditions by discipline</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-[#C25E34] hover:underline flex items-center">
            <span>View All</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3.5">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.slug] || Sparkles;
            return (
              <Link
                key={cat.id}
                to={`/products?category=${cat.slug}`}
                className="group p-4 bg-white rounded-xl border border-[#EBE5DA] hover:border-[#C25E34] hover:shadow-sm text-center flex flex-col items-center justify-center transition-all"
              >
                <div className="w-12 h-12 rounded-full bg-[#FAF5EE] text-[#C25E34] group-hover:bg-[#C25E34] group-hover:text-white flex items-center justify-center transition-colors mb-2.5">
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-semibold text-gray-800 group-hover:text-[#C25E34] transition-colors line-clamp-1">
                  {cat.name}
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 3. Featured Products Grid */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Featured Artisan Masterpieces</h2>
            <p className="text-xs text-gray-500 mt-1">Hand-picked authentic treasures with direct provenance</p>
          </div>
          <Link to="/products" className="text-xs font-semibold text-[#C25E34] hover:underline flex items-center">
            <span>Shop Full Catalog</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-80 bg-gray-200 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* 4. Support Artisans Campaign Banner (Matching Mockup) */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="relative rounded-2xl overflow-hidden bg-[#2D2A26] text-white p-8 sm:p-12 shadow-lg">
          <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-20 lg:opacity-40 hidden sm:block">
            <img
              src="https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=800&q=80"
              alt="Artisan hands carving Chinioti woodwork"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative max-w-xl space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>Handmade Sustainability Initiative</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold tracking-tight leading-snug">
              Support Artisans. Keep Traditional Crafts Alive.
            </h2>
            <p className="text-sm text-gray-300 leading-relaxed">
              When you order through DastKar Hub, your funds reach makers directly. You help preserve historic Pakistani craft heritage and provide sustainable livelihood for indigenous families.
            </p>
            <div className="pt-2">
              <Link
                to="/products"
                className="px-6 py-3 bg-amber-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-amber-700 transition-colors inline-block"
              >
                Learn More & Shop
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Verified Makers */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-gray-900">Featured Independent Guilds</h2>
            <p className="text-xs text-gray-500 mt-1">Direct from master craftsmen and women collectives</p>
          </div>
          <Link to="/makers" className="text-xs font-semibold text-[#C25E34] hover:underline flex items-center">
            <span>Explore All Makers</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {makers.map((maker) => (
            <Link
              key={maker.id}
              to={`/makers/${maker.slug}`}
              className="group bg-white rounded-xl border border-[#EBE5DA] overflow-hidden hover:border-[#C25E34] hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-28 bg-[#F0EAE1] relative overflow-hidden">
                {maker.cover_url && (
                  <img
                    src={maker.cover_url}
                    alt={maker.business_name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                )}
                <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-xs rounded text-[11px] font-bold text-emerald-800 flex items-center space-x-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="capitalize">{maker.verification_status} Maker</span>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start space-x-3 -mt-9 mb-3">
                  <img
                    src={maker.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
                    alt={maker.business_name}
                    className="w-14 h-14 rounded-full border-2 border-white object-cover shadow-sm bg-white shrink-0"
                  />
                  <div className="pt-5">
                    <h3 className="font-serif font-bold text-base text-gray-900 group-hover:text-[#C25E34] transition-colors leading-tight">
                      {maker.business_name}
                    </h3>
                    <div className="flex items-center space-x-1 text-xs text-gray-500 mt-0.5">
                      <MapPin className="w-3 h-3 text-[#C25E34]" />
                      <span>{maker.location_city}, {maker.location_region}</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                  {maker.bio || maker.craft_description}
                </p>

                <div className="mt-auto pt-3 flex items-center justify-between text-xs text-gray-500 border-t border-[#F5F2EB]">
                  <span>{maker.completed_orders} orders fulfilled</span>
                  <span className="font-bold text-amber-700">★ {maker.rating_average.toFixed(1)}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};
