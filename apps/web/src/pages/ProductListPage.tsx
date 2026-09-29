import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Filter, SlidersHorizontal, ChevronRight, Star, RefreshCw } from 'lucide-react';
import { api } from '../lib/api';
import { Category, Product } from '../types';
import { ProductCard } from '../components/commerce/ProductCard';

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  const selectedCategory = searchParams.get('category') || '';
  const searchQuery = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const minRating = searchParams.get('min_rating') || '';
  const selectedMaterial = searchParams.get('material') || '';

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.data || [])).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (searchQuery) params.q = searchQuery;
    if (sortParam) params.sort = sortParam;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (minRating) params.min_rating = minRating;
    if (selectedMaterial) params.material = selectedMaterial;

    api.getProducts(params)
      .then((res) => {
        setProducts(res.data || []);
        setTotalCount(res.meta?.total || (res.data || []).length);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [selectedCategory, searchQuery, sortParam, minPrice, maxPrice, minRating, selectedMaterial]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(searchParams);
    if (value) {
      next.set(key, value);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const materialsList = ['Terracotta', 'Sheesham', 'Silk', 'Brass', 'Leather', 'Silver', 'Sarkanda'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium">
          {selectedCategory ? selectedCategory.replace('-', ' ').toUpperCase() : 'All Handcrafted Products'}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left Filter Sidebar */}
        <aside className="space-y-6 bg-white p-5 rounded-xl border border-[#EBE5DA] h-fit">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <div className="flex items-center space-x-2 font-serif font-bold text-gray-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#C25E34]" />
              <span>Filter Crafts</span>
            </div>
            {(selectedCategory || minPrice || maxPrice || minRating || selectedMaterial) && (
              <button
                onClick={clearFilters}
                className="text-xs text-[#C25E34] hover:underline flex items-center gap-1 font-medium"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">Category</h4>
            <div className="space-y-1.5 text-xs">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                  !selectedCategory ? 'bg-amber-50 text-[#C25E34] font-bold' : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`w-full text-left py-1 px-2 rounded-md transition-colors ${
                    selectedCategory === cat.slug ? 'bg-amber-50 text-[#C25E34] font-bold' : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">Price Range (PKR)</h4>
            <div className="space-y-2 text-xs">
              {[
                { label: 'Under ₨ 3,000', min: '', max: '3000' },
                { label: '₨ 3,000 – ₨ 6,000', min: '3000', max: '6000' },
                { label: '₨ 6,000 – ₨ 10,000', min: '6000', max: '10000' },
                { label: 'Above ₨ 10,000', min: '10000', max: '' },
              ].map((tier, idx) => {
                const isSelected = minPrice === tier.min && maxPrice === tier.max;
                return (
                  <label key={idx} className="flex items-center space-x-2 cursor-pointer text-gray-700">
                    <input
                      type="radio"
                      name="price_tier"
                      checked={isSelected}
                      onChange={() => {
                        const next = new URLSearchParams(searchParams);
                        if (tier.min) next.set('min_price', tier.min); else next.delete('min_price');
                        if (tier.max) next.set('max_price', tier.max); else next.delete('max_price');
                        setSearchParams(next);
                      }}
                      className="text-[#C25E34] focus:ring-[#C25E34]"
                    />
                    <span>{tier.label}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Materials */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">Indigenous Materials</h4>
            <div className="flex flex-wrap gap-1.5">
              {materialsList.map((mat) => (
                <button
                  key={mat}
                  onClick={() => updateParam('material', selectedMaterial === mat ? '' : mat)}
                  className={`px-2.5 py-1 rounded-full text-xs transition-colors border ${
                    selectedMaterial === mat
                      ? 'bg-[#C25E34] text-white border-[#C25E34]'
                      : 'bg-gray-50 text-gray-700 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {mat}
                </button>
              ))}
            </div>
          </div>

          {/* Rating */}
          <div className="border-t border-gray-100 pt-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-gray-600 mb-2.5">Maker Rating</h4>
            <div className="space-y-1.5 text-xs">
              {[
                { label: '4.8★ and above', val: '4.8' },
                { label: '4.5★ and above', val: '4.5' },
              ].map((r) => (
                <label key={r.val} className="flex items-center space-x-2 cursor-pointer text-gray-700">
                  <input
                    type="radio"
                    name="min_rating"
                    checked={minRating === r.val}
                    onChange={() => updateParam('min_rating', minRating === r.val ? '' : r.val)}
                    className="text-[#C25E34] focus:ring-[#C25E34]"
                  />
                  <div className="flex items-center">
                    <Star className="w-3 h-3 text-amber-500 fill-amber-500 mr-1" />
                    <span>{r.label}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* Right Product Grid Area */}
        <main className="lg:col-span-3 space-y-4">
          {/* Header Bar */}
          <div className="bg-white px-4 py-3 rounded-xl border border-[#EBE5DA] flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-lg font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Handmade Catalog'}
              </h1>
              <p className="text-xs text-gray-500">
                Showing {products.length} of {totalCount} authentic products
              </p>
            </div>

            {/* Sort Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">Sort by:</span>
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg px-2.5 py-1.5 text-gray-800 font-medium focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
              >
                <option value="featured">Featured / Best Match</option>
                <option value="newest">Newest Arrivals</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Grid or Skeletons or Empty State */}
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-72 bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {products.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-[#EBE5DA] text-center space-y-3">
              <p className="text-base font-serif font-bold text-gray-800">No craft products matched your filters</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range or clearing material filters to explore other traditional crafts.
              </p>
              <button
                onClick={clearFilters}
                className="px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-lg hover:bg-[#A0441E] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
