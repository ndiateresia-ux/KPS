import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Button, Card } from "react-bootstrap";
import { useState, useCallback, memo, lazy, Suspense, useEffect } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Enhanced StatBadge component with accessibility
const StatBadge = memo(({ value, label }) => (
  <div className="fee-stat-badge" style={{
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '0.75rem 1.5rem',
    borderRadius: '50px',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'center',
    minWidth: '120px',
    boxShadow: '0 4px 15px rgba(19,47,102,0.08)',
    border: '1px solid rgba(19,47,102,0.1)'
  }}
  role="article"
  >
    <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#132f66', lineHeight: 1.2 }} aria-hidden="true">{value}</span>
    <span style={{ fontSize: '0.8rem', color: '#4a5568', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{label}</span>
    <span className="visually-hidden">{value} {label}</span>
  </div>
));

StatBadge.displayName = 'StatBadge';

// Enhanced InfoCard component with accessibility
const InfoCard = memo(({ icon, title, description }) => (
  <Col md={4}>
    <Card className="h-100 border-0 info-card" style={{
      background: 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
      overflow: 'hidden',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: 'linear-gradient(90deg, #132f66, #cebd04)'
      }} aria-hidden="true" />
      <Card.Body className="text-center p-4">
        <div style={{
          width: '70px',
          height: '70px',
          background: 'linear-gradient(135deg, rgba(19,47,102,0.1) 0%, rgba(206,189,4,0.1) 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.5rem',
          fontSize: '2.5rem',
          color: '#132f66'
        }} aria-hidden="true">
          <i className={`bi ${icon}`} aria-hidden="true"></i>
        </div>
        <h3 className="h5 fw-bold mb-2" style={{ color: '#132f66' }}>{title}</h3>
        <p className="small text-muted mb-0" style={{ lineHeight: 1.6 }}>{description}</p>
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
      style={{
        flex: 1,
        padding: '1.25rem 1rem',
        borderRadius: '16px',
        border: 'none',
        background: isActive 
          ? 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)'
          : 'white',
        color: isActive ? 'white' : '#2c3e50',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        textAlign: 'center',
        boxShadow: isActive 
          ? '0 10px 20px rgba(19,47,102,0.2)'
          : '0 5px 15px rgba(0,0,0,0.05), 0 0 0 1px rgba(0,0,0,0.02)',
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
          background: '#cebd04'
        }} aria-hidden="true" />
      )}
      <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>{category.name}</div>
      <div style={{ fontSize: '0.8rem', opacity: isActive ? 0.9 : 0.6 }}>{category.description}</div>
      {isActive && <span className="visually-hidden"> (selected)</span>}
    </button>
  );
});

ClassButton.displayName = 'ClassButton';

