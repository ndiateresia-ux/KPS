// pages/FeeStructure.jsx - Updated with Reduced Spacing
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Button, Card, Badge } from "react-bootstrap";
import { useState, useCallback, memo, lazy, Suspense, useEffect } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Enhanced StatBadge component with accessibility
const StatBadge = memo(({ value, label }) => (
  <div className="fee-stat-badge" style={{
    background: 'linear-gradient(135deg, #ffffff 0%, var(--gray-light) 100%)',
    padding: '0.5rem 1rem',
    borderRadius: '50px',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '100px',
    boxShadow: '0 4px 15px rgba(13,101,251,0.08)',
    border: '1px solid rgba(13,101,251,0.1)'
  }}
  role="article"
  >
    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--navy)', lineHeight: 1.2 }} aria-hidden="true">{value}</span>
    <span style={{ fontSize: '0.7rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    <span className="visually-hidden">{value} {label}</span>
  </div>
));

StatBadge.displayName = 'StatBadge';

// Enhanced InfoCard component with accessibility
const InfoCard = memo(({ icon, title, description }) => (
  <Col md={4}>
    <Card className="card-custom h-100 info-card" style={{
      background: 'white',
      borderRadius: '16px',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '3px',
        background: 'var(--gradient-primary)'
      }} aria-hidden="true" />
      <Card.Body className="text-center p-3">
        <div style={{
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(13,101,251,0.1) 0%, rgba(255,0,128,0.1) 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1rem',
          fontSize: '2rem',
          color: 'var(--navy)'
        }} aria-hidden="true">
          <i className={`bi bi-${icon}`} aria-hidden="true"></i>
        </div>
        <h3 className="card-title-navy h6 fw-bold mb-1">{title}</h3>
        <p className="small text-muted mb-0" style={{ lineHeight: 1.5 }}>{description}</p>
      </Card.Body>
    </Card>
  </Col>
));

InfoCard.displayName = 'InfoCard';

// Enhanced ClassButton component with accessibility
const ClassButton = memo(({ category, isActive, onClick }) => {
  const buttonId = `class-${category.id}`;
  
  return (
    <button
      id={buttonId}
      onClick={() => onClick(category.id)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(category.id);
        }
      }}
      aria-pressed={isActive}
      aria-label={`${category.name} level, ${category.description}`}
      className={`class-selector-btn ${isActive ? 'active' : ''}`}
      style={{
        flex: 1,
        padding: '0.8rem 0.5rem',
        borderRadius: '12px',
        border: 'none',
        background: isActive 
          ? 'var(--gradient-primary)'
          : 'white',
        color: isActive ? 'white' : 'var(--text-dark)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        boxShadow: isActive 
          ? '0 8px 16px rgba(13,101,251,0.2)'
          : '0 4px 12px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
        position: 'relative',
        overflow: 'hidden',
        minHeight: '44px',
        minWidth: '44px'
      }}
    >
      {isActive && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'var(--gold)'
        }} aria-hidden="true" />
      )}
      <div style={{ fontWeight: '700', fontSize: '0.95rem', marginBottom: '0.2rem' }}>{category.name}</div>
      <div style={{ fontSize: '0.7rem', opacity: isActive ? 0.9 : 0.6 }}>{category.description}</div>
      {isActive && <span className="visually-hidden"> (selected)</span>}
    </button>
  );
});

ClassButton.displayName = 'ClassButton';

// Enhanced PaymentDetail component with accessibility
const PaymentDetail = memo(({ icon, children }) => (
  <p className="mb-2" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.85rem' }}>
    <span style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '28px',
      height: '28px',
      background: 'var(--gradient-primary)',
      borderRadius: '8px',
      color: 'white',
      fontSize: '0.8rem',
      boxShadow: '0 4px 8px rgba(13,101,251,0.2)'
    }} aria-hidden="true">
      <i className={`bi bi-${icon}`} aria-hidden="true"></i>
    </span>
    <span style={{ color: 'var(--text-dark)' }}>{children}</span>
  </p>
));

PaymentDetail.displayName = 'PaymentDetail';

