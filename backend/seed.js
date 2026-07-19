const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const Admin = require('./models/Admin');
const Cause = require('./models/Cause');
const SuccessStory = require('./models/SuccessStory');
const Trustee = require('./models/Trustee');
const Gallery = require('./models/Gallery');

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

    console.log('Database seeding completed!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedData();