import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Printer, ArrowLeft, ShieldCheck } from 'lucide-react';
import { donationApi } from '../api';

const Form10BeView = () => {
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
          console.error('Failed to fetch donation Form 10BE details:', err);
        });
    }
  }, [location.state, id]);

  if (!txn) return null;

  const { donationId, amount, date, donorName, pan, paymentMode, transactionId } = txn;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-12 space-y-6">
      
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
          <span>Print Form 10BE</span>
        </button>
      </div>

      {/* Printable Form 10BE Page */}
      <div className="print-card bg-white border border-slate-300 p-8 md:p-12 rounded-2xl shadow-premium space-y-6 text-left">
        
        {/* Header Title */}
        <div className="text-center space-y-2 border-b border-slate-200 pb-4">
          <span className="text-xs font-bold text-slate-500 block uppercase tracking-wider">Form No. 10BE</span>
          <h1 className="text-lg font-display font-extrabold text-slate-900 leading-tight uppercase">
            Certificate of Donation
          </h1>
          <p className="text-[10px] text-slate-400 max-w-2xl mx-auto leading-normal">
            Certificate of donation under clause (ix) of sub-section (5) of section 80G / sub-section (1A) of section 35 of the Income Tax Act, 1961
          </p>
        </div>

        {/* Reporting Entity Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">1. Details of the Reporting Entity</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/3 bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">PAN of Reporting Entity</td>
                  <td className="p-2.5 font-mono text-slate-900">AAATJ9024E</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">Name of Reporting Entity</td>
                  <td className="p-2.5 text-slate-900">JANA BIKAS NGO</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">URN and Date of URN</td>
                  <td className="p-2.5 text-slate-900 font-mono">IT/80G/2020-21/105 dated 14/04/2020</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Donor & Donation Details Table */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">2. Details of the Donor & Contribution</h3>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-xs">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-left font-semibold text-slate-500">
                  <th className="p-2.5 border-r border-slate-200">Particulars</th>
                  <th className="p-2.5">Donor Information</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-200">
                  <td className="w-1/3 bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">Name of Donor</td>
                  <td className="p-2.5 text-slate-900 font-bold">{donorName}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">PAN / Aadhaar of Donor</td>
                  <td className="p-2.5 font-mono text-slate-900 uppercase">{pan || 'N/A'}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">Type of Donation</td>
                  <td className="p-2.5 text-slate-900 capitalize">Voluntary Contribution (General)</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">Mode of Receipt</td>
                  <td className="p-2.5 text-slate-900 uppercase font-semibold">{paymentMode}</td>
                </tr>
                <tr className="border-b border-slate-200">
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">Date of Receipt</td>
                  <td className="p-2.5 text-slate-900 font-mono">{date}</td>
                </tr>
                <tr>
                  <td className="bg-slate-50 p-2.5 font-semibold text-slate-500 border-r border-slate-200">Amount of Donation</td>
                  <td className="p-2.5 text-slate-950 font-extrabold text-sm">₹{amount.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Exemption Declarations */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-150 text-[10px] text-slate-500 leading-normal flex items-start space-x-2">
          <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
          <span>
            This certificate is issued under Form No. 10BE in compliance with the Income Tax Rules, 1962. It confirms the electronic filing of the Statement of Donations in Form No. 10BD with the Income Tax Department.
          </span>
        </div>

        {/* Verification footer */}
        <div className="flex justify-between items-end pt-8 border-t border-slate-200">
          <div className="text-[9px] text-slate-400 leading-snug">
            <span>Verify URN validation status at: www.incometax.gov.in</span><br />
            <span>Document ID: {donationId}-10BE</span>
          </div>
          <div className="text-right">
            <span className="block font-display font-bold text-slate-900 text-[10px] uppercase">Jana Bikas Trust Board</span>
            <span className="block italic text-slate-400 text-[9px] font-serif">(Electronic Verification Approved)</span>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Form10BeView;
