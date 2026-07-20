import React from 'react';
import { ShieldCheck, Heart, Users, CheckCircle2, Layers } from 'lucide-react';
import { trustees } from '../data/ngoData';
import useSiteContent from '../hooks/useSiteContent';

const About = () => {
  const content = useSiteContent();
  const aboutPage = content?.aboutPage || {};

  const heroTag = aboutPage.heroTag || 'Learn More About Us';
  const heroTitle = aboutPage.heroTitle || content?.aboutTitle || 'A premium experience for purpose-driven giving';
  const heroSubtitle = aboutPage.heroSubtitle || content?.aboutSubtitle || 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.';
  const heroBgImage = aboutPage.heroBgImage || 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80';

  const overviewTag = aboutPage.overviewTag || 'Establishment Overview';
  const overviewTitle = aboutPage.overviewTitle || 'A Journey Built on Trust, Inclusion, and Sustainability';
  const overviewParagraph1 = aboutPage.overviewParagraph1 || 'Jana Bikas NGO was founded by a collective of social scientists, healthcare professionals, and farmers with a single dream: to create an inclusive environment where individuals in marginalized communities have full access to opportunities.';
  const overviewParagraph2 = aboutPage.overviewParagraph2 || 'We focus on bottom-up development, ensuring that our programs are owned and maintained by the local communities themselves. We do not just distribute relief; we construct pathways to self-reliance.';
  const operationalPrinciples = aboutPage.operationalPrinciples || [
    '100% Financial Auditing',
    'Community Co-ownership',
    'Ecologically Friendly Projects',
    'Inclusion & Equal Respect'
  ];

  const regDetails = aboutPage.registrationDetails || [
    { label: "Registration No.", value: "S-56439/2014-BR" },
    { label: "Registration Date", value: "14th April 2014" },
    { label: "NITI Aayog Darpan ID", value: "BR/2016/0104592" },
    { label: "NGO PAN Number", value: "AAATJ9024E" },
    { label: "12A Registration No.", value: "IT/12A/2018-19/204" },
    { label: "80G Registration No.", value: "IT/80G/2020-21/105" }
  ];
  const taxExemptionNote = aboutPage.taxExemptionNote || 'Donations to Jana Bikas NGO are 50% tax exempt under Section 80G of the Income Tax Act.';

  const visionTitle = aboutPage.visionTitle || 'Our Vision';
  const visionDescription = aboutPage.visionDescription || 'We envision a just, equitable, and self-sufficient society where every household has clean water, healthy food, basic medical care, and quality education. We work to empower the last mile so they can lead lives of dignity, prosperity, and respect.';
  const missionTitle = aboutPage.missionTitle || 'Our Mission';
  const missionDescription = aboutPage.missionDescription || 'Our mission is to establish sustainable community programs in education, youth skill certifications, women SHGs, maternal health access, and ecological agriculture. By collaborating with donors, local administrations, and volunteers, we translate contributions into verified long-term change.';

  const customSections = aboutPage.customSections || [];

  return (
    <div className="space-y-24 pb-20">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center opacity-15 pointer-events-none transition-all duration-500" 
          style={{ backgroundImage: `url('${heroBgImage}')` }}
        />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">{heroTag}</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">{heroTitle}</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            {heroSubtitle}
          </p>
        </div>
      </section>

      {/* 2. Overview & Registration Details */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        <div className="space-y-6">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600">{overviewTag}</span>
          <h2 className="text-3xl font-display font-extrabold text-slate-950">
            {overviewTitle}
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            {overviewParagraph1}
          </p>
          {overviewParagraph2 && (
            <p className="text-slate-600 leading-relaxed text-sm">
              {overviewParagraph2}
            </p>
          )}
          
          {operationalPrinciples.length > 0 && (
            <div className="space-y-3 pt-2">
              <h4 className="font-bold text-slate-950 text-sm">Our Operational Principles:</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 font-semibold">
                {operationalPrinciples.map((principle, idx) => (
                  <div key={idx} className="flex items-center space-x-2">
                    <CheckCircle2 className="w-4 h-4 text-primary-600 flex-shrink-0" />
                    <span>{principle}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Legal Registry Table */}
        <div className="bg-white border border-slate-100 shadow-premium p-8 rounded-2xl space-y-6">
          <div>
            <h3 className="text-lg font-bold text-slate-950">Official Registrations</h3>
            <p className="text-xs text-slate-400">Verified credentials and tax exemption statuses</p>
          </div>
          <div className="divide-y divide-slate-100">
            {regDetails.map((detail, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-400 font-medium">{detail.label}</span>
                <span className="text-slate-900 font-semibold text-right">{detail.value}</span>
              </div>
            ))}
          </div>
          {taxExemptionNote && (
            <div className="p-4 rounded-xl bg-primary-50 border border-primary-100 text-xs text-primary-800 leading-relaxed">
              <strong>80G & 12A Status:</strong> {taxExemptionNote}
            </div>
          )}
        </div>
      </section>

      {/* 3. Vision & Mission Parallel Grid */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Vision */}
          <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-premium space-y-4 hover:shadow-premium-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">{visionTitle}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {visionDescription}
            </p>
          </div>
          {/* Mission */}
          <div className="bg-white p-10 rounded-2xl border border-slate-100 shadow-premium space-y-4 hover:shadow-premium-hover transition-all duration-300">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600">
              <Heart className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-display font-bold">{missionTitle}</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              {missionDescription}
            </p>
          </div>
        </div>
      </section>

      {/* 4. Custom Dynamic Sections (if any added by admin) */}
      {customSections.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          {customSections.map((sec, idx) => (
            <div 
              key={sec.id || idx}
              className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                idx % 2 === 1 ? 'lg:flex-row-reverse' : ''
              }`}
            >
              <div className={`space-y-4 ${idx % 2 === 1 ? 'lg:order-2' : ''}`}>
                {sec.subtitle && (
                  <span className="text-xs font-bold uppercase tracking-widest text-accent-600">
                    {sec.subtitle}
                  </span>
                )}
                <h2 className="text-3xl font-display font-extrabold text-slate-950">
                  {sec.title}
                </h2>
                <p className="text-slate-600 leading-relaxed text-sm md:text-base whitespace-pre-line">
                  {sec.content}
                </p>
              </div>

              {sec.imageUrl ? (
                <div className={`rounded-2xl overflow-hidden shadow-premium border border-slate-100 h-80 ${idx % 2 === 1 ? 'lg:order-1' : ''}`}>
                  <img 
                    src={sec.imageUrl} 
                    alt={sec.title} 
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              ) : (
                <div className="bg-slate-100 rounded-2xl h-64 flex items-center justify-center text-slate-400">
                  <Layers size={36} />
                </div>
              )}
            </div>
          ))}
        </section>
      )}

      {/* 5. Trustees Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Governance</span>
          <h2 className="text-3xl font-display font-extrabold text-slate-950">Our Board of Trustees</h2>
          <p className="text-slate-500 max-w-xl mx-auto text-sm">
            Meet the leaders guiding Jana Bikas toward sustainable grassroots growth.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {trustees.map((trustee) => (
            <div key={trustee.id} className="bg-white rounded-2xl border border-slate-100 shadow-premium p-6 text-center space-y-4 flex flex-col items-center">
              <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-100">
                <img src={trustee.photo} alt={trustee.name} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-1">
                <h3 className="text-lg font-bold text-slate-900 leading-none">{trustee.name}</h3>
                <span className="text-xs text-primary-600 font-semibold uppercase tracking-wider">{trustee.designation}</span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                {trustee.description}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default About;
