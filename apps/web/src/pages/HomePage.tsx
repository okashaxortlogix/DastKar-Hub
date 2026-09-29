import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ShieldCheck,
  Award,
  ChevronRight,
  ChevronLeft,
  Flame,
  QrCode,
  Truck,
  Sparkles,
  MessageCircle,
  X,
  Send,
  MapPin
} from 'lucide-react';
import { api } from '../lib/api';
import { Category, Product, SellerProfile } from '../types';
import { ProductCard } from '../components/commerce/ProductCard';

const HERO_SLIDES = [
  {
    title: 'Spring Craft Mela',
    subtitle: 'Direct from Multan & Hala Workshops',
    tagline: '100% Authentic Handcrafted Heritage',
    image: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80',
    link: '/products?category=pottery-ceramics',
    badge: 'Limited Seasonal Harvest',
  },
  {
    title: 'Royal Chiniot Carvings',
    subtitle: 'Master Rosewood Tables & Brass Inlay',
    tagline: 'Centuries of Generational Woodcraft',
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=1200&q=80',
    link: '/products?category=woodwork',
    badge: 'Artisan Verified Guild',
  },
  {
    title: 'Swat Pashmina & Sindhi Ajrak',
    subtitle: 'Pure Handloom Woolen Shawls & Block Prints',
    tagline: 'Zero Middleman Markup — 100% to Rural Makers',
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80',
    link: '/products?category=clothing-textiles',
    badge: 'Fair Trade Cultural Preservation',
  },
];

const DEFAULT_CATEGORY_TABS = [
  { name: 'Pottery & Ceramics', slug: 'pottery-ceramics' },
  { name: 'Leather Crafts', slug: 'leather-crafts' },
  { name: 'Woodwork', slug: 'woodwork' },
  { name: 'Clothing & Textiles', slug: 'clothing-textiles' },
  { name: 'Jewelry & Accessories', slug: 'jewelry-accessories' },
  { name: 'Home Décor', slug: 'home-decor' },
];

