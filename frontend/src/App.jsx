import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Causes from './pages/Causes';
import CauseDetail from './pages/CauseDetail';
import Gallery from './pages/Gallery';
import SuccessStories from './pages/SuccessStories';
import SocialMedia from './pages/SocialMedia';
import Donors from './pages/Donors';
import Donate from './pages/Donate';
import PaymentOptions from './pages/PaymentOptions';
import DonationSuccess from './pages/DonationSuccess';
import ReceiptView from './pages/ReceiptView';
import Downloads from './pages/Downloads';
import BankDetails from './pages/BankDetails';
import Volunteer from './pages/Volunteer';
import Contact from './pages/Contact';
import Legal from './pages/Legal';
import AdminPanelEntry from './pages/AdminPanelEntry';

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const routes = (
    <Routes>
      {/* Main Pages */}
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/causes" element={<Causes />} />
      <Route path="/causes/:slug" element={<CauseDetail />} />
      <Route path="/gallery" element={<Gallery />} />
      <Route path="/success-stories" element={<SuccessStories />} />
      <Route path="/success-stories/:slug" element={<SuccessStories />} />
      <Route path="/social-media" element={<SocialMedia />} />
      <Route path="/donors" element={<Donors />} />
      
      {/* Donation Flow */}
      <Route path="/donate" element={<Donate />} />
      <Route path="/payment-options" element={<PaymentOptions />} />
      <Route path="/donation-success" element={<DonationSuccess />} />
      <Route path="/donation/:id/receipt" element={<ReceiptView />} />
      
      {/* Support Modules */}
      <Route path="/downloads" element={<Downloads />} />
      <Route path="/bank-details" element={<BankDetails />} />
      <Route path="/volunteer" element={<Volunteer />} />
      <Route path="/contact" element={<Contact />} />
      
      {/* Legal Compliance Policies */}
      <Route path="/terms" element={<Legal type="terms" />} />
      <Route path="/privacy-policy" element={<Legal type="privacy" />} />
      <Route path="/refund-policy" element={<Legal type="refund" />} />
      <Route path="/admin/*" element={<AdminPanelEntry />} />

      {/* Catch-all Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );

  if (isAdminRoute) {
    return routes;
  }

  return <Layout>{routes}</Layout>;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
