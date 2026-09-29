import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, CheckCircle2, ShoppingBag } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../lib/cartContext';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { addToCart } = useCart();
  const imageUrl = product.primary_image?.image_url || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
  };

  return (
    <div className="group bg-white rounded-xl border border-[#EBE5DA] overflow-hidden hover:shadow-md hover:border-[#D5CABB] transition-all flex flex-col h-full">
      {/* Product Image Frame */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-square bg-[#F7F4EE] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Badges Overlay */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          {product.is_featured && (
            <span className="px-2 py-0.5 bg-[#C25E34] text-white text-[10px] font-bold uppercase tracking-wider rounded-md shadow-xs">
              Featured Craft
            </span>
          )}
          {product.is_customizable && (
            <span className="px-2 py-0.5 bg-amber-900/80 backdrop-blur-xs text-amber-100 text-[10px] font-medium rounded-md">
              Customizable
            </span>
          )}
        </div>

        {/* Wishlist Heart */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          className="absolute top-2.5 right-2.5 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs text-gray-500 hover:text-red-500 hover:bg-white flex items-center justify-center shadow-xs transition-colors"
          title="Save to Wishlist"
        >
          <Heart className="w-4 h-4" />
        </button>

        {/* Quick Add Overlay on Hover */}
        <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={handleQuickAdd}
            className="w-full py-2 bg-white/95 backdrop-blur-xs text-gray-800 hover:bg-[#C25E34] hover:text-white rounded-lg text-xs font-semibold shadow-md flex items-center justify-center space-x-1.5 transition-colors"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Quick Add</span>
          </button>
        </div>
      </Link>

      {/* Card Info */}
      <div className="p-3.5 flex flex-col flex-1">
        {/* Artisan provenance line */}
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <Link
            to={`/makers/${product.seller?.slug}`}
            className="hover:text-[#C25E34] font-medium truncate flex items-center gap-1"
          >
            <span className="truncate">{product.seller?.business_name || 'Independent Maker'}</span>
            {product.seller?.verification_status === 'verified' || product.seller?.verification_status === 'established' ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0 inline" />
            ) : null}
          </Link>
          <span className="text-[11px] text-gray-400 shrink-0 ml-1">{product.seller?.location_city}</span>
        </div>

        {/* Title */}
        <Link to={`/products/${product.slug}`} className="block">
          <h3 className="font-serif text-sm font-semibold text-gray-900 group-hover:text-[#C25E34] line-clamp-2 leading-snug transition-colors">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center space-x-1 mt-1.5 text-xs">
          <div className="flex items-center text-amber-500">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="ml-1 font-bold text-gray-800 text-[11px]">
              {Number(product.rating_average || 5.0).toFixed(1)}
            </span>
          </div>
          <span className="text-gray-400 text-[11px]">
            ({product.rating_count || 12})
          </span>
        </div>

        {/* Price & Action */}
        <div className="mt-auto pt-2.5 flex items-baseline justify-between border-t border-[#F5F2EB]">
          <div>
            <span className="text-xs text-gray-500 font-medium mr-1">PKR</span>
            <span className="text-base font-bold text-gray-900 font-sans">
              {Number(product.base_price).toLocaleString('en-PK')}
            </span>
            {product.compare_at_price && (
              <span className="ml-1.5 text-xs text-gray-400 line-through">
                PKR {Number(product.compare_at_price).toLocaleString('en-PK')}
              </span>
            )}
          </div>
          <span className="text-[11px] text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded font-medium">
            In Stock
          </span>
        </div>
      </div>
    </div>
  );
};
