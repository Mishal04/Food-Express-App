import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaCheckCircle, FaShoppingCart } from 'react-icons/fa';

const CartNotification = ({ show, message, onClose }) => {
    useEffect(() => {
        if (show) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div className="cart-notification d-flex align-items-center justify-content-between p-3"
            style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                background: '#28a745',
                color: 'white',
                borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 9999,
                minWidth: '300px',
                animation: 'slideIn 0.3s ease'
            }}>
            <div className="d-flex align-items-center">
                <FaCheckCircle className="me-2" size={20} />
                <span className="fw-bold">{message}</span>
            </div>
            <Link to="/cart" className="text-white text-decoration-none ms-3" onClick={onClose}>
                <div className="d-flex align-items-center bg-white text-success px-2 py-1 rounded" style={{ fontSize: '0.85rem' }}>
                    <FaShoppingCart className="me-1" />
                    View
                </div>
            </Link>
        </div>
    );
};

export default CartNotification;
