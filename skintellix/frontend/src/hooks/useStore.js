import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      user: null,
      token: null,
      setUser: (user, token) => {
        set({ user, token });
        if (token) localStorage.setItem('skintellix_token', token);
      },
      logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('skintellix_token');
      },

      // Skin Analysis
      skinAnalysis: null,
      quizAnswers: {},
      setSkinAnalysis: (analysis) => set({ skinAnalysis: analysis }),
      setQuizAnswer: (questionId, answer) =>
        set(s => ({ quizAnswers: { ...s.quizAnswers, [questionId]: answer } })),
      clearQuiz: () => set({ quizAnswers: {}, skinAnalysis: null }),

      // Wishlist
      wishlist: [],
      toggleWishlist: (product) => {
        const { wishlist } = get();
        const exists = wishlist.find(p => p._id === product._id);
        set({ wishlist: exists ? wishlist.filter(p => p._id !== product._id) : [...wishlist, product] });
      },
      isWishlisted: (productId) => get().wishlist.some(p => p._id === productId),

      // Compare
      compareList: [],
      addToCompare: (product) => {
        const { compareList } = get();
        if (compareList.length >= 4 || compareList.find(p => p._id === product._id)) return;
        set({ compareList: [...compareList, product] });
      },
      removeFromCompare: (productId) =>
        set(s => ({ compareList: s.compareList.filter(p => p._id !== productId) })),
      clearCompare: () => set({ compareList: [] }),

      // Recently viewed
      recentlyViewed: [],
      addRecentlyViewed: (product) => {
        const { recentlyViewed } = get();
        const filtered = recentlyViewed.filter(p => p._id !== product._id);
        set({ recentlyViewed: [product, ...filtered].slice(0, 10) });
      },

      // UI State
      searchOpen: false,
      setSearchOpen: (val) => set({ searchOpen: val }),
      compareDrawerOpen: false,
      setCompareDrawerOpen: (val) => set({ compareDrawerOpen: val })
    }),
    {
      name: 'skintellix-store',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        skinAnalysis: state.skinAnalysis,
        quizAnswers: state.quizAnswers,
        wishlist: state.wishlist,
        compareList: state.compareList,
        recentlyViewed: state.recentlyViewed
      })
    }
  )
);
