import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useCallback, lazy, Suspense, memo } from "react";
import { Link } from "react-router-dom";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Fallback images
const FALLBACK_IMAGES = {
  newsletter: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80",
  blog: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
};

// Memoized newsletter card component with accessibility
const NewsletterCard = memo(({ newsletter, onClick, onDownload }) => {
  const [imgSrc, setImgSrc] = useState(newsletter.image);
  const [loaded, setLoaded] = useState(false);
  const cardId = `newsletter-${newsletter.id}`;

  return (
    <div
      id={cardId}
      onClick={() => onClick(newsletter)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(newsletter);
        }
      }}
      role="article"
      tabIndex={0}
      aria-label={`Newsletter: ${newsletter.title}`}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0'
      }}>
        {!loaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} aria-hidden="true" />
        )}
        <img
          src={imgSrc}
          alt={`Cover image for ${newsletter.title}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            setImgSrc(FALLBACK_IMAGES.newsletter);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: '#132f66',
          color: 'white',
          padding: '0.25rem 1rem',
          borderRadius: '40px',
          fontSize: '0.8rem',
          fontWeight: '600',
          zIndex: 2
        }} aria-hidden="true">
          {newsletter.term} {newsletter.year}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem' }}>
        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '0.5rem',
          color: '#132f66',
          lineHeight: 1.3
        }}>
          {newsletter.title}
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: '#718096',
          marginBottom: '0.5rem'
        }}>
          {newsletter.date}
        </p>
        <p style={{
          fontSize: '0.9rem',
          color: '#4a5568',
          marginBottom: '1rem',
          lineHeight: 1.5
        }}>
          {newsletter.description}
        </p>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDownload(newsletter.pdf, newsletter.title);
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              onDownload(newsletter.pdf, newsletter.title);
            }
          }}
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #132f66',
            color: '#132f66',
            padding: '0.5rem 1rem',
            borderRadius: '40px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            minHeight: '44px',
            minWidth: '44px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#132f66';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#132f66';
          }}
          aria-label={`Download ${newsletter.title} PDF`}
        >
          <i className="fas fa-download me-2" aria-hidden="true"></i>
          Download PDF
        </button>
      </div>
    </div>
  );
});

NewsletterCard.displayName = 'NewsletterCard';

// Memoized blog card component with accessibility
const BlogCard = memo(({ post, onClick }) => {
  const [imgSrc, setImgSrc] = useState(post.image);
  const [loaded, setLoaded] = useState(false);
  const cardId = `blog-${post.id}`;

  return (
    <div
      id={cardId}
      onClick={() => onClick(post)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick(post);
        }
      }}
      role="article"
      tabIndex={0}
      aria-label={`Blog post: ${post.title}`}
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        overflow: 'hidden',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        cursor: 'pointer',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        backgroundColor: '#f0f0f0'
      }}>
        {!loaded && (
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite'
          }} aria-hidden="true" />
        )}
        <img
          src={imgSrc}
          alt={`Featured image for blog: ${post.title}`}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={(e) => {
            e.target.onerror = null;
            setImgSrc(FALLBACK_IMAGES.blog);
          }}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease, transform 0.3s ease'
          }}
        />
        <div style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: '#cebd04',
          color: '#132f66',
          padding: '0.25rem 1rem',
          borderRadius: '40px',
          fontSize: '0.8rem',
          fontWeight: '600',
          zIndex: 2
        }} aria-label={`Category: ${post.category}`}>
          {post.category}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          marginBottom: '0.75rem',
          fontSize: '0.8rem',
          color: '#718096'
        }}>
          <span>
            <i className="far fa-calendar-alt me-1" aria-hidden="true"></i> 
            <span className="visually-hidden">Published: </span>{post.date}
          </span>
          <span>
            <i className="far fa-clock me-1" aria-hidden="true"></i> 
            <span className="visually-hidden">Read time: </span>{post.readTime}
          </span>
        </div>

        <h3 style={{
          fontSize: '1.2rem',
          fontWeight: 'bold',
          marginBottom: '0.75rem',
          color: '#132f66',
          lineHeight: 1.3
        }}>
          {post.title}
        </h3>

        <p style={{
          fontSize: '0.9rem',
          color: '#4a5568',
          marginBottom: '1rem',
          lineHeight: 1.5,
          flex: 1
        }}>
          {post.excerpt}
        </p>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
          padding: '0.5rem',
          backgroundColor: '#f8fafc',
          borderRadius: '40px'
        }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: '#132f66',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '1rem',
            fontWeight: 'bold'
          }} aria-hidden="true">
            {post.author.charAt(0)}
          </div>
          <div>
            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#2c3e50' }}>
              {post.author}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#718096' }}>
              {post.authorTitle}
            </div>
          </div>
        </div>

        <button
          style={{
            backgroundColor: 'transparent',
            border: '2px solid #132f66',
            color: '#132f66',
            padding: '0.5rem 1rem',
            borderRadius: '40px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            minHeight: '44px',
            minWidth: '44px'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#132f66';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent';
            e.target.style.color = '#132f66';
          }}
          aria-label={`Read full article: ${post.title}`}
        >
          Read Full Article <i className="fas fa-arrow-right ms-2" aria-hidden="true"></i>
        </button>
      </div>
    </div>
  );
});

BlogCard.displayName = 'BlogCard';

// Modal component with accessibility
const Modal = ({ show, onClose, children, title }) => {
  if (!show) return null;

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.8)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        overflowY: 'auto'
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal dialog"}
      tabIndex={-1}
    >
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative'
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
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
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
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            zIndex: 10
          }}
          aria-label="Close modal"
        >
          ✕
          <span className="visually-hidden">Close</span>
        </button>
        {children}
      </div>
    </div>
  );
};

function News() {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // Newsletter data
  const newsletters = [
    {
      id: 1,
      term: "Term 1",
      year: "2025",
      title: "Term 1 Newsletter 2025",
      image: "/images/newsletters/term1-2025.jpg",
      pdf: "/pdfs/newsletters/term1-2025.pdf",
      date: "April 2025",
      description: "Welcome back to school, new academic year highlights, and parent information."
    },
    {
      id: 2,
      term: "Term 2",
      year: "2024",
      title: "Term 2 Newsletter 2024",
      image: "/images/newsletters/term2-2024.jpg",
      pdf: "/pdfs/newsletters/term2-2024.pdf",
      date: "August 2024",
      description: "Recap of Term 2 activities, examination results, and upcoming events."
    },
    {
      id: 3,
      term: "Term 3",
      year: "2024",
      title: "Term 3 Newsletter 2024",
      image: "/images/newsletters/term3-2024.jpg",
      pdf: "/pdfs/newsletters/term3-2024.pdf",
      date: "December 2024",
      description: "End of year summary, graduation ceremony, and holiday programs."
    }
  ];

  // Blog data
  const blogPosts = [
    {
      id: 1,
      title: "The Importance of Early Childhood Education",
      excerpt: "Discover why the early years are crucial for your child's development and how our ECDE program nurtures young minds through play-based learning.",
      content: `
        <div class="blog-content">
          <h2>The Foundation of Lifelong Learning</h2>
          <p>The early years of a child's life are not just about learning ABCs and 123s. They are about building the neural connections that form the foundation for all future learning. At Kitale Progressive School, we understand that these formative years are critical, and our Early Childhood Development Education (ECDE) program is designed with this understanding at its core.</p>
          
          <h3>Why Early Childhood Education Matters</h3>
          <p>Research in neuroscience has shown that a child's brain develops most rapidly in the first five years of life. During this period, up to 90% of brain development occurs. This is when children develop cognitive skills, emotional regulation, social abilities, and the foundational knowledge that will support all future learning.</p>
          
          <h3>Our Approach at Kitale Progressive School</h3>
          <p>Our ECDE program is built on the understanding that young children learn best through play. We've developed a curriculum that integrates language, mathematics, environmental studies, creative arts, and social-emotional learning through engaging, play-based activities.</p>
          
          <p>Through guided play, children develop cognitive skills, language abilities, social competence, physical coordination, and emotional regulation. Our classrooms are designed as learning environments where every activity has educational purpose.</p>
        </div>
      `,
      image: "/images/blog/early-childhood.jpg",
      author: "Ms. Jane Akinyi",
      authorTitle: "ECDE Coordinator",
      date: "March 15, 2025",
      category: "Education",
      readTime: "5 min read"
    },
    {
      id: 2,
      title: "Preparing Your Child for Boarding School",
      excerpt: "A comprehensive guide for parents on how to prepare their children for a successful boarding school experience, including emotional readiness and practical tips.",
      content: `
        <div class="blog-content">
          <h2>Making the Transition to Boarding School a Positive Experience</h2>
          <p>The decision to send your child to boarding school is significant, filled with both excitement and anxiety. At Kitale Progressive School, we've helped hundreds of families navigate this transition successfully.</p>
          
          <h3>Understanding the Boarding Experience</h3>
          <p>Before preparing your child, it's helpful to understand what boarding school life actually looks like. At Kitale Progressive School, our boarding program is designed to be a home away from home, not just a place to sleep between classes.</p>
          
          <h3>Emotional Preparation: The Key to Success</h3>
          <p>The emotional transition to boarding school is often the most challenging aspect. Children may experience homesickness, anxiety about new social situations, or worry about academic expectations.</p>
          
          <p>Start conversations early, visit the school together, connect with future classmates, and develop independence gradually. These steps can make the transition smoother.</p>
        </div>
      `,
      image: "/images/blog/boarding-prep.jpg",
      author: "Mr. Peter Mwangi",
      authorTitle: "Boarding Master",
      date: "March 10, 2025",
      category: "Parenting",
      readTime: "6 min read"
    },
    {
      id: 3,
      title: "Understanding the CBC Curriculum",
      excerpt: "Everything you need to know about the Competency-Based Curriculum and how it benefits your child's learning journey, from ECDE to Junior Secondary.",
      content: `
        <div class="blog-content">
          <h2>A Comprehensive Guide to the Competency-Based Curriculum</h2>
          <p>Kenya's shift from the 8-4-4 system to the Competency-Based Curriculum (CBC) represents one of the most significant educational reforms in the country's history.</p>
          
          <h3>What is CBC?</h3>
          <p>The Competency-Based Curriculum is a modern approach to education that focuses on developing learners' abilities and potential rather than just academic content. Instead of emphasizing memorization and exam performance, CBC prioritizes the development of practical skills, values, and competencies.</p>
          
          <h3>The Seven Core Competencies</h3>
          <p>CBC is organized around seven core competencies: Communication and Collaboration, Critical Thinking and Problem Solving, Creativity and Imagination, Citizenship, Digital Literacy, Learning to Learn, and Self-Efficacy.</p>
          
          <h3>How We Implement CBC</h3>
          <p>Our teachers participate in ongoing professional development to understand CBC philosophy and implement learner-centered teaching methods. They learn to facilitate rather than lecture, to observe and respond to individual learner needs.</p>
        </div>
      `,
      image: "/images/blog/cbc-curriculum.jpg",
      author: "Mrs. Sarah Wanjiku",
      authorTitle: "Academic Director",
      date: "March 5, 2025",
      category: "Academics",
      readTime: "7 min read"
    }
  ];

  const handleNewsletterClick = useCallback((newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowNewsletterModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleBlogClick = useCallback((blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowNewsletterModal(false);
    setShowBlogModal(false);
    document.body.style.overflow = 'unset';
  }, []);

  const handleDownload = useCallback((pdfUrl, title) => {
    const link = document.createElement('a');
    link.href = pdfUrl;
    link.download = `${title.replace(/\s+/g, '_')}.pdf`;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.setAttribute('aria-label', `Download ${title} PDF`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  return (
    <>
      <Helmet>
        <title>News & Blog | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Stay updated with the latest news, events, blog posts, and termly newsletters at Kitale Progressive School." 
        />
      </Helmet>

      {/* Page Header with proper heading hierarchy */}
      <section 
        style={{
          background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
          color: 'white',
          paddingTop: '120px',
          paddingBottom: '40px',
          textAlign: 'center'
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
            News & Blog
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.1rem)',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            Stay updated with the latest happenings at Kitale Progressive School
          </p>
        </Container>
      </section>

      {/* Termly Newsletters Section */}
      <section className="py-5 bg-light-custom" aria-labelledby="newsletters-heading">
        <Container>
          <div className="text-center mb-5">
            <h2 id="newsletters-heading" style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 'bold',
              color: '#132f66',
              marginBottom: '1rem'
            }}>
              Termly Newsletters
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#4a5568',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Download our termly newsletters to stay informed about school activities, achievements, and updates
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
            role="list"
            aria-label="Newsletters"
          >
            {newsletters.map((newsletter) => (
              <div key={newsletter.id} role="listitem">
                <NewsletterCard
                  newsletter={newsletter}
                  onClick={handleNewsletterClick}
                  onDownload={handleDownload}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Blog Section */}
      <section id="blog-section" className="py-5 bg-white" aria-labelledby="blog-heading">
        <Container>
          <div className="text-center mb-5">
            <h2 id="blog-heading" style={{
              fontSize: 'clamp(1.5rem, 4vw, 2rem)',
              fontWeight: 'bold',
              color: '#132f66',
              marginBottom: '1rem'
            }}>
              Latest from Our Blog
            </h2>
            <p style={{
              fontSize: '1rem',
              color: '#4a5568',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Insights, stories, and updates from our school community
            </p>
          </div>

          <div 
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '2rem'
            }}
            role="list"
            aria-label="Blog posts"
          >
            {blogPosts.map((post) => (
              <div key={post.id} role="listitem">
                <BlogCard
                  post={post}
                  onClick={handleBlogClick}
                />
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Newsletter Modal */}
      <Modal show={showNewsletterModal} onClose={handleCloseModal} title={selectedNewsletter?.title}>
        {selectedNewsletter && (
          <div style={{ padding: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#132f66',
              marginBottom: '1.5rem'
            }}>
              {selectedNewsletter.title}
            </h2>
            
            <img
              src={selectedNewsletter.image}
              alt={`Cover image for ${selectedNewsletter.title}`}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'contain',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGES.newsletter;
              }}
            />
            
            <p style={{
              fontSize: '1rem',
              color: '#4a5568',
              marginBottom: '1rem',
              lineHeight: 1.6
            }}>
              {selectedNewsletter.description}
            </p>
            
            <p style={{
              fontSize: '0.9rem',
              color: '#718096',
              marginBottom: '1.5rem'
            }}>
              Published: {selectedNewsletter.date}
            </p>
            
            <button
              onClick={() => handleDownload(selectedNewsletter.pdf, selectedNewsletter.title)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleDownload(selectedNewsletter.pdf, selectedNewsletter.title);
                }
              }}
              style={{
                backgroundColor: '#132f66',
                border: 'none',
                color: 'white',
                padding: '0.75rem 2rem',
                borderRadius: '40px',
                fontSize: '1rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                width: '100%',
                minHeight: '44px',
                minWidth: '44px'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#0a1f4d';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#132f66';
                e.target.style.transform = 'translateY(0)';
              }}
              aria-label={`Download ${selectedNewsletter.title} PDF`}
            >
              <i className="fas fa-download me-2" aria-hidden="true"></i>
              Download PDF
            </button>
          </div>
        )}
      </Modal>

      {/* Blog Modal */}
      <Modal show={showBlogModal} onClose={handleCloseModal} title={selectedBlog?.title}>
        {selectedBlog && (
          <div style={{ padding: '2rem' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#132f66',
              marginBottom: '1rem'
            }}>
              {selectedBlog.title}
            </h2>
            
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '1.5rem',
              fontSize: '0.9rem',
              color: '#718096',
              flexWrap: 'wrap'
            }}>
              <span className="badge" style={{
                backgroundColor: '#cebd04',
                color: '#132f66',
                padding: '0.25rem 1rem',
                borderRadius: '40px',
                fontWeight: '600'
              }}>
                {selectedBlog.category}
              </span>
              <span>
                <i className="far fa-clock me-1" aria-hidden="true"></i> 
                <span className="visually-hidden">Read time: </span>{selectedBlog.readTime}
              </span>
              <span>
                <i className="far fa-calendar-alt me-1" aria-hidden="true"></i> 
                <span className="visually-hidden">Published: </span>{selectedBlog.date}
              </span>
            </div>

            <img
              src={selectedBlog.image}
              alt={`Featured image for ${selectedBlog.title}`}
              style={{
                width: '100%',
                maxHeight: '300px',
                objectFit: 'cover',
                borderRadius: '8px',
                marginBottom: '1.5rem'
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = FALLBACK_IMAGES.blog;
              }}
            />

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1rem',
              backgroundColor: '#f8fafc',
              borderRadius: '40px'
            }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                backgroundColor: '#132f66',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold'
              }} aria-hidden="true">
                {selectedBlog.author.charAt(0)}
              </div>
              <div>
                <div style={{ fontSize: '1rem', fontWeight: '600', color: '#2c3e50' }}>
                  {selectedBlog.author}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#718096' }}>
                  {selectedBlog.authorTitle}
                </div>
              </div>
            </div>

            <div
              className="blog-content"
              style={{
                fontSize: '1rem',
                color: '#4a5568',
                lineHeight: 1.7
              }}
              dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
            />

            <div className="text-center mt-4">
              <button
                onClick={handleCloseModal}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCloseModal();
                  }
                }}
                style={{
                  backgroundColor: 'transparent',
                  border: '2px solid #132f66',
                  color: '#132f66',
                  padding: '0.5rem 2rem',
                  borderRadius: '40px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  minHeight: '44px',
                  minWidth: '44px'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#132f66';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = 'transparent';
                  e.target.style.color = '#132f66';
                }}
                aria-label="Close blog post"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>

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
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: bold;
          color: #132f66;
          margin: 2rem 0 1rem;
        }
        .blog-content h3 {
          font-size: 1.2rem;
          font-weight: bold;
          color: #2c3e50;
          margin: 1.5rem 0 0.75rem;
        }
        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
        }
        .blog-content ul {
          margin: 1rem 0;
          padding-left: 2rem;
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        button:focus-visible,
        [role="article"]:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        @media (max-width: 768px) {
          .blog-content h2 {
            font-size: 1.3rem;
          }
          .blog-content h3 {
            font-size: 1.1rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          * {
            transition: none !important;
            animation: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(News);