import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-premium mt-auto">
      <Container>
        <Row className="gy-4">
          <Col lg={4}>
            <div className="footer-brand mb-3">
              <span className="text-accent">Food</span>Express
            </div>
            <p className="footer-desc mb-4">
              Bringing the best flavors from your local kitchen directly to your doorstep. Fast, fresh, and reliable.
            </p>
            <div className="d-flex gap-3 social-links">
              <a href="#facebook" className="social-link"><FaFacebook size={18} /></a>
              <a href="#twitter" className="social-link"><FaTwitter size={18} /></a>
              <a href="#instagram" className="social-link"><FaInstagram size={18} /></a>
            </div>
          </Col>
          
          <Col lg={2} md={4}>
            <h5 className="footer-title mb-3">Quick Links</h5>
            <ul className="list-unstyled footer-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/menu">Menu</Link></li>
              <li><Link to="/cart">My Cart</Link></li>
              <li><Link to="/checkout">Checkout</Link></li>
            </ul>
          </Col>

          <Col lg={2} md={4}>
            <h5 className="footer-title mb-3">Support</h5>
            <ul className="list-unstyled footer-links">
              <li><a href="#faq">Help Center</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#delivery">Delivery Info</a></li>
            </ul>
          </Col>
          
          <Col lg={4} md={4}>
            <h5 className="footer-title mb-3">Contact Us</h5>
            <ul className="list-unstyled footer-contact">
              <li className="d-flex align-items-center mb-3">
                <div className="contact-icon me-3"><FaMapMarkerAlt /></div>
                <span>123 Food Street, Downtown, NY 10001</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <div className="contact-icon me-3"><FaPhone /></div>
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="d-flex align-items-center mb-3">
                <div className="contact-icon me-3"><FaEnvelope /></div>
                <span>hello@foodexpress.com</span>
              </li>
            </ul>
          </Col>
        </Row>
        
        <div className="footer-bottom mt-5 pt-4">
          <Row className="align-items-center">
            <Col md={6}>
              <p className="copyright mb-0">
                &copy; {new Date().getFullYear()} FoodExpress. All rights reserved.
              </p>
            </Col>
            <Col md={6} className="text-md-end mt-3 mt-md-0">
              <div className="footer-badges">
                <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" alt="PayPal" height="20" className="me-3 opacity-50" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" height="15" className="me-3 opacity-50" />
                <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" height="20" className="opacity-50" />
              </div>
            </Col>
          </Row>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;