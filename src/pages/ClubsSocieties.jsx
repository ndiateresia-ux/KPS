// pages/ClubsSocieties.jsx - Fully Optimized with Reduced Spacing
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useState, lazy, Suspense, memo, useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "react-router-dom";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Optimized image component with theme classes
const OptimizedImage = memo(({ src, alt, width, height, priority = false, category = 'sports' }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  // Handle different image paths
  const getImagePath = () => {
    if (src.startsWith('sports') || src.startsWith('clubs') || src.startsWith('events') || src.startsWith('boarding')) {
      return `/images/optimized/gallery/${src}.jpg`;
    }
    return `/images/optimized/${src}.jpg`;
  };

  const getWebpPath = () => {
    if (src.startsWith('sports') || src.startsWith('clubs') || src.startsWith('events') || src.startsWith('boarding')) {
      return `/images/optimized/gallery/${src}.webp`;
    }
    return `/images/optimized/${src}.webp`;
  };

  const basePath = getImagePath();
  const webpPath = getWebpPath();

  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = webpPath;
      link.type = 'image/webp';
      document.head.appendChild(link);
      
      return () => {
        if (link.parentNode) document.head.removeChild(link);
      };
    }
  }, [priority, webpPath]);

  if (error) {
    return (
      <div 
        className="bg-light-custom d-flex align-items-center justify-content-center"
        style={{
          width: '100%',
          height: '100%',
          minHeight: height || '200px',
          aspectRatio: width && height ? `${width}/${height}` : '16/9',
          borderRadius: '16px'
        }}
        role="img"
        aria-label={`${alt} (image failed to load)`}
      >
        <span aria-hidden="true" className="fs-1 opacity-50">📷</span>
        <span className="visually-hidden">Image not available</span>
      </div>
    );
  }

  return (
    <div className="curriculum-image-wrapper" style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      aspectRatio: width && height ? `${width}/${height}` : '16/9',
      backgroundColor: 'var(--gray-light)',
      borderRadius: '16px',
      overflow: 'hidden'
    }}>
      {!loaded && (
        <div 
          className="image-skeleton"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}
          aria-hidden="true"
        />
      )}
      
      <picture>
        <source 
          srcSet={webpPath}
          type="image/webp"
        />
        <img
          ref={imgRef}
          src={basePath}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`curriculum-image ${loaded ? 'loaded' : ''}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 2
          }}
        />
      </picture>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Pillar Card Component with theme
const PillarCard = memo(({ icon, title, description }) => (
  <Col md={4}>
    <div className="pillar-card card-custom text-center p-3" style={{
      background: 'var(--white)',
      borderRadius: '16px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      height: '100%'
    }}>
      <div className="bg-navy text-white" style={{
        width: '60px',
        height: '60px',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 1rem',
        fontSize: '1.8rem'
      }} aria-hidden="true">
        {icon}
      </div>
      <h3 className="card-title-navy h5 fw-bold mb-1">{title}</h3>
      <p className="text-dark mb-0 small" style={{ fontSize: '0.85rem', lineHeight: 1.4 }}>{description}</p>
    </div>
  </Col>
));

PillarCard.displayName = 'PillarCard';

// Activity Card Component for Sports/Clubs Grid with theme
const ActivityCard = memo(({ icon, name }) => (
  <div className="activity-card text-center p-2" style={{
    background: 'var(--gray-light)',
    borderRadius: '10px',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  }}>
    <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }} aria-hidden="true">{icon}</div>
    <span className="small fw-medium text-navy">{name}</span>
  </div>
));

ActivityCard.displayName = 'ActivityCard';

// Benefit Card Component with theme
const BenefitCard = memo(({ icon, title, description }) => (
  <Col md={3} sm={6}>
    <div className="benefit-card card-custom text-center p-2" style={{
      background: 'var(--white)',
      borderRadius: '14px',
      height: '100%'
    }}>
      <div className="bg-navy" style={{
        width: '45px',
        height: '45px',
        borderRadius: '10px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 auto 0.75rem',
        fontSize: '1.3rem',
        color: 'var(--gold)'
      }} aria-hidden="true">
        {icon}
      </div>
      <h3 className="card-title-navy h6 fw-bold mb-0">{title}</h3>
      <p className="small text-dark mb-0">{description}</p>
    </div>
  </Col>
));

BenefitCard.displayName = 'BenefitCard';

// Gallery Image Component for the "Experience Student Life" section
const GalleryImage = memo(({ image, onClick, priority = false }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div
        className="gallery-item"
        onClick={() => onClick(image)}
        role="button"
        tabIndex={0}
        style={{
          position: 'relative',
          borderRadius: '12px',
          overflow: 'hidden',
          aspectRatio: '4/3',
          cursor: 'pointer',
          backgroundColor: 'var(--gray-light)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        aria-label={`View larger image of ${image.alt}`}
      >
        <div className="text-center">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">📷</div>
          <div className="text-dark small">{image.alt}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="gallery-item"
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
        backgroundColor: 'var(--gray-light)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      {!loaded && (
        <div 
          className="image-skeleton"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }}
          aria-hidden="true"
        />
      )}
      
      <picture>
        <source 
          srcSet={`/images/optimized/gallery/${image.filename}.webp`}
          type="image/webp"
        />
        <img
          src={`/images/optimized/gallery/${image.filename}.jpg`}
          alt={image.alt}
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : "auto"}
          decoding="async"
          width="400"
          height="300"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`curriculum-image ${loaded ? 'loaded' : ''}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 2
          }}
        />
      </picture>
    </div>
  );
});

