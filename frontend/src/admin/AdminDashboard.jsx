import React, { useEffect, useState } from 'react';
import { ArrowRight, DollarSign, FileText, HeartHandshake, Images, Users } from 'lucide-react';
import { adminApi } from '../api';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((data) => setStats(data))
      .catch((err) => console.error('Dashboard loading failed:', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="rounded-3xl border border-white/10 bg-slate-900/70 p-8 text-slate-300">Loading overview...</div>;

  const cards = [
    { title: 'Donations', value: stats?.metrics?.donations ?? 0, icon: HeartHandshake, color: 'from-emerald-500/20 to-emerald-400/10' },
    { title: 'Raised', value: `₹${Number(stats?.metrics?.raised || 0).toLocaleString('en-IN')}`, icon: DollarSign, color: 'from-amber-500/20 to-amber-400/10' },
    { title: 'Stories', value: stats?.metrics?.stories ?? 0, icon: FileText, color: 'from-sky-500/20 to-sky-400/10' },
    { title: 'Gallery', value: stats?.metrics?.gallery ?? 0, icon: Images, color: 'from-fuchsia-500/20 to-fuchsia-400/10' },
  ];

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Control your public website with live insights</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">Update home, cause, story, gallery, and payment content instantly and keep every section aligned with your mission.</p>
          </div>
          <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            <div className="flex items-center gap-2"><Users size={16} /> Live data overview</div>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${card.color} p-5`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-300">{card.title}</p>
                  <p className="mt-2 text-3xl font-semibold text-white">{card.value}</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/10 p-3 text-emerald-300"><Icon size={20} /></div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">Recent donations</h2>
            <p className="text-sm text-slate-400">Latest completed contributions and transaction activity</p>
          </div>
          <button className="flex items-center gap-2 rounded-2xl border border-white/10 px-3 py-2 text-sm text-slate-300 hover:text-white">
            Review donations <ArrowRight size={16} />
          </button>
        </div>
        <div className="mt-5 space-y-3">
          {(stats?.recentDonations || []).map((donation) => (
            <div key={donation._id} className="flex flex-col rounded-2xl border border-white/10 bg-white/5 p-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-white">{donation.donor?.fullName || 'Anonymous donor'}</p>
                <p className="text-sm text-slate-400">{donation.cause || 'General'} • {donation.paymentMode || 'Payment'}</p>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-emerald-300">₹{Number(donation.totalAmount || 0).toLocaleString('en-IN')}</p>
                <p className="text-sm text-slate-400">{new Date(donation.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
