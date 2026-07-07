/**
 * Skintellix AI Skin Analysis Service
 * Analyzes skin from image data and returns recommendations
 */

const SKIN_TYPE_PROFILES = {
  oily: {
    description: "Your skin produces excess sebum, leading to shine and potential breakouts.",
    morning_routine: ["Gentle gel cleanser", "Alcohol-free toner", "Lightweight moisturizer", "SPF 50 sunscreen"],
    evening_routine: ["Micellar water or oil cleanser", "Salicylic acid cleanser", "Niacinamide serum", "Oil-free moisturizer"],
    ingredients_to_use: ["Niacinamide", "Salicylic Acid", "Hyaluronic Acid", "Zinc", "AHA/BHA"],
    ingredients_to_avoid: ["Heavy oils", "Comedogenic ingredients", "Alcohol (high concentration)"]
  },
  dry: {
    description: "Your skin lacks sufficient moisture, resulting in tightness and flakiness.",
    morning_routine: ["Creamy gentle cleanser", "Hydrating toner", "Hyaluronic acid serum", "Rich moisturizer", "SPF 50"],
    evening_routine: ["Oil cleanser", "Gentle cream cleanser", "Retinol/Peptide serum", "Rich night cream", "Facial oil"],
    ingredients_to_use: ["Hyaluronic Acid", "Ceramides", "Glycerin", "Shea Butter", "Peptides", "Squalane"],
    ingredients_to_avoid: ["Alcohol denat", "Strong exfoliants", "Fragrance", "Sulfates"]
  },
  combination: {
    description: "Your skin is oily in the T-zone but normal to dry on the cheeks.",
    morning_routine: ["Gentle foaming cleanser", "Balancing toner", "Lightweight serum", "Gel-cream moisturizer", "SPF 50"],
    evening_routine: ["Micellar water", "Gentle cleanser", "Targeted serum", "Zone-specific moisturizer"],
    ingredients_to_use: ["Niacinamide", "Hyaluronic Acid", "Green Tea", "Ceramides", "AHAs"],
    ingredients_to_avoid: ["Heavy comedogenic oils", "Alcohol (excessive)"]
  },
  sensitive: {
    description: "Your skin reacts easily to products and environmental factors.",
    morning_routine: ["Fragrance-free gentle cleanser", "Soothing toner", "Centella serum", "Barrier cream", "Mineral SPF"],
    evening_routine: ["Gentle micellar water", "Gentle cleanser", "Calming serum", "Barrier repair cream"],
    ingredients_to_use: ["Centella Asiatica", "Ceramides", "Aloe Vera", "Oat Extract", "Allantoin", "Panthenol"],
    ingredients_to_avoid: ["Fragrance", "Essential oils", "Strong acids", "Physical scrubs", "Alcohol"]
  },
  normal: {
    description: "Your skin is balanced with minimal concerns.",
    morning_routine: ["Gentle cleanser", "Antioxidant serum", "Lightweight moisturizer", "SPF 50"],
    evening_routine: ["Double cleanse", "Vitamin C or Retinol serum", "Moisturizer"],
    ingredients_to_use: ["Vitamin C", "Retinol", "Peptides", "Antioxidants", "SPF"],
    ingredients_to_avoid: ["Over-exfoliation"]
  }
};

const CONCERN_TREATMENTS = {
  acne: {
    topIngredients: ["Salicylic Acid", "Benzoyl Peroxide", "Niacinamide", "Tea Tree Oil", "Zinc"],
    lifestyle: ["Change pillowcase regularly", "Don't touch your face", "Stay hydrated", "Reduce sugar intake"],
    professionalTreatments: ["Chemical peel", "LED light therapy", "Extractions"]
  },
  pigmentation: {
    topIngredients: ["Vitamin C", "Alpha Arbutin", "Kojic Acid", "Niacinamide", "Tranexamic Acid", "AHAs"],
    lifestyle: ["Always wear SPF", "Avoid sun exposure 10am-4pm", "Use antioxidants"],
    professionalTreatments: ["Chemical peel", "Laser treatment", "Microdermabrasion"]
  },
  wrinkles: {
    topIngredients: ["Retinol", "Peptides", "Hyaluronic Acid", "Vitamin C", "Bakuchiol"],
    lifestyle: ["Sleep on your back", "Stay hydrated", "Eat antioxidant-rich foods"],
    professionalTreatments: ["Botox", "Fillers", "Microneedling", "RF therapy"]
  },
  dark_circles: {
    topIngredients: ["Caffeine", "Vitamin C", "Retinol", "Peptides", "Vitamin K"],
    lifestyle: ["Get 7-8 hours sleep", "Stay hydrated", "Use cold compresses", "Elevate head while sleeping"],
    professionalTreatments: ["PRP", "Fillers", "Laser"]
  },
  sensitivity: {
    topIngredients: ["Aloe Vera", "Centella Asiatica", "Ceramides", "Hyaluronic Acid", "Oat Extract"],
    lifestyle: ["Use fragrance-free products", "Avoid hot water on face", "Patch test new skincare", "Wear sunscreen daily"],
    professionalTreatments: ["Calming facial", "Barrier repair treatment", "LED light therapy"]
  },
  dryness: {
    topIngredients: ["Hyaluronic Acid", "Ceramides", "Glycerin", "Squalane", "Shea Butter"],
    lifestyle: ["Drink 2L water daily", "Use humidifier", "Shorter showers", "Limit exfoliation"],
    professionalTreatments: ["Hydra facial", "Dermaplaning"]
  },
  unevenTone: {
    topIngredients: ["Vitamin C", "Niacinamide", "Alpha Arbutin", "Licorice Root Extract", "Tranexamic Acid"],
    lifestyle: ["Wear sunscreen daily", "Avoid picking acne scars", "Stay hydrated", "Eat antioxidant-rich foods"],
    professionalTreatments: ["Chemical peel", "Laser toning", "Microdermabrasion"]
  },
  dullness: {
    topIngredients: ["Vitamin C", "Glycolic Acid", "Lactic Acid", "Hyaluronic Acid", "Papaya Enzyme"],
    lifestyle: ["Get enough sleep", "Drink plenty of water", "Exfoliate gently 1-2 times a week", "Eat fresh fruits and vegetables"],
    professionalTreatments: ["HydraFacial", "Chemical peel", "Brightening facial"]
  },
  large_pores: {
    topIngredients: ["Niacinamide", "Salicylic Acid", "AHAs", "Retinol", "Clay"],
    lifestyle: ["Double cleanse", "Don't squeeze pores", "Use SPF"],
    professionalTreatments: ["Chemical peel", "Laser resurfacing"]
  }
};

