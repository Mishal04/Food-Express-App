import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Hero from '../components/Home/Hero';
import { FaUtensils, FaCartPlus, FaCheckCircle, FaStar } from 'react-icons/fa';

const HomePage = () => {
  return (
    <div className="home-page">
      <Hero />
      
      {/* Features Section */}
      <Container className="py-5 my-5">
        <div className="text-center mb-5 animate-fade-in">
          <p className="text-accent fw-bold mb-2 uppercase" style={{ letterSpacing: '2px', fontSize: '0.8rem' }}>HOW IT WORKS</p>
          <h2 className="fw-900 mb-2">Order food in 3 simple steps</h2>
          <p className="text-muted">Delicious meals from your local favorites, delivered fast.</p>
        </div>
        
        <Row className="g-4">
          <Col md={4} className="animate-fade-in-delay">
            <div className="feature-card h-100 p-5 text-center">
              <div className="feature-icon-box mb-4">
                <FaUtensils size={28} />
              </div>
              <h4 className="fw-bold mb-3">Browse Menu</h4>
              <p className="text-secondary">Explore our wide selection of mouth-watering dishes from top-rated restaurants.</p>
            </div>
          </Col>
          
          <Col md={4} className="animate-fade-in-delay">
            <div className="feature-card h-100 p-5 text-center">
              <div className="feature-icon-box mb-4">
                <FaCartPlus size={28} />
              </div>
              <h4 className="fw-bold mb-3">Add to Cart</h4>
              <p className="text-secondary">Select your favorite items and customize them just the way you like.</p>
            </div>
          </Col>
          
          <Col md={4} className="animate-fade-in-delay">
            <div className="feature-card h-100 p-5 text-center">
              <div className="feature-icon-box mb-4">
                <FaCheckCircle size={28} />
              </div>
              <h4 className="fw-bold mb-3">Easy Checkout</h4>
              <p className="text-secondary">Securely pay and track your order in real-time until it reaches your door.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Testimonial/Trust Section */}
      <div className="bg-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <div className="p-4">
                <h2 className="fw-900 mb-4">Why choose FoodExpress?</h2>
                <div className="d-flex mb-4">
                  <div className="me-3 text-accent"><FaStar size={24} /></div>
                  <div>
                    <h5 className="fw-bold">Fastest Delivery</h5>
                    <p className="text-muted">We pride ourselves on getting your food to you in under 30 minutes.</p>
                  </div>
                </div>
                <div className="d-flex mb-4">
                  <div className="me-3 text-accent"><FaStar size={24} /></div>
                  <div>
                    <h5 className="fw-bold">Top Quality</h5>
                    <p className="text-muted">Only the best restaurants with the highest hygiene standards.</p>
                  </div>
                </div>
                <div className="d-flex">
                  <div className="me-3 text-accent"><FaStar size={24} /></div>
                  <div>
                    <h5 className="fw-bold">24/7 Support</h5>
                    <p className="text-muted">Our team is always here to help with your order or any questions.</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="p-4">
                <img 
                  src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Quality Food" 
                  className="img-fluid rounded-3 shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
      
      {/* Final CTA */}
      <Container className="py-5 my-5 text-center">
        <div className="cta-card p-5 rounded-4 shadow-lg text-white">
          <h2 className="fw-900 mb-3">Ready to eat?</h2>
          <p className="mb-4 opacity-75">Join thousands of happy customers and order your first meal today.</p>
          <Link to="/menu">
            <Button variant="light" size="lg" className="px-5 py-3 fw-bold text-accent">
              View Our Menu
            </Button>
          </Link>
        </div>
      </Container>
    </div>
  );
};

export default HomePage;