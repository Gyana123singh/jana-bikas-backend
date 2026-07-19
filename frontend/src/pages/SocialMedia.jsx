import React from 'react';
import { Youtube, Facebook, Instagram, Twitter, Linkedin, Heart, MessageCircle, Share2, ExternalLink } from 'lucide-react';

const SocialMedia = () => {
  const platforms = [
    {
      name: "YouTube",
      handle: "@janabikasngo",
      followers: "15.4K Subscribers",
      description: "Watch our ground campaign documentaries, beneficiary testimonial videos, and educational center vlogs.",
      color: "bg-red-50 hover:bg-red-100 border-red-200 text-red-600",
      btnColor: "bg-red-600 hover:bg-red-500",
      icon: <Youtube className="w-8 h-8" />,
      link: "https://youtube.com"
    },
    {
      name: "Facebook",
      handle: "/janabikasngo",
      followers: "42.8K Followers",
      description: "Get daily field activity updates, volunteer announcement posts, donation drives notifications, and audit statements.",
      color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600",
      btnColor: "bg-blue-600 hover:bg-blue-500",
      icon: <Facebook className="w-8 h-8" />,
      link: "https://facebook.com"
    },
    {
      name: "Instagram",
      handle: "@janabikas_ngo",
      followers: "28.1K Followers",
      description: "Browse high-definition photos of tree plantations, classroom distributions, healthcare clinic snaps, and reels.",
      color: "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-600",
      btnColor: "bg-pink-600 hover:bg-pink-500",
      icon: <Instagram className="w-8 h-8" />,
      link: "https://instagram.com"
    },
    {
      name: "X / Twitter",
      handle: "@JanaBikasNGO",
      followers: "10.2K Followers",
      description: "Read quick updates on government policy compliance reviews, trust panel discussions, and collaborative announcements.",
      color: "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900",
      btnColor: "bg-slate-900 hover:bg-slate-800",
      icon: <Twitter className="w-8 h-8" />,
      link: "https://twitter.com"
    }
  ];

  // Mock social feed posts
  const mockFeed = [
    {
      id: 1,
      platform: "Instagram",
      author: "janabikas_ngo",
      time: "2 hours ago",
      text: "Our monthly healthcare camp at Rampur served over 250 patients today. Gratitude to our medical volunteers! 🩺💚 #health #ngo",
      image: "https://images.unsplash.com/photo-1579684389782-64d84b5e902a?auto=format&fit=crop&w=600&q=80",
      likes: "1,240",
      comments: "42"
    },
    {
      id: 2,
      platform: "YouTube",
      author: "Jana Bikas NGO",
      time: "1 day ago",
      text: "NEW VIDEO: Sponsoring computer learning tabs in rural schools. Watch how digital tools are changing classroom lessons. Link in bio!",
      image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80",
      likes: "3,890",
      comments: "156"
    },
    {
      id: 3,
      platform: "Facebook",
      author: "Jana Bikas NGO",
      time: "3 days ago",
      text: "Thanks to Raj Kumar Singhal ji for supporting our skill training lab! The sewing machines have reached our new batch. 🧵✨",
      image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
      likes: "850",
      comments: "28"
    }
  ];

  return (
    <div className="space-y-16 pb-16">
      
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {platforms.map((p, idx) => (
            <div 
              key={idx}
              className={`border p-6 rounded-3xl flex flex-col justify-between space-y-6 shadow-premium transition-all duration-300 ${p.color}`}
            >
              <div className="space-y-4 text-left">
                <div className="flex items-center justify-between">
                  <span className="p-2 rounded-xl bg-white shadow-sm inline-block">
                    {p.icon}
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
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-display font-bold text-white shadow-sm transition-all text-xs ${p.btnColor}`}
                >
                  <span>Connect Now</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Live Social Feed Wall */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Simulated Wall</span>
            <h2 className="text-3xl font-display font-extrabold text-slate-900">Recent Post Highlights</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {mockFeed.map((post) => (
              <div 
                key={post.id} 
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
                <div className="aspect-[4/3] w-full overflow-hidden bg-slate-100">
                  <img src={post.image} alt={post.author} className="w-full h-full object-cover" />
                </div>

                {/* Body Text */}
                <div className="p-5 flex-grow flex flex-col justify-between space-y-4">
                  <p className="text-xs text-slate-650 leading-relaxed font-normal">
                    {post.text}
                  </p>
                  
                  {/* Actions buttons */}
                  <div className="flex items-center space-x-6 text-[11px] text-slate-400 font-bold pt-4 border-t border-slate-50">
                    <button className="flex items-center space-x-1.5 hover:text-red-500 transition-colors">
                      <Heart className="w-3.5 h-3.5" />
                      <span>{post.likes}</span>
                    </button>
                    <button className="flex items-center space-x-1.5 hover:text-primary-600 transition-colors">
                      <MessageCircle className="w-3.5 h-3.5" />
                      <span>{post.comments}</span>
                    </button>
                    <button className="flex items-center space-x-1.5 hover:text-slate-600 transition-colors ml-auto">
                      <Share2 className="w-3.5 h-3.5" />
                      <span>Share</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
};

export default SocialMedia;
