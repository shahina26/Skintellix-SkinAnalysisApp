import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { makeupApi, productsApi } from '../utils/api';
import ProductCard from '../components/ProductCard';

const SKIN_TONES = [
  { value: 'fair',     label: 'Fair',      color: '#F5DCBC', desc: 'Light, pink/neutral undertones' },
  { value: 'medium',   label: 'Medium',    color: '#E8C090', desc: 'Neutral undertones' },
  { value: 'wheatish', label: 'Wheatish',  color: '#C8955A', desc: 'Golden/warm undertones' },
  { value: 'dusky',    label: 'Dusky',     color: '#9C6030', desc: 'Deep warm undertones' },
  { value: 'dark',     label: 'Deep',      color: '#5A3010', desc: 'Rich, deep complexion' }
];

const LOOKS = [
  { id: 'everyday',    label: 'Everyday Natural', emoji: '☀️',  desc: '15 min', tips: 'Tinted moisturizer, mascara & tinted lip balm' },
  { id: 'office',      label: 'Office Polished',  emoji: '💼',  desc: '20 min', tips: 'Light coverage foundation, defined brows, nude lip' },
  { id: 'festive',     label: 'Festive Glam',     emoji: '✨',  desc: '45 min', tips: 'Full coverage, bold eye, statement lip' },
  { id: 'wedding',     label: 'Bridal Radiance',  emoji: '💍',  desc: '60 min', tips: 'HD foundation, contour, 24hr setting spray' },
  { id: 'night',       label: 'Night Out',        emoji: '🌙',  desc: '30 min', tips: 'Smoky eye, dewy skin, berry or red lip' },
  { id: 'no_makeup',   label: 'No-Makeup Makeup', emoji: '🌸',  desc: '10 min', tips: 'Skin tint, cream blush, clear gloss' }
];

const MAKEUP_CATEGORIES = [
  { key: 'foundation', label: 'Foundation', emoji: '💁‍♀️' },
  { key: 'concealer',  label: 'Concealer',  emoji: '✨' },
  { key: 'blush',      label: 'Blush',      emoji: '🌸' },
  { key: 'highlighter',label: 'Highlighter',emoji: '💫' },
  { key: 'eyeshadow',  label: 'Eyeshadow',  emoji: '👁️' },
  { key: 'mascara',    label: 'Mascara',    emoji: '👀' },
  { key: 'eyeliner',   label: 'Eyeliner',   emoji: '✏️' },
  { key: 'lipstick',   label: 'Lipstick',   emoji: '💄' },
  { key: 'lip_gloss',  label: 'Lip Gloss',  emoji: '💋' },
  { key: 'primer',     label: 'Primer',     emoji: '🧴' }
];

