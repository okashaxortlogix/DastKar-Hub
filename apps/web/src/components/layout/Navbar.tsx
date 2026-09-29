import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  User as UserIcon,
  Heart,
  ShieldCheck,
  Truck,
  Sparkles,
  Store,
  Menu,
  X,
  LogOut,
  Package,
  Layers,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../lib/authContext';
import { useCart } from '../../lib/cartContext';

export const Navbar: React.FC = () => {
  const { user, logout, isSeller, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/products');
    }
  };

  const categories = [
    { name: 'All Crafts', slug: '' },
    { name: 'Home Décor', slug: 'home-decor' },
    { name: 'Ceramics & Pottery', slug: 'ceramics-pottery' },
    { name: 'Fashion & Wearables', slug: 'fashion-wearables' },
    { name: 'Jewelry & Accessories', slug: 'jewelry-accessories' },
    { name: 'Art & Collectibles', slug: 'art-collectibles' },
    { name: 'Kitchen & Dining', slug: 'kitchen-dining' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[#EBE5DA] shadow-xs">
      {/* 1. Top Trust Assurance Banner */}
      <div className="bg-[#1E293B] text-white py-2 px-4 text-xs font-medium tracking-wide">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center space-x-1.5 mx-auto sm:mx-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Support Artisans — Empower Pakistani Creators</span>
          </div>
          <div className="hidden md:flex items-center space-x-6 text-slate-300">
            <div className="flex items-center space-x-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>100% Authentic Handcrafted</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Secure Payments (COD, JazzCash, Cards)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Truck className="w-3.5 h-3.5 text-sky-400" />
              <span>Nationwide Courier Delivery</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-3.5">
        <div className="flex items-center justify-between gap-4 sm:gap-8">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0 group">
            <div className="w-10 h-10 rounded-xl bg-[#C25E34] text-white flex items-center justify-center shadow-sm group-hover:bg-[#A0441E] transition-colors">
              <Layers className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <span className="text-2xl font-serif font-bold tracking-tight text-gray-900 flex items-center">
                DastKar<span className="text-[#C25E34] ml-1">Hub</span>
              </span>
              <span className="block text-[10px] uppercase tracking-wider text-gray-500 font-medium">
                Authentic Pakistani Crafts
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="flex-1 max-w-2xl relative hidden md:block"
          >
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for Multani pottery, Chiniot woodcraft, Sindhi Ajrak..."
                className="w-full pl-11 pr-24 py-2.5 bg-[#FAF8F5] border border-[#E5E0D5] rounded-full text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#C25E34]/20 focus:border-[#C25E34] transition-all"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-4 pointer-events-none" />
              <button
                type="submit"
                className="absolute right-1.5 px-4 py-1.5 bg-[#C25E34] text-white text-xs font-semibold rounded-full hover:bg-[#A0441E] transition-colors shadow-xs"
              >
                Search
              </button>
            </div>
          </form>

          {/* Right Action Icons */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Maker CTA */}
            {isSeller ? (
              <Link
                to="/seller/dashboard"
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-amber-50 text-amber-800 border border-amber-200 text-xs font-semibold hover:bg-amber-100 transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-[#C25E34]" />
                <span>Seller Hub</span>
              </Link>
            ) : isAdmin ? (
              <Link
                to="/admin/dashboard"
                className="hidden lg:flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 text-xs font-semibold hover:bg-purple-100 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                <span>Admin Console</span>
              </Link>
            ) : (
              <Link
                to="/auth?mode=register&role=seller"
                className="hidden lg:flex items-center space-x-1 px-3 py-1.5 rounded-lg border border-[#E5E0D5] text-gray-700 text-xs font-medium hover:border-[#C25E34] hover:text-[#C25E34] transition-colors"
              >
                <Store className="w-3.5 h-3.5 text-gray-500" />
                <span>Become a Maker</span>
              </Link>
            )}

            {/* User Account Menu */}
            <div className="relative">
              {user ? (
                <div className="relative">
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-2 p-1.5 rounded-lg hover:bg-gray-100 text-gray-700 text-sm font-medium transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#FAF0EB] text-[#C25E34] font-bold flex items-center justify-center text-xs border border-[#F2D7CB]">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block max-w-[100px] truncate">{user.name}</span>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                  </button>

                  {isUserMenuOpen && (
                    <div
                      onMouseLeave={() => setIsUserMenuOpen(false)}
                      className="absolute right-0 mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1.5 z-50 text-sm"
                    >
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-xs text-gray-400">Signed in as</p>
                        <p className="font-semibold text-gray-800 truncate">{user.email}</p>
                        <span className="inline-block px-1.5 py-0.5 mt-1 bg-amber-50 text-[#C25E34] text-[10px] font-bold uppercase rounded">
                          {user.role}
                        </span>
                      </div>

                      {isSeller && (
                        <Link
                          to="/seller/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <Store className="w-4 h-4 text-amber-700" />
                          <span>Seller Dashboard</span>
                        </Link>
                      )}

                      {isAdmin && (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                        >
                          <ShieldCheck className="w-4 h-4 text-purple-600" />
                          <span>Admin Console</span>
                        </Link>
                      )}

                      <Link
                        to="/account/orders"
                        onClick={() => setIsUserMenuOpen(false)}
                        className="flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-gray-50"
                      >
                        <Package className="w-4 h-4 text-gray-500" />
                        <span>My Orders</span>
                      </Link>

                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 border-t border-gray-100 mt-1"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/auth"
                  className="flex items-center space-x-1.5 p-2 rounded-lg text-gray-700 hover:text-[#C25E34] hover:bg-gray-50 transition-colors"
                >
                  <UserIcon className="w-5 h-5 text-gray-600" />
                  <span className="hidden sm:inline-block text-xs font-medium">Sign In</span>
                </Link>
              )}
            </div>

            {/* Cart Icon with badge */}
            <Link
              to="/cart"
              className="relative p-2 rounded-lg text-gray-700 hover:text-[#C25E34] hover:bg-gray-50 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-gray-700" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-[#C25E34] text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <form onSubmit={handleSearchSubmit} className="mt-3 md:hidden">
          <div className="relative flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search handcrafted treasures..."
              className="w-full pl-10 pr-20 py-2 bg-[#FAF8F5] border border-[#E5E0D5] rounded-full text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#C25E34]"
            />
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 px-3 py-1 bg-[#C25E34] text-white text-[11px] font-semibold rounded-full"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* 3. Category Navigation Ribbon */}
      <nav className="border-t border-[#F0EBE1] bg-[#FAF8F5]/80 backdrop-blur-xs overflow-x-auto">
        <div className="max-w-7xl mx-auto px-4 flex items-center space-x-1 sm:space-x-4 py-2 scrollbar-none whitespace-nowrap text-xs font-medium text-gray-700">
          {categories.map((cat) => (
            <Link
              key={cat.slug}
              to={cat.slug ? `/products?category=${cat.slug}` : '/products'}
              className="px-3 py-1 rounded-full hover:bg-white hover:text-[#C25E34] hover:shadow-2xs transition-all"
            >
              {cat.name}
            </Link>
          ))}
          <Link
            to="/makers"
            className="px-3 py-1 rounded-full bg-amber-100/60 text-amber-900 hover:bg-amber-100 font-semibold transition-all ml-auto"
          >
            Meet the Makers
          </Link>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-3">
          <div className="font-semibold text-xs uppercase tracking-wider text-gray-400 mb-2">Categories</div>
          {categories.map((c) => (
            <Link
              key={c.slug}
              to={c.slug ? `/products?category=${c.slug}` : '/products'}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block py-1.5 text-sm text-gray-700 hover:text-[#C25E34]"
            >
              {c.name}
            </Link>
          ))}
          <div className="border-t border-gray-100 pt-3 flex flex-col space-y-2">
            <Link
              to="/makers"
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-1 text-sm font-semibold text-amber-800"
            >
              Meet the Artisans
            </Link>
            {isSeller ? (
              <Link
                to="/seller/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 text-sm font-semibold text-[#C25E34]"
              >
                Seller Hub
              </Link>
            ) : (
              <Link
                to="/auth?mode=register&role=seller"
                onClick={() => setIsMobileMenuOpen(false)}
                className="py-1 text-sm text-gray-600"
              >
                Open Artisan Storefront
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
