
const fs = require('fs');
const path = require('path');

const productsPath = path.join(__dirname, 'products.js');
const products = require(productsPath);

products.forEach(p => {
  if (p.platforms && Array.isArray(p.platforms)) {
    p.platforms.forEach(pl => {
      // Create a search URL on the platform for the specific product name so it doesn't 404
      if (pl.platform.toLowerCase() === 'amazon') {
        pl.url = `https://www.amazon.in/s?k=${encodeURIComponent(p.brand + ' ' + p.name)}`;
      } else if (pl.platform.toLowerCase() === 'nykaa') {
        pl.url = `https://www.nykaa.com/search/result/?q=${encodeURIComponent(p.brand + ' ' + p.name)}`;
      } else if (pl.platform.toLowerCase() === 'flipkart') {
        pl.url = `https://www.flipkart.com/search?q=${encodeURIComponent(p.brand + ' ' + p.name)}`;
      } else if (pl.platform.toLowerCase() === 'meesho') {
        pl.url = `https://www.meesho.com/search?q=${encodeURIComponent(p.brand + ' ' + p.name)}`;
      } else {
        pl.url = `https://www.google.com/search?q=${encodeURIComponent(pl.platform + ' ' + p.brand + ' ' + p.name)}`;
      }
    });
  }
});

fs.writeFileSync(productsPath, 'module.exports = ' + JSON.stringify(products, null, 2) + ';\n');
console.log('Fixed product URLs!');