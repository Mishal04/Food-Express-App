import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <div className="hero-section text-center text-white py-5">
      <div className="container py-5">
        <h1 className="display-4 fw-bold mb-3">
          Delicious Food Delivered to Your Door
        </h1>
        <p className="lead mb-4">
          Order from the best restaurants in town. Fast delivery, fresh food, and great prices!
        </p>
        <Link to="/menu">
          <Button variant="warning" size="lg" className="px-4 py-2 fw-bold">
            Order Now
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default Hero;