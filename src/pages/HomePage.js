import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Hero from '../components/Home/Hero';

const HomePage = () => {
  return (
    <>
      <Hero />
      
      <Container className="my-5">
        <Row className="text-center mb-5">
          <Col>
            <h2>How It Works</h2>
            <p className="text-muted">Order food in 3 simple steps</p>
          </Col>
        </Row>
        
        <Row className="g-4">
          <Col md={4}>
            <div className="text-center p-4 border rounded shadow-sm">
              <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-3">1</span>
              </div>
              <h4>Browse Menu</h4>
              <p className="text-muted">Explore our delicious food selection</p>
            </div>
          </Col>
          
          <Col md={4}>
            <div className="text-center p-4 border rounded shadow-sm">
              <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-3">2</span>
              </div>
              <h4>Add to Cart</h4>
              <p className="text-muted">Select items and customize your order</p>
            </div>
          </Col>
          
          <Col md={4}>
            <div className="text-center p-4 border rounded shadow-sm">
              <div className="bg-warning rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                <span className="fs-3">3</span>
              </div>
              <h4>Checkout</h4>
              <p className="text-muted">Pay securely and track your order</p>
            </div>
          </Col>
        </Row>
        
        <Row className="mt-5 text-center">
          <Col>
            <h3>Ready to Order?</h3>
            <p className="mb-4">Browse our menu and order your favorite food</p>
            <Link to="/menu">
              <Button variant="warning" size="lg" className="px-5">
                View Menu
              </Button>
            </Link>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;