import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { skinApi } from '../utils/api';
import { useStore } from '../hooks/useStore';
import toast from 'react-hot-toast';

const QUIZ_STEPS = [
  {
    id: 'skin_type', emoji: '🧴', question: 'How does your skin feel by midday?',
    subtitle: 'Be honest — this drives your entire routine!',
    multiple: false,
    options: [
      { value: 'oily', label: 'Shiny & greasy all over', desc: 'Oily skin', emoji: '✨', color: 'from-yellow-50 to-amber-50 border-amber-200' },
      { value: 'dry', label: 'Tight, flaky & parched', desc: 'Dry skin', emoji: '🏜️', color: 'from-orange-50 to-orange-100 border-orange-200' },
      { value: 'combination', label: 'Oily T-zone, dry cheeks', desc: 'Combination skin', emoji: '☯️', color: 'from-purple-50 to-purple-100 border-purple-200' },
      { value: 'normal', label: 'Balanced & comfortable', desc: 'Normal skin', emoji: '🌟', color: 'from-green-50 to-green-100 border-green-200' },
      { value: 'sensitive', label: 'Reactive with redness', desc: 'Sensitive skin', emoji: '🌸', color: 'from-rose-50 to-rose-100 border-rose-200' }
    ]
  },
  {
    id: 'skin_tone', emoji: '🎨', question: 'What is your skin tone?',
    subtitle: 'For makeup shade matching and ingredient recommendations.',
    multiple: false,
    options: [
      { value: 'fair', label: 'Fair', desc: 'Light with pink/neutral undertones', swatch: '#F5DCBC' },
      { value: 'medium', label: 'Medium', desc: 'Neutral undertones', swatch: '#E8C090' },
      { value: 'wheatish', label: 'Wheatish', desc: 'Golden/warm undertones — most common in India', swatch: '#C8955A' },
      { value: 'dusky', label: 'Dusky', desc: 'Deep warm undertones', swatch: '#9C6030' },
      { value: 'dark', label: 'Deep/Rich', desc: 'Rich, deep complexion', swatch: '#5A3010' }
    ]
  },
  {
    id: 'concerns', emoji: '🔍', question: 'What are your main skin concerns?',
    subtitle: 'Select all that apply — we\'ll target each one.',
    multiple: true,
    options: [
      { value: 'acne', label: 'Acne & Breakouts', icon: '😤', color: 'from-orange-50 to-orange-100 border-orange-200' },
      { value: 'pigmentation', label: 'Dark spots & Pigmentation', icon: '🎭', color: 'from-rose-50 to-rose-100 border-rose-200' },
      { value: 'dryness', label: 'Dryness & Dehydration', icon: '💧', color: 'from-blue-50 to-blue-100 border-blue-200' },
      { value: 'wrinkles', label: 'Fine lines & Wrinkles', icon: '⏰', color: 'from-purple-50 to-purple-100 border-purple-200' },
      { value: 'dark_circles', label: 'Dark Circles', icon: '👁️', color: 'from-indigo-50 to-indigo-100 border-indigo-200' },
      { value: 'sensitivity', label: 'Sensitivity & Redness', icon: '🌹', color: 'from-pink-50 to-pink-100 border-pink-200' },
      { value: 'uneven_tone', label: 'Uneven skin tone', icon: '🎨', color: 'from-amber-50 to-amber-100 border-amber-200' },
      { value: 'large_pores', label: 'Large Pores', icon: '🔬', color: 'from-teal-50 to-teal-100 border-teal-200' },
      { value: 'dullness', label: 'Dull & Tired skin', icon: '✨', color: 'from-yellow-50 to-yellow-100 border-yellow-200' }
    ]
  },
  {
    id: 'budget', emoji: '💰', question: 'Your skincare budget per product?',
    subtitle: 'We\'ll show you the best options within your range.',
    multiple: false,
    options: [
      { value: 'budget', label: 'Budget-friendly', desc: 'Under ₹500 per product', emoji: '🎯' },
      { value: 'mid-range', label: 'Mid-range', desc: '₹500 – ₹2,000 per product', emoji: '⚖️' },
      { value: 'premium', label: 'Premium', desc: '₹2,000 – ₹5,000 per product', emoji: '🌟' },
      { value: 'luxury', label: 'Luxury', desc: '₹5,000+ — the very best', emoji: '💎' }
    ]
  },
  {
    id: 'preferences', emoji: '🌿', question: 'Any product preferences?',
    subtitle: 'We\'ll prioritise these in your recommendations. (Optional)',
    multiple: true, optional: true,
    options: [
      { value: 'vegan', label: 'Vegan', icon: '🌱' },
      { value: 'crueltyFree', label: 'Cruelty-Free', icon: '🐰' },
      { value: 'natural', label: 'Natural / Organic', icon: '🌿' },
      { value: 'ayurvedic', label: 'Ayurvedic', icon: '🫚' },
      { value: 'indianBrands', label: 'Indian brands', icon: '🇮🇳' },
      { value: 'fragranceFree', label: 'Fragrance-Free', icon: '🚫' },
      { value: 'dermatologistTested', label: 'Dermatologist Tested', icon: '👩‍⚕️' }
    ]
  }
];

