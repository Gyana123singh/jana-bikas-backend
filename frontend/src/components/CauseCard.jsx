import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart } from 'lucide-react';

const CauseCard = ({ cause }) => {
  const { slug, title, tagline, image, goalAmount, raisedAmount } = cause;
  const percentRaised = Math.min(Math.round((raisedAmount / goalAmount) * 100), 100);

  return (
    <div className="group bg-white rounded-2xl border border-slate-100 shadow-premium hover:shadow-premium-hover transform hover:-translate-y-1 transition-all duration-300 flex flex-col h-full overflow-hidden">
      {/* Cause Image Container */}
      <div className="relative h-56 w-full overflow-hidden bg-slate-100">
        <img 
          src={image} 
          alt={title}
          className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        {/* Cause Category Badge */}
        <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm text-white font-display text-[10px] font-bold tracking-widest uppercase">
          {slug.replace('-', ' ')}
        </div>
      </div>

      {/* Cause Body */}
      <div className="p-6 flex-grow flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-display font-bold text-slate-950 mb-2 group-hover:text-primary-600 transition-colors">
            {title}
          </h3>
          <p className="text-sm text-slate-500 line-clamp-3 mb-6">
            {tagline}
          </p>
        </div>

        {/* Progress Section */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="text-slate-400">Raised: <strong className="text-slate-800">₹{raisedAmount.toLocaleString('en-IN')}</strong></span>
            <span className="text-primary-600">{percentRaised}%</span>
          </div>
          
          {/* Progress Bar Track */}
          <div className="relative w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000"
              style={{ width: `${percentRaised}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
            <span>Goal: ₹{goalAmount.toLocaleString('en-IN')}</span>
          </div>

          {/* Action Buttons Grid */}
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-50">
            <Link 
              to={`/causes/${slug}`}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition-all border border-slate-100"
            >
              <span>Learn More</span>
              <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
            </Link>
            <Link 
              to={`/donate?cause=${slug}`}
              className="flex items-center justify-center space-x-1.5 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 transition-all shadow-sm"
            >
              <Heart className="w-3.5 h-3.5 fill-white" />
              <span>Donate</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CauseCard;
