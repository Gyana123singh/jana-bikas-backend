import React from 'react';

const Legal = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'privacy':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Privacy Policy</h2>
            <p className="text-xs text-slate-400">Last updated: July 19, 2026</p>
            <div className="h-0.5 w-12 bg-primary-500 rounded-full"></div>
            
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Jana Bikas NGO ("us", "we", or "our") operates the website www.janabikasngo.org. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">1. Information Collection and Use</h3>
              <p>
                We collect several different types of information for various purposes to provide and improve our service to you:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Personal Data:</strong> Name, Email address, Mobile number, Date of Birth, Billing Address, Permanent Account Number (PAN) for tax invoice auditing.</li>
                <li><strong>Usage Data:</strong> We may collect browser details, IP address, and page load durations for internal diagnostics.</li>
              </ul>
              <h3 className="font-bold text-slate-950 text-sm mt-4">2. Use of Data</h3>
              <p>
                We use the collected details to process donations, send receipts, file tax returns (Form 10BE), send updates, and verify volunteer applications. We do NOT share or sell your details to third-party marketing companies.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">3. Security of Data</h3>
              <p>
                The security of your data is important to us. All transaction channels are encrypted using 256-bit SSL connections and processed by certified PCI-DSS gateway partners.
              </p>
            </div>
          </div>
        );

      case 'refund':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Refund & Cancellation Policy</h2>
            <p className="text-xs text-slate-400">Last updated: July 19, 2026</p>
            <div className="h-0.5 w-12 bg-primary-500 rounded-full"></div>
            
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Jana Bikas NGO has formed a transparent refund policy for online donors to ensure correct handling of cancellation claims.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">1. General Rule</h3>
              <p>
                Generally, all contributions made to the NGO are voluntary and non-refundable. Once a payment is verified, funds are directly allocated to active field projects (Education, Health, Environment) and cannot be recalled.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">2. Exception Cases</h3>
              <p>
                We will examine refund requests only under specific conditions:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-xs">
                <li><strong>Double Transaction:</strong> If the donor's bank account is charged twice due to a network glitch.</li>
                <li><strong>Unauthorized Card Use:</strong> If the card was used fraudulently without the owner's consent. Under this condition, the owner must submit official police registry details.</li>
              </ul>
              <h3 className="font-bold text-slate-950 text-sm mt-4">3. Request Process</h3>
              <p>
                All refund requests must be filed via email to <strong>donations@janabikasngo.org</strong> within 7 days of the transaction date. Please attach the transaction receipt, Donation ID, and bank slip. Approved refunds will be processed back to the original source channel within 10-15 business days.
              </p>
            </div>
          </div>
        );

      case 'terms':
      default:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-slate-900">Terms & Conditions</h2>
            <p className="text-xs text-slate-400">Last updated: July 19, 2026</p>
            <div className="h-0.5 w-12 bg-primary-500 rounded-full"></div>
            
            <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
              <p>
                Welcome to Jana Bikas NGO. These terms and conditions outline the rules and regulations for the use of our Website, located at www.janabikasngo.org.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">1. Acceptance of Terms</h3>
              <p>
                By accessing this website, we assume you accept these terms and conditions in full. Do not continue to use Jana Bikas's website if you do not accept all of the terms stated on this page.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">2. Intellectual Property Rights</h3>
              <p>
                Unless otherwise stated, Jana Bikas and/or its licensors own the intellectual property rights for all material on the website. All rights are reserved. You may view and print pages for personal use only.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">3. Donation Terms</h3>
              <p>
                By clicking "Proceed to Pay" or transferring funds, you warrant that the source of funds is legal and that you are authorized to make payments. Jana Bikas is not liable for transactions flagged by banking authorities.
              </p>
              <h3 className="font-bold text-slate-950 text-sm mt-4">4. Tax Exemption Compliance</h3>
              <p>
                Tax exemption receipts are generated using the PAN details submitted by the donor. The donor takes full responsibility for the authenticity of the PAN. Jana Bikas is not responsible for rejected 80G filings due to wrong PAN entries.
              </p>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 pt-24 pb-16">
      <div className="bg-white border border-slate-100 shadow-premium p-8 md:p-12 rounded-3xl text-left">
        {renderContent()}
      </div>
    </div>
  );
};

export default Legal;
