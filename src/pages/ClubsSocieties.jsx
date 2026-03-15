import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useState, lazy, Suspense, memo, useCallback } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Memoized club card component with enhanced accessibility
const ClubCard = memo(({ club, index }) => (
  <Col lg={6} className="mb-4" key={index}>
    <Card className="h-100 border-0 shadow-sm club-card">
      <Row className="g-0 h-100">
        <Col md={5} className="px-0">
          <div className="club-image-container" style={{ aspectRatio: '4/3', backgroundColor: '#f0f0f0' }}>
            <Card.Img 
              src={club.image} 
              alt={`${club.name} club activities`}
              className="club-image"
              loading="lazy"
              decoding="async"
              width="400"
              height="300"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80";
              }}
            />
          </div>
        </Col>
        <Col md={7}>
          <Card.Body className="p-3 p-lg-4">
            <div className="d-flex align-items-center mb-2">
              <span className="club-icon fs-4 me-2" aria-hidden="true">{club.icon}</span>
              <Card.Title as="h3" className="fw-bold h6 mb-0" style={{ color: club.color }}>
                {club.name}
              </Card.Title>
            </div>
            <Card.Text className="text-muted small mb-2">
              {club.description}
            </Card.Text>
            <div>
              <h4 className="fw-bold small mb-2 clubs-activities-title">
                Activities:
                <span className="visually-hidden"> for {club.name}</span>
              </h4>
              <div className="d-flex flex-wrap gap-1" aria-label={`Activities for ${club.name}`}>
                {club.activities.slice(0, 4).map((activity, idx) => (
                  <span 
                    key={idx}
                    className="badge activity-badge small px-2 py-1"
                    style={{ 
                      background: `${club.color}15`,
                      color: club.color,
                      fontSize: '0.7rem'
                    }}
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
));

ClubCard.displayName = 'ClubCard';

// Memoized highlight card with enhanced accessibility
const HighlightCard = memo(({ icon, title, text }) => (
  <Col md={3} sm={6} className="mb-3">
    <div className="club-highlight-card text-center p-3" tabIndex="0" role="article">
      <div className="highlight-icon fs-2 mb-2" aria-hidden="true">{icon}</div>
      <h3 className="highlight-title h6 fw-bold mb-1">{title}</h3>
      <p className="highlight-text small text-muted mb-0">{text}</p>
    </div>
  </Col>
));

HighlightCard.displayName = 'HighlightCard';

// Memoized benefit card with enhanced accessibility
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

// Tab navigation component with enhanced accessibility
const TabNav = memo(({ categories, activeTab, onTabChange }) => (
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
          border: activeTab === category.id ? 'none' : '2px solid #132f66',
          backgroundColor: activeTab === category.id ? '#132f66' : 'transparent',
          color: activeTab === category.id ? 'white' : '#132f66',
          transition: 'all 0.2s ease',
          minHeight: '44px', // Touch target size
          minWidth: '44px'
        }}
        aria-pressed={activeTab === category.id}
        aria-current={activeTab === category.id ? 'true' : undefined}
      >
        <span className="me-1" aria-hidden="true">{category.icon}</span>
        <span>{category.name}</span>
        {activeTab === category.id && (
          <span className="visually-hidden"> (active category)</span>
        )}
      </button>
    ))}
  </nav>
));

TabNav.displayName = 'TabNav';

