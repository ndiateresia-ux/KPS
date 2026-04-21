// pages/News.jsx - Fully Updated with Theme CSS Integration
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useState, useCallback, lazy, Suspense, memo, useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Optimized Image Component with WebP support and better error handling
const OptimizedImage = memo(({ src, alt, className = '', width, height, priority = false, fallbackCategory = 'newsletter', onLoad, onError }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const imgRef = useRef(null);
  
  // Fallback images
  const FALLBACK_IMAGES = useMemo(() => ({
    newsletter: "https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80&fm=webp",
    blog: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80&fm=webp"
  }), []);

  // Reset state when src changes
  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setError(false);
  }, [src]);

  // Handle error - try different formats then fallback to Unsplash
  const handleError = () => {
    console.log(`Image failed to load: ${currentSrc}`);
    
    if (!error) {
      // Try different format
      if (currentSrc.endsWith('.webp')) {
        const jpgSrc = currentSrc.replace('.webp', '.jpg');
        console.log(`Trying JPG fallback: ${jpgSrc}`);
        setCurrentSrc(jpgSrc);
        setError(false);
      } else if (currentSrc.endsWith('.jpg')) {
        const pngSrc = currentSrc.replace('.jpg', '.png');
        console.log(`Trying PNG fallback: ${pngSrc}`);
        setCurrentSrc(pngSrc);
        setError(false);
      } else {
        console.log('All formats failed, using Unsplash fallback');
        setError(true);
        setCurrentSrc(FALLBACK_IMAGES[fallbackCategory]);
        if (onError) onError();
      }
    }
  };

  // Handle successful load
  const handleLoad = () => {
    console.log(`Image loaded successfully: ${currentSrc}`);
    setLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <img
      ref={imgRef}
      src={currentSrc}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchpriority={priority ? "high" : "auto"}
      decoding="async"
      width={width}
      height={height}
      onLoad={handleLoad}
      onError={handleError}
      className={`curriculum-image ${loaded ? 'loaded' : ''} ${className}`}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'cover'
      }}
    />
  );
});

OptimizedImage.displayName = 'OptimizedImage';

