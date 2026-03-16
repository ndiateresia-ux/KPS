import { Helmet } from "react-helmet-async";
import { Container, Row, Col, Form, Button, Card, Alert } from "react-bootstrap";
import { useState, useEffect, useCallback, memo, lazy, Suspense } from "react";
import { Link } from "react-router-dom";
import { useGoogleLogin } from '@react-oauth/google';
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import parsePhoneNumber from 'libphonenumber-js';

// Lazy load non-critical components
const GetInTouch = lazy(() => import("../components/GetInTouch"));

// Lazy load jspdf only when needed
const loadPDFLibrary = () => import("jspdf");
const loadAutoTable = async () => {
  const { default: jsPDF } = await import("jspdf");
  await import("jspdf-autotable");
  return jsPDF;
};

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

// Helper function to convert image to base64
const getImageBase64 = (imagePath) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/jpeg');
      resolve(dataURL);
    };
    img.onerror = reject;
    img.src = imagePath;
  });
};

// Memoized form input component with enhanced accessibility
const FormInput = memo(({ 
  label, 
  type = "text", 
  name, 
  value, 
  onChange, 
  placeholder, 
  required = false,
  feedback,
  as,
  options,
  className = "form-control-custom",
  describedBy,
  autoComplete
}) => {
  const id = `input-${name}`;
  const errorId = `${id}-error`;
  const descriptionId = describedBy || (required ? errorId : undefined);
  
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label className="fw-bold small">
        {label} {required && <span className="text-danger" aria-hidden="true">*</span>}
        {required && <span className="visually-hidden"> (required)</span>}
      </Form.Label>
      {as === 'select' ? (
        <Form.Select 
          required={required}
          name={name}
          value={value}
          onChange={onChange}
          className={className}
          aria-invalid={required && !value ? "true" : "false"}
          aria-describedby={descriptionId}
          autoComplete={autoComplete}
        >
          <option value="">Select</option>
          {options?.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </Form.Select>
      ) : (
        <Form.Control 
          as={as}
          type={type}
          required={required}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={className}
          rows={as === 'textarea' ? 3 : undefined}
          aria-invalid={required && !value ? "true" : "false"}
          aria-describedby={descriptionId}
          autoComplete={autoComplete}
        />
      )}
      {required && (
        <Form.Control.Feedback type="invalid" id={errorId} role="alert">
          {feedback || `Please enter ${label.toLowerCase()}`}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

FormInput.displayName = 'FormInput';

// Enhanced phone input component
const PhoneInputField = memo(({ phone, onChange, error, validated }) => {
  const id = "phone";
  const errorId = `${id}-error`;
  const helpId = `${id}-help`;
  
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label className="fw-bold small">
        Phone Number <span className="text-danger" aria-hidden="true">*</span>
        <span className="visually-hidden"> (required)</span>
      </Form.Label>
      <PhoneInput
        international
        defaultCountry="KE"
        value={phone}
        onChange={onChange}
        placeholder="712345678"
        className={`form-control-custom-phone ${validated && (!phone || error) ? 'is-invalid' : ''}`}
        limitMaxLength={true}
        aria-invalid={validated && (!phone || error) ? "true" : "false"}
        aria-describedby={`${errorId} ${helpId}`}
        aria-required="true"
      />
      {validated && !phone && (
        <Form.Control.Feedback type="invalid" id={errorId} style={{ display: 'block' }} role="alert">
          Phone number is required.
        </Form.Control.Feedback>
      )}
      {error && (
        <Form.Control.Feedback type="invalid" id={errorId} style={{ display: 'block' }} role="alert">
          {error}
        </Form.Control.Feedback>
      )}
      <Form.Text id={helpId} className="text-muted small d-block">
        Enter 9 digits after country code (e.g., 712345678)
      </Form.Text>
    </Form.Group>
  );
});

PhoneInputField.displayName = 'PhoneInputField';

// Enhanced status alert
const StatusAlert = memo(({ show, success, message, onClose }) => {
  if (!show) return null;
  
  return (
    <Alert 
      variant={success ? "success" : "danger"} 
      dismissible 
      onClose={onClose}
      className="mb-4 fade-in"
      role="alert"
      aria-live="polite"
    >
      <div className="d-flex">
        <i className={`fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'} me-3 mt-1`} aria-hidden="true"></i>
        <div>{message}</div>
      </div>
    </Alert>
  );
});

StatusAlert.displayName = 'StatusAlert';

// Initial form state
const INITIAL_FORM_STATE = {
  parentName: "",
  email: "",
  phone: "",
  address: "",
  relationship: "",
  childName: "",
  dateOfBirth: "",
  gender: "",
  nationality: "",
  otherNationality: "",
  previousSchool: "",
  gradeApplying: "",
  stayStatus: "",
  hasAllergies: false,
  medicalConditions: "",
  agreeToTerms: false
};

function Apply() {
  const [formData, setFormData] = useState(INITIAL_FORM_STATE);
  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [validated, setValidated] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [applicationCounter, setApplicationCounter] = useState(1);
  const [submitStatus, setSubmitStatus] = useState({
    show: false,
    success: false,
    message: ""
  });
  const [logoBase64, setLogoBase64] = useState(null);

  // Get environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_GMAIL_CLIENT_ID;
  const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_GMAIL_API_KEY;
  const ADMISSIONS_EMAIL = import.meta.env.VITE_ADMISSIONS_EMAIL || 'ndiateresia@gmail.com';
  const GMAIL_SCOPES = import.meta.env.VITE_GMAIL_SCOPES || 'https://www.googleapis.com/auth/gmail.send';
  const SITE_URL = import.meta.env.VITE_SITE_URL || 'http://localhost:5173';

  // Load logo on component mount
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoPath = '/images/optimized/logo.jpg';
        const base64 = await getImageBase64(logoPath);
        setLogoBase64(base64);
      } catch (error) {
        console.warn('Could not load logo:', error);
      }
    };
    loadLogo();
  }, []);

  // Load the last used application number from localStorage on component mount
  useEffect(() => {
    try {
      const lastNumber = localStorage.getItem('lastApplicationNumber');
      setApplicationCounter(lastNumber ? parseInt(lastNumber) + 1 : 1);
    } catch (error) {
      console.warn('Could not access localStorage:', error);
      setApplicationCounter(1);
    }
  }, []);

  // Memoized handlers
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

  // Get stay status options based on grade
  const getStayStatusOptions = useCallback(() => {
    const { gradeApplying: grade } = formData;
    if (grade === "Playgroup") return [
      { value: "full-day", label: "Full Day" }, 
      { value: "half-day", label: "Half Day" }
    ];
    if (["PP1", "PP2"].includes(grade)) return [
      { value: "day", label: "Day Scholar" }
    ];
    if (grade?.startsWith("Grade")) return [
      { value: "day", label: "Day Scholar" }, 
      { value: "boarding", label: "Boarding" }
    ];
    return [];
  }, [formData.gradeApplying]);

  // Optimized PDF generation with lazy loading and logo
  const generatePDF = useCallback(async () => {
    const jsPDF = await loadAutoTable();
    const doc = new jsPDF();
    
    // Add logo if available
    let logoAdded = false;
    if (logoBase64) {
      try {
        // Remove the data:image/jpeg;base64, prefix
        const base64Data = logoBase64.replace(/^data:image\/\w+;base64,/, '');
        doc.addImage(base64Data, 'JPEG', 15, 10, 30, 30);
        logoAdded = true;
      } catch (error) {
        console.warn('Could not add logo to PDF:', error);
      }
    }
    
    // Adjust header position based on whether logo was added
    const titleY = logoAdded ? 25 : 20;
    const mottoY = logoAdded ? 33 : 28;
    const formY = logoAdded ? 45 : 40;
    const dateY = logoAdded ? 60 : 55;
    
    // School header
    doc.setFontSize(20);
    doc.setTextColor(19, 47, 102);
    doc.text("KITALE PROGRESSIVE SCHOOL", 105, titleY, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("In Pursuit of Excellence", 105, mottoY, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(19, 47, 102);
    doc.text("ADMISSION APPLICATION FORM", 105, formY, { align: "center" });
    
    // Format application number
    const formattedNumber = applicationCounter.toString().padStart(4, '0');
    const applicationId = `APP-${formattedNumber}`;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Application Date: ${new Date().toLocaleDateString()}`, 20, dateY);
    doc.text(`Application ID: ${applicationId}`, 150, dateY);
    
    let yPos = dateY + 15;
    
    // Format nationality
    const displayNationality = formData.nationality === "Other" ? 
      formData.otherNationality : formData.nationality;
    
    // Format phone
    let formattedPhone = formData.phone || "Not provided";
    try {
      if (formData.phone) {
        const phoneNumber = parsePhoneNumber(formData.phone);
        if (phoneNumber) formattedPhone = phoneNumber.formatInternational();
      }
    } catch (error) {
      // Use raw value if formatting fails
    }
    
    // Parent Information
    doc.setFontSize(14);
    doc.setTextColor(19, 47, 102);
    doc.setFont(undefined, 'bold');
    doc.text("PARENT/GUARDIAN INFORMATION", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont(undefined, 'normal');
    
    const parentData = [
      ["Full Name:", formData.parentName || "_______________"],
      ["Email:", formData.email || "_______________"],
      ["Phone:", formattedPhone],
      ["Address:", formData.address || "_______________"],
      ["Relationship:", formData.relationship || "_______________"]
    ];
    
    parentData.forEach(row => {
      doc.text(row[0], 25, yPos);
      doc.text(row[1], 70, yPos);
      yPos += 6;
    });
    
    yPos += 4;
    
    // Child Information
    doc.setFontSize(14);
    doc.setTextColor(19, 47, 102);
    doc.setFont(undefined, 'bold');
    doc.text("CHILD'S INFORMATION", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont(undefined, 'normal');
    
    const childData = [
      ["Full Name:", formData.childName || "_______________"],
      ["Date of Birth:", formData.dateOfBirth || "_______________"],
      ["Gender:", formData.gender || "_______________"],
      ["Nationality:", displayNationality || "_______________"],
      ["Previous School:", formData.previousSchool || "_______________"],
      ["Grade:", formData.gradeApplying || "_______________"],
      ["Stay Status:", formData.stayStatus?.replace('-', ' ') || "_______________"]
    ];
    
    childData.forEach(row => {
      doc.text(row[0], 25, yPos);
      doc.text(row[1], 70, yPos);
      yPos += 6;
    });
    
    yPos += 4;
    
    // Medical Information
    doc.setFontSize(14);
    doc.setTextColor(19, 47, 102);
    doc.setFont(undefined, 'bold');
    doc.text("MEDICAL INFORMATION", 20, yPos);
    yPos += 8;
    
    doc.setFontSize(10);
    doc.setTextColor(50, 50, 50);
    doc.setFont(undefined, 'normal');
    
    doc.text("Allergies:", 25, yPos);
    doc.text(formData.hasAllergies ? "Yes" : "No", 70, yPos);
    yPos += 6;
    
    doc.text("Medical Conditions:", 25, yPos);
    doc.text(formData.medicalConditions || "None", 70, yPos);
    
    // Add footer with school contact
    yPos = 260;
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text("Kitale Progressive School", 105, yPos, { align: "center" });
    doc.text("P.O. Box 1338, Kitale, Kenya | Tel: +254 722 631 433 | Email: progressivesch@gmail.com", 105, yPos + 5, { align: "center" });
    
    return {
      pdfBlob: doc.output('blob'),
      applicationId,
      applicationDate: new Date().toLocaleDateString()
    };
  }, [formData, applicationCounter, logoBase64]);

  // Create email with attachment function - FIXED with Unicode-safe encoding
  const createEmailWithAttachment = useCallback(async (to, from, subject, htmlContent, pdfBlob, filename) => {
    // Convert blob to base64
    const reader = new FileReader();
    const pdfBase64 = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(pdfBlob);
    });

    // Create boundary
    const boundary = 'boundary_' + Math.random().toString(36).substring(2);

    // Construct email with attachment - Remove emojis and special characters
    const cleanSubject = subject.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII chars from subject
    const cleanHtmlContent = htmlContent.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII from HTML if needed
    
    const emailParts = [
      `MIME-Version: 1.0`,
      `To: ${to}`,
      `From: ${from}`,
      `Subject: ${cleanSubject}`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      cleanHtmlContent,
      '',
      `--${boundary}`,
      'Content-Type: application/pdf; name="' + filename + '"',
      'Content-Transfer-Encoding: base64',
      'Content-Disposition: attachment; filename="' + filename + '"',
      '',
      pdfBase64,
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

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
    redirectUri: `${SITE_URL}/auth/callback`,
    onSuccess: async (tokenResponse) => {
      try {
        setSubmitting(true);
        
        console.log("Google login successful, generating PDF...");
        
        // Generate PDF
        const { pdfBlob, applicationId, applicationDate } = await generatePDF();
        
        // Format data for email
        const displayNationality = formData.nationality === "Other" ? 
          formData.otherNationality : formData.nationality;
        
        let formattedPhone = formData.phone || "Not provided";
        try {
          if (formData.phone) {
            const phoneNumber = parsePhoneNumber(formData.phone);
            if (phoneNumber) formattedPhone = phoneNumber.formatInternational();
          }
        } catch (error) {}
        
        // Format date of birth for display
        const formattedDOB = formData.dateOfBirth ? new Date(formData.dateOfBirth).toLocaleDateString('en-KE', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        }) : 'Not provided';
        
        // Create HTML email content for PARENT - WITHOUT EMOJIS
        const parentHtmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
            <div style="text-align: center; margin-bottom: 30px; padding: 20px; background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%); border-radius: 10px;">
              <h2 style="color: white; margin: 0; font-size: 24px;">Kitale Progressive School</h2>
              <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
            </div>
            
            <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
              <h3 style="color: #132f66; margin-top: 0;">Application Received Successfully!</h3>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333;">Dear <strong>${formData.parentName}</strong>,</p>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333;">Thank you for submitting an application to Kitale Progressive School. We are delighted that you are considering us for your child's education.</p>
              
              <div style="background-color: #f0f5fa; padding: 20px; border-radius: 8px; margin: 25px 0; border-left: 4px solid #132f66;">
                <p style="margin: 0 0 10px 0; font-weight: bold; color: #132f66;">Application Details:</p>
                <p style="margin: 5px 0;"><strong>Application ID:</strong> ${applicationId}</p>
                <p style="margin: 5px 0;"><strong>Date Submitted:</strong> ${applicationDate}</p>
                <p style="margin: 5px 0;"><strong>Student Name:</strong> ${formData.childName}</p>
                <p style="margin: 5px 0;"><strong>Grade Applied For:</strong> ${formData.gradeApplying}</p>
                <p style="margin: 5px 0;"><strong>Stay Status:</strong> ${formData.stayStatus?.replace('-', ' ') || 'Not specified'}</p>
              </div>
              
              <h4 style="color: #132f66; margin: 25px 0 15px 0;">Next Steps in Your Journey:</h4>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee; width: 40px; vertical-align: top;">
                    <span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">1</span>
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong style="color: #333;">Application Review</strong><br/>
                    <span style="color: #666;">Our admissions team will review your application within 2-3 business days.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">2</span>
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong style="color: #333;">Admissions Interview</strong><br/>
                    <span style="color: #666;">We'll contact you to schedule an interview with you and your child.</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <span style="background-color: #132f66; color: white; width: 24px; height: 24px; display: inline-block; border-radius: 50%; text-align: center; line-height: 24px; font-weight: bold;">3</span>
                  </td>
                  <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    <strong style="color: #333;">Acceptance Decision</strong><br/>
                    <span style="color: #666;">You'll receive our decision within one week after the interview.</span>
                  </td>
                </tr>
              </table>
              
              <div style="margin: 30px 0 20px 0; padding: 20px; background-color: #fff8e7; border-radius: 8px; border: 1px solid #cebd04;">
                <p style="margin: 0; color: #132f66;">
                  <strong>Important:</strong> A copy of your application form is attached to this email. 
                  Please save it for your records. You will need your Application ID (${applicationId}) for all future correspondence.
                </p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333;">If you have any questions before then, please don't hesitate to contact our admissions office:</p>
              
              <div style="margin: 20px 0; padding: 15px; background-color: #f5f5f5; border-radius: 8px;">
                <p style="margin: 5px 0;"><strong>Phone:</strong> +254 722 631 433</p>
                <p style="margin: 5px 0;"><strong>Email:</strong> progressicesch@gmail.com</p>
                <p style="margin: 5px 0;"><strong>Office Hours:</strong> Monday - Friday, 8:00 AM - 4:00 PM</p>
              </div>
              
              <p style="font-size: 16px; line-height: 1.6; color: #333; margin-top: 25px;">Warm regards,<br/>
              <strong style="color: #132f66;">The Admissions Team</strong><br/>
              Kitale Progressive School</p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 15px; color: #666; font-size: 12px;">
              <p style="margin: 5px 0;">Kitale Progressive School | P.O. Box 1338, Kitale, Kenya</p>
              <p style="margin: 5px 0;">© ${new Date().getFullYear()} Kitale Progressive School. All rights reserved.</p>
              <p style="margin: 5px 0;">This email was sent to confirm your application submission.</p>
            </div>
          </div>
        `;
        
        // Create HTML email content for ADMISSIONS OFFICE
        const admissionsHtmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #132f66;">
              <h2 style="color: #132f66; margin: 0;">Kitale Progressive School</h2>
              <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
            </div>
            <h3 style="color: #132f66;">New Admission Application Received</h3>
            
            <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Application ID:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${applicationId}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${applicationDate}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Student Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.childName}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Date of Birth:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formattedDOB}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Gender:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.gender || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Nationality:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${displayNationality || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Grade Applying:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.gradeApplying}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Stay Status:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.stayStatus?.replace('-', ' ') || 'Not specified'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Previous School:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.previousSchool || 'None'}</td></tr>
            </table>
            
            <h4 style="color: #132f66;">Parent/Guardian Information</h4>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.parentName}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.email}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formattedPhone}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Address:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.address || 'Not provided'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Relationship:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.relationship}</td></tr>
            </table>
            
            <h4 style="color: #132f66;">Medical Information</h4>
            <table style="width: 100%; border-collapse: collapse; margin: 10px 0;">
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Allergies:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.hasAllergies ? 'Yes' : 'No'}</td></tr>
              <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Medical Conditions:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${formData.medicalConditions || 'None'}</td></tr>
            </table>
            
            <p><strong>Complete application form is attached as PDF.</strong></p>
            <hr/>
            <p style="color: #666; font-size: 12px;">This application was submitted via the school website.</p>
          </div>
        `;
        
        // Create filename for the PDF
        const sanitizedName = formData.childName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');
        const filename = `Admission_${sanitizedName}_${applicationId}.pdf`;
        
        // SEND EMAIL TO PARENT FIRST
        console.log("Sending confirmation email to parent:", formData.email);
        
        const parentEncodedEmail = await createEmailWithAttachment(
          formData.email, // Send to parent's email
          formData.email, // From the parent's email (they're authenticated)
          `Application Received - ${formData.childName} (${applicationId}) - Kitale Progressive School`, // No emojis
          parentHtmlContent,
          pdfBlob,
          filename
        );
        
        const parentResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: parentEncodedEmail })
        });
        
        if (!parentResponse.ok) {
          const errorData = await parentResponse.json();
          console.error("Error sending to parent:", errorData);
          throw new Error("Failed to send confirmation email to parent");
        }
        
        console.log("Parent email sent successfully");
        
        // SEND EMAIL TO ADMISSIONS OFFICE
        console.log("Sending notification to admissions office:", ADMISSIONS_EMAIL);
        
        const admissionsEncodedEmail = await createEmailWithAttachment(
          ADMISSIONS_EMAIL, // Send to admissions office
          formData.email, // From the parent's email
          `NEW APPLICATION: ${formData.childName} - Grade ${formData.gradeApplying} (${applicationId})`,
          admissionsHtmlContent,
          pdfBlob,
          filename
        );
        
        const admissionsResponse = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${tokenResponse.access_token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ raw: admissionsEncodedEmail })
        });
        
        if (!admissionsResponse.ok) {
          const errorData = await admissionsResponse.json();
          console.error("Error sending to admissions:", errorData);
          // Don't throw error here - parent already got confirmation
          console.warn("Failed to send to admissions office, but parent email was sent");
        } else {
          console.log("Admissions office notification sent successfully");
        }
        
        // Update counter
        const newCounter = applicationCounter + 1;
        setApplicationCounter(newCounter);
        try {
          localStorage.setItem('lastApplicationNumber', newCounter.toString());
        } catch (error) {}
        
        setSubmitStatus({
          show: true,
          success: true,
          message: `Application ${applicationId} submitted successfully! A confirmation email with your application form has been sent to ${formData.email}.`
        });
        
        // Reset form after delay
        setTimeout(() => {
          setFormData(INITIAL_FORM_STATE);
          setPhone("");
          setPhoneError("");
          setValidated(false);
        }, 5000);
        
      } catch (error) {
        console.error("Submission error:", error);
        setSubmitStatus({
          show: true,
          success: false,
          message: error.message || "Error submitting application. Please try again."
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
    const form = e.currentTarget;
    
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    
    if (!formData.agreeToTerms) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Please agree to the terms and conditions."
      });
      return;
    }
    
    if (phoneError || !phone) {
      setSubmitStatus({
        show: true,
        success: false,
        message: phoneError || "Phone number is required."
      });
      return;
    }

    if (!GOOGLE_CLIENT_ID) {
      setSubmitStatus({
        show: true,
        success: false,
        message: "Google Client ID is missing. Please check your environment configuration."
      });
      return;
    }
    
    login();
  }, [formData.agreeToTerms, phoneError, phone, login, GOOGLE_CLIENT_ID]);

  const stayStatusOptions = getStayStatusOptions();

  // Grade options array
  const gradeOptions = [
    { value: "Playgroup", label: "Playgroup" },
    { value: "PP1", label: "PP1" },
    { value: "PP2", label: "PP2" },
    ...Array.from({ length: 9 }, (_, i) => ({
      value: `Grade ${i + 1}`,
      label: `Grade ${i + 1}`
    }))
  ];

  // Application journey steps data
  const journeySteps = [
    {
      icon: "fa-file-text",
      title: "1. Complete Application",
      description: "Fill out the online form with parent/guardian and student details. Ensure all information is accurate."
    },
    {
      icon: "fa-google",
      title: "2. Verify with Google",
      description: "Sign in with your Google account to verify your identity and securely submit the application."
    },
    {
      icon: "fa-envelope",
      title: "3. Receive Confirmation",
      description: "Get an instant email confirmation with your application ID and PDF copy for your records."
    },
    {
      icon: "fa-phone",
      title: "4. Admissions Interview",
      description: "Our admissions team will contact you within 3-5 business days to schedule an interview."
    }
  ];

  return (
    <>
      <Helmet>
        <title>Admissions Application | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Begin your child's journey at Kitale Progressive School. Complete our admissions application and track your progress through each step of the process." 
        />
      </Helmet>
      
      {/* Page Title - Updated to Admissions */}
      <section 
        className="page-title-section" 
        style={{ 
          background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
          paddingTop: '120px',
          paddingBottom: '60px',
          color: 'white',
          textAlign: 'center',
          width: '100%',
          minHeight: '200px',
          display: 'flex',
          alignItems: 'center'
        }}
        aria-labelledby="page-title"
      >
        <Container>
          <h1 id="page-title" className="display-5 fw-bold mb-3" style={{ color: 'white' }}>
            Admissions Application
          </h1>
          <p className="lead mb-0" style={{ 
            fontSize: 'clamp(1rem, 4vw, 1.2rem)', 
            maxWidth: '700px', 
            margin: '0 auto',
            color: 'rgba(255,255,255,0.95)'
          }}>
            Begin your child's journey with Kitale Progressive School
          </p>
        </Container>
      </section>

      {/* Application Journey Section */}
      <section className="journey-section py-5" aria-label="Application journey steps">
        <Container>
          <h2 className="section-header text-center mb-5" style={{ color: '#132f66' }}>
            Your Admissions Journey
          </h2>
          <p className="text-center mb-5" style={{ maxWidth: '800px', margin: '0 auto', fontSize: '1.1rem' }}>
            We've streamlined our admissions process to make it simple and transparent. 
            Follow these four easy steps to secure your child's place at Kitale Progressive School.
          </p>
          
          <Row className="g-4 justify-content-center">
            {journeySteps.map((step, index) => (
              <Col key={index} md={6} lg={3}>
                <div className="journey-step-card text-center p-4 h-100" 
                     style={{ 
                       background: 'white', 
                       borderRadius: '12px',
                       boxShadow: '0 8px 20px rgba(0,0,0,0.02), 0 2px 6px rgba(0,20,40,0.05)',
                       border: '1px solid #eef2f6',
                       transition: 'transform 0.2s ease'
                     }}>
                  <div className="step-icon mb-3" 
                       style={{ 
                         width: '70px', 
                         height: '70px', 
                         background: '#f0f5fa', 
                         borderRadius: '50%',
                         display: 'flex',
                         alignItems: 'center',
                         justifyContent: 'center',
                         margin: '0 auto 1.5rem',
                         color: '#132f66',
                         fontSize: '2rem'
                       }}>
                    <i className={`fas ${step.icon}`} aria-hidden="true"></i>
                  </div>
                  <h3 className="h5 fw-bold mb-3" style={{ color: '#132f66' }}>{step.title}</h3>
                  <p className="text-muted mb-0" style={{ fontSize: '0.95rem' }}>{step.description}</p>
                </div>
              </Col>
            ))}
          </Row>
          
          {/* Timeline indicator */}
          <div className="text-center mt-5 pt-3">
            <p className="text-muted">
              <i className="fas fa-clock me-2" aria-hidden="true"></i>
              Average completion time: 8-10 minutes
            </p>
          </div>
        </Container>
      </section>

      <section 
        className="apply-section section-padding bg-light-custom"
        aria-label="Application form section"
      >
        <Container>
          <Row className="justify-content-center">
            <Col lg={10}>
              <StatusAlert 
                show={submitStatus.show}
                success={submitStatus.success}
                message={submitStatus.message}
                onClose={handleDismissAlert}
              />

              <Card className="shadow-lg border-0">
                <Card.Body className="p-4 p-lg-5">
                  <h2 className="section-heading h4 mb-4">Complete Your Application</h2>
                  
                  <Form 
                    noValidate 
                    validated={validated} 
                    onSubmit={handleSubmit}
                    aria-label="Admission application form"
                  >
                    
                    {/* Parent Info */}
                    <h3 className="text-navy fw-bold h5 mb-3 pb-2 border-bottom">Parent/Guardian Information</h3>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <FormInput
                          label="Full Name"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          placeholder="James Vincent"
                           autocomplete="off"
                          required
                          feedback="Please enter parent/guardian name"
                          autoComplete="name"
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          label="Email Address"
                          type="email"
                          name="email"
                          autocomplete="off"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          required
                          feedback="Please enter a valid email"
                          autoComplete="email"
                        />
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col md={6}>
                        <PhoneInputField
                          phone={phone}
                          onChange={handlePhoneChange}
                          error={phoneError}
                          validated={validated}
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          label="Relationship to Child"
                          as="select"
                          name="relationship"
                           autocomplete="off"
                          value={formData.relationship}
                          onChange={handleChange}
                          required
                          options={[
                            { value: "Father", label: "Father" },
                            { value: "Mother", label: "Mother" },
                            { value: "Brother", label: "Brother" },
                            { value: "Sister", label: "Sister" },
                            { value: "Guardian", label: "Guardian" },
                            { value: "Grandparent", label: "Grandparent" },
                            { value: "Other", label: "Other" }
                          ]}
                          feedback="Please select relationship"
                          autoComplete="off"
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormInput
                          label="Address"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                           autocomplete="off"
                          placeholder="123 Street, Nairobi"
                          autoComplete="street-address"
                        />
                      </Col>
                    </Row>

                    {/* Child Info */}
                    <h3 className="text-navy fw-bold h5 mb-3 mt-4 pb-2 border-bottom">Child's Information</h3>
                    
                    <Row className="g-3">
                      <Col md={12}>
                        <FormInput
                          label="Full Name"
                          name="childName"
                          value={formData.childName}
                          onChange={handleChange}
                           autocomplete="off"
                          placeholder="Prince Vincent"
                          required
                          feedback="Please enter child's name"
                          autoComplete="off"
                        />
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col md={4}>
                        <FormInput
                          label="Date of Birth"
                          type="date"
                          name="dateOfBirth"
                           autocomplete="off"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          feedback="Please enter date of birth"
                          autoComplete="bday"
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          label="Gender"
                          as="select"
                          name="gender"
                           autocomplete="off"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" }
                          ]}
                          feedback="Please select gender"
                          autoComplete="off"
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          label="Nationality"
                          as="select"
                          name="nationality"
                           autocomplete="off"
                          value={formData.nationality}
                          onChange={handleChange}
                          options={[
                            { value: "Kenyan", label: "Kenyan" },
                            { value: "Ugandan", label: "Ugandan" },
                            { value: "Tanzanian", label: "Tanzanian" },
                            { value: "Rwandan", label: "Rwandan" },
                            { value: "South Sudanese", label: "South Sudanese" },
                            { value: "Other", label: "Other" }
                          ]}
                          autoComplete="country"
                        />
                      </Col>
                    </Row>

                    {formData.nationality === "Other" && (
                      <Row>
                        <Col md={4}>
                          <FormInput
                            label="Specify Nationality"
                            name="otherNationality"
                             autocomplete="off"
                            value={formData.otherNationality}
                            onChange={handleChange}
                            placeholder="Enter nationality"
                            autoComplete="off"
                          />
                        </Col>
                      </Row>
                    )}

                    <Row className="g-3">
                      <Col md={6}>
                        <FormInput
                          label="Previous School/Nursery"
                          name="previousSchool"
                          value={formData.previousSchool}
                          onChange={handleChange}
                           autocomplete="off"
                          placeholder="Enter previous school"
                          autoComplete="off"
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          label="Grade Applying For"
                          as="select"
                          name="gradeApplying"
                           autocomplete="off"
                          value={formData.gradeApplying}
                          onChange={handleChange}
                          required
                          options={gradeOptions}
                          feedback="Please select grade"
                          autoComplete="off"
                        />
                      </Col>
                    </Row>

                    {stayStatusOptions.length > 0 && (
                      <Row>
                        <Col md={6}>
                          <FormInput
                            label={`Stay Status ${formData.gradeApplying === "Playgroup" ? "(Full Day or Half Day)" : ""}`}
                            as="select"
                            name="stayStatus"
                             autocomplete="off"
                            value={formData.stayStatus}
                            onChange={handleChange}
                            required
                            options={stayStatusOptions}
                            feedback="Please select stay status"
                            autoComplete="off"
                          />
                        </Col>
                      </Row>
                    )}

                    {/* Medical Info */}
                    <h3 className="text-navy fw-bold h5 mb-3 mt-4 pb-2 border-bottom">Medical Information</h3>
                    
                    <Row className="mb-3">
                      <Col md={12}>
                      <div className="apply-form">
                        <Form.Check 
                          type="checkbox" 
                          name="hasAllergies" 
                          id="hasAllergies"
                          label={
                            <span>
                              Does the child have any allergies?
                              <span className="visually-hidden"> (Check if yes)</span>
                            </span>
                          } 
                          checked={formData.hasAllergies} 
                          onChange={handleChange}
                          className="mb-2"
                        />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12}>
                        <FormInput
                          label="Medical Conditions"
                          name="medicalConditions"
                          value={formData.medicalConditions}
                          onChange={handleChange}
                          placeholder="E.g., Asthma, Diabetes"
                          autoComplete="off"
                        />
                      </Col>
                    </Row>

                    {/* Terms */}
                    <Row className="mb-4">
                      <Col md={12}>
                      <div className="apply-form">
                        <Form.Check 
                          required 
                          type="checkbox" 
                          name="agreeToTerms" 
                          id="agreeToTerms"
                          checked={formData.agreeToTerms} 
                          onChange={handleChange}
                          label={
                            <span className="small">
                              I confirm that the information provided is accurate and I agree to the{' '}
                              <Link to="/terms-of-service" target="_blank" className="text-navy">
                                Terms
                              </Link> and{' '}
                              <Link to="/privacy-policy" target="_blank" className="text-navy">
                                Privacy Policy
                              </Link>
                              <span className="visually-hidden"> (required)</span>
                            </span>
                          }
                          feedback="You must agree to the Terms and Privacy Policy"
                        />
                        </div>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12} className="text-center">
                        <Button 
                          type="submit" 
                          className="btn-navy px-4 py-2"
                          disabled={submitting}
                          style={{ minWidth: '200px' }}
                          aria-label={submitting ? "Submitting application" : "Submit application"}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                              <span>Submitting...</span>
                              <span className="visually-hidden">Please wait while we submit your application</span>
                            </>
                          ) : (
                            'Submit Application'
                          )}
                        </Button>
                      </Col>
                    </Row>

                    <Row className="mt-3">
                      <Col md={12}>
                        <p className="text-muted small text-center mb-0">
                          <i className="fas fa-lock me-1" aria-hidden="true"></i>
                          You'll sign in with Google to verify your identity and receive your confirmation email
                        </p>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      <Suspense fallback={null}>
        <GetInTouch />
      </Suspense>

      {/* Critical CSS inline with accessibility improvements */}
      <style dangerouslySetInnerHTML={{ __html: `
        .bg-gradient-navy {
          background: linear-gradient(135deg, #132f66 0%, #0a1f4d 100%);
          padding-top: 120px;
          padding-bottom: 60px;
        }
        @media (max-width: 768px) {
          .bg-gradient-navy { padding-top: 100px; padding-bottom: 40px; }
        }
        .form-control-custom, .form-control-custom-phone {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 0.6rem 1rem;
          transition: all 0.15s ease;
        }
        .form-control-custom:focus, .form-control-custom-phone:focus {
          border-color: #132f66;
          box-shadow: 0 0 0 0.2rem rgba(19,47,102,0.25);
          outline: 2px solid transparent;
        }
        .btn-navy {
          background-color: #132f66;
          border-color: #132f66;
          color: white;
          border-radius: 40px;
          font-weight: 600;
          transition: all 0.3s ease;
          min-height: 44px;
          min-width: 44px;
        }
        .btn-navy:hover:not(:disabled) {
          background-color: #0a1f4d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(19,47,102,0.3);
        }
        .btn-navy:focus-visible {
          outline: 3px solid #cebd04;
          outline-offset: 2px;
        }
        .journey-step-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 24px -8px rgba(0,35,70,0.15) !important;
        }
        .section-header {
          font-size: 2.2rem;
          font-weight: 600;
          color: #132f66;
        }
        .fade-in { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
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
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
          .spinner-border { animation: none; }
          .journey-step-card:hover { transform: none; }
        }
      `}} />
    </>
  );
}

export default memo(Apply);