import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { GoogleOAuthProvider } from '@react-oauth/google';
import React, { lazy, Suspense, useEffect } from "react";
import "./theme.css"; // Non-critical CSS loaded asynchronously via index.html

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Curriculum = lazy(() => import("./pages/Curriculum"));
const ClubsSocieties = lazy(() => import("./pages/ClubsSocieties"));
const News = lazy(() => import("./pages/News"));
const Events = lazy(() => import("./pages/Events"));
const Gallery = lazy(() => import("./pages/Gallery"));
const Facilities = lazy(() => import("./pages/Facilities"));
const Apply = lazy(() => import("./pages/Apply"));
const FeeStructure = lazy(() => import("./pages/FeeStructure"));
const FAQ = lazy(() => import("./pages/FAQ"));
const Sponsor = lazy(() => import("./pages/Sponsor"));
const Contact = lazy(() => import("./pages/Contact"));
const PrivacyPolicy = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService = lazy(() => import("./pages/TermsOfService"));

// Lazy load non-critical components
const Header = lazy(() => import("./components/Header"));
const Footer = lazy(() => import("./components/Footer"));
const WhatsAppFloat = lazy(() => import("./components/WhatsAppFloat"));

// Loading fallback component with accessibility improvements
const PageLoader = () => (
  <div 
    role="status"
    aria-label="Loading page content"
    style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}
  >
    <div style={{
      width: '50px',
      height: '50px',
      border: '3px solid var(--navy)',
      borderTopColor: 'var(--gold)',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }} />
    <span className="visually-hidden">Loading...</span>
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
    `}</style>
  </div>
);

// Header loader with proper height to prevent layout shift
const HeaderLoader = () => (
  <div 
    aria-hidden="true"
    style={{ 
      height: '76px', 
      backgroundColor: 'white',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      zIndex: 9999
    }} 
  />
);

function App() {
  // Access environment variables using import.meta.env for Vite
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_GMAIL_CLIENT_ID;

  // Log to verify (remove in production)
  if (import.meta.env.DEV) {
    console.log("Google Client ID:", GOOGLE_CLIENT_ID ? "Present" : "Missing");
  }

  // Preload critical pages on idle
  useEffect(() => {
    if ('requestIdleCallback' in window) {
      // Preload Home page when idle
      requestIdleCallback(() => {
        import("./pages/Home");
      }, { timeout: 2000 });
    }
  }, []);

  // Add skip to content link for keyboard users
  useEffect(() => {
    // Create skip link if it doesn't exist
    if (!document.getElementById('skip-to-content')) {
      const skipLink = document.createElement('a');
      skipLink.id = 'skip-to-content';
      skipLink.href = '#main-content';
      skipLink.className = 'skip-to-content-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }, []);

  // If no client ID, show a warning but still render the app
  if (!GOOGLE_CLIENT_ID && import.meta.env.DEV) {
    console.warn("Google Client ID is missing. Google OAuth will not work.");
  }

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID || ""}>
      <Router
        future={{
          v7_relativeSplatPath: true,
          v7_startTransition: true,
        }}
      >
        <Suspense fallback={<HeaderLoader />}>
          <Header />
        </Suspense>
        
        <Suspense fallback={null}>
          <WhatsAppFloat />
        </Suspense>
        
        {/* Add main landmark with id for skip link */}
        <main id="main-content" tabIndex="-1">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<Home />} />
              
              {/* Academics Routes */}
              <Route path="/academics/curriculum" element={<Curriculum />} />
              <Route path="/academics/clubs-societies" element={<ClubsSocieties />} />
              
              {/* School Life Routes */}
              <Route path="/school-life/news" element={<News />} />
              <Route path="/school-life/events" element={<Events />} />
              <Route path="/school-life/gallery" element={<Gallery />} />
              <Route path="/school-life/facilities" element={<Facilities />} />

              {/* Admissions Routes */}
              <Route path="/admissions/apply" element={<Apply />} />
              <Route path="/admissions/fee-structure" element={<FeeStructure />} />
              
              {/* Other Routes */}
              <Route path="/faq" element={<FAQ />} />
              <Route path="/sponsor" element={<Sponsor />} />
              <Route path="/contact" element={<Contact />} />
              
              {/* Legal Routes */}
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms-of-service" element={<TermsOfService />} />
            </Routes>
          </Suspense>
        </main>
        
        <Suspense fallback={null}>
          <Footer />
        </Suspense>
      </Router>

      {/* Add styles for skip link */}
      <style>{`
        .skip-to-content-link {
          position: absolute;
          top: -40px;
          left: 0;
          background: var(--navy, #132f66);
          color: white;
          padding: 8px 16px;
          z-index: 10000;
          text-decoration: none;
          border-radius: 0 0 4px 0;
          transition: top 0.2s ease;
        }
        
        .skip-to-content-link:focus {
          top: 0;
          outline: 2px solid var(--gold, #cebd04);
          outline-offset: 2px;
        }
        
        #main-content:focus {
          outline: none;
        }
        
        @media (prefers-reduced-motion: reduce) {
          .skip-to-content-link {
            transition: none;
          }
        }
      `}</style>
    </GoogleOAuthProvider>
  );
}

export default App;