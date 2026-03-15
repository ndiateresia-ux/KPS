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
    { icon: "bi-instagram", url: "https://instagram.com/", label: "Instagram" },
    { icon: "bi-youtube", url: "https://youtube.com/", label: "YouTube" },
    { icon: "bi-tiktok", url: "https://tiktok.com/", label: "TikTok" },
    { icon: "bi-whatsapp", url: "https://wa.me/254722631433", label: "WhatsApp" }
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
    <footer className="footer">
      {/* MAP SECTION - Optimized with loading="lazy" */}
      <div className="footer-map">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.1549118880284!2d34.99523537349029!3d1.0448587624833563!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x178226623113cbbd%3A0x9bc6b39a5f193f4a!2sKitale%20Progressive%20School%3A%20Top%20Private%20Christian%20School%20in%20Trans%20Nzoia%3A!5e0!3m2!1sen!2ske!4v1772450585243!5m2!1sen!2ske"
          title="Kitale Progressive School Location"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          importance="low"
        />
      </div>

      {/* MAIN FOOTER CONTENT */}
      <Container className="footer-content py-4">
        <Row>
          {/* Dynamic Sections */}
          {footerSections.map((section, index) => (
            <Col key={index} lg={2} md={6} className="mb-4">
              <h5 className="footer-title">{section.title}</h5>
              
              {section.type === 'contact' ? (
                <div className="footer-contact">
                  <p className="mb-1 small">{section.content.address}</p>
                  <p className="mb-1 small">{section.content.phone}</p>
                  <p className="mb-1 small">{section.content.email}</p>
                </div>
              ) : (
                <ul className="list-unstyled">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button 
                        onClick={() => handleLinkClick(link.path)} 
                        className="footer-link-btn"
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
            <h5 className="footer-title">Hours</h5>
            <div className="footer-hours">
              <p className="mb-1 small">Mon-Fri: 8AM - 5PM</p>
              <p className="mb-1 small">Sat: 9AM - 12PM</p>
              <p className="mb-3 small">Sun: Closed</p>
            </div>
            
            <h5 className="footer-title mt-3">Connect</h5>
            <div className="social-icons">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.url} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon"
                  aria-label={social.label}
                >
                  <i className={`bi ${social.icon}`} aria-hidden="true"></i>
                </a>
              ))}
            </div>
          </Col>
        </Row>
      </Container>

      {/* RIGHTS SECTION */}
      <div className="footer-rights py-2">
        <Container className="text-center">
          <p className="small mb-0 footer-legal-text">
            <span>© {new Date().getFullYear()} Kitale Progressive School. All Rights Reserved.</span>
            <span className="separator mx-2">|</span>
            <button 
              onClick={() => handleLinkClick('/privacy-policy')} 
              className="footer-legal-link"
            >
              Privacy Policy
            </button>
            <span className="separator mx-2">|</span>
            <button 
              onClick={() => handleLinkClick('/terms-of-service')} 
              className="footer-legal-link"
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