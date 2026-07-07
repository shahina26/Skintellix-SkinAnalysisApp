/**
 * Skintellix Price Comparison Service
 * Handles real-time price fetching and comparison across platforms
 */

const PLATFORMS = {
  amazon: { name: "Amazon", logo: "🛒", color: "#FF9900", badge: "Prime Available" },
  flipkart: { name: "Flipkart", logo: "🏬", color: "#2874F0", badge: "Plus Member Offer" },
  nykaa: { name: "Nykaa", logo: "💄", color: "#FC2779", badge: "Beauty Expert" },
  myntra: { name: "Myntra", logo: "👗", color: "#FF3F6C", badge: "Insider Deal" },
  purplle: { name: "Purplle", logo: "💜", color: "#A855F7", badge: "Beauty Hub" },
  tata_cliq: { name: "Tata CLiQ", logo: "🔴", color: "#FF6000", badge: "Luxury" },
  meesho: { name: "Meesho", logo: "🌸", color: "#F43E5C", badge: "Budget Deal" },
  ajio: { name: "AJIO", logo: "🔶", color: "#EF6C00", badge: "Style Pick" },
  bigbasket: { name: "BigBasket", logo: "🧺", color: "#84BD00", badge: "Quick Delivery" },
  blinkit: { name: "Blinkit", logo: "⚡", color: "#F8D90F", badge: "10-Min Delivery" }
};

/**
 * Compare prices and return ranked results
 */
function comparePrices(platforms) {
  if (!platforms || platforms.length === 0) return [];
  
  const available = platforms.filter(p => p.inStock);
  const sorted = [...platforms].sort((a, b) => a.price - b.price);
  
  return sorted.map((platform, index) => ({
    ...platform,
    platformInfo: PLATFORMS[platform.platform] || { name: platform.platform, color: "#666" },
    rank: index + 1,
    isBestPrice: index === 0 && platform.inStock,
    savings: sorted[0] ? platform.price - sorted[0].price : 0,
    savingsPercent: sorted[0] && sorted[0].price > 0 
      ? Math.round(((platform.price - sorted[0].price) / sorted[0].price) * 100) 
      : 0
  }));
}

/**
 * Get price history data (mock - real implementation would fetch from DB)
 */
function getPriceHistory(productId, platform, days = 30) {
  const history = [];
  const today = new Date();
  let basePrice = 499;
  
  for (let i = days; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const variation = Math.floor(Math.random() * 100) - 50;
    basePrice = Math.max(299, Math.min(999, basePrice + variation));
    history.push({
      date: date.toISOString().split('T')[0],
      price: basePrice
    });
  }
  
  return history;
}

/**
 * Calculate price alert threshold
 */
function calculatePriceAlert(currentPrice, targetDropPercent = 10) {
  return Math.round(currentPrice * (1 - targetDropPercent / 100));
}

/**
 * Get best deal analysis
 */
function analyzeBestDeal(platforms) {
  const available = platforms.filter(p => p.inStock);
  if (available.length === 0) return null;
  
  const cheapest = available.reduce((min, p) => p.price < min.price ? p : min);
  const mostRated = available.reduce((max, p) => (p.rating || 0) > (max.rating || 0) ? p : max);
  
  return {
    lowestPrice: cheapest,
    highestRated: mostRated,
    fastestDelivery: available.find(p => p.deliveryTime?.includes('10 min') || p.deliveryTime?.includes('Same')) || available[0],
    priceRange: {
      min: Math.min(...available.map(p => p.price)),
      max: Math.max(...available.map(p => p.price)),
      spread: Math.max(...available.map(p => p.price)) - Math.min(...available.map(p => p.price))
    }
  };
}

module.exports = {
  comparePrices,
  getPriceHistory,
  calculatePriceAlert,
  analyzeBestDeal,
  PLATFORMS
};
