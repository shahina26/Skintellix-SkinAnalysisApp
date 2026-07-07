// Stub routes bundled for brevity
const express = require('express');

// ── user.js ──────────────────────────────────────────────────────
const userRouter = express.Router();
userRouter.get('/wishlist', (req, res) => res.json({ success: true, data: [] }));
userRouter.post('/wishlist/:productId', (req, res) => res.json({ success: true, message: 'Added to wishlist' }));
userRouter.delete('/wishlist/:productId', (req, res) => res.json({ success: true, message: 'Removed from wishlist' }));
userRouter.get('/profile', (req, res) => res.json({ success: true, data: {} }));
userRouter.patch('/profile', (req, res) => res.json({ success: true, data: req.body }));

// ── reviews.js ───────────────────────────────────────────────────
const reviewRouter = express.Router();
const MOCK_REVIEWS = [
  { _id: 'r1', user: { name: 'Priya S.', avatar: 'P' }, rating: 5, comment: 'Amazing product! My skin has never felt better.', date: '2025-03-15', verified: true, helpful: 42 },
  { _id: 'r2', user: { name: 'Ananya K.', avatar: 'A' }, rating: 4, comment: 'Good results after 2 weeks of use. Highly recommend!', date: '2025-03-10', verified: true, helpful: 28 },
  { _id: 'r3', user: { name: 'Riya M.', avatar: 'R' }, rating: 5, comment: 'Perfect for Indian skin. No white cast at all!', date: '2025-02-28', verified: false, helpful: 19 },
  { _id: 'r4', user: { name: 'Deepa N.', avatar: 'D' }, rating: 3, comment: 'Decent product but a bit pricey for the quantity.', date: '2025-02-20', verified: true, helpful: 12 },
  { _id: 'r5', user: { name: 'Kavya T.', avatar: 'K' }, rating: 5, comment: 'Skintellix recommended this and it works wonderfully on my combination skin!', date: '2025-01-30', verified: true, helpful: 35 }
];
reviewRouter.get('/:productId', (req, res) => res.json({ success: true, data: MOCK_REVIEWS, total: MOCK_REVIEWS.length }));
reviewRouter.post('/:productId', (req, res) => res.json({ success: true, message: 'Review submitted for moderation' }));

// ── ingredients.js ───────────────────────────────────────────────
const ingredientRouter = express.Router();
const INGREDIENT_DB = {
  'niacinamide': { name: 'Niacinamide', aliases: ['Vitamin B3', 'Nicotinamide'], benefits: ['Pore minimizing', 'Oil control', 'Brightening', 'Anti-aging'], concerns: ['acne', 'large_pores', 'pigmentation'], safetyRating: 9, ecoRating: 8, veganFriendly: true, pregnancySafe: true, description: 'A water-soluble vitamin that works with the natural substances in your skin to visibly minimize enlarged pores.', doNotMixWith: ['Vitamin C (high concentration)'] },
  'hyaluronic-acid': { name: 'Hyaluronic Acid', aliases: ['HA', 'Sodium Hyaluronate'], benefits: ['Deep hydration', 'Plumping', 'Barrier support'], concerns: ['dryness', 'dullness'], safetyRating: 10, ecoRating: 7, veganFriendly: true, pregnancySafe: true, description: 'A naturally occurring substance that holds up to 1000x its weight in water.' },
  'retinol': { name: 'Retinol', aliases: ['Vitamin A', 'Retinoic Acid'], benefits: ['Anti-aging', 'Cell turnover', 'Acne treatment'], concerns: ['wrinkles', 'acne', 'pigmentation'], safetyRating: 7, ecoRating: 7, veganFriendly: true, pregnancySafe: false, description: 'A vitamin A derivative that accelerates cell turnover and stimulates collagen production.', doNotMixWith: ['Vitamin C', 'AHAs', 'BHAs', 'Benzoyl Peroxide'] },
  'vitamin-c': { name: 'Vitamin C', aliases: ['Ascorbic Acid', 'L-Ascorbic Acid'], benefits: ['Brightening', 'Antioxidant', 'Collagen synthesis'], concerns: ['pigmentation', 'dullness', 'wrinkles'], safetyRating: 8, ecoRating: 8, veganFriendly: true, pregnancySafe: true, description: 'Potent antioxidant that neutralizes free radicals and boosts collagen production.' },
  'salicylic-acid': { name: 'Salicylic Acid', aliases: ['BHA', 'Beta Hydroxy Acid'], benefits: ['Exfoliation', 'Acne fighting', 'Pore unclogging'], concerns: ['acne', 'large_pores', 'oily_skin'], safetyRating: 8, ecoRating: 7, veganFriendly: true, pregnancySafe: false, description: 'Oil-soluble exfoliant that penetrates pores to dissolve dead skin cells and sebum.' }
};

