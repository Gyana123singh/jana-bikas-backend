import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StickyHeader from './StickyHeader';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { pathname } = useLocation();
  const hideHeader = pathname === '/payment-options';
  const isHomePage = pathname === '/';
  const needsTopPadding = !isHomePage && !hideHeader;

  // Scroll to top of page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      {!hideHeader && <StickyHeader />}
      
      {/* Main Content Area */}
      <main className={`flex-grow ${needsTopPadding ? 'pt-12' : ''}`}>
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
