import React, { useEffect, useState } from 'react';
import { Save, Plus, Trash2, Layers, Shield, Eye, Target, Image as ImageIcon, CheckCircle, Sparkles } from 'lucide-react';
import { contentApi } from '../api';

const defaultAboutState = {
  heroTag: 'Learn More About Us',
  heroTitle: 'A premium experience for purpose-driven giving',
  heroSubtitle: 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.',
  heroBgImage: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80',
  overviewTag: 'Establishment Overview',
  overviewTitle: 'A Journey Built on Trust, Inclusion, and Sustainability',
  overviewParagraph1: 'Jana Bikas NGO was founded by a collective of social scientists, healthcare professionals, and farmers with a single dream: to create an inclusive environment where individuals in marginalized communities have full access to opportunities.',
  overviewParagraph2: 'We focus on bottom-up development, ensuring that our programs are owned and maintained by the local communities themselves. We do not just distribute relief; we construct pathways to self-reliance.',
  operationalPrinciples: [
    '100% Financial Auditing',
    'Community Co-ownership',
    'Ecologically Friendly Projects',
    'Inclusion & Equal Respect'
  ],
  registrationDetails: [
    { label: 'Registration No.', value: 'S-56439/2014-BR' },
    { label: 'Registration Date', value: '14th April 2014' },
    { label: 'NITI Aayog Darpan ID', value: 'BR/2016/0104592' },
    { label: 'NGO PAN Number', value: 'AAATJ9024E' },
    { label: '12A Registration No.', value: 'IT/12A/2018-19/204' },
    { label: '80G Registration No.', value: 'IT/80G/2020-21/105' }
  ],
  taxExemptionNote: 'Donations to Jana Bikas NGO are 50% tax exempt under Section 80G of the Income Tax Act.',
  visionTitle: 'Our Vision',
  visionDescription: 'We envision a just, equitable, and self-sufficient society where every household has clean water, healthy food, basic medical care, and quality education. We work to empower the last mile so they can lead lives of dignity, prosperity, and respect.',
  missionTitle: 'Our Mission',
  missionDescription: 'Our mission is to establish sustainable community programs in education, youth skill certifications, women SHGs, maternal health access, and ecological agriculture. By collaborating with donors, local administrations, and volunteers, we translate contributions into verified long-term change.',
  customSections: []
};

