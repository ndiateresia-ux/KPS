// utils/imageUtils.js
// Simple utility to handle image paths and formats

// Check if browser supports WebP
export const supportsWebP = () => {
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
};

// Get optimized image path based on format
export const getImagePath = (imageName, format = 'webp') => {
  // Remove extension if present
  const baseName = imageName.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  return `/images/optimized/${baseName}.${format}`;
};

// Get fallback image path (for browsers that don't support WebP)
export const getFallbackImagePath = (imageName) => {
  const baseName = imageName.replace(/\.(jpg|jpeg|png|gif)$/i, '');
  return `/images/optimized/${baseName}.jpg`;
};

// Preload critical images
export const preloadCriticalImages = (images) => {
  images.forEach(image => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = image;
    link.type = 'image/webp';
    document.head.appendChild(link);
  });
};