import React, { useState } from 'react';
import { Lock, Mail, Sparkles } from 'lucide-react';
import { authApi } from '../api';

const AdminLogin = ({ onLogin }) => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const data = await authApi.login(form);
      localStorage.setItem('adminToken', data.token);
      localStorage.setItem('jana-admin', JSON.stringify(data));
      onLogin(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Unable to sign in');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.24),_transparent_45%),linear-gradient(135deg,_#020617_0%,_#0f172a_100%)] px-4 py-10 text-white">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-center gap-6 rounded-[32px] border border-white/10 bg-white/10 p-8 shadow-2xl backdrop-blur-2xl lg:flex-row lg:gap-12 lg:p-12">
        <div className="max-w-md flex-1 space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-sm text-emerald-300">
            <Sparkles size={16} /> Premium Admin Portal
          </div>
          <h1 className="text-4xl font-semibold leading-tight sm:text-5xl">Simplify content, donations, and payments from one elegant dashboard.</h1>
          <p className="text-sm leading-7 text-slate-300 sm:text-base">Run the Jana Bikas website with rich content blocks, donor automation, and secure Stripe integration without leaving the admin console.</p>
        </div>

        <form onSubmit={submit} className="w-full max-w-md rounded-[28px] border border-white/10 bg-slate-950/80 p-6 shadow-2xl sm:p-8">
          <div className="mb-6 space-y-2">
            <p className="text-[11px] uppercase tracking-[0.35em] text-emerald-300">Secure Sign-In</p>
            <h2 className="text-2xl font-semibold">Welcome back</h2>
          </div>

          <div className="space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm text-slate-400">Email address</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Mail size={16} className="text-slate-400" />
                <input value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className="w-full bg-transparent outline-none" placeholder="admin@janabikas.org" />
              </div>
            </label>

            <label className="block">
              <span className="mb-2 block text-sm text-slate-400">Password</span>
              <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <Lock size={16} className="text-slate-400" />
                <input type="password" value={form.password} onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))} className="w-full bg-transparent outline-none" placeholder="••••••••" />
              </div>
            </label>
            {error ? <p className="rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-sm text-rose-300">{error}</p> : null}
          </div>

          <button type="submit" disabled={loading} className="mt-6 flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70">
            {loading ? 'Signing in...' : 'Enter Admin Console'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
