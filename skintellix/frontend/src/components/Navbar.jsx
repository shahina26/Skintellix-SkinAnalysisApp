import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { productsApi } from '../utils/api';

const NAV_LINKS = [
  { to: '/products?productType=skincare', label: 'Skincare' },
  { to: '/products?productType=makeup', label: 'Makeup' },
  { to: '/products?productType=haircare', label: 'Haircare' },
  { to: '/compare', label: 'Compare Prices' },
  { to: '/blog', label: 'Blog' }
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const { wishlist, compareList, user } = useStore();
  const searchRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); setSearchOpen(false); }, [location]);

  useEffect(() => {
    if (searchQuery.length < 2) { setSuggestions([]); return; }
    const timer = setTimeout(async () => {
      try {
        const res = await productsApi.suggestions(searchQuery);
        setSuggestions(res.data || []);
      } catch { setSuggestions([]); }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery)}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-cream-50/95 backdrop-blur-md shadow-sm border-b border-rose-blush' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center shadow-sm group-hover:shadow-glow transition-all duration-300">
                <span className="text-white text-lg">✦</span>
              </div>
              <div>
                <span className="font-display text-2xl text-charcoal-900 tracking-wide">Skintellix</span>
                <div className="text-[9px] tracking-[0.25em] text-rose-medium uppercase font-medium -mt-1">Smart Skin · Smart Choices</div>
              </div>
            </Link>

            {/* Desktop nav */}
            <div className="hidden lg:flex items-center gap-8">
              {NAV_LINKS.map(link => (
                <Link key={link.to} to={link.to}
                  className="text-sm font-medium text-charcoal-800/70 hover:text-rose-deep transition-colors duration-200 relative group">
                  {link.label}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-rose-medium group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 md:gap-3">
              {/* Search */}
              <button onClick={() => setSearchOpen(true)}
                className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-rose-blush text-charcoal-800/60 hover:text-rose-deep transition-all duration-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                </svg>
              </button>

              {/* Wishlist */}
              <Link to="/dashboard#wishlist" className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-rose-blush text-charcoal-800/60 hover:text-rose-deep transition-all duration-200">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlist.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-deep text-white text-[9px] rounded-full flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Compare badge */}
              {compareList.length > 0 && (
                <Link to="/compare" className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-rose-deep text-white text-xs rounded-full font-medium hover:bg-rose-dark transition-colors">
                  <span>⚖️</span> Compare ({compareList.length})
                </Link>
              )}

              {/* CTA / User */}
              {user ? (
                <Link to="/dashboard" className="flex items-center gap-2 px-4 py-2 bg-rose-blush text-rose-deep rounded-full text-sm font-medium hover:bg-rose-soft transition-colors">
                  <span className="w-6 h-6 bg-rose-medium rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {user.name?.[0]?.toUpperCase()}
                  </span>
                  <span className="hidden md:block">{user.name?.split(' ')[0]}</span>
                </Link>
              ) : (
                <Link to="/quiz" className="btn-primary text-sm px-5 py-2.5 hidden md:inline-flex">
                  ✦ Skin Analysis
                </Link>
              )}

              {/* Mobile menu */}
              <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden w-9 h-9 flex items-center justify-center rounded-full hover:bg-rose-blush transition-colors">
                <div className="w-5 flex flex-col gap-1.5">
                  <span className={`h-0.5 bg-charcoal-800 rounded transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
                  <span className={`h-0.5 bg-charcoal-800 rounded transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
                  <span className={`h-0.5 bg-charcoal-800 rounded transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
                </div>
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden bg-cream-50/98 backdrop-blur-md border-t border-rose-blush px-4 py-6 space-y-4">
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} className="block text-base font-medium text-charcoal-800/80 hover:text-rose-deep py-2 border-b border-rose-blush/30">
                {link.label}
              </Link>
            ))}
            <Link to="/quiz" className="btn-primary w-full justify-center mt-4">✦ Free Skin Analysis</Link>
          </div>
        )}
      </nav>

      {/* Search Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-[100] bg-charcoal-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4"
          onClick={(e) => e.target === e.currentTarget && setSearchOpen(false)}>
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
            <form onSubmit={handleSearch} className="flex items-center gap-3 p-4 border-b border-rose-blush">
              <svg className="w-5 h-5 text-rose-medium flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
              <input ref={searchRef} autoFocus value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search serums, moisturizers, lipsticks..."
                className="flex-1 text-base text-charcoal-900 placeholder-charcoal-800/30 outline-none bg-transparent" />
              <button type="button" onClick={() => setSearchOpen(false)} className="text-charcoal-800/40 hover:text-charcoal-900 text-lg">✕</button>
            </form>

            {suggestions.length > 0 && (
              <div className="max-h-72 overflow-y-auto py-2">
                {suggestions.map((s, i) => (
                  <button key={i} onClick={() => { navigate(`/products?search=${encodeURIComponent(s)}`); setSearchOpen(false); setSearchQuery(''); }}
                    className="w-full text-left px-5 py-3 text-sm text-charcoal-800 hover:bg-rose-blush/50 transition-colors flex items-center gap-3">
                    <span className="text-rose-medium">🔍</span> {s}
                  </button>
                ))}
              </div>
            )}

            {searchQuery.length === 0 && (
              <div className="p-5">
                <p className="text-xs font-medium text-charcoal-800/40 uppercase tracking-wider mb-3">Popular searches</p>
                <div className="flex flex-wrap gap-2">
                  {['Vitamin C Serum', 'SPF 50 Sunscreen', 'Niacinamide', 'Kajal', 'Moisturizer', 'Foundation'].map(term => (
                    <button key={term} onClick={() => { navigate(`/products?search=${term}`); setSearchOpen(false); }}
                      className="badge-rose text-xs cursor-pointer hover:bg-rose-soft transition-colors">{term}</button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
