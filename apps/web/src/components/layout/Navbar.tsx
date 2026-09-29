import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  ShieldCheck,
  Store,
  Menu,
  X,
  LogOut,
  Package,
  Layers,
  ChevronDown,
  HelpCircle,
  Smartphone
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useCart } from '../../lib/cartContext';
import { useWishlist } from '../../lib/wishlistContext';

export const Navbar: React.FC = () => {
  const { user, logout, isSeller, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const currentCategory = searchParams.get('category') || '';
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  // Close user menu on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setIsUserMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchFocused(false);
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
    setIsMobileMenuOpen(false);
  };

  const trendingSearches = [
    'Multani Blue Pottery',
    'Chinioti Rosewood',
    'Sindhi Ajrak Shawl',
    'Swat Pashmina',
    'Peshawari Chappal',
    'Camel Skin Lamps',
  ];

  const categories = [
    { name: 'All Crafts', slug: '' },
    { name: 'Blue Pottery & Ceramics', slug: 'ceramics-pottery' },
    { name: 'Handloom & Ajrak', slug: 'fashion-wearables' },
    { name: 'Chinioti Woodcraft', slug: 'home-decor' },
    { name: 'Artisan Silver & Jewelry', slug: 'jewelry-accessories' },
    { name: 'Brass & Metal Craft', slug: 'art-collectibles' },
    { name: 'Copper & Dining Ware', slug: 'kitchen-dining' },
    { name: 'Artisans Directory', slug: 'makers', isLink: true, path: '/makers' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white shadow-xs">
      {/* 1. Daraz-Style Top Utility Bar */}
      <div className="bg-[#FAF8F5] border-b border-[#EBE5DA] text-[11px] text-gray-600 font-medium py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-flex items-center space-x-1 text-[#C25E34] font-semibold">
              <Smartphone className="w-3 h-3" />
              <span>SAVE MORE ON MOBILE BAZAAR</span>
            </span>
            <span className="hidden md:inline text-gray-300">|</span>
            <Link
              to="/auth?mode=register&role=seller"
              className="hover:text-[#C25E34] transition-colors flex items-center space-x-1 font-semibold text-gray-700"
            >
              <Store className="w-3 h-3 text-[#C25E34]" />
              <span>SELL ON DASTKAR</span>
            </Link>
            <span className="hidden md:inline text-gray-300">|</span>
            <span className="hidden lg:inline-flex items-center space-x-1 text-emerald-800">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>100% Authentic Handcrafted Guarantee</span>
            </span>
          </div>

          <div className="flex items-center space-x-3.5 sm:space-x-5">
            <Link to="/support" className="hover:text-[#C25E34] transition-colors flex items-center space-x-1">
              <HelpCircle className="w-3 h-3 text-gray-400" />
              <span>HELP &amp; SUPPORT</span>
            </Link>
            <Link to="/account/orders" className="hover:text-[#C25E34] transition-colors flex items-center space-x-1">
              <Package className="w-3 h-3 text-gray-400" />
              <span className="hidden sm:inline">TRACK ORDER</span>
            </Link>

            {user ? (
              <span className="text-gray-900 font-semibold truncate max-w-[120px]">
                HI, {user.name.split(' ')[0].toUpperCase()}
              </span>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/auth?mode=login" className="hover:text-[#C25E34] font-semibold text-gray-800">
                  LOGIN
                </Link>
                <span className="text-gray-300">|</span>
                <Link to="/auth?mode=register" className="hover:text-[#C25E34] font-semibold text-gray-800">
                  SIGN UP
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 2. Main Brand Header (Rich Terracotta Daraz-Style Bar) */}
      <div className="bg-gradient-to-r from-[#B54A23] via-[#C25E34] to-[#B54A23] text-white py-3 sm:py-3.5 px-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-3 sm:gap-6">
          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
            className="md:hidden p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-2.5 shrink-0 group">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-white text-[#C25E34] flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Layers className="w-5 h-5 text-[#C25E34]" />
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-serif font-bold tracking-tight text-white flex items-center leading-none">
                DastKar<span className="text-amber-200 ml-0.5">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-wider text-amber-100 font-medium mt-0.5">
                Pakistan's Artisan Marketplace
              </span>
            </div>
          </Link>

          {/* Large Center Search Bar (Daraz Prominent Style) */}
          <div className="flex-1 max-w-2xl relative hidden md:block" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                id="desktop-search"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search in DastKar Hub / Blue Pottery, Ajrak, Pashmina, Chiniot..."
                className="w-full pl-4 pr-28 py-2.5 bg-white text-gray-900 rounded-xl text-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300 shadow-inner"
              />
              <button
                type="submit"
                aria-label="Submit search"
                className="absolute right-1 px-4 py-1.5 bg-[#FAF8F5] hover:bg-[#F3EFEA] text-[#C25E34] text-xs font-bold rounded-lg transition-colors flex items-center space-x-1.5 border border-[#EBE5DA] cursor-pointer shadow-2xs"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>
            </form>

            {/* Trending Suggestions Dropdown on Focus */}
            {isSearchFocused && (
              <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-[#EBE5DA] p-3 text-xs z-50 animate-in fade-in duration-100">
                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                  Popular Craft Searches
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {trendingSearches.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onMouseDown={() => {
                        setSearchQuery(term);
                        navigate(`/products?q=${encodeURIComponent(term)}`);
                        setIsSearchFocused(false);
                      }}
                      className="px-2.5 py-1 rounded-lg bg-[#FAF8F5] hover:bg-amber-50 hover:text-[#C25E34] border border-[#EBE5DA] text-gray-700 transition-colors cursor-pointer text-[11px]"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (Wishlist, Cart, User) */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Wishlist Link with Badge */}
            <Link
              to="/account/orders?tab=wishlist"
              aria-label={`View saved crafts (${wishlistCount} items)`}
              className="relative p-2 rounded-xl text-white hover:bg-white/10 transition-colors"
              title="Saved Crafts"
            >
              <Heart className={`w-5 h-5 ${wishlistCount > 0 ? 'fill-amber-300 text-amber-300' : 'text-white'}`} />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-[#C25E34] text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Button with Badge */}
            <Link
              to="/cart"
              aria-label={`Shopping cart with ${totalItems} items`}
              className="relative p-2 rounded-xl text-white hover:bg-white/10 transition-colors flex items-center"
            >
              <ShoppingBag className="w-5 h-5 text-white" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-amber-400 text-gray-900 text-[11px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Account Menu */}
            <div className="relative" ref={userMenuRef}>
              {user ? (
                <div>
                  <button
                    type="button"
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    aria-label="User profile menu"
                    aria-expanded={isUserMenuOpen}
                    className="flex items-center space-x-1.5 p-1 rounded-xl hover:bg-white/10 text-white text-xs font-semibold transition-colors cursor-pointer"
                  >
                    <div className="w-8 h-8 rounded-full bg-white text-[#C25E34] font-bold flex items-center justify-center text-xs shadow-2xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden lg:inline-block max-w-[90px] truncate">{user.name.split(' ')[0]}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-amber-200" />
                  </button>

                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#EBE5DA] py-1.5 z-50 text-xs text-gray-800 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-gray-100">
                        <p className="text-[11px] text-gray-400 font-medium">Signed in as</p>
                        <p className="font-semibold text-gray-900 truncate">{user.email}</p>
                        <span className="inline-block px-1.5 py-0.5 mt-1 bg-amber-50 text-[#C25E34] text-[10px] font-bold uppercase rounded">
                          {user.role}
                        </span>
                      </div>

                      {isSeller && (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-gray-700 hover:bg-amber-50 hover:text-[#C25E34] transition-colors"
                        >
                          <Store className="w-4 h-4 text-[#C25E34]" />
                          <span className="font-semibold">Artisan Command Center</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2.5 px-4 py-2 text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span className="font-semibold">Admin Governance</span>
                        </Link>
                      )}

                      <Link
                        to="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>My Orders</span>
                      </Link>

                      <Link
                        to="/account/orders?tab=wishlist"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2.5 px-4 py-2 text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span>Saved Crafts ({wishlistCount})</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                          navigate('/');
                        }}
                        className="w-full flex items-center space-x-2.5 px-4 py-2 text-left text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100 font-semibold cursor-pointer"
                      >
                        <LogOut className="w-4 h-4 text-red-500" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="hidden sm:flex items-center space-x-2">
                  <Link
                    to="/auth?mode=login"
                    className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth?mode=register"
                    className="px-3 py-1.5 bg-amber-400 hover:bg-amber-300 text-gray-900 rounded-lg text-xs font-bold transition-colors shadow-2xs"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Search Bar Row (Directly below brand bar on mobile) */}
        <div className="mt-2.5 md:hidden">
          <form onSubmit={handleSearchSubmit} className="relative flex items-center">
            <input
              type="text"
              id="mobile-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search pottery, ajrak, shawls, brass..."
              className="w-full pl-3.5 pr-20 py-2 bg-white text-gray-900 rounded-xl text-xs placeholder:text-gray-400 focus:outline-hidden focus:ring-2 focus:ring-amber-300"
            />
            <button
              type="submit"
              aria-label="Search crafts"
              className="absolute right-1 px-3 py-1 bg-[#C25E34] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
            >
              Search
            </button>
          </form>
        </div>
      </div>

      {/* 3. Sub-Header: Category Navigation Ribbon */}
      <nav aria-label="Craft Categories Ribbon" className="relative border-b border-[#EBE5DA] bg-[#FAF8F5]">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-1 overflow-x-auto py-2 scrollbar-none text-xs font-medium">
            {categories.map((cat, idx) => {
              const isAllCrafts = cat.slug === '' && !cat.isLink;
              const isActive = isAllCrafts
                ? currentCategory === '' && location.pathname === '/products'
                : cat.isLink
                ? location.pathname === cat.path
                : currentCategory === cat.slug;

              const linkTo = cat.isLink ? cat.path! : cat.slug ? `/products?category=${cat.slug}` : '/products';

              return (
                <Link
                  key={idx}
                  to={linkTo}
                  className={`px-3 py-1 rounded-full whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#C25E34] text-white font-semibold shadow-2xs'
                      : 'text-gray-700 hover:text-[#C25E34] hover:bg-amber-50/80'
                  }`}
                >
                  {cat.name}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Right fade gradient indicator on mobile */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#FAF8F5] to-transparent pointer-events-none md:hidden" />
      </nav>

      {/* 4. Mobile Flyout Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="relative w-4/5 max-w-sm bg-white h-full shadow-2xl flex flex-col overflow-y-auto p-5 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-lg bg-[#C25E34] text-white flex items-center justify-center font-bold">
                  D
                </div>
                <span className="font-serif font-bold text-gray-900 text-lg">DastKar Hub</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* User Account / Auth Section in Mobile Drawer */}
            <div className="p-3 bg-[#FAF8F5] rounded-2xl border border-[#EBE5DA] space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-9 h-9 rounded-full bg-[#C25E34] text-white font-bold flex items-center justify-center text-sm shadow-xs">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="font-bold text-gray-900 text-xs truncate">{user.name}</div>
                      <div className="text-[10px] text-gray-500 truncate">{user.email}</div>
                    </div>
                    <span className="px-1.5 py-0.5 bg-amber-100 text-[#C25E34] text-[9px] font-extrabold uppercase rounded">
                      {user.role}
                    </span>
                  </div>
                  {isSeller && (
                    <Link
                      to="/seller/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2 px-3 bg-white text-[#C25E34] border border-amber-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs"
                    >
                      <Store className="w-3.5 h-3.5" />
                      <span>Artisan Command Center</span>
                    </Link>
                  )}
                  {isAdmin && (
                    <Link
                      to="/admin/dashboard"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="w-full py-2 px-3 bg-white text-purple-700 border border-purple-200 rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                      <span>Admin Governance</span>
                    </Link>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      logout();
                      navigate('/');
                    }}
                    className="w-full py-1 text-center text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] text-gray-500 text-center">Sign in for orders, wishlist &amp; tracking</p>
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/auth?mode=login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-center text-xs font-bold text-gray-800 bg-white border border-[#E5E0D5] rounded-xl hover:bg-gray-50 shadow-2xs"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/auth?mode=register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="py-2 text-center text-xs font-bold text-white bg-[#C25E34] rounded-xl hover:bg-[#A0441E] shadow-2xs"
                    >
                      Register
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2">
                Marketplace Navigation
              </span>
              <Link
                to="/products"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 text-sm font-semibold"
              >
                Browse All Crafts
              </Link>
              <Link
                to="/makers"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 text-sm font-semibold"
              >
                Verified Artisans Directory
              </Link>
              <Link
                to="/cart"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 text-sm font-semibold flex justify-between"
              >
                <span>Shopping Cart</span>
                <span className="font-bold text-[#C25E34]">{totalItems}</span>
              </Link>
              <Link
                to="/account/orders?tab=wishlist"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 text-sm font-semibold flex justify-between"
              >
                <span>Saved Wishlist</span>
                <span className="font-bold text-[#C25E34]">{wishlistCount}</span>
              </Link>
              <Link
                to="/account/orders"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-gray-800 hover:bg-gray-50 text-sm font-semibold"
              >
                Track My Orders
              </Link>
            </div>

            {/* Popular Craft Categories in Mobile Menu */}
            <div className="pt-3 border-t border-gray-100 space-y-1.5">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2">
                Craft Categories
              </span>
              <div className="grid grid-cols-1 gap-1 text-xs">
                {categories.filter(c => !c.isLink && c.slug).map((c) => (
                  <Link
                    key={c.slug}
                    to={`/products?category=${c.slug}`}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="px-3 py-1.5 rounded-lg text-gray-700 hover:bg-amber-50 hover:text-[#C25E34]"
                  >
                    {c.name}
                  </Link>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 space-y-2">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block px-2">
                Artisan Storefront
              </span>
              <Link
                to="/auth?mode=register&role=seller"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-2.5 px-3 bg-[#FAF8F5] text-[#C25E34] border border-[#EBE5DA] rounded-xl text-xs font-bold flex items-center justify-center space-x-1.5 shadow-2xs"
              >
                <Store className="w-4 h-4" />
                <span>Sell on DastKar / Become a Maker</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
