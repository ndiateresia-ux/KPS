// pages/ClubsSocieties.jsx - FINAL VERSION
import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useState, lazy, Suspense, memo, useCallback, useEffect } from "react";
import SimpleImage from "../components/SimpleImage";
import "./clubs-societies.css"; // Move all styles here

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Club Card Component with SimpleImage
const ClubCard = memo(({ club, index }) => {
  const cardId = `club-${index}`;
  
  return (
    <Col lg={6} className="mb-4">
      <div className="club-card h-100 border-0 shadow-sm" role="article">
        <div className="row g-0 h-100">
          <div className="col-md-5 px-0">
            <div className="club-image-container">
              <SimpleImage
                src={club.image}
                alt={`${club.name} club activities`}
                width={400}
                height={300}
                priority={index < 2} // First 2 load with priority
              />
            </div>
          </div>
          <div className="col-md-7">
            <div className="p-3 p-lg-4">
              <h3 className="fw-bold h6 mb-2" style={{ color: club.color }}>
                {club.icon} {club.name}
              </h3>
              <p className="text-secondary small mb-2">{club.description}</p>
              <h4 className="fw-bold small mb-2">Activities:</h4>
              <div className="d-flex flex-wrap gap-1">
                {club.activities.slice(0, 4).map((activity, idx) => (
                  <span
                    key={idx}
                    className="badge px-2 py-1"
                    style={{
                      background: `${club.color}15`,
                      color: club.color,
                      fontSize: '0.7rem',
                      borderRadius: '30px'
                    }}
                  >
                    {activity}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Col>
  );
});

ClubCard.displayName = 'ClubCard';

function ClubsSocieties() {
  const [activeTab, setActiveTab] = useState("academic");

  // Updated URLs - MANUALLY OPTIMIZED
  const clubsData = {
    academic: [
      {
        name: "Young Scientists Club",
        description: "Fostering curiosity through hands-on experiments.",
        activities: ["Science fairs", "Nature walks", "Experiments"],
        image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&q=75&auto=format",
        icon: "🔬",
        color: "#132f66"
      },
      {
        name: "Mathematics Club",
        description: "Making math fun through puzzles and competitions.",
        activities: ["Math contests", "Puzzles", "Math games"],
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=400&q=75&auto=format",
        icon: "🧮",
        color: "#0a1f4d"
      },
      {
        name: "Reading Club",
        description: "Cultivating love for reading and storytelling.",
        activities: ["Storytelling", "Book reviews", "Poetry"],
        image: "https://images.unsplash.com/photo-1526243741027-444d633d7365?w=400&q=75&auto=format",
        icon: "📚",
        color: "#132f66"
      },
      {
        name: "Computer Club",
        description: "Digital literacy and basic programming.",
        activities: ["Coding basics", "Digital art", "Internet safety"],
        image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&q=75&auto=format", // Better image
        icon: "💻",
        color: "#0a1f4d"
      },
      {
        name: "Chinese Language Club",
        description: "Learning Mandarin and Chinese culture.",
        activities: ["Mandarin", "Calligraphy", "Festivals"],
        image: "https://images.unsplash.com/photo-1524593689594-aae2f26b75ab?w=400&q=75&auto=format",
        icon: "🇨🇳",
        color: "#132f66"
      }
    ],
    cultural: [
      {
        name: "Kenyan Traditional Dance",
        description: "Celebrating Kenya's rich cultural heritage.",
        activities: ["Dances", "Drumming", "Festivals"],
        image: "https://images.unsplash.com/photo-1547156979-4e72c2c8b1a3?w=400&q=75&auto=format", // Better image
        icon: "💃",
        color: "#132f66"
      },
      {
        name: "School Band",
        description: "Learn musical instruments and perform.",
        activities: ["Brass", "Percussion", "Performances"],
        image: "https://images.unsplash.com/photo-1458560871784-56d23406c091?w=400&q=75&auto=format",
        icon: "🎺",
        color: "#8b4513"
      },
      {
        name: "Music Club",
        description: "Developing musical talents.",
        activities: ["Choir", "Instrument lessons", "Festivals"],
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400&q=75&auto=format",
        icon: "🎵",
        color: "#0a1f4d"
      },
      {
        name: "Journalism Club",
        description: "Developing young writers.",
        activities: ["News writing", "Interviewing", "Photography"],
        image: "https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&q=75&auto=format", // Better image
        icon: "📰",
        color: "#132f66"
      },
      {
        name: "Drama Club",
        description: "Nurturing creativity through performances.",
        activities: ["Stage plays", "Role play", "Puppetry"],
        image: "https://images.unsplash.com/photo-1503095396549-807759245b35?w=400&q=75&auto=format", // Better image
        icon: "🎭",
        color: "#0a1f4d"
      }
    ],
    talent: [
      {
        name: "Football Academy",
        description: "Developing soccer skills and teamwork.",
        activities: ["Training", "Matches", "Tournaments"],
        image: "https://images.unsplash.com/photo-1543326727-cf6c39e8f84c?w=400&q=75&auto=format",
        icon: "⚽",
        color: "#132f66"
      },
      {
        name: "Athletics Club",
        description: "Track and field events.",
        activities: ["Track", "Field events", "Cross country"],
        image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=400&q=75&auto=format",
        icon: "🏃",
        color: "#0a1f4d"
      },
      {
        name: "Netball Club",
        description: "Netball skills and teamwork.",
        activities: ["Skills", "Matches", "Tournaments"],
        image: "https://images.unsplash.com/photo-1552674605-d67e0ee90881?w=400&q=75&auto=format",
        icon: "🏐",
        color: "#132f66"
      },
      {
        name: "Art & Craft Club",
        description: "Exploring creativity through art.",
        activities: ["Drawing", "Painting", "Crafts"],
        image: "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&q=75&auto=format",
        icon: "🎨",
        color: "#0a1f4d"
      },
      {
        name: "Swimming Club",
        description: "Learn swimming techniques and water safety.",
        activities: ["Techniques", "Water safety", "Galas"],
        image: "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=400&q=75&auto=format",
        icon: "🏊",
        color: "#0066b3"
      }
    ],
    service: [
      {
        name: "Wildlife Club",
        description: "Kenya's wildlife and conservation.",
        activities: ["Park visits", "Conservation", "Tree planting"],
        image: "https://images.unsplash.com/photo-1516426122078-c23e76319801?w=400&q=75&auto=format",
        icon: "🦁",
        color: "#132f66"
      },
      {
        name: "Scouts & Guides",
        description: "Leadership through scouting.",
        activities: ["Camping", "Community service", "First aid"],
        image: "https://images.unsplash.com/photo-1551632811-561732d4b307?w=400&q=75&auto=format", // Better image
        icon: "⛺",
        color: "#0a1f4d"
      },
      {
        name: "Young Farmers Club",
        description: "Agriculture through gardening.",
        activities: ["School garden", "Animal care", "Composting"],
        image: "https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=400&q=75&auto=format", // Better image
        icon: "🌱",
        color: "#132f66"
      },
      {
        name: "Red Cross Society",
        description: "Health, first aid, and humanitarian values.",
        activities: ["First aid", "Health campaigns", "Fundraising"],
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?w=400&q=75&auto=format",
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
    { icon: "bi-people", title: "Social Skills", text: "Make friends and learn teamwork." },
    { icon: "bi-star", title: "Talent Discovery", text: "Explore your interests." },
    { icon: "bi-trophy", title: "Leadership", text: "Build confidence and responsibility." }
  ];

  const handleTabChange = useCallback((tabId) => {
    setActiveTab(tabId);
  }, []);

  return (
    <>
      <Helmet>
        <title>Clubs & Societies | Kitale Progressive School</title>
        <meta name="description" content="Explore our diverse clubs and societies." />
        <link rel="preconnect" href="https://images.unsplash.com" />
      </Helmet>
      
      <section style={{ 
        background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
        color: 'white',
        padding: '120px 0 60px',
        textAlign: 'center'
      }}>
        <Container>
          <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginBottom: '1rem' }}>
            Clubs & Societies
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 4vw, 1.2rem)' }}>
            Discover Your Passion, Develop Your Talents
          </p>
        </Container>
      </section>
      
      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center h3 mb-4">Where Talents Blossom</h2>
          <p className="text-center text-secondary small mb-5">
            At Kitale Progressive School, we believe education extends beyond the classroom.
          </p>

          <div className="text-center mb-4">
            {categories.map(category => (
              <button
                key={category.id}
                onClick={() => handleTabChange(category.id)}
                className={`btn m-1 ${activeTab === category.id ? 'btn-navy' : 'btn-outline-navy'}`}
                style={{ padding: '0.5rem 1rem', borderRadius: '40px' }}
              >
                {category.icon} {category.name}
              </button>
            ))}
          </div>

          <Row className="g-4">
            {clubsData[activeTab]?.map((club, index) => (
              <ClubCard key={index} club={club} index={index} />
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5">
        <Container>
          <h2 className="text-center h3 mb-4">Benefits of Joining</h2>
          <Row>
            {benefits.map((item, index) => (
              <Col md={4} key={index} className="mb-3">
                <div className="text-center p-3">
                  <div className="bg-navy text-white rounded-circle mx-auto mb-3" 
                       style={{ width: '50px', height: '50px', lineHeight: '50px' }}>
                    <i className={`bi ${item.icon}`}></i>
                  </div>
                  <h3 className="h6 fw-bold mb-2">{item.title}</h3>
                  <p className="small text-secondary mb-0">{item.text}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5" style={{ backgroundColor: '#132f66' }}>
        <Container className="text-center">
          <h2 className="h3 fw-bold text-white mb-2">Ready to Join Us?</h2>
          <p className="small text-white mb-3" style={{ opacity: 0.95 }}>
            Every term, students can choose up to two clubs.
          </p>
          <a 
            href="/admissions/apply"
            className="btn btn-light px-4 py-2"
            style={{ borderRadius: '40px', fontWeight: '600' }}
          >
            Apply Now
          </a>
        </Container>
      </section>
      
      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>
    </>
  );
}

export default memo(ClubsSocieties);