import React from 'react';
import { Card, Button, Badge } from 'react-bootstrap';
import { FaStar, FaFire } from 'react-icons/fa';
import { useCart } from '../../context/CartContext';

const MenuItem = ({ item }) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    console.log(`🛒 Adding ${item.name} to cart - $${item.price}`);
    addToCart(item);
  };

  return (
    <Card className="h-100 shadow-sm border-0">
      <div className="position-relative">
        <Card.Img 
          variant="top" 
          src={item.image}
          style={{ 
            height: '200px', 
            objectFit: 'cover',
            transition: 'transform 0.5s ease'
          }}
          alt={item.name}
          className="card-img"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-1.2.1&auto=format&fit=crop&w=300&q=80";
          }}
        />
        
        {/* Badges */}
        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-1">
          {item.isVegetarian && (
            <Badge bg="success" className="px-2 py-1">
              🥬 Veg
            </Badge>
          )}
          {item.popular && (
            <Badge bg="danger" className="px-2 py-1">
              <FaFire className="me-1" /> Popular
            </Badge>
          )}
        </div>
        
        {/* Price Tag */}
        <div className="position-absolute bottom-0 start-0 m-2">
          <Badge bg="dark" className="px-3 py-2 fs-6">
            ${item.price.toFixed(2)}
          </Badge>
        </div>
      </div>
      
      <Card.Body className="d-flex flex-column p-3">
        <Card.Title className="d-flex justify-content-between align-items-start mb-2">
          <span className="fw-bold" style={{ fontSize: '1.1rem' }}>
            {item.name}
          </span>
          {item.popular && (
            <FaStar className="text-warning" size={16} />
          )}
        </Card.Title>
        
        <Card.Text className="text-muted flex-grow-1 mb-3" style={{ fontSize: '0.9rem' }}>
          {item.description}
        </Card.Text>
        
        <div className="mt-auto">
          <Button 
            variant="warning" 
            className="w-100 fw-bold py-2"
            onClick={handleAddToCart}
            size="sm"
          >
            Add to Cart
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default MenuItem;