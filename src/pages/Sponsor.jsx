import { Helmet } from "react-helmet-async";
import { Container, Row, Col } from "react-bootstrap";
import { useState, useCallback, lazy, Suspense, memo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { parsePhoneNumber } from 'libphonenumber-js';

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Simple intersection observer hook
const useInView = ({ threshold = 0.1, triggerOnce = false }) => {
  const [ref, setRef] = useState(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!ref) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting && triggerOnce) {
          observer.disconnect();
        }
      },
      { threshold }
    );
    
    observer.observe(ref);
    
    return () => observer.disconnect();
  }, [ref, threshold, triggerOnce]);

  return [setRef, inView];
};

// Simple CountUp component
const CountUp = ({ end, duration = 2, suffix = "" }) => {
  const [count, setCount] = useState(0);
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });

  useEffect(() => {
    if (!inView) return;
    
    let startTime;
    let animationFrame;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
      const currentCount = Math.floor(progress * end);
      setCount(currentCount);
      
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };
    
    animationFrame = requestAnimationFrame(animate);
    
    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
    };
  }, [inView, end, duration]);

  return <span ref={ref}>{count}{suffix}</span>;
};

// Memoized stat card component
const StatCard = memo(({ stat, index }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  
  return (
    <Col md={3} key={index} className="text-center mb-3">
      <div ref={ref}>
        <h2 style={{
          fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
          fontWeight: 'bold',
          color: '#cebd04',
          marginBottom: '0.25rem'
        }}>
          {inView ? (
            <CountUp end={stat.value} suffix={stat.suffix} />
          ) : (
            `0${stat.suffix}`
          )}
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.9)' }}>{stat.label}</p>
      </div>
    </Col>
  );
});

StatCard.displayName = 'StatCard';

// Memoized sponsor card component
const SponsorCard = memo(({ icon, title, description }) => (
  <Col md={4} className="mb-3">
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        textAlign: 'center',
        height: '100%',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease'
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.05)';
      }}
    >
      <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{icon}</div>
      <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#132f66', marginBottom: '0.5rem' }}>
        {title}
      </h5>
      <p style={{ fontSize: '0.9rem', color: '#4a5568', marginBottom: 0 }}>{description}</p>
    </div>
  </Col>
));

SponsorCard.displayName = 'SponsorCard';

