import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PageLayout from '@/components/layout/PageLayout';
import ProductCard from '@/components/products/ProductCard';
import { ChevronRight, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';

const TESTIMONIALS = [
  { name: 'Amina W.', role: 'Homeowner, Karen', text: 'Excellent service and beautiful furniture. The sofa we ordered fits perfectly in our living room.' },
  { name: 'David K.', role: 'Office Manager, Westlands', text: 'Delivered exactly what we ordered, on time. The quality exceeds the price point.' },
  { name: 'Grace M.', role: 'Airbnb Host, Kileleshwa', text: 'My guests consistently compliment the furniture. Furniture Elite Space never disappoints.' },
];

const TRUST_POINTS = [
  'Quality Craftsmanship',
  'Affordable Pricing',
  'Delivery Across Kenya',
  'Custom Orders Available',
  'Professional Customer Service',
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [heroSlides, setHeroSlides] = useState([]);
  const [currentSlideIdx, setCurrentSlideIdx] = useState(0);

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
    
    const testTimer = setInterval(() => setTestimonialIdx(i => (i + 1) % TESTIMONIALS.length), 4000);
    return () => clearInterval(testTimer);
  }, []);

  useEffect(() => {
    if (heroSlides.length <= 1) return;
    const heroTimer = setInterval(() => setCurrentSlideIdx(i => (i + 1) % heroSlides.length), 5000);
    return () => clearInterval(heroTimer);
  }, [heroSlides]);

  return (
    <PageLayout>
      {/* Hero Section */}
      <section style={{ position: 'relative', height: 'calc(100vh - 70px)', overflow: 'hidden', minHeight: '600px', marginTop: '70px' }}>
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}>
          {heroSlides.map((src, idx) => (
            <div
              key={idx}
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
                alt="Luxury furniture slide"
                style={{
                  width: '100%', height: '100%', objectFit: 'cover',
                  filter: 'grayscale(15%)',
                  transition: 'transform 8s ease-out',
                  transform: idx === currentSlideIdx ? 'scale(1.05)' : 'scale(1)',
                }}
              />
            </div>
          ))}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(10,10,10,0.95) 0%, rgba(10,10,10,0.4) 50%, rgba(10,10,10,0.05) 100%)', zIndex: 1 }} />
        </div>

        <div style={{
          position: 'relative', zIndex: 1, height: '100%',
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
              FOR MODERN<br />KENYAN HOMES
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

      {/* Section Divider */}
      <div style={{ borderBottom: '2px solid #D4AF37' }} />

      {/* Featured Products */}
      <section style={{ backgroundColor: '#FFFFFF', padding: '5rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
            marginBottom: '2.5rem', paddingBottom: '1.5rem', borderBottom: '1px solid #EEEEEE',
            flexWrap: 'wrap', gap: '1rem',
          }}>
            <div>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px', letterSpacing: '0.2em', color: '#D4AF37', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>
                SELECTED PIECES
              </div>
              <h2 style={{
                fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700,
                fontSize: 'clamp(1.5rem, 3vw, 2rem)', letterSpacing: '-0.03em', color: '#0A0A0A',
                margin: 0,
              }}>
                FEATURED COLLECTION
              </h2>
            </div>
            <Link to="/products" style={{
              color: '#0A0A0A', textDecoration: 'none',
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px',
              fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '6px',
              borderBottom: '2px solid #D4AF37', paddingBottom: '2px',
            }}>
              ALL PRODUCTS <ChevronRight size={12} />
            </Link>
          </div>

          {products.length === 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {['L-Shape Sectional Sofa', '3-Seater Chesterfield Sofa', 'King Platform Bed', '8-Seater Dining Set', 'Executive Office Desk'].map((name, i) => (
                <ProductCard key={i} product={{
                  id: i, name,
                  category: ['Living Room', 'Living Room', 'Bedroom', 'Dining', 'Office'][i],
                  subcategory: ['SOFAS', 'SOFAS', 'BEDS', 'DINING SETS', 'EXECUTIVE DESKS'][i],
                  price: [95000, 72000, 68000, 110000, 52000][i],
                  description: ['Contemporary L-shaped sectional with premium fabric upholstery. Available in...', 'Classic Chesterfield design with deep-button tufting and rolled arms. Premium leather...', 'Low-profile king platform bed with upholstered headboard. Solid wood slats...', 'Solid oak dining table with 8 upholstered chairs. Extendable design from 180cm to...', 'L-shaped executive desk with built-in cable tray, lockable drawers, and integrated pow...'][i],
                  image: [
                    'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80',
                    'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=600&q=80',
                    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&q=80',
                    'https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=600&q=80',
                    'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=600&q=80',
                  ][i],
                }} />
              ))}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
              {products.map(p => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </section>

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
      <section style={{ backgroundColor: '#0A0A0A', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontSize: '10px', letterSpacing: '0.3em', color: '#555555', textTransform: 'uppercase', marginBottom: '3rem', textAlign: 'center' }}>
            CLIENT TESTIMONIALS
          </div>

          <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.2rem, 3vw, 1.8rem)',
              fontWeight: 300,
              letterSpacing: '-0.02em',
              color: '#FFFFFF',
              lineHeight: 1.5,
              marginBottom: '2rem',
              minHeight: '100px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'opacity 0.5s ease',
            }}>
              "{TESTIMONIALS[testimonialIdx].text}"
            </div>

            <div style={{ marginBottom: '2.5rem' }}>
              <div style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 600, fontSize: '13px', color: '#FFFFFF', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '4px' }}>
                {TESTIMONIALS[testimonialIdx].name}
              </div>
              <div style={{ fontSize: '11px', color: '#555555', letterSpacing: '0.1em' }}>
                {TESTIMONIALS[testimonialIdx].role}
              </div>
            </div>

            {/* Dots */}
            <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setTestimonialIdx(i)}
                  style={{
                    width: i === testimonialIdx ? '24px' : '8px',
                    height: '2px',
                    backgroundColor: i === testimonialIdx ? '#FFFFFF' : '#333333',
                    border: 'none', cursor: 'pointer',
                    transition: 'width 0.3s ease, background 0.3s ease',
                    padding: 0,
                  }}
                />
              ))}
            </div>
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