/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        accent: ['"Playfair Display"', 'serif']
      },
      colors: {
        rose: {
          blush: '#F7E8E8',
          soft: '#EFCECE',
          medium: '#D4737A',
          deep: '#A8404B',
          dark: '#7A1E27'
        },
        gold: {
          light: '#F5E6C8',
          soft: '#E8C97A',
          medium: '#C9A84C',
          rich: '#A07830'
        },
        cream: {
          50: '#FFFBF7',
          100: '#FFF5EC',
          200: '#FDE8D0',
          300: '#F9D5B0'
        },
        charcoal: {
          800: '#2A2420',
          900: '#1A1410',
          950: '#0F0C0A'
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'skin-gradient': 'linear-gradient(135deg, #FFF5EC 0%, #F7E8E8 50%, #EFD5E0 100%)',
        'gold-shimmer': 'linear-gradient(90deg, transparent, rgba(201,168,76,0.3), transparent)'
      },
      boxShadow: {
        'product': '0 8px 32px rgba(168, 64, 75, 0.12)',
        'card': '0 4px 24px rgba(0,0,0,0.08)',
        'glow': '0 0 40px rgba(212, 115, 122, 0.3)'
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'scale-in': 'scaleIn 0.4s ease forwards'
      },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
        fadeUp: { from: { opacity: 0, transform: 'translateY(20px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
        scaleIn: { from: { opacity: 0, transform: 'scale(0.95)' }, to: { opacity: 1, transform: 'scale(1)' } }
      }
    }
  },
  plugins: []
};
