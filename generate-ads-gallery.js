/**
 * generate-ads-gallery.js
 * 
 * Queries Supabase for all products and hero slides, extracts image URLs,
 * and generates a static public/ads-gallery.html file that Google's ad
 * image scanner can crawl without needing JavaScript.
 * 
 * Usage:  node generate-ads-gallery.js
 * Run this before each deploy (or add to your build script).
 */

const SUPABASE_URL = 'https://xjrbztxuteqhctsvlvhf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcmJ6dHh1dGVxaGN0c3ZsdmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTM4MzAsImV4cCI6MjA5Njc2OTgzMH0._r4Ust0cOJV1TBJ_PwT_QJ7BkNrz1OTqiQf4jEk_SLQ';
const SITE_URL = 'https://www.furnitureelitespace.co.ke';

const fs = require('fs');
const path = require('path');

async function fetchFromSupabase(table, select = '*', filters = '') {
  const url = `${SUPABASE_URL}/rest/v1/${table}?select=${select}${filters}`;
  const res = await fetch(url, {
    headers: {
      'apikey': SUPABASE_ANON_KEY,
      'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  if (!res.ok) throw new Error(`Failed to fetch ${table}: ${res.status} ${res.statusText}`);
  return res.json();
}

function extractImages(product) {
  const images = [];
  
  // Try metadata images from delivery_outside JSON
  try {
    const meta = JSON.parse(product.delivery_outside || '{}').metadata || {};
    if (meta.images && Array.isArray(meta.images)) {
      images.push(...meta.images);
    }
  } catch (e) {}
  
  // Fallback to product.image
  if (images.length === 0 && product.image) {
    images.push(product.image);
  }
  
  // Filter out any non-URL values
  return images.filter(url => url && typeof url === 'string' && url.startsWith('http'));
}

function generateHTML(products, heroSlides) {
  const productEntries = products
    .map(p => {
      const imgs = extractImages(p);
      if (imgs.length === 0) return '';
      
      const name = p.name || 'Product';
      const category = p.category || '';
      const price = p.discount_price || p.price;
      
      return imgs.map((imgUrl, i) => `
      <div class="product-card">
        <img 
          src="${imgUrl}" 
          alt="${name}${imgs.length > 1 ? ` - Image ${i + 1}` : ''} | Elite Furniture Kenya" 
          width="800" 
          height="600" 
        />
        <div class="product-info">
          <h3>${name}</h3>
          ${category ? `<p class="category">${category}</p>` : ''}
          ${price ? `<p class="price">KSh ${Number(price).toLocaleString()}</p>` : ''}
        </div>
      </div>`).join('\n');
    })
    .filter(Boolean)
    .join('\n');

  const heroEntries = heroSlides
    .filter(s => s.image && s.image.startsWith('http'))
    .map(s => `
      <div class="hero-card">
        <img 
          src="${s.image}" 
          alt="Elite Furniture Showroom | Premium Furniture in Kenya" 
          width="1600" 
          height="900" 
        />
      </div>`)
    .join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Elite Furniture | Product Image Gallery for Google Ads</title>
  <meta name="description" content="Browse premium furniture images from Elite Furniture Kenya. Sofas, beds, dining tables, wardrobes, office furniture and more." />
  <meta name="robots" content="noindex, follow" />
  <meta property="og:title" content="Elite Furniture | Product Gallery" />
  <meta property="og:description" content="Premium custom furniture in Kenya - browse our full collection." />
  <meta property="og:url" content="${SITE_URL}/ads-gallery.html" />
  <meta property="og:type" content="website" />
  <link rel="icon" type="image/png" href="/favicon.png" />
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #fff; color: #333; padding: 40px 20px; }
    h1 { text-align: center; font-size: 28px; margin-bottom: 8px; }
    .subtitle { text-align: center; color: #666; margin-bottom: 40px; font-size: 16px; }
    h2 { font-size: 22px; margin: 40px 0 20px; border-bottom: 2px solid #D4AF37; padding-bottom: 8px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 20px; max-width: 1200px; margin: 0 auto; }
    .product-card, .hero-card { border: 1px solid #eee; overflow: hidden; }
    .product-card img, .hero-card img { width: 100%; height: auto; display: block; }
    .product-info { padding: 12px 16px; }
    .product-info h3 { font-size: 15px; margin-bottom: 4px; }
    .product-info .category { font-size: 12px; color: #888; text-transform: uppercase; letter-spacing: 0.1em; }
    .product-info .price { font-size: 14px; font-weight: 700; color: #0A0A0A; margin-top: 4px; }
    .logo-section { text-align: center; margin: 40px 0; }
    .logo-section img { max-width: 300px; }
  </style>
</head>
<body>
  <h1>Elite Furniture — Product Image Gallery</h1>
  <p class="subtitle">Premium custom furniture for homes and offices across Kenya</p>

  <!-- Logo -->
  <div class="logo-section">
    <img src="${SITE_URL}/logo.png" alt="Elite Furniture Logo" width="300" height="300" />
  </div>

  <!-- Hero / Showroom Images -->
  ${heroEntries ? `<h2>Showroom Highlights</h2>\n  <div class="grid">\n${heroEntries}\n  </div>` : ''}

  <!-- Product Images -->
  <h2>Our Products</h2>
  <div class="grid">
${productEntries}
  </div>

  <p style="text-align:center; margin-top:60px; color:#aaa; font-size:12px;">
    &copy; ${new Date().getFullYear()} Elite Furniture Kenya &mdash; 
    <a href="${SITE_URL}" style="color:#D4AF37;">Visit our website</a>
  </p>
</body>
</html>`;
}

async function main() {
  console.log('Fetching products from Supabase...');
  const products = await fetchFromSupabase('products', '*', '&in_stock=eq.true&order=created_at.desc');
  console.log(`  Found ${products.length} in-stock products`);

  console.log('Fetching hero slides...');
  const slides = await fetchFromSupabase('hero_slides', '*', '&order=created_at.desc');
  console.log(`  Found ${slides.length} hero slides`);

  // Count images
  let totalImages = 0;
  products.forEach(p => { totalImages += extractImages(p).length; });
  totalImages += slides.filter(s => s.image && s.image.startsWith('http')).length;
  console.log(`  Total images to include: ${totalImages}`);

  if (totalImages === 0) {
    console.error('ERROR: No images found! Check your Supabase data.');
    process.exit(1);
  }

  const html = generateHTML(products, slides);
  const outPath = path.join(__dirname, 'public', 'ads-gallery.html');
  fs.writeFileSync(outPath, html, 'utf8');
  console.log(`\nGenerated: ${outPath}`);
  console.log(`Contains ${totalImages} images for Google Ads scanner.`);
  console.log(`\nAfter deploying, test with:`);
  console.log(`  curl ${SITE_URL}/ads-gallery.html | head -100`);
  console.log(`  curl ${SITE_URL}/robots.txt`);
}

main().catch(err => {
  console.error('Failed:', err.message);
  process.exit(1);
});