// Enhanced Image Modal with accessibility
const ImageModal = memo(({ selectedImage, showTransportImage, onClose, onDownload, selectedClass }) => {
  if (!selectedImage) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

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
        padding: '1rem',
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={showTransportImage ? "Transportation costs enlarged view" : `Fee structure for ${selectedClass} enlarged view`}
      tabIndex={-1}
    >
      <div style={{ position: 'relative', maxWidth: '90vw', maxHeight: '90vh' }} onClick={(e) => e.stopPropagation()}>
        <button
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '-40px',
            right: '-40px',
            background: 'white',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '1.5rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
            zIndex: 100001
          }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.1)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          aria-label="Close enlarged view"
        >
          ×
        </button>
        <img
          src={selectedImage}
          alt={showTransportImage ? "Transportation costs" : `Fee structure for ${selectedClass}`}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '90vh', 
            objectFit: 'contain', 
            borderRadius: '12px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
          }}
        />
        <div style={{
          position: 'absolute',
          bottom: '-60px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          gap: '1rem'
        }}>
          <button
            onClick={onDownload}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onDownload();
              }
            }}
            className="btn-navy"
            style={{
              padding: '0.6rem 1.5rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '0.9rem',
              boxShadow: '0 10px 20px rgba(13,101,251,0.3)',
              transition: 'transform 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              minHeight: '44px',
              minWidth: '44px'
            }}
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            aria-label="Download image"
          >
            <i className="bi bi-download" aria-hidden="true"></i>
            Download
          </button>
        </div>
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

// Value Proposition Component - What Your Child Benefits From
const ValueProposition = memo(() => {
  const benefits = [
    { icon: "book-half", text: "Structured CBC academic program" },
    { icon: "people-fill", text: "Experienced and dedicated teachers" },
    { icon: "shield-check", text: "Safe and supportive environment" },
    { icon: "trophy-fill", text: "Co-curricular activities and sports" },
    { icon: "building", text: "Facilities that support learning and growth" }
  ];

  return (
    <Card className="card-custom border-0 mb-4" style={{ 
      background: 'linear-gradient(135deg, var(--gray-light) 0%, #ffffff 100%)',
      borderRadius: '20px',
      overflow: 'hidden'
    }}>
      <div className=" text-dark" style={{
        padding: '0.75rem 1.5rem'
      }}>
        <h3 className="h5 fw-bold mb-0 text-dark">
          <i className="bi bi-star-fill me-2" aria-hidden="true"></i>
          What Your Child Benefits From
        </h3>
        <p className="mb-0 mt-1 opacity-75 text-dark small" style={{ fontSize: '0.85rem' }}>
          Your school fees support a complete learning experience that includes:
        </p>
      </div>
      <Card.Body className="p-3">
        <Row className="g-2">
          {benefits.map((benefit, idx) => (
            <Col key={idx} md={6} lg={4}>
              <div className="d-flex align-items-center gap-2 p-2" style={{ 
                background: 'white', 
                borderRadius: '10px',
                boxShadow: '0 1px 4px rgba(0,0,0,0.03)'
              }}>
                <div className="bg-navy text-white" style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <i className={`bi bi-${benefit.icon}`} style={{ fontSize: '1rem', color: 'navy' }} aria-hidden="true"></i>
                </div>
                <p className="mb-0 fw-medium text-dark small">{benefit.text}</p>
              </div>
            </Col>
          ))}
        </Row>
      </Card.Body>
    </Card>
  );
});

ValueProposition.displayName = 'ValueProposition';

