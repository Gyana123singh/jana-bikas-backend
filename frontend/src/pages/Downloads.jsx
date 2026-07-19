import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, FileText, Download, ShieldCheck, AlertCircle, Loader2 } from 'lucide-react';
import { donationApi } from '../api';

const Downloads = () => {
  const navigate = useNavigate();
  const [donationId, setDonationId] = useState('');
  const [mobile, setMobile] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!donationId.trim() || !mobile.trim()) {
      setError('Please fill in both fields.');
      return;
    }

    setError('');
    setLoading(true);
    setSearched(false);
    
    try {
      const result = await donationApi.searchDonations({
        donationId: donationId.trim(),
        mobile: mobile.trim()
      });
      setSearchResult(result);
      setSearched(true);
    } catch (err) {
      setSearchResult(null);
      setSearched(true);
      setError(err.response?.data?.message || 'No completed donation matches the credentials provided.');
    } finally {
      setLoading(false);
    }
  };

  const triggerDownload = (docType) => {
    if (!searchResult) return;
    
    if (docType === 'receipt') {
      navigate(`/donation/${searchResult.donationId}/receipt`, { 
        state: { transaction: searchResult } 
      });
    } else if (docType === 'certificate') {
      navigate(`/donation/${searchResult.donationId}/certificate`, { 
        state: { transaction: searchResult } 
      });
    } else if (docType === '10be') {
      navigate(`/donation/${searchResult.donationId}/10be`, { 
        state: { transaction: searchResult } 
      });
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Donor documents</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Download Center</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Search and retrieve your tax exemption certificates, Form 10BE, and payment receipts.
          </p>
        </div>
      </section>

      {/* 2. Lookup Form Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        
        {/* Lookup form card */}
        <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6 text-left">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Find My Documents</h3>
            <p className="text-xs text-slate-400">Enter your credentials to securely locate tax forms</p>
          </div>

          <form onSubmit={handleSearch} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Donation ID / Receipt Number</label>
              <input
                type="text"
                placeholder="e.g. DON-10001"
                value={donationId}
                onChange={(e) => setDonationId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold uppercase"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 block">Registered Mobile Number</label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
              />
            </div>

            {error && !searched && <p className="text-red-500 text-xs font-semibold">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md transition-all text-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Search Documents</span>
                </>
              )}
            </button>
          </form>

          <div className="p-4 rounded-xl bg-slate-50 text-[10px] text-slate-500 leading-normal flex items-start space-x-2">
            <AlertCircle className="w-4 h-4 text-primary-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Privacy Guideline:</strong> For security, we require both the exact Donation ID and the 10-digit mobile number submitted during checkout. You can test lookup using mock details: Donation ID: <strong>DON-10001</strong>, Mobile: <strong>9876543210</strong>.
            </span>
          </div>
        </div>

        {/* Search results rendering */}
        <div className="space-y-6 text-left">
          {loading ? (
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl flex flex-col items-center justify-center text-slate-400 text-xs gap-3">
              <Loader2 className="w-6 h-6 animate-spin text-primary-500" />
              <span>Verifying authorization logs...</span>
            </div>
          ) : searched ? (
            searchResult ? (
              <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6 animate-fade-in">
                <div>
                  <span className="text-[10px] text-primary-600 uppercase font-bold tracking-wider">Supporter Records Found</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-1">{searchResult.donorName}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-slate-400">Donation Date: {searchResult.date} | Sum: ₹{searchResult.amount.toLocaleString('en-IN')}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      searchResult.status === 'completed' 
                        ? 'bg-emerald-100 text-emerald-700' 
                        : 'bg-amber-100 text-amber-700'
                    }`}>
                      {searchResult.status === 'completed' ? '✓ Verified' : '⏳ Pending Verification'}
                    </span>
                  </div>
                </div>

                {searchResult.status === 'pending' && (
                  <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-amber-800 leading-relaxed">
                    <strong>Note:</strong> Your offline payment is awaiting admin verification. Documents are available for preview, but the official certificates will be issued once verification is complete.
                  </div>
                )}
                
                <div className="grid grid-cols-1 gap-3">
                  {/* Payment Receipt */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-50 text-primary-600 flex items-center justify-center">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">Payment Receipt</h4>
                        <span className="text-[10px] text-slate-400">Proof of donation transfer</span>
                      </div>
                    </div>
                    <button
                      onClick={() => triggerDownload('receipt')}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      aria-label="Download payment receipt"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 80G Certificate */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-accent-50 text-accent-600 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">80G Certificate</h4>
                        <span className="text-[10px] text-slate-400">Exemption claim document</span>
                      </div>
                    </div>
                    <button
                      onClick={() => triggerDownload('certificate')}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      aria-label="Download 80G Certificate"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Form 10BE */}
                  <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-colors text-sm">
                    <div className="flex items-center space-x-3">
                      <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">10BE Statement</h4>
                        <span className="text-[10px] text-slate-400">Annual cumulative statement</span>
                      </div>
                    </div>
                    <button
                      onClick={() => triggerDownload('10be')}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors"
                      aria-label="Download Form 10BE"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50/50 border border-red-150 p-8 rounded-2xl text-center space-y-3 animate-fade-in">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto" />
                <h4 className="font-bold text-red-950 text-sm">No Records Found</h4>
                <p className="text-xs text-red-800 leading-relaxed max-w-sm mx-auto">
                  {error || "We couldn't locate any completed records matching that Donation ID and Mobile number combination. Please verify your details."}
                </p>
              </div>
            )
          ) : (
            <div className="bg-slate-50 border border-slate-100 p-8 rounded-2xl text-center text-slate-400 text-xs leading-normal">
              Enter your credentials on the left side to load active download links.
            </div>
          )}
        </div>

      </section>

    </div>
  );
};

export default Downloads;
