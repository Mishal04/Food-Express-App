import React from 'react';
import { Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const Hero = () => {
  return (
    <div className="hero-section">
      <Container>
        <div className="hero-content">
          <h1 className="hero-title animate-fade-in">
            Delicious Food Delivered to Your Door
          </h1>
          <p className="hero-subtitle animate-fade-in-delay">
            Order from the best restaurants in town. Fast delivery, fresh food, and great prices!
          </p>
          <div className="hero-actions animate-fade-in-delay-2">
            <Link to="/menu">
              <Button variant="warning" size="lg" className="hero-btn shadow-lg">
                Order Now <FaArrowRight className="ms-2" size={16} />
              </Button>
            </Link>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Hero;