// Decision Support Component - Need Help Understanding Fee Structure
const DecisionSupport = memo(() => (
  <Card className="card-custom border-0 mb-3" style={{ 
    background: 'var(--gradient-primary)',
    borderRadius: '20px',
    overflow: 'hidden',
    boxShadow: '0 15px 30px rgba(13,101,251,0.2)'
  }}>
    <Card.Body className="p-4 text-center">
      <h3 className="h4 fw-bold mb-3 text-white">
        Need Help Understanding the Fee Structure?
      </h3>
      <p className="mb-3 text-white small" style={{ opacity: 0.9, maxWidth: '550px', margin: '0 auto' }}>
        Our team is available to guide you through the fee structure and help you plan effectively.
      </p>
      <div className="d-flex flex-wrap justify-content-center gap-2">
        <Button 
          href="/contact"
          className="btn-light-navy"
          style={{
            background: 'white',
            border: 'none',
            color: 'var(--navy)',
            fontWeight: '600',
            borderRadius: '50px',
            minHeight: '40px',
            minWidth: '140px',
            fontSize: '0.85rem'
          }}
          aria-label="Contact admissions team"
        >
          <i className="bi bi-envelope-fill me-2" aria-hidden="true"></i>
          Contact Admissions
        </Button>
        <Button 
          href="tel:+254722631433"
          className="btn-outline-light"
          style={{
            background: 'transparent',
            border: '2px solid white',
            color: 'white',
            fontWeight: '600',
            borderRadius: '50px',
            minHeight: '40px',
            minWidth: '140px',
            fontSize: '0.85rem'
          }}
          aria-label="Call admissions team"
        >
          <i className="bi bi-telephone-fill me-2" aria-hidden="true"></i>
          Call / WhatsApp
        </Button>
      </div>
    </Card.Body>
  </Card>
));

DecisionSupport.displayName = 'DecisionSupport';

