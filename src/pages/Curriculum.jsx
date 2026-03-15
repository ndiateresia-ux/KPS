import { lazy, Suspense, memo, useCallback, useMemo, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Lazy load heavy components
const GetInTouch = lazy(() => import("../components/GetInTouch"));
const Helmet = lazy(() => import("react-helmet-async").then(mod => ({ default: mod.Helmet })));

// Optimized image URLs with lower quality and responsive parameters
const FALLBACK_IMAGES = {
  ecde: "https://images.unsplash.com/photo-1503676260728-517c89092e3c?w=400&q=60&auto=format&fit=crop",
  primary: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&q=60&auto=format&fit=crop",
  jss: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=400&q=60&auto=format&fit=crop"
};

// Memoized stat item component
const StatItem = memo(({ value, label }) => (
  <Col xs={6} md={3}>
    <div className="curriculum-stat-badge" role="article">
      <div className="stat-number text-gold display-6 fw-bold" aria-hidden="true">{value}</div>
      <div className="stat-label text-white-50 small">{label}</div>
      <span className="visually-hidden">{value} {label}</span>
    </div>
  </Col>
));

StatItem.displayName = 'StatItem';

// Memoized pillar item component
const PillarItem = memo(({ icon, label }) => (
  <Col md={3} sm={6}>
    <div className="pillar-item text-center p-3" role="article">
      <div className="pillar-icon fs-1 mb-2" aria-hidden="true">{icon}</div>
      <h6 className="small fw-bold text-navy">{label}</h6>
      <span className="visually-hidden">Competency: {label}</span>
    </div>
  </Col>
));

PillarItem.displayName = 'PillarItem';

// Optimized navigation card component with responsive images
const NavCard = memo(({ data, onClick }) => {
  const cardId = `nav-card-${data.id}`;
  
  return (
    <Col md={4} className="mb-4">
      <Card className="curriculum-nav-card h-100 border-0 shadow-sm" role="article" aria-labelledby={cardId}>
        <div className="curriculum-card-img-wrapper" style={{ aspectRatio: '16/9', overflow: 'hidden' }}>
          <Card.Img 
            variant="top" 
            src={`${data.image}?w=400&q=60&auto=format`}
            srcSet={`
              ${data.image}?w=400&q=60&auto=format 400w,
              ${data.image}?w=600&q=60&auto=format 600w,
              ${data.image}?w=800&q=60&auto=format 800w
            `}
            sizes="(max-width: 768px) 400px, (max-width: 1200px) 600px, 800px"
            alt={`${data.badge} level learning activities`}
            className="curriculum-card-img"
            loading="lazy"
            decoding="async"
            width="400"
            height="225"
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = data.fallbackImage;
            }}
          />
        </div>
        <Card.Body className="text-center p-3">
          <Card.Title id={cardId} className="card-title-navy fw-bold h6">{data.badge}</Card.Title>
          <Card.Text className="text-muted small mb-2">{data.ageRange}</Card.Text>
          <Button 
            variant="outline-primary"
            size="sm"
            className="btn-outline-navy btn-sm px-3"
            onClick={() => onClick(`${data.id}-section`)}
            aria-label={`Explore ${data.badge} curriculum`}
          >
            Explore
          </Button>
        </Card.Body>
      </Card>
    </Col>
  );
});

NavCard.displayName = 'NavCard';

