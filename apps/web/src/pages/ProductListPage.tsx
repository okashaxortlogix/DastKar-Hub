import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  SlidersHorizontal,
  ChevronRight,
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Star,
  RefreshCw,
  X,
  Check,
  Search,
  LayoutGrid,
  Gem,
  Shirt,
  Briefcase,
  Coffee,
  Hammer,
  Home,
  Palette,
  Scissors,
  CircleDot,
  PenTool,
  Shield,
  Gift,
  ShoppingBag,
  Feather,
  Landmark,
  Sparkles,
  UtensilsCrossed,
  Globe,
  Settings,
  Banknote
} from 'lucide-react';
import { api } from '../lib/api';
import { Product } from '../types';
import { ProductCard } from '../components/commerce/ProductCard';

interface SubCategory {
  name: string;
  slug: string;
  count: number;
}

interface FilterCategory {
  name: string;
  slug: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  subcategories: SubCategory[];
}

const CRAFT_CATEGORIES: FilterCategory[] = [
  {
    name: 'Jewelry & Accessories',
    slug: 'jewelry-accessories',
    icon: Gem,
    count: 42,
    subcategories: [
      { name: 'Earrings', slug: 'earrings', count: 12 },
      { name: 'Necklaces', slug: 'necklaces', count: 10 },
      { name: 'Bracelets', slug: 'bracelets', count: 8 },
      { name: 'Rings', slug: 'rings', count: 7 },
      { name: 'Traditional Jewelry', slug: 'traditional-jewelry', count: 5 },
    ],
  },
  {
    name: 'Clothing & Textiles',
    slug: 'clothing-textiles',
    icon: Shirt,
    count: 57,
    subcategories: [
      { name: 'Handloom Shawls', slug: 'handloom-shawls', count: 18 },
      { name: 'Traditional Block Prints', slug: 'traditional-block-prints', count: 15 },
      { name: 'Embroidered Kurtas', slug: 'embroidered-kurtas', count: 14 },
      { name: 'Pure Silk Dupattas', slug: 'pure-silk-dupattas', count: 10 },
    ],
  },
  {
    name: 'Leather Crafts',
    slug: 'leather-crafts',
    icon: Briefcase,
    count: 31,
    subcategories: [
      { name: 'Peshawari Chappals', slug: 'peshawari-chappals', count: 12 },
      { name: 'Handstitched Wallets', slug: 'handstitched-wallets', count: 8 },
      { name: 'Full-Grain Leather Belts', slug: 'full-grain-leather-belts', count: 6 },
      { name: 'Messenger Bags', slug: 'messenger-bags', count: 5 },
    ],
  },
  {
    name: 'Pottery & Ceramics',
    slug: 'pottery-ceramics',
    icon: Coffee,
    count: 24,
    subcategories: [
      { name: 'Multani Blue Pottery', slug: 'multani-blue-pottery', count: 10 },
      { name: 'Glazed Vases', slug: 'glazed-vases', count: 6 },
      { name: 'Kashikari Bowls', slug: 'kashikari-bowls', count: 5 },
      { name: 'Terracotta Planters', slug: 'terracotta-planters', count: 3 },
    ],
  },
  {
    name: 'Woodwork',
    slug: 'woodwork',
    icon: Hammer,
    count: 19,
    subcategories: [
      { name: 'Chinioti Carved Trays', slug: 'chinioti-carved-trays', count: 7 },
      { name: 'Brass Inlay Keepsake Boxes', slug: 'brass-inlay-keepsake-boxes', count: 5 },
      { name: 'Rosewood Tables', slug: 'rosewood-tables', count: 4 },
      { name: 'Calligraphy Wall Plaques', slug: 'calligraphy-wall-plaques', count: 3 },
    ],
  },
  {
    name: 'Home Décor',
    slug: 'home-decor',
    icon: Home,
    count: 46,
    subcategories: [
      { name: 'Camel Skin Painted Lamps', slug: 'camel-skin-painted-lamps', count: 14 },
      { name: 'Beaten Brass Lanterns', slug: 'beaten-brass-lanterns', count: 12 },
      { name: 'Mirror Mosaic Frames', slug: 'mirror-mosaic-frames', count: 11 },
      { name: 'Hanging Wall Tapestries', slug: 'hanging-wall-tapestries', count: 9 },
    ],
  },
  {
    name: 'Art & Collectibles',
    slug: 'art-collectibles',
    icon: Palette,
    count: 28,
    subcategories: [
      { name: 'Pakistani Truck Art', slug: 'pakistani-truck-art', count: 10 },
      { name: 'Mughal Miniature Paintings', slug: 'mughal-miniature-paintings', count: 8 },
      { name: 'Arabic Calligraphy Canvases', slug: 'arabic-calligraphy-canvases', count: 6 },
      { name: 'Folk Sculptures', slug: 'folk-sculptures', count: 4 },
    ],
  },
  {
    name: 'Embroidery',
    slug: 'embroidery',
    icon: Scissors,
    count: 22,
    subcategories: [
      { name: 'Phulkari Stoles', slug: 'phulkari-stoles', count: 8 },
      { name: 'Balochi Tanka Cushions', slug: 'balochi-tanka-cushions', count: 6 },
      { name: 'Sindhi Hurmicho Work', slug: 'sindhi-hurmicho-work', count: 5 },
      { name: 'Zardozi Wall Art', slug: 'zardozi-wall-art', count: 3 },
    ],
  },
  {
    name: 'Crochet & Knitting',
    slug: 'crochet-knitting',
    icon: CircleDot,
    count: 16,
    subcategories: [
      { name: 'Crochet Market Totes', slug: 'crochet-market-totes', count: 6 },
      { name: 'Woven Flower Baskets', slug: 'woven-flower-baskets', count: 4 },
      { name: 'Woolen Winter Scarves', slug: 'woolen-winter-scarves', count: 4 },
      { name: 'Crocheted Coasters', slug: 'crocheted-coasters', count: 2 },
    ],
  },
  {
    name: 'Hand-Painted Art',
    slug: 'hand-painted-art',
    icon: PenTool,
    count: 14,
    subcategories: [
      { name: 'Hand-painted Tea Trays', slug: 'hand-painted-tea-trays', count: 5 },
      { name: 'Truck Art Lanterns', slug: 'truck-art-lanterns', count: 4 },
      { name: 'Painted Ceramic Plates', slug: 'painted-ceramic-plates', count: 3 },
      { name: 'Cultural Canvas Art', slug: 'cultural-canvas-art', count: 2 },
    ],
  },
  {
    name: 'Traditional Crafts',
    slug: 'traditional-crafts',
    icon: Shield,
    count: 38,
    subcategories: [
      { name: 'Sindhi Ralli Quilts', slug: 'sindhi-ralli-quilts', count: 12 },
      { name: 'Multani Camel Bone Inlay', slug: 'camel-bone-inlay', count: 10 },
      { name: 'Sindhi Topis', slug: 'sindhi-topis', count: 8 },
      { name: 'Handspun Khaddar', slug: 'handspun-khaddar', count: 8 },
    ],
  },
  {
    name: 'Customized Gifts',
    slug: 'customized-gifts',
    icon: Gift,
    count: 27,
    subcategories: [
      { name: 'Engraved Memory Boxes', slug: 'engraved-memory-boxes', count: 9 },
      { name: 'Personalized Journals', slug: 'personalized-journals', count: 8 },
      { name: 'Custom Calligraphy Frames', slug: 'custom-calligraphy-frames', count: 6 },
      { name: 'Wedding Keepsakes', slug: 'wedding-keepsakes', count: 4 },
    ],
  },
  {
    name: 'Bags & Wallets',
    slug: 'bags-wallets',
    icon: ShoppingBag,
    count: 21,
    subcategories: [
      { name: 'Full Grain Leather Satchels', slug: 'leather-satchels', count: 8 },
      { name: 'Embroidered Bridal Potli Bags', slug: 'bridal-potli-bags', count: 6 },
      { name: 'Eco Jute Market Totes', slug: 'jute-market-totes', count: 4 },
      { name: 'Raw Silk Clutches', slug: 'raw-silk-clutches', count: 3 },
    ],
  },
  {
    name: 'Shawls & Scarves',
    slug: 'shawls-scarves',
    icon: Feather,
    count: 18,
    subcategories: [
      { name: 'Kashmiri Sozni Pashmina', slug: 'kashmiri-pashmina', count: 6 },
      { name: 'Swati Hand-spun Woolen Shawls', slug: 'swati-woolen-shawls', count: 5 },
      { name: 'Natural Indigo Ajrak Shawls', slug: 'indigo-ajrak-shawls', count: 4 },
      { name: 'Fine Wool Chaddars', slug: 'fine-wool-chaddars', count: 3 },
    ],
  },
  {
    name: 'Pakistani Heritage',
    slug: 'pakistani-heritage',
    icon: Landmark,
    count: 13,
    subcategories: [
      { name: 'Lok Virsa Folk Crafts', slug: 'lok-virsa-crafts', count: 5 },
      { name: 'Gandhara Terracotta Sculptures', slug: 'gandhara-sculptures', count: 4 },
      { name: 'Taxila Stone Carvings', slug: 'taxila-stone-carvings', count: 4 },
    ],
  },
  {
    name: 'Wedding & Festive',
    slug: 'wedding-festive',
    icon: Sparkles,
    count: 12,
    subcategories: [
      { name: 'Velvet Nikah Certificate Holders', slug: 'nikah-holders', count: 4 },
      { name: 'Handcrafted Mehndi Trays', slug: 'mehndi-trays', count: 3 },
      { name: 'Zardozi Shadi Favor Boxes', slug: 'shadi-favor-boxes', count: 3 },
      { name: 'Gota Kinari Accessories', slug: 'gota-kinari-accessories', count: 2 },
    ],
  },
  {
    name: 'Home & Kitchen Crafts',
    slug: 'home-kitchen-crafts',
    icon: UtensilsCrossed,
    count: 20,
    subcategories: [
      { name: 'Sheesham Chopping Boards', slug: 'sheesham-chopping-boards', count: 7 },
      { name: 'Natural Onyx Mortar & Pestle', slug: 'onyx-mortar-pestle', count: 5 },
      { name: 'Hand-beaten Brass Spoons', slug: 'brass-serving-spoons', count: 5 },
      { name: 'Copper Water Goblets', slug: 'copper-water-goblets', count: 3 },
    ],
  },
];

