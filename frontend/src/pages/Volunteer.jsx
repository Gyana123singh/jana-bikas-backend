import React, { useState } from 'react';
import { Heart, CheckCircle2, ShieldAlert, Loader2 } from 'lucide-react';
import { volunteerApi } from '../api';

const Volunteer = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    mobile: '',
    email: '',
    interest: 'education',
    availability: 'weekends',
    address: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.fullName.trim()) tempErrors.fullName = 'Full Name is required.';
    
    if (!formData.mobile.trim()) {
      tempErrors.mobile = 'Mobile Number is required.';
    } else if (!/^[6-9]\d{9}$/.test(formData.mobile)) {
      tempErrors.mobile = 'Enter a valid 10-digit mobile number.';
    }

    if (!formData.email.trim()) {
      tempErrors.email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Please write a short message explaining your interest.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');
    if (validate()) {
      setLoading(true);
      try {
        await volunteerApi.submitVolunteer({
          fullName: formData.fullName,
          email: formData.email,
          mobile: formData.mobile,
          skills: formData.interest, // Mapping frontend 'interest' field to model 'skills'
          availability: formData.availability,
          address: formData.address,
          reason: formData.message // Mapping 'message' to 'reason'
        });
        setSubmitted(true);
        setFormData({
          fullName: '',
          mobile: '',
          email: '',
          interest: 'education',
          availability: 'weekends',
          address: '',
          message: ''
        });
      } catch (err) {
        setSubmitError(err.response?.data?.message || err.message || 'Failed to submit application. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1559027615-cd4628902d4a?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Join our team</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Become a Volunteer</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Sponsor your time and talent. Help us deliver education materials, clinical aids, or tree plantation activities.
          </p>
        </div>
      </section>

      {/* 2. Content grid split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
        
        {/* Recruitment info text */}
        <div className="space-y-6 text-left">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-600">Why Volunteer?</span>
          <h2 className="text-3xl font-display font-extrabold text-slate-950">
            Your Time Can Shape a Child's Future
          </h2>
          <p className="text-slate-600 leading-relaxed text-sm md:text-base">
            Volunteering with Jana Bikas is not about passive support; it is about active involvement. You will work on the ground with teachers, farmers, and clinical supervisors to ensure our programs are running smoothly.
          </p>
          <div className="space-y-4 pt-2">
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong>Digital Classes Mentor:</strong> Help teach basic coding, computer applications, or English at rural centers.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong>Campaign Support:</strong> Distribute school kits, food packets, or assist medical general practitioners in clinic setups.
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <CheckCircle2 className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 leading-relaxed">
                <strong>Tree Plantation drives:</strong> Join climate awareness activities and mobilize native forest restoration.
              </div>
            </div>
          </div>
        </div>

        {/* Application Form */}
        <div className="bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl text-left">
          
          {submitted ? (
            <div className="text-center py-8 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Application Received</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Thank you for your interest! Our volunteer recruitment desk will review your details and connect with you shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="mt-4 text-xs font-bold text-primary-600 hover:text-primary-700"
              >
                Submit another application
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Volunteer Registration</h3>
                <p className="text-xs text-slate-400">Fill in the application parameters below</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Full Name *</label>
                  <input
                    type="text"
                    name="fullName"
                    placeholder="Enter name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                  {errors.fullName && <p className="text-red-500 text-xs">{errors.fullName}</p>}
                </div>

                {/* Mobile */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Mobile Number *</label>
                  <input
                    type="tel"
                    name="mobile"
                    placeholder="10-digit mobile"
                    value={formData.mobile}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                  {errors.mobile && <p className="text-red-500 text-xs">{errors.mobile}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@email.com"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>

                {/* Area of Interest */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Area of Interest</label>
                  <select
                    name="interest"
                    value={formData.interest}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  >
                    <option value="education">Education Support</option>
                    <option value="health">Clinical Camps / Sanitation</option>
                    <option value="ecology">Environment & Farming</option>
                    <option value="logistics">Logistics & Supply Chains</option>
                    <option value="admin">Office & Creative Support</option>
                  </select>
                </div>

                {/* Availability */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Availability</label>
                  <select
                    name="availability"
                    value={formData.availability}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  >
                    <option value="weekends">Weekends Only</option>
                    <option value="weekdays">Weekdays Only</option>
                    <option value="flexible">Flexible / Any day</option>
                  </select>
                </div>

                {/* Address */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block">Residential Address</label>
                  <input
                    type="text"
                    name="address"
                    placeholder="City, State, PIN"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block">Your Message / Cover Details *</label>
                  <textarea
                    name="message"
                    rows="3"
                    placeholder="Tell us briefly why you wish to volunteer..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold resize-none"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                </div>
              </div>

              {submitError && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-600 text-xs font-semibold flex items-center gap-1.5">
                  <ShieldAlert size={14} />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md transition-all text-sm mt-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Submitting Application...</span>
                  </>
                ) : (
                  <>
                    <Heart className="w-4 h-4 fill-white" />
                    <span>Submit Application</span>
                  </>
                )}
              </button>
            </form>
          )}

        </div>

      </section>

    </div>
  );
};

export default Volunteer;
