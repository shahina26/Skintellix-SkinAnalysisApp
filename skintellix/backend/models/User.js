const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const skinProfileSchema = new mongoose.Schema({
  type: { type: String, enum: ['oily', 'dry', 'combination', 'normal', 'sensitive'] },
  concerns: [{ type: String, enum: ['acne', 'pigmentation', 'dryness', 'wrinkles', 'dark_circles', 'sensitivity', 'uneven_tone', 'large_pores', 'dullness', 'redness'] }],
  tone: { type: String, enum: ['fair', 'medium', 'wheatish', 'dusky', 'dark'] },
  fitzpatrick: { type: Number, min: 1, max: 6 },
  allergies: [String],
  analyzedAt: Date,
  imageUrl: String,
  aiConfidence: Number
}, { _id: false });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6 },
  phone: { type: String, trim: true },
  avatar: String,
  dateOfBirth: Date,
  gender: { type: String, enum: ['female', 'male', 'non-binary', 'prefer_not_to_say'] },
  location: {
    city: String,
    state: String,
    pincode: String
  },
  skinProfile: skinProfileSchema,
  wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  recentlyViewed: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
  skinJourney: [{
    date: Date,
    imageUrl: String,
    notes: String,
    skinScore: Number
  }],
  preferences: {
    budget: { type: String, enum: ['budget', 'mid-range', 'premium', 'luxury'], default: 'mid-range' },
    preferVegan: { type: Boolean, default: false },
    preferCrueltyFree: { type: Boolean, default: false },
    preferNatural: { type: Boolean, default: false },
    preferIndianBrands: { type: Boolean, default: false }
  },
  notifications: {
    email: { type: Boolean, default: true },
    priceDrops: { type: Boolean, default: true },
    skinTips: { type: Boolean, default: true }
  },
  role: { type: String, enum: ['user', 'admin', 'dermatologist'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  lastLogin: Date,
  refreshToken: String
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toSafeObject = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  return obj;
};

userSchema.index({ email: 1 });
userSchema.index({ 'skinProfile.type': 1 });

module.exports = mongoose.model('User', userSchema);
