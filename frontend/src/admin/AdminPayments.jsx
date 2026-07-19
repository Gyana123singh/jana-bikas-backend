import React, { useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, Sparkles, Save, CheckCircle, XCircle, Info, RefreshCw, Calendar, Phone, Mail, Award, Check, X } from 'lucide-react';
import { contentApi, stripeApi, donationApi, galleryApi } from '../api';

const AdminPayments = () => {
  const [activeTab, setActiveTab] = useState('stripe');

  // Stripe Config state
  const [config, setConfig] = useState({ isEnabled: false, publishableKey: '', currency: 'inr', mode: 'test' });
  const [stripeLoading, setStripeLoading] = useState(true);
  const [stripeSaving, setStripeSaving] = useState(false);
  const [stripeMessage, setStripeMessage] = useState('');

  // Bank & QR Config state
  const [bankDetails, setBankDetails] = useState({
    holderName: '',
    bankName: '',
    accNumber: '',
    ifsc: '',
    branch: '',
    upiId: '',
    qrCodeUrl: ''
  });
  const [bankLoading, setBankLoading] = useState(true);
  const [bankSaving, setBankSaving] = useState(false);
  const [bankMessage, setBankMessage] = useState('');
  const [uploadingQR, setUploadingQR] = useState(false);

  // Offline Verification state
  const [donations, setDonations] = useState([]);
  const [offlineLoading, setOfflineLoading] = useState(true);
  const [offlineError, setOfflineError] = useState('');
  const [offlineMessage, setOfflineMessage] = useState('');
  const [filterStatus, setFilterStatus] = useState('pending');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalDonations, setTotalDonations] = useState(0);

  // Inspector Modal
  const [selectedDonation, setSelectedDonation] = useState(null);

  // Load configs
  useEffect(() => {
    contentApi.getContent()
      .then((data) => {
        const paymentConfig = data?.paymentConfig || { isEnabled: false, publishableKey: '', currency: 'inr', mode: 'test' };
        setConfig(paymentConfig);

        const details = data?.bankDetails || { holderName: '', bankName: '', accNumber: '', ifsc: '', branch: '', upiId: '', qrCodeUrl: '' };
        setBankDetails(details);
      })
      .catch(() => {
        stripeApi.getConfig()
          .then((data) => setConfig(data));
      })
      .finally(() => {
        setStripeLoading(false);
        setBankLoading(false);
      });
  }, []);

  // Load offline donations
  const fetchOfflineDonations = async () => {
    setOfflineLoading(true);
    setOfflineError('');
    try {
      const res = await donationApi.getDonationsAdmin({
        page,
        limit: 10,
        status: filterStatus || undefined
      });
      setDonations(res.donations || []);
      setTotalPages(res.pages || 1);
      setTotalDonations(res.total || 0);
    } catch (err) {
      setOfflineError('Failed to fetch donation records.');
    } finally {
      setOfflineLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'offline') {
      fetchOfflineDonations();
    }
  }, [activeTab, page, filterStatus]);

  const handleSaveStripe = async () => {
    setStripeSaving(true);
    setStripeMessage('');
    try {
      await contentApi.updateContent({ paymentConfig: config });
      setStripeMessage('Stripe settings updated successfully');
    } catch (error) {
      setStripeMessage(error.response?.data?.message || error.message || 'Unable to save payment settings');
    } finally {
      setStripeSaving(false);
    }
  };

  const onBankFieldChange = (field, value) => {
    setBankDetails(prev => ({ ...prev, [field]: value }));
  };

  const handleQRUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingQR(true);
    setBankMessage('');
    try {
      const res = await galleryApi.uploadImage(file);
      setBankDetails(prev => ({
        ...prev,
        qrCodeUrl: res.url
      }));
      setBankMessage('QR Code image uploaded successfully! Make sure to save changes.');
    } catch (err) {
      setBankMessage('QR Code upload failed.');
    } finally {
      setUploadingQR(false);
    }
  };

  const handleSaveBank = async () => {
    setBankSaving(true);
    setBankMessage('');
    try {
      await contentApi.updateContent({ bankDetails });
      setBankMessage('Bank & QR details updated successfully');
    } catch (error) {
      setBankMessage(error.response?.data?.message || error.message || 'Unable to save bank details');
    } finally {
      setBankSaving(false);
    }
  };

  const handleUpdateStatus = async (donationId, status) => {
    setOfflineMessage('');
    if (!window.confirm(`Are you sure you want to mark donation ${donationId} as ${status}?`)) {
      return;
    }
    try {
      await donationApi.updateDonationAdmin(donationId, { status });
      setOfflineMessage(`Donation ${donationId} successfully marked as ${status}`);
      setSelectedDonation(null);
      fetchOfflineDonations();
    } catch (err) {
      setOfflineError(`Failed to update donation status.`);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Financial administration</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Payment configuration & audits</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Configure online credit-card checkouts, manage bank accounts and UPI QR-code details, or verify offline direct transfer donations.
            </p>
          </div>
        </div>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-white/10 pb-1 gap-4 flex-wrap text-left">
        <button 
          onClick={() => setActiveTab('stripe')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'stripe' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <CreditCard size={16} /> Stripe Settings
        </button>
        <button 
          onClick={() => setActiveTab('bank')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'bank' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <Sparkles size={16} /> Bank & QR Config
        </button>
        <button 
          onClick={() => setActiveTab('offline')}
          className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeTab === 'offline' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
        >
          <ShieldCheck size={16} /> Offline Verification
        </button>
      </div>

      {/* TAB 1: STRIPE GATEWAY SETTINGS */}
      {activeTab === 'stripe' && (
        <>
          {stripeLoading ? (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-slate-350">Loading payment configurations...</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6 text-left">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-amber-500/10 p-2 text-amber-300"><CreditCard size={18} /></div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Stripe gateway status</h2>
                    <p className="text-sm text-slate-400 font-normal">Toggle key checkout features and publish credentials.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <span className="mb-2 block">Gateway status</span>
                    <select 
                      value={config.isEnabled ? 'true' : 'false'} 
                      onChange={(e) => setConfig((prev) => ({ ...prev, isEnabled: e.target.value === 'true' }))} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none"
                    >
                      <option value="true">Enabled (Online Stripe rails)</option>
                      <option value="false">Disabled (Offline only)</option>
                    </select>
                  </label>
                  <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                    <span className="mb-2 block">Publishable key</span>
                    <input 
                      value={config.publishableKey || ''} 
                      onChange={(e) => setConfig((prev) => ({ ...prev, publishableKey: e.target.value }))} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none font-mono" 
                      placeholder="pk_test_..." 
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <span className="mb-2 block">Currency code</span>
                      <input 
                        value={config.currency || 'INR'} 
                        onChange={(e) => setConfig((prev) => ({ ...prev, currency: e.target.value }))} 
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none font-mono" 
                      />
                    </label>
                    <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                      <span className="mb-2 block">Checkout mode</span>
                      <select 
                        value={config.mode || 'test'} 
                        onChange={(e) => setConfig((prev) => ({ ...prev, mode: e.target.value }))} 
                        className="w-full rounded-2xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none"
                      >
                        <option value="test">Test Sandbox</option>
                        <option value="live">Live Production</option>
                      </select>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveStripe} disabled={stripeSaving} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70">
                    <Save size={16} /> {stripeSaving ? 'Saving...' : 'Save Settings'}
                  </button>
                </div>
                {stripeMessage && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">{stripeMessage}</p>}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6 text-left">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300"><ShieldCheck size={18} /></div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Online safety verification</h2>
                    <p className="text-sm text-slate-400 font-normal">Verification protocols for digital collections.</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-400">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-normal">• Stripe checkout configurations are retrieved securely at initialization.</div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-normal">• Instant digital invoices, receipts, and 80G tax exemptions are generated automatically only upon successful verification.</div>
                </div>
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-xs text-emerald-300 flex items-center gap-2">
                  <Sparkles size={14} className="flex-shrink-0" />
                  <span>Attach production API key sets in the backend `.env` variables for live donation runs.</span>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 2: BANK & UPI QR CONFIGURATION */}
      {activeTab === 'bank' && (
        <>
          {bankLoading ? (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-slate-350">Loading bank configurations...</div>
          ) : (
            <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6 text-left">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300"><Sparkles size={18} /></div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Direct Bank & UPI QR Setup</h2>
                    <p className="text-sm text-slate-400 font-normal">Manage offline accounts displayed to users on the payment details panel.</p>
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">Account Holder Name</span>
                    <input 
                      value={bankDetails.holderName || ''} 
                      onChange={(e) => onBankFieldChange('holderName', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors" 
                      placeholder="e.g. JANA BIKAS NGO"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">Bank Name</span>
                    <input 
                      value={bankDetails.bankName || ''} 
                      onChange={(e) => onBankFieldChange('bankName', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors" 
                      placeholder="e.g. State Bank of India"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">Account Number</span>
                    <input 
                      value={bankDetails.accNumber || ''} 
                      onChange={(e) => onBankFieldChange('accNumber', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors font-mono" 
                      placeholder="Account Number"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">IFSC Code</span>
                    <input 
                      value={bankDetails.ifsc || ''} 
                      onChange={(e) => onBankFieldChange('ifsc', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors font-mono" 
                      placeholder="IFSC Code"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">Branch Name</span>
                    <input 
                      value={bankDetails.branch || ''} 
                      onChange={(e) => onBankFieldChange('branch', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors" 
                      placeholder="e.g. Boring Road Patna Branch"
                    />
                  </label>

                  <label className="block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">UPI ID / VPA Handle</span>
                    <input 
                      value={bankDetails.upiId || ''} 
                      onChange={(e) => onBankFieldChange('upiId', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors font-mono" 
                      placeholder="e.g. name@upi"
                    />
                  </label>

                  <div className="md:col-span-2 block text-sm text-slate-300 space-y-2">
                    <span className="font-medium block">Upload Scan-to-Donate QR Code Image</span>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 cursor-pointer transition text-xs font-semibold text-slate-300">
                        <span>{uploadingQR ? 'Uploading QR...' : 'Choose QR Image'}</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          onChange={handleQRUpload} 
                          className="hidden"
                        />
                      </label>
                      {bankDetails.qrCodeUrl && (
                        <span className="text-xs text-emerald-300 truncate max-w-sm font-mono">{bankDetails.qrCodeUrl}</span>
                      )}
                    </div>
                  </div>

                  <label className="md:col-span-2 block text-sm text-slate-300">
                    <span className="mb-2 block font-medium">Or QR Code Image URL (optional bypass)</span>
                    <input 
                      value={bankDetails.qrCodeUrl || ''} 
                      onChange={(e) => onBankFieldChange('qrCodeUrl', e.target.value)} 
                      className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors font-mono" 
                      placeholder="QR Code Image link address"
                    />
                  </label>
                </div>

                <div className="flex justify-end pt-2">
                  <button onClick={handleSaveBank} disabled={bankSaving} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70">
                    <Save size={16} /> {bankSaving ? 'Saving...' : 'Save Bank Details'}
                  </button>
                </div>
                {bankMessage && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">{bankMessage}</p>}
              </div>

              <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6 text-left">
                <div className="mb-6 flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300"><ShieldCheck size={18} /></div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">Direct Transfer Instructions</h2>
                    <p className="text-sm text-slate-400 font-normal">Offline payment collection verification guidelines.</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-400">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-normal">
                    • Make sure the Account Number and IFSC code are accurate, as they are displayed directly to donors during checkout.
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 leading-normal">
                    • Uploaded QR images are hosted on Cloudinary and will render instantly inside the scan-to-donate panels.
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* TAB 3: OFFLINE VERIFICATION PANEL */}
      {activeTab === 'offline' && (
        <div className="space-y-6 text-left">
          
          {/* Filters controls bar */}
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-4">
              <label className="block text-xs text-slate-450 uppercase font-bold tracking-wider">
                <span className="mb-1.5 block">Filter status</span>
                <select 
                  value={filterStatus} 
                  onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }} 
                  className="rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-slate-200 text-xs outline-none focus:border-emerald-400"
                >
                  <option value="pending">Pending Verification</option>
                  <option value="completed">Completed / Approved</option>
                  <option value="failed">Failed / Declined</option>
                  <option value="">All Records</option>
                </select>
              </label>
            </div>
            
            <div className="flex items-center gap-2 self-end">
              <span className="text-xs text-slate-400 font-medium">Total: <strong>{totalDonations}</strong> entries</span>
              <button 
                onClick={fetchOfflineDonations}
                className="text-slate-400 hover:text-white p-2 rounded-xl border border-white/10 bg-white/5 flex items-center justify-center"
              >
                <RefreshCw size={14} className={offlineLoading ? 'animate-spin' : ''} />
              </button>
            </div>
          </div>

          {offlineMessage && (
            <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">{offlineMessage}</p>
          )}

          {/* Donations records table card */}
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl overflow-hidden">
            {offlineLoading ? (
              <div className="py-12 text-center text-slate-500 font-semibold flex items-center justify-center gap-2">
                <RefreshCw className="animate-spin text-emerald-400" />
                <span>Auditing ledger logs...</span>
              </div>
            ) : donations.length === 0 ? (
              <div className="py-16 text-center text-slate-500 font-medium">
                No offline payments match this filter view.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-slate-300 text-xs text-left">
                  <thead>
                    <tr className="text-slate-400 border-b border-white/5 uppercase text-[9px] tracking-wider">
                      <th className="pb-3 pt-1">Donation ID</th>
                      <th className="pb-3 pt-1">Donor Name</th>
                      <th className="pb-3 pt-1">Payment Mode</th>
                      <th className="pb-3 pt-1">Amount</th>
                      <th className="pb-3 pt-1">UTR / Ref Code</th>
                      <th className="pb-3 pt-1">Status</th>
                      <th className="pb-3 pt-1 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {donations.map((d) => (
                      <tr key={d._id} className="hover:bg-white/5 transition-colors">
                        <td className="py-4 font-mono font-bold text-white">{d.donationId}</td>
                        <td className="py-4">
                          <span className="font-bold block text-slate-200">{d.donor?.fullName}</span>
                          <span className="text-[10px] text-slate-500 block font-normal">{d.donor?.mobile}</span>
                        </td>
                        <td className="py-4 font-mono text-[10px] font-semibold text-slate-400">{d.paymentMode}</td>
                        <td className="py-4 font-bold text-emerald-300">₹{d.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="py-4">
                          <span className="font-mono text-slate-455 block truncate max-w-[120px] font-semibold">{d.transactionId || '—'}</span>
                        </td>
                        <td className="py-4">
                          <span className={`rounded px-1.5 py-0.5 text-[9px] font-bold uppercase ${d.status === 'completed' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : d.status === 'failed' ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex justify-end items-center gap-2">
                            <button 
                              onClick={() => setSelectedDonation(d)}
                              className="text-slate-400 hover:text-white p-1.5 rounded bg-white/5 border border-white/5"
                              title="Inspect Details"
                            >
                              <Info size={14} />
                            </button>
                            {d.status === 'pending' && (
                              <>
                                <button 
                                  onClick={() => handleUpdateStatus(d.donationId, 'completed')}
                                  className="text-emerald-400 hover:text-emerald-300 p-1.5 rounded bg-emerald-500/10 border border-emerald-500/20"
                                  title="Approve / Accept"
                                >
                                  <Check size={14} />
                                </button>
                                <button 
                                  onClick={() => handleUpdateStatus(d.donationId, 'failed')}
                                  className="text-rose-455 hover:text-rose-350 p-1.5 rounded bg-rose-500/10 border border-rose-500/20"
                                  title="Decline / Reject"
                                >
                                  <X size={14} />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between border-t border-white/5 pt-4 mt-4 text-xs text-slate-400">
                <span>Page <strong>{page}</strong> of {totalPages}</span>
                <div className="flex gap-2">
                  <button 
                    disabled={page === 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:text-white disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <button 
                    disabled={page === totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    className="px-3 py-1.5 rounded-lg border border-white/10 hover:text-white disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* INSPECTOR MODAL */}
      {selectedDonation && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-[30px] border border-white/10 bg-slate-900 p-6 md:p-8 shadow-2xl text-left space-y-6">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <ShieldCheck className="text-emerald-300" />
                <span>Auditing Intent: {selectedDonation.donationId}</span>
              </h3>
              <button onClick={() => setSelectedDonation(null)} className="text-slate-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            {/* Full particulars detail cards */}
            <div className="space-y-4 text-xs text-slate-350">
              
              <div className="grid gap-3 grid-cols-2">
                <div className="bg-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Donated Sum</span>
                  <span className="text-base font-extrabold text-emerald-300 mt-1 block">₹{selectedDonation.totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl">
                  <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Cause / Allocation</span>
                  <span className="text-xs font-bold text-white mt-1 block capitalize">{selectedDonation.cause.replace('-', ' ')}</span>
                </div>
              </div>

              {/* Donor Contact card */}
              <div className="bg-white/5 p-4 rounded-2xl space-y-2.5">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider border-b border-white/5 pb-1">Donor particulars</span>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white text-sm">{selectedDonation.donor?.fullName}</span>
                  <span className={`text-[8px] font-bold uppercase px-1 rounded ${selectedDonation.donor?.displayPublicly ? 'bg-emerald-500/20 text-emerald-350' : 'bg-slate-700 text-slate-400'}`}>
                    {selectedDonation.donor?.displayPublicly ? 'Public' : 'Anonymous'}
                  </span>
                </div>
                <div className="space-y-1 text-slate-400">
                  <span className="flex items-center gap-1.5"><Mail size={12} /> {selectedDonation.donor?.email}</span>
                  <span className="flex items-center gap-1.5"><Phone size={12} /> {selectedDonation.donor?.mobile}</span>
                  {selectedDonation.donor?.pan && (
                    <span className="flex items-center gap-1.5"><Award size={12} /> PAN: <strong className="font-mono text-white text-[10px]">{selectedDonation.donor.pan}</strong></span>
                  )}
                  {selectedDonation.donor?.address && (
                    <p className="text-[10px] leading-relaxed pt-1.5 border-t border-white/5 text-slate-500">Address: {selectedDonation.donor.address}</p>
                  )}
                </div>
              </div>

              {/* Payment reference */}
              <div className="bg-white/5 p-4 rounded-2xl space-y-2">
                <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider">Transaction verification details</span>
                <div className="grid gap-2 grid-cols-2 text-[10px] text-slate-400">
                  <span>Method: <strong className="text-white font-mono">{selectedDonation.paymentMode}</strong></span>
                  <span>Reference ID: <strong className="text-white font-mono">{selectedDonation.transactionId || 'Not provided'}</strong></span>
                  <span>Date Registered: <strong>{new Date(selectedDonation.createdAt).toLocaleString('en-IN')}</strong></span>
                  <span>Ledger Status: <strong className="text-amber-300 uppercase">{selectedDonation.status}</strong></span>
                </div>
              </div>

            </div>

            {/* Accept or reject action keys */}
            <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
              <button 
                onClick={() => setSelectedDonation(null)}
                className="rounded-2xl border border-white/10 px-4 py-2.5 font-semibold text-slate-350 hover:text-white text-xs"
              >
                Close View
              </button>
              {selectedDonation.status === 'pending' && (
                <>
                  <button 
                    onClick={() => handleUpdateStatus(selectedDonation.donationId, 'failed')}
                    className="flex items-center gap-1.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 px-4 py-2.5 font-semibold text-rose-300 hover:bg-rose-500/20 text-xs transition"
                  >
                    <XCircle size={14} /> Decline Payment
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedDonation.donationId, 'completed')}
                    className="flex items-center gap-1.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-2.5 font-semibold text-slate-950 hover:scale-[1.01] text-xs transition"
                  >
                    <CheckCircle size={14} /> Approve Payment
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default AdminPayments;
