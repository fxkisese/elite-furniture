import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import FeaturedCollection from '@/components/showroom-components/FeaturedCollection';
import TestimonialsSection from '@/components/testimonials/TestimonialsSection';
import { useCart } from '@/lib/CartContext';
import { ChevronRight, CheckCircle, Lock, Truck, Headphones, Gem } from 'lucide-react';
import { supabase } from '@/lib/supabase';



const TRUST_POINTS = [
  'Quality Craftsmanship',
  'Affordable Pricing',
  'Delivery Across Kenya',
  'Custom Orders Available',
  'Professional Customer Service',
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [uncategorizedProducts, setUncategorizedProducts] = useState([]);
  const [heroSlides, setHeroSlides] = useState([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const { data: pData } = await supabase.from('products').select('*').eq('featured', true).limit(12);
        // Only keep products that have admin-uploaded images (stored in metadata)
        const withImages = (pData || []).filter(p => {
          try {
            const meta = JSON.parse(p.delivery_outside || '{}').metadata || {};
            return meta.images && meta.images.length > 0;
          } catch (e) { return false; }
        });
        setProducts(withImages);

        const { data: hData } = await supabase.from('hero_slides').select('image').order('created_at', { ascending: false });
        if (hData && hData.length > 0) {
          setHeroSlides(hData.map(d => d.image));
        } else {
          setHeroSlides(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90']);
        }

        const { data: uncatData } = await supabase.from('products').select('*').eq('category', 'Uncategorized').limit(16);
        const uncatWithImages = (uncatData || []).filter(p => {
          try {
            const meta = JSON.parse(p.delivery_outside || '{}').metadata || {};
            return (meta.images && meta.images.length > 0) || p.image;
          } catch (e) { return p.image; }
        });
        setUncategorizedProducts(uncatWithImages);
      } catch (err) {
        console.error(err);
      }
    }
    loadData();
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const heroTimer = setInterval(() => setCurrentSlideIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(heroTimer);
  }, [heroSlides]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: 'calc(100vh - 60px)', overflow: 'hidden', minHeight: '600px' }}>
        {/* Full-Cover Background Layer */}
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#050505' }}>
          {heroSlides.map((src, idx) => (
            <img
              key={`bg-${idx}`}
              src={src}
              alt=""
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%', height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                filter: 'grayscale(20%)',
                opacity: idx === currentSlideIdx ? 1 : 0,
                transform: idx === currentSlideIdx ? 'translateX(0)' : 'translateX(-2%)',
                transition: idx === currentSlideIdx
                  ? 'opacity 1.5s ease-in-out, transform 8s ease-out'
                  : 'opacity 1.5s ease-in-out, transform 0s',
                zIndex: 0,
              }}
            />
          ))}
          {/* Dark Overlay */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.5) 60%, rgba(0,0,0,0.3) 100%)', zIndex: 1 }} />
        </div>

        {/* Text Content */}
        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', alignItems: 'center',
          maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
        }}>
          <div style={{ maxWidth: '700px' }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '13px',
              fontWeight: 600,
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#E0E0E0',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              <span style={{ display: 'inline-block', width: '40px', height: '2px', backgroundColor: '#D4AF37' }} />
              NAIROBI, KENYA
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: 1.1,
              marginBottom: '2rem',
              textShadow: '0 4px 12px rgba(0,0,0,0.6)',
            }}>
              PREMIUM<br />
              <span style={{ color: '#D4AF37', fontWeight: 300 }}>FURNITURE</span><br />
              FOR MODERN<br />KENYAN HOMES & OFFICES
            </h1>

            <p style={{
              color: '#CCCCCC',
              fontSize: '16px',
              lineHeight: 1.8,
              marginBottom: '3.5rem',
              maxWidth: '500px',
              textShadow: '0 2px 4px rgba(0,0,0,0.5)',
            }}>
              Elegant, durable, and affordable furniture solutions crafted for homes, offices, and businesses across Kenya.
            </p>

            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                backgroundColor: '#FFFFFF', color: '#0A0A0A',
                padding: '14px 32px', textDecoration: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#333333'; e.currentTarget.style.color = '#FFFFFF'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0A0A0A'; }}
              >
                VIEW COLLECTION <ChevronRight size={14} />
              </Link>
              <Link to="/custom-orders" style={{
                backgroundColor: 'transparent', color: '#FFFFFF',
                border: '1px solid #FFFFFF', padding: '14px 32px',
                textDecoration: 'none',
                fontFamily: 'Space Grotesk, sans-serif',
                fontSize: '11px', fontWeight: 600,
                letterSpacing: '0.2em', textTransform: 'uppercase',
                display: 'inline-flex', alignItems: 'center', gap: '8px',
                transition: 'background 0.2s ease, color 0.2s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0A0A0A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF'; }}
              >
                GET A QUOTE
              </Link>
            </div>
          </div>
        </div>

        {/* Slide Dots */}
        {heroSlides.length > 1 && (
          <div style={{
            position: 'absolute', bottom: '2rem', right: '2rem', zIndex: 2,
            display: 'flex', gap: '8px', alignItems: 'center',
          }}>
            {heroSlides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlideIdx(idx)}
                style={{
                  width: idx === currentSlideIdx ? '28px' : '8px',
                  height: '8px',
                  borderRadius: idx === currentSlideIdx ? '4px' : '50%',
                  backgroundColor: idx === currentSlideIdx ? '#D4AF37' : 'rgba(255,255,255,0.4)',
                  border: 'none',
                  cursor: 'pointer',
                  padding: 0,
                  transition: 'all 0.4s ease',
                }}
              />
            ))}
          </div>
        )}

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
          zIndex: 2,
        }}>
          <span style={{ color: '#555555', fontSize: '9px', letterSpacing: '0.3em' }}>SCROLL</span>
          <div style={{ width: '1px', height: '40px', backgroundColor: '#2A2A2A', position: 'relative', overflow: 'hidden' }}>
            <div style={{
              position: 'absolute', top: 0, left: 0, width: '100%', height: '50%',
              backgroundColor: '#888888',
              animation: 'scrollDot 2s ease-in-out infinite',
            }} />
          </div>
        </div>
      </section>

      {/* Trust Banner Below Hero */}
      <div className="bg-white py-6 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center md:divide-x divide-gray-200">
            <div className="flex items-center justify-center space-x-3 px-2">
              <Lock strokeWidth={1.5} className="w-8 h-8 text-[#D4AF37]" />
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Pay After Delivery</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 px-2">
              <Truck strokeWidth={1.5} className="w-8 h-8 text-[#D4AF37]" />
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Nationwide Delivery</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 px-2">
              <CheckCircle strokeWidth={1.5} className="w-8 h-8 text-[#D4AF37]" />
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Custom Furniture</p>
              </div>
            </div>
            <div className="flex items-center justify-center space-x-3 px-2">
              <Gem strokeWidth={1.5} className="w-8 h-8 text-[#D4AF37]" />
              <div className="text-left">
                <p className="font-bold text-gray-900 text-sm">Premium Materials</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section Divider */}
      <div style={{ borderBottom: '2px solid #D4AF37' }} />

      {/* New Arrivals Showcase */}
      {uncategorizedProducts.length > 0 && (
        <section className="py-16 bg-white sm:py-24 border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl" style={{ fontFamily: 'Cinzel, serif' }}>
                New Arrivals Gallery
              </h2>
              <p className="mt-4 text-lg leading-8 text-gray-600">A sneak peek at our latest showroom additions.</p>
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {uncategorizedProducts.map(p => {
                let imgUrl = p.image;
                try {
                  const meta = JSON.parse(p.delivery_outside || '{}').metadata || {};
                  if (meta.images && meta.images.length > 0) imgUrl = meta.images[0];
                } catch (e) {}
                
                return (
                  <div key={p.id} className="relative group overflow-hidden rounded-lg bg-gray-100 aspect-square shadow-sm">
                    <img src={imgUrl} alt="New Arrival" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Shop By Categories */}
      <ShopByCategories />

      {/* Section Divider */}
      <div style={{ borderBottom: '1px solid #E5E5E5' }} />

      {/* Featured Products */}
      <FeaturedCollection
        products={products.map(p => {
          let meta = {};
          try { meta = JSON.parse(p.delivery_outside || '{}').metadata || {}; } catch (e) { }
          return {
            id: p.id,
            category: p.category,
            name: p.name,
            description: p.description,
            images: meta.images && meta.images.length > 0 ? meta.images : [],
            price: p.discount_price || p.price,
            originalPrice: p.discount_price ? p.price : null,
            rating: p.rating || 5.0,
            reviews: p.review_count || 0,
            badges: p.badge ? [p.badge] : [],
            piece_price: meta.piece_price || p.piece_price,
            size: meta.size || p.size,
            combo_items: meta.combo_items || [],
            delivery_outside: p.delivery_outside
          };
        })}
        whatsappNumber="254141484249"
        allProductsHref="/products"
        onAddToCart={addToCart}
      />

      {/* Section Divider */}
      <div style={{ borderBottom: '1px solid #2A2A2A' }} />

      {/* Why Choose Us */}
      <section style={{ backgroundColor: '#111111', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '0.3em', color: '#555555', textTransform: 'uppercase', marginBottom: '1rem' }}>
                OUR STANDARDS
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 'clamp(1.8rem, 4vw, 3rem)', letterSpacing: '-0.04em', color: '#FFFFFF',
                marginBottom: '2.5rem',
              }}>
                WHY CHOOSE<br />
                <span style={{ color: '#D4AF37' }}>FURNITURE</span><br />ELITE SPACE?
              </h2>
              <p style={{ color: '#555555', fontSize: '14px', lineHeight: 1.8, maxWidth: '380px' }}>
                We understand that your space reflects who you are. Every piece we craft is designed to stand the test of time — both in quality and aesthetic.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {TRUST_POINTS.map((point, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: '1rem',
                  padding: '1.25rem 0',
                  borderBottom: '1px solid #2A2A2A',
                }}>
                  <div style={{
                    width: '24px', height: '24px', backgroundColor: '#FFFFFF',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CheckCircle size={14} color="#0A0A0A" />
                  </div>
                  <span style={{
                    fontFamily: 'Space Grotesk, sans-serif',
                    fontWeight: 500, fontSize: '14px', color: '#FFFFFF', letterSpacing: '0.02em',
                  }}>
                    {point}
                  </span>
                  <span style={{ marginLeft: 'auto', fontFamily: 'JetBrains Mono, monospace', fontSize: '11px', color: '#333333' }}>
                    0{i + 1}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Section Divider */}
      <div style={{ borderBottom: '1px solid #2A2A2A' }} />

      {/* Testimonials */}
      <TestimonialsSection />

      {/* Section Divider */}
      <div style={{ borderBottom: '1px solid #2A2A2A' }} />

      {/* Location Map */}
      <section style={{ backgroundColor: '#0A0A0A', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '0.3em', color: '#555555', textTransform: 'uppercase', marginBottom: '3rem', textAlign: 'center' }}>
            VISIT OUR SHOWROOM
          </div>
          <div style={{
            width: '100%',
            height: '400px',
            borderRadius: '8px',
            overflow: 'hidden',
            border: '1px solid #1E1E1E',
            backgroundColor: '#111',
          }}>
            <iframe
              src="https://maps.google.com/maps?q=PV6W%2B4Q+Nairobi&z=16&output=embed"
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(100%) invert(92%) contrast(83%)' }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Elite Furniture Showroom Location"
            ></iframe>
          </div>
        </div>
      </section>

      {/* TikTok Section */}
      <section style={{ backgroundColor: '#0A0A0A', padding: '5rem 2rem', borderTop: '1px solid #2A2A2A' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '0.3em', color: '#555555', textTransform: 'uppercase', marginBottom: '1rem' }}>
            FOLLOW US
          </div>
          <h2 style={{
            fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
            fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', letterSpacing: '-0.03em',
            color: '#FFFFFF', marginBottom: '0.5rem',
          }}>
            WE'RE ON <span style={{ color: '#D4AF37' }}>TIKTOK</span>
          </h2>
          <p style={{ color: '#555555', fontSize: '14px', marginBottom: '2.5rem' }}>
            Watch our furniture in action — showroom tours, styling tips &amp; real setups.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <TikTokEmbed />
          </div>
          <a
            href="https://www.tiktok.com/@elitespacefurniture"
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              marginTop: '2rem',
              backgroundColor: '#D4AF37', color: '#0A0A0A',
              padding: '12px 28px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px', fontWeight: 700, letterSpacing: '0.2em',
              textDecoration: 'none', textTransform: 'uppercase',
            }}
          >
            FOLLOW US ON TIKTOK →
          </a>
        </div>
      </section>

      {/* Section Divider */}
      <div style={{ borderBottom: '1px solid #2A2A2A' }} />

      {/* CTA Banner */}
      <section style={{
        backgroundColor: '#FFFFFF', padding: '7rem 2rem',
        borderTop: '2px solid #D4AF37',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
          <div>
            <h2 style={{
              fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', letterSpacing: '-0.04em',
              color: '#0A0A0A', marginBottom: '0.5rem',
            }}>
              NEED SOMETHING CUSTOM?
            </h2>
            <p style={{ color: '#555555', fontSize: '14px' }}>
              We build furniture to your exact specifications and measurements.
            </p>
          </div>
          <Link to="/custom-orders" style={{
            backgroundColor: '#0A0A0A', color: '#FFFFFF',
            padding: '16px 40px', textDecoration: 'none',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.2em', textTransform: 'uppercase',
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            border: '1px solid #0A0A0A',
            transition: 'background 0.2s ease, color 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#333333'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = '#0A0A0A'; }}
          >
            REQUEST A QUOTE <ChevronRight size={14} />
          </Link>
        </div>
      </section>
    </PageLayout>
  );
}

function TikTokEmbed() {
  return (
    <div style={{
      width: '100%',
      maxWidth: '1100px',
      borderRadius: '12px',
      overflow: 'hidden',
      border: '1px solid #2A2A2A',
      backgroundColor: '#111',
    }}>
      <iframe
        src="https://www.tiktok.com/embed/@elitespacefurniture"
        style={{
          width: '100%',
          height: '700px',
          border: 'none',
          display: 'block',
        }}
        allow="autoplay; encrypted-media"
        allowFullScreen
        title="Elite Space Furniture on TikTok"
        loading="lazy"
      />
    </div>
  );
}

// 8 categories shown in "Shop By Categories" — images come from admin-uploaded products
const CATEGORY_SLUGS = [
  { name: 'Office',       label: 'Office Furniture',  description: 'Desks, chairs & workstation sets for productivity.' },
  { name: 'Living Room',  label: 'Living Room',        description: 'Sofas, coffee tables & accent pieces for your lounge.' },
  { name: 'Bedroom',      label: 'Bedroom',            description: 'Beds, wardrobes & dressers for restful spaces.' },
  { name: 'Dining Room',  label: 'Dining Room',        description: 'Dining tables & chair sets for every home.' },
  { name: 'Storage',      label: 'Storage & Shelving', description: 'Bookshelves, cabinets & smart storage solutions.' },
  { name: 'Combo Items',  label: 'Combo Deals',        description: 'Bundled sets at unbeatable value — buy more, save more.' },
  { name: 'Wardrobe',     label: 'Wardrobes',          description: 'Sliding & hinged wardrobes for spacious organisation.' },
  { name: 'Glass',        label: 'Glass Furniture',    description: 'Elegant tempered-glass tables & display pieces.' },
];

function ShopByCategories() {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function loadCategories() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category, image, delivery_outside, in_stock')
          .eq('in_stock', true);

        if (error || !data) return;

        // Build map: category -> { images: [], count }
        const map = {};
        for (const p of data) {
          const cat = (p.category || '').trim();
          if (!cat) continue;

          let imgs = [];
          try {
            const meta = JSON.parse(p.delivery_outside || '{}').metadata || {};
            if (meta.images && meta.images.length > 0) imgs = meta.images;
          } catch (e) {}
          if (imgs.length === 0 && p.image) imgs = [p.image];

          if (!map[cat]) map[cat] = { images: [], count: 0 };
          map[cat].count += 1;
          
          for (const img of imgs) {
            if (img && !map[cat].images.includes(img) && map[cat].images.length < 5) {
              map[cat].images.push(img);
            }
          }
        }

        // Build ordered list — CATEGORY_SLUGS order first, extras appended
        const ordered = [];
        for (const { name, label, description } of CATEGORY_SLUGS) {
          const key = Object.keys(map).find(k =>
            k.toLowerCase().includes(name.toLowerCase()) ||
            name.toLowerCase().includes(k.toLowerCase())
          );
          if (key && map[key]) {
            ordered.push({ name: label, slug: name, images: map[key].images, count: map[key].count, description });
            delete map[key];
          }
        }
        // Any extra DB categories not in our list
        for (const [key, val] of Object.entries(map)) {
          ordered.push({ name: key, slug: key, images: val.images, count: val.count, description: `Browse all ${key} products.` });
        }

        setCategories(ordered);
      } catch (err) {
        console.error('Category load error:', err);
      }
    }
    loadCategories();
  }, []);

  if (categories.length === 0) return null;

  return (
    <section style={{ backgroundColor: '#FAFAFA', padding: '0 0 5rem 0' }}>
      {/* Bold Header Banner */}
      <div style={{
        backgroundColor: '#0A0A0A',
        padding: '2rem',
        textAlign: 'center',
        marginBottom: '3rem',
        borderBottom: '3px solid #D4AF37',
      }}>
        <h2 style={{
          fontFamily: 'Space Grotesk, sans-serif',
          fontWeight: 800,
          fontSize: 'clamp(1.6rem, 4vw, 2.5rem)',
          color: '#FFFFFF',
          letterSpacing: '-0.02em',
          margin: 0,
        }}>
          SHOP BY <span style={{ color: '#D4AF37' }}>CATEGORIES</span>
        </h2>
        <p style={{ color: '#888', fontSize: '13px', marginTop: '0.5rem', fontFamily: 'Space Grotesk, sans-serif' }}>
          Find exactly what you need — browse by room or furniture type
        </p>
      </div>

      {/* Category Grid — 4 columns on desktop, 2 on mobile */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 2rem',
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '1.25rem',
      }}
        className="category-grid"
      >
        {categories.slice(0, 8).map((cat) => (
          <CategoryTile key={cat.name} cat={cat} />
        ))}
      </div>

      {/* Responsive override via inline style block */}
      <style>{`
        @media (max-width: 900px) { .category-grid { grid-template-columns: repeat(3, 1fr) !important; } }
        @media (max-width: 600px) { .category-grid { grid-template-columns: repeat(2, 1fr) !important; } }
      `}</style>
    </section>
  );
}

