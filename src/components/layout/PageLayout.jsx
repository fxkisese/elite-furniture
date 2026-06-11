import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';
import WhatsAppButton from './WhatsAppButton';

export default function PageLayout({ children, activeProduct = null }) {
  return (
    <div style={{ backgroundColor: '#FFFFFF', minHeight: '100vh' }}>
      <SiteHeader />
      <main style={{ paddingTop: '70px' }}>
        {children}
      </main>
      <SiteFooter />
      <WhatsAppButton activeProduct={activeProduct} />
    </div>
  );
}