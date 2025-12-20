import React from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { Container, Card, Alert } from 'react-bootstrap';
import CheckoutForm from '../components/Payment/CheckoutForm';
import { useCart } from '../context/CartContext';

// Replace with your Stripe publishable key
const stripePromise = loadStripe('pk_test_your_publishable_key_here');

const PaymentPage = () => {
  const { cartTotal } = useCart();
  const deliveryFee = cartTotal > 30 ? 0 : 2.99;
  const totalAmount = cartTotal + deliveryFee;

  const handlePaymentSuccess = (paymentResult) => {
    console.log('Payment successful:', paymentResult);
    alert('Payment successful! Your order is being processed.');
    // Redirect to order confirmation page
  };

  const handlePaymentError = (error) => {
    console.error('Payment error:', error);
    alert('Payment failed. Please try again.');
  };

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Payment</h1>
      
      <Row>
        <Col lg={8}>
          <Card className="mb-4 shadow">
            <Card.Body>
              <h4>Payment Details</h4>
              <Alert variant="info" className="mb-4">
                <strong>Test Card:</strong> 4242 4242 4242 4242<br />
                <strong>Expiry:</strong> Any future date<br />
                <strong>CVC:</strong> Any 3 digits
              </Alert>
              
              <Elements stripe={stripePromise}>
                <CheckoutForm
                  amount={totalAmount}
                  onSuccess={handlePaymentSuccess}
                  onError={handlePaymentError}
                />
              </Elements>
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={4}>
          <Card className="shadow">
            <Card.Body>
              <h4>Order Summary</h4>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Delivery Fee</span>
                <span>${deliveryFee.toFixed(2)}</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold">
                <span>Total</span>
                <span className="text-warning">${totalAmount.toFixed(2)}</span>
              </div>
              
              <div className="mt-4 text-muted small">
                <p>Your payment is secured with Stripe</p>
                <p>No card details are stored on our servers</p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PaymentPage;