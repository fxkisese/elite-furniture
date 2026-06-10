import React from 'react';
import SiteHeader from './SiteHeader';
import SiteFooter from './SiteFooter';

export default function PageLayout({ children }) {
  return (
    <div className="page-layout" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <SiteHeader />
      <main style={{ flex: 1, paddingTop: '0' }}>{children}</main>
      <SiteFooter />
    </div>
  );
}
