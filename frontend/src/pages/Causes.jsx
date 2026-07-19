import React from 'react';
import { Link } from 'react-router-dom';
import { causes } from '../data/ngoData';
import CauseCard from '../components/CauseCard';

const Causes = () => {
  return (
    <div className="space-y-16 pb-16">
      
      {/* Header section */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Our Core Pillars</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Our Respected Causes</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            We focus on 7 critical areas of activity, helping communities achieve sustainable livelihoods and self-reliance.
          </p>
        </div>
      </section>

      {/* Grid listing */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {causes.map((cause) => (
            <CauseCard key={cause.id} cause={cause} />
          ))}
        </div>
      </section>

      {/* Volunteer CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="bg-slate-50 border border-slate-100 rounded-3xl p-8 md:p-12 text-center space-y-6 max-w-3xl mx-auto">
          <h3 className="text-xl md:text-2xl font-display font-extrabold text-slate-950">
            Want to Support Beyond Donations?
          </h3>
          <p className="text-sm text-slate-500 max-w-xl mx-auto">
            Your time, skills, and energy can make a massive difference on the ground. Join our volunteer community.
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

export default Causes;
