import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin, Send, Youtube, Facebook, Instagram, Twitter, Linkedin } from 'lucide-react';
import useSiteContent from '../hooks/useSiteContent';
import { socialApi } from '../api';

const Footer = () => {
  const content = useSiteContent();
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [error, setError] = useState('');
  const [socialPlatforms, setSocialPlatforms] = useState([]);

  useEffect(() => {
    socialApi.getPlatforms()
      .then(data => setSocialPlatforms(data))
      .catch(err => console.error(err));
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
    } else {
      setError('');
      setSubscribed(true);
      setEmail('');
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  return (
    <footer className="bg-slate-900 text-slate-400 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
        
        {/* NGO Info Column */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-primary-500 to-accent-400 flex items-center justify-center text-white text-lg">
              🌱
            </div>
            <span className="font-display font-bold text-lg text-white tracking-tight">{content.siteName}</span>
          </div>
          <p className="text-sm leading-relaxed text-slate-400">
            {content.footerText}
          </p>
          <div className="flex space-x-3 pt-2">
            {socialPlatforms.map((p) => {
              const nameLower = p.name.toLowerCase();
              let icon = null;
              let hoverColor = "hover:bg-primary-600";
              
              if (nameLower.includes('youtube')) {
                icon = <Youtube className="w-4 h-4" />;
                hoverColor = "hover:bg-red-600";
              } else if (nameLower.includes('facebook')) {
                icon = <Facebook className="w-4 h-4" />;
                hoverColor = "hover:bg-blue-600";
              } else if (nameLower.includes('instagram')) {
                icon = <Instagram className="w-4 h-4" />;
                hoverColor = "hover:bg-pink-600";
              } else if (nameLower.includes('linkedin')) {
                icon = <Linkedin className="w-4 h-4" />;
                hoverColor = "hover:bg-blue-700";
              } else {
                icon = <Twitter className="w-4 h-4" />;
                hoverColor = "hover:bg-sky-500";
              }

              return (
                <a 
                  key={p._id} 
                  href={p.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className={`p-2 rounded-lg bg-slate-800 text-slate-400 transition-colors ${hoverColor} hover:text-white`}
                  title={p.name}
                >
                  {icon}
                </a>
              );
            })}
          </div>
        </div>

        {/* Quick Links Column */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider border-l-2 border-primary-500 pl-2">
            Quick Links
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary-400 transition-colors">Home</Link></li>
            <li><Link to="/about" className="hover:text-primary-400 transition-colors">About Us</Link></li>
            <li><Link to="/causes" className="hover:text-primary-400 transition-colors">Our Causes</Link></li>
            <li><Link to="/gallery" className="hover:text-primary-400 transition-colors">Activity Gallery</Link></li>
            <li><Link to="/success-stories" className="hover:text-primary-400 transition-colors">Success Stories</Link></li>
            <li><Link to="/social-media" className="hover:text-primary-400 transition-colors">Social Media</Link></li>
            <li><Link to="/donors" className="hover:text-primary-400 transition-colors">Respected Donors</Link></li>
          </ul>
        </div>

        {/* Support & Action Column */}
        <div>
          <h3 className="font-display font-semibold text-white mb-4 text-sm uppercase tracking-wider border-l-2 border-primary-500 pl-2">
            Support Us
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/donate" className="hover:text-primary-400 transition-colors">Donate Online</Link></li>
            <li><Link to="/volunteer" className="hover:text-primary-400 transition-colors">Become a Volunteer</Link></li>
            <li><Link to="/bank-details" className="hover:text-primary-400 transition-colors">Bank Details & QR</Link></li>
            <li><Link to="/downloads" className="hover:text-primary-400 transition-colors">Download Certificates</Link></li>
            <li><Link to="/contact" className="hover:text-primary-400 transition-colors">Contact with Us</Link></li>
          </ul>
        </div>

        {/* Newsletter Signup Column */}
        <div className="space-y-4">
          <h3 className="font-display font-semibold text-white text-sm uppercase tracking-wider border-l-2 border-primary-500 pl-2">
            Newsletter
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            Subscribe to receive stories of impact and project updates directly in your inbox.
          </p>
          <form onSubmit={handleSubscribe} className="relative">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-slate-800 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-4 text-sm text-white placeholder-slate-500 pr-10 transition-all"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1.5 p-1 rounded-md bg-primary-600 hover:bg-primary-500 text-white transition-colors"
              aria-label="Subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {error && <p className="text-red-400 text-xs">{error}</p>}
          {subscribed && <p className="text-emerald-400 text-xs font-medium">Thank you for subscribing!</p>}

          {/* Core Trust Seals */}
          <div className="pt-2 border-t border-slate-800 space-y-1">
            <span className="text-[10px] text-slate-500 uppercase tracking-widest block font-semibold">Government Registrations</span>
            <span className="text-xs text-slate-400 block font-medium">12A & 80G Certified • NITI Aayog Verified</span>
          </div>
        </div>
      </div>

      {/* Bottom Footer Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <p>&copy; {new Date().getFullYear()} Jana Bikas NGO. All Rights Reserved.</p>
        <div className="flex space-x-4">
          <Link to="/terms" className="hover:text-primary-400 transition-colors">Terms of Use</Link>
          <span>|</span>
          <Link to="/privacy-policy" className="hover:text-primary-400 transition-colors">Privacy Policy</Link>
          <span>|</span>
          <Link to="/refund-policy" className="hover:text-primary-400 transition-colors">Refund & Cancellation</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
