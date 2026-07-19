import React, { useState } from 'react';
import { Phone, Mail, MapPin, Send, MessageSquare, CheckCircle2 } from 'lucide-react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required.';
    
    if (!formData.email.trim()) {
      tempErrors.email = 'Email Address is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.message.trim()) {
      tempErrors.message = 'Please enter your message.';
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* 1. Header Banner */}
      <section className="relative bg-slate-900 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80')` }}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-xs uppercase font-extrabold tracking-widest text-accent-400">Get In Touch</span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold text-white">Contact With Us</h1>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm md:text-base font-light">
            Have questions regarding donations, audits, volunteering, or corporate partnerships? Let us know.
          </p>
        </div>
      </section>

      {/* 2. Direct Channels & Form Split */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        
        {/* Info Blocks (1 Column) */}
        <div className="space-y-6 text-left">
          <h3 className="text-lg font-bold text-slate-900">Direct Handles</h3>
          <p className="text-xs text-slate-400 leading-normal">Reach out to our offices via phone, email, or chat.</p>

          <div className="grid grid-cols-1 gap-4 text-sm text-slate-650">
            {/* Phone */}
            <div className="flex items-start space-x-3 p-4 rounded-xl border border-slate-100 bg-white">
              <Phone className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-900 text-xs">Call Our Offices</span>
                <span className="text-xs text-slate-500 font-semibold font-mono block mt-1">+91 98765 43210</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-start space-x-3 p-4 rounded-xl border border-slate-100 bg-white">
              <Mail className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-900 text-xs">Email Addresses</span>
                <span className="text-xs text-slate-500 font-semibold block mt-1">contact@janabikasngo.org</span>
                <span className="text-[10px] text-slate-400 block">donations@janabikasngo.org</span>
              </div>
            </div>

            {/* Visit */}
            <div className="flex items-start space-x-3 p-4 rounded-xl border border-slate-100 bg-white">
              <MapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-slate-900 text-xs">Visit Headquarters</span>
                <span className="text-[11px] text-slate-500 font-medium block mt-1 leading-normal">
                  4th Floor, Vikas Bhavan, Boring Road, Patna, Bihar, Pin - 800001
                </span>
              </div>
            </div>

            {/* WhatsApp */}
            <a 
              href="https://wa.me/919876543210" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-start space-x-3 p-4 rounded-xl border border-primary-100 bg-primary-50/50 hover:bg-primary-50 transition-colors"
            >
              <MessageSquare className="w-5 h-5 text-primary-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="block font-bold text-primary-900 text-xs">WhatsApp Quick Chat</span>
                <span className="text-[11px] text-primary-800 font-semibold block mt-0.5">Click to chat with our team &rarr;</span>
              </div>
            </a>
          </div>
        </div>

        {/* Inquiry Form (2 Columns) */}
        <div className="lg:col-span-2 bg-white border border-slate-100 shadow-premium p-6 md:p-8 rounded-2xl text-left">
          
          {submitted ? (
            <div className="text-center py-12 space-y-4 animate-fade-in">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900">Message Sent Successfully</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Thank you for getting in touch. A representative from Jana Bikas will reply to your registered email address shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Send an Inquiry</h3>
                <p className="text-xs text-slate-400">Fill in the fields below and we will contact you</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Name */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Your Name *</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>

                {/* Email */}
                <div className="space-y-1">
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

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Phone Number</label>
                  <input
                    type="tel"
                    name="phone"
                    placeholder="10-digit number"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600 block">Subject</label>
                  <input
                    type="text"
                    name="subject"
                    placeholder="e.g. Audit Reports"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold"
                  />
                </div>

                {/* Message */}
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs font-semibold text-slate-600 block">Your Message *</label>
                  <textarea
                    name="message"
                    rows="4"
                    placeholder="Type details of your message..."
                    value={formData.message}
                    onChange={handleInputChange}
                    className="w-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded-lg py-2 px-3 text-sm font-semibold resize-none"
                  ></textarea>
                  {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center justify-center space-x-2 w-full py-3 rounded-xl font-display font-bold text-white bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-500 hover:to-primary-600 shadow-md transition-all text-sm mt-2"
              >
                <Send className="w-4 h-4" />
                <span>Send Message</span>
              </button>
            </form>
          )}

        </div>

      </section>

      {/* 3. Simulated Maps Panel */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-slate-100 rounded-3xl border border-slate-200 overflow-hidden aspect-[21/9] w-full relative flex items-center justify-center">
          {/* Mock Map graphics */}
          <div className="absolute inset-0 bg-cover bg-center opacity-60 pointer-events-none" style={{ backgroundImage: `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')` }}></div>
          <div className="absolute inset-0 bg-slate-900/10"></div>
          
          <div className="relative bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-slate-100 max-w-sm text-left space-y-3 z-10 mx-4">
            <h4 className="font-display font-bold text-slate-900 text-sm">Headquarters Location</h4>
            <p className="text-xs text-slate-500 leading-normal">
              Vikas Bhavan, boring Road, Kidwaipuri, Patna, Bihar, 800001
            </p>
            <a 
              href="https://maps.google.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-block text-xs font-bold text-primary-600 hover:text-primary-700"
            >
              Open in Google Maps &rarr;
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;
