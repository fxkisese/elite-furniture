/**
 * Sample data showing the shape ProductCard / GalleryModal / QuickViewModal expect.
 *
 * Replace `images` arrays with URLs from your Supabase `craftsman-images` bucket
 * (e.g. one entry per angle: front, side, detail shot, in-context/room shot).
 *
 * badges: any combination of "new" | "bestseller" | "sale" | "limited"
 * originalPrice: only set this when the item is discounted — ProductCard
 *                 automatically shows the strike-through price + % off badge.
 */
export const sampleProducts = [
  {
    id: "headrest-chair",
    category: "Office",
    name: "Ergonomic Mesh Headrest Chair",
    description:
      "Breathable mesh back, adjustable headrest and lumbar support, and a smooth-glide base built for long work days.",
    images: [
      "/products/headrest-chair/front.jpg",
      "/products/headrest-chair/side.jpg",
      "/products/headrest-chair/base.jpg",
    ],
    price: 8500,
    originalPrice: null,
    rating: 4.6,
    reviews: 34,
    badges: ["bestseller"],
  },
  {
    id: "desk-chair-set",
    category: "Office",
    name: "1.2m Executive Desk & Headrest Chair Set",
    description:
      "Sleek, durable, and designed for productivity. This contemporary set pairs a 1.2m workstation with a matching mesh headrest chair.",
    images: [
      "/products/desk-chair-set/full-set.jpg",
      "/products/desk-chair-set/desk-detail.jpg",
      "/products/desk-chair-set/chair-detail.jpg",
      "/products/desk-chair-set/room.jpg",
    ],
    price: 15500,
    originalPrice: 18500,
    rating: 4.8,
    reviews: 21,
    badges: ["sale", "limited"],
  },
  {
    id: "glass-dining-table",
    category: "Custom Glass",
    name: "Tempered Glass Dining Table",
    description:
      "10mm tempered glass top on a powder-coated steel frame — custom sizing available for any dining space.",
    images: [
      "/products/glass-dining-table/full.jpg",
      "/products/glass-dining-table/detail.jpg",
    ],
    price: 24000,
    originalPrice: null,
    rating: 4.9,
    reviews: 12,
    badges: ["new"],
  },
  {
    id: "l-shaped-desk",
    category: "Office",
    name: "L-Shaped Executive Desk",
    description:
      "Spacious L-shaped layout with cable management and soft-close drawers — built for home offices and executive suites.",
    images: [
      "/products/l-shaped-desk/full.jpg",
      "/products/l-shaped-desk/storage.jpg",
      "/products/l-shaped-desk/room.jpg",
    ],
    price: 19000,
    originalPrice: 22000,
    rating: 4.7,
    reviews: 40,
    badges: ["bestseller", "sale"],
  },
];
