const express = require('express');
const router = express.Router();
const PRODUCTS = require('../data/products');

function getProductsWithId() {
  return PRODUCTS.map((p, i) => ({
    ...p,
    _id: `prod_${String(i + 1).padStart(4, '0')}`,
    lowestPrice: p.platforms.length ? Math.min(...p.platforms.map(pl => pl.price)) : p.mrp
  }));
}

// Shade matching engine for Indian skin tones
const SHADE_GUIDE = {
  fair: { foundation: ['110', '115', '120', 'Porcelain', 'Ivory', 'Fair Ivory'], blush: ['Peachy Pink', 'Soft Rose', 'Baby Pink'], lipstick: ['Nude Beige', 'Coral', 'Soft Pink', 'Mauve'] },
  medium: { foundation: ['130', '220', '230', 'Natural Beige', 'Golden Ivory'], blush: ['Rosy Mauve', 'Warm Peach', 'Coral'], lipstick: ['Dusty Rose', 'Berry', 'Warm Nude', 'Coral Red'] },
  wheatish: { foundation: ['240', '250', '330', 'Warm Sand', 'Honey', 'Natural Honey'], blush: ['Terracotta', 'Warm Coral', 'Peach'], lipstick: ['Terracotta', 'Brick Red', 'Warm Brown', 'Rust'] },
  dusky: { foundation: ['340', '350', '360', 'Tawny', 'Warm Toffee'], blush: ['Deep Rose', 'Bronze', 'Deep Plum'], lipstick: ['Deep Berry', 'Plum', 'Wine', 'Chocolate'] },
  dark: { foundation: ['370', '380', '390', 'Ebony', 'Rich Espresso', 'Mahogany'], blush: ['Deep Bronze', 'Rich Plum', 'Deep Berry'], lipstick: ['Deep Burgundy', 'Bold Red', 'Dark Berry', 'Bold Plum'] }
};

// GET /api/makeup/shade-guide/:skinTone
router.get('/shade-guide/:skinTone', (req, res) => {
  const { skinTone } = req.params;
  const guide = SHADE_GUIDE[skinTone];
  if (!guide) return res.status(404).json({ success: false, error: 'Skin tone not found' });
  res.json({ success: true, data: { skinTone, shadeGuide: guide } });
});

// GET /api/makeup/recommend
router.get('/recommend', (req, res) => {
  const { skinTone = 'medium', skinType = 'normal', occasion = 'everyday', budget = 'mid-range' } = req.query;
  const products = getProductsWithId();
  const makeupProducts = products.filter(p => p.productType === 'makeup');

  let budgetFilter = { min: 0, max: Infinity };
  if (budget === 'budget') budgetFilter = { min: 0, max: 500 };
  if (budget === 'mid-range') budgetFilter = { min: 100, max: 2000 };
  if (budget === 'premium') budgetFilter = { min: 500, max: 6000 };

  const filtered = makeupProducts.filter(p => p.lowestPrice >= budgetFilter.min && p.lowestPrice <= budgetFilter.max);

  const looks = {
    everyday: {
      name: "Effortless Everyday",
      description: "Natural, fresh look perfect for work and daily errands",
      products: {
        foundation: filtered.filter(p => p.category === 'foundation').slice(0, 3),
        concealer: filtered.filter(p => p.category === 'concealer').slice(0, 2),
        mascara: filtered.filter(p => p.category === 'mascara').slice(0, 2),
        lipstick: filtered.filter(p => p.category === 'lipstick').slice(0, 3),
        blush: filtered.filter(p => p.category === 'blush').slice(0, 2)
      }
    },
    festive: {
      name: "Festive Glam",
      description: "Bold and radiant for Indian festivals and weddings",
      products: {
        foundation: filtered.filter(p => p.category === 'foundation').slice(0, 3),
        concealer: filtered.filter(p => p.category === 'concealer').slice(0, 2),
        eyeshadow: filtered.filter(p => p.category === 'eyeshadow').slice(0, 2),
        eyeliner: filtered.filter(p => p.category === 'eyeliner').slice(0, 2),
        highlighter: filtered.filter(p => p.category === 'highlighter').slice(0, 2),
        lipstick: filtered.filter(p => p.category === 'lipstick').slice(0, 3)
      }
    }
  };

  const shadeGuide = SHADE_GUIDE[skinTone] || SHADE_GUIDE.medium;

  res.json({
    success: true,
    data: {
      skinTone,
      skinType,
      shadeGuide,
      looks: looks[occasion] || looks.everyday,
      allLooks: Object.keys(looks)
    }
  });
});

// GET /api/makeup/looks
router.get('/looks', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 'everyday', name: 'Effortless Everyday', emoji: '☀️', description: 'Natural fresh-faced look', time: '15 mins' },
      { id: 'office', name: 'Office Ready', emoji: '💼', description: 'Polished professional look', time: '20 mins' },
      { id: 'festive', name: 'Festive Glam', emoji: '✨', description: 'Bold look for Indian festivals', time: '45 mins' },
      { id: 'wedding', name: 'Bridal Radiance', emoji: '💍', description: 'Timeless bridal look', time: '60 mins' },
      { id: 'night', name: 'Night Out', emoji: '🌙', description: 'Sultry evening glam', time: '30 mins' },
      { id: 'no_makeup', name: 'No-Makeup Makeup', emoji: '🌸', description: 'Barely-there natural look', time: '10 mins' }
    ]
  });
});

// GET /api/makeup/tutorials
router.get('/tutorials', (req, res) => {
  res.json({
    success: true,
    data: [
      { id: 1, title: "Perfect Kajal Application for Indian Eyes", duration: "5 min", thumbnail: "https://i.ytimg.com/vi/DuHYhl8y_6w/maxresdefault.jpg", category: "eyes" },
      { id: 2, title: "Flawless Foundation for Indian Skin Tones", duration: "8 min", thumbnail: "https://i.ytimg.com/vi/GoBkIqzXq1w/maxresdefault.jpg", category: "face" },
      { id: 3, title: "Bold Lips for Dusky Skin", duration: "6 min", thumbnail: "https://static.vecteezy.com/system/resources/thumbnails/071/718/142/small/close-up-of-blonde-woman-applying-red-lipstick-in-a-studio-for-a-makeup-tutorial-free-video.jpg", category: "lips" },
      { id: 4, title: "Festive Glow with Highlighter", duration: "7 min", thumbnail: "https://i.ytimg.com/vi/Hj78NqRWNC4/maxresdefault.jpg", category: "face" }
    ]
  });
});

module.exports = router;
