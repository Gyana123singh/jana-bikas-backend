import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, Sparkles, Heart } from 'lucide-react';
import { causesApi } from '../api';
import { useCauses } from '../context/CausesContext';

const AdminCauses = () => {
  const { refetchCauses } = useCauses();
  const [causes, setCauses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Editor modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    tagline: '',
    image: '',
    shortDescription: '',
    longDescription: '',
    goalAmount: 0,
    raisedAmount: 0,
    order: 0,
    isActive: true,
    activitiesText: '',
    impact1Count: '',
    impact1Label: '',
    impact2Count: '',
    impact2Label: '',
    impact3Count: '',
    impact3Label: '',
  });

  const fetchCauses = async () => {
    try {
      setLoading(true);
      const data = await causesApi.getAllCausesAdmin();
      setCauses(data);
    } catch (err) {
      setError('Failed to fetch causes list.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCauses();
  }, []);

  const openAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      tagline: '',
      image: '',
      shortDescription: '',
      longDescription: '',
      goalAmount: 0,
      raisedAmount: 0,
      order: causes.length + 1,
      isActive: true,
      activitiesText: '',
      impact1Count: '',
      impact1Label: '',
      impact2Count: '',
      impact2Label: '',
      impact3Count: '',
      impact3Label: '',
    });
    setIsEditing(true);
  };

  const openEdit = (cause) => {
    setEditingId(cause._id);
    
    // Parse activities array back to newline string
    const activitiesText = (cause.activities || []).join('\n');
    
    // Parse impact array back to variables
    const imp1 = cause.impact?.[0] || { count: '', label: '' };
    const imp2 = cause.impact?.[1] || { count: '', label: '' };
    const imp3 = cause.impact?.[2] || { count: '', label: '' };

    setForm({
      title: cause.title || '',
      slug: cause.slug || '',
      tagline: cause.tagline || '',
      image: cause.image || '',
      shortDescription: cause.shortDescription || '',
      longDescription: cause.longDescription || '',
      goalAmount: cause.goalAmount || 0,
      raisedAmount: cause.raisedAmount || 0,
      order: cause.order || 0,
      isActive: cause.isActive !== false,
      activitiesText,
      impact1Count: imp1.count || '',
      impact1Label: imp1.label || '',
      impact2Count: imp2.count || '',
      impact2Label: imp2.label || '',
      impact3Count: imp3.count || '',
      impact3Label: imp3.label || '',
    });
    setIsEditing(true);
  };

  const handleFieldChange = (field, value) => {
    setForm((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from title on creation
      if (field === 'title' && !editingId) {
        updated.slug = value
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
      }
      return updated;
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Form validation
    if (!form.title || !form.slug) {
      setError('Title and Slug are required fields.');
      return;
    }

    // Format activities
    const activities = form.activitiesText
      .split('\n')
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

    // Format impact array
    const impact = [];
    if (form.impact1Count && form.impact1Label) {
      impact.push({ count: form.impact1Count, label: form.impact1Label });
    }
    if (form.impact2Count && form.impact2Label) {
      impact.push({ count: form.impact2Count, label: form.impact2Label });
    }
    if (form.impact3Count && form.impact3Label) {
      impact.push({ count: form.impact3Count, label: form.impact3Label });
    }

    const payload = {
      title: form.title,
      slug: form.slug,
      tagline: form.tagline,
      image: form.image,
      shortDescription: form.shortDescription,
      longDescription: form.longDescription,
      goalAmount: Number(form.goalAmount) || 0,
      raisedAmount: Number(form.raisedAmount) || 0,
      order: Number(form.order) || 0,
      isActive: form.isActive,
      activities,
      impact,
    };

    try {
      if (editingId) {
        await causesApi.updateCauseAdmin(editingId, payload);
        setSuccess('Cause updated successfully!');
      } else {
        await causesApi.createCauseAdmin(payload);
        setSuccess('New cause created successfully!');
      }
      setIsEditing(false);
      fetchCauses();
      refetchCauses(); // Update the main frontend causes provider state
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Error occurred while saving cause.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this cause? This action is permanent.')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await causesApi.deleteCauseAdmin(id);
      setSuccess('Cause deleted successfully.');
      fetchCauses();
      refetchCauses();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to delete cause.');
    }
  };

  const handleToggleActive = async (cause) => {
    try {
      setError('');
      setSuccess('');
      const updatedStatus = !cause.isActive;
      await causesApi.updateCauseAdmin(cause._id, { isActive: updatedStatus });
      setSuccess(`Cause ${updatedStatus ? 'enabled' : 'disabled'} successfully.`);
      fetchCauses();
      refetchCauses();
    } catch (err) {
      setError('Failed to toggle status.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Database integration</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Our Respected Causes</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Manage the humanitarian causes shown on the homepage hero, cause detail routes, and donation panels.
            </p>
          </div>
          {!isEditing && (
            <button 
              onClick={openAdd}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-5 py-3.5 font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              <Plus size={18} /> Add New Cause
            </button>
          )}
        </div>
        {success && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">{success}</p>}
        {error && <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{error}</p>}
      </div>

      {isEditing ? (
        /* Edit Mode Card */
        <form onSubmit={handleSave} className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Heart className="w-5 h-5 text-emerald-300" />
              {editingId ? 'Edit Cause' : 'Create New Cause'}
            </h2>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Title */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Cause Title *</span>
              <input 
                type="text" 
                value={form.title} 
                onChange={(e) => handleFieldChange('title', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="e.g. Clean Drinking Water"
              />
            </label>

            {/* Slug */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Slug (URL path) *</span>
              <input 
                type="text" 
                value={form.slug} 
                onChange={(e) => handleFieldChange('slug', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="e.g. clean-water"
              />
            </label>

            {/* Tagline */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Tagline (Short hook text)</span>
              <input 
                type="text" 
                value={form.tagline} 
                onChange={(e) => handleFieldChange('tagline', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="e.g. Bringing clean drinking water facilities to rural households"
              />
            </label>

            {/* Image URL */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Banner Image URL</span>
              <input 
                type="text" 
                value={form.image} 
                onChange={(e) => handleFieldChange('image', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="e.g. https://images.unsplash.com/..."
              />
            </label>

            {/* Short Description */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Short Description</span>
              <textarea 
                value={form.shortDescription} 
                onChange={(e) => handleFieldChange('shortDescription', e.target.value)} 
                rows="2"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="Brief summary of the cause used in catalog lists."
              />
            </label>

            {/* Long Description */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Detailed Description</span>
              <textarea 
                value={form.longDescription} 
                onChange={(e) => handleFieldChange('longDescription', e.target.value)} 
                rows="5"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="Full details of the cause including the background story and goals."
              />
            </label>

            {/* Goal Amount */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Target Goal Amount (₹)</span>
              <input 
                type="number" 
                value={form.goalAmount} 
                onChange={(e) => handleFieldChange('goalAmount', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
              />
            </label>

            {/* Raised Amount */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Amount Raised (₹)</span>
              <input 
                type="number" 
                value={form.raisedAmount} 
                onChange={(e) => handleFieldChange('raisedAmount', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
              />
            </label>

            {/* Priority Order */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Listing Priority Order</span>
              <input 
                type="number" 
                value={form.order} 
                onChange={(e) => handleFieldChange('order', e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
              />
            </label>

            {/* Active Toggle */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 mt-8">
              <span className="text-sm font-medium text-slate-300">Visible on Website</span>
              <button 
                type="button"
                onClick={() => handleFieldChange('isActive', !form.isActive)}
                className={`p-1 transition-colors ${form.isActive ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {form.isActive ? <ToggleRight size={36} /> : <ToggleLeft size={36} />}
              </button>
            </div>

            {/* Activities List */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Key Activities (One action per line)</span>
              <textarea 
                value={form.activitiesText} 
                onChange={(e) => handleFieldChange('activitiesText', e.target.value)} 
                rows="3"
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors"
                placeholder="e.g. Drilling water borewells in 10 villages&#10;Installing solar-powered pump filtration systems"
              />
            </label>

            {/* Impact Counters */}
            <div className="md:col-span-2 border-t border-white/5 pt-4 space-y-4">
              <span className="block text-sm font-semibold text-white">Impact Highlights (Max 3 counters)</span>
              
              <div className="grid gap-4 sm:grid-cols-3">
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Impact 1 Counter</span>
                  <input type="text" value={form.impact1Count} onChange={(e) => handleFieldChange('impact1Count', e.target.value)} placeholder="e.g. 5,000+" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input type="text" value={form.impact1Label} onChange={(e) => handleFieldChange('impact1Label', e.target.value)} placeholder="e.g. Villagers Served" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Impact 2 Counter</span>
                  <input type="text" value={form.impact2Count} onChange={(e) => handleFieldChange('impact2Count', e.target.value)} placeholder="e.g. 10+" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input type="text" value={form.impact2Label} onChange={(e) => handleFieldChange('impact2Label', e.target.value)} placeholder="e.g. Borewells Dug" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                </div>
                <div className="space-y-2">
                  <span className="text-xs text-slate-400">Impact 3 Counter</span>
                  <input type="text" value={form.impact3Count} onChange={(e) => handleFieldChange('impact3Count', e.target.value)} placeholder="e.g. 100%" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                  <input type="text" value={form.impact3Label} onChange={(e) => handleFieldChange('impact3Label', e.target.value)} placeholder="e.g. Clean water rate" className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none" />
                </div>
              </div>
            </div>

          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-300 hover:text-white"
            >
              Cancel
            </button>
            <button 
              type="submit"
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              <Save size={16} /> Save Cause
            </button>
          </div>

        </form>
      ) : (
        /* Cause Cards Grid */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="md:col-span-3 text-slate-300 py-8">Loading causes...</div>
          ) : causes.length === 0 ? (
            <div className="md:col-span-3 text-slate-300 py-8">No causes configured. Click Add New Cause.</div>
          ) : (
            causes.map((cause) => (
              <div 
                key={cause._id} 
                className="rounded-[30px] border border-white/10 bg-slate-900/80 overflow-hidden shadow-2xl flex flex-col justify-between"
              >
                
                {/* Image Section */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img 
                    src={cause.image || 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=400&q=80'} 
                    alt={cause.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute top-4 right-4 flex gap-2">
                    <button 
                      onClick={() => handleToggleActive(cause)}
                      className={`rounded-xl px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider border transition-colors ${cause.isActive ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/20' : 'bg-rose-500/25 text-rose-300 border-rose-400/20'}`}
                    >
                      {cause.isActive ? 'Active' : 'Disabled'}
                    </button>
                    <span className="rounded-xl bg-slate-900/80 px-2.5 py-1 text-[10px] font-bold text-slate-400 border border-white/5">
                      Order: {cause.order}
                    </span>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-grow space-y-3">
                  <h3 className="text-lg font-bold text-white leading-tight">{cause.title}</h3>
                  <p className="text-xs text-slate-400 line-clamp-2">{cause.tagline}</p>
                  
                  {/* Progress Tracker */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-semibold text-slate-400">
                      <span>Raised: ₹{(cause.raisedAmount || 0).toLocaleString('en-IN')}</span>
                      <span>Target: ₹{(cause.goalAmount || 0).toLocaleString('en-IN')}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full" 
                        style={{ width: `${Math.min(100, ((cause.raisedAmount || 0) / (cause.goalAmount || 1)) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex border-t border-white/5 bg-slate-950/20 p-4 justify-between">
                  <button 
                    onClick={() => openEdit(cause)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    <Edit2 size={13} /> Edit Cause
                  </button>
                  <button 
                    onClick={() => handleDelete(cause._id)}
                    className="flex items-center gap-1.5 text-xs font-semibold text-rose-300 hover:text-rose-200 transition-colors"
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>

              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
};

export default AdminCauses;
