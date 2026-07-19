import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, ShieldCheck, Award } from 'lucide-react';
import { donationApi } from '../api';

const CertificateView = () => {
  const location = useLocation();
  const { id } = useParams();
  const navigate = useNavigate();
  const [txn, setTxn] = useState(null);

  useEffect(() => {
    if (location.state?.transaction) {
      setTxn(location.state.transaction);
    } else if (id) {
      donationApi.getDonationById(id)
        .then(d => {
          setTxn({
            donationId: d.donationId,
            amount: d.totalAmount,
            date: new Date(d.createdAt).toLocaleDateString('en-IN', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            }),
            donorName: d.donor.fullName,
            email: d.donor.email,
            mobile: d.donor.mobile,
            pan: d.donor.pan,
            cause: d.cause,
            paymentMode: d.paymentMode,
            transactionId: d.transactionId
          });
        })
        .catch(err => {
          console.error('Failed to fetch donation certificate details:', err);
        });
    }
  }, [location.state, id]);

  if (!txn) return null;

  const { donationId, amount, date, donorName, pan, paymentMode, transactionId } = txn;

  const numberToWords = (num) => {
    if (num === 250000) return 'Two Lakh Fifty Thousand Rupees Only';
    if (num === 150000) return 'One Lakh Fifty Thousand Rupees Only';
    if (num === 100000) return 'One Lakh Rupees Only';
    if (num === 25000) return 'Twenty Five Thousand Rupees Only';
    if (num === 5000) return 'Five Thousand Rupees Only';
    if (num === 1000) return 'One Thousand Rupees Only';
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
          <span>Print Certificate</span>
        </button>
      </div>

      {/* Printable Certificate Page */}
      <div className="print-card bg-white border-8 border-double border-slate-350 p-8 md:p-12 rounded-2xl shadow-premium space-y-8 relative overflow-hidden text-left">
        
        {/* Certificate Border Wreath Background */}
        <div className="absolute top-8 right-8 border-4 border-accent-500/20 text-accent-500/40 rounded-full w-28 h-28 flex items-center justify-center font-display font-extrabold text-[10px] tracking-widest uppercase transform rotate-12 select-none">
          80G Approved
        </div>

        {/* 1. Logo and Header */}
        <div className="text-center space-y-2 border-b border-slate-100 pb-6">
          <span className="text-2xl">🌱</span>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 tracking-tight">JANA BIKAS NGO</h2>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            Registered Under Section 80G of the Income Tax Act, 1961
          </p>
          <p className="text-[9px] text-slate-400">
            Regd Address: Vikas Bhavan, Boring Road, Patna, Bihar - 800001
          </p>
        </div>

        {/* 2. Certificate Title */}
        <div className="text-center space-y-1 py-4">
          <h1 className="text-xl font-display font-extrabold tracking-wide text-slate-950 uppercase">
            Certificate of Tax Exemption
          </h1>
          <span className="block text-xs font-semibold text-primary-600 uppercase tracking-wider">
            80G Donation Receipt (Section 80G(5)(vi))
          </span>
        </div>

        {/* 3. Certificate Statement */}
        <div className="space-y-6 text-sm text-slate-700 leading-relaxed">
          <p>
            This is to certify that <strong className="text-slate-900">{donorName}</strong>, 
            holder of PAN <strong className="text-slate-900 font-mono uppercase">{pan || 'N/A'}</strong>, 
            has generously contributed the sum of <strong className="text-slate-950 font-extrabold">₹{amount.toLocaleString('en-IN')}</strong> 
            (in words: <em className="text-slate-800">{numberToWords(amount)}</em>) 
            to <strong className="text-slate-900">Jana Bikas NGO</strong> on <strong className="text-slate-900">{date}</strong>.
          </p>

          <p>
            The contribution was made via <strong className="text-slate-900">{paymentMode}</strong> with Transaction Reference <strong className="font-mono text-xs text-slate-900">{transactionId}</strong>.
          </p>

          <p className="text-xs bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600">
            <strong>Exemption Clause:</strong> Donations to Jana Bikas NGO are 50% tax exempt under Section 80G of the Income Tax Act, 1961, as per approval order reference <strong>IT/80G/2020-21/105</strong> issued by the Commissioner of Income Tax.
          </p>
        </div>

        {/* 4. Footer & Signature */}
        <div className="flex justify-between items-end pt-10 border-t border-slate-150">
          <div className="text-[9px] text-slate-400 space-y-1 leading-snug">
            <span>Certificate ID: {donationId}</span><br />
            <span>* Electronically verified document. No physical signature required.</span>
          </div>
          <div className="text-right space-y-1">
            <span className="block font-display font-bold text-slate-900 text-xs">For Jana Bikas NGO</span>
            <div className="w-24 h-1 border-b border-slate-200 py-3 mx-auto md:ml-auto"></div>
            <span className="block italic text-slate-400 text-[10px] pt-1 font-serif">(Authorized Trustee)</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default CertificateView;
