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
      <section className="relative h-[calc(100vh-70px)] min-h-[600px] flex flex-col md:flex-row overflow-hidden bg-[#0A0A0A]">
        
        {/* Left Side (Text content) */}
        <div className="relative z-10 w-full md:w-[55%] h-full flex flex-col justify-center px-6 md:px-16 lg:px-24 pt-12 md:pt-0">
          <div className="max-w-[600px]">
            <div className="flex items-center gap-[15px] mb-6">
              <div className="w-[40px] h-[1px] bg-[#555]" />
              <span className="text-[#888] tracking-[0.2em] text-[11px] uppercase">NAIROBI, KENYA</span>
            </div>
            <h1 className="text-[clamp(2.5rem,4vw,4rem)] font-extrabold text-[#FFFFFF] leading-[1.1] tracking-[-0.02em] mb-6">
              FURNITURE THAT MAKES EVERY <span className="text-[#D4AF37]">SPACE</span> EXCEPTIONAL
            </h1>
            <p className="text-[#AAAAAA] text-[16px] leading-[1.6] mb-12 max-w-[85%]">
              Discover stylish, durable, and affordable furniture tailored to your lifestyle and business needs.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Link to="/products" 
                className="bg-[#D4AF37] text-[#0A0A0A] px-[32px] py-[16px] text-[12px] font-semibold tracking-[0.15em] uppercase transition-colors duration-300 flex items-center gap-[10px]"
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f2c94c'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
              >
                SHOP FURNITURE <ChevronRight size={14} />
              </Link>
              <Link to="/contact" 
                className="border border-[#FFFFFF] text-[#FFFFFF] px-[32px] py-[16px] text-[12px] font-semibold tracking-[0.15em] uppercase transition-all duration-300"
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0A0A0A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF'; }}
              >
                REQUEST FREE QUOTE
              </Link>
            </div>
          </div>
        </div>

        {/* Right Side (Image Carousel) */}
        <div className="relative w-full md:w-[45%] h-full min-h-[400px] flex items-center justify-center bg-[#F4F4F4] overflow-hidden">
          {/* Decorative subtle circles in background */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] aspect-square rounded-full border border-[#E5E5E5]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] aspect-square rounded-full border border-[#E5E5E5]" />

          {heroSlides.map((src, idx) => (
            <div
              key={`hero-img-${idx}`}
              className="absolute inset-0 flex items-center justify-center p-8 md:p-16"
              style={{
                opacity: idx === currentSlideIdx ? 1 : 0,
                transform: idx === currentSlideIdx ? 'scale(1)' : 'scale(0.98)',
                transition: 'opacity 1.5s ease-in-out, transform 1.5s ease-in-out',
                zIndex: idx === currentSlideIdx ? 10 : 0,
              }}
            >
              <img
                src={src}
                alt="Luxury furniture slide"
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  /* mix-blend-multiply completely removes white/light backgrounds from images, integrating them flawlessly */
                  mixBlendMode: 'multiply',
                  filter: 'contrast(1.05) drop-shadow(0 25px 25px rgba(0,0,0,0.15))',
                  transform: idx === currentSlideIdx ? 'scale(1.02)' : 'scale(1)',
                  transition: 'transform 8s ease-out',
                }}
              />
            </div>
          ))}

          {/* Slide Indicators */}
          <div className="absolute bottom-8 right-8 md:right-12 flex gap-3 z-20">
            {heroSlides.map((_, idx) => (
              <button
                key={`indicator-${idx}`}
                onClick={() => setCurrentSlideIdx(idx)}
                className="h-1.5 rounded-full transition-all duration-500"
                style={{
                  width: idx === currentSlideIdx ? '32px' : '8px',
                  backgroundColor: idx === currentSlideIdx ? '#D4AF37' : '#CCCCCC',
                }}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', zIndex: 20
        }} className="hidden md:flex">
          <span style={{ color: '#888888', fontSize: '9px', letterSpacing: '0.3em' }}>SCROLL</span>
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
        products={products.map(p => ({
          id: p.id,
          category: p.category,
          name: p.name,
          description: p.description,
          images: p.images && p.images.length > 0 ? p.images : (p.image ? [p.image] : []),
          price: p.discount_price || p.price,
          originalPrice: p.discount_price ? p.price : null,
          rating: p.rating || 5.0,
          reviews: p.review_count || 0,
          badges: p.badge ? [p.badge] : []
        }))}
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