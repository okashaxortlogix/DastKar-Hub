import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Grid, Store, Heart, ShoppingBag, User } from 'lucide-react';
import { useCart } from '../../lib/cartContext';
import { useWishlist } from '../../lib/wishlistContext';
import { useAuth } from '../../lib/authContext';

export const MobileBottomNav: React.FC = () => {
  const location = useLocation();
  const { totalItems } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isSeller, isAdmin } = useAuth();

  const pathname = location.pathname;
  const isSearchTab = location.search.includes('tab=wishlist');

  const navItems = [
    {
      label: 'Home',
      icon: Home,
      path: '/',
      isActive: pathname === '/',
    },
    {
      label: 'Crafts',
      icon: Grid,
      path: '/products',
      isActive: pathname.startsWith('/products') && !isSearchTab,
    },
    {
      label: 'Makers',
      icon: Store,
      path: '/makers',
      isActive: pathname.startsWith('/makers'),
    },
    {
      label: 'Saved',
      icon: Heart,
      path: '/account/orders?tab=wishlist',
      badge: wishlistCount > 0 ? wishlistCount : null,
      isActive: pathname === '/account/orders' && isSearchTab,
    },
    {
      label: 'Bag',
      icon: ShoppingBag,
      path: '/cart',
      badge: totalItems > 0 ? totalItems : null,
      isActive: pathname === '/cart',
    },
    {
      label: user ? (isSeller ? 'Workshop' : isAdmin ? 'Admin' : 'Account') : 'Sign In',
      icon: User,
      path: user
        ? (isSeller ? '/seller/dashboard' : isAdmin ? '/admin/dashboard' : '/account/orders')
        : '/auth?mode=login',
      isActive:
        pathname.startsWith('/seller') ||
        pathname.startsWith('/admin') ||
        (pathname.startsWith('/account') && !isSearchTab) ||
        pathname.startsWith('/auth'),
    },
  ];

  return (
    <aside
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EBE5DA] shadow-[0_-2px_10px_rgba(0,0,0,0.05)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-6 items-center justify-around h-14 px-1 max-w-lg mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex flex-col items-center justify-center h-full py-1 text-center transition-colors relative ${
                item.isActive ? 'text-[#C25E34] font-bold' : 'text-gray-500 hover:text-gray-900 font-medium'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 ${item.isActive && item.label === 'Saved' ? 'fill-[#C25E34]' : ''}`} />
                {item.badge !== null && item.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2 px-1 min-w-[14px] h-3.5 bg-[#C25E34] text-white text-[9px] font-extrabold rounded-full flex items-center justify-center shadow-xs">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-full">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </aside>
  );
};
