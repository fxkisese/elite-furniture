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
      <section style={{ position: 'relative', height: 'calc(100vh - 70px)', overflow: 'hidden', minHeight: '600px' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', backgroundColor: '#0A0A0A' }}>
          {/* Blurred Background Layer */}
          {heroSlides.map((src, idx) => (
            <div
              key={`blur-${idx}`}
              style={{
                position: 'absolute',
                inset: 0,
                opacity: idx === currentSlideIdx ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out',
                zIndex: 0,
              }}
            >
              <img
                src={src}
                alt=""
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'blur(40px) brightness(0.3)',
                  transform: 'scale(1.1)',
                }}
              />
            </div>
          ))}

          {/* Sharp Contained Image on the Right */}
          {heroSlides.map((src, idx) => (
            <div
              key={`sharp-${idx}`}
              style={{
                position: 'absolute',
                top: 0, bottom: 0, right: 0,
                width: '60%', /* Takes up the right 60% of the screen */
                opacity: idx === currentSlideIdx ? 1 : 0,
                transition: 'opacity 1.5s ease-in-out, transform 8s ease-out',
                transform: idx === currentSlideIdx ? 'scale(1.02)' : 'scale(1)',
                zIndex: 1,
              }}
            >
              <img
                src={src}
                alt="Luxury furniture slide"
                style={{
                  width: '100%', height: '100%', objectFit: 'contain',
                  objectPosition: 'right center',
                  padding: '2rem 4rem 2rem 0', // padding so it doesn't touch the edges
                }}
              />
            </div>
          ))}

          {/* Gradient Overlay for Text */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15,15,15,0.95) 0%, rgba(15,15,15,0.8) 40%, rgba(15,15,15,0) 100%)', zIndex: 2, pointerEvents: 'none' }} />
        </div>

        <div style={{
          position: 'relative', zIndex: 10, height: '100%',
          display: 'flex', alignItems: 'center',
          maxWidth: '1200px', margin: '0 auto', padding: '0 2rem',
        }}>

          <div style={{ maxWidth: '600px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '1.5rem' }}>
              <div style={{ width: '40px', height: '1px', backgroundColor: '#555' }} />
              <span style={{ color: '#888', letterSpacing: '0.2em', fontSize: '11px', textTransform: 'uppercase' }}>NAIROBI, KENYA</span>
            </div>
            <h1 style={{
              fontSize: 'clamp(2.5rem, 4vw, 4rem)',
              fontWeight: 800,
              lineHeight: 1.1,
              color: '#FFFFFF',
              letterSpacing: '-0.02em',
              marginBottom: '1.5rem',
            }}>
              FURNITURE THAT MAKES EVERY <span style={{ color: '#D4AF37' }}>SPACE</span> EXCEPTIONAL
            </h1>
            <p style={{
              fontSize: '16px',
              lineHeight: 1.6,
              color: '#AAAAAA',
              marginBottom: '3rem',
              maxWidth: '85%',
            }}>
              Discover stylish, durable, and affordable furniture tailored to your lifestyle and business needs.
            </p>
            
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              <Link to="/products" style={{
                backgroundColor: '#D4AF37', color: '#0A0A0A',
                padding: '16px 32px', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.15em', textDecoration: 'none',
                display: 'flex', alignItems: 'center', gap: '10px',
                transition: 'background 0.3s ease',
              }}
                onMouseEnter={e => e.currentTarget.style.backgroundColor = '#f2c94c'}
                onMouseLeave={e => e.currentTarget.style.backgroundColor = '#D4AF37'}
              >
                SHOP FURNITURE <ChevronRight size={14} />
              </Link>
              <Link to="/contact" style={{
                border: '1px solid #FFFFFF', color: '#FFFFFF',
                padding: '16px 32px', fontSize: '12px', fontWeight: 600,
                letterSpacing: '0.15em', textDecoration: 'none',
                transition: 'background 0.3s ease, color 0.3s ease',
              }}
                onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0A0A0A'; }}
                onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF'; }}
              >
                REQUEST FREE QUOTE
              </Link>
            </div>
          </div>
        </div>


        {/* Scroll indicator */}
        <div style={{
          position: 'absolute', bottom: '2rem', left: '50%', transform: 'translateX(-50%)',
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
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
        whatsappNumber="254700000000"
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
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127641.05063065673!2d36.74411135!3d-1.2920659000000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x182f1172d84d49a7%3A0xf7cf0254b297924c!2sNairobi%2C%20Kenya!5e0!3m2!1sen!2sus!4v1718000000000!5m2!1sen!2sus"
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