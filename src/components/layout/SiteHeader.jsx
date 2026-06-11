import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Phone, Armchair, ShoppingCart } from 'lucide-react';
import { useCart } from '@/lib/CartContext';
import CartDrawer from '@/components/cart/CartDrawer';

const NAV_LINKS = [
  { label: 'HOME', to: '/' },
  { label: 'PRODUCTS', to: '/products' },
  { label: 'CUSTOM ORDERS', to: '/custom-orders' },
  { label: 'ABOUT', to: '/about' },
  { label: 'CONTACT', to: '/contact' },
];

export default function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  return (
    <>
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        height: '70px', backgroundColor: '#0A0A0A',
        borderBottom: '1px solid #1A1A1A',
        display: 'flex', alignItems: 'center', padding: '0 2rem',
        justifyContent: 'space-between',
      }}>
        {/* Logo */}
        <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '36px', height: '36px', border: '2px solid #D4AF37',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
          }}>
            <Armchair size={18} color="#D4AF37" />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
            <span style={{ fontFamily: 'Space Grotesk, sans-serif', fontWeight: 700, fontSize: '14px', letterSpacing: '0.12em', color: '#FFFFFF', textTransform: 'uppercase' }}>
              FURNITURE <span style={{ color: '#D4AF37' }}>ELITE SPACE</span>
            </span>
            <span style={{ fontFamily: 'Inter, sans-serif', fontWeight: 300, fontSize: '9px', letterSpacing: '0.2em', color: '#888888', textTransform: 'uppercase' }}>
              Elegance. Comfort. Quality.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }} className="hidden md:flex">
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '11px',
              letterSpacing: '0.2em', textTransform: 'uppercase',
              color: location.pathname === link.to ? '#D4AF37' : '#AAAAAA',
              textDecoration: 'none', fontWeight: location.pathname === link.to ? 600 : 400,
              borderBottom: location.pathname === link.to ? '2px solid #D4AF37' : '2px solid transparent',
              paddingBottom: '2px', transition: 'color 0.2s ease, border-color 0.2s ease',
            }}
              onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
              onMouseLeave={e => { if (location.pathname !== link.to) e.currentTarget.style.color = '#AAAAAA'; }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right: Phone + Cart + CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="hidden md:flex">
          <a href="tel:+254700000000" style={{ color: '#D4AF37', display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}>
            <Phone size={16} color="#D4AF37" />
          </a>
          
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{ 
              position: 'relative', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'color 0.2s'
            }}
            onMouseEnter={e => { e.currentTarget.style.color = '#D4AF37'; }}
            onMouseLeave={e => { e.currentTarget.style.color = '#FFFFFF'; }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#D4AF37',
                color: '#0A0A0A',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <Link to="/contact" style={{
            border: '1px solid #FFFFFF', color: '#FFFFFF', padding: '8px 20px',
            textDecoration: 'none', fontFamily: 'Space Grotesk, sans-serif',
            fontSize: '11px', fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase',
            transition: 'background 0.2s, color 0.2s',
          }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = '#FFFFFF'; e.currentTarget.style.color = '#0A0A0A'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.color = '#FFFFFF'; }}
          >
            GET IN TOUCH
          </Link>
        </div>

        {/* Mobile Menu Button & Cart */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={() => setIsCartOpen(true)}
            style={{ 
              position: 'relative', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#FFFFFF',
              display: 'flex'
            }}
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                backgroundColor: '#D4AF37',
                color: '#0A0A0A',
                fontSize: '10px',
                fontWeight: 'bold',
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {cartCount}
              </span>
            )}
          </button>

          <button onClick={() => setMobileOpen(!mobileOpen)}
            style={{ background: 'none', border: 'none', color: '#AAAAAA', cursor: 'pointer', padding: '4px' }}>
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        backgroundColor: '#0A0A0A', zIndex: 999,
        transform: mobileOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '3rem',
      }}>
        <button onClick={() => setMobileOpen(false)}
          style={{ position: 'absolute', top: '1.5rem', right: '2rem', background: 'none', border: 'none', cursor: 'pointer', color: '#FFFFFF' }}>
          <X size={24} />
        </button>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {NAV_LINKS.map(link => (
            <Link key={link.to} to={link.to} style={{
              fontFamily: 'Space Grotesk, sans-serif', fontSize: '2.5rem', fontWeight: 700,
              letterSpacing: '-0.03em', color: location.pathname === link.to ? '#D4AF37' : '#FFFFFF',
              textDecoration: 'none', borderBottom: '1px solid #222222', paddingBottom: '1.5rem',
            }}>
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <CartDrawer />
    </>
  );
}