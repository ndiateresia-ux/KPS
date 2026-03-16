// components/OptimizedImage.jsx
import { useState, useEffect } from 'react';
import { supportsWebP, getImagePath, getFallbackImagePath } from '../utils/imageUtils';

const OptimizedImage = ({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  ...props 
}) => {
  const [imgSrc, setImgSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    // Check WebP support and set appropriate source
    const webpSupported = supportsWebP();
    const baseName = src.replace(/\.(jpg|jpeg|png|gif)$/i, '');
    
    if (webpSupported) {
      setImgSrc(`/images/optimized/${baseName}.webp`);
    } else {
      setImgSrc(`/images/optimized/${baseName}.jpg`);
    }
  }, [src]);

  // Preload critical images
  useEffect(() => {
    if (priority && imgSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imgSrc;
      link.type = 'image/webp';
      document.head.appendChild(link);
    }
  }, [priority, imgSrc]);

  if (error) {
    return (
      <div 
        style={{
          width: width || '100%',
          height: height || '200px',
          backgroundColor: '#f0f0f0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '14px'
        }}
      >
        📷 Image not available
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {!isLoaded && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
        }} />
      )}
      <img
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.2s ease',
        }}
        className={className}
        {...props}
      />
    </div>
  );
};

export default OptimizedImage;