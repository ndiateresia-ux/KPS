// pages/Home.jsx - Fully Optimized with Proper Heading Hierarchy
import { Helmet } from "react-helmet-async";
import { Carousel, Container, Row, Col, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, lazy, Suspense, useCallback, useMemo, useState, useRef } from 'react'; // ✅ useEffect is now included
import BlogSection from '../components/BlogSection';

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Loading fallback
const SectionLoader = () => (
  <div style={{ height: '200px', background: 'var(--bg-page)' }} aria-hidden="true"></div>
);

// Helper function to generate local placeholder images (fixes ERR_CONNECTION_CLOSED)
const getLocalPlaceholder = (text, width = 80, height = 80) => {
  const encodedText = encodeURIComponent((text || 'User').substring(0, 2));
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}'%3E%3Crect width='100%25' height='100%25' fill='%230d65fb'/%3E%3Ctext x='50%25' y='50%25' font-size='${width/2.5}' text-anchor='middle' dy='.3em' fill='%23ffffff' font-weight='bold'%3E${encodedText}%3C/text%3E%3C/svg%3E`;
};

// Image with fallback component
const ImageWithFallback = ({ src, alt, width, height, style, className }) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = useCallback(() => {
    if (!hasError) {
      setHasError(true);
      setImgSrc(getLocalPlaceholder(alt || 'img', width || 80, height || 80));
    }
  }, [hasError, alt, width, height]);

  return (
    <img 
      src={imgSrc} 
      alt={alt} 
      className={className}
      style={style}
      width={width}
      height={height}
      loading="lazy"
      onError={handleError}
    />
  );
};

// Star Rating Component
const StarRating = ({ rating }) => {
  return (
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
};

// Optimized count-up hook
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);
  const rafRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (observerRef.current) observerRef.current.disconnect();
        }
      },
      { threshold: 0.3, rootMargin: '50px' }
    );

    if (elementRef.current) observerRef.current.observe(elementRef.current);

    return () => {
      if (observerRef.current) observerRef.current.disconnect();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let lastProgress = 0;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      if (Math.abs(progress - lastProgress) > 0.01 || progress === 1) {
        setCount(Math.floor(progress * end));
        lastProgress = progress;
      }
      
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [isVisible, end, duration]);

  return { count, elementRef };
};

