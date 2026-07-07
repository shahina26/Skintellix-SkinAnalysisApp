import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { productsApi, reviewsApi } from '../utils/api';
import { useStore } from '../hooks/useStore';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';

const PLATFORM_META = {
  amazon: { name: 'Amazon', emoji: '🛒', color: '#FF9900', bg: '#FFF8F0', tagline: 'Prime Eligible' },
  flipkart: { name: 'Flipkart', emoji: '🏬', color: '#2874F0', bg: '#F0F4FF', tagline: 'Plus Member Offer' },
  nykaa: { name: 'Nykaa', emoji: '💄', color: '#FC2779', bg: '#FFF0F6', tagline: 'Beauty Expert' },
  myntra: { name: 'Myntra', emoji: '👗', color: '#FF3F6C', bg: '#FFF0F3', tagline: 'Insider Deal' },
  purplle: { name: 'Purplle', emoji: '💜', color: '#A855F7', bg: '#F8F0FF', tagline: 'Beauty Hub' },
  tata_cliq: { name: 'Tata CLiQ', emoji: '🔴', color: '#FF6000', bg: '#FFF4F0', tagline: 'Luxury Retail' },
  meesho: { name: 'Meesho', emoji: '🌸', color: '#F43E5C', bg: '#FFF0F2', tagline: 'Budget Deal' },
  bigbasket: { name: 'BigBasket', emoji: '🧺', color: '#84BD00', bg: '#F4FFF0', tagline: 'Same Day Delivery' },
  blinkit: { name: 'Blinkit', emoji: '⚡', color: '#D4A800', bg: '#FFFDF0', tagline: '10-Min Delivery' },
  ajio: { name: 'AJIO', emoji: '🔶', color: '#EF6C00', bg: '#FFF5F0', tagline: 'Style Pick' },
  caretobeauty: { name: 'Care to Beauty', emoji: '🌷', color: '#FF8A65', bg: '#FFF5F2', tagline: 'Global Beauty Picks' },
  desertcart: { name: 'desertcart', emoji: '🚚', color: '#6C63FF', bg: '#F4F3FF', tagline: 'Worldwide Shopping' },
  zepto: { name: 'Zepto', emoji: '🕒', color: '#7C3AED', bg: '#F6F0FF', tagline: 'Fast Delivery' },
  ubuy: { name: 'UBuy', emoji: '🎁', color: '#009688', bg: '#F0FFFC', tagline: 'International Store' },
  culturecircle: { name: 'Culture Circle', emoji: '🎯', color: '#E63946', bg: '#FFF0F2', tagline: 'Trending Finds' },
  getuscart: { name: 'GetUSCart', emoji: '🌍', color: '#2563EB', bg: '#F0F6FF', tagline: 'Imported Essentials' },
  tira: { name: 'Tira', emoji: '🪞', color: '#D81B60', bg: '#FFF0F7', tagline: 'Beauty Destination' },
  revolve: { name: 'Revolve', emoji: '🕶️', color: '#111827', bg: '#F9FAFB', tagline: 'Luxury Style' },
  medihubpharma: { name: 'Medihub Pharma', emoji: '🩺', color: '#16A34A', bg: '#F0FFF4', tagline: 'Trusted Wellness' },
  plum: { name: 'Plum', emoji: '🍃', color: '#7E22CE', bg: '#F8F0FF', tagline: 'Clean Beauty' },
  escentual: { name: 'Escentual', emoji: '🌸', color: '#F59E0B', bg: '#FFF9F0', tagline: 'Premium Skincare' }
};