function CategoryTile({ cat }) {
  const [hovered, setHovered] = useState(false);
  const [currentImgIdx, setCurrentImgIdx] = useState(0);

  // Auto-cycle images staggered
  useEffect(() => {
    if (!cat.images || cat.images.length <= 1) return;
    const randomOffset = Math.random() * 2000;
    let timer;
    const timeout = setTimeout(() => {
      setCurrentImgIdx(prev => (prev + 1) % cat.images.length);
      timer = setInterval(() => {
        setCurrentImgIdx(prev => (prev + 1) % cat.images.length);
      }, 3000);
    }, randomOffset);

    return () => {
      clearTimeout(timeout);
      if (timer) clearInterval(timer);
    };
  }, [cat.images]);

  return (
    <Link
      to={`/products?category=${encodeURIComponent(cat.slug)}`}
      style={{ textDecoration: 'none', display: 'flex' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        borderRadius: '6px',
        overflow: 'hidden',
        border: hovered ? '2px solid #D4AF37' : '2px solid #E5E5E5',
        transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
        transform: hovered ? 'translateY(-5px)' : 'translateY(0)',
        boxShadow: hovered ? '0 16px 40px rgba(0,0,0,0.14)' : '0 2px 8px rgba(0,0,0,0.06)',
        cursor: 'pointer',
        backgroundColor: '#FFFFFF',
      }}>

        {/* Image area */}
        <div style={{ position: 'relative', paddingTop: '80%', overflow: 'hidden', backgroundColor: '#F8F8F8', flexShrink: 0 }}>
          {cat.images && cat.images.length > 0 ? (
            <img
              src={cat.images[currentImgIdx]}
              alt={cat.name}
              loading="lazy"
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'contain',
                objectPosition: 'center',
                padding: '8px',
                transition: 'transform 0.4s ease',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
              }}
            />
          ) : (
            /* Placeholder when no image uploaded yet */
            <div style={{
              position: 'absolute', inset: 0,
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ color: '#D4AF37', fontSize: '11px', fontFamily: 'Space Grotesk, sans-serif', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
                No Image Yet
              </span>
            </div>
          )}
          {/* Product count badge */}
          <div style={{
            position: 'absolute', top: '8px', right: '8px',
            backgroundColor: '#D4AF37',
            color: '#0A0A0A',
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '10px', fontWeight: 700,
            padding: '3px 8px',
            borderRadius: '2px',
            letterSpacing: '0.05em',
          }}>
            {cat.count} {cat.count === 1 ? 'item' : 'items'}
          </div>
        </div>

        {/* Text content */}
        <div style={{
          padding: '0.9rem 1rem 1rem',
          backgroundColor: hovered ? '#0A0A0A' : '#FFFFFF',
          transition: 'background-color 0.25s ease',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontWeight: 700,
            fontSize: '14px',
            color: hovered ? '#FFFFFF' : '#0A0A0A',
            margin: 0,
            transition: 'color 0.25s ease',
          }}>
            {cat.name}
          </p>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11.5px',
            lineHeight: 1.5,
            color: hovered ? '#BBBBBB' : '#666666',
            margin: 0,
            transition: 'color 0.25s ease',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {cat.description}
          </p>
          <p style={{
            fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px',
            fontWeight: 600,
            color: hovered ? '#D4AF37' : '#D4AF37',
            margin: '4px 0 0',
            letterSpacing: '0.05em',
          }}>
            SHOP NOW →
          </p>
        </div>
      </div>
    </Link>
  );
}