export const ProductListPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(325);
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Search & Accordion State
  const [categorySearch, setCategorySearch] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({
    'jewelry-accessories': true, // Open by default as in Image 2
  });
  const [isPriceOpen, setIsPriceOpen] = useState(true);
  const [isRatingOpen, setIsRatingOpen] = useState(true);
  const [isAvailabilityOpen, setIsAvailabilityOpen] = useState(true);
  const [isCustomizationOpen, setIsCustomizationOpen] = useState(true);

  const selectedCategory = searchParams.get('category') || '';
  const selectedSubcategory = searchParams.get('subcategory') || '';
  const searchQuery = searchParams.get('q') || '';
  const sortParam = searchParams.get('sort') || 'featured';
  const minPrice = searchParams.get('min_price') || '';
  const maxPrice = searchParams.get('max_price') || '';
  const minRating = searchParams.get('min_rating') || '';
  const selectedMaterial = searchParams.get('material') || '';
  const selectedAvailability = searchParams.get('availability') || '';
  const selectedCustomization = searchParams.get('customization') || '';
  const pageParam = Number(searchParams.get('page')) || 1;

  // Count active filters
  const activeFilterCount = [
    Boolean(selectedCategory),
    Boolean(selectedSubcategory),
    Boolean(minPrice || maxPrice),
    Boolean(minRating),
    Boolean(selectedMaterial),
    Boolean(selectedAvailability),
    Boolean(selectedCustomization),
  ].filter(Boolean).length;

  useEffect(() => {
    setLoading(true);
    const params: Record<string, any> = {};
    if (selectedCategory) params.category = selectedCategory;
    if (selectedSubcategory) params.subcategory = selectedSubcategory;
    if (searchQuery) params.q = searchQuery;
    if (sortParam) params.sort = sortParam;
    if (minPrice) params.min_price = minPrice;
    if (maxPrice) params.max_price = maxPrice;
    if (minRating) params.min_rating = minRating;
    if (selectedMaterial) params.material = selectedMaterial;
    if (selectedAvailability) params.availability = selectedAvailability;
    if (selectedCustomization) params.customization = selectedCustomization;
    if (pageParam > 1) params.page = pageParam;

    api.getProducts(params)
      .then((res) => {
        setProducts(res.data || []);
        if (res.meta?.total !== undefined) {
          setTotalCount(res.meta.total);
        }
        setCurrentPage(res.meta?.current_page || pageParam);
        setLastPage(res.meta?.last_page || 1);
      })
      .catch((err) => {
        console.error('Failed to load products', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [
    selectedCategory,
    selectedSubcategory,
    searchQuery,
    sortParam,
    minPrice,
    maxPrice,
    minRating,
    selectedMaterial,
    selectedAvailability,
    selectedCustomization,
    pageParam
  ]);

  // Lock body scroll when mobile filter drawer is open
  useEffect(() => {
    if (isMobileFiltersOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileFiltersOpen]);

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
    const next = new URLSearchParams();
    if (searchQuery) next.set('q', searchQuery);
    setSearchParams(next);
    setExpandedCategories({ 'jewelry-accessories': true });
  };

  // Auto-expand categories when searching
  useEffect(() => {
    if (categorySearch.trim()) {
      const term = categorySearch.toLowerCase().trim();
      const matching: Record<string, boolean> = {};
      CRAFT_CATEGORIES.forEach((cat) => {
        if (
          cat.name.toLowerCase().includes(term) ||
          cat.subcategories.some((s) => s.name.toLowerCase().includes(term))
        ) {
          matching[cat.slug] = true;
        }
      });
      setExpandedCategories((prev) => ({ ...prev, ...matching }));
    }
  }, [categorySearch]);

  // Filter categories by search term
  const filteredCategories = useMemo(() => {
    if (!categorySearch.trim()) return CRAFT_CATEGORIES;
    const term = categorySearch.toLowerCase().trim();
    return CRAFT_CATEGORIES.filter((cat) => {
      const matchCat = cat.name.toLowerCase().includes(term);
      const matchSub = cat.subcategories.some((sub) => sub.name.toLowerCase().includes(term));
      return matchCat || matchSub;
    });
  }, [categorySearch]);

  const renderFilterBody = (isMobile = false) => (
    <div className="space-y-5">
      {/* Category Search Box */}
      <div className="relative">
        <input
          type="text"
          placeholder="Search categories..."
          value={categorySearch}
          onChange={(e) => setCategorySearch(e.target.value)}
          className="w-full pl-8 pr-3 py-2 bg-[#FAF8F5] border border-[#E5E0D5] rounded-xl text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
        />
        <Search className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-2.5 pointer-events-none" />
        {categorySearch && (
          <button
            type="button"
            onClick={() => setCategorySearch('')}
            className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Categories Tree */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-800">
            Categories
          </span>
          <span className="text-[11px] text-gray-400 font-medium">
            325 products
          </span>
        </div>

        {/* All Categories Row */}
        <button
          type="button"
          onClick={() => {
            updateParam('category', '');
            updateParam('subcategory', '');
          }}
          className={`w-full text-left py-2 px-2.5 rounded-xl transition-all flex items-center justify-between text-xs cursor-pointer mb-1.5 ${
            !selectedCategory && !selectedSubcategory
              ? 'bg-[#FAF0EA] text-[#C25E34] font-bold shadow-2xs'
              : 'text-gray-700 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center space-x-2.5">
            <LayoutGrid className="w-4 h-4 text-[#C25E34] shrink-0" />
            <span>All Categories</span>
          </div>
          <span className="text-[11px] text-gray-400 font-medium">325</span>
        </button>

        {/* Category List */}
        <div className="space-y-1">
          {filteredCategories.map((cat) => {
            const isCatActive = selectedCategory === cat.slug;
            const isExpanded = Boolean(expandedCategories[cat.slug]);
            const IconComp = cat.icon;

            return (
              <div key={cat.slug} className="space-y-0.5">
                <div
                  className={`w-full py-1.5 px-2.5 rounded-xl transition-all flex items-center justify-between text-xs ${
                    isCatActive
                      ? 'bg-[#FAF0EA] text-[#C25E34] font-bold shadow-2xs'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedCategories((prev) => ({ ...prev, [cat.slug]: false }));
                      } else {
                        updateParam('category', cat.slug);
                        updateParam('subcategory', '');
                        setExpandedCategories((prev) => ({ ...prev, [cat.slug]: true }));
                      }
                    }}
                    className="flex items-center space-x-2.5 truncate flex-1 text-left cursor-pointer focus:outline-hidden"
                  >
                    <IconComp className={`w-3.5 h-3.5 shrink-0 ${isCatActive ? 'text-[#C25E34]' : 'text-gray-600'}`} />
                    <span className="truncate">{cat.name}</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedCategories((prev) => ({
                        ...prev,
                        [cat.slug]: !prev[cat.slug],
                      }));
                    }}
                    aria-label={isExpanded ? `Collapse ${cat.name}` : `Expand ${cat.name}`}
                    className="flex items-center space-x-1.5 shrink-0 pl-2 py-0.5 text-gray-400 hover:text-gray-700 cursor-pointer focus:outline-hidden"
                  >
                    <span className="text-[11px] font-medium">{cat.count}</span>
                    {isExpanded ? (
                      <ChevronDown className="w-3.5 h-3.5 text-gray-500 transition-transform duration-150" />
                    ) : (
                      <ChevronRight className="w-3.5 h-3.5 text-gray-400 transition-transform duration-150" />
                    )}
                  </button>
                </div>

                {/* Expandable Subcategories with Checkboxes */}
                {isExpanded && cat.subcategories.length > 0 && (
                  <div className="pl-6 pr-1 py-1 space-y-1">
                    {cat.subcategories.map((sub) => {
                      const isSubActive = selectedSubcategory === sub.slug;
                      return (
                        <button
                          key={sub.slug}
                          type="button"
                          onClick={() => {
                            if (isSubActive) {
                              updateParam('subcategory', '');
                            } else {
                              updateParam('category', cat.slug);
                              updateParam('subcategory', sub.slug);
                            }
                          }}
                          className={`w-full text-left py-1.5 px-2 rounded-lg transition-all flex items-center justify-between text-xs cursor-pointer ${
                            isSubActive
                              ? 'bg-[#FAF0EA] text-[#C25E34] font-bold'
                              : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center space-x-2 truncate">
                            <div
                              className={`w-3.5 h-3.5 rounded border flex items-center justify-center transition-colors ${
                                isSubActive
                                  ? 'border-[#C25E34] bg-[#C25E34] text-white'
                                  : 'border-gray-300 bg-white'
                              }`}
                            >
                              {isSubActive && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                            </div>
                            <span className="truncate">{sub.name}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">{sub.count}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Accordion 1: PRICE RANGE */}
      <div className="border-t border-[#F0EBE1] pt-3.5">
        <button
          type="button"
          onClick={() => setIsPriceOpen(!isPriceOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Banknote className="w-3.5 h-3.5 text-gray-500" />
            <span>Price Range</span>
          </div>
          {isPriceOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {isPriceOpen && (
          <div className="space-y-1.5 text-xs">
            {[
              { label: 'Under Rs. 1,000', min: '', max: '1000', count: 89 },
              { label: 'Rs. 1,000 – 3,000', min: '1000', max: '3000', count: 124 },
              { label: 'Rs. 3,000 – 5,000', min: '3000', max: '5000', count: 76 },
              { label: 'Rs. 5,000+', min: '5000', max: '', count: 36 },
            ].map((tier, idx) => {
              const isSelected = minPrice === tier.min && maxPrice === tier.max;
              return (
                <label key={idx} className="flex items-center justify-between cursor-pointer py-1 text-gray-700 hover:text-gray-900">
                  <div className="flex items-center space-x-2.5">
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
                      className="text-[#C25E34] focus:ring-[#C25E34] accent-[#C25E34]"
                    />
                    <span>{tier.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{tier.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 2: RATING */}
      <div className="border-t border-[#F0EBE1] pt-3.5">
        <button
          type="button"
          onClick={() => setIsRatingOpen(!isRatingOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
            <span>Rating</span>
          </div>
          {isRatingOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {isRatingOpen && (
          <div className="space-y-1.5 text-xs">
            {[
              { label: '4.8★ and above', val: '4.8', count: 112 },
              { label: '4.5★ and above', val: '4.5', count: 198 },
              { label: '4.0★ and above', val: '4.0', count: 274 },
            ].map((r, idx) => (
              <label key={idx} className="flex items-center justify-between cursor-pointer py-1 text-gray-700 hover:text-gray-900">
                <div className="flex items-center space-x-2.5">
                  <input
                    type="radio"
                    name="min_rating"
                    checked={minRating === r.val}
                    onChange={() => updateParam('min_rating', r.val)}
                    className="text-[#C25E34] focus:ring-[#C25E34] accent-[#C25E34]"
                  />
                  <div className="flex items-center">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 mr-1" />
                    <span>{r.label}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400">{r.count}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {/* Accordion 3: AVAILABILITY */}
      <div className="border-t border-[#F0EBE1] pt-3.5">
        <button
          type="button"
          onClick={() => setIsAvailabilityOpen(!isAvailabilityOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Globe className="w-3.5 h-3.5 text-gray-500" />
            <span>Availability</span>
          </div>
          {isAvailabilityOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {isAvailabilityOpen && (
          <div className="space-y-1.5 text-xs">
            {[
              { label: 'In Stock & Ready', val: 'in_stock', count: 248 },
              { label: 'Made to Order', val: 'made_to_order', count: 77 },
            ].map((avail, idx) => {
              const isChecked = selectedAvailability === avail.val;
              return (
                <label key={idx} className="flex items-center justify-between cursor-pointer py-1 text-gray-700 hover:text-gray-900">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => updateParam('availability', isChecked ? '' : avail.val)}
                      className="rounded text-[#C25E34] focus:ring-[#C25E34] accent-[#C25E34]"
                    />
                    <span>{avail.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{avail.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Accordion 4: CUSTOMIZATION */}
      <div className="border-t border-[#F0EBE1] pt-3.5">
        <button
          type="button"
          onClick={() => setIsCustomizationOpen(!isCustomizationOpen)}
          className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-wider text-gray-900 mb-2 cursor-pointer"
        >
          <div className="flex items-center space-x-2">
            <Settings className="w-3.5 h-3.5 text-gray-500" />
            <span>Customization</span>
          </div>
          {isCustomizationOpen ? <ChevronUp className="w-3.5 h-3.5 text-gray-400" /> : <ChevronDown className="w-3.5 h-3.5 text-gray-400" />}
        </button>
        {isCustomizationOpen && (
          <div className="space-y-1.5 text-xs">
            {[
              { label: 'Customizable by Maker', val: 'customizable', count: 95 },
              { label: 'Standard Artisan Inventory', val: 'standard', count: 230 },
            ].map((cust, idx) => {
              const isChecked = selectedCustomization === cust.val;
              return (
                <label key={idx} className="flex items-center justify-between cursor-pointer py-1 text-gray-700 hover:text-gray-900">
                  <div className="flex items-center space-x-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => updateParam('customization', isChecked ? '' : cust.val)}
                      className="rounded text-[#C25E34] focus:ring-[#C25E34] accent-[#C25E34]"
                    />
                    <span>{cust.label}</span>
                  </div>
                  <span className="text-[10px] text-gray-400">{cust.count}</span>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Desktop Bottom Action Buttons (Hidden on Mobile Drawer which has fixed bottom bar) */}
      {!isMobile && (
        <div className="pt-4 border-t border-[#F0EBE1] flex items-center gap-2">
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex-1 py-2.5 px-3 bg-[#A34321] hover:bg-[#8C3413] text-white text-xs font-bold rounded-xl shadow-xs flex items-center justify-center space-x-1.5 transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Apply Filters</span>
          </button>
          <button
            type="button"
            onClick={clearFilters}
            className="py-2.5 px-3 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* Breadcrumb with PL-02 fix: replaceAll instead of replace */}
      <div className="flex items-center space-x-1.5 text-xs text-gray-500 overflow-x-auto pb-1 scrollbar-none">
        <Link to="/" className="hover:text-gray-900 shrink-0">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-gray-400 shrink-0" />
        <span className="text-gray-900 font-medium truncate max-w-xs">
          {selectedSubcategory
            ? selectedSubcategory.replaceAll('-', ' ').toUpperCase()
            : selectedCategory
            ? selectedCategory.replaceAll('-', ' ').toUpperCase()
            : 'All Handcrafted Products'}
        </span>
      </div>

      {/* Mobile Filter & Sort Bar (Visible on mobile & tablet) */}
      <div className="lg:hidden flex items-center justify-between gap-2.5 bg-white p-2.5 sm:p-3 rounded-xl border border-[#EBE5DA] shadow-2xs">
        <button
          type="button"
          onClick={() => setIsMobileFiltersOpen(true)}
          className="flex-1 flex items-center justify-center space-x-2 py-2 px-3 bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg text-xs font-semibold text-gray-800 hover:bg-[#F2ECE1] transition-colors"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#C25E34]" />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="w-4 h-4 bg-[#C25E34] text-white rounded-full text-[10px] flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>

        <div className="flex-1 relative flex items-center">
          <select
            value={sortParam}
            onChange={(e) => updateParam('sort', e.target.value)}
            aria-label="Sort products"
            className="w-full appearance-none bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg py-2 pl-2.5 pr-7 text-xs text-gray-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
          >
            <option value="featured">Sort: Featured</option>
            <option value="newest">Sort: Newest</option>
            <option value="price_low">Price: Low to High</option>
            <option value="price_high">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
          </select>
          <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
        </div>
      </div>

      {/* Main Layout: Desktop Sidebar + Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar (Hidden on mobile) */}
        <aside className="hidden lg:block bg-white p-5 rounded-xl border border-[#EBE5DA] h-fit sticky top-24">
          <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-3 mb-5">
            <div className="flex items-center space-x-2 font-serif font-bold text-gray-900 text-sm">
              <SlidersHorizontal className="w-4 h-4 text-[#C25E34]" />
              <span>Filter Crafts</span>
            </div>
            <button
              type="button"
              onClick={clearFilters}
              className="text-xs text-[#C25E34] hover:underline flex items-center gap-1 font-medium cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
          {renderFilterBody(false)}
        </aside>

        {/* Right Product Grid Area */}
        <main className="lg:col-span-3 space-y-4">
          {/* Desktop Header Bar with count and sorting */}
          <div className="hidden lg:flex bg-white px-5 py-3.5 rounded-xl border border-[#EBE5DA] items-center justify-between gap-4">
            <div>
              <h1 className="font-serif text-lg font-bold text-gray-900">
                {searchQuery ? `Search results for "${searchQuery}"` : 'Handmade Catalog'}
              </h1>
              <p className="text-xs text-gray-500">
                Showing {products.length} of {totalCount} authentic products
              </p>
            </div>

            {/* Desktop Sort Selector */}
            <div className="flex items-center space-x-2 text-xs">
              <span className="text-gray-500">Sort by:</span>
              <div className="relative flex items-center">
                <select
                  value={sortParam}
                  onChange={(e) => updateParam('sort', e.target.value)}
                  className="appearance-none bg-[#FAF8F5] border border-[#E5E0D5] rounded-lg pl-3 pr-8 py-1.5 text-gray-800 font-medium focus:outline-hidden focus:ring-1 focus:ring-[#C25E34]"
                >
                  <option value="featured">Featured / Best Match</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price_low">Price: Low to High</option>
                  <option value="price_high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 pointer-events-none" />
              </div>
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
            <>
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4">
                {products.map((p) => (
                  <ProductCard key={p.id} product={p} compact={true} />
                ))}
              </div>

              {/* Pagination Controls (PL-04 & Mobile-responsive truncation) */}
              {lastPage > 1 && (
                <div className="flex items-center justify-center space-x-1.5 sm:space-x-2 pt-6 pb-2">
                  <button
                    type="button"
                    onClick={() => updateParam('page', String(Math.max(1, currentPage - 1)))}
                    disabled={currentPage <= 1}
                    className="p-1.5 sm:p-2 rounded-xl border border-[#E5E0D5] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  <div className="flex items-center space-x-1 text-xs font-semibold">
                    {Array.from({ length: lastPage }, (_, i) => i + 1)
                      .filter((pg) => pg === 1 || pg === lastPage || Math.abs(pg - currentPage) <= 1)
                      .map((pg, idx, arr) => (
                        <React.Fragment key={pg}>
                          {idx > 0 && arr[idx - 1] !== pg - 1 && (
                            <span className="px-1 text-gray-400">...</span>
                          )}
                          <button
                            type="button"
                            onClick={() => updateParam('page', String(pg))}
                            className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl transition-all ${
                              pg === currentPage
                                ? 'bg-[#C25E34] text-white shadow-2xs'
                                : 'bg-white text-gray-700 border border-[#E5E0D5] hover:bg-gray-50'
                            }`}
                          >
                            {pg}
                          </button>
                        </React.Fragment>
                      ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => updateParam('page', String(Math.min(lastPage, currentPage + 1)))}
                    disabled={currentPage >= lastPage}
                    className="p-1.5 sm:p-2 rounded-xl border border-[#E5E0D5] bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next page"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="bg-white p-12 rounded-xl border border-[#EBE5DA] text-center space-y-3">
              <p className="text-base font-serif font-bold text-gray-800">No craft products matched your filters</p>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Try widening your price range or clearing material filters to explore other traditional crafts.
              </p>
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 bg-[#C25E34] text-white text-xs font-semibold rounded-lg hover:bg-[#A0441E] transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filter Slide-Over Drawer */}
      {isMobileFiltersOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Filter products"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs animate-in fade-in duration-200 lg:hidden"
        >
          <div
            className="w-full max-w-xs sm:max-w-sm bg-white h-full flex flex-col shadow-2xl animate-in slide-in-from-right duration-300"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Drawer Header */}
            <div className="p-4 border-b border-[#EBE5DA] flex items-center justify-between">
              <div className="flex items-center space-x-2 font-serif font-bold text-gray-900 text-base">
                <SlidersHorizontal className="w-4 h-4 text-[#C25E34]" />
                <span>Filter Crafts</span>
              </div>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Body (Scrollable) */}
            <div className="p-5 flex-1 overflow-y-auto">
              {renderFilterBody(true)}
            </div>

            {/* Drawer Footer Actions */}
            <div className="p-4 border-t border-[#EBE5DA] bg-white flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  clearFilters();
                  setIsMobileFiltersOpen(false);
                }}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer text-center"
              >
                Clear All
              </button>
              <button
                type="button"
                onClick={() => setIsMobileFiltersOpen(false)}
                className="flex-1 py-2.5 px-4 text-xs font-semibold text-white bg-[#A34321] hover:bg-[#8C3413] rounded-xl shadow-xs transition-colors cursor-pointer text-center"
              >
                Apply {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
