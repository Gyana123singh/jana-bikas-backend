const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Admin = require('./models/Admin');
const Cause = require('./models/Cause');
const SuccessStory = require('./models/SuccessStory');
const Trustee = require('./models/Trustee');
const Gallery = require('./models/Gallery');
const SiteContent = require('./models/SiteContent');
const SocialPlatform = require('./models/SocialPlatform');
const SocialPost = require('./models/SocialPost');
const Donation = require('./models/Donation');

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Seed Admin
    const adminExists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!adminExists) {
      await Admin.create({
        email: process.env.ADMIN_EMAIL,
        password: process.env.ADMIN_PASSWORD,
        name: 'Super Admin',
      });
      console.log('Default admin created');
    }

    // Seed Causes
    const causeCount = await Cause.countDocuments();
    if (causeCount === 0) {
      await Cause.insertMany([
        {
          slug: 'education',
          title: 'Education for All',
          tagline: 'Unlocking the potential of children in underprivileged communities.',
          image: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Providing books, uniforms, tuition support, and standard digital classes for children in remote areas.',
          longDescription: 'Our Education program is dedicated to bridging the literacy gap in rural and slum communities. We believe that education is the ultimate tool for breaking the cycle of poverty. We set up learning centers, supply high-quality educational materials, and sponsor digital classrooms with computers and tablets.',
          goalAmount: 1500000,
          raisedAmount: 980000,
          activities: [
            'Running 15+ community tuition centers for after-school support.',
            'Distributing annual school kits containing uniforms, bags, books, and writing tools.',
            'Establishing solar-powered computer labs in 5 rural schools.'
          ],
          impact: [
            { count: '2,500+', label: 'Children Enrolled' },
            { count: '98%', label: 'School Retention Rate' },
            { count: '25+', label: 'Learning Centers Built' }
          ],
          order: 1,
        },
        {
          slug: 'skill-development',
          title: 'Vocational & Skill Development',
          tagline: 'Empowering youths with industry-ready technical skills.',
          image: 'https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Providing certified training in computer literacy, tailoring, electrical repairs, and handicraft making.',
          longDescription: 'Unemployment among youth in semi-urban areas is a critical challenge. The Skill Development initiative offers industry-oriented, certified vocational training programs.',
          goalAmount: 1200000,
          raisedAmount: 750000,
          activities: [
            'Conducting 6-month certified computer application courses.',
            'Running self-employment training centers for tailoring and fashion crafts.',
            'Offering career counselling and soft skills training to build confidence.'
          ],
          impact: [
            { count: '1,200+', label: 'Youth Trained' },
            { count: '80%', label: 'Job Placement Success' },
            { count: '400+', label: 'Micro-businesses Started' }
          ],
          order: 2,
        },
        {
          slug: 'empowerment',
          title: 'Women Empowerment',
          tagline: 'Fostering gender equality and financial independence for women.',
          image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Forming Self-Help Groups (SHGs), conducting literacy classes, and financing female-led startups.',
          longDescription: 'Our Women Empowerment program focuses on building self-reliance, leadership, and economic stability.',
          goalAmount: 1000000,
          raisedAmount: 620000,
          activities: [
            'Establishing over 80 active Self-Help Groups (SHGs).',
            'Sponsoring micro-grants for female entrepreneurs to scale agricultural retail.',
            'Organizing workshops on legal rights and domestic safety laws.'
          ],
          impact: [
            { count: '850+', label: 'Women Supported' },
            { count: '₹15,000', label: 'Avg. Monthly Income Increase' },
            { count: '12+', label: 'Cooperative Projects Launched' }
          ],
          order: 3,
        },
        {
          slug: 'health-care',
          title: 'Healthcare & Sanitation',
          tagline: 'Bringing basic clinical care and hygiene to local doorsteps.',
          image: 'https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Conducting health checkup camps, eye surgeries, distributing sanitation kits, and building toilets.',
          longDescription: 'Quality medical care is a luxury for remote villagers and slum dwellers. We operate mobile medical vans staffed with general physicians.',
          goalAmount: 1800000,
          raisedAmount: 1100000,
          activities: [
            'Running monthly multi-specialty health screening camps in remote regions.',
            'Sponsoring free cataract surgeries for senior citizens.',
            'Installing clean water filtration plants in community schools.'
          ],
          impact: [
            { count: '15,000+', label: 'Patients Treated' },
            { count: '120+', label: 'Sanitary Blocks Created' },
            { count: '3,000+', label: 'Hygiene Kits Distributed' }
          ],
          order: 4,
        },
        {
          slug: 'environment',
          title: 'Environmental Sustainability',
          tagline: 'Restoring local ecosystems and driving green climate actions.',
          image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Executing plantation drives, setup of solar street lights, and managing plastic waste programs.',
          longDescription: 'Our climate initiative focuses on creating greener neighborhoods.',
          goalAmount: 800000,
          raisedAmount: 480000,
          activities: [
            'Hosting annual tree planting campaigns during monsoon seasons.',
            'Setting up community-led plastic collections and waste sorting centers.',
            'Installing energy-efficient solar lights in public streets.'
          ],
          impact: [
            { count: '50,000+', label: 'Trees Planted' },
            { count: '15+', label: 'Villages Made Solar-lit' },
            { count: '10 Tons', label: 'Plastic Recycled' }
          ],
          order: 5,
        },
        {
          slug: 'agriculture',
          title: 'Sustainable Agriculture',
          tagline: 'Empowering smallholder farmers with ecological techniques.',
          image: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Promoting organic farming, water conservation, drip irrigation, and seed bank setups.',
          longDescription: 'Small farmers face major risks due to climate change and chemical dependence.',
          goalAmount: 900000,
          raisedAmount: 510000,
          activities: [
            'Providing training on natural vermicomposting and bio-pesticides.',
            'Helping set up rainwater harvesting systems in drought-prone areas.',
            'Assisting in marketing and certification for organic farm products.'
          ],
          impact: [
            { count: '1,500+', label: 'Farmers Trained' },
            { count: '40%+', label: 'Water Savings Achieved' },
            { count: '30+', label: 'Organic Cooperatives Active' }
          ],
          order: 6,
        },
        {
          slug: 'livelihood',
          title: 'Livelihood Support',
          tagline: 'Creating stable income channels for vulnerable households.',
          image: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80',
          shortDescription: 'Providing startup tools like sewing machines, tea stalls, and livestock to low-income families.',
          longDescription: 'Livelihood support is designed to build rapid recovery for families in extreme poverty.',
          goalAmount: 1100000,
          raisedAmount: 720000,
          activities: [
            'Donating high-quality sewing machines and carpentry tools to trained graduates.',
            'Distributing livestock (cows/goats) to landless farming households.',
            'Conducting financial literacy and saving classes for local street vendors.'
          ],
          impact: [
            { count: '900+', label: 'Families Supported' },
            { count: '100%', label: 'Asset Retention Rate' },
            { count: '₹8,000', label: 'Average Income Growth' }
          ],
          order: 7,
        },
      ]);
      console.log('Causes seeded');
    }

    // Seed Trustees
    const trusteeCount = await Trustee.countDocuments();
    if (trusteeCount === 0) {
      await Trustee.insertMany([
        {
          name: 'Dr. Ramesh Adhikari',
          designation: 'Founder & Chairman',
          photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=300&h=300&q=80',
          description: 'Dr. Adhikari holds a Ph.D. in Social Work and has spent over 25 years developing grassroot projects for rural education and community development.',
          order: 1,
        },
        {
          name: 'Mrs. Sunita Devi',
          designation: 'Managing Trustee',
          photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=300&h=300&q=80',
          description: 'Sunita has a background in public health and leads the NGO\'s healthcare, clean water, and sanitation initiatives across local villages.',
          order: 2,
        },
        {
          name: 'Mr. Alok Sharma',
          designation: 'Treasurer & Legal Advisor',
          photo: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=300&h=300&q=80',
          description: 'Alok is a certified chartered accountant who manages the financial integrity, donor audit compliance, and legal frameworks of the NGO.',
          order: 3,
        },
      ]);
      console.log('Trustees seeded');
    }

    // Seed Success Stories
    const storyCount = await SuccessStory.countDocuments();
    if (storyCount === 0) {
      await SuccessStory.insertMany([
        {
          slug: 'jyoti-education-journey',
          title: 'Jyoti\'s Journey from Slums to Software Engineering',
          category: 'Education',
          image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          shortDescription: 'Supported by our tuition scholarship program, Jyoti completed her engineering degree and secured a top IT job.',
          longDescription: 'Jyoti grew up in a makeshift slum where her father worked as a daily-wage laborer. Through our Education for All scholarship program, we covered her tuition fees, gave books, and provided laptop access. Today, she works as a software engineer at a multinational company.',
          beforeAfter: {
            before: 'A high-dropout risk kid living without stable electricity or educational tools.',
            after: 'A professional software engineer earning a stable family-supporting income.',
          },
          order: 1,
        },
        {
          slug: 'farmers-organic-revolution',
          title: 'Harish Singh: A Farmer\'s Switch to Organic Success',
          category: 'Agriculture',
          image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          shortDescription: 'Using eco-farming and vermicomposting, Harish doubled his yield and restored soil quality.',
          longDescription: 'Harish Singh faced mounting chemical debt as crop yields failed. Joining our Sustainable Agriculture workshops, he learned organic composting and crop-rotation tricks. Today, Harish\'s fields are highly productive.',
          beforeAfter: {
            before: 'Low crop yields, high input costs from chemical fertilizers, and heavy debts.',
            after: 'Chemical-free, high-yielding farm producing certified organic crops with 40% less water.',
          },
          order: 2,
        },
        {
          slug: 'women-tailoring-microbusiness',
          title: 'From Homeworkers to Independent Entrepreneurs',
          category: 'Empowerment',
          image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
          videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
          shortDescription: 'A group of five women started a tailoring cooperative after completing our vocational training.',
          longDescription: 'Kiran, Meena, and three fellow housewives joined our free 6-month vocational tailoring program. After graduating, they combined their resources and took an interest-free micro-loan. Today, their group contracts school uniforms and boutique clothes.',
          beforeAfter: {
            before: 'Financially dependent on husbands\' unstable casual wages with zero personal savings.',
            after: 'Owners of an active tailoring micro-enterprise contracting local bulk orders.',
          },
          order: 3,
        },
      ]);
      console.log('Success stories seeded');
    }

    // Seed Gallery
    const galleryCount = await Gallery.countDocuments();
    if (galleryCount === 0) {
      await Gallery.insertMany([
        { type: 'photo', category: 'Education', title: 'Distribution of School Kits', date: '2026-02-14', location: 'Rampur Primary School', url: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', order: 1 },
        { type: 'photo', category: 'Health Care', title: 'Free Health Checkup Camp', date: '2026-03-10', location: 'Village Health Center', url: 'https://images.unsplash.com/photo-1579684389782-64d84b5e902a?auto=format&fit=crop&w=800&q=80', order: 2 },
        { type: 'photo', category: 'Environment', title: 'Monsoon Plantation Drive', date: '2026-06-21', location: 'Community Forest Lands', url: 'https://images.unsplash.com/photo-1530595467537-0b5996c41f2d?auto=format&fit=crop&w=800&q=80', order: 3 },
        { type: 'photo', category: 'Agriculture', title: 'Farmer Training Workshop', date: '2026-04-18', location: 'Eco-Agricultural Center', url: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=800&q=80', order: 4 },
        { type: 'photo', category: 'Empowerment', title: 'Vocational Sewing Classes', date: '2026-01-25', location: 'Jana Bikas Skill Center', url: 'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80', order: 5 },
        { type: 'video', title: 'Our Story - Jana Bikas Documentary', thumbnail: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', date: '2026-01-01', order: 6 },
        { type: 'video', title: 'Student Success Testimonial (Jyoti)', thumbnail: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80', embedUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', date: '2026-06-30', order: 7 },
      ]);
      console.log('Gallery seeded');
    }

    // Seed SiteContent
    const siteContentExists = await SiteContent.findOne({ key: 'default' });
    if (!siteContentExists) {
      await SiteContent.create({
        key: 'default',
        content: {
          siteName: 'Jana Bikas NGO',
          heroTitle: 'Create lasting impact through every act of kindness',
          heroSubtitle: 'Modern, transparent, and compassionate support for communities that need it most.',
          heroCtaText: 'Support the mission',
          aboutTitle: 'A premium experience for purpose-driven giving',
          aboutSubtitle: 'Your donations power education, healthcare, skill development, and environmental care with measurable impact.',
          paymentHeading: 'Secure and elegant giving experience',
          paymentText: 'Every donation is protected by modern payment rails, 80G-ready documentation, and complete transparency.',
          trustBadges: ['Transparent reporting', 'Fast digital receipts', 'Trusted by donors'],
          donationPresets: [500, 1000, 2000, 5000, 10000, 15000, 20000, 30000],
          essentialsKits: [
            { id: 'edu', name: 'Education Kit', price: 500, description: 'Books and stationery for a child.' },
            { id: 'food', name: 'Food Support Pack', price: 1000, description: 'Dry grocery provisions for a family.' },
            { id: 'med', name: 'Medical Health Kit', price: 2500, description: 'Diagnostic checks and basic medicines.' }
          ]
        }
      });
      console.log('Default site content seeded');
    }

    // Seed Social Platforms
    const platformCount = await SocialPlatform.countDocuments();
    if (platformCount === 0) {
      await SocialPlatform.insertMany([
        {
          name: "YouTube",
          handle: "@janabikasngo",
          followers: "15.4K Subscribers",
          description: "Watch our ground campaign documentaries, beneficiary testimonial videos, and educational center vlogs.",
          color: "bg-red-50 hover:bg-red-100 border-red-200 text-red-600",
          btnColor: "bg-red-600 hover:bg-red-500",
          link: "https://youtube.com",
          clicks: 120,
          order: 1
        },
        {
          name: "Facebook",
          handle: "/janabikasngo",
          followers: "42.8K Followers",
          description: "Get daily field activity updates, volunteer announcement posts, donation drives notifications, and audit statements.",
          color: "bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-600",
          btnColor: "bg-blue-600 hover:bg-blue-500",
          link: "https://facebook.com",
          clicks: 250,
          order: 2
        },
        {
          name: "Instagram",
          handle: "@janabikas_ngo",
          followers: "28.1K Followers",
          description: "Browse high-definition photos of tree plantations, classroom distributions, healthcare clinic snaps, and reels.",
          color: "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-600",
          btnColor: "bg-pink-600 hover:bg-pink-500",
          link: "https://instagram.com",
          clicks: 340,
          order: 3
        },
        {
          name: "X / Twitter",
          handle: "@JanaBikasNGO",
          followers: "10.2K Followers",
          description: "Read quick updates on government policy compliance reviews, trust panel discussions, and collaborative announcements.",
          color: "bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900",
          btnColor: "bg-slate-900 hover:bg-slate-800",
          link: "https://twitter.com",
          clicks: 85,
          order: 4
        }
      ]);
      console.log('Social platforms seeded');
    }

    // Seed Social Posts
    const postCount = await SocialPost.countDocuments();
    if (postCount === 0) {
      await SocialPost.insertMany([
        {
          platform: "Instagram",
          author: "janabikas_ngo",
          time: "2 hours ago",
          text: "Our monthly healthcare camp at Rampur served over 250 patients today. Gratitude to our medical volunteers! 🩺💚 #health #ngo",
          image: "https://images.unsplash.com/photo-1579684389782-64d84b5e902a?auto=format&fit=crop&w=600&q=80",
          likes: 1240,
          comments: [
            { user: "Rajesh Kumar", text: "Great work team! Truly inspiring." },
            { user: "Dr. Ananya", text: "Proud to support this health camp." }
          ],
          shares: 12
        },
        {
          platform: "YouTube",
          author: "Jana Bikas NGO",
          time: "1 day ago",
          text: "NEW VIDEO: Sponsoring computer learning tabs in rural schools. Watch how digital tools are changing classroom lessons. Link in bio!",
          image: "https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=80",
          likes: 3890,
          comments: [
            { user: "Sunil Verma", text: "Digital education is the future of our rural children." }
          ],
          shares: 54
        },
        {
          platform: "Facebook",
          author: "Jana Bikas NGO",
          time: "3 days ago",
          text: "Thanks to Raj Kumar Singhal ji for supporting our skill training lab! The sewing machines have reached our new batch. 🧵✨",
          image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
          likes: 850,
          comments: [],
          shares: 8
        }
      ]);
      console.log('Social posts seeded');
    }

    // Seed Donations (sample completed donations for the Respected Donors page)
    const donationCount = await Donation.countDocuments();
    if (donationCount === 0) {
      await Donation.insertMany([
        {
          donationId: 'DON-10001',
          cause: 'education',
          donationType: 'one-time',
          generalAmount: 25000,
          kits: [],
          kitsAmount: 0,
          totalAmount: 25000,
          donor: {
            fullName: 'Rajesh Kumar Singhal',
            email: 'rajesh.singhal@email.com',
            mobile: '9876543210',
            pan: 'ABCPS1234R',
            dob: '1978-05-12',
            address: 'Sector 15, Noida, UP',
            displayPublicly: true
          },
          paymentMode: 'UPI',
          transactionId: 'TXN-900000001',
          stripePaymentIntentId: 'mock_seed_1',
          status: 'completed',
          createdAt: new Date('2026-07-18T10:30:00Z')
        },
        {
          donationId: 'DON-10002',
          cause: 'health-care',
          donationType: 'monthly',
          generalAmount: 10000,
          kits: [{ id: 'med', name: 'Medical Health Kit', price: 2500, qty: 2 }],
          kitsAmount: 5000,
          totalAmount: 15000,
          donor: {
            fullName: 'Dr. Ananya Sharma',
            email: 'ananya.sharma@hospital.org',
            mobile: '9012345678',
            pan: 'BNAPS5678K',
            dob: '1985-11-03',
            address: 'Civil Lines, Lucknow, UP',
            displayPublicly: true
          },
          paymentMode: 'CARD',
          transactionId: 'TXN-900000002',
          stripePaymentIntentId: 'mock_seed_2',
          status: 'completed',
          createdAt: new Date('2026-07-15T14:20:00Z')
        },
        {
          donationId: 'DON-10003',
          cause: 'environment',
          donationType: 'one-time',
          generalAmount: 50000,
          kits: [],
          kitsAmount: 0,
          totalAmount: 50000,
          donor: {
            fullName: 'Sunil Verma',
            email: 'sunil.verma@private.com',
            mobile: '8899776655',
            pan: 'CCCPV9999L',
            dob: '1970-01-22',
            address: 'MG Road, Jaipur, Rajasthan',
            displayPublicly: false
          },
          paymentMode: 'NETBANKING',
          transactionId: 'TXN-900000003',
          stripePaymentIntentId: 'mock_seed_3',
          status: 'completed',
          createdAt: new Date('2026-07-10T09:00:00Z')
        },
        {
          donationId: 'DON-10004',
          cause: 'general',
          donationType: 'one-time',
          generalAmount: 5000,
          kits: [{ id: 'edu', name: 'Education Kit', price: 500, qty: 4 }],
          kitsAmount: 2000,
          totalAmount: 7000,
          donor: {
            fullName: 'Priya Mehra',
            email: 'priya.mehra@gmail.com',
            mobile: '7788996655',
            pan: '',
            dob: '1992-08-30',
            address: 'Varanasi, UP',
            displayPublicly: true
          },
          paymentMode: 'UPI',
          transactionId: 'TXN-900000004',
          stripePaymentIntentId: 'mock_seed_4',
          status: 'completed',
          createdAt: new Date('2026-07-05T16:45:00Z')
        },
        {
          donationId: 'DON-10005',
          cause: 'empowerment',
          donationType: 'one-time',
          generalAmount: 100000,
          kits: [],
          kitsAmount: 0,
          totalAmount: 100000,
          donor: {
            fullName: 'Vikram Singh Chauhan',
            email: 'vikram@industry.co.in',
            mobile: '9988776655',
            pan: 'DDDPC1111M',
            dob: '1965-03-14',
            address: 'Bandra West, Mumbai, Maharashtra',
            displayPublicly: true
          },
          paymentMode: 'CARD',
          transactionId: 'TXN-900000005',
          stripePaymentIntentId: 'mock_seed_5',
          status: 'completed',
          createdAt: new Date('2026-06-28T11:00:00Z')
        },
        {
          donationId: 'DON-10006',
          cause: 'agriculture',
          donationType: 'monthly',
          generalAmount: 2000,
          kits: [{ id: 'food', name: 'Food Support Pack', price: 1000, qty: 3 }],
          kitsAmount: 3000,
          totalAmount: 5000,
          donor: {
            fullName: 'Kiran Devi Yadav',
            email: 'kiran.yadav@outlook.com',
            mobile: '9123456780',
            pan: '',
            dob: '1988-12-05',
            address: 'Patna, Bihar',
            displayPublicly: true
          },
          paymentMode: 'UPI',
          transactionId: 'TXN-900000006',
          stripePaymentIntentId: 'mock_seed_6',
          status: 'completed',
          createdAt: new Date('2026-06-20T08:15:00Z')
        },
        {
          donationId: 'DON-10007',
          cause: 'education',
          donationType: 'one-time',
          generalAmount: 30000,
          kits: [],
          kitsAmount: 0,
          totalAmount: 30000,
          donor: {
            fullName: 'Arun Prakash Jha',
            email: 'arun.jha@corp.in',
            mobile: '8877665544',
            pan: 'EEEPJ2222N',
            dob: '1982-07-19',
            address: 'Ranchi, Jharkhand',
            displayPublicly: true
          },
          paymentMode: 'NETBANKING',
          transactionId: 'TXN-900000007',
          stripePaymentIntentId: 'mock_seed_7',
          status: 'completed',
          createdAt: new Date('2026-06-15T13:30:00Z')
        },
        {
          donationId: 'DON-10008',
          cause: 'health-care',
          donationType: 'one-time',
          generalAmount: 20000,
          kits: [],
          kitsAmount: 0,
          totalAmount: 20000,
          donor: {
            fullName: 'Confidential Donor',
            email: 'private@email.com',
            mobile: '9000000000',
            pan: '',
            dob: '',
            address: '',
            displayPublicly: false
          },
          paymentMode: 'CARD',
          transactionId: 'TXN-900000008',
          stripePaymentIntentId: 'mock_seed_8',
          status: 'completed',
          createdAt: new Date('2026-06-10T17:00:00Z')
        }
      ]);
      console.log('Donations seeded');
    }

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();