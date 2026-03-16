// pages/ClubsSocieties.jsx - Fully Optimized
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useState, lazy, Suspense, memo, useCallback, useEffect, useMemo, useRef } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Unsplash fallback images based on club category (optimized with size parameters)
const UNSPLASH_FALLBACKS = {
  academic: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=400&q=75&auto=format&fm=webp", // Students studying
  cultural: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=400&q=75&auto=format&fm=webp", // Cultural dance
  sports: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=75&auto=format&fm=webp", // Sports
  service: "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&q=75&auto=format&fm=webp", // Community service
  default: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=400&q=75&auto=format&fm=webp" // Default campus
};

// Category mapping for fallback images
const getCategoryFallback = (club) => {
  if (club.category === "academic") return UNSPLASH_FALLBACKS.academic;
  if (club.category === "cultural") return UNSPLASH_FALLBACKS.cultural;
  if (club.category === "sports" || club.category === "talent") return UNSPLASH_FALLBACKS.sports;
  if (club.category === "service") return UNSPLASH_FALLBACKS.service;
  return UNSPLASH_FALLBACKS.default;
};

// Optimized image component with WebP support and Unsplash fallback
const OptimizedImage = memo(({ src, alt, width, height, color, category = 'default', priority = false }) => {
  const imgRef = useRef(null);
  const [imgSrc, setImgSrc] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  
  // For Unsplash images, use their CDN with optimization
  const isUnsplash = src.includes('unsplash.com');
  
  useEffect(() => {
    if (useFallback) {
      // Use category-based Unsplash fallback
      setImgSrc(getCategoryFallback({ category }));
    } else if (isUnsplash) {
      // Optimize Unsplash URLs for WebP
      const baseUrl = src.split('?')[0];
      setImgSrc(`${baseUrl}?w=400&q=75&auto=format&fm=webp`);
    } else {
      // For local images, assume they're in the optimized folder
      // Check WebP support
      const supportsWebP = checkWebPSupport();
      if (supportsWebP) {
        setImgSrc(`/images/optimized/${src}.webp`);
      } else {
        setImgSrc(`/images/optimized/${src}.jpg`);
      }
    }
  }, [src, isUnsplash, useFallback, category]);

  // Check WebP support efficiently
  const checkWebPSupport = () => {
    const canvas = document.createElement('canvas');
    return canvas.toDataURL('image/webp').indexOf('image/webp') === 5;
  };

  // Preload critical images
  useEffect(() => {
    if (priority && imgSrc) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = imgSrc;
      link.type = isUnsplash || useFallback ? 'image/webp' : 'image/webp';
      document.head.appendChild(link);
      
      return () => {
        if (link.parentNode) document.head.removeChild(link);
      };
    }
  }, [priority, imgSrc, isUnsplash, useFallback]);

  // Fallback image based on category color (SVG)
  const svgFallback = useMemo(() => {
    return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='${width}' height='${height}' viewBox='0 0 ${width} ${height}'%3E%3Crect width='${width}' height='${height}' fill='%23${color?.replace('#', '') || 'f0f0f0'}'/%3E%3Ctext x='50%25' y='50%25' font-family='Arial' font-size='14' fill='%23999' text-anchor='middle' dy='.3em'%3E${alt}%3C/text%3E%3C/svg%3E`;
  }, [width, height, color, alt]);

  const handleError = () => {
    if (!useFallback) {
      // Try Unsplash fallback first
      setUseFallback(true);
      setIsLoaded(false);
    } else {
      // If Unsplash also fails, use SVG fallback
      setError(true);
      setIsLoaded(true);
      setImgSrc(svgFallback);
    }
  };

  if (error) {
    return (
      <div 
        className="club-image-container" 
        style={{ 
          backgroundColor: color || '#f0f0f0',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#666',
          fontSize: '0.875rem',
          minHeight: '200px'
        }}
        role="img"
        aria-label={`${alt} (image failed to load)`}
      >
        <span aria-hidden="true">📷</span>
        <span className="visually-hidden">Image not available</span>
      </div>
    );
  }

  return (
    <div 
      className="club-image-container" 
      style={{ 
        backgroundColor: color || '#f0f0f0',
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        minHeight: '200px'
      }}
    >
      {/* Loading shimmer effect */}
      {!isLoaded && (
        <div 
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(90deg, ${color}15 25%, ${color}25 50%, ${color}15 75%)`,
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            zIndex: 1
          }}
          aria-hidden="true"
        />
      )}
      
      {/* Image with proper loading attributes */}
      <img
        ref={imgRef}
        src={imgSrc}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        fetchpriority={priority ? 'high' : 'auto'}
        decoding="async"
        width={width}
        height={height}
        onLoad={() => setIsLoaded(true)}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
          position: 'relative',
          zIndex: 2
        }}
      />
    </div>
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Memoized club card component with enhanced accessibility
const ClubCard = memo(({ club, index, category }) => {
  const cardId = `club-${index}-${club.name.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <Col lg={6} className="mb-4" key={cardId}>
      <Card 
        className="h-100 border-0 shadow-sm club-card"
        as="article"
        aria-labelledby={`${cardId}-title`}
      >
        <Row className="g-0 h-100">
          {/* Image column - smaller on desktop */}
          <Col md={4} className="px-0">
            <OptimizedImage 
              src={club.image} 
              alt={`${club.name} club members participating in activities`}
              width="400"
              height="300"
              color={club.color}
              category={category}
              priority={index < 2} // Prioritize first 2 images per category
            />
          </Col>
          {/* Content column - larger on desktop */}
          <Col md={8}>
            <Card.Body className="p-3 p-lg-4 d-flex flex-column h-100">
              <div className="d-flex align-items-center mb-2">
                <span className="club-icon fs-4 me-2" aria-hidden="true">{club.icon}</span>
                <Card.Title 
                  as="h3" 
                  id={`${cardId}-title`}
                  className="fw-bold h6 mb-0 text-truncate"
                  style={{ color: club.color }}
                >
                  {club.name}
                </Card.Title>
              </div>
              
              {/* Description with controlled height */}
              <Card.Text className="text-muted small mb-2 club-description">
                {club.description}
              </Card.Text>
              
              {/* Activities section - stays at bottom */}
              <div className="mt-auto">
                <h4 className="fw-bold small mb-2 clubs-activities-title" id={`${cardId}-activities`}>
                  Activities:
                  <span className="visually-hidden"> for {club.name}</span>
                </h4>
                <div 
                  className="d-flex flex-wrap gap-1 activities-container" 
                  aria-labelledby={`${cardId}-activities`}
                  role="list"
                >
                  {club.activities.slice(0, 4).map((activity, idx) => (
                    <span 
                      key={idx}
                      className="badge activity-badge small px-2 py-1"
                      style={{ 
                        background: `${club.color}15`,
                        color: club.color,
                        fontSize: '0.7rem'
                      }}
                      role="listitem"
                    >
                      {activity}
                    </span>
                  ))}
                </div>
              </div>
            </Card.Body>
          </Col>
        </Row>
      </Card>
    </Col>
  );
});

ClubCard.displayName = 'ClubCard';

// Simplified highlight card with better semantics
const HighlightCard = memo(({ icon, title, text }) => (
  <Col md={3} sm={6} className="mb-3">
    <div 
      className="club-highlight-card text-center p-3" 
      role="article"
    >
      <div className="highlight-icon fs-2 mb-2" aria-hidden="true">{icon}</div>
      <h3 className="highlight-title h6 fw-bold mb-1">{title}</h3>
      <p className="highlight-text small text-muted mb-0">{text}</p>
    </div>
  </Col>
));

HighlightCard.displayName = 'HighlightCard';

// Simplified benefit card
const BenefitCard = memo(({ icon, title, text }) => (
  <Col md={4} className="mb-3">
    <div className="benefit-card text-center p-3" role="article">
      <div 
        className="benefit-icon-wrapper bg-navy mx-auto mb-3" 
        style={{ 
          width: '50px', 
          height: '50px', 
          borderRadius: '50%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
        aria-hidden="true"
      >
        <i className={`bi ${icon} text-white`} style={{ fontSize: '1.5rem' }}></i>
      </div>
      <h3 className="benefit-title h6 fw-bold mb-2">{title}</h3>
      <p className="benefit-text small text-muted mb-0">{text}</p>
    </div>
  </Col>
));

BenefitCard.displayName = 'BenefitCard';

// Optimized tab navigation with reduced re-renders
const TabNav = memo(({ categories, activeTab, onTabChange }) => {
  return (
    <nav className="clubs-tab-nav d-flex flex-wrap justify-content-center gap-2 mb-4" aria-label="Club categories">
      {categories.map(category => (
        <button
          key={category.id}
          onClick={() => onTabChange(category.id)}
          className={`btn ${activeTab === category.id ? 'btn-navy text-white' : 'btn-outline-navy'}`}
          style={{
            padding: '0.5rem 1rem',
            borderRadius: '40px',
            fontSize: '0.9rem',
            fontWeight: '500',
            minHeight: '44px',
            minWidth: '44px',
            transition: 'background-color 0.2s ease, color 0.2s ease'
          }}
          aria-pressed={activeTab === category.id}
          aria-current={activeTab === category.id ? 'true' : undefined}
        >
          <span className="me-1" aria-hidden="true">{category.icon}</span>
          <span>{category.name}</span>
        </button>
      ))}
    </nav>
  );
});

TabNav.displayName = 'TabNav';

function ClubsSocieties() {
  const [activeTab, setActiveTab] = useState("academic");

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  // Memoize club data with optimized image paths and category
  const clubsData = useMemo(() => ({
    academic: [
      {
        name: "Young Scientists Club",
        description: "Fostering curiosity through hands-on experiments and environmental projects.",
        activities: ["Science fairs", "Nature walks", "Experiments", "Conservation"],
        image: "young-scientists",
        icon: "🔬",
        color: "#132f66",
        category: "academic"
      },
      {
        name: "Mathematics Club",
        description: "Making math fun through puzzles, competitions, and problem-solving.",
        activities: ["Math contests", "Puzzles", "Mental math", "Math games"],
        image: "mathematics-club",
        icon: "🧮",
        color: "#0a1f4d",
        category: "academic"
      },
      {
        name: "Reading Club",
        description: "Cultivating love for reading through storytelling and book reviews.",
        activities: ["Storytelling", "Book reviews", "Poetry", "Reading comps"],
        image: "reading-club",
        icon: "📚",
        color: "#132f66",
        category: "academic"
      },
      {
        name: "Computer Club",
        description: "Introducing digital literacy and basic programming in a fun environment.",
        activities: ["Coding basics", "Typing", "Digital art", "Internet safety"],
        image: "computer-club",
        icon: "💻",
        color: "#0a1f4d",
        category: "academic"
      },
      {
        name: "Chinese Language Club",
        description: "Learning Mandarin and exploring China's rich culture and traditions.",
        activities: ["Mandarin", "Calligraphy", "Festivals", "Songs"],
        image: "chinese-club",
        icon: "🇨🇳",
        color: "#132f66",
        category: "academic"
      }
    ],
    cultural: [
      {
        name: "Kenyan Traditional Dance",
        description: "Celebrating Kenya's rich cultural heritage through traditional dances.",
        activities: ["Dances", "Festivals", "Drumming", "Traditional attire"],
        image: "kenyan-dance",
        icon: "💃",
        color: "#132f66",
        category: "cultural"
      },
      {
        name: "School Band",
        description: "Learn musical instruments and perform at school events together.",
        activities: ["Brass", "Percussion", "Marching band", "Performances"],
        image: "school-band",
        icon: "🎺",
        color: "#8b4513",
        category: "cultural"
      },
      {
        name: "Music Club",
        description: "Developing musical talents through choir and instruments.",
        activities: ["Choir", "Instrument lessons", "Festivals", "Songs"],
        image: "music-club",
        icon: "🎵",
        color: "#0a1f4d",
        category: "cultural"
      },
      {
        name: "Journalism Club",
        description: "Developing young writers through news writing and school magazine.",
        activities: ["News writing", "Magazine", "Interviewing", "Photography"],
        image: "journalism-club",
        icon: "📰",
        color: "#132f66",
        category: "cultural"
      },
      {
        name: "Drama Club",
        description: "Nurturing creativity through plays, skits, and performances.",
        activities: ["Stage plays", "Role play", "Puppetry", "Productions"],
        image: "drama-club",
        icon: "🎭",
        color: "#0a1f4d",
        category: "cultural"
      }
    ],
    talent: [
      {
        name: "Football Academy",
        description: "Developing soccer skills, teamwork, and sportsmanship.",
        activities: ["Training", "Matches", "Tournaments", "Skills clinics"],
        image: "football-academy",
        icon: "⚽",
        color: "#132f66",
        category: "sports"
      },
      {
        name: "Athletics Club",
        description: "Building endurance and speed in track and field events.",
        activities: ["Track", "Field events", "Cross country", "Sports day"],
        image: "athletics-club",
        icon: "🏃",
        color: "#0a1f4d",
        category: "sports"
      },
      {
        name: "Netball Club",
        description: "Teaching fundamentals of netball, teamwork, and fair play.",
        activities: ["Skills", "Position play", "Matches", "Tournaments"],
        image: "netball-club",
        icon: "🏐",
        color: "#132f66",
        category: "sports"
      },
      {
        name: "Art & Craft Club",
        description: "Exploring creativity through drawing, painting, and crafts.",
        activities: ["Drawing", "Beadwork", "Clay", "Recycled art"],
        image: "art-club",
        icon: "🎨",
        color: "#0a1f4d",
        category: "cultural"
      },
      {
        name: "Swimming Club",
        description: "Learn swimming techniques, water safety, and compete in galas.",
        activities: ["Techniques", "Water safety", "Galas", "Life saving"],
        image: "swimming-club",
        icon: "🏊",
        color: "#0066b3",
        category: "sports"
      },
      {
        name: "Indoor Games Club",
        description: "Enjoy table tennis, chess, scrabble, carrom, and more.",
        activities: ["Table tennis", "Chess", "Scrabble", "Carrom"],
        image: "indoor-games",
        icon: "🎯",
        color: "#0a1f4d",
        category: "sports"
      }
    ],
    service: [
      {
        name: "Wildlife/Environmental Club",
        description: "Creating awareness about Kenya's wildlife and conservation.",
        activities: ["Park visits", "Conservation", "Tree planting", "Wildlife talks"],
        image: "wildlife-club",
        icon: "🦁",
        color: "#132f66",
        category: "service"
      },
      {
        name: "Scouts & Guides",
        description: "Building character and leadership through scouting activities.",
        activities: ["Camping", "Community service", "First aid", "Outdoor skills"],
        image: "scouts-guides",
        icon: "⛺",
        color: "#0a1f4d",
        category: "service"
      },
      {
        name: "Young Farmers Club",
        description: "Introducing agriculture through school gardening projects.",
        activities: ["School garden", "Animal care", "Composting", "Market days"],
        image: "young-farmers",
        icon: "🌱",
        color: "#132f66",
        category: "service"
      },
      {
        name: "Red Cross Society",
        description: "Promoting health, first aid, and humanitarian values.",
        activities: ["First aid", "Health campaigns", "Fundraising", "Peer support"],
        image: "red-cross",
        icon: "❤️",
        color: "#0a1f4d",
        category: "service"
      }
    ]
  }), []);

  const categories = useMemo(() => [
    { id: "academic", name: "Academic", icon: "📚" },
    { id: "cultural", name: "Cultural", icon: "🎭" },
    { id: "talent", name: "Sports", icon: "⚽" },
    { id: "service", name: "Service", icon: "🌱" }
  ], []);

  const highlights = useMemo(() => [
    { icon: "🏆", title: "Chess Champions", text: "County Champions 2023" },
    { icon: "🎵", title: "Music Festival", text: "Top Awards 2023" },
    { icon: "🇨🇳", title: "Chinese Club", text: "New! Join Today" },
    { icon: "⚽", title: "Sports Teams", text: "Multiple Tournaments" }
  ], []);

  const benefits = useMemo(() => [
    { icon: "bi-people", title: "Social Skills", text: "Make friends, learn teamwork, and develop communication skills." },
    { icon: "bi-star", title: "Talent Discovery", text: "Explore interests and discover hidden talents." },
    { icon: "bi-trophy", title: "Leadership", text: "Take on responsibilities and build confidence." }
  ], []);

  // Preconnect to external domains efficiently
  useEffect(() => {
    const domains = ['https://images.unsplash.com'];
    
    domains.forEach(domain => {
      // Check if preconnect already exists
      if (!document.querySelector(`link[rel="preconnect"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'preconnect';
        link.href = domain;
        document.head.appendChild(link);
      }
    });
    
    // Add dns-prefetch as fallback for older browsers
    domains.forEach(domain => {
      if (!document.querySelector(`link[rel="dns-prefetch"][href="${domain}"]`)) {
        const link = document.createElement('link');
        link.rel = 'dns-prefetch';
        link.href = domain;
        document.head.appendChild(link);
      }
    });
  }, []);

  // Get current category name for screen reader
  const currentCategory = useMemo(() => {
    return categories.find(c => c.id === activeTab)?.name || 'Academic';
  }, [activeTab, categories]);

  return (
    <>
      <Helmet>
        <title>Clubs & Societies | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Explore our diverse clubs and societies at Kitale Progressive School. From academic to cultural, sports to service - discover your passion." 
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </Helmet>
      
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
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem',
            color: 'white'
          }}>
            Clubs & Societies
          </h1>
          <p style={{ 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            Discover Your Passion, Develop Your Talents
          </p>
        </Container>
      </section>
      
      {/* Introduction Section */}
      <section className="section-padding bg-light-custom py-5" aria-labelledby="intro-heading">
        <Container>
          <Row className="text-center mb-4">
            <Col lg={8} className="mx-auto">
              <h2 id="intro-heading" className="section-heading h3 mb-3">Where Talents Blossom</h2>
              <p className="small">
                At Kitale Progressive School, we believe education extends beyond the classroom. 
                Our vibrant clubs and societies provide students with opportunities to explore interests, 
                develop skills, and build lasting friendships.
              </p>
            </Col>
          </Row>

          {/* Highlights Cards */}
          <Row className="mb-4 g-3" aria-label="Club highlights">
            {highlights.map((item, index) => (
              <HighlightCard key={`highlight-${index}`} {...item} />
            ))}
          </Row>
        </Container>
      </section>

      {/* Clubs Listing with Tabs */}
      <section className="section-padding bg-white py-5" aria-labelledby="clubs-heading">
        <Container>
          <h2 id="clubs-heading" className="visually-hidden">Clubs by Category</h2>
          
          {/* Screen reader announcer for tab changes */}
          <div className="visually-hidden" role="status" aria-live="polite" aria-atomic="true">
            {`Showing ${currentCategory} clubs`}
          </div>
          
          <TabNav categories={categories} activeTab={activeTab} onTabChange={handleTabChange} />

          <Row className="g-4" role="list" aria-label={`${currentCategory} clubs`}>
            {clubsData[activeTab]?.map((club, index) => (
              <ClubCard 
                key={`club-${activeTab}-${index}`} 
                club={club} 
                index={index} 
                category={activeTab}
              />
            ))}
          </Row>
        </Container>
      </section>

      {/* Benefits Section */}
      <section className="section-padding bg-light-custom py-5" aria-labelledby="benefits-heading">
        <Container>
          <Row className="text-center mb-4">
            <Col lg={8} className="mx-auto">
              <h2 id="benefits-heading" className="section-heading h3 mb-3">Benefits of Joining</h2>
              <p className="small">
                Participation in clubs and societies helps students develop holistically
              </p>
            </Col>
          </Row>
          
          <Row className="g-4" role="list" aria-label="Benefits of joining clubs">
            {benefits.map((item, index) => (
              <BenefitCard key={`benefit-${index}`} {...item} />
            ))}
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="cta-section bg-navy text-white text-center py-5" aria-label="Call to action">
        <Container>
          <h2 className="h3 fw-bold mb-2">Ready to Join Us?</h2>
          <p className="small mb-3">
            Every term, students can choose up to two clubs. Discover your passion today!
          </p>
          <a 
            href="/admissions/apply"
            className="btn btn-light px-4 py-2 d-inline-block"
            style={{
              backgroundColor: 'white',
              color: '#132f66',
              borderRadius: '40px',
              fontWeight: '600',
              border: 'none',
              minHeight: '44px',
              minWidth: '44px',
              textDecoration: 'none',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
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

      {/* Critical CSS - Minified */}
      <style dangerouslySetInnerHTML={{ __html: `
        .club-card{transition:transform .2s ease,box-shadow .2s ease;border-radius:12px;overflow:hidden;height:100%}.club-card .row{height:100%;margin:0}.club-card:focus-within,.club-card:hover{transform:translateY(-4px);box-shadow:0 10px 30px rgba(0,0,0,.1)!important}.club-image-container{overflow:hidden;background-color:#f0f0f0;width:100%;height:100%;min-height:200px;aspect-ratio:4/3}.club-image-container img{transition:transform .3s ease;width:100%;height:100%;object-fit:cover;object-position:center}.club-card:focus-within .club-image-container img,.club-card:hover .club-image-container img{transform:scale(1.05)}.activity-badge{background:#f0f0f0;padding:.25rem .75rem;border-radius:30px;font-size:.75rem;white-space:nowrap}.text-truncate{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}@media (min-width:768px){.club-card .col-md-4{height:auto;min-height:220px;padding:0!important}.club-card .col-md-8{height:auto;min-height:220px;display:flex;flex-direction:column}.club-card .card-body{padding:1rem!important;display:flex;flex-direction:column;height:100%;overflow:hidden}.club-description{display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;text-overflow:ellipsis;line-height:1.5;max-height:4.5em;margin-bottom:.5rem!important;flex-shrink:0}.club-card .card-title{max-width:200px}.club-card .card-body>div:last-child{flex:1;display:flex;flex-direction:column;min-height:0}.activities-container{max-height:70px;overflow-y:auto;padding-right:4px}.activities-container::-webkit-scrollbar{width:4px}.activities-container::-webkit-scrollbar-track{background:#f1f1f1;border-radius:4px}.activities-container::-webkit-scrollbar-thumb{background:#132f66;border-radius:4px}}@media (min-width:1200px){.club-card .col-md-4{min-height:240px}.club-card .col-md-8{min-height:240px}.club-description{-webkit-line-clamp:3;max-height:4.5em}.activities-container{max-height:85px}}@media (max-width:767px){.club-card .col-md-4{height:200px;width:100%}.club-image-container{min-height:200px}.club-description{margin-bottom:.5rem}}.btn-outline-navy{border:2px solid #132f66;background:transparent;color:#132f66;min-height:44px;min-width:44px}.btn-outline-navy:focus-visible,.btn-outline-navy:hover{background:#132f66;color:#fff;outline:3px solid #cebd04;outline-offset:2px}.btn-navy{background:#132f66;color:#fff;border:none}.btn-navy:focus-visible{outline:3px solid #cebd04;outline-offset:2px}.club-highlight-card,.benefit-card{transition:transform .2s ease;border-radius:8px}.club-highlight-card:hover,.benefit-card:hover{transform:translateY(-2px);background:#f8f9fa}.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}@keyframes shimmer{0%{background-position:200% 0}100%{background-position:-200% 0}}@media (prefers-reduced-motion:reduce){.club-card,.club-image-container img,.club-card:focus-within,.club-card:hover,.club-highlight-card,.benefit-card{transition:none!important;animation:none!important;transform:none!important}}
      `}} />
    </>
  );
}

export default memo(ClubsSocieties);