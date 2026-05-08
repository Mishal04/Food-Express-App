import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { FaLock, FaTruck, FaClock } from 'react-icons/fa';

const OrderSummary = ({
    cartItems,
    cartTotal,
    deliveryFee,
    totalWithDelivery,
    showCheckoutButton = false,
    isLoggedIn = false,
    onCheckout
}) => {
    const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

    return (
        <Card className="summary-card-premium border-0 shadow-lg">
            <Card.Body className="p-0">
                <h4 className="fw-900 mb-4">Order Summary</h4>

                <div className="summary-details mb-4">
                    {/* Items summary */}
                    <div className="mb-3 scrollable-items pe-2" style={{ maxHeight: '180px', overflowY: 'auto' }}>
                        {cartItems.map(item => (
                            <div key={item.id} className="d-flex justify-content-between mb-2 animate-fade-in">
                                <span className="text-secondary small fw-500">
                                    {item.name} <span className="text-muted">× {item.quantity}</span>
                                </span>
                                <span className="small fw-800">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="divider-dashed my-3" />

                    {/* Subtotal */}
                    <div className="d-flex justify-content-between mb-2">
                        <span className="text-secondary">Subtotal</span>
                        <span className="fw-700">${cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Delivery fee */}
                    <div className="d-flex justify-content-between mb-3">
                        <span className="text-secondary">Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'text-success fw-800' : 'fw-700'}>
                            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                        </span>
                    </div>

                    <div className="total-row p-3 rounded-4 bg-light-premium mb-4 dark-surface-2">
                        <div className="d-flex justify-content-between align-items-center">
                            <span className="fw-800 fs-5">Total</span>
                            <span className="text-accent fw-900 fs-4">${totalWithDelivery.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Free delivery progress */}
                {cartTotal < 30 ? (
                    <div className="mb-4">
                        <div className="d-flex justify-content-between small mb-1">
                            <span className="text-muted">Free delivery progress</span>
                            <span className="text-accent fw-bold">${(30 - cartTotal).toFixed(2)} to go</span>
                        </div>
                        <div className="progress rounded-pill" style={{ height: '6px' }}>
                            <div 
                                className="progress-bar bg-accent" 
                                role="progressbar" 
                                style={{ width: `${(cartTotal / 30) * 100}%` }}
                                aria-valuenow={(cartTotal / 30) * 100} 
                                aria-valuemin="0" 
                                aria-valuemax="100"
                            ></div>
                        </div>
                    </div>
                ) : (
                    <Alert variant="success" className="rounded-4 border-0 small mb-4 animate-fade-in">
                        <FaTruck className="me-2" /> You've unlocked <strong>Free Delivery!</strong>
                    </Alert>
                )}

                {/* Buttons */}
                {showCheckoutButton && (
                    <div className="d-grid gap-3">
                        <Button
                            onClick={onCheckout}
                            className="checkout-btn-premium"
                        >
                            {isLoggedIn ? 'Complete Order' : 'Login to Order'}
                        </Button>

                        {!isLoggedIn && (
                            <Link to="/signup" className="text-decoration-none d-grid">
                                <Button variant="none" className="login-btn-premium border-2 w-100">
                                    Create Free Account
                                </Button>
                            </Link>
                        )}
                    </div>
                )}

                {/* Trust Badges */}
                <div className="mt-4 pt-4 border-top">
                    <div className="row g-2 text-center text-muted small">
                        <div className="col-4">
                            <FaLock className="d-block mx-auto mb-1 text-accent" />
                            <span style={{ fontSize: '0.65rem' }}>Secure Pay</span>
                        </div>
                        <div className="col-4">
                            <FaTruck className="d-block mx-auto mb-1 text-accent" />
                            <span style={{ fontSize: '0.65rem' }}>Live Track</span>
                        </div>
                        <div className="col-4">
                            <FaClock className="d-block mx-auto mb-1 text-accent" />
                            <span style={{ fontSize: '0.65rem' }}>30m Delivery</span>
                        </div>
                    </div>
                </div>
            </Card.Body>
        </Card>
    );
};

export default OrderSummary;
