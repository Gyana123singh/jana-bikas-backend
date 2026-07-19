import React, { useEffect, useState } from 'react';
import { Save, Sparkles } from 'lucide-react';
import { contentApi } from '../api';

const initialContent = {
  siteName: 'Jana Bikas NGO',
  heroTitle: 'Create lasting impact through every act of kindness',
  heroSubtitle: 'Modern, transparent, and compassionate support for communities that need it most.',
  heroCtaText: 'Support the mission',
  aboutTitle: 'A premium experience for purpose-driven giving',
  aboutSubtitle: 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.',
  paymentHeading: 'Secure and elegant giving experience',
  paymentText: 'Every donation is protected by modern payment rails, 80G-ready documentation, and complete transparency.',
  trustBadges: ['Transparent reporting', 'Fast digital receipts', 'Trusted by donors']
};

const AdminContent = () => {
  const [content, setContent] = useState(initialContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    contentApi.getContent()
      .then((data) => {
        if (data && typeof data === 'object') {
          setContent({ ...initialContent, ...data });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    try {
      await contentApi.updateContent(content);
      setMessage('Content updated successfully');
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Unable to save');
    } finally {
      setSaving(false);
    }
  };

  const onFieldChange = (field, value) => {
    setContent((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Content management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Craft the public-facing story</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">Edit the homepage and donation experience copy so your website reflects the latest mission, updates, and trust signals.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70">
            <Save size={16} /> {saving ? 'Saving...' : 'Publish changes'}
          </button>
        </div>
        {message ? <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p> : null}
      </div>

      {loading ? <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Loading editor...</div> : (
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-500/10 p-2 text-emerald-300"><Sparkles size={18} /></div>
              <div>
                <h2 className="text-xl font-semibold text-white">Website copy</h2>
                <p className="text-sm text-slate-400">Build the premium message across the pages</p>
              </div>
            </div>
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Site name</span>
                <input value={content.siteName || ''} onChange={(e) => onFieldChange('siteName', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Hero title</span>
                <input value={content.heroTitle || ''} onChange={(e) => onFieldChange('heroTitle', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Hero subtitle</span>
                <textarea value={content.heroSubtitle || ''} onChange={(e) => onFieldChange('heroSubtitle', e.target.value)} rows="3" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Hero CTA text</span>
                <input value={content.heroCtaText || ''} onChange={(e) => onFieldChange('heroCtaText', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
            </div>
          </div>

          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">Donation & trust messaging</h2>
              <p className="text-sm text-slate-400">Shape the donation experience and credibility statements</p>
            </div>
            <div className="space-y-4">
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">About section title</span>
                <input value={content.aboutTitle || ''} onChange={(e) => onFieldChange('aboutTitle', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">About section subtitle</span>
                <textarea value={content.aboutSubtitle || ''} onChange={(e) => onFieldChange('aboutSubtitle', e.target.value)} rows="3" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Payment heading</span>
                <input value={content.paymentHeading || ''} onChange={(e) => onFieldChange('paymentHeading', e.target.value)} className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block">Payment text</span>
                <textarea value={content.paymentText || ''} onChange={(e) => onFieldChange('paymentText', e.target.value)} rows="3" className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none" />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminContent;
