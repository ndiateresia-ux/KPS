// pages/Curriculum.jsx - Fully Updated with Reduced Spacing
import { lazy, Suspense, memo, useCallback, useMemo, useEffect, useState, useRef } from "react";
import { useLocation, Link } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Lazy load heavy components
const GetInTouch = lazy(() => import("../components/GetInTouch"));
const Helmet = lazy(() => import("react-helmet-async").then(mod => ({ default: mod.Helmet })));

// Optimized image component with theme classes
const OptimizedImage = memo(({ 
  src, 
  alt, 
  className = '', 
  width, 
  height,
  priority = false,
  folder = '',
  ...props 
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const imgRef = useRef(null);

  const basePath = folder ? `/images/optimized/${folder}/${src}` : `/images/optimized/${src}`;

  useEffect(() => {
    if (priority) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = `${basePath}.webp`;
      link.type = 'image/webp';
      document.head.appendChild(link);
      
      return () => {
        if (link.parentNode) document.head.removeChild(link);
      };
    }
  }, [priority, basePath]);

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
          srcSet={`${basePath}.webp`}
          type="image/webp"
        />
        <img
          ref={imgRef}
          src={`${basePath}.jpg`}
          alt={alt}
          loading={priority ? "eager" : "lazy"}
          fetchpriority={priority ? "high" : "auto"}
          decoding="async"
          width={width}
          height={height}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          className={`curriculum-image ${loaded ? 'loaded' : ''} ${className}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            position: 'relative',
            zIndex: 2
          }}
          {...props}
        />
      </picture>
      
      {/* Image Tag - using theme image-tag class */}
      {src === 'ecde' && (
        <div className="image-tag" style={{ background: 'rgba(255, 215, 0, 0.95)', color: 'var(--navy)' }}>
          <i className="fas fa-child me-2" aria-hidden="true"></i>
          Play-based Learning
        </div>
      )}
      {src === 'primary' && (
        <div className="image-tag" style={{ background: 'rgba(76, 175, 80, 0.95)', color: 'white' }}>
          <i className="fas fa-book-open me-2" aria-hidden="true"></i>
          Structured Learning
        </div>
      )}
      {src === 'jss' && (
        <div className="image-tag" style={{ background: 'rgba(33, 150, 243, 0.95)', color: 'white' }}>
          <i className="fas fa-flask me-2" aria-hidden="true"></i>
          Specialized Learning
        </div>
      )}
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Stat item component with theme
const StatItem = memo(({ value, label }) => (
  <Col xs={6} md={3}>
    <div className="curriculum-stat-badge text-center" role="article">
      <div className="stat-number text-gold fw-bold display-6" aria-hidden="true">{value}</div>
      <div className="stat-label text-white-50 small text-uppercase tracking-wide">{label}</div>
      <span className="visually-hidden">{value} {label}</span>
    </div>
  </Col>
));

StatItem.displayName = 'StatItem';

// Pillar item component with theme
const PillarItem = memo(({ icon, label }) => (
  <Col md={3} sm={6}>
    <div className="pillar-item text-center p-2 bg-white rounded-2 shadow-sm h-100" role="article">
      <div className="pillar-icon fs-1 mb-1" aria-hidden="true">{icon}</div>
      <h6 className="small fw-bold text-navy mb-0">{label}</h6>
      <span className="visually-hidden">Competency: {label}</span>
    </div>
  </Col>
));

PillarItem.displayName = 'PillarItem';

// Navigation card component with theme
const NavCard = memo(({ data, onClick }) => {
  const handleClick = useCallback(() => {
    onClick(`${data.id}-section`);
  }, [onClick, data.id]);
  
  return (
    <Col md={4} className="mb-4">
      <Card 
        className="curriculum-nav-card card-custom h-100 border-0" 
        role="article" 
        aria-labelledby={`nav-card-${data.id}`}
      >
        <div className="curriculum-image-wrapper" style={{ 
          aspectRatio: '16/9', 
          overflow: 'hidden', 
          borderRadius: '16px 16px 0 0'
        }}>
          <OptimizedImage
            src={data.image}
            alt={`${data.badge} level learning activities`}
            width="400"
            height="225"
            priority={data.id === 'ecde'}
          />
        </div>
        <Card.Body className="text-center p-3">
          <Card.Title id={`nav-card-${data.id}`} className="card-title-navy fw-bold h6 mb-1">{data.badge}</Card.Title>
          <Card.Text className="text-dark small mb-2">{data.ageRange}</Card.Text>
          <Button 
            variant="primary"
            size="sm"
            className="btn-navy px-3"
            onClick={handleClick}
            aria-label={`Explore ${data.badge} curriculum`}
            style={{ minHeight: '40px', borderRadius: '40px' }}
          >
            Explore
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
});

NavCard.displayName = 'NavCard';

// Info Card Component for sections using theme
const InfoCard = memo(({ title, items, icon, bgColor = 'var(--gray-light)' }) => (
  <div className="info-card p-3 rounded-3 h-100" style={{ background: bgColor }}>
    <h3 className="h6 fw-bold mb-2 text-navy">
      <i className={`fas ${icon} me-2 text-gold`} aria-hidden="true"></i>
      {title}
    </h3>
    <ul className="list-unstyled mb-0">
      {items.map((item, idx) => (
        <li key={idx} className="mb-1 d-flex align-items-start gap-2">
          <span className="text-gold mt-1" aria-hidden="true">✓</span>
          <span className="text-dark small">{item}</span>
        </li>
      ))}
    </ul>
  </div>
));

InfoCard.displayName = 'InfoCard';

// CTA Banner Component using theme with btn-navy
const CTABanner = memo(({ title, description, primaryText, primaryLink, secondaryText, secondaryLink }) => (
  <div className="cta-section p-3 text-center rounded-3" style={{
    color: 'var(--white)'
  }}>
    <h3 className="h6 fw-bold mb-1 text-white">{title}</h3>
    <p className="mb-2 small text-white opacity-90">{description}</p>
    <div className="d-flex flex-wrap justify-content-center gap-2">
      <Link to={primaryLink}>
        <Button className="btn-navy" style={{ minHeight: '40px', borderRadius: '40px', fontSize: '0.85rem' }}>
          {primaryText}
        </Button>
      </Link>
      <Link to={secondaryLink}>
        <Button variant="outline-light" className="btn-outline-light" style={{ minHeight: '40px', borderRadius: '40px', fontSize: '0.85rem' }}>
          {secondaryText}
        </Button>
      </Link>
    </div>
  </div>
));

CTABanner.displayName = 'CTABanner';

// ECD Section Component using theme
const ECDSection = memo(() => {
  const sectionId = "ecde-section";
  const headingId = "ecd-heading";

  const childExperiences = [
    "Play-based learning in a structured environment",
    "Early literacy (letters, sounds, communication)",
    "Numeracy (counting, patterns, basic concepts)",
    "Social interaction and teamwork",
    "Creative expression through music, storytelling, and art"
  ];

  const learningApproaches = [
    "Learning through play and guided activities",
    "Building independence at each child's pace",
    "Creating small successes that build confidence",
    "Encouraging communication and social interaction"
  ];

  const parentExpectations = [
    "A smooth transition into school life",
    "Regular communication on your child's progress",
    "A caring environment where your child feels safe and supported"
  ];

  return (
    <section 
      id={sectionId}
      className="curriculum-section py-4"
      style={{ background: 'var(--white)' }}
      aria-labelledby={headingId}
      tabIndex="-1"
    >
      <Container>
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <div className="curriculum-content">
              <span className="curriculum-badge ecde-badge">ECDE</span>
              <h2 id={headingId} className="section-heading-left mb-3">Early Childhood Development (ECD): The Right Start for Your Child</h2>
              <p className="lead mb-3 text-dark" style={{ fontSize: '1rem', fontWeight:'bold' }}>
                Are you looking for a safe, nurturing, and structured environment where your child can confidently begin their learning journey?
              </p>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Our ECD program introduces young learners to school life through a balanced combination of guided learning and play-based exploration, helping them develop confidence, curiosity, and essential foundational skills.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <OptimizedImage
              src="ecde"
              alt="Young children engaged in play-based learning activities"
              width="600"
              height="450"
              priority={true}
            />
          </Col>
        </Row>

        {/* Info Cards Row */}
        <Row className="mt-4 g-3">
          <Col lg={4}>
            <InfoCard 
              title="What Your Child Will Experience"
              items={childExperiences}
              icon="fa-face-smile"
              bgColor="var(--gray-light)"
            />
          </Col>
          <Col lg={4}>
            <InfoCard 
              title="Learning Approach"
              items={learningApproaches}
              icon="fa-graduation-cap"
              bgColor="var(--gray-light)"
            />
          </Col>
          <Col lg={4}>
            <InfoCard 
              title="What to Expect as a Parent"
              items={parentExpectations}
              icon="fa-heart"
              bgColor="var(--gray-light)"
            />
          </Col>
        </Row>

        {/* CTA Banner */}
        <Row className="mt-3">
          <Col lg={12}>
            <CTABanner 
              title="By the end of ECD, your child will be:"
              description="✓ Confident and socially developed | ✓ Ready for structured classroom learning | ✓ Equipped with early literacy and numeracy skills"
              primaryText="Apply Now"
              primaryLink="/admissions/apply"
              secondaryText="Book a School Visit"
              secondaryLink="/contact"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
});

ECDSection.displayName = 'ECDSection';

// Primary Section Component using theme
const PrimarySection = memo(() => {
  const sectionId = "primary-section";
  const headingId = "primary-heading";

  const childExperiences = [
    "Structured lessons in literacy and numeracy",
    "Science, social studies, and environmental learning",
    "Interactive classroom discussions",
    "Problem-solving and analytical thinking",
    "Participation in co-curricular activities"
  ];

  const learningApproaches = [
    "Understanding concepts rather than memorization",
    "Continuous assessment and feedback",
    "Active participation and guided learning"
  ];

  const parentExpectations = [
    "Clear visibility of academic progress",
    "Support for your child's strengths and weaknesses",
    "Guidance from experienced teachers"
  ];

  return (
    <section 
      id={sectionId}
      className="curriculum-section py-4"
      style={{ background: 'var(--gray-light)' }}
      aria-labelledby={headingId}
      tabIndex="-1"
    >
      <Container>
        <Row className="align-items-center g-4 flex-row-reverse">
          <Col lg={6}>
            <div className="curriculum-content">
              <span className="curriculum-badge primary-badge">Primary</span>
              <h2 id={headingId} className="section-heading-left mb-3">Primary School: Building Strong Academic Skills and Confidence</h2>
              <p className="lead mb-4 text-dark" style={{ fontSize: '1rem', fontWeight:'bold' }}>
                Are you looking for a school that will strengthen your child's academic foundation while developing confidence and discipline?
              </p>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Our Primary School program builds on foundational skills and introduces structured academic learning, helping learners grow in knowledge, independence, and critical thinking.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <OptimizedImage
              src="primary"
              alt="Primary school students engaged in structured learning"
              width="600"
              height="450"
            />
          </Col>
        </Row>

        {/* Info Cards Row */}
        <Row className="mt-4 g-3">
          <Col lg={4}>
            <InfoCard 
              title="What Your Child Will Experience"
              items={childExperiences}
              icon="fa-smile"
              bgColor="var(--white)"
            />
          </Col>
          <Col lg={4}>
            <InfoCard 
              title="Learning Approach"
              items={learningApproaches}
              icon="fa-graduation-cap"
              bgColor="var(--white)"
            />
          </Col>
          <Col lg={4}>
            <InfoCard 
              title="What to Expect as a Parent"
              items={parentExpectations}
              icon="fa-heart"
              bgColor="var(--white)"
            />
          </Col>
        </Row>

        {/* CTA Banner */}
        <Row className="mt-3">
          <Col lg={12}>
            <CTABanner 
              title="Your child will:"
              description="✓ Develop strong academic skills | ✓ Become confident and disciplined | ✓ Be prepared for more advanced learning"
              primaryText="Apply Now"
              primaryLink="/admissions/apply"
              secondaryText="Book a School Visit"
              secondaryLink="/contact"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
});

PrimarySection.displayName = 'PrimarySection';

// Junior Secondary Section Component using theme
const JuniorSecondarySection = memo(() => {
  const sectionId = "jss-section";
  const headingId = "jss-heading";

  const childExperiences = [
    "Deeper subject understanding",
    "Project-based and collaborative learning",
    "Development of analytical thinking",
    "Exposure to career pathways and interests",
    "Increased academic responsibility"
  ];

  const learningApproaches = [
    "Critical thinking and problem solving",
    "Collaboration and teamwork",
    "Real-world application of knowledge"
  ];

  const parentExpectations = [
    "Increased independence in your child",
    "Structured academic guidance",
    "Preparation for senior school pathways"
  ];

  return (
    <section 
      id={sectionId}
      className="curriculum-section py-4"
      style={{ background: 'var(--white)' }}
      aria-labelledby={headingId}
      tabIndex="-1"
    >
      <Container>
        <Row className="align-items-center g-4">
          <Col lg={6}>
            <div className="curriculum-content">
              <span className="curriculum-badge jss-badge">JSS</span>
              <h2 id={headingId} className="section-heading-left mb-2">Junior Secondary School: Preparing Learners for the Future</h2>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem', fontWeight:'bold' }}>
                Are you looking for a school that will prepare your child for senior school, future careers, and real-life success?
              </p>
              <p className="lead mb-2 text-dark" style={{ fontSize: '1rem' }}>
                Our Junior Secondary program builds independence and prepares learners for the next stage through advanced academic learning, critical thinking, and exposure to future pathways.
              </p>
            </div>
          </Col>
          <Col lg={6}>
            <OptimizedImage
              src="jss"
              alt="Junior secondary students engaged in project-based learning"
              width="600"
              height="450"
            />
          </Col>
        </Row>

        {/* Info Cards Row */}
        <Row className="mt-4 g-3">
          <Col lg={4}>
            <InfoCard 
              title="What Your Child Will Experience"
              items={childExperiences}
              icon="fa-smile"
              bgColor="var(--gray-light)"
            />
          </Col>
          <Col lg={4}>
            <InfoCard 
              title="Learning Approach"
              items={learningApproaches}
              icon="fa-graduation-cap"
              bgColor="var(--gray-light)"
            />
          </Col>
          <Col lg={4}>
            <InfoCard 
              title="What to Expect as a Parent"
              items={parentExpectations}
              icon="fa-heart"
              bgColor="var(--gray-light)"
            />
          </Col>
        </Row>

        {/* CTA Banner */}
        <Row className="mt-3">
          <Col lg={12}>
            <CTABanner 
              title="Learners leave Junior Secondary:"
              description="✓ Confident and self-driven | ✓ Academically prepared | ✓ Ready for the next stage of education"
              primaryText="Apply Now"
              primaryLink="/admissions/apply"
              secondaryText="Book a School Visit"
              secondaryLink="/contact"
            />
          </Col>
        </Row>
      </Container>
    </section>
  );
});

JuniorSecondarySection.displayName = 'JuniorSecondarySection';

function Curriculum() {
  const location = useLocation();

  // Handle scrolling to section
  useEffect(() => {
    if (location.hash) {
      const timer = setTimeout(() => {
        const section = document.getElementById(location.hash.substring(1));
        if (section) {
          section.scrollIntoView({ behavior: 'smooth', block: 'start' });
          section.setAttribute('tabindex', '-1');
          section.focus({ preventScroll: true });
        }
      }, 100);
      return () => clearTimeout(timer);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  const handleNavClick = useCallback((sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth', block: 'start' });
      section.setAttribute('tabindex', '-1');
      section.focus({ preventScroll: true });
    }
  }, []);

  const navData = {
    ecde: {
      id: 'ecde',
      badge: 'ECDE',
      ageRange: 'Ages 2-5 years',
      image: 'ecde'
    },
    primary: {
      id: 'primary',
      badge: 'Primary',
      ageRange: 'Grades 1-6',
      image: 'primary'
    },
    jss: {
      id: 'jss',
      badge: 'Junior Secondary',
      ageRange: 'Grades 7-9',
      image: 'jss'
    }
  };

  const cbcPillars = [
    { icon: "🧠", label: "Critical Thinking" },
    { icon: "🎨", label: "Creativity" },
    { icon: "🤝", label: "Collaboration" },
    { icon: "💬", label: "Communication" },
    { icon: "💻", label: "Digital Literacy" },
    { icon: "🌍", label: "Citizenship" },
    { icon: "🔍", label: "Self-efficacy" },
    { icon: "📊", label: "Problem Solving" }
  ];

  const stats = [
    { value: "3", label: "Learning Levels" },
    { value: "20+", label: "Subjects" },
    { value: "7", label: "Core Competencies" },
    { value: "KICD", label: "Approved" }
  ];

  return (
    <>
      <Suspense fallback={null}>
        <Helmet>
          <title>Academics & Curriculum | Kitale Progressive School</title>
          <meta
            name="description"
            content="Explore our ECD, Primary, and Junior Secondary programs at Kitale Progressive School. Learn about our Competency-Based Curriculum (CBC) and how we nurture confident, capable learners."
          />
        </Helmet>
      </Suspense>
      
      {/* Page Header - Using theme page-title-section */}
      <section className="page-title-section" aria-labelledby="page-title">
        <Container>
          <h1 id="page-title" className="display-5 fw-bold">
            Our Academics
          </h1>
          <p className="lead">
            Competency-Based Curriculum (CBC) Excellence
          </p>

          {/* Stats */}
          <Row className="justify-content-center mt-3 g-2" aria-label="Curriculum statistics">
            {stats.map((stat, index) => (
              <StatItem key={index} value={stat.value} label={stat.label} />
            ))}
          </Row>
        </Container>
      </section>

      {/* Curriculum Overview */}
      <section className="py-4 bg-light-custom" aria-labelledby="overview-heading">
        <Container>
          <Row className="text-center mb-4">
            <Col lg={8} className="mx-auto">
              <h2 id="overview-heading" className="section-heading mb-4">
                The CBC Pathway
              </h2>
              <p className="lead text-dark small">
                At Kitale Progressive School, we follow the Competency-Based Curriculum (CBC) 
                approved by the Kenya Institute of Curriculum Development (KICD).
              </p>
            </Col>
          </Row>

          {/* Quick Navigation Cards */}
          <Row className="mb-4 g-3" role="list" aria-label="Curriculum levels">
            <NavCard data={navData.ecde} onClick={handleNavClick} />
            <NavCard data={navData.primary} onClick={handleNavClick} />
            <NavCard data={navData.jss} onClick={handleNavClick} />
          </Row>

          {/* CBC Pillars */}
          <Row className="mt-3">
            <Col lg={12}>
              <div className="bg-white p-3 rounded-3 shadow-sm">
                <h3 className="text-center fw-bold h6 mb-2 text-navy">
                  The 7 Core Competencies of CBC
                </h3>
                <Row className="g-2" role="list" aria-label="Core competencies">
                  {cbcPillars.map((pillar, index) => (
                    <PillarItem key={index} icon={pillar.icon} label={pillar.label} />
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* ECD Section */}
      <ECDSection />

      {/* Primary Section */}
      <PrimarySection />

      {/* Junior Secondary Section */}
      <JuniorSecondarySection />

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Additional Styles that complement theme.css */}
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
        [tabindex="-1"]:focus {
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        button:focus-visible,
        a:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        .curriculum-nav-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 14px;
          overflow: hidden;
        }
        .curriculum-nav-card:focus-within,
        .curriculum-nav-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 25px rgba(13,101,251,0.15) !important;
        }
        .curriculum-section {
          scroll-margin-top: 80px;
        }
        .curriculum-badge {
          display: inline-block;
          padding: 4px 12px;
          border-radius: 30px;
          font-size: 0.7rem;
          font-weight: 600;
          margin-bottom: 0.75rem;
          letter-spacing: 0.5px;
        }
        .ecde-badge {
          background: #ffd700;
          color: var(--navy);
        }
        .primary-badge {
          background: #4CAF50;
          color: white;
        }
        .jss-badge {
          background: #2196F3;
          color: white;
        }
        .curriculum-stat-badge {
          padding: 0.75rem;
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
          backdrop-filter: blur(5px);
          transition: transform 0.2s ease;
        }
        .curriculum-stat-badge:hover {
          transform: translateY(-2px);
        }
        .pillar-item {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 10px;
        }
        .pillar-item:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 15px rgba(13,101,251,0.1);
        }
        .info-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .info-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(13,101,251,0.1);
        }
        .tracking-wide {
          letter-spacing: 0.5px;
        }
        @media (max-width: 768px) {
          .section-heading {
            font-size: 1.6rem;
          }
          .curriculum-stat-badge {
            padding: 0.5rem;
          }
          .stat-number {
            font-size: 1.3rem;
          }
          .section-heading-left {
            font-size: 1.3rem;
          }
        }
        @media (max-width: 576px) {
          .section-heading {
            font-size: 1.4rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *,
          .curriculum-nav-card,
          .curriculum-nav-card:focus-within,
          .curriculum-nav-card:hover,
          .pillar-item,
          .info-card,
          .curriculum-stat-badge {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
          .curriculum-image {
            transition: none !important;
          }
          .image-skeleton {
            animation: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(Curriculum);