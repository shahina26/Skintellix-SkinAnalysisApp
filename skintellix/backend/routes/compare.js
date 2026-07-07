// compare.js
const express = require('express');
const router = express.Router();
const PRODUCTS = require('../data/products');
const { comparePrices, getPriceHistory, analyzeBestDeal } = require('../services/priceComparisonService');

function getProductsWithId() {
  return PRODUCTS.map((p, i) => ({ ...p, _id: `prod_${String(i+1).padStart(4,'0')}`, lowestPrice: p.platforms.length ? Math.min(...p.platforms.map(pl => pl.price)) : p.mrp }));
}

router.get('/', (req, res) => {
  const { ids } = req.query;
  if (!ids) return res.status(400).json({ success: false, error: 'Product IDs required' });
  const idList = ids.split(',').slice(0, 4);
  const products = getProductsWithId();
  const compared = idList.map(id => products.find(p => p._id === id)).filter(Boolean);
  res.json({ success: true, data: compared.map(p => ({ ...p, priceComparison: comparePrices(p.platforms), bestDeal: analyzeBestDeal(p.platforms) })) });
});

router.get('/price-history/:productId/:platform', (req, res) => {
  const history = getPriceHistory(req.params.productId, req.params.platform, 30);
  res.json({ success: true, data: history });
});

module.exports = router;
