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

// Helper function for Unicode-safe base64 encoding
const utf8ToBase64 = (str) => {
  const utf8Bytes = new TextEncoder().encode(str);
  let binaryString = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binaryString += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binaryString);
};

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

// Memoized stat card component with accessibility
const StatCard = memo(({ stat, index }) => {
  const [ref, inView] = useInView({ threshold: 0.3, triggerOnce: true });
  const cardId = `stat-${index}`;
  
  return (
    <Col md={3} className="text-center mb-3">
      <div ref={ref} className="stat-item" role="article" aria-labelledby={cardId}>
        <div id={cardId} className="stat-number" aria-hidden="true">
          {inView ? (
            <CountUp end={stat.value} suffix={stat.suffix} />
          ) : (
            `0${stat.suffix}`
          )}
        </div>
        <div className="stat-label">{stat.label}</div>
        <span className="visually-hidden">{stat.value}{stat.suffix} {stat.label}</span>
      </div>
    </Col>
  );
});

StatCard.displayName = 'StatCard';

// Memoized sponsor card component with accessibility
const SponsorCard = memo(({ icon, title, description }) => {
  const cardId = `sponsor-${title.replace(/\s+/g, '-').toLowerCase()}`;
  
  return (
    <Col md={4} className="mb-3">
      <div
        className="sponsor-card"
        role="article"
        aria-labelledby={cardId}
        tabIndex={0}
      >
        <div className="sponsor-icon" aria-hidden="true">{icon}</div>
        <h3 id={cardId}>{title}</h3>
        <p>{description}</p>
      </div>
    </Col>
  );
});

SponsorCard.displayName = 'SponsorCard';

// Alert component with accessibility
const Alert = memo(({ show, success, message, onClose }) => {
  if (!show) return null;
  
  return (
    <div 
      className={`sponsor-alert ${success ? 'sponsor-alert-success' : 'sponsor-alert-error'}`}
      role="alert" 
      aria-live="polite"
    >
      <div className="d-flex align-items-center gap-2">
        <i className={`fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'}`} style={{ fontSize: '1.2rem' }} aria-hidden="true"></i>
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onClose();
          }
        }}
        className="sponsor-alert-close"
        aria-label="Close alert"
      >
        ×
      </button>
    </div>
  );
});

Alert.displayName = 'Alert';

