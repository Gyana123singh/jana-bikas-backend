import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import StickyHeader from './StickyHeader';
import Footer from './Footer';

const Layout = ({ children }) => {
  const { pathname } = useLocation();

  // Scroll to top of page on route change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="flex flex-col min-h-screen">
      <StickyHeader />
      
      {/* Main Content Area */}
      <main className="flex-grow">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
