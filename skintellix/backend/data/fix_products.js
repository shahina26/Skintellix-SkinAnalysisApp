const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'products.js');
let content = fs.readFileSync(productsPath, 'utf8');

// We need to parse the products array out of the file, modify it, and write it back.
// Since it's a module.exports = [ ... ], we can require it, modify the objects, and rewrite the file.
const products = require(productsPath);

const imageMap = {
  cleanser: 'https://www.cetaphil.in/dw/image/v2/BGGN_PRD/on/demandware.static/-/Sites-galderma-in-m-catalog/default/dw311450bb/GSC%20Revive%20A+/236%20ml/ATF/1.FoP-236.png?sw=450&sh=450&sm=fit&q=85',
  serum: 'https://cdn.shopify.com/s/files/1/0014/3514/0183/files/27551_H-8901030978951.jpg?v=1715413812',
  moisturizer: 'https://images.mamaearth.in/catalog/product/h/o/honey-malai-oil-free-face-moisturizer_1.jpg?format=auto&height=600',
  sunscreen: 'https://instamart-media-assets.swiggy.com/swiggy/image/upload/fl_lossy,f_auto,q_auto/NI_CATALOG/IMAGES/CIW/2026/2/24/16638aaf-40e1-4e9d-8908-c60f6e6c6b67_743138_1.png',
  foundation: 'https://verymiss.in/cdn/shop/files/04210E63-B9D7-4433-A790-921F6B46C25E.jpg?v=1757050305',
  lipstick: 'https://www.reneecosmetics.in/cdn/shop/files/SOUL_Matte-Lock-Lipstick_01-min_9a4ce0c2-ebd1-47e4-8721-84ed655d740a.jpg?v=1742486354&width=1946',
  eyeliner: 'https://ssbimages.ssbeauty.in/pub/media/catalog/product/images/A22LAK030895678/A22LAK030895678_base.jpg',
  mascara: 'https://m.media-amazon.com/images/I/61ef0UvHGLL.jpg',
  blush: 'https://img.clevup.in/365412/swiss-beauty-cheek-it-up-blush-for-cheeks-with-jo-1732390725122_SKU-10120_0.jpg?width=600&format=webp',
  highlighter: 'https://m.media-amazon.com/images/I/91k-S3kHPyL.jpg',
  shampoo: 'https://images.mamaearth.in/catalog/product/p/d/pdp_fop_10.jpg?format=auto&height=600',
  hair_oil: 'https://www.thenaturalwash.com/cdn/shop/files/Product_e36c1c11-1a93-43a1-9ba3-1b00454ffff1.jpg?v=1775112341&width=1445',
  concealer: 'https://www.lagirlusa.com/cdn/shop/files/GC955_prod_img_1.jpg?format=webp&v=1699773048&width=1024',
  eyeshadow: 'https://images-static.nykaa.com/media/catalog/product/1/e/1ed1210NYSWISSB00255_x1.jpg',
  lip_gloss: 'https://media6.ppl-media.com/tr:h-235,w-235,c-at_max,dpr-2,q-40/static/img/product/324018/dot-and-key-strawberry-lip-balm-for-soft-and-naturally-pink-lips-spf-30-and-vitamin-c-e-fades-lip-pigmentation-for-dark-lips-12g_1_display_1769581352_3b4017e3.jpg',
  primer: 'https://swissbeauty.in/cdn/shop/products/SB-510_01D.jpg?v=1748634129&width=620',
  conditioner: 'https://images.mamaearth.in/catalog/product/r/i/rice-conditioner_1_1.jpg?format=auto&height=600',
  hair_mask: 'https://thetribeconcepts.com/cdn/shop/files/ROOT_STRENGTHENING_AND_CONDITIONING_HAIR_MASK_Large_5bd3215d-8053-4700-a5a0-4a3ab839db38.webp?v=1725263630&width=1280'
};

const defaultImage = 'https://www.shutterstock.com/image-photo/copy-space-geometric-shapes-made-260nw-2071817510.jpg';

products.forEach(p => {
  const img = imageMap[p.category] || defaultImage;
  p.thumbnail = img;
  p.images = [img];
});

// Add new makeup products
const newProducts = [
  {
    name: "Nude Palette Eyeshadow", brand: "Huda Beauty", category: "eyeshadow", productType: "makeup",
    description: "Highly pigmented eyeshadow palette.", mrp: 1500, platforms: [{ platform: "Nykaa", price: 1450, url: "https://nykaa.com", inStock: true }],
    trending: true, bestseller: true, suitableFor: { skinTone: ["all"], skinType: ["all"] }, thumbnail: imageMap.eyeshadow, images: [imageMap.eyeshadow]
  },
  {
    name: "Gloss Bomb Universal Lip Luminizer", brand: "Fenty Beauty", category: "lip_gloss", productType: "makeup",
    description: "Ultimate lip gloss with explosive shine.", mrp: 1800, platforms: [{ platform: "Nykaa", price: 1800, url: "https://nykaa.com", inStock: true }],
    trending: true, bestseller: true, suitableFor: { skinTone: ["all"], skinType: ["all"] }, thumbnail: imageMap.lip_gloss, images: [imageMap.lip_gloss]
  },
  {
    name: "Poreless Putty Primer", brand: "e.l.f. Cosmetics", category: "primer", productType: "makeup",
    description: "Skin perfecting poreless putty primer.", mrp: 800, platforms: [{ platform: "Nykaa", price: 750, url: "https://nykaa.com", inStock: true }],
    trending: false, bestseller: true, suitableFor: { skinTone: ["all"], skinType: ["all"], skinConcerns: ["large_pores"] }, thumbnail: imageMap.primer, images: [imageMap.primer]
  },
  // Add new haircare products
  {
    name: "Argan Oil of Morocco Shampoo", brand: "OGX", category: "shampoo", productType: "haircare",
    description: "Renewing argan oil shampoo.", mrp: 750, platforms: [{ platform: "Amazon", price: 650, url: "https://amazon.in", inStock: true }],
    trending: true, bestseller: true, suitableFor: { skinTone: ["all"], skinType: ["all"] }, thumbnail: imageMap.shampoo, images: [imageMap.shampoo]
  },
  {
    name: "Onion Hair Oil", brand: "WOW Skin Science", category: "hair_oil", productType: "haircare",
    description: "Hair oil for hair fall control.", mrp: 599, platforms: [{ platform: "Amazon", price: 399, url: "https://amazon.in", inStock: true }],
    trending: true, bestseller: true, suitableFor: { skinTone: ["all"], skinType: ["all"] }, thumbnail: imageMap.hair_oil, images: [imageMap.hair_oil]
  },
  {
    name: "Keratin Smooth Conditioner", brand: "TRESemme", category: "conditioner", productType: "haircare",
    description: "Keratin smooth conditioner.", mrp: 450, platforms: [{ platform: "Amazon", price: 400, url: "https://amazon.in", inStock: true }],
    trending: false, bestseller: true, suitableFor: { skinTone: ["all"], skinType: ["all"] }, thumbnail: imageMap.conditioner, images: [imageMap.conditioner]
  }
];

const allProducts = [...products, ...newProducts];

fs.writeFileSync(productsPath, 'module.exports = ' + JSON.stringify(allProducts, null, 2) + ';\n');
console.log('Fixed products.js!');