// Form input component with accessibility
const FormInput = memo(({ label, type = "text", name, value, onChange, placeholder, required = false, feedback, as, rows, options }) => {
  const id = `input-${name}`;
  const errorId = `${id}-error`;
  
  return (
    <div className="sponsor-form-group">
      <label htmlFor={id} className="sponsor-form-label">
        {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
        {required && <span className="visually-hidden"> (required)</span>}
      </label>
      {as === 'select' ? (
        <select
          id={id}
          name={name}
          value={value}
          onChange={onChange}
          required={required}
          className="sponsor-form-control"
          aria-invalid={required && !value ? "true" : "false"}
          aria-describedby={required && !value ? errorId : undefined}
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
          className="sponsor-form-control"
          aria-invalid={required && !value ? "true" : "false"}
          aria-describedby={required && !value ? errorId : undefined}
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
          className="sponsor-form-control"
          aria-invalid={required && !value ? "true" : "false"}
          aria-describedby={required && !value ? errorId : undefined}
        />
      )}
      {required && feedback && (
        <div id={errorId} className="sponsor-error-message" role="alert">{feedback}</div>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

// Create email with content function
const createEmailWithContent = async (to, from, subject, htmlContent, textContent) => {
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
  
  // Use Unicode-safe base64 encoding function
  return utf8ToBase64(emailContent)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

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

  // Create email content function for SPONSORS/DONORS
  const createEmailContents = useCallback(() => {
    const currentDate = new Date().toLocaleDateString('en-KE', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const displaySupportType = getDisplaySupportType();
    const formattedPhone = formData.phone || 'Not provided';

    // Plain text version for SCHOOL
    const schoolTextContent = `
KITALE PROGRESSIVE SCHOOL - NEW SPONSORSHIP/DONATION INQUIRY
============================================================
Date: ${currentDate}

SPONSOR/DONOR DETAILS:
----------------------
Full Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formattedPhone}
Support Type: ${displaySupportType}

MESSAGE:
--------
${formData.message}

TERMS AGREED: ${formData.agreeToTerms ? 'Yes' : 'No'}

---
This inquiry was sent by a potential sponsor/donor via the Kitale Progressive School website.
    `.trim();

    // HTML version for SCHOOL (professional, detailed)
    const schoolHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 10px;">
          <h2 style="color: white; margin: 0; font-size: 24px;">Kitale Progressive School</h2>
          <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
        </div>
        
        <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h3 style="color: #132f66; margin-top: 0; border-bottom: 2px solid #132f66; padding-bottom: 10px;">New Sponsorship/Donation Inquiry</h3>
          
          <p style="color: #666; margin-bottom: 20px;"><strong>Date:</strong> ${currentDate}</p>
          
          <h4 style="color: #132f66; margin: 20px 0 10px 0;">Sponsor/Donor Information</h4>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
            <tr>
              <td style="padding: 10px; background-color: #f5f5f5; font-weight: bold; width: 120px;">Full Name:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${formData.fullName}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Email:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;"><a href="mailto:${formData.email}" style="color: #132f66;">${formData.email}</a></td>
            </tr>
            <tr>
              <td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Phone:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${formattedPhone}</td>
            </tr>
            <tr>
              <td style="padding: 10px; background-color: #f5f5f5; font-weight: bold;">Support Type:</td>
              <td style="padding: 10px; border-bottom: 1px solid #eee;">${displaySupportType}</td>
            </tr>
          </table>
          
          <h4 style="color: #132f66; margin: 20px 0 10px 0;">Message from Sponsor/Donor</h4>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; border-left: 4px solid #132f66; margin-bottom: 20px;">
            <p style="margin: 0; line-height: 1.6; white-space: pre-wrap;">${formData.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="background-color: #f0f5fa; padding: 15px; border-radius: 8px; margin-top: 20px;">
            <p style="margin: 0; color: #132f66;">
              <strong>Next Steps:</strong> This potential sponsor/donor has expressed interest in supporting our school. Please follow up within 24-48 hours to acknowledge their generosity and discuss further.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 15px; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">Kitale Progressive School | P.O. Box 1234, Kitale, Kenya</p>
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kitale Progressive School. All rights reserved.</p>
        </div>
      </div>
    `;

    // Plain text version for SPONSOR/DONOR (warm, appreciative)
    const sponsorTextContent = `
KITALE PROGRESSIVE SCHOOL - THANK YOU FOR YOUR GENEROSITY
==========================================================
Date: ${currentDate}

Dear ${formData.fullName},

Thank you from the bottom of our hearts for reaching out to support Kitale Progressive School. Your willingness to make a difference in the lives of our students is truly inspiring and deeply appreciated.

YOUR INQUIRY DETAILS:
---------------------
Support Type: ${displaySupportType}

Your Message:
${formData.message}

WHAT HAPPENS NEXT:
-----------------
1. A member of our Sponsorship Team will personally contact you within 24-48 hours.
2. We will discuss the specific ways your generous support can make an impact.
3. You will receive detailed information about our students, projects, and how we will honor your partnership.

WAYS TO CONNECT WITH US:
-----------------------
Phone: +254 722 631 433
Email: Progressivesch@gmail.com
Website: www.kitale-progressive.sch.ke

"Every gift, no matter the size, has the power to transform a life. Your heart for our children touches us deeply."

Thank you for being a beacon of hope. Together, we are building a brighter future, one child at a time.

With deepest gratitude,

The Sponsorship Team
Kitale Progressive School
"In Pursuit of Excellence"
    `.trim();

    // HTML version for SPONSOR/DONOR (warm, appreciative, visually appealing)
    const sponsorHtmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="text-align: center; margin-bottom: 30px; padding: 30px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 15px;">
          <h1 style="color: white; margin: 0; font-size: 28px;">Thank You!</h1>
          <p style="color: #cebd04; margin: 10px 0 0; font-size: 18px;">Your Generosity Changes Lives</p>
        </div>
        
        <div style="background-color: white; padding: 40px; border-radius: 15px; box-shadow: 0 4px 20px rgba(0,0,0,0.1);">
          <p style="font-size: 18px; line-height: 1.6; color: #333; margin-bottom: 25px;">
            Dear <strong style="color: #132f66;">${formData.fullName}</strong>,
          </p>
          
          <p style="font-size: 16px; line-height: 1.8; color: #333; margin-bottom: 25px;">
            Thank you from the bottom of our hearts for reaching out to support Kitale Progressive School. Your willingness to make a difference in the lives of our students is truly inspiring and deeply appreciated.
          </p>
          
          <div style="background-color: #f0f5fa; padding: 25px; border-radius: 12px; margin: 30px 0; border-left: 6px solid #132f66;">
            <h3 style="color: #132f66; margin-top: 0; margin-bottom: 15px;">Your Gift of Support</h3>
            <p style="margin: 0 0 10px 0;"><strong>Type of Support:</strong> ${displaySupportType}</p>
            <p style="margin: 0;"><strong>Your Message:</strong></p>
            <p style="margin: 10px 0 0 0; font-style: italic; color: #4a5568;">"${formData.message}"</p>
          </div>
          
          <h3 style="color: #132f66; margin: 30px 0 20px 0; font-size: 20px;">What Happens Next</h3>
          
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <tr>
              <td style="padding: 15px; background-color: #f9f9f9; border-radius: 8px 0 0 8px; width: 50px; vertical-align: top;">
                <span style="background-color: #132f66; color: white; width: 30px; height: 30px; display: inline-block; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold;">1</span>
              </td>
              <td style="padding: 15px; background-color: #f9f9f9; border-radius: 0 8px 8px 0;">
                <strong style="color: #333;">Personal Follow-up</strong><br/>
                <span style="color: #666;">A member of our Sponsorship Team will contact you within 24-48 hours to discuss your generous offer.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; width: 50px; vertical-align: top;">
                <span style="background-color: #132f66; color: white; width: 30px; height: 30px; display: inline-block; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold;">2</span>
              </td>
              <td style="padding: 15px;">
                <strong style="color: #333;">Impact Discussion</strong><br/>
                <span style="color: #666;">We will share stories of students and projects your support could help, and tailor the partnership to your vision.</span>
              </td>
            </tr>
            <tr>
              <td style="padding: 15px; background-color: #f9f9f9; border-radius: 8px 0 0 8px;">
                <span style="background-color: #132f66; color: white; width: 30px; height: 30px; display: inline-block; border-radius: 50%; text-align: center; line-height: 30px; font-weight: bold;">3</span>
              </td>
              <td style="padding: 15px; background-color: #f9f9f9; border-radius: 0 8px 8px 0;">
                <strong style="color: #333;">Recognition and Updates</strong><br/>
                <span style="color: #666;">You will receive regular updates on the impact of your generosity and how you are changing lives.</span>
              </td>
            </tr>
          </table>
          
          <div style="background: linear-gradient(135deg, #fff8e7 0%, #fff0d9 100%); padding: 25px; border-radius: 12px; margin: 30px 0; border: 1px solid #cebd04;">
            <h4 style="color: #132f66; margin-top: 0;">Your Support Changes Lives</h4>
            <p style="margin: 0; color: #4a5568; line-height: 1.6;">
              "Every gift, no matter the size, has the power to transform a life. Your heart for our children touches us deeply."
            </p>
          </div>
          
          <div style="margin: 30px 0; padding: 20px; background-color: #f5f5f5; border-radius: 8px;">
            <h4 style="color: #132f66; margin-top: 0;">Connect With Us</h4>
            <p style="margin: 5px 0;"><strong>Phone:</strong> +254 722 631 433</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> Progressivesch@gmail.com</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> Kitale - Kapenguria RD</p>
            <p style="margin: 5px 0;"><strong>Website:</strong> www.kitale-progressive.sch.ke</p>
          </div>
          
          <p style="font-size: 18px; line-height: 1.6; color: #333; margin: 30px 0 20px; text-align: center;">
            Thank you for being a beacon of hope. Together, we are building a brighter future, one child at a time.
          </p>
          
          <p style="font-size: 18px; line-height: 1.6; color: #333; margin-top: 30px; text-align: center;">
            With deepest gratitude,<br/>
            <strong style="color: #132f66; font-size: 20px;">The Sponsorship Team</strong><br/>
            <span style="color: #666;">Kitale Progressive School</span><br/>
            <em style="color: #132f66;">"In Pursuit of Excellence"</em>
          </p>
        </div>
        
        <div style="text-align: center; margin-top: 20px; padding: 20px; color: #666; font-size: 12px;">
          <p style="margin: 5px 0;">Kitale Progressive School | P.O. Box 1234, Kitale, Kenya</p>
          <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kitale Progressive School. All rights reserved.</p>
          <p style="margin: 5px 0;">This email confirms receipt of your sponsorship/donation inquiry.</p>
        </div>
      </div>
    `;

    return {
      school: { html: schoolHtmlContent, text: schoolTextContent },
      sponsor: { html: sponsorHtmlContent, text: sponsorTextContent }
    };
  }, [formData, getDisplaySupportType]);

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        
        console.log("Google login successful, sending emails...");
        
        const emailContents = createEmailContents();
        
        // SEND EMAIL TO SCHOOL FIRST
        console.log("Sending notification to school:", SPONSORSHIP_EMAIL);
        
        const schoolEncodedEmail = await createEmailWithContent(
          SPONSORSHIP_EMAIL,
          formData.email,
          `NEW SPONSOR/DONOR: ${formData.fullName} - ${getDisplaySupportType()}`,
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
        
        // SEND CONFIRMATION EMAIL TO SPONSOR/DONOR
        console.log("Sending thank you email to sponsor/donor:", formData.email);
        
        const sponsorEncodedEmail = await createEmailWithContent(
          formData.email,
          formData.email,
          `Thank You for Your Generosity - Kitale Progressive School`,
          emailContents.sponsor.html,
          emailContents.sponsor.text
        );
        
        const sponsorResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: sponsorEncodedEmail })
        });
        
        if (!sponsorResponse.ok) {
          const errorData = await sponsorResponse.json();
          console.error("Error sending to sponsor:", errorData);
          console.warn("Failed to send thank you email to sponsor, but school was notified");
        } else {
          console.log("Sponsor thank you email sent successfully");
        }

        setSubmitStatus({
          show: true,
          success: true,
          message: `Thank you for your generous heart! A confirmation email has been sent to ${formData.email}. Our team will contact you within 24-48 hours.`
        });

        // Reset form
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
          message: error.message || "Error sending inquiry. Please try again or call us at +254 722 631 433."
        });
      } finally {
        setSubmitting(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    },
    onError: (errorResponse) => {
      console.error('Login Failed:', errorResponse);
      let errorMessage = "Google sign-in failed. ";
      
      if (errorResponse?.error === 'popup_blocked_by_browser') {
        errorMessage += "Please allow popups for this site.";
      } else if (errorResponse?.error === 'access_denied') {
        errorMessage += "You denied access to your account.";
      } else {
        errorMessage += "Please try again.";
      }
      
      setSubmitStatus({
        show: true,
        success: false,
        message: errorMessage
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
      <section className="sponsor-hero">
        <Container>
          <h1>Change a Life. Build a Future.</h1>
          <p>
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
          <Row className="mb-4 g-4" role="list" aria-label="Sponsorship options">
            {sponsorCards.map((card, index) => (
              <SponsorCard 
                key={index} 
                icon={card.icon} 
                title={card.title} 
                description={card.description} 
              />
            ))}
          </Row>

          {/* Statistics Section */}
          <div className="sponsor-stats">
            <h2 className="visually-hidden">Sponsorship Impact Statistics</h2>
            <Row className="justify-content-center g-3" role="list" aria-label="Impact statistics">
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
              <div className="sponsor-form-container">
                <h2 className="sponsor-form-title">Partner With Us Today</h2>

                <form onSubmit={handleSubmit} noValidate aria-label="Sponsorship inquiry form">
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
                  <div className="sponsor-form-group">
                    <label htmlFor="phone" className="sponsor-form-label">
                      Phone Number
                    </label>
                    <PhoneInput
                      id="phone"
                      international
                      defaultCountry="KE"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="712345678"
                      className="sponsor-phone-input"
                      aria-invalid={phoneError ? "true" : "false"}
                      aria-describedby={phoneError ? "phone-error" : "phone-help"}
                    />
                    {phoneError && (
                      <div id="phone-error" className="sponsor-error-message" role="alert">{phoneError}</div>
                    )}
                    <div id="phone-help" className="sponsor-helper-text">
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
                  <div className="sponsor-form-group">
                    <label className="sponsor-checkbox">
                      <input
                        type="checkbox"
                        name="agreeToTerms"
                        checked={formData.agreeToTerms}
                        onChange={handleChange}
                        required
                        aria-required="true"
                      />
                      <span>
                        I agree to the{' '}
                        <Link to="/privacy-policy" target="_blank" className="text-navy text-decoration-underline">
                          Privacy Policy
                        </Link>
                        {' '}and{' '}
                        <Link to="/terms-of-service" target="_blank" className="text-navy text-decoration-underline">
                          Terms of Service
                        </Link>
                        <span className="visually-hidden"> (required)</span>
                      </span>
                    </label>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="sponsor-submit-btn"
                      aria-label={submitting ? "Sending your inquiry" : "Become a sponsor or donate"}
                    >
                      {submitting ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          <span>Sending...</span>
                          <span className="visually-hidden">Please wait while we send your inquiry</span>
                        </>
                      ) : (
                        'Become a Sponsor / Donate'
                      )}
                    </button>
                  </div>

                  <p className="text-center text-muted small mt-3 mb-0">
                    <i className="fas fa-lock me-1" aria-hidden="true"></i>
                    You'll sign in with Google to verify your identity and receive a thank you email
                  </p>
                </form>
              </div>
            </Col>
          </Row>

          {/* Testimonial */}
          <Row className="mb-4">
            <Col lg={10} className="mx-auto">
              <div className="sponsor-testimonial" role="complementary" aria-label="Sponsor testimonial">
                <div className="sponsor-testimonial-quote" aria-hidden="true">"</div>
                <p className="sponsor-testimonial-text">
                  "Sponsoring a child at Kitale Progressive School has been one of the most rewarding experiences of my life. Seeing the joy and hope in their eyes is priceless."
                </p>
                <div className="sponsor-testimonial-author">James Mwangi</div>
                <div className="sponsor-testimonial-title">Sponsor since 2022</div>
              </div>
            </Col>
          </Row>

          {/* Closing */}
          <div className="text-center">
            <h4 className="fw-bold mb-2" style={{ color: '#132f66', fontSize: '1.1rem' }}>
              Together, we can nurture dreams and transform generations.
            </h4>
            <p style={{ color: '#4a5568', marginBottom: '1rem' }}>
              Thank you for choosing to invest in education and hope.
            </p>
            <div>
              <Link to="/privacy-policy" className="text-muted me-2" style={{ fontSize: '0.9rem' }}>Privacy Policy</Link>
              <span className="text-muted" aria-hidden="true">|</span>
              <Link to="/terms-of-service" className="text-muted ms-2" style={{ fontSize: '0.9rem' }}>Terms of Service</Link>
            </div>
          </div>
        </Container>
      </section>

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>
    </>
  );
}

export default memo(Sponsor);