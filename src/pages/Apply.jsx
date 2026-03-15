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

// Memoized form input component
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
  className = "form-control-custom"
}) => {
  const id = `input-${name}`;
  
  return (
    <Form.Group controlId={id} className="mb-3">
      <Form.Label className="fw-bold small">
        {label} {required && <span className="text-danger">*</span>}
      </Form.Label>
      {as === 'select' ? (
        <Form.Select 
          required={required}
          name={name}
          value={value}
          onChange={onChange}
          className={className}
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
        />
      )}
      {required && (
        <Form.Control.Feedback type="invalid">
          {feedback || `Please enter ${label.toLowerCase()}`}
        </Form.Control.Feedback>
      )}
    </Form.Group>
  );
});

FormInput.displayName = 'FormInput';

// Memoized phone input component
const PhoneInputField = memo(({ phone, onChange, error, validated }) => (
  <Form.Group controlId="phone" className="mb-3">
    <Form.Label className="fw-bold small">
      Phone Number <span className="text-danger">*</span>
    </Form.Label>
    <PhoneInput
      international
      defaultCountry="KE"
      value={phone}
      onChange={onChange}
      placeholder="712345678"
      className={`form-control-custom-phone ${validated && (!phone || error) ? 'is-invalid' : ''}`}
      limitMaxLength={true}
    />
    {validated && !phone && (
      <Form.Control.Feedback type="invalid" style={{ display: 'block' }}>
        Phone number is required.
      </Form.Control.Feedback>
    )}
    {error && (
      <Form.Text className="text-danger small">{error}</Form.Text>
    )}
    <Form.Text className="text-muted small d-block">
      Enter 9 digits after country code
    </Form.Text>
  </Form.Group>
));

PhoneInputField.displayName = 'PhoneInputField';

