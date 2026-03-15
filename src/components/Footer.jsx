import { Container, Row, Col } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
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
    { icon: "bi-facebook", url: "https://www.facebook.com/kitaleprogressive/", label: "Facebook" },
    { icon: "bi-instagram", url: "https://www.instagram.com/kitaleprogrsv1338/", label: "Instagram" },
    { icon: "bi-youtube", url: "https://www.youtube.com/@kitaleprogressive.social", label: "YouTube" },
    { icon: "bi-tiktok", url: "https://www.tiktok.com/@the.kitale.progre?_r=1&_t=ZS-94dShSZXsql", label: "TikTok" },
    { icon: "bi-whatsapp", url: "https://wa.me/254780841116", label: "WhatsApp" }
  ];

  // Footer sections data
  const footerSections = [
    {
      title: "Contact",
      type: "contact",
      content: {
        address: "📍 Kitale-Kapenguria RD",
        phone: "📞 +254 722 631 433",
        email: "📧 progressivesch@gmail.com"
      }
    },
    {
      title: "Academics",
      links: [
        { label: "Curriculum", path: "/academics/curriculum" },
        { label: "Clubs", path: "/academics/clubs-societies" },
        { label: "FAQs", path: "/faq" }
      ]
    },
    {
      title: "School Life",
      links: [
        { label: "News", path: "/school-life/news" },
        { label: "Events", path: "/school-life/events" },
        { label: "Gallery", path: "/school-life/gallery" },
        { label: "Facilities", path: "/school-life/facilities" }
      ]
    },
    {
      title: "Admissions",
      links: [
        { label: "Apply Now", path: "/admissions/apply" },
        { label: "Fee Structure", path: "/admissions/fee-structure" },
        { label: "Sponsor", path: "/sponsor" },
        { label: "Contact", path: "/contact" }
      ]
    },
    {
      title: "Quick Links",
      links: [
        { label: "Home", path: "/" },
        { label: "Blog", path: "/school-life/news#blog-section" },
        { label: "FAQ", path: "/faq" }
      ]
    }
  ];

  return (
    <footer className="footer" role="contentinfo" aria-label="Site footer">
      {/* MAP SECTION - Optimized with loading="lazy" and accessibility */}
      <div className="footer-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1549118880284!2d34.99523537349029!3d1.0448587624833563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178226623113cbbd%3A0x9bc6b39a5f193f4a!2sKitale%20Progressive%20School%3A%20Top%20Private%20Christian%20School%20in%20Trans%20Nzoia%3A!5e0!3m2!1sen!2ske!4v1772450585243!5m2!1sen!2ske"
          title="Kitale Progressive School location on Google Maps"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          importance="low"
          aria-label="Google Maps showing Kitale Progressive School location"
        />
      </div>

      {/* MAIN FOOTER CONTENT */}
      <Container className="footer-content py-4">
        <Row>
          {/* Dynamic Sections */}
          {footerSections.map((section, index) => (
            <Col key={index} lg={2} md={6} className="mb-4">
              <h5 className="footer-title" id={`footer-section-${index}-title`}>
                {section.title}
                <span className="visually-hidden"> section</span>
              </h5>
              
              {section.type === 'contact' ? (
                <div className="footer-contact" aria-labelledby={`footer-section-${index}-title`}>
                  <p className="mb-1 small">
                    <span aria-hidden="true">📍</span>
                    <span className="visually-hidden">Address: </span>
                    {section.content.address}
                  </p>
                  <p className="mb-1 small">
                    <span aria-hidden="true">📞</span>
                    <span className="visually-hidden">Phone: </span>
                    <a href="tel:+254722631433" className="footer-contact-link">
                      {section.content.phone.replace("📞 ", "")}
                    </a>
                  </p>
                  <p className="mb-1 small">
                    <span aria-hidden="true">📧</span>
                    <span className="visually-hidden">Email: </span>
                    <a href="mailto:progressivesch@gmail.com" className="footer-contact-link">
                      {section.content.email.replace("📧 ", "")}
                    </a>
                  </p>
                </div>
              ) : (
                <ul className="list-unstyled" aria-labelledby={`footer-section-${index}-title`}>
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button 
                        onClick={() => handleLinkClick(link.path)} 
                        className="footer-link-btn"
                        aria-label={`Go to ${link.label} page`}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            handleLinkClick(link.path);
                          }
                        }}
                      >
                        {link.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </Col>
          ))}

          {/* HOURS & SOCIAL MEDIA - Static section */}
          <Col lg={2} md={6} className="mb-4">
            <h5 className="footer-title" id="footer-hours-title">
              Hours
              <span className="visually-hidden"> of operation</span>
            </h5>
            <div className="footer-hours" aria-labelledby="footer-hours-title">
              <p className="mb-1 small">
                <span aria-hidden="true">🕒</span>
                <span className="visually-hidden">Monday to Friday: </span>
                Mon-Fri: 8AM - 5PM
              </p>
              <p className="mb-1 small">
                <span aria-hidden="true">🕒</span>
                <span className="visually-hidden">Saturday: </span>
                Sat: 9AM - 12PM
              </p>
              <p className="mb-3 small">
                <span aria-hidden="true">🚫</span>
                <span className="visually-hidden">Sunday: </span>
                Sun: Closed
              </p>
            </div>
            
            <h5 className="footer-title mt-3" id="footer-social-title">
              Connect
              <span className="visually-hidden"> with us on social media</span>
            </h5>
            <div className="social-icons" aria-labelledby="footer-social-title">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon"
                  aria-label={`Visit our ${social.label} page (opens in new tab)`}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      window.open(social.url, '_blank', 'noopener noreferrer');
                    }
                  }}
                >
                  <i className={`bi ${social.icon}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* RIGHTS SECTION */}
      <div className="footer-rights py-2" role="contentinfo" aria-label="Legal information">
        <Container className="text-center">
          <p className="small mb-0 footer-legal-text">
            <span>
              © {new Date().getFullYear()} Kitale Progressive School. All Rights Reserved.
            </span>
            <span className="separator mx-2" aria-hidden="true">|</span>
            <button 
              onClick={() => handleLinkClick('/privacy-policy')} 
              className="footer-legal-link"
              aria-label="Read our Privacy Policy"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLinkClick('/privacy-policy');
                }
              }}
            >
              Privacy Policy
            </button>
            <span className="separator mx-2" aria-hidden="true">|</span>
            <button 
              onClick={() => handleLinkClick('/terms-of-service')} 
              className="footer-legal-link"
              aria-label="Read our Terms of Service"
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleLinkClick('/terms-of-service');
                }
              }}
            >
              Terms of Service
            </button>
          </p>
        </Container>
      </div>
    </footer>
  );
}

export default memo(Footer);