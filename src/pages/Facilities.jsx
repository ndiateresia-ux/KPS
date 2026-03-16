// pages/Facilities.jsx - Fully Optimized
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useState, useCallback, lazy, Suspense, memo, useEffect, useMemo, useRef } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Optimized image component with WebP support and objectFit prop
const OptimizedImage = memo(({ src, alt, width, height, className = '', objectFit = 'cover', priority = false }) => {
  const [imgSrc, setImgSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);
  
  // Extract filename from path
  useEffect(() => {
    if (src) {
      const filename = src.split('/').pop().replace(/\.(jpg|jpeg|png)$/i, '');
      setImgSrc(filename);
    }
  }, [src]);

  // Check WebP support
  const supportsWebP = useMemo(() => {
    if (typeof window === 'undefined') return true;
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  }, []);

  // Preload critical images
  useEffect(() => {
    if (priority && imgSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = supportsWebP ? `/images/optimized/${imgSrc}.webp` : `/images/optimized/${imgSrc}.jpg`;
      link.type = supportsWebP ? 'image/webp' : 'image/jpeg';
      document.head.appendChild(link);
      
      return () => {
        if (link.parentNode) document.head.removeChild(link);
      };
    }
  }, [priority, imgSrc, supportsWebP]);

  if (error) {
    return (
      <div 
        style={{ 
          backgroundColor: '#f0f0f0',
          width: '100%',
          height: '100%',
          minHeight: height || '200px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.875rem',
          borderRadius: '12px',
          aspectRatio: width && height ? `${width}/${height}` : 'auto'
        }}
        role="img"
        aria-label={`${alt} (image failed to load)`}
      >
        <div className="text-center">
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">📷</div>
          <div>{alt}</div>
          <div style={{ fontSize: '0.75rem', marginTop: '0.5rem' }}>Image coming soon</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      position: 'relative', 
      width: '100%', 
      height: '100%',
      aspectRatio: width && height ? `${width}/${height}` : 'auto',
      backgroundColor: '#f0f0f0',
      borderRadius: '12px',
      overflow: 'hidden'
    }}>
      {/* Loading skeleton */}
      {!isLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            zIndex: 1
          }}
          aria-hidden="true"
        />
      )}
      
      <picture>
        {/* WebP version */}
        <source 
          srcSet={`/images/optimized/${imgSrc}.webp`}
          type="image/webp"
        />
        {/* Fallback JPG */}
        <img
          ref={imgRef}
          src={`/images/optimized/${imgSrc}.jpg`}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setIsLoaded(true)}
          onError={() => setError(true)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: objectFit,
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease',
            position: 'relative',
            zIndex: 2
          }}
          className={className}
        />
      </picture>
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Memoized facility image card component with enhanced accessibility
const FacilityImageCard = memo(({ src, alt, onClick, priority = false }) => {
  const [loaded, setLoaded] = useState(false);
  const cardId = `facility-${alt.replace(/\s+/g, '-').toLowerCase()}`;
  const buttonRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  }, [onClick]);

  return (
    <div 
      id={cardId}
      className="facility-image-card"
      onClick={onClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`View larger image of ${alt}`}
      ref={buttonRef}
      style={{
        position: 'relative',
        borderRadius: '12px',
        overflow: 'hidden',
        aspectRatio: '4/3',
        cursor: 'pointer',
        backgroundColor: '#f0f0f0',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
    >
      <OptimizedImage 
        src={src}
        alt={alt}
        width="400"
        height="300"
        objectFit="cover"
        priority={priority}
      />
      <div 
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.7), transparent)',
          color: 'white',
          padding: '1rem 0.5rem 0.5rem 0.5rem',
          fontSize: '0.9rem',
          fontWeight: '500',
          zIndex: 3,
          pointerEvents: 'none'
        }}
        aria-hidden="true"
      >
        {alt}
      </div>
    </div>
  );
});

FacilityImageCard.displayName = 'FacilityImageCard';

// Memoized tab button component with enhanced accessibility
const TabButton = memo(({ eventKey, active, icon, label, onClick }) => {
  const buttonRef = useRef(null);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(eventKey);
    }
  }, [onClick, eventKey]);

  return (
    <button
      ref={buttonRef}
      onClick={() => onClick(eventKey)}
      onKeyDown={handleKeyDown}
      aria-pressed={active}
      aria-label={`${label} tab${active ? ', currently selected' : ''}`}
      style={{
        padding: '0.75rem 1.5rem',
        borderRadius: '40px',
        border: 'none',
        backgroundColor: active ? '#132f66' : 'transparent',
        color: active ? 'white' : '#132f66',
        fontWeight: '600',
        fontSize: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        boxShadow: active ? '0 4px 12px rgba(19,47,102,0.2)' : 'none',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        minHeight: '44px',
        minWidth: '44px'
      }}
    >
      <span aria-hidden="true">{icon}</span>
      <span>{label}</span>
      {active && <span className="visually-hidden">(selected)</span>}
    </button>
  );
});