/**
 * Simulate AI skin analysis (replace with actual ML model or Google Vision API)
 */
function analyzeSkinFromData(analysisData) {
  const { selfReported, imageAnalysis } = analysisData;

  // If no image, use self-reported data
  if (!imageAnalysis && selfReported) {
    return buildAnalysisResult(selfReported.skinType, selfReported.concerns, selfReported.skinTone, 0.85);
  }

  // Combine image analysis with self-reported
  const skinType = imageAnalysis?.predictedSkinType || selfReported?.skinType || 'normal';
  const concerns = imageAnalysis?.detectedConcerns || selfReported?.concerns || [];
  const skinTone = imageAnalysis?.predictedTone || selfReported?.skinTone || 'medium';
  const confidence = imageAnalysis?.confidence || 0.75;

  return buildAnalysisResult(skinType, concerns, skinTone, confidence);
}

function buildAnalysisResult(skinType, concerns, skinTone, confidence) {
  const profile = SKIN_TYPE_PROFILES[skinType] || SKIN_TYPE_PROFILES.normal;

  const concernDetails = concerns.map(c => ({
    concern: c,
    ...(CONCERN_TREATMENTS[c] || {})
  }));

  const skinScore = calculateSkinScore(concerns);

  return {
    skinType,
    skinTone,
    confidence: Math.round(confidence * 100),
    skinScore,
    description: profile.description,
    morningRoutine: profile.morning_routine,
    eveningRoutine: profile.evening_routine,
    ingredientsToUse: profile.ingredients_to_use,
    ingredientsToAvoid: profile.ingredients_to_avoid,
    concerns: concernDetails,
    fitzpatrickScale: getFitzpatrickScale(skinTone),
    undertone: getUndertone(skinTone),
    analysisTimestamp: new Date().toISOString()
  };
}

function calculateSkinScore(concerns) {
  const baseScore = 100;
  const deductions = { acne: 20, wrinkles: 15, pigmentation: 10, large_pores: 8, dark_circles: 5, dryness: 8, sensitivity: 10, redness: 8 };
  const totalDeduction = concerns.reduce((sum, c) => sum + (deductions[c] || 5), 0);
  return Math.max(30, Math.min(100, baseScore - totalDeduction));
}

function getFitzpatrickScale(skinTone) {
  const map = { fair: 1, medium: 3, wheatish: 4, dusky: 5, dark: 6 };
  return map[skinTone] || 3;
}

function getUndertone(skinTone) {
  if (skinTone === 'fair') return 'Cool/Neutral';
  if (skinTone === 'medium') return 'Neutral/Warm';
  if (skinTone === 'wheatish') return 'Warm/Golden';
  if (skinTone === 'dusky') return 'Warm/Deep';
  if (skinTone === 'dark') return 'Deep/Rich';
  return 'Neutral';
}

/**
 * Get product recommendations based on skin analysis
 */
function getRecommendationFilters(analysisResult) {
  const { skinType, concerns, skinTone } = analysisResult;

  return {
    skinType: skinType,
    skinConcerns: concerns.map(c => c.concern),
    skinTone: skinTone,
    priorityIngredients: analysisResult.ingredientsToUse,
    avoidIngredients: analysisResult.ingredientsToAvoid
  };
}

module.exports = {
  analyzeSkinFromData,
  buildAnalysisResult,
  getRecommendationFilters,
  SKIN_TYPE_PROFILES,
  CONCERN_TREATMENTS
};
