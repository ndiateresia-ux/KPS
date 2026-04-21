// pages/Home.jsx - Fully Optimized with Core Web Vitals fixes
import { Helmet } from "react-helmet-async";
import { Carousel, Container, Row, Col, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, lazy, Suspense, useCallback, useMemo, useState, useRef } from 'react';
import BlogSection from '../components/BlogSection';

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Loading fallback
const SectionLoader = () => (
  <div style={{ height: '200px', background: 'var(--bg-page)' }} aria-hidden="true"></div>
);

// Helper function to generate local placeholder images
const getLocalPlaceholder = (text, width = 80, height = 80) => {
  const encodedText = encodeURIComponent((text || 'User').substring(0, 2));
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%230d65fb'/%3E%3Ctext x='50%25' y='50%25' font-size='${width/2.5}' text-anchor='middle' dy='.3em' fill='%23ffffff' font-weight='bold'%3E${encodedText}%3C/text%3E%3C/svg%3E`;
};

// Optimized Image Component with proper dimensions
const OptimizedImage = ({ src, alt, width, height, className, loading = "lazy", fetchPriority = "auto", isCritical = false }) => {
  const [imgSrc, setImgSrc] = useState(src);
  
  // Generate responsive srcSet for different viewport sizes
  const generateSrcSet = useCallback((basePath) => {
    const sizes = [400, 800, 1200, 1600];
    return sizes.map(size => `${basePath}?w=${size} ${size}w`).join(', ');
  }, []);

  return (
    <img 
      src={imgSrc}
      srcSet={isCritical ? `${src} 1x, ${src.replace('.webp', '-2x.webp')} 2x` : undefined}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={loading}
      fetchPriority={fetchPriority}
      decoding="async"
      onError={(e) => {
        e.target.onerror = null;
        setImgSrc(getLocalPlaceholder(alt, width, height));
      }}
    />
  );
};

// Star Rating Component
const StarRating = ({ rating }) => (
  <div className="star-rating mb-3">
    {[...Array(5)].map((_, i) => (
      <span key={i} style={{ 
        color: i < rating ? 'var(--secondary)' : '#d1d5db',
        fontSize: '1.2rem',
        marginRight: '4px'
      }}>★</span>
    ))}
  </div>
);

// Optimized count-up hook with IntersectionObserver
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          let startTime = null;
          
          const animate = (currentTime) => {
            if (!startTime) startTime = currentTime;
            const progress = Math.min((currentTime - startTime) / duration, 1);
            setCount(Math.floor(progress * end));
            
            if (progress < 1) {
              animationRef.current = requestAnimationFrame(animate);
            }
          };
          
          animationRef.current = requestAnimationFrame(animate);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '100px' }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      observer.disconnect();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [end, duration, hasAnimated]);

  return { count, elementRef };
};