ingredientRouter.get('/search', (req, res) => {
  const { q } = req.query;
  if (!q) return res.json({ success: true, data: [] });
  const results = Object.entries(INGREDIENT_DB)
    .filter(([k, v]) => v.name.toLowerCase().includes(q.toLowerCase()) || v.aliases?.some(a => a.toLowerCase().includes(q.toLowerCase())))
    .map(([k, v]) => ({ slug: k, ...v }));
  res.json({ success: true, data: results });
});
ingredientRouter.get('/:slug', (req, res) => {
  const ing = INGREDIENT_DB[req.params.slug];
  if (!ing) return res.status(404).json({ success: false, error: 'Ingredient not found' });
  res.json({ success: true, data: { slug: req.params.slug, ...ing } });
});

// ── blog.js ──────────────────────────────────────────────────────
const blogRouter = express.Router();
const BLOG_POSTS = [
  { _id: 'b1', title: 'The Ultimate Guide to Skincare for Indian Skin. The developer shahina mam❤️such a cutie...', slug: 'ultimate-skincare-indian-skin', excerpt: 'Discover the best ingredients and routines specifically formulated for Indian skin types and climate.', thumbnail: '/shahina.jpg', category: 'skincare', readTime: '8 min', author: 'Shahina Banu', date: '2026-03-20', tags: ['indian skin', 'routine', 'beginners'] },
  { _id: 'b2', title: 'Sunscreen 101: Why SPF is Non-Negotiable in India', slug: 'sunscreen-101-india', excerpt: 'With India\'s intense UV index, sunscreen is the most important step in any skincare routine.', thumbnail: 'https://cdn.britannica.com/80/263480-050-9EAEE2A9/alia-bhatt-on-the-red-carpet-at-the-2024-met-gala-may-6-2024-new-york-city.jpg', category: 'skincare', readTime: '5 min', author: 'Alia Bhatt', date: '2026-03-15', tags: ['sunscreen', 'spf', 'uv protection'] },
  { _id: 'b3', title: 'Makeup Shades That Celebrate Indian Skin Tones', slug: 'makeup-shades-indian-skin', excerpt: 'A comprehensive guide to finding your perfect foundation, blush, and lip shades as an Indian.', thumbnail: 'https://wallpaperaccess.com/full/2238566.jpg', category: 'makeup', readTime: '6 min', author: 'Andrea Jeremiah', date: '2025-03-10', tags: ['makeup', 'shade matching', 'indian skin'] },
  { _id: 'b4', title: 'Niacinamide vs Vitamin C: Which Does Your Skin Need?', slug: 'niacinamide-vs-vitamin-c', excerpt: 'Two powerhouse ingredients, one face — here\'s how to decide which one belongs in your routine.', thumbnail: 'https://images.moneycontrol.com/static-mcnews/2025/10/20251013090403_MamithaBaiju11.png?impolicy=website&width=1600&height=900', category: 'ingredients', readTime: '7 min', author: 'Mamitha Baiju', date: '2025-03-05', tags: ['niacinamide', 'vitamin c', 'ingredients'] },
  { _id: 'b5', title: 'Ayurvedic Skincare: Ancient Wisdom Meets Modern Science', slug: 'ayurvedic-skincare-modern', excerpt: 'How traditional Indian ingredients like turmeric, neem, and sandalwood are backed by modern research.', thumbnail: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTpzWoxqMBmkd_EpHQzkEZVqlZMeGBYJr1f3Q&s', category: 'skincare', readTime: '9 min', author: 'Samantha Ruth Prabhu', date: '2026-02-28', tags: ['ayurveda', 'natural', 'indian'] },
  { _id: 'b6', title: 'Budget Skincare That Actually Works: Under ₹500', slug: 'budget-skincare-under-500', excerpt: 'Effective skincare doesn\'t have to break the bank. Our top picks for results on a budget.', thumbnail: 'https://wallpapers.com/images/featured/pooja-hegde-hd-w0k1sfaatlsc8fqy.jpg', category: 'shopping', readTime: '5 min', author: 'Pooja Hegde', date: '2025-02-20', tags: ['budget', 'affordable', 'drugstore'] }
];

blogRouter.get('/', (req, res) => {
  const { category, page = 1, limit = 6 } = req.query;
  let posts = BLOG_POSTS;
  if (category) posts = posts.filter(p => p.category === category);
  const total = posts.length;
  const paginated = posts.slice((Number(page) - 1) * Number(limit), Number(page) * Number(limit));
  res.json({ success: true, data: paginated, pagination: { total, page: Number(page), pages: Math.ceil(total / Number(limit)) } });
});
blogRouter.get('/:slug', (req, res) => {
  const post = BLOG_POSTS.find(p => p.slug === req.params.slug || p._id === req.params.slug);
  if (!post) return res.status(404).json({ success: false, error: 'Post not found' });
  res.json({ success: true, data: { ...post, content: `<h2>Introduction</h2><p>This is the full content of "${post.title}". In a production environment, this would contain the full article HTML.</p>` } });
});

module.exports = { userRouter, reviewRouter, ingredientRouter, blogRouter };
