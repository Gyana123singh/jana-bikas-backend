import React, { useEffect, useState } from 'react';
import { Save, Sparkles, Plus, Trash2 } from 'lucide-react';
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
  trustBadges: ['Transparent reporting', 'Fast digital receipts', 'Trusted by donors'],
  donationPresets: [500, 1000, 2000, 5000, 10000, 15000, 20000, 30000],
  essentialsKits: [
    { id: 'edu', name: 'Education Kit', price: 500, description: 'Books and stationery for a child.' },
    { id: 'food', name: 'Food Support Pack', price: 1000, description: 'Dry grocery provisions for a family.' },
    { id: 'med', name: 'Medical Health Kit', price: 2500, description: 'Diagnostic checks and basic medicines.' }
  ]
};

const AdminContent = () => {
  const [content, setContent] = useState(initialContent);
  const [presetsText, setPresetsText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    contentApi.getContent()
      .then((data) => {
        if (data && typeof data === 'object') {
          const merged = { ...initialContent, ...data };
          setContent(merged);
          setPresetsText((merged.donationPresets || []).join(', '));
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');

    // Parse presets
    const presets = presetsText
      .split(',')
      .map((p) => Number(p.trim()))
      .filter((p) => !isNaN(p) && p > 0);

    const payload = {
      ...content,
      donationPresets: presets
    };

    try {
      await contentApi.updateContent(payload);
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

  const addKit = () => {
    setContent((prev) => ({
      ...prev,
      essentialsKits: [
        ...(prev.essentialsKits || []),
        { id: '', name: '', price: 0, description: '' }
      ]
    }));
  };

  const removeKit = (index) => {
    setContent((prev) => ({
      ...prev,
      essentialsKits: (prev.essentialsKits || []).filter((_, i) => i !== index)
    }));
  };

  const updateKitField = (index, field, value) => {
    setContent((prev) => {
      const kits = [...(prev.essentialsKits || [])];
      kits[index] = { ...kits[index], [field]: value };
      return { ...prev, essentialsKits: kits };
    });
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Content management</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Craft the public-facing story</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">Edit the homepage copy, donation experience, presets, and optional essentials packs dynamically.</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-4 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-70">
            <Save size={16} /> {saving ? 'Saving...' : 'Publish changes'}
          </button>
        </div>
        {message ? <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">{message}</p> : null}
      </div>

      {loading ? <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-8 text-slate-300">Loading editor...</div> : (
        <div className="grid gap-6 lg:grid-cols-2">
          
          {/* Column 1: Website copy */}
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

          {/* Column 2: Donation copy */}
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

          {/* Full Width Row: Presets & Kits */}
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20 lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-xl font-semibold text-white">Donation Flow Configurations</h2>
              <p className="text-sm text-slate-400">Configure preset donation amounts and optional essentials packs (add-ons).</p>
            </div>
            
            <div className="space-y-6">
              {/* Presets Input */}
              <label className="block text-sm text-slate-300">
                <span className="mb-2 block font-medium">Donation Presets (Comma-separated amounts, e.g. 500, 1000, 2000)</span>
                <input 
                  value={presetsText} 
                  onChange={(e) => setPresetsText(e.target.value)} 
                  className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors" 
                  placeholder="e.g. 500, 1000, 2000, 5000"
                />
              </label>
              
              {/* Kits List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-t border-white/5 pt-4">
                  <span className="text-sm font-semibold text-white">Essentials Packs (Add-ons)</span>
                  <button 
                    type="button" 
                    onClick={addKit}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    <Plus size={14} /> Add Pack
                  </button>
                </div>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {(content.essentialsKits || []).map((kit, index) => (
                    <div key={index} className="relative rounded-2xl border border-white/5 bg-white/5 p-4 space-y-3">
                      <button 
                        type="button" 
                        onClick={() => removeKit(index)}
                        className="absolute top-3 right-3 text-rose-400 hover:text-rose-300 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                      
                      <div className="grid gap-3 grid-cols-2">
                        <label className="block text-xs text-slate-400">
                          <span className="mb-1 block">Key ID (Programmatic ID)</span>
                          <input 
                            value={kit.id || ''} 
                            onChange={(e) => updateKitField(index, 'id', e.target.value)} 
                            placeholder="e.g. edu"
                            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400"
                          />
                        </label>
                        
                        <label className="block text-xs text-slate-400">
                          <span className="mb-1 block">Pack Price (₹)</span>
                          <input 
                            type="number" 
                            value={kit.price || 0} 
                            onChange={(e) => updateKitField(index, 'price', Number(e.target.value))} 
                            placeholder="e.g. 500"
                            className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400"
                          />
                        </label>
                      </div>
                      
                      <label className="block text-xs text-slate-400">
                        <span className="mb-1 block">Pack Name</span>
                        <input 
                          value={kit.name || ''} 
                          onChange={(e) => updateKitField(index, 'name', e.target.value)} 
                          placeholder="e.g. Education Kit"
                          className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400"
                        />
                      </label>
                      
                      <label className="block text-xs text-slate-400">
                        <span className="mb-1 block">Description</span>
                        <textarea 
                          value={kit.description || ''} 
                          onChange={(e) => updateKitField(index, 'description', e.target.value)} 
                          placeholder="e.g. Books and stationery for a child."
                          rows="2"
                          className="w-full rounded-xl border border-white/10 bg-slate-950 px-3 py-2 text-white outline-none focus:border-emerald-400"
                        />
                      </label>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default AdminContent;
