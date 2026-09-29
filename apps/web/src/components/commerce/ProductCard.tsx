import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Check } from 'lucide-react';
import { Product } from '../../types';
import { useCart } from '../../lib/cartContext';
import { useWishlist } from '../../lib/wishlistContext';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, compact: _compact = false }) => {
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedAnim, setAddedAnim] = useState(false);

  const isWishlisted = isInWishlist(product.id);
  const imageUrl = product.primary_image?.image_url || product.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=600&q=80';

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, 1);
    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1500);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  const isOutOfStock = product.stock_quantity !== undefined && product.stock_quantity <= 0;

  // Calculate discount percentage if compare_at_price exists
  const discountPercent = product.compare_at_price && Number(product.compare_at_price) > Number(product.base_price)
    ? Math.round(((Number(product.compare_at_price) - Number(product.base_price)) / Number(product.compare_at_price)) * 100)
    : null;

  return (
    <div className="group bg-white rounded-xl border border-[#EBE5DA] overflow-hidden hover:shadow-md hover:border-[#C25E34]/40 transition-all flex flex-col h-full relative">
      {/* Product Image Frame */}
      <Link to={`/products/${product.slug}`} className="relative block aspect-square bg-[#F7F4EE] overflow-hidden">
        <img
          src={imageUrl}
          alt={product.title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          loading="lazy"
        />

        {/* Daraz-Style Top Left Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10 pointer-events-none">
          {product.is_featured && (
            <span className="px-1.5 py-0.5 bg-[#C25E34] text-white text-[9px] font-extrabold uppercase tracking-wider rounded-sm shadow-2xs">
              Featured
            </span>
          )}
          {discountPercent && (
            <span className="px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-bold rounded-sm shadow-2xs">
              -{discountPercent}%
            </span>
          )}
        </div>

        {/* Wishlist Heart Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? `Remove ${product.title} from Wishlist` : `Add ${product.title} to Wishlist`}
          aria-pressed={isWishlisted}
          className={`absolute top-2 right-2 z-10 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
            isWishlisted
              ? 'bg-white text-red-600 shadow-md ring-2 ring-red-100'
              : 'bg-white/80 backdrop-blur-xs text-gray-500 hover:text-red-500 hover:bg-white hover:scale-110 shadow-xs'
          }`}
          title={isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
        </button>

        {/* Quick Add Overlay on Hover */}
        {!isOutOfStock && (
          <div className="absolute inset-x-2 bottom-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10 hidden sm:block">
            <button
              type="button"
              onClick={handleQuickAdd}
              aria-label={`Quick add ${product.title} to cart`}
              className={`w-full py-1.5 rounded-lg text-xs font-semibold shadow-md flex items-center justify-center space-x-1.5 transition-all cursor-pointer ${
                addedAnim
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white/95 backdrop-blur-xs text-gray-800 hover:bg-[#C25E34] hover:text-white'
              }`}
            >
              {addedAnim ? (
                <>
                  <Check className="w-3 h-3" />
                  <span>Added!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3 h-3" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </Link>

      {/* Card Info */}
      <div className="p-2.5 sm:p-3 flex flex-col flex-1">
        {/* Daraz-Style Verified Guild Tag + Origin */}
        <div className="flex items-center justify-between text-[11px] text-gray-500 mb-1">
          <Link
            to={`/makers/${product.seller?.slug}`}
            className="hover:text-[#C25E34] font-medium truncate flex items-center gap-1"
          >
            <span className="inline-block px-1 py-0.2 bg-[#C25E34]/10 text-[#C25E34] text-[9px] font-extrabold uppercase rounded-xs">
              Maker
            </span>
            <span className="truncate max-w-[90px]">{product.seller?.business_name || 'Artisan Guild'}</span>
          </Link>
          <span className="text-[10px] text-gray-400 shrink-0">{product.seller?.location_city}</span>
        </div>

        {/* 2-Line Truncated Title */}
        <Link to={`/products/${product.slug}`} className="block mb-1">
          <h3 className="font-sans text-xs sm:text-[13px] font-medium text-gray-800 group-hover:text-[#C25E34] line-clamp-2 leading-tight transition-colors min-h-[2rem]">
            {product.title}
          </h3>
        </Link>

        {/* Price & Discount (Daraz Style: Rs. X in bold terracotta) + Mobile Touch Quick Add */}
        <div className="mt-auto pt-1">
          <div className="flex items-end justify-between gap-1">
            <div className="min-w-0">
              <div className="flex items-baseline flex-wrap gap-x-1">
                <span className="text-[11px] text-[#C25E34] font-semibold">Rs.</span>
                <span className="text-sm sm:text-base font-bold text-[#C25E34] font-sans">
                  {Number(product.base_price).toLocaleString('en-PK')}
                </span>
              </div>
              {discountPercent && (
                <div className="text-[10px] text-gray-400 line-through">
                  Rs. {Number(product.compare_at_price).toLocaleString('en-PK')}
                </div>
              )}
            </div>

            {/* Mobile Touch Quick Add (shown on mobile/tablet screens where hover is unavailable) */}
            {!isOutOfStock && (
              <button
                type="button"
                onClick={handleQuickAdd}
                aria-label={`Quick add ${product.title} to cart`}
                className={`sm:hidden p-1.5 rounded-lg shadow-xs transition-all shrink-0 cursor-pointer ${
                  addedAnim
                    ? 'bg-emerald-600 text-white scale-105'
                    : 'bg-[#C25E34] text-white active:scale-95 hover:bg-[#a04a25]'
                }`}
                title="Add to Cart"
              >
                {addedAnim ? <Check className="w-3.5 h-3.5" /> : <ShoppingBag className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>

          {/* Star Rating with Review Count */}
          <div className="flex items-center space-x-1 mt-1 text-[11px]">
            <div className="flex items-center text-amber-500">
              <Star className="w-3 h-3 fill-current" />
              <span className="ml-0.5 font-bold text-gray-800 text-[10px]">
                {Number(product.rating_average || 5.0).toFixed(1)}
              </span>
            </div>
            <span className="text-gray-400 text-[10px]">
              ({product.rating_count || 24})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