// Memoized status alert
const StatusAlert = memo(({ show, success, message, onClose }) => {
  if (!show) return null;
  
  return (
    <Alert 
      variant={success ? "success" : "danger"} 
      dismissible 
      onClose={onClose}
      className="mb-4 fade-in"
    >
      <div className="d-flex">
        <i className={`fas ${success ? 'fa-check-circle' : 'fa-exclamation-circle'} me-3 mt-1`}></i>
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

  // Get environment variables
  const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_GMAIL_CLIENT_ID;
  const ADMISSIONS_EMAIL = import.meta.env.VITE_ADMISSIONS_EMAIL || 'ndiateresia@gmail.com';
  const GMAIL_SCOPES = import.meta.env.VITE_GMAIL_SCOPES || 'https://www.googleapis.com/auth/gmail.send';

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

  // Optimized PDF generation with lazy loading
  const generatePDF = useCallback(async () => {
    const jsPDF = await loadAutoTable();
    const doc = new jsPDF();
    
    // School header
    doc.setFontSize(20);
    doc.setTextColor(19, 47, 102);
    doc.text("KITALE PROGRESSIVE SCHOOL", 105, 20, { align: "center" });
    
    doc.setFontSize(12);
    doc.setTextColor(100, 100, 100);
    doc.text("In Pursuit of Excellence", 105, 28, { align: "center" });
    
    doc.setFontSize(16);
    doc.setTextColor(19, 47, 102);
    doc.text("ADMISSION APPLICATION FORM", 105, 40, { align: "center" });
    
    // Format application number
    const formattedNumber = applicationCounter.toString().padStart(4, '0');
    const applicationId = `APP-${formattedNumber}`;
    
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Application Date: ${new Date().toLocaleDateString()}`, 20, 55);
    doc.text(`Application ID: ${applicationId}`, 150, 55);
    
    let yPos = 70;
    
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
    
    return {
      pdfBlob: doc.output('blob'),
      applicationId,
      applicationDate: new Date().toLocaleDateString()
    };
  }, [formData, applicationCounter]);

  // Create email with attachment function
  const createEmailWithAttachment = useCallback(async (to, from, subject, htmlContent, pdfBlob, filename) => {
    // Convert blob to base64
    const reader = new FileReader();
    const pdfBase64 = await new Promise((resolve) => {
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.readAsDataURL(pdfBlob);
    });

    // Create boundary
    const boundary = 'boundary_' + Math.random().toString(36).substring(2);

    // Construct email with attachment
    const emailParts = [
      `MIME-Version: 1.0`,
      `To: ${to}`,
      `From: ${from}`,
      `Subject: ${subject}`,
      `Content-Type: multipart/mixed; boundary="${boundary}"`,
      '',
      `--${boundary}`,
      'Content-Type: text/html; charset=UTF-8',
      'Content-Transfer-Encoding: 7bit',
      '',
      htmlContent,
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
    
    // Encode to base64url
    return btoa(emailContent)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  }, []);

  // Google Login configuration
  const login = useGoogleLogin({
    clientId: GOOGLE_CLIENT_ID,
    scope: GMAIL_SCOPES,
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
        
        // Create HTML email content
        const htmlContent = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 20px; border-bottom: 2px solid #132f66;">
              <h2 style="color: #132f66; margin: 0;">Kitale Progressive School</h2>
              <p style="color: #cebd04; margin: 5px 0 0;">In Pursuit of Excellence</p>
            </div>
            <h3 style="color: #132f66;">New Admission Application</h3>
            <p><strong>Application ID:</strong> ${applicationId}</p>
            <p><strong>Date:</strong> ${applicationDate}</p>
            <p><strong>Student:</strong> ${formData.childName}</p>
            <p><strong>Parent:</strong> ${formData.parentName}</p>
            <p><strong>Grade:</strong> ${formData.gradeApplying}</p>
            <p><strong>Stay Status:</strong> ${formData.stayStatus?.replace('-', ' ') || 'Not specified'}</p>
            <p><strong>Phone:</strong> ${formattedPhone}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <hr/>
            <p>Please find the complete application form attached as PDF.</p>
          </div>
        `;
        
        // Create email with attachment
        const filename = `Admission_${formData.childName.replace(/\s+/g, '_')}_${applicationId}.pdf`;
        
        const encodedEmail = await createEmailWithAttachment(
          ADMISSIONS_EMAIL,
          formData.email,
          `Admission Application - ${formData.childName} (${applicationId})`,
          htmlContent,
          pdfBlob,
          filename
        );
        
        console.log("Sending email via Gmail API...");
        
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
        
        // Update counter
        const newCounter = applicationCounter + 1;
        setApplicationCounter(newCounter);
        try {
          localStorage.setItem('lastApplicationNumber', newCounter.toString());
        } catch (error) {}
        
        setSubmitStatus({
          show: true,
          success: true,
          message: `Application ${applicationId} submitted successfully! We'll contact you soon.`
        });
        
        // Reset form after delay
        setTimeout(() => {
          setFormData(INITIAL_FORM_STATE);
          setPhone("");
          setPhoneError("");
          setValidated(false);
        }, 3000);
        
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
        message: "Google Client ID is missing. Please check configuration."
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

  return (
    <>
      <Helmet>
        <title>Application Form | Kitale Progressive School</title>
        <meta 
          name="description" 
          content="Apply for admission to Kitale Progressive School. Complete the application form to begin your child's educational journey with us." 
        />
      </Helmet>
      
      {/* Page Title */}
      <section className="page-title-section" style={{ 
        background: 'linear-gradient(135deg, #132f66 0%, #0a1f4d 100%)',
        paddingTop: '120px',
        paddingBottom: '60px',
        color: 'white',
        textAlign: 'center',
        width: '100%',
        minHeight: '200px',
        display: 'flex',
        alignItems: 'center'
      }}>
        <Container>
          <h1 className="display-5 fw-bold mb-3" style={{ color: 'white' }}>
            Application Form
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

      <section className="apply-section section-padding bg-light-custom">
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
                  <h2 className="section-heading h4 mb-4">Application Form</h2>
                  
                  <Form noValidate validated={validated} onSubmit={handleSubmit}>
                    
                    {/* Parent Info */}
                    <h4 className="text-navy fw-bold h5 mb-3 pb-2 border-bottom">Parent/Guardian Information</h4>
                    
                    <Row className="g-3">
                      <Col md={6}>
                        <FormInput
                          label="Full Name"
                          name="parentName"
                          value={formData.parentName}
                          onChange={handleChange}
                          placeholder="James Vincent"
                          required
                          feedback="Please enter parent/guardian name"
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          label="Email Address"
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="example@email.com"
                          required
                          feedback="Please enter a valid email"
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
                          value={formData.relationship}
                          onChange={handleChange}
                          required
                          options={[
                            "Father", "Mother", "Brother", "Sister", 
                            "Guardian", "Grandparent", "Other"
                          ].map(v => ({ value: v, label: v }))}
                          feedback="Please select relationship"
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
                          placeholder="123 Street, Nairobi"
                        />
                      </Col>
                    </Row>

                    {/* Child Info */}
                    <h4 className="text-navy fw-bold h5 mb-3 mt-4 pb-2 border-bottom">Child's Information</h4>
                    
                    <Row className="g-3">
                      <Col md={12}>
                        <FormInput
                          label="Full Name"
                          name="childName"
                          value={formData.childName}
                          onChange={handleChange}
                          placeholder="Prince Vincent"
                          required
                          feedback="Please enter child's name"
                        />
                      </Col>
                    </Row>

                    <Row className="g-3">
                      <Col md={4}>
                        <FormInput
                          label="Date of Birth"
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          required
                          feedback="Please enter date of birth"
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          label="Gender"
                          as="select"
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          required
                          options={[
                            { value: "Male", label: "Male" },
                            { value: "Female", label: "Female" }
                          ]}
                          feedback="Please select gender"
                        />
                      </Col>
                      <Col md={4}>
                        <FormInput
                          label="Nationality"
                          as="select"
                          name="nationality"
                          value={formData.nationality}
                          onChange={handleChange}
                          options={[
                            "Kenyan", "Ugandan", "Tanzanian", 
                            "Rwandan", "South Sudanese", "Other"
                          ].map(v => ({ value: v, label: v }))}
                        />
                      </Col>
                    </Row>

                    {formData.nationality === "Other" && (
                      <Row>
                        <Col md={4}>
                          <FormInput
                            label="Specify Nationality"
                            name="otherNationality"
                            value={formData.otherNationality}
                            onChange={handleChange}
                            placeholder="Enter nationality"
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
                          placeholder="Enter previous school"
                        />
                      </Col>
                      <Col md={6}>
                        <FormInput
                          label="Grade Applying For"
                          as="select"
                          name="gradeApplying"
                          value={formData.gradeApplying}
                          onChange={handleChange}
                          required
                          options={gradeOptions}
                          feedback="Please select grade"
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
                            value={formData.stayStatus}
                            onChange={handleChange}
                            required
                            options={stayStatusOptions}
                            feedback="Please select stay status"
                          />
                        </Col>
                      </Row>
                    )}

                    {/* Medical Info */}
                    <h4 className="text-navy fw-bold h5 mb-3 mt-4 pb-2 border-bottom">Medical Information</h4>
                    
                    <Row className="mb-3">
                      <Col md={12}>
                        <Form.Check 
                          type="checkbox" 
                          name="hasAllergies" 
                          label="Does the child have any allergies?" 
                          checked={formData.hasAllergies} 
                          onChange={handleChange}
                          className="mb-2"
                        />
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
                        />
                      </Col>
                    </Row>

                    {/* Terms */}
                    <Row className="mb-4">
                      <Col md={12}>
                        <Form.Check 
                          required 
                          type="checkbox" 
                          name="agreeToTerms" 
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
                            </span>
                          }
                          feedback="You must agree to the Terms and Privacy Policy"
                        />
                      </Col>
                    </Row>

                    <Row>
                      <Col md={12} className="text-center">
                        <Button 
                          type="submit" 
                          className="btn-navy px-4 py-2"
                          disabled={submitting}
                          style={{ minWidth: '200px' }}
                        >
                          {submitting ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Submitting...
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
                          <i className="fas fa-lock me-1"></i>
                          You'll sign in with Google to verify your identity
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

      {/* Critical CSS inline */}
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
        }
        .btn-navy {
          background-color: #132f66;
          border-color: #132f66;
          color: white;
          border-radius: 40px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        .btn-navy:hover:not(:disabled) {
          background-color: #0a1f4d;
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(19,47,102,0.3);
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
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
          .spinner-border { animation: none; }
        }
      `}} />
    </>
  );
}

export default memo(Apply);