import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, ToggleLeft, ToggleRight, Sparkles, Image as ImageIcon, Video as VideoIcon, Upload, Calendar, MapPin, Play } from 'lucide-react';
import { galleryApi, contentApi } from '../api';
import useSiteContent from '../hooks/useSiteContent';

const AdminGallery = () => {
  const siteContent = useSiteContent();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Media items tabs: 'photos' | 'videos'
  const [activeTab, setActiveTab] = useState('photos');
  
  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Editor modal/drawer state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    type: 'photo',
    title: '',
    category: '',
    url: '',
    thumbnail: '',
    embedUrl: '',
    date: '',
    location: '',
    order: 0,
    isActive: true,
  });

  // Fetch site content for categories
  const fetchCategories = async () => {
    try {
      const data = await contentApi.getContent();
      if (data && data.galleryCategories) {
        setCategories(data.galleryCategories);
      } else {
        setCategories(['Education', 'Health Care', 'Environment', 'Agriculture', 'Empowerment']);
      }
    } catch (err) {
      console.error('Failed to load categories', err);
    }
  };

  // Fetch all gallery items
  const fetchItems = async () => {
    try {
      setLoading(true);
      const data = await galleryApi.getAllItemsAdmin();
      setItems(data);
    } catch (err) {
      setError('Failed to fetch gallery items.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, []);

  // Category CRUD
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategory.trim()) return;
    
    const catName = newCategory.trim();
    if (categories.includes(catName)) {
      setError('Category already exists.');
      return;
    }

    const updatedCategories = [...categories, catName];
    try {
      setError('');
      setSuccess('');
      const currentContent = await contentApi.getContent();
      await contentApi.updateContent({
        ...currentContent,
        galleryCategories: updatedCategories
      });
      setCategories(updatedCategories);
      setNewCategory('');
      setSuccess('Category added successfully.');
    } catch (err) {
      setError('Failed to add category.');
    }
  };

  const handleDeleteCategory = async (catName) => {
    if (!window.confirm(`Are you sure you want to delete "${catName}"? Items under this category will remain, but you won't be able to filter by it.`)) {
      return;
    }

    const updatedCategories = categories.filter(c => c !== catName);
    try {
      setError('');
      setSuccess('');
      const currentContent = await contentApi.getContent();
      await contentApi.updateContent({
        ...currentContent,
        galleryCategories: updatedCategories
      });
      setCategories(updatedCategories);
      setSuccess('Category removed successfully.');
    } catch (err) {
      setError('Failed to remove category.');
    }
  };

  // Item CRUD Editors
  const openAdd = (type) => {
    setEditingId(null);
    setForm({
      type,
      title: '',
      category: categories[0] || 'Education',
      url: '',
      thumbnail: '',
      embedUrl: '',
      date: new Date().toISOString().split('T')[0],
      location: '',
      order: items.filter(i => i.type === type).length + 1,
      isActive: true,
    });
    setUploadError('');
    setIsEditing(true);
  };

  const openEdit = (item) => {
    setEditingId(item._id);
    setForm({
      type: item.type || 'photo',
      title: item.title || '',
      category: item.category || categories[0] || '',
      url: item.url || '',
      thumbnail: item.thumbnail || '',
      embedUrl: item.embedUrl || '',
      date: item.date || '',
      location: item.location || '',
      order: item.order || 0,
      isActive: item.isActive !== false,
    });
    setUploadError('');
    setIsEditing(true);
  };

  // Image Upload Action (Mutler + Cloudinary client wrapper)
  const handleImageUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const result = await galleryApi.uploadImage(file);
      setForm(prev => ({ ...prev, [field]: result.url }));
      setSuccess('Image uploaded successfully!');
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

    if (!form.title) {
      setError('Title is required.');
      return;
    }

    if (form.type === 'photo' && !form.url) {
      setError('Please upload or specify a photo URL.');
      return;
    }

    if (form.type === 'video' && !form.embedUrl) {
      setError('Please specify a YouTube Embed URL.');
      return;
    }

    try {
      if (editingId) {
        await galleryApi.updateItemAdmin(editingId, form);
        setSuccess('Gallery item updated successfully!');
      } else {
        await galleryApi.createItemAdmin(form);
        setSuccess('Gallery item added successfully!');
      }
      setIsEditing(false);
      fetchItems();
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to save item.');
    }
  };

  const handleDeleteItem = async (id) => {
    if (!window.confirm('Are you sure you want to delete this item?')) {
      return;
    }

    try {
      setError('');
      setSuccess('');
      await galleryApi.deleteItemAdmin(id);
      setSuccess('Item deleted successfully.');
      fetchItems();
    } catch (err) {
      setError('Failed to delete item.');
    }
  };

  const handleToggleActive = async (item) => {
    try {
      setError('');
      setSuccess('');
      const updatedStatus = !item.isActive;
      await galleryApi.updateItemAdmin(item._id, { isActive: updatedStatus });
      setSuccess(`Item status updated successfully.`);
      fetchItems();
    } catch (err) {
      setError('Failed to toggle status.');
    }
  };

  const filteredItems = items.filter(i => i.type === activeTab);

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Media Library</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Activity Gallery</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Manage the dynamic photo filters, upload live images (with Cloudinary & Multer support), and embed video documentations.
            </p>
          </div>
          {!isEditing && (
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={() => openAdd('photo')}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
              >
                <Plus size={16} /> Add Photo
              </button>
              <button 
                onClick={() => openAdd('video')}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 transition hover:scale-[1.01]"
              >
                <Plus size={16} /> Add Video
              </button>
            </div>
          )}
        </div>
        {success && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">{success}</p>}
        {error && <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{error}</p>}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Column: Category Manager (Only when not editing item) */}
        {!isEditing && (
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Sparkles className="w-5 h-5 text-emerald-300" />
                <h2 className="text-lg font-semibold text-white">Gallery Categories</h2>
              </div>

              {/* Add category form */}
              <form onSubmit={handleAddCategory} className="flex gap-2">
                <input 
                  type="text" 
                  value={newCategory} 
                  onChange={(e) => setNewCategory(e.target.value)} 
                  placeholder="e.g. Relief Camps" 
                  className="flex-1 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white outline-none focus:border-emerald-400"
                />
                <button type="submit" className="rounded-xl bg-emerald-500 hover:bg-emerald-600 px-3.5 py-2 text-xs font-bold text-slate-950">
                  Add
                </button>
              </form>

              {/* Categories list */}
              <div className="space-y-2 max-h-64 overflow-y-auto pt-2">
                {categories.map((cat) => (
                  <div key={cat} className="flex items-center justify-between rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-300 border border-white/5">
                    <span>{cat}</span>
                    <button 
                      type="button" 
                      onClick={() => handleDeleteCategory(cat)}
                      className="text-rose-400 hover:text-rose-300"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Right Columns: Editor / Media List */}
        <div className={isEditing ? "lg:col-span-3" : "lg:col-span-2"}>
          {isEditing ? (
            
            /* Add/Edit Form Card */
            <form onSubmit={handleSave} className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  {form.type === 'photo' ? <ImageIcon className="w-5 h-5 text-emerald-300" /> : <VideoIcon className="w-5 h-5 text-amber-300" />}
                  {editingId ? 'Edit Gallery Item' : `Add New ${form.type === 'photo' ? 'Photo' : 'Video'}`}
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
                  <span>Item Title *</span>
                  <input 
                    type="text" 
                    value={form.title} 
                    onChange={(e) => setForm(prev => ({ ...prev, title: e.target.value }))} 
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                    placeholder="e.g. Free Eye Checkup Camp"
                  />
                </label>

                {/* Category Dropdown */}
                <label className="block text-sm text-slate-300 space-y-2">
                  <span>Category *</span>
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

                {/* Date */}
                <label className="block text-sm text-slate-300 space-y-2">
                  <span>Event Date</span>
                  <input 
                    type="date" 
                    value={form.date} 
                    onChange={(e) => setForm(prev => ({ ...prev, date: e.target.value }))} 
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                  />
                </label>

                {/* Photo Fields */}
                {form.type === 'photo' && (
                  <>
                    {/* Location */}
                    <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
                      <span>Location</span>
                      <input 
                        type="text" 
                        value={form.location} 
                        onChange={(e) => setForm(prev => ({ ...prev, location: e.target.value }))} 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                        placeholder="e.g. Ramnagar Village School"
                      />
                    </label>

                    {/* Multer file upload */}
                    <div className="block text-sm text-slate-300 space-y-2 md:col-span-2">
                      <span>Upload Photo File</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 cursor-pointer transition text-xs font-semibold text-slate-300">
                          <Upload size={14} />
                          <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'url')} 
                            className="hidden"
                          />
                        </label>
                        {form.url && (
                          <span className="text-[10px] text-emerald-300 truncate max-w-xs">{form.url}</span>
                        )}
                      </div>
                    </div>

                    {/* Manual URL entry */}
                    <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
                      <span>Or Image URL Link</span>
                      <input 
                        type="text" 
                        value={form.url} 
                        onChange={(e) => setForm(prev => ({ ...prev, url: e.target.value }))} 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                        placeholder="Paste image link here"
                      />
                    </label>
                  </>
                )}

                {/* Video Fields */}
                {form.type === 'video' && (
                  <>
                    {/* YouTube Embed URL */}
                    <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
                      <span>YouTube Embed Link *</span>
                      <input 
                        type="text" 
                        value={form.embedUrl} 
                        onChange={(e) => setForm(prev => ({ ...prev, embedUrl: e.target.value }))} 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                        placeholder="e.g. https://www.youtube.com/embed/dQw4w9WgXcQ"
                      />
                    </label>

                    {/* Multer thumbnail upload */}
                    <div className="block text-sm text-slate-300 space-y-2 md:col-span-2">
                      <span>Upload Video Cover Thumbnail</span>
                      <div className="flex items-center gap-3">
                        <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 cursor-pointer transition text-xs font-semibold text-slate-300">
                          <Upload size={14} />
                          <span>{uploading ? 'Uploading...' : 'Choose File'}</span>
                          <input 
                            type="file" 
                            accept="image/*" 
                            onChange={(e) => handleImageUpload(e, 'thumbnail')} 
                            className="hidden"
                          />
                        </label>
                        {form.thumbnail && (
                          <span className="text-[10px] text-emerald-300 truncate max-w-xs">{form.thumbnail}</span>
                        )}
                      </div>
                    </div>

                    {/* Manual Thumbnail URL entry */}
                    <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
                      <span>Or Thumbnail Image URL</span>
                      <input 
                        type="text" 
                        value={form.thumbnail} 
                        onChange={(e) => setForm(prev => ({ ...prev, thumbnail: e.target.value }))} 
                        className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm font-mono"
                        placeholder="Paste cover thumbnail link here"
                      />
                    </label>
                  </>
                )}

                {/* Priority order */}
                <label className="block text-sm text-slate-300 space-y-2">
                  <span>Display Priority Order</span>
                  <input 
                    type="number" 
                    value={form.order} 
                    onChange={(e) => setForm(prev => ({ ...prev, order: Number(e.target.value) }))} 
                    className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 transition-colors text-sm"
                  />
                </label>

                {/* Active Switch */}
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
                  <Save size={16} /> Save Item
                </button>
              </div>

            </form>
          ) : (
            
            /* Media Cards Listing */
            <div className="space-y-6">
              
              {/* Photo / Video Switch tabs */}
              <div className="flex border-b border-white/10 pb-1 gap-4">
                <button 
                  onClick={() => setActiveTab('photos')}
                  className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'photos' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  <ImageIcon size={16} /> Photos ({items.filter(i => i.type === 'photo').length})
                </button>
                <button 
                  onClick={() => setActiveTab('videos')}
                  className={`flex items-center gap-2 pb-3.5 text-sm font-bold border-b-2 transition-all ${activeTab === 'videos' ? 'border-amber-400 text-amber-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
                >
                  <VideoIcon size={16} /> Videos ({items.filter(i => i.type === 'video').length})
                </button>
              </div>

              {/* Items Grid */}
              <div className="grid gap-6 md:grid-cols-2">
                {loading ? (
                  <div className="md:col-span-2 text-slate-300 py-8 text-center text-sm">Loading media items...</div>
                ) : filteredItems.length === 0 ? (
                  <div className="md:col-span-2 text-slate-400 py-8 text-center text-sm">
                    No {activeTab} configured. Click Add to insert one.
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <div key={item._id} className="rounded-[24px] border border-white/5 bg-slate-900/60 overflow-hidden flex flex-col justify-between shadow-lg">
                      
                      {/* Image / Thumbnail header */}
                      <div className="relative h-40 bg-slate-950 overflow-hidden">
                        <img 
                          src={item.type === 'photo' ? item.url : (item.thumbnail || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=400&q=80')} 
                          alt={item.title} 
                          className="w-full h-full object-cover opacity-50"
                        />
                        {item.type === 'video' && (
                          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="w-10 h-10 rounded-full bg-slate-950/80 text-white flex items-center justify-center">
                              <Play className="w-4 h-4 fill-white ml-0.5" />
                            </div>
                          </div>
                        )}
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button 
                            onClick={() => handleToggleActive(item)}
                            className={`rounded-xl px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider border transition-colors ${item.isActive ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/20' : 'bg-rose-500/25 text-rose-300 border-rose-400/20'}`}
                          >
                            {item.isActive ? 'Active' : 'Disabled'}
                          </button>
                        </div>
                      </div>

                      {/* Info body */}
                      <div className="p-4 flex-grow space-y-2">
                        <span className="inline-block rounded-lg bg-emerald-500/10 border border-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-300">
                          {item.category || 'General'}
                        </span>
                        <h4 className="text-sm font-bold text-white leading-snug line-clamp-1">{item.title}</h4>
                        
                        <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                          <div className="flex items-center gap-1">
                            <Calendar size={12} />
                            <span>{item.date}</span>
                          </div>
                          {item.type === 'photo' && item.location && (
                            <div className="flex items-center gap-1">
                              <MapPin size={12} />
                              <span className="truncate max-w-[120px]">{item.location}</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex border-t border-white/5 bg-slate-950/20 px-4 py-3 justify-between">
                        <button 
                          onClick={() => openEdit(item)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-emerald-300 hover:text-emerald-200 transition-colors"
                        >
                          <Edit2 size={12} /> Edit
                        </button>
                        <button 
                          onClick={() => handleDeleteItem(item._id)}
                          className="flex items-center gap-1 text-[11px] font-semibold text-rose-300 hover:text-rose-200 transition-colors"
                        >
                          <Trash2 size={12} /> Delete
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>

            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default AdminGallery;