// Memoized newsletter card component with accessibility
const NewsletterCard = memo(({ newsletter, onClick, onDownload }) => {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);
  const cardId = `newsletter-${newsletter.id}`;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(newsletter);
    }
  }, [onClick, newsletter]);

  const handleDownloadClick = useCallback((e) => {
    e.stopPropagation();
    onDownload(newsletter.pdf, newsletter.title);
  }, [onDownload, newsletter]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    console.log(`Newsletter image loaded for: ${newsletter.title}`);
    setLoaded(true);
  }, [newsletter.title]);

  return (
    <div
      ref={cardRef}
      id={cardId}
      onClick={() => onClick(newsletter)}
      onKeyDown={handleKeyDown}
      role="article"
      tabIndex={0}
      aria-label={`Newsletter: ${newsletter.title}`}
      className="card-custom newsletter-card"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <div className="curriculum-image-wrapper" style={{
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        backgroundColor: 'var(--gray-light)'
      }}>
        {!loaded && (
          <div className="image-skeleton" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }} aria-hidden="true" />
        )}
        
        <OptimizedImage
          src={newsletter.image}
          alt={`Cover image for ${newsletter.title}`}
          fallbackCategory="newsletter"
          priority={newsletter.id === 1}
          onLoad={handleImageLoad}
        />
        
        <div className="term-badge" style={{
          position: 'absolute',
          top: '1rem',
          right: '1rem',
          backgroundColor: 'var(--navy)',
          color: 'white',
          padding: '0.25rem 1rem',
          borderRadius: '40px',
          fontSize: '0.8rem',
          fontWeight: '600',
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }} aria-hidden="true">
          {newsletter.term} {newsletter.year}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <h3 className="card-title-navy" style={{
          fontSize: '1.2rem',
          marginBottom: '0.5rem',
          lineHeight: 1.3
        }}>
          {newsletter.title}
        </h3>
        <p style={{
          fontSize: '0.85rem',
          color: '#718096',
          marginBottom: '0.5rem'
        }}>
          <i className="far fa-calendar-alt me-2" aria-hidden="true"></i>
          {newsletter.date}
        </p>
        <p className="text-muted" style={{
          fontSize: '0.9rem',
          marginBottom: '1rem',
          lineHeight: 1.5,
          flex: 1
        }}>
          {newsletter.description}
        </p>
        <button
          onClick={handleDownloadClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              e.stopPropagation();
              handleDownloadClick(e);
            }
          }}
          className="btn-navy"
          style={{
            width: '100%',
            minHeight: '44px'
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

// Memoized blog card component with author trust label
const BlogCard = memo(({ post, onClick }) => {
  const [loaded, setLoaded] = useState(false);
  const cardRef = useRef(null);
  const cardId = `blog-${post.id}`;

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick(post);
    }
  }, [onClick, post]);

  // Handle image load
  const handleImageLoad = useCallback(() => {
    console.log(`Blog image loaded for: ${post.title}`);
    setLoaded(true);
  }, [post.title]);

  return (
    <div
      ref={cardRef}
      id={cardId}
      onClick={() => onClick(post)}
      onKeyDown={handleKeyDown}
      role="article"
      tabIndex={0}
      aria-label={`Blog post: ${post.title}`}
      className="card-custom blog-card"
      style={{
        overflow: 'hidden',
        cursor: 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        border: `1px solid rgba(255, 0, 128, 0.2)`
      }}
    >
      <div className="curriculum-image-wrapper" style={{
        position: 'relative',
        aspectRatio: '16/9',
        overflow: 'hidden',
        backgroundColor: 'var(--gray-light)'
      }}>
        {!loaded && (
          <div className="image-skeleton" style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 1
          }} aria-hidden="true" />
        )}
        
        <OptimizedImage
          src={post.image}
          alt={`Featured image for blog: ${post.title}`}
          fallbackCategory="blog"
          onLoad={handleImageLoad}
        />
        
        <div className="category-badge" style={{
          position: 'absolute',
          top: '1rem',
          left: '1rem',
          backgroundColor: 'var(--primary)',
          color: 'white',
          padding: '0.35rem 1.2rem',
          borderRadius: '40px',
          fontSize: '0.8rem',
          fontWeight: '700',
          zIndex: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          letterSpacing: '0.5px'
        }} aria-label={`Category: ${post.category}`}>
          {post.category}
        </div>
      </div>
      
      <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1.5rem',
          marginBottom: '0.75rem',
          fontSize: '0.8rem',
          color: '#718096',
          flexWrap: 'wrap'
        }}>
          <span>
            <i className="far fa-calendar-alt me-2 text-gold" aria-hidden="true"></i> 
            <span className="visually-hidden">Published: </span>{post.date}
          </span>
          <span>
            <i className="far fa-clock me-2 text-gold" aria-hidden="true"></i> 
            <span className="visually-hidden">Read time: </span>{post.readTime}
          </span>
        </div>

        <h3 className="card-title-navy" style={{
          fontSize: '1.2rem',
          marginBottom: '0.75rem',
          lineHeight: 1.3
        }}>
          {post.title}
        </h3>

        <p className="text-muted" style={{
          fontSize: '0.9rem',
          marginBottom: '1rem',
          lineHeight: 1.5,
          flex: 1
        }}>
          {post.excerpt}
        </p>

        {/* Author Trust Label - Written by Our School Team */}
        <div className="author-badge" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          marginBottom: '1rem',
          padding: '0.6rem',
          backgroundColor: '#fff9e6',
          borderRadius: '40px',
          border: '1px solid rgba(255, 0, 128, 0.3)'
        }}>
          <div className="author-avatar" style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            background: 'var(--gradient-primary)',
            color: 'white',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '0.9rem',
            fontWeight: 'bold',
            boxShadow: '0 2px 8px rgba(13,101,251,0.2)',
            flexShrink: 0
          }} aria-hidden="true">
            {post.author.charAt(0)}
          </div>
          <div>
            <div className="author-name" style={{
              fontWeight: '700',
              color: 'var(--navy)',
              fontSize: '0.85rem'
            }}>
              {post.author}
            </div>
            <div className="author-title" style={{
              fontSize: '0.65rem',
              color: '#718096',
              letterSpacing: '0.3px'
            }}>
              Written by Our School Team
            </div>
          </div>
        </div>

        <button
          className="btn-navy"
          style={{
            backgroundColor: 'var(--gold)',
            border: 'none',
            color: 'white',
            padding: '0.6rem 1rem',
            borderRadius: '40px',
            fontSize: '0.85rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            width: '100%',
            minHeight: '44px',
            boxShadow: '0 4px 12px rgba(255, 0, 128, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gold-dark)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--gold)';
            e.currentTarget.style.transform = 'translateY(0)';
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
const Modal = memo(({ show, onClose, children, title }) => {
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (show && modalRef.current) {
      closeButtonRef.current?.focus();
      document.body.style.overflow = 'hidden';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [show]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  }, [onClose]);

  if (!show) return null;

  return (
    <div
      ref={modalRef}
      className="modal-overlay"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.95)',
        zIndex: 100000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        backdropFilter: 'blur(5px)'
      }}
      onClick={onClose}
      onKeyDown={handleKeyDown}
      role="dialog"
      aria-modal="true"
      aria-label={title || "Modal dialog"}
      tabIndex={-1}
    >
      <div
        className="modal-container"
        style={{
          backgroundColor: 'var(--white)',
          borderRadius: '24px',
          maxWidth: '800px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          position: 'relative',
          boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          ref={closeButtonRef}
          onClick={onClose}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onClose();
            }
          }}
          className="modal-close-btn"
          style={{
            position: 'absolute',
            top: '1rem',
            right: '1rem',
            background: 'var(--navy)',
            border: 'none',
            borderRadius: '50%',
            width: '44px',
            height: '44px',
            fontSize: '1.2rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            transition: 'all 0.2s ease',
            zIndex: 10
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--navy-dark)';
            e.currentTarget.style.transform = 'scale(1.1)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = 'var(--navy)';
            e.currentTarget.style.transform = 'scale(1)';
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
});

