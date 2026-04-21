// pages/Dining.jsx - Professionally Enhanced with Core Web Vitals Optimization
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { useState, useCallback, lazy, Suspense, memo, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";

const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Optimized image component with Core Web Vitals optimizations
const OptimizedImage = memo(({ src, alt, width, height, objectFit = 'cover', priority = false }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  
  // Preload critical images
  useEffect(() => {
    if (priority && src) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      link.type = src.endsWith('.webp') ? 'image/webp' : 'image/jpeg';
      document.head.appendChild(link);
      
      return () => {
        if (link.parentNode) document.head.removeChild(link);
      };
    }
  }, [priority, src]);
  
  if (error) {
    return (
      <div 
        className="bg-light-custom d-flex align-items-center justify-content-center"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: height || '200px',
          borderRadius: '16px'
        }}
        role="img"
        aria-label={`${alt} (image coming soon)`}
      >
        <div className="text-center">
          <div style={{ fontSize: '2rem' }} aria-hidden="true">🍽️</div>
          <div className="text-dark small">{alt}</div>
        </div>
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
      {!isLoaded && (
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
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`curriculum-image ${isLoaded ? 'loaded' : ''}`}
        style={{
          width: '100%',
          height: '100%',
          objectFit: objectFit,
          position: 'relative',
          zIndex: 2
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Kitchen Experience Grid Card with theme
const KitchenCard = memo(({ icon, title, description }) => (
  <div className="kitchen-card card-custom" style={{
    background: 'var(--white)',
    borderRadius: '20px',
    padding: '1.5rem',
    textAlign: 'center',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease',
    height: '100%',
    border: '1px solid rgba(13,101,251,0.08)'
  }}>
    <div className="bg-navy text-white" style={{
      width: '65px',
      height: '65px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.8rem',
      transition: 'transform 0.3s ease'
    }} aria-hidden="true">
      {icon}
    </div>
    <h3 className="card-title-navy h6 fw-bold mb-3">{title}</h3>
    <p className="text-dark mb-0 small" style={{ lineHeight: 1.6 }}>{description}</p>
  </div>
));

KitchenCard.displayName = 'KitchenCard';

// Trust Point Component with theme
const TrustPoint = memo(({ icon, title }) => (
  <div className="trust-point d-flex align-items-center gap-3 p-3 bg-white rounded-4 shadow-sm" style={{
    borderRadius: '16px',
    height: '100%',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    border: '1px solid rgba(13,101,251,0.05)'
  }}>
    <div className="bg-navy text-white" style={{
      width: '48px',
      height: '48px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0
    }}>
      <span style={{ fontSize: '1.2rem' }} aria-hidden="true">{icon}</span>
    </div>
    <p className="mb-0 fw-medium text-dark">{title}</p>
  </div>
));

TrustPoint.displayName = 'TrustPoint';

function Dining() {
  const [isDownloading, setIsDownloading] = useState(false);
  
  const weeklyMenuImage = useMemo(() => "/images/optimized/menu.webp", []);
  const pdfDocuments = useMemo(() => ({
    weeklyMenu: "/pdfs/menu.pdf"
  }), []);

  const kitchenExperience = useMemo(() => [
    { icon: "🍳", title: "Modern Kitchen", description: "Meals are prepared in a clean, organized environment that supports safe and efficient cooking." },
    { icon: "🍽️", title: "Dining Hall", description: "Learners eat in a structured, supervised setting that promotes good habits and discipline." },
    { icon: "🥗", title: "Food Preparation", description: "Our staff follow proper food handling procedures to ensure quality and hygiene at every stage." },
    { icon: "📦", title: "Food Storage", description: "Ingredients are stored safely to maintain freshness and prevent contamination." }
  ], []);

  const trustPoints = useMemo(() => [
    { icon: "🧼", title: "Hygienic food preparation" },
    { icon: "🧹", title: "Clean and well-maintained kitchen" },
    { icon: "👥", title: "Supervised meal service" }
  ], []);

  const childExperience = useMemo(() => [
    "Regular, well-timed meals",
    "Balanced diet with essential nutrients",
    "A clean and comfortable eating environment",
    "Supervision during meal times"
  ], []);

  const handleDownload = useCallback(async (pdfUrl, filename) => {
    setIsDownloading(true);
    try {
      const response = await fetch(pdfUrl);
      if (!response.ok) throw new Error('PDF not found');
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      alert('Unable to download the menu. Please contact the school.');
    } finally {
      setIsDownloading(false);
    }
  }, []);

  return (
    <>
      <Helmet>
        <title>Nutritious Meals & Dining | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Nutritious, safe, and balanced meals every day at Kitale Progressive School. View our weekly menu, learn about our kitchen standards, and see how we care for your child's well-being." 
        />
        <meta name="keywords" content="school meals, nutritious food, dining hall, healthy eating, school kitchen, Kitale school" />
        <meta property="og:title" content="Nutritious Meals & Dining | Kitale Progressive School" />
        <meta property="og:description" content="Balanced, hygienic meals prepared daily to support your child's health and academic performance." />
        <meta property="og:type" content="website" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* Hero Section - Using theme page-title-section */}
      <section className="page-title-section" aria-labelledby="page-title">
        <Container>
          <h1 id="page-title" className="display-5 fw-bold">
            Nutritious, Safe, and Balanced Meals Every Day
          </h1>
          <p className="lead">
            Are you looking for a school that ensures your child is well-fed, healthy, and cared for throughout the day?
          </p>
          <p className="text-gold" style={{ fontSize: '1rem' }}>
            At Kitale Progressive School, we provide balanced meals prepared in a clean, hygienic environment to support your child's health, growth, and academic performance.
          </p>
        </Container>
      </section>

      {/* Trust Section - A Kitchen You Can Trust */}
      <section className="py-4" style={{ background: 'var(--white)' }}>
        <Container>
          <div className="text-center mb-4">
            <div className="bg-light-custom d-flex align-items-center justify-content-center mx-auto" style={{
              width: '70px',
              height: '70px',
              borderRadius: '50%',
              marginBottom: '1rem'
            }}>
              <i className="fas fa-check-circle text-navy" style={{ fontSize: '2rem' }} aria-hidden="true"></i>
            </div>
            <h2 className="section-heading mb-3">A Kitchen You Can Trust</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '700px', fontSize: '1rem' }}>
              Our kitchen follows strict hygiene standards and food safety practices to ensure every meal served is clean, nutritious, and safe for learners.
            </p>
          </div>
          
          <Row className="g-3 justify-content-center">
            {trustPoints.map((point, idx) => (
              <Col key={idx} md={4}>
                <TrustPoint {...point} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Kitchen & Dining Experience - Grid */}
      <section className="py-4 bg-light-custom" aria-labelledby="kitchen-experience-heading">
        <Container>
          <div className="text-center mb-4">
            <h2 id="kitchen-experience-heading" className="section-heading mb-3">
              How Meals Are Prepared and Served
            </h2>
            <p className="text-muted small">Every step is designed with your child's health and well-being in mind</p>
          </div>
          
          <Row className="g-3">
            {kitchenExperience.map((item, idx) => (
              <Col key={idx} md={6} lg={3}>
                <KitchenCard {...item} />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* What Your Child Will Experience */}
      <section className="py-4" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6} className="mb-3 mb-lg-0">
              <div className="curriculum-image-wrapper" style={{ 
                boxShadow: '0 15px 30px rgba(0,0,0,0.1)',
                borderRadius: '20px'
              }}>
                <OptimizedImage 
                  src="/images/facilities/dining-hall-2.jpg"
                  alt="Students enjoying healthy meals in the school dining hall"
                  width="600"
                  height="400"
                  priority={true}
                />
              </div>
            </Col>
            <Col lg={6}>
              <div className="ps-lg-3">
                <h2 className="section-heading-left mb-3">What Your Child Will Experience</h2>
                <p className="mb-3 text-dark" style={{ lineHeight: 1.6 }}>
                  Every day, learners receive meals that support their energy, focus, and overall well-being.
                </p>
                <ul className="list-unstyled mb-3">
                  {childExperience.map((item, idx) => (
                    <li key={idx} className="mb-3 d-flex align-items-center gap-2">
                      <span className="text-gold" style={{ fontSize: '1.1rem' }} aria-hidden="true">✓</span>
                      <span className="text-dark">{item}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-3 p-2 bg-light-custom rounded-3" style={{ borderLeft: `3px solid var(--gold)` }}>
                  <p className="mb-0 text-dark small">
                    <i className="fas fa-apple-alt me-2 text-gold" aria-hidden="true"></i>
                    Meals are prepared fresh daily using high-quality ingredients
                  </p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Weekly Menu Section */}
      <section className="py-4 bg-light-custom">
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <Card className="card-custom border-0 shadow-sm overflow-hidden">
                <Card.Body className="p-4">
                  <div className="text-center mb-3">
                    <div className="d-inline-flex align-items-center gap-2 px-3 py-1 rounded-pill mb-3" style={{
                      background: 'rgba(13,101,251,0.1)',
                      color: 'var(--navy)'
                    }}>
                      <i className="fas fa-calendar-week fa-sm" aria-hidden="true"></i>
                      <span className="small fw-semibold">Weekly Menu</span>
                    </div>
                    <h2 className="section-heading mb-3">A Balanced Weekly Menu</h2>
                    <p className="text-muted small mb-3" style={{ maxWidth: '600px', margin: '0 auto' }}>
                      Our meals are planned to provide a balanced diet that supports your child's health, energy, and growth throughout the school week.
                    </p>
                  </div>

                  <div className="text-center mb-3">
                    <div className="curriculum-image-wrapper" style={{ 
                      maxHeight: '450px', 
                      overflow: 'auto',
                      borderRadius: '16px',
                      boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
                      margin: '0 auto',
                      display: 'inline-block',
                      backgroundColor: 'var(--white)'
                    }}>
                      <OptimizedImage 
                        src={weeklyMenuImage}
                        alt="Weekly balanced meal menu for students"
                        width="800"
                        height="1000"
                        objectFit="contain"
                        priority={false}
                      />
                    </div>
                  </div>

                  <div className="text-center mb-3">
                    <small className="text-muted d-flex align-items-center justify-content-center gap-2">
                      <i className="fas fa-sync-alt fa-xs" aria-hidden="true"></i>
                      Menus are reviewed regularly to ensure variety, nutrition, and quality
                    </small>
                  </div>

                  <div className="d-flex justify-content-center">
                    <Button 
                      onClick={() => handleDownload(pdfDocuments.weeklyMenu, 'Weekly_Menu.pdf')}
                      className="btn-navy"
                      disabled={isDownloading}
                      style={{ minHeight: '44px', minWidth: '180px' }}
                      aria-label="Download weekly menu PDF"
                    >
                      {isDownloading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span>Downloading...</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-download me-2" aria-hidden="true"></i>
                          Download Menu
                        </>
                      )}
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Parent Peace of Mind Section */}
      <section className="py-4" style={{ background: 'var(--white)' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="text-center mb-3">
                <div className="bg-light-custom d-flex align-items-center justify-content-center mx-auto" style={{
                  width: '70px',
                  height: '70px',
                  borderRadius: '50%',
                  marginBottom: '1rem'
                }}>
                  <i className="fas fa-heart text-navy" style={{ fontSize: '2rem' }} aria-hidden="true"></i>
                </div>
                <h2 className="section-heading mb-3">Giving Parents Peace of Mind</h2>
                <p className="text-muted small mx-auto" style={{ maxWidth: '700px' }}>
                  We understand that parents want assurance that their children are well cared for throughout the day. 
                  Our kitchen and dining services are designed to provide consistent, reliable, and healthy meals in a safe environment.
                </p>
              </div>
              
              <Row className="g-3 mt-1">
                <Col md={4}>
                  <div className="text-center p-3 bg-light-custom rounded-3 h-100">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">👥</div>
                    <p className="fw-semibold mb-0 text-dark small">Children are supervised during meals</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 bg-light-custom rounded-3 h-100">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">⏰</div>
                    <p className="fw-semibold mb-0 text-dark small">Meals are served in a structured routine</p>
                  </div>
                </Col>
                <Col md={4}>
                  <div className="text-center p-3 bg-light-custom rounded-3 h-100">
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }} aria-hidden="true">🧼</div>
                    <p className="fw-semibold mb-0 text-dark small">Hygiene and cleanliness are maintained at all times</p>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* CTA Section - Using cta-section theme */}
      <section className="cta-section">
        <Container>
          <Row className="justify-content-center text-center mt-4">
            <Col lg={8}>
              <h2 className="h3 fw-bold mb-3 text-white">
                Ready to Join a School That Cares for Your Child's Well-Being?
              </h2>
              <p className="mb-3 text-white opacity-90">
                Visit our school and see firsthand how we provide a safe, healthy, and supportive environment for every learner.
              </p>
              <div className="d-flex flex-wrap justify-content-center gap-3">
                <Link to="/admissions/apply">
                  <Button className="btn-navy" aria-label="Apply for admission">
                    <i className="fas fa-paper-plane me-2" aria-hidden="true"></i>
                    Apply Now
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button className="btn-navy" aria-label="Book a school visit">
                    <i className="fas fa-calendar-check me-2" aria-hidden="true"></i>
                    Book a School Visit
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
        .section-padding {
          padding: 60px 0;
        }
        .kitchen-card {
          transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s ease;
          will-change: transform;
        }
        .kitchen-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 15px 30px rgba(13,101,251,0.12) !important;
        }
        .kitchen-card:hover .bg-navy {
          transform: scale(1.05);
        }
        .trust-point {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .trust-point:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13,101,251,0.1) !important;
        }
        .stat-card {
          transition: transform 0.2s ease;
        }
        .stat-card:hover {
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .section-heading {
            font-size: 1.6rem;
          }
          .section-heading-left {
            font-size: 1.4rem;
          }
          .display-6 {
            font-size: 1.6rem;
          }
          .section-padding {
            padding: 40px 0;
          }
        }
        @media (max-width: 576px) {
          .section-padding {
            padding: 30px 0;
          }
          .section-heading {
            font-size: 1.4rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .kitchen-card,
          .kitchen-card:hover,
          .trust-point,
          .trust-point:hover,
          .stat-card,
          .curriculum-image,
          .image-skeleton {
            transition: none !important;
            transform: none !important;
            animation: none !important;
          }
          .kitchen-card,
          .trust-point,
          .stat-card {
            will-change: auto;
          }
          .kitchen-card:hover .bg-navy {
            transform: none;
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
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        @media (prefers-reduced-motion: reduce) {
          html {
            scroll-behavior: auto;
          }
        }
      `}} />
    </>
  );
}

export default memo(Dining);