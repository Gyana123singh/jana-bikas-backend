import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { CheckCircle2, FileText, Download, Share2, Facebook, Twitter, Phone as WhatsappIcon, ArrowRight } from 'lucide-react';

import { donationApi } from '../api';

const DonationSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [transaction, setTransaction] = React.useState(location.state?.transaction || null);
  const [loading, setLoading] = React.useState(!location.state?.transaction);
  const [error, setError] = React.useState('');

  useEffect(() => {
    const verifyAndConfirmRedirectPayment = async () => {
      const params = new URLSearchParams(location.search);
      const sessionId = params.get('session_id');
      const paymentIntentId = params.get('payment_intent');

      if (transaction) {
        setLoading(false);
        return;
      }

      if (!sessionId && !paymentIntentId) {
        navigate('/donate');
        return;
      }

      try {
        let payload = { sessionId, paymentIntentId };

        if (!sessionId && paymentIntentId) {
          const savedData = sessionStorage.getItem('pending_order');
          if (savedData) {
            const { order, paymentMode } = JSON.parse(savedData);
            payload = {
              paymentIntentId,
              cause: order.cause,
              donationType: order.type,
              generalAmount: order.generalAmount,
              kits: order.kits || [],
              kitsAmount: order.kitsAmount || 0,
              totalAmount: order.totalAmount,
              donor: {
                ...order.donor,
                pan: order.donor?.pan || '',
              },
              paymentMode,
            };
          }
        }
        
        // Call backend confirm endpoint to verify payment status and save donation
        const confirmation = await donationApi.confirmDonation(payload);

        sessionStorage.removeItem('pending_order');
        setTransaction(confirmation);
      } catch (err) {
        setError(err.message || 'Verification failed');
      } finally {
        setLoading(false);
      }
    };

    verifyAndConfirmRedirectPayment();
  }, [location.search, transaction, navigate]);

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-48 pb-16 text-center space-y-4">
        <div className="w-12 h-12 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <h2 className="text-xl font-bold text-slate-800">Verifying payment status...</h2>
        <p className="text-slate-500 text-sm">Please do not close this window or click back.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto px-4 pt-48 pb-16 text-center space-y-4">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-3xl font-bold font-sans">!</div>
        <h2 className="text-xl font-bold text-red-600">Payment Verification Failed</h2>
        <p className="text-slate-500 text-sm">{error}</p>
        <Link to="/donate" className="inline-block mt-4 py-2.5 px-6 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm">Back to Donations</Link>
      </div>
    );
  }

  if (!transaction) return null;

  const { donationId, amount, date, donorName, cause, paymentMode, transactionId } = transaction;

  const handleMockDownload = (docType) => {
    alert(`Generating your mock ${docType} PDF...\nDownload will begin shortly.`);
  };

  const shareText = `I just contributed ₹${amount} to Jana Bikas NGO for their ${cause.replace('-', ' ')} program. Join me in creating grassroot impact!`;

  return (
    <div className="max-w-3xl mx-auto px-4 pt-24 pb-16 space-y-10 text-center">
      
      {/* 1. Thank You Banner */}
      <div className="space-y-4 flex flex-col items-center">
        <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl md:text-5xl font-display font-extrabold text-slate-900 leading-tight">
          Thank You, {donorName}!
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto text-sm md:text-base leading-relaxed">
          Your contribution of <strong>₹{amount.toLocaleString('en-IN')}</strong> has been received successfully. You are bringing real change to underprivileged communities.
        </p>
      </div>

      {/* 2. Transaction Details Summary Card */}
      <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl max-w-lg mx-auto text-left space-y-4">
        <h3 className="text-base font-bold text-slate-900 border-b border-slate-50 pb-3">
          Transaction Summary
        </h3>
        <div className="divide-y divide-slate-50 text-xs space-y-3">
          <div className="flex justify-between pb-3 pt-1">
            <span className="text-slate-400 font-medium">Donation ID</span>
            <span className="text-slate-950 font-bold font-mono">{donationId}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-400 font-medium">Payment Mode</span>
            <span className="text-slate-950 font-bold uppercase">{paymentMode}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-400 font-medium">Transaction Reference</span>
            <span className="text-slate-950 font-bold font-mono text-[10px]">{transactionId}</span>
          </div>
          <div className="flex justify-between py-3">
            <span className="text-slate-400 font-medium">Donation Date</span>
            <span className="text-slate-950 font-bold">{date}</span>
          </div>
          <div className="flex justify-between pt-3 pb-1">
            <span className="text-slate-800 font-extrabold">Total Transferred</span>
            <span className="text-sm font-extrabold text-primary-600">₹{amount.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* 3. Document Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-2xl mx-auto pt-4">
        {/* View Receipt */}
        <Link 
          to={`/donation/${donationId}/receipt`}
          state={{ transaction: transaction }}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium hover:shadow-premium-hover flex flex-col items-center space-y-3 group text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <FileText className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 group-hover:text-primary-600 transition-colors">View Receipt</h4>
          <span className="text-[10px] text-slate-400 leading-normal">View or print donation invoice</span>
        </Link>

        {/* 80G Certificate */}
        <button
          onClick={() => handleMockDownload('80G Tax Exemption Certificate')}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium hover:shadow-premium-hover flex flex-col items-center space-y-3 group text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 group-hover:text-accent-600 transition-colors">80G Certificate</h4>
          <span className="text-[10px] text-slate-400 leading-normal">Get instant tax exemption PDF</span>
        </button>

        {/* 10BE Form */}
        <button
          onClick={() => handleMockDownload('Form 10BE Certificate')}
          className="bg-white border border-slate-100 p-6 rounded-2xl shadow-premium hover:shadow-premium-hover flex flex-col items-center space-y-3 group text-center"
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Download className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-600 transition-colors">10BE Form</h4>
          <span className="text-[10px] text-slate-400 leading-normal">Annual certificate when issued</span>
        </button>
      </div>

      {/* 4. Social Sharing & Home Redirects */}
      <div className="max-w-md mx-auto pt-6 border-t border-slate-100 space-y-6">
        <div className="space-y-3">
          <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Share Your Impact</span>
          <div className="flex justify-center space-x-3 text-xs font-bold text-slate-700">
            <a 
              href={`https://www.facebook.com/sharer/sharer.php?u=https://janabikasngo.org&quote=${encodeURIComponent(shareText)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 py-2 px-4 rounded-xl border border-slate-150 bg-white hover:bg-slate-50 transition-colors"
            >
              <Facebook className="w-4 h-4 text-blue-600" />
              <span>Facebook</span>
            </a>
            <a 
              href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 py-2 px-4 rounded-xl border border-slate-150 bg-white hover:bg-slate-50 transition-colors"
            >
              <Twitter className="w-4 h-4 text-sky-500" />
              <span>Twitter</span>
            </a>
            <a 
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 py-2 px-4 rounded-xl border border-slate-150 bg-white hover:bg-slate-50 transition-colors"
            >
              <WhatsappIcon className="w-4 h-4 text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        <div>
          <Link 
            to="/"
            className="inline-flex items-center space-x-2 py-3 px-8 rounded-full font-bold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-md text-sm"
          >
            <span>Back to Homepage</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};

export default DonationSuccess;
