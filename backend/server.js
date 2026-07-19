  const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const connectDB = require('./config/db');

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Static files for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/donations', require('./routes/donations'));
app.use('/api/causes', require('./routes/causes'));
app.use('/api/success-stories', require('./routes/stories'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/trustees', require('./routes/trustees'));
app.use('/api/volunteer', require('./routes/volunteers'));
app.use('/api/contact', require('./routes/contacts'));
app.use('/api/content', require('./routes/content'));
app.use('/api/stripe', require('./routes/stripe'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Jana Bikas API is running' });
});

// Serve admin panel
app.use('/admin', (req, res, next) => {
  if (req.method === 'GET' && !path.extname(req.path)) {
    return res.sendFile(path.join(__dirname, 'admin', 'index.html'));
  }
  next();
});
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// Serve frontend static files in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));

  // Fallback: serve index.html for all non-API GET requests (React SPA routing)
  app.use((req, res, next) => {
    if (req.method === 'GET' && !req.path.startsWith('/api')) {
      res.sendFile(path.resolve(__dirname, '../frontend/dist', 'index.html'));
    } else {
      next();
    }
  });
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});