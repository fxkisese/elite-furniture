import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductCard from '@/components/products/ProductCard';
import { Search, FilterX, Sofa, Bed, UtensilsCrossed, Briefcase, Package, Award, X, Tag, Sparkles } from 'lucide-react';
import { cn, formatPrice } from '@/lib/utils';
import { supabase } from '@/lib/supabase';

// Dummy catalogue of 17 items
const INITIAL_PRODUCTS = [
  { id: 1, title: 'Floating TV Unit', category: 'TV Units', price: 38000, description: 'Wall-mounted TV unit with concealed cable management. Matte black finish with soft-close storage.', imageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&q=80&w=800' },
  { id: 2, title: 'King Platform Bed', category: 'Beds', price: 68000, description: 'Low-profile king platform bed with upholstered headboard. Solid wood slats and premium fabric.', imageUrl: 'https://images.unsplash.com/photo-1505693314120-0d443867891c?auto=format&fit=crop&q=80&w=800' },
  { id: 3, title: '4-Door Sliding Wardrobe', category: 'Wardrobes', price: 72000, description: 'Full-length sliding door wardrobe with internal shelving, hanging rails & shoe compartment.', imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800' },
  { id: 4, title: 'Executive Mahogany Desk', category: 'Office', price: 65000, description: 'Premium solid mahogany office desk with drawers and cable management. Professional design.', imageUrl: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&q=80&w=800', badge: 'Best Seller' },
  { id: 5, title: 'Tempered Glass Coffee Table', category: 'Glass', price: 28000, description: 'Contemporary coffee table with tempered glass top and metal frame. Durable and easy to clean.', imageUrl: 'https://images.unsplash.com/photo-1533090481728-8b5c62ae2434?auto=format&fit=crop&q=80&w=800' },
  { id: 6, title: 'Chesterfield Leather Sofa', category: 'Living Room', price: 150000, description: 'Classic Chesterfield design with deep button tufting and rolled arms. Premium upholstery.', imageUrl: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&q=80&w=800', badge: 'Best Seller' },
  { id: 7, title: 'Minimalist Platform Bed', category: 'Bedroom', price: 75000, description: 'Sleek minimalist bed frame with clean lines. Walnut wood construction with modern appeal.', imageUrl: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&q=80&w=800' },
  { id: 8, title: 'Rustic Dining Chairs (Set of 6)', category: 'Dining', price: 54000, description: 'Solid wood dining chairs with rustic finish. Comfortable seating with traditional craftsmanship.', imageUrl: 'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=800' },
  { id: 9, title: 'Ergonomic Office Chair', category: 'Office', price: 35000, description: 'Ergonomic design with lumbar support and adjustable height. Breathable mesh material for comfort.', imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800' },
  { id: 10, title: '8-Seater Dining Set', category: 'Dining Sets', price: 110000, description: 'Solid oak dining table with 8 upholstered chairs. Extensible design for flexibility.', imageUrl: 'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&q=80&w=800', badge: 'Best Seller' },
  { id: 11, title: 'Velvet Accent Chair', category: 'Living Room', price: 42000, description: 'Contemporary accent chair in soft velvet fabric. Curved silhouette with wooden legs.', imageUrl: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800' },
  { id: 12, title: 'Mvuli Wardrobe (3-Door)', category: 'Wardrobe', price: 110000, description: 'Traditional 3-door wardrobe with solid mahogany construction. Spacious storage with mirror.', imageUrl: 'https://images.unsplash.com/photo-1558997519-83ea9252edf8?auto=format&fit=crop&q=80&w=800' },
  { id: 13, title: '6-Drawer Dresser', category: 'Dressers', price: 42000, description: 'Wide dresser with 6 deep drawers and solid brass hardware. Perfect for bedroom storage.', imageUrl: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
  { id: 14, title: 'Modern Bookshelf', category: 'Storage', price: 48000, description: 'Contemporary shelving unit with open design. Walnut finish with sturdy metal framework.', imageUrl: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?auto=format&fit=crop&q=80&w=800' },
  { id: 15, title: 'Glass Dining Table', category: 'Glass', price: 90000, description: 'Elegant glass-top dining table with tempered surface and steel base. Seats up to 6.', imageUrl: 'https://images.unsplash.com/photo-1577140917170-285929fb55b7?auto=format&fit=crop&q=80&w=800' },
  { id: 16, title: '4-Seater Dining Set', category: 'Dining Sets', price: 58000, description: 'Compact round dining set perfect for apartments. Solid wood table with upholstered chairs.', imageUrl: 'https://images.unsplash.com/photo-1604480557873-ae065e9d1cb8?auto=format&fit=crop&q=80&w=800' },
  { id: 17, title: 'Bedside Table (Pair)', category: 'Bedroom', price: 30000, description: 'Stylish bedside tables with drawer storage. Walnut finish with modern minimalist design.', imageUrl: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?auto=format&fit=crop&q=80&w=800' },
];

const CATEGORIES = [
  { name: 'All Products', icon: Package },
  { name: 'Living Room', icon: Sofa },
  { name: 'Bedroom', icon: Bed },
  { name: 'Dining Room', icon: UtensilsCrossed },
  { name: 'Office', icon: Briefcase },
  { name: 'Storage', icon: Package },
];

const isBestSeller = (p) => p?.badge === 'Best Seller' || p?.best_seller === true;
const isOnSale = (p) => (p?.originalPrice && p.originalPrice > p.price) || p?.discount_price || p?.badge === 'Sale' || p?.on_sale === true;
const isNewArrival = (p) => p?.badge === 'New' || p?.badge === 'New Arrival' || p?.is_new === true;

export default function Products() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Products');
  const [sort, setSort] = useState('recommended');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [bestSellerOnly, setBestSellerOnly] = useState(false);
  const [onSaleOnly, setOnSaleOnly] = useState(false);
  const [newArrivalsOnly, setNewArrivalsOnly] = useState(false);
  const [dbProducts, setDbProducts] = useState(INITIAL_PRODUCTS);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase.from('products').select('*').eq('in_stock', true);
        if (!error && data && data.length > 0) {
          setDbProducts(data);
        }
      } catch (err) {
        console.error('Failed to load products from Supabase:', err);
      }
    }
    loadProducts();
  }, []);

  // Counts per category, based on current product set (independent of other filters)
  const categoryCounts = useMemo(() => {
    const counts = {};
    CATEGORIES.forEach(cat => {
      counts[cat.name] = cat.name === 'All Products'
        ? dbProducts.length
        : dbProducts.filter(p => (p.category || '').toLowerCase().includes(cat.name.toLowerCase())).length;
    });
    return counts;
  }, [dbProducts]);

  const filteredProducts = useMemo(() => {
    let result = dbProducts;

    if (category !== 'All Products') {
      result = result.filter(p => (p.category || '').toLowerCase().includes(category.toLowerCase()));
    }

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(p => (p.title || p.name || '').toLowerCase().includes(q));
    }

    if (minPrice !== '') {
      const min = Number(minPrice);
      result = result.filter(p => (p.price ?? 0) >= min);
    }

    if (maxPrice !== '') {
      const max = Number(maxPrice);
      result = result.filter(p => (p.price ?? 0) <= max);
    }

    if (bestSellerOnly) {
      result = result.filter(p => isBestSeller(p));
    }

    if (onSaleOnly) {
      result = result.filter(p => isOnSale(p));
    }

    if (newArrivalsOnly) {
      result = result.filter(p => isNewArrival(p));
    }

    if (sort === 'price-asc') {
      result = [...result].sort((a, b) => a.price - b.price);
    } else if (sort === 'price-desc') {
      result = [...result].sort((a, b) => b.price - a.price);
    } else if (sort === 'name-asc') {
      result = [...result].sort((a, b) => (a.title || a.name || '').localeCompare(b.title || b.name || ''));
    } else if (sort === 'name-desc') {
      result = [...result].sort((a, b) => (b.title || b.name || '').localeCompare(a.title || a.name || ''));
    } else if (sort === 'best-seller') {
      result = [...result].sort((a, b) => (isBestSeller(b) ? 1 : 0) - (isBestSeller(a) ? 1 : 0));
    }

    return result;
  }, [search, category, sort, minPrice, maxPrice, bestSellerOnly, onSaleOnly, newArrivalsOnly, dbProducts]);

  const hasActiveFilters = search || category !== 'All Products' || sort !== 'recommended' || minPrice !== '' || maxPrice !== '' || bestSellerOnly || onSaleOnly || newArrivalsOnly;

  const clearFilters = () => {
    setSearch('');
    setCategory('All Products');
    setSort('recommended');
    setMinPrice('');
    setMaxPrice('');
    setBestSellerOnly(false);
    setOnSaleOnly(false);
    setNewArrivalsOnly(false);
  };

  return (
    <PageLayout>
      <div className="container mx-auto px-4 py-16 max-w-7xl">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-16 gap-8">
          <div>
            <p className="text-[#C8A570] font-bold text-sm tracking-widest mb-3 uppercase">Browse Our</p>
            <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-4 text-gray-900">PRODUCTS</h1>
            <p className="text-lg text-gray-600">Quality furniture to transform your space</p>
          </div>

          <div className="flex flex-col items-start lg:items-end gap-2">
            <div className="flex items-center gap-3">
              <Sofa className="w-8 h-8 text-[#C8A570]" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Stylish | Durable | Affordable</p>
                <p className="text-sm text-gray-600">Made for every home & office in Kenya</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Panel */}
        <div className="bg-white border border-gray-200 rounded-none shadow-sm p-6 md:p-8 mb-10">
          {/* Search and Sort */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="flex h-11 rounded-none border border-gray-300 bg-white pl-9 pr-3 py-2 text-sm placeholder:text-gray-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A570] focus-visible:ring-offset-2 w-full transition-shadow"
              />
            </div>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="flex h-11 items-center justify-between rounded-none border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#C8A570] focus:ring-offset-2 sm:w-[220px] cursor-pointer"
            >
              <option value="recommended">Recommended</option>
              <option value="best-seller">Best Sellers First</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name-asc">Name: A to Z</option>
              <option value="name-desc">Name: Z to A</option>
            </select>
          </div>

          <div className="h-px bg-gray-100 my-6" />

          {/* Price Range + Best Seller */}
          <div className="flex flex-col sm:flex-row sm:items-end gap-6 mb-6">
            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">
                Price Range (KSh)
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="Min"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="h-11 w-32 rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A570] focus-visible:ring-offset-2"
                />
                <span className="text-gray-400 text-sm font-medium">to</span>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  placeholder="Max"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="h-11 w-32 rounded-none border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8A570] focus-visible:ring-offset-2"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-2">
                Highlights
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setBestSellerOnly(!bestSellerOnly)}
                  className={cn(
                    "inline-flex items-center gap-2 h-11 px-5 rounded-none text-sm font-semibold transition-all border",
                    bestSellerOnly
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#D4AF37] hover:text-[#0A0A0A]"
                  )}
                >
                  <Award className={cn("w-4 h-4", bestSellerOnly ? "text-[#D4AF37]" : "text-gray-400")} />
                  Best Sellers
                </button>
                <button
                  onClick={() => setOnSaleOnly(!onSaleOnly)}
                  className={cn(
                    "inline-flex items-center gap-2 h-11 px-5 rounded-none text-sm font-semibold transition-all border",
                    onSaleOnly
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#D4AF37] hover:text-[#0A0A0A]"
                  )}
                >
                  <Tag className={cn("w-4 h-4", onSaleOnly ? "text-[#D4AF37]" : "text-gray-400")} />
                  On Sale
                </button>
                <button
                  onClick={() => setNewArrivalsOnly(!newArrivalsOnly)}
                  className={cn(
                    "inline-flex items-center gap-2 h-11 px-5 rounded-none text-sm font-semibold transition-all border",
                    newArrivalsOnly
                      ? "bg-[#0A0A0A] text-white border-[#0A0A0A] shadow-md"
                      : "bg-white text-gray-700 border-gray-300 hover:border-[#D4AF37] hover:text-[#0A0A0A]"
                  )}
                >
                  <Sparkles className={cn("w-4 h-4", newArrivalsOnly ? "text-[#D4AF37]" : "text-gray-400")} />
                  New Arrivals
                </button>
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <label className="block text-[11px] font-bold tracking-widest uppercase text-gray-500 mb-3">
              Category
            </label>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map(cat => {
                const IconComponent = cat.icon;
                const active = category === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => setCategory(cat.name)}
                    className={cn(
                      "inline-flex items-center gap-2 px-5 py-2.5 rounded-none text-sm font-semibold transition-all whitespace-nowrap border",
                      active
                        ? "bg-black text-white border-black shadow-md"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300"
                    )}
                  >
                    <IconComponent className={cn("w-4 h-4", active ? "text-[#D4AF37]" : "text-gray-400")} />
                    {cat.name.toUpperCase()}
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-none",
                      active ? "bg-white/20 text-white" : "bg-gray-200 text-gray-500"
                    )}>
                      {categoryCounts[cat.name] ?? 0}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Results bar + active filter chips */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3 text-sm text-gray-600">
          <div className="flex flex-wrap items-center gap-2">
            <span>Showing {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}</span>

            {search && (
              <FilterChip label={`"${search}"`} onRemove={() => setSearch('')} />
            )}
            {category !== 'All Products' && (
              <FilterChip label={category} onRemove={() => setCategory('All Products')} />
            )}
            {(minPrice !== '' || maxPrice !== '') && (
              <FilterChip
                label={`${minPrice !== '' ? formatPrice(Number(minPrice)) : 'KSh 0'} – ${maxPrice !== '' ? formatPrice(Number(maxPrice)) : 'Any'}`}
                onRemove={() => { setMinPrice(''); setMaxPrice(''); }}
              />
            )}
            {bestSellerOnly && (
              <FilterChip label="Best Sellers" onRemove={() => setBestSellerOnly(false)} />
            )}
            {onSaleOnly && (
              <FilterChip label="On Sale" onRemove={() => setOnSaleOnly(false)} />
            )}
            {newArrivalsOnly && (
              <FilterChip label="New Arrivals" onRemove={() => setNewArrivalsOnly(false)} />
            )}
          </div>

          {hasActiveFilters && (
            <button onClick={clearFilters} className="flex items-center text-[#C8A570] hover:text-[#B5925F] font-medium">
              <FilterX className="w-4 h-4 mr-1" /> Clear all filters
            </button>
          )}
        </div>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 bg-gray-100 rounded-none border border-gray-300 mb-20 flex flex-col items-center">
            <h3 className="text-xl font-bold mb-2">No products found</h3>
            <p className="text-gray-600 mb-6">We couldn't find anything matching your current filters.</p>
            <button onClick={clearFilters} className="inline-flex items-center justify-center rounded-none text-sm font-medium transition-colors bg-black text-white hover:bg-gray-800 h-10 px-4 py-2">Clear Filters</button>
          </div>
        )}

        {/* Custom Order CTA */}
        <div className="bg-white border-2 border-[#D4AF37] text-gray-900 shadow-md rounded-none p-10 md:p-16 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">Can't find what you're looking for?</h2>
            <p className="text-gray-600 text-lg">
              We do custom furniture to fit your space and style.
            </p>
          </div>
          <Link to="/custom-orders" className="relative z-10 whitespace-nowrap shrink-0 inline-flex items-center justify-center rounded-none text-sm font-bold transition-colors bg-black text-white hover:bg-gray-800 h-12 px-8">
              REQUEST A QUOTE
          </Link>
        </div>
      </div>
    </PageLayout>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs font-semibold px-3 py-1.5 rounded-none">
      {label}
      <button onClick={onRemove} className="hover:text-[#C8A570] transition-colors">
        <X className="w-3 h-3" />
      </button>
    </span>
  );
}
