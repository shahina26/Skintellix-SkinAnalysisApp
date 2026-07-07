const express = require('express');
const router = express.Router();
const PRODUCTS = require('../data/products');
const { comparePrices, analyzeBestDeal } = require('../services/priceComparisonService');

// Cache
let cachedProducts = null;
let productsWithId = null;

function getProducts() {
  if (!productsWithId) {
    productsWithId = PRODUCTS.map((p, i) => ({
      ...p,
      _id: `prod_${String(i + 1).padStart(4, '0')}`,
      slug: `${p.brand}-${p.name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      lowestPrice: p.platforms.length ? Math.min(...p.platforms.map(pl => pl.price)) : p.mrp,
      highestPrice: p.platforms.length ? Math.max(...p.platforms.map(pl => pl.price)) : p.mrp
    }));
  }
  return productsWithId;
}

// GET /api/products - List all products with filtering
router.get('/', (req, res) => {
  try {
    let products = getProducts();
    const {
      category, productType, brand, skinType, concern,
      skinTone, minPrice, maxPrice, sort = 'popularity',
      page = 1, limit = 24, search, trending, bestseller,
      vegan, crueltyFree, natural, ayurvedic, spf,
      budgetPick, luxuryPick, expertRecommended, newArrival
    } = req.query;

    // Filters
    if (category) products = products.filter(p => p.category === category);
    if (productType) products = products.filter(p => p.productType === productType);
    if (brand) products = products.filter(p => p.brand.toLowerCase().includes(brand.toLowerCase()));
    if (skinType) products = products.filter(p => p.suitableFor?.skinType?.includes(skinType) || p.suitableFor?.skinType?.includes('all'));
    if (concern) products = products.filter(p => p.suitableFor?.skinConcerns?.includes(concern));
    if (skinTone) products = products.filter(p => !p.suitableFor?.skinTone?.length || p.suitableFor.skinTone.includes(skinTone) || p.suitableFor.skinTone.includes('all'));
    if (minPrice) products = products.filter(p => p.lowestPrice >= Number(minPrice));
    if (maxPrice) products = products.filter(p => p.lowestPrice <= Number(maxPrice));
    if (trending === 'true') products = products.filter(p => p.trending);
    if (bestseller === 'true') products = products.filter(p => p.bestseller);
    if (budgetPick === 'true') products = products.filter(p => p.budgetPick);
    if (luxuryPick === 'true') products = products.filter(p => p.luxuryPick);
    if (expertRecommended === 'true') products = products.filter(p => p.expertRecommended);
    if (newArrival === 'true') products = products.filter(p => p.newArrival);
    if (vegan === 'true') products = products.filter(p => p.features?.isVegan);
    if (crueltyFree === 'true') products = products.filter(p => p.features?.isCrueltyFree);
    if (natural === 'true') products = products.filter(p => p.features?.isNatural);
    if (ayurvedic === 'true') products = products.filter(p => p.features?.isAyurvedic);
    if (spf === 'true') products = products.filter(p => p.features?.isSPF);

    if (search) {
      const q = search.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.brand.toLowerCase().includes(q) ||
        p.description?.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q)
      );
    }

    // Sort
    const sortMap = {
      popularity: (a, b) => (b.totalReviews || 0) - (a.totalReviews || 0),
      rating: (a, b) => (b.overallRating || 0) - (a.overallRating || 0),
      price_asc: (a, b) => (a.lowestPrice || 0) - (b.lowestPrice || 0),
      price_desc: (a, b) => (b.lowestPrice || 0) - (a.lowestPrice || 0),
      score: (a, b) => (b.skintellix_score || 0) - (a.skintellix_score || 0),
      newest: (a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0)
    };
    if (sortMap[sort]) products = [...products].sort(sortMap[sort]);

    const total = products.length;
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const paginated = products.slice((pageNum - 1) * limitNum, pageNum * limitNum);

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        pages: Math.ceil(total / limitNum),
        hasNext: pageNum * limitNum < total,
        hasPrev: pageNum > 1
      },
      filters: { category, productType, brand, skinType, search }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/products/featured
router.get('/featured', (req, res) => {
  const products = getProducts();
  const trending = products.filter(p => p.trending).slice(0, 8);
  const bestsellers = products.filter(p => p.bestseller).slice(0, 8);
  const budgetPicks = products.filter(p => p.budgetPick).slice(0, 6);
  const luxuryPicks = products.filter(p => p.luxuryPick).slice(0, 6);
  const expertPicks = products.filter(p => p.expertRecommended).slice(0, 8);

  res.json({ success: true, data: { trending, bestsellers, budgetPicks, luxuryPicks, expertPicks } });
});

// GET /api/products/search/suggestions
router.get('/search/suggestions', (req, res) => {
  const { q } = req.query;
  if (!q || q.length < 2) return res.json({ success: true, data: [] });

  const products = getProducts();
  const query = q.toLowerCase();
  const suggestions = new Set();

  products.forEach(p => {
    if (p.name.toLowerCase().includes(query)) suggestions.add(p.name);
    if (p.brand.toLowerCase().includes(query)) suggestions.add(p.brand);
    p.tags?.forEach(t => { if (t.toLowerCase().includes(query)) suggestions.add(t); });
  });

  res.json({ success: true, data: Array.from(suggestions).slice(0, 10) });
});

// GET /api/products/categories
router.get('/categories', (req, res) => {
  const products = getProducts();
  const categories = {};
  products.forEach(p => {
    if (!categories[p.productType]) categories[p.productType] = {};
    categories[p.productType][p.category] = (categories[p.productType][p.category] || 0) + 1;
  });
  res.json({ success: true, data: categories });
});

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const products = getProducts();
  const product = products.find(p => p._id === req.params.id || p.slug === req.params.id);
  if (!product) return res.status(404).json({ success: false, error: 'Product not found' });

  const priceComparison = comparePrices(product.platforms);
  const bestDeal = analyzeBestDeal(product.platforms);
  
  // Related products
  const related = products
    .filter(p => p._id !== product._id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 8);

  res.json({ success: true, data: { ...product, priceComparison, bestDeal, related } });
});

module.exports = router;
