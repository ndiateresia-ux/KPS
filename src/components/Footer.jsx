import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { memo, useCallback } from "react";
import "./Footer.css";

function Footer() {
  const navigate = useNavigate();

  const handleLinkClick = useCallback((path) => {
    navigate(path);
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }, [navigate]);

  // Social media links data
  const socialLinks = [
    { icon: "bi-facebook", url: "https://www.facebook.com/kitaleprogressive/", label: "Facebook", color: "#1877F2" },
    { icon: "bi-instagram", url: "https://www.instagram.com/kitaleprogrsv1338/", label: "Instagram", color: "#E4405F" },
    { icon: "bi-youtube", url: "https://www.youtube.com/@kitaleprogressive.social", label: "YouTube", color: "#FF0000" },
    { icon: "bi-tiktok", url: "https://www.tiktok.com/@the.kitale.progre?_r=1&_t=ZS-94dShSZXsql", label: "TikTok", color: "#000000" },
    { icon: "bi-whatsapp", url: "https://wa.me/254780841116", label: "WhatsApp", color: "#25D366" }
  ];

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      {/* MAP SECTION */}
     <div className="footer-map" style={{ 
    marginTop: '2rem',
    width: '100%',
    overflow: 'hidden'
  }}>
    <iframe 
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1549118880284!2d34.995235373490296!3d1.0448587624833654!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178226623113cbbd%3A0x9bc6b39a5f193f4a!2sKitale%20Progressive%20School%3A%20Top%20Private%20Christian%20School%20in%20Trans%20Nzoia%3A!5e0!3m2!1sen!2ske!4v1774888347036!5m2!1sen!2ske" 
      title="Kitale Progressive School Location"
      style={{ 
        width: '100%', 
        height: '200px', 
        border: 'none',
        display: 'block'
      }}
      allowFullScreen
      loading="lazy"
      aria-label="Map showing Kitale Progressive School location"
    />
  </div>
      {/* MAIN FOOTER CONTENT */}
      <Container fluid className="footer-content py-4">
        <Row className="g-4">
          {/* Combined Description & Contact Column */}
          <Col lg={3} md={6} className="mb-4">
            {/* Description on top */}
            <div className="mb-3">
              <h5 className="footer-title">Kitale Progressive School</h5>
              <p className="small" style={{ 
                lineHeight: 1.5,
                color: 'rgba(255,255,255,0.9)',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                textAlign: 'left',
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                whiteSpace: 'normal',
                maxWidth: '100%',
                paddingRight: '10px'
              }}>
                Kitale Progressive School nurtures learners through strong academics, character development, and a supportive learning environment.
              </p>
            </div>
            
            {/* Contact below */}
            <div>
              <h5 className="footer-title">Contact</h5>
              <p className="mb-2 small" style={{ 
                wordWrap: 'break-word', 
                overflowWrap: 'break-word',
                whiteSpace: 'normal'
              }}>
                <span style={{ display: 'inline-block', width: '24px' }}>📍</span> Kitale-Kapenguria RD
              </p>
              <p className="mb-2 small">
                <span style={{ display: 'inline-block', width: '24px' }}>📞</span>
                <a href="tel:+254 736 756 595" className="footer-contact-link"> +254 736 756 595</a>
              </p>
              <p className="mb-2 small" style={{ 
                wordWrap: 'break-word', 
                overflowWrap: 'break-word',
                whiteSpace: 'normal'
              }}>
                <span style={{ display: 'inline-block', width: '24px' }}>📧</span>
                <a href="mailto:kitaleprogressivesocial@gmail.com" className="footer-contact-link"> kitaleprogressivesocial@gmail.com</a>
              </p>
            </div>
          </Col>

          {/* Academics */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Academics</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><button onClick={() => handleLinkClick('/academics/curriculum')} className="footer-link-btn">Curriculum</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/academics/clubs-societies')} className="footer-link-btn">Clubs & Societies</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/faq')} className="footer-link-btn">FAQs</button></li>
            </ul>
          </Col>

          {/* School Life */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">School Life</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><button onClick={() => handleLinkClick('/school-life/news')} className="footer-link-btn">News</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/school-life/events')} className="footer-link-btn">Events</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/school-life/gallery')} className="footer-link-btn">Gallery</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/school-life/boarding')} className="footer-link-btn">Facilities</button></li>
            </ul>
          </Col>

          {/* Admissions */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title">Admissions</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><button onClick={() => handleLinkClick('/admissions/apply')} className="footer-link-btn">Apply Now</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/admissions/fee-structure')} className="footer-link-btn">Fee Structure</button></li>
              <li className="mb-2"><button onClick={() => handleLinkClick('/sponsor')} className="footer-link-btn">Sponsor a Child</button></li>
            </ul>
          </Col>

          {/* Hours & Social */}
          <Col lg={3} md={6} className="mb-4">
            <h5 className="footer-title">Hours</h5>
            <p className="mb-2 small">
              <span style={{ display: 'inline-block', width: '24px' }}>🕒</span> Mon-Fri: 8:00 AM - 5:00 PM
            </p>
            <p className="mb-2 small">
              <span style={{ display: 'inline-block', width: '24px' }}>🕒</span> Saturday: 9:00 AM - 12:00 PM
            </p>
            <p className="mb-3 small">
              <span style={{ display: 'inline-block', width: '24px' }}>🚫</span> Sunday: Closed
            </p>
            
            <h5 className="footer-title mt-3">Connect With Us</h5>
            <div className="social-icons">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon"
                  aria-label={`Visit our ${social.label} page`}
                >
                  <i className={`bi ${social.icon}`} style={{ fontSize: '1.1rem' }}></i>
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* RIGHTS SECTION */}
      <div className="footer-rights py-3">
        <Container fluid>
          <Row>
            <Col className="text-center">
              <p className="small mb-0" style={{ color: 'rgba(255,255,255,0.7)' }}>
                © {new Date().getFullYear()} Kitale Progressive School. All Rights Reserved. | 
                <button onClick={() => handleLinkClick('/privacy-policy')} className="footer-legal-link mx-2">Privacy Policy</button> | 
                <button onClick={() => handleLinkClick('/terms-of-service')} className="footer-legal-link mx-2">Terms of Service</button>
              </p>
            </Col>
          </Row>
        </Container>
      </div>
    </footer>
  );
}

export default memo(Footer);