// Alert component
const Alert = memo(({ show, success, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div className="mb-3">
      <div style={{
        backgroundColor: success ? '#d4edda' : '#f8d7da',
        color: success ? '#155724' : '#721c24',
        padding: '1rem',
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="d-flex align-items-center gap-2">
          <i className={`fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ fontSize: '1.2rem' }}></i>
          <span>{message}</span>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '1.2rem',
            cursor: 'pointer',
            color: success ? '#155724' : '#721c24'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
});

Alert.displayName = 'Alert';

// Form input component
const FormInput = memo(({ label, type = "text", name, value, onChange, placeholder, required = false, feedback, as, rows, options }) => {
  const id = `input-${name}`;
  
  return (
    <div className="mb-3">
      <label htmlFor={id} style={{ fontSize: '0.9rem', fontWeight: '600', color: '#132f66', marginBottom: '0.3rem', display: 'block' }}>
        {label} {required && <span style={{ color: '#dc3545' }}>*</span>}
      </label>
      {as === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}
        >
          <option value="">Select an option</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          rows={rows}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontFamily: 'inherit'
          }}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          style={{
            width: '100%',
            padding: '0.6rem 1rem',
            border: '1px solid #dee2e6',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}
        />
      )}
      {required && feedback && (
        <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.2rem' }}>{feedback}</div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

function Sponsor() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    supportType: "",
    otherSupportType: "",
    message: "",
    agreeToTerms: false
  });

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    success: false,
    message: ""
  });

  // Get environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_GMAIL_CLIENT_ID;
  const SPONSORSHIP_EMAIL = import.meta.env.VITE_SPONSORSHIP_EMAIL || 'ndiateresia@gmail.com';
  const GMAIL_SCOPES = import.meta.env.VITE_GMAIL_SCOPES || 'https://www.googleapis.com/auth/gmail.send';

  const sponsorStats = [
    { value: 50, label: "Students Sponsored", suffix: "+" },
    { value: 100, label: "Items Donated", suffix: "+" },
    { value: 5, label: "Projects Completed", suffix: "" },
    { value: 10, label: "Active Sponsors", suffix: "+" }
  ];

  const sponsorCards = [
    { icon: "🎒", title: "Donate Items", description: "Support learners with books, uniforms, stationery, food, and learning equipment." },
    { icon: "🎓", title: "Sponsor a Child", description: "Provide full or partial fees support and walk with a child through their academic journey." },
    { icon: "🏫", title: "Support Projects", description: "Help us improve classrooms, libraries, ICT facilities, and learning spaces." }
  ];

  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }, []);

  const handlePhoneChange = useCallback((value) => {
    setPhone(value);
    setPhoneError("");
    
    if (value) {
      try {
        const phoneNumber = parsePhoneNumber(value);
        if (phoneNumber) {
          const nationalNumber = phoneNumber.nationalNumber;
          if (nationalNumber.length !== 9) {
            setPhoneError("Phone number must be exactly 9 digits after country code");
          } else {
            setFormData(prev => ({ ...prev, phone: value }));
          }
        }
      } catch (error) {
        setPhoneError("Invalid phone number format");
      }
    } else {
      setFormData(prev => ({ ...prev, phone: value }));
    }
  }, []);

  const handleDismissAlert = useCallback(() => {
    setSubmitStatus(prev => ({ ...prev, show: false }));
  }, []);

  const getDisplaySupportType = useCallback(() => {
    if (formData.supportType === "Other" && formData.otherSupportType) {
      return `Other: ${formData.otherSupportType}`;
    }
    return formData.supportType || 'Not specified';
  }, [formData.supportType, formData.otherSupportType]);

  // Create email content function
  const createEmailContent = useCallback(() => {
    const textContent = `
Kitale Progressive School - Sponsorship/Donation Inquiry

Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Support Type: ${getDisplaySupportType()}
Message: ${formData.message}
Agreed to Terms: ${formData.agreeToTerms ? 'Yes' : 'No'}

This inquiry was sent from the Kitale Progressive School website.
    `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #132f66;">
          <h2 style="color: #132f66; margin: 0;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        <h3 style="color: #132f66;">New Sponsorship/Donation Inquiry</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 120px;">Full Name:</td><td>${formData.fullName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${formData.email}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Phone:</td><td>${formData.phone || 'Not provided'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Support Type:</td><td>${getDisplaySupportType()}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td><td>${formData.message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This inquiry was sent from the Kitale Progressive School website.</p>
        </div>
      </div>
    `;

    return [
      'Content-Type: multipart/alternative; boundary="boundary123"',
      'MIME-Version: 1.0',
      `To: ${SPONSORSHIP_EMAIL}`,
      `From: ${formData.email}`,
      `Subject: Sponsorship Inquiry - ${formData.fullName}`,
      '',
      '--boundary123',
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      textContent.trim(),
      '',
      '--boundary123',
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlContent.trim(),
      '',
      '--boundary123--'
    ].join('\r\n');
  }, [formData, getDisplaySupportType, SPONSORSHIP_EMAIL]);

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        
        console.log("Google login successful, sending email...");
        
        const emailContent = createEmailContent();
        
        const encodedEmail = btoa(emailContent)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: encodedEmail }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Gmail API Error:", errorData);
          
          if (response.status === 403) {
            throw new Error("Permission denied. Please check Gmail API permissions.");
          } else if (response.status === 401) {
            throw new Error("Authentication failed. Please try again.");
          } else {
            throw new Error(errorData.error?.message || 'Failed to send email');
          }
        }

        const result = await response.json();
        console.log("Email sent successfully:", result);

        setSubmitStatus({
          show: true,
          success: true,
          message: "Thank you! Your inquiry has been sent. We'll contact you within 24-48 hours."
        });

        setFormData({
          fullName: "", email: "", phone: "", supportType: "", otherSupportType: "", message: "", agreeToTerms: false
        });
        setPhone("");
        setPhoneError("");
        setValidated(false);
        
      } catch (error) {
        console.error("Email error:", error);
        setSubmitStatus({
          show: true,
          success: false,
          message: error.message || "Error sending inquiry. Please try again or call us."
        });
      } finally {
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      setSubmitStatus({
        show: true,
        success: false,
        message: "Google sign-in failed. Please try again."
      });
    }
  });

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    
    if (!formData.fullName || !formData.email || !formData.message || !formData.supportType) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please fill in all required fields."
      });
      return;
    }

    if (formData.supportType === "Other" && !formData.otherSupportType) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please specify how you would like to help."
      });
      return;
    }

    if (phone && phoneError) {
      setSubmitStatus({
        show: true,
        success: false,
        message: phoneError
      });
      return;
    }

    if (!formData.agreeToTerms) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please agree to the Privacy Policy and Terms of Service."
      });
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Google Client ID is missing. Please check configuration."
      });
      return;
    }
    
    login();
  }, [formData, phone, phoneError, login, GOOGLE_CLIENT_ID]);

  const supportTypeOptions = [
    { value: "Donate Learning Materials", label: "Donate Learning Materials" },
    { value: "Donate Uniforms / Food", label: "Donate Uniforms / Food" },
    { value: "Sponsor a Student", label: "Sponsor a Student" },
    { value: "Support School Projects", label: "Support School Projects" },
    { value: "Monetary Donation", label: "Monetary Donation" },
    { value: "Other", label: "Other" }
  ];

  return (
    <>
      <Helmet>
        <title>Sponsorship & Donations | Kitale Progressive School</title>
        <meta
          name="description"
          content="Make a difference through sponsorship and donations at Kitale Progressive School. Support students with fees, materials, and projects."
        />
      </Helmet>

      {/* Hero Section */}
      <section style={{
        position: 'relative',
        height: '400px',
        backgroundImage: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center',
        color: 'white'
      }}>
        <Container>
          <h1 style={{
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 'bold',
            marginBottom: '1rem'
          }}>
            Change a Life. Build a Future.
          </h1>
          <p style={{
            fontSize: 'clamp(1rem, 4vw, 1.2rem)',
            maxWidth: '800px',
            margin: '0 auto',
            opacity: 0.95
          }}>
            Your generosity today can open doors to education, hope, and lifelong
            success for a child in our community.
          </p>
        </Container>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <Container>
          {/* Intro */}
          <Row className="mb-4">
            <Col lg={10} className="mx-auto text-center">
              <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                At <strong>Kitale Progressive School</strong>, we are committed to
                nurturing every learner with care, dignity, and excellence.
                However, many bright children still face challenges due to limited
                resources.
              </p>
              <p style={{ color: '#4a5568' }}>
                Through your partnership, we provide school supplies, uniforms,
                meals, learning materials, and full sponsorship to deserving
                students — empowering them to dream bigger and achieve more.
              </p>
            </Col>
          </Row>

          {/* Sponsor Cards */}
          <Row className="mb-4 g-3">
            {sponsorCards.map((card, index) => (
              <SponsorCard key={index} icon={card.icon} title={card.title} description={card.description} />
            ))}
          </Row>

          {/* Statistics Section */}
          <div style={{
            background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
            padding: '2rem 1rem',
            borderRadius: '12px',
            marginBottom: '2rem'
          }}>
            <Row className="justify-content-center g-3">
              {sponsorStats.map((stat, index) => (
                <StatCard key={index} stat={stat} index={index} />
              ))}
            </Row>
          </div>

          {/* Alert */}
          <Alert
            show={submitStatus.show}
            success={submitStatus.success}
            message={submitStatus.message}
            onClose={handleDismissAlert}
          />

          {/* Form Section */}
          <Row className="mb-4">
            <Col lg={8} className="mx-auto">
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '2rem',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
              }}>
                <h3 style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: '#132f66',
                  marginBottom: '1.5rem',
                  textAlign: 'center'
                }}>
                  Partner With Us Today
                </h3>

                <form onSubmit={handleSubmit} noValidate>
                  <FormInput
                    label="Full Name"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    required
                    feedback="Please enter your name"
                  />

                  <FormInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Enter your email"
                    required
                    feedback="Please enter a valid email"
                  />

                  {/* Phone Input */}
                  <div className="mb-3">
                    <label style={{ fontSize: '0.9rem', fontWeight: '600', color: '#132f66', marginBottom: '0.3rem', display: 'block' }}>
                      Phone Number
                    </label>
                    <PhoneInput
                      international
                      defaultCountry="KE"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="712345678"
                      style={{
                        width: '100%',
                        padding: '0.6rem 1rem',
                        border: '1px solid #dee2e6',
                        borderRadius: '8px',
                        fontSize: '0.9rem'
                      }}
                    />
                    {phoneError && (
                      <div style={{ color: '#dc3545', fontSize: '0.8rem', marginTop: '0.2rem' }}>{phoneError}</div>
                    )}
                    <div style={{ fontSize: '0.8rem', color: '#718096', marginTop: '0.2rem' }}>
                      Enter exactly 9 digits after country code (e.g., 712345678)
                    </div>
                  </div>

                  <FormInput
                    label="How Would You Like to Help?"
                    as="select"
                    name="supportType"
                    value={formData.supportType}
                    onChange={handleChange}
                    required
                    options={supportTypeOptions}
                    feedback="Please select how you'd like to help"
                  />

                  {formData.supportType === "Other" && (
                    <FormInput
                      label="Please specify"
                      name="otherSupportType"
                      value={formData.otherSupportType}
                      onChange={handleChange}
                      placeholder="Tell us how you would like to help"
                      required
                      feedback="Please specify how you would like to help"
                    />
                  )}

                  <FormInput
                    label="Your Message"
                    as="textarea"
                    rows={4}
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us more about your support..."
                    required
                    feedback="Please enter your message"
                  />

                  {/* Terms Checkbox */}
                  <div className="mb-3">
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                      />
                      <span style={{ fontSize: '0.9rem' }}>
                        I agree to the{' '}
                        <Link to="/privacy-policy" target="_blank" style={{ color: '#132f66', textDecoration: 'underline' }}>
                          Privacy Policy
                        </Link>
                        {' '}and{' '}
                        <Link to="/terms-of-service" target="_blank" style={{ color: '#132f66', textDecoration: 'underline' }}>
                          Terms of Service
                        </Link>
                      </span>
                    </label>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      style={{
                        backgroundColor: '#132f66',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '40px',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: submitting ? 'not-allowed' : 'pointer',
                        opacity: submitting ? 0.7 : 1,
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        if (!submitting) {
                          e.target.style.backgroundColor = '#0a1f4d';
                          e.target.style.transform = 'translateY(-2px)';
                          e.target.style.boxShadow = '0 4px 12px rgba(19,47,102,0.3)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#132f66';
                        e.target.style.transform = 'translateY(0)';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Sending...
                        </>
                      ) : (
                        'Become a Sponsor / Donate'
                      )}
                    </button>
                  </div>

                  <p style={{
                    fontSize: '0.8rem',
                    color: '#718096',
                    marginTop: '1rem',
                    marginBottom: 0,
                    textAlign: 'center'
                  }}>
                    <i className="fas fa-lock me-1"></i>
                    You'll sign in with Google to verify your identity
                  </p>
                </form>
              </div>
            </Col>
          </Row>

          {/* Testimonial */}
          <Row className="mb-4">
            <Col lg={10} className="mx-auto">
              <div style={{
                backgroundColor: '#f8fafc',
                borderRadius: '16px',
                padding: '2rem',
                textAlign: 'center'
              }}>
                <i className="fas fa-quote-left" style={{ fontSize: '2rem', color: '#cebd04', opacity: 0.5, marginBottom: '1rem' }}></i>
                <p style={{ fontSize: '1.1rem', fontStyle: 'italic', marginBottom: '1rem' }}>
                  "Sponsoring a child at Kitale Progressive School has been one of the most rewarding experiences of my life. Seeing the joy and hope in their eyes is priceless."
                </p>
                <div>
                  <h6 style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.2rem' }}>James Mwangi</h6>
                  <small style={{ color: '#718096' }}>Sponsor since 2022</small>
                </div>
              </div>
            </Col>
          </Row>

          {/* Closing */}
          <div className="text-center">
            <h5 style={{ fontSize: '1.1rem', fontWeight: 'bold', color: '#132f66', marginBottom: '0.5rem' }}>
              Together, we can nurture dreams and transform generations.
            </h5>
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
              Thank you for choosing to invest in education and hope.
            </p>
            <div>
              <Link to="/privacy-policy" style={{ color: '#718096', marginRight: '0.5rem', fontSize: '0.9rem' }}>Privacy Policy</Link>
              <span style={{ color: '#718096' }}>|</span>
              <Link to="/terms-of-service" style={{ color: '#718096', marginLeft: '0.5rem', fontSize: '0.9rem' }}>Terms of Service</Link>
            </div>
          </div>
        </Container>
      </section>

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS inline */}
      <style dangerouslySetInnerHTML={{ __html: `
        .spinner-border {
          display: inline-block;
          width: 1rem;
          height: 1rem;
          vertical-align: text-bottom;
          border: 0.2em solid currentColor;
          border-right-color: transparent;
          border-radius: 50%;
          animation: spinner-border .75s linear infinite;
        }
        @keyframes spinner-border {
          to { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          .spinner-border {
            animation: none;
          }
          * {
            transition: none !important;
          }
        }
      `}} />
    </>
  );
}

export default memo(Sponsor);