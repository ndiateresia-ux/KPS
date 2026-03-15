import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { lazy, Suspense, memo } from "react";
import { Link } from "react-router-dom";

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

function PrivacyPolicy() {
  return (
    <>
      <Helmet>
        <title>Privacy Policy | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Privacy Policy for Kitale Progressive School. Learn how we collect, use, and protect your personal information." 
        />
      </Helmet>

      {/* Page Header - Optimized with inline styles for immediate visibility */}
      <section style={{
        background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
        color: 'white',
        paddingTop: '120px',
        paddingBottom: '40px',
        textAlign: 'center',
        width: '100%'
      }}>
        <Container>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            marginBottom: '0.5rem',
            color: 'white'
          }}>
            Privacy Policy
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.1rem)',
            maxWidth: '700px',
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            How we protect and handle your information
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section style={{ padding: '3rem 0', backgroundColor: 'white' }}>
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <div style={{
                maxWidth: '800px',
                margin: '0 auto'
              }}>
                {/* Last Updated */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1rem 1.5rem',
                  borderRadius: '8px',
                  marginBottom: '2rem',
                  border: '1px solid #e9ecef'
                }}>
                  <p style={{ margin: 0, color: '#132f66', fontWeight: '500' }}>
                    <i className="fas fa-calendar-alt me-2" style={{ color: '#cebd04' }}></i>
                    Last Updated: March 2026
                  </p>
                </div>

                {/* Policy Sections */}
                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    1. Introduction
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '1rem'
                  }}>
                    Kitale Progressive School ("we," "our," or "us") is committed to protecting your privacy. 
                    This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                    when you visit our website or use our services.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    2. Information We Collect
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    We may collect personal information that you voluntarily provide to us when you:
                  </p>
                  <ul style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Fill out admission applications</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Contact us through forms</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Sign up for newsletters</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Make sponsorship or donation inquiries</li>
                  </ul>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    This information may include:
                  </p>
                  <ul style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Name and contact information (email, phone number, address)</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Child's information (name, date of birth, grade)</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Medical information (allergies, conditions)</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Payment information (processed securely through third-party providers)</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    3. How We Use Your Information
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    We use the information we collect to:
                  </p>
                  <ul style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Process admission applications</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Communicate with you about your application</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Respond to your inquiries</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Send important updates and information</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Improve our website and services</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Comply with legal obligations</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    4. Google OAuth and Data Access
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    When you use our Google sign-in feature to submit forms, we access only the information necessary to verify your identity and send emails on your behalf. Specifically:
                  </p>
                  <ul style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>We request access to send emails via Gmail API only when you explicitly submit a form</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>We do not store your Google account information</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>We do not access your emails or contacts</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>You can revoke access at any time through your Google Account settings</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    5. Sharing Your Information
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    We do not sell, trade, or rent your personal information to third parties. We may share information with:
                  </p>
                  <ul style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>School staff and administrators for admission processing</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Service providers who assist in operating our website</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Legal authorities when required by law</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    6. Data Security
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '1rem'
                  }}>
                    We implement appropriate technical and organizational measures to protect your personal information. 
                    However, no method of transmission over the Internet is 100% secure.
                  </p>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    7. Your Rights
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    You have the right to:
                  </p>
                  <ul style={{
                    paddingLeft: '1.5rem',
                    marginBottom: '1rem'
                  }}>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Access the personal information we hold about you</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Request correction of inaccurate information</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Request deletion of your information</li>
                    <li style={{ fontSize: '0.95rem', lineHeight: '1.6', color: '#4a5568', marginBottom: '0.3rem' }}>Withdraw consent at any time</li>
                  </ul>
                </div>

                <div style={{ marginBottom: '2rem' }}>
                  <h5 style={{
                    fontSize: '1.1rem',
                    fontWeight: 'bold',
                    color: '#132f66',
                    marginBottom: '0.75rem',
                    marginTop: '1.5rem'
                  }}>
                    8. Contact Us
                  </h5>
                  <p style={{
                    fontSize: '0.95rem',
                    lineHeight: '1.6',
                    color: '#4a5568',
                    marginBottom: '0.5rem'
                  }}>
                    If you have questions about this Privacy Policy, please contact us at:
                  </p>
                  <div style={{
                    backgroundColor: '#f8fafc',
                    padding: '1.5rem',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef'
                  }}>
                    <p style={{ marginBottom: '0.3rem' }}>
                      <strong style={{ color: '#132f66' }}>Email:</strong>{' '}
                      <a href="mailto:privacy@kitaleprogressiveschool.ac.ke" style={{ color: '#132f66', textDecoration: 'none' }}>
                        privacy@kitaleprogressiveschool.ac.ke
                      </a>
                    </p>
                    <p style={{ marginBottom: '0.3rem' }}>
                      <strong style={{ color: '#132f66' }}>Phone:</strong> +254 722 631 433
                    </p>
                    <p style={{ marginBottom: 0 }}>
                      <strong style={{ color: '#132f66' }}>Address:</strong> Kitale - Kapenguria Road, Kitale, Kenya
                    </p>
                  </div>
                </div>

                {/* Consent Statement */}
                <div style={{
                  backgroundColor: '#f8fafc',
                  padding: '1.5rem',
                  borderRadius: '8px',
                  marginTop: '2rem',
                  border: '1px solid #e9ecef',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, color: '#4a5568' }}>
                    <i className="fas fa-check-circle me-2" style={{ color: '#cebd04' }}></i>
                    By using our website, you consent to our Privacy Policy.
                  </p>
                </div>

                {/* Back to Home Link */}
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <Link
                    to="/"
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#132f66',
                      color: 'white',
                      padding: '0.5rem 2rem',
                      borderRadius: '40px',
                      textDecoration: 'none',
                      fontSize: '0.9rem',
                      fontWeight: '500',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = '#0a1f4d';
                      e.target.style.transform = 'translateY(-2px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(19,47,102,0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = '#132f66';
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <i className="fas fa-arrow-left me-2"></i>
                    Back to Home
                  </Link>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media (max-width: 768px) {
          .policy-content h5 {
            font-size: 1rem;
          }
          .policy-content p, .policy-content li {
            font-size: 0.9rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          a {
            transition: none !important;
          }
          a:hover {
            transform: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(PrivacyPolicy);