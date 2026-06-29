const cloudinary = require('cloudinary').v2;

const configureCloudinary = () => {
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  ) {
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });
    console.log('Cloudinary Configured Successfully');
    return cloudinary;
  } else {
    console.warn('Cloudinary environment variables missing. Falling back to local storage.');
    return null;
  }
};

module.exports = {
  cloudinary,
  configureCloudinary,
  isCloudinaryConfigured: () => 
    !!(process.env.CLOUDINARY_CLOUD_NAME && 
       process.env.CLOUDINARY_API_KEY && 
       process.env.CLOUDINARY_API_SECRET)
};
