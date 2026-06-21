// Seed script: inserts the 5 executive office chairs into Supabase
// Run with: node seed-office-chairs.js

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://xjrbztxuteqhctsvlvhf.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhqcmJ6dHh1dGVxaGN0c3ZsdmhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODExOTM4MzAsImV4cCI6MjA5Njc2OTgzMH0._r4Ust0cOJV1TBJ_PwT_QJ7BkNrz1OTqiQf4jEk_SLQ';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const products = [
  {
    name: 'Brown Executive Leather Chair',
    category: 'Office',
    subcategory: 'Office Chairs, Executive Seats',
    price: 18000,
    discount_price: 13000,
    description: 'Premium brown executive leather office chair with adjustable height, padded armrests, and ergonomic lumbar support. Perfect for offices and home workspaces in Kenya. Swivel base with smooth-rolling casters.',
    in_stock: true,
    featured: false,
    badge: 'Sale',
    rating: 4.5,
    review_count: 12,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&q=80&w=800',
    delivery_nairobi: 600,
    delivery_outside: JSON.stringify({ Mombasa: 1200, Kisumu: 1500, Nakuru: 1000, Eldoret: 1500 }),
    transport_method: 'Pickup Van',
  },
  {
    name: 'Black Executive Visitors Chair',
    category: 'Office',
    subcategory: 'Office Chairs, Executive Seats',
    price: 16500,
    discount_price: 14000,
    description: 'Black executive visitors chair with chrome cantilever base and premium PU leather upholstery. Ideal for reception areas, boardrooms, and offices in Nairobi. No wheels — stable floor-fixed design.',
    in_stock: true,
    featured: false,
    badge: 'Sale',
    rating: 4.3,
    review_count: 8,
    image: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&q=80&w=800',
    delivery_nairobi: 600,
    delivery_outside: JSON.stringify({ Mombasa: 1200, Kisumu: 1500, Nakuru: 1000, Eldoret: 1500 }),
    transport_method: 'Pickup Van',
  },
  {
    name: 'High Back Executive Office Chair',
    category: 'Office',
    subcategory: 'Executive Seats',
    price: 18000,
    discount_price: 15000,
    description: 'High back executive office chair in black PU leather with chrome armrests and swivel base. Designed for comfort during long working hours with adjustable seat height and strong caster wheels.',
    in_stock: true,
    featured: true,
    badge: 'Sale',
    rating: 4.6,
    review_count: 24,
    image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c5?auto=format&fit=crop&q=80&w=800',
    delivery_nairobi: 600,
    delivery_outside: JSON.stringify({ Mombasa: 1200, Kisumu: 1500, Nakuru: 1000, Eldoret: 1500 }),
    transport_method: 'Pickup Van',
  },
  {
    name: 'Luxury High Back Executive Chair for Office',
    category: 'Office',
    subcategory: 'Executive Seats',
    price: 18000,
    discount_price: 15000,
    description: 'Luxury high-back executive office chair with padded seat, adjustable armrests, and smooth-rolling casters. Upholstered in premium black PU leather for a professional look in any office setting.',
    in_stock: true,
    featured: false,
    badge: 'Sale',
    rating: 4.7,
    review_count: 19,
    image: 'https://images.unsplash.com/photo-1541558869434-2840d308329a?auto=format&fit=crop&q=80&w=800',
    delivery_nairobi: 600,
    delivery_outside: JSON.stringify({ Mombasa: 1200, Kisumu: 1500, Nakuru: 1000, Eldoret: 1500 }),
    transport_method: 'Pickup Van',
  },
  {
    name: 'Ergonomic High Back Executive Office Chair',
    category: 'Office',
    subcategory: 'Executive Seats',
    price: 18000,
    discount_price: 15000,
    description: 'Ergonomic high-back executive office chair built for all-day comfort. Features adjustable lumbar support, padded armrests, 360-degree swivel, and a sturdy chrome base with smooth casters. Black PU leather finish.',
    in_stock: true,
    featured: true,
    badge: 'Best Seller',
    rating: 4.8,
    review_count: 31,
    image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&q=80&w=800',
    delivery_nairobi: 600,
    delivery_outside: JSON.stringify({ Mombasa: 1200, Kisumu: 1500, Nakuru: 1000, Eldoret: 1500 }),
    transport_method: 'Pickup Van',
  },
];

async function seed() {
  console.log('Seeding 5 office chairs...');
  const { data, error } = await supabase.from('products').insert(products).select();
  if (error) {
    console.error('Error inserting products:', error.message);
    process.exit(1);
  }
  console.log(`✅ Successfully inserted ${data.length} products:`);
  data.forEach((p) => console.log(`  - ${p.name} (id: ${p.id})`));
}

seed();
