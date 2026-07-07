import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="min-h-screen bg-skin-gradient flex items-center justify-center">
      <div className="text-center">
        <div className="relative w-20 h-20 mx-auto mb-6">
          <div className="w-20 h-20 rounded-full border-2 border-rose-blush animate-ping absolute inset-0" />
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center relative z-10">
            <span className="text-white text-3xl">✦</span>
          </div>
        </div>
        <p className="font-display text-2xl text-charcoal-900 mb-1">Skintellix</p>
        <p className="text-sm text-charcoal-800/50 tracking-widest uppercase">Loading your experience...</p>
        <div className="flex justify-center gap-1 mt-4">
          {[0,1,2].map(i => (
            <div key={i} className="w-1.5 h-1.5 rounded-full bg-rose-medium"
              style={{ animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />
          ))}
        </div>
      </div>
    </div>
  );
}
