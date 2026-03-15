import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const [expanded, setExpanded] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Close menu when route changes
  useEffect(() => {
    setExpanded(false);
  }, [location.pathname, location.hash]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle body scroll when mobile menu is open
  useEffect(() => {
    if (expanded) {
      document.body.style.overflow = 'hidden';
      document.body.classList.add('menu-open');
    } else {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    }
    
    return () => {
      document.body.style.overflow = 'unset';
      document.body.classList.remove('menu-open');
    };
  }, [expanded]);

  // Handle hash scrolling when coming from external link
  useEffect(() => {
    if (location.pathname === '/' && location.hash === '#contact-section') {
      setTimeout(() => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else if (location.pathname === '/school-life/news' && location.hash === '#blog-section') {
      setTimeout(() => {
        const blogSection = document.getElementById('blog-section');
        if (blogSection) {
          blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } else {
      window.scrollTo(0, 0);
    }
  }, [location]);

  // Handle navigation with scroll to top for all pages except contact
  const handleNavigation = (path, isContact = false, isBlog = false) => {
    setExpanded(false);
    
    if (isContact) {
      // Special handling for contact - scroll to contact section on home page
      if (location.pathname === '/') {
        // Already on home page, just scroll to contact section
        setTimeout(() => {
          const contactSection = document.getElementById('contact-section');
          if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // Navigate to home page with hash
        navigate('/#contact-section');
      }
    } else if (isBlog) {
      // Special handling for blog - scroll to blog section on news page
      if (location.pathname === '/school-life/news') {
        // Already on news page, just scroll to blog section
        setTimeout(() => {
          const blogSection = document.getElementById('blog-section');
          if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 100);
      } else {
        // Navigate to news page with hash
        navigate('/school-life/news#blog-section');
      }
    } else {
      // For all other links, navigate and scroll to top
      navigate(path);
      // Use requestAnimationFrame for better performance
      requestAnimationFrame(() => {
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      });
    }
  };

  const toggleMenu = () => {
    setExpanded(!expanded);
  };

  // Determine if a link is active
  const isActive = (path, hash = null) => {
    if (hash) {
      return location.pathname === path && location.hash === hash;
    }
    return location.pathname === path;
  };

  return (
    <header className={`main-header ${scrolled ? 'header-scrolled' : 'header-transparent'}`}>
      <Navbar expanded={expanded} expand="lg" className="p-0">
        <Container fluid>
          <Link to="/" className="brand-container" onClick={() => handleNavigation('/')}>
            <div className="logo-wrapper">
              <img src="/images/logo.png" alt="Kitale Progressive School" loading="eager" />
            </div>
            <span className="brand-text">
              KITALE PROGRESSIVE SCHOOL
              <small>In Pursuit of Excellence</small>
            </span>
          </Link>

          <button
            onClick={toggleMenu}
            className={`navbar-toggler custom-toggler ${expanded ? 'active' : ''}`}
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={expanded}
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className={`navbar-collapse ${expanded ? 'show' : ''}`}>
            <Nav className="ms-auto">
              <Nav.Link 
                onClick={() => handleNavigation('/')}
                className={isActive('/') && !location.hash ? 'active' : ''}
              >
                Home
              </Nav.Link>
              
              <NavDropdown 
                title="Academics" 
                id="academics-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/academics/curriculum')}
                >
                  Curriculum
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/academics/clubs-societies')}
                >
                  Clubs & Societies
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown 
                title="School Life" 
                id="school-life-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/school-life/news')}
                >
                  News
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/school-life/news', false, true)}
                  className={isActive('/school-life/news', '#blog-section') ? 'active' : ''}
                >
                  Blog
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/school-life/events')}
                >
                  Events
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/school-life/gallery')}
                >
                  Gallery
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/school-life/facilities')}
                >
                  Facilities
                </NavDropdown.Item>
              </NavDropdown>

              <NavDropdown 
                title="Admissions" 
                id="admissions-dropdown"
                className="nav-dropdown-custom"
              >
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/admissions/apply')}
                >
                  Apply Now
                </NavDropdown.Item>
                <NavDropdown.Item 
                  onClick={() => handleNavigation('/admissions/fee-structure')}
                >
                  Fee Structure
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link 
                onClick={() => handleNavigation('/faq')}
                className={isActive('/faq') ? 'active' : ''}
              >
                FAQ
              </Nav.Link>

              <Nav.Link 
                onClick={() => handleNavigation('/sponsor')}
                className={isActive('/sponsor') ? 'active' : ''}
              >
                Sponsors/Donors
              </Nav.Link>

              {/* Contact link with special handling */}
              <Nav.Link 
                onClick={() => handleNavigation('/contact', true)}
                className={isActive('/contact') || isActive('/', '#contact-section') ? 'active' : ''}
              >
                Contact
              </Nav.Link>

              <Nav.Link 
                onClick={() => handleNavigation('/admissions/apply')}
                className="apply-btn"
              >
                Apply Now
              </Nav.Link>
            </Nav>
          </div>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;