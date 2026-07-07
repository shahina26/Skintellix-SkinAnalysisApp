const express = require('express');
const router = express.Router();
const { analyzeSkinFromData, getRecommendationFilters } = require('../services/skinAnalysisService');
const PRODUCTS = require('../data/products');

// POST /api/skin/analyze - Analyze skin from quiz answers
router.post('/analyze', (req, res) => {
  try {
    const { skinType, concerns, skinTone, age, gender, allergies, budget } = req.body;

    if (!skinType) {
      return res.status(400).json({ success: false, error: 'skinType is required' });
    }

    const analysisData = {
      selfReported: { skinType, concerns: concerns || [], skinTone: skinTone || 'medium' }
    };

    const result = analyzeSkinFromData(analysisData);
    
    // Build product recommendations from dataset
    let products = PRODUCTS.map((p, i) => ({
      ...p,
      _id: `prod_${String(i + 1).padStart(4, '0')}`,
      lowestPrice: p.platforms.length ? Math.min(...p.platforms.map(pl => pl.price)) : p.mrp
    }));

    // Filter by skin type
    let skincare = products.filter(p =>
      p.productType === 'skincare' &&
      (p.suitableFor?.skinType?.includes(skinType) || p.suitableFor?.skinType?.includes('all'))
    );

    // Prioritize by concerns
    if (concerns && concerns.length > 0) {
      skincare = skincare.sort((a, b) => {
        const aMatch = (a.suitableFor?.skinConcerns || []).filter(c => concerns.includes(c)).length;
        const bMatch = (b.suitableFor?.skinConcerns || []).filter(c => concerns.includes(c)).length;
        return bMatch - aMatch;
      });
    }

    // Budget filtering
    let budgetFilter = { min: 0, max: Infinity };
    if (budget === 'budget') budgetFilter = { min: 0, max: 500 };
    if (budget === 'mid-range') budgetFilter = { min: 200, max: 2000 };
    if (budget === 'premium') budgetFilter = { min: 500, max: 5000 };
    if (budget === 'luxury') budgetFilter = { min: 1000, max: Infinity };

    skincare = skincare.filter(p => p.lowestPrice >= budgetFilter.min && p.lowestPrice <= budgetFilter.max);

    // Build routine recommendations by category
    const routineProducts = {
      cleanser: skincare.filter(p => p.category === 'cleanser').slice(0, 3),
      toner: skincare.filter(p => p.category === 'toner').slice(0, 2),
      serum: skincare.filter(p => p.category === 'serum').slice(0, 4),
      moisturizer: skincare.filter(p => p.category === 'moisturizer').slice(0, 3),
      sunscreen: skincare.filter(p => p.category === 'sunscreen').slice(0, 3),
      face_mask: skincare.filter(p => p.category === 'face_mask').slice(0, 2),
      eye_cream: skincare.filter(p => p.category === 'eye_cream').slice(0, 2)
    };

    res.json({
      success: true,
      data: {
        analysis: result,
        recommendations: {
          routine: routineProducts,
          topPicks: skincare.slice(0, 12),
          totalFound: skincare.length
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// POST /api/skin/analyze-image - Analyze from uploaded image
router.post('/analyze-image', (req, res) => {
  try {
    // This would integrate with Google Vision API or custom ML model
    // For now, return intelligent mock based on common Indian skin concerns
    const mockImageResult = {
      predictedSkinType: 'combination',
      predictedTone: 'wheatish',
      detectedConcerns: ['pigmentation', 'large_pores'],
      confidence: 0.82
    };

    const analysisData = { imageAnalysis: mockImageResult };
    const result = analyzeSkinFromData(analysisData);

    res.json({
      success: true,
      data: {
        analysis: result,
        imageInsights: {
          detected: ["Combination skin zones", "Pigmentation spots", "Visible pores", "Healthy hydration levels"],
          recommendations: ["Start with a Vitamin C serum", "Use SPF daily", "Add niacinamide to your routine"]
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// GET /api/skin/quiz
router.get('/quiz', (req, res) => {
  res.json({
    success: true,
    data: {
      questions: [
        {
          id: 'skin_type',
          question: 'How does your skin feel by midday?',
          emoji: '🧴',
          options: [
            { value: 'oily', label: 'Shiny & greasy all over', description: 'Oily skin' },
            { value: 'dry', label: 'Tight & flaky', description: 'Dry skin' },
            { value: 'combination', label: 'Oily T-zone, dry cheeks', description: 'Combination skin' },
            { value: 'normal', label: 'Balanced & comfortable', description: 'Normal skin' },
            { value: 'sensitive', label: 'Reactive with redness', description: 'Sensitive skin' }
          ]
        },
        {
          id: 'skin_tone',
          question: 'What is your skin tone?',
          emoji: '🌟',
          options: [
            { value: 'fair', label: 'Fair', description: 'Light skin with pink/neutral undertones' },
            { value: 'medium', label: 'Medium', description: 'Neutral undertones' },
            { value: 'wheatish', label: 'Wheatish', description: 'Golden/warm undertones' },
            { value: 'dusky', label: 'Dusky', description: 'Deep warm undertones' },
            { value: 'dark', label: 'Deep/Rich', description: 'Rich deep skin tone' }
          ]
        },
        {
          id: 'concerns',
          question: 'What are your main skin concerns? (Select all that apply)',
          emoji: '🔍',
          multiple: true,
          options: [
            { value: 'acne', label: 'Acne & Breakouts', icon: '😤' },
            { value: 'pigmentation', label: 'Dark spots & Pigmentation', icon: '🎭' },
            { value: 'dryness', label: 'Dryness & Dehydration', icon: '💧' },
            { value: 'wrinkles', label: 'Fine lines & Wrinkles', icon: '⏰' },
            { value: 'dark_circles', label: 'Dark circles', icon: '👁️' },
            { value: 'sensitivity', label: 'Sensitivity & Redness', icon: '🌹' },
            { value: 'uneven_tone', label: 'Uneven skin tone', icon: '🎨' },
            { value: 'large_pores', label: 'Large pores', icon: '🔬' },
            { value: 'dullness', label: 'Dull & Tired skin', icon: '✨' }
          ]
        },
        {
          id: 'budget',
          question: 'What is your skincare budget per product?',
          emoji: '💰',
          options: [
            { value: 'budget', label: 'Budget-friendly', description: 'Under ₹500' },
            { value: 'mid-range', label: 'Mid-range', description: '₹500 - ₹2,000' },
            { value: 'premium', label: 'Premium', description: '₹2,000 - ₹5,000' },
            { value: 'luxury', label: 'Luxury', description: '₹5,000+' }
          ]
        },
        {
          id: 'preferences',
          question: 'Any product preferences?',
          emoji: '🌿',
          multiple: true,
          optional: true,
          options: [
            { value: 'vegan', label: 'Vegan', icon: '🌱' },
            { value: 'crueltyFree', label: 'Cruelty-free', icon: '🐰' },
            { value: 'natural', label: 'Natural/Organic', icon: '🌿' },
            { value: 'ayurvedic', label: 'Ayurvedic', icon: '🕉️' },
            { value: 'indianBrands', label: 'Indian brands', icon: '🇮🇳' },
            { value: 'fragranceFree', label: 'Fragrance-free', icon: '🚫' }
          ]
        }
      ]
    }
  });
});

module.exports = router;
