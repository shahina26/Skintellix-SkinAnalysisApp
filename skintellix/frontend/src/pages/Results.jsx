import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../hooks/useStore';
import ProductCard from '../components/ProductCard';

const PLATFORM_COLORS = {
  amazon: '#FF9900',
  flipkart: '#2874F0',
  nykaa: '#FC2779',
  myntra: '#FF3F6C',
  purplle: '#A855F7',
  blinkit: '#F8D90F',

  caretobeauty: '#FF8A65',
  desertcart: '#6C63FF',
  zepto: '#7C3AED',
  ubuy: '#009688',
  culturecircle: '#E63946',
  getuscart: '#2563EB',
  tira: '#D81B60',
  revolve: '#111827',
  medihubpharma: '#16A34A',
  plum: '#7E22CE',
  escentual: '#F59E0B'
};

function SkinScore({ score }) {
  const [animated, setAnimated] = useState(0);
  useEffect(() => {
    const timer = setTimeout(() => setAnimated(score), 500);
    return () => clearTimeout(timer);
  }, [score]);

  const r = 54; const circ = 2 * Math.PI * r;
  const offset = circ - (animated / 100) * circ;
  const color = score >= 80 ? '#4ade80' : score >= 60 ? '#C9A84C' : '#A8404B';
  const label = score >= 80 ? 'Excellent' : score >= 65 ? 'Good' : score >= 50 ? 'Fair' : 'Needs Care';

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r={r} fill="none" stroke="#F7E8E8" strokeWidth="8" />
          <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 1.5s ease', filter: `drop-shadow(0 0 8px ${color}40)` }} />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-4xl text-charcoal-900">{animated}</span>
          <span className="text-xs text-charcoal-800/50">/ 100</span>
        </div>
      </div>
      <p className="font-medium text-charcoal-900 mt-2" style={{ color }}>{label}</p>
      <p className="text-xs text-charcoal-800/40">Skin Health Score</p>
    </div>
  );
}

