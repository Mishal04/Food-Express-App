import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const Login = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    console.log("✅ Login Component Loaded");
    console.log("🔍 Auth object available:", !!auth);
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const { email, password } = formData;
    
    if (!email || !password) {
      return setError('Please enter both email and password');
    }
    
    setLoading(true);
    setError('');
    
    try {
      console.log('🚀 Attempting login with:', email);
      
      if (!auth || typeof auth.signInWithEmailAndPassword !== 'function') {
        // Fallback to mock login
        const mockUsers = JSON.parse(localStorage.getItem('mockUsers') || '[]');
        const user = mockUsers.find(u => u.email === email);
        
        if (!user) {
          throw new Error('User not found. Please sign up first.');
        }
        
        const mockUser = {
          email: email,
          uid: user.uid || `mock_${Date.now()}`,
          displayName: email.split('@')[0]
        };
        
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        if (window.updateAuthState) {
          window.updateAuthState(mockUser);
        }
        
        navigate('/');
        return;
      }
      
      // Use Firebase auth
      const result = await auth.signInWithEmailAndPassword(email, password);
      
      console.log('✅ Login successful:', result.user.email);
      
      if (window.updateAuthState) {
        window.updateAuthState(result.user);
      }
      
      navigate('/');
      
    } catch (err) {
      console.error('❌ Login error:', err);
      
      let errorMessage = 'Login failed';
      
      if (err.message.includes('wrong-password') || err.message.includes('user-not-found')) {
        errorMessage = 'Invalid email or password';
      } else if (err.message.includes('too-many-requests')) {
        errorMessage = 'Too many attempts. Try again later.';
      } else {
        errorMessage = err.message || 'Something went wrong';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-warning">Welcome Back</h2>
              <p className="text-center text-muted mb-4">
                Sign in to your FoodExpress account
              </p>
              
              {error && (
                <Alert variant="danger" className="text-center">
                  <i className="fas fa-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    required
                    disabled={loading}
                    className="py-2"
                  />
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={loading}
                    className="py-2"
                  />
                  <div className="text-end mt-2">
                    <Link to="/" className="text-warning small text-decoration-none">
                      Forgot password?
                    </Link>
                  </div>
                </Form.Group>
                
                <Button
                  type="submit"
                  variant="warning"
                  className="w-100 py-3 mb-3 fw-bold"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Signing In...
                    </>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4 pt-3 border-top">
                <p className="mb-0">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-warning fw-bold text-decoration-none">
                    Create one now
                  </Link>
                </p>
              </div>
              
              <div className="mt-4 p-3 bg-light rounded border">
                <p className="mb-0 small text-muted">
                  <strong>💡 Development Mode:</strong> Use any email and password (6+ characters)
                </p>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Login;