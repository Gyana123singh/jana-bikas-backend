import React, { useEffect, useState } from 'react';
import { Youtube, Facebook, Instagram, Twitter, Linkedin, Heart, MessageCircle, Share2, ExternalLink, X, Send } from 'lucide-react';
import { socialApi } from '../api';

const SocialMedia = () => {
  const [platforms, setPlatforms] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Local storage likes tracking
  const [likedPosts, setLikedPosts] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('jana-liked-posts') || '[]');
    } catch {
      return [];
    }
  });

  // Track toast notifications
  const [toastMessage, setToastMessage] = useState('');

  // Slide-down comments state
  const [expandedCommentsPost, setExpandedCommentsPost] = useState(null); // ID of the post
  const [commentForm, setCommentForm] = useState({
    user: '',
    text: '',
  });
  const [submittingComment, setSubmittingComment] = useState(false);

  const fetchSocialData = async () => {
    try {
      setLoading(true);
      const [platformsData, postsData] = await Promise.all([
        socialApi.getPlatforms(),
        socialApi.getPosts()
      ]);
      setPlatforms(platformsData);
      setPosts(postsData);
    } catch (err) {
      setError('Failed to load social feed details.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSocialData();
  }, []);

  const handlePlatformClick = async (platform) => {
    try {
      await socialApi.trackClick(platform._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (postId) => {
    try {
      const result = await socialApi.likePost(postId);
      // result is { likes, liked }
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, likes: result.likes };
        }
        return p;
      }));

      let updatedLiked;
      if (likedPosts.includes(postId)) {
        updatedLiked = likedPosts.filter(id => id !== postId);
        showToast('Like removed');
      } else {
        updatedLiked = [...likedPosts, postId];
        showToast('Post liked!');
      }
      setLikedPosts(updatedLiked);
      localStorage.setItem('jana-liked-posts', JSON.stringify(updatedLiked));
    } catch (err) {
      console.error(err);
    }
  };

  const handleShare = async (postId) => {
    try {
      const result = await socialApi.sharePost(postId);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, shares: result.shares };
        }
        return p;
      }));

      // Copy simulation link to clipboard
      const shareUrl = `${window.location.origin}${window.location.pathname}#post-${postId}`;
      await navigator.clipboard.writeText(shareUrl);
      showToast('Share link copied to clipboard!');
    } catch (err) {
      console.error('Failed to share:', err);
    }
  };

  const handleSubmitComment = async (e, postId) => {
    e.preventDefault();
    if (!commentForm.text.trim()) return;

    setSubmittingComment(true);
    try {
      const updatedComments = await socialApi.commentPost(postId, commentForm);
      setPosts(prev => prev.map(p => {
        if (p._id === postId) {
          return { ...p, comments: updatedComments };
        }
        return p;
      }));
      setCommentForm({ user: '', text: '' });
      showToast('Comment posted successfully!');
    } catch (err) {
      showToast('Failed to post comment.');
    } finally {
      setSubmittingComment(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage('');
    }, 3000);
  };

  // Helper to map platform names to icons
  const getIcon = (name) => {
    const n = name.toLowerCase();
    if (n.includes('youtube')) return <Youtube className="w-8 h-8" />;
    if (n.includes('facebook')) return <Facebook className="w-8 h-8" />;
    if (n.includes('instagram')) return <Instagram className="w-8 h-8" />;
    if (n.includes('linkedin')) return <Linkedin className="w-8 h-8" />;
    return <Twitter className="w-8 h-8" />;
  };

  return (
    <div className="space-y-16 pb-16 relative">
      
      {/* Dynamic Toast Indicator */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 rounded-2xl bg-slate-900 border border-white/10 px-4 py-3 text-xs text-emerald-300 font-bold shadow-2xl animate-fade-in flex items-center gap-2">
          <span>{toastMessage}</span>
          <button onClick={() => setToastMessage('')} className="text-slate-400 hover:text-white">
            <X size={12} />
          </button>
        </div>
      )}

      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Social Connections</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Follow Our Journey</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Stay connected with our daily ground efforts. Subscribe, follow, and share our work across your channels.
          </p>
        </div>
      </section>

      {/* 2. Platform Links Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-8 text-slate-500 font-semibold">Loading platforms...</div>
        ) : platforms.length === 0 ? (
          <div className="text-center py-8 text-slate-400">No platforms linked.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {platforms.map((p) => (
              <div 
                key={p._id}
                className={`border p-6 rounded-3xl flex flex-col justify-between space-y-6 shadow-premium transition-all duration-300 ${p.color || 'bg-slate-50 border-slate-200 text-slate-900'}`}
              >
                <div className="space-y-4 text-left">
                  <div className="flex items-center justify-between">
                    <span className="p-2 rounded-xl bg-white shadow-sm inline-block">
                      {getIcon(p.name)}
                    </span>
                    <span className="text-[10px] font-extrabold tracking-wider bg-white/60 px-2.5 py-1 rounded-full uppercase">
                      {p.followers}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-display font-extrabold text-slate-950">{p.name}</h3>
                    <span className="text-xs font-mono font-medium opacity-70 block">{p.handle}</span>
                  </div>
                  <p className="text-xs text-slate-650 leading-relaxed">
                    {p.description}
                  </p>
                </div>

                <div>
                  <a
                    href={p.link}
                    onClick={() => handlePlatformClick(p)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-display font-bold text-white shadow-sm transition-all text-xs ${p.btnColor || 'bg-slate-900 hover:bg-slate-800'}`}
                  >
                    <span>Connect Now</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 3. Live Social Feed Wall */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Simulated Wall</span>
            <h2 className="text-3xl font-display font-extrabold text-slate-900">Recent Post Highlights</h2>
          </div>

          {loading ? (
            <div className="text-center py-12 text-slate-500 font-semibold">Loading feed posts...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12 text-slate-400">No highlights posts configured.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const isLiked = likedPosts.includes(post._id);
                const isCommentsExpanded = expandedCommentsPost === post._id;

                return (
                  <div 
                    key={post._id} 
                    id={`post-${post._id}`}
                    className="bg-white rounded-2xl border border-slate-100 shadow-premium overflow-hidden flex flex-col h-full text-left"
                  >
                    {/* Header author info */}
                    <div className="p-4 border-b border-slate-50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-slate-900 block">{post.author}</span>
                        <span className="text-[10px] text-slate-400 block">{post.time} on {post.platform}</span>
                      </div>
                      <span className="text-[9px] uppercase font-extrabold tracking-wider bg-slate-50 px-2 py-0.5 rounded border border-slate-100 text-slate-500">
                        {post.platform}
                      </span>
                    </div>

                    {/* Post photo */}
                    {post.image && (
                      <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                        <img src={post.image} alt={post.author} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Body Text */}
                    <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                      <p className="text-xs text-slate-650 leading-relaxed font-normal">
                        {post.text}
                      </p>
                      
                      {/* Actions buttons */}
                      <div className="flex items-center space-x-6 text-[11px] text-slate-450 font-bold pt-4 border-t border-slate-50">
                        <button 
                          onClick={() => handleLike(post._id)}
                          className={`flex items-center space-x-1.5 transition-colors ${isLiked ? 'text-red-500' : 'hover:text-red-500 text-slate-400'}`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-red-500' : ''}`} />
                          <span>{post.likes || 0}</span>
                        </button>
                        <button 
                          onClick={() => setExpandedCommentsPost(isCommentsExpanded ? null : post._id)}
                          className={`flex items-center space-x-1.5 hover:text-primary-650 transition-colors ${isCommentsExpanded ? 'text-primary-600' : 'text-slate-400'}`}
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                          <span>{post.comments ? post.comments.length : 0}</span>
                        </button>
                        <button 
                          onClick={() => handleShare(post._id)}
                          className="flex items-center space-x-1.5 hover:text-slate-650 transition-colors text-slate-400 ml-auto"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                          <span>{post.shares || 0}</span>
                        </button>
                      </div>
                    </div>

                    {/* Slide-Down Comments Section */}
                    {isCommentsExpanded && (
                      <div className="bg-slate-50 border-t border-slate-100 p-4 space-y-4 animate-fade-in text-left">
                        <h4 className="text-xs font-bold text-slate-900 border-b border-slate-200 pb-2">Comments</h4>
                        
                        {/* List of comments */}
                        <div className="space-y-2.5 max-h-40 overflow-y-auto pr-1">
                          {!post.comments || post.comments.length === 0 ? (
                            <p className="text-[10px] text-slate-400 text-center py-2">No comments yet. Be the first to reply!</p>
                          ) : (
                            post.comments.map((comment, cidx) => (
                              <div key={comment._id || cidx} className="bg-white rounded-xl p-2.5 border border-slate-150">
                                <div className="flex justify-between items-center text-[9px] text-slate-450 font-bold mb-1">
                                  <span>{comment.user}</span>
                                  <span>{new Date(comment.date).toLocaleDateString()}</span>
                                </div>
                                <p className="text-[10px] text-slate-650 leading-relaxed font-normal">{comment.text}</p>
                              </div>
                            ))
                          )}
                        </div>

                        {/* Add Comment form */}
                        <form onSubmit={(e) => handleSubmitComment(e, post._id)} className="space-y-2 pt-2 border-t border-slate-200">
                          <input 
                            type="text" 
                            placeholder="Your Name (Optional)" 
                            value={commentForm.user}
                            onChange={(e) => setCommentForm(prev => ({ ...prev, user: e.target.value }))}
                            className="w-full bg-white border border-slate-200 rounded-lg py-1 px-2.5 text-[10px] outline-none focus:border-primary-500 font-semibold"
                          />
                          <div className="relative">
                            <textarea 
                              rows={2}
                              placeholder="Write a message..."
                              value={commentForm.text}
                              onChange={(e) => setCommentForm(prev => ({ ...prev, text: e.target.value }))}
                              className="w-full bg-white border border-slate-200 rounded-lg pl-2.5 pr-8 py-1.5 text-[10px] outline-none focus:border-primary-500 leading-normal"
                            />
                            <button 
                              type="submit" 
                              disabled={submittingComment || !commentForm.text.trim()}
                              className="absolute right-2 bottom-3 text-primary-600 hover:text-primary-700 disabled:opacity-40"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </form>
                      </div>
                    )}

                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

    </div>
  );
};

export default SocialMedia;