export default function Results() {
  const navigate = useNavigate();
  const { skinAnalysis } = useStore();
  const [activeRoutineTab, setActiveRoutineTab] = useState('morning');

  useEffect(() => {
    if (!skinAnalysis) navigate('/quiz');
  }, [skinAnalysis, navigate]);

  if (!skinAnalysis) return null;

  const { analysis, recommendations } = skinAnalysis;

  const SKIN_TYPE_ICONS = { oily: '✨', dry: '🏜️', combination: '☯️', normal: '🌟', sensitive: '🌸' };

  const routineProducts = recommendations?.routine || {};
  const morningCategories = ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'];
  const eveningCategories = ['cleanser', 'serum', 'moisturizer', 'eye_cream', 'face_mask'];

  const getRoutineProducts = (cats) => cats.flatMap(cat => (routineProducts[cat] || []).slice(0, 2));

  return (
    <div className="min-h-screen bg-skin-gradient">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md border-b border-rose-blush sticky top-0 z-40 px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center">
              <span className="text-white text-sm">✦</span>
            </div>
            <span className="font-display text-xl text-charcoal-900">Skintellix</span>
          </Link>
          <div className="flex gap-2">
            <button onClick={() => navigate('/quiz')} className="btn-secondary text-sm px-4 py-2">Retake Quiz</button>
            <Link to="/products" className="btn-primary text-sm px-4 py-2">Shop All</Link>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero result */}
        <div className="text-center mb-12 animate-fade-up">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-rose-soft/50 text-sm text-rose-deep font-medium mb-5">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> Analysis Complete
          </div>
          <h1 className="font-display text-4xl md:text-5xl text-charcoal-950 mb-3">
            Your Skin Profile 🔬
          </h1>
          <p className="text-charcoal-800/60 text-lg">Personalised recommendations crafted just for you</p>
        </div>

        {/* Summary cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {/* Skin score */}
          <div className="card p-6 text-center">
            <SkinScore score={analysis?.skinScore || 72} />
          </div>

          {/* Skin type */}
          <div className="card p-6">
            <p className="text-xs font-semibold text-rose-medium uppercase tracking-widest mb-4">Your Skin Type</p>
            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{SKIN_TYPE_ICONS[analysis?.skinType] || '🌟'}</span>
              <div>
                <p className="font-display text-2xl text-charcoal-900 capitalize">{analysis?.skinType}</p>
                <p className="text-sm text-charcoal-800/50">Skin Type</p>
              </div>
            </div>
            <p className="text-sm text-charcoal-800/60 leading-relaxed">{analysis?.description}</p>
          </div>

          {/* Skin tone */}
          <div className="card p-6">
            <p className="text-xs font-semibold text-rose-medium uppercase tracking-widest mb-4">Your Skin Tone</p>
            <div className="flex items-center gap-4 mb-4">
              {['fair', 'medium', 'wheatish', 'dusky', 'dark'].map(tone => {
                const colors = { fair: '#F5DCBC', medium: '#E8C090', wheatish: '#C8955A', dusky: '#9C6030', dark: '#5A3010' };
                return (
                  <div key={tone} className={`w-8 h-8 rounded-full border-2 ${analysis?.skinTone === tone ? 'border-rose-deep scale-125' : 'border-white opacity-50'} transition-all duration-200`}
                    style={{ backgroundColor: colors[tone] }} />
                );
              })}
            </div>
            <p className="font-display text-2xl text-charcoal-900 capitalize mb-1">{analysis?.skinTone}</p>
            <p className="text-sm text-charcoal-800/50">Fitzpatrick Type {analysis?.fitzpatrickScale} · {analysis?.undertone} Undertone</p>
            <div className="mt-3 text-xs text-charcoal-800/40">AI confidence: {analysis?.confidence}%</div>
          </div>
        </div>

        {/* Key concerns */}
        {analysis?.concerns?.length > 0 && (
          <div className="card p-6 mb-8">
            <h2 className="font-display text-2xl text-charcoal-900 mb-5">Your Skin Concerns</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {analysis.concerns.map(c => (
                <div key={c.concern} className="p-4 rounded-xl bg-cream-100 border border-rose-blush/30">
                  <p className="font-medium text-charcoal-900 capitalize mb-2">{c.concern.replace('_', ' ')}</p>
                  {c.topIngredients && (
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {c.topIngredients.slice(0, 3).map(ing => (
                        <span key={ing} className="text-[10px] bg-white border border-rose-soft/30 px-2 py-0.5 rounded-full text-charcoal-800/70">{ing}</span>
                      ))}
                    </div>
                  )}
                  {c.lifestyle && (
                    <p className="text-xs text-charcoal-800/50">Tip: {c.lifestyle[0]}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Routine */}
        <div className="card p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-2xl text-charcoal-900">Your Personalised Routine</h2>
            <div className="flex rounded-xl overflow-hidden border border-rose-blush">
              {['morning', 'evening'].map(tab => (
                <button key={tab} onClick={() => setActiveRoutineTab(tab)}
                  className={`px-4 py-2 text-sm font-medium transition-colors capitalize ${activeRoutineTab === tab ? 'bg-rose-deep text-white' : 'bg-white text-charcoal-800/60 hover:bg-rose-blush'}`}>
                  {tab === 'morning' ? '☀️ Morning' : '🌙 Evening'}
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-charcoal-800/50 mb-4">
              {activeRoutineTab === 'morning'
                ? `Recommended morning steps: ${analysis?.morningRoutine?.join(' → ') || 'Cleanser → Toner → Serum → Moisturizer → SPF'}`
                : `Recommended evening steps: ${analysis?.eveningRoutine?.join(' → ') || 'Double Cleanse → Serum → Night Cream'}`}
            </p>
          </div>

          {(() => {
            const cats = activeRoutineTab === 'morning' ? morningCategories : eveningCategories;
            const products = getRoutineProducts(cats);
            return products.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map(p => <ProductCard key={p._id || p.name} product={p} showCompare={false} />)}
              </div>
            ) : (
              <div className="text-center py-10 text-charcoal-800/40">
                <p>No specific products found for this routine step.</p>
                <Link to="/products" className="btn-primary mt-4 inline-flex">Browse All Products</Link>
              </div>
            );
          })()}
        </div>

        {/* Top Picks */}
        {recommendations?.topPicks?.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-2xl text-charcoal-900">Your Top Product Picks</h2>
              <span className="text-sm text-charcoal-800/40">{recommendations.totalFound} products matched your profile</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
              {recommendations.topPicks.slice(0, 8).map(p => <ProductCard key={p._id || p.name} product={p} />)}
            </div>
            <div className="text-center mt-8">
              <Link to="/products" className="btn-secondary">View All {recommendations.totalFound} Matches →</Link>
            </div>
          </div>
        )}

        {/* Ingredients guide */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="card p-6">
            <h3 className="font-display text-xl text-charcoal-900 mb-4 flex items-center gap-2"><span>✅</span> Ingredients For You</h3>
            <div className="flex flex-wrap gap-2">
              {(analysis?.ingredientsToUse || []).map(ing => (
                <span key={ing} className="badge-green text-xs">{ing}</span>
              ))}
            </div>
          </div>
          <div className="card p-6">
            <h3 className="font-display text-xl text-charcoal-900 mb-4 flex items-center gap-2"><span>⚠️</span> Ingredients to Avoid</h3>
            <div className="flex flex-wrap gap-2">
              {(analysis?.ingredientsToAvoid || []).map(ing => (
                <span key={ing} className="badge bg-red-50 text-red-700 text-xs">{ing}</span>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-br from-rose-deep to-charcoal-950 rounded-3xl p-8 text-center relative overflow-hidden">
          <div className="blob-bg w-64 h-64 bg-gold-medium/20 -top-10 -right-10" />
          <h2 className="font-display text-3xl text-white mb-3">Compare Prices Before You Buy</h2>
          <p className="text-white/60 mb-6">Find the same product across Amazon, Flipkart, Nykaa & 7 more platforms</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/products" className="bg-white text-rose-deep font-semibold px-6 py-3 rounded-full hover:bg-cream-100 transition-colors">
              Shop with Price Compare →
            </Link>
            <Link to="/makeup" className="border border-white/30 text-white font-medium px-6 py-3 rounded-full hover:bg-white/10 transition-colors">
              💄 Explore Makeup Picks
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
