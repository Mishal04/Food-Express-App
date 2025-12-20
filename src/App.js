import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Import components
import NavigationBar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import Login from './components/Auth/Login';
import AdminPage from './pages/AdminPage';

import Signup from './components/Auth/Signup';
import { CartProvider } from './context/CartContext';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Show cart notification
  const showNotification = (message) => {
    setNotificationMessage(message);
    setShowCartNotification(true);
    
    setTimeout(() => {
      setShowCartNotification(false);
    }, 3000);
  };

  // Make showNotification available globally for CartContext
  useEffect(() => {
    window.showCartNotification = showNotification;
  }, []);

  useEffect(() => {
    console.log("App: Setting up auth listener...");
    
    // First check localStorage for user
    const checkUser = () => {
      try {
        const savedUser = localStorage.getItem('foodexpress_current_user') || 
                         localStorage.getItem('currentUser') || 
                         localStorage.getItem('mockUser');
        
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          console.log("App: Loaded user from localStorage:", parsedUser.email);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("App: Error parsing saved user:", error);
        setUser(null);
      }
      
      setLoading(false);
    };
    
    checkUser();
    
    // Listen for storage changes (for mock auth)
    const handleStorageChange = (e) => {
      if (e.key === 'foodexpress_current_user' || 
          e.key === 'currentUser' || 
          e.key === 'mockUser') {
        checkUser();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Set a global function for mock auth to update state
    window.updateAuthState = (newUser) => {
      setUser(newUser);
    };
    
    // Set timeout to ensure loading finishes
    const timeoutId = setTimeout(() => {
      if (loading) {
        console.log("App: Loading timeout reached");
        setLoading(false);
      }
    }, 2000);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearTimeout(timeoutId);
      delete window.updateAuthState;
      delete window.showCartNotification;
    };
  }, [loading]);

  if (loading) {
    return (
      <div className="d-flex flex-column justify-content-center align-items-center" style={{ height: '100vh' }}>
        <div className="spinner-border text-warning" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <h3 className="mt-3 text-warning">FoodExpress</h3>
        <p className="text-muted">Loading delicious experience...</p>
      </div>
    );
  }

  return (
    <CartProvider>
      <Router>
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar user={user} />
          
          {/* Cart Notification */}
          {showCartNotification && (
            <div className="cart-notification">
              <i className="fas fa-check-circle me-2"></i>
              {notificationMessage}
            </div>
          )}
          
          <main className="flex-grow-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/menu" element={<MenuPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route 
                path="/checkout" 
                element={user ? <CheckoutPage /> : <Navigate to="/login" />} 
              />
              <Route 
                path="/login" 
                element={!user ? <Login /> : <Navigate to="/" />} 
              />
              <Route 
                path="/signup" 
                element={!user ? <Signup /> : <Navigate to="/" />} 
              />
              <Route 
               path="/admin" 
              element={<AdminPage />} 
              />
            </Routes>
          </main>
          
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;