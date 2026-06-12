# Featured Collection — Premium Showroom

A drop-in replacement for your Featured Collection section: black / white / gold,
fullscreen zoomable gallery, quick view, badges, ratings, discount pricing and a
WhatsApp inquiry button.

## 1. Files

```
showroom-components/
├── FeaturedCollection.jsx   ← main section (use this in your page)
├── ProductCard.jsx
├── GalleryModal.jsx
├── QuickViewModal.jsx
├── StarRating.jsx
├── Badge.jsx
├── sampleData.js             ← example data shape, replace with Supabase data
└── showroom.css               ← fonts, colors, hover-frame & animations
```

Copy the whole `showroom-components` folder into `src/components/` (or wherever
your other components live).

## 2. Install the icon package (if you don't have it already)

```bash
npm install lucide-react
```

Everything else (fonts, animations, color tokens) is included in `showroom.css`,
which is imported automatically by `FeaturedCollection.jsx`.

## 3. Use it

```jsx
import FeaturedCollection from "./components/showroom-components/FeaturedCollection";
import { sampleProducts } from "./components/showroom-components/sampleData";

export default function HomePage() {
  return (
    <FeaturedCollection
      products={sampleProducts}
      whatsappNumber="2547XXXXXXXX" // Craftsman Galore's WhatsApp number, no "+"
      allProductsHref="/shop"
      onAddToCart={(product) => {
        // wire this into your existing cart logic / Supabase
        console.log("add to cart:", product);
      }}
    />
  );
}
```

## 4. Connecting to Supabase

Map each product row + its images from `craftsman-images` to this shape:

```js
{
  id: row.id,
  category: row.category,            // e.g. "Office", "Custom Glass"
  name: row.name,
  description: row.description,
  images: [
    // public URLs from the craftsman-images bucket, one per angle
    supabase.storage.from("craftsman-images").getPublicUrl(`products/${row.id}/front.jpg`).data.publicUrl,
    supabase.storage.from("craftsman-images").getPublicUrl(`products/${row.id}/side.jpg`).data.publicUrl,
    // ... add as many angles as the admin uploads
  ],
  price: row.price,
  originalPrice: row.original_price ?? null,   // null/undefined = no discount shown
  rating: row.rating ?? 0,
  reviews: row.review_count ?? 0,
  badges: row.badges ?? [],            // any of: "new" | "bestseller" | "sale" | "limited"
}
```

`images[0]` is used as the card cover. Clicking it (or "Quick View" → click image)
opens the fullscreen gallery with all images and thumbnail navigation.

## 5. What's covered

- **Full-width contained images** — `object-fit: contain` on a neutral stone
  background, so product photos of any aspect ratio show completely, never cropped.
- **Uniform cards** — CSS grid stretches every card to the tallest row item;
  descriptions are clamped to 2 lines so card heights stay consistent.
- **Hover zoom** — image scales up smoothly on hover, with gold "gallery frame"
  corners drawing in (the signature detail).
- **Fullscreen gallery modal** — opens on image click, supports:
  - mouse-wheel zoom (desktop)
  - pinch-to-zoom + drag-to-pan (mobile)
  - double-click / double-tap to toggle zoom
  - thumbnail strip for multiple angles, arrow/keyboard navigation, swipe on mobile
- **Badges** — `new`, `bestseller`, `sale`, `limited` (limited pulses gently).
- **Discount pricing** — set `originalPrice` higher than `price` and the card
  automatically shows the strike-through price and a "-X%" gold badge.
- **Star ratings + review count** via `StarRating`.
- **Quick View** — modal preview with its own mini gallery, without leaving the grid.
- **WhatsApp inquiry button** — pre-fills a message with the product name and price.
- **Lazy loading** — `loading="lazy"` on all images, plus a shimmer skeleton while
  the cover image loads.
- **Responsive** — 1 column on mobile, 2 on tablet, 3–4 on desktop.

## 6. Customizing the palette

All colors live as CSS variables at the top of `showroom.css`:

```css
--sc-ink: #0b0b0c;     /* near-black */
--sc-paper: #ffffff;   /* white */
--sc-stone: #f6f4f0;   /* image background */
--sc-gold: #c7a24a;    /* accent */
--sc-gold-soft: #efe3c8;
--sc-ash: #767371;     /* muted text */
--sc-line: #e8e4dd;    /* borders */
```

Adjust `--sc-gold` if you want a warmer/cooler gold to match your logo exactly.
