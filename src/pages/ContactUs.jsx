import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import contactService from '../services/contactService';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: 'General inquiries',
    message: '',
    agreed: false,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email || !formData.message) {
      toast.error('Please complete all required fields.');
      return;
    }
    if (!formData.agreed) {
      toast.error('Please agree to the Privacy Policy and Terms & Conditions.');
      return;
    }

    setLoading(true);
    try {
      const res = await contactService.sendMessage({
        fullName: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        subject: formData.subject,
        message: formData.message,
      });

      toast.success(res?.message || 'Your message has been sent successfully!');
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        subject: 'General inquiries',
        message: '',
        agreed: false,
      });
    } catch (err) {
      toast.error(
        err?.response?.data?.message || 'Failed to submit contact message. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-us-page" style={{ minHeight: '88vh' }}>
      {/* Header Banner (Image 3 Dark Flag/Parliament Background) */}
      <div
        className="py-5 text-white position-relative"
        style={{
          background: 'linear-gradient(135deg, #07152b 0%, #0d274c 100%)',
          borderBottom: '4px solid #16a34a',
        }}
      >
        <div className="container py-3">
          <div className="row align-items-center">
            <div className="col-lg-8">
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-2 small fw-semibold">
                  <li className="breadcrumb-item">
                    <Link to="/" className="text-decoration-none text-white-50">
                      Home
                    </Link>
                  </li>
                  <li className="breadcrumb-item active text-white" aria-current="page">
                    Contact Us
                  </li>
                </ol>
              </nav>
              <h1 className="brand-font fw-bold mb-2" style={{ fontSize: '2.5rem' }}>
                Contact <span style={{ color: '#16a34a' }}>Us</span>
              </h1>
              <p className="text-white-50 mb-0" style={{ maxWidth: '640px', lineHeight: '1.6' }}>
                We are here to help you. Reach out to us for any queries, suggestions or support regarding government schemes.
              </p>
            </div>
            <div className="col-lg-4 d-none d-lg-flex justify-content-end gap-3 text-white-50 opacity-25">
              <i className="bi bi-headset" style={{ fontSize: '3.5rem' }}></i>
              <i className="bi bi-envelope-check" style={{ fontSize: '3.5rem' }}></i>
              <i className="bi bi-geo-alt" style={{ fontSize: '3.5rem' }}></i>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Column Content Layout (Image 3) */}
      <div className="container py-5">
        <div className="row g-4">
          {/* Left Card: Get in Touch */}
          <div className="col-lg-4 col-md-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
              <div>
                <h5 className="brand-font fw-bold mb-2 text-dark">Get in Touch</h5>
                <p className="text-muted small mb-4">
                  We are always happy to assist you with any questions or concerns.
                </p>

                <div className="d-flex flex-column gap-4 mb-4">
                  {/* Phone */}
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 section-tint-success"
                      style={{ width: '42px', height: '42px' }}
                    >
                      <i className="bi bi-telephone-fill fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Phone</strong>
                      <span className="small d-block text-dark">+91 12345 67890</span>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        Mon - Sat: 9:00 AM - 6:00 PM
                      </small>
                    </div>
                  </div>

                  {/* Email */}
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 section-tint-success"
                      style={{ width: '42px', height: '42px' }}
                    >
                      <i className="bi bi-envelope-fill fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Email</strong>
                      <span className="small d-block text-dark">support@smartscheme.gov.in</span>
                      <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        We reply within 24 hours
                      </small>
                    </div>
                  </div>

                  {/* Address */}
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 section-tint-success"
                      style={{ width: '42px', height: '42px' }}
                    >
                      <i className="bi bi-geo-alt-fill fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Address</strong>
                      <span className="small d-block text-muted">
                        GOVT. Scheme Portal<br />
                        New Delhi, India - 110001
                      </span>
                    </div>
                  </div>

                  {/* Helpline */}
                  <div className="d-flex align-items-start gap-3">
                    <div
                      className="rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 section-tint-success"
                      style={{ width: '42px', height: '42px' }}
                    >
                      <i className="bi bi-headset fs-5"></i>
                    </div>
                    <div>
                      <strong className="d-block small text-dark">Helpline</strong>
                      <span className="small d-block text-dark fw-bold">1800-123-4567</span>
                      <small className="text-success fw-semibold" style={{ fontSize: '0.75rem' }}>
                        Toll Free
                      </small>
                    </div>
                  </div>
                </div>
              </div>

              {/* Follow Us */}
              <div className="border-top pt-3">
                <strong className="small d-block mb-2 text-dark">Follow Us</strong>
                <div className="d-flex align-items-center gap-2">
                  <a
                    href="https://facebook.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{ width: '36px', height: '36px', backgroundColor: '#1877f2' }}
                    aria-label="Facebook"
                  >
                    <i className="bi bi-facebook"></i>
                  </a>
                  <a
                    href="https://twitter.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{ width: '36px', height: '36px', backgroundColor: '#000000' }}
                    aria-label="Twitter X"
                  >
                    <i className="bi bi-twitter-x"></i>
                  </a>
                  <a
                    href="https://instagram.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{ width: '36px', height: '36px', background: 'linear-gradient(45deg, #f09433, #e6683c, #dc2743, #cc2366, #bc1888)' }}
                    aria-label="Instagram"
                  >
                    <i className="bi bi-instagram"></i>
                  </a>
                  <a
                    href="https://youtube.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{ width: '36px', height: '36px', backgroundColor: '#ff0000' }}
                    aria-label="YouTube"
                  >
                    <i className="bi bi-youtube"></i>
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center text-white"
                    style={{ width: '36px', height: '36px', backgroundColor: '#0a66c2' }}
                    aria-label="LinkedIn"
                  >
                    <i className="bi bi-linkedin"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Card: Send Us a Message Form */}
          <div className="col-lg-4 col-md-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white">
              <h5 className="brand-font fw-bold mb-4 text-dark">Send Us a Message</h5>
              <form onSubmit={handleSubmit} className="d-flex flex-column h-100 justify-content-between">
                <div>
                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Full Name *</label>
                      <div className="position-relative">
                        <i className="bi bi-person position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                          type="text"
                          name="fullName"
                          className="form-control ps-5 py-2 border rounded-3 small shadow-none"
                          placeholder="Enter your full name"
                          value={formData.fullName}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Email Address *</label>
                      <div className="position-relative">
                        <i className="bi bi-envelope position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                          type="email"
                          name="email"
                          className="form-control ps-5 py-2 border rounded-3 small shadow-none"
                          placeholder="Enter your email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row g-3 mb-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Phone Number</label>
                      <div className="position-relative">
                        <i className="bi bi-telephone position-absolute top-50 start-0 translate-middle-y ms-3 text-muted"></i>
                        <input
                          type="text"
                          name="phone"
                          className="form-control ps-5 py-2 border rounded-3 small shadow-none"
                          placeholder="Enter your phone number"
                          value={formData.phone}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <label className="form-label small fw-semibold text-dark">Subject *</label>
                      <select
                        name="subject"
                        className="form-select py-2 px-3 border rounded-3 small shadow-none"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                      >
                        <option value="General inquiries">General inquiries</option>
                        <option value="Scheme related queries">Scheme related queries</option>
                        <option value="Technical support">Technical support</option>
                        <option value="Feedback & suggestions">Feedback & suggestions</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label small fw-semibold text-dark">Message *</label>
                    <textarea
                      name="message"
                      rows="4"
                      className="form-control p-3 border rounded-3 small shadow-none"
                      placeholder="Type your message here..."
                      value={formData.message}
                      onChange={handleChange}
                      required
                    ></textarea>
                  </div>
                </div>

                <div>
                  <div className="form-check mb-3">
                    <input
                      className="form-check-input shadow-none"
                      type="checkbox"
                      id="agreeCheck"
                      name="agreed"
                      checked={formData.agreed}
                      onChange={handleChange}
                    />
                    <label className="form-check-label small text-muted" htmlFor="agreeCheck">
                      I agree to the <Link to="/about#privacy" className="text-success text-decoration-none">Privacy Policy</Link> and <Link to="/about#terms" className="text-success text-decoration-none">Terms & Conditions</Link>
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="btn w-100 py-2 rounded-3 text-white fw-semibold shadow-sm d-flex align-items-center justify-content-center gap-2"
                    style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm" role="status"></span>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Message</span>
                        <i className="bi bi-send-fill"></i>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Right Card: Map & Support Info */}
          <div className="col-lg-4 col-md-12">
            <div className="card border-0 shadow-sm rounded-4 p-4 h-100 bg-white d-flex flex-column justify-content-between">
              {/* Google Maps Visual Box */}
              <div
                className="rounded-4 p-4 mb-4 position-relative overflow-hidden border"
                style={{
                  background: 'linear-gradient(135deg, #e0f2fe 0%, #dcfce7 100%)',
                  minHeight: '220px',
                }}
              >
                <div className="card border-0 shadow-sm p-3 rounded-3 bg-white position-relative" style={{ zIndex: 2, maxWidth: '240px' }}>
                  <div className="d-flex align-items-center gap-2 mb-1">
                    <span className="badge bg-danger rounded-circle p-1">
                      <i className="bi bi-geo-alt-fill text-white"></i>
                    </span>
                    <strong className="small text-dark mb-0">GOVT. Scheme Portal</strong>
                  </div>
                  <small className="text-muted d-block mb-2" style={{ fontSize: '0.75rem' }}>
                    New Delhi, India - 110001
                  </small>
                  <a
                    href="https://maps.google.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-success small fw-semibold text-decoration-none d-flex align-items-center gap-1"
                  >
                    <span>View on Google Maps</span>
                    <i className="bi bi-box-arrow-up-right"></i>
                  </a>
                </div>
                {/* Decorative map icon in background */}
                <i
                  className="bi bi-map position-absolute bottom-0 end-0 m-3 text-success opacity-25"
                  style={{ fontSize: '6rem' }}
                ></i>
              </div>

              {/* We are here to help! */}
              <div>
                <h6 className="brand-font fw-bold mb-2 text-dark">We are here to help!</h6>
                <p className="text-muted small mb-4">
                  Have a question or need support? Our team is ready to help you with any information you need.
                </p>

                <div className="row g-2 small fw-semibold text-dark">
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>General inquiries</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Scheme related queries</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Technical support</span>
                  </div>
                  <div className="col-6 d-flex align-items-center gap-2">
                    <i className="bi bi-check-circle-fill text-success"></i>
                    <span>Feedback & suggestions</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
