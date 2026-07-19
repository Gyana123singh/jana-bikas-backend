import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check, ShieldCheck, QrCode, ArrowRight, CheckCircle, AlertCircle, Heart, Landmark, Loader2, FileText, Award } from 'lucide-react';
import useSiteContent from '../hooks/useSiteContent';
import { useCauses } from '../context/CausesContext';
import { donationApi } from '../api';

const BankDetails = () => {
  const content = useSiteContent();
  const { causes } = useCauses();

  // Load dynamic bank configurations
  const bankInfo = content.bankDetails || {
    holderName: "JANA BIKAS NGO",
    bankName: "State Bank of India",
    accNumber: "39024564810",
    ifsc: "SBIN0000045",
    branch: "Boring Road Patna Branch",
    upiId: "janabikasngo@sbi",
    qrCodeUrl: ""
  };

  // Restore persisted offline donation from localStorage (survives refresh)
  const savedDonation = (() => {
    try {
      const raw = localStorage.getItem('offlineDonation');
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  })();

  // Form states
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    mobile: '',
    pan: '',
    address: '',
    cause: 'general',
    donationType: 'one-time',
    totalAmount: '',
    displayPublicly: true,
    paymentMode: 'BANK_TRANSFER'
  });

  const [formError, setFormError] = useState('');
  const [registering, setRegistering] = useState(false);
  const [registeredDonation, setRegisteredDonation] = useState(savedDonation?.donation || null);

  // Reference confirmation state
  const [utr, setUtr] = useState(savedDonation?.utr || '');
  const [utrSubmitting, setUtrSubmitting] = useState(false);
  const [utrSubmitted, setUtrSubmitted] = useState(savedDonation?.utrSubmitted || false);

  // Persist to localStorage helper
  const persistOfflineDonation = (donation, utrVal, submitted) => {
    try {
      localStorage.setItem('offlineDonation', JSON.stringify({
        donation,
        utr: utrVal || '',
        utrSubmitted: submitted || false,
        savedAt: Date.now()
      }));
    } catch {}
  };

  // Clear persisted data and start fresh
  const startFreshDonation = () => {
    localStorage.removeItem('offlineDonation');
    setRegisteredDonation(null);
    setUtr('');
    setUtrSubmitted(false);
    setFormError('');
  };

  // Copy helpers
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'acc') {
        setCopiedAcc(true);
        setTimeout(() => setCopiedAcc(false), 2000);
      } else if (type === 'ifsc') {
        setCopiedIfsc(true);
        setTimeout(() => setCopiedIfsc(false), 2000);
      } else {
        setCopiedUpi(true);
        setTimeout(() => setCopiedUpi(false), 2000);
      }
    });
  };

  const handleRegisterIntent = async (e) => {
    e.preventDefault();
    setFormError('');

    const amt = Number(formData.totalAmount);
    if (!formData.fullName.trim() || !formData.email.trim() || !formData.mobile.trim() || !formData.totalAmount) {
      setFormError('Please fill in all required fields (Name, Email, Mobile, and Amount).');
      return;
    }
    if (isNaN(amt) || amt <= 0) {
      setFormError('Please enter a valid donation amount.');
      return;
    }

    setRegistering(true);
    try {
      const payload = {
        totalAmount: amt,
        cause: formData.cause,
        donationType: formData.donationType,
        paymentMode: formData.paymentMode,
        donor: {
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          mobile: formData.mobile.trim(),
          pan: formData.pan.trim(),
          address: formData.address.trim(),
          displayPublicly: formData.displayPublicly
        }
      };

      const res = await donationApi.createOfflineDonation(payload);
      setRegisteredDonation(res);
      persistOfflineDonation(res, '', false);
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to submit donation details. Please try again.');
    } finally {
      setRegistering(false);
    }
  };

  const handleUtrSubmit = async (e) => {
    e.preventDefault();
    if (!utr.trim()) return;

    setUtrSubmitting(true);
    try {
      await donationApi.submitOfflineReference({
        donationId: registeredDonation.donationId,
        transactionId: utr.trim()
      });
      setUtrSubmitted(true);
      persistOfflineDonation(registeredDonation, utr.trim(), true);
    } catch (err) {
      setFormError('Failed to save transaction ID. Please reach support.');
    } finally {
      setUtrSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Offline Channels</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Bank Donation Details</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Register your donation intent details to unlock our official bank transfers and BHIM UPI QR codes.
          </p>
        </div>
      </section>

      {/* 2. Main workflow Split */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* STEP 1: FILL FORM IF NOT REGISTERED */}
        {!registeredDonation ? (
          <div className="max-w-2xl mx-auto bg-white border border-slate-100 shadow-premium p-6 md:p-10 rounded-2xl space-y-8 text-left">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-primary-50 rounded-full flex items-center justify-center text-primary-600 mx-auto">
                <Heart className="w-6 h-6 fill-primary-100" />
              </div>
              <h3 className="text-xl font-display font-bold text-slate-900">Donation Details Form</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                We require donor details to file proper audits and generate tax exemption certificates under section 80G. Hitting register will reveal our bank account and scan details.
              </p>
            </div>

            <form onSubmit={handleRegisterIntent} className="space-y-4">
              
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => setFormData(prev => ({ ...prev, fullName: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none"
                    placeholder="name@email.com"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Mobile Number *</label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData(prev => ({ ...prev, mobile: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none"
                    placeholder="10-digit phone number"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">PAN Card (Optional, for 80G benefit)</label>
                  <input
                    type="text"
                    value={formData.pan}
                    onChange={(e) => setFormData(prev => ({ ...prev, pan: e.target.value.toUpperCase() }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none uppercase font-mono"
                    placeholder="ABCDE1234F"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block">Residential Address</label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                  rows="2"
                  className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none"
                  placeholder="Street, City, Postal Code"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Program Allocation / Cause</label>
                  <select
                    value={formData.cause}
                    onChange={(e) => setFormData(prev => ({ ...prev, cause: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none capitalize"
                  >
                    <option value="general">General Support (Non-allocated)</option>
                    {(causes || []).map(c => (
                      <option key={c._id} value={c.slug}>{c.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Donation Frequency</label>
                  <select
                    value={formData.donationType}
                    onChange={(e) => setFormData(prev => ({ ...prev, donationType: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none"
                  >
                    <option value="one-time">One-Time voluntary grant</option>
                    <option value="monthly">Monthly commitment</option>
                  </select>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Donation Amount (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.totalAmount}
                    onChange={(e) => setFormData(prev => ({ ...prev, totalAmount: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none font-mono"
                    placeholder="Enter amount, e.g. 5000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Preferred Transfer Channel</label>
                  <select
                    value={formData.paymentMode}
                    onChange={(e) => setFormData(prev => ({ ...prev, paymentMode: e.target.value }))}
                    className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none"
                  >
                    <option value="BANK_TRANSFER">Direct IMPS / NEFT Bank Transfer</option>
                    <option value="QR_SCAN">Scan UPI QR Code</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center space-x-2 pt-2">
                <input
                  type="checkbox"
                  id="displayPublicly"
                  checked={formData.displayPublicly}
                  onChange={(e) => setFormData(prev => ({ ...prev, displayPublicly: e.target.checked }))}
                  className="rounded border-slate-350 text-primary-600 focus:ring-primary-500 w-4 h-4"
                />
                <label htmlFor="displayPublicly" className="text-xs text-slate-500 select-none">
                  Display my contribution name on the public Respected Donors board
                </label>
              </div>

              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-100 rounded-xl flex items-center space-x-2 text-rose-600 text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={registering}
                className="flex items-center justify-center space-x-2 w-full py-3.5 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md transition-all text-sm disabled:opacity-50"
              >
                {registering ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Registering Donation Intent...</span>
                  </>
                ) : (
                  <>
                    <span>Register Donation & Get Bank Details</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          
          /* STEP 2: REVEAL DETAILS AND ACCEPT REFERENCE */
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_0.9fr] gap-8 items-start animate-fade-in text-left">
            
            {/* Direct Bank Account / QR display */}
            <div className="space-y-6">
              
              {/* Success Intent Alert Banner */}
              <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-6 space-y-3">
                <div className="flex items-center space-x-2 text-emerald-800 font-bold text-sm">
                  <CheckCircle className="w-5 h-5 text-emerald-600" />
                  <span>Intent Registered Successfully!</span>
                </div>
                <div className="text-xs text-emerald-700 space-y-1">
                  <p>Your Donation ID: <strong className="font-mono text-slate-900">{registeredDonation.donationId}</strong></p>
                  <p>Please execute a transfer of <strong className="text-slate-900 font-bold text-sm">₹{registeredDonation.totalAmount.toLocaleString('en-IN')}</strong> using the channels below.</p>
                </div>
              </div>

              {/* Dynamic content rendering based on selected channel */}
              {registeredDonation.paymentMode === 'BANK_TRANSFER' ? (
                <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                      <Landmark className="w-5 h-5 text-primary-500" />
                      <span>Direct Bank Transfer</span>
                    </h3>
                    <p className="text-xs text-slate-450">Execute NEFT, IMPS or RTGS payment transfer from your netbanking app.</p>
                  </div>

                  <div className="divide-y divide-slate-100 text-xs">
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-450 font-medium">Account Name</span>
                      <span className="text-slate-900 font-bold">{bankInfo.holderName}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-450 font-medium">Bank Name</span>
                      <span className="text-slate-900 font-semibold">{bankInfo.bankName}</span>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-450 font-medium">Account Number</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-900 font-bold font-mono">{bankInfo.accNumber}</span>
                        <button
                          onClick={() => copyToClipboard(bankInfo.accNumber, 'acc')}
                          className="p-1 rounded bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-500 relative"
                        >
                          {copiedAcc ? <Check className="w-3 h-3 text-primary-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-450 font-medium">IFSC Code</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-slate-900 font-bold font-mono">{bankInfo.ifsc}</span>
                        <button
                          onClick={() => copyToClipboard(bankInfo.ifsc, 'ifsc')}
                          className="p-1 rounded bg-slate-50 border border-slate-150 hover:bg-slate-100 text-slate-500 relative"
                        >
                          {copiedIfsc ? <Check className="w-3 h-3 text-primary-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between py-3">
                      <span className="text-slate-450 font-medium">Branch</span>
                      <span className="text-slate-900 font-semibold">{bankInfo.branch}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 flex items-center justify-center gap-2">
                      <QrCode className="w-5 h-5 text-primary-500" />
                      <span>Scan to Donate</span>
                    </h3>
                    <p className="text-xs text-slate-450">Supports PhonePe, Google Pay, Paytm, BHIM</p>
                  </div>

                  {/* QR Image Box */}
                  <div className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100 w-52 h-52 flex items-center justify-center overflow-hidden">
                    {bankInfo.qrCodeUrl ? (
                      <img src={bankInfo.qrCodeUrl} alt="Donation QR Code" className="w-full h-full object-contain" />
                    ) : (
                      // Fallback vector QR Code SVG
                      <svg 
                        className="w-40 h-40 text-slate-800" 
                        viewBox="0 0 100 100" 
                        fill="none" 
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect x="5" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6"/>
                        <rect x="12.5" y="12.5" width="10" height="10" fill="currentColor"/>
                        <rect x="70" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6"/>
                        <rect x="77.5" y="12.5" width="10" height="10" fill="currentColor"/>
                        <rect x="5" y="70" width="25" height="25" stroke="currentColor" strokeWidth="6"/>
                        <rect x="12.5" y="77.5" width="10" height="10" fill="currentColor"/>
                        <rect x="75" y="75" width="12" height="12" stroke="currentColor" strokeWidth="4"/>
                        <path d="M40 10h5v5h-5zM50 15h5v5h-5zM60 10h5v5h-5zM45 25h5v5h-5zM55 25h5v5h-5z" fill="currentColor"/>
                        <path d="M10 40h5v5h-5zM15 50h5v5h-5zM25 45h5v5h-5zM10 60h5v5h-5z" fill="currentColor"/>
                        <path d="M40 40h10v10H40zM55 45h10v5H55zM50 60h5v15h-5zM60 55h5v5h-5zM60 70h5v5h-5z" fill="currentColor"/>
                        <path d="M70 40h5v5h-5zM85 45h5v10h-5zM80 50h5v5h-5z" fill="currentColor"/>
                        <path d="M40 80h5v10h-5zM50 85h15v5H50z" fill="currentColor"/>
                      </svg>
                    )}
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block">UPI ID Handle</span>
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-sm font-mono font-bold text-primary-600">{bankInfo.upiId}</span>
                      <button 
                        onClick={() => copyToClipboard(bankInfo.upiId, 'upi')}
                        className="p-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-150 text-slate-450"
                      >
                        {copiedUpi ? <Check className="w-3 h-3 text-primary-600" /> : <Copy className="w-3 h-3" />}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Back to registration switch helper */}
              <button 
                onClick={startFreshDonation}
                className="text-xs font-bold text-primary-600 hover:text-primary-700 transition"
              >
                &larr; Fill details for another donation
              </button>

            </div>

            {/* Confirm reference block */}
            <div className="space-y-6">
              <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Confirm My Payment</h3>
                  <p className="text-xs text-slate-450">Input transaction logs reference once transfer is made.</p>
                </div>

                {!utrSubmitted ? (
                  <form onSubmit={handleUtrSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-slate-650 block">Bank Transaction ID / UTR Number</label>
                      <input 
                        type="text"
                        required
                        value={utr}
                        onChange={(e) => setUtr(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold outline-none font-mono"
                        placeholder="e.g. 12-digit UTR or Txn ID"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={utrSubmitting}
                      className="flex items-center justify-center space-x-2 w-full py-2.5 rounded-xl font-display font-bold text-white bg-slate-900 hover:bg-slate-800 shadow transition text-xs"
                    >
                      {utrSubmitting ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving reference...</span>
                        </>
                      ) : (
                        <span>Submit Payment Confirmation</span>
                      )}
                    </button>
                  </form>
                ) : (
                  <div className="space-y-5">
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-emerald-800 text-xs font-semibold space-y-1">
                      <div className="flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        <span>Confirmation Sent!</span>
                      </div>
                      <p className="text-slate-500 font-normal leading-relaxed mt-1">
                        Your reference UTR <strong className="font-mono text-slate-900">{utr}</strong> has been logged. Our finance team will verify the transfer against bank statements and approve the record shortly.
                      </p>
                    </div>

                    {/* Document Download Cards */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Your Donation Documents</h4>
                      <p className="text-[10px] text-slate-400 leading-relaxed">
                        Documents will be fully generated once admin verifies your payment. You can also access them later from the <Link to="/downloads" className="text-primary-600 font-semibold hover:underline">Download Center</Link> using your Donation ID & Mobile.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      {/* View Receipt */}
                      <Link
                        to={`/donation/${registeredDonation.donationId}/receipt`}
                        state={{ transaction: {
                          donationId: registeredDonation.donationId,
                          donorName: registeredDonation.donor?.fullName,
                          amount: registeredDonation.totalAmount,
                          cause: registeredDonation.cause,
                          paymentMode: registeredDonation.paymentMode,
                          transactionId: utr,
                          date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                        }}}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs group-hover:text-primary-600 transition-colors">View Receipt</h4>
                            <span className="text-[10px] text-slate-400">View or print donation invoice</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-primary-500 transition-colors" />
                      </Link>

                      {/* 80G Certificate */}
                      <Link
                        to={`/donation/${registeredDonation.donationId}/certificate`}
                        state={{ transaction: {
                          donationId: registeredDonation.donationId,
                          donorName: registeredDonation.donor?.fullName,
                          email: registeredDonation.donor?.email,
                          pan: registeredDonation.donor?.pan,
                          amount: registeredDonation.totalAmount,
                          cause: registeredDonation.cause,
                          paymentMode: registeredDonation.paymentMode,
                          transactionId: utr,
                          date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                        }}}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                            <Award className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs group-hover:text-accent-600 transition-colors">80G Certificate</h4>
                            <span className="text-[10px] text-slate-400">Get instant tax exemption certificate</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-accent-500 transition-colors" />
                      </Link>

                      {/* 10BE Form */}
                      <Link
                        to={`/donation/${registeredDonation.donationId}/10be`}
                        state={{ transaction: {
                          donationId: registeredDonation.donationId,
                          donorName: registeredDonation.donor?.fullName,
                          email: registeredDonation.donor?.email,
                          pan: registeredDonation.donor?.pan,
                          amount: registeredDonation.totalAmount,
                          cause: registeredDonation.cause,
                          paymentMode: registeredDonation.paymentMode,
                          transactionId: utr,
                          date: new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })
                        }}}
                        className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-white hover:bg-slate-50 transition-colors group"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-slate-900 text-xs group-hover:text-emerald-600 transition-colors">10BE Form</h4>
                            <span className="text-[10px] text-slate-400">Annual certificate of donation</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-emerald-500 transition-colors" />
                      </Link>
                    </div>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-2 text-xs leading-normal">
                  <span className="font-semibold text-slate-800 block">Verification Protocol:</span>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Once you make the payment and submit the UTR reference here, the donation goes to "Pending verification" status. 
                    Our administrator audits bank ledger sheets daily. Once verified, the donation state changes to "Completed", raising cause metrics and populating the Respected Donors list.
                  </p>
                </div>
              </div>
            </div>

          </div>
        )}

        <div className="max-w-2xl mx-auto mt-16 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
          <div className="inline-flex w-10 h-10 rounded-full bg-primary-50 items-center justify-center text-primary-600">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Regulatory Compliance & Transparency</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            All offline donations receive fully verified Form 10BE and Section 80G tax exemptions. In compliance with Central Board of Direct Taxes (CBDT) rules, we log PAN details strictly for verified tax filing purposes.
          </p>
        </div>
      </section>

    </div>
  );
};

export default BankDetails;
