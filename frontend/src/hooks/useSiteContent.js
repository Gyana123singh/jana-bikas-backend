import { useEffect, useState } from 'react';
import { contentApi } from '../api';

const defaultContent = {
  siteName: 'Jana Bikas NGO',
  heroTitle: 'Create lasting impact through every act of kindness',
  heroSubtitle: 'Modern, transparent, and compassionate support for communities that need it most.',
  heroCtaText: 'Support the mission',
  aboutTitle: 'A premium experience for purpose-driven giving',
  aboutSubtitle: 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.',
  paymentHeading: 'Secure and elegant giving experience',
  paymentText: 'Every donation is protected by modern payment rails, 80G-ready documentation, and complete transparency.',
  footerText: 'Dedicated to bringing sustainable transformation to underprivileged communities through education, skill development, climate action, and community healthcare.',
  paymentConfig: {
    isEnabled: false,
    publishableKey: '',
    currency: 'inr',
    mode: 'test',
  },
  trustBadges: ['Transparent reporting', 'Fast digital receipts', 'Trusted by donors'],
};

const useSiteContent = () => {
  const [content, setContent] = useState(defaultContent);

  useEffect(() => {
    contentApi.getContent()
      .then((data) => {
        if (data && typeof data === 'object') {
          setContent({ ...defaultContent, ...data });
        }
      })
      .catch(() => {});
  }, []);

  return content;
};

export default useSiteContent;
