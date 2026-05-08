import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaArrowLeft, FaShieldAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary/OrderSummary';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  // Check if user is logged in
  const isLoggedIn = () => {
    const user = 
      localStorage.getItem('foodexpress_current_user') ||
      localStorage.getItem('currentUser') ||
      localStorage.getItem('mockUser');
    return !!user;
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center animate-fade-in">
        <div className="py-5 mt-5">
          <div className="empty-cart-icon">
            <FaShoppingCart size={100} />
          </div>
          <h2 className="fw-900 mb-3">Your cart is empty</h2>
          <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
            Looks like you haven't added anything to your cart yet. Let's find something delicious!
          </p>
          <Link to="/menu">
            <Button variant="warning" size="lg" className="px-5 py-3 shadow-lg">
              Start Ordering
            </Button>
          </Link>
        </div>
      </Container>
    );
  }

  const deliveryFee = cartTotal > 30 ? 0 : 2.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      navigate('/login');
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="cart-page py-5 bg-light-premium min-vh-100">
      <Container>
        <div className="d-flex align-items-center mb-4 animate-fade-in">
          <Link to="/menu" className="text-decoration-none text-muted me-3 hover-accent">
            <FaArrowLeft />
          </Link>
          <h1 className="fw-900 mb-0">My Basket</h1>
          <span className="ms-3 badge bg-accent-light text-accent rounded-pill px-3 py-2">
            {cartCount} {cartCount === 1 ? 'Item' : 'Items'}
          </span>
        </div>

        <Row className="gy-4">
          <Col lg={8} className="animate-fade-in-delay">
            <Card className="cart-card-premium">
              <Card.Body className="p-0">
                <div className="table-responsive">
                  <Table className="cart-table mb-0">
                    <thead>
                      <tr>
                        <th>Dishes</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Total</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cartItems.map((item) => (
                        <tr key={item.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="cart-item-image me-3"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://via.placeholder.com/80x80?text=Food";
                                }}
                              />
                              <div>
                                <h6 className="fw-bold mb-1">{item.name}</h6>
                                <p className="text-muted small mb-0 d-none d-md-block">
                                  ${item.price.toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center justify-content-center">
                              <button
                                className="quantity-btn-premium"
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                aria-label="Decrease quantity"
                              >
                                <FaMinus size={10} />
                              </button>
                              <span className="mx-3 fw-800" style={{ minWidth: '20px', textAlign: 'center' }}>
                                {item.quantity}
                              </span>
                              <button
                                className="quantity-btn-premium"
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                aria-label="Increase quantity"
                              >
                                <FaPlus size={10} />
                              </button>
                            </div>
                          </td>
                          <td className="text-end fw-800">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="text-end">
                            <button
                              className="btn-icon-danger border-0 bg-transparent text-muted hover-danger p-2"
                              onClick={() => removeFromCart(item.id)}
                              aria-label="Remove item"
                            >
                              <FaTrash size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </Card.Body>
            </Card>

            <div className="mt-4 d-flex align-items-center text-muted small">
              <FaShieldAlt className="me-2 text-success" />
              <span>Secure checkout powered by FoodExpress Payments</span>
            </div>
          </Col>

          <Col lg={4} className="animate-fade-in-delay-2">
            <div className="sticky-top" style={{ top: '100px' }}>
              <OrderSummary
                cartItems={cartItems}
                cartTotal={cartTotal}
                deliveryFee={deliveryFee}
                totalWithDelivery={totalWithDelivery}
                showCheckoutButton={true}
                isLoggedIn={isLoggedIn()}
                onCheckout={handleCheckout}
              />
              
              <div className="mt-4 p-4 border rounded-4 bg-white shadow-sm dark-surface">
                <h6 className="fw-bold mb-3">Promo Code</h6>
                <div className="d-flex gap-2">
                  <input type="text" className="form-control border-2 rounded-3" placeholder="Enter code" />
                  <Button variant="dark" className="rounded-3 px-3">Apply</Button>
                </div>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default CartPage;