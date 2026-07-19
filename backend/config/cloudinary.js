const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configure Cloudinary
const isConfigured = 
  process.env.CLOUDINARY_CLOUD_NAME && 
  process.env.CLOUDINARY_CLOUD_NAME !== 'your_cloudinary_cloud_name' &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET;

if (isConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
  console.log('Cloudinary SDK configured successfully.');
} else {
  console.log('Cloudinary keys not set. Uploads will fall back to local disk storage.');
}

const uploadToCloudinary = (file, hostUrl) => {
  return new Promise((resolve, reject) => {
    if (isConfigured) {
      // Upload via stream using buffer
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'jana_bikas_gallery' },
        (error, result) => {
          if (error) {
            return reject(error);
          }
          resolve({ url: result.secure_url });
        }
      );
      uploadStream.end(file.buffer);
    } else {
      // Fallback: Save file locally in backend/uploads directory
      try {
        const uploadsDir = path.join(__dirname, '..', 'uploads');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const ext = path.extname(file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        const filePath = path.join(uploadsDir, fileName);

        fs.writeFileSync(filePath, file.buffer);

        // Build local URL
        const fileUrl = `${hostUrl}/uploads/${fileName}`;
        resolve({ url: fileUrl });
      } catch (err) {
        reject(err);
      }
    }
  });
};

module.exports = { cloudinary, uploadToCloudinary, isConfigured };