function PriceComparisonTable({ platforms }) {
  if (!platforms || platforms.length === 0) return null;
  const sorted = [...platforms].sort((a, b) => a.price - b.price);
  const lowest = sorted[0]?.price;

  return (
    <div className="space-y-3">
      {sorted.map((p, i) => {
        const meta = PLATFORM_META[p.platform] || { name: p.platform, emoji: '🛒', color: '#666', bg: '#f5f5f5' };
        const savings = p.price - lowest;
        return (
          <div key={p.platform}
            className={`rounded-2xl p-4 border-2 transition-all duration-200 ${i === 0 && p.inStock ? 'border-rose-medium shadow-product' : 'border-transparent'}`}
            style={{ backgroundColor: meta.bg }}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{meta.emoji}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-charcoal-900 text-sm">{meta.name}</p>
                    {i === 0 && p.inStock && (
                      <span className="bg-rose-deep text-white text-[9px] px-2 py-0.5 rounded-full font-bold">BEST PRICE</span>
                    )}
                    {!p.inStock && <span className="text-[10px] text-charcoal-800/40 bg-charcoal-800/10 px-2 py-0.5 rounded-full">Out of stock</span>}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] text-charcoal-800/50">
                    {p.deliveryTime && <span>🚚 {p.deliveryTime}</span>}
                    {p.rating && <span>⭐ {p.rating} ({p.reviewCount?.toLocaleString('en-IN')})</span>}
                    {meta.tagline && <span className="text-rose-medium">{meta.tagline}</span>}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1.5 justify-end">
                  <span className="font-display text-xl text-charcoal-900">₹{p.price?.toLocaleString('en-IN')}</span>
                  {p.mrp && p.mrp > p.price && (
                    <span className="text-xs line-through text-charcoal-800/40">₹{p.mrp?.toLocaleString('en-IN')}</span>
                  )}
                </div>
                {p.discount > 0 && <p className="text-xs text-green-600 font-semibold">{p.discount}% OFF</p>}
                {savings > 0 && <p className="text-[10px] text-charcoal-800/40">₹{savings} more than best</p>}
                {p.inStock && (
                  <a href={p.url} target="_blank" rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-full text-white transition-opacity hover:opacity-80"
                    style={{ backgroundColor: meta.color }}>
                    Buy Now →
                  </a>
                )}
              </div>
            </div>

            {/* Savings bar */}
            <div className="mt-3">
              <div className="w-full bg-white/60 rounded-full h-1.5">
                <div className="h-1.5 rounded-full transition-all duration-700"
                  style={{ width: `${Math.max(10, 100 - (savings / lowest) * 50)}%`, backgroundColor: meta.color, opacity: p.inStock ? 1 : 0.3 }} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function ReviewCard({ review }) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm`}
            style={{ background: 'linear-gradient(135deg, #D4737A, #A8404B)' }}>
            {review.user?.avatar || review.user?.name?.[0]}
          </div>
          <div>
            <p className="font-medium text-charcoal-900 text-sm">{review.user?.name}</p>
            <div className="flex items-center gap-2">
              <div className="flex">{[1, 2, 3, 4, 5].map(s => <span key={s} className={`text-xs ${s <= review.rating ? 'text-gold-medium' : 'text-charcoal-800/20'}`}>★</span>)}</div>
              {review.verified && <span className="text-[9px] bg-green-50 text-green-700 px-1.5 py-0.5 rounded-full">✓ Verified</span>}
            </div>
          </div>
        </div>
        <span className="text-xs text-charcoal-800/40">{new Date(review.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
      </div>
      <p className="text-sm text-charcoal-800/70 leading-relaxed">{review.comment}</p>
      <p className="text-xs text-charcoal-800/40 mt-2">👍 {review.helpful} people found this helpful</p>
    </div>
  );
}

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImg, setActiveImg] = useState(0);
  const [activeTab, setActiveTab] = useState('prices');
  const { toggleWishlist, isWishlisted, addToCompare } = useStore();

  useEffect(() => {
    Promise.all([
      productsApi.detail(id),
      reviewsApi.list(id)
    ]).then(([pRes, rRes]) => {
      if (pRes.success) setProduct(pRes.data);
      if (rRes.success) setReviews(rRes.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
      <div className="text-center"><div className="w-12 h-12 rounded-full border-2 border-rose-medium border-t-transparent animate-spin mx-auto mb-4" /><p className="text-charcoal-800/50">Loading product...</p></div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
      <div className="text-center"><p className="text-2xl mb-4">😔</p><h2 className="font-display text-2xl mb-2">Product not found</h2><Link to="/products" className="btn-primary">Browse Products</Link></div>
    </div>
  );

  const wishlisted = isWishlisted(product._id);
  const images = product.images?.length ? product.images : [product.thumbnail];
  const lowestPrice = product.lowestPrice || (product.platforms?.length ? Math.min(...product.platforms.map(p => p.price)) : product.mrp);
  const discount = product.mrp ? Math.round((1 - lowestPrice / product.mrp) * 100) : 0;

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-charcoal-800/50 mb-6">
          <Link to="/" className="hover:text-rose-medium transition-colors">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-rose-medium transition-colors">Products</Link>
          {product.productType && <><span>/</span><Link to={`/products?productType=${product.productType}`} className="hover:text-rose-medium transition-colors capitalize">{product.productType}</Link></>}
          <span>/</span>
          <span className="text-charcoal-900 font-medium truncate max-w-xs">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-10 mb-12">
          {/* Images */}
          <div className="space-y-3">
            <div className="rounded-3xl overflow-hidden bg-gradient-to-br from-rose-blush/30 to-cream-200 aspect-square">
              <img src={images[activeImg]} alt={product.name} className="w-full h-full object-cover" onError={e => { e.target.src = 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600'; }} />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button key={i} onClick={() => setActiveImg(i)}
                    className={`w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 border-2 transition-colors ${activeImg === i ? 'border-rose-medium' : 'border-transparent hover:border-rose-blush'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-semibold text-rose-medium uppercase tracking-widest">{product.brand}</span>
                {product.brandOrigin && <span className="text-[10px] bg-cream-100 text-charcoal-800/50 px-2 py-0.5 rounded-full">{product.brandOrigin}</span>}
              </div>
              <h1 className="font-display text-3xl md:text-4xl text-charcoal-950 leading-tight mb-2">{product.name}</h1>
              {product.size && <p className="text-sm text-charcoal-800/50">Size: {product.size}</p>}
            </div>

            {/* Rating */}
            {product.overallRating > 0 && (
              <div className="flex items-center gap-3">
                <div className="flex">{[1, 2, 3, 4, 5].map(s => <span key={s} className={`text-lg ${s <= Math.round(product.overallRating) ? 'text-gold-medium' : 'text-charcoal-800/20'}`}>★</span>)}</div>
                <span className="font-medium text-charcoal-900">{product.overallRating.toFixed(1)}</span>
                <span className="text-sm text-charcoal-800/50">({product.totalReviews?.toLocaleString('en-IN')} reviews)</span>
                {product.skintellix_score && (
                  <span className="ml-2 badge-gold text-xs">Skintellix Score: {product.skintellix_score}/100</span>
                )}
              </div>
            )}

            {/* Price highlight */}
            <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-blush/50 to-cream-100 border border-rose-soft/30">
              <p className="text-xs text-charcoal-800/50 mb-1">Starting from</p>
              <div className="flex items-baseline gap-3">
                <span className="font-display text-4xl text-charcoal-950">₹{lowestPrice?.toLocaleString('en-IN')}</span>
                {product.mrp && product.mrp > lowestPrice && (
                  <><span className="text-lg text-charcoal-800/40 line-through">₹{product.mrp?.toLocaleString('en-IN')}</span>
                    <span className="text-sm text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">{discount}% OFF</span></>
                )}
              </div>
              <p className="text-xs text-charcoal-800/50 mt-1">Compare across {product.platforms?.length} platforms below ↓</p>
            </div>

            {/* Feature badges */}
            <div className="flex flex-wrap gap-2">
              {product.features?.isVegan && <span className="badge-green text-xs">🌱 Vegan</span>}
              {product.features?.isCrueltyFree && <span className="badge bg-purple-50 text-purple-700 text-xs">🐰 Cruelty-Free</span>}
              {product.features?.isNatural && <span className="badge-green text-xs">🌿 Natural</span>}
              {product.features?.isAyurvedic && <span className="badge-gold text-xs">🕉️ Ayurvedic</span>}
              {product.features?.isParabenFree && <span className="badge bg-blue-50 text-blue-700 text-xs">Paraben-Free</span>}
              {product.features?.isSulphateFree && <span className="badge bg-teal-50 text-teal-700 text-xs">Sulphate-Free</span>}
              {product.features?.isSPF && <span className="badge bg-orange-50 text-orange-700 text-xs">☀️ SPF {product.features.spfValue}</span>}
              {product.features?.isDermatologistTested && <span className="badge bg-indigo-50 text-indigo-700 text-xs">👩‍⚕️ Derm Tested</span>}
              {product.expertRecommended && <span className="badge-gold text-xs">✦ Expert Pick</span>}
            </div>

            {/* Suitable for */}
            {product.suitableFor?.skinType?.length > 0 && (
              <div>
                <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-wider mb-2">Suitable for</p>
                <div className="flex flex-wrap gap-1.5">
                  {product.suitableFor.skinType.map(t => <span key={t} className="badge-rose text-xs capitalize">{t} skin</span>)}
                  {product.suitableFor.skinConcerns?.map(c => <span key={c} className="badge bg-amber-50 text-amber-700 text-xs capitalize">{c.replace('_', ' ')}</span>)}
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex gap-3">
              <button onClick={() => { toggleWishlist(product); toast.success(wishlisted ? 'Removed from wishlist' : 'Added to wishlist ♥'); }}
                className={`flex items-center gap-2 px-5 py-3 rounded-full border-2 text-sm font-medium transition-all duration-200 ${wishlisted ? 'bg-rose-deep text-white border-rose-deep' : 'border-rose-medium text-rose-deep hover:bg-rose-blush'}`}>
                <svg className="w-4 h-4" fill={wishlisted ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                {wishlisted ? 'Wishlisted' : 'Wishlist'}
              </button>
              <button onClick={() => { addToCompare(product); toast.success('Added to compare'); }}
                className="flex items-center gap-2 px-5 py-3 rounded-full border-2 border-gold-medium text-gold-rich text-sm font-medium hover:bg-gold-light transition-all duration-200">
                ⚖️ Compare
              </button>
            </div>
          </div>
        </div>

        {/* Tabbed content */}
        <div className="card overflow-hidden mb-10">
          <div className="flex border-b border-rose-blush overflow-x-auto">
            {[
              { key: 'prices', label: '💰 Price Comparison' },
              { key: 'about', label: '📋 About' },
              { key: 'ingredients', label: '🧪 Ingredients' },
              { key: 'reviews', label: `⭐ Reviews (${reviews.length})` }
            ].map(tab => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`whitespace-nowrap px-5 py-4 text-sm font-medium transition-colors border-b-2 -mb-px ${activeTab === tab.key ? 'border-rose-deep text-rose-deep' : 'border-transparent text-charcoal-800/60 hover:text-charcoal-900'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-6">
            {activeTab === 'prices' && (
              <div>
                <div className="flex items-center justify-between mb-5">
                  <h2 className="font-display text-xl text-charcoal-900">Price Comparison</h2>
                  <p className="text-xs text-charcoal-800/40">Prices updated in real-time · Click to buy</p>
                </div>
                <PriceComparisonTable platforms={product.platforms || []} />
                <div className="mt-5 p-4 bg-cream-100 rounded-xl">
                  <p className="text-xs text-charcoal-800/50">
                    💡 <strong>Skintellix Tip:</strong> Prices fluctuate. Click "Buy Now" to verify the final price on the platform before purchasing. Availability and delivery times may vary.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'about' && (
              <div className="space-y-5">
                <div>
                  <h3 className="font-medium text-charcoal-900 mb-2">Description</h3>
                  <p className="text-sm text-charcoal-800/70 leading-relaxed">{product.description}</p>
                </div>
                {product.benefits?.length > 0 && (
                  <div>
                    <h3 className="font-medium text-charcoal-900 mb-3">Key Benefits</h3>
                    <div className="grid sm:grid-cols-2 gap-2">
                      {product.benefits.map(b => (
                        <div key={b} className="flex items-center gap-2 text-sm text-charcoal-800/70">
                          <span className="w-5 h-5 rounded-full bg-rose-blush flex items-center justify-center text-rose-deep text-[10px]">✓</span>
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {product.howToUse && (
                  <div>
                    <h3 className="font-medium text-charcoal-900 mb-2">How to Use</h3>
                    <p className="text-sm text-charcoal-800/70 leading-relaxed">{product.howToUse}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div>
                <h3 className="font-medium text-charcoal-900 mb-4">Ingredient List</h3>
                {product.ingredientsList?.length > 0 ? (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {product.ingredientsList.map(ing => (
                      <span key={ing} className="text-sm bg-cream-100 border border-rose-blush/30 px-3 py-1.5 rounded-full text-charcoal-800/70 hover:border-rose-medium hover:text-charcoal-900 transition-colors cursor-pointer">
                        {ing}
                      </span>
                    ))}
                  </div>
                ) : <p className="text-sm text-charcoal-800/50">Full ingredient list not available.</p>}
                {product.warnings && (
                  <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                    <p className="text-xs font-semibold text-amber-700 mb-1">⚠️ Warnings</p>
                    <p className="text-sm text-amber-700/80">{product.warnings}</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-4">
                {reviews.length > 0 ? reviews.map(r => <ReviewCard key={r._id} review={r} />) : (
                  <div className="text-center py-10 text-charcoal-800/40">
                    <p className="text-4xl mb-3">💬</p>
                    <p>No reviews yet. Be the first to review this product!</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Related products */}
        {product.related?.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-charcoal-900 mb-6">You May Also Like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {product.related.slice(0, 4).map(p => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