TabButton.displayName = 'TabButton';

// Memoized routine row component for better performance and accessibility
const RoutineRow = memo(({ item, index }) => {
  const isMorningPrep = item.activity.includes('Morning Prep');
  const isEveningPrep = item.activity.includes('Evening Prep');
  const isMealTime = item.activity.includes('Breakfast') || item.activity.includes('Supper');
  const isLightsOut = item.activity.includes('Lights Out');
  
  let rowClass = index % 2 === 0 ? 'routine-row-even' : 'routine-row-odd';
  if (isMorningPrep || isEveningPrep) rowClass += ' prep-time';
  if (isMealTime) rowClass += ' meal-time';
  if (isLightsOut) rowClass += ' lights-out';

  return (
    <div className={`routine-row ${rowClass}`} role="row">
      <span className="time-column" role="cell">{item.time}</span>
      <span className="activity-column" role="cell">
        {isMorningPrep && <span className="activity-icon" aria-hidden="true">📚</span>}
        {isEveningPrep && <span className="activity-icon" aria-hidden="true">✏️</span>}
        {isMealTime && <span className="activity-icon" aria-hidden="true">🍽️</span>}
        {isLightsOut && <span className="activity-icon" aria-hidden="true">🌙</span>}
        <span>{item.activity}</span>
      </span>
    </div>
  );
});

RoutineRow.displayName = 'RoutineRow';

// Memoized image modal with accessibility improvements
const ImageModal = memo(({ selectedImage, onClose }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    // Focus trap
    if (modalRef.current) {
      closeButtonRef.current?.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === modalRef.current) {
      onClose();
    }
  }, [onClose]);

  // Extract filename from the selected image path
  const getImageSrc = useCallback((path) => {
    if (!path) return '';
    const filename = path.split('/').pop().replace(/\.(jpg|jpeg|png)$/i, '');
    
    // Check WebP support
    const supportsWebP = (() => {
      const canvas = document.createElement('canvas');
      return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
    })();

    return (
      <picture>
        <source 
          srcSet={supportsWebP ? `/images/optimized/${filename}.webp` : `/images/optimized/${filename}.jpg`} 
          type={supportsWebP ? 'image/webp' : 'image/jpeg'} 
        />
        <img
          src={`/images/optimized/${filename}.jpg`}
          alt="Enlarged view of facility"
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
          loading="eager"
        />
      </picture>
    );
  }, []);

  if (!selectedImage) return null;

  return (
    <div 
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-label="Image enlarged view"
      onKeyDown={handleKeyDown}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.9)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem'
      }}
    >
      <div 
        style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
          aria-label="Close enlarged image"
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
            zIndex: 100001
          }}
        >
          ✕
          <span className="visually-hidden">Close</span>
        </button>
        {getImageSrc(selectedImage)}
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

