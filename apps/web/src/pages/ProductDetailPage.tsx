import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  Clock,
  Sparkles,
  ShoppingBag,
  Store,
  Layers
} from 'lucide-react';
import { api } from '../lib/api';
import { Product, ProductVariant } from '../types';
import { useCart } from '../lib/cartContext';
import { ProductCard } from '../components/commerce/ProductCard';

export const ProductDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [customizationValues, setCustomizationValues] = useState<Record<string, string>>({});
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'details' | 'care' | 'reviews'>('details');

  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    api.getProductBySlug(slug)
      .then((res) => {
        const p = res.data.product;
        setProduct(p);
        setRelated(res.data.related || []);
        const primary = p.primary_image?.image_url || p.images?.[0]?.image_url || '';
        setActiveImage(primary);
        if (p.variants && p.variants.length > 0) {
          setSelectedVariant(p.variants[0]);
        }
      })
      .catch((err) => {
        console.error('Failed to load product', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-gray-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 bg-gray-200 rounded w-3/4" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
            <div className="h-24 bg-gray-200 rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="max-w-md mx-auto my-16 text-center space-y-3 bg-white p-8 rounded-xl border border-gray-200">
        <h2 className="text-xl font-bold font-serif text-gray-800">Product Not Found</h2>
        <p className="text-xs text-gray-500">The craft piece you are looking for may have been archived.</p>
        <Link to="/products" className="inline-block px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-lg">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const currentPrice = selectedVariant ? selectedVariant.price : product.base_price;

  const handleAddToCart = () => {
    addToCart(product, quantity, selectedVariant, customizationValues);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedVariant, customizationValues);
    navigate('/checkout');
  };

  const allImages = product.images && product.images.length > 0
    ? product.images.map(img => img.image_url)
    : [product.primary_image?.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80'];

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-10">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <Link to="/products" className="hover:text-gray-900">Catalog</Link>
        {product.category && (
          <>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to={`/products?category=${product.category.slug}`} className="hover:text-gray-900">
              {product.category.name}
            </Link>
          </>
        )}
        <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
        <span className="text-gray-900 font-medium truncate max-w-xs">{product.title}</span>
      </div>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Image Gallery */}
        <div className="lg:col-span-6 space-y-4">
          <div className="aspect-square bg-[#F7F4EE] rounded-2xl overflow-hidden border border-[#EBE5DA] relative shadow-xs">
            <img
              src={activeImage || allImages[0]}
              alt={product.title}
              className="w-full h-full object-cover object-center"
            />
            {product.is_customizable && (
              <span className="absolute top-3 left-3 px-2.5 py-1 bg-amber-900/80 backdrop-blur-xs text-amber-100 text-xs font-semibold rounded-md">
                Customizable by Maker
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {allImages.length > 1 && (
            <div className="flex items-center space-x-3 overflow-x-auto pb-2">
              {allImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-18 h-18 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                    activeImage === img ? 'border-[#C25E34] shadow-xs' : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Buying Actions */}
        <div className="lg:col-span-6 space-y-5 bg-white p-6 sm:p-8 rounded-2xl border border-[#EBE5DA]">
          {/* Artisan & Region */}
          <div className="flex items-center justify-between">
            <Link
              to={`/makers/${product.seller?.slug}`}
              className="inline-flex items-center space-x-1.5 text-xs font-semibold text-[#C25E34] hover:underline"
            >
              <Store className="w-3.5 h-3.5" />
              <span>By {product.seller?.business_name}</span>
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            </Link>
            <span className="text-xs text-gray-500 font-medium">
              {product.seller?.location_city}, Pakistan
            </span>
          </div>

          {/* Title */}
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 leading-snug">
            {product.title}
          </h1>

          {/* Rating & Stock */}
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center text-amber-500">
              <Star className="w-4 h-4 fill-current" />
              <span className="ml-1 font-bold text-gray-900 text-sm">
                {Number(product.rating_average).toFixed(1)}
              </span>
            </div>
            <span className="text-gray-400">({product.rating_count || 12} artisan reviews)</span>
            <span className="text-gray-300">|</span>
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-medium">
              In Stock & Ready
            </span>
          </div>

          {/* Price */}
          <div className="pt-2 pb-3 border-y border-gray-100 flex items-baseline space-x-3">
            <span className="text-xs text-gray-500 font-medium">PKR</span>
            <span className="text-3xl font-bold font-sans text-gray-900">
              {Number(currentPrice).toLocaleString('en-PK')}
            </span>
            {product.compare_at_price && (
              <span className="text-sm text-gray-400 line-through">
                PKR {Number(product.compare_at_price).toLocaleString('en-PK')}
              </span>
            )}
          </div>

          {/* Variant Selection if available */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-700">
                Select Option / Dimensions:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                      selectedVariant?.id === v.id
                        ? 'border-[#C25E34] bg-amber-50/60 ring-1 ring-[#C25E34]'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">{v.name}</div>
                    <div className="text-gray-500 font-sans mt-0.5">
                      PKR {Number(v.price).toLocaleString('en-PK')}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Customization Options */}
          {product.customization_options && product.customization_options.length > 0 && (
            <div className="space-y-3 bg-[#FAF8F5] p-3.5 rounded-xl border border-[#EBE5DA]">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-gray-900">
                <Sparkles className="w-3.5 h-3.5 text-[#C25E34]" />
                <span>Handmade Customization</span>
              </div>
              {product.customization_options.map((opt) => (
                <div key={opt.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs text-gray-700">
                    <span className="font-medium">{opt.name}</span>
                    {opt.price_delta > 0 && (
                      <span className="text-[11px] text-gray-500">+PKR {opt.price_delta}</span>
                    )}
                  </div>
                  <input
                    type="text"
                    placeholder="e.g. Enter name or custom instruction..."
                    value={customizationValues[opt.name] || ''}
                    onChange={(e) =>
                      setCustomizationValues({
                        ...customizationValues,
                        [opt.name]: e.target.value,
                      })
                    }
                    className="w-full text-xs p-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Quantity & CTA Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-3">
              <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-bold"
                >
                  −
                </button>
                <span className="px-3 py-2 text-xs font-semibold text-gray-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-gray-600 hover:text-gray-900 text-sm font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 py-3 px-4 bg-white border border-[#C25E34] text-[#C25E34] hover:bg-amber-50 font-bold text-xs rounded-xl transition-colors flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>
            </div>

            <button
              onClick={handleBuyNow}
              className="w-full py-3.5 px-4 bg-[#C25E34] hover:bg-[#A0441E] text-white font-bold text-xs rounded-xl transition-colors shadow-sm"
            >
              Buy It Now (Fast Checkout)
            </button>
          </div>

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-2 pt-4 border-t border-gray-100 text-center text-[11px] text-gray-600">
            <div className="flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600 mb-1" />
              <span>Authentic Maker</span>
            </div>
            <div className="flex flex-col items-center">
              <Truck className="w-4 h-4 text-sky-600 mb-1" />
              <span>Safe Courier Pack</span>
            </div>
            <div className="flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-amber-600 mb-1" />
              <span>Safe Delivery Guarantee</span>
            </div>
          </div>
        </div>
      </div>

      {/* Maker Profile Feature Card matching mockup */}
      {product.seller && (
        <div className="bg-[#F8F5EE] border border-[#E7DECF] rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <img
              src={product.seller.avatar_url || 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=200&q=80'}
              alt={product.seller.business_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-xs shrink-0"
            />
            <div>
              <div className="flex items-center space-x-1.5">
                <h3 className="font-serif font-bold text-base text-gray-900">{product.seller.business_name}</h3>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <p className="text-xs text-gray-600 mt-1 max-w-lg leading-relaxed">
                {product.seller.bio || product.seller.craft_description}
              </p>
              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-2">
                <span>{product.seller.location_city}, Pakistan</span>
                <span>•</span>
                <span>{product.seller.completed_orders} orders completed</span>
              </div>
            </div>
          </div>

          <Link
            to={`/makers/${product.seller.slug}`}
            className="px-5 py-2.5 bg-white border border-[#D5CABB] text-gray-800 hover:border-[#C25E34] hover:text-[#C25E34] rounded-xl text-xs font-semibold shadow-2xs transition-colors shrink-0"
          >
            Visit Artisan Storefront
          </Link>
        </div>
      )}

      {/* Description & Reviews Tabs */}
      <div className="bg-white rounded-2xl border border-[#EBE5DA] overflow-hidden">
        <div className="flex border-b border-gray-100 text-xs font-bold uppercase tracking-wider text-gray-500">
          <button
            onClick={() => setActiveTab('details')}
            className={`px-6 py-4 transition-colors border-b-2 ${
              activeTab === 'details' ? 'border-[#C25E34] text-[#C25E34] bg-[#FAF8F5]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Craft Details & Provenance
          </button>
          <button
            onClick={() => setActiveTab('care')}
            className={`px-6 py-4 transition-colors border-b-2 ${
              activeTab === 'care' ? 'border-[#C25E34] text-[#C25E34] bg-[#FAF8F5]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Materials & Care
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-6 py-4 transition-colors border-b-2 ${
              activeTab === 'reviews' ? 'border-[#C25E34] text-[#C25E34] bg-[#FAF8F5]' : 'border-transparent hover:text-gray-800'
            }`}
          >
            Customer Reviews ({product.reviews?.length || 1})
          </button>
        </div>

        <div className="p-6 text-sm text-gray-700 leading-relaxed">
          {activeTab === 'details' && (
            <div className="space-y-4 max-w-3xl">
              <p>{product.description}</p>
              {product.dimensions && (
                <p>
                  <strong className="text-gray-900">Dimensions:</strong> {product.dimensions}
                </p>
              )}
              {product.production_days && (
                <p className="flex items-center space-x-1.5 text-xs text-amber-900 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <Clock className="w-4 h-4 text-amber-700" />
                  <span>
                    Each piece is handcrafted. Please allow {product.production_days} days for the artisan to prepare and inspect your piece before dispatch.
                  </span>
                </p>
              )}
            </div>
          )}

          {activeTab === 'care' && (
            <div className="space-y-3 max-w-3xl">
              <p>
                <strong className="text-gray-900">Materials Used:</strong> {product.materials || 'Indigenous Natural Materials'}
              </p>
              <p>
                <strong className="text-gray-900">Care Instructions:</strong> {product.care_instructions || 'Dust gently with soft cloth. Avoid harsh chemical cleaners.'}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              {product.reviews && product.reviews.length > 0 ? (
                product.reviews.map((rev) => (
                  <div key={rev.id} className="border-b border-gray-100 pb-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="w-7 h-7 rounded-full bg-amber-100 text-[#C25E34] font-bold text-xs flex items-center justify-center">
                          {rev.buyer?.name ? rev.buyer.name.charAt(0) : 'A'}
                        </div>
                        <span className="font-semibold text-gray-900 text-xs">
                          {rev.buyer?.name || 'Verified Patron'}
                        </span>
                        <span className="text-emerald-700 text-[10px] font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                          Verified Purchase
                        </span>
                      </div>
                      <div className="flex text-amber-500">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-current" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-gray-600">{rev.comment}</p>
                    {rev.seller_response && (
                      <div className="bg-[#FAF8F5] p-3 rounded-xl border border-[#EBE5DA] text-xs text-gray-700 ml-4 space-y-1">
                        <span className="font-bold text-[#C25E34]">Artisan Response:</span>
                        <p className="italic">{rev.seller_response}</p>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-500">No reviews yet. Be the first to review this handcrafted treasure.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {related.length > 0 && (
        <div className="space-y-4 pt-6">
          <h2 className="font-serif text-xl font-bold text-gray-900">More Handcrafted Treasures</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {related.map((rp) => (
              <ProductCard key={rp.id} product={rp} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
