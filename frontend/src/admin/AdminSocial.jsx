import React, { useEffect, useState } from 'react';
import { Share2, Heart, MessageCircle, Save, Plus, Edit2, Trash2, X, ToggleLeft, ToggleRight, Sparkles, Upload, ExternalLink, Activity, BarChart2, MessageSquare, RefreshCw } from 'lucide-react';
import { socialApi, galleryApi } from '../api';

const AdminSocial = () => {
  const [analytics, setAnalytics] = useState(null);
  const [platforms, setPlatforms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active manage tab: 'analytics' | 'platforms' | 'posts'
  const [activeSection, setActiveSection] = useState('analytics');

  // File upload state
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState('');

  // Form State: Platforms
  const [isEditingPlatform, setIsEditingPlatform] = useState(false);
  const [editingPlatformId, setEditingPlatformId] = useState(null);
  const [platformForm, setPlatformForm] = useState({
    name: '',
    handle: '',
    followers: '',
    description: '',
    color: 'bg-slate-50 border-slate-200 text-slate-900',
    btnColor: 'bg-slate-900 hover:bg-slate-800',
    link: '',
    order: 0,
  });

  // Form State: Posts
  const [isEditingPost, setIsEditingPost] = useState(false);
  const [editingPostId, setEditingPostId] = useState(null);
  const [postForm, setPostForm] = useState({
    platform: 'Instagram',
    author: 'janabikas_ngo',
    time: 'Just now',
    text: '',
    image: '',
    likes: 0,
    shares: 0,
    isActive: true,
  });

  // Comments view modal state
  const [viewingCommentsPost, setViewingCommentsPost] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [analyticsData, platformsData, postsData] = await Promise.all([
        socialApi.getAnalytics(),
        socialApi.getAllPlatformsAdmin(),
        socialApi.getAllPostsAdmin(),
      ]);

      setAnalytics(analyticsData);
      setPlatforms(platformsData);
      setPosts(postsData);
    } catch (err) {
      setError('Failed to fetch social media dashboard data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Platform Actions
  const openAddPlatform = () => {
    setEditingPlatformId(null);
    setPlatformForm({
      name: '',
      handle: '',
      followers: '0 Followers',
      description: '',
      color: 'bg-slate-55 border-white/10 text-slate-100',
      btnColor: 'bg-emerald-500 hover:bg-emerald-600 text-slate-950',
      link: 'https://',
      order: platforms.length + 1,
    });
    setIsEditingPlatform(true);
  };

  const openEditPlatform = (p) => {
    setEditingPlatformId(p._id);
    setPlatformForm({
      name: p.name || '',
      handle: p.handle || '',
      followers: p.followers || '',
      description: p.description || '',
      color: p.color || '',
      btnColor: p.btnColor || '',
      link: p.link || '',
      order: p.order || 0,
    });
    setIsEditingPlatform(true);
  };

  const handleSavePlatform = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!platformForm.name || !platformForm.handle || !platformForm.link) {
      setError('Name, handle, and redirect link are required.');
      return;
    }

    try {
      if (editingPlatformId) {
        await socialApi.updatePlatformAdmin(editingPlatformId, platformForm);
        setSuccess('Platform connection updated.');
      } else {
        await socialApi.createPlatformAdmin(platformForm);
        setSuccess('Platform connection added.');
      }
      setIsEditingPlatform(false);
      fetchAllData();
    } catch (err) {
      setError('Failed to save social platform.');
    }
  };

  const handleDeletePlatform = async (id) => {
    if (!window.confirm('Delete this social connection? Users won\'t be able to click redirect links.')) {
      return;
    }
    try {
      await socialApi.deletePlatformAdmin(id);
      setSuccess('Platform connection deleted.');
      fetchAllData();
    } catch (err) {
      setError('Failed to delete platform.');
    }
  };

  // Post Actions
  const openAddPost = () => {
    setEditingPostId(null);
    setPostForm({
      platform: platforms[0]?.name || 'Instagram',
      author: 'janabikas_ngo',
      time: 'Just now',
      text: '',
      image: '',
      likes: 0,
      shares: 0,
      isActive: true,
    });
    setUploadError('');
    setIsEditingPost(true);
  };

  const openEditPost = (p) => {
    setEditingPostId(p._id);
    setPostForm({
      platform: p.platform || 'Instagram',
      author: p.author || '',
      time: p.time || '',
      text: p.text || '',
      image: p.image || '',
      likes: p.likes || 0,
      shares: p.shares || 0,
      isActive: p.isActive !== false,
    });
    setUploadError('');
    setIsEditingPost(true);
  };

  const handlePostImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadError('');
    try {
      const result = await galleryApi.uploadImage(file);
      setPostForm(prev => ({ ...prev, image: result.url }));
      setSuccess('Post image uploaded successfully!');
    } catch (err) {
      setUploadError('Image upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!postForm.text) {
      setError('Post text content is required.');
      return;
    }

    try {
      if (editingPostId) {
        await socialApi.updatePostAdmin(editingPostId, postForm);
        setSuccess('Feed post updated successfully.');
      } else {
        await socialApi.createPostAdmin(postForm);
        setSuccess('Feed post published successfully.');
      }
      setIsEditingPost(false);
      fetchAllData();
    } catch (err) {
      setError('Failed to save post.');
    }
  };

  const handleDeletePost = async (id) => {
    if (!window.confirm('Delete this feed post?')) {
      return;
    }
    try {
      await socialApi.deletePostAdmin(id);
      setSuccess('Feed post deleted.');
      fetchAllData();
    } catch (err) {
      setError('Failed to delete post.');
    }
  };

  const handleTogglePostActive = async (post) => {
    try {
      await socialApi.updatePostAdmin(post._id, { isActive: !post.isActive });
      setSuccess('Post visibility status updated.');
      fetchAllData();
    } catch (err) {
      setError('Failed to toggle post visibility.');
    }
  };

  // Comment Actions
  const handleDeleteComment = async (postId, commentId) => {
    if (!window.confirm('Remove this comment from the post?')) return;
    try {
      const post = posts.find(p => p._id === postId);
      if (!post) return;
      const updatedComments = post.comments.filter(c => c._id !== commentId);
      await socialApi.updatePostAdmin(postId, { comments: updatedComments });
      
      // Update local state to reflect comment removal instantly
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      }));
      if (viewingCommentsPost && viewingCommentsPost._id === postId) {
        setViewingCommentsPost({ ...viewingCommentsPost, comments: updatedComments });
      }
      setSuccess('Comment removed successfully.');
    } catch (err) {
      setError('Failed to remove comment.');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Panel */}
      <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl shadow-black/20">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-emerald-300">Audience & Reach</p>
            <h1 className="mt-2 text-3xl font-semibold text-white">Social Connections</h1>
            <p className="mt-3 max-w-2xl text-sm text-slate-400">
              Manage external social redirect links, publish recent simulated posts highlights, verify user comments, and inspect overall engagement analytics.
            </p>
          </div>
          {!isEditingPlatform && !isEditingPost && (
            <div className="flex gap-2">
              <button 
                onClick={openAddPlatform}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-emerald-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:scale-[1.01] transition"
              >
                <Plus size={16} /> Link Platform
              </button>
              <button 
                onClick={openAddPost}
                className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 hover:scale-[1.01] transition"
              >
                <Plus size={16} /> Publish Post
              </button>
            </div>
          )}
        </div>
        {success && <p className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-3 py-2.5 text-sm text-emerald-300">{success}</p>}
        {error && <p className="mt-4 rounded-2xl border border-rose-400/20 bg-rose-500/10 px-3 py-2.5 text-sm text-rose-300">{error}</p>}
      </div>

      {/* Segment Navigation */}
      {!isEditingPlatform && !isEditingPost && (
        <div className="flex border-b border-white/10 pb-1 gap-4">
          <button 
            onClick={() => setActiveSection('analytics')}
            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeSection === 'analytics' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <BarChart2 size={16} /> Analytics & Clicks
          </button>
          <button 
            onClick={() => setActiveSection('platforms')}
            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeSection === 'platforms' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <ExternalLink size={16} /> Connect Cards ({platforms.length})
          </button>
          <button 
            onClick={() => setActiveSection('posts')}
            className={`flex items-center gap-2 pb-3 text-sm font-bold border-b-2 transition-all ${activeSection === 'posts' ? 'border-emerald-400 text-emerald-300' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
          >
            <MessageSquare size={16} /> Posts highlights ({posts.length})
          </button>
          <button 
            onClick={fetchAllData}
            className="ml-auto text-slate-450 hover:text-slate-200 p-1 flex items-center gap-1.5 text-xs font-semibold"
          >
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} /> Refresh
          </button>
        </div>
      )}

      {/* --- RENDER SECTIONS --- */}

      {/* 1. ANALYTICS PANEL */}
      {activeSection === 'analytics' && !isEditingPlatform && !isEditingPost && (
        <div className="space-y-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            
            {/* Likes */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center">
                <Heart className="w-6 h-6 fill-rose-500/10" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Total Post Likes</span>
                <h4 className="text-2xl font-bold text-white mt-0.5">{analytics?.metrics?.totalLikes || 0}</h4>
              </div>
            </div>

            {/* Comments */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Total Feed Comments</span>
                <h4 className="text-2xl font-bold text-white mt-0.5">{analytics?.metrics?.totalComments || 0}</h4>
              </div>
            </div>

            {/* Shares */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <Share2 className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Total Shares</span>
                <h4 className="text-2xl font-bold text-white mt-0.5">{analytics?.metrics?.totalShares || 0}</h4>
              </div>
            </div>

            {/* Redirect Clicks */}
            <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-5 flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <ExternalLink className="w-6 h-6" />
              </div>
              <div className="text-left">
                <span className="text-[10px] text-slate-450 uppercase font-bold tracking-wider">Link Click-Throughs</span>
                <h4 className="text-2xl font-bold text-white mt-0.5">{analytics?.metrics?.totalClicks || 0}</h4>
              </div>
            </div>

          </div>

          {/* Platforms clicks breakdown list */}
          <div className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl text-left">
            <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-white/5 pb-4">
              <Activity className="text-emerald-300 w-5 h-5" />
              <span>Platform Engagements & Link Click-Throughs</span>
            </h3>

            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-slate-300 text-xs text-left">
                <thead>
                  <tr className="text-slate-400 border-b border-white/5 uppercase text-[9px] tracking-wider">
                    <th className="pb-3 pt-1">Platform</th>
                    <th className="pb-3 pt-1">Handle</th>
                    <th className="pb-3 pt-1">Followers Count Display</th>
                    <th className="pb-3 pt-1 text-right">Redirect Clicks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {analytics?.platforms?.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-4 text-center text-slate-500">No platforms linked yet.</td>
                    </tr>
                  ) : (
                    analytics?.platforms?.map((p) => (
                      <tr key={p.id}>
                        <td className="py-3.5 font-bold text-white">{p.name}</td>
                        <td className="py-3.5 font-mono">{p.handle}</td>
                        <td className="py-3.5">{p.followers}</td>
                        <td className="py-3.5 text-right font-bold text-emerald-300">{p.clicks} clicks</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLATFORMS MANAGER EDIT/CREATE */}
      {isEditingPlatform && (
        <form onSubmit={handleSavePlatform} className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <ExternalLink className="w-5 h-5 text-emerald-300" />
              {editingPlatformId ? 'Edit Platform Connection' : 'Link Social Platform'}
            </h2>
            <button type="button" onClick={() => setIsEditingPlatform(false)} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Name */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Platform Name *</span>
              <input 
                type="text" 
                value={platformForm.name} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, name: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
                placeholder="e.g. Instagram"
              />
            </label>

            {/* Handle */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Account Handle / Username *</span>
              <input 
                type="text" 
                value={platformForm.handle} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, handle: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm font-mono"
                placeholder="e.g. @janabikas_ngo"
              />
            </label>

            {/* Followers */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Followers count copy label</span>
              <input 
                type="text" 
                value={platformForm.followers} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, followers: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
                placeholder="e.g. 28.1K Followers"
              />
            </label>

            {/* Redirect Link */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Redirect Web Address (Full URL) *</span>
              <input 
                type="text" 
                value={platformForm.link} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, link: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm font-mono"
                placeholder="e.g. https://instagram.com/janabikas_ngo"
              />
            </label>

            {/* CSS background color overrides */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Color CSS style properties</span>
              <input 
                type="text" 
                value={platformForm.color} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, color: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm font-mono"
                placeholder="e.g. bg-pink-50 border-pink-200 text-pink-650"
              />
            </label>

            {/* Button Color overrides */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Button color styling CSS classes</span>
              <input 
                type="text" 
                value={platformForm.btnColor} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, btnColor: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm font-mono"
                placeholder="e.g. bg-pink-600 hover:bg-pink-500"
              />
            </label>

            {/* Description */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Platform Description copy</span>
              <textarea 
                rows={3}
                value={platformForm.description} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, description: e.target.value }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
                placeholder="Explain what kind of media or updates you post here..."
              />
            </label>

            {/* Order */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Display Order</span>
              <input 
                type="number" 
                value={platformForm.order} 
                onChange={(e) => setPlatformForm(prev => ({ ...prev, order: Number(e.target.value) }))} 
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
              />
            </label>

          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <button type="button" onClick={() => setIsEditingPlatform(false)} className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-350 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3 font-semibold text-slate-950 hover:scale-[1.01] transition">
              <Save size={16} /> Link Platform
            </button>
          </div>
        </form>
      )}

      {/* Platform Cards list */}
      {activeSection === 'platforms' && !isEditingPlatform && !isEditingPost && (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {platforms.map((p) => (
            <div key={p._id} className="rounded-3xl border border-white/5 bg-slate-900/60 p-5 flex flex-col justify-between space-y-4 text-left">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-base">{p.name}</h4>
                  <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded-full text-slate-450 border border-white/5">{p.followers}</span>
                </div>
                <p className="text-xs font-mono text-emerald-300 truncate">{p.handle}</p>
                <p className="text-xs text-slate-400 line-clamp-3 leading-normal">{p.description}</p>
              </div>
              
              <div className="flex border-t border-white/5 pt-3 justify-between items-center text-xs">
                <span className="text-[10px] text-slate-500 font-bold uppercase">{p.clicks || 0} Redirects</span>
                <div className="flex gap-3">
                  <button onClick={() => openEditPlatform(p)} className="text-emerald-300 hover:text-emerald-200 font-semibold flex items-center gap-1">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDeletePlatform(p._id)} className="text-rose-300 hover:text-rose-200 font-semibold flex items-center gap-1">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. POSTS MANAGER EDIT/CREATE */}
      {isEditingPost && (
        <form onSubmit={handleSavePost} className="rounded-[30px] border border-white/10 bg-slate-900/80 p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/5 pb-4">
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-amber-300" />
              {editingPostId ? 'Edit Highlights Post' : 'Publish Highlight Post'}
            </h2>
            <button type="button" onClick={() => setIsEditingPost(false)} className="rounded-xl border border-white/10 p-2 text-slate-400 hover:text-white">
              <X size={16} />
            </button>
          </div>

          {uploadError && <p className="rounded-xl border border-rose-400/20 bg-rose-500/10 px-3 py-2 text-xs text-rose-300">{uploadError}</p>}

          <div className="grid gap-6 md:grid-cols-2">
            
            {/* Platform selection */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Channel Platform *</span>
              <select 
                value={postForm.platform} 
                onChange={(e) => setPostForm(prev => ({ ...prev, platform: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-slate-950 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
              >
                <option value="Instagram">Instagram</option>
                <option value="Facebook">Facebook</option>
                <option value="YouTube">YouTube</option>
                <option value="Twitter">X / Twitter</option>
              </select>
            </label>

            {/* Author */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Author Label *</span>
              <input 
                type="text" 
                value={postForm.author} 
                onChange={(e) => setForm(prev => ({ ...prev, author: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm font-mono"
                placeholder="e.g. janabikas_ngo"
              />
            </label>

            {/* Time label */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Timestamp display *</span>
              <input 
                type="text" 
                value={postForm.time} 
                onChange={(e) => setPostForm(prev => ({ ...prev, time: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
                placeholder="e.g. 2 hours ago or 1 day ago"
              />
            </label>

            {/* Image upload picker */}
            <div className="block text-sm text-slate-300 space-y-2">
              <span>Post Image File</span>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 hover:bg-white/10 px-4 py-3 cursor-pointer transition text-xs font-semibold text-slate-300">
                  <Upload size={14} />
                  <span>{uploading ? 'Uploading...' : 'Choose Image'}</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handlePostImageUpload} 
                    className="hidden"
                  />
                </label>
                {postForm.image && (
                  <span className="text-[10px] text-emerald-300 truncate max-w-xs">{postForm.image}</span>
                )}
              </div>
            </div>

            {/* Image URL override */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Or Post Image Link URL</span>
              <input 
                type="text" 
                value={postForm.image} 
                onChange={(e) => setPostForm(prev => ({ ...prev, image: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm font-mono"
                placeholder="Paste image link here"
              />
            </label>

            {/* Post text */}
            <label className="block text-sm text-slate-300 space-y-2 md:col-span-2">
              <span>Post Message / Narrative *</span>
              <textarea 
                rows={4}
                value={postForm.text} 
                onChange={(e) => setPostForm(prev => ({ ...prev, text: e.target.value }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
                placeholder="Write what was achieved in this campaign..."
              />
            </label>

            {/* Likes count override */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Pre-populated Likes</span>
              <input 
                type="number" 
                value={postForm.likes} 
                onChange={(e) => setPostForm(prev => ({ ...prev, likes: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
              />
            </label>

            {/* Shares count override */}
            <label className="block text-sm text-slate-300 space-y-2">
              <span>Pre-populated Shares</span>
              <input 
                type="number" 
                value={postForm.shares} 
                onChange={(e) => setPostForm(prev => ({ ...prev, shares: Number(e.target.value) }))}
                className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white outline-none focus:border-emerald-400 text-sm"
              />
            </label>

            {/* Active switch */}
            <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 mt-6">
              <span className="text-sm font-medium text-slate-300">Visible on Highlight Feed</span>
              <button 
                type="button"
                onClick={() => setPostForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                className={`p-1 transition-colors ${postForm.isActive ? 'text-emerald-400' : 'text-slate-500'}`}
              >
                {postForm.isActive ? <ToggleRight size={34} /> : <ToggleLeft size={34} />}
              </button>
            </div>

          </div>

          <div className="flex justify-end gap-3 border-t border-white/5 pt-4">
            <button type="button" onClick={() => setIsEditingPost(false)} className="rounded-2xl border border-white/10 px-5 py-3 font-semibold text-slate-350 hover:text-white">
              Cancel
            </button>
            <button type="submit" className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-amber-400 px-6 py-3 font-semibold text-slate-950 hover:scale-[1.01] transition">
              <Save size={16} /> Publish Post
            </button>
          </div>
        </form>
      )}

      {/* Posts Highlights manager list */}
      {activeSection === 'posts' && !isEditingPlatform && !isEditingPost && (
        <div className="grid gap-6 md:grid-cols-2">
          {posts.map((post) => (
            <div key={post._id} className="rounded-3xl border border-white/5 bg-slate-900/60 overflow-hidden flex flex-col justify-between shadow-lg text-left">
              
              {/* Photo preview header */}
              <div className="relative h-44 bg-slate-950">
                <img 
                  src={post.image || 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=400&q=80'} 
                  alt={post.author} 
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute top-3 left-3">
                  <span className="rounded-lg bg-emerald-500/20 border border-emerald-500/30 px-2 py-0.5 text-[9px] font-bold text-emerald-300 uppercase tracking-wider">
                    {post.platform}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex gap-2">
                  <button 
                    onClick={() => handleTogglePostActive(post)}
                    className={`rounded-xl px-2 py-0.5 text-[9px] font-bold uppercase border transition-colors ${post.isActive ? 'bg-emerald-500/25 text-emerald-300 border-emerald-400/20' : 'bg-rose-500/25 text-rose-300 border-rose-400/20'}`}
                  >
                    {post.isActive ? 'Visible' : 'Hidden'}
                  </button>
                </div>
              </div>

              {/* Message content */}
              <div className="p-5 flex-grow space-y-3">
                <div className="flex justify-between items-center text-[10px] text-slate-450 font-bold">
                  <span>{post.author}</span>
                  <span>{post.time}</span>
                </div>
                <p className="text-xs text-slate-350 line-clamp-3 leading-relaxed">{post.text}</p>
                
                {/* Stats indicators */}
                <div className="flex gap-4 text-[10px] text-slate-500 font-bold pt-1">
                  <span className="flex items-center gap-1"><Heart size={12} /> {post.likes || 0} Likes</span>
                  <span className="flex items-center gap-1"><MessageCircle size={12} /> {post.comments ? post.comments.length : 0} Comments</span>
                  <span className="flex items-center gap-1"><Share2 size={12} /> {post.shares || 0} Shares</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex border-t border-white/5 bg-slate-950/20 px-4 py-3 justify-between items-center">
                <button 
                  onClick={() => setViewingCommentsPost(post)}
                  className="flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200"
                >
                  <MessageSquare size={13} /> View Comments ({post.comments ? post.comments.length : 0})
                </button>
                <div className="flex gap-3">
                  <button onClick={() => openEditPost(post)} className="text-emerald-300 hover:text-emerald-200 text-[11px] font-semibold flex items-center gap-0.5">
                    <Edit2 size={12} /> Edit
                  </button>
                  <button onClick={() => handleDeletePost(post._id)} className="text-rose-300 hover:text-rose-200 text-[11px] font-semibold flex items-center gap-0.5">
                    <Trash2 size={12} /> Delete
                  </button>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}

      {/* --- COMMENTS REVIEW OVERLAY MODAL --- */}
      {viewingCommentsPost && (
        <div className="fixed inset-0 bg-slate-950/80 z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-xl rounded-3xl border border-white/10 bg-slate-900 p-6 shadow-2xl space-y-4 max-h-[80vh] flex flex-col justify-between text-left">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <MessageSquare className="text-emerald-300" />
                <span>Comments Review: {viewingCommentsPost.author}</span>
              </h3>
              <button 
                onClick={() => setViewingCommentsPost(null)}
                className="text-slate-400 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            {/* Comments List */}
            <div className="flex-grow overflow-y-auto space-y-3 pr-2">
              {!viewingCommentsPost.comments || viewingCommentsPost.comments.length === 0 ? (
                <p className="text-slate-500 py-8 text-center text-xs">No comments submitted on this post yet.</p>
              ) : (
                viewingCommentsPost.comments.map((comment) => (
                  <div key={comment._id} className="rounded-2xl border border-white/5 bg-white/5 p-3 flex justify-between items-start gap-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{comment.user}</span>
                        <span className="text-[9px] text-slate-500">{new Date(comment.date).toLocaleDateString()}</span>
                      </div>
                      <p className="text-xs text-slate-350 leading-relaxed font-normal">{comment.text}</p>
                    </div>
                    <button 
                      onClick={() => handleDeleteComment(viewingCommentsPost._id, comment._id)}
                      className="text-rose-450 hover:text-rose-350 p-1 flex-shrink-0"
                      title="Delete Comment"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))
              )}
            </div>

            <div className="flex justify-end border-t border-white/5 pt-3">
              <button 
                onClick={() => setViewingCommentsPost(null)}
                className="rounded-xl border border-white/10 bg-white/5 hover:bg-white/10 px-4 py-2 text-xs font-semibold text-slate-200"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminSocial;
