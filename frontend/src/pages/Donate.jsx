import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Heart, ShieldCheck, ShoppingBag, Info, Plus, Minus } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { causes } from '../data/ngoData';
import useSiteContent from '../hooks/useSiteContent';

import { donationApi } from '../api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Donate = () => {
  const content = useSiteContent();
  const activitySlides = [
    {
      title: "Nurturing Quality Education",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Healthcare at Local Doorsteps",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Empowering Rural Agriculture",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80"
    },
    {
      title: "Fostering Self-Reliant Women",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80"
    }
  ];

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialCause = searchParams.get('cause') || 'general';

  // State Variables
  const [selectedCause, setSelectedCause] = useState(initialCause);
  const [donationType, setDonationType] = useState('one-time'); // 'one-time' | 'monthly'
  const [presetAmount, setPresetAmount] = useState(1000);
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Essentials Packages State
  const [kits, setKits] = useState([
    { id: 'edu', name: 'Education Kit', price: 500, description: 'Books and stationery for a child.', qty: 0 },
    { id: 'food', name: 'Food Support Pack', price: 1000, description: 'Dry grocery provisions for a family.', qty: 0 },
    { id: 'med', name: 'Medical Health Kit', price: 2500, description: 'Diagnostic checks and basic medicines.', qty: 0 }
  ]);

  // Form Fields State
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pan: '',
    dob: '',
    address: '',
    displayPublicly: true,
  });

  const [errors, setErrors] = useState({});

  const presetOptions = [500, 1000, 2000, 5000, 10000, 15000, 20000, 30000];

  // Recalculate totals
  const generalAmount = customAmount ? parseFloat(customAmount) : presetAmount;
  const kitsAmount = kits.reduce((acc, kit) => acc + (kit.price * kit.qty), 0);
  const totalAmount = (isNaN(generalAmount) ? 0 : generalAmount) + kitsAmount;

  // Handle preset clicks
  const handlePresetSelect = (val) => {
    setPresetAmount(val);
    setCustomAmount('');
  };

  // Handle custom amount entry
  const handleCustomChange = (e) => {
    const val = e.target.value;
    if (val === '' || /^\d+$/.test(val)) {
      setCustomAmount(val);
      setPresetAmount(0);
    }
  };

  // Adjust kit quantities
  const updateKitQty = (id, delta) => {
    setKits(prev => prev.map(kit => {
      if (kit.id === id) {
        const newQty = Math.max(0, kit.qty + delta);
        return { ...kit, qty: newQty };
      }
      return kit;
    }));
  };

  // Handle form changes
  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.mobile.trim()) {
      tempErrors.mobile = 'Mobile Number is required.';
    } else if (!/^\d{10}$/.test(formData.mobile)) {
      tempErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (formData.pan && !/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.pan.toUpperCase())) {
      tempErrors.pan = 'Please enter a valid PAN format (e.g. ABCDE1234F).';
    }

    if (totalAmount < 200) {
      tempErrors.amount = 'Minimum donation amount is ₹200.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      
      const orderPayload = {
        cause: selectedCause,
        type: donationType,
        generalAmount,
        kits: kits.filter(k => k.qty > 0),
        kitsAmount,
        totalAmount,
        donor: {
          ...formData,
          pan: formData.pan.toUpperCase()
        }
      };

      try {
        const data = await donationApi.createPaymentIntent({
          ...orderPayload,
          frontendUrl: window.location.origin,
        });

        if (data.checkoutUrl) {
          // Redirect directly to Stripe Hosted Checkout page!
          window.location.href = data.checkoutUrl;
        } else {
          // Fallback to local options if Stripe is not enabled/mock mode is active
          navigate('/payment-options', { state: { order: orderPayload } });
        }
      } catch (err) {
        alert(err.message || 'Checkout failed. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 space-y-12">
      
      {/* Activity Slider */}
      <div className="relative h-[40vh] w-full bg-slate-900 rounded-3xl overflow-hidden shadow-xl border border-slate-100">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full w-full"
        >
          {activitySlides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full">
              <div 
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-900/40 to-transparent"></div>
              </div>
              <div className="absolute bottom-8 left-8 text-left text-white z-10 space-y-2">
                <span className="text-[10px] uppercase font-bold tracking-widest text-accent-400 bg-accent-500/20 px-2.5 py-1 rounded-full">
                  NGO Ground Activity
                </span>
                <h2 className="text-2xl md:text-3xl font-display font-extrabold text-white leading-tight">
                  {slide.title}
                </h2>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Trust Badges Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-premium">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">100% Transparency</h4>
            <p className="text-[10px] text-slate-400">Quarterly reports & audit logs available</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-premium">
          <div className="w-10 h-10 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600 flex-shrink-0">
            <Heart className="w-5 h-5" stroke="#d97706" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">Assured Utilization</h4>
            <p className="text-[10px] text-slate-400">Directly funds selected essentials</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-4 bg-white rounded-2xl border border-slate-100 shadow-premium">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 flex-shrink-0">
            <ShieldCheck className="w-5 h-5" stroke="#059669" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-slate-900">Tax Benefit Certificate</h4>
            <p className="text-[10px] text-slate-400">50% exemption under Section 80G</p>
          </div>
        </div>
      </div>

      {/* Page Header */}
      <div className="text-center space-y-3 pt-4">
        <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Make a contribution</span>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight">{content.paymentHeading}</h1>
        <p className="text-slate-500 max-w-2xl mx-auto text-sm">
          {content.paymentText}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Left 2 Columns: Configuration & Info Forms */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Section 1: Choose Cause & Mode */}
          <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-950 flex items-center space-x-2">
              <span className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 text-xs font-bold">1</span>
              <span>Select Cause & Frequency</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Select Program */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Direct Funds To</label>
                <select
                  value={selectedCause}
                  onChange={(e) => setSelectedCause(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2.5 px-4 text-sm"
                >
                  <option value="general">General Support (All Programs)</option>
                  {causes.map((c) => (
                    <option key={c.id} value={c.slug}>{c.title}</option>
                  ))}
                </select>
              </div>

              {/* Select Frequency */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Donation Frequency</label>
                <div className="flex bg-slate-50 border border-slate-100 p-1 rounded-lg">
                  <button
                    type="button"
                    onClick={() => setDonationType('one-time')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                      donationType === 'one-time' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    One-time Donation
                  </button>
                  <button
                    type="button"
                    onClick={() => setDonationType('monthly')}
                    className={`flex-1 py-1.5 rounded-md text-xs font-bold transition-all ${
                      donationType === 'monthly' ? 'bg-white text-primary-700 shadow-sm' : 'text-slate-500'
                    }`}
                  >
                    Monthly Support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Contribution Amounts */}
          <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-950 flex items-center space-x-2">
              <span className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 text-xs font-bold">2</span>
              <span>Choose Donation Amount</span>
            </h3>

            {/* Presets Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {presetOptions.map((option) => (
                <button
                  type="button"
                  key={option}
                  onClick={() => handlePresetSelect(option)}
                  className={`py-3 px-4 rounded-xl text-sm font-bold border transition-all ${
                    presetAmount === option
                      ? 'border-primary-600 bg-primary-50 text-primary-700'
                      : 'border-slate-150 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  ₹{option.toLocaleString('en-IN')}
                </button>
              ))}
            </div>

            {/* Custom Amount input */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Custom Contribution Amount</label>
              <div className="relative max-w-sm">
                <span className="absolute left-4 top-2.5 text-slate-400 font-bold text-sm">₹</span>
                <input
                  type="text"
                  placeholder="Enter other amount"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full pl-8 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 text-sm font-semibold"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Donate Essentials Packages */}
          <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-950 flex items-center space-x-2">
              <span className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 text-xs font-bold">3</span>
              <span>Donate Essentials Pack (Optional Add-ons)</span>
            </h3>
            <p className="text-xs text-slate-400 leading-normal">
              You can support specific packages which supply children, families, or communities with physical kits.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kits.map((kit) => (
                <div key={kit.id} className="border border-slate-100 rounded-2xl p-5 bg-slate-50/50 flex flex-col justify-between space-y-4">
                  <div className="space-y-1.5 text-left">
                    <span className="inline-block p-1.5 rounded-lg bg-primary-50 text-primary-600">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                    <h4 className="font-bold text-sm text-slate-900">{kit.name}</h4>
                    <p className="text-[11px] text-slate-400 leading-tight">{kit.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <span className="text-xs font-extrabold text-primary-600">₹{kit.price}</span>
                    
                    {/* Quantity controls */}
                    <div className="flex items-center border border-slate-200 bg-white rounded-lg p-0.5 space-x-2">
                      <button
                        type="button"
                        onClick={() => updateKitQty(kit.id, -1)}
                        className="p-1 hover:bg-slate-50 rounded text-slate-500"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold w-4 text-center">{kit.qty}</span>
                      <button
                        type="button"
                        onClick={() => updateKitQty(kit.id, 1)}
                        className="p-1 hover:bg-slate-50 rounded text-slate-500"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 4: Personal Information Form */}
          <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6">
            <h3 className="text-lg font-bold text-slate-950 flex items-center space-x-2">
              <span className="w-6 h-6 bg-primary-50 rounded-lg flex items-center justify-center text-primary-600 text-xs font-bold">4</span>
              <span>Donor Personal Information</span>
            </h3>
            
            <div className="p-4 rounded-xl bg-slate-50 text-[11px] text-slate-500 leading-normal flex items-start space-x-2">
              <Info className="w-4 h-4 text-primary-500 flex-shrink-0 mt-0.5" />
              <span>
                <strong>Tax Certificate Note:</strong> A valid Permanent Account Number (PAN) and billing address are required by government tax guidelines to claim tax deductions on payments under Section 80G.
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* Full Name */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Full Name *</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Enter name"
                  value={formData.fullName}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm"
                />
                {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
              </div>

              {/* Email Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Email Address *</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm"
                />
                {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
              </div>

              {/* Mobile Number */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Mobile Number *</label>
                <input
                  type="tel"
                  name="mobile"
                  placeholder="10-digit number"
                  value={formData.mobile}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm"
                />
                {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
              </div>

              {/* PAN Card */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">PAN Number (for 80G tax benefit)</label>
                <input
                  type="text"
                  name="pan"
                  placeholder="10-character alphanumeric"
                  value={formData.pan}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm uppercase"
                />
                {errors.pan && <p className="text-red-500 text-xs">{errors.pan}</p>}
              </div>

              {/* DOB */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Date of Birth</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm"
                />
              </div>

              {/* Address */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Billing Address</label>
                <input
                  type="text"
                  name="address"
                  placeholder="City, State, PIN"
                  value={formData.address}
                  onChange={handleFormChange}
                  className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm"
                />
              </div>
            </div>

            {/* Display Consent Toggle */}
            <div className="pt-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="displayPublicly"
                  checked={formData.displayPublicly}
                  onChange={handleFormChange}
                  className="rounded text-primary-600 focus:ring-primary-500 w-4 h-4 border-slate-350"
                />
                <span className="text-xs text-slate-600 font-semibold select-none">
                  Display my donation amount and name publicly on the Respected Donors Feed.
                </span>
              </label>
            </div>
          </div>

        </div>

        {/* Right Column: Checkout Summary Sidebar */}
        <div className="space-y-6 sticky top-24">
          <div className="bg-white border border-slate-100 shadow-premium p-6 rounded-2xl space-y-6">
            <div>
              <h3 className="text-lg font-bold text-slate-950">Donation Summary</h3>
              <p className="text-xs text-slate-400">Review your checkout selections</p>
            </div>
            
            <div className="divide-y divide-slate-100 text-sm space-y-3">
              {/* General support part */}
              <div className="flex justify-between pb-3 pt-1">
                <span className="text-slate-400 font-medium capitalize">
                  {selectedCause === 'general' ? 'General support' : `${selectedCause.replace('-', ' ')}`}
                </span>
                <span className="text-slate-900 font-bold">₹{generalAmount.toLocaleString('en-IN')}</span>
              </div>

              {/* Kits breakdown */}
              {kits.filter(k => k.qty > 0).map((kit) => (
                <div key={kit.id} className="flex justify-between py-3 text-xs">
                  <span className="text-slate-400 font-medium">{kit.name} (x{kit.qty})</span>
                  <span className="text-slate-900 font-semibold">₹{(kit.price * kit.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}

              {/* Grand Total */}
              <div className="flex justify-between pt-4 pb-1">
                <span className="text-slate-800 font-extrabold">Grand Total</span>
                <span className="text-xl font-display font-extrabold text-primary-600">₹{totalAmount.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {errors.amount && <p className="text-red-500 text-xs text-center">{errors.amount}</p>}

            <button
              type="submit"
              disabled={isLoading}
              className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md shadow-primary-900/10 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isLoading ? (
                <span>Redirecting to Payment Gateway...</span>
              ) : (
                <>
                  <Heart className="w-5 h-5 fill-white" />
                  <span>Proceed to Pay</span>
                </>
              )}
            </button>
          </div>

          {/* Secure transaction notes */}
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center space-x-3 text-slate-500">
            <ShieldCheck className="w-8 h-8 text-primary-600 flex-shrink-0" />
            <div className="text-[10px] leading-snug">
              <span className="block font-bold text-slate-800">Secure 256-bit SSL Checkout</span>
              Your data is encrypted. Gateway partners comply with PCI-DSS global standards.
            </div>
          </div>
        </div>

      </form>
    </div>
  );
};

export default Donate;
