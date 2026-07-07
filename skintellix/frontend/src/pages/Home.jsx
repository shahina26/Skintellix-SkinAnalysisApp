import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productsApi, blogApi } from '../utils/api';

// ── Hero Section ────────────────────────────────────────────────────
function Hero() {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  useEffect(() => { setTimeout(() => setVisible(true), 100); }, []);

  const SKIN_TONES = [
    { color: '#F5DCBC', label: 'Fair' }, { color: '#E8C090', label: 'Medium' },
    { color: '#C8955A', label: 'Wheatish' }, { color: '#9C6030', label: 'Dusky' }, { color: '#5A3010', label: 'Deep' }
  ];

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-skin-gradient">
      {/* Organic background blobs */}
      <div className="blob-bg w-96 h-96 bg-rose-soft/30 -top-20 -right-20" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
      <div className="blob-bg w-80 h-80 bg-gold-light/40 bottom-20 -left-20" style={{ borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' }} />
      <div className="blob-bg w-64 h-64 bg-rose-blush/50 top-40 left-1/3" style={{ borderRadius: '50% 30% 60% 40% / 40% 60% 40% 60%' }} />

      {/* Floating botanicals */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {['🌸', '✦', '🌿', '✨', '🌺', '◆'].map((el, i) => (
          <span key={i} className="absolute text-rose-medium/20 animate-float" style={{
            top: `${15 + i * 14}%`, left: `${8 + i * 12}%`,
            fontSize: `${16 + (i % 3) * 8}px`, animationDelay: `${i * 0.8}s`, animationDuration: `${5 + i}s`
          }}>{el}</span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div className={`transition-all duration-1000 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-rose-soft/50 text-sm text-rose-deep font-medium mb-6 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-rose-deep animate-pulse" />
              🇮🇳 India's #1 AI Skin Intelligence Platform
            </div>

            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-charcoal-950 leading-[1.05] mb-6">
              Your Skin.<br />
              <span className="gradient-text italic">Understood.</span><br />
              <span className="text-rose-medium">Celebrated.</span>
            </h1>

            <p className="text-lg text-charcoal-800/60 leading-relaxed mb-8 max-w-lg">
              Get your personalised skincare & makeup routine with AI analysis — then compare prices across Amazon, Flipkart, Nykaa & 7 more platforms to find the <strong className="text-charcoal-900">best deal</strong>.
            </p>

            {/* Skin tone selector */}
            <div className="mb-8">
              <p className="text-xs font-medium text-charcoal-800/50 uppercase tracking-widest mb-3">All Indian Skin Tones Covered</p>
              <div className="flex gap-3">
                {SKIN_TONES.map(({ color, label }) => (
                  <div key={label} className="flex flex-col items-center gap-1.5 cursor-pointer group">
                    <div className="w-10 h-10 rounded-full border-2 border-white shadow-sm group-hover:scale-110 transition-transform duration-200"
                      style={{ backgroundColor: color }} />
                    <span className="text-[9px] text-charcoal-800/50 group-hover:text-rose-deep transition-colors">{label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link to="/quiz" className="btn-primary text-base px-7 py-3.5 shadow-product">
                ✦ Start Free Skin Analysis
              </Link>
              <Link to="/products" className="btn-secondary text-base px-7 py-3.5">
                Shop All Products →
              </Link>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-4 mt-8 text-xs text-charcoal-800/50">
              {['🔬 AI-Powered Analysis', '10+ Shopping Platforms', '500+ Products', '₹ Best Price Guarantee'].map(badge => (
                <span key={badge} className="flex items-center gap-1">{badge}</span>
              ))}
            </div>
          </div>

          {/* Right - Hero visual */}
          <div className={`relative transition-all duration-1000 delay-300 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
            <div className="relative">
              {/* Main hero image */}
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] max-h-[600px]">
                <img
                  src="https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80"
                  alt="Beautiful Indian woman with glowing skin"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950/30 via-transparent to-transparent" />
              </div>

              {/* Floating cards */}
              <div className="absolute -left-6 top-16 glass rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-blush flex items-center justify-center text-rose-deep text-xl">🔬</div>
                  <div>
                    <p className="text-xs font-semibold text-charcoal-900">Skin Analysis</p>
                    <p className="text-[10px] text-charcoal-800/50">Combination · Wheatish</p>
                  </div>
                </div>
              </div>

              <div className="absolute -right-6 top-1/3 glass rounded-2xl p-4 shadow-card animate-float" style={{ animationDelay: '1s' }}>
                <p className="text-[10px] text-charcoal-800/50 mb-2">Best Price Found</p>
                <div className="flex items-baseline gap-1">
                  <span className="font-display text-xl text-charcoal-900">₹449</span>
                  <span className="text-[10px] line-through text-charcoal-800/40">₹599</span>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <div className="w-4 h-4 rounded bg-blue-100 flex items-center justify-center">
                    <span className="text-[8px]">🛒</span>
                  </div>
                  <span className="text-[10px] text-blue-600 font-medium">Amazon · 25% OFF</span>
                </div>
              </div>

              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 glass rounded-2xl px-5 py-3 shadow-card">
                <div className="flex items-center gap-3">
                  {['🛒','🏬','💄','🌸'].map((icon, i) => (
                    <div key={i} className="w-8 h-8 rounded-lg bg-white/80 flex items-center justify-center text-sm shadow-sm">{icon}</div>
                  ))}
                  <div>
                    <p className="text-[10px] font-semibold text-charcoal-900">10+ Platforms Compared</p>
                    <p className="text-[9px] text-charcoal-800/50">Real-time prices</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-charcoal-800/30">
        <p className="text-[10px] tracking-widest uppercase">Scroll to explore</p>
        <div className="w-0.5 h-8 bg-gradient-to-b from-rose-medium to-transparent rounded-full animate-pulse" />
      </div>
    </section>
  );
}

// ── How It Works ────────────────────────────────────────────────────
function HowItWorks() {
  const steps = [
    { num: '01', icon: '🔬', title: 'Take the Skin Quiz', desc: 'Answer 5 simple questions about your skin type, tone, and concerns. Takes under 2 minutes.' },
    { num: '02', icon: '✨', title: 'Get Your AI Analysis', desc: 'Our AI matches your profile to the ideal ingredients and builds your personalized routine.' },
    { num: '03', icon: '⚖️', title: 'Compare Prices Live', desc: 'See the same product across Amazon, Flipkart, Nykaa & more — always find the best deal.' },
    { num: '04', icon: '🛍️', title: 'Shop With Confidence', desc: 'Click through to your preferred platform and checkout knowing you paid the right price.' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] text-rose-medium uppercase mb-3">The Skintellix Way</p>
          <h2 className="section-title mb-4">Smart Beauty in 4 Steps</h2>
          <p className="section-subtitle max-w-xl mx-auto">No guesswork. No overpaying. Just your perfect skincare — curated by AI, priced by the market.</p>
        </div>

        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connector line */}
          <div className="hidden md:block absolute top-12 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-rose-blush via-rose-soft to-rose-blush z-0" />

          {steps.map((step, i) => (
            <div key={i} className="relative text-center group">
              <div className="relative inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-rose-blush to-cream-200 items-center justify-center mx-auto mb-6 group-hover:from-rose-soft group-hover:to-rose-blush transition-all duration-300 shadow-sm">
                <span className="text-4xl">{step.icon}</span>
                <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-rose-deep text-white text-xs font-bold flex items-center justify-center font-body">
                  {step.num}
                </span>
              </div>
              <h3 className="font-display text-xl text-charcoal-900 mb-2">{step.title}</h3>
              <p className="text-sm text-charcoal-800/60 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link to="/quiz" className="btn-primary text-base px-8 py-4">Start Your Free Analysis →</Link>
        </div>
      </div>
    </section>
  );
}

// ── Platform Comparison Strip ────────────────────────────────────────
function PlatformStrip() {
  const platforms = [
    { name: 'Amazon', color: '#FF9900', emoji: '🛒' },
    { name: 'Flipkart', color: '#2874F0', emoji: '🏬' },
    { name: 'Nykaa', color: '#FC2779', emoji: '💄' },
    { name: 'Myntra', color: '#FF3F6C', emoji: '👗' },
    { name: 'Purplle', color: '#A855F7', emoji: '💜' },
    { name: 'Tata CLiQ', color: '#FF6000', emoji: '🔴' },
    { name: 'Meesho', color: '#F43E5C', emoji: '🌸' },
    { name: 'BigBasket', color: '#84BD00', emoji: '🧺' },
    { name: 'Blinkit', color: '#F8D90F', emoji: '⚡' },
    { name: 'AJIO', color: '#EF6C00', emoji: '🔶' }
  ];

  return (
    <section className="py-12 bg-cream-100 border-y border-rose-blush/30 overflow-hidden">
      <div className="text-center mb-8">
        <p className="text-xs font-semibold tracking-[0.25em] text-charcoal-800/40 uppercase">Comparing prices across</p>
      </div>
      <div className="flex animate-[scroll_20s_linear_infinite]" style={{ width: 'max-content' }}>
        {[...platforms, ...platforms].map((p, i) => (
          <div key={i} className="flex items-center gap-2.5 mx-8 whitespace-nowrap">
            <span className="text-2xl">{p.emoji}</span>
            <span className="font-semibold text-base" style={{ color: p.color }}>{p.name}</span>
          </div>
        ))}
      </div>
      <style>{`
        @keyframes scroll {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}

// ── Featured Products ─────────────────────────────────────────────────
function FeaturedProducts() {
  const [products, setProducts] = useState({ trending: [], bestsellers: [], expertPicks: [] });
  const [activeTab, setActiveTab] = useState('trending');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productsApi.featured().then(res => {
      if (res.success) setProducts(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const tabs = [
    { key: 'trending', label: '🔥 Trending', products: products.trending },
    { key: 'bestsellers', label: '⭐ Bestsellers', products: products.bestsellers },
    { key: 'expertPicks', label: '👩‍⚕️ Expert Picks', products: products.expertPicks },
    { key: 'budgetPicks', label: '💰 Budget Picks', products: products.budgetPicks },
    { key: 'luxuryPicks', label: '💎 Luxury', products: products.luxuryPicks }
  ];

  return (
    <section className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-rose-medium uppercase mb-2">Curated For You</p>
            <h2 className="section-title">Discover Products</h2>
          </div>
          <Link to="/products" className="btn-secondary text-sm self-start md:self-auto">View All →</Link>
        </div>

        {/* Tab bar */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-8 scrollbar-hide">
          {tabs.map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${activeTab === tab.key ? 'bg-rose-deep text-white shadow-sm' : 'bg-white text-charcoal-800/60 hover:bg-rose-blush hover:text-rose-deep border border-rose-blush'}`}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {Array(8).fill(0).map((_, i) => (
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
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {(tabs.find(t => t.key === activeTab)?.products || []).map(product => (
              <ProductCard key={product._id || product.name} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

// ── Skin Concerns Section ─────────────────────────────────────────────
function SkinConcerns() {
  const navigate = useNavigate();
  const concerns = [
    { key: 'acne', label: 'Acne & Breakouts', icon: '😤', color: 'from-orange-50 to-orange-100', border: 'border-orange-200' },
    { key: 'pigmentation', label: 'Pigmentation', icon: '🎭', color: 'from-rose-50 to-rose-100', border: 'border-rose-200' },
    { key: 'wrinkles', label: 'Anti-Aging', icon: '⏰', color: 'from-purple-50 to-purple-100', border: 'border-purple-200' },
    { key: 'dryness', label: 'Dryness', icon: '💧', color: 'from-blue-50 to-blue-100', border: 'border-blue-200' },
    { key: 'dark_circles', label: 'Dark Circles', icon: '👁️', color: 'from-indigo-50 to-indigo-100', border: 'border-indigo-200' },
    { key: 'sensitivity', label: 'Sensitivity', icon: '🌹', color: 'from-pink-50 to-pink-100', border: 'border-pink-200' },
    { key: 'large_pores', label: 'Large Pores', icon: '🔬', color: 'from-green-50 to-green-100', border: 'border-green-200' },
    { key: 'dullness', label: 'Dullness', icon: '✨', color: 'from-yellow-50 to-amber-100', border: 'border-amber-200' }
  ];

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-rose-medium uppercase mb-3">Targeted Solutions</p>
          <h2 className="section-title mb-4">What's Your Skin Concern?</h2>
          <p className="section-subtitle max-w-lg mx-auto">Browse products specifically chosen to address your biggest skin challenges.</p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {concerns.map(concern => (
            <button key={concern.key}
              onClick={() => navigate(`/products?concern=${concern.key}`)}
              className={`group p-5 rounded-2xl bg-gradient-to-br ${concern.color} border ${concern.border} hover:shadow-card transition-all duration-300 hover:-translate-y-1 text-left`}>
              <span className="text-3xl mb-3 block group-hover:scale-110 transition-transform duration-200">{concern.icon}</span>
              <p className="font-medium text-charcoal-900 text-sm">{concern.label}</p>
              <p className="text-xs text-charcoal-800/50 mt-1">View products →</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Testimonials ─────────────────────────────────────────────────────
function Testimonials() {
  const reviews = [
    { name: 'Priya S.', city: 'Mumbai', avatar: 'P', color: 'bg-rose-medium', rating: 5, text: 'Finally a platform that understands Indian skin! The quiz pinpointed my combination skin perfectly and the price comparison saved me ₹400 on my serum. Love Skintellix! 🇮🇳', product: 'Niacinamide Serum' },
    { name: 'Ananya K.', city: 'Bengaluru', avatar: 'A', color: 'bg-indigo-400', rating: 5, text: 'As someone with dusky skin, I always struggled to find the right foundation shades. The makeup recommendation feature is a game-changer. Ordered from Nykaa and the shade was perfect!', product: 'Foundation Finder' },
    { name: 'Riya M.', city: 'Delhi', avatar: 'R', color: 'bg-emerald-500', rating: 5, text: 'The skin analysis showed I had combination skin with pigmentation concerns. The recommended Vitamin C serum from Plum is working wonders. And I got it cheapest on Flipkart! ✨', product: 'Vitamin C Serum' },
    { name: 'Kavya T.', city: 'Hyderabad', avatar: 'K', color: 'bg-amber-500', rating: 5, text: 'I used to spend hours comparing prices across apps. Skintellix does it all in one place. My skincare budget has literally halved. Cannot recommend enough!', product: 'Price Comparison' },
    { name: 'Deepa N.', city: 'Chennai', avatar: 'D', color: 'bg-purple-500', rating: 5, text: 'The Ayurvedic filter is brilliant. I prefer natural Indian ingredients and the quiz respected that preference. Got a complete routine with Himalaya and Biotique products!', product: 'Ayurvedic Routine' },
    { name: 'Neha R.', city: 'Pune', avatar: 'N', color: 'bg-teal-500', rating: 5, text: 'Showed up right when Nykaa Pink Friday was on. The platform flagged lower prices on Amazon for the same products. Saved me so much money on The Ordinary serums!', product: 'The Ordinary Serums' }
  ];

  return (
    <section className="py-24 bg-gradient-to-br from-charcoal-950 to-charcoal-900 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-semibold tracking-[0.25em] text-rose-medium uppercase mb-3">Real Reviews</p>
          <h2 className="font-display text-4xl md:text-5xl text-white mb-4">Indians Love Skintellix</h2>
          <p className="text-white/50 text-lg">Join thousands who've discovered smarter beauty shopping</p>
          <div className="flex items-center justify-center gap-4 mt-4">
            <div className="flex">{'★★★★★'.split('').map((s, i) => <span key={i} className="text-gold-medium text-xl">{s}</span>)}</div>
            <span className="text-white/50 text-sm">4.9/5 from 12,000+ users</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {reviews.map((r, i) => (
            <div key={i} className="glass rounded-2xl p-6 bg-white/5 border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-10 h-10 rounded-full ${r.color} flex items-center justify-center text-white font-bold text-sm`}>{r.avatar}</div>
                <div>
                  <p className="font-medium text-white text-sm">{r.name}</p>
                  <p className="text-white/40 text-xs">{r.city}</p>
                </div>
                <div className="ml-auto flex">{'★★★★★'.split('').map((s, j) => <span key={j} className="text-gold-medium text-xs">{s}</span>)}</div>
              </div>
              <p className="text-white/70 text-sm leading-relaxed mb-3">"{r.text}"</p>
              <span className="text-[10px] text-rose-medium/70 bg-rose-deep/10 px-2 py-1 rounded-full">{r.product}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Blog Preview ────────────────────────────────────────────────────
function BlogPreview() {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    blogApi.list({ limit: 3 }).then(res => { if (res.success) setPosts(res.data); }).catch(console.error);
  }, []);

  return (
    <section className="py-24 bg-cream-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-semibold tracking-[0.25em] text-rose-medium uppercase mb-2">Skin Education</p>
            <h2 className="section-title">From the Beauty Lab</h2>
          </div>
          <Link to="/blog" className="btn-secondary text-sm hidden md:inline-flex">All Articles →</Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {posts.map(post => (
            <Link key={post._id} to={`/blog/${post.slug}`} className="group card-hover overflow-hidden">
              <div className="aspect-video overflow-hidden">
                <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              </div>
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <span className="badge-rose text-[10px]">{post.category}</span>
                  <span className="text-[10px] text-charcoal-800/40">{post.readTime} read</span>
                </div>
                <h3 className="font-display text-lg text-charcoal-900 leading-snug mb-2 group-hover:text-rose-deep transition-colors line-clamp-2">{post.title}</h3>
                <p className="text-sm text-charcoal-800/60 line-clamp-2">{post.excerpt}</p>
                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-rose-blush/30">
                  <div className="w-6 h-6 rounded-full bg-rose-medium flex items-center justify-center text-white text-[10px] font-bold">
                    {post.author?.[0]}
                  </div>
                  <span className="text-xs text-charcoal-800/50">{post.author}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA Section ─────────────────────────────────────────────────────
function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-rose-deep via-rose-dark to-charcoal-950 relative overflow-hidden">
      <div className="blob-bg w-96 h-96 bg-gold-medium/20 -top-20 -right-20" />
      <div className="blob-bg w-64 h-64 bg-rose-medium/30 bottom-10 left-10" />
      <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
        <span className="text-5xl mb-6 block animate-float">✦</span>
        <h2 className="font-display text-4xl md:text-6xl text-white mb-4">
          Your Perfect Skin<br /><em>Awaits</em>
        </h2>
        <p className="text-white/60 text-lg mb-8 max-w-lg mx-auto">
          Take the 2-minute quiz and discover your personalized skincare routine — with the best prices guaranteed.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link to="/quiz" className="bg-white text-rose-deep font-semibold px-8 py-4 rounded-full hover:bg-cream-100 transition-colors shadow-lg text-base">
            ✦ Start Free Skin Analysis
          </Link>
          <Link to="/products" className="border border-white/30 text-white font-medium px-8 py-4 rounded-full hover:bg-white/10 transition-colors text-base">
            Browse Products
          </Link>
        </div>
        <p className="text-white/30 text-xs mt-6">Free forever · No account required to start</p>
      </div>
    </section>
  );
}

// ── Main Home ────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div>
      <Hero />
      <HowItWorks />
      <PlatformStrip />
      <FeaturedProducts />
      <SkinConcerns />
      <Testimonials />
      <BlogPreview />
      <CTA />
    </div>
  );
}
