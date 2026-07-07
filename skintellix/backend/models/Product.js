const mongoose = require('mongoose');

const platformPriceSchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['amazon', 'flipkart', 'nykaa', 'myntra', 'purplle', 'tata_cliq', 'meesho', 'ajio', 'bigbasket', 'blinkit'],
    required: true
  },
  price: { type: Number, required: true },
  mrp: Number,
  discount: Number,
  url: { type: String, required: true },
  inStock: { type: Boolean, default: true },
  deliveryTime: String,
  rating: Number,
  reviewCount: Number,
  lastChecked: { type: Date, default: Date.now }
}, { _id: false });

const ingredientSchema = new mongoose.Schema({
  name: String,
  role: String,
  concern: String,
  safetyRating: { type: Number, min: 1, max: 10 },
  isKeyIngredient: { type: Boolean, default: false }
}, { _id: false });

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  brand: { type: String, required: true, trim: true },
  brandOrigin: { type: String, default: 'India' },
  slug: { type: String, unique: true },
  category: {
    type: String,
    required: true,
    enum: [
      'moisturizer', 'serum', 'sunscreen', 'cleanser', 'toner',
      'face_mask', 'eye_cream', 'lip_care', 'face_oil', 'exfoliator',
      'foundation', 'concealer', 'blush', 'highlighter', 'bronzer',
      'eyeshadow', 'mascara', 'eyeliner', 'lipstick', 'lip_gloss',
      'setting_powder', 'setting_spray', 'primer', 'contour',
      'shampoo', 'conditioner', 'hair_mask', 'hair_serum', 'hair_oil',
      'body_lotion', 'body_wash', 'hand_cream', 'foot_cream', 'deodorant'
    ]
  },
  subcategory: String,
  productType: { type: String, enum: ['skincare', 'makeup', 'haircare', 'bodycare'] },
  images: [String],
  thumbnail: String,
  description: String,
  shortDescription: String,
  size: String,
  weight: String,
  ingredients: [ingredientSchema],
  ingredientsList: [String],

  suitableFor: {
    skinType: [{ type: String, enum: ['oily', 'dry', 'combination', 'normal', 'sensitive', 'all'] }],
    skinConcerns: [String],
    skinTone: [String],
    ageGroup: [String]
  },

  benefits: [String],
  howToUse: String,
  warnings: String,

  tags: [String],
  features: {
    isVegan: { type: Boolean, default: false },
    isCrueltyFree: { type: Boolean, default: false },
    isNatural: { type: Boolean, default: false },
    isOrganic: { type: Boolean, default: false },
    isAyurvedic: { type: Boolean, default: false },
    isParabenFree: { type: Boolean, default: false },
    isSulphateFree: { type: Boolean, default: false },
    isSiliconeFree: { type: Boolean, default: false },
    isFragranceFree: { type: Boolean, default: false },
    isAlcoholFree: { type: Boolean, default: false },
    isSPF: { type: Boolean, default: false },
    spfValue: Number,
    isDermatologistTested: { type: Boolean, default: false },
    isHypoallergenic: { type: Boolean, default: false }
  },

  platforms: [platformPriceSchema],
  lowestPrice: Number,
  highestPrice: Number,
  averagePrice: Number,
  mrp: Number,

  overallRating: { type: Number, min: 0, max: 5, default: 0 },
  totalReviews: { type: Number, default: 0 },
  ratingDistribution: {
    five: { type: Number, default: 0 },
    four: { type: Number, default: 0 },
    three: { type: Number, default: 0 },
    two: { type: Number, default: 0 },
    one: { type: Number, default: 0 }
  },

  skintellix_score: { type: Number, min: 0, max: 100 },
  expertRecommended: { type: Boolean, default: false },
  trending: { type: Boolean, default: false },
  newArrival: { type: Boolean, default: false },
  bestseller: { type: Boolean, default: false },
  luxuryPick: { type: Boolean, default: false },
  budgetPick: { type: Boolean, default: false },

  shade: String,
  finish: String,
  coverage: String,
  formulation: String,

  isActive: { type: Boolean, default: true },
  viewCount: { type: Number, default: 0 },
  wishlistCount: { type: Number, default: 0 }
}, {
  timestamps: true,
  toJSON: { virtuals: true }
});

productSchema.virtual('bestPrice').get(function () {
  if (!this.platforms || this.platforms.length === 0) return null;
  const inStock = this.platforms.filter(p => p.inStock);
  if (inStock.length === 0) return null;
  return inStock.reduce((min, p) => p.price < min.price ? p : min);
});

productSchema.pre('save', function (next) {
  if (this.name && this.brand && !this.slug) {
    this.slug = `${this.brand}-${this.name}`.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.platforms && this.platforms.length > 0) {
    const prices = this.platforms.map(p => p.price);
    this.lowestPrice = Math.min(...prices);
    this.highestPrice = Math.max(...prices);
    this.averagePrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
  }
  next();
});

productSchema.index({ category: 1, productType: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ 'suitableFor.skinType': 1 });
productSchema.index({ lowestPrice: 1 });
productSchema.index({ overallRating: -1 });
productSchema.index({ trending: 1, bestseller: 1 });
productSchema.index({ name: 'text', brand: 'text', description: 'text', tags: 'text' });

module.exports = mongoose.model('Product', productSchema);
