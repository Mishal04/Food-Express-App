import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary/OrderSummary';

const CheckoutPage = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create order object
      const order = {
        id: Math.random().toString(36).substr(2, 9).toUpperCase(),
        items: cartItems,
        total: cartTotal,
        customerInfo: formData,
        date: new Date().toLocaleString()
      };

      // Save to localStorage (for demo)
      const existingOrders = JSON.parse(localStorage.getItem('orders') || '[]');
      localStorage.setItem('orders', JSON.stringify([...existingOrders, order]));

      // Clear cart
      clearCart();

      // Show success message
      alert(`Order placed successfully! Order ID: ${order.id}`);

      // Redirect to home
      navigate('/');
    } catch (err) {
      setError('Failed to place order: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Alert variant="info">
          <h4>Your cart is empty</h4>
          <p>Add some items to your cart before checking out</p>
          <Button variant="warning" onClick={() => navigate('/menu')}>
            Browse Menu
          </Button>
        </Alert>
      </Container>
    );
  }

  const deliveryFee = cartTotal > 30 ? 0 : 2.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Checkout</h1>

      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h4>Delivery Information</h4>
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Full Name *</Form.Label>
                    <Form.Control
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Phone Number *</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                    />
                  </Col>
                </Row>

                <Form.Group className="mb-4">
                  <Form.Label>Delivery Address *</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Label>Order Notes (Optional)</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    placeholder="Any special instructions?"
                  />
                </Form.Group>

                {error && <Alert variant="danger">{error}</Alert>}

                <Button
                  type="submit"
                  variant="warning"
                  size="lg"
                  className="w-100"
                  disabled={loading}
                >
                  {loading ? 'Processing...' : `Place Order - $${totalWithDelivery.toFixed(2)}`}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            deliveryFee={deliveryFee}
            totalWithDelivery={totalWithDelivery}
            showCheckoutButton={false}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CheckoutPage;