// ── Compare.jsx ───────────────────────────────────────────────────
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import { compareApi } from '../utils/api';
import toast from 'react-hot-toast';

export function Compare() {
  const { compareList, removeFromCompare, clearCompare } = useStore();
  const [comparing, setComparing] = useState(false);
  const [data, setData] = useState([]);

  const fetchComparison = async () => {
    if (compareList.length < 2) { toast.error('Add at least 2 products to compare'); return; }
    setComparing(true);
    try {
      const res = await compareApi.compare(compareList.map(p => p._id));
      if (res.success) setData(res.data);
    } catch { toast.error('Comparison failed'); } finally { setComparing(false); }
  };

  const FEATURES = [
    ['Brand', p => p.brand],
    ['Category', p => p.category?.replace(/_/g,' ')],
    ['Lowest Price', p => `₹${(p.lowestPrice||0).toLocaleString('en-IN')}`],
    ['Rating', p => `${p.overallRating||'–'}/5`],
    ['Skintellix Score', p => `${p.skintellix_score||'–'}/100`],
    ['Platforms', p => `${p.platforms?.filter(pl=>pl.inStock).length||0} stores`],
    ['Vegan', p => p.features?.isVegan ? '✅' : '❌'],
    ['Cruelty-Free', p => p.features?.isCrueltyFree ? '✅' : '❌'],
    ['Natural', p => p.features?.isNatural ? '✅' : '❌'],
    ['Has SPF', p => p.features?.isSPF ? `✅ SPF ${p.features.spfValue||''}` : '❌'],
    ['Paraben-Free', p => p.features?.isParabenFree ? '✅' : '❌']
  ];

  const products = data.length ? data : compareList;

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-4xl text-charcoal-950">Product Comparison</h1>
            <p className="text-charcoal-800/60 mt-1">Compare up to 4 products side by side</p>
          </div>
          <div className="flex gap-3">
            {compareList.length >= 2 && (
              <button onClick={fetchComparison} className="btn-primary">
                {comparing ? '⏳ Comparing...' : '⚖️ Compare Now'}
              </button>
            )}
            {compareList.length > 0 && (
              <button onClick={clearCompare} className="btn-secondary text-sm">Clear All</button>
            )}
          </div>
        </div>

        {compareList.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-7xl mb-5">⚖️</div>
            <h2 className="font-display text-3xl text-charcoal-900 mb-3">Nothing to Compare Yet</h2>
            <p className="text-charcoal-800/60 mb-8">Browse products and click "+ Compare" to add up to 4 items</p>
            <Link to="/products" className="btn-primary">Browse Products</Link>
          </div>
        ) : (
          <>
            {/* Product cards row */}
            <div className={`grid gap-5 mb-8 ${compareList.length === 1 ? 'grid-cols-1 max-w-sm' : compareList.length === 2 ? 'grid-cols-2' : compareList.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
              {products.slice(0, 4).map(p => (
                <div key={p._id} className="card p-4 relative group">
                  <button onClick={(e) => { e.preventDefault(); removeFromCompare(p._id); }} className="absolute top-4 right-4 z-10 w-6 h-6 rounded-full bg-white shadow-sm text-charcoal-800/50 hover:bg-rose-deep hover:text-white transition-colors text-xs flex items-center justify-center">✕</button>
                  <Link to={`/products/${p._id}`} className="block">
                    <img src={p.thumbnail||p.images?.[0]} alt={p.name} className="w-full aspect-square object-cover rounded-xl mb-3 group-hover:opacity-80 transition-opacity" onError={e => e.target.src='https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'} />
                    <p className="text-[10px] text-rose-medium font-semibold uppercase tracking-widest">{p.brand}</p>
                    <h3 className="font-medium text-charcoal-900 text-sm mt-0.5 line-clamp-2 group-hover:text-rose-deep transition-colors">{p.name}</h3>
                    <p className="font-display text-xl text-charcoal-900 mt-2">₹{(p.lowestPrice||0).toLocaleString('en-IN')}</p>
                  </Link>
                </div>
              ))}
              {compareList.length < 4 && (
                <Link to="/products" className="card flex flex-col items-center justify-center p-6 border-2 border-dashed border-rose-soft/50 hover:border-rose-medium transition-colors text-center min-h-48">
                  <span className="text-3xl mb-2">+</span>
                  <p className="text-sm text-charcoal-800/50">Add product to compare</p>
                </Link>
              )}
            </div>

            {/* Comparison table */}
            {data.length >= 2 && (
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <tbody>
                    {FEATURES.map(([label, getter]) => (
                      <tr key={label} className="border-b border-rose-blush/30 last:border-0">
                        <td className="px-5 py-3 text-xs font-semibold text-charcoal-800/50 uppercase tracking-wider w-40 bg-cream-50">{label}</td>
                        {data.slice(0,4).map(p => (
                          <td key={p._id} className="px-5 py-3 text-charcoal-900">{getter(p)}</td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="px-5 py-3 text-xs font-semibold text-charcoal-800/50 uppercase tracking-wider bg-cream-50">Best Deal</td>
                      {data.slice(0,4).map(p => {
                        const best = p.platforms?.filter(pl=>pl.inStock).sort((a,b)=>a.price-b.price)[0];
                        return (
                          <td key={p._id} className="px-5 py-3">
                            {best ? <a href={best.url} target="_blank" rel="noopener noreferrer" className="btn-primary text-xs px-4 py-2">Buy on {best.platform} →</a> : '–'}
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ── Blog.jsx ──────────────────────────────────────────────────────
import { blogApi } from '../utils/api';
import { useEffect } from 'react';

export function Blog() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('');

  useEffect(() => {
    setLoading(true);
    blogApi.list({ category, limit: 12 }).then(res => { if (res.success) setPosts(res.data); }).catch(console.error).finally(() => setLoading(false));
  }, [category]);

  const cats = ['', 'skincare', 'makeup', 'ingredients', 'shopping'];

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-white border-b border-rose-blush/30 py-10">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-950 mb-3">The Skintellix Beauty Lab</h1>
          <p className="text-charcoal-800/60">Expert skincare advice, ingredient breakdowns, and beauty tips for Indian skin</p>
          <div className="flex gap-2 justify-center mt-6 flex-wrap">
            {cats.map(c => (
              <button key={c} onClick={() => setCategory(c)}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-all ${category === c ? 'bg-rose-deep text-white' : 'bg-white border border-rose-blush text-charcoal-800/60 hover:bg-rose-blush'}`}>
                {c || 'All'}
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-6">{Array(6).fill(0).map((_,i)=><div key={i} className="rounded-2xl overflow-hidden"><div className="skeleton aspect-video"/><div className="p-5 space-y-2"><div className="skeleton h-3 w-1/3 rounded"/><div className="skeleton h-5 rounded"/><div className="skeleton h-4 w-3/4 rounded"/></div></div>)}</div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map(post => (
              <Link key={post._id} to={`/blog/${post.slug}`} className="group card-hover overflow-hidden">
                <div className="aspect-video overflow-hidden">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="badge-rose text-[10px] capitalize">{post.category}</span>
                    <span className="text-[10px] text-charcoal-800/40">{post.readTime} read</span>
                  </div>
                  <h2 className="font-display text-lg text-charcoal-900 mb-2 group-hover:text-rose-deep transition-colors line-clamp-2">{post.title}</h2>
                  <p className="text-sm text-charcoal-800/60 line-clamp-2">{post.excerpt}</p>
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-rose-blush/30">
                    <div className="w-6 h-6 rounded-full bg-rose-medium flex items-center justify-center text-white text-[10px] font-bold">{post.author?.[0]}</div>
                    <span className="text-xs text-charcoal-800/50">{post.author}</span>
                    <span className="ml-auto text-xs text-charcoal-800/40">{new Date(post.date).toLocaleDateString('en-IN', { day:'numeric', month:'short' })}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Login.jsx ─────────────────────────────────────────────────────
import { authApi } from '../utils/api';
import { useNavigate } from 'react-router-dom';

export function Login() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.login(form);
      if (res.success) { setUser(res.data.user, res.data.token); toast.success(`Welcome back, ${res.data.user.name}!`); navigate('/dashboard'); }
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-skin-gradient pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white text-2xl">✦</span>
          </div>
          <h1 className="font-display text-3xl text-charcoal-950">Welcome Back</h1>
          <p className="text-charcoal-800/60 mt-1 text-sm">Sign in to your Skintellix account</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-charcoal-800/60 uppercase tracking-wider block mb-1.5">Email</label>
              <input type="email" required value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))} placeholder="you@example.com" className="input-field" />
            </div>
            <div>
              <label className="text-xs font-medium text-charcoal-800/60 uppercase tracking-wider block mb-1.5">Password</label>
              <input type="password" required value={form.password} onChange={e=>setForm(f=>({...f,password:e.target.value}))} placeholder="••••••••" className="input-field" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2">
              {loading ? '⏳ Signing in...' : 'Sign In →'}
            </button>
          </form>
          <p className="text-center text-sm text-charcoal-800/60 mt-5">
            New to Skintellix? <Link to="/register" className="text-rose-deep font-medium hover:underline">Create account</Link>
          </p>
          <div className="mt-4 p-3 bg-cream-100 rounded-xl text-xs text-charcoal-800/50 text-center">
            💡 Demo: register first or use the quiz without an account
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Register.jsx ──────────────────────────────────────────────────
export function Register() {
  const navigate = useNavigate();
  const { setUser } = useStore();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', gender: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authApi.register(form);
      if (res.success) { setUser(res.data.user, res.data.token); toast.success(`Welcome to Skintellix, ${res.data.user.name}!`); navigate('/quiz'); }
    } catch (err) { toast.error(err.message); } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-skin-gradient pt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center mx-auto mb-4 shadow-glow">
            <span className="text-white text-2xl">✦</span>
          </div>
          <h1 className="font-display text-3xl text-charcoal-950">Join Skintellix</h1>
          <p className="text-charcoal-800/60 mt-1 text-sm">Create your free account and start your skin journey</p>
        </div>
        <div className="card p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {[['name','Full Name','text','Priya Sharma'],['email','Email','email','you@example.com'],['password','Password','password','Min 6 characters'],['phone','Phone (optional)','tel','+91 98765 43210']].map(([key,label,type,ph])=>(
              <div key={key}>
                <label className="text-xs font-medium text-charcoal-800/60 uppercase tracking-wider block mb-1.5">{label}</label>
                <input type={type} value={form[key]} onChange={e=>setForm(f=>({...f,[key]:e.target.value}))} placeholder={ph} required={key!=='phone'} className="input-field" />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium text-charcoal-800/60 uppercase tracking-wider block mb-1.5">Gender (optional)</label>
              <select value={form.gender} onChange={e=>setForm(f=>({...f,gender:e.target.value}))} className="input-field">
                <option value="">Prefer not to say</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full justify-center py-3.5 mt-2">
              {loading ? '⏳ Creating account...' : '✦ Create Account'}
            </button>
          </form>
          <p className="text-center text-sm text-charcoal-800/60 mt-5">
            Already have an account? <Link to="/login" className="text-rose-deep font-medium hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

