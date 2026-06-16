import { useState, useEffect, useRef } from 'react';
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
  const [heroSlides, setHeroSlides] = useState([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);
  const { addToCart } = useCart();

  useEffect(() => {
    async function loadData() {
      try {
        const { data: pData } = await supabase.from('products').select('*').eq('featured', true).limit(5);
        setProducts(pData || []);
        
        const { data: hData } = await supabase.from('hero_slides').select('image').order('created_at', { ascending: false });
        if (hData && hData.length > 0) {
          setHeroSlides(hData.map(d => d.image));
        } else {
          setHeroSlides(['https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1600&q=90']);
        }
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
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,10,10,0.65)', zIndex: 1 }} />
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
              fontSize: '11px',
              letterSpacing: '0.35em',
              textTransform: 'uppercase',
              color: '#888888',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <span style={{ display: 'inline-block', width: '40px', height: '1px', backgroundColor: '#555555' }} />
              NAIROBI, KENYA
            </div>

            <h1 style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontWeight: 700,
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              letterSpacing: '-0.04em',
              color: '#FFFFFF',
              lineHeight: 1.05,
              marginBottom: '2.5rem',
            }}>
              PREMIUM<br />
              <span style={{ color: '#D4AF37', fontWeight: 300 }}>FURNITURE</span><br />
              FOR MODERN<br />KENYAN HOMES & OFFICES
            </h1>

            <p style={{
              color: '#888888',
              fontSize: '15px',
              lineHeight: 1.8,
              marginBottom: '3.5rem',
              maxWidth: '460px',
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
      <div className="bg-white py-6 border-b border-gray-200 hidden md:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-4 text-center divide-x divide-gray-200">
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

      {/* Featured Products */}
      <FeaturedCollection 
        products={products.map(p => {
          let meta = {};
          try { meta = JSON.parse(p.delivery_outside || '{}').metadata || {}; } catch(e) {}
          return {
            id: p.id,
            category: p.category,
            name: p.name,
            description: p.description,
            images: meta.images && meta.images.length > 0 ? meta.images : (p.image ? [p.image] : []),
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
        whatsappNumber="254793816450"
        allProductsHref="/products"
        onAddToCart={addToCart}
      />

      {/* Section Divider */}
      <div style={{ borderBottom: '1px solid #2A2A2A' }} />

      {/* Why Choose Us */}
      <section style={{ backgroundColor: '#111111', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4rem', alignItems: 'center' }} className="md:grid-cols-2 grid-cols-1">
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
              src="https://maps.google.com/maps?q=-1.2929523,36.8861463+(Eliwa+Funitures)&z=16&output=embed"
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
        <div style={{ maxWidth: '1100px', margin: '0 auto', textAlign: 'center' }}>
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
  const ref = useRef(null);

  useEffect(() => {
    // Load TikTok embed script
    const script = document.createElement('script');
    script.src = 'https://www.tiktok.com/embed.js';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Clean up script on unmount
      const existingScript = document.querySelector('script[src="https://www.tiktok.com/embed.js"]');
      if (existingScript) existingScript.remove();
    };
  }, []);

  return (
    <blockquote
      ref={ref}
      className="tiktok-embed"
      cite="https://www.tiktok.com/@elitespacefurniture"
      data-unique-id="elitespacefurniture"
      data-embed-from="embed_page"
      data-embed-type="creator"
      style={{ maxWidth: '1100px', minWidth: '288px', width: '100%' }}
    >
      <section>
        <a target="_blank" rel="noreferrer" href="https://www.tiktok.com/@elitespacefurniture?refer=creator_embed">
          @elitespacefurniture
        </a>
      </section>
    </blockquote>
  );
}