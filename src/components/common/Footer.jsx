import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import emblemLogo from '../../assets/logo/emblem.png';

const Footer = ({ onOpenEligibilityWizard }) => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }
    toast.success('Thank you for subscribing to GovSmart India updates!');
    setEmail('');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-dark text-white pt-5 position-relative" style={{ backgroundColor: '#07152b', borderTop: '2px solid rgba(255,255,255,0.05)' }}>
      <div className="container pb-5">
        <div className="row g-4">
          {/* Column 1: Brand & Social */}
          <div className="col-lg-3 col-md-6">
            <div className="d-flex align-items-center gap-2 mb-3">
              <img
                src={emblemLogo}
                alt="Government of India National Emblem"
                style={{ height: '38px', width: 'auto', objectFit: 'contain' }}
              />
              <div>
                <span className="brand-font fs-5 fw-bold text-white d-block lh-1">
                  GovSmart India
                </span>
                <small className="text-white-50 fw-semibold" style={{ fontSize: '0.72rem' }}>
                  Smart Government Schemes Portal
                </small>
              </div>
            </div>
            <p className="text-white-50 small mb-4" style={{ lineHeight: '1.6' }}>
              Your trusted companion in discovering government schemes and building a better tomorrow.
            </p>
            <div className="d-flex align-items-center gap-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', opacity: '0.85' }}
                aria-label="Facebook"
              >
                <i className="bi bi-facebook"></i>
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', opacity: '0.85' }}
                aria-label="Twitter X"
              >
                <i className="bi bi-twitter-x"></i>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', opacity: '0.85' }}
                aria-label="Instagram"
              >
                <i className="bi bi-instagram"></i>
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', opacity: '0.85' }}
                aria-label="YouTube"
              >
                <i className="bi bi-youtube"></i>
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-light rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: '36px', height: '36px', opacity: '0.85' }}
                aria-label="LinkedIn"
              >
                <i className="bi bi-linkedin"></i>
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-lg-2 col-md-6">
            <h6 className="brand-font fw-bold mb-3 text-white">Quick Links</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>
                <Link to="/" className="text-white-50 text-decoration-none hover-text-white">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/schemes" className="text-white-50 text-decoration-none hover-text-white">
                  Schemes
                </Link>
              </li>
              <li>
                <Link to="/eligibility-checker" className="text-white-50 text-decoration-none hover-text-white">
                  Eligibility Checker
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-white-50 text-decoration-none hover-text-white">
                  Categories
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-white-50 text-decoration-none hover-text-white">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-white-50 text-decoration-none hover-text-white">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div className="col-lg-2 col-md-6">
            <h6 className="brand-font fw-bold mb-3 text-white">Categories</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>
                <Link to="/schemes?category=Education" className="text-white-50 text-decoration-none hover-text-white">
                  Education
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Agriculture" className="text-white-50 text-decoration-none hover-text-white">
                  Agriculture
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Women" className="text-white-50 text-decoration-none hover-text-white">
                  Women
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Health" className="text-white-50 text-decoration-none hover-text-white">
                  Health
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Employment" className="text-white-50 text-decoration-none hover-text-white">
                  Employment
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Business" className="text-white-50 text-decoration-none hover-text-white">
                  Business
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Senior+Citizen" className="text-white-50 text-decoration-none hover-text-white">
                  Senior Citizen
                </Link>
              </li>
              <li>
                <Link to="/schemes?category=Divyangjan" className="text-white-50 text-decoration-none hover-text-white">
                  Divyangjan
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Support */}
          <div className="col-lg-2 col-md-6">
            <h6 className="brand-font fw-bold mb-3 text-white">Support</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-0 small">
              <li>
                <Link to="/contact" className="text-white-50 text-decoration-none hover-text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/about#faqs" className="text-white-50 text-decoration-none hover-text-white">
                  FAQs
                </Link>
              </li>
              <li>
                <Link to="/about#privacy" className="text-white-50 text-decoration-none hover-text-white">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/about#terms" className="text-white-50 text-decoration-none hover-text-white">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link to="/about#disclaimer" className="text-white-50 text-decoration-none hover-text-white">
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 5: Contact Us & Column 6: Newsletter */}
          <div className="col-lg-3 col-md-12">
            <h6 className="brand-font fw-bold mb-3 text-white">Contact Us</h6>
            <ul className="list-unstyled d-flex flex-column gap-2 mb-4 small text-white-50">
              <li className="d-flex align-items-start gap-2">
                <i className="bi bi-geo-alt text-success mt-1"></i>
                <span>GOVT. Scheme Portal, New Delhi, India - 110001</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-telephone text-success"></i>
                <span>+91 1234567890</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-envelope text-success"></i>
                <span>support@smartscheme.gov.in</span>
              </li>
              <li className="d-flex align-items-center gap-2">
                <i className="bi bi-clock text-success"></i>
                <span>Mon - Sat: 9:00 AM - 6:00 PM</span>
              </li>
            </ul>

            <h6 className="brand-font fw-bold mb-2 text-white">Newsletter</h6>
            <p className="text-white-50 small mb-2">
              Subscribe to get the latest updates on new schemes and important deadlines.
            </p>
            <form onSubmit={handleSubscribe} className="d-flex gap-2">
              <input
                type="email"
                className="form-control form-control-sm bg-white text-dark border-0 rounded-2"
                placeholder="Enter email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button
                type="submit"
                className="btn btn-sm btn-success px-3 fw-semibold rounded-2"
                style={{ backgroundColor: '#16a34a', borderColor: '#16a34a' }}
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Bottom Bar & Copyright */}
      <div
        className="py-3 px-3 border-top"
        style={{ borderColor: 'rgba(255,255,255,0.08) !important', backgroundColor: 'rgba(0,0,0,0.25)' }}
      >
        <div className="container d-flex flex-column flex-md-row align-items-center justify-content-between gap-2 small text-white-50">
          <div>
            © 2026 GovSmart India. All rights reserved.
          </div>
          <div className="d-flex align-items-center gap-1">
            Made with <i className="bi bi-heart-fill text-danger"></i> for Citizens of India
          </div>
        </div>
      </div>

      {/* Floating Scroll to Top Arrow Button */}
      <button
        type="button"
        onClick={scrollToTop}
        className="btn btn-success position-fixed bottom-0 end-0 m-4 rounded-3 shadow-lg d-flex align-items-center justify-content-center"
        style={{ width: '42px', height: '42px', zIndex: 1050, backgroundColor: '#16a34a', borderColor: '#16a34a' }}
        title="Scroll to top"
        aria-label="Scroll to top"
      >
        <i className="bi bi-chevron-up fs-5 text-white"></i>
      </button>
    </footer>
  );
};

export default Footer;
