// pages/FAQ.jsx - Fully Updated with Theme CSS Integration
import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Accordion, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { lazy, Suspense, memo, useCallback } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

function FAQ() {
  const scrollToContact = useCallback(() => {
    const el = document.getElementById("contact-section");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
      el.setAttribute('tabindex', '-1');
      el.focus({ preventScroll: true });
    }
  }, []);

  // Trust Bar Data
  const trustItems = [
    { icon: "✓", label: "CBC Curriculum" },
    { icon: "✓", label: "ECD to Junior Secondary" },
    { icon: "✓", label: "Boarding Available" },
    { icon: "✓", label: "Located in Kitale" }
  ];

  // FAQ DATA - Updated per document guidelines
  const faqCategories = [
    {
      category: "Admissions",
      icon: "📋",
      color: "#4299e1",
      questions: [
        {
          question: "How can I apply for admission at Kitale Progressive School in Kitale, Kenya?",
          answer: `
            You can apply through our <a href="/admissions/apply" class="text-navy fw-bold" aria-label="Online admissions form">online admissions form</a> or visit the school in person. Our admissions team will guide you through the process, including placement, requirements, and next steps to secure your child's position.
            <br/><br/>
            <a href="/admissions/apply" class="text-navy fw-bold" aria-label="Begin your application process">Begin your application here →</a>
          `
        },
        {
          question: "Is there an admission interview or assessment?",
          answer: `
            Yes. Depending on the grade level, learners may undergo a simple assessment to help us understand their current level and place them appropriately for success.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold" aria-label="Contact admissions to schedule an assessment">Contact admissions</a> to schedule an assessment.
          `
        },
        {
          question: "How do I know this is the right school for my child?",
          answer: `
            The best way is to visit the school, meet our teachers, and experience the environment firsthand.
            <br/><br/>
            We are confident that once you see how we combine structured learning, discipline, and a supportive environment, you will feel assured in your decision.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold" aria-label="Book a school visit">Book a school visit →</a>
          `
        },
        {
          question: "What are the school's hair and grooming guidelines for learners?",
          answer: `
            At Kitale Progressive School, we maintain simple and neat grooming standards that support discipline, cleanliness, and a focused learning environment.
            <br/><br/>
            <strong>For girls:</strong><br/>
            • Allowed styles include push-back styles, ponytails, half-lines, twists, three-strand braids, and creative line patterns (without extensions).<br/>
            • Hair should always be kept <strong>away from the face</strong> to support concentration during learning.
            <br/><br/>
            <strong>For boys:</strong><br/>
            • Hair should be <strong>neatly shaved or kept short, clean, and well-combed</strong> at all times.
            <br/><br/>
            These guidelines help maintain a uniform, respectful, and distraction-free school environment for all learners.
          `
        }
      ]
    },
    {
      category: "Academics & Co-curricular",
      icon: "🏆",
      color: "#48bb78",
      questions: [
        {
          question: "Which curriculum does Kitale Progressive School follow in Kenya?",
          answer: `
            We follow the <strong>Competency-Based Curriculum (CBC)</strong>, which focuses on developing practical skills, creativity, critical thinking, and real-world problem-solving.
            <br/><br/>
            Our approach ensures learners are not only academically strong but also confident and capable.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold" aria-label="View full curriculum">View full curriculum →</a>
          `
        },
        {
          question: "What is the average class size?",
          answer: `
            We maintain manageable class sizes to ensure each learner receives adequate attention, support, and engagement during lessons.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold" aria-label="Learn about our teaching approach">Learn about our teaching approach →</a>
          `
        },
        {
          question: "What sports and clubs are available?",
          answer: `
            Sports & clubs include Football, Volleyball, Netball, Handball, Taekwondo, Swimming, Chess, Skating, Music, Debate, Computer Club, and Chinese Language. We focus on skills development, creativity, and global readiness.
            <br/><br/>
            <a href="/academics/clubs-societies" class="text-navy fw-bold" aria-label="View clubs and societies">Clubs & societies</a> | 
            <a href="/school-life/gallery" class="text-navy fw-bold" aria-label="View gallery"> Gallery</a>
          `
        }
      ]
    },
    {
      category: "Boarding & Student Life",
      icon: "🏡",
      color: "#9f7aea",
      questions: [
        {
          question: "What are the boarding facilities like?",
          answer: `
            Our boarding facilities provide a safe, structured, and supportive environment where learners follow a consistent daily routine that balances study, rest, and personal development.
            <br/><br/>
            Boarders are supervised by trained staff to ensure discipline, wellbeing, and proper care.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold" aria-label="View boarding facilities">View boarding facilities →</a>
          `
        },
        {
          question: "How is security ensured for boarders?",
          answer: `
            We prioritize student safety through controlled access, supervision, and structured routines. Learners are always under the care of responsible staff within a secure school environment.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold" aria-label="View safety measures">View safety measures →</a>
          `
        },
        {
          question: "What is the daily routine for boarders?",
          answer: `
            Boarders follow a structured schedule: Wake up at 5:30 AM, morning prep, classes 8:00 AM–5:00 PM, activities, evening prep, supper, lights out 9:00–10:00 PM.
            <br/><br/>
            <a href="/school-life/events" class="text-navy fw-bold" aria-label="View events calendar">View events calendar →</a>
          `
        }
      ]
    },
    {
      category: "Fees & Payments",
      icon: "💰",
      color: "#f56565",
      questions: [
        {
          question: "How can parents pay school fees?",
          answer: `
            Parents can choose between:
            <br/><br/>
            • <strong>Full payment</strong> before the term begins<br/>
            • A <strong>structured installment plan</strong> within the term
            <br/><br/>
            Our goal is to provide flexibility while maintaining a smooth learning experience for every child.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold" aria-label="View fee structure">View fee structure →</a>
          `
        },
        {
          question: "Are there any additional costs besides fees?",
          answer: `
            All school fees are clearly outlined. Any additional costs, such as optional activities or trips, are communicated in advance to ensure full transparency.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold" aria-label="View complete fee breakdown">View complete fee breakdown →</a>
          `
        },
        {
          question: "Does Kitale Progressive School offer sibling discounts?",
          answer: `
            Yes. 5% discount for second and subsequent children from the same family. Applies to school fees only.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold" aria-label="View fee structure">View fee structure →</a>
          `
        }
      ]
    },
    {
      category: "School Transport",
      icon: "🚌",
      color: "#ed8936",
      questions: [
        {
          question: "Does the school provide transport in Kitale?",
          answer: `
            Yes. We provide reliable school transport services covering key areas within Kitale and surrounding regions, ensuring safe and timely travel for learners.
            <br/><br/>
            <a href="/admissions/fee-structure#transport-section" class="text-navy fw-bold" aria-label="View transport facilities">View transport facilities</a> | 
            <a href="/contact" class="text-navy fw-bold" aria-label="Contact transport office"> Contact transport office</a>
          `
        },
        {
          question: "What are the school start and end times?",
          answer: `
            School starts at 8:00 AM and ends at 5:00 PM from Monday to Friday. Check our full 
            <a href="/school-life/events" class="text-navy fw-bold" aria-label="View school calendar">school calendar</a> for term dates, holidays, and special events.
          `
        }
      ]
    }
  ];

  return (
    <>
      <Helmet>
        <title>Frequently Asked Questions | Kitale Progressive School</title>
        <meta
          name="description"
          content="Find clear answers about admissions, CBC curriculum, boarding, fees, and student life at Kitale Progressive School in Kitale, Trans Nzoia County, Kenya."
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How can I apply for admission at Kitale Progressive School in Kitale, Kenya?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "You can apply through our online admissions form or visit the school in person. Our admissions team will guide you through the process, including placement, requirements, and next steps to secure your child's position."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which curriculum does Kitale Progressive School follow in Kenya?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "We follow the Competency-Based Curriculum (CBC), which focuses on developing practical skills, creativity, critical thinking, and real-world problem-solving."
                  }
                },
                {
                  "@type": "Question",
                  "name": "What are the boarding facilities like?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Our boarding facilities provide a safe, structured, and supportive environment where learners follow a consistent daily routine that balances study, rest, and personal development."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How can parents pay school fees?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Parents can choose between full payment before the term begins or a structured installment plan within the term."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>

      {/* HERO SECTION - Using theme page-title-section */}
      <section className="page-title-section" aria-labelledby="page-title">
        <Container>
          <h1 id="page-title" className="display-5 fw-bold">
            Frequently Asked Questions
          </h1>
          <p className="lead">
            Find clear answers about admissions, CBC curriculum, boarding, fees, and student life at Kitale Progressive School.
          </p>
        </Container>
      </section>

      {/* TRUST BAR - Below hero with theme styling */}
      <section className="py-2" style={{ background: 'var(--white)', borderBottom: '1px solid #eef2f6' }} aria-label="Key school features">
        <Container>
          <Row className="g-2 justify-content-center">
            {trustItems.map((item, idx) => (
              <Col key={idx} xs={6} md={3} className="text-center">
                <div className="d-flex align-items-center justify-content-center gap-2">
                  <span className="text-navy fw-bold" style={{ fontSize: '1rem' }} aria-hidden="true">{item.icon}</span>
                  <span className="text-navy small fw-medium">{item.label}</span>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* FAQ CONTENT */}
      <section className="section-padding" style={{ background: 'var(--gray-light)' }} aria-labelledby="faq-heading">
        <Container>
          <h2 id="faq-heading" className="visually-hidden">Frequently Asked Questions by Category</h2>

          {faqCategories.map((cat, catIndex) => (
            <Row key={catIndex} className="mb-4">
              <Col lg={10} className="mx-auto">
                <Card className="card-custom border-0 shadow-sm overflow-hidden">
                  <Card.Body className="p-0">
                    {/* Category Header with theme styling */}
                    <div 
                      style={{
                        backgroundColor: cat.color || 'var(--navy)',
                        padding: '1rem 1.5rem',
                        color: 'white'
                      }}
                      id={`category-${catIndex}`}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span style={{ fontSize: '1.5rem' }} aria-hidden="true">{cat.icon}</span>
                        <h2 className="h5 fw-bold mb-0 text-white">
                          {cat.category}
                          <span className="visually-hidden"> FAQs</span>
                        </h2>
                      </div>
                    </div>

                    {/* Accordion with theme styling */}
                    <div style={{ padding: '0.5rem' }}>
                      <Accordion flush>
                        {cat.questions.map((item, qIndex) => {
                          const eventKey = `${catIndex}-${qIndex}`;
                          return (
                            <Accordion.Item
                              eventKey={eventKey}
                              key={qIndex}
                              style={{
                                border: 'none',
                                borderBottom: qIndex < cat.questions.length - 1 ? '1px solid #e9ecef' : 'none'
                              }}
                            >
                              <Accordion.Header>
                                <h3 className="h6 fw-medium text-dark mb-0" style={{ fontSize: '0.95rem' }}>
                                  {item.question}
                                </h3>
                              </Accordion.Header>
                              <Accordion.Body>
                                <div 
                                  className="text-dark"
                                  dangerouslySetInnerHTML={{ __html: item.answer }}
                                  style={{ lineHeight: 1.6, fontSize: '0.9rem' }}
                                />
                              </Accordion.Body>
                            </Accordion.Item>
                          );
                        })}
                      </Accordion>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))}

          {/* CTA SECTION - Using theme styling */}
          <Row className="mt-5">
            <Col lg={8} className="mx-auto">
              <Card className="card-custom border-0 shadow-lg" style={{
                background: 'var(--gradient-primary)',
                color: 'white'
              }}>
                <Card.Body className="p-4 p-lg-5 text-center">
                  <h3 className="h4 fw-bold mb-2 text-white">
                    Still Have Questions or Ready to Take the Next Step?
                  </h3>
                  <p className="mb-3 text-white opacity-90" style={{ fontSize: '0.95rem' }}>
                    Our admissions team is ready to guide you. Speak with us or begin your application today.
                  </p>
                  <div 
                    className="d-flex gap-3 justify-content-center flex-wrap"
                    role="group"
                    aria-label="Contact options"
                  >
                    <Link
                      to="/contact"
                      className="btn-navy"
                      style={{
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                      aria-label="Contact our admissions team"
                    >
                      Contact Admissions
                    </Link>

                    <Link
                      to="/admissions/apply"
                      className="btn-navy"
                      style={{
                        minHeight: '44px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textDecoration: 'none',
                      }}
                      aria-label="Apply for admission now"
                    >
                      Apply Now
                    </Link>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>


      {/* Critical CSS for Core Web Vitals */}
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
        
        /* Accordion Styling with theme */
        .accordion-button {
          background-color: var(--white) !important;
          color: var(--text-dark) !important;
          padding: 1rem 1.25rem !important;
          font-weight: 500 !important;
          min-height: 44px;
          transition: all 0.2s ease;
        }
        
        .accordion-button:not(.collapsed) {
          background-color: var(--gray-light) !important;
          color: var(--navy) !important;
          box-shadow: none !important;
        }
        
        .accordion-button:focus {
          box-shadow: 0 0 0 3px var(--gold) !important;
          border-color: #e9ecef !important;
          outline: none !important;
        }
        
        .accordion-button::after {
          background-size: 0.9rem !important;
        }
        
        .accordion-body {
          padding: 1rem 1.25rem !important;
          background-color: var(--gray-light) !important;
        }
        
        /* Link styling within answers */
        .text-navy {
          color: var(--navy) !important;
          text-decoration: underline;
          transition: color 0.2s ease;
        }
        
        .text-navy:hover {
          color: var(--gold) !important;
        }
        
        /* Focus states for accessibility */
        a:focus-visible,
        button:focus-visible,
        .accordion-button:focus-visible {
          outline: 3px solid var(--gold);
          outline-offset: 2px;
        }
        
        /* Responsive adjustments */
        @media (max-width: 768px) {
          .accordion-button {
            padding: 0.75rem 1rem !important;
            font-size: 0.85rem;
          }
          .accordion-body {
            padding: 0.75rem 1rem !important;
            font-size: 0.85rem;
          }
          .section-heading {
            font-size: 1.6rem;
          }
        }
        
        @media (max-width: 576px) {
          .section-padding {
            padding: 40px 0;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          *,
          .accordion-button,
          .btn-light-navy,
          .btn-outline-light {
            transition: none !important;
            animation: none !important;
          }
          .btn-light-navy:hover,
          .btn-outline-light:hover {
            transform: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(FAQ);