import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsApi } from '../utils/api';

const CATEGORIES = {
  skincare: ['moisturizer','serum','sunscreen','cleanser','toner','face_mask','eye_cream','lip_care','face_oil','exfoliator'],
  makeup:   ['foundation','concealer','blush','highlighter','bronzer','eyeshadow','mascara','eyeliner','lipstick','lip_gloss','setting_powder','setting_spray','primer','contour'],
  haircare: ['shampoo','conditioner','hair_mask','hair_serum','hair_oil'],
  bodycare: ['body_lotion','body_wash','hand_cream','foot_cream','deodorant']
};

const SORT_OPTIONS = [
  { value: 'popularity', label: 'Most Popular' },
  { value: 'rating',     label: 'Highest Rated' },
  { value: 'price_asc',  label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'score',      label: 'Skintellix Score' }
];

const SKIN_TYPES = ['oily','dry','combination','normal','sensitive'];
const SKIN_TONES = ['fair','medium','wheatish','dusky','dark'];
const CONCERNS   = ['acne','pigmentation','dryness','wrinkles','dark_circles','sensitivity','uneven_tone','large_pores','dullness'];

function FilterPanel({ filters, onChange, onReset }) {
  const [priceRange, setPriceRange] = useState([filters.minPrice || 0, filters.maxPrice || 10000]);

  const toggle = (key, value) => {
    onChange({ ...filters, [key]: filters[key] === value ? '' : value });
  };

  const toggleBool = (key) => onChange({ ...filters, [key]: !filters[key] });

  return (
    <aside className="w-64 flex-shrink-0 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl text-charcoal-900">Filters</h2>
        <button onClick={onReset} className="text-xs text-rose-medium hover:text-rose-deep transition-colors">Reset all</button>
      </div>

      {/* Product Type */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3">Category</p>
        <div className="space-y-1">
          {['skincare','makeup','haircare','bodycare'].map(type => (
            <button key={type} onClick={() => toggle('productType', type)}
              className={`w-full text-left text-sm px-3 py-2 rounded-lg capitalize transition-colors ${filters.productType === type ? 'bg-rose-blush text-rose-deep font-medium' : 'text-charcoal-800/70 hover:bg-cream-100'}`}>
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-category */}
      {filters.productType && CATEGORIES[filters.productType] && (
        <div className="card p-4">
          <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3">Sub-Category</p>
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {CATEGORIES[filters.productType].map(cat => (
              <button key={cat} onClick={() => toggle('category', cat)}
                className={`w-full text-left text-sm px-3 py-2 rounded-lg capitalize transition-colors ${filters.category === cat ? 'bg-rose-blush text-rose-deep font-medium' : 'text-charcoal-800/70 hover:bg-cream-100'}`}>
                {cat.replace(/_/g, ' ')}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Price Range */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3">Price Range</p>
        <div className="flex gap-2 mb-3">
          <input type="number" placeholder="Min" value={filters.minPrice || ''} min={0}
            onChange={e => onChange({ ...filters, minPrice: e.target.value })}
            className="input-field text-xs py-2 w-full" />
          <input type="number" placeholder="Max" value={filters.maxPrice || ''} min={0}
            onChange={e => onChange({ ...filters, maxPrice: e.target.value })}
            className="input-field text-xs py-2 w-full" />
        </div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {[['Under ₹500',0,500],['₹500-2k',500,2000],['₹2k-5k',2000,5000],['₹5k+',5000,'']].map(([l,mn,mx]) => (
            <button key={l} onClick={() => onChange({ ...filters, minPrice: mn, maxPrice: mx })}
              className="text-[10px] badge-rose cursor-pointer hover:bg-rose-soft transition-colors">{l}</button>
          ))}
        </div>
      </div>

      {/* Skin Type */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3">Skin Type</p>
        <div className="flex flex-wrap gap-1.5">
          {SKIN_TYPES.map(st => (
            <button key={st} onClick={() => toggle('skinType', st)}
              className={`text-xs px-3 py-1.5 rounded-full capitalize border transition-colors ${filters.skinType === st ? 'bg-rose-deep text-white border-rose-deep' : 'border-rose-blush text-charcoal-800/60 hover:border-rose-medium'}`}>
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Skin Concern */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3">Skin Concern</p>
        <div className="flex flex-wrap gap-1.5">
          {CONCERNS.map(c => (
            <button key={c} onClick={() => toggle('concern', c)}
              className={`text-xs px-3 py-1.5 rounded-full capitalize border transition-colors ${filters.concern === c ? 'bg-rose-deep text-white border-rose-deep' : 'border-rose-blush text-charcoal-800/60 hover:border-rose-medium'}`}>
              {c.replace(/_/g,' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="card p-4">
        <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3">Features</p>
        <div className="space-y-2">
          {[
            ['vegan', '🌱 Vegan'],
            ['crueltyFree', '🐰 Cruelty-Free'],
            ['natural', '🌿 Natural'],
            ['ayurvedic', '🕉️ Ayurvedic'],
            ['spf', '☀️ Has SPF'],
            ['expertRecommended', '👩‍⚕️ Expert Recommended'],
            ['bestseller', '⭐ Bestseller'],
            ['budgetPick', '💰 Budget Pick'],
            ['luxuryPick', '💎 Luxury Pick']
          ].map(([key, label]) => (
            <label key={key} className="flex items-center gap-2 cursor-pointer group">
              <div onClick={() => toggleBool(key)}
                className={`w-4 h-4 rounded flex items-center justify-center border transition-colors ${filters[key] ? 'bg-rose-deep border-rose-deep' : 'border-charcoal-800/20 group-hover:border-rose-medium'}`}>
                {filters[key] && <span className="text-white text-[10px]">✓</span>}
              </div>
              <span className="text-sm text-charcoal-800/70 group-hover:text-charcoal-900 transition-colors">{label}</span>
            </label>
          ))}
        </div>
      </div>
    </aside>
  );
}

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('grid'); // 'grid' | 'list'

  const [filters, setFilters] = useState({
    productType: searchParams.get('productType') || '',
    category:    searchParams.get('category') || '',
    search:      searchParams.get('search') || '',
    skinType:    searchParams.get('skinType') || '',
    concern:     searchParams.get('concern') || '',
    minPrice:    searchParams.get('minPrice') || '',
    maxPrice:    searchParams.get('maxPrice') || '',
    sort:        searchParams.get('sort') || 'popularity',
    page:        parseInt(searchParams.get('page') || '1', 10),
    vegan: false, crueltyFree: false, natural: false, ayurvedic: false,
    spf: false, expertRecommended: false, bestseller: false, budgetPick: false, luxuryPick: false
  });

  const fetchProducts = useCallback(async (f) => {
    setLoading(true);
    try {
      const params = {};
      Object.entries(f).forEach(([k, v]) => {
        if (v === true) params[k] = 'true';
        else if (v && v !== false) params[k] = v;
      });
      const res = await productsApi.list(params);
      if (res.success) {
        setProducts(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      productType: searchParams.get('productType') || '',
      category: searchParams.get('category') || '',
      search: searchParams.get('search') || ''
    }));
  }, [searchParams]);

  useEffect(() => {
    fetchProducts(filters);
    window.scrollTo(0, 0);
  }, [filters, fetchProducts]);

  const handleFilterChange = (newFilters) => {
    // Only reset to page 1 if the filter change wasn't just a page change
    const isOnlyPageChange = Object.keys(newFilters).every(key => key === 'page' || newFilters[key] === filters[key]);
    setFilters({ ...newFilters, page: isOnlyPageChange ? newFilters.page : 1 });
  };

  const handleReset = () => {
    setFilters({ productType: '', category: '', search: '', skinType: '', concern: '', minPrice: '', maxPrice: '', sort: 'popularity', page: 1, vegan: false, crueltyFree: false, natural: false, ayurvedic: false, spf: false, expertRecommended: false, bestseller: false, budgetPick: false, luxuryPick: false });
  };

  const activeFilterCount = [filters.productType, filters.category, filters.skinType, filters.concern, filters.minPrice, filters.maxPrice, filters.vegan, filters.crueltyFree, filters.natural, filters.ayurvedic, filters.spf, filters.expertRecommended, filters.bestseller, filters.budgetPick, filters.luxuryPick].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Page header */}
      <div className="bg-white border-b border-rose-blush/30 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="font-display text-3xl md:text-4xl text-charcoal-950 mb-2">
            {filters.search ? `Results for "${filters.search}"` : filters.productType ? `${filters.productType.charAt(0).toUpperCase() + filters.productType.slice(1)} Products` : 'All Beauty Products'}
          </h1>
          <p className="text-charcoal-800/50 text-sm">
            {pagination.total} products with real-time price comparison across 10+ platforms
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button onClick={() => setFiltersOpen(!filtersOpen)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-rose-blush text-sm font-medium text-charcoal-800 hover:border-rose-medium transition-colors lg:hidden">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
            </svg>
            Filters {activeFilterCount > 0 && <span className="w-5 h-5 rounded-full bg-rose-deep text-white text-[10px] font-bold flex items-center justify-center">{activeFilterCount}</span>}
          </button>

          {/* Search bar */}
          <div className="flex-1 min-w-60">
            <input type="text" value={filters.search} onChange={e => handleFilterChange({ ...filters, search: e.target.value })}
              placeholder="Search products, brands, ingredients..."
              className="input-field text-sm py-2.5" />
          </div>

          {/* Sort */}
          <select value={filters.sort} onChange={e => handleFilterChange({ ...filters, sort: e.target.value })}
            className="px-4 py-2.5 rounded-xl bg-white border border-rose-blush text-sm text-charcoal-800 focus:outline-none focus:border-rose-medium transition-colors cursor-pointer">
            {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          {/* View toggle */}
          <div className="flex rounded-xl border border-rose-blush overflow-hidden bg-white">
            {[['grid','▦'],['list','☰']].map(([v, icon]) => (
              <button key={v} onClick={() => setView(v)}
                className={`px-3 py-2.5 text-sm transition-colors ${view === v ? 'bg-rose-blush text-rose-deep' : 'text-charcoal-800/50 hover:bg-cream-100'}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Active filter chips */}
        {activeFilterCount > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {filters.productType && <span className="badge-rose text-xs flex items-center gap-1">{filters.productType} <button onClick={() => handleFilterChange({ ...filters, productType: '' })} className="ml-1 hover:text-rose-dark">✕</button></span>}
            {filters.skinType && <span className="badge-rose text-xs flex items-center gap-1">{filters.skinType} skin <button onClick={() => handleFilterChange({ ...filters, skinType: '' })} className="ml-1 hover:text-rose-dark">✕</button></span>}
            {filters.concern && <span className="badge-rose text-xs flex items-center gap-1">{filters.concern.replace('_',' ')} <button onClick={() => handleFilterChange({ ...filters, concern: '' })} className="ml-1 hover:text-rose-dark">✕</button></span>}
            {(filters.minPrice || filters.maxPrice) && <span className="badge-rose text-xs flex items-center gap-1">₹{filters.minPrice||0}–{filters.maxPrice||'∞'} <button onClick={() => handleFilterChange({ ...filters, minPrice: '', maxPrice: '' })} className="ml-1 hover:text-rose-dark">✕</button></span>}
            {['vegan','crueltyFree','natural','ayurvedic','spf','bestseller'].filter(k => filters[k]).map(k => (
              <span key={k} className="badge-rose text-xs flex items-center gap-1">{k} <button onClick={() => handleFilterChange({ ...filters, [k]: false })} className="ml-1 hover:text-rose-dark">✕</button></span>
            ))}
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop filter sidebar */}
          <div className="hidden lg:block">
            <FilterPanel filters={filters} onChange={handleFilterChange} onReset={handleReset} />
          </div>

          {/* Mobile filters drawer */}
          {filtersOpen && (
            <div className="fixed inset-0 z-50 lg:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setFiltersOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-80 bg-cream-50 overflow-y-auto p-4 shadow-2xl">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-display text-xl">Filters</h2>
                  <button onClick={() => setFiltersOpen(false)} className="text-charcoal-800/50 text-lg">✕</button>
                </div>
                <FilterPanel filters={filters} onChange={(f) => { handleFilterChange(f); }} onReset={handleReset} />
              </div>
            </div>
          )}

          {/* Products grid */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {Array(12).fill(0).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden">
                    <div className="skeleton aspect-square" />
                    <div className="p-4 space-y-2">
                      <div className="skeleton h-3 rounded w-1/2" />
                      <div className="skeleton h-4 rounded w-3/4" />
                      <div className="skeleton h-5 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="font-display text-2xl text-charcoal-900 mb-2">No products found</h3>
                <p className="text-charcoal-800/50 mb-6">Try adjusting your filters or search query</p>
                <button onClick={handleReset} className="btn-primary">Clear All Filters</button>
              </div>
            ) : (
              <>
                <div className={`grid gap-5 ${view === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
                  {products.map(product => <ProductCard key={product._id} product={product} />)}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex justify-center gap-2 mt-10">
                    <button disabled={filters.page <= 1} onClick={() => handleFilterChange({ ...filters, page: filters.page - 1 })}
                      className="px-4 py-2 rounded-xl border border-rose-blush text-sm disabled:opacity-30 hover:bg-rose-blush transition-colors">← Prev</button>
                    {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => i + 1).map(p => (
                      <button key={p} onClick={() => handleFilterChange({ ...filters, page: p })}
                        className={`w-10 h-10 rounded-xl text-sm transition-colors ${filters.page === p ? 'bg-rose-deep text-white' : 'border border-rose-blush hover:bg-rose-blush'}`}>
                        {p}
                      </button>
                    ))}
                    <button disabled={filters.page >= pagination.pages} onClick={() => handleFilterChange({ ...filters, page: filters.page + 1 })}
                      className="px-4 py-2 rounded-xl border border-rose-blush text-sm disabled:opacity-30 hover:bg-rose-blush transition-colors">Next →</button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
