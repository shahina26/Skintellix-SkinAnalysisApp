import React from 'react';
import { Link } from 'react-router-dom';

const PLATFORMS = ['Amazon', 'Flipkart', 'Nykaa', 'Myntra', 'Purplle', 'Tata CLiQ', 'Meesho', 'AJIO', 'BigBasket', 'Blinkit'];

export default function Footer() {
  return (
    <footer className="bg-charcoal-950 text-white/70 mt-20">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="font-display text-2xl text-white mb-1">Get Skin Tips in Your Inbox</h3>
              <p className="text-sm text-white/50">Weekly skincare advice tailored for Indian skin. No spam.</p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com"
                className="px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/30 focus:outline-none focus:border-rose-medium text-sm flex-1 md:w-64" />
              <button onClick={() => alert('Successfully subscribed!')} className="btn-primary whitespace-nowrap">Subscribe</button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-rose-medium to-rose-deep flex items-center justify-center">
                <span className="text-white text-lg">✦</span>
              </div>
              <span className="font-display text-2xl text-white">Skintellix</span>
            </div>
            <p className="text-sm text-white/50 leading-relaxed mb-4 max-w-xs">
              India's smartest beauty platform. AI-powered skin analysis with real-time price comparison across 10+ platforms.
            </p>
            <div className="flex gap-3">
              {['𝕏', '📸', '▶️', '📌'].map((icon, i) => (
                <button key={i} className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-rose-medium/20 transition-colors text-sm">
                  {icon}
                </button>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/60">🇮🇳 Made in India</span>
              <span className="text-[10px] bg-white/10 px-2 py-1 rounded-full text-white/60">🔒 Secure</span>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4 tracking-wide uppercase">Explore</h4>
            <ul className="space-y-2.5">
              {[['Skincare', '/products?productType=skincare'], ['Makeup', '/products?productType=makeup'], ['Haircare', '/products?productType=haircare'], ['Price Compare', '/compare'], ['Skin Quiz', '/quiz'], ['Expert Blog', '/blog']].map(([label, to]) => (
                <li key={label}><Link to={to} className="text-sm hover:text-rose-medium transition-colors">{label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Platforms */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4 tracking-wide uppercase">Platforms</h4>
            <ul className="space-y-2.5">
              {PLATFORMS.slice(0, 7).map(p => (
                <li key={p} className="text-sm">{p}</li>
              ))}
              <li className="text-sm text-rose-medium">+3 more</li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-medium text-sm mb-4 tracking-wide uppercase">Legal</h4>
            <ul className="space-y-2.5">
              {[
                ['Privacy Policy', '/privacy-policy'], 
                ['Terms of Service', '/terms-of-service'], 
                ['Cookie Policy', '/cookie-policy'], 
                ['Affiliate Disclosure', '/affiliate-disclosure'], 
                ['Contact Us', '/contact'], 
                ['About Skintellix', '/about']
              ].map(([item, to]) => (
                <li key={item}><Link to={to} className="text-sm hover:text-rose-medium transition-colors">{item}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-white/30">© 2025 Skintellix. All rights reserved. Registered in India.</p>
          <div className="flex items-center gap-4 text-xs text-white/30">
            <span>Prices updated in real-time</span>
            <span>•</span>
            <span>Not affiliated with any brand</span>
            <span>•</span>
            <span>Independent reviews</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
