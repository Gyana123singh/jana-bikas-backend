import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Heart, ArrowLeft, CheckCircle2, ChevronRight } from 'lucide-react';
import { causes } from '../data/ngoData';

const CauseDetail = () => {
  const { slug } = useParams();
  
  // Find matching cause
  const cause = causes.find((c) => c.slug === slug);

  if (!cause) {
    return (
      <div className="max-w-xl mx-auto px-4 py-24 text-center space-y-6">
        <h2 className="text-3xl font-display font-extrabold text-slate-900">Cause Not Found</h2>
        <p className="text-slate-500">The cause category you are looking for does not exist or has been relocated.</p>
        <Link 
          to="/causes" 
          className="inline-flex items-center space-x-2 py-3 px-6 rounded-full font-bold text-white bg-primary-600 hover:bg-primary-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Our Causes</span>
        </Link>
      </div>
    );
  }

  const { title, tagline, image, longDescription, goalAmount, raisedAmount, activities, impact } = cause;
  const percentRaised = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

  return (
    <div className="pb-24">
      
      {/* 1. Cause Hero Header */}
      <section className="relative h-[45vh] bg-slate-900 overflow-hidden flex items-center">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url('${image}')` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-left text-white space-y-4">
          <Link 
            to="/causes" 
            className="inline-flex items-center space-x-1 text-xs font-bold text-slate-300 hover:text-white uppercase tracking-wider transition-colors mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Causes</span>
          </Link>
          <h1 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
            {title}
          </h1>
          <p className="text-sm md:text-lg text-slate-200 max-w-3xl font-light">
            {tagline}
          </p>
        </div>
      </section>

      {/* 2. Page Content Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Main Details (Left 2 Columns) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Detail Description */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-slate-950">About the Program</h2>
            <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
            <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
              {longDescription}
            </p>
          </div>

          {/* Activities List */}
          <div className="space-y-4">
            <h2 className="text-2xl font-display font-bold text-slate-950">Our Operational Activities</h2>
            <div className="h-1 w-12 bg-primary-500 rounded-full"></div>
            <div className="grid grid-cols-1 gap-3 pt-2">
              {activities.map((activity, idx) => (
                <div key={idx} className="flex items-start space-x-3 p-4 rounded-xl bg-slate-50 border border-slate-100 text-sm text-slate-700">
                  <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{activity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Verified Impact Metrics */}
          <div className="space-y-6 bg-slate-900 text-white p-8 rounded-3xl border border-slate-800">
            <div className="space-y-2">
              <h2 className="text-xl font-display font-bold text-white">Impact Achieved to Date</h2>
              <p className="text-xs text-slate-400">Verified counts of local communities lifted through this cause.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
              {impact.map((metric, idx) => (
                <div key={idx} className={`pt-4 sm:pt-0 ${idx > 0 ? 'sm:pl-6' : ''} text-center sm:text-left`}>
                  <div className="text-3xl font-extrabold text-accent-400">{metric.count}</div>
                  <div className="text-xs text-slate-300 uppercase tracking-widest font-bold mt-1">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Donation Widget Sidebar (Right Column) */}
        <div className="bg-white border border-slate-100 shadow-premium p-8 rounded-2xl space-y-6 sticky top-24">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Funding Status</h3>
            <p className="text-xs text-slate-400">Help us achieve our program milestone goals</p>
          </div>

          {/* Progress Indicators */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="text-slate-500">Raised: <strong>₹{raisedAmount.toLocaleString('en-IN')}</strong></span>
              <span className="text-primary-600">{percentRaised}%</span>
            </div>
            
            {/* Progress Bar Track */}
            <div className="relative w-full h-3 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full"
                style={{ width: `${percentRaised}%` }}
              ></div>
            </div>
            
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span>Goal: ₹{goalAmount.toLocaleString('en-IN')}</span>
              <span>Needs: ₹{(goalAmount - raisedAmount).toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="border-t border-slate-50 pt-6 space-y-4">
            <Link 
              to={`/donate?cause=${slug}`}
              className="flex items-center justify-center space-x-2 w-full py-4 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md shadow-primary-900/10 hover:shadow-lg transition-all"
            >
              <Heart className="w-5 h-5 fill-white" />
              <span>Donate to this Cause</span>
            </Link>
            <p className="text-[11px] text-center text-slate-400 leading-normal">
              Fully compliant with Section 80G tax benefit regulations. Instantly download receipts.
            </p>
          </div>
        </div>

      </section>

      {/* Volunteer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-3xl mx-auto">
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-slate-950">
            Support Our {title} Initiative as a Volunteer
          </h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Your hands-on help is crucial. Volunteer with us and help execute this cause directly on the ground.
          </p>
          <div>
            <Link 
              to="/volunteer"
              className="inline-block py-3 px-8 rounded-full font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md shadow-primary-900/10 hover:shadow-lg transition-all"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default CauseDetail;