function ClubsSocieties() {
  const [activeTab, setActiveTab] = useState("academic");

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
    // Announce tab change to screen readers
    const announcement = document.getElementById('tab-announcer');
    if (announcement) {
      const categoryName = categories.find(c => c.id === tabId)?.name || tabId;
      announcement.textContent = `Showing ${categoryName} clubs`;
    }
  }, []);

  const clubsData = {
    academic: [
      {
        name: "Young Scientists Club",
        description: "Fostering curiosity through hands-on experiments and environmental projects.",
        activities: ["Science fairs", "Nature walks", "Experiments", "Conservation"],
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🔬",
        color: "#132f66"
      },
      {
        name: "Mathematics Club",
        description: "Making math fun through puzzles, competitions, and problem-solving.",
        activities: ["Math contests", "Puzzles", "Mental math", "Math games"],
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🧮",
        color: "#0a1f4d"
      },
      {
        name: "Reading Club",
        description: "Cultivating love for reading through storytelling and book reviews.",
        activities: ["Storytelling", "Book reviews", "Poetry", "Reading comps"],
        image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "📚",
        color: "#132f66"
      },
      {
        name: "Computer Club",
        description: "Introducing digital literacy and basic programming in a fun environment.",
        activities: ["Coding basics", "Typing", "Digital art", "Internet safety"],
        image: "/images/computer1.jpg",
        icon: "💻",
        color: "#0a1f4d"
      },
      {
        name: "Chinese Language Club",
        description: "Learning Mandarin and exploring China's rich culture and traditions.",
        activities: ["Mandarin", "Calligraphy", "Festivals", "Songs"],
        image: "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🇨🇳",
        color: "#132f66"
      }
    ],
    cultural: [
      {
        name: "Kenyan Traditional Dance",
        description: "Celebrating Kenya's rich cultural heritage through traditional dances.",
        activities: ["Dances", "Festivals", "Drumming", "Traditional attire"],
        image: "/images/extracurricular1.jpg",
        icon: "💃",
        color: "#132f66"
      },
      {
        name: "School Band",
        description: "Learn musical instruments and perform at school events together.",
        activities: ["Brass", "Percussion", "Marching band", "Performances"],
        image: "https://images.unsplash.com/photo-1458560871784-56d23406c091?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🎺",
        color: "#8b4513"
      },
      {
        name: "Music Club",
        description: "Developing musical talents through choir and instruments.",
        activities: ["Choir", "Instrument lessons", "Festivals", "Songs"],
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🎵",
        color: "#0a1f4d"
      },
      {
        name: "Journalism Club",
        description: "Developing young writers through news writing and school magazine.",
        activities: ["News writing", "Magazine", "Interviewing", "Photography"],
        image: "/images/journalism.jpg",
        icon: "📰",
        color: "#132f66"
      },
      {
        name: "Drama Club",
        description: "Nurturing creativity through plays, skits, and performances.",
        activities: ["Stage plays", "Role play", "Puppetry", "Productions"],
        image: "/images/drama.jpg",
        icon: "🎭",
        color: "#0a1f4d"
      }
    ],
    talent: [
      {
        name: "Football Academy",
        description: "Developing soccer skills, teamwork, and sportsmanship.",
        activities: ["Training", "Matches", "Tournaments", "Skills clinics"],
        image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "⚽",
        color: "#132f66"
      },
      {
        name: "Athletics Club",
        description: "Building endurance and speed in track and field events.",
        activities: ["Track", "Field events", "Cross country", "Sports day"],
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🏃",
        color: "#0a1f4d"
      },
      {
        name: "Netball Club",
        description: "Teaching fundamentals of netball, teamwork, and fair play.",
        activities: ["Skills", "Position play", "Matches", "Tournaments"],
        image: "https://images.unsplash.com/photo-1552674605-d67e0ee90881?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🏐",
        color: "#132f66"
      },
      {
        name: "Art & Craft Club",
        description: "Exploring creativity through drawing, painting, and crafts.",
        activities: ["Drawing", "Beadwork", "Clay", "Recycled art"],
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🎨",
        color: "#0a1f4d"
      },
      {
        name: "Swimming Club",
        description: "Learn swimming techniques, water safety, and compete in galas.",
        activities: ["Techniques", "Water safety", "Galas", "Life saving"],
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🏊",
        color: "#0066b3"
      },
      {
        name: "Indoor Games Club",
        description: "Enjoy table tennis, chess, scrabble, carrom, and more.",
        activities: ["Table tennis", "Chess", "Scrabble", "Carrom"],
        image: "/images/chess.jpg",
        icon: "🎯",
        color: "#0a1f4d"
      }
    ],
    service: [
      {
        name: "Wildlife/Environmental Club",
        description: "Creating awareness about Kenya's wildlife and conservation.",
        activities: ["Park visits", "Conservation", "Tree planting", "Wildlife talks"],
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "🦁",
        color: "#132f66"
      },
      {
        name: "Scouts & Guides",
        description: "Building character and leadership through scouting activities.",
        activities: ["Camping", "Community service", "First aid", "Outdoor skills"],
        image: "/images/scouts.jpg",
        icon: "⛺",
        color: "#0a1f4d"
      },
      {
        name: "Young Farmers Club",
        description: "Introducing agriculture through school gardening projects.",
        activities: ["School garden", "Animal care", "Composting", "Market days"],
        image: "/images/practicals2.jpg",
        icon: "🌱",
        color: "#132f66"
      },
      {
        name: "Red Cross Society",
        description: "Promoting health, first aid, and humanitarian values.",
        activities: ["First aid", "Health campaigns", "Fundraising", "Peer support"],
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
        icon: "❤️",
        color: "#0a1f4d"
      }
    ]
  };

  const categories = [
    { id: "academic", name: "Academic", icon: "📚" },
    { id: "cultural", name: "Cultural", icon: "🎭" },
    { id: "talent", name: "Sports", icon: "⚽" },
    { id: "service", name: "Service", icon: "🌱" }
  ];

  const highlights = [
    { icon: "🏆", title: "Chess Champions", text: "County Champions 2023" },
    { icon: "🎵", title: "Music Festival", text: "Top Awards 2023" },
    { icon: "🇨🇳", title: "Chinese Club", text: "New! Join Today" },
    { icon: "⚽", title: "Sports Teams", text: "Multiple Tournaments" }
  ];

  const benefits = [
    { icon: "bi-people", title: "Social Skills", text: "Make friends, learn teamwork, and develop communication skills." },
    { icon: "bi-star", title: "Talent Discovery", text: "Explore interests and discover hidden talents." },
    { icon: "bi-trophy", title: "Leadership", text: "Take on responsibilities and build confidence." }
  ];

  return (
    <>
      <Helmet>
        <title>Clubs & Societies | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Explore our diverse clubs and societies at Kitale Progressive School. From academic to cultural, sports to service - discover your passion." 
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </Helmet>
      
      {/* Page Header - with proper heading hierarchy */}
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
      
      {/* Introduction - with proper heading hierarchy */}
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
              <HighlightCard key={index} {...item} />
            ))}
          </Row>
        </Container>
      </section>

      {/* Clubs Listing with Tabs */}
      <section className="section-padding bg-white py-5" aria-labelledby="clubs-heading">
        <Container>
          <h2 id="clubs-heading" className="visually-hidden">Clubs by Category</h2>
          
          {/* Screen reader announcer for tab changes */}
          <div id="tab-announcer" className="visually-hidden" role="status" aria-live="polite"></div>
          
          <TabNav categories={categories} activeTab={activeTab} onTabChange={handleTabChange} />

          <Row className="g-4" role="list" aria-label={`${categories.find(c => c.id === activeTab)?.name} clubs`}>
            {clubsData[activeTab]?.map((club, index) => (
              <ClubCard key={index} club={club} index={index} />
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
              <BenefitCard key={index} {...item} />
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
          <button 
            className="btn btn-light px-4 py-2"
            onClick={() => window.location.href = '/admissions/apply'}
            style={{
              backgroundColor: 'white',
              color: '#132f66',
              borderRadius: '40px',
              fontWeight: '600',
              border: 'none',
              minHeight: '44px',
              minWidth: '44px'
            }}
            aria-label="Apply for admission now"
          >
            Apply Now
          </button>
        </Container>
      </section>
      
      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS inline with accessibility improvements */}
      <style dangerouslySetInnerHTML={{ __html: `
        .club-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
          border-radius: 12px;
          overflow: hidden;
        }
        .club-card:hover,
        .club-card:focus-within {
          transform: translateY(-4px);
          box-shadow: 0 10px 30px rgba(0,0,0,0.1) !important;
        }
        .club-image-container {
          overflow: hidden;
          height: 100%;
          min-height: 180px;
          background-color: #f0f0f0;
        }
        .club-image {
          transition: transform 0.3s ease;
        }
        .club-card:hover .club-image,
        .club-card:focus-within .club-image {
          transform: scale(1.05);
        }
        .activity-badge {
          background: #f0f0f0;
          padding: 0.25rem 0.75rem;
          border-radius: 30px;
          font-size: 0.75rem;
          white-space: nowrap;
        }
        .btn-outline-navy {
          border: 2px solid #132f66;
          background: transparent;
          color: #132f66;
          min-height: 44px;
          min-width: 44px;
        }
        .btn-outline-navy:hover,
        .btn-outline-navy:focus-visible {
          background: #132f66;
          color: white;
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        .btn-navy:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        .club-highlight-card,
        .benefit-card {
          transition: transform 0.2s ease;
        }
        .club-highlight-card:hover,
        .benefit-card:hover {
          transform: translateY(-2px);
        }
        .club-highlight-card:focus,
        .benefit-card:focus {
          outline: 3px solid #132f66;
          outline-offset: 2px;
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
        @media (max-width: 768px) {
          .club-image-container {
            min-height: 150px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .club-card, .club-image, * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(ClubsSocieties);