export default function SkinQuiz() {
  const navigate = useNavigate();
  const { setQuizAnswer, quizAnswers, setSkinAnalysis } = useStore();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState({});
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);

  const current = QUIZ_STEPS[step];
  const progress = ((step) / QUIZ_STEPS.length) * 100;

  const handleSelect = (value) => {
    if (current.multiple) {
      const cur = selected[current.id] || [];
      const updated = cur.includes(value) ? cur.filter(v => v !== value) : [...cur, value];
      setSelected(s => ({ ...s, [current.id]: updated }));
    } else {
      setSelected(s => ({ ...s, [current.id]: value }));
    }
  };

  const isSelected = (value) => {
    const val = selected[current.id];
    return Array.isArray(val) ? val.includes(value) : val === value;
  };

  const canProceed = current.optional || (
    current.multiple
      ? (selected[current.id]?.length > 0)
      : !!selected[current.id]
  );

  const handleNext = () => {
    setQuizAnswer(current.id, selected[current.id]);
    if (step < QUIZ_STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(s => s - 1);
    else navigate('/');
  };

  const handleSubmit = async () => {
    setAnalyzing(true);
    try {
      const payload = {
        skinType: selected.skin_type,
        skinTone: selected.skin_tone,
        concerns: selected.concerns || [],
        budget: selected.budget,
        preferences: selected.preferences || []
      };

      const res = await skinApi.analyze(payload);
      if (res.success) {
        setSkinAnalysis({ ...res.data, inputData: payload });
        navigate('/quiz/results');
      }
    } catch (err) {
      toast.error('Analysis failed. Please try again.');
      setAnalyzing(false);
    }
  };

  if (analyzing) {
    return (
      <div className="min-h-screen bg-skin-gradient flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="relative w-32 h-32 mx-auto mb-8">
            <div className="absolute inset-0 rounded-full border-4 border-rose-blush animate-spin border-t-rose-medium" />
            <div className="absolute inset-4 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center">
              <span className="text-white text-3xl animate-pulse">🔬</span>
            </div>
          </div>
          <h2 className="font-display text-3xl text-charcoal-900 mb-3">Analysing Your Skin...</h2>
          <p className="text-charcoal-800/60 mb-6">Our AI is building your personalised profile</p>
          <div className="space-y-2 text-sm text-charcoal-800/50">
            {['Identifying your skin type ✓', 'Mapping skin concerns...', 'Matching ingredients...', 'Comparing prices across platforms...'].map((step, i) => (
              <p key={i} style={{ animationDelay: `${i * 0.5}s` }} className="animate-pulse">{step}</p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-skin-gradient flex flex-col">
      {/* Header */}
      <div className="p-4 md:p-6 flex items-center justify-between max-w-3xl mx-auto w-full">
        <button onClick={handleBack} className="flex items-center gap-2 text-charcoal-800/50 hover:text-charcoal-900 text-sm transition-colors">
          ← {step === 0 ? 'Home' : 'Back'}
        </button>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center">
            <span className="text-white text-xs">✦</span>
          </div>
          <span className="font-display text-lg text-charcoal-900">Skintellix</span>
        </div>
        <span className="text-sm text-charcoal-800/40">{step + 1} / {QUIZ_STEPS.length}</span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1 bg-rose-blush/50 max-w-3xl mx-auto rounded-full mb-6 px-4 md:px-6">
        <div className="h-full bg-gradient-to-r from-rose-medium to-rose-deep rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }} />
      </div>

      {/* Quiz content */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-2xl">
          <div key={step} className="animate-fade-up">
            {/* Question header */}
            <div className="text-center mb-10">
              <div className="text-5xl mb-4 animate-float">{current.emoji}</div>
              <h2 className="font-display text-3xl md:text-4xl text-charcoal-950 mb-3">{current.question}</h2>
              <p className="text-charcoal-800/50">{current.subtitle}</p>
              {current.multiple && (
                <span className="inline-block mt-2 text-xs text-rose-medium bg-rose-blush px-3 py-1 rounded-full">Select all that apply</span>
              )}
            </div>

            {/* Options */}
            <div className={`grid ${current.options.length > 5 ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'} gap-3`}>
              {current.options.map(opt => (
                <button key={opt.value}
                  onClick={() => handleSelect(opt.value)}
                  className={`group p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                    isSelected(opt.value)
                      ? 'border-rose-deep bg-rose-blush shadow-product scale-[1.02]'
                      : `bg-white border-rose-blush/40 hover:border-rose-medium hover:shadow-card`
                  }`}>
                  <div className="flex items-start gap-3">
                    {opt.swatch && (
                      <div className="w-8 h-8 rounded-full border-2 border-white shadow-sm flex-shrink-0 mt-0.5"
                        style={{ backgroundColor: opt.swatch }} />
                    )}
                    {(opt.emoji || opt.icon) && (
                      <span className="text-2xl flex-shrink-0">{opt.emoji || opt.icon}</span>
                    )}
                    <div>
                      <p className={`font-medium text-sm ${isSelected(opt.value) ? 'text-rose-deep' : 'text-charcoal-900'}`}>
                        {opt.label}
                      </p>
                      {opt.desc && <p className="text-xs text-charcoal-800/50 mt-0.5">{opt.desc}</p>}
                    </div>
                    {isSelected(opt.value) && (
                      <div className="ml-auto w-5 h-5 rounded-full bg-rose-deep flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-[10px]">✓</span>
                      </div>
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Next button */}
            <div className="flex justify-center mt-8">
              <button onClick={handleNext} disabled={!canProceed}
                className={`px-10 py-4 rounded-full text-base font-medium transition-all duration-300 ${
                  canProceed
                    ? 'btn-primary shadow-product hover:scale-105'
                    : 'bg-charcoal-800/10 text-charcoal-800/30 cursor-not-allowed'
                }`}>
                {step === QUIZ_STEPS.length - 1 ? '✦ Analyse My Skin' : 'Continue →'}
              </button>
            </div>

            {current.optional && !canProceed && (
              <p className="text-center text-sm text-charcoal-800/40 mt-3 cursor-pointer hover:text-rose-deep transition-colors"
                onClick={handleNext}>Skip this step →</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
