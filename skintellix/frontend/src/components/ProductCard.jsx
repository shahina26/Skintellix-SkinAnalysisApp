import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

const PLATFORM_COLORS = {
  amazon: '#FF9900', flipkart: '#2874F0', nykaa: '#FC2779',
  myntra: '#FF3F6C', purplle: '#A855F7', tata_cliq: '#FF6000',
  meesho: '#F43E5C', bigbasket: '#84BD00', blinkit: '#F8D90F', ajio: '#EF6C00'
};
const PLATFORM_NAMES = {
  amazon: 'Amazon', flipkart: 'Flipkart', nykaa: 'Nykaa',
  myntra: 'Myntra', purplle: 'Purplle', tata_cliq: 'Tata CLiQ',
  meesho: 'Meesho', bigbasket: 'BigBasket', blinkit: 'Blinkit', ajio: 'AJIO'
};

export default function ProductCard({ product, showCompare = true }) {
  const [imgError, setImgError] = useState(false);
  const { toggleWishlist, isWishlisted, addToCompare } = useStore();
  const wishlisted = isWishlisted(product._id);

  const lowestPrice = product.lowestPrice ||
    (product.platforms?.length ? Math.min(...product.platforms.map(p => p.price)) : product.mrp);
  const bestPlatform = product.platforms?.filter(p => p.inStock).sort((a, b) => a.price - b.price)[0];
  const discount = product.mrp ? Math.round((1 - lowestPrice / product.mrp) * 100) : 0;
  const platformCount = product.platforms?.filter(p => p.inStock).length || 0;

  const handleWishlist = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥');
  };

  const handleCompare = (e) => {
    e.preventDefault();
    addToCompare(product);
    toast.success('Added to compare');
  };

  return (
    <Link to={`/products/${product._id}`} className="group block">
      <div className="card-hover overflow-hidden relative">
        {/* Badges */}
        <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5">
          {product.bestseller && <span className="badge-gold text-[10px]">⭐ Bestseller</span>}
          {product.trending && !product.bestseller && <span className="badge-rose text-[10px]">🔥 Trending</span>}
          {product.expertRecommended && <span className="badge bg-indigo-50 text-indigo-700 text-[10px]">👩‍⚕️ Expert Pick</span>}
          {product.features?.isNatural && <span className="badge-green text-[10px]">🌿 Natural</span>}
          {product.luxuryPick && <span className="badge-gold text-[10px]">💎 Luxury</span>}
        </div>

        {/* Discount badge */}
        {discount > 0 && (
          <div className="absolute top-3 right-10 z-10">
            <span className="bg-rose-deep text-white text-[10px] font-bold px-2 py-0.5 rounded-full">{discount}% OFF</span>
          </div>
        )}

        {/* Wishlist button */}
        <button onClick={handleWishlist}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 ${wishlisted ? 'bg-rose-deep text-white' : 'bg-white/80 text-charcoal-800/40 hover:text-rose-deep hover:bg-white'}`}>
          <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
        </button>

        {/* Product Image */}
        <div className="relative overflow-hidden bg-gradient-to-br from-rose-blush/40 to-cream-100 aspect-square">
          {!imgError ? (
            <img src={product.thumbnail || product.images?.[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-6xl opacity-30">🧴</span>
            </div>
          )}
          {/* Hover overlay */}
          <div className="absolute inset-0 bg-charcoal-900/0 group-hover:bg-charcoal-900/10 transition-all duration-300 flex items-end justify-center pb-4 opacity-0 group-hover:opacity-100">
            {showCompare && (
              <button onClick={handleCompare}
                className="bg-white text-charcoal-900 text-xs font-medium px-4 py-2 rounded-full shadow-md hover:bg-rose-deep hover:text-white transition-all duration-200">
                + Compare
              </button>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <p className="text-[10px] font-semibold text-rose-medium uppercase tracking-widest mb-0.5">{product.brand}</p>
          <h3 className="font-medium text-charcoal-900 text-sm leading-snug mb-2 line-clamp-2 group-hover:text-rose-deep transition-colors">
            {product.name}
          </h3>

          {/* Tags */}
          <div className="flex flex-wrap gap-1 mb-3">
            {product.features?.isVegan && <span className="text-[9px] text-green-700 bg-green-50 px-1.5 py-0.5 rounded">Vegan</span>}
            {product.features?.isCrueltyFree && <span className="text-[9px] text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">Cruelty-Free</span>}
            {product.features?.isSPF && <span className="text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">SPF {product.features.spfValue || ''}</span>}
            {product.features?.isAyurvedic && <span className="text-[9px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">Ayurvedic</span>}
          </div>

          {/* Rating */}
          {product.overallRating > 0 && (
            <div className="flex items-center gap-1.5 mb-3">
              <div className="flex">
                {[1,2,3,4,5].map(s => (
                  <span key={s} className={`text-xs ${s <= Math.round(product.overallRating) ? 'text-gold-medium' : 'text-charcoal-800/20'}`}>★</span>
                ))}
              </div>
              <span className="text-xs text-charcoal-800/50">{product.overallRating.toFixed(1)} ({(product.totalReviews || 0).toLocaleString('en-IN')})</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-end justify-between">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="font-display text-xl text-charcoal-900">₹{lowestPrice?.toLocaleString('en-IN')}</span>
                {product.mrp && product.mrp > lowestPrice && (
                  <span className="text-xs text-charcoal-800/40 line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
                )}
              </div>
              {bestPlatform && (
                <p className="text-[10px] text-charcoal-800/50 mt-0.5">
                  Best on <span style={{ color: PLATFORM_COLORS[bestPlatform.platform] || '#666' }} className="font-semibold">
                    {PLATFORM_NAMES[bestPlatform.platform] || bestPlatform.platform}
                  </span>
                </p>
              )}
            </div>
            {platformCount > 1 && (
              <span className="text-[10px] text-charcoal-800/50 bg-cream-100 px-2 py-1 rounded-full">
                {platformCount} stores
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