export const HomePage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<Product[]>([]);
  const [recommendedProducts, setRecommendedProducts] = useState<Product[]>([]);
  const [newMakers, setNewMakers] = useState<SellerProfile[]>([]);
  const [featuredMakers, setFeaturedMakers] = useState<SellerProfile[]>([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  // Category Collection Tab State
  const [activeCategoryTab, setActiveCategoryTab] = useState<string>('pottery-ceramics');
  const [categoryProducts, setCategoryProducts] = useState<Product[]>([]);
  const [loadingCategoryProducts, setLoadingCategoryProducts] = useState(false);

  // Daraz-Style Live Flash Sale Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 8, minutes: 24, seconds: 45 });

  // Floating Chat / Message Drawer State
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState('');
  const [messagesList, setMessagesList] = useState([
    { sender: 'bot', text: 'Salam! Welcome to DastKar Hub. How can we assist your artisan shopping experience today?' }
  ]);

  // Load primary homepage discovery data
  useEffect(() => {
    setLoading(true);

    Promise.allSettled([
      api.getCategories(),
      api.getTrendingProducts(6),
      api.getRecommendedProducts({ limit: 12 }),
      api.getNewMakers(4),
      api.getMakers(),
    ]).then(([catRes, trendRes, recRes, newMakersRes, makersRes]) => {
      if (catRes.status === 'fulfilled') {
        const cats = catRes.value.data || [];
        setCategories(cats.filter((c: Category) => !c.parent_id));
      }
      if (trendRes.status === 'fulfilled') {
        setTrendingProducts(trendRes.value.data || []);
      }
      if (recRes.status === 'fulfilled') {
        setRecommendedProducts(recRes.value.data || []);
      }
      if (newMakersRes.status === 'fulfilled') {
        setNewMakers(newMakersRes.value.data || []);
      }
      if (makersRes.status === 'fulfilled') {
        setFeaturedMakers((makersRes.value.data || []).slice(0, 4));
      }

      setLoading(false);
    });

    // Discovery impression telemetry
    api.trackDiscoveryEvent({
      event_type: 'product_impression',
      surface: 'homepage_trending',
    });
  }, []);

  // Load category tab products dynamically
  useEffect(() => {
    setLoadingCategoryProducts(true);
    api.getProducts({ category: activeCategoryTab, per_page: 6, sort: 'ranked' })
      .then((res) => {
        setCategoryProducts(res.data || []);
      })
      .catch(() => {
        setCategoryProducts([]);
      })
      .finally(() => {
        setLoadingCategoryProducts(false);
      });
  }, [activeCategoryTab]);

  // Countdown timer interval
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 8, minutes: 30, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Slide rotation
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    const userMsg = chatMessage.trim();
    setMessagesList((prev) => [...prev, { sender: 'user', text: userMsg }]);
    setChatMessage('');
    setTimeout(() => {
      setMessagesList((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: `Thank you for reaching out! Our artisan customer support guild is reviewing "${userMsg}". We usually respond within 15 minutes.`
        }
      ]);
    }, 800);
  };

  // Safe circular categories
  const displayCategories = categories.length > 0
    ? categories.slice(0, 8)
    : [
        { name: 'Pottery & Ceramics', slug: 'pottery-ceramics', image_url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80' },
        { name: 'Clothing & Textiles', slug: 'clothing-textiles', image_url: 'https://images.unsplash.com/photo-1606744837616-56c9a5c6a6eb?auto=format&fit=crop&w=200&q=80' },
        { name: 'Leather Crafts', slug: 'leather-crafts', image_url: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&w=200&q=80' },
        { name: 'Woodwork', slug: 'woodwork', image_url: 'https://images.unsplash.com/photo-1544816155-12df9643f363?auto=format&fit=crop&w=200&q=80' },
        { name: 'Home Décor', slug: 'home-decor', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80' },
        { name: 'Jewelry & Accessories', slug: 'jewelry-accessories', image_url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=200&q=80' },
        { name: 'Embroidery', slug: 'embroidery', image_url: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=200&q=80' },
        { name: 'Customized Gifts', slug: 'customized-gifts', image_url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=200&q=80' },
      ];

  return (
    <div className="space-y-6 sm:space-y-8 pb-20 bg-[#FAF8F5]">
      {/* 1. Daraz-Style Hero Grid: Main Carousel (72%) + Side Trust Card (28%) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4 pt-3 sm:pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          {/* Main Hero Carousel */}
          <div className="lg:col-span-9 relative rounded-2xl overflow-hidden shadow-xs min-h-[240px] sm:min-h-[320px] lg:min-h-[380px] bg-amber-950 flex flex-col justify-end">
            <img
              src={HERO_SLIDES[currentSlide].image}
              alt={HERO_SLIDES[currentSlide].title}
              className="absolute inset-0 w-full h-full object-cover object-center transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-transparent flex flex-col justify-end p-4 sm:p-8 text-white">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#C25E34] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider self-start mb-1.5 sm:mb-2">
                {HERO_SLIDES[currentSlide].badge}
              </span>
              <h1 className="font-serif text-xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight text-white mb-1 drop-shadow-sm leading-tight">
                {HERO_SLIDES[currentSlide].title}
              </h1>
              <p className="text-xs sm:text-base text-amber-100 font-medium mb-3 sm:mb-4 max-w-lg line-clamp-2 sm:line-clamp-none">
                {HERO_SLIDES[currentSlide].subtitle}
              </p>
              <div className="flex items-center space-x-2 sm:space-x-3">
                <Link
                  to={HERO_SLIDES[currentSlide].link}
                  className="px-4 sm:px-5 py-2 sm:py-2.5 bg-[#C25E34] hover:bg-[#A0441E] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center space-x-1.5"
                >
                  <span>Shop Now</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <Link
                  to="/makers"
                  className="px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-semibold rounded-xl transition-colors hidden sm:inline-block"
                >
                  Meet Artisans
                </Link>
              </div>
            </div>

            {/* Prev / Next Arrows */}
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev === 0 ? HERO_SLIDES.length - 1 : prev - 1))}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <button
              type="button"
              onClick={() => setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
              aria-label="Next slide"
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>

            {/* Dot Pagination */}
            <div className="absolute bottom-2.5 sm:bottom-3 right-3 sm:right-5 flex items-center space-x-1.5 z-10">
              {HERO_SLIDES.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all cursor-pointer ${
                    currentSlide === idx ? 'w-5 sm:w-6 bg-[#C25E34]' : 'bg-white/50'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Right Side Card (Daraz App & Artisan Trust Widget) */}
          <div className="lg:col-span-3 bg-white rounded-2xl border border-[#EBE5DA] p-4 sm:p-5 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 mb-3">
                <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                  DastKar Artisan Trust
                </span>
                <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                  ★ 4.9 Rated
                </span>
              </div>

              {/* QR Code and App Promotion (Visible on desktop/tablet where scanning makes sense) */}
              <div className="hidden sm:block p-3 bg-[#FAF8F5] rounded-xl border border-[#EBE5DA] text-center space-y-2 mb-3">
                <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-white p-2 rounded-lg border border-gray-200 flex items-center justify-center shadow-2xs">
                  <QrCode className="w-12 h-12 sm:w-16 sm:h-16 text-[#C25E34]" />
                </div>
                <div>
                  <p className="text-xs font-bold text-gray-900">Scan for Mobile Bazaar</p>
                  <p className="text-[10px] text-gray-500">Shop directly from rural craft clusters</p>
                </div>
              </div>

              {/* Artisan Perks */}
              <div className="space-y-2 text-xs mb-3 sm:mb-0">
                <div className="flex items-center space-x-2 text-gray-700">
                  <Truck className="w-4 h-4 text-[#C25E34] shrink-0" />
                  <span className="text-[11px]">Free delivery on orders over Rs. 3,000</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-[11px]">Direct maker payouts via escrow</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-700">
                  <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
                  <span className="text-[11px]">100% Verified authentic handcrafted</span>
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100">
              <Link
                to="/auth?mode=register&role=seller"
                className="w-full py-2 bg-[#C25E34] hover:bg-[#A0441E] text-white text-[11px] font-bold uppercase tracking-wider rounded-xl block text-center transition-colors shadow-2xs"
              >
                Become an Artisan Maker
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Campaign Strip */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-[#C25E34] to-[#8C3413] text-white p-4 sm:p-5 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5 text-center md:text-left">
            <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center font-bold text-amber-200 shrink-0 shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-sm sm:text-base uppercase tracking-wider text-amber-100">
                  Virsa Craft Bazaar
                </span>
                <span className="px-2 py-0.5 rounded bg-black/30 text-[10px] font-bold text-amber-300 uppercase">
                  Workshop Deals
                </span>
              </div>
              <p className="text-xs text-white/90 font-medium">
                Free Nationwide Delivery &bull; Direct workshop dispatch &bull; Fair trade artisan pricing
              </p>
            </div>
          </div>

          <Link
            to="/products"
            className="px-6 py-2.5 bg-white text-gray-900 hover:bg-amber-50 font-bold text-xs uppercase tracking-wider rounded-full shadow-md transition-all shrink-0 cursor-pointer"
          >
            Explore Deals
          </Link>
        </div>
      </section>

      {/* 3. Circular Icon Craft Categories Row (Live Backend Categories) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-[#EBE5DA] shadow-xs">
          <div className="flex items-center justify-between mb-3 sm:mb-4">
            <h2 className="font-serif text-base sm:text-xl font-bold text-gray-900">
              Browse Indigenous Categories
            </h2>
            <Link to="/products" className="text-[11px] sm:text-xs font-semibold text-[#C25E34] hover:underline flex items-center">
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5 sm:gap-4 text-center">
            {displayCategories.map((cat: any, idx: number) => {
              const img = cat.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=200&q=80';
              return (
                <Link
                  key={idx}
                  to={`/products?category=${cat.slug}`}
                  className="group flex flex-col items-center space-y-1.5 p-1 rounded-xl transition-transform hover:-translate-y-1"
                >
                  <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-[#EBE5DA] group-hover:border-[#C25E34] shadow-2xs group-hover:shadow-md transition-all">
                    <img
                      src={img}
                      alt={cat.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold text-gray-800 group-hover:text-[#C25E34] line-clamp-1">
                    {cat.name}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Master Artisans & Guilds */}
      {featuredMakers.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-white p-3.5 sm:p-6 rounded-2xl border border-[#EBE5DA] shadow-xs space-y-3 sm:space-y-4">
            <div className="flex items-center justify-between pb-2.5 sm:pb-3 border-b border-gray-100">
              <div>
                <h2 className="font-serif text-base sm:text-xl font-bold text-gray-900">
                  Featured Master Guilds &amp; Heritage Studios
                </h2>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                  Generational craftsmen preserving Pakistan's recognized craft traditions.
                </p>
              </div>
              <Link to="/makers" className="text-[11px] sm:text-xs font-semibold text-[#C25E34] hover:underline flex items-center shrink-0">
                <span>All Guilds</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
              {featuredMakers.map((maker) => (
                <Link
                  key={maker.id}
                  to={`/makers/${maker.slug}`}
                  className="group p-3 rounded-xl border border-[#EBE5DA] hover:border-[#C25E34] hover:shadow-xs transition-all bg-[#FAF8F5]/60 flex items-center space-x-3"
                >
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full overflow-hidden border border-[#EBE5DA] bg-white shrink-0">
                    <img
                      src={maker.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                      alt={maker.business_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="font-serif text-xs font-bold text-gray-900 truncate group-hover:text-[#C25E34]">
                      {maker.business_name}
                    </h3>
                    <p className="text-[10px] text-gray-500 truncate flex items-center mt-0.5">
                      <MapPin className="w-2.5 h-2.5 text-[#C25E34] mr-0.5 shrink-0" />
                      <span>{maker.location_city}</span>
                      <span className="mx-1">&bull;</span>
                      <span className="text-emerald-700 font-semibold">{maker.completed_orders} orders</span>
                    </p>
                    <span className="inline-block px-1.5 py-0.5 bg-white text-gray-600 rounded text-[9px] font-medium border border-gray-200 mt-1 truncate max-w-full">
                      {maker.craft_description}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 4. Live Flash Craft Sale with Real Trending Backend Data */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl border border-[#EBE5DA] p-3.5 sm:p-6 shadow-xs space-y-3 sm:space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-2.5 sm:pb-3 border-b border-gray-100">
            <div className="flex items-center justify-between sm:justify-start gap-2.5 sm:gap-3 flex-wrap">
              <div className="flex items-center space-x-1.5 text-[#C25E34]">
                <Flame className="w-4 h-4 sm:w-5 sm:h-5 fill-[#C25E34]" />
                <h2 className="font-serif text-lg sm:text-2xl font-extrabold text-gray-900">
                  Flash Craft Sale
                </h2>
              </div>
              <span className="text-[10px] sm:text-xs font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md hidden xs:inline">
                On Sale Now
              </span>

              {/* Countdown Digital Timer */}
              <div className="flex items-center space-x-1 text-xs font-mono font-bold text-white">
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-900 rounded-md">
                  {String(timeLeft.hours).padStart(2, '0')}
                </span>
                <span className="text-gray-900 font-sans">:</span>
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-900 rounded-md">
                  {String(timeLeft.minutes).padStart(2, '0')}
                </span>
                <span className="text-gray-900 font-sans">:</span>
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-[#C25E34] rounded-md">
                  {String(timeLeft.seconds).padStart(2, '0')}
                </span>
              </div>
            </div>

            <Link
              to="/products"
              className="self-end sm:self-auto px-3 sm:px-4 py-1.5 border border-[#C25E34] text-[#C25E34] hover:bg-[#C25E34] hover:text-white rounded-lg text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Shop All Crafts
            </Link>
          </div>

          {/* Flash Sale Product Row (6 Items from Trending Discovery API) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {trendingProducts.slice(0, 6).map((item, idx) => {
              const img = item.primary_image?.image_url || item.images?.[0]?.image_url || 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=400&q=80';
              const discount = item.compare_at_price && item.compare_at_price > item.base_price
                ? Math.round(((item.compare_at_price - item.base_price) / item.compare_at_price) * 100)
                : 25;

              return (
                <Link
                  key={item.id}
                  to={`/products/${item.slug}`}
                  className="group block p-2.5 rounded-xl border border-gray-100 hover:border-[#C25E34]/40 hover:shadow-md transition-all bg-[#FAF8F5]/50 flex flex-col"
                >
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-gray-100 mb-2">
                    <img
                      src={img}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 bg-red-600 text-white text-[9px] font-extrabold rounded-sm shadow-2xs">
                      -{discount}%
                    </span>
                  </div>

                  <h3 className="text-xs font-medium text-gray-800 line-clamp-1 group-hover:text-[#C25E34] mb-1">
                    {item.title}
                  </h3>

                  <div className="mt-auto">
                    <div className="text-sm font-bold text-[#C25E34] font-sans">
                      Rs. {Number(item.base_price).toLocaleString('en-PK')}
                    </div>
                    {item.compare_at_price && (
                      <div className="text-[10px] text-gray-400 line-through">
                        Rs. {Number(item.compare_at_price).toLocaleString('en-PK')}
                      </div>
                    )}

                    {/* Stock Progress Bar */}
                    <div className="mt-1.5">
                      <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#C25E34] h-full rounded-full"
                          style={{ width: `${Math.min(100, Math.max(20, (idx + 1) * 18))}%` }}
                        />
                      </div>
                      <span className="text-[9px] text-gray-500 font-medium block mt-0.5">
                        {item.stock_quantity > 0 ? `${item.stock_quantity} pieces left` : 'Made to order'}
                      </span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. Part AC — "Meet New Makers" Section (Discovery Boost Feature) */}
      {newMakers.length > 0 && (
        <section className="max-w-7xl mx-auto px-3 sm:px-4">
          <div className="bg-gradient-to-br from-amber-50/70 via-white to-orange-50/40 rounded-2xl border border-amber-200/60 p-5 sm:p-7 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-amber-100">
              <div>
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded-full bg-[#C25E34]/10 text-[#C25E34] text-[10px] font-extrabold uppercase tracking-wider">
                    New Arrivals Guild
                  </span>
                  <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                    Meet New Makers
                  </h2>
                </div>
                <p className="text-xs text-gray-600 mt-0.5">
                  Discover independent craft studios and newly onboarded Pakistani artisans receiving initial marketplace exposure.
                </p>
              </div>

              <Link
                to="/makers"
                className="text-xs font-bold text-[#C25E34] hover:underline flex items-center shrink-0 self-start sm:self-auto"
              >
                <span>Explore Artisan Directory</span>
                <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {newMakers.map((maker) => (
                <div
                  key={maker.id}
                  className="bg-white rounded-xl border border-[#EBE5DA] p-4 flex flex-col justify-between hover:shadow-md hover:border-[#C25E34]/50 transition-all group"
                >
                  <div>
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border border-[#EBE5DA] bg-gray-100 shrink-0">
                        <img
                          src={maker.avatar_url || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80'}
                          alt={maker.business_name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-serif text-sm font-bold text-gray-900 truncate group-hover:text-[#C25E34]">
                          {maker.business_name}
                        </h3>
                        <p className="text-[11px] text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 text-[#C25E34] mr-0.5 shrink-0" />
                          <span className="truncate">{maker.location_city}, {maker.location_region}</span>
                        </p>
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className="inline-block px-2 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-medium rounded-md line-clamp-1 border border-amber-200/50">
                        {maker.craft_description || 'Traditional Handcrafted Art'}
                      </span>
                      <p className="text-xs text-gray-600 line-clamp-2 mt-2 leading-relaxed">
                        {maker.bio || 'Preserving indigenous handmade traditions with passionate craftsmanship.'}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center">
                      <ShieldCheck className="w-3 h-3 mr-1 text-emerald-600" />
                      Verified Maker
                    </span>
                    <Link
                      to={`/makers/${maker.slug}`}
                      className="text-xs font-bold text-[#C25E34] hover:underline flex items-center"
                    >
                      <span>Visit Studio</span>
                      <ChevronRight className="w-3 h-3 ml-0.5" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. Handcrafted Category Collections (Tabbed Live Filter) */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="bg-white rounded-2xl border border-[#EBE5DA] p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-gray-100">
            <div>
              <h2 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
                Curated Craft Collections
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Explore dedicated collections directly sourced from regional artisan hubs.
              </p>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
              {DEFAULT_CATEGORY_TABS.map((tab) => (
                <button
                  key={tab.slug}
                  onClick={() => setActiveCategoryTab(tab.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                    activeCategoryTab === tab.slug
                      ? 'bg-[#C25E34] text-white shadow-2xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tab.name}
                </button>
              ))}
            </div>
          </div>

          {loadingCategoryProducts ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-60 bg-gray-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
              {categoryProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact={true} />
              ))}
            </div>
          )}

          <div className="text-center pt-2">
            <Link
              to={`/products?category=${activeCategoryTab}`}
              className="text-xs font-bold text-[#C25E34] hover:underline inline-flex items-center space-x-1"
            >
              <span>Explore all items in this craft collection</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 7. "Just For You" — Discovery Ranked 6-Column E-Commerce Grid */}
      <section className="max-w-7xl mx-auto px-3 sm:px-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-[#EBE5DA]">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                Just For You
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Curated Pakistani handmade treasures ranked by artisan quality &amp; community reviews
              </p>
            </div>
            <Link
              to="/products"
              className="text-xs font-semibold text-[#C25E34] hover:underline flex items-center"
            >
              <span>Explore All Products</span>
              <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                <div key={i} className="h-64 bg-gray-200 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
              {recommendedProducts.map((product) => (
                <ProductCard key={product.id} product={product} compact={true} />
              ))}
            </div>
          )}

          {/* Load More Button */}
          <div className="text-center pt-4">
            <Link
              to="/products"
              className="px-8 py-2.5 bg-white border border-[#C25E34] text-[#C25E34] hover:bg-[#C25E34] hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-2xs inline-block"
            >
              Load More Crafts
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Floating Messages / Artisan Chat Widget (Offset above mobile bottom nav) */}
      <div className="fixed bottom-20 md:bottom-6 right-3 sm:right-6 z-40">
        {!isChatOpen ? (
          <button
            type="button"
            onClick={() => setIsChatOpen(true)}
            aria-label="Open chat messages"
            className="flex items-center space-x-2 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-white text-gray-800 rounded-full border border-gray-300 hover:border-[#C25E34] hover:text-[#C25E34] shadow-lg transition-all hover:scale-105 cursor-pointer text-xs font-bold"
          >
            <MessageCircle className="w-4 h-4 text-[#C25E34]" />
            <span className="hidden xs:inline">Messages</span>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          </button>
        ) : (
          <div className="w-[calc(100vw-1.5rem)] max-w-sm bg-white rounded-2xl shadow-2xl border border-[#EBE5DA] overflow-hidden flex flex-col h-96 animate-in slide-in-from-bottom-5 duration-200">
            {/* Chat Header */}
            <div className="p-3.5 bg-[#C25E34] text-white flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 rounded-full bg-white text-[#C25E34] font-bold flex items-center justify-center text-xs">
                  D
                </div>
                <div>
                  <h3 className="font-serif font-bold text-xs">Artisan Support &amp; Chat</h3>
                  <p className="text-[10px] text-amber-200">Direct Workshop Liaison</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsChatOpen(false)}
                className="p-1 rounded-lg hover:bg-white/20 transition-colors text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 p-3 overflow-y-auto space-y-2.5 text-xs bg-[#FAF8F5]">
              {messagesList.map((m, idx) => (
                <div
                  key={idx}
                  className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-2.5 rounded-xl ${
                      m.sender === 'user'
                        ? 'bg-[#C25E34] text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none shadow-2xs'
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleSendMessage} className="p-2.5 border-t border-gray-200 bg-white flex items-center space-x-2">
              <input
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about materials, custom engraving..."
                className="flex-1 px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-hidden focus:border-[#C25E34]"
              />
              <button
                type="submit"
                className="p-2 bg-[#C25E34] hover:bg-[#A0441E] text-white rounded-xl transition-colors cursor-pointer"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
