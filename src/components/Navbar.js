import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Badge, Button, Dropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUser, FaUserCircle, FaSignOutAlt, FaCog, FaHome, FaUtensils } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';

const NavigationBar = ({ user }) => {
  const { cartItems, cartCount } = useCart();
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  
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
          
          // Check if user is admin (simple check for now)
          // You can implement proper admin authentication later
          const adminEmails = ['admin@foodexpress.com', 'test@example.com'];
          setIsAdmin(adminEmails.includes(parsedUser.email));
        } else {
          setCurrentUser(null);
          setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error loading user:", error);
        setCurrentUser(null);
        setIsAdmin(false);
      }
    };
    
    loadUserFromStorage();
    
    window.addEventListener('storage', loadUserFromStorage);
    
    return () => {
      window.removeEventListener('storage', loadUserFromStorage);
    };
  }, [user]);
  
  // Use currentUser from state
  const displayUser = currentUser || user;
  
  const handleLogout = async () => {
    try {
      if (auth && typeof auth.signOut === 'function') {
        await auth.signOut();
      }
      
      localStorage.removeItem('foodexpress_current_user');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('mockUser');
      
      if (window.updateAuthState) {
        window.updateAuthState(null);
      }
      
      window.dispatchEvent(new Event('storage'));
      navigate('/');
      window.location.reload();
      
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem('foodexpress_current_user');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('mockUser');
      window.location.reload();
    }
  };
  
  // SIMPLE CART CLICK HANDLER
  const handleCartClick = () => {
    console.log("🛒 Cart clicked, navigating to /cart");
    navigate('/cart');
  };
  
  const getUserDisplayName = () => {
    if (!displayUser) return '';
    return displayUser.displayName || 
           displayUser.email?.split('@')[0] || 
           'User';
  };
  
  const getUserEmail = () => {
    return displayUser?.email || '';
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg" sticky="top">
      <Container>
        {/* Logo - Home Link */}
        <Navbar.Brand 
          as={Link} 
          to="/" 
          className="fw-bold text-decoration-none"
          style={{ cursor: 'pointer' }}
        >
          <span className="text-warning">Food</span>Express
          {isAdmin && (
            <Badge bg="danger" className="ms-2" style={{ fontSize: '0.6rem' }}>
              Admin
            </Badge>
          )}
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            {/* Home Link */}
            <Nav.Link 
              as={Link} 
              to="/" 
              className="text-white d-flex align-items-center"
            >
              <FaHome className="me-1" />
              <span>Home</span>
            </Nav.Link>
            
            {/* Menu Link */}
            <Nav.Link 
              as={Link} 
              to="/menu" 
              className="text-white d-flex align-items-center"
            >
              <FaUtensils className="me-1" />
              <span>Menu</span>
            </Nav.Link>
            
            {/* ADMIN LINK - ALWAYS VISIBLE FOR ALL USERS */}
            <Nav.Link 
              as={Link} 
              to="/admin" 
              className="text-white d-flex align-items-center"
            >
              <FaCog className="me-1" />
              <span>Admin Panel</span>
            </Nav.Link>
          </Nav>
          
          <Nav className="align-items-center">
            {/* CART LINK */}
            <div 
              onClick={handleCartClick}
              style={{ 
                cursor: 'pointer',
                padding: '8px 12px',
                borderRadius: '4px',
                transition: 'background 0.3s',
                marginRight: '15px'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              className="position-relative"
            >
              <div className="d-flex align-items-center text-white">
                <FaShoppingCart className="me-1" />
                <span>Cart</span>
                {cartCount > 0 && (
                  <Badge 
                    bg="warning" 
                    text="dark" 
                    className="ms-1 position-absolute top-0 start-100 translate-middle"
                    style={{ 
                      fontSize: '0.6rem', 
                      padding: '2px 5px',
                      minWidth: '18px',
                      height: '18px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    {cartCount}
                  </Badge>
                )}
              </div>
            </div>
            
            {/* User Section */}
            {displayUser ? (
              <Dropdown align="end">
                <Dropdown.Toggle 
                  variant="outline-warning" 
                  id="dropdown-user"
                  className="d-flex align-items-center"
                >
                  <FaUserCircle className="me-2" />
                  <span className="d-none d-md-inline">
                    {getUserDisplayName()}
                    {isAdmin && (
                      <Badge bg="danger" className="ms-1" style={{ fontSize: '0.6rem' }}>
                        Admin
                      </Badge>
                    )}
                  </span>
                </Dropdown.Toggle>
                
                <Dropdown.Menu>
                  <Dropdown.Header>
                    <div className="text-center">
                      <FaUserCircle size={40} className="text-warning mb-2" />
                      <h6 className="mb-1">{getUserDisplayName()}</h6>
                      <small className="text-muted">{getUserEmail()}</small>
                      {isAdmin && (
                        <Badge bg="danger" className="mt-1">Admin Account</Badge>
                      )}
                    </div>
                  </Dropdown.Header>
                  
                  <Dropdown.Divider />
                  
                  {/* Admin Menu Items */}
                  {isAdmin && (
                    <>
                      <Dropdown.Item onClick={() => navigate('/admin')} className="fw-bold">
                        <FaCog className="me-2 text-warning" />
                        Admin Dashboard
                      </Dropdown.Item>
                      <Dropdown.Divider />
                    </>
                  )}
                  
                  {/* Regular User Items */}
                  <Dropdown.Item onClick={() => navigate('/cart')}>
                    <FaShoppingCart className="me-2" />
                    My Cart ({cartCount})
                  </Dropdown.Item>
                  
                  <Dropdown.Item onClick={() => navigate('/checkout')}>
                    Checkout
                  </Dropdown.Item>
                  
                  <Dropdown.Divider />
                  
                  <Dropdown.Item onClick={handleLogout} className="text-danger">
                    <FaSignOutAlt className="me-2" />
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            ) : (
              <>
                {/* Login Link */}
                <Nav.Link 
                  as={Link} 
                  to="/login" 
                  className="d-flex align-items-center text-white me-3"
                >
                  <FaUser className="me-1" />
                  <span className="d-none d-md-inline">Login</span>
                </Nav.Link>
                
                {/* Signup Button */}
                <Button 
                  as={Link}
                  to="/signup"
                  variant="warning" 
                  size="sm" 
                  className="px-3"
                >
                  Sign Up
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
        
        {/* Debug info - only in development */}
        {process.env.NODE_ENV === 'development' && (
          <div className="position-absolute top-0 end-0 mt-1 me-2">
            <small className="text-info">
              {displayUser ? getUserDisplayName() : 'Guest'}
              {isAdmin && ' 👑'}
            </small>
          </div>
        )}
      </Container>
    </Navbar>
  );
};

export default NavigationBar;