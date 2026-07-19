import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, BookOpen, Upload, Calendar, ArrowRight, Play, Eye } from 'lucide-react';
import { storiesApi, galleryApi } from '../api';

const AdminStories = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form State
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    title: '',
    slug: '',
    category: 'Education',
    image: '',
    videoUrl: '',
    shortDescription: '',
    longDescription: '',
    beforeAfter: {
      before: '',
      after: '',
    },
    order: 0,
    isActive: true,
  });

  const categories = ['Education', 'Health Care', 'Environment', 'Agriculture', 'Livelihood', 'Empowerment'];

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await storiesApi.getAllStoriesAdmin();
      setStories(data);
    } catch (err) {
      setError('Failed to fetch success stories.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, []);

  // Handle title changes for auto slug generation
  const handleTitleChange = (val) => {
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    
    setForm(prev => ({
      ...prev,
      title: val,
      slug: generatedSlug,
    }));
  };

  const openAdd = () => {
    setEditingId(null);
    setForm({
      title: '',
      slug: '',
      category: 'Education',
      image: '',
      videoUrl: '',
      shortDescription: '',
      longDescription: '',
      beforeAfter: {
        before: '',
        after: '',
      },
      order: stories.length + 1,
      isActive: true,
    });
    setUploadError('');
    setIsEditing(true);
  };

  const openEdit = (story) => {
    setEditingId(story._id);
    setForm({
      title: story.title || '',
      slug: story.slug || '',
      category: story.category || 'Education',
      image: story.image || '',
      videoUrl: story.videoUrl || '',
      shortDescription: story.shortDescription || '',
      longDescription: story.longDescription || '',
      beforeAfter: {
        before: story.beforeAfter?.before || '',
        after: story.beforeAfter?.after || '',
      },
      order: story.order || 0,
      isActive: story.isActive !== false,
    });
    setUploadError('');
    setIsEditing(true);
  };

  // Image Upload Action (Mutler + Cloudinary client wrapper)
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const result = await galleryApi.uploadImage(file);
      setForm(prev => ({ ...prev, image: result.url }));
      setSuccess('Beneficiary image uploaded successfully!');
    } catch (err) {
      setUploadError(err.response?.data?.message || err.message || 'File upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.title || !form.slug) {
      setError('Title and URL Slug are required.');
      return;
    }

    if (!form.shortDescription || !form.longDescription) {
      setError('Please provide both the short preview and full narrative description.');
      return;
    }

    try {
      if (editingId) {
        await storiesApi.updateStoryAdmin(editingId, form);
        setSuccess('Success story updated successfully!');
      } else {
        await storiesApi.createStoryAdmin(form);
        setSuccess('Success story added successfully!');
      }
      setIsEditing(false);
      fetchStories();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save success story.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this success story?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await storiesApi.deleteStoryAdmin(id);
      setSuccess('Success story deleted successfully.');
      fetchStories();
    } catch (err) {
      setError('Failed to delete success story.');
    }
  };

  const handleToggleActive = async (story) => {
    try {
      setError('');
      setSuccess('');
      const updatedStatus = !story.isActive;
      await storiesApi.updateStoryAdmin(story._id, { isActive: updatedStatus });
      setSuccess(`Story visibility updated.`);
      fetchStories();
    } catch (err) {
      setError('Failed to update visibility.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Outcomes & Impact</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Success Stories</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Manage stories of transformation. Add real-life narratives, photos, YouTube interviews, and intervention details.
            </p>
          </div>
          {!isEditing && (
            <button 
              onClick={openAdd}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
            >
              <Plus size={16} /> Add Story
            </button>
          )}
        </div>
        {success && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">{success}</p>}
        {error && <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{error}</p>}
      </div>

      {isEditing ? (
        
        /* Edit/Create Story Form */
        <form onSubmit={handleSave} className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-emerald-300" />
              {editingId ? 'Edit Success Story' : 'Create Success Story'}
            </h2>
            <button 
              type="button" 
              onClick={() => setIsEditing(false)}
              className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white"
            >
              <X size={16} />
            </button>
          </div>

          {uploadError && <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{uploadError}</p>}

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Title */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Story Title *</span>
              <input 
                type="text" 
                value={form.title} 
                onChange={(e) => handleTitleChange(e.target.value)} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                placeholder="e.g. Jyoti's Journey from Slums to Software Engineering"
              />
            </label>

            {/* Slug */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>URL Slug *</span>
              <input 
                type="text" 
                value={form.slug} 
                onChange={(e) => setForm(prev => ({ ...prev, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                placeholder="e.g. jyoti-education-journey"
              />
            </label>

            {/* Category */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Program Category *</span>
              <select 
                value={form.category} 
                onChange={(e) => setForm(prev => ({ ...prev, category: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </label>

            {/* Multer image upload */}
            <div className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Cover Photo *</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 cursor-pointer transition text-xs font-semibold text-slate-300">
                  <Upload size={14} />
                  <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload} 
                    className="hidden"
                  />
                </label>
                {form.image && (
                  <span className="text-[10px] text-emerald-300 truncate max-w-xs">{form.image}</span>
                )}
              </div>
            </div>

            {/* Image URL override */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Or Cover Image URL Link</span>
              <input 
                type="text" 
                value={form.image} 
                onChange={(e) => setForm(prev => ({ ...prev, image: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                placeholder="Paste link to cover image"
              />
            </label>

            {/* Video Interview Embed URL */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>YouTube Video Testimonial Link (Embed URL)</span>
              <input 
                type="text" 
                value={form.videoUrl} 
                onChange={(e) => setForm(prev => ({ ...prev, videoUrl: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
              />
            </label>

            {/* Short Preview Description */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Short Preview Card Text * (Shown in listing grids)</span>
              <textarea 
                rows={3}
                value={form.shortDescription} 
                onChange={(e) => setForm(prev => ({ ...prev, shortDescription: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                placeholder="Write a brief, catchy summary of the achievement..."
              />
            </label>

            {/* Full Narrative (longDescription) */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>The Full Narrative * (Complete Success Story Page content)</span>
              <textarea 
                rows={8}
                value={form.longDescription} 
                onChange={(e) => setForm(prev => ({ ...prev, longDescription: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm whitespace-pre-wrap"
                placeholder="Type the full, detailed story. Markdown formatting is supported..."
              />
            </label>

            {/* Before Intervention */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Situation BEFORE Intervention</span>
              <textarea 
                rows={3}
                value={form.beforeAfter.before} 
                onChange={(e) => setForm(prev => ({ ...prev, beforeAfter: { ...prev.beforeAfter, before: e.target.value } }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                placeholder="Describe the initial struggle (e.g. High-dropout risk child living without electricity...)"
              />
            </label>

            {/* After Intervention */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Outcome AFTER Intervention</span>
              <textarea 
                rows={3}
                value={form.beforeAfter.after} 
                onChange={(e) => setForm(prev => ({ ...prev, beforeAfter: { ...prev.beforeAfter, after: e.target.value } }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                placeholder="Describe the final transformation (e.g. Working as a software engineer earning a stable wage...)"
              />
            </label>

            {/* Order */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Display Priority Order</span>
              <input 
                type="number" 
                value={form.order} 
                onChange={(e) => setForm(prev => ({ ...prev, order: Number(e.target.value) }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
              />
            </label>

            {/* Visible switch */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 mt-6">
              <span className="text-sm font-medium text-slate-300">Visible on Website</span>
              <button 
                type="button"
                onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`p-1 transition-colors ${form.isActive ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {form.isActive ? <ToggleRight size={34} /> : <ToggleLeft size={34} />}
              </button>
            </div>

          </div>

          {/* Actions */}
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
              disabled={uploading}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:scale-[1.01] disabled:opacity-50"
            >
              <Save size={16} /> Save Story
            </button>
          </div>

        </form>
      ) : (
        
        /* Grid Listing */
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <div className="lg:col-span-3 text-slate-300 py-8 text-center text-sm">Loading success stories...</div>
          ) : stories.length === 0 ? (
            <div className="lg:col-span-3 text-slate-400 py-8 text-center text-sm">
              No stories configured. Click Add Story to insert one.
            </div>
          ) : (
            stories.map((story) => (
              <div key={story._id} className="rounded-[24px] border border-white/5 bg-slate-900/60 overflow-hidden flex flex-col justify-between shadow-lg hover:border-white/15 transition-all">
                
                {/* Photo cover */}
                <div className="relative h-44 bg-slate-950 overflow-hidden">
                  <img 
                    src={story.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80'} 
                    alt={story.title} 
                    className="w-full h-full object-cover opacity-60"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wider">
                      {story.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button 
                      onClick={() => handleToggleActive(story)}
                      className={`rounded-xl px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border transition-colors ${story.isActive ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/20' : 'bg-rose-500/25 text-rose-300 border-rose-400/20'}`}
                    >
                      {story.isActive ? 'Active' : 'Disabled'}
                    </button>
                  </div>
                </div>

                {/* Body info */}
                <div className="p-5 flex-grow space-y-2 text-left">
                  <h4 className="text-sm font-bold text-white leading-snug line-clamp-2">{story.title}</h4>
                  <p className="text-xs text-slate-400 leading-normal line-clamp-3">{story.shortDescription}</p>
                </div>

                {/* Footer Controls */}
                <div className="flex border-t border-white/5 bg-slate-950/20 px-4 py-3 justify-between">
                  <button 
                    onClick={() => openEdit(story)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                  >
                    <Edit2 size={12} /> Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(story._id)}
                    className="flex items-center gap-1 text-[11px] font-semibold text-rose-300 hover:text-rose-200 transition-colors"
                  >
                    <Trash2 size={12} /> Delete
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

export default AdminStories;
