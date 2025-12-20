import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { FaFacebook, FaTwitter, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-dark text-white py-4 mt-auto">
      <Container>
        <Row>
          <Col md={4}>
            <h4 className="mb-3">
              <span className="text-warning">Food</span>Express
            </h4>
            <p>
              Delivering happiness to your doorstep. Order delicious food from the best restaurants in town.
            </p>
            <div className="d-flex gap-3">
              <a href="#facebook" className="text-white"><FaFacebook size={20} /></a>
              <a href="#twitter" className="text-white"><FaTwitter size={20} /></a>
              <a href="#instagram" className="text-white"><FaInstagram size={20} /></a>
            </div>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="/" className="text-white text-decoration-none">Home</a></li>
              <li className="mb-2"><a href="/menu" className="text-white text-decoration-none">Menu</a></li>
              <li className="mb-2"><a href="/cart" className="text-white text-decoration-none">Cart</a></li>
            </ul>
          </Col>
          
          <Col md={4}>
            <h5 className="mb-3">Contact Us</h5>
            <ul className="list-unstyled">
              <li className="mb-2">
                <FaMapMarkerAlt className="me-2 text-warning" />
                123 Food Street, City
              </li>
              <li className="mb-2">
                <FaPhone className="me-2 text-warning" />
                (123) 456-7890
              </li>
              <li className="mb-2">
                <FaEnvelope className="me-2 text-warning" />
                info@foodexpress.com
              </li>
            </ul>
          </Col>
        </Row>
        
        <hr className="bg-light my-3" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} FoodExpress. All rights reserved.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;