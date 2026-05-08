import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaShoppingCart, FaUserCircle, FaSignOutAlt, FaCog, FaHome, FaUtensils, FaSun, FaMoon } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';

const NavigationBar = ({ user, darkMode, toggleDarkMode }) => {
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load user from localStorage
  useEffect(() => {
    const loadUserFromStorage = () => {
      try {
        const storedUser = 
          localStorage.getItem('foodexpress_current_user') ||
          localStorage.getItem('currentUser') ||
          localStorage.getItem('mockUser');
        
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setCurrentUser(parsedUser);
          const adminEmails = ['admin@foodexpress.com', 'test@example.com'];
          setIsAdmin(adminEmails.includes(parsedUser.email));
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        setCurrentUser(null);
        setIsAdmin(false);
      }
    };
    
    loadUserFromStorage();
    window.addEventListener('storage', loadUserFromStorage);
    return () => window.removeEventListener('storage', loadUserFromStorage);
  }, [user]);
  
  const displayUser = currentUser || user;
  
  const handleLogout = async () => {
    try {
      if (auth && typeof auth.signOut === 'function') {
        await auth.signOut();
      }
      localStorage.removeItem('foodexpress_current_user');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('mockUser');
      if (window.updateAuthState) window.updateAuthState(null);
      window.dispatchEvent(new Event('storage'));
      navigate('/');
      window.location.reload();
    } catch (error) {
      localStorage.removeItem('foodexpress_current_user');
      window.location.reload();
    }
  };
  
  const getUserDisplayName = () => {
    if (!displayUser) return '';
    return displayUser.displayName || displayUser.email?.split('@')[0] || 'User';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar 
      expand="lg" 
      sticky="top" 
      className={`navbar-premium ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="navbar-brand-premium"
        >
          <span className="brand-accent">Food</span>Express
          {isAdmin && (
            <Badge bg="danger" className="admin-badge">Admin</Badge>
          )}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mx-auto nav-links-premium">
            <Nav.Link 
              as={Link} 
              to="/" 
              className={`nav-link-custom ${isActive('/') ? 'active' : ''}`}
            >
              <FaHome className="nav-icon" />
              <span>Home</span>
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/menu" 
              className={`nav-link-custom ${isActive('/menu') ? 'active' : ''}`}
            >
              <FaUtensils className="nav-icon" />
              <span>Menu</span>
            </Nav.Link>
            
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className={`nav-link-custom ${isActive('/admin') ? 'active' : ''}`}
            >
              <FaCog className="nav-icon" />
              <span>Admin</span>
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center gap-3">
            <div 
              onClick={toggleDarkMode}
              className="theme-toggle-wrapper"
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? <FaSun className="theme-icon sun" /> : <FaMoon className="theme-icon moon" />}
            </div>

            <div 
              onClick={() => navigate('/cart')}
              className="cart-icon-wrapper"
              aria-label="View Cart"
            >
              <FaShoppingCart className="cart-icon" />
              {cartCount > 0 && (
                <span className="cart-badge-dot">{cartCount}</span>
              )}
            </div>
            
            {displayUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="none" 
                  id="dropdown-user"
                  className="user-dropdown-toggle"
                >
                  <FaUserCircle className="user-icon" />
                  <span className="d-none d-md-inline ms-2">{getUserDisplayName()}</span>
                </Dropdown.Toggle>
                
                <Dropdown.Menu className="dropdown-menu-premium border-0 shadow-lg">
                  <Dropdown.Header className="dropdown-header-premium">
                    <div className="text-center py-2">
                      <FaUserCircle size={32} className="text-accent mb-2" />
                      <h6 className="mb-0">{getUserDisplayName()}</h6>
                      <small className="text-muted">{displayUser.email}</small>
                    </div>
                  </Dropdown.Header>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={() => navigate('/cart')}>My Orders</Dropdown.Item>
                  <Dropdown.Item onClick={() => navigate('/checkout')}>Checkout</Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" /> Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <div className="auth-buttons d-flex align-items-center gap-2">
                <Button 
                  as={Link} 
                  to="/login" 
                  variant="none"
                  className="login-btn-premium"
                >
                  Login
                </Button>
                <Button 
                  as={Link} 
                  to="/signup" 
                  className="signup-btn-premium"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;