function ShadeGuideCard({ guide, tone }) {
  if (!guide) return null;
  return (
    <div className="space-y-4">
      {Object.entries(guide).map(([category, shades]) => (
        <div key={category} className="card p-4">
          <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-3 capitalize">{category}</p>
          <div className="flex flex-wrap gap-2">
            {shades.map(shade => (
              <span key={shade} className="text-xs bg-cream-100 px-3 py-1.5 rounded-full text-charcoal-800/70 border border-rose-blush/30 hover:border-rose-medium transition-colors cursor-pointer">
                {shade}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Makeup() {
  const [selectedTone, setSelectedTone] = useState('wheatish');
  const [selectedLook, setSelectedLook] = useState('everyday');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [shadeGuide, setShadeGuide] = useState(null);
  const [products, setProducts] = useState([]);
  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState('finder');

  useEffect(() => {
    makeupApi.shadeGuide(selectedTone).then(res => {
      if (res.success) setShadeGuide(res.data.shadeGuide);
    }).catch(console.error);
  }, [selectedTone]);

  useEffect(() => {
    setLoading(true);
    const params = { productType: 'makeup', limit: 12, sort: 'popularity' };
    if (selectedCategory) params.category = selectedCategory;
    productsApi.list(params).then(res => {
      if (res.success) setProducts(res.data);
    }).catch(console.error).finally(() => setLoading(false));
  }, [selectedCategory]);

  useEffect(() => {
    makeupApi.tutorials().then(res => { if (res.success) setTutorials(res.data); }).catch(console.error);
  }, []);

  return (
    <div className="min-h-screen bg-cream-50 pt-20">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-rose-blush via-cream-50 to-gold-light py-20 overflow-hidden">
        <div className="blob-bg w-80 h-80 bg-rose-soft/30 -top-20 right-0" style={{ borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' }} />
        <div className="max-w-6xl mx-auto px-4 text-center relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-rose-soft/50 text-sm text-rose-deep font-medium mb-5">
            💄 Makeup Recommendations
          </span>
          <h1 className="font-display text-5xl md:text-6xl text-charcoal-950 mb-4">
            Beauty That <em className="gradient-text">Celebrates</em><br />Indian Skin
          </h1>
          <p className="text-charcoal-800/60 text-lg max-w-2xl mx-auto mb-8">
            Find your perfect shade match across all skin tones. From fair to deep — every Indian complexion is beautiful and deserves the right products.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button onClick={() => setActiveSection('finder')} className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${activeSection === 'finder' ? 'bg-rose-deep text-white shadow-product' : 'bg-white text-charcoal-800 border border-rose-blush hover:bg-rose-blush'}`}>
              🎨 Shade Finder
            </button>
            <button onClick={() => setActiveSection('shop')} className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${activeSection === 'shop' ? 'bg-rose-deep text-white shadow-product' : 'bg-white text-charcoal-800 border border-rose-blush hover:bg-rose-blush'}`}>
              💄 Shop Makeup
            </button>
            <button onClick={() => setActiveSection('looks')} className={`px-6 py-3 rounded-full font-medium text-sm transition-all ${activeSection === 'looks' ? 'bg-rose-deep text-white shadow-product' : 'bg-white text-charcoal-800 border border-rose-blush hover:bg-rose-blush'}`}>
              ✨ Makeup Looks
            </button>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* SHADE FINDER */}
        {activeSection === 'finder' && (
          <div className="space-y-10">
            <div>
              <h2 className="font-display text-3xl text-charcoal-950 mb-2">Your Shade Finder</h2>
              <p className="text-charcoal-800/60">Select your skin tone to discover the most flattering shades across all makeup categories.</p>
            </div>

            {/* Tone selector */}
            <div className="card p-6">
              <p className="text-xs font-semibold text-charcoal-800/50 uppercase tracking-widest mb-5">Select Your Skin Tone</p>
              <div className="grid grid-cols-5 gap-4">
                {SKIN_TONES.map(tone => (
                  <button key={tone.value} onClick={() => setSelectedTone(tone.value)}
                    className={`flex flex-col items-center gap-3 p-4 rounded-2xl border-2 transition-all duration-200 ${selectedTone === tone.value ? 'border-rose-deep shadow-product scale-105' : 'border-transparent hover:border-rose-blush bg-white'}`}>
                    <div className="w-14 h-14 rounded-full border-4 border-white shadow-md"
                      style={{ backgroundColor: tone.color }} />
                    <div className="text-center">
                      <p className="font-medium text-sm text-charcoal-900">{tone.label}</p>
                      <p className="text-[10px] text-charcoal-800/50 leading-tight mt-0.5">{tone.desc}</p>
                    </div>
                    {selectedTone === tone.value && (
                      <span className="text-[10px] text-rose-deep font-semibold bg-rose-blush px-2 py-0.5 rounded-full">Selected ✓</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Shade guide results */}
            {shadeGuide && (
              <div>
                <h3 className="font-display text-2xl text-charcoal-900 mb-5">
                  Recommended Shades for <span className="gradient-text capitalize">{selectedTone}</span> Skin
                </h3>
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <h4 className="font-medium text-charcoal-900 mb-3">Foundation Shades</h4>
                    <div className="flex flex-wrap gap-2">
                      {(shadeGuide.foundation || []).map(s => (
                        <span key={s} className="text-sm bg-white border border-rose-blush px-3 py-1.5 rounded-full text-charcoal-800/70 hover:border-rose-medium hover:text-charcoal-900 transition-colors cursor-pointer">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-charcoal-900 mb-3">Lip Colours</h4>
                    <div className="flex flex-wrap gap-2">
                      {(shadeGuide.lipstick || []).map(s => (
                        <span key={s} className="text-sm bg-white border border-rose-blush px-3 py-1.5 rounded-full text-charcoal-800/70 hover:border-rose-medium hover:text-charcoal-900 transition-colors cursor-pointer">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-charcoal-900 mb-3">Blush Tones</h4>
                    <div className="flex flex-wrap gap-2">
                      {(shadeGuide.blush || []).map(s => (
                        <span key={s} className="text-sm bg-white border border-rose-blush px-3 py-1.5 rounded-full text-charcoal-800/70 hover:border-rose-medium hover:text-charcoal-900 transition-colors cursor-pointer">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick tip */}
            <div className="bg-gradient-to-br from-rose-blush to-cream-100 rounded-2xl p-6">
              <p className="font-display text-xl text-charcoal-950 mb-2">Pro Tip for Indian Skin 🇮🇳</p>
              <p className="text-charcoal-800/70 text-sm leading-relaxed">
                Most Indian skin tones have warm or golden undertones. Look for foundations with shades labeled "Warm," "Golden," "Honey," or "Beige." Avoid shades with "Pink" or "Rose" as they can look ashy on darker Indian complexions. Always test on your jawline — not your wrist!
              </p>
            </div>
          </div>
        )}

        {/* SHOP MAKEUP */}
        {activeSection === 'shop' && (
          <div>
            <div className="flex items-end justify-between mb-6">
              <div>
                <h2 className="font-display text-3xl text-charcoal-950">Shop Makeup</h2>
                <p className="text-charcoal-800/60 mt-1">With real-time price comparison across all platforms</p>
              </div>
              <Link to="/products?productType=makeup" className="btn-secondary text-sm">View All →</Link>
            </div>

            {/* Category tabs */}
            <div className="flex gap-2 overflow-x-auto pb-3 mb-8">
              <button onClick={() => setSelectedCategory('')}
                className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-all border ${selectedCategory === '' ? 'bg-rose-deep text-white border-rose-deep' : 'border-rose-blush bg-white text-charcoal-800/60 hover:bg-rose-blush'}`}>
                All Makeup
              </button>
              {MAKEUP_CATEGORIES.map(cat => (
                <button key={cat.key} onClick={() => setSelectedCategory(cat.key)}
                  className={`whitespace-nowrap px-4 py-2.5 rounded-full text-sm font-medium transition-all border flex items-center gap-1.5 ${selectedCategory === cat.key ? 'bg-rose-deep text-white border-rose-deep' : 'border-rose-blush bg-white text-charcoal-800/60 hover:bg-rose-blush'}`}>
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {Array(8).fill(0).map((_, i) => <div key={i}><div className="skeleton aspect-square rounded-2xl" /><div className="p-4 space-y-2"><div className="skeleton h-3 rounded w-1/2" /><div className="skeleton h-4 rounded" /></div></div>)}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
                {products.map(p => <ProductCard key={p._id} product={p} />)}
              </div>
            )}
          </div>
        )}

        {/* MAKEUP LOOKS */}
        {activeSection === 'looks' && (
          <div>
            <div className="mb-8">
              <h2 className="font-display text-3xl text-charcoal-950 mb-2">Makeup Looks</h2>
              <p className="text-charcoal-800/60">Step-by-step guides for every occasion — with product recommendations for each step.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 mb-10">
              {LOOKS.map(look => (
                <div key={look.id} className={`card-hover p-6 cursor-pointer ${selectedLook === look.id ? 'ring-2 ring-rose-medium' : ''}`}
                  onClick={() => setSelectedLook(look.id)}>
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-4xl">{look.emoji}</span>
                    <span className="badge-rose text-[10px]">⏱ {look.desc}</span>
                  </div>
                  <h3 className="font-display text-xl text-charcoal-900 mb-1">{look.label}</h3>
                  <p className="text-sm text-charcoal-800/60">{look.tips}</p>
                </div>
              ))}
            </div>

            {/* Tutorials */}
            {tutorials.length > 0 && (
              <div>
                <h3 className="font-display text-2xl text-charcoal-950 mb-5">Video Tutorials</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
                  {tutorials.map(t => (
                    <div key={t.id} className="card-hover overflow-hidden group cursor-pointer" onClick={() => window.open(t.videoUrl || `https://www.youtube.com/results?search_query=${encodeURIComponent(t.title)}`, '_blank')}>
                      <div className="relative aspect-video overflow-hidden">
                        <img src={t.thumbnail} alt={t.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-charcoal-950/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center">
                            <span className="text-rose-deep text-xl">▶</span>
                          </div>
                        </div>
                        <span className="absolute bottom-2 right-2 bg-black/60 text-white text-[10px] px-2 py-0.5 rounded">{t.duration}</span>
                      </div>
                      <div className="p-4">
                        <span className="badge-rose text-[10px] mb-2 inline-block">{t.category}</span>
                        <h4 className="font-medium text-charcoal-900 text-sm line-clamp-2">{t.title}</h4>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
