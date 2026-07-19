import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, Check, ShieldCheck } from 'lucide-react';

const ReceiptView = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [txn, setTxn] = useState(null);

  useEffect(() => {
    // If details are passed in state (from Success redirect)
    if (location.state?.transaction) {
      setTxn(location.state.transaction);
    } else {
      // Load realistic fallback mock receipt for demonstration if accessed directly
      setTxn({
        donationId: id || 'DON-10243',
        amount: 250000,
        date: '15/06/2026',
        donorName: 'Raj Kumar Singhal',
        email: 'raj.singhal@email.com',
        mobile: '9876543210',
        pan: 'AAATJ9024E',
        cause: 'education',
        paymentMode: 'UPI',
        transactionId: 'TXN-902456481'
      });
    }
  }, [location.state, id]);

  if (!txn) return null;

  const { donationId, amount, date, donorName, pan, paymentMode, transactionId } = txn;

  // Convert number to words in Indian Currency (up to lakhs for representation)
  const numberToWords = (num) => {
    if (num === 250000) return 'Two Lakh Fifty Thousand Rupees Only';
    if (num === 150000) return 'One Lakh Fifty Thousand Rupees Only';
    if (num === 100000) return 'One Lakh Rupees Only';
    if (num === 500000) return 'Five Lakh Rupees Only';
    if (num === 75000) return 'Seventy Five Thousand Rupees Only';
    if (num === 1000) return 'One Thousand Rupees Only';
    if (num === 2000) return 'Two Thousand Rupees Only';
    if (num === 3000) return 'Three Thousand Rupees Only';
    if (num === 4000) return 'Four Thousand Rupees Only';
    if (num === 5000) return 'Five Thousand Rupees Only';
    if (num === 10000) return 'Ten Thousand Rupees Only';
    return `${num.toLocaleString('en-IN')} Rupees Only`;
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-12 space-y-6">
      
      {/* Back button (hidden in print) */}
      <div className="no-print flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 uppercase tracking-wider transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back</span>
        </button>
        
        <button
          onClick={handlePrint}
          className="inline-flex items-center space-x-2 py-2 px-4 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-500 transition-colors shadow-sm text-xs"
        >
          <Printer className="w-4 h-4" />
          <span>Print Receipt</span>
        </button>
      </div>

      {/* Printable Invoice Page */}
      <div className="print-card bg-white border border-slate-200 p-8 md:p-12 rounded-2xl shadow-premium space-y-8 relative overflow-hidden text-left">
        
        {/* Decorative stamp seal top right (hidden in basic print text formats but neat on screen) */}
        <div className="absolute top-8 right-8 border-4 border-emerald-500/20 text-emerald-500/40 rounded-full w-24 h-24 flex items-center justify-center font-display font-extrabold text-[10px] tracking-widest uppercase transform rotate-12 select-none">
          Paid Seal
        </div>

        {/* 1. Header Details */}
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-primary-600 to-accent-500 flex items-center justify-center text-white text-base">
                🌱
              </div>
              <span className="font-display font-extrabold text-lg text-slate-900 tracking-tight">JANA BIKAS NGO</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-normal max-w-sm">
              Regd Off: 4th Floor, Vikas Bhavan, Boring Road, Patna, Bihar, Pin - 800001<br />
              Email: contact@janabikasngo.org | Web: www.janabikasngo.org
            </p>
          </div>
          <div className="text-left md:text-right space-y-1 text-[10px] text-slate-500">
            <span className="block font-bold text-slate-800 uppercase tracking-wider text-[11px]">Tax Registrations</span>
            <span>Registration No: S-56439/2014-BR</span><br />
            <span>NITI Aayog Darpan ID: BR/2016/0104592</span><br />
            <span>PAN Number: AAATJ9024E</span>
          </div>
        </div>

        {/* 2. Receipt Title */}
        <div className="text-center">
          <h2 className="text-xl font-display font-extrabold tracking-widest text-slate-900 border-b-2 border-slate-900 inline-block pb-1 uppercase">
            Payment Receipt
          </h2>
        </div>

        {/* 3. Transaction Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm bg-slate-50 p-4 rounded-xl">
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Receipt Number</span>
            <span className="font-mono font-bold text-slate-900 text-xs">REC-{donationId.split('-')[1]}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Donation ID</span>
            <span className="font-mono font-bold text-slate-900 text-xs">{donationId}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Transaction ID</span>
            <span className="font-mono font-bold text-slate-900 text-xs">{transactionId}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-wider">Date</span>
            <span className="font-semibold text-slate-900 text-xs">{date}</span>
          </div>
        </div>

        {/* 4. Payment Details Body */}
        <div className="space-y-4 text-sm leading-relaxed">
          <p>
            Received with thanks from <strong className="text-slate-900">{donorName}</strong>, 
            bearing Permanent Account Number (PAN) <strong className="text-slate-900 font-mono uppercase">{pan || 'N/A'}</strong>, 
            the sum of <strong className="text-slate-950 font-extrabold">₹{amount.toLocaleString('en-IN')}</strong> (in words: <em className="text-slate-700">{numberToWords(amount)}</em>) 
            transferred via <strong className="text-slate-900">{paymentMode}</strong>.
          </p>
          <p>
            This contribution was received for the development and support of our active social program categories.
          </p>
        </div>

        {/* 5. Trust Stamp Exemption Declaration */}
        <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs text-emerald-800 leading-normal flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            <strong>80G Benefit Claim:</strong> Donations to Jana Bikas NGO are eligible for tax deduction under Section 80G of the Income Tax Act. Please preserve this receipt for your annual tax filing records.
          </span>
        </div>

        {/* 6. Authorized Signatory Seal Sign */}
        <div className="flex justify-between items-end pt-12 border-t border-slate-150">
          <div className="text-[10px] text-slate-400 leading-snug">
            * This is an electronically generated receipt and does not require a physical signature.<br />
            * Generated at: {date}
          </div>
          <div className="text-right space-y-2">
            {/* Signature dummy line */}
            <div className="font-display font-bold text-slate-900 text-xs tracking-wide">
              For Jana Bikas NGO
            </div>
            <div className="italic text-slate-400 text-[11px] font-serif pt-4 pr-2">
              (Authorized Signatory)
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default ReceiptView;