// ── Dashboard.jsx ─────────────────────────────────────────────────
export function Dashboard() {
  const { user, wishlist, skinAnalysis, logout } = useStore();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="min-h-screen bg-cream-50 pt-20 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">🔐</div>
          <h2 className="font-display text-2xl mb-2">Sign in to access your dashboard</h2>
          <div className="flex gap-3 justify-center mt-5">
            <Link to="/login" className="btn-primary">Sign In</Link>
            <Link to="/register" className="btn-secondary">Create Account</Link>
          </div>
          <p className="text-sm text-charcoal-800/50 mt-4">Or <Link to="/quiz" className="text-rose-medium hover:underline">try the quiz</Link> without an account</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="max-w-5xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center text-white text-2xl font-bold shadow-glow">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <h1 className="font-display text-3xl text-charcoal-950">Hello, {user.name?.split(' ')[0]}! ✦</h1>
              <p className="text-charcoal-800/50 text-sm">{user.email}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/'); toast.success('Signed out'); }} className="btn-secondary text-sm">Sign Out</button>
        </div>

        {/* Quick actions */}
        <div className="grid sm:grid-cols-3 gap-5 mb-10">
          {[
            { icon: '🔬', title: 'Take Skin Quiz', desc: skinAnalysis ? 'Retake your analysis' : 'Discover your skin type', link: '/quiz', cta: skinAnalysis ? 'Retake Quiz' : 'Start Quiz' },
            { icon: '💄', title: 'Makeup Finder', desc: 'Find your perfect shades', link: '/makeup', cta: 'Open Finder' },
            { icon: '⚖️', title: 'Price Compare', desc: 'Find the best deals', link: '/compare', cta: 'Compare Now' }
          ].map(a => (
            <Link key={a.link} to={a.link} className="card-hover p-6">
              <span className="text-3xl mb-3 block">{a.icon}</span>
              <h3 className="font-display text-xl text-charcoal-900 mb-1">{a.title}</h3>
              <p className="text-sm text-charcoal-800/60 mb-4">{a.desc}</p>
              <span className="btn-primary text-xs px-4 py-2 inline-flex">{a.cta} →</span>
            </Link>
          ))}
        </div>

        {/* Skin profile */}
        {skinAnalysis?.analysis && (
          <div className="card p-6 mb-8">
            <h2 className="font-display text-2xl text-charcoal-900 mb-4">Your Skin Profile</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-cream-100 text-center">
                <p className="text-xs text-charcoal-800/50 mb-1">Skin Type</p>
                <p className="font-display text-xl text-charcoal-900 capitalize">{skinAnalysis.analysis.skinType}</p>
              </div>
              <div className="p-4 rounded-xl bg-cream-100 text-center">
                <p className="text-xs text-charcoal-800/50 mb-1">Skin Tone</p>
                <p className="font-display text-xl text-charcoal-900 capitalize">{skinAnalysis.analysis.skinTone}</p>
              </div>
              <div className="p-4 rounded-xl bg-cream-100 text-center">
                <p className="text-xs text-charcoal-800/50 mb-1">Skin Score</p>
                <p className="font-display text-xl text-charcoal-900">{skinAnalysis.analysis.skinScore}/100</p>
              </div>
            </div>
            <Link to="/quiz/results" className="btn-secondary text-sm mt-4 inline-flex">View Full Analysis →</Link>
          </div>
        )}

        {/* Wishlist */}
        {wishlist.length > 0 && (
          <div>
            <h2 className="font-display text-2xl text-charcoal-900 mb-5" id="wishlist">Your Wishlist ({wishlist.length})</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
              {wishlist.slice(0, 8).map(p => (
                <Link key={p._id} to={`/products/${p._id}`} className="card-hover overflow-hidden">
                  <div className="aspect-square bg-cream-100 overflow-hidden">
                    <img src={p.thumbnail||p.images?.[0]} alt={p.name} className="w-full h-full object-cover" onError={e=>e.target.src='https://images.unsplash.com/photo-1556228720-195a672e8a03?w=300'} />
                  </div>
                  <div className="p-3">
                    <p className="text-[10px] text-rose-medium font-semibold uppercase">{p.brand}</p>
                    <p className="text-sm font-medium text-charcoal-900 line-clamp-1">{p.name}</p>
                    <p className="font-display text-base text-charcoal-900 mt-1">₹{(p.lowestPrice||0).toLocaleString('en-IN')}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── About.jsx ─────────────────────────────────────────────────────
export function About() {
  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      <div className="bg-gradient-to-br from-rose-blush to-cream-100 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center mx-auto mb-6 shadow-glow">
            <span className="text-white text-3xl">✦</span>
          </div>
          <h1 className="font-display text-5xl text-charcoal-950 mb-4">About Skintellix</h1>
          <p className="text-charcoal-800/60 text-xl max-w-2xl mx-auto">We believe every Indian deserves skincare that truly understands their skin — without overpaying for it.</p>
        </div>
      </div>
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-12">
        <div className="card p-8">
          <h2 className="font-display text-3xl text-charcoal-950 mb-4">Our Mission</h2>
          <p className="text-charcoal-800/70 text-lg leading-relaxed">
            Skintellix was born from a simple frustration: Indian shoppers were spending hours comparing prices across multiple apps and websites, while also struggling to find products that actually worked for their unique skin tones and types. We solved both problems in one place.
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: '🔬', title: 'AI-Powered Analysis', desc: 'Our AI analyses your skin type, tone, and concerns to recommend products that actually work for you.' },
            { icon: '💰', title: 'Price Transparency', desc: 'Real-time prices from Amazon, Flipkart, Nykaa, and 7 more platforms — always find the best deal.' },
            { icon: '🇮🇳', title: 'Built for India', desc: 'From wheatish to dusky to deep — we celebrate every Indian skin tone and understand the unique challenges of Indian skin.' }
          ].map(item => (
            <div key={item.title} className="card p-6 text-center">
              <span className="text-4xl mb-4 block">{item.icon}</span>
              <h3 className="font-display text-xl text-charcoal-900 mb-2">{item.title}</h3>
              <p className="text-sm text-charcoal-800/60 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="text-center">
          <Link to="/quiz" className="btn-primary text-base px-8 py-4">Start Your Free Skin Analysis →</Link>
        </div>
      </div>
    </div>
  );
}
