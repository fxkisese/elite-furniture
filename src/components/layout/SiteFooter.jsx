import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function SiteFooter() {
  return (
    <footer style={{
      backgroundColor: '#FAFAFA',
      borderTop: '1px solid #D5D5D5',
      padding: '4rem 2rem 2rem',
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Top grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '3rem',
          marginBottom: '3rem',
          paddingBottom: '3rem',
          borderBottom: '1px solid #D5D5D5',
        }}>
          {/* Brand */}
          <div>
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 700,
                fontSize: '18px',
                letterSpacing: '0.1em',
                color: '#D4AF37',
                textTransform: 'uppercase',
              }}>FURNITURE</div>
              <div style={{
                fontFamily: 'Space Grotesk, sans-serif',
                fontWeight: 300,
                fontSize: '11px',
                letterSpacing: '0.3em',
                color: '#AAAAAA',
                textTransform: 'uppercase',
              }}>ELITE SPACE</div>
            </div>
            <p style={{ color: '#0A0A0A', fontSize: '13px', fontWeight: 600, letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
              Elegance. Comfort. Quality.
            </p>
            <p style={{ color: '#AAAAAA', fontSize: '13px', lineHeight: '1.8', maxWidth: '220px' }}>
              Premium furniture crafted for homes, offices, and businesses across Kenya.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <div className="label-upper" style={{ color: '#AAAAAA', marginBottom: '1.5rem' }}>NAVIGATION</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { label: 'Home', to: '/' },
                { label: 'Products', to: '/products' },
                { label: 'Custom Orders', to: '/custom-orders' },
                { label: 'About Us', to: '/about' },
                { label: 'Contact', to: '/contact' },
              ].map(link => (
                <Link key={link.to} to={link.to} style={{
                  color: '#777777',
                  textDecoration: 'none',
                  fontSize: '13px',
                  letterSpacing: '0.05em',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777777'}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Contact */}
          <div>
            <div className="label-upper" style={{ color: '#AAAAAA', marginBottom: '1.5rem' }}>CONTACT</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <a href="tel:+254141484249" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#777777', textDecoration: 'none', fontSize: '13px' }}>
                <Phone size={14} /> 0141 484 249
              </a>
              <a href="mailto:info@furnitureelitespace.co.ke" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#777777', textDecoration: 'none', fontSize: '13px' }}>
                <Mail size={14} /> info@furnitureelitespace.co.ke
              </a>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#777777', fontSize: '13px' }}>
                <MapPin size={14} /> Nairobi, Kenya
              </div>
            </div>
          </div>

          {/* Categories */}
          <div>
            <div className="label-upper" style={{ color: '#AAAAAA', marginBottom: '1.5rem' }}>CATEGORIES</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {['Living Room', 'Bedroom', 'Dining', 'Office'].map(cat => (
                <Link key={cat} to={`/products?category=${cat}`} style={{
                  color: '#777777', textDecoration: 'none', fontSize: '13px',
                  transition: 'color 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.color = '#0A0A0A'}
                  onMouseLeave={e => e.currentTarget.style.color = '#777777'}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#CCCCCC', fontSize: '11px', letterSpacing: '0.1em' }}>
            © 2024 FURNITURE ELITE SPACE. ALL RIGHTS RESERVED.
          </span>
          <span style={{ color: '#CCCCCC', fontSize: '11px', letterSpacing: '0.05em' }}>
            NAIROBI, KENYA
          </span>
        </div>
      </div>
    </footer>
  );
}