// Optimized image component with responsive images and loading states
const CurriculumImage = memo(({ data }) => {
  const [imgSrc, setImgSrc] = useState(data.image);
  const [loaded, setLoaded] = useState(false);

  return (
    <div className="curriculum-image-wrapper" style={{ 
      aspectRatio: '4/3',
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: '#f0f0f0'
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
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }}
          aria-hidden="true"
        />
      )}
      <img 
        src={`${imgSrc}?w=600&q=60&auto=format`}
        srcSet={`
          ${imgSrc}?w=400&q=60&auto=format 400w,
          ${imgSrc}?w=600&q=60&auto=format 600w,
          ${imgSrc}?w=800&q=60&auto=format 800w
        `}
        sizes="(max-width: 768px) 400px, (max-width: 1200px) 600px, 800px"
        alt={`${data.title} - ${data.imageTag} illustration`}
        className={`curriculum-image ${loaded ? 'loaded' : ''}`}
        loading="lazy"
        decoding="async"
        width="600"
        height="450"
        style={{ 
          width: '100%', 
          height: '100%', 
          objectFit: 'cover',
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.3s ease, transform 0.3s ease'
        }}
        onLoad={() => setLoaded(true)}
        onError={(e) => {
          e.target.onerror = null;
          setImgSrc(data.fallbackImage);
        }}
      />
      <div 
        className="image-tag"
        style={{
          position: 'absolute',
          bottom: '15px',
          left: '15px',
          background: 'rgba(206, 189, 4, 0.9)',
          color: '#132f66',
          padding: '4px 12px',
          borderRadius: '30px',
          fontSize: '0.8rem',
          fontWeight: '600',
          backdropFilter: 'blur(5px)',
          zIndex: 2
        }}
        aria-label={`Tag: ${data.imageTag}`}
      >
        <i className={`fas ${data.imageIcon} me-2`} aria-hidden="true"></i>
        {data.imageTag}
      </div>
    </div>
  );
});

CurriculumImage.displayName = 'CurriculumImage';

// Optimized curriculum section component
const CurriculumSection = memo(({ data, isReversed = false }) => {
  const sectionId = `${data.id}-section`;
  
  return (
    <section 
      id={sectionId}
      className={`curriculum-section py-5 ${data.id === 'primary' ? 'bg-light-custom' : 'bg-white'}`}
      aria-labelledby={`${data.id}-heading`}
    >
      <Container>
        <Row className="align-items-center g-4 g-lg-5">
          <Col lg={6} className={isReversed ? "order-lg-2" : ""}>
            <div className="curriculum-content">
              <span 
                className={`curriculum-badge ${data.id}-badge`}
                style={{
                  display: 'inline-block',
                  padding: '4px 12px',
                  borderRadius: '30px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  marginBottom: '1rem',
                  backgroundColor: data.id === 'ecde' ? '#ffd700' : data.id === 'primary' ? '#4CAF50' : '#2196F3',
                  color: data.id === 'ecde' ? '#132f66' : 'white'
                }}
              >
                {data.badge}
              </span>
              <h2 id={`${data.id}-heading`} className="curriculum-title h3 fw-bold mb-2" style={{ color: '#132f66' }}>
                {data.title}
              </h2>
              <h3 className="curriculum-subtitle text-muted mb-2 small">{data.subtitle}</h3>
              <p className="curriculum-age-range mb-3 fw-medium" style={{ color: '#cebd04' }}>{data.ageRange}</p>
              <p className="curriculum-description mb-3 text-muted">{data.description}</p>
            </div>
            
            <Row xs={1} md={2} className="g-3">
              <Col>
                <h4 className="fw-bold mb-2" style={{ color: '#132f66', fontSize: '0.9rem' }}>
                  <i className="fas fa-check-circle me-2" style={{ color: '#cebd04' }} aria-hidden="true"></i>
                  Learning Areas:
                </h4>
                <ul className="list-unstyled small" aria-label={`Learning areas for ${data.badge}`}>
                  {data.learningAreas?.slice(0, 5).map((item, index) => (
                    <li key={index} className="mb-1 ps-2" style={{ color: '#4a5568' }}>• {item}</li>
                  ))}
                </ul>
              </Col>
              <Col>
                <h4 className="fw-bold mb-2" style={{ color: '#132f66', fontSize: '0.9rem' }}>
                  <i className="fas fa-star me-2" style={{ color: '#cebd04' }} aria-hidden="true"></i>
                  Competencies:
                </h4>
                <ul className="list-unstyled small" aria-label={`Key competencies for ${data.badge}`}>
                  {data.keyCompetencies?.slice(0, 4).map((item, index) => (
                    <li key={index} className="mb-1 ps-2" style={{ color: '#4a5568' }}>• {item}</li>
                  ))}
                </ul>
              </Col>
            </Row>

            {data.optionalSubjects && (
              <div className="mt-3">
                <h4 className="fw-bold mb-2" style={{ color: '#132f66', fontSize: '0.9rem' }}>
                  <i className="fas fa-plus-circle me-2" style={{ color: '#cebd04' }} aria-hidden="true"></i>
                  Optional Subjects:
                </h4>
                <ul className="list-unstyled small" aria-label={`Optional subjects for ${data.badge}`}>
                  {data.optionalSubjects.slice(0, 5).map((item, index) => (
                    <li key={index} className="mb-1 ps-2" style={{ color: '#4a5568' }}>• {item}</li>
                  ))}
                </ul>
              </div>
            )}
          </Col>
          <Col lg={6} className={isReversed ? "order-lg-1" : ""}>
            <CurriculumImage data={data} />
          </Col>
        </Row>
      </Container>
    </section>
  );
});

