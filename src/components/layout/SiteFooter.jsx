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
              <a href="mailto:sales@furnitureelitespace.co.ke" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', color: '#777777', textDecoration: 'none', fontSize: '13px' }}>
                <Mail size={14} /> sales@furnitureelitespace.co.ke
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
          {/* Social icons */}
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            {[
              { label: 'TikTok', url: 'https://www.tiktok.com/@elitespacefurniture', color: '#00f2ea', path: 'M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.34-6.34V8.75a8.18 8.18 0 0 0 4.78 1.54V6.86a4.83 4.83 0 0 1-1.02-.17z' },
              { label: 'Instagram', url: 'https://www.instagram.com/elite_space_furniture/', color: '#E1306C', path: 'M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z' },
              { label: 'X', url: 'https://x.com/EliteSpaceFurn', color: '#000000', path: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z' },
              { label: 'Facebook', url: 'https://www.facebook.com/elitespacefurniture', color: '#1877F2', path: 'M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' },
              { label: 'YouTube', url: 'https://www.youtube.com/@elitespacefurniture', color: '#FF0000', path: 'M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z' },
            ].map(s => (
              <a
                key={s.label}
                href={s.url}
                target="_blank"
                rel="noreferrer"
                aria-label={s.label}
                style={{ color: '#AAAAAA', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = s.color}
                onMouseLeave={e => e.currentTarget.style.color = '#AAAAAA'}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d={s.path} /></svg>
              </a>
            ))}
          </div>
          <span style={{ color: '#CCCCCC', fontSize: '11px', letterSpacing: '0.05em' }}>
            NAIROBI, KENYA
          </span>
        </div>
      </div>
    </footer>
  );
}