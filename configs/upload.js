const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const postStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'isocial/posts',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif'],
  },
});

const postUpload = multer({
  storage: postStorage,
  limits: { fileSize: 5 * 1024 * 1024 },
}).single('post_img');

const avatarStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'isocial/avatars',
      allowed_formats: ['jpg', 'jpeg', 'png', 'gif']
    },
  });
  
  const avatarUpload = multer({
    storage: avatarStorage,
    limits: { fileSize: 5 * 1024 * 1024 },
  }).single('avatar');
  
  module.exports = {
    postUpload,
    avatarUpload
  };
  