CurriculumSection.displayName = 'CurriculumSection';

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

  const curriculumData = useMemo(() => ({
    ecde: {
      id: 'ecde',
      badge: 'ECDE',
      title: "ECDE (Early Childhood Development Education)",
      subtitle: "Playgroup • Pre-Primary 1 • Pre-Primary 2",
      ageRange: "Ages 2-5 years",
      image: "/images/ecde",
      fallbackImage: FALLBACK_IMAGES.ecde,
      description: "The ECDE level focuses on foundational learning through play-based activities that develop curiosity, creativity, and social skills.",
      learningAreas: [
        "Language Activities", "Mathematical Activities", "Environmental Activities",
        "Psychomotor and Creative Activities", "Religious Education"
      ],
      keyCompetencies: [
        "Communication skills", "Basic numeracy", "Social skills",
        "Fine and gross motor skills", "Creativity"
      ],
      imageTag: "Play-based Learning",
      imageIcon: "fa-child"
    },
    primary: {
      id: 'primary',
      badge: 'Primary',
      title: "Primary School",
      subtitle: "Grades 1 - 6",
      ageRange: "Ages 6-11 years",
      image: "/images/primary",
      fallbackImage: FALLBACK_IMAGES.primary,
      description: "The Primary level builds on foundational skills and introduces more structured learning.",
      learningAreas: [
        "English", "Kiswahili", "Mathematics", "Science and Technology",
        "Social Studies", "Religious Education", "Creative Arts", "Physical Education"
      ],
      keyCompetencies: [
        "Critical thinking", "Problem solving", "Digital literacy",
        "Collaboration", "Self-awareness"
      ],
      imageTag: "Structured Learning",
      imageIcon: "fa-book-open"
    },
    juniorSecondary: {
      id: 'jss',
      badge: 'JSS',
      title: "Junior Secondary School (JSS)",
      subtitle: "Grades 7 - 9",
      ageRange: "Ages 12-14 years",
      image: "/images/jss",
      fallbackImage: FALLBACK_IMAGES.jss,
      description: "Junior Secondary prepares learners for senior school while helping them explore their talents and interests.",
      learningAreas: [
        "English", "Kiswahili", "Mathematics", "Integrated Science",
        "Social Studies", "Religious Education", "Business Studies",
        "Agriculture", "Pre-Technical Studies", "Creative Arts"
      ],
      optionalSubjects: [
        "Foreign Languages", "Kenyan Sign Language", "Indigenous Languages",
        "Visual Arts", "Performing Arts", "Home Science", "Computer Science"
      ],
      keyCompetencies: [
        "Critical thinking", "Creativity", "Communication",
        "Digital literacy", "Citizenship", "Self-efficacy"
      ],
      imageTag: "Specialized Learning",
      imageIcon: "fa-flask"
    }
  }), []);

  const cbcPillars = useMemo(() => [
    { icon: "🧠", label: "Critical Thinking" },
    { icon: "🎨", label: "Creativity" },
    { icon: "🤝", label: "Collaboration" },
    { icon: "💬", label: "Communication" },
    { icon: "💻", label: "Digital Literacy" },
    { icon: "🌍", label: "Citizenship" },
    { icon: "🔍", label: "Self-efficacy" },
    { icon: "📊", label: "Problem Solving" }
  ], []);

  const stats = useMemo(() => [
    { value: "3", label: "Learning Levels" },
    { value: "20+", label: "Subjects" },
    { value: "7", label: "Core Competencies" },
    { value: "KICD", label: "Approved" }
  ], []);

  return (
    <>
      <Suspense fallback={null}>
        <Helmet>
          <title>Curriculum | Kitale Progressive School</title>
          <meta
            name="description"
            content="Explore our Competency-Based Curriculum (CBC) across ECDE, Primary, and Junior Secondary levels."
          />
        </Helmet>
      </Suspense>
      
      {/* Page Header */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
          color: 'white',
          paddingTop: '120px',
          paddingBottom: '60px',
          textAlign: 'center',
          width: '100%'
        }}
        aria-labelledby="page-title"
      >
        <Container>
          <h1 id="page-title" style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Our Curriculum
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            Competency-Based Curriculum (CBC) Excellence
          </p>

          {/* Stats */}
          <Row className="justify-content-center mt-4 g-3" aria-label="Curriculum statistics">
            {stats.map((stat, index) => (
              <StatItem key={index} value={stat.value} label={stat.label} />
            ))}
          </Row>
        </Container>
      </section>

      {/* Curriculum Overview */}
      <section className="py-5 bg-light-custom" aria-labelledby="overview-heading">
        <Container>
          <Row className="text-center mb-4">
            <Col lg={8} className="mx-auto">
              <h2 id="overview-heading" className="section-heading h3 mb-3" style={{ color: '#132f66', fontWeight: 'bold' }}>
                The CBC Pathway
              </h2>
              <p className="text-muted">
                At Kitale Progressive School, we follow the Competency-Based Curriculum (CBC) 
                approved by the Kenya Institute of Curriculum Development (KICD).
              </p>
            </Col>
          </Row>

          {/* Quick Navigation Cards */}
          <Row className="mb-5 g-4" role="list" aria-label="Curriculum levels">
            <NavCard data={curriculumData.ecde} onClick={handleNavClick} />
            <NavCard data={curriculumData.primary} onClick={handleNavClick} />
            <NavCard data={curriculumData.juniorSecondary} onClick={handleNavClick} />
          </Row>

          {/* CBC Pillars */}
          <Row className="mt-5">
            <Col lg={12}>
              <div className="bg-white p-4 rounded-4 shadow-sm">
                <h3 className="text-center fw-bold h5 mb-4" style={{ color: '#132f66' }}>
                  The 7 Core Competencies of CBC
                </h3>
                <Row className="g-3" role="list" aria-label="Core competencies">
                  {cbcPillars.map((pillar, index) => (
                    <PillarItem key={index} icon={pillar.icon} label={pillar.label} />
                  ))}
                </Row>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Curriculum Sections */}
      <CurriculumSection data={curriculumData.ecde} />
      <CurriculumSection data={curriculumData.primary} isReversed />
      <CurriculumSection data={curriculumData.juniorSecondary} />

      {/* Call to Action */}
      <section className="cta-section py-5" style={{ background: '#132f66' }} aria-label="Call to action">
        <Container className="text-center text-white">
          <h2 className="h3 fw-bold mb-3">Ready to Begin the Journey?</h2>
          <p className="mb-4" style={{ opacity: 0.95 }}>
            Enroll your child today and give them the gift of quality CBC education.
          </p>
          <a 
            href="/admissions/apply" 
            className="btn btn-light px-4 py-2"
            style={{
              backgroundColor: '#cebd04',
              color: '#132f66',
              border: 'none',
              borderRadius: '40px',
              fontWeight: '600',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'all 0.3s ease',
              minHeight: '44px',
              minWidth: '44px',
              lineHeight: '44px',
              textAlign: 'center'
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
          </a>
        </Container>
      </section>

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Only critical CSS inline, rest should be in themes.css */}
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
        [tabindex="-1"]:focus {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(Curriculum);