// Stat Component
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
          transition: 'transform 0.3s ease',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
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
  
  useEffect(() => {
    if (location.hash === '#contact-section') {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        requestAnimationFrame(() => {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          contactSection.setAttribute('tabindex', '-1');
          contactSection.focus({ preventScroll: true });
        });
      }
    } else {
      requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
    }
  }, [location]);

  const handleLinkClick = useCallback((path) => {
    navigate(path);
    requestAnimationFrame(() => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }, [navigate]);

  const goToSlide = (index) => setActiveIndex(index);
  const nextSlide = () => setActiveIndex((current) => (current + 1) % testimonials.length);
  const prevSlide = () => setActiveIndex((current) => (current - 1 + testimonials.length) % testimonials.length);

 

  const testimonials = useMemo(() => [
    {
      id: 1,
      name: "Mrs. Jane Akinyi",
      parentType: "ECD Parent",
      section: "Early Childhood Development",
      quote: "Our child joined in ECD, and we have seen tremendous growth in confidence, communication, and learning. The teachers are caring, patient, and truly understand how young children develop.",
      image: "/images/testimonials/ecd-parent.jpg",
      rating: 5
    },
    {
      id: 2,
      name: "Mr. John Omondi",
      parentType: "Primary Parent",
      section: "Primary School",
      quote: "Kitale Progressive School has given our child a strong academic foundation. The teachers are committed, and the learning environment is very supportive.",
      image: "/images/testimonials/primary-parent.jpg",
      rating: 5
    },
    {
      id: 3,
      name: "Mrs. Sarah Kipchoge",
      parentType: "Junior Secondary Parent",
      section: "Junior Secondary",
      quote: "We wanted a school that prepares our child for the future, and we found it here. The CBC approach is well implemented.",
      image: "/images/testimonials/jss-parent.jpg",
      rating: 5
    },
    {
      id: 4,
      name: "Mr. David Mwangi",
      parentType: "Boarding Parent",
      section: "Boarding Program",
      quote: "The boarding environment is safe, structured, and well managed. As a parent, I have peace of mind.",
      image: "/images/testimonials/boarding-parent.jpg",
      rating: 5
    },
    {
      id: 5,
      name: "Mrs. Grace Otieno",
      parentType: "General Parent",
      section: "Parent",
      quote: "What stands out is how the school combines strong academics with character development.",
      image: "/images/testimonials/general-parent.jpg",
      rating: 5
    }
  ], []);
  
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const whyChooseUsItems = useMemo(() => [
    { icon: "👩‍🏫", title: "Teachers Who Know and Support Every Child", description: "Your child is not just another student here. Our teachers take time to understand each learner's strengths, guide their progress, and provide the support they need to grow with confidence." },
    { icon: "📚", title: "A Strong Academic Foundation That Builds Confidence", description: "We focus on helping learners understand, not just memorize. As a CBC school in Kitale, we guide students to develop critical thinking, problem-solving skills, and a strong academic foundation for future success." },
    { icon: "🛡️", title: "A Safe and Supportive Learning Environment", description: "Parents want peace of mind. Our school provides a secure, structured, and caring environment where learners feel safe, respected, and ready to learn every day." },
    { icon: "⚽", title: "Balanced Education Beyond the Classroom", description: "Learning does not stop in the classroom. From sports to clubs and creative activities, learners develop confidence, teamwork, and life skills that shape their overall growth." },
    { icon: "🌟", title: "Character and Leadership Development", description: "We prepare learners for life, not just exams. Through guidance, responsibility, and school programs, students grow into disciplined, confident, and responsible individuals." },
    { icon: "🗺️", title: "A Clear Pathway for Your Child's Growth", description: "Parents want continuity and direction. From Early Childhood Development to Junior Secondary, we provide a structured academic journey that supports your child at every stage of their development." }
  ], []);

  const academicPathways = useMemo(() => [
    { level: "ECDE", summary: "Our ECD program builds strong foundations through play-based and structured learning that develops curiosity, creativity, and confidence.", image: "ECDE3", section: "ecde-section", btnText: "explore ecde" },
    { level: "Primary", summary: "Our primary program strengthens literacy, numeracy, and critical thinking while encouraging creativity and independent learning.", image: "computer1", section: "primary-section", btnText: "explore primary" },
    { level: "Junior Secondary", summary: "Our Junior Secondary program prepares learners for future academic and career pathways through advanced curriculum and leadership development.", image: "jss", section: "jss-section", btnText: "explore jss" },
  ], []);

  const learningApproaches = useMemo(() => [
    { title: "Student-Centered Learning", description: "Learners actively participate through discussions, projects, and practical activities." },
    { title: "Character & Leadership Development", description: "Programs nurture responsibility, discipline, and leadership skills." },
    { title: "Technology-Enhanced Learning", description: "ICT tools support digital literacy and modern learning experiences." },
  ], []);

  const stats = useMemo(() => [
    { value: 20, label: "Years of Excellence", suffix: "+" },
    { value: 500, label: "Happy Students", suffix: "+" },
    { value: 50, label: "Expert Teachers", suffix: "+" },
    { value: 100, label: "CBC Curriculum", suffix: "%" }
  ], []);

  const carouselImages = useMemo(() => [
    { webp: "/images/optimized/gate3.webp", jpg: "/images/optimized/gate3.jpg", alt: "Kitale Progressive School Main Gate" },
    { webp: "/images/optimized/slide2.webp", jpg: "/images/optimized/slide2.jpg", alt: "School Activities" },
    { webp: "/images/optimized/gate.webp", jpg: "/images/optimized/gate.jpg", alt: "Campus" },
    { webp: "/images/optimized/classroom2.webp", jpg: "/images/optimized/classroom2.jpg", alt: "Classroom" }
  ], []);

  return (
    <>
      <Helmet>
        <title>Home | Kitale Progressive School</title>
        <meta name="description" content="Kitale Progressive School - Excellence in Education, Holistic Development and Safe Boarding Environment since 2004." />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Helmet>

      {/* HERO CAROUSEL - LCP element with responsive WebP images */}
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
                <picture>
                  <source 
                    srcSet={item.webp}
                    type="image/webp"
                  />
                  <img 
                      className="d-block w-100 carousel-zoom" 
                      src={item.jpg}
                      srcSet={`${item.jpg} 1x, ${item.webp} 2x`}
                      alt={item.alt}
                      loading={index === 0 ? "eager" : "lazy"}
                      fetchpriority={index === 0 ? "high" : "auto"} 
                      width="1920"
                      height="1080"
                      decoding="async"
                      style={{ objectFit: 'cover', width: '100%', height: '100%' }}
                    />
                   </picture>
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

      {/* ABOUT SECTION - h2 as section heading */}
      <section className="about-section section-padding py-2" aria-labelledby="about-heading">
        <Container>
          <Row className="align-items-center g-4">
            <Col lg={6} className="order-2 order-lg-1">
              <picture>
                <source srcSet="/images/optimized/gate1.webp" type="image/webp" />
                <img src="/images/optimized/gate1.jpg" alt="Kitale Progressive School Campus" className="img-fluid rounded w-100" loading="lazy" width="600" height="400" decoding="async" />
              </picture>
            </Col>
            <Col lg={6} className="order-1 order-lg-2">
              <h3 id="about-heading" className="section-heading-left mb-4">Are you looking for a school where your child will be known, nurtured, and inspired to succeed?</h3>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>At Kitale Progressive School, we believe every child carries unique potential. Our learning environment is designed to nurture curiosity, strengthen character, and build a strong academic foundation that prepares learners for the future.</p>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem', marginBottom: '0.75rem' }}>Through caring teachers, structured learning pathways, and a supportive school community, we guide every child to grow in confidence, discipline, and independent thinking.</p>
              <p style={{ color: 'var(--text-dark)', fontSize: '0.95rem' }}>As a trusted private school in Kitale, on the north-rift of Kenya, we serve families seeking quality CBC education from Early Childhood Development to Junior Secondary, providing a safe and nurturing environment where every learner is supported to succeed.</p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* STATISTICS SECTION - h2 visually hidden for SEO */}
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
          <Row className="justify-content-center mt-4">
            <Col lg={8}>
              <div className="quote-block p-3 text-center" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(5px)', borderRadius: '16px', borderLeft: '4px solid var(--secondary)', boxShadow: '0 8px 20px rgba(0,0,0,0.05)' }}>
                <p className="lead mb-0" style={{ fontSize: '1rem', color: 'var(--text-dark)', fontStyle: 'italic', fontWeight: '500', lineHeight: 1.5 }}>
                  Parents in Kenya and East Africa choose our school because we combine strong academic standards with a supportive environment where children are encouraged to grow and excel.
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* TESTIMONIALS SECTION - h2 as section heading */}
      <section className="testimonials-section py-4" style={{ background: 'var(--bg-page)', overflow: 'hidden' }} aria-labelledby="testimonials-heading">
        <Container>
          <Row className="justify-content-center text-center mb-4">
            <Col lg={8}>
              <h3 id="testimonials-heading" className="display-5 fw-bold mb-2" style={{ fontSize: '1.8rem' }}>
                What Parents Say About Kitale Progressive School
              </h3>
              <div style={{ width: '80px', height: '3px', background: 'linear-gradient(90deg, var(--primary), var(--secondary))', margin: '0.75rem auto 1.5rem', borderRadius: '2px' }}></div>
              <p className="lead" style={{ color: 'var(--text-dark)', fontSize: '1rem', maxWidth: '700px', margin: '0 auto' }}>
                Hear from parents who have experienced the growth, care, and academic progress of their children at our school.
              </p>
            </Col>
          </Row>

          <Row className="justify-content-center">
            <Col lg={10}>
              <div className="testimonial-carousel position-relative">
                <div className="testimonial-card" style={{ background: 'var(--surface)', borderRadius: '24px', boxShadow: '0 15px 30px rgba(13,101,251,0.1)', padding: '2rem', position: 'relative', border: '1px solid rgba(255,0,128,0.2)', transition: 'all 0.5s ease', minHeight: '350px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div style={{ position: 'absolute', top: '15px', left: '20px', fontSize: '4rem', color: 'rgba(255,0,128,0.1)', fontFamily: 'Georgia, serif', lineHeight: 1, zIndex: 1 }}>"</div>
                  <div style={{ position: 'relative', zIndex: 2 }}>
                    <Row className="align-items-center mb-3">
                      <Col xs="auto">
                        <div style={{ width: '60px', height: '60px', borderRadius: '50%', overflow: 'hidden', border: '2px solid var(--secondary)', boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}>
                          <ImageWithFallback 
                            src={testimonials[activeIndex].image} 
                            alt={testimonials[activeIndex].name}
                            width={60}
                            height={60}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                      </Col>
                      <Col>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.2rem' }}>{testimonials[activeIndex].name}</h3>
                        <p style={{ fontSize: '0.85rem', color: 'var(--secondary)', fontWeight: '600', marginBottom: '0.2rem' }}>{testimonials[activeIndex].parentType}</p>
                        <p style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0' }}>{testimonials[activeIndex].section}</p>
                      </Col>
                    </Row>
                    <StarRating rating={testimonials[activeIndex].rating} />
                    <blockquote style={{ fontSize: '1rem', lineHeight: 1.6, color: 'var(--text-dark)', fontStyle: 'italic', marginBottom: '1.5rem', paddingRight: '1.5rem' }}>
                      "{testimonials[activeIndex].quote}"
                    </blockquote>
                    <div className="social-snapshot d-flex align-items-center mt-2">
                      <div className="d-flex me-3">
                        {[1,2,3].map((_, i) => (
                          <div key={i} style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#e2e8f0', marginLeft: i > 0 ? '-8px' : '0', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: 'var(--primary)', fontWeight: 'bold' }}>
                            {i === 2 ? '+12' : ''}
                          </div>
                        ))}
                      </div>
                      <span style={{ color: 'var(--text-dark)', fontSize: '0.85rem' }}><strong>15+ parents</strong> shared similar experiences</span>
                    </div>
                  </div>
                </div>

                <button onClick={prevSlide} className="carousel-control-prev" style={{ position: 'absolute', left: '-15px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--primary)', color: 'var(--primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10, boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'var(--surface)'; e.target.style.color = 'var(--primary)'; }}
                  aria-label="Previous testimonial">‹</button>
                
                <button onClick={nextSlide} className="carousel-control-next" style={{ position: 'absolute', right: '-15px', top: '50%', transform: 'translateY(-50%)', width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface)', border: '2px solid var(--primary)', color: 'var(--primary)', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.3s ease', zIndex: 10, boxShadow: '0 3px 10px rgba(0,0,0,0.1)' }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--primary)'; e.target.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'var(--surface)'; e.target.style.color = 'var(--primary)'; }}
                  aria-label="Next testimonial">›</button>
              </div>

              <div className="carousel-indicators mt-3 d-flex justify-content-center gap-2">
                {testimonials.map((_, index) => (
                  <button key={index} onClick={() => goToSlide(index)} style={{ width: '8px', height: '8px', borderRadius: '50%', background: index === activeIndex ? 'var(--secondary)' : '#e2e8f0', border: 'none', padding: 0, cursor: 'pointer', transition: 'all 0.3s ease', transform: index === activeIndex ? 'scale(1.2)' : 'scale(1)' }} aria-label={`Go to testimonial ${index + 1}`} />
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ACADEMIC PATHWAY SECTION - h1? This is a major section heading */}
      <section className="academic-pathway-section section-padding py-4" style={{ background: 'var(--surface)' }} aria-labelledby="pathway-heading">
        <Container>
          <h2 id="pathway-heading" className="section-heading" style={{ fontSize: '1.8rem', marginBottom: '0.75rem' }}>Academic Pathway at KPS</h2>
          <h3 className="text-center fw-light mb-4" style={{ fontSize: 'clamp(1.2rem, 2.5vw, 1.5rem)', color: 'var(--text-dark)', maxWidth: '800px', margin: '0 auto 1.5rem' }}>Are you seeking a school that gives your child a strong educational foundation?</h3>
          <p className="lead text-center mb-4" style={{ color: '#4a5568', fontSize: '0.95rem', maxWidth: '700px', margin: '0 auto 2rem', fontStyle: 'italic' }}>Our academic program provides a clear pathway for learners to grow step by step:</p>
          
          <Row className="g-3 mb-4">
            {academicPathways.map((pathway, index) => (
              <Col md={4} key={index}>
                <div className="academic-card h-100" style={{ background: 'var(--surface)', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 8px 20px rgba(0,0,0,0.06)', transition: 'transform 0.3s ease', height: '100%', display: 'flex', flexDirection: 'column' }}>
                  <div className="academic-image-container" style={{ height: '160px', overflow: 'hidden', background: '#f0f4fa' }}>
                    <ImageWithFallback 
                      src={`/images/optimized/${pathway.image}.webp`} 
                      alt={pathway.level}
                      width="100%"
                      height="160px"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--primary)', marginBottom: '0.75rem' }}>{pathway.level}</h3>
                    <p style={{ color: 'var(--text-dark)', fontSize: '0.85rem', marginBottom: '1rem', flex: 1 }}>{pathway.summary}</p>
                    <button onClick={() => handleLinkClick(`/academics/curriculum#${pathway.section}`)} className="btn-navy" style={{ alignSelf: 'flex-start', marginTop: 'auto', textTransform: 'lowercase', fontSize: '0.85rem', padding: '0.5rem 1rem' }}>
                      {pathway.btnText}
                    </button>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
          
          <p className="text-center" style={{ fontSize: '0.9rem', color: 'var(--text-dark)', maxWidth: '800px', margin: '2.5rem auto 0', lineHeight: 1.5, padding: '1rem', borderRadius: '8px', borderLeft: '3px solid var(--secondary)' }}>
            Each stage builds on the previous one, helping learners develop knowledge, discipline, and independent thinking that prepares them for future success.
          </p>
        </Container>
      </section>

      {/* CTA SECTION 1 - h2 for section */}
      <section className="cta-section py-4" aria-label="Call to action">
        <Container className="text-center text-white">
          <h2 className="display-7 display-md-4 fw-bold mb-4 px-6" style={{ fontSize: '1.6rem' }}>Interested in enrolling your child at Kitale Progressive School?</h2>
          <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap px-3">
            <button onClick={() => handleLinkClick('/admissions/apply')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Apply Now</button>
            <button onClick={() => handleLinkClick('/contact')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Book A Tour</button>
            <button onClick={() => handleLinkClick('/admissions/fee-structure')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>View Fees</button>
          </div>
          <p className="lead mb-0 px-3 mt-2" style={{ fontSize: '0.9rem' }}>Our goal is to develop learners who are confident, capable, and prepared for the next stage of their education and life.</p>
        </Container>
      </section>

      {/* WHY CHOOSE US SECTION - h2 as section heading */}
      <section className="why-choose-us-section section-padding py-5" style={{ background: 'var(--bg-page)' }} aria-labelledby="why-heading">
        <Container>
          <h2 id="why-heading" className="section-heading" style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>Why Parents Choose Kitale Progressive School</h2>
          <p className="lead text-center mb-4 px-3 px-md-5" style={{ maxWidth: "900px", margin: "0 auto 1.5rem", color: 'var(--text-dark)', fontSize: '0.95rem' }}>Parents choose Kitale Progressive School because we combine strong academic excellence with a nurturing and supportive environment where every child is guided to discover their potential and grow in confidence.</p>
          <p className="lead text-center mb-4 px-3 px-md-5" style={{ maxWidth: "900px", margin: "0 auto 2rem", color: 'var(--text-dark)', fontSize: '0.95rem' }}>As a trusted CBC school in Kitale, we focus on developing not only academic skills, but also character, discipline, and leadership. Our goal is to build a school community where parents feel informed, involved, and confident in their child's learning journey.</p>
          <Row className="g-3" role="list" aria-label="Reasons to choose our school">
            {whyChooseUsItems.map((item, index) => (
              <Col md={6} lg={4} key={index} role="listitem">
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

      {/* CTA SECTION 2 - h2 as section heading */}
      <section className="cta-section py-4" aria-label="Call to action">
        <Container className="text-center text-white">
          <h2 className="display-9 display-md-4 fw-bold mb-2 px-3" style={{ fontSize: '1.4rem' }}>Ready to give your child a school environment where they will truly grow and succeed?</h2>
          <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap px-3">
            <button onClick={() => handleLinkClick('/admissions/apply')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Apply Now</button>
            <button onClick={() => handleLinkClick('/contact')} className="btn-navy" style={{ padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}>Book A Tour</button>
          </div>
        </Container>
      </section>
      
      {/* YOUTUBE VIDEO SECTION - h2 as section heading */}
      <section className="video-section py-4" style={{ background: 'var(--bg-page)' }} aria-labelledby="video-heading">
        <Container>
          <Row className="g-4 align-items-center">
            <Col lg={6}>
              <h2 className="section-heading-left" style={{ fontSize: '1.5rem', marginBottom: '0.75rem' }}>Do you want your child to enjoy a balanced school experience where they grow in confidence, build friendships, and discover their talents?</h2>
              <p style={{ fontSize: '0.95rem', color: 'var(--text-dark)', lineHeight: 1.6, marginBottom: 0 }}>Education is not only about books. Our learners grow through sports, creative arts, leadership opportunities, and team activities that develop confidence and social skills. School life encourages learners to discover their talents, build friendships, and develop a strong sense of belonging.</p>
            </Col>
            <Col lg={6}>
              <p className="video-caption mb-2" style={{ fontSize: '0.9rem', color: 'var(--text-dark)', fontWeight: 500, fontStyle: 'italic', borderLeft: '3px solid var(--secondary)', paddingLeft: '0.75rem' }}>Take a glimpse into daily school life where learning, friendship, and discovery happen every day.</p>
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px', boxShadow: '0 15px 30px rgba(13,101,251,0.12)', marginBottom: '1.5rem' }}>
                <iframe src="https://www.youtube-nocookie.com/embed/Vomydkvag_w" title="School Life at Kitale Progressive School" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }} />
              </div>
            </Col>
          </Row>
          <Row className="mt-4">
            <Col lg={12}>
              <h3 className="section-heading mb-3" style={{ fontSize: '1.4rem' }}>School Life Highlights</h3>
              <Row className="g-2">
                <Col xs={6} md={3}><div className="highlight-block p-2 bg-white rounded-2 h-100" style={{ background: 'var(--text-dark)', border: '1px solid rgba(13,101,251,0.08)', transition: 'all 0.2s ease', cursor: 'default', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><span style={{ fontSize: '1.5rem', display: 'flex', marginBottom: '0.5rem', background: 'rgba(13,101,251,0.02)', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>⚽</span><h4 className="h6 mb-0" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>Sports and Physical Development</h4></div></Col>
                <Col xs={6} md={3}><div className="highlight-block p-2 bg-white rounded-2 h-100" style={{ background: 'var(--text-dark)', border: '1px solid rgba(13,101,251,0.08)', transition: 'all 0.2s ease', cursor: 'default', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><span style={{ fontSize: '1.5rem', display: 'flex', marginBottom: '0.5rem', background: 'rgba(13,101,251,0.02)', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>🎨</span><h4 className="h6 mb-0" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>Clubs and Talent Development</h4></div></Col>
                <Col xs={6} md={3}><div className="highlight-block p-2 bg-white rounded-2 h-100" style={{ background: 'var(--text-dark)', border: '1px solid rgba(13,101,251,0.08)', transition: 'all 0.2s ease', cursor: 'default', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><span style={{ fontSize: '1.5rem', display: 'flex', marginBottom: '0.5rem', background: 'rgba(13,101,251,0.02)', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>🎉</span><h4 className="h6 mb-0" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>School Events and Celebrations</h4></div></Col>
                <Col xs={6} md={3}><div className="highlight-block p-2 bg-white rounded-2 h-100" style={{ background: 'var(--text-dark)', border: '1px solid rgba(13,101,251,0.08)', transition: 'all 0.2s ease', cursor: 'default', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}><span style={{ fontSize: '1.5rem', display: 'flex', marginBottom: '0.5rem', background: 'rgba(13,101,251,0.02)', width: '40px', height: '40px', alignItems: 'center', justifyContent: 'center', borderRadius: '10px' }}>👥</span><h4 className="h6 mb-0" style={{ color: 'var(--text-dark)', fontWeight: 600, fontSize: '0.8rem', lineHeight: 1.3 }}>Student Leadership Opportunities</h4></div></Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* OUR LEARNING APPROACH SECTION - h2 as section heading */}
      <section className="learning-approach-section section-padding py-4" style={{ background: 'var(--surface)' }} aria-labelledby="approach-heading">
        <Container>
          <h2 id="approach-heading" className="section-heading" style={{ fontSize: '1.8rem', marginBottom: '2rem' }}>Our Approach to Learning and Student Development</h2>
          <p className="text-center mb-3" style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>Learning at Kitale Progressive School encourages curiosity, critical thinking, creativity, and character development.</p>
          <p className="text-center mb-4" style={{ color: 'var(--text-dark)', fontSize: '0.9rem' }}>Our approach ensures that learning is not just about passing exams, but about developing skills that prepare learners for real life.</p>
          <Row className="g-3 justify-content-center" role="list" aria-label="Learning approaches">
            {learningApproaches.map((point, index) => (
              <Col md={6} lg={4} key={index} role="listitem">
                <Card className="card-custom border-0 text-center h-100" style={{ background: '#f8f9fa', borderRadius: '12px' }}>
                  <Card.Body style={{ padding: '1.25rem' }}>
                    <Card.Title as="h3" className="card-title-navy h5" style={{ fontSize: '1rem', marginBottom: '0.5rem' }}>{point.title}</Card.Title>
                    <Card.Text className="small" style={{ color: 'var(--text-dark)', fontSize: '0.85rem' }}>{point.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA SECTION 3 - h2 as section heading */}
      <section className="cta-section py-4" aria-label="Call to action">
        <Container className="text-center text-white">
          <h2 className="display-9 display-md-4 fw-bold mb-2 px-3" style={{ fontSize: '1.4rem' }}>Ready to give your child a school environment where they will truly grow and succeed?</h2>
          <div className="text-center mt-3">
            <button onClick={() => handleLinkClick('/academics/curriculum')} className="btn-navy" style={{color: '#ffffff', border: 'none', minHeight: '40px', minWidth: '40px', borderRadius: '30px', padding: '0.5rem 1.5rem', fontWeight: '600', fontSize: '0.9rem' }}>Explore Full Curriculum</button>
          </div>
        </Container>
      </section>

      {/* Blog Section - h2 handled inside BlogSection */}
      <BlogSection limit={3} showViewAll={true} variant="navy" />

      {/* ADMISSIONS CTA SECTION - h2 as section heading */}
      <section className="admissions-home-cta py-4" style={{ background: 'var(--primary)' }}>
        <Container>
          <Row className="justify-content-center text-center text-white">
            <Col lg={10}>
              <h2 style={{ fontSize: 'clamp(1.5rem, 3.5vw, 1.8rem)', fontWeight: '700', marginBottom: '0.75rem', color: '#ffffff' }}>Are you ready to give your child the best start in their educational journey?</h2>
              <p style={{ fontSize: '0.95rem', marginBottom: '1rem', color: 'rgba(255,255,255,0.9)', maxWidth: '800px', margin: '0 auto 1rem' }}>We welcome families seeking a supportive and inspiring learning environment. Start the admissions process today or schedule a visit to experience our school community.</p>
              <p style={{ fontSize: '0.9rem', marginBottom: '1.5rem', color: 'rgba(255,255,255,0.85)', fontStyle: 'italic', borderLeft: '3px solid #ffffff', paddingLeft: '0.75rem', maxWidth: '700px', margin: '0 auto 1.5rem' }}>"Our admissions team will guide you through every step of the enrollment process."</p>
              <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <button onClick={() => handleLinkClick('/admissions/apply')} className="btn-navy" style={{ background: '#ffffff', color: 'var(--primary)', border: 'none', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--secondary)'; e.target.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#ffffff'; e.target.style.color = 'var(--primary)'; }}>Apply Now</button>
                <button onClick={() => handleLinkClick('/contact')} className="btn-navy" style={{ background: 'transparent', border: '2px solid #ffffff', color: '#ffffff', padding: '0.5rem 1.25rem', fontSize: '0.9rem' }}
                  onMouseEnter={(e) => { e.target.style.background = 'var(--secondary)'; e.target.style.color = '#ffffff'; }}
                  onMouseLeave={(e) => { e.target.style.background = '#ffffff'; e.target.style.color = 'var(--primary)'; }}>Contact Us</button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* GET IN TOUCH SECTION - h2 handled inside GetInTouch component */}
      <Suspense fallback={<SectionLoader />}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS - Minimal animations, most styles are in your theme.css */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomOut{0%{transform:scale(1.2)}100%{transform:scale(1)}}
        .carousel-zoom{animation:zoomOut 8s ease forwards}
        @media (max-width:768px){.carousel-zoom{animation:zoomOut 6s ease forwards}}
        @media (prefers-reduced-motion:reduce){.carousel-zoom{animation:none!important}}
        .stat-item-card:hover{transform:translateY(-5px)}
        body, h1, h2, h3, h4, h5, h6, p, span, li, a, button, input, textarea, select, label {
          font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
        }
        /* Hide carousel dots */
        .hero-carousel .carousel-indicators {
          display: none !important;
        }
        .carousel-indicators {
          display: none !important;
        }
      `}} />
    </>
  );
}

export default Home;