const AdminAbout = () => {
  const [aboutPage, setAboutPage] = useState(defaultAboutState);
  const [fullContent, setFullContent] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  useEffect(() => {
    contentApi.getContent()
      .then((data) => {
        if (data && typeof data === 'object') {
          setFullContent(data);
          if (data.aboutPage) {
            setAboutPage({
              ...defaultAboutState,
              ...data.aboutPage,
              operationalPrinciples: data.aboutPage.operationalPrinciples || defaultAboutState.operationalPrinciples,
              registrationDetails: data.aboutPage.registrationDetails || defaultAboutState.registrationDetails,
              customSections: data.aboutPage.customSections || []
            });
          }
        }
      })
      .catch((err) => console.error('Failed to load site content', err))
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage('');
    try {
      const payload = {
        ...fullContent,
        aboutPage: aboutPage
      };
      await contentApi.updateContent(payload);
      setMessage('About Us page contents published successfully!');
    } catch (error) {
      setMessage(error.response?.data?.message || error.message || 'Failed to save changes');
    } finally {
      setSaving(false);
    }
  };

  const updateField = (field, value) => {
    setAboutPage((prev) => ({ ...prev, [field]: value }));
  };

  // Operational Principles Helpers
  const addPrinciple = () => {
    setAboutPage((prev) => ({
      ...prev,
      operationalPrinciples: [...(prev.operationalPrinciples || []), 'New Principle']
    }));
  };

  const updatePrinciple = (index, value) => {
    setAboutPage((prev) => {
      const updated = [...(prev.operationalPrinciples || [])];
      updated[index] = value;
      return { ...prev, operationalPrinciples: updated };
    });
  };

  const removePrinciple = (index) => {
    setAboutPage((prev) => ({
      ...prev,
      operationalPrinciples: (prev.operationalPrinciples || []).filter((_, i) => i !== index)
    }));
  };

  // Registration Details Helpers
  const addRegistrationDetail = () => {
    setAboutPage((prev) => ({
      ...prev,
      registrationDetails: [...(prev.registrationDetails || []), { label: '', value: '' }]
    }));
  };

  const updateRegistrationDetail = (index, field, value) => {
    setAboutPage((prev) => {
      const updated = [...(prev.registrationDetails || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, registrationDetails: updated };
    });
  };

  const removeRegistrationDetail = (index) => {
    setAboutPage((prev) => ({
      ...prev,
      registrationDetails: (prev.registrationDetails || []).filter((_, i) => i !== index)
    }));
  };

  // Dynamic Custom Sections Helpers
  const addCustomSection = () => {
    const newSec = {
      id: 'sec_' + Date.now(),
      title: 'New Section Title',
      subtitle: 'Category / Tagline',
      content: 'Write detailed content for this section...',
      imageUrl: ''
    };
    setAboutPage((prev) => ({
      ...prev,
      customSections: [...(prev.customSections || []), newSec]
    }));
  };

  const updateCustomSection = (index, field, value) => {
    setAboutPage((prev) => {
      const updated = [...(prev.customSections || [])];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, customSections: updated };
    });
  };

  const removeCustomSection = (index) => {
    setAboutPage((prev) => ({
      ...prev,
      customSections: (prev.customSections || []).filter((_, i) => i !== index)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-xl bg-emerald-500/10 px-3 py-1 text-xs uppercase tracking-[0.25em] font-semibold text-emerald-300">
                About Us Page Management
              </span>
            </div>
            <h1 className="mt-2 text-3xl font-bold text-white">Manage All About Us Sections</h1>
            <p className="mt-1 text-sm text-slate-400">
              Customize the banner, establishment details, operational principles, legal registrations, vision/mission, and custom dynamic sections.
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-5 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] active:scale-95 disabled:opacity-70 shadow-lg shadow-emerald-500/20"
          >
            <Save size={18} /> {saving ? 'Publishing...' : 'Save All Changes'}
          </button>
        </div>
        {message && (
          <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-300 animate-fade-in">
            {message}
          </div>
        )}
      </div>

      {loading ? (
        <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-12 text-center text-slate-400">
          Loading About Us content settings...
        </div>
      ) : (
        <div className="space-y-6">
          {/* Navigation Tabs */}
          <div className="flex flex-wrap gap-2 rounded-2xl border border-white/10 bg-slate-900/60 p-2">
            {[
              { id: 'hero', label: '1. Banner Header', icon: ImageIcon },
              { id: 'overview', label: '2. Overview & Principles', icon: Sparkles },
              { id: 'registrations', label: '3. Legal Registrations', icon: Shield },
              { id: 'vision', label: '4. Vision & Mission', icon: Eye },
              { id: 'custom', label: '5. Custom Sections', icon: Layers }
            ].map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold transition ${
                    active
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <Icon size={14} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* TAB 1: Hero Banner */}
          {activeTab === 'hero' && (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300">
                  <ImageIcon size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Hero Header Banner</h2>
                  <p className="text-xs text-slate-400">Configure top hero tagline, main title, subtitle, and background imagery.</p>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <label className="block text-xs font-medium text-slate-300">
                  <span className="mb-1.5 block">Banner Tagline / Badge</span>
                  <input
                    value={aboutPage.heroTag || ''}
                    onChange={(e) => updateField('heroTag', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 transition"
                    placeholder="e.g. Learn More About Us"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-300">
                  <span className="mb-1.5 block">Main Hero Title</span>
                  <input
                    value={aboutPage.heroTitle || ''}
                    onChange={(e) => updateField('heroTitle', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 transition"
                    placeholder="e.g. A premium experience for purpose-driven giving"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-300 md:col-span-2">
                  <span className="mb-1.5 block">Hero Subtitle / Description</span>
                  <textarea
                    rows={3}
                    value={aboutPage.heroSubtitle || ''}
                    onChange={(e) => updateField('heroSubtitle', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 transition"
                    placeholder="Describe your organization's mission..."
                  />
                </label>

                <label className="block text-xs font-medium text-slate-300 md:col-span-2">
                  <span className="mb-1.5 block">Background Image URL</span>
                  <input
                    value={aboutPage.heroBgImage || ''}
                    onChange={(e) => updateField('heroBgImage', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400 transition"
                    placeholder="https://images.unsplash.com/..."
                  />
                </label>
              </div>

              {aboutPage.heroBgImage && (
                <div className="relative mt-2 h-36 w-full rounded-xl overflow-hidden border border-white/10 bg-slate-950">
                  <img src={aboutPage.heroBgImage} alt="Hero Banner Preview" className="w-full h-full object-cover opacity-60" />
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/40">
                    <span className="text-xs font-semibold text-white bg-slate-900/80 px-3 py-1.5 rounded-full border border-white/10">Banner Image Preview</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: Overview & Operational Principles */}
          {activeTab === 'overview' && (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Establishment Overview & Operational Principles</h2>
                  <p className="text-xs text-slate-400">Manage establishment copy and list of operational principles.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <label className="block text-xs font-medium text-slate-300">
                    <span className="mb-1.5 block">Section Tagline</span>
                    <input
                      value={aboutPage.overviewTag || ''}
                      onChange={(e) => updateField('overviewTag', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </label>

                  <label className="block text-xs font-medium text-slate-300">
                    <span className="mb-1.5 block">Overview Heading</span>
                    <input
                      value={aboutPage.overviewTitle || ''}
                      onChange={(e) => updateField('overviewTitle', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </label>
                </div>

                <label className="block text-xs font-medium text-slate-300">
                  <span className="mb-1.5 block">First Paragraph</span>
                  <textarea
                    rows={3}
                    value={aboutPage.overviewParagraph1 || ''}
                    onChange={(e) => updateField('overviewParagraph1', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </label>

                <label className="block text-xs font-medium text-slate-300">
                  <span className="mb-1.5 block">Second Paragraph</span>
                  <textarea
                    rows={3}
                    value={aboutPage.overviewParagraph2 || ''}
                    onChange={(e) => updateField('overviewParagraph2', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-sm text-white outline-none focus:border-emerald-400"
                  />
                </label>
              </div>

              {/* Operational Principles Checklist */}
              <div className="border-t border-white/5 pt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle size={16} className="text-emerald-400" /> Operational Principles
                    </h3>
                    <p className="text-xs text-slate-400">Add, edit, or remove key operational values shown to users.</p>
                  </div>
                  <button
                    type="button"
                    onClick={addPrinciple}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    <Plus size={14} /> Add Principle
                  </button>
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  {(aboutPage.operationalPrinciples || []).map((principle, idx) => (
                    <div key={idx} className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950 p-2.5">
                      <input
                        value={principle}
                        onChange={(e) => updatePrinciple(idx, e.target.value)}
                        className="flex-1 bg-transparent px-2 text-sm text-white outline-none"
                        placeholder="e.g. 100% Financial Auditing"
                      />
                      <button
                        type="button"
                        onClick={() => removePrinciple(idx)}
                        className="p-1.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition"
                        title="Delete Principle"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Official Registrations */}
          {activeTab === 'registrations' && (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300">
                  <Shield size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Official Legal Registrations & Tax Info</h2>
                  <p className="text-xs text-slate-400">Add, update, or remove legal registration details and tax statuses.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-white">Registration Items (Key-Value Pairs)</span>
                  <button
                    type="button"
                    onClick={addRegistrationDetail}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20 transition"
                  >
                    <Plus size={14} /> Add Detail
                  </button>
                </div>

                <div className="space-y-3">
                  {(aboutPage.registrationDetails || []).map((detail, idx) => (
                    <div key={idx} className="flex flex-col md:flex-row items-center gap-3 rounded-2xl border border-white/10 bg-slate-950 p-3">
                      <input
                        value={detail.label || ''}
                        onChange={(e) => updateRegistrationDetail(idx, 'label', e.target.value)}
                        placeholder="Label (e.g. Registration No.)"
                        className="w-full md:w-1/2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-white outline-none focus:border-emerald-400"
                      />
                      <input
                        value={detail.value || ''}
                        onChange={(e) => updateRegistrationDetail(idx, 'value', e.target.value)}
                        placeholder="Value (e.g. S-56439/2014-BR)"
                        className="w-full md:w-1/2 rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-emerald-300 font-semibold outline-none focus:border-emerald-400"
                      />
                      <button
                        type="button"
                        onClick={() => removeRegistrationDetail(idx)}
                        className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition"
                        title="Delete Detail"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <label className="block text-xs font-medium text-slate-300 border-t border-white/5 pt-4">
                  <span className="mb-1.5 block font-bold text-white">80G & Tax Exemption Notice Text</span>
                  <textarea
                    rows={2}
                    value={aboutPage.taxExemptionNote || ''}
                    onChange={(e) => updateField('taxExemptionNote', e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-slate-950 px-4 py-3 text-xs text-white outline-none focus:border-emerald-400"
                    placeholder="Notice displayed at bottom of registration table..."
                  />
                </label>
              </div>
            </div>
          )}

          {/* TAB 4: Vision & Mission */}
          {activeTab === 'vision' && (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300">
                  <Eye size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white">Vision & Mission Statements</h2>
                  <p className="text-xs text-slate-400">Define the core aspirational vision and active mission statements.</p>
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {/* Vision Box */}
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 space-y-3">
                  <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest">Vision Card</span>
                  <label className="block text-xs text-slate-400">
                    <span className="mb-1 block text-slate-300">Vision Title</span>
                    <input
                      value={aboutPage.visionTitle || ''}
                      onChange={(e) => updateField('visionTitle', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    <span className="mb-1 block text-slate-300">Vision Description</span>
                    <textarea
                      rows={5}
                      value={aboutPage.visionDescription || ''}
                      onChange={(e) => updateField('visionDescription', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </label>
                </div>

                {/* Mission Box */}
                <div className="rounded-2xl border border-white/10 bg-slate-950 p-5 space-y-3">
                  <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">Mission Card</span>
                  <label className="block text-xs text-slate-400">
                    <span className="mb-1 block text-slate-300">Mission Title</span>
                    <input
                      value={aboutPage.missionTitle || ''}
                      onChange={(e) => updateField('missionTitle', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-sm text-white outline-none focus:border-emerald-400"
                    />
                  </label>
                  <label className="block text-xs text-slate-400">
                    <span className="mb-1 block text-slate-300">Mission Description</span>
                    <textarea
                      rows={5}
                      value={aboutPage.missionDescription || ''}
                      onChange={(e) => updateField('missionDescription', e.target.value)}
                      className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2 text-xs text-slate-200 outline-none focus:border-emerald-400 leading-relaxed"
                    />
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Dynamic Custom Sections */}
          {activeTab === 'custom' && (
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-emerald-500/10 p-2.5 text-emerald-300">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white">Dynamic Custom Sections</h2>
                    <p className="text-xs text-slate-400">Add, edit, or delete dynamic section cards on the About Us page.</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addCustomSection}
                  className="flex items-center gap-2 rounded-xl bg-emerald-500/20 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/30 transition"
                >
                  <Plus size={16} /> Add Custom Section
                </button>
              </div>

              {(aboutPage.customSections || []).length === 0 ? (
                <div className="rounded-2xl border border-dashed border-white/10 p-8 text-center space-y-3">
                  <p className="text-sm text-slate-400">No custom sections added yet.</p>
                  <button
                    type="button"
                    onClick={addCustomSection}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 text-xs font-bold text-emerald-300 hover:bg-emerald-500/20"
                  >
                    <Plus size={14} /> Add your first custom section
                  </button>
                </div>
              ) : (
                <div className="grid gap-6">
                  {(aboutPage.customSections || []).map((sec, idx) => (
                    <div key={sec.id || idx} className="relative rounded-2xl border border-white/10 bg-slate-950 p-5 space-y-4">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <span className="text-xs font-bold uppercase tracking-widest text-emerald-400">
                          Custom Section #{idx + 1}
                        </span>
                        <button
                          type="button"
                          onClick={() => removeCustomSection(idx)}
                          className="flex items-center gap-1 text-xs font-bold text-rose-400 hover:text-rose-300 transition"
                        >
                          <Trash2 size={14} /> Delete Section
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <label className="block text-xs text-slate-400">
                          <span className="mb-1 block text-slate-300 font-medium">Tagline / Subtitle</span>
                          <input
                            value={sec.subtitle || ''}
                            onChange={(e) => updateCustomSection(idx, 'subtitle', e.target.value)}
                            placeholder="e.g. Grassroots Leadership"
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                          />
                        </label>

                        <label className="block text-xs text-slate-400">
                          <span className="mb-1 block text-slate-300 font-medium">Section Title</span>
                          <input
                            value={sec.title || ''}
                            onChange={(e) => updateCustomSection(idx, 'title', e.target.value)}
                            placeholder="e.g. Empowering Local Change-Makers"
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                          />
                        </label>

                        <label className="block text-xs text-slate-400 md:col-span-2">
                          <span className="mb-1 block text-slate-300 font-medium">Section Body Content</span>
                          <textarea
                            rows={3}
                            value={sec.content || ''}
                            onChange={(e) => updateCustomSection(idx, 'content', e.target.value)}
                            placeholder="Detailed explanation of this section..."
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-emerald-400"
                          />
                        </label>

                        <label className="block text-xs text-slate-400 md:col-span-2">
                          <span className="mb-1 block text-slate-300 font-medium">Optional Image URL</span>
                          <input
                            value={sec.imageUrl || ''}
                            onChange={(e) => updateCustomSection(idx, 'imageUrl', e.target.value)}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full rounded-xl border border-white/10 bg-slate-900 px-3.5 py-2.5 text-xs text-white outline-none focus:border-emerald-400"
                          />
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdminAbout;