function FeeStructure() {
  const [selectedClass, setSelectedClass] = useState("ecde");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTransportImage, setShowTransportImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

useEffect(() => {
  // Don't scroll to top if there's a hash (coming from another page)
  if (!window.location.hash) {
    window.scrollTo(0, 0);
  } else {
    // Handle hash navigation
    setTimeout(() => {
      const elementId = window.location.hash.substring(1);
      const element = document.getElementById(elementId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        element.setAttribute('tabindex', '-1');
        element.focus({ preventScroll: true });
        // Remove the hash from URL after scrolling (optional)
        // window.history.replaceState(null, '', window.location.pathname);
      }
    }, 300);
  }
}, []);

  // Fee structure images
  const feeImages = {
    ecde: "/images/fee-structure/ecde.jpg",
    primary: "/images/fee-structure/primary.jpg",
    junior: "/images/fee-structure/junior.jpg"
  };

  // Transportation image
  const transportImage = "/images/fee-structure/transport.jpg";

  const classCategories = [
    { id: "ecde", name: "ECDE", description: "Playgroup, PP1, PP2" },
    { id: "primary", name: "Primary", description: "Grade 1 - 6" },
    { id: "junior", name: "Junior Secondary", description: "Grade 7 - 9" }
  ];

  // Updated Trust Strip with enhanced messaging
  const trustPoints = [
    { icon: "wallet2", title: "Flexible Payment Options", description: "Pay in structured instalments to make school fees manageable across the term." },
    { icon: "percent", title: "Sibling Discount", description: "Families with more than one child benefit from reduced fees." },
    { icon: "bus-front", title: "Safe Transport Services", description: "Reliable transport options available for convenience and safety." }
  ];

  // Memoized handlers
  const handleViewImage = useCallback(() => {
    const imageUrl = feeImages[selectedClass];
    setSelectedImage(imageUrl);
    setShowTransportImage(false);
    document.body.style.overflow = 'hidden';
  }, [selectedClass, feeImages]);

  const handleViewTransportImage = useCallback(() => {
    setSelectedImage(transportImage);
    setShowTransportImage(true);
    document.body.style.overflow = 'hidden';
  }, [transportImage]);

  const handleDownloadImage = useCallback(() => {
    const imageUrl = showTransportImage ? transportImage : feeImages[selectedClass];
    const filename = showTransportImage 
      ? "Kitale_Progressive_Transport_Costs.jpg" 
      : `Kitale_Progressive_Fee_Structure_${selectedClass.toUpperCase()}.jpg`;
    
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = filename;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Download ${filename}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [selectedClass, showTransportImage, feeImages, transportImage]);

  // Download both fee structure and transport costs
  const handleDownloadBoth = useCallback(() => {
    const link1 = document.createElement('a');
    link1.href = feeImages[selectedClass];
    link1.download = `Kitale_Progressive_Fee_Structure_${selectedClass.toUpperCase()}.jpg`;
    link1.target = '_blank';
    link1.rel = 'noopener noreferrer';
    link1.setAttribute('aria-label', `Download fee structure for ${selectedClass}`);
    document.body.appendChild(link1);
    link1.click();
    document.body.removeChild(link1);

    setTimeout(() => {
      const link2 = document.createElement('a');
      link2.href = transportImage;
      link2.download = "Kitale_Progressive_Transport_Costs.jpg";
      link2.target = '_blank';
      link2.rel = 'noopener noreferrer';
      link2.setAttribute('aria-label', 'Download transport costs');
      document.body.appendChild(link2);
      link2.click();
      document.body.removeChild(link2);
    }, 500);
  }, [selectedClass, feeImages, transportImage]);

  const closeModal = useCallback(() => {
    setSelectedImage(null);
    setShowTransportImage(false);
    document.body.style.overflow = 'unset';
  }, []);

  const handleClassChange = useCallback((classId) => {
    setSelectedClass(classId);
    const announcer = document.getElementById('class-announcer');
    if (announcer) {
      const category = classCategories.find(c => c.id === classId);
      announcer.textContent = `Showing ${category.name} fee structure`;
    }
  }, [classCategories]);

  const handleImageLoad = useCallback((key) => {
    setImageLoaded(prev => ({ ...prev, [key]: true }));
  }, []);

  return (
    <>
      <Helmet>
        <title>Fee Structure | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Clear, flexible, and value-driven school fees at Kitale Progressive School. View our transparent fee structure for ECDE, Primary, and Junior Secondary levels." 
        />
        <meta name="keywords" content="school fees, tuition, payment plans, sibling discount, transport costs, Kitale school, CBC program" />
        <link rel="preload" as="image" href="/images/fee-structure/ecde.jpg" />
        <link rel="preload" as="image" href="/images/fee-structure/primary.jpg" />
        <link rel="preload" as="image" href="/images/fee-structure/junior.jpg" />
        <link rel="preload" as="image" href="/images/fee-structure/transport.jpg" />
      </Helmet>
      
      {/* Hero Section - Using theme page-title-section */}
      <section className="page-title-section" aria-labelledby="page-title">
        <Container>
          <h1 id="page-title" className="display-5 fw-bold">
            Clear, Flexible, and Value-Driven School Fees
          </h1>
          <p className="lead">
            We believe every parent should have clarity and confidence when planning their child's education.
          </p>
          <p className="text-gold" style={{ fontSize: '1rem' }}>
            Our fee structure is designed to be transparent, manageable, and aligned with the quality of education and care we provide.
          </p>
        </Container>
      </section>

      {/* Trust Strip - Reduced spacing */}
      <section className="py-3" style={{ background: 'var(--gray-light)', borderBottom: '1px solid #eef2f6' }}>
        <Container>
          <Row className="g-3">
            {trustPoints.map((point, idx) => (
              <Col key={idx} md={4}>
                <div className="trust-card d-flex align-items-start gap-2 p-2 bg-white rounded-3 shadow-sm" style={{ 
                  borderRadius: '14px',
                  height: '100%',
                  transition: 'all 0.3s ease'
                }}>
                  <div className="bg-navy text-white" style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <i className={`bi bi-${point.icon}`} style={{ fontSize: '1.2rem', color: 'navy' }} aria-hidden="true"></i>
                  </div>
                  <div>
                    <h3 className="h6 fw-bold mb-0 text-navy">{point.title}</h3>
                    <p className="mb-0 small text-muted">{point.description}</p>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Parent Reassurance Section - Reduced spacing */}
      <section className="py-3" style={{ background: 'white' }}>
        <Container>
          <h2 className="section-heading mb-3">Designed to Support Families</h2>
          <p className="lead text-center mx-auto text-muted small" style={{ maxWidth: '700px' }}>
            We understand that school fees are an important consideration. Our structure is designed to balance affordability with quality education, ensuring your child receives the best possible learning experience.
          </p>
        </Container>
      </section>
      
      {/* Value Justification - What Your Child Benefits From */}
      <ValueProposition />
      
      {/* Fee Structure Section */}
      <section className="py-3" style={{ background: 'var(--gray-light)' }} aria-labelledby="fee-details-heading">
        <Container>
          <h2 id="fee-details-heading" className="visually-hidden">Fee Details</h2>

          {/* Screen reader announcer */}
          <div id="class-announcer" className="visually-hidden" role="status" aria-live="polite"></div>

          {/* Fee Table Section Context */}
          <p className="text-center mb-3 text-muted small" style={{ fontSize: '0.9rem' }}>
            Select your child's level below to view the detailed fee structure.
          </p>

          {/* Class Selector */}
          <Row className="justify-content-center mb-4">
            <Col lg={10}>
              <div 
                className="bg-white p-2 rounded-3 shadow-sm"
                style={{ 
                  display: 'flex', 
                  gap: '0.75rem', 
                  borderRadius: '16px',
                  flexWrap: 'wrap'
                }}
                role="tablist"
                aria-label="Education levels"
              >
                {classCategories.map(category => (
                  <div key={category.id} role="tab" style={{ flex: 1 }}>
                    <ClassButton
                      category={category}
                      isActive={selectedClass === category.id}
                      onClick={handleClassChange}
                    />
                  </div>
                ))}
              </div>
            </Col>
          </Row>

          {/* Fee Structure Image Preview */}
          <Card className="card-custom border-0 mb-3" style={{ 
            boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'var(--primary)',
              padding: '0.75rem 1.5rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <h3 className="h6 mb-0 fw-bold">
                <i className="bi bi-receipt me-2" aria-hidden="true"></i>
                {selectedClass === 'ecde' ? 'ECDE Fee Structure' : 
                 selectedClass === 'primary' ? 'Primary School Fee Structure' : 
                 'Junior Secondary Fee Structure'}
              </h3>
              <Button 
                size="sm"
                className="btn-outline-light"
                style={{
                  borderRadius: '30px',
                  padding: '0.3rem 1rem',
                  fontWeight: '500',
                  minHeight: '36px',
                  minWidth: '36px',
                  fontSize: '0.75rem'
                }}
                onClick={handleDownloadImage}
                aria-label={`Download ${selectedClass} fee structure`}
              >
                <i className="bi bi-download me-1" aria-hidden="true"></i> Download
              </Button>
            </div>
            <Card.Body className="text-center p-3 bg-white">
              <div 
                onClick={handleViewImage} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleViewImage();
                  }
                }}
                style={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  maxWidth: '100%'
                }}
                role="button"
                tabIndex={0}
                aria-label={`View enlarged fee structure for ${selectedClass}`}
              >
                {!imageLoaded[selectedClass] && (
                  <div className="image-skeleton" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '14px'
                  }} aria-hidden="true" />
                )}
                <img 
                  src={feeImages[selectedClass]} 
                  alt={`Fee Structure for ${selectedClass}`}
                  className={`curriculum-image ${imageLoaded[selectedClass] ? 'loaded' : ''}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '14px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }}
                  onLoad={() => handleImageLoad(selectedClass)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Fee+Structure+Preview";
                  }}
                />
                <div className="image-tag" style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(13,101,251,0.95)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '30px',
                  fontSize: '0.7rem',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(5px)'
                }} aria-hidden="true">
                  <i className="bi bi-zoom-in me-1" aria-hidden="true"></i>
                  Click to enlarge
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Transport Section */}
          <Card id="transport-section" className="card-custom border-0 mb-3" style={{ 
            boxShadow: '0 15px 30px rgba(0,0,0,0.08)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'var(--primary)',
              padding: '0.75rem 1.5rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '0.75rem'
            }}>
              <h3 className="h6 mb-0 fw-bold">
                <i className="bi bi-bus-front me-2" aria-hidden="true"></i>
                Transportation Costs
              </h3>
              <Button 
                size="sm"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  padding: '0.3rem 1rem',
                  fontWeight: '500',
                  minHeight: '36px',
                  minWidth: '36px',
                  fontSize: '0.75rem'
                }}
                onClick={() => {
                  const link = document.createElement('a');
                  link.href = transportImage;
                  link.download = "Kitale_Progressive_Transport_Costs.jpg";
                  link.target = '_blank';
                  link.rel = 'noopener noreferrer';
                  link.setAttribute('aria-label', 'Download transportation costs');
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);
                }}
                aria-label="Download transportation costs"
              >
                <i className="bi bi-download me-1" aria-hidden="true"></i> Download
              </Button>
            </div>
            <Card.Body className="text-center p-3 bg-white">
              <div 
                onClick={handleViewTransportImage} 
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleViewTransportImage();
                  }
                }}
                style={{ 
                  cursor: 'pointer',
                  position: 'relative',
                  borderRadius: '14px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  maxWidth: '100%'
                }}
                role="button"
                tabIndex={0}
                aria-label="View enlarged transportation costs"
              >
                {!imageLoaded.transport && (
                  <div className="image-skeleton" style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    borderRadius: '14px'
                  }} aria-hidden="true" />
                )}
                <img 
                  src={transportImage} 
                  alt="Transportation Costs"
                  className={`curriculum-image ${imageLoaded.transport ? 'loaded' : ''}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '350px',
                    borderRadius: '14px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.1)'
                  }}
                  onLoad={() => handleImageLoad('transport')}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x400?text=Transport+Costs+Preview";
                  }}
                />
                <div className="image-tag" style={{
                  position: 'absolute',
                  bottom: '15px',
                  right: '15px',
                  backgroundColor: 'rgba(13,101,251,0.95)',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '30px',
                  fontSize: '0.7rem',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(5px)'
                }} aria-hidden="true">
                  <i className="bi bi-zoom-in me-1" aria-hidden="true"></i>
                  Click to enlarge
                </div>
              </div>
              <div className="mt-2 p-2" style={{ background: 'var(--gray-light)', borderRadius: '10px' }}>
                <p className="mb-0 small text-muted">
                  <i className="bi bi-info-circle-fill me-1 text-navy" aria-hidden="true"></i>
                  Transport routes and costs vary based on location. Contact the school for personalized guidance.
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <Row className="mt-3 g-2 mb-4">
            <Col xs={6} md={3}>
              <Button 
                className="btn-navy w-100 py-2"
                style={{
                  borderRadius: '40px',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  minHeight: '40px'
                }}
                onClick={handleViewImage}
                aria-label={`View fee structure for ${selectedClass}`}
              >
                <i className="bi bi-eye me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">View Fee</span>
                <span className="d-inline d-sm-none">Fee</span>
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button 
                className="btn-navy w-100 py-2"
                style={{
                  borderRadius: '40px',
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  minHeight: '40px'
                }}
                onClick={handleViewTransportImage}
                aria-label="View transportation costs"
              >
                <i className="bi bi-bus-front me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Transport</span>
                <span className="d-inline d-sm-none">Bus</span>
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button 
                className="btn-navy w-100 py-2"
                onClick={handleDownloadImage}
                aria-label={`Download ${showTransportImage ? 'transportation costs' : `${selectedClass} fee structure`}`}
              >
                <i className="bi bi-download me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Download</span>
                <span className="d-inline d-sm-none">DL</span>
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button 
                className="btn-navy w-100 py-2"
                onClick={handleDownloadBoth}
                aria-label="Download both fee structure and transportation costs"
              >
                <i className="bi bi-download me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Both</span>
                <span className="d-inline d-sm-none">All</span>
              </Button>
            </Col>
          </Row>

          {/* Payment Information */}
          <Row className="mt-2">
            <Col lg={12}>
              <Card className="card-custom border-0" style={{ 
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <div className="bg-primary text-white" style={{
                  padding: '1rem 1.5rem'
                }}>
                  <h2 className="h6 fw-bold mb-0 text-white">
                    <i className="bi bi-credit-card me-2" aria-hidden="true"></i>
                    Simple and Secure Payment Options
                  </h2>
                  <p className="mb-0 small opacity-75 text-white">All payments are securely processed through verified school accounts.</p>
                </div>
                <Card.Body className="p-3 bg-white">
                  {/* Bank Details */}
                  <Row className="mb-3 g-3">
                    <Col md={6}>
                      <div style={{ 
                        background: 'var(--gray-light)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        height: '100%',
                        border: '1px solid rgba(13,101,251,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-3 text-navy" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/EQUITY.png" 
                            alt="Equity Bank logo"
                            style={{ height: '25px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          ECDE & Primary
                        </h3>
                        <PaymentDetail icon="building">Equity Bank</PaymentDetail>
                        <PaymentDetail icon="hash">Account: 0330282499647</PaymentDetail>
                        <PaymentDetail icon="person-circle">Kitale Progressive School</PaymentDetail>
                      </div>
                    </Col>
                    
                    <Col md={6}>
                      <div style={{ 
                        background: 'var(--gray-light)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        height: '100%',
                        border: '1px solid rgba(13,101,251,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-3 text-navy" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/KCB.png" 
                            alt="KCB Bank logo"
                            style={{ height: '25px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          Junior Secondary
                        </h3>
                        <PaymentDetail icon="building">KCB Bank Kenya</PaymentDetail>
                        <PaymentDetail icon="hash">Account: 1305087321</PaymentDetail>
                        <PaymentDetail icon="person-circle">Kitale Progressive School</PaymentDetail>
                      </div>
                    </Col>
                  </Row>

                  {/* MPesa Paybills */}
                  <Row className="g-3">
                    <Col md={6}>
                      <div style={{ 
                        background: 'var(--gray-light)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        height: '100%',
                        border: '1px solid rgba(13,101,251,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-3 text-navy" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/MPESA.png" 
                            alt="MPesa logo"
                            style={{ height: '25px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          ECDE & Primary
                        </h3>
                        <PaymentDetail icon="hash">Paybill: <span className="fw-bold text-navy">523169</span></PaymentDetail>
                        <PaymentDetail icon="person-circle">Account: Grade + Name</PaymentDetail>
                        <div style={{
                          background: 'rgba(13,101,251,0.05)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '30px',
                          marginTop: '0.5rem'
                        }}>
                          <small className="text-muted d-block">e.g., Grade3+Andrew Junior</small>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={6}>
                      <div style={{ 
                        background: 'var(--gray-light)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        height: '100%',
                        border: '1px solid rgba(13,101,251,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-3 text-navy" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/MPESA.png" 
                            alt="MPesa logo"
                            style={{ height: '25px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          Junior Secondary
                        </h3>
                        <PaymentDetail icon="hash">Paybill: <span className="fw-bold text-navy">522533</span></PaymentDetail>
                        <PaymentDetail icon="person-circle">Account: 7842223#GRADE+NAME</PaymentDetail>
                        <div style={{
                          background: 'rgba(13,101,251,0.05)',
                          padding: '0.3rem 0.8rem',
                          borderRadius: '30px',
                          marginTop: '0.5rem'
                        }}>
                          <small className="text-muted d-block">e.g., 7842223#Grade7+Jane njambi</small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Payment Policy Section - Flexible Fee Payment Options */}
          <Row className="mt-3">
            <Col lg={12}>
              <Card className="card-custom border-0" style={{ 
                borderRadius: '20px',
                overflow: 'hidden'
              }}>
                <div className="bg-primary text-white" style={{
                  padding: '1rem 1.5rem'
                }}>
                  <h2 className="h6 fw-bold mb-0 text-white">
                    <i className="bi bi-clock-history me-2" aria-hidden="true"></i>
                    Flexible Fee Payment Options
                  </h2>
                  <p className="mb-0 small opacity-75 text-white">We offer two clear payment options to help you plan your child's education with confidence and convenience.</p>
                </div>
                <Card.Body className="p-3 bg-white">
                  <Row className="g-3">
                    <Col md={6}>
                      <div style={{ 
                        background: 'var(--gray-light)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        height: '100%'
                      }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '1.2rem' }} aria-hidden="true"></i>
                          <h3 className="h6 fw-bold mb-0 text-navy">Option 1: Full Term Payment</h3>
                        </div>
                        <p className="text-muted small mb-2">Pay the full school fees before the term begins.</p>
                        <div className="ms-2">
                          <p className="mb-1 small"><i className="bi bi-check-lg text-success me-1" aria-hidden="true"></i> Ideal for parents who prefer to settle fees in one payment</p>
                          <p className="mb-1 small"><i className="bi bi-check-lg text-success me-1" aria-hidden="true"></i> Ensures a smooth start to the school term</p>
                          <p className="mb-0 small"><i className="bi bi-check-lg text-success me-1" aria-hidden="true"></i> No follow-up payment tracking required</p>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div style={{ 
                        background: 'var(--gray-light)',
                        padding: '1.5rem',
                        borderRadius: '16px',
                        height: '100%'
                      }}>
                        <div className="d-flex align-items-center gap-2 mb-2">
                          <i className="bi bi-calendar-week text-navy" style={{ fontSize: '1.2rem' }} aria-hidden="true"></i>
                          <h3 className="h6 fw-bold mb-0 text-navy">Option 2: Instalment Payment Plan</h3>
                        </div>
                        <p className="text-muted small mb-3">Pay school fees in structured instalments across the term.</p>
                        <div className="mb-2">
                          <p className="fw-bold mb-1 text-navy small">Payment Schedule:</p>
                          <div className="ms-2">
                            <p className="mb-0 small"><span className="fw-bold">50%</span> — Before or on opening day</p>
                            <p className="mb-0 small"><span className="fw-bold">75%</span> — By the end of the first month</p>
                            <p className="mb-0 small"><span className="fw-bold">100%</span> — By mid-term</p>
                          </div>
                        </div>
                        <div className="mt-2 pt-1 border-top border-light">
                          <p className="mb-0 small"><i className="bi bi-check-lg text-success me-1" aria-hidden="true"></i> Designed to make fee payment manageable for families</p>
                          <p className="mb-0 small"><i className="bi bi-check-lg text-success me-1" aria-hidden="true"></i> Helps you spread payments while keeping your child's learning uninterrupted</p>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  <hr className="my-3" />

                  <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
                    <div>
                      <p className="mb-0 text-muted small">
                        <i className="bi bi-shield-check me-1 text-navy" aria-hidden="true"></i>
                        5% sibling discount available for families with more than one child
                      </p>
                    </div>
                    <Badge className="bg-light-custom text-navy" style={{ padding: '5px 12px', borderRadius: '30px' }}>
                      <i className="bi bi-clock me-1" aria-hidden="true"></i>
                      KES 700 interview fee
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Decision Support Section */}
      <section className="py-3" style={{ background: 'var(--gray-light)' }}>
        <Container>
          <DecisionSupport />
        </Container>
      </section>

      {/* Image Modal */}
      <ImageModal 
        selectedImage={selectedImage}
        showTransportImage={showTransportImage}
        onClose={closeModal}
        onDownload={handleDownloadImage}
        selectedClass={selectedClass}
      />

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      <style dangerouslySetInnerHTML={{ __html: `
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
        .info-card:hover,
        .info-card:focus-within {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(0,0,0,0.1) !important;
        }
        .class-selector-btn {
          transition: all 0.3s ease;
        }
        .class-selector-btn:hover {
          transform: translateY(-1px);
        }
        button:focus-visible,
        [role="button"]:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        .image-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        @media (max-width: 768px) {
          .fee-stat-badge { min-width: 80px; padding: 0.4rem 0.75rem; }
          .fee-stat-badge span:first-child { font-size: 1.2rem; }
        }
        @media (max-width: 576px) {
          .fee-stat-badge { min-width: 70px; padding: 0.3rem 0.5rem; }
          .fee-stat-badge span:first-child { font-size: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
          .info-card:hover { transform: none; }
          button:hover { transform: none !important; }
          .image-skeleton { animation: none !important; }
        }
      `}} />
    </>
  );
}

export default memo(FeeStructure);