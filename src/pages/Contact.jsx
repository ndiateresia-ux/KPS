import React, { useState, useCallback, memo, lazy, Suspense } from "react";
import { Container, Row, Col, Form, Button, Alert, Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';

// Helper function for Unicode-safe base64 encoding
const utf8ToBase64 = (str) => {
  const utf8Bytes = new TextEncoder().encode(str);
  let binaryString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
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
  feedback,
  options,
  min
}) => {
  const id = `input-${name}`;
  const errorId = `${id}-error`;
  
  if (as === 'select') {
    return (
      <Form.Group className="mb-3" controlId={id}>
        <Form.Label className="form-label-custom">
          {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
          {required && <span className="visually-hidden"> (required)</span>}
        </Form.Label>
        <Form.Select 
          name={name}
          value={value}
          onChange={onChange}
          className="form-control-custom"
          required={required}
          aria-invalid={required && !value ? "true" : "false"}
          aria-describedby={required && !value ? errorId : undefined}
        >
          <option value="">Select an option</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Form.Select>
        {required && (
          <Form.Control.Feedback type="invalid" id={errorId} role="alert">
            {feedback || `Please select ${label.toLowerCase()}.`}
          </Form.Control.Feedback>
        )}
      </Form.Group>
    );
  }
  
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
        min={min}
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

// Benefit Card Component
const BenefitCard = memo(({ icon, title, description }) => (
  <div className="benefit-card text-center p-3" style={{
    background: 'white',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    height: '100%',
    transition: 'transform 0.2s ease'
  }}>
    <div style={{
      width: '50px',
      height: '50px',
      background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
      borderRadius: '12px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 1rem',
      fontSize: '1.5rem',
      color: '#cebd04'
    }} aria-hidden="true">
      {icon}
    </div>
    <h3 className="h6 fw-bold mb-2" style={{ color: '#132f66' }}>{title}</h3>
    <p className="small text-muted mb-0">{description}</p>
  </div>
));

BenefitCard.displayName = 'BenefitCard';

// Testimonial Card Component
const TestimonialCard = memo(({ quote, author, role }) => (
  <div className="testimonial-card p-4" style={{
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
    marginBottom: '1rem'
  }}>
    <div style={{ fontSize: '2rem', color: '#cebd04', marginBottom: '0.5rem' }} aria-hidden="true">"</div>
    <p className="text-dark mb-3" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>{quote}</p>
    <div className="d-flex align-items-center gap-2">
      <div style={{
        width: '40px',
        height: '40px',
        background: '#132f66',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold'
      }}>
        {author.charAt(0)}
      </div>
      <div>
        <div className="fw-bold text-navy small">{author}</div>
        <div className="text-muted small">{role}</div>
      </div>
    </div>
  </div>
));

TestimonialCard.displayName = 'TestimonialCard';

const GetInTouch = () => {
  const [inquiryType, setInquiryType] = useState("general");
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    inquiryType: "general",
    subject: "",
    message: "",
    preferredDate: "",
    preferredTime: "",
    numberOfVisitors: "1",
    childGrade: "",
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

  // Benefits data - What parents gain
  const benefits = [
    { icon: "📚", title: "Quality CBC Education", description: "Competency-Based Curriculum approved by KICD" },
    { icon: "👩‍🏫", title: "Experienced Teachers", description: "Dedicated educators who support every child's growth" },
    { icon: "🛡️", title: "Safe Environment", description: "Secure, nurturing space for your child to learn and thrive" },
    { icon: "⚽", title: "Holistic Development", description: "Sports, clubs, and leadership opportunities" },
    { icon: "🏠", title: "Boarding Options", description: "Safe and structured boarding for working parents" },
    { icon: "📞", title: "Regular Updates", description: "Stay informed about your child's progress" }
  ];

  // Testimonials from parents
  const testimonials = [
    { quote: "Our child joined in ECD, and we have seen tremendous growth in confidence, communication, and learning. The teachers are caring and patient.", author: "Mrs. Jane Akinyi", role: "ECD Parent" },
    { quote: "Kitale Progressive School has given our child a strong academic foundation. The teachers are committed, and the learning environment is very supportive.", author: "Mr. John Omondi", role: "Primary Parent" },
    { quote: "We wanted a school that prepares our child for the future, and we found it here. The CBC approach is well implemented.", author: "Mrs. Sarah Kipchoge", role: "Junior Secondary Parent" }
  ];

  // Memoize handlers
  const handleChange = useCallback((e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'inquiryType') {
      setInquiryType(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  }, []);

  const handleDismissAlert = useCallback(() => {
    setSubmitStatus(prev => ({ ...prev, show: false }));
  }, []);

  // Create email with content function - with Reply-To header
  const createEmailWithContent = useCallback(async (to, from, subject, htmlContent, textContent, replyTo) => {
    const boundary = 'boundary_' + Math.random().toString(36).substring(2);

    const emailParts = [
      `MIME-Version: 1.0`,
      `To: ${to}`,
      `From: ${from}`,
      `Reply-To: ${replyTo || from}`,
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
    
    return utf8ToBase64(emailContent)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }, []);

  // Create email content based on inquiry type
  const createEmailContents = useCallback(() => {
    const currentDate = new Date().toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const isVisitInquiry = inquiryType === 'school_visit';
    const inquiryTypeLabel = isVisitInquiry ? 'SCHOOL VISIT REQUEST' : 'GENERAL INQUIRY';
    
    let visitDetails = '';
    if (isVisitInquiry) {
      visitDetails = `
PREFERRED VISIT DATE: ${formData.preferredDate || 'Not specified'}
PREFERRED TIME: ${formData.preferredTime || 'Not specified'}
NUMBER OF VISITORS: ${formData.numberOfVisitors || '1'}
CHILD'S GRADE: ${formData.childGrade || 'Not specified'}`;
    }

    const schoolTextContent = `
KITALE PROGRESSIVE SCHOOL - ${inquiryTypeLabel}
====================================================
Date: ${currentDate}

INQUIRY TYPE: ${inquiryTypeLabel}
CONTACT DETAILS:
----------------
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone || 'Not provided'}
Subject: ${formData.subject || 'Not specified'}

${visitDetails}

MESSAGE:
--------
${formData.message}

TERMS AGREED: ${formData.agreeToTerms ? 'Yes' : 'No'}

---
To reply to this inquiry, simply click "Reply" in your email client. The reply will go directly to: ${formData.email}

This ${isVisitInquiry ? 'visit request' : 'inquiry'} was sent via the Kitale Progressive School website.
    `.trim();

    const schoolHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 10px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #132f66; margin-top: 0;">${inquiryTypeLabel}</h3>
          <p style="color: #666; margin-bottom: 20px;"><strong>Date:</strong> ${currentDate}</p>
          
          <div style="background-color: #e8f0fe; padding: 12px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #132f66;">
            <p style="margin: 0; color: #132f66; font-size: 14px;">
              <strong>📧 Reply Information:</strong> To respond to this inquiry, simply click "Reply" in your email client. 
              Your reply will be sent directly to: <strong>${formData.email}</strong>
            </p>
          </div>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold; width: 140px;">Inquiry Type:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${inquiryTypeLabel}</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Full Name:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.fullName}</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Email:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.email}Zoey</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Phone:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.phone || 'Not provided'}Zoey</td></tr>
            ${isVisitInquiry ? `
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Preferred Date:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.preferredDate || 'Not specified'}Zoey</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Preferred Time:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.preferredTime || 'Not specified'}Zoey</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Number of Visitors:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.numberOfVisitors || '1'}Zoey</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Child's Grade:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.childGrade || 'Not specified'}Zoey</td></tr>
            ` : `
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Subject:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.subject || 'Not specified'}Zoey</td></tr>
            `}
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold; vertical-align: top;">Message:</td><td style="padding: 12px; border-bottom: 1px solid #eee;">${formData.message.replace(/\n/g, '<br>')}Zoey</td></tr>
            <tr><td style="padding: 12px; background-color: #f5f5f5; font-weight: bold;">Terms Agreed:</td><td style="padding: 12px;">${formData.agreeToTerms ? 'Yes' : 'No'}Zoey</td></tr>
          </table>
        </div>
      </div>
    `;

    const userTextContent = `
KITALE PROGRESSIVE SCHOOL - ${isVisitInquiry ? 'VISIT REQUEST RECEIVED' : 'INQUIRY RECEIVED'}
${'='.repeat(50)}
Date: ${currentDate}

Dear ${formData.fullName},

Thank you for ${isVisitInquiry ? 'requesting a school visit to' : 'contacting'} Kitale Progressive School. We have received your ${isVisitInquiry ? 'visit request' : 'inquiry'} and will get back to you as soon as possible.

${isVisitInquiry ? `
YOUR VISIT REQUEST DETAILS:
---------------------------
Preferred Date: ${formData.preferredDate || 'Not specified'}
Preferred Time: ${formData.preferredTime || 'Not specified'}
Number of Visitors: ${formData.numberOfVisitors || '1'}
Child's Grade: ${formData.childGrade || 'Not specified'}

` : `
YOUR INQUIRY DETAILS:
--------------------
Subject: ${formData.subject || 'Not specified'}
Message: ${formData.message}
`}

What happens next?
------------------
1. Our admissions team will review your ${isVisitInquiry ? 'request' : 'inquiry'} within 24-48 hours.
2. A representative will contact you via email or phone.
3. ${isVisitInquiry ? 'We will confirm your preferred date or suggest alternative dates.' : 'For urgent matters, please call us directly.'}

CONTACT INFORMATION:
-------------------
Phone: +254 722 631 433
Email: kitaleprogressivesocial@gmail.com
Location: Kitale - Kapenguria RD

Thank you for your interest in Kitale Progressive School!

Best regards,
The Admissions Team
Kitale Progressive School
"In Pursuit of Excellence"
    `.trim();

    const userHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 10px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #132f66; margin-top: 0;">${isVisitInquiry ? 'Visit Request Received!' : 'Thank You for Contacting Us!'}</h3>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear <strong>${formData.fullName}</strong>,</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for ${isVisitInquiry ? 'requesting a school visit to' : 'reaching out to'} Kitale Progressive School. We have received your ${isVisitInquiry ? 'visit request' : 'inquiry'} and will get back to you as soon as possible.</p>
          
          <div style="background-color: #f0f5fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #132f66;">
            <p style="margin: 0 0 10px 0; font-weight: bold; color: #132f66;">${isVisitInquiry ? 'Your Visit Request Details:' : 'Your Inquiry Details:'}</p>
            <p style="margin: 5px 0;"><strong>Date:</strong> ${currentDate}</p>
            ${isVisitInquiry ? `
            <p style="margin: 5px 0;"><strong>Preferred Date:</strong> ${formData.preferredDate || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Preferred Time:</strong> ${formData.preferredTime || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Number of Visitors:</strong> ${formData.numberOfVisitors || '1'}</p>
            <p style="margin: 5px 0;"><strong>Child's Grade:</strong> ${formData.childGrade || 'Not specified'}</p>
            ` : `
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${formData.subject || 'Not specified'}</p>
            <p style="margin: 5px 0;"><strong>Message:</strong> ${formData.message}</p>
            `}
          </div>
          
          <h4 style="color: #132f66; margin: 25px 0 15px 0;">What Happens Next:</h4>
          
          <table style="width: 100%; border-collapse: collapse;">
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee; width: 40px; vertical-align: top;"><span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">1</span></td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Review</strong><br/><span>Our team will review your request within 24-48 hours.</span>Zoey</td></tr>
            <tr><td style="padding: 10px; border-bottom: 1px solid #eee;"><span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">2</span>Zoey
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><strong>Response</strong><br/><span>A representative will contact you via email or phone.</span>Zoey</td></tr>
            <tr><td style="padding: 10px;"><span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">3</span>Zoey
              <td style="padding: 10px;"><strong>${isVisitInquiry ? 'Confirmation' : 'Follow-up'}</strong><br/><span>${isVisitInquiry ? 'We will confirm your preferred date or suggest alternative dates.' : 'We will address your questions and provide guidance.'}</span>Zoey</td></tr>
          </table>
          
          <div style="margin: 30px 0 20px 0; padding: 20px; background-color: #fff8e7; border-radius: 8px; border: 1px solid #cebd04;">
            <p style="margin: 0; color: #132f66;">
              <strong>📌 Contact Information:</strong><br/>
              Phone: +254 722 631 433<br/>
              Email: kitaleprogressivesocial@gmail.com<br/>
              Location: Kitale - Kapenguria RD
            </p>
          </div>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">We look forward to ${isVisitInquiry ? 'welcoming you to our school' : 'assisting you'}!</p>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 25px;">Best regards,<br/>
          <strong>The Admissions Team</strong><br/>
          Kitale Progressive School<br/>
          <em>"In Pursuit of Excellence"</em></p>
        </div>
      </div>
    `;

    return {
      school: { html: schoolHtmlContent, text: schoolTextContent },
      user: { html: userHtmlContent, text: userTextContent }
    };
  }, [formData, inquiryType]);

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        
        const emailContents = createEmailContents();
        
        const isVisitInquiry = inquiryType === 'school_visit';
        const emailSubject = isVisitInquiry 
          ? `School Visit Request: ${formData.fullName}`
          : `Contact Form Inquiry: ${formData.subject?.slice(0, 50) || 'General Inquiry'} - ${formData.fullName}`;
        
        // Send to school with Reply-To set to user's email
        const schoolEncodedEmail = await createEmailWithContent(
          CONTACT_EMAIL,
          formData.email,
          emailSubject,
          emailContents.school.html,
          emailContents.school.text,
          formData.email
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
          throw new Error("Failed to send message");
        }
        
        // Send confirmation to user
        const userEncodedEmail = await createEmailWithContent(
          formData.email,
          formData.email,
          isVisitInquiry 
            ? `Your School Visit Request - Kitale Progressive School`
            : `We Received Your Inquiry - Kitale Progressive School`,
          emailContents.user.html,
          emailContents.user.text,
          CONTACT_EMAIL
        );
        
        await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: userEncodedEmail })
        }).catch(err => console.warn("User confirmation warning:", err));

        const successMessage = isVisitInquiry
          ? `Thank you for requesting a school visit! A confirmation email has been sent to ${formData.email}. We'll contact you to confirm your preferred date.`
          : `Thank you for contacting us! A confirmation email has been sent to ${formData.email}. We'll get back to you soon.`;

        setSubmitStatus({
          show: true,
          success: true,
          message: successMessage
        });

        // Reset form
        setFormData({
          fullName: "",
          email: "",
          phone: "",
          inquiryType: "general",
          subject: "",
          message: "",
          preferredDate: "",
          preferredTime: "",
          numberOfVisitors: "1",
          childGrade: "",
          agreeToTerms: false
        });
        setInquiryType("general");
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
      setSubmitting(false);
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

    if (inquiryType === 'school_visit' && !formData.preferredDate) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please select a preferred date for your school visit."
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

    if (!GOOGLE_CLIENT_ID) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Configuration error. Please contact support."
      });
      return;
    }
    
    login();
  }, [formData, login, GOOGLE_CLIENT_ID, inquiryType]);

  const getTomorrowDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const inquiryTypeOptions = [
    { value: "general", label: "General Inquiry" },
    { value: "school_visit", label: "Book a School Visit" },
    { value: "admissions", label: "Admissions Information" },
    { value: "fee_structure", label: "Fee Structure Inquiry" },
    { value: "transport_cost", label: "Transportation Inquiry" },
    { value: "boarding", label: "Boarding Information" }
  ];

  const contactInfo = [
    { icon: 'bi-envelope-fill', label: 'EMAIL', value: 'kitaleprogressivesocial@gmail.com', isLight: false },
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

        {/* Introduction for Parents */}
        <Row className="mb-5">
          <Col lg={10} className="mx-auto">
            <Card className="border-0 bg-white shadow-sm rounded-4 overflow-hidden">
              <Card.Body className="p-4 p-lg-5">
                <div className="text-center mb-4">
                  <div style={{
                    width: '80px',
                    height: '80px',
                    background: 'linear-gradient(135deg, #132f66 0%, #1e3a7a 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 1rem'
                  }}>
                    <i className="fas fa-graduation-cap text-white" style={{ fontSize: '2rem' }} aria-hidden="true"></i>
                  </div>
                  <h2 className="h3 fw-bold text-navy mb-2">We're Here to Support Your Child's Educational Journey</h2>
                  <p className="text-muted">Whether you have questions about admissions, want to understand our CBC curriculum, or wish to schedule a school visit, our team is ready to assist you.</p>
                </div>

                <Row className="g-4 mt-2">
                  <Col md={6}>
                    <div className="p-3 bg-light-custom rounded-3">
                      <i className="fas fa-child text-gold fs-4 mb-2" aria-hidden="true"></i>
                      <h3 className="h6 fw-bold text-navy mb-2">Looking for the Right School?</h3>
                      <p className="small text-muted mb-0">Choosing the right school is one of the most important decisions you'll make for your child. We're here to answer your questions and help you make an informed choice.</p>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="p-3 bg-light-custom rounded-3">
                      <i className="fas fa-calendar-alt text-gold fs-4 mb-2" aria-hidden="true"></i>
                      <h3 className="h6 fw-bold text-navy mb-2">Experience Our School Firsthand</h3>
                      <p className="small text-muted mb-0">Seeing is believing. Schedule a school visit to tour our facilities, meet our teachers, and experience our learning environment.</p>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* What Parents Gain Section */}
        <div className="text-center mb-4">
          <h2 className="section-heading h3 mb-2">What Your Child Gains at Kitale Progressive School</h2>
          <p className="text-muted">A complete education that prepares learners for the future</p>
        </div>

        <Row className="g-4 mb-5">
          {benefits.map((benefit, idx) => (
            <Col key={idx} xs={6} md={4} lg={2}>
              <BenefitCard {...benefit} />
            </Col>
          ))}
        </Row>

        {/* Parent Testimonials */}
        <div className="text-center mb-4">
          <h2 className="section-heading h3 mb-2">What Parents Say About Us</h2>
          <p className="text-muted">Real experiences from families who have chosen Kitale Progressive School</p>
        </div>

        <Row className="g-4 mb-5">
          {testimonials.map((testimonial, idx) => (
            <Col key={idx} md={4}>
              <TestimonialCard {...testimonial} />
            </Col>
          ))}
        </Row>

        {/* Contact Options Section */}
        <Row className="mb-4">
          <Col lg={12}>
            <div className="text-center mb-4">
              <h2 className="section-heading h3 mb-2">Get in Touch With Us</h2>
              <p className="text-muted">We'd love to hear from you and answer any questions you may have</p>
            </div>
          </Col>
        </Row>
        
        {/* Status Alert */}
        <StatusAlert 
          show={submitStatus.show}
          success={submitStatus.success}
          message={submitStatus.message}
          onClose={handleDismissAlert}
        />

        <Row className="g-4">
          <Col md={5}>
            <div className="bg-white p-4 rounded-4 shadow-sm h-100">
              <h3 className="h5 fw-bold text-navy mb-4">Contact Information</h3>
              {contactInfo.map((info, index) => (
                <ContactInfo 
                  key={index}
                  icon={info.icon}
                  label={info.label}
                  value={info.value}
                  isLight={info.isLight}
                />
              ))}

              <hr className="my-4" />

              <h3 className="h5 fw-bold text-navy mb-3">Office Hours</h3>
              <div className="mb-3">
                <p className="mb-1 text-dark"><strong>Monday - Friday:</strong> 8:00 AM - 5:00 PM</p>
                <p className="mb-1 text-dark"><strong>Saturday:</strong> 9:00 AM - 12:00 PM</p>
                <p className="text-muted small mb-0"><i className="fas fa-info-circle me-1" aria-hidden="true"></i> School visits by appointment</p>
              </div>

              <hr className="my-4" />

              <div className="d-flex gap-2 flex-wrap">
                <a 
                  href="https://wa.me/254736756595" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn-navy d-inline-flex align-items-center gap-2"
                  style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
                >
                  <i className="fab fa-whatsapp" aria-hidden="true"></i>
                  WhatsApp Us
                </a>
               <a 
                href="https://mail.google.com/mail/?view=cm&fs=1&to=kitaleprogressivesocial@gmail.com&su=Inquiry"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-navy d-inline-flex align-items-center gap-2"
                style={{ padding: '0.5rem 1.2rem', fontSize: '0.9rem' }}
              >
                <i className="fas fa-envelope" aria-hidden="true"></i>
                Send Email
              </a>
              </div>

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
            </div>
          </Col>

          <Col md={7}>
            <div className="form-container bg-white p-4 p-lg-5 rounded-4 shadow-sm">
              <h3 className="h5 fw-bold text-navy mb-4">Send Us a Message</h3>
              <Form noValidate validated={validated} onSubmit={handleSubmit} aria-label="Contact form">
                <FormInput 
                  label="I would like to"
                  as="select"
                  name="inquiryType"
                  value={inquiryType}
                  onChange={handleChange}
                  required
                  options={inquiryTypeOptions}
                  feedback="Please select an inquiry type."
                />

                <FormInput 
                  label="Your Full Name"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g., Mueni Achieng"
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
                  label="Phone Number (Optional)"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+254 712 345 678"
                />

                {inquiryType === 'school_visit' ? (
                  <>
                    <FormInput 
                      label="Preferred Visit Date"
                      type="date"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleChange}
                      required
                      min={getTomorrowDate()}
                      feedback="Please select a preferred date for your visit."
                    />
                    
                    <FormInput 
                      label="Preferred Time"
                      as="select"
                      name="preferredTime"
                      value={formData.preferredTime}
                      onChange={handleChange}
                      required
                      options={[
                        { value: "9:00 AM", label: "9:00 AM" },
                        { value: "10:00 AM", label: "10:00 AM" },
                        { value: "11:00 AM", label: "11:00 AM" },
                        { value: "12:00 PM", label: "12:00 PM" },
                        { value: "2:00 PM", label: "2:00 PM" },
                        { value: "3:00 PM", label: "3:00 PM" }
                      ]}
                      feedback="Please select a preferred time."
                    />
                    
                    <FormInput 
                      label="Number of Visitors"
                      as="select"
                      name="numberOfVisitors"
                      value={formData.numberOfVisitors}
                      onChange={handleChange}
                      required
                      options={[
                        { value: "1", label: "1 person" },
                        { value: "2", label: "2 people" },
                        { value: "3", label: "3 people" },
                        { value: "4", label: "4 people" },
                        { value: "5+", label: "5 or more" }
                      ]}
                    />
                    
                    <FormInput 
                      label="Child's Grade (if applicable)"
                      as="select"
                      name="childGrade"
                      value={formData.childGrade}
                      onChange={handleChange}
                      options={[
                        { value: "", label: "Prospecting" },
                        { value: "Playgroup", label: "Playgroup" },
                        { value: "PP1", label: "PP1" },
                        { value: "PP2", label: "PP2" },
                        { value: "Grade 1", label: "Grade 1" },
                        { value: "Grade 2", label: "Grade 2" },
                        { value: "Grade 3", label: "Grade 3" },
                        { value: "Grade 4", label: "Grade 4" },
                        { value: "Grade 5", label: "Grade 5" },
                        { value: "Grade 6", label: "Grade 6" },
                        { value: "Grade 7", label: "Grade 7" },
                        { value: "Grade 8", label: "Grade 8" },
                        { value: "Grade 9", label: "Grade 9" }
                      ]}
                    />
                  </>
                ) : (
                  <FormInput 
                    label="Subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g., Admissions, Fees, Curriculum"
                    required={inquiryType !== 'general'}
                  />
                )}

                <FormInput 
                  label="Message"
                  as="textarea"
                  rows={4}
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={inquiryType === 'school_visit' ? "Any special requests or questions about your visit?" : "Write your message here..."}
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
                  className="btn-navy w-100"
                  disabled={submitting}
                  aria-label={submitting ? "Sending message" : "Submit inquiry"}
                  style={{ minHeight: '44px' }}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      <span>Sending...</span>
                      <span className="visually-hidden">Please wait while we send your message</span>
                    </>
                  ) : (
                    inquiryType === 'school_visit' ? 'REQUEST SCHOOL VISIT' : 'SUBMIT INQUIRY'
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

      <style dangerouslySetInnerHTML={{ __html: `
        .benefit-card {
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .benefit-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(0,0,0,0.1);
        }
        .testimonial-card {
          transition: transform 0.2s ease;
        }
        .testimonial-card:hover {
          transform: translateY(-2px);
        }
        .btn-navy {
          background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%);
          border: none;
          color: white;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-navy:hover {
          background: linear-gradient(135deg, #0a1f4d 0%, #071638 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(19,47,102,0.3);
        }
        .btn-outline-navy {
          border: 2px solid #132f66;
          background: transparent;
          color: #132f66;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-outline-navy:hover {
          background: #132f66;
          color: white;
          transform: translateY(-2px);
        }
        @media (max-width: 768px) {
          .section-heading {
            font-size: 1.8rem;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .benefit-card,
          .testimonial-card,
          .btn-navy,
          .btn-outline-navy {
            transition: none !important;
            transform: none !important;
          }
        }
      `}} />
    </section>
  );
};

export default memo(GetInTouch);