import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Heart, Search, ChevronDown } from 'lucide-react';
import { causes } from '../data/ngoData';
import logo from '../assests/image/logo.png';

const StickyHeader = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [causesDropdown, setCausesDropdown] = useState(false);
  const location = useLocation();

  // Scroll Listener to trigger styling change
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setIsOpen(false);
    setSearchOpen(false);
    setCausesDropdown(false);
    setSearchQuery('');
  }, [location]);

  // Live search handler
  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (query.trim() === '') {
      setSearchResults([]);
    } else {
      const filtered = causes.filter(cause =>
        cause.title.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    }
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'About Us', path: '/about' },
    { name: 'Our Causes', path: '/causes', hasDropdown: true },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Success Stories', path: '/success-stories' },
    { name: 'Social Media', path: '/social-media' },
    { name: 'Donors', path: '/donors' },
    { name: 'Downloads', path: '/downloads' },
    { name: 'Bank Details', path: '/bank-details' },
    { name: 'Volunteer', path: '/volunteer' },
    { name: 'Contact', path: '/contact' }
  ];

  return (
    <header 
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        isScrolled 
          ? 'glass bg-white/90 shadow-md ' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        {/* Logo and Name */}
        <Link to="/" className="flex items-center group">
          <img 
            src={logo} 
            alt="Jana Bikas Logo" 
            className="h-20 w-auto object-contain transition-transform duration-300 group-hover:scale-105" 
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center space-x-0.5 xl:space-x-1">
          {navLinks.map((link) => (
            <div 
              key={link.name} 
              className="relative"
              onMouseEnter={() => link.hasDropdown && setCausesDropdown(true)}
              onMouseLeave={() => link.hasDropdown && setCausesDropdown(false)}
            >
              {link.hasDropdown ? (
                <button 
                  onClick={() => setCausesDropdown(!causesDropdown)}
                  className={`flex items-center space-x-1 px-2 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-colors whitespace-nowrap ${
                    isScrolled ? 'text-slate-700 hover:text-primary-600' : 'text-slate-100 hover:text-accent-300'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronDown className="w-3.5 h-3.5" />
                </button>
              ) : (
                <Link 
                  to={link.path}
                  className={`px-2 py-1.5 rounded-lg text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                    location.pathname === link.path 
                      ? (isScrolled ? 'text-primary-600 bg-primary-50' : 'text-accent-400 bg-white/10')
                      : (isScrolled ? 'text-slate-700 hover:text-primary-600' : 'text-slate-100 hover:text-accent-300')
                  }`}
                >
                  {link.name}
                </Link>
              )}

              {/* Causes Dropdown Menu */}
              {link.hasDropdown && causesDropdown && (
                <div className="absolute left-0 mt-0 w-64 bg-white border border-slate-100 shadow-xl rounded-xl py-2 animate-fade-in z-50">
                  <div className="px-4 py-1 text-xs font-semibold text-slate-400 uppercase border-b border-slate-50 mb-1">
                    Areas of Activity
                  </div>
                  {causes.map((cause) => (
                    <Link
                      key={cause.id}
                      to={`/causes/${cause.slug}`}
                      className="block px-4 py-2 text-sm text-slate-700 hover:bg-primary-50 hover:text-primary-700 font-medium transition-colors"
                      onClick={() => setCausesDropdown(false)}
                    >
                      {cause.title}
                    </Link>
                  ))}
                  <div className="border-t border-slate-50 mt-1 pt-1">
                    <Link
                      to="/causes"
                      className="block px-4 py-2 text-sm font-semibold text-primary-600 hover:text-primary-700 hover:bg-slate-50"
                      onClick={() => setCausesDropdown(false)}
                    >
                      View All Causes &rarr;
                    </Link>
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Action icons & CTA Button */}
        <div className="hidden xl:flex items-center space-x-2 xl:space-x-3 flex-shrink-0">
          {/* Search Toggle */}
          <div className="relative">
            <button 
              onClick={() => setSearchOpen(!searchOpen)} 
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-200 hover:bg-white/10'
              }`}
              aria-label="Search causes"
            >
              <Search className="w-5 h-5" />
            </button>

            {searchOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-2xl rounded-xl border border-slate-100 p-4 animate-fade-in z-50">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search causes (e.g. Health)..."
                    value={searchQuery}
                    onChange={handleSearch}
                    className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
                    autoFocus
                  />
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                </div>
                
                {/* Search Results Dropdown */}
                {searchQuery && (
                  <div className="mt-2 max-h-48 overflow-y-auto space-y-1">
                    {searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <Link
                          key={result.id}
                          to={`/causes/${result.slug}`}
                          className="block p-2 hover:bg-slate-50 rounded-lg text-left transition-colors"
                        >
                          <span className="block text-xs font-semibold text-primary-600">{result.title}</span>
                          <span className="block text-[11px] text-slate-500 truncate">{result.tagline}</span>
                        </Link>
                      ))
                    ) : (
                      <span className="block p-2 text-center text-xs text-slate-400">No matching causes found</span>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile / Tablet Controls */}
        <div className="xl:hidden flex items-center space-x-3">
          {/* Mobile Search Toggle */}
          <button
            onClick={() => {
              setSearchOpen(!searchOpen);
              setIsOpen(false);
            }}
            className={`p-2 rounded-full transition-colors ${
              isScrolled ? 'text-slate-600' : 'text-slate-200'
            }`}
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Hamburger Menu Toggle */}
          <button
            onClick={() => {
              setIsOpen(!isOpen);
              setSearchOpen(false);
            }}
            className={`p-2 rounded-full transition-colors ${
              isScrolled ? 'text-slate-800' : 'text-white'
            }`}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Expansion */}
      {searchOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white p-4 animate-slide-down">
          <div className="relative">
            <input
              type="text"
              placeholder="Search active causes..."
              value={searchQuery}
              onChange={handleSearch}
              className="w-full pl-9 pr-4 py-2 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm"
              autoFocus
            />
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          </div>
          {searchQuery && (
            <div className="mt-2 max-h-48 overflow-y-auto divide-y divide-slate-100">
              {searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Link
                    key={result.id}
                    to={`/causes/${result.slug}`}
                    className="block py-2 text-left"
                  >
                    <span className="block text-xs font-semibold text-primary-600">{result.title}</span>
                    <span className="block text-[11px] text-slate-500 truncate">{result.tagline}</span>
                  </Link>
                ))
              ) : (
                <span className="block py-2 text-center text-xs text-slate-400">No results found</span>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Slide-out Drawer */}
      {isOpen && (
        <div className="xl:hidden fixed inset-0 top-[60px] bg-slate-900/50 backdrop-blur-sm z-40 transition-all duration-300">
          <div className="bg-white w-3/4 max-w-sm h-full shadow-2xl p-6 overflow-y-auto animate-fade-in flex flex-col justify-between">
            <div className="space-y-6">
              <div className="space-y-1">
                <span className="block text-xs font-bold text-slate-400 uppercase tracking-widest">Navigation Menu</span>
                <div className="h-0.5 w-8 bg-primary-500"></div>
              </div>
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) => (
                  <div key={link.name}>
                    {link.hasDropdown ? (
                      <div>
                        <button 
                          onClick={() => setCausesDropdown(!causesDropdown)}
                          className="flex items-center justify-between w-full text-left py-2 font-semibold text-slate-800 hover:text-primary-600 transition-colors"
                        >
                          <span>{link.name}</span>
                          <ChevronDown className={`w-4 h-4 transform transition-transform ${causesDropdown ? 'rotate-180' : ''}`} />
                        </button>
                        {causesDropdown && (
                          <div className="pl-4 mt-2 space-y-2 border-l border-slate-100">
                            {causes.map((cause) => (
                              <Link
                                key={cause.id}
                                to={`/causes/${cause.slug}`}
                                className="block py-1 text-sm text-slate-600 hover:text-primary-600 transition-colors"
                              >
                                {cause.title}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link 
                        to={link.path}
                        className={`block py-2 font-semibold transition-colors ${
                          location.pathname === link.path 
                            ? 'text-primary-600 border-l-2 border-primary-500 pl-2' 
                            : 'text-slate-800 hover:text-primary-600'
                        }`}
                      >
                        {link.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
            
            {/* Mobile Bottom CTA */}
            <div className="pt-6 border-t border-slate-100">
              <Link 
                to="/donate"
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 shadow-md shadow-primary-900/10 hover:shadow-lg transition-all"
              >
                <Heart className="w-4 h-4 fill-white" />
                <span>Donate Now</span>
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default StickyHeader;
