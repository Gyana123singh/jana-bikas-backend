import React from 'react';
import { Award, Calendar, Handshake, Heart } from 'lucide-react';
import { respectedDonors } from '../data/ngoData';

const Donors = () => {
  return (
    <div className="space-y-16 py-12">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 -mt-12 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Our Supporters</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Our Respected Donors</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            We are deeply grateful to the individuals and organizations whose contributions power our daily community work.
          </p>
        </div>
      </section>

      {/* 2. Donors Cards Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {respectedDonors.map((donor) => (
            <div 
              key={donor.id}
              className="bg-white border border-slate-100 rounded-2xl p-6 text-center flex flex-col items-center space-y-4 shadow-premium hover:shadow-premium-hover transform hover:-translate-y-0.5 transition-all duration-300"
            >
              {/* Donor Avatar */}
              <div className="relative w-20 h-20 rounded-full overflow-hidden bg-slate-50 flex items-center justify-center border-2 border-primary-50">
                {donor.photo && !donor.isAnonymous ? (
                  <img src={donor.photo} alt={donor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-slate-100 flex items-center justify-center">
                    <Heart className="w-6 h-6 text-primary-400 fill-primary-100" />
                  </div>
                )}
              </div>
              
              <div className="space-y-1">
                <h3 className="font-display font-bold text-base text-slate-900 leading-tight">
                  {donor.isAnonymous ? "Anonymous Supporter" : donor.name}
                </h3>
                <div className="flex items-center justify-center space-x-1.5 text-[10px] text-slate-400 font-semibold">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{donor.date}</span>
                </div>
              </div>

              {/* Donation Amount Badge */}
              <div className="w-full pt-3 border-t border-slate-50 flex flex-col items-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Donated Sum</span>
                <span className="text-lg font-display font-extrabold text-primary-600">
                  {donor.isAnonymous ? "₹ Confidentially" : `₹${donor.amount.toLocaleString('en-IN')}`}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* 3. Consent Note */}
        <div className="max-w-xl mx-auto mt-16 p-6 rounded-2xl bg-slate-50 border border-slate-100 text-center space-y-3">
          <div className="inline-flex w-10 h-10 rounded-full bg-primary-50 items-center justify-center text-primary-600">
            <Award className="w-5 h-5" />
          </div>
          <h4 className="font-bold text-slate-900 text-sm">Donor Privacy is Our Priority</h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            We only display donor names and amounts when explicit publication consent is received during checkout. If you choose to remain anonymous, your records will be filed confidentially for tax authorities only.
          </p>
        </div>
      </section>

    </div>
  );
};

export default Donors;