// Enhanced PaymentDetail component with accessibility
const PaymentDetail = memo(({ icon, children }) => (
  <p className="mb-3" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.9rem' }}>
    <span style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      background: 'linear-gradient(135deg, #132f66, #1e3a7a)',
      borderRadius: '10px',
      color: 'white',
      fontSize: '0.9rem',
      boxShadow: '0 4px 8px rgba(19,47,102,0.2)'
    }} aria-hidden="true">
      <i className={`bi ${icon}`} aria-hidden="true"></i>
    </span>
    <span style={{ color: '#2c3e50' }}>{children}</span>
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
            style={{
              background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
              color: 'white',
              border: 'none',
              padding: '0.75rem 2rem',
              borderRadius: '50px',
              cursor: 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 10px 20px rgba(19,47,102,0.3)',
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

function FeeStructure() {
  const [selectedClass, setSelectedClass] = useState("ecde");
  const [selectedImage, setSelectedImage] = useState(null);
  const [showTransportImage, setShowTransportImage] = useState(false);
  const [imageLoaded, setImageLoaded] = useState({});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
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

  const stats = [
    { value: "50%", label: "Minimum deposit" },
    { value: "5%", label: "Sibling discount" },
    { value: "KES 700", label: "Interview fee" }
  ];

  const infoCards = [
    { icon: "bi-wallet2", title: "Flexible Payment", description: "Pay in installments across the term. Contact our finance office for payment plans." },
    { icon: "bi-percent", title: "Sibling Discount", description: "5% discount for the second child and beyond." },
    { icon: "bi-bus-front", title: "Transportation", description: "Safe and reliable transport services available at separate costs." }
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
    // Download fee structure first
    const link1 = document.createElement('a');
    link1.href = feeImages[selectedClass];
    link1.download = `Kitale_Progressive_Fee_Structure_${selectedClass.toUpperCase()}.jpg`;
    link1.target = '_blank';
    link1.rel = 'noopener noreferrer';
    link1.setAttribute('aria-label', `Download fee structure for ${selectedClass}`);
    document.body.appendChild(link1);
    link1.click();
    document.body.removeChild(link1);

    // Small delay before downloading transport costs
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
    // Announce class change to screen readers
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
          content="View and download our transparent fee structure for ECDE, Primary, and Junior Secondary levels at Kitale Progressive School." 
        />
        <meta name="keywords" content="school fees, tuition, payment plans, sibling discount, transport costs, Kitale school" />
        <link rel="preload" as="image" href="/images/fee-structure/ecde.jpg" />
        <link rel="preload" as="image" href="/images/fee-structure/primary.jpg" />
        <link rel="preload" as="image" href="/images/fee-structure/junior.jpg" />
        <link rel="preload" as="image" href="/images/fee-structure/transport.jpg" />
      </Helmet>
      
      {/* Page Header with proper heading hierarchy */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #f0f4fa 0%, #ffffff 100%)',
          paddingTop: '120px',
          paddingBottom: '60px',
          borderBottom: '1px solid rgba(19,47,102,0.1)',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
        aria-labelledby="page-title"
      >
        {/* Decorative elements */}
        <div style={{
          position: 'absolute',
          top: '-50%',
          right: '-10%',
          width: '500px',
          height: '500px',
          background: 'radial-gradient(circle, rgba(19,47,102,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} aria-hidden="true" />
        <div style={{
          position: 'absolute',
          bottom: '-30%',
          left: '-10%',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(206,189,4,0.03) 0%, transparent 70%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} aria-hidden="true" />
        
        <Container style={{ position: 'relative', zIndex: 2 }}>
          <h1 id="page-title" style={{
            fontSize: 'clamp(2.2rem, 6vw, 3rem)',
            fontWeight: '800',
            color: '#132f66',
            marginBottom: '1rem',
            letterSpacing: '-0.5px'
          }}>
            Fee Structure
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            color: '#4a5568',
            maxWidth: '700px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.6
          }}>
            At Kitale Progressive School, we believe in <strong style={{ color: '#132f66' }}>transparent and affordable education</strong> for every child.
          </p>
          <p style={{ color: '#718096', marginBottom: '2rem', fontSize: '1rem' }}>
            Our fee structure is designed to be clear, competitive, and flexible for families.
          </p>
          <div 
            style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem', flexWrap: 'wrap' }}
            role="list"
            aria-label="Fee statistics"
          >
            {stats.map((stat, index) => (
              <div key={index} role="listitem">
                <StatBadge value={stat.value} label={stat.label} />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Fee Structure Section */}
      <section className="py-5" style={{ background: '#f8fafc' }} aria-labelledby="fee-details-heading">
        <Container>
          <h2 id="fee-details-heading" className="visually-hidden">Fee Details</h2>

          {/* Screen reader announcer for class changes */}
          <div id="class-announcer" className="visually-hidden" role="status" aria-live="polite"></div>

          {/* Info Cards */}
          <Row className="mb-5 g-4" role="list" aria-label="Fee information cards">
            {infoCards.map((card, index) => (
              <InfoCard key={index} icon={card.icon} title={card.title} description={card.description} />
            ))}
          </Row>

          {/* Class Selector */}
          <Row className="justify-content-center mb-5">
            <Col lg={10}>
              <div 
                style={{ 
                  display: 'flex', 
                  gap: '1rem', 
                  padding: '0.5rem', 
                  background: 'white', 
                  borderRadius: '20px', 
                  boxShadow: '0 5px 20px rgba(0,0,0,0.05)',
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
          <Card className="border-0 mb-4" style={{ 
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            borderRadius: '24px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
              padding: '1rem 2rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h3 className="h5 mb-0 fw-bold">
                <i className="bi bi-receipt me-2" aria-hidden="true"></i>
                {selectedClass === 'ecde' ? 'ECDE Fee Structure' : 
                 selectedClass === 'primary' ? 'Primary School Fee Structure' : 
                 'Junior Secondary Fee Structure'}
              </h3>
              <Button 
                size="sm"
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '30px',
                  color: 'white',
                  padding: '0.4rem 1.2rem',
                  fontWeight: '500',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onClick={handleDownloadImage}
                aria-label={`Download ${selectedClass} fee structure`}
              >
                <i className="bi bi-download me-1" aria-hidden="true"></i> Download
              </Button>
            </div>
            <Card.Body className="text-center p-4" style={{ background: 'white' }}>
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
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  maxWidth: '100%'
                }}
                role="button"
                tabIndex={0}
                aria-label={`View enlarged fee structure for ${selectedClass}`}
              >
                {!imageLoaded[selectedClass] && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '16px'
                  }} aria-hidden="true" />
                )}
                <img 
                  src={feeImages[selectedClass]} 
                  alt={`Fee Structure for ${selectedClass}`}
                  style={{
                    maxWidth: '100%',
                    maxHeight: '500px',
                    borderRadius: '16px',
                    opacity: imageLoaded[selectedClass] ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  onLoad={() => handleImageLoad(selectedClass)}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x600?text=Fee+Structure+Preview";
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(19,47,102,0.95)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '40px',
                  fontSize: '0.85rem',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }} aria-hidden="true">
                  <i className="bi bi-zoom-in me-2" aria-hidden="true"></i>
                  Click to enlarge
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Transport Image Preview */}
          <Card className="border-0 mb-4" style={{ 
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            borderRadius: '24px',
            overflow: 'hidden'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
              padding: '1rem 2rem',
              color: 'white',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '1rem'
            }}>
              <h3 className="h5 mb-0 fw-bold">
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
                  padding: '0.4rem 1.2rem',
                  fontWeight: '500',
                  minHeight: '44px',
                  minWidth: '44px'
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
            <Card.Body className="text-center p-4" style={{ background: 'white' }}>
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
                  borderRadius: '16px',
                  overflow: 'hidden',
                  display: 'inline-block',
                  maxWidth: '100%'
                }}
                role="button"
                tabIndex={0}
                aria-label="View enlarged transportation costs"
              >
                {!imageLoaded.transport && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 1.5s infinite',
                    borderRadius: '16px'
                  }} aria-hidden="true" />
                )}
                <img 
                  src={transportImage} 
                  alt="Transportation Costs"
                  style={{
                    maxWidth: '100%',
                    maxHeight: '400px',
                    borderRadius: '16px',
                    opacity: imageLoaded.transport ? 1 : 0,
                    transition: 'opacity 0.3s ease',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
                  }}
                  onLoad={() => handleImageLoad('transport')}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://via.placeholder.com/800x400?text=Transport+Costs+Preview";
                  }}
                />
                <div style={{
                  position: 'absolute',
                  bottom: '20px',
                  right: '20px',
                  backgroundColor: 'rgba(40,167,69,0.95)',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '40px',
                  fontSize: '0.85rem',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(5px)',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
                }} aria-hidden="true">
                  <i className="bi bi-zoom-in me-2" aria-hidden="true"></i>
                  Click to enlarge
                </div>
              </div>
            </Card.Body>
          </Card>

          {/* Action Buttons */}
          <Row className="mt-4 g-3">
            <Col xs={6} md={3}>
              <Button 
                className="w-100 py-3"
                style={{
                  background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 20px rgba(19,47,102,0.2)',
                  transition: 'transform 0.2s ease',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onClick={handleViewImage}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                aria-label={`View fee structure for ${selectedClass}`}
              >
                <i className="bi bi-eye me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">View Fee</span>
                <span className="d-inline d-sm-none">Fee</span>
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button 
                className="w-100 py-3"
                style={{
                  background: 'linear-gradient(135deg, #28a745 0%, #34ce57 100%)',
                  border: 'none',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 20px rgba(40,167,69,0.2)',
                  transition: 'transform 0.2s ease',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onClick={handleViewTransportImage}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                aria-label="View transportation costs"
              >
                <i className="bi bi-bus-front me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Transport</span>
                <span className="d-inline d-sm-none">Bus</span>
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button 
                className="w-100 py-3"
                style={{
                  background: 'white',
                  border: '2px solid #132f66',
                  color: '#132f66',
                  borderRadius: '50px',
                  fontWeight: '600',
                  fontSize: '0.9rem',
                  transition: 'all 0.2s ease',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onClick={handleDownloadImage}
                onMouseEnter={(e) => {
                  e.target.style.background = '#132f66';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'white';
                  e.target.style.color = '#132f66';
                }}
                aria-label={`Download ${showTransportImage ? 'transportation costs' : `${selectedClass} fee structure`}`}
              >
                <i className="bi bi-download me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Download</span>
                <span className="d-inline d-sm-none">DL</span>
              </Button>
            </Col>
            <Col xs={6} md={3}>
              <Button 
                className="w-100 py-3"
                style={{
                  background: 'linear-gradient(135deg, #cebd04 0%, #e5d424 100%)',
                  border: 'none',
                  color: '#132f66',
                  borderRadius: '50px',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                  boxShadow: '0 10px 20px rgba(206,189,4,0.3)',
                  transition: 'transform 0.2s ease',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onClick={handleDownloadBoth}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                aria-label={`Download both fee structure and transportation costs`}
              >
                <i className="bi bi-files me-2" aria-hidden="true"></i>
                <span className="d-none d-sm-inline">Both</span>
                <span className="d-inline d-sm-none">All</span>
              </Button>
            </Col>
          </Row>

          {/* Payment Information */}
          <Row className="mt-5">
            <Col lg={12}>
              <Card className="border-0" style={{ 
                background: 'white',
                borderRadius: '24px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.05)',
                overflow: 'hidden'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
                  padding: '1.5rem 2rem',
                  color: 'white'
                }}>
                  <h2 className="h5 fw-bold mb-0">
                    <i className="bi bi-credit-card me-2" aria-hidden="true"></i>
                    Payment Information
                  </h2>
                </div>
                <Card.Body className="p-4 p-lg-5">
                  {/* Bank Details */}
                  <Row className="mb-4 g-4">
                    <Col md={6}>
                      <div style={{ 
                        background: '#f8fafc',
                        padding: '2rem',
                        borderRadius: '20px',
                        height: '100%',
                        border: '1px solid rgba(19,47,102,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-4" style={{ color: '#132f66', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/EQUITY.png" 
                            alt="Equity Bank logo"
                            style={{ height: '30px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          ECDE & Primary
                        </h3>
                        <PaymentDetail icon="bi-building">Equity Bank</PaymentDetail>
                        <PaymentDetail icon="bi-hash">Account: 0330282499647</PaymentDetail>
                        <PaymentDetail icon="bi-person-circle">Kitale Progressive School</PaymentDetail>
                      </div>
                    </Col>
                    
                    <Col md={6}>
                      <div style={{ 
                        background: '#f8fafc',
                        padding: '2rem',
                        borderRadius: '20px',
                        height: '100%',
                        border: '1px solid rgba(19,47,102,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-4" style={{ color: '#132f66', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/KCB.png" 
                            alt="KCB Bank logo"
                            style={{ height: '30px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          Junior Secondary
                        </h3>
                        <PaymentDetail icon="bi-building">KCB Bank Kenya</PaymentDetail>
                        <PaymentDetail icon="bi-hash">Account: 1305087321</PaymentDetail>
                        <PaymentDetail icon="bi-person-circle">Kitale Progressive School</PaymentDetail>
                      </div>
                    </Col>
                  </Row>

                  {/* MPesa Paybills */}
                  <Row className="g-4">
                    <Col md={6}>
                      <div style={{ 
                        background: '#f8fafc',
                        padding: '2rem',
                        borderRadius: '20px',
                        height: '100%',
                        border: '1px solid rgba(19,47,102,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-4" style={{ color: '#132f66', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/MPESA.png" 
                            alt="MPesa logo"
                            style={{ height: '30px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          ECDE & Primary
                        </h3>
                        <PaymentDetail icon="bi-hash">Paybill: <span style={{ fontWeight: '700', color: '#132f66' }}>523169</span></PaymentDetail>
                        <PaymentDetail icon="bi-person-circle">Account: Grade + Name</PaymentDetail>
                        <div style={{
                          background: 'rgba(19,47,102,0.05)',
                          padding: '0.5rem 1rem',
                          borderRadius: '40px',
                          marginTop: '0.5rem'
                        }}>
                          <small className="text-muted d-block">e.g., Grade3+John Doe</small>
                        </div>
                      </div>
                    </Col>
                    
                    <Col md={6}>
                      <div style={{ 
                        background: '#f8fafc',
                        padding: '2rem',
                        borderRadius: '20px',
                        height: '100%',
                        border: '1px solid rgba(19,47,102,0.1)'
                      }}>
                        <h3 className="h6 fw-bold mb-4" style={{ color: '#132f66', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <img 
                            src="/images/fee-structure/MPESA.png" 
                            alt="MPesa logo"
                            style={{ height: '30px' }}
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.style.display = 'none';
                            }}
                          />
                          Junior Secondary
                        </h3>
                        <PaymentDetail icon="bi-hash">Paybill: <span style={{ fontWeight: '700', color: '#132f66' }}>522533</span></PaymentDetail>
                        <PaymentDetail icon="bi-person-circle">Account: 7842223#GRADE+NAME</PaymentDetail>
                        <div style={{
                          background: 'rgba(19,47,102,0.05)',
                          padding: '0.5rem 1rem',
                          borderRadius: '40px',
                          marginTop: '0.5rem'
                        }}>
                          <small className="text-muted d-block">e.g., 7842223#Grade7+Jane Doe</small>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Notes */}
          <Row className="mt-4">
            <Col lg={12}>
              <Card className="border-0" style={{ 
                background: 'linear-gradient(135deg, #fff3cd 0%, #fff9e6 100%)',
                borderRadius: '20px',
                border: '1px solid #ffe5b4',
                boxShadow: '0 10px 20px rgba(255,193,7,0.1)'
              }}>
                <Card.Body className="p-4">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <div style={{
                      width: '40px',
                      height: '40px',
                      background: '#132f66',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '1.2rem'
                    }} aria-hidden="true">
                      <i className="bi bi-clipboard-check"></i>
                    </div>
                    <h3 className="fw-bold mb-0" style={{ color: '#856404', fontSize: '1rem' }}>
                      Fee Payment Policy
                    </h3>
                  </div>
                  
                  <div style={{ 
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ background: 'rgba(255,255,255,0.7)', padding: '0.5rem 1rem', borderRadius: '40px' }}>
                      <span style={{ color: '#132f66', fontWeight: '700' }}>50%</span>
                      <span style={{ color: '#856404', marginLeft: '0.5rem' }}>Due on first day</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.7)', padding: '0.5rem 1rem', borderRadius: '40px' }}>
                      <span style={{ color: '#132f66', fontWeight: '700' }}>75%</span>
                      <span style={{ color: '#856404', marginLeft: '0.5rem' }}>By end of first month</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.7)', padding: '0.5rem 1rem', borderRadius: '40px' }}>
                      <span style={{ color: '#132f66', fontWeight: '700' }}>100%</span>
                      <span style={{ color: '#856404', marginLeft: '0.5rem' }}>By mid-term</span>
                    </div>
                  </div>

                  <hr style={{ opacity: 0.2, margin: '1rem 0' }} />

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="bi bi-check-circle-fill" style={{ color: '#28a745' }} aria-hidden="true"></i>
                      <span style={{ color: '#856404' }}>5% sibling discount</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="bi bi-check-circle-fill" style={{ color: '#28a745' }} aria-hidden="true"></i>
                      <span style={{ color: '#856404' }}>Transport costs separate</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <i className="bi bi-check-circle-fill" style={{ color: '#28a745' }} aria-hidden="true"></i>
                      <span style={{ color: '#856404' }}>KES 700 interview fee</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Image Modal with accessibility */}
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

      {/* Critical CSS with accessibility improvements */}
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
        .info-card:hover,
        .info-card:focus-within {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        button:focus-visible,
        [role="button"]:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        @media (max-width: 768px) {
          .fee-stat-badge { min-width: 90px; padding: 0.5rem 0.75rem; }
          .fee-stat-badge span:first-child { font-size: 1.25rem; }
        }
        @media (max-width: 576px) {
          .fee-stat-badge { min-width: 80px; padding: 0.4rem 0.5rem; }
          .fee-stat-badge span:first-child { font-size: 1rem; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation: none !important; transition: none !important; }
          .info-card:hover { transform: none; }
          button:hover { transform: none !important; }
        }
      `}} />
    </>
  );
}

export default memo(FeeStructure);