import { Helmet } from "react-helmet-async";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Contact() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page with hash for contact section
    navigate('/', { replace: true });
    
    // Use requestAnimationFrame for better performance
    requestAnimationFrame(() => {
      setTimeout(() => {
        const contactSection = document.getElementById('contact-section');
        if (contactSection) {
          contactSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
          });
          // Set focus to contact section for keyboard users
          contactSection.setAttribute('tabindex', '-1');
          contactSection.focus({ preventScroll: true });
        }
      }, 100);
    });
  }, [navigate]);

  // Structured data for SEO (still included for crawlers)
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Kitale Progressive School",
    "url": "https://www.kitaleprogressiveschool.com/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Kitale Progressive School",
      "email": "progressivesch@gmail.com",
      "telephone": "+254722631433"
    }
  };

  return (
    <>
      <Helmet>
        <title>Contact Us | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Get in touch with Kitale Progressive School. Contact us for admissions, inquiries, or any questions about our programs and facilities." 
        />
        <link rel="canonical" href="https://www.kitaleprogressiveschool.com/contact" />
        <meta property="og:title" content="Contact Kitale Progressive School" />
        <meta property="og:description" content="Get in touch with us for admissions and inquiries." />
        <meta property="og:url" content="https://www.kitaleprogressiveschool.com/contact" />
        <meta httpEquiv="refresh" content="0;url=/#contact-section" />
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      </Helmet>
      
      {/* Loading state with accessibility improvements */}
      <div 
        style={{ 
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)'
        }}
        role="status"
        aria-live="polite"
        aria-label="Redirecting to contact section"
      >
        <div style={{ textAlign: 'center', color: 'white' }}>
          <div 
            style={{
              width: '40px',
              height: '40px',
              margin: '0 auto 16px',
              border: '3px solid rgba(255,255,255,0.3)',
              borderTopColor: '#cebd04',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite'
            }}
            aria-hidden="true"
          />
          <p style={{ fontSize: '1rem', opacity: 0.9 }}>
            Redirecting to contact section...
          </p>
          {/* Visually hidden announcement for screen readers */}
          <span className="visually-hidden">
            Please wait while we redirect you to the contact section
          </span>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
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
        @media (prefers-reduced-motion: reduce) {
          div { animation: none; }
        }
      `}</style>
    </>
  );
}

export default Contact;