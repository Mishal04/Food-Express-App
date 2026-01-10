import React from 'react';
import { Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';

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
        <Card className="shadow-sm sticky-top" style={{ top: '90px', zIndex: 1 }}>
            <Card.Body>
                <h4 className="mb-4">Order Summary</h4>

                <div className="mb-4">
                    {/* Items summary */}
                    <div className="mb-3">
                        <h6>Items ({cartCount})</h6>
                        {cartItems.map(item => (
                            <div key={item.id} className="d-flex justify-content-between mb-1">
                                <span className="text-muted small">
                                    {item.name} × {item.quantity}
                                </span>
                                <span className="small">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <hr />

                    {/* Subtotal */}
                    <div className="d-flex justify-content-between mb-2">
                        <span>Subtotal</span>
                        <span>${cartTotal.toFixed(2)}</span>
                    </div>

                    {/* Delivery fee */}
                    <div className="d-flex justify-content-between mb-2">
                        <span>Delivery Fee</span>
                        <span className={deliveryFee === 0 ? 'text-success' : ''}>
                            {deliveryFee === 0 ? 'FREE' : `$${deliveryFee.toFixed(2)}`}
                        </span>
                    </div>

                    <hr />

                    {/* Total */}
                    <div className="d-flex justify-content-between fw-bold fs-5">
                        <span>Total</span>
                        <span className="text-warning">${totalWithDelivery.toFixed(2)}</span>
                    </div>
                </div>

                {/* Free delivery message */}
                {cartTotal > 30 ? (
                    <Alert variant="success" className="mb-3">
                        🎉 Congratulations! You qualify for FREE delivery!
                    </Alert>
                ) : (
                    <Alert variant="info" className="mb-3">
                        <strong>Add ${(30 - cartTotal).toFixed(2)} more</strong> to get FREE delivery!
                    </Alert>
                )}

                {/* Buttons - Only shown if showCheckoutButton is true (Cart Page) */}
                {showCheckoutButton ? (
                    <>
                        <Button
                            variant="warning"
                            className="w-100 py-3 fw-bold mb-3"
                            onClick={onCheckout}
                            size="lg"
                        >
                            {isLoggedIn ? 'Proceed to Checkout' : 'Login to Checkout'}
                        </Button>

                        {!isLoggedIn && (
                            <Link to="/signup" className="text-decoration-none">
                                <Button variant="outline-warning" className="w-100 py-2 mb-3">
                                    Create Free Account
                                </Button>
                            </Link>
                        )}

                        {/* Security info */}
                        <div className="mt-4 pt-3 border-top">
                            <div className="d-flex align-items-center mb-2">
                                <span className="text-success me-2">✓</span>
                                <small className="text-muted">Secure checkout</small>
                            </div>
                            <div className="d-flex align-items-center mb-2">
                                <span className="text-success me-2">✓</span>
                                <small className="text-muted">Free delivery over $30</small>
                            </div>
                            <div className="d-flex align-items-center">
                                <span className="text-success me-2">✓</span>
                                <small className="text-muted">30-minute delivery guarantee</small>
                            </div>
                        </div>

                        {/* Terms */}
                        <p className="text-muted small mt-3 mb-0">
                            By placing your order, you agree to our
                            <Link to="/terms" className="text-warning ms-1">Terms & Conditions</Link>
                        </p>
                    </>
                ) : (
                    /* Checkout Page view */
                    <div className="text-muted small mt-3">
                        <p>• Free delivery on orders over $30</p>
                        <p>• Estimated delivery time: 30-45 minutes</p>
                        <p>• Cash on delivery available</p>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default OrderSummary;
