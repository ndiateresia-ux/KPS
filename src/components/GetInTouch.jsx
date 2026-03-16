import React, { useState, useCallback, memo, lazy, Suspense } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

// Memoized form input component with accessibility improvements
const FormInput = memo(({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  as,
  rows,
  feedback
}) => {
  const id = `input-${name}`;
  const errorId = `${id}-error`;
  
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label className="form-label-custom">
        {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
        {required && <span className="visually-hidden"> (required)</span>}
      </Form.Label>
      <Form.Control 
        as={as}
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="form-control-custom"
        required={required}
        rows={rows}
        aria-invalid={required && !value ? "true" : "false"}
        aria-describedby={required && !value ? errorId : undefined}
      />
      {required && (
        <Form.Control.Feedback type="invalid" id={errorId} role="alert">
          {feedback || `Please enter your ${label.toLowerCase()}.`}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

FormInput.displayName = 'FormInput';

// Memoized contact info component with accessibility improvements
const ContactInfo = memo(({ icon, label, value, isLight = false }) => {
  const id = `contact-${label.toLowerCase().replace(/\s+/g, '-')}`;
  
  return (
    <div className="d-flex align-items-center gap-3 mb-3" id={id}>
      <span 
        className={`contact-icon-circle${isLight ? '-light' : ''}`}
        aria-hidden="true"
      >
        <i className={`bi ${icon}`} aria-hidden="true"></i>
      </span>
      <div>
        <div className="contact-label small text-uppercase text-muted" id={`${id}-label`}>
          {label}
        </div>
        <div className="contact-value fw-medium" aria-labelledby={`${id}-label`}>
          {value}
        </div>
      </div>
    </div>
  );
});

ContactInfo.displayName = 'ContactInfo';

// Memoized status alert component with accessibility improvements
const StatusAlert = memo(({ show, success, message, onClose }) => {
  if (!show) return null;
  
  return (
    <Alert 
      variant={success ? "success" : "danger"} 
      className="mb-4 fade-in"
      dismissible
      onClose={onClose}
      role="alert"
      aria-live="polite"
    >
      <div className="d-flex align-items-center">
        <i className={`fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'} me-3 fs-3`} aria-hidden="true"></i>
        <div>
          <h5 className={success ? "text-success" : "text-danger"} mb-1>
            {success ? "Success!" : "Error!"}
          </h5>
          <p className="mb-0 small">{message}</p>
        </div>
      </div>
    </Alert>
  );
});

StatusAlert.displayName = 'StatusAlert';

const GetInTouch = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    subject: "",
    message: "",
    agreeToTerms: false
  });

  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    success: false,
    message: ""
  });

  // Get environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_GMAIL_CLIENT_ID;
  const CONTACT_EMAIL = import.meta.env.VITE_CONTACT_EMAIL || 'ndiateresia@gmail.com';
  const GMAIL_SCOPES = import.meta.env.VITE_GMAIL_SCOPES || 'https://www.googleapis.com/auth/gmail.send';

  // Memoize handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }, []);

  const handleDismissAlert = useCallback(() => {
    setSubmitStatus(prev => ({ ...prev, show: false }));
  }, []);

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        
        console.log("Google login successful, access token received");
        
        // Create email content
        const emailContent = createEmailContent();
        
        // Encode to base64url format for Gmail API
        const encodedEmail = btoa(emailContent)
          .replace(/\+/g, '-')
          .replace(/\//g, '_')
          .replace(/=+$/, '');

        // Send via Gmail API with timeout
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
          
          // Handle specific error cases
          if (response.status === 403) {
            throw new Error("Permission denied. Please check Gmail API scopes.");
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
          message: "Message sent successfully! We'll get back to you soon."
        });

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          subject: "",
          message: "",
          agreeToTerms: false
        });
        setValidated(false);
        
      } catch (error) {
        console.error("Email error:", error);
        setSubmitStatus({
          show: true,
          success: false,
          message: error.message || "Error sending message. Please try again or call us."
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
    },
    onNonOAuthError: (error) => {
      console.error('Non-OAuth Error:', error);
      setSubmitStatus({
        show: true,
        success: false,
        message: "Authentication error. Please try again."
      });
    }
  });

  // Create email content function
  const createEmailContent = () => {
    const textContent = `
Kitale Progressive School - Contact Form Submission

Full Name: ${formData.fullName}
Email: ${formData.email}
Subject: ${formData.subject || 'Not specified'}
Message: ${formData.message}
Agreed to Terms: ${formData.agreeToTerms ? 'Yes' : 'No'}

This message was sent from the Kitale Progressive School website contact form.
    `;

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #132f66;">
          <h2 style="color: #132f66; margin: 0;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        <h3 style="color: #132f66;">New Contact Form Submission</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; font-weight: bold; width: 100px;">Full Name:</td><td>${formData.fullName}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Email:</td><td>${formData.email}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold;">Subject:</td><td>${formData.subject || 'Not specified'}</td></tr>
          <tr><td style="padding: 8px 0; font-weight: bold; vertical-align: top;">Message:</td><td>${formData.message.replace(/\n/g, '<br>')}</td></tr>
        </table>
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
          <p>This message was sent from the Kitale Progressive School website.</p>
        </div>
      </div>
    `;

    return [
      'Content-Type: multipart/alternative; boundary="boundary123"',
      'MIME-Version: 1.0',
      `To: ${CONTACT_EMAIL}`,
      `From: ${formData.email}`,
      `Subject: Contact Form: ${formData.subject?.slice(0, 50) || 'New Inquiry'} - ${formData.fullName}`,
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
  };

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (!formData.fullName || !formData.email || !formData.message) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please fill in all required fields."
      });
      return;
    }

    if (!formData.agreeToTerms) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please agree to the Terms of Service and Privacy Policy."
      });
      return;
    }

    // Check if client ID exists
    if (!GOOGLE_CLIENT_ID) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Google Client ID is missing. Please check configuration."
      });
      return;
    }
    
    // Trigger Google login flow
    login();
  }, [formData, login, GOOGLE_CLIENT_ID]);

  // Contact information array
  const contactInfo = [
    { icon: 'bi-envelope-fill', label: 'EMAIL', value: 'Progressivesch@gmail.com', isLight: false },
    { icon: 'bi-telephone-fill', label: 'PHONE', value: '+254 722 631 433', isLight: false },
    { icon: 'bi-geo-alt-fill', label: 'Location', value: 'Kitale - Kapenguria RD', isLight: true }
  ];

  return (
    <section id="contact-section" className="section-padding bg-light-custom" aria-labelledby="contact-heading">
      <Container>
        <h1 id="contact-heading" className="section-heading h2 mb-3">
          GET IN TOUCH
        </h1>

        <div className="quote-block lead mb-4 text-center">
          "Join us In Pursuit of Excellence." — Begin your child's journey now.
        </div>
        
        {/* Status Alert */}
        <StatusAlert 
          show={submitStatus.show}
          success={submitStatus.success}
          message={submitStatus.message}
          onClose={handleDismissAlert}
        />

        <Row className="g-4">
          <Col md={6}>
            {contactInfo.map((info, index) => (
              <ContactInfo 
                key={index}
                icon={info.icon}
                label={info.label}
                value={info.value}
                isLight={info.isLight}
              />
            ))}

            {/* Quick Links */}
            <div className="mt-4 pt-2">
              <Link to="/privacy-policy" className="text-muted me-2 small" aria-label="Read our Privacy Policy">
                Privacy Policy
              </Link>
              <span className="text-muted" aria-hidden="true">|</span>
              <Link to="/terms-of-service" className="text-muted ms-2 small" aria-label="Read our Terms of Service">
                Terms of Service
              </Link>
            </div>
          </Col>

          <Col md={6}>
            <div className="form-container">
              <Form noValidate validated={validated} onSubmit={handleSubmit} aria-label="Contact form">
                <FormInput 
                  label="Your Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Mueni Achieng"
                  required
                  feedback="Please enter your name."
                />

                <FormInput 
                  label="Email Address"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  feedback="Please enter a valid email address."
                />

                <FormInput 
                  label="Inquiry Subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder="e.g. Admissions, fees"
                />

                <FormInput 
                  label="How can we help you?"
                  as="textarea"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  required
                  feedback="Please enter your message."
                />

                {/* Terms Checkbox */}
              <Form.Group className="mb-4">
                <div className="custom-checkbox-wrapper">
                  <Form.Check
                    required
                    type="checkbox"
                    name="agreeToTerms"
                    id="agreeToTerms"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    className="custom-checkbox-input"
                    label={
                      <span style={{ fontSize: '0.9rem' }}>
                        I agree to the{' '}
                        <Link to="/terms-of-service" target="_blank" className="text-navy text-decoration-underline">
                          Terms
                        </Link>
                        {' '}and{' '}
                        <Link to="/privacy-policy" target="_blank" className="text-navy text-decoration-underline">
                          Privacy Policy
                        </Link>
                        <span className="visually-hidden"> (required)</span>
                      </span>
                    }
                    feedback="You must agree to the Terms and Privacy Policy."
                  />
                </div>
              </Form.Group>

                <Button 
                  type="submit" 
                  className="btn-navy w-100 w-md-auto"
                  disabled={submitting}
                  aria-label={submitting ? "Sending message" : "Submit inquiry"}
                  style={{ minHeight: '44px', minWidth: '44px' }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Sending...</span>
                      <span className="visually-hidden">Please wait while we send your message</span>
                    </>
                  ) : (
                    'SUBMIT INQUIRY'
                  )}
                </Button>

                <p className="text-muted small mt-3 mb-0 d-flex align-items-center justify-content-center gap-2 flex-wrap">
                  <i className="fas fa-lock me-1" aria-hidden="true"></i>
                  <span>Sign in with Google to verify your identity.</span>
                </p>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default memo(GetInTouch);