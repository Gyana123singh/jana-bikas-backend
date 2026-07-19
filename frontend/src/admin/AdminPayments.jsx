import React, { useEffect, useState } from 'react';
import { CreditCard, ShieldCheck, Sparkles, Save } from 'lucide-react';
import { contentApi, stripeApi } from '../api';

const AdminPayments = () => {
  const [config, setConfig] = useState({ isEnabled: false, publishableKey: '', currency: 'inr', mode: 'test' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    contentApi.getContent()
      .then((data) => {
        const paymentConfig = data?.paymentConfig || { isEnabled: false, publishableKey: '', currency: 'inr', mode: 'test' };
        setConfig(paymentConfig);
      })
      .catch(() => {
        stripeApi.getConfig()
          .then((data) => setConfig(data))
          .finally(() => setLoading(false));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      await contentApi.updateContent({ paymentConfig: config });
      setMessage('Payment settings updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Unable to save payment settings');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Payment gateway</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Configure Stripe-powered donations</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">Turn on the gateway, keep the publishable key ready, and let the public donation flow use the same settings your admin console controls.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70">
            <Save size={16} /> {saving ? 'Saving...' : 'Save payment settings'}
          </button>
        </div>
      </div>

      {loading ? <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Loading payment configuration...</div> : (
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-amber-500/10 p-2 text-amber-300"><CreditCard size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-white">Stripe status</h2>
                <p className="text-sm text-slate-400">The payment experience is initialized from server-side configuration</p>
              </div>
            </div>

            <div className="space-y-4">
              <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <span className="mb-2 block">Gateway enabled</span>
                <select value={config.isEnabled ? 'true' : 'false'} onChange={(e) => setConfig((prev) => ({ ...prev, isEnabled: e.target.value === 'true' }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none">
                  <option value="true">Enabled</option>
                  <option value="false">Disabled</option>
                </select>
              </label>
              <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                <span className="mb-2 block">Publishable key</span>
                <input value={config.publishableKey || ''} onChange={(e) => setConfig((prev) => ({ ...prev, publishableKey: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none" placeholder="pk_test_..." />
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <span className="mb-2 block">Currency</span>
                  <input value={config.currency || ''} onChange={(e) => setConfig((prev) => ({ ...prev, currency: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none" />
                </label>
                <label className="block rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300">
                  <span className="mb-2 block">Mode</span>
                  <select value={config.mode || 'test'} onChange={(e) => setConfig((prev) => ({ ...prev, mode: e.target.value }))} className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-3 py-2 text-white outline-none">
                    <option value="test">Test</option>
                    <option value="live">Live</option>
                  </select>
                </label>
              </div>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300"><ShieldCheck size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-white">What the admin controls</h2>
                <p className="text-sm text-slate-400">The public donation flow uses these settings dynamically</p>
              </div>
            </div>

            <div className="space-y-3 text-sm text-slate-400">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">• Stripe publishable key is fetched from the backend configuration endpoint.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">• Donation confirmation and receipt pages stay aligned with the same gateway session.</div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">• Admin-side content updates change the donation experience copy immediately.</div>
            </div>
            <div className="mt-5 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-sm text-emerald-300">
              <div className="flex items-center gap-2"><Sparkles size={16} /> Add your own Stripe credentials in the server environment to enable live checkout.</div>
            </div>
          </div>
        </div>
      )}
      {message ? <p className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p> : null}
    </div>
  );
};

export default AdminPayments;