GalleryImage.displayName = 'GalleryImage';

// Lightbox Modal Component
const LightboxModal = memo(({ selectedImage, onClose, onPrev, onNext }) => {
  const modalRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      onPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      onNext();
    }
  }, [onClose, onPrev, onNext]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [handleKeyDown]);

  if (!selectedImage) return null;

  return (
    <div
      ref={modalRef}
      className="modal-overlay"
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
      role="dialog"
      aria-modal="true"
      aria-label="Image lightbox"
      tabIndex={-1}
    >
      <button
        className="modal-close-btn"
        onClick={onClose}
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
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
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
          transition: 'background-color 0.2s ease'
        }}
        aria-label="Previous image"
      >
        ‹
      </button>
      
      <button
        onClick={(e) => { e.stopPropagation(); onNext(); }}
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
          transition: 'background-color 0.2s ease'
        }}
        aria-label="Next image"
      >
        ›
      </button>

      <div
        style={{
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <picture>
          <source 
            srcSet={`/images/optimized/gallery/${selectedImage.filename}.webp`}
            type="image/webp"
          />
          <img
            src={`/images/optimized/gallery/${selectedImage.filename}.jpg`}
            alt={selectedImage.alt}
            style={{
              maxWidth: '100%',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '8px'
            }}
            loading="eager"
          />
        </picture>
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

function ClubsSocieties() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentGalleryIndex, setCurrentGalleryIndex] = useState(0);
  
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Gallery images from sports category
  const galleryImages = useMemo(() => [
    { id: 5, filename: "sports1", alt: "Students playing football during sports day", category: "sports" },
    { id: 6, filename: "sports2", alt: "Athletics competition at school field", category: "sports" },
    { id: 7, filename: "sports3", alt: "Netball match between school teams", category: "sports" },
    { id: 8, filename: "sports4", alt: "Swimming gala at school pool", category: "sports" },
    { id: 1, filename: "academics1", alt: "Classroom learning activities", category: "academics" },
    { id: 9, filename: "cultural1", alt: "Traditional dance performance", category: "cultural" },
    { id: 13, filename: "events1", alt: "Graduation ceremony celebration", category: "events" },
    { id: 17, filename: "facilities1", alt: "Modern school library", category: "facilities" }
  ], []);

  // Three Pillars Data
  const pillars = useMemo(() => [
    { icon: "⭐", title: "Talent Development", description: "Learners explore interests in sports, arts, and clubs." },
    { icon: "🤝", title: "Social Growth", description: "Students build friendships, teamwork, and communication skills." },
    { icon: "👑", title: "Confidence & Leadership", description: "Activities help learners take initiative and grow in confidence." }
  ], []);

  // Sports Activities
  const sportsActivities = useMemo(() => [
    { icon: "⚽", name: "Football" },
    { icon: "🏃", name: "Athletics" },
    { icon: "⛸️", name: "Skating" },
    { icon: "🏊", name: "Swimming" },
    { icon: "🏐", name: "Netball" },
    { icon: "🏐", name: "Volleyball" },
    { icon: "🤾", name: "Handball" },
    { icon: "♟️", name: "Chess" }
  ], []);

  // Academic & Skills Clubs
  const academicClubs = useMemo(() => [
    { icon: "💻", name: "Coding & Computer Skills" },
    { icon: "📰", name: "Journalism" },
    { icon: "🎤", name: "Debates & Public Speaking" },
    { icon: "🇨🇳", name: "Chinese Language" }
  ], []);

  // Leadership Activities
  const leadershipActivities = useMemo(() => [
    { icon: "⛺", name: "Scouting" },
    { icon: "🗣️", name: "PPI (Peer Influence)" },
    { icon: "🎯", name: "Career Guidance" },
    { icon: "👥", name: "Student Leadership Roles" }
  ], []);

  // Spiritual Activities
  const spiritualActivities = useMemo(() => [
    { icon: "⛪", name: "School Chapel" },
    { icon: "💬", name: "Guidance & Counselling" },
    { icon: "📖", name: "Pastoral Instruction" }
  ], []);

  // Benefits Data
  const benefits = useMemo(() => [
    { icon: "💪", title: "Confidence", description: "Students build self-belief through participation." },
    { icon: "🤝", title: "Teamwork", description: "Learners develop strong social and collaboration skills." },
    { icon: "📏", title: "Discipline", description: "Structured activities build focus and responsibility." },
    { icon: "💡", title: "Talent Discovery", description: "Learners discover and develop their unique abilities." }
  ], []);

  // Daily schedule flow
  const dailyFlow = useMemo(() => [
    { time: "Morning", icon: "📚", activity: "Morning Classes" },
    { time: "Break", icon: "🍎", activity: "Break and Social Time" },
    { time: "Mid-Day", icon: "📖", activity: "Academic Lessons" },
    { time: "Afternoon", icon: "⚽", activity: "Co-curricular Activities" },
    { time: "Evening", icon: "📝", activity: "Wrap-up / Prep" }
  ], []);

  const openLightbox = useCallback((image) => {
    setSelectedImage(image);
    const index = galleryImages.findIndex(img => img.id === image.id);
    setCurrentGalleryIndex(index);
    document.body.style.overflow = 'hidden';
  }, [galleryImages]);

  const closeLightbox = useCallback(() => {
    setSelectedImage(null);
    document.body.style.overflow = 'unset';
  }, []);

  const handlePrevImage = useCallback(() => {
    const prevIndex = currentGalleryIndex > 0 ? currentGalleryIndex - 1 : galleryImages.length - 1;
    setCurrentGalleryIndex(prevIndex);
    setSelectedImage(galleryImages[prevIndex]);
  }, [currentGalleryIndex, galleryImages]);

  const handleNextImage = useCallback(() => {
    const nextIndex = currentGalleryIndex < galleryImages.length - 1 ? currentGalleryIndex + 1 : 0;
    setCurrentGalleryIndex(nextIndex);
    setSelectedImage(galleryImages[nextIndex]);
  }, [currentGalleryIndex, galleryImages]);

  return (
    <>
      <Helmet>
        <title>Co-Curricular, Clubs & Societies | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="A balanced school experience beyond the classroom at Kitale Progressive School. Discover our sports, clubs, leadership programs, and student development activities." 
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* Hero Section - Using theme page-title-section */}
      <section className="page-title-section" aria-labelledby="page-title">
        <Container>
          <h1 id="page-title" className="display-5 fw-bold">
            A Balanced School Experience Beyond the Classroom
          </h1>
          <p className="lead">
            Are you looking for a school where your child will not only learn, but also discover their talents, build confidence, and develop life skills?
          </p>
          <p className="text-gold" style={{ fontSize: '1rem' }}>
            At Kitale Progressive School, co-curricular activities are an essential part of learning, helping learners grow socially, emotionally, and physically.
          </p>
        </Container>
      </section>

      {/* Co-Curricular Overview Section */}
      <section className="py-4 bg-light-custom" aria-labelledby="overview-heading">
        <Container>
          <Row className="text-center mb-3">
            <Col lg={8} className="mx-auto">
              <h2 id="overview-heading" className="section-heading mb-3">
                A Balanced School Experience Beyond the Classroom
              </h2>
              <p className="lead text-dark" style={{ fontSize: '1rem' }}>
                At Kitale Progressive School, we provide a vibrant and structured school life that supports your child's academic, social, physical, and personal development.
              </p>
            </Col>
          </Row>

          {/* Three Pillars */}
          <Row className="g-3">
            {pillars.map((pillar, idx) => (
              <PillarCard key={idx} {...pillar} />
            ))}
          </Row>
        </Container>
      </section>

      {/* A Typical Day Section */}
      <section className="py-5" style={{ background: 'var(--white)' }} aria-labelledby="typical-day-heading">
        <Container>
          <Row className="text-center mb-5">
            <Col lg={8} className="mx-auto">
              <h2 id="typical-day-heading" className="section-heading mb-3">
                The Daily Experience
              </h2>
              <p className="text-muted lead">
                A thoughtfully structured day that fosters intellectual growth, character development, and holistic well-being.
              </p>
            </Col>
          </Row>

          <Row className="g-4 justify-content-center">
            {dailyFlow.map((item, idx) => (
              <Col key={idx} xs={12} sm={6} md={4} lg={3}>
                <div className="text-center p-4 border rounded-4 h-100 bg-white shadow-sm hover-shadow transition">
                  <div 
                    className="mb-3 d-inline-flex align-items-center justify-content-center rounded-circle bg-primary-soft" 
                    style={{ fontSize: '2rem', width: '64px', height: '64px' }}
                    aria-hidden="true"
                  >
                    {item.icon}
                  </div>
                  <h3 className="h5 fw-semibold mb-1">{item.activity}</h3>
                  <p className="small text-secondary mb-0">{item.time}</p>
                  {item.description && (
                    <p className="small text-muted mt-2 mb-0">{item.description}</p>
                  )}
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Sports & Physical Development Section */}
      <section className="py-4 bg-light-custom" aria-labelledby="sports-heading">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="curriculum-image-wrapper" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <OptimizedImage 
                  src="indoor-games"
                  alt="Students participating in sports activities"
                  width="600"
                  height="400"
                  priority={true}
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 id="sports-heading" className="section-heading-left mb-2">
                Sports and Physical Development
              </h2>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Do you want your child to stay active, healthy, and build teamwork skills?
              </p>
              <p className="mb-3 text-dark small">
                Our sports program develops physical fitness, discipline, and teamwork through structured training and participation.
              </p>
              
              <Row className="g-1">
                {sportsActivities.map((sport, idx) => (
                  <Col key={idx} xs={6} md={3}>
                    <ActivityCard {...sport} />
                  </Col>
                ))}
              </Row>

              <div className="mt-3 p-2 bg-light-custom rounded-3" style={{ borderLeft: `3px solid var(--gold)` }}>
                <p className="mb-0 fw-medium text-navy small">
                  <i className="fas fa-trophy me-2 text-gold" aria-hidden="true"></i>
                  Outcome: Learners develop discipline, teamwork, and confidence.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Academic & Skills Development Clubs Section */}
      <section className="py-4" style={{ background: 'var(--white)' }} aria-labelledby="academic-clubs-heading">
        <Container>
          <Row className="align-items-center g-4 flex-row-reverse">
            <Col lg={6}>
              <div className="curriculum-image-wrapper" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <OptimizedImage 
                  src="computer-club"
                  alt="Students in coding and computer club"
                  width="600"
                  height="400"
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 id="academic-clubs-heading" className="section-heading-left mb-2">
                Academic and Skills Development Clubs
              </h2>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Do you want your child to develop creativity, communication, and practical skills?
              </p>
              <p className="mb-3 text-dark small">
                Our clubs allow learners to explore interests and develop important academic and life skills.
              </p>
              
              <Row className="g-2">
                {academicClubs.map((club, idx) => (
                  <Col key={idx} xs={12} md={6}>
                    <div className="d-flex align-items-center gap-2 p-2 bg-light-custom rounded-3">
                      <div style={{ fontSize: '1.3rem' }} aria-hidden="true">{club.icon}</div>
                      <span className="small fw-medium text-navy">{club.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="mt-3 p-2 bg-light-custom rounded-3" style={{ borderLeft: `3px solid var(--gold)` }}>
                <p className="mb-0 fw-medium text-navy small">
                  <i className="fas fa-lightbulb me-2 text-gold" aria-hidden="true"></i>
                  Outcome: Learners develop communication, creativity, and problem-solving skills.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Leadership & Personal Development Section */}
      <section className="py-4 bg-light-custom" aria-labelledby="leadership-heading">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6}>
              <div className="curriculum-image-wrapper" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <OptimizedImage 
                  src="events1"
                  alt="Students in leadership and scouting activities"
                  width="600"
                  height="400"
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 id="leadership-heading" className="section-heading-left mb-2">
                Leadership and Personal Growth
              </h2>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Are you looking for a school that builds confidence and responsibility?
              </p>
              <p className="mb-3 text-dark small">
                We guide learners to develop leadership, discipline, and responsibility through structured programs.
              </p>
              
              <Row className="g-2">
                {leadershipActivities.map((activity, idx) => (
                  <Col key={idx} xs={12} md={6}>
                    <div className="d-flex align-items-center gap-2 p-2 bg-white rounded-3 shadow-sm">
                      <div style={{ fontSize: '1.3rem' }} aria-hidden="true">{activity.icon}</div>
                      <span className="small fw-medium text-navy">{activity.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="mt-3 p-2 bg-light-custom rounded-3" style={{ borderLeft: `3px solid var(--gold)` }}>
                <p className="mb-0 fw-medium text-navy small">
                  <i className="fas fa-chart-line me-2 text-gold" aria-hidden="true"></i>
                  Outcome: Learners grow into confident and responsible individuals.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Spiritual & Values Development Section */}
      <section className="py-4" style={{ background: 'var(--white)' }} aria-labelledby="spiritual-heading">
        <Container>
          <Row className="align-items-center g-4 flex-row-reverse">
            <Col lg={6}>
              <div className="curriculum-image-wrapper" style={{ boxShadow: '0 8px 20px rgba(0,0,0,0.1)' }}>
                <OptimizedImage 
                  src="events4"
                  alt="Students in school chapel service"
                  width="600"
                  height="400"
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 id="spiritual-heading" className="section-heading-left mb-2">
                Spiritual and Values Development
              </h2>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Do you want your child to grow in strong values and discipline?
              </p>
              <p className="mb-3 text-dark small">
                We nurture character and values through spiritual guidance and mentorship.
              </p>
              
              <Row className="g-2">
                {spiritualActivities.map((activity, idx) => (
                  <Col key={idx} xs={12} md={6}>
                    <div className="d-flex align-items-center gap-2 p-2 bg-light-custom rounded-3">
                      <div style={{ fontSize: '1.3rem' }} aria-hidden="true">{activity.icon}</div>
                      <span className="small fw-medium text-navy">{activity.name}</span>
                    </div>
                  </Col>
                ))}
              </Row>

              <div className="mt-3 p-2 bg-light-custom rounded-3" style={{ borderLeft: `3px solid var(--gold)` }}>
                <p className="mb-0 fw-medium text-navy small">
                  <i className="fas fa-heart me-2 text-gold" aria-hidden="true"></i>
                  Outcome: Learners develop discipline, respect, and strong moral values.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="py-4 bg-light-custom" aria-labelledby="benefits-heading">
        <Container>
          <Row className="text-center mb-3">
            <Col lg={8} className="mx-auto">
              <h2 id="benefits-heading" className="section-heading mb-3">
                How Your Child Benefits from Co-Curricular Activities
              </h2>
              <p className="text-dark small">
                Through co-curricular activities, learners develop essential life skills that prepare them for success beyond the classroom.
              </p>
            </Col>
          </Row>

          <Row className="g-2">
            {benefits.map((benefit, idx) => (
              <BenefitCard key={idx} {...benefit} />
            ))}
          </Row>
        </Container>
      </section>

      {/* Gallery Section - Experience Student Life */}
      <section className="py-4" style={{ background: 'var(--white)' }} aria-labelledby="gallery-heading">
        <Container>
          <Row className="text-center mb-3">
            <Col lg={8} className="mx-auto">
              <h2 id="gallery-heading" className="section-heading mb-3">
                Experience Student Life at Kitale Progressive School
              </h2>
              <p className="text-dark small">
                See your child in action - sports, clubs, events, and student life
              </p>
            </Col>
          </Row>

          <Row className="g-3">
            {galleryImages.map((image, idx) => (
              <Col key={image.id} xs={12} sm={6} lg={3}>
                <GalleryImage 
                  image={image} 
                  onClick={openLightbox}
                  priority={idx < 4}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Lightbox Modal */}
      {selectedImage && (
        <LightboxModal
          selectedImage={selectedImage}
          onClose={closeLightbox}
          onPrev={handlePrevImage}
          onNext={handleNextImage}
        />
      )}

      {/* Final CTA Section - Using cta-section theme */}
      <section className="cta-section py-4">
        <Container>
          <Row className="justify-content-center text-center">
            <Col lg={8}>
              <h2 className="h4 fw-bold mb-3 text-white">
                Ready to Give Your Child a Complete School Experience?
              </h2>
              <p className="mb-3 text-white small opacity-90">
                Visit our school and experience the environment where learners grow academically, socially, and personally.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-2">
                <Link to="/admissions/apply">
                  <Button className="btn-navy" style={{ minHeight: '40px' }}>
                    <i className="fas fa-paper-plane me-2" aria-hidden="true"></i>
                    Apply Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="btn-navy" style={{ minHeight: '40px' }}>
                    <i className="fas fa-calendar-check me-2" aria-hidden="true"></i>
                    Book a School Visit
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="btn-navy" style={{ minHeight: '40px' }}>
                    <i className="fas fa-phone-alt me-2" aria-hidden="true"></i>
                    Contact Admissions
                  </Button>
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Optimized Critical CSS for Core Web Vitals */}
      <style dangerouslySetInnerHTML={{ __html: `
        .pillar-card,
        .activity-card,
        .benefit-card,
        .gallery-item {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          will-change: transform;
        }
        .pillar-card:hover,
        .activity-card:hover,
        .benefit-card:hover,
        .gallery-item:hover,
        .gallery-item:focus-visible {
          transform: translateY(-3px);
          box-shadow: 0 8px 16px rgba(13,101,251,0.1) !important;
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        .modal-overlay {
          backdrop-filter: blur(5px);
        }
        @media (max-width: 768px) {
          .section-heading {
            font-size: 1.6rem;
          }
          .section-heading-left {
            font-size: 1.4rem;
          }
          .pillar-card:hover,
          .activity-card:hover,
          .benefit-card:hover,
          .gallery-item:hover {
            transform: none;
          }
        }
        @media (max-width: 576px) {
          .section-heading {
            font-size: 1.4rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          .pillar-card,
          .activity-card,
          .benefit-card,
          .gallery-item,
          .pillar-card:hover,
          .activity-card:hover,
          .benefit-card:hover,
          .gallery-item:hover {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
          .pillar-card,
          .activity-card,
          .benefit-card,
          .gallery-item {
            will-change: auto;
          }
        }
        /* Performance optimizations */
        .curriculum-image-wrapper {
          contain: layout paint;
        }
        .curriculum-image {
          backface-visibility: hidden;
          -webkit-backface-visibility: hidden;
        }
      `}} />
    </>
  );
}

export default memo(ClubsSocieties);