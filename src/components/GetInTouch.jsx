import React, { useState, useCallback, memo, lazy, Suspense } from "react";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

// Helper function for Unicode-safe base64 encoding
const utf8ToBase64 = (str) => {
  // First convert the string to UTF-8 bytes
  const utf8Bytes = new TextEncoder().encode(str);
  // Convert the byte array to a binary string
  let binaryString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
  // Use btoa on the binary string
  return btoa(binaryString);
};

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

  // Create email with attachment function
  const createEmailWithContent = useCallback(async (to, from, subject, htmlContent, textContent) => {
    // Create boundary
    const boundary = 'boundary_' + Math.random().toString(36).substring(2);

    // Construct email with both HTML and plain text versions
    const emailParts = [
      `MIME-Version: 1.0`,
      `To: ${to}`,
      `From: ${from}`,
      `Subject: ${subject}`,
      `Content-Type: multipart/alternative; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/plain; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      textContent,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlContent,
      '',
      `--${boundary}--`
    ];

    const emailContent = emailParts.join('\r\n');
    
    // Use our Unicode-safe base64 encoding function
    return utf8ToBase64(emailContent)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }, []);

  // Create email content function
  const createEmailContents = useCallback(() => {
    const currentDate = new Date().toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Plain text version for SCHOOL
    const schoolTextContent = `
KITALE PROGRESSIVE SCHOOL - NEW CONTACT FORM INQUIRY
====================================================
Date: ${currentDate}

CONTACT DETAILS:
----------------
Full Name: ${formData.fullName}
Email: ${formData.email}
Subject: ${formData.subject || 'Not specified'}

MESSAGE:
--------
${formData.message}

TERMS AGREED: ${formData.agreeToTerms ? 'Yes' : 'No'}

---
This inquiry was sent via the Kitale Progressive School website contact form.
    `.trim();

    // HTML version for SCHOOL
    const schoolHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 10px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #132f66; margin-top: 0;">New Contact Form Inquiry</h3>
          <p style="color: #666; margin-bottom: 20px;"><strong>Date:</strong> ${currentDate}</p>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 12px; background-color: #f5f5f5; font-weight: bold; width: 120px;">Full Name:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Email:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.email}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Subject:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.subject || 'Not specified'}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f5f5f5; font-weight: bold; vertical-align: top;">Message:</td>
              <td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.message.replace(/\n/g, '<br>')}</td>
            </tr>
            <tr>
              <td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Terms Agreed:</td>
              <td style="padding: 12px;">${formData.agreeToTerms ? 'Yes' : 'No'}</td>
            </tr>
          </table>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 15px; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">This inquiry was sent via the Kitale Progressive School website contact form.</p>
        </div>
      </div>
    `;

    // Plain text version for USER (confirmation)
    const userTextContent = `
KITALE PROGRESSIVE SCHOOL - INQUIRY RECEIVED
=============================================
Date: ${currentDate}

Dear ${formData.fullName},

Thank you for contacting Kitale Progressive School. We have received your inquiry and will get back to you as soon as possible.

YOUR INQUIRY DETAILS:
---------------------
Subject: ${formData.subject || 'Not specified'}
Message: ${formData.message}

What happens next?
------------------
1. Our team will review your inquiry within 24-48 hours.
2. A representative will contact you via email or phone.
3. For urgent matters, please call us at +254 722 631 433.

CONTACT INFORMATION:
-------------------
Phone: +254 722 631 433
Email: Progressivesch@gmail.com
Location: Kitale - Kapenguria RD

Thank you for your interest in Kitale Progressive School!

Best regards,
The Admissions Team
Kitale Progressive School
"In Pursuit of Excellence"
    `.trim();

    // HTML version for USER (confirmation)
    const userHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 10px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #132f66; margin-top: 0;">Thank You for Contacting Us!</h3>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear <strong>${formData.fullName}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for reaching out to Kitale Progressive School. We have received your inquiry and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f0f5fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #132f66;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #132f66;">Your Inquiry Details:</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${currentDate}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${formData.subject || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Message:</strong> ${formData.message}</p>
          </div>
          
          <h4 style="color: #132f66; margin: 25px 0 15px 0;">What Happens Next:</h4>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee; width: 40px; vertical-align: top;">
                <span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">1</span>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong style="color: #333;">Review</strong><br/>
                <span style="color: #666;">Our team will review your inquiry within 24-48 hours.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">2</span>
              </td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">
                <strong style="color: #333;">Response</strong><br/>
                <span style="color: #666;">A representative will contact you via email or phone.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px;">
                <span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">3</span>
              </td>
              <td style="padding: 10px;">
                <strong style="color: #333;">Urgent Matters</strong><br/>
                <span style="color: #666;">For urgent inquiries, please call us at +254 722 631 433.</span>
              </td>
            </tr>
          </table>
          
          <div style="margin: 30px 0 20px 0; padding: 20px; background-color: #fff8e7; border-radius: 8px; border: 1px solid #cebd04;">
            <p style="margin: 0; color: #132f66;">
              <strong>📌 Contact Information:</strong><br/>
              Phone: +254 722 631 433<br/>
              Email: Progressivesch@gmail.com<br/>
              Location: Kitale - Kapenguria RD
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for your interest in Kitale Progressive School. We look forward to connecting with you!</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 25px;">Best regards,<br/>
          <strong style="color: #132f66;">The Admissions Team</strong><br/>
          Kitale Progressive School<br/>
          <em style="color: #666;">"In Pursuit of Excellence"</em></p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 15px; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">Kitale Progressive School | P.O. Box 1234, Kitale, Kenya</p>
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kitale Progressive School. All rights reserved.</p>
          <p style="margin: 5px 0;">This email confirms receipt of your inquiry.</p>
        </div>
      </div>
    `;

    return {
      school: { html: schoolHtmlContent, text: schoolTextContent },
      user: { html: userHtmlContent, text: userTextContent }
    };
  }, [formData]);

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        
        console.log("Google login successful, sending emails...");
        
        // Create email contents
        const emailContents = createEmailContents();
        
        // SEND EMAIL TO SCHOOL FIRST
        console.log("Sending notification to school:", CONTACT_EMAIL);
        
        const schoolEncodedEmail = await createEmailWithContent(
          CONTACT_EMAIL, // Send to school
          formData.email, // From the user's email
          `Contact Form: ${formData.subject?.slice(0, 50) || 'New Inquiry'} - ${formData.fullName}`,
          emailContents.school.html,
          emailContents.school.text
        );
        
        const schoolResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: schoolEncodedEmail })
        });
        
        if (!schoolResponse.ok) {
          const errorData = await schoolResponse.json();
          console.error("Error sending to school:", errorData);
          throw new Error("Failed to send inquiry to school");
        }
        
        console.log("School email sent successfully");
        
        // SEND CONFIRMATION EMAIL TO USER
        console.log("Sending confirmation email to user:", formData.email);
        
        const userEncodedEmail = await createEmailWithContent(
          formData.email, // Send to user
          formData.email, // From the user's email
          `We Received Your Inquiry - Kitale Progressive School`,
          emailContents.user.html,
          emailContents.user.text
        );
        
        const userResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: userEncodedEmail })
        });
        
        if (!userResponse.ok) {
          const errorData = await userResponse.json();
          console.error("Error sending to user:", errorData);
          // Don't throw - school email already sent
          console.warn("Failed to send confirmation to user, but school was notified");
        } else {
          console.log("User confirmation email sent successfully");
        }

        setSubmitStatus({
          show: true,
          success: true,
          message: `Thank you for contacting us! A confirmation email has been sent to ${formData.email}. We'll get back to you soon.`
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
          message: error.message || "Error sending message. Please try again or call us at +254 722 631 433."
        });
      } finally {
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onError: (error) => {
      console.error('Login Failed:', error);
      let errorMessage = "Google sign-in failed. ";
      
      if (error?.error === 'popup_blocked_by_browser') {
        errorMessage += "Please allow popups for this site.";
      } else if (error?.error === 'access_denied') {
        errorMessage += "You denied access to your account.";
      } else {
        errorMessage += "Please try again.";
      }
      
      setSubmitStatus({
        show: true,
        success: false,
        message: errorMessage
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
                  <span>Sign in with Google to verify your identity and receive a confirmation email.</span>
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