import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useState, useCallback, lazy, Suspense, memo } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Fallback images for error handling
const FALLBACK_IMAGES = {
  facility: "https://images.unsplash.com/photo-1562774053-701939374585?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  kitchen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  dining: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  placeholder: "https://via.placeholder.com/800x600?text=Image+Coming+Soon"
};

// Memoized facility image card component with enhanced accessibility
const FacilityImageCard = memo(({ image, alt, onClick }) => {
  const [imgSrc, setImgSrc] = useState(image);
  const [loaded, setLoaded] = useState(false);
  const cardId = `facility-${alt.replace(/\s+/g, '-').toLowerCase()}`;

  return (
    <div 
      id={cardId}
      className="facility-image-card cursor-pointer"
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label={`View larger image of ${alt}`}
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
        src={imgSrc}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.target.onerror = null;
          setImgSrc(FALLBACK_IMAGES.placeholder);
        }}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
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
          fontWeight: '500'
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
const TabButton = memo(({ eventKey, active, icon, label, onClick }) => (
  <button
    onClick={() => onClick(eventKey)}
    onKeyDown={(e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        onClick(eventKey);
      }
    }}
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
));

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
  if (!selectedImage) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div 
      role="dialog"
      aria-modal="true"
      aria-label="Image enlarged view"
      onKeyDown={handleKeyDown}
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
      onClick={onClose}
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
          }}
        >
          ✕
          <span className="visually-hidden">Close</span>
        </button>
        <img
          src={selectedImage}
          alt="Enlarged view of facility"
          style={{
            maxWidth: '100%',
            maxHeight: '90vh',
            objectFit: 'contain',
            borderRadius: '8px'
          }}
        />
      </div>
    </div>
  );
});

ImageModal.displayName = 'ImageModal';

