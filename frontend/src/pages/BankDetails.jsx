import React, { useState } from 'react';
import { Copy, Check, ShieldCheck, QrCode } from 'lucide-react';

const BankDetails = () => {
  const [copiedAcc, setCopiedAcc] = useState(false);
  const [copiedIfsc, setCopiedIfsc] = useState(false);

  const bankInfo = {
    holderName: "JANA BIKAS NGO",
    bankName: "State Bank of India",
    accNumber: "39024564810",
    ifsc: "SBIN0000045",
    branch: "Boring Road Patna Branch",
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text).then(() => {
      if (type === 'acc') {
        setCopiedAcc(true);
        setTimeout(() => setCopiedAcc(false), 2000);
      } else {
        setCopiedIfsc(true);
        setTimeout(() => setCopiedIfsc(false), 2000);
      }
    });
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
            You can make direct bank transfers or scan our official BHIM UPI QR Code to donate.
          </p>
        </div>
      </section>

      {/* 2. Content Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Bank transfer info card */}
        <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl space-y-6 text-left">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Direct Bank Transfer</h3>
            <p className="text-xs text-slate-400">Transfer funds securely from your online banking app</p>
          </div>

          <div className="divide-y divide-slate-100">
            {/* Holder */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400 font-medium">Account Holder</span>
              <span className="text-slate-900 font-bold">{bankInfo.holderName}</span>
            </div>
            
            {/* Bank Name */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400 font-medium">Bank Name</span>
              <span className="text-slate-900 font-semibold">{bankInfo.bankName}</span>
            </div>

            {/* Account Number */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400 font-medium">Account Number</span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-900 font-bold font-mono">{bankInfo.accNumber}</span>
                <button
                  onClick={() => copyToClipboard(bankInfo.accNumber, 'acc')}
                  className={`p-1.5 rounded bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-slate-500 relative`}
                  aria-label="Copy account number"
                >
                  {copiedAcc ? <Check className="w-3.5 h-3.5 text-primary-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedAcc && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-800 text-[9px] text-white rounded font-bold uppercase whitespace-nowrap z-10">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* IFSC */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400 font-medium">IFSC Code</span>
              <div className="flex items-center space-x-2">
                <span className="text-slate-900 font-bold font-mono">{bankInfo.ifsc}</span>
                <button
                  onClick={() => copyToClipboard(bankInfo.ifsc, 'ifsc')}
                  className="p-1.5 rounded bg-slate-50 border border-slate-100 hover:bg-slate-100 transition-colors text-slate-500 relative"
                  aria-label="Copy IFSC code"
                >
                  {copiedIfsc ? <Check className="w-3.5 h-3.5 text-primary-600" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedIfsc && (
                    <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-0.5 bg-slate-800 text-[9px] text-white rounded font-bold uppercase whitespace-nowrap z-10">
                      Copied!
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Branch */}
            <div className="flex items-center justify-between py-3 text-sm">
              <span className="text-slate-400 font-medium">Branch</span>
              <span className="text-slate-900 font-semibold">{bankInfo.branch}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-800 leading-relaxed flex items-start space-x-2">
            <ShieldCheck className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <span>
              <strong>Receipts for Bank Transfers:</strong> After executing a bank transfer, kindly email your transaction reference slip, PAN, and full name to <strong>donations@janabikasngo.org</strong> to claim your 80G tax certificate.
            </span>
          </div>
        </div>

        {/* QR Code Scan Card */}
        <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-lg font-bold text-slate-900">Scan to Donate</h3>
            <p className="text-xs text-slate-400">Supports PhonePe, Google Pay, Paytm, BHIM</p>
          </div>

          {/* SVG Vector QR Code Box */}
          <div className="relative p-6 bg-slate-50 rounded-2xl border border-slate-100 w-52 h-52 flex items-center justify-center">
            {/* Clean QR vector wrapper */}
            <svg 
              className="w-40 h-40 text-slate-800" 
              viewBox="0 0 100 100" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Outer boundary blocks */}
              <rect x="5" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6"/>
              <rect x="12.5" y="12.5" width="10" height="10" fill="currentColor"/>
              
              <rect x="70" y="5" width="25" height="25" stroke="currentColor" strokeWidth="6"/>
              <rect x="77.5" y="12.5" width="10" height="10" fill="currentColor"/>

              <rect x="5" y="70" width="25" height="25" stroke="currentColor" strokeWidth="6"/>
              <rect x="12.5" y="77.5" width="10" height="10" fill="currentColor"/>

              {/* Smaller alignment squares */}
              <rect x="75" y="75" width="12" height="12" stroke="currentColor" strokeWidth="4"/>
              
              {/* Simulated pixels */}
              <path d="M40 10h5v5h-5zM50 15h5v5h-5zM60 10h5v5h-5zM45 25h5v5h-5zM55 25h5v5h-5z" fill="currentColor"/>
              <path d="M10 40h5v5h-5zM15 50h5v5h-5zM25 45h5v5h-5zM10 60h5v5h-5z" fill="currentColor"/>
              <path d="M40 40h10v10H40zM55 45h10v5H55zM50 60h5v15h-5zM60 55h5v5h-5zM60 70h5v5h-5z" fill="currentColor"/>
              <path d="M70 40h5v5h-5zM85 45h5v10h-5zM80 50h5v5h-5z" fill="currentColor"/>
              <path d="M40 80h5v10h-5zM50 85h15v5H50z" fill="currentColor"/>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-white rounded-lg border border-slate-100 flex items-center justify-center shadow text-xs">
                🌱
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-800 uppercase tracking-widest block">UPI VPA Handle</span>
            <span className="text-sm font-mono font-bold text-primary-600 block">janabikasngo@sbi</span>
          </div>
        </div>

      </section>

    </div>
  );
};

export default BankDetails;