function Facilities() {
  const [activeTab, setActiveTab] = useState("boarding");
  const [selectedImage, setSelectedImage] = useState(null);

  // Boarding facility images - memoized
  const boardingImages = useMemo(() => ({
    dormitory: "/images/facilities/dormitory.jpg",
    commonRoom: "/images/facilities/common-room.jpg",
    dining: "/images/facilities/dining-hall.jpg",
    studyArea: "/images/facilities/study-area.jpg",
    recreation: "/images/facilities/recreation.jpg",
    chapel: "/images/facilities/chapel.jpg"
  }), []);

  // Kitchen and menu images - memoized
  const kitchenImages = useMemo(() => ({
    kitchen: "/images/facilities/kitchen.jpg",
    diningHall: "/images/facilities/dining-hall-2.jpg",
    foodPrep: "/images/facilities/food-preparation.jpg",
    storage: "/images/facilities/food-storage.jpg"
  }), []);

  // Images you will provide - memoized
  const weeklyMenuImage = useMemo(() => "/images/menu.png", []);
  const boardingItemsImage = useMemo(() => "/images/boarding-items.jpg", []);

  // PDF documents - memoized
  const pdfDocuments = useMemo(() => ({
    itemsList: "/pdfs/boarding-items-list.pdf",
    weeklyMenu: "/pdfs/weekly-menu.pdf"
  }), []);

  // Boarding daily routine - memoized
  const dailyRoutine = useMemo(() => [
    { time: "6:00 AM - 6:45 AM", activity: "Morning Prep (Study Time)" },
    { time: "7:00 AM - 7:45 AM", activity: "Breakfast" },
    { time: "8:00 AM - 5:00 PM", activity: "Classes (with breaks)" },
    { time: "5:00 PM - 6:00 PM", activity: "Sports & Recreation" },
    { time: "6:00 PM - 7:00 PM", activity: "Personal Time/Shower" },
    { time: "7:00 PM - 8:00 PM", activity: "Supper" },
    { time: "8:00 PM - 9:00 PM", activity: "Evening Prep (Homework)" },
    { time: "9:00 PM", activity: "Lights Out (Younger Students)" },
    { time: "10:00 PM", activity: "Lights Out (Older Students)" }
  ], []);

  // Handle document download
  const handleDownload = useCallback((pdfUrl, filename) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Download ${filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  // Handle image view
  const handleViewImage = useCallback((imageUrl) => {
    setSelectedImage(imageUrl);
  }, []);

  // Close modal
  const closeModal = useCallback(() => {
    setSelectedImage(null);
  }, []);

  // Handle tab change
  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  // Preconnect to nothing - all local images
  useEffect(() => {
    // No external domains needed
  }, []);

  return (
    <>
      <Helmet>
        <title>Facilities | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Explore our modern boarding facilities, kitchen, dining hall, and other amenities at Kitale Progressive School." 
        />
      </Helmet>
      
      {/* Page Header */}
      <section 
        style={{ 
          background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
          color: 'white',
          paddingTop: '120px',
          paddingBottom: '60px',
          textAlign: 'center'
        }}
        aria-labelledby="page-title"
      >
        <Container>
          <h1 id="page-title" style={{ 
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Our Facilities
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 4vw, 1.3rem)',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            Modern Learning Environment • Home Away From Home
          </p>
        </Container>
      </section>

      {/* Main Facilities Section */}
      <section className="py-5 bg-light-custom" aria-labelledby="facilities-heading">
        <Container>
          <h2 id="facilities-heading" className="visually-hidden">Facilities Details</h2>

          {/* Tab Navigation */}
          <div 
            className="d-flex justify-content-center gap-3 mb-5" 
            role="tablist" 
            aria-label="Facility categories"
          >
            <TabButton
              eventKey="boarding"
              active={activeTab === "boarding"}
              icon="🏠"
              label="Boarding Facilities"
              onClick={handleTabChange}
            />
            <TabButton
              eventKey="kitchen"
              active={activeTab === "kitchen"}
              icon="🍳"
              label="Kitchen & Dining"
              onClick={handleTabChange}
            />
          </div>

          {/* BOARDING FACILITIES TAB */}
          {activeTab === "boarding" && (
            <div role="tabpanel" aria-labelledby="boarding-tab">
              {/* Introduction */}
              <Row className="mb-5">
                <Col lg={8} className="mx-auto text-center">
                  <h2 className="h3 fw-bold mb-3" style={{ color: '#132f66' }}>Home Away From Home</h2>
                  <p className="text-muted">
                    Our boarding facilities provide a safe, nurturing environment where students 
                    develop independence, lifelong friendships, and strong character.
                  </p>
                </Col>
              </Row>

              {/* Boarding Image Gallery */}
              <Row className="g-4 mb-5" role="list" aria-label="Boarding facility images">
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    src={boardingImages.dormitory} 
                    alt="Dormitory" 
                    onClick={() => handleViewImage(boardingImages.dormitory)}
                    priority={true}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    src={boardingImages.commonRoom} 
                    alt="Common Room" 
                    onClick={() => handleViewImage(boardingImages.commonRoom)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    src={boardingImages.dining} 
                    alt="Dining Hall" 
                    onClick={() => handleViewImage(boardingImages.dining)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    src={boardingImages.studyArea} 
                    alt="Study Area" 
                    onClick={() => handleViewImage(boardingImages.studyArea)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    src={boardingImages.recreation} 
                    alt="Recreation Area" 
                    onClick={() => handleViewImage(boardingImages.recreation)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    src={boardingImages.chapel} 
                    alt="Chapel" 
                    onClick={() => handleViewImage(boardingImages.chapel)}
                  />
                </Col>
              </Row>

              {/* Daily Routine */}
              <Row className="mb-5">
                <Col lg={12}>
                  <Card className="border-0 shadow-sm overflow-hidden">
                    <Card.Body className="p-4">
                      <h3 className="h5 fw-bold mb-4" style={{ color: '#132f66' }}>
                        <i className="fas fa-clock me-2" style={{ color: '#cebd04' }} aria-hidden="true"></i>
                        Daily Routine for Boarders
                      </h3>

                      {/* Table Header */}
                      <div className="routine-header" role="row">
                        <span className="time-column" role="columnheader">Time</span>
                        <span className="activity-column" role="columnheader">Activity</span>
                      </div>

                      {/* Table Rows */}
                      <div className="routine-body" role="table" aria-label="Daily boarding schedule">
                        {dailyRoutine.map((item, index) => (
                          <RoutineRow key={index} item={item} index={index} />
                        ))}
                      </div>

                      {/* Legend */}
                      <div className="routine-legend" aria-label="Schedule legend">
                        <span><span aria-hidden="true">📚</span> Prep Time</span>
                        <span><span aria-hidden="true">🍽️</span> Meal Time</span>
                        <span><span aria-hidden="true">🌙</span> Lights Out</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Boarding Items Checklist */}
              <Row className="mb-5">
                <Col lg={12}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h3 className="h5 fw-bold mb-4" style={{ color: '#132f66' }}>
                        <i className="fas fa-box me-2" style={{ color: '#cebd04' }} aria-hidden="true"></i>
                        Boarding Items Checklist
                      </h3>

                      <div 
                        className="text-center mb-4 cursor-pointer"
                        onClick={() => handleViewImage(boardingItemsImage)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewImage(boardingItemsImage);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        aria-label="View enlarged boarding items checklist"
                      >
                        <div style={{ 
                          maxHeight: '400px', 
                          overflow: 'hidden',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          margin: '0 auto',
                          display: 'inline-block'
                        }}>
                          <OptimizedImage 
                            src={boardingItemsImage}
                            alt="Boarding Items Checklist"
                            width="800"
                            height="600"
                            objectFit="contain"
                          />
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">Click image to enlarge</small>
                        </div>
                      </div>

                      <div className="text-center">
                        <Button 
                          onClick={() => handleDownload(pdfDocuments.itemsList, 'Boarding_Items_List.pdf')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleDownload(pdfDocuments.itemsList, 'Boarding_Items_List.pdf');
                            }
                          }}
                          style={{
                            backgroundColor: '#132f66',
                            borderColor: '#132f66',
                            padding: '0.5rem 2rem',
                            borderRadius: '40px',
                            fontWeight: '600',
                            minHeight: '44px',
                            minWidth: '44px'
                          }}
                          aria-label="Download boarding items checklist PDF"
                        >
                          <i className="fas fa-download me-2" aria-hidden="true"></i>
                          Download PDF
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {/* KITCHEN & DINING TAB */}
          {activeTab === "kitchen" && (
            <div role="tabpanel" aria-labelledby="kitchen-tab">
              {/* Introduction */}
              <Row className="mb-5">
                <Col lg={8} className="mx-auto text-center">
                  <h2 className="h3 fw-bold mb-3" style={{ color: '#132f66' }}>Nutritious Meals Daily</h2>
                  <p className="text-muted">
                    Our kitchen prepares balanced, nutritious meals following strict hygiene standards 
                    and a menu approved by nutritionists.
                  </p>
                </Col>
              </Row>

              {/* Kitchen Image Gallery */}
              <Row className="g-4 mb-5" role="list" aria-label="Kitchen and dining facility images">
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    src={kitchenImages.kitchen} 
                    alt="Modern Kitchen" 
                    onClick={() => handleViewImage(kitchenImages.kitchen)}
                    priority={true}
                  />
                </Col>
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    src={kitchenImages.diningHall} 
                    alt="Dining Hall" 
                    onClick={() => handleViewImage(kitchenImages.diningHall)}
                  />
                </Col>
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    src={kitchenImages.foodPrep} 
                    alt="Food Preparation" 
                    onClick={() => handleViewImage(kitchenImages.foodPrep)}
                  />
                </Col>
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    src={kitchenImages.storage} 
                    alt="Food Storage" 
                    onClick={() => handleViewImage(kitchenImages.storage)}
                  />
                </Col>
              </Row>

              {/* Weekly Menu */}
              <Row className="mb-5">
                <Col lg={12}>
                  <Card className="border-0 shadow-sm">
                    <Card.Body className="p-4">
                      <h3 className="h5 fw-bold mb-4" style={{ color: '#132f66' }}>
                        <i className="fas fa-utensils me-2" style={{ color: '#cebd04' }} aria-hidden="true"></i>
                        Weekly Menu
                      </h3>

                      <div 
                        className="text-center mb-4 cursor-pointer"
                        onClick={() => handleViewImage(weeklyMenuImage)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleViewImage(weeklyMenuImage);
                          }
                        }}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        aria-label="View enlarged weekly menu"
                      >
                        <div style={{ 
                          maxHeight: '500px', 
                          overflow: 'hidden',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                          margin: '0 auto',
                          display: 'inline-block'
                        }}>
                          <OptimizedImage 
                            src={weeklyMenuImage}
                            alt="Weekly Menu"
                            width="800"
                            height="1000"
                            objectFit="contain"
                          />
                        </div>
                        <div className="mt-2">
                          <small className="text-muted">Click image to enlarge</small>
                        </div>
                      </div>

                      <div className="d-flex justify-content-center gap-3">
                        <Button 
                          variant="outline-primary"
                          onClick={() => handleViewImage(weeklyMenuImage)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleViewImage(weeklyMenuImage);
                            }
                          }}
                          style={{
                            borderColor: '#132f66',
                            color: '#132f66',
                            padding: '0.5rem 2rem',
                            borderRadius: '40px',
                            fontWeight: '600',
                            minHeight: '44px',
                            minWidth: '44px'
                          }}
                          aria-label="View enlarged weekly menu"
                        >
                          <i className="fas fa-eye me-2" aria-hidden="true"></i>
                          View Menu
                        </Button>
                        <Button 
                          onClick={() => handleDownload(pdfDocuments.weeklyMenu, 'Weekly_Menu.pdf')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              handleDownload(pdfDocuments.weeklyMenu, 'Weekly_Menu.pdf');
                            }
                          }}
                          style={{
                            backgroundColor: '#132f66',
                            borderColor: '#132f66',
                            padding: '0.5rem 2rem',
                            borderRadius: '40px',
                            fontWeight: '600',
                            minHeight: '44px',
                            minWidth: '44px'
                          }}
                          aria-label="Download weekly menu PDF"
                        >
                          <i className="fas fa-download me-2" aria-hidden="true"></i>
                          Download PDF
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Container>
      </section>

      {/* Image Modal with accessibility improvements */}
      {selectedImage && (
        <ImageModal selectedImage={selectedImage} onClose={closeModal} />
      )}

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS - Minified */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shimmer{0%{background-position:-200% 0}100%{background-position:200% 0}}.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.cursor-pointer{cursor:pointer}.facility-image-card{transition:transform .3s ease,box-shadow .3s ease;position:relative;overflow:hidden;border-radius:12px;aspect-ratio:4/3}.facility-image-card:focus-visible,.facility-image-card:hover{transform:scale(1.02);outline:3px solid #cebd04;outline-offset:2px}.facility-image-card:focus-visible img,.facility-image-card:hover img{transform:scale(1.05)}.routine-header{display:flex;padding:1rem 1.5rem;background:linear-gradient(135deg,#132f66 0,#1e3a7a 100%);color:#fff;border-radius:12px 12px 0 0;font-weight:700;font-size:1rem;letter-spacing:.5px}.time-column{width:200px}.activity-column{flex:1;display:flex;align-items:center;gap:.75rem}.activity-icon{font-size:1.2rem;min-width:24px}.routine-body{border:1px solid #e9ecef;border-top:none;border-radius:0 0 12px 12px;overflow:hidden}.routine-row{display:flex;padding:1rem 1.5rem;border-bottom:1px solid #e9ecef;transition:all .2s ease}.routine-row:last-child{border-bottom:none}.routine-row-even{background-color:#fff}.routine-row-odd{background-color:#f8fafc}.routine-row:focus-within,.routine-row:hover{background-color:#e6f0ff!important;transform:scale(1.01);box-shadow:0 2px 8px rgba(0,0,0,.05);position:relative;z-index:1;outline:3px solid #cebd04;outline-offset:-3px}.routine-row.prep-time{border-left:4px solid #4299e1}.routine-row.meal-time{border-left:4px solid #cebd04}.routine-row.lights-out{border-left:4px solid #4a5568}.routine-legend{display:flex;gap:2rem;margin-top:1rem;font-size:.85rem;color:#4a5568}.routine-legend span{display:flex;align-items:center;gap:.5rem}button:focus-visible{outline:3px solid #cebd04;outline-offset:2px}@media (max-width:768px){.routine-header{display:none}.routine-row{flex-direction:column;gap:.5rem;padding:1rem}.time-column{width:100%;font-weight:700;color:#132f66}.routine-legend{flex-wrap:wrap;gap:1rem}}@media (prefers-reduced-motion:reduce){.facility-image-card,.facility-image-card img,.routine-row,.routine-row:focus-within,.routine-row:hover,*{transition:none!important;animation:none!important;transform:none!important}}
      `}} />
    </>
  );
}

export default memo(Facilities);