function Facilities() {
  const [activeTab, setActiveTab] = useState("boarding");
  const [selectedImage, setSelectedImage] = useState(null);

  // Boarding facility images
  const boardingImages = {
    dormitory: "/images/facilities/dormitory.jpg",
    commonRoom: "/images/facilities/common-room.jpg",
    dining: "/images/facilities/dining-hall.jpg",
    studyArea: "/images/facilities/study-area.jpg",
    recreation: "/images/facilities/recreation.jpg",
    chapel: "/images/facilities/chapel.jpg"
  };

  // Kitchen and menu images
  const kitchenImages = {
    kitchen: "/images/facilities/kitchen.jpg",
    diningHall: "/images/facilities/dining-hall-2.jpg",
    foodPrep: "/images/facilities/food-preparation.jpg",
    storage: "/images/facilities/food-storage.jpg"
  };

  // Images you will provide
  const weeklyMenuImage = "/images/menu.png";
  const boardingItemsImage = "/images/boarding-items.jpg";

  // PDF documents
  const pdfDocuments = {
    itemsList: "/pdfs/boarding-items-list.pdf",
    weeklyMenu: "/pdfs/weekly-menu.pdf"
  };

  // Boarding daily routine
  const dailyRoutine = [
    { time: "6:00 AM - 6:45 AM", activity: "Morning Prep (Study Time)" },
    { time: "7:00 AM - 7:45 AM", activity: "Breakfast" },
    { time: "8:00 AM - 5:00 PM", activity: "Classes (with breaks)" },
    { time: "5:00 PM - 6:00 PM", activity: "Sports & Recreation" },
    { time: "6:00 PM - 7:00 PM", activity: "Personal Time/Shower" },
    { time: "7:00 PM - 8:00 PM", activity: "Supper" },
    { time: "8:00 PM - 9:00 PM", activity: "Evening Prep (Homework)" },
    { time: "9:00 PM", activity: "Lights Out (Younger Students)" },
    { time: "10:00 PM", activity: "Lights Out (Older Students)" }
  ];

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

  return (
    <>
      <Helmet>
        <title>Facilities | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Explore our modern boarding facilities, kitchen, dining hall, and other amenities at Kitale Progressive School." 
        />
      </Helmet>
      
      {/* Page Header with proper heading hierarchy */}
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
                    image={boardingImages.dormitory} 
                    alt="Dormitory" 
                    onClick={() => handleViewImage(boardingImages.dormitory)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    image={boardingImages.commonRoom} 
                    alt="Common Room" 
                    onClick={() => handleViewImage(boardingImages.commonRoom)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    image={boardingImages.dining} 
                    alt="Dining Hall" 
                    onClick={() => handleViewImage(boardingImages.dining)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    image={boardingImages.studyArea} 
                    alt="Study Area" 
                    onClick={() => handleViewImage(boardingImages.studyArea)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    image={boardingImages.recreation} 
                    alt="Recreation Area" 
                    onClick={() => handleViewImage(boardingImages.recreation)}
                  />
                </Col>
                <Col md={4} role="listitem">
                  <FacilityImageCard 
                    image={boardingImages.chapel} 
                    alt="Chapel" 
                    onClick={() => handleViewImage(boardingImages.chapel)}
                  />
                </Col>
              </Row>

              {/* Daily Routine - Beautiful alternating rows */}
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

                      {/* Table Rows with alternating colors */}
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
                        <img 
                          src={boardingItemsImage} 
                          alt="Boarding Items Checklist"
                          loading="lazy"
                          style={{ 
                            maxHeight: '400px', 
                            width: 'auto', 
                            maxWidth: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGES.placeholder;
                          }}
                        />
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
                    image={kitchenImages.kitchen} 
                    alt="Modern Kitchen" 
                    onClick={() => handleViewImage(kitchenImages.kitchen)}
                  />
                </Col>
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    image={kitchenImages.diningHall} 
                    alt="Dining Hall" 
                    onClick={() => handleViewImage(kitchenImages.diningHall)}
                  />
                </Col>
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    image={kitchenImages.foodPrep} 
                    alt="Food Preparation" 
                    onClick={() => handleViewImage(kitchenImages.foodPrep)}
                  />
                </Col>
                <Col md={6} role="listitem">
                  <FacilityImageCard 
                    image={kitchenImages.storage} 
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
                        <img 
                          src={weeklyMenuImage} 
                          alt="Weekly Menu"
                          loading="lazy"
                          style={{ 
                            maxHeight: '500px', 
                            width: 'auto', 
                            maxWidth: '100%',
                            borderRadius: '8px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = FALLBACK_IMAGES.placeholder;
                          }}
                        />
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
      <ImageModal selectedImage={selectedImage} onClose={closeModal} />

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
        
        .facility-image-card {
          transition: transform 0.3s ease;
        }
        .facility-image-card:hover,
        .facility-image-card:focus-visible {
          transform: scale(1.02);
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        .facility-image-card:hover img,
        .facility-image-card:focus-visible img {
          transform: scale(1.05);
        }

        /* Routine Table Styles */
        .routine-header {
          display: flex;
          padding: 1rem 1.5rem;
          background: linear-gradient(135deg, #132f66 0%, #1e3a7a 100%);
          color: white;
          border-radius: 12px 12px 0 0;
          font-weight: 700;
          font-size: 1rem;
          letter-spacing: 0.5px;
        }

        .time-column {
          width: 200px;
        }

        .activity-column {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .activity-icon {
          font-size: 1.2rem;
          min-width: 24px;
        }

        .routine-body {
          border: 1px solid #e9ecef;
          border-top: none;
          border-radius: 0 0 12px 12px;
          overflow: hidden;
        }

        .routine-row {
          display: flex;
          padding: 1rem 1.5rem;
          border-bottom: 1px solid #e9ecef;
          transition: all 0.2s ease;
        }

        .routine-row:last-child {
          border-bottom: none;
        }

        .routine-row-even {
          background-color: #ffffff;
        }

        .routine-row-odd {
          background-color: #f8fafc;
        }

        .routine-row:hover,
        .routine-row:focus-within {
          background-color: #e6f0ff !important;
          transform: scale(1.01);
          box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          position: relative;
          z-index: 1;
          outline: 3px solid #cebd04;
          outline-offset: -3px;
        }

        /* Special activity styling */
        .routine-row.prep-time {
          border-left: 4px solid #4299e1;
        }

        .routine-row.meal-time {
          border-left: 4px solid #cebd04;
        }

        .routine-row.lights-out {
          border-left: 4px solid #4a5568;
        }

        .routine-legend {
          display: flex;
          gap: 2rem;
          margin-top: 1rem;
          font-size: 0.85rem;
          color: #4a5568;
        }

        .routine-legend span {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        button:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }

        @media (max-width: 768px) {
          .routine-header {
            display: none;
          }

          .routine-row {
            flex-direction: column;
            gap: 0.5rem;
            padding: 1rem;
          }

          .time-column {
            width: 100%;
            font-weight: 700;
            color: #132f66;
          }

          .activity-column {
            margin-left: 0;
          }

          .routine-legend {
            flex-wrap: wrap;
            gap: 1rem;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .facility-image-card,
          .facility-image-card img,
          .routine-row,
          * {
            transition: none !important;
            animation: none !important;
          }
          .routine-row:hover {
            transform: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(Facilities);