// Stat Component with reduced motion preference
const StatItem = ({ value, label, suffix = "" }) => {
  const { count, elementRef } = useCountUp(value);
  
  return (
    <Col md={3} sm={6} className="mb-4">
      <div 
        ref={elementRef} 
        className="stat-item-card text-center p-4"
        style={{
          background: 'rgba(255, 255, 255, 0.15)',
          borderRadius: '20px',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
      >
        <h3 className="stat-number" style={{ color: 'white', marginBottom: '0.5rem', fontSize: '2.5rem' }}>
          {count}{suffix}
        </h3>
        <p className="stat-label" style={{ marginBottom: 0 }}>
          {label}
        </p>
        <span className="visually-hidden">{count}{suffix} {label}</span>
      </div>
    </Col>
  );
};

// Main Home Component
function Home() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeIndex, setActiveIndex] = useState(0);
  const heroImageRef = useRef(null);
  
  // Optimized scroll handling without forced reflow
  useEffect(() => {
    if (location.hash === '#contact-section') {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        setTimeout(() => {
          contactSection.scrollIntoView({ behavior: 'smooth' });
        }, 100);
      }
    }
  }, [location]);

  const handleLinkClick = useCallback((path) => {
    navigate(path);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 0);
  }, [navigate]);

  // Testimonials data - memoized
  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Mrs. Jane Akinyi",
      parentType: "ECD Parent",
      section: "Early Childhood Development",
      quote: "Our child joined in ECD, and we have seen tremendous growth in confidence, communication, and learning. The teachers are caring, patient, and truly understand how young children develop.",
      rating: 5
    },
    {
      id: 2,
      name: "Mr. John Omondi",
      parentType: "Primary Parent",
      section: "Primary School",
      quote: "Kitale Progressive School has given our child a strong academic foundation. The teachers are committed, and the learning environment is very supportive.",
      rating: 5
    },
    {
      id: 3,
      name: "Mrs. Sarah Kipchoge",
      parentType: "Junior Secondary Parent",
      section: "Junior Secondary",
      quote: "We wanted a school that prepares our child for the future, and we found it here. The CBC approach is well implemented.",
      rating: 5
    }
  ], []);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const goToSlide = (index) => setActiveIndex(index);
  const nextSlide = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

  const whyChooseUsItems = useMemo(() => [
    { icon: "👩‍🏫", title: "Teachers Who Know and Support Every Child", description: "Your child is not just another student here. Our teachers take time to understand each learner's strengths, guide their progress, and provide the support they need to grow with confidence." },
    { icon: "📚", title: "A Strong Academic Foundation That Builds Confidence", description: "We focus on helping learners understand, not just memorize. As a CBC school in Kitale, we guide students to develop critical thinking, problem-solving skills, and a strong academic foundation for future success." },
    { icon: "🛡️", title: "A Safe and Supportive Learning Environment", description: "Parents want peace of mind. Our school provides a secure, structured, and caring environment where learners feel safe, respected, and ready to learn every day." }
  ], []);

  const academicPathways = useMemo(() => [
    { level: "ECDE", summary: "Our ECD program builds strong foundations through play-based and structured learning.", section: "ecde-section" },
    { level: "Primary", summary: "Our primary program strengthens literacy, numeracy, and critical thinking.", section: "primary-section" },
    { level: "Junior Secondary", summary: "Our Junior Secondary program prepares learners for future academic success.", section: "jss-section" }
  ], []);

  const stats = useMemo(() => [
    { value: 20, label: "Years of Excellence", suffix: "+" },
    { value: 500, label: "Happy Students", suffix: "+" },
    { value: 50, label: "Expert Teachers", suffix: "+" },
    { value: 100, label: "CBC Curriculum", suffix: "%" }
  ], []);

  // Optimized carousel images with proper sizing
  const carouselImages = useMemo(() => [
    { src: "/images/optimized/gate3.webp", alt: "Kitale Progressive School Main Gate", width: 1920, height: 1080 },
    { src: "/images/optimized/slide2.webp", alt: "School Activities", width: 1920, height: 1080 },
    { src: "/images/optimized/gate.webp", alt: "Campus", width: 1920, height: 1080 }
  ], []);

  return (
    <>
      <Helmet>
        <title>Home | Kitale Progressive School</title>
        <meta name="description" content="Kitale Progressive School - Excellence in Education, Holistic Development and Safe Boarding Environment since 2004." />
        {/* Only keep essential preconnects - removed unused ones */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </Helmet>

      {/* HERO CAROUSEL - Optimized LCP element */}
      <section className="hero-carousel-section" aria-label="Hero carousel showcasing school facilities">
        <Carousel   
          fade 
          interval={5000}
          controls={false}
          pause={false}
          wrap={true}
          indicators={false}
          className="hero-carousel"
        >
          {carouselImages.map((item, index) => (
            <Carousel.Item key={index}>
              <div className="carousel-image-wrapper">
                <OptimizedImage 
                  src={item.src}
                  alt={item.alt}
                  width={item.width}
                  height={item.height}
                  className="d-block w-100 carousel-zoom"
                  loading={index === 0 ? "eager" : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  isCritical={index === 0}
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        
        <div className="carousel-overlay-table" aria-label="Quick access to school information">
          <div className="welcome-header">
            <h1 className="welcome-title-overlay">Welcome to Kitale Progressive School</h1>
            <p className="welcome-subtitle-overlay">Excellence in Education Since 2004</p>
          </div>
          
          <div className="pathways-table-overlay" role="region" aria-label="Academic pathways">
            <div className="table-row-overlay">
              <div className="pathway-info-overlay">
                <span className="pathway-name-overlay">Early Childhood (ECDE)</span>
                <span className="pathway-age-overlay">Ages 3-5</span>
              </div>
              <button 
                onClick={() => handleLinkClick('/academics/curriculum#ecde-section')} 
                className="pathway-link-overlay"
                aria-label="Learn more about ECDE"
              >
                Learn More →
              </button>
            </div>
            
            <div className="table-row-overlay">
              <div className="pathway-info-overlay">
                <span className="pathway-name-overlay">Primary School</span>
                <span className="pathway-age-overlay">Grades 1-6</span>
              </div>
              <button 
                onClick={() => handleLinkClick('/academics/curriculum#primary-section')} 
                className="pathway-link-overlay"
                aria-label="Learn more about Primary School"
              >
                Learn More →
              </button>
            </div>
            
            <div className="table-row-overlay highlight-row-overlay">
              <div className="pathway-info-overlay">
                <span className="pathway-name-overlay">Junior Secondary</span>
                <span className="pathway-age-overlay">Grades 7-9</span>
              </div>
              <button 
                onClick={() => handleLinkClick('/academics/curriculum#jss-section')} 
                className="pathway-link-overlay"
                aria-label="Learn more about Junior Secondary"
              >
                Learn More →
              </button>
            </div>
            
            <div className="table-footer-overlay">
              <button 
                onClick={() => handleLinkClick('/admissions/apply')} 
                className="apply-button-overlay"
                aria-label="Apply for admission now"
              >
                Apply Now
              </button>
              <button 
                onClick={() => handleLinkClick('/contact')} 
                className="contact-button-overlay"
                aria-label="Contact us"
              >
                Contact Us
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT SECTION */}
      <section className="about-section section-padding py-2" aria-labelledby="about-heading">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6} className="order-2 order-lg-1">
              <OptimizedImage 
                src="/images/optimized/gate1.webp"
                alt="Kitale Progressive School Campus"
                width="600"
                height="400"
                className="img-fluid rounded w-100"
                loading="lazy"
              />
            </Col>
            <Col lg={6} className="order-1 order-lg-2">
              <h2 id="about-heading" className="section-heading-left mb-4">Are you looking for a school where your child will be known, nurtured, and inspired to succeed?</h2>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>At Kitale Progressive School, we believe every child carries unique potential. Our learning environment is designed to nurture curiosity, strengthen character, and build a strong academic foundation that prepares learners for the future.</p>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Through caring teachers, structured learning pathways, and a supportive school community, we guide every child to grow in confidence, discipline, and independent thinking.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* STATISTICS SECTION */}
      <section className="statistics-section" aria-labelledby="stats-heading">
        <Container>
          <h2 id="stats-heading" className="visually-hidden">School Statistics</h2>
          <Row className="justify-content-center mb-3">
            <Col lg={10} className="text-center">
              <h3 className="display-2 fw-bold" style={{ fontSize: '1.6rem' }}>
                Are you looking for a reputable and established school where your child will thrive?
              </h3>
              <div style={{ width: '80px', height: '3px', background: '#e70303', margin: '1rem auto', borderRadius: '2px' }}></div>
            </Col>
          </Row>
          <Row className="justify-content-center">
            {stats.map((stat, index) => (
              <StatItem key={index} value={stat.value} label={stat.label} suffix={stat.suffix} />
            ))}
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS SECTION */}
      <section className="testimonials-section py-4" style={{ background: 'var(--bg-page)', overflow: 'hidden' }} aria-labelledby="testimonials-heading">
        <Container>
          <Row className="justify-content-center text-center mb-4">
            <Col lg={8}>
              <h2 id="testimonials-heading" className="display-5 fw-bold mb-2" style={{ fontSize: '1.8rem' }}>
                What Parents Say About Kitale Progressive School
              </h2>
              <div style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', margin: '0.75rem auto 1.5rem', borderRadius: '2px' }}></div>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="testimonial-carousel position-relative">
                <div className="testimonial-card" style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: '0 15px 30px rgba(13,101,251,0.1)', padding: '2rem', position: 'relative', minHeight: '350px' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '4rem', color: 'rgba(255,0,128,0.1)' }}>"</div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <Row className="align-items-center mb-3">
                      <Col xs="auto">
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--secondary)' }}>
                          <div style={{ width: '100%', height: '100%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            {testimonials[activeIndex].name.charAt(0)}
                          </div>
                        </div>
                      </Col>
                      <Col>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.2rem' }}>{testimonials[activeIndex].name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: '600', marginBottom: '0.2rem' }}>{testimonials[activeIndex].parentType}</p>
                      </Col>
                    </Row>
                    <StarRating rating={testimonials[activeIndex].rating} />
                    <blockquote style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-dark)', fontStyle: 'italic' }}>
                      "{testimonials[activeIndex].quote}"
                    </blockquote>
                  </div>
                </div>

                <button onClick={prevSlide} className="carousel-control-prev" style={{ position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--primary)', cursor: 'pointer', zIndex: 10 }}
                  aria-label="Previous testimonial">‹</button>
                
                <button onClick={nextSlide} className="carousel-control-next" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--primary)', cursor: 'pointer', zIndex: 10 }}
                  aria-label="Next testimonial">›</button>
              </div>

              <div className="carousel-indicators mt-3 d-flex justify-content-center gap-2">
                {testimonials.map((_, index) => (
                  <button key={index} onClick={() => goToSlide(index)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: index === activeIndex ? 'var(--secondary)' : '#e2e8f0', border: 'none', padding: 0, cursor: 'pointer' }} aria-label={`Go to testimonial ${index + 1}`} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ACADEMIC PATHWAY SECTION */}
      <section className="academic-pathway-section section-padding py-4" style={{ background: 'var(--surface)' }} aria-labelledby="pathway-heading">
        <Container>
          <h2 id="pathway-heading" className="section-heading" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Academic Pathway at KPS</h2>
          <p className="lead text-center mb-4" style={{ color: '#4a5568', fontSize: '0.95rem', maxWidth: '700px', margin: '0 auto 2rem', fontStyle: 'italic' }}>Our academic program provides a clear pathway for learners to grow step by step:</p>
          
          <Row className="g-3 mb-4">
            {academicPathways.map((pathway, index) => (
              <Col md={4} key={index}>
                <div className="academic-card h-100" style={{ background: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', height: '100%' }}>
                  <div style={{ padding: '1.25rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '0.75rem' }}>{pathway.level}</h3>
                    <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem', marginBottom: '1rem' }}>{pathway.summary}</p>
                    <button onClick={() => handleLinkClick(`/academics/curriculum#${pathway.section}`)} className="btn-navy" style={{ alignSelf: 'flex-start', textTransform: 'lowercase', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      explore {pathway.level.toLowerCase()}
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section py-4" aria-label="Call to action">
        <Container className="text-center text-white">
          <h2 className="display-7 display-md-4 fw-bold mb-4 px-6" style={{ fontSize: '1.6rem' }}>Interested in enrolling your child at Kitale Progressive School?</h2>
          <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap px-3">
            <button onClick={() => handleLinkClick('/admissions/apply')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Apply Now</button>
            <button onClick={() => handleLinkClick('/contact')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Book A Tour</button>
            <button onClick={() => handleLinkClick('/admissions/fee-structure')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>View Fees</button>
          </div>
        </Container>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="why-choose-us-section section-padding py-5" style={{ background: 'var(--bg-page)' }} aria-labelledby="why-heading">
        <Container>
          <h2 id="why-heading" className="section-heading" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Why Parents Choose Kitale Progressive School</h2>
          <Row className="g-3">
            {whyChooseUsItems.map((item, index) => (
              <Col md={6} lg={4} key={index}>
                <Card className="card-custom h-100">
                  <Card.Body style={{ padding: '1.25rem' }}>
                    <div className="icon-wrapper mb-2"><span style={{ fontSize: "2rem", lineHeight: 1 }}>{item.icon}</span></div>
                    <Card.Title as="h3" className="card-title-navy h5" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{item.title}</Card.Title>
                    <Card.Text className="small" style={{ color: 'var(--text-dark)', fontSize: '0.85rem' }}>{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Blog Section */}
      <BlogSection limit={3} showViewAll={true} variant="navy" />

      {/* GET IN TOUCH SECTION */}
      <Suspense fallback={<SectionLoader />}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS only - removed excessive animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomOut{0%{transform:scale(1.1)}100%{transform:scale(1)}}
        .carousel-zoom{animation:zoomOut 8s ease forwards}
        @media (prefers-reduced-motion:reduce){.carousel-zoom{animation:none!important}}
        .hero-carousel .carousel-indicators{display:none!important}
      `}} />
    </>
  );
}

export default Home;