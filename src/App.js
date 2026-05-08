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
import CartNotification from './components/CartNotification/CartNotification';

import Signup from './components/Auth/Signup';
import { CartProvider } from './context/CartContext';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCartNotification, setShowCartNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  // Show cart notification
  const showNotification = (message) => {
    setNotificationMessage(message);
    setShowCartNotification(true);
  };

  // Listen for cart notification events
  useEffect(() => {
    const handleCartNotification = (e) => {
      console.log("🔔 Notification event received:", e.detail.message);
      showNotification(e.detail.message);
    };

    window.addEventListener('show-cart-notification', handleCartNotification);

    return () => {
      window.removeEventListener('show-cart-notification', handleCartNotification);
    };
  }, []);

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('foodexpress_dark_mode') === 'true';
  });

  // Toggle Dark Mode
  const toggleDarkMode = () => {
    setDarkMode(prev => {
      const newVal = !prev;
      localStorage.setItem('foodexpress_dark_mode', newVal);
      return newVal;
    });
  };

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);

  useEffect(() => {
    console.log("App: Setting up Firebase auth listener...");
    
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const userData = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
          photoURL: firebaseUser.photoURL
        };
        setUser(userData);
        localStorage.setItem('foodexpress_current_user', JSON.stringify(userData));
        console.log("App: User logged in:", userData.email);
      } else {
        // User is signed out
        setUser(null);
        localStorage.removeItem('foodexpress_current_user');
        console.log("App: User logged out");
      }
      setLoading(false);
    });

    // Fallback loading finish
    const timeoutId = setTimeout(() => setLoading(false), 3000);

    return () => {
      unsubscribe();
      clearTimeout(timeoutId);
    };
  }, []);

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
        <ScrollToTop />
        <div className="d-flex flex-column min-vh-100">
          <NavigationBar user={user} darkMode={darkMode} toggleDarkMode={toggleDarkMode} />

          {/* Cart Notification */}
          <CartNotification
            show={showCartNotification}
            message={notificationMessage}
            onClose={() => setShowCartNotification(false)}
          />

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