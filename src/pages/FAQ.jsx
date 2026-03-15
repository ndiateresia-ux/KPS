import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Accordion, Card, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { lazy, Suspense, memo, useCallback } from "react";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

function FAQ() {
  const scrollToContact = useCallback(() => {
    const el = document.getElementById("contact-section");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  }, []);

  // FAQ DATA
  const faqCategories = [
    {
      category: "Admissions",
      icon: "📋",
      color: "#4299e1",
      questions: [
        {
          question: "How can I apply for admission at Kitale Progressive School in Kitale, Kenya?",
          answer: `
            Parents can apply for admission at Kitale Progressive School through a simple, structured process:
            <br/><br/>
            <strong>1. Interview</strong> – All new learners (PP1–Grade 9) attend a brief competency interview (KES 700).<br/>
            <strong>2. Requirements</strong> – A checklist of class items, boarding needs, uniforms, and transport is provided.<br/>
            <strong>3. Purchase & Preparation</strong> – Buy the necessary items and prepare for school.<br/>
            <strong>4. Submit Forms & Documents</strong> – Completed admission form and copy of birth certificate.<br/>
            <strong>5. Fee Payment</strong> – Via official school Paybill or bank account.<br/>
            <strong>6. Meet the Headteacher</strong> – Welcome session and Assessment Number issuance.<br/>
            <strong>7. Meet the Class Teacher</strong> – Class orientation.<br/>
            <strong>8. Boarding Introduction</strong> – Tour and introduction to boarding teachers (if applicable).<br/>
            <strong>9. Transport Orientation</strong> – Day scholars meet drivers and confirm routes.
            <br/><br/>
            <a href="/admissions/apply" class="text-navy fw-bold">Begin your application here →</a>
          `
        },
        {
          question: "When does the admission process start at Kitale Progressive School?",
          answer: `
            Admissions run throughout the year, but the main intake is in January. Mid-term admissions are available depending on space. Parents are encouraged to 
            <a href="/admissions/apply" class="text-navy fw-bold">apply early</a> to secure a spot.
          `
        },
        {
          question: "What are the age requirements for Playgroup at Kitale Progressive School?",
          answer: `
            Our Playgroup is for children aged 2½ to 3½ years. Children learn through play-based activities, early language, music, movement, and social interaction. Classes run Monday–Friday with half-day or full-day options.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold">Learn more about our early years curriculum →</a>
          `
        },
        {
          question: "What documents are needed for admission at Kitale Progressive School?",
          answer: `
            <strong>Required documents:</strong>
            <br/>
            • Child's birth certificate<br/>
            • Previous school report cards<br/>
            • Immunization record<br/>
            • 4 Passport photos<br/>
            • Parents' ID/Passport copies<br/>
            • Transfer letter (if applicable)
            <br/><br/>
            <a href="/admissions/apply" class="text-navy fw-bold">Download admission forms</a> and view the 
            <a href="/admissions/fee-structure" class="text-navy fw-bold"> fee structure</a>.
          `
        },
        {
          question: "Is there an admission interview or assessment at Kitale Progressive School?",
          answer: `
            Yes, a friendly assessment for all new students (PP1–Grade 9) is conducted at KES 700. This is a diagnostic tool, not a pass/fail test.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact admissions</a> to schedule an assessment.
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
            We follow the Competency-Based Curriculum (CBC) approved by KICD. CBC develops learners' skills, values, and competencies for the 21st century.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold">View full curriculum →</a>
          `
        },
        {
          question: "What sports and clubs are available at Kitale Progressive School?",
          answer: `
            Sports & clubs include Football, Volleyball, Netball, Handball, Taekwondo, Swimming, Chess, Skating, Music, Debate, Computer Club, and Chinese Language. We focus on skills development, creativity, and global readiness.
            <br/><br/>
            <a href="/academics/clubs-societies" class="text-navy fw-bold">Clubs & societies</a> | 
            <a href="/school-life/gallery" class="text-navy fw-bold"> Gallery</a>
          `
        },
        {
          question: "What is the average class size at Kitale Progressive School?",
          answer: `
            Average class size is 25–30 learners. Small classes allow for personalized attention and effective learning.
            <br/><br/>
            <a href="/academics/curriculum" class="text-navy fw-bold">Learn about our teaching approach →</a>
          `
        },
        {
          question: "How does Kitale Progressive School support learners with special needs?",
          answer: `
            We have a learning support department offering remedial classes, one-on-one tutoring, and parental support to ensure every child succeeds.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact learning support →</a>
          `
        },
        {
          question: "Are there ICT/computer facilities at Kitale Progressive School?",
          answer: `
            Yes. We have a fully equipped computer lab and integrate ICT into all subjects. Students learn coding, digital literacy, and responsible tech use.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View ICT facilities</a> | 
            <a href="/academics/clubs-societies" class="text-navy fw-bold"> Computer Club</a>
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
          question: "What are the boarding facilities at Kitale Progressive School?",
          answer: `
            Our boarding facilities provide a home away from home. Dorms are separate for boys and girls with comfortable beds, lighting, and 24/7 supervision.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View boarding facilities</a> | 
            <a href="/school-life/gallery" class="text-navy fw-bold"> Gallery</a>
          `
        },
        {
          question: "What is the daily routine for boarders at Kitale Progressive School?",
          answer: `
            Boarders follow a structured schedule: Wake up at 5:30 AM, morning prep, classes 8:00 AM–5:00 PM, activities, evening prep, supper, lights out 9:00–10:00 PM.
            <br/><br/>
            <a href="/school-life/events" class="text-navy fw-bold">View events calendar →</a>
          `
        },
        {
          question: "What meals are provided for boarders at Kitale Progressive School?",
          answer: `
            Boarders receive breakfast, lunch, supper, morning and evening tea. Meals are nutritious and approved by a nutritionist.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View dining facilities →</a>
          `
        },
        {
          question: "How is security ensured for boarders?",
          answer: `
            We provide 24/7 security, secure fencing, and strict visitor protocols. House parents live within dormitories for constant supervision.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View safety measures →</a>
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
          question: "How much are the school fees at Kitale Progressive School?",
          answer: `
            Fees vary by grade level and student type (day or boarder). View the detailed fees here:
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View complete fee structure →</a>
          `
        },
        {
          question: "How can parents pay school fees?",
          answer: `
            Payment methods: Official school Paybill, bank transfer, or direct bank deposit. Flexible installment plans are available through prior arrangement.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact finance office →</a>
          `
        },
        {
          question: "Are there any additional costs besides fees?",
          answer: `
            Additional costs may include uniforms, stationery, co-curricular activities, and special events.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View complete fee breakdown →</a>
          `
        },
        {
          question: "Does Kitale Progressive School offer sibling discounts?",
          answer: `
            Yes. 5% discount for second and subsequent children from the same family. Applies to school fees only.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View fee structure →</a>
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
          question: "Does Kitale Progressive School provide school transport services in Kitale?",
          answer: `
            Yes, Kitale Progressive School provides safe and reliable school transport. Our school vans run Monday to Friday, with options for: Two-way (pick-up & drop-off) or One-way (pick-up only). Day scholars meet drivers during orientation and confirm van routes.
            <br/><br/>
            <a href="/school-life/facilities" class="text-navy fw-bold">View transport facilities</a> | 
            <a href="/contact" class="text-navy fw-bold"> Contact transport office</a>
          `
        },
        {
          question: "Why do parents in Kitale prefer our school transport services?",
          answer: `
            <strong>Parents love our transport services because:</strong>
            <br/>
            ✔️ Child safety is our priority<br/>
            ✔️ Weatherproof – no walking in rain or dust<br/>
            ✔️ Guaranteed that your child gets home safely<br/>
            ✔️ Friendly drivers who know every child<br/>
            ✔️ Saves time and daily hassle
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact our transport office →</a>
          `
        },
        {
          question: "How much does school transport cost at Kitale Progressive School and which areas do you cover?",
          answer: `
            Transport fees vary depending on the distance from the school. To confirm if your area is covered and get the exact fee, please 
            <a href="/contact" class="text-navy fw-bold">contact our transport office</a> or share your location. Transport Fees are paid per term along with school fees.
            <br/><br/>
            <a href="/admissions/fee-structure" class="text-navy fw-bold">View full fee structure →</a>
          `
        },
        {
          question: "What are the school start and end times for Kitale Progressive School?",
          answer: `
            School starts at 8:00 AM and ends at 5:00 PM from Monday to Friday. Check our full 
            <a href="/school-life/events" class="text-navy fw-bold">school calendar</a> for term dates, holidays, and special events.
          `
        }
      ]
    },
    {
      category: "Parent Involvement & Communication",
      icon: "👪",
      color: "#38b2ac",
      questions: [
        {
          question: "How can parents get involved in school activities?",
          answer: `
            We encourage parent participation through: Parent-Teacher Association (PTA), volunteering for school events, career day presentations, fundraising activities, and attending parent-teacher conferences. We maintain a close parent-teacher partnership with regular academic clinics to keep you informed.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Join our PTA</a> and check our 
            <a href="/school-life/events" class="text-navy fw-bold">events calendar</a> for upcoming opportunities.
          `
        },
        {
          question: "How often are parent-teacher meetings held?",
          answer: `
            We hold formal parent-teacher conferences at the end of each term. However, parents can request meetings with teachers at any time by scheduling through the school office.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact the school office</a> to schedule a meeting.
          `
        },
        {
          question: "How will I receive updates about my child's progress?",
          answer: `
            We provide regular updates through: termly report cards, WhatsApp communication groups, newsletters, and text message alerts for urgent information. We also have regular academic clinics to keep you informed about your child's progress.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Update your contact information</a> to ensure you don't miss any communications.
          `
        }
      ]
    },
    {
      category: "School Policies & Health",
      icon: "📜",
      color: "#667eea",
      questions: [
        {
          question: "What is the school uniform policy?",
          answer: `
            All students are required to wear the complete school uniform as outlined in the parent handbook. Uniforms are available at the school. Sports wear is required on designated days. A requirements checklist is issued for class items, boarding needs, and uniforms during admission.
            <br/><br/>
            Read our full <a href="/privacy-policy" class="text-navy fw-bold">uniform policy</a> and 
            <a href="/terms-of-service" class="text-navy fw-bold">terms of service</a> for more details.
          `
        },
        {
          question: "What is the discipline policy?",
          answer: `
            We follow a positive discipline approach that focuses on character development and restorative justice. We have chapel services for spiritual growth and strong focus on guidance, counselling, and holistic development. Our code of conduct outlines expected behaviors and consequences. Corporal punishment is strictly prohibited.
            <br/><br/>
            Review our <a href="/terms-of-service" class="text-navy fw-bold">code of conduct</a> for complete details.
          `
        },
        {
          question: "How do you handle medical emergencies?",
          answer: `
            In case of emergency, we immediately contact parents and transport the child to the nearest hospital. We have established relationships with Kitale County Hospital and other local medical facilities for quick response.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Contact our health office</a> for more information.
          `
        },
        {
          question: "What should I do if my child is sick?",
          answer: `
            For day scholars, please keep your child at home and inform the school. For boarders, our school matron provides initial care, and parents are contacted immediately for serious cases. We have a partnership with nearby hospitals for emergencies.
            <br/><br/>
            <a href="/contact" class="text-navy fw-bold">Report an absence here</a> or contact the school office directly.
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
          content="Find answers about admissions, CBC curriculum, school fees, boarding, and transport at Kitale Progressive School in Kitale, Trans Nzoia County, Kenya."
        />
        <script type="application/ld+json">
          {`
            {
              "@context": "https://schema.org",
              "@type": "FAQPage",
              "mainEntity": [
                {
                  "@type": "Question",
                  "name": "How do I apply for admission at Kitale Progressive School?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Parents can apply by completing the admission form, submitting required documents, paying the admission fee, and attending a short learner interview."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Which curriculum does Kitale Progressive School follow?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Kitale Progressive School follows the Competency Based Curriculum (CBC) approved by the Kenya Institute of Curriculum Development."
                  }
                },
                {
                  "@type": "Question",
                  "name": "Does Kitale Progressive School offer boarding?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "Yes. Kitale Progressive School offers boarding facilities with supervised dormitories and dedicated boarding staff."
                  }
                },
                {
                  "@type": "Question",
                  "name": "How much are the school fees at Kitale Progressive School?",
                  "acceptedAnswer": {
                    "@type": "Answer",
                    "text": "School fees depend on the grade level and whether the learner is a day scholar or boarder. Parents can view the full fee structure on the school website."
                  }
                }
              ]
            }
          `}
        </script>
      </Helmet>

      {/* HERO SECTION - Always Visible */}
      <section style={{
        background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
        color: 'white',
        paddingTop: '120px',
        paddingBottom: '60px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <Container>
          <Row>
            <Col lg={8} className="mx-auto text-center">
              <h1 style={{
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 'bold',
                marginBottom: '1.5rem',
                color: 'white'
              }}>
                Frequently Asked Questions
              </h1>

              <p style={{
                fontSize: 'clamp(1rem, 4vw, 1.2rem)',
                marginBottom: '2rem',
                color: 'rgba(255,255,255,0.95)',
                maxWidth: '700px',
                margin: '0 auto 2rem auto'
              }}>
                Everything parents need to know about admissions, academics,
                boarding, transport, and school life at Kitale Progressive School.
              </p>

              <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                <Link
                  to="/admissions/apply"
                  style={{
                    backgroundColor: '#cebd04',
                    color: '#132f66',
                    padding: '0.75rem 2rem',
                    borderRadius: '40px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
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
                >
                  Apply Now
                </Link>

                <Link
                  to="/admissions/fee-structure"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '40px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    border: '2px solid white',
                    transition: 'all 0.3s ease'
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
                >
                  Fee Structure
                </Link>

                <Link
                  to="/contact"
                  style={{
                    backgroundColor: 'transparent',
                    color: 'white',
                    padding: '0.75rem 2rem',
                    borderRadius: '40px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    border: '2px solid white',
                    transition: 'all 0.3s ease'
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
                >
                  Contact
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* FAQ CONTENT */}
      <section className="py-5 bg-light-custom">
        <Container>
          <Row className="mb-4">
            <Col lg={8} className="mx-auto text-center">
              <div style={{
                backgroundColor: 'white',
                padding: '1rem',
                borderRadius: '50px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                fontSize: '1rem'
              }}>
                Can't find what you're looking for?{" "}
                <button
                  onClick={scrollToContact}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#132f66',
                    fontWeight: '600',
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                >
                  Contact our team
                </button>{" "}
                and we'll respond within 24 hours.
              </div>
            </Col>
          </Row>

          {faqCategories.map((cat, catIndex) => (
            <Row key={catIndex} className="mb-4">
              <Col lg={10} className="mx-auto">
                <Card className="border-0 shadow-sm overflow-hidden">
                  <Card.Body className="p-0">
                    {/* Category Header with color */}
                    <div style={{
                      backgroundColor: cat.color || '#132f66',
                      padding: '1.5rem 2rem',
                      color: 'white'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <span style={{ fontSize: '2.5rem' }}>{cat.icon}</span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{cat.category}</h2>
                      </div>
                    </div>

                    {/* Accordion */}
                    <div style={{ padding: '1rem' }}>
                      <Accordion flush>
                        {cat.questions.map((item, qIndex) => (
                          <Accordion.Item
                            eventKey={`${catIndex}-${qIndex}`}
                            key={qIndex}
                            style={{
                              border: 'none',
                              borderBottom: qIndex < cat.questions.length - 1 ? '1px solid #e9ecef' : 'none'
                            }}
                          >
                            <Accordion.Header>
                              <span style={{ fontWeight: '500', color: '#2c3e50' }}>{item.question}</span>
                            </Accordion.Header>
                            <Accordion.Body>
                              <div 
                                dangerouslySetInnerHTML={{ __html: item.answer }}
                                style={{ lineHeight: '1.7', color: '#4a5568' }}
                              />
                            </Accordion.Body>
                          </Accordion.Item>
                        ))}
                      </Accordion>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          ))}

          {/* CTA */}
          <Row className="mt-5">
            <Col lg={8} className="mx-auto">
              <Card className="border-0 shadow-lg" style={{
                background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
                color: 'white'
              }}>
                <Card.Body className="p-5 text-center">
                  <h3 style={{ fontSize: '1.8rem', fontWeight: 'bold', marginBottom: '1rem' }}>
                    Still Have Questions?
                  </h3>
                  <p style={{ fontSize: '1.1rem', marginBottom: '2rem', opacity: 0.95 }}>
                    Our admissions team is happy to assist you with anything you need.
                  </p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button
                      onClick={scrollToContact}
                      style={{
                        backgroundColor: '#cebd04',
                        color: '#132f66',
                        padding: '0.75rem 2rem',
                        borderRadius: '40px',
                        fontWeight: '600',
                        border: 'none',
                        cursor: 'pointer',
                        transition: 'all 0.3s ease'
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
                    >
                      Contact Us
                    </button>

                    <Link
                      to="/admissions/apply"
                      style={{
                        backgroundColor: 'white',
                        color: '#132f66',
                        padding: '0.75rem 2rem',
                        borderRadius: '40px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = '#f8f9fa';
                        e.target.style.transform = 'translateY(-2px)';
                        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = 'white';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
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

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        .accordion-button {
          background-color: white !important;
          color: #2c3e50 !important;
          padding: 1.25rem !important;
          font-weight: 500 !important;
        }
        .accordion-button:not(.collapsed) {
          background-color: #f8fafc !important;
          color: #132f66 !important;
          box-shadow: none !important;
        }
        .accordion-button:focus {
          box-shadow: none !important;
          border-color: #e9ecef !important;
        }
        .accordion-button::after {
          background-size: 1rem !important;
        }
        .accordion-body {
          padding: 1.5rem !important;
          background-color: #f8fafc !important;
        }
        .btn-hover-effect {
          transition: all 0.3s ease;
        }
        .btn-hover-effect:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
        }
        @media (max-width: 768px) {
          .hero-buttons {
            flex-direction: column;
            gap: 0.5rem;
          }
          .hero-buttons a {
            width: 100%;
            text-align: center;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .btn-hover-effect,
          a,
          button {
            transition: none !important;
          }
          .btn-hover-effect:hover {
            transform: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(FAQ);