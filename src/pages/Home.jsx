import { Helmet } from "react-helmet-async";
import { Carousel, Container, Row, Col, Button, Card } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import React, { useEffect, lazy, Suspense, useCallback, useMemo, useState, useRef } from 'react';

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Loading fallback
const SectionLoader = () => (
  <div style={{ height: '200px', background: '#f8fafc' }} aria-hidden="true"></div>
);

// Custom hook for count-up animation with intersection observer
const useCountUp = (end, duration = 2000) => {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible) return;
    
    let startTime;
    let animationFrame;
    let startValue = 0;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [isVisible, end, duration]);

  return { count, elementRef };
};

// Simple Stat Component with accessibility
const StatItem = ({ value, label, suffix = "" }) => {
  const { count, elementRef } = useCountUp(value);
  
  return (
    <Col md={3} sm={6} className="mb-4">
      <div ref={elementRef} className="text-center" role="article">
        <h3 style={{ 
          fontSize: 'clamp(2.5rem, 5vw, 3.5rem)', 
          fontWeight: '800', 
          color: '#132f66',
          lineHeight: 1.2,
          marginBottom: '0.25rem'
        }} aria-hidden="true">
          {count}{suffix}
        </h3>
        <p style={{ 
          fontSize: '1rem', 
          color: '#4a5568',
          fontWeight: '500',
          textTransform: 'uppercase',
          letterSpacing: '1px',
          marginBottom: 0
        }}>
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
  
  // Handle scrolling with RAF
  useEffect(() => {
    if (location.hash === '#contact-section') {
      const contactSection = document.getElementById('contact-section');
      if (contactSection) {
        requestAnimationFrame(() => {
          contactSection.scrollIntoView({ behavior: 'smooth' });
          // Set focus for keyboard users
          contactSection.setAttribute('tabindex', '-1');
          contactSection.focus({ preventScroll: true });
        });
      }
    } else {
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  }, [location]);

  const handleLinkClick = useCallback((path) => {
    navigate(path);
    requestAnimationFrame(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }, [navigate]);

  // Memoized data
  const whyChooseUsItems = useMemo(() => [
    {
      title: "Qualified & Experienced Teachers",
      description: "Our teachers are highly trained and experienced, ensuring your child gets the best guidance and support.",
    },
    {
      title: "Modern Learning Facilities",
      description: "We provide well-equipped classrooms, science labs, and libraries to enhance interactive learning.",
    },
    {
      title: "Safe Boarding Environment",
      description: "Our boarding facilities are secure and nurturing, giving students a home-away-from-home experience.",
    },
    {
      title: "Strong Academic Performance",
      description: "We consistently achieve top academic results through structured and innovative teaching methods.",
    },
    {
      title: "Leadership & Character Development",
      description: "Students are encouraged to develop leadership skills and strong moral character through various programs.",
    },
    {
      title: "Technology-Integrated Learning",
      description: "We integrate modern technology in classrooms to prepare students for the digital world.",
    },
  ], []);

  const academicPathways = useMemo(() => [
    {
      level: "ECDE",
      summary: "Foundational learning that develops curiosity, creativity, and social skills for young learners.",
      image: "/images/ECDE3.jpg",
      section: "ecde-section"
    },
    {
      level: "Primary",
      summary: "Structured academic programs combining CBC excellence with values-based education.",
      image: "/images/computer1.jpg",
      section: "primary-section"
    },
    {
      level: "Junior Secondary School (JSS)",
      summary: "Advanced curriculum preparing students for senior secondary and holistic personal development.",
      image: "/images/jss.jpg",
      section: "junior-section"
    },
  ], []);

  const learningApproaches = useMemo(() => [
    {
      title: "Active Learning",
      description: "Students engage through hands-on activities, discussions, and problem-solving tasks.",
    },
    {
      title: "Technology Integration",
      description: "We leverage modern digital tools to enhance understanding and innovation.",
    },
    {
      title: "Collaborative Learning",
      description: "Encouraging teamwork, peer mentoring, and group projects to build social and leadership skills.",
    },
    {
      title: "Personalized Learning",
      description: "Tailoring lessons to each child's strengths, interests, and pace for optimal growth.",
    },
  ], []);

  // Stats data - simple without icons
  const stats = useMemo(() => [
    { value: 20, label: "Years of Excellence", suffix: "+" },
    { value: 500, label: "Happy Students", suffix: "+" },
    { value: 50, label: "Expert Teachers", suffix: "+" },
    { value: 100, label: "CBC Curriculum", suffix: "%" }
  ], []);

  return (
    <>
      <Helmet>
        <title>Home | Kitale Progressive School</title>
        <meta
          name="description"
          content="Kitale Progressive School - Excellence in Education, Holistic Development and Safe Boarding Environment since 2004."
        />
      </Helmet>

      {/* HERO CAROUSEL - LCP element with zoom effect */}
      <section className="hero-carousel-section" aria-label="Hero carousel showcasing school facilities">
        <Carousel   
          fade 
          interval={5000}
          controls={false}
          pause={false}
          wrap={true}
          className="hero-carousel"
        >
          {[1, 2, 3, 4].map((item) => (
            <Carousel.Item key={item}>
              <div className="carousel-image-wrapper">
                <img 
                  className="d-block w-100 carousel-zoom" 
                  src={item === 1 ? "/images/gate3.jpg" : 
                      item === 2 ? "/images/slide2.jpg" : 
                      item === 3 ? "/images/gate.jpg" : 
                      "/images/classroom2.jpg"} 
                  alt={`Kitale Progressive School ${item === 1 ? 'Main Gate' : item === 2 ? 'School Activities' : item === 3 ? 'Campus' : 'Classroom'}`}
                  loading={item === 1 ? "eager" : "lazy"}
                  fetchpriority={item === 1 ? "high" : "auto"}
                  width="1920"
                  height="1080"
                />
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
        
        {/* Overlay table */}
        <div className="carousel-overlay-table" aria-label="Quick access to school information">
          <div className="welcome-header">
            <h2 className="welcome-title-overlay">Welcome to Kitale Progressive School</h2>
            <p className="welcome-subtitle-overlay">Excellence in Education Since 2004</p>
          </div>
          
          <div className="pathways-table-overlay" role="region" aria-label="Academic pathways">
            {/* ECDE Row */}
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
            
            {/* Primary Row */}
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
            
            {/* JSS Row - Highlighted */}
            <div className="table-row-overlay highlight-row-overlay">
              <div className="pathway-info-overlay">
                <span className="pathway-name-overlay">Junior Secondary</span>
                <span className="pathway-age-overlay">Grades 7-9</span>
              </div>
              <button 
                onClick={() => handleLinkClick('/academics/curriculum#junior-section')} 
                className="pathway-link-overlay"
                aria-label="Learn more about Junior Secondary"
              >
                Learn More →
              </button>
            </div>
            
            {/* Footer Buttons */}
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
      <section className="about-section section-padding bg-white py-5" aria-labelledby="about-heading">
        <Container>
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6} className="order-2 order-lg-1">
              <img 
                src="/images/gate1.jpg" 
                alt="Kitale Progressive School Campus" 
                className="img-fluid rounded shadow-custom w-100"
                loading="lazy"
                width="600"
                height="400"
              />
            </Col>
            <Col lg={6} className="order-1 order-lg-2">
              <h2 id="about-heading" className="section-heading-left h1 h2-md">Welcome to Kitale Progressive School</h2>
              <p className="lead lead-sm">
                Kitale Progressive School is a premier Day and Boarding institution dedicated
                to academic excellence and holistic child development. We follow the
                Competency-Based Curriculum (CBC) and nurture learners to become confident,
                disciplined, and responsible citizens.
              </p>
              <p className="lead lead-sm">
                At Kitale Progressive School, we believe every child is a unique gift. From Playgroup to Junior School (Grade 9), we combine CBC academic excellence with deep-rooted Christian values. Within our safe and nurturing environment, your child is known by name, guided with love, and disciplined with care to become a confident, high-achieving leader.
              </p>
              <p className="lead lead-sm">
                Our modern facilities, experienced teachers, and structured learning environment
                ensure that every child reaches their full potential.
              </p>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ACADEMIC PATHWAY */}
      <section className="academic-pathway-section section-padding bg-white py-5" aria-labelledby="pathway-heading">
        <Container>
          <h2 id="pathway-heading" className="section-heading h1 h2-md">Academic Pathway at KPS</h2>
          <Row className="g-4" role="list" aria-label="Academic pathways">
            {academicPathways.map((item, index) => (
              <Col md={6} lg={4} key={index} role="listitem">
                <Card className="card-custom h-100 border-0">
                  <div className="academic-image-container">
                    <Card.Img 
                      variant="top" 
                      src={item.image} 
                      alt={`${item.level} classroom activities`}
                      className="academic-card-image"
                      loading="lazy"
                      width="400"
                      height="200"
                    />
                  </div>
                  <Card.Body className="d-flex flex-column">
                    <Card.Title as="h3" className="card-title-navy-large h4">
                      {item.level}
                    </Card.Title>
                    <Card.Text className="flex-grow-1">{item.summary}</Card.Text>
                    <Button 
                      onClick={() => handleLinkClick(`/academics/curriculum#${item.section}`)} 
                      variant="warning"
                      className="mt-3 align-self-start"
                      aria-label={`Learn more about ${item.level}`}
                      style={{ minHeight: '44px', minWidth: '44px' }}
                    >
                      Read More
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* WHY CHOOSE US */}
      <section className="why-choose-us-section section-padding bg-light-custom py-5" aria-labelledby="why-heading">
        <Container>
          <h2 id="why-heading" className="section-heading h1 h2-md">Why Choose Us</h2>
          <p className="lead text-center mb-5 px-3 px-md-5" style={{ maxWidth: "900px", margin: "0 auto 3rem" }}>
            At <strong>Kitale Progressive School</strong>, every child's journey is at the heart of what we do. 
            We provide a nurturing and balanced environment where academics, creativity, and character development go hand in hand.
          </p>
          <Row className="g-4" role="list" aria-label="Reasons to choose our school">
            {whyChooseUsItems.map((item, index) => (
              <Col md={6} lg={4} key={index} role="listitem">
                <Card className="card-custom h-100 border-0">
                  <Card.Body>
                    <Card.Title as="h3" className="card-title-navy h5">{item.title}</Card.Title>
                    <Card.Text className="small">{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* STATISTICS SECTION - Simple stats with animated counters */}
      <section className="stats-section py-5" style={{ background: '#ece507' }} aria-labelledby="stats-heading">
        <Container>
          <h2 id="stats-heading" className="visually-hidden">School Statistics</h2>
          <Row className="justify-content-center">
            {stats.map((stat, index) => (
              <StatItem 
                key={index}
                value={stat.value}
                label={stat.label}
                suffix={stat.suffix}
              />
            ))}
          </Row>
        </Container>
      </section>

      {/* OUR LEARNING APPROACH */}
      <section className="learning-approach-section section-padding bg-white py-5" aria-labelledby="approach-heading">
        <Container>
          <h2 id="approach-heading" className="section-heading h1 h2-md">Our Learning Approach</h2>
          <p className="text-center mb-5 px-3" style={{ maxWidth: "800px", margin: "0 auto 3rem" }}>
            At Kitale Progressive School, we use a blended, learner-centered approach to empower students to become confident, creative, and independent learners.
          </p>
          <Row className="g-4" role="list" aria-label="Learning approaches">
            {learningApproaches.map((point, index) => (
              <Col md={6} lg={3} key={index} role="listitem">
                <Card className="card-custom border-0 text-center bg-light-custom h-100">
                  <Card.Body>
                    <Card.Title as="h3" className="card-title-navy h5" style={{ fontSize: "1.2rem" }}>
                      {point.title}
                    </Card.Title>
                    <Card.Text className="small">{point.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-5">
            <Button 
              onClick={() => handleLinkClick('/academics/curriculum')} 
              variant="outline-navy" 
              className="px-4 px-md-5"
              aria-label="Explore full curriculum"
              style={{ minHeight: '44px', minWidth: '44px' }}
            >
              Explore Full Curriculum
            </Button>
          </div>
        </Container>
      </section>

      {/* YOUTUBE VIDEO SECTION */}
      <section className="video-section py-5" style={{ background: '#f8fafc' }} aria-labelledby="video-heading">
        <Container>
          <Row className="align-items-center">
            <Col lg={6} className="mb-4 mb-lg-0">
              <h2 id="video-heading" style={{
                fontSize: 'clamp(1.8rem, 5vw, 2.2rem)',
                fontWeight: '700',
                color: '#132f66',
                marginBottom: '1rem'
              }}>
                School Life at a Glance
              </h2>
              <p style={{ fontSize: '1rem', color: '#4a5568', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                Watch our school video to see the vibrant life at Kitale Progressive School. 
                From classroom activities to sports events and cultural celebrations, get a glimpse 
                of what makes our school a special place for your child's growth and development.
              </p>
            </Col>
            <Col lg={6}>
              <div style={{
                position: 'relative',
                paddingBottom: '56.25%',
                height: 0,
                overflow: 'hidden',
                borderRadius: '12px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
              }}>
                <iframe
                  src="https://www.youtube.com/embed/your-video-id"
                  title="Kitale Progressive School Video - School Life Overview"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%'
                  }}
                ></iframe>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Director SECTION */}
      <section className="director-section section-padding bg-white py-5" aria-labelledby="director-heading">
        <Container>
          <Row className="align-items-center g-4 g-lg-5">
            <Col lg={6} className="order-2 order-lg-1">
              <img 
                src="/images/director.jpg" 
                alt="Director John Arthur Kabiro - Kitale Progressive School" 
                className="img-fluid rounded shadow-custom w-100"
                loading="lazy"
                width="600"
                height="400"
              />
            </Col>
            <Col lg={6} className="order-1 order-lg-2">
              <h2 id="director-heading" className="section-heading-left h1 h2-md">Welcome Message from Director</h2>
              
              <p className="lead lead-sm fw-semibold">Dear Prospective Parents and Guardians,</p>

              <p>It is my great pleasure to warmly welcome you to our school community.</p>

              <p>At our school, we are committed to nurturing every child's potential through quality education, strong moral values, and a supportive learning environment. We believe that each learner is unique and deserves the opportunity to grow academically, socially, emotionally, and creatively.</p>

              <p>Our dedicated team of teachers works tirelessly to provide a learner-centered, engaging, and holistic curriculum that prepares our pupils for future success. We emphasize discipline, respect, innovation, and teamwork, ensuring that our children develop confidence and a lifelong love for learning.</p>
              
              <p>We value the strong partnership between the school and parents, as it plays a vital role in every child's progress. Together, we create a safe, caring, and inspiring environment where learners thrive.</p>

              <p>Thank you for considering our school as a partner in your child's educational journey.</p>

              <p className="mb-2">Warm regards,</p>
              <p className="director-name h5">John Arthur Kabiro</p>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* CALL TO ACTION */}
      <section className="cta-section py-5" style={{ background: '#132f66' }} aria-label="Call to action">
        <Container className="text-center text-white">
          <h2 className="display-5 display-md-4 fw-bold mb-3 px-3">Ready to Join Kitale Progressive School?</h2>
          <p className="lead mb-4 px-3">Begin your child's journey toward excellence today.</p>
          <div className="d-flex justify-content-center gap-2 gap-md-3 flex-wrap px-3">
            <button 
              onClick={() => handleLinkClick('/admissions/apply')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLinkClick('/admissions/apply');
                }
              }}
              style={{
                backgroundColor: '#cebd04',
                color: '#132f66',
                border: 'none',
                padding: '0.75rem 2rem',
                borderRadius: '40px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '44px',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#b09e03';
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#cebd04';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = 'none';
              }}
              aria-label="Apply for admission now"
            >
              Apply Now
            </button>
            <button 
              onClick={() => handleLinkClick('/contact')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLinkClick('/contact');
                }
              }}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '0.75rem 2rem',
                borderRadius: '40px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '44px',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#132f66';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
              aria-label="Contact us"
            >
              Contact Us
            </button>
            <button 
              onClick={() => handleLinkClick('/admissions/fee-structure')} 
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLinkClick('/admissions/fee-structure');
                }
              }}
              style={{
                backgroundColor: 'transparent',
                color: 'white',
                border: '2px solid white',
                padding: '0.75rem 2rem',
                borderRadius: '40px',
                fontWeight: '600',
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                minHeight: '44px',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.color = '#132f66';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = 'white';
                e.target.style.transform = 'translateY(0)';
              }}
              aria-label="View fee structure"
            >
              View Fees
            </button>
          </div>
        </Container>
      </section>
      
      {/* GET IN TOUCH SECTION - Lazy loaded */}
      <Suspense fallback={<SectionLoader />}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS for animations and accessibility */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes zoomOut {
          0% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateX(-50%) translateY(0); }
          40% { transform: translateX(-50%) translateY(-20px); }
          60% { transform: translateX(-50%) translateY(-10px); }
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
        
        .carousel-image-wrapper {
          overflow: hidden;
          height: 100%;
        }
        
        .carousel-zoom {
          animation: zoomOut 8s ease forwards;
        }
        
        .card-custom {
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          border-radius: 12px;
          overflow: hidden;
        }
        
        .card-custom:hover,
        .card-custom:focus-within {
          transform: translateY(-5px);
          box-shadow: 0 20px 40px rgba(0,0,0,0.1) !important;
        }
        
        button:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        
        [role="button"]:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        
        a:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        
        @media (max-width: 768px) {
          .carousel-zoom {
            animation: zoomOut 6s ease forwards;
          }
        }
        
        @media (prefers-reduced-motion: reduce) {
          .carousel-zoom {
            animation: none !important;
          }
          .card-custom:hover {
            transform: none !important;
          }
          button:hover {
            transform: none !important;
          }
          * {
            transition: none !important;
          }
        }
      `}} />
    </>
  );
}

export default Home;