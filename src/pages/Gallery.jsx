import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useEffect, useCallback, lazy, Suspense, memo } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Fallback image
const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";

// Memoized gallery image component with accessibility
const GalleryImage = memo(({ image, onClick }) => {
  const [imgSrc, setImgSrc] = useState(image.src);
  const [loaded, setLoaded] = useState(false);
  const imageId = `gallery-img-${image.id}`;

  return (
    <div
      className="gallery-item cursor-pointer"
      onClick={() => onClick(image)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(image);
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View larger image of ${image.alt}`}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio: '4/3',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0'
      }}
    >
      {!loaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
          aria-hidden="true"
        />
      )}
      <img
        id={imageId}
        src={imgSrc}
        alt={image.alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.target.onerror = null;
          setImgSrc(FALLBACK_IMAGE);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
      />
    </div>
  );
});

GalleryImage.displayName = 'GalleryImage';

// Memoized filter button component with accessibility
const FilterButton = memo(({ category, isActive, onClick }) => (
  <button
    onClick={() => onClick(category.id)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(category.id);
      }
    }}
    aria-pressed={isActive}
    aria-label={`${category.name} photos${isActive ? ', currently selected' : ''}`}
    style={{
      padding: '0.5rem 1rem',
      borderRadius: '40px',
      border: 'none',
      backgroundColor: isActive ? '#132f66' : 'transparent',
      color: isActive ? 'white' : '#4a5568',
      fontWeight: '500',
      fontSize: '0.9rem',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '0.5rem',
      whiteSpace: 'nowrap',
      minHeight: '44px',
      minWidth: '44px'
    }}
  >
    <span style={{ fontSize: '1.1rem' }} aria-hidden="true">{category.icon}</span>
    <span>{category.name}</span>
    {isActive && <span className="visually-hidden"> (selected)</span>}
  </button>
));

FilterButton.displayName = 'FilterButton';

// Memoized lightbox modal with accessibility
const LightboxModal = memo(({ selectedImage, onClose, onPrev, onNext }) => {
  if (!selectedImage) return null;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      onPrev();
    } else if (e.key === 'ArrowRight') {
      onNext();
    }
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
    >
      <button
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        style={{
          position: 'absolute',
          top: '20px',
          right: '20px',
          background: 'white',
          border: 'none',
          borderRadius: '50%',
          width: '44px',
          height: '44px',
          fontSize: '1.2rem',
          cursor: 'pointer',
          zIndex: 100001,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label="Close lightbox"
      >
        ✕
        <span className="visually-hidden">Close</span>
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onPrev();
          }
        }}
        style={{
          position: 'absolute',
          left: '20px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          minWidth: '44px',
          minHeight: '44px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        aria-label="Previous image"
      >
        ‹
        <span className="visually-hidden">Previous</span>
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onNext();
          }
        }}
        style={{
          position: 'absolute',
          right: '20px',
          background: 'rgba(255,255,255,0.2)',
          border: 'none',
          borderRadius: '50%',
          width: '50px',
          height: '50px',
          fontSize: '1.5rem',
          cursor: 'pointer',
          color: 'white',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 0.3s ease',
          minWidth: '44px',
          minHeight: '44px'
        }}
        onMouseEnter={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.3)'}
        onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(255,255,255,0.2)'}
        aria-label="Next image"
      >
        ›
        <span className="visually-hidden">Next</span>
      </button>

      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={selectedImage.src}
          alt={selectedImage.alt}
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
        <p style={{ 
          color: 'white', 
          textAlign: 'center', 
          marginTop: '1rem',
          fontSize: '0.9rem'
        }}>
          {selectedImage.alt}
        </p>
      </div>
    </div>
  );
});

LightboxModal.displayName = 'LightboxModal';

function Gallery() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");
  const [visibleImages, setVisibleImages] = useState(8);
  const [loading, setLoading] = useState(false);

  // Gallery data organized by categories
  const galleryData = {
    all: [
      { id: 1, src: "/images/gallery/academics1.jpg", alt: "Classroom learning", category: "academics" },
      { id: 2, src: "/images/gallery/academics2.jpg", alt: "Science experiment", category: "academics" },
      { id: 3, src: "/images/gallery/academics3.jpg", alt: "Library reading", category: "academics" },
      { id: 4, src: "/images/gallery/academics4.jpg", alt: "Computer class", category: "academics" },
      { id: 5, src: "/images/gallery/sports1.jpg", alt: "Football match", category: "sports" },
      { id: 6, src: "/images/gallery/sports2.jpg", alt: "Athletics", category: "sports" },
      { id: 7, src: "/images/gallery/sports3.jpg", alt: "Netball", category: "sports" },
      { id: 8, src: "/images/gallery/sports4.jpg", alt: "Swimming gala", category: "sports" },
      { id: 9, src: "/images/gallery/cultural1.jpg", alt: "Traditional dance", category: "cultural" },
      { id: 10, src: "/images/gallery/cultural2.jpg", alt: "Music festival", category: "cultural" },
      { id: 11, src: "/images/gallery/cultural3.jpg", alt: "Drama performance", category: "cultural" },
      { id: 12, src: "/images/gallery/cultural4.jpg", alt: "Art exhibition", category: "cultural" },
      { id: 13, src: "/images/gallery/events1.jpg", alt: "Graduation", category: "events" },
      { id: 14, src: "/images/gallery/events2.jpg", alt: "Prize giving day", category: "events" },
      { id: 15, src: "/images/gallery/events3.jpg", alt: "Parents day", category: "events" },
      { id: 16, src: "/images/gallery/events4.jpg", alt: "Open day", category: "events" },
      { id: 17, src: "/images/gallery/facilities1.jpg", alt: "School library", category: "facilities" },
      { id: 18, src: "/images/gallery/facilities2.jpg", alt: "Science lab", category: "facilities" },
      { id: 19, src: "/images/gallery/facilities3.jpg", alt: "Playground", category: "facilities" },
      { id: 20, src: "/images/gallery/facilities4.jpg", alt: "Computer lab", category: "facilities" },
      { id: 21, src: "/images/gallery/facilities5.jpg", alt: "School van", category: "facilities" },
    ],
    academics: [
      { id: 1, src: "/images/gallery/academics1.jpg", alt: "Classroom learning" },
      { id: 2, src: "/images/gallery/academics2.jpg", alt: "Science experiment" },
      { id: 3, src: "/images/gallery/academics3.jpg", alt: "Library reading" },
      { id: 4, src: "/images/gallery/academics4.jpg", alt: "Computer class" },
    ],
    sports: [
      { id: 5, src: "/images/gallery/sports1.jpg", alt: "Football match" },
      { id: 6, src: "/images/gallery/sports2.jpg", alt: "Athletics" },
      { id: 7, src: "/images/gallery/sports3.jpg", alt: "Netball" },
      { id: 8, src: "/images/gallery/sports4.jpg", alt: "Swimming gala" },
    ],
    cultural: [
      { id: 9, src: "/images/gallery/cultural1.jpg", alt: "Traditional dance" },
      { id: 10, src: "/images/gallery/cultural2.jpg", alt: "Music festival" },
      { id: 11, src: "/images/gallery/cultural3.jpg", alt: "Drama performance" },
      { id: 12, src: "/images/gallery/cultural4.jpg", alt: "Art exhibition" },
    ],
    events: [
      { id: 13, src: "/images/gallery/events1.jpg", alt: "Graduation" },
      { id: 14, src: "/images/gallery/events2.jpg", alt: "Prize giving day" },
      { id: 15, src: "/images/gallery/events3.jpg", alt: "Parents day" },
      { id: 16, src: "/images/gallery/events4.jpg", alt: "Open day" },
    ],
    facilities: [
      { id: 17, src: "/images/gallery/facilities1.jpg", alt: "School library" },
      { id: 18, src: "/images/gallery/facilities2.jpg", alt: "Science lab" },
      { id: 19, src: "/images/gallery/facilities3.jpg", alt: "Playground" },
      { id: 20, src: "/images/gallery/facilities4.jpg", alt: "Computer lab" },
      { id: 21, src: "/images/gallery/facilities5.jpg", alt: "School van" },
    ]
  };

  const categories = [
    { id: "all", name: "All", icon: "🖼️" },
    { id: "academics", name: "Academics", icon: "📚" },
    { id: "sports", name: "Sports", icon: "⚽" },
    { id: "cultural", name: "Cultural", icon: "🎭" },
    { id: "events", name: "Events", icon: "🎉" },
    { id: "facilities", name: "Facilities", icon: "🏫" }
  ];

  // Reset visible images when category changes
  useEffect(() => {
    setVisibleImages(8);
    // Announce category change to screen readers
    const announcer = document.getElementById('gallery-announcer');
    if (announcer) {
      const categoryName = categories.find(c => c.id === activeCategory)?.name || activeCategory;
      announcer.textContent = `Showing ${categoryName} photos`;
    }
  }, [activeCategory, categories]);

  const openLightbox = useCallback((image) => {
    setSelectedImage(image);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handlePrevImage = useCallback(() => {
    const currentImages = galleryData[activeCategory] || galleryData.all;
    const currentIndex = currentImages.findIndex(img => img.id === selectedImage.id);
    const prevIndex = currentIndex > 0 ? currentIndex - 1 : currentImages.length - 1;
    setSelectedImage(currentImages[prevIndex]);
  }, [selectedImage, activeCategory, galleryData]);

  const handleNextImage = useCallback(() => {
    const currentImages = galleryData[activeCategory] || galleryData.all;
    const currentIndex = currentImages.findIndex(img => img.id === selectedImage.id);
    const nextIndex = currentIndex < currentImages.length - 1 ? currentIndex + 1 : 0;
    setSelectedImage(currentImages[nextIndex]);
  }, [selectedImage, activeCategory, galleryData]);

  const handleLoadMore = useCallback(() => {
    setLoading(true);
    setTimeout(() => {
      setVisibleImages(prev => prev + 8);
      setLoading(false);
    }, 500);
  }, []);

  const handleCategoryChange = useCallback((categoryId) => {
    setActiveCategory(categoryId);
  }, []);

  // Get current category images and limit visible ones
  const currentImages = galleryData[activeCategory] || galleryData.all;
  const displayedImages = currentImages.slice(0, visibleImages);
  const hasMoreImages = visibleImages < currentImages.length;

  return (
    <>
      <Helmet>
        <title>Gallery | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Explore our school gallery featuring academic activities, sports events, cultural celebrations, and modern facilities at Kitale Progressive School." 
        />
      </Helmet>

      {/* Page Title with proper heading hierarchy */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
          color: 'white',
          paddingTop: '120px',
          paddingBottom: '40px',
          textAlign: 'center'
        }}
        aria-labelledby="page-title"
      >
        <Container>
          <h1 id="page-title" style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Our Gallery
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.1rem)',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            Capturing moments of learning, growth, and achievement
          </p>
        </Container>
      </section>

      {/* Gallery Section */}
      <section className="py-5" aria-labelledby="gallery-heading">
        <Container>
          <h2 id="gallery-heading" className="visually-hidden">Photo Gallery</h2>
          
          {/* Screen reader announcer for category changes */}
          <div id="gallery-announcer" className="visually-hidden" role="status" aria-live="polite"></div>

          {/* Category Filter */}
          <div 
            className="d-flex justify-content-center gap-2 mb-5" 
            style={{ flexWrap: 'wrap' }}
            role="tablist"
            aria-label="Photo categories"
          >
            {categories.map(category => (
              <div key={category.id} role="tab" style={{ display: 'inline-block' }}>
                <FilterButton
                  category={category}
                  isActive={activeCategory === category.id}
                  onClick={handleCategoryChange}
                />
              </div>
            ))}
          </div>

          {/* Photo Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
            role="list"
            aria-label="Gallery images"
          >
            {displayedImages.map((image, index) => (
              <div key={image.id} role="listitem">
                <GalleryImage
                  image={image}
                  onClick={openLightbox}
                />
              </div>
            ))}
          </div>

          {/* Load More Button */}
          {hasMoreImages && (
            <div className="text-center mt-5">
              <button
                onClick={handleLoadMore}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleLoadMore();
                  }
                }}
                disabled={loading}
                style={{
                  backgroundColor: '#132f66',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 2rem',
                  borderRadius: '40px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  opacity: loading ? 0.8 : 1,
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onMouseEnter={(e) => {
                  if (!loading) {
                    e.target.style.backgroundColor = '#0a1f4d';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(19,47,102,0.3)';
                  }
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#132f66';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
                aria-label="Load more photos"
              >
                {loading ? (
                  <>
                    <i className="fas fa-spinner fa-spin me-2" aria-hidden="true"></i>
                    <span>Loading...</span>
                    <span className="visually-hidden">Loading more photos</span>
                  </>
                ) : (
                  <>
                    <i className="fas fa-sync-alt me-2" aria-hidden="true"></i>
                    Load More Photos
                  </>
                )}
              </button>
            </div>
          )}
        </Container>
      </section>

      {/* Featured Video Section */}
      <section className="py-5 bg-light-custom" aria-labelledby="video-heading">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <h2 id="video-heading" style={{
                fontSize: 'clamp(1.5rem, 4vw, 2rem)',
                fontWeight: 'bold',
                color: '#132f66',
                marginBottom: '1rem'
              }}>School Life at a Glance</h2>
              <p style={{ color: '#4a5568', marginBottom: '2rem' }}>
                Watch our school video to see the vibrant life at Kitale Progressive School. 
                From classroom activities to sports events and cultural celebrations.
              </p>
              <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }} role="list" aria-label="School statistics">
                <div role="listitem">
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#cebd04' }} aria-hidden="true">20+</span>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#718096' }}>Years of Excellence</span>
                  <span className="visually-hidden">20+ Years of Excellence</span>
                </div>
                <div role="listitem">
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#cebd04' }} aria-hidden="true">500+</span>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#718096' }}>Happy Students</span>
                  <span className="visually-hidden">500+ Happy Students</span>
                </div>
                <div role="listitem">
                  <span style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#cebd04' }} aria-hidden="true">50+</span>
                  <span style={{ display: 'block', fontSize: '0.9rem', color: '#718096' }}>Expert Teachers</span>
                  <span className="visually-hidden">50+ Expert Teachers</span>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
              }}>
                <iframe 
                    src="https://www.youtube-nocookie.com/embed/Vomydkvag_w"
                    title="YouTube video"
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      border: 0
                    }}
                  />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Lightbox Modal with accessibility */}
      <LightboxModal
        selectedImage={selectedImage}
        onClose={closeLightbox}
        onPrev={handlePrevImage}
        onNext={handleNextImage}
      />

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS inline with accessibility improvements */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .visually-hidden {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          border: 0;
        }
        .cursor-pointer { cursor: pointer; }
        .gallery-item {
          transition: transform 0.3s ease;
        }
        .gallery-item:hover,
        .gallery-item:focus-visible {
          transform: scale(1.03);
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        .gallery-item:hover img,
        .gallery-item:focus-visible img {
          transform: scale(1.1);
        }
        button:focus-visible,
        [role="button"]:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        @media (max-width: 768px) {
          .gallery-filter {
            flex-wrap: wrap !important;
            gap: 0.5rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .gallery-item,
          .gallery-item img,
          button {
            transition: none !important;
            animation: none !important;
          }
          .gallery-item:hover {
            transform: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(Gallery);