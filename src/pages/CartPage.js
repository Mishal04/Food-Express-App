import React from 'react';
import { Container, Row, Col, Card, Button, Table, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart, FaSignInAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import OrderSummary from '../components/OrderSummary/OrderSummary';

const CartPage = () => {
  const { cartItems, removeFromCart, updateQuantity, cartTotal, cartCount } = useCart();
  const navigate = useNavigate();

  console.log("🛒 Cart Page Loaded");
  console.log("Cart Items:", cartItems);
  console.log("Cart Count:", cartCount);
  console.log("Cart Total:", cartTotal);

  // Check if user is logged in
  const isLoggedIn = () => {
    const user = localStorage.getItem('foodexpress_current_user') ||
      localStorage.getItem('currentUser') ||
      localStorage.getItem('mockUser');
    return !!user;
  };

  if (cartItems.length === 0) {
    return (
      <Container className="py-5 text-center">
        <Card className="shadow-sm border-0">
          <Card.Body className="py-5">
            <FaShoppingCart size={64} className="text-muted mb-3" />
            <h3>Your cart is empty</h3>
            <p className="text-muted mb-4">Add some delicious items from our menu</p>
            <Link to="/menu">
              <Button variant="warning" className="px-4">Browse Menu</Button>
            </Link>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  const deliveryFee = cartTotal > 30 ? 0 : 2.99;
  const totalWithDelivery = cartTotal + deliveryFee;

  const handleCheckout = () => {
    if (!isLoggedIn()) {
      const shouldLogin = window.confirm(
        "To checkout, you need to login or create an account.\n\nDo you want to login now?"
      );

      if (shouldLogin) {
        navigate('/login');
      }
    } else {
      navigate('/checkout');
    }
  };

  return (
    <Container className="py-5">
      <h1 className="mb-4">Your Shopping Cart</h1>

      {!isLoggedIn() && (
        <Alert variant="info" className="mb-4">
          <FaSignInAlt className="me-2" />
          You are browsing as a guest.
          <Link to="/login" className="alert-link ms-1">
            Login
          </Link> or
          <Link to="/signup" className="alert-link ms-1">
            Sign up
          </Link> to save your cart and checkout.
        </Alert>
      )}

      <Row>
        <Col lg={8}>
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: '40%' }}>Item</th>
                      <th style={{ width: '15%' }}>Price</th>
                      <th style={{ width: '20%' }}>Quantity</th>
                      <th style={{ width: '15%' }}>Total</th>
                      <th style={{ width: '10%' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="cart-item-image me-3"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://via.placeholder.com/80x80?text=Food+Image";
                              }}
                            />
                            <div>
                              <h6 className="mb-1">{item.name}</h6>
                              <p className="text-muted small mb-0">{item.description}</p>
                              {item.isVegetarian && (
                                <span className="badge bg-success mt-1">Vegetarian</span>
                              )}
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="fw-bold">${item.price.toFixed(2)}</div>
                          <small className="text-muted">each</small>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              aria-label="Decrease quantity"
                            >
                              <FaMinus size={12} />
                            </button>
                            <span className="mx-3 fw-bold" style={{ minWidth: '30px', textAlign: 'center' }}>
                              {item.quantity}
                            </span>
                            <button
                              className="quantity-btn"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              aria-label="Increase quantity"
                            >
                              <FaPlus size={12} />
                            </button>
                          </div>
                        </td>
                        <td className="fw-bold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => removeFromCart(item.id)}
                            aria-label="Remove item"
                            title="Remove from cart"
                          >
                            <FaTrash />
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between mb-5">
            <Link to="/menu">
              <Button variant="outline-secondary">
                ← Continue Shopping
              </Button>
            </Link>
            <Button
              variant="danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to clear all items from your cart?')) {
                  cartItems.forEach(item => removeFromCart(item.id));
                }
              }}
            >
              Clear Entire Cart
            </Button>
          </div>
        </Col>

        <Col lg={4}>
          <OrderSummary
            cartItems={cartItems}
            cartTotal={cartTotal}
            deliveryFee={deliveryFee}
            totalWithDelivery={totalWithDelivery}
            showCheckoutButton={true}
            isLoggedIn={isLoggedIn()}
            onCheckout={handleCheckout}
          />
        </Col>
      </Row>
    </Container>
  );
};

export default CartPage;