Modal.displayName = 'Modal';

function News() {
  const [showNewsletterModal, setShowNewsletterModal] = useState(false);
  const [selectedNewsletter, setSelectedNewsletter] = useState(null);
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [showBlogModal, setShowBlogModal] = useState(false);

  // Newsletter data - includes academic updates, events, and student achievements
  const newsletters = useMemo(() => [
    {
      id: 1,
      term: "Term 1",
      year: "2026",
      title: "Term 1 Newsletter 2025",
      image: "/images/term1-2025.jpg",
      pdf: "/pdfs/newsletters/term1-2025.pdf",
      date: "April 2025",
      description: "Welcome back to school, new academic year highlights, parent information, and student achievements from Term 1."
    },
    {
      id: 2,
      term: "Term 2",
      year: "2026",
      title: "Term 2 Newsletter 2024",
      image: "/images/term2-2024.jpg",
      pdf: "/pdfs/newsletters/term2-2024.pdf",
      date: "August 2024",
      description: "Recap of Term 2 activities, examination results, school events, and upcoming academic milestones."
    },
    {
      id: 3,
      term: "Term 3",
      year: "2024",
      title: "Term 3 Newsletter 2024",
      image: "/images/term3-2024.jpg",
      pdf: "/pdfs/newsletters/term3-2024.pdf",
      date: "December 2024",
      description: "End of year summary, graduation ceremony, holiday programs, and celebrating student achievements."
    }
  ], []);

  // Blog data - with author trust labels
  const blogPosts = useMemo(() => [
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
      image: "/images/childhoodblog.jpg",
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
      image: "/images/boardingblog.webp",
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
      image: "/images/cbc-curriculumblog.jpg",
      author: "Mrs. Sarah Wanjiku",
      authorTitle: "Academic Director",
      date: "March 5, 2025",
      category: "Academics",
      readTime: "7 min read"
    }
  ], []);

  const handleNewsletterClick = useCallback((newsletter) => {
    setSelectedNewsletter(newsletter);
    setShowNewsletterModal(true);
  }, []);

  const handleBlogClick = useCallback((blog) => {
    setSelectedBlog(blog);
    setShowBlogModal(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setShowNewsletterModal(false);
    setShowBlogModal(false);
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
        <title>Stories, Updates & School Life in Action | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="See how learners grow, participate, and experience life at Kitale Progressive School. Read our blog for parenting insights, download termly newsletters, and stay connected with school life." 
        />
        <link rel="preconnect" href="https://images.unsplash.com" />
        <link rel="dns-prefetch" href="https://images.unsplash.com" />
      </Helmet>

      {/* Hero Section - Using theme page-title-section */}
      <section className="page-title-section" aria-labelledby="page-title">
        <Container>
          <h1 id="page-title" className="display-5 fw-bold">
            Stories, Updates & School Life in Action
          </h1>
          <p className="lead">
            See how learners grow, participate, and experience life at Kitale Progressive School throughout the year.
          </p>
        </Container>
      </section>

      {/* Blog Section with Parent Hook and Updated Intro */}
      <section className="py-4" aria-labelledby="blog-heading">
        <Container>
          {/* Parent Hook */}
          <div className="text-center mb-1">
            <span className="parent-hook-badge" style={{
              backgroundColor: '#fff9e6',
              color: 'var(--navy)',
              padding: '0.4rem 1.2rem',
              borderRadius: '40px',
              fontSize: '0.8rem',
              fontWeight: '600',
              display: 'inline-block',
              border: '1px solid rgba(255, 0, 128, 0.3)'
            }}>
              <i className="fas fa-lightbulb me-2 text-gold" aria-hidden="true"></i>
              For Parents
            </span>
          </div>
          
          <h2 id="blog-heading" className="section-heading mb-3">
            Insights for Parents & Real School Experiences
          </h2>
          
          <p className="lead text-center mb-1" style={{
            maxWidth: '700px',
            margin: '0 auto',
            fontSize: '1.1rem'
          }}>
            Are you looking for guidance, insights, and a closer look into your child's school experience?
          </p>
          
          <p className="text-center mb-4 text-muted" style={{
            maxWidth: '650px',
            margin: '0.5rem auto 0',
            fontSize: '0.9rem'
          }}>
            Explore articles that help you understand your child's learning journey, school life, and how to support their growth.
          </p>

          {/* Blog Cards Grid */}
          <Row className="g-4" role="list" aria-label="Blog posts">
            {blogPosts.map((post) => (
              <Col key={post.id} md={6} lg={4} role="listitem">
                <BlogCard
                  post={post}
                  onClick={handleBlogClick}
                />
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Termly Newsletters Section - Updated */}
      <section className="py-4 bg-light-custom" aria-labelledby="newsletters-heading">
        <Container>
          <div className="text-center mb-4">
            <h2 id="newsletters-heading" className="section-heading mb-3">
              Follow Your Child's School Journey
            </h2>
            <p className="lead text-muted" style={{
              maxWidth: '700px',
              margin: '0 auto',
              fontSize: '1rem'
            }}>
              Stay informed with termly updates on academic progress, school activities, events, and key milestones in your child's learning journey.
            </p>
            <p className="text-muted" style={{
              fontSize: '0.85rem',
              maxWidth: '600px',
              margin: '0.5rem auto 0'
            }}>
              Includes academic updates, events, and student achievements.
            </p>
          </div>

          <Row className="g-4" role="list" aria-label="Newsletters">
            {newsletters.map((newsletter) => (
              <Col key={newsletter.id} md={6} lg={4} role="listitem">
                <NewsletterCard
                  newsletter={newsletter}
                  onClick={handleNewsletterClick}
                  onDownload={handleDownload}
                />
              </Col>
            ))}
          </Row>

          {/* CTA Buttons after newsletters */}
          <div className="text-center mt-4">
            <div className="d-flex flex-wrap justify-content-center gap-3">
              <Link to="/contact">
                <Button className="btn-navy" style={{ minWidth: '160px' }}>
                  <i className="fas fa-calendar-check me-2" aria-hidden="true"></i>
                  Book a School Visit
                </Button>
              </Link>
              <Link to="/admissions/apply">
                <Button className="btn-navy" style={{ 
                  background: 'var(--gradient-primary)',
                  minWidth: '160px'
                }}>
                  <i className="fas fa-paper-plane me-2" aria-hidden="true"></i>
                  Apply Now
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </section>

      {/* Newsletter Modal */}
      <Modal show={showNewsletterModal} onClose={handleCloseModal} title={selectedNewsletter?.title}>
        {selectedNewsletter && (
          <div style={{ padding: '2rem' }}>
            <h2 className="card-title-navy" style={{
              fontSize: '1.5rem',
              marginBottom: '1.5rem'
            }}>
              {selectedNewsletter.title}
            </h2>
            
            <div className="curriculum-image-wrapper mb-4" style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <OptimizedImage
                src={selectedNewsletter.image}
                alt={`Cover image for ${selectedNewsletter.title}`}
                fallbackCategory="newsletter"
                priority={true}
              />
            </div>
            
            <p className="text-dark" style={{
              fontSize: '1rem',
              marginBottom: '1rem',
              lineHeight: 1.6
            }}>
              {selectedNewsletter.description}
            </p>
            
            <p className="text-muted" style={{
              fontSize: '0.9rem',
              marginBottom: '1.5rem'
            }}>
              <i className="far fa-calendar-alt me-2 text-gold" aria-hidden="true"></i>
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
              className="btn-navy w-100"
              style={{ minHeight: '44px' }}
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
            <h2 className="card-title-navy" style={{
              fontSize: '1.5rem',
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
              <span className="category-badge-static" style={{
                backgroundColor: 'var(--gold)',
                color: 'white',
                padding: '0.25rem 1rem',
                borderRadius: '40px',
                fontWeight: '700',
                fontSize: '0.8rem'
              }}>
                {selectedBlog.category}
              </span>
              <span>
                <i className="far fa-clock me-2 text-gold" aria-hidden="true"></i> 
                <span className="visually-hidden">Read time: </span>{selectedBlog.readTime}
              </span>
              <span>
                <i className="far fa-calendar-alt me-2 text-gold" aria-hidden="true"></i> 
                <span className="visually-hidden">Published: </span>{selectedBlog.date}
              </span>
            </div>

            <div className="curriculum-image-wrapper mb-4" style={{
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden'
            }}>
              <OptimizedImage
                src={selectedBlog.image}
                alt={`Featured image for ${selectedBlog.title}`}
                fallbackCategory="blog"
                priority={true}
              />
            </div>

            <div className="author-badge" style={{
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'linear-gradient(135deg, #fff9e6 0%, #fff 100%)',
              borderRadius: '40px',
              border: '1px solid rgba(255, 0, 128, 0.3)'
            }}>
              <div className="author-avatar" style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--gradient-primary)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                boxShadow: '0 2px 8px rgba(13,101,251,0.2)',
                flexShrink: 0
              }} aria-hidden="true">
                {selectedBlog.author.charAt(0)}
              </div>
              <div>
                <div className="author-name" style={{
                  fontWeight: '700',
                  color: 'var(--navy)',
                  fontSize: '1rem'
                }}>
                  {selectedBlog.author}
                </div>
                <div className="author-title" style={{
                  fontSize: '0.85rem',
                  color: '#718096'
                }}>
                  Written by Our School Team
                </div>
              </div>
            </div>

            <div
              className="blog-content"
              style={{
                fontSize: '1rem',
                color: 'var(--text-dark)',
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
                className="btn-navy"
                style={{
                  padding: '0.75rem 2.5rem',
                  minHeight: '44px',
                  minWidth: '44px',
                  background: 'var(--gradient-primary)'
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

      {/* Critical CSS - Minified with theme variables */}
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
        .newsletter-card,
        .blog-card {
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }
        .newsletter-card:focus-visible,
        .newsletter-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 12px 30px rgba(13,101,251,0.15) !important;
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        .blog-card:focus-visible,
        .blog-card:hover {
          transform: translateY(-6px) !important;
          box-shadow: 0 15px 40px rgba(255,0,128,0.25) !important;
          outline: 3px solid var(--navy);
          outline-offset: 2px;
        }
        button:focus-visible,
        [role="article"]:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        .blog-content h2 {
          font-size: 1.5rem;
          font-weight: 700;
          color: var(--navy);
          margin: 2rem 0 1rem;
          border-left: 4px solid var(--gold);
          padding-left: 1rem;
        }
        .blog-content h3 {
          font-size: 1.2rem;
          font-weight: 600;
          color: var(--text-dark);
          margin: 1.5rem 0 0.75rem;
        }
        .blog-content p {
          margin-bottom: 1rem;
          line-height: 1.7;
          color: var(--text-dark);
        }
        .blog-content ul,
        .blog-content ol {
          margin: 1rem 0;
          padding-left: 2rem;
          color: var(--text-dark);
        }
        .blog-content li {
          margin-bottom: 0.5rem;
        }
        .image-skeleton {
          background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
          background-size: 200% 100%;
          animation: shimmer 1.5s infinite;
        }
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .bg-light-custom {
          background-color: var(--gray-light);
        }
        @media (max-width: 768px) {
          .blog-content h2 {
            font-size: 1.3rem;
          }
          .blog-content h3 {
            font-size: 1.1rem;
          }
          .section-heading {
            font-size: 1.6rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .newsletter-card,
          .blog-card,
          .newsletter-card:focus-visible,
          .newsletter-card:hover,
          .blog-card:focus-visible,
          .blog-card:hover,
          button,
          .image-skeleton {
            transition: none !important;
            animation: none !important;
            transform: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(News);