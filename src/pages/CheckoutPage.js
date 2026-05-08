import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Alert } from 'react-bootstrap';
import { useCart } from '../context/CartContext';
import { useNavigate, Link } from 'react-router-dom';
import OrderSummary from '../components/OrderSummary/OrderSummary';
import { FaArrowLeft, FaCheckCircle, FaRocket } from 'react-icons/fa';
import { orderService } from '../services/firebaseService';
import { auth } from '../firebase';

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
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const deliveryFee = cartTotal > 30 ? 0 : 2.99;
      const totalWithDelivery = cartTotal + deliveryFee;
      
      const orderData = {
        items: cartItems.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity
        })),
        subtotal: cartTotal,
        deliveryFee: deliveryFee,
        total: totalWithDelivery,
        customerInfo: formData,
        orderDate: new Date().toISOString(),
        orderId: `ORD-${Math.random().toString(36).substr(2, 6).toUpperCase()}`
      };

      // Get current user
      const currentUser = auth.currentUser;
      const userId = currentUser ? currentUser.uid : 'guest';

      // Save to Firebase
      await orderService.createOrder(orderData, userId);

      clearCart();
      setSuccess(true);
      
      setTimeout(() => {
        navigate('/');
      }, 3000);

    } catch (err) {
      console.error("Order placement error:", err);
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

  if (success) {
    return (
      <Container className="py-5 text-center animate-fade-in">
        <div className="py-5 mt-5">
          <FaCheckCircle size={80} className="text-success mb-4 animate-bounce" />
          <h1 className="fw-900 mb-3">Order Placed!</h1>
          <p className="text-muted mb-4 fs-5">
            Your delicious meal is being prepared. Redirecting you home...
          </p>
          <div className="spinner-border text-accent" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </Container>
    );
  }

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center animate-fade-in">
        <div className="py-5 mt-5">
          <h2 className="fw-900 mb-3">Your cart is empty</h2>
          <Link to="/menu">
            <Button variant="warning" className="px-5 py-3 shadow-lg">
              Explore Menu
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const deliveryFee = cartTotal > 30 ? 0 : 2.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  return (
    <div className="checkout-page py-5 bg-light-premium min-vh-100">
      <Container>
        <div className="d-flex align-items-center mb-5 animate-fade-in">
          <Link to="/cart" className="text-decoration-none text-muted me-3 hover-accent">
            <FaArrowLeft />
          </Link>
          <h1 className="fw-900 mb-0">Checkout</h1>
        </div>

        <Row className="gy-4">
          <Col lg={8} className="animate-fade-in-delay">
            <Card className="checkout-card-premium border-0 shadow-lg">
              <Card.Body className="p-0">
                <div className="d-flex align-items-center mb-4">
                  <div className="bg-accent-light text-accent rounded-circle p-3 me-3">
                    <FaRocket size={20} />
                  </div>
                  <h4 className="fw-900 mb-0">Delivery Information</h4>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6} className="mb-4">
                      <Form.Label className="form-label-premium">Full Name *</Form.Label>
                      <Form.Control
                        className="form-control-premium"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-4">
                      <Form.Label className="form-label-premium">Phone Number *</Form.Label>
                      <Form.Control
                        className="form-control-premium"
                        type="tel"
                        name="phone"
                        placeholder="+1 (555) 000-0000"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                      />
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-premium">Delivery Address *</Form.Label>
                    <Form.Control
                      className="form-control-premium"
                      as="textarea"
                      rows={3}
                      name="address"
                      placeholder="Street address, City, State, ZIP"
                      value={formData.address}
                      onChange={handleChange}
                      required
                    />
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-premium">Order Notes (Optional)</Form.Label>
                    <Form.Control
                      className="form-control-premium"
                      as="textarea"
                      rows={2}
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Special instructions for the driver..."
                    />
                  </Form.Group>

                  {error && <Alert variant="danger" className="rounded-4 border-0 mb-4">{error}</Alert>}

                  <Button
                    type="submit"
                    className="checkout-btn-premium w-100 py-3 mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Processing...
                      </>
                    ) : (
                      `Place Order • $${totalWithDelivery.toFixed(2)}`
                    )}
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4} className="animate-fade-in-delay-2">
            <div className="sticky-top" style={{ top: '100px' }}>
              <OrderSummary
                cartItems={cartItems}
                cartTotal={cartTotal}
                deliveryFee={deliveryFee}
                totalWithDelivery={totalWithDelivery}
                showCheckoutButton={false}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CheckoutPage;