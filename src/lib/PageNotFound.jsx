import { Link } from 'react-router-dom';

export default function PageNotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#0A0A0A] text-white px-6">
      <div className="text-center space-y-8 max-w-lg">
        <div>
          <p
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(6rem, 20vw, 12rem)',
              fontWeight: 700,
              color: '#1a1a1a',
              lineHeight: 1,
              margin: 0,
              userSelect: 'none',
            }}
          >
            404
          </p>
          <div style={{ width: 60, height: 2, backgroundColor: '#D4AF37', margin: '0 auto 2rem' }} />
        </div>

        <div>
          <h1
            style={{
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 700,
              color: '#FFFFFF',
              marginBottom: '0.75rem',
            }}
          >
            Page Not Found
          </h1>
          <p style={{ color: '#666666', fontSize: '15px', lineHeight: 1.7 }}>
            The page you're looking for doesn't exist or may have been moved.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link
            to="/"
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0A0A0A',
              padding: '12px 28px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s ease',
            }}
          >
            ← Back to Home
          </Link>
          <Link
            to="/products"
            style={{
              backgroundColor: 'transparent',
              color: '#D4AF37',
              border: '1px solid #D4AF37',
              padding: '12px 28px',
              fontFamily: 'Space Grotesk, sans-serif',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'background 0.2s ease, color 0.2s ease',
            }}
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}