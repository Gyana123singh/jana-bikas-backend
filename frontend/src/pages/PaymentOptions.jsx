import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, ArrowLeft, Landmark, CreditCard, Smartphone, Check } from 'lucide-react';
import useSiteContent from '../hooks/useSiteContent';

import { donationApi, stripeApi } from '../api';

const PaymentOptions = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const content = useSiteContent();
  
  // Extract checkout order payload from state
  const order = location.state?.order;

  // If no checkout details exist, redirect to donate page
  useEffect(() => {
    if (!order) {
      navigate('/donate');
    }
  }, [order, navigate]);

  // States
  const [activeTab, setActiveTab] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [selectedUpiApp, setSelectedUpiApp] = useState('');
  const [upiVpa, setUpiVpa] = useState('');
  const [cardDetails, setCardDetails] = useState({ number: '', expiry: '', cvv: '', name: '' });
  const [selectedBank, setSelectedBank] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(300); // 5 minutes countdown
  const [errors, setErrors] = useState({});
  const [stripeReady, setStripeReady] = useState(false);
  const [stripeInstance, setStripeInstance] = useState(null);
  const [stripeElements, setStripeElements] = useState(null);
  const [cardElement, setCardElement] = useState(null);

  useEffect(() => {
    const checkStripeConfig = async () => {
      try {
        const data = await stripeApi.getConfig();
        if (data && data.isEnabled) {
          setStripeReady(true);
        } else {
          const paymentConfig = content?.paymentConfig || {};
          setStripeReady(Boolean(paymentConfig.isEnabled));
        }
      } catch (err) {
        const paymentConfig = content?.paymentConfig || {};
        setStripeReady(Boolean(paymentConfig.isEnabled));
      }
    };
    checkStripeConfig();
  }, [content]);

  // Load Stripe and initialize elements
  useEffect(() => {
    const initStripe = async () => {
      let publishableKey = content?.paymentConfig?.publishableKey || import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || '';
      
      if (!publishableKey) {
        try {
          const data = await stripeApi.getConfig();
          if (data && data.publishableKey) {
            publishableKey = data.publishableKey;
          }
        } catch (err) {
          console.error('Error fetching stripe config:', err);
        }
      }

      if (publishableKey && window.Stripe) {
        try {
          const stripe = window.Stripe(publishableKey);
          setStripeInstance(stripe);
          const elements = stripe.elements();
          setStripeElements(elements);
        } catch (e) {
          console.error('Failed to initialize Stripe:', e);
        }
      }
    };

    if (stripeReady || content?.paymentConfig?.isEnabled) {
      initStripe();
    }
  }, [stripeReady, content]);

  // Mount/Unmount Card Element
  useEffect(() => {
    if (activeTab === 'card' && stripeElements && stripeReady) {
      const timer = setTimeout(() => {
        const el = document.getElementById('stripe-card-element');
        if (el) {
          el.innerHTML = '';
          const card = stripeElements.create('card', {
            style: {
              base: {
                color: '#0f172a',
                fontFamily: 'Outfit, Inter, sans-serif',
                fontSmoothing: 'antialiased',
                fontSize: '14px',
                '::placeholder': {
                  color: '#94a3b8',
                },
              },
              invalid: {
                color: '#ef4444',
                iconColor: '#ef4444',
              },
            },
          });
          card.mount('#stripe-card-element');
          setCardElement(card);
        }
      }, 50);
      return () => clearTimeout(timer);
    } else {
      setCardElement(null);
    }
  }, [activeTab, stripeElements, stripeReady]);

  // Countdown timer effect
  useEffect(() => {
    if (timerSeconds <= 0) {
      alert('Transaction session expired. Please try again.');
      navigate('/donate');
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds(prev => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds, navigate]);

  if (!order) return null;

  const { totalAmount, donor } = order;

  // Format timer MM:SS
  const formatTime = () => {
    const minutes = Math.floor(timerSeconds / 60);
    const seconds = timerSeconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  // Form handlers
  const handleCardChange = (e) => {
    const { name, value } = e.target;
    // Format card number with spaces
    let formattedVal = value;
    if (name === 'number') {
      formattedVal = value.replace(/\s?/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19);
    } else if (name === 'expiry') {
      formattedVal = value.replace(/\//g, '').replace(/(\d{2})/g, '$1/').substring(0, 5);
      if (formattedVal.endsWith('/')) formattedVal = formattedVal.slice(0, -1);
    } else if (name === 'cvv') {
      formattedVal = value.replace(/\D/g, '').substring(0, 3);
    }
    setCardDetails(prev => ({ ...prev, [name]: formattedVal }));
  };

  const validatePayment = () => {
    const tempErrors = {};
    if (activeTab === 'upi') {
      if (!selectedUpiApp && !upiVpa.trim()) {
        tempErrors.upi = 'Please select a UPI App or enter a valid VPA ID.';
      } else if (upiVpa && !/@\w+$/.test(upiVpa)) {
        tempErrors.upi = 'Invalid VPA format (e.g. user@okaxis).';
      }
    } else if (activeTab === 'card') {
      if (stripeReady) {
        if (!cardDetails.name.trim()) {
          tempErrors.cardName = 'Name on Card is required.';
        }
      } else {
        if (cardDetails.number.replace(/\s/g, '').length !== 16) {
          tempErrors.cardNumber = 'Card number must be 16 digits.';
        }
        if (!/^\d{2}\/\d{2}$/.test(cardDetails.expiry)) {
          tempErrors.cardExpiry = 'Enter expiry in MM/YY format.';
        }
        if (cardDetails.cvv.length !== 3) {
          tempErrors.cardCvv = 'CVV must be 3 digits.';
        }
        if (!cardDetails.name.trim()) {
          tempErrors.cardName = 'Name on Card is required.';
        }
      }
    } else if (activeTab === 'netbanking') {
      if (!selectedUpiApp) {
        tempErrors.bank = 'Please choose a bank from the list.';
      }
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handlePayComplete = async () => {
    if (validatePayment()) {
      setIsProcessing(true);
      try {
        const intentData = await donationApi.createPaymentIntent({
          totalAmount,
          cause: order.cause,
          donationType: order.type,
          generalAmount: order.generalAmount,
          kits: order.kits || [],
          kitsAmount: order.kitsAmount || 0,
          donor: {
            ...order.donor,
            pan: order.donor?.pan || '',
          },
        });

        // If Stripe is enabled in real-time, redirect directly to Stripe Hosted Checkout Page!
        if (stripeReady && intentData.checkoutUrl) {
          window.location.href = intentData.checkoutUrl;
          return;
        }

        // Mock mode (fallback if Stripe is disabled)
        const confirmation = await donationApi.confirmDonation({
          paymentIntentId: intentData.paymentIntentId,
          cause: order.cause,
          donationType: order.type,
          generalAmount: order.generalAmount,
          kits: order.kits || [],
          kitsAmount: order.kitsAmount || 0,
          totalAmount,
          donor: {
            ...order.donor,
            pan: order.donor?.pan || '',
          },
          paymentMode: activeTab.toUpperCase(),
        });

        navigate('/donation-success', { state: { transaction: confirmation } });
      } catch (error) {
        alert(error.message || 'Payment failed. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const upiApps = [
    { id: 'phonepe', name: 'PhonePe', icon: '📱' },
    { id: 'gpay', name: 'Google Pay', icon: '💳' },
    { id: 'paytm', name: 'Paytm', icon: '🏦' },
    { id: 'cred', name: 'CRED UPI', icon: '🏆' }
  ];

  const banks = [
    'State Bank of India', 'HDFC Bank', 'ICICI Bank', 'Axis Bank', 'Punjab National Bank', 'Kotak Mahindra Bank'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 space-y-8">
      
      {/* Back to details */}
      <button 
        onClick={() => navigate('/donate')}
        className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Modify Details</span>
      </button>

      {/* Header bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-900 text-white border border-slate-850">
        <div className="space-y-1">
          <span className="text-[10px] text-accent-400 font-bold uppercase tracking-widest">Gateway Checkout</span>
          <h2 className="text-xl font-display font-bold">{content.paymentHeading}</h2>
        </div>
        <div className="flex items-center space-x-6 text-sm">
          <div className="text-right">
            <span className="block text-slate-400 text-xs font-medium">Payable Sum</span>
            <span className="text-2xl font-display font-extrabold text-accent-400">₹{totalAmount.toLocaleString('en-IN')}</span>
          </div>
          <div className="py-2 px-3 rounded-xl bg-slate-800 border border-slate-700 text-center">
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wide">Time Left</span>
            <span className="font-mono text-sm font-extrabold text-red-400">{formatTime()}</span>
          </div>
        </div>
      </div>

      {/* Checkout Area split */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
        
        {/* Navigation tabs left side */}
        <div className="bg-white border border-slate-100 shadow-premium p-4 rounded-2xl flex flex-col space-y-1">
          <button
            onClick={() => { setActiveTab('upi'); setErrors({}); }}
            className={`flex items-center space-x-3 w-full py-3 px-4 rounded-xl text-left text-sm font-bold transition-all ${
              activeTab === 'upi' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Smartphone className="w-4 h-4 text-slate-500" />
            <span>UPI / Apps</span>
          </button>
          <button
            onClick={() => { setActiveTab('card', { number: '', expiry: '', cvv: '', name: '' }); setErrors({}); }}
            className={`flex items-center space-x-3 w-full py-3 px-4 rounded-xl text-left text-sm font-bold transition-all ${
              activeTab === 'card' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <CreditCard className="w-4 h-4 text-slate-500" />
            <span>Credit / Debit Card</span>
          </button>
          <button
            onClick={() => { setActiveTab('netbanking'); setErrors({}); }}
            className={`flex items-center space-x-3 w-full py-3 px-4 rounded-xl text-left text-sm font-bold transition-all ${
              activeTab === 'netbanking' ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <Landmark className="w-4 h-4 text-slate-500" />
            <span>Net Banking</span>
          </button>
        </div>

        {/* Form details right side (2 columns) */}
        <div className="md:col-span-2 bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl min-h-[300px] flex flex-col justify-between">
          
          {/* Active Tab rendering */}
          <div>
            {/* UPI Tab */}
            {activeTab === 'upi' && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">UPI Payment Channels</h3>
                  <p className="text-xs text-slate-400">Select app or enter custom VPA ID</p>
                </div>
                
                {/* Apps list */}
                <div className="grid grid-cols-2 gap-3">
                  {upiApps.map((app) => (
                    <button
                      type="button"
                      key={app.id}
                      onClick={() => { setSelectedUpiApp(app.id); setUpiVpa(`${donor.mobile}@ok${app.id}`); }}
                      className={`flex items-center space-x-3 p-3.5 rounded-xl border text-sm font-semibold transition-all ${
                        selectedUpiApp === app.id
                          ? 'border-primary-600 bg-primary-50/50 text-primary-700'
                          : 'border-slate-150 hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span>{app.icon}</span>
                      <span>{app.name}</span>
                    </button>
                  ))}
                </div>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-slate-100"></div>
                  </div>
                  <div className="relative flex justify-center text-xs font-semibold uppercase">
                    <span className="bg-white px-3 text-slate-400">Or Enter Custom VPA</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 block">UPI ID / VPA</label>
                  <input
                    type="text"
                    placeholder="username@bankhandle"
                    value={upiVpa}
                    onChange={(e) => { setUpiVpa(e.target.value); setSelectedUpiApp(''); }}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                  {errors.upi && <p className="text-red-500 text-xs">{errors.upi}</p>}
                </div>
              </div>
            )}

            {/* Card Tab */}
            {activeTab === 'card' && (
              <div className="space-y-4 text-left">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Credit or Debit Card Details</h3>
                  <p className="text-xs text-slate-400">All transactions are fully encrypted</p>
                </div>

                {stripeReady ? (
                  <div className="grid grid-cols-1 gap-4">
                    {/* Stripe Card Element Mount Node */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Card Details</label>
                      <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg focus-within:ring-2 focus-within:ring-primary-500 min-h-[38px]">
                        <div id="stripe-card-element"></div>
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Name on Card</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Holder Name"
                        value={cardDetails.name}
                        onChange={handleCardChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                      />
                      {errors.cardName && <p className="text-red-500 text-xs">{errors.cardName}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-4">
                    {/* Card Number */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Card Number</label>
                      <input
                        type="text"
                        name="number"
                        placeholder="XXXX XXXX XXXX XXXX"
                        value={cardDetails.number}
                        onChange={handleCardChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                      />
                      {errors.cardNumber && <p className="text-red-500 text-xs">{errors.cardNumber}</p>}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      {/* Expiry */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">Expiry Date</label>
                        <input
                          type="text"
                          name="expiry"
                          placeholder="MM/YY"
                          value={cardDetails.expiry}
                          onChange={handleCardChange}
                          className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold text-center"
                        />
                        {errors.cardExpiry && <p className="text-red-500 text-xs">{errors.cardExpiry}</p>}
                      </div>

                      {/* CVV */}
                      <div className="space-y-1">
                        <label className="text-xs font-semibold text-slate-600 block">CVV</label>
                        <input
                          type="password"
                          name="cvv"
                          placeholder="***"
                          value={cardDetails.cvv}
                          onChange={handleCardChange}
                          className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold text-center"
                        />
                        {errors.cardCvv && <p className="text-red-500 text-xs">{errors.cardCvv}</p>}
                      </div>
                    </div>

                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-600 block">Name on Card</label>
                      <input
                        type="text"
                        name="name"
                        placeholder="Holder Name"
                        value={cardDetails.name}
                        onChange={handleCardChange}
                        className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                      />
                      {errors.cardName && <p className="text-red-500 text-xs">{errors.cardName}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Net Banking Tab */}
            {activeTab === 'netbanking' && (
              <div className="space-y-6 text-left">
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Select Net Banking Bank</h3>
                  <p className="text-xs text-slate-400">Directly route to secure banking login</p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-600 block">Choose Bank</label>
                  <select
                    value={selectedUpiApp}
                    onChange={(e) => setSelectedUpiApp(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2.5 px-4 text-sm font-semibold"
                  >
                    <option value="">-- Choose Bank --</option>
                    {banks.map((bank, idx) => (
                      <option key={idx} value={bank}>{bank}</option>
                    ))}
                  </select>
                  {errors.bank && <p className="text-red-500 text-xs">{errors.bank}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Action trigger button */}
          <div className="pt-8 border-t border-slate-50 mt-6 flex flex-col space-y-3">
            <button
              onClick={handlePayComplete}
              disabled={isProcessing}
              className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md shadow-primary-900/10 hover:shadow-lg transition-all disabled:opacity-50"
            >
              {isProcessing ? (
                <span>Verifying Transaction Securely...</span>
              ) : (
                <>
                  <ShieldCheck className="w-5 h-5" />
                  <span>Verify & Pay ₹{totalAmount.toLocaleString('en-IN')}</span>
                </>
              )}
            </button>
            <div className="text-[10px] text-center text-slate-400 flex items-center justify-center space-x-2">
              <Check className="w-3.5 h-3.5 text-primary-600" />
              <span>{stripeReady ? 'Stripe-ready secure checkout with modern payment protection.' : 'Secure checkout is running in demo mode until Stripe is configured.'}</span>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default PaymentOptions;
