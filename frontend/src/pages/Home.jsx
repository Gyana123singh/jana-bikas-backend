import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Navigation, Pagination } from 'swiper/modules';
import { ArrowRight, Heart, Users, ShieldCheck, Award, Handshake } from 'lucide-react';
import CauseCard from '../components/CauseCard';
import useSiteContent from '../hooks/useSiteContent';
import { useCauses } from '../context/CausesContext';
import { storiesApi, donationApi } from '../api';

// Swiper Styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const Home = () => {
  const content = useSiteContent();

  const { causes } = useCauses();

  // Select top 3 causes for home preview
  const featuredCauses = (causes || []).slice(0, 3);

  const [featuredStories, setFeaturedStories] = useState([]);
  const [donors, setDonors] = useState([]);
  const donorSwiperRef = useRef(null);

  useEffect(() => {
    storiesApi.getStories()
      .then(data => setFeaturedStories(data.slice(0, 2)))
      .catch(err => console.error(err));

    donationApi.getPublicSupporters()
      .then(data => setDonors(data))
      .catch(err => console.error(err));
  }, []);

  const heroSlides = [
    {
      title: "Educating Every Child",
      subtitle: "Unlocking opportunities through digital classrooms and school kits.",
      image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1920&q=80",
      link: "/causes/education"
    },
    {
      title: "Sustainable Farming & Ecology",
      subtitle: "Empowering smallholder farmers with natural organic techniques.",
      image: "https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1920&q=80",
      link: "/causes/agriculture"
    },
    {
      title: "Empowering Women, Lifting Communities",
      subtitle: "Supporting micro-cooperatives and self-help startup loans.",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1920&q=80",
      link: "/causes/empowerment"
    },
    {
      title: "Healthcare at Local Doorsteps",
      subtitle: "Mobile clinics, free eye operations, and community sanitation.",
      image: "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1920&q=80",
      link: "/causes/health-care"
    }
  ];

  return (
    <div className="space-y-24 pb-20">

      {/* 1. Hero Section (Image Slider) */}
      <section className="relative h-[85vh] w-full bg-slate-900 overflow-hidden">
        <Swiper
          modules={[Autoplay, EffectFade, Navigation, Pagination]}
          effect="fade"
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          navigation
          pagination={{ clickable: true }}
          loop
          className="h-full w-full"
        >
          {heroSlides.map((slide, idx) => (
            <SwiperSlide key={idx} className="relative h-full w-full">
              {/* Background Image */}
              <div
                className="absolute inset-0 bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url('${slide.image}')` }}
              >
                {/* Dark Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/60 to-transparent"></div>
              </div>

              {/* Content Box */}
              <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center md:items-start pt-20 md:pt-0 text-center md:text-left text-white z-10 space-y-4 md:space-y-6">
                <span className="inline-block px-4 py-1.5 rounded-full bg-accent-500/20 text-accent-300 font-display text-xs font-bold tracking-widest uppercase animate-fade-in">
                  NGO Active Mission
                </span>
                <h1 className="text-3xl sm:text-4xl md:text-6xl font-display font-extrabold max-w-3xl leading-tight text-white animate-fade-in-up">
                  {content.heroTitle}
                </h1>
                <p className="text-base md:text-lg text-slate-200 max-w-2xl font-light mx-auto md:mx-0">
                  {content.heroSubtitle}
                </p>
                <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-1">
                  <Link
                    to="/donate"
                    className="flex items-center space-x-2 py-3 px-6 md:py-3.5 md:px-8 rounded-full font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 hover:shadow-lg shadow-md transition-all duration-300"
                  >
                    <Heart className="w-5 h-5 fill-white" />
                    <span>{content.heroCtaText}</span>
                  </Link>
                  <Link
                    to={slide.link}
                    className="flex items-center space-x-1.5 py-3 px-6 md:py-3.5 md:px-8 rounded-full font-display font-bold text-slate-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* 2. Core Pillars / Benefits Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-premium flex flex-col items-start space-y-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center text-primary-600">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">100% Tax Benefit</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Every donation you make is eligible for 50% tax deduction under Section 80G of the Income Tax Act. We provide instantaneous certificates.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-premium flex flex-col items-start space-y-4">
            <div className="w-12 h-12 rounded-xl bg-accent-50 flex items-center justify-center text-accent-600">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Assured Transparency</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              We publish quarterly reports detailing every rupee spent. You can search your donation history and tracking logs anytime.
            </p>
          </div>
          <div className="p-8 rounded-2xl bg-white border border-slate-100 shadow-premium flex flex-col items-start space-y-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold">Verified Impact</h3>
            <p className="text-sm text-slate-500 leading-relaxed">
              Fully registered under NITI Aayog (NGO Darpan ID), PAN, 12A, and 80G with rigorous annual third-party audits.
            </p>
          </div>
        </div>
      </section>

      {/* 3. About Preview Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div className="relative">
          <div className="relative rounded-3xl overflow-hidden aspect-[4/3] bg-slate-100 shadow-xl">
            <img
              src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80"
              alt="NGO Volunteers with Children"
              className="object-cover w-full h-full"
            />
          </div>
          {/* Floating Stats Badge */}
          <div className="absolute -bottom-6 -right-6 bg-gradient-to-r from-primary-600 to-primary-700 text-white p-6 rounded-2xl shadow-xl flex items-center space-x-4 max-w-xs border border-primary-500/20">
            <div className="text-3xl font-extrabold text-white">10+</div>
            <div className="text-xs text-primary-50 font-semibold tracking-wide uppercase">
              Years of Dedicated Grassroots Service
            </div>
          </div>
        </div>
        <div className="space-y-6 text-center md:text-left flex flex-col items-center md:items-start">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Who We Are</span>
          <h2 className="text-3xl md:text-4xl font-display font-extrabold leading-tight text-slate-900">
            {content.aboutTitle}
          </h2>
          <p className="text-slate-500 leading-relaxed text-sm md:text-base">
            {content.aboutSubtitle}
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4 w-full">
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-extrabold text-slate-900">25,000+</h4>
              <p className="text-xs text-slate-400 font-semibold">Lives Positively Impacted</p>
            </div>
            <div className="text-center md:text-left">
              <h4 className="text-2xl font-extrabold text-slate-900">50+</h4>
              <p className="text-xs text-slate-400 font-semibold">Rural Villages Served</p>
            </div>
          </div>
          <div className="pt-2">
            <Link
              to="/about"
              className="inline-flex items-center space-x-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 transition-colors border-b border-primary-100 hover:border-primary-600 pb-1"
            >
              <span>Read Our Full Story</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Featured Causes Section */}
      <section className="bg-slate-50 py-20 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4">
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Active Programs</span>
              <h2 className="text-3xl font-display font-extrabold">Our Respected Causes</h2>
            </div>
            <Link
              to="/causes"
              className="flex items-center space-x-1.5 text-sm font-bold text-primary-600 hover:text-primary-700"
            >
              <span>Explore All 7 Categories</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCauses.map((cause) => (
              <CauseCard key={cause._id || cause.id} cause={cause} />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Volunteer CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-slate-950 p-8 md:p-16 text-center overflow-hidden border border-slate-900 shadow-2xl">
          {/* Subtle Background decoration */}
          <div className="absolute inset-0 bg-cover bg-center opacity-20 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80')` }}></div>
          <div className="absolute -top-24 -left-24 w-48 h-48 rounded-full bg-primary-500/10 blur-3xl pointer-events-none"></div>
          <div className="absolute -bottom-24 -right-24 w-48 h-48 rounded-full bg-accent-500/10 blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-2xl mx-auto space-y-6 text-white">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-white/10 text-slate-200 text-xs font-bold uppercase tracking-widest">
              <Handshake className="w-3.5 h-3.5" />
              <span>Join Our Community</span>
            </span>
            <h2 className="text-3xl md:text-5xl font-display font-extrabold text-white leading-tight">
              Make a Real Difference Today
            </h2>
            <p className="text-slate-300 leading-relaxed text-sm md:text-base font-light">
              Your time, skill, and passion can help us lift families out of vulnerability. Apply to become a volunteer helper in education, healthcare, or logistics.
            </p>
            <div className="pt-4">
              <Link
                to="/volunteer"
                className="inline-block py-3.5 px-8 rounded-full font-display font-bold text-slate-950 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
              >
                Become a Volunteer
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials / Success Stories Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-3">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Stories of Impact</span>
          <h2 className="text-3xl font-display font-extrabold">Lives Transformed</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {featuredStories.map((story) => (
            <div key={story._id || story.id} className="bg-white rounded-2xl border border-slate-100 shadow-premium p-8 flex flex-col md:flex-row gap-6 items-start">
              <div className="w-24 h-24 rounded-full overflow-hidden flex-shrink-0 border-2 border-primary-100">
                <img src={story.image || 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=400&q=80'} alt={story.title} className="w-full h-full object-cover" />
              </div>
              <div className="space-y-4">
                <div className="px-2 py-0.5 rounded bg-primary-50 text-primary-700 text-[10px] font-bold uppercase tracking-wider inline-block">
                  {story.category}
                </div>
                <h3 className="text-lg font-bold text-slate-950 leading-snug">
                  "{story.title}"
                </h3>
                <p className="text-sm text-slate-500 line-clamp-3">
                  {story.shortDescription}
                </p>
                <Link
                  to={`/success-stories/${story.slug}`}
                  className="inline-flex items-center space-x-1 text-xs font-bold text-primary-600 hover:text-primary-700"
                >
                  <span>Read Full Success Story</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 7. Respected Donors Feed */}
      <section className="relative py-20 text-white overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=1920&q=80')` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-900/85 to-slate-950/95"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold uppercase tracking-widest text-accent-400">Gratitude Wall</span>
              <h2 className="text-3xl md:text-4xl font-display font-extrabold text-white">Our Respected Donors</h2>
            </div>
            <Link
              to="/donors"
              className="inline-flex items-center space-x-1.5 py-2.5 px-5 rounded-full font-display font-bold text-sm text-slate-950 bg-gradient-to-r from-accent-400 to-accent-500 hover:from-accent-300 hover:to-accent-400 hover:shadow-lg transition-all transform hover:-translate-y-0.5"
            >
              <span>View All Supporters</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {donors.length > 0 ? (
            <div
              className="relative"
              style={{ maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)' }}
              onMouseEnter={() => donorSwiperRef.current?.autoplay?.stop()}
              onMouseLeave={() => donorSwiperRef.current?.autoplay?.start()}
            >
            <Swiper
              modules={[Autoplay]}
              onSwiper={(swiper) => { donorSwiperRef.current = swiper; }}
              autoplay={{ delay: 0, disableOnInteraction: false }}
              speed={8000}
              loop={true}
              spaceBetween={20}
              slidesPerView={2}
              allowTouchMove={true}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
              }}
              className="pb-4 [&_.swiper-wrapper]:!ease-linear"
            >
              {donors.map((donor) => (
                <SwiperSlide key={donor._id}>
                  <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-5 rounded-2xl flex flex-col items-center text-center space-y-3 hover:bg-white/10 transition-all duration-300 cursor-default">
                    <div className="w-14 h-14 rounded-full overflow-hidden bg-slate-700/60 flex items-center justify-center border-2 border-white/10">
                      {donor.isAnonymous ? (
                        <span className="text-sm font-bold text-slate-400">AD</span>
                      ) : (
                        <Heart className="w-5 h-5 text-primary-400 fill-primary-400/30" />
                      )}
                    </div>
                    <div className="space-y-0.5">
                      <h4 className="text-xs font-bold text-white truncate max-w-[140px]">
                        {donor.name}
                      </h4>
                      {!donor.isAnonymous && donor.amount ? (
                        <span className="block text-sm font-extrabold text-accent-400">₹{donor.amount.toLocaleString('en-IN')}</span>
                      ) : donor.isAnonymous ? (
                        <span className="block text-[10px] text-slate-400 font-semibold">₹ Confidentially</span>
                      ) : null}
                      <p className="text-[9px] text-slate-500 mt-0.5">{donor.date}</p>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
            </div>
          ) : (
            <p className="text-center text-slate-500 text-sm py-4">No donations recorded yet.</p>
          )}
        </div>
      </section>

    </div>
  );
};

export default Home;
