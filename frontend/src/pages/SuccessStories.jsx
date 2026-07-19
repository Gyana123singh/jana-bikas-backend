import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Play, CheckCircle2, TrendingUp } from 'lucide-react';
import { successStories } from '../data/ngoData';

const SuccessStories = () => {
  const { slug } = useParams();

  // If a slug is provided, render the detail page
  if (slug) {
    const story = successStories.find((s) => s.slug === slug);

    if (!story) {
      return (
        <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
          <h2 className="text-3xl font-display font-extrabold text-slate-900">Story Not Found</h2>
          <p className="text-slate-500">The success story you are looking for does not exist or has been relocated.</p>
          <Link 
            to="/success-stories" 
            className="inline-flex items-center space-x-2 py-3 px-6 rounded-full font-bold text-white bg-primary-600 hover:bg-primary-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Success Stories</span>
          </Link>
        </div>
      );
    }

    const { title, category, image, videoUrl, longDescription, beforeAfter } = story;

    return (
      <div className="pb-24">
        {/* Header section */}
        <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
          <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('${image}')` }}></div>
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left space-y-4">
            <Link 
              to="/success-stories" 
              className="inline-flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors mb-2"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>All Stories</span>
            </Link>
            <span className="text-[10px] uppercase font-bold tracking-widest text-accent-400 bg-accent-500/10 px-3 py-1 rounded-full inline-block">
              {category} Success Story
            </span>
            <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
              {title}
            </h1>
          </div>
        </section>

        {/* Content Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
          
          {/* Media Grid (Photo & Video side by side) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Photo Card */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between">
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-slate-100">
                <img 
                  src={image} 
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4 border-t border-slate-50 text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary-600">
                  Representative Photo
                </span>
                <p className="text-xs text-slate-500 font-medium">Verified case portrait for {category} initiative</p>
              </div>
            </div>

            {/* Video Card */}
            <div className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-premium flex flex-col justify-between">
              {videoUrl ? (
                <div className="relative aspect-[16/10] w-full bg-slate-150">
                  <iframe
                    src={videoUrl}
                    title={title}
                    className="absolute inset-0 w-full h-full border-none"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="relative aspect-[16/10] w-full bg-slate-100 flex items-center justify-center">
                  <span className="text-xs text-slate-400">No Video Testimonial Available</span>
                </div>
              )}
              <div className="p-4 border-t border-slate-50 text-left">
                <span className="text-[10px] uppercase font-bold tracking-widest text-primary-600">
                  Video Testimonial
                </span>
                <p className="text-xs text-slate-500 font-medium">Beneficiary interview on project impact</p>
              </div>
            </div>
          </div>

          {/* Story Narrative & Before/After split */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            {/* Left 2 Columns: Full Narrative */}
            <div className="lg:col-span-2 space-y-6 text-left">
              <h2 className="text-2xl font-display font-bold text-slate-950">The Full Narrative</h2>
              <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
              <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                {longDescription}
              </p>
            </div>

            {/* Right Column: Before & After plus call to action */}
            <div className="space-y-6">
              {/* Before vs After Box */}
              <div className="bg-slate-50 border border-slate-100 rounded-3xl p-6 space-y-6 text-left">
                <h3 className="font-bold text-slate-900 text-sm">Case Interventions</h3>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-white border border-red-50 text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-red-500 tracking-wider">Before</span>
                    <p className="text-[11px] text-slate-650 leading-relaxed">{beforeAfter.before}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-emerald-50 text-left space-y-1">
                    <span className="text-[9px] uppercase font-bold text-emerald-600 tracking-wider">After</span>
                    <p className="text-[11px] text-slate-650 leading-relaxed">{beforeAfter.after}</p>
                  </div>
                </div>
              </div>

              {/* Call to Action Box */}
              <div className="p-6 rounded-2xl bg-primary-50 border border-primary-100 text-center space-y-4">
                <h4 className="font-bold text-primary-950 text-xs">Help Us Create More Stories</h4>
                <p className="text-[11px] text-primary-800 leading-relaxed">
                  Your support directly fuels the scholarship, training, and tools that make these life-changing outcomes possible.
                </p>
                <Link 
                  to="/donate"
                  className="inline-block py-2.5 px-6 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-500 text-xs shadow-sm transition-all"
                >
                  Support Our Programs
                </Link>
              </div>
            </div>
          </div>

        </section>
      </div>
    );
  }

  // Otherwise, render the list page
  return (
    <div className="space-y-16 pb-16">
      {/* Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Impact Outcomes</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Success Stories</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Read inspiring stories of real children, youth, and farmers who broke barriers with support from our donors.
          </p>
        </div>
      </section>

      {/* Grid listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {successStories.map((story) => (
            <div 
              key={story.id} 
              className="group bg-white rounded-2xl border border-slate-100 shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              <div className="relative h-48 w-full overflow-hidden bg-slate-100">
                <img 
                  src={story.image} 
                  alt={story.title} 
                  className="object-cover w-full h-full transform group-hover:scale-102 transition-transform duration-500"
                  loading="lazy"
                />
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white font-display text-[9px] font-bold tracking-widest uppercase">
                  {story.category}
                </div>
              </div>
              
              <div className="p-6 flex-grow flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base font-display font-bold text-slate-950 leading-snug group-hover:text-primary-600 transition-colors">
                    {story.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-3 mt-2">
                    {story.shortDescription}
                  </p>
                </div>
                
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                  <Link 
                    to={`/success-stories/${story.slug}`}
                    className="flex items-center space-x-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    <span>Read Full Story</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SuccessStories;
