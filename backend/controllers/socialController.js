const SocialPlatform = require('../models/SocialPlatform');
const SocialPost = require('../models/SocialPost');

// --- PUBLIC ACTIONS ---

// Get active platforms
const getPlatforms = async (req, res) => {
  try {
    let platforms = await SocialPlatform.find().sort({ order: 1 });
    if (platforms.length === 0) {
      platforms = await SocialPlatform.insertMany([
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
          color: "bg-pink-50 hover:bg-pink-100 border-pink-200 text-pink-650",
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
    }
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Track platform redirect clicks
const trackPlatformClick = async (req, res) => {
  try {
    const platform = await SocialPlatform.findById(req.params.id);
    if (!platform) {
      return res.status(404).json({ message: 'Platform not found' });
    }
    platform.clicks = (platform.clicks || 0) + 1;
    await platform.save();
    res.json({ success: true, clicks: platform.clicks });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get active posts
const getPosts = async (req, res) => {
  try {
    let posts = await SocialPost.find({ isActive: true }).sort({ createdAt: -1 });
    if (posts.length === 0) {
      posts = await SocialPost.insertMany([
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
    }
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Like a post
const likePost = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
    
    // Check if IP already liked (optional prevention of duplicates)
    const alreadyLiked = post.likedByIPs && post.likedByIPs.includes(ip);
    if (alreadyLiked) {
      // Unlike
      post.likes = Math.max(0, (post.likes || 0) - 1);
      post.likedByIPs = post.likedByIPs.filter(item => item !== ip);
    } else {
      // Like
      post.likes = (post.likes || 0) + 1;
      if (!post.likedByIPs) post.likedByIPs = [];
      post.likedByIPs.push(ip);
    }
    
    await post.save();
    res.json({ likes: post.likes, liked: !alreadyLiked });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a comment to a post
const commentPost = async (req, res) => {
  try {
    const { user, text } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: 'Comment text is required.' });
    }
    
    const post = await SocialPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const newComment = {
      user: (user && user.trim()) ? user : 'Anonymous Donor',
      text: text,
      date: new Date()
    };
    
    post.comments.push(newComment);
    await post.save();
    res.status(201).json(post.comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Share a post
const sharePost = async (req, res) => {
  try {
    const post = await SocialPost.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    post.shares = (post.shares || 0) + 1;
    await post.save();
    res.json({ shares: post.shares });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// --- ADMIN ACTIONS ---

// Get aggregated analytics for dashboard
const getSocialAnalytics = async (req, res) => {
  try {
    const posts = await SocialPost.find();
    const platforms = await SocialPlatform.find();

    const totalLikes = posts.reduce((sum, p) => sum + (p.likes || 0), 0);
    const totalShares = posts.reduce((sum, p) => sum + (p.shares || 0), 0);
    const totalComments = posts.reduce((sum, p) => sum + (p.comments ? p.comments.length : 0), 0);
    const totalClicks = platforms.reduce((sum, p) => sum + (p.clicks || 0), 0);

    const platformBreakdown = platforms.map(p => ({
      id: p._id,
      name: p.name,
      handle: p.handle,
      clicks: p.clicks || 0,
      followers: p.followers || '0'
    }));

    res.json({
      metrics: {
        totalLikes,
        totalShares,
        totalComments,
        totalClicks,
        totalPosts: posts.length,
        totalPlatforms: platforms.length
      },
      platforms: platformBreakdown
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Platforms CRUD
const getAllPlatformsAdmin = async (req, res) => {
  try {
    const platforms = await SocialPlatform.find().sort({ order: 1 });
    res.json(platforms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPlatform = async (req, res) => {
  try {
    const platform = await SocialPlatform.create(req.body);
    res.status(201).json(platform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePlatform = async (req, res) => {
  try {
    const platform = await SocialPlatform.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!platform) return res.status(404).json({ message: 'Platform not found' });
    res.json(platform);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePlatform = async (req, res) => {
  try {
    const platform = await SocialPlatform.findByIdAndDelete(req.params.id);
    if (!platform) return res.status(404).json({ message: 'Platform not found' });
    res.json({ message: 'Platform deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Posts CRUD
const getAllPostsAdmin = async (req, res) => {
  try {
    const posts = await SocialPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createPost = async (req, res) => {
  try {
    const post = await SocialPost.create(req.body);
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePost = async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePost = async (req, res) => {
  try {
    const post = await SocialPost.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getPlatforms,
  trackPlatformClick,
  getPosts,
  likePost,
  commentPost,
  sharePost,
  getSocialAnalytics,
  getAllPlatformsAdmin,
  createPlatform,
  updatePlatform,
  deletePlatform,
  getAllPostsAdmin,
  createPost,
  updatePost,
  deletePost
};
