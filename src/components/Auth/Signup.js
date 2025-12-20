import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';

const Signup = () => {
  const navigate = useNavigate();
  
  // Debug: Check auth on component mount
  useEffect(() => {
    console.log("✅ Signup Component Mounted");
    console.log("🔍 Auth object:", auth);
    console.log("🔍 Current user:", auth?.currentUser);
    console.log("🔍 Create user method:", typeof auth?.createUserWithEmailAndPassword);
    
    // Check localStorage
    const storedUser = localStorage.getItem('foodexpress_current_user');
    console.log("🔍 localStorage user:", storedUser ? JSON.parse(storedUser) : 'None');
  }, []);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
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
    
    const { email, password, confirmPassword } = formData;
    
    // Debug before starting
    console.log("=== SIGNUP DEBUG START ===");
    console.log("1. Email:", email);
    console.log("2. Password length:", password.length);
    console.log("3. Auth exists:", !!auth);
    console.log("4. Create method:", typeof auth?.createUserWithEmailAndPassword);
    console.log("5. Current user before:", auth?.currentUser);
    
    // Basic validation
    if (!email || !password || !confirmPassword) {
      console.log("❌ Validation failed: All fields required");
      return setError('All fields are required');
    }
    
    if (!email.includes('@') || !email.includes('.')) {
      console.log("❌ Validation failed: Invalid email");
      return setError('Please enter a valid email address');
    }
    
    if (password.length < 6) {
      console.log("❌ Validation failed: Password too short");
      return setError('Password must be at least 6 characters');
    }
    
    if (password !== confirmPassword) {
      console.log("❌ Validation failed: Passwords don't match");
      return setError('Passwords do not match');
    }
    
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      console.log("🚀 Attempting to create account...");
      
      // Check if auth object is available
      if (!auth) {
        console.log("❌ Auth object not found");
        throw new Error('Authentication service not available');
      }
      
      if (typeof auth.createUserWithEmailAndPassword !== 'function') {
        console.log("❌ Create method not found");
        throw new Error('Authentication method not found');
      }
      
      // Create account
      console.log("📞 Calling createUserWithEmailAndPassword...");
      const result = await auth.createUserWithEmailAndPassword(email, password);
      
      console.log("✅ Account created successfully!");
      console.log("User object:", result.user);
      console.log("User email:", result.user.email);
      console.log("User ID:", result.user.uid);
      
      // Check if user was saved to localStorage
      const storedUser = localStorage.getItem('foodexpress_current_user');
      console.log("📱 Stored in localStorage:", storedUser);
      
      setSuccess('🎉 Account created successfully! Redirecting...');
      
      // Force update App.js auth state
      if (window.updateAuthState) {
        console.log("🔄 Calling window.updateAuthState...");
        window.updateAuthState(result.user);
      } else {
        console.log("⚠️ window.updateAuthState not found");
      }
      
      // Also trigger storage event for App.js to catch
      window.dispatchEvent(new Event('storage'));
      
      // Show success for 2 seconds, then redirect
      setTimeout(() => {
        console.log("🔄 Redirecting to home...");
        navigate('/');
        // Force reload to update navbar
        window.location.reload();
      }, 2000);
      
    } catch (err) {
      console.error('❌ SIGNUP ERROR:', err);
      console.error('Error message:', err.message);
      console.error('Error stack:', err.stack);
      
      let errorMessage = 'Failed to create account';
      
      if (err.message.includes('email-already-in-use')) {
        errorMessage = 'This email is already registered. Please login instead.';
      } else if (err.message.includes('invalid-email')) {
        errorMessage = 'Please enter a valid email address.';
      } else if (err.message.includes('weak-password')) {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      } else if (err.message.includes('not available') || err.message.includes('not found')) {
        errorMessage = 'Using development mode. Account created in mock system!';
        setSuccess('✅ Development mode: Account created! Redirecting...');
        
        // Create mock user in localStorage
        const mockUser = {
          email: email,
          uid: `mock_${Date.now()}`,
          displayName: email.split('@')[0],
          createdAt: new Date().toISOString()
        };
        
        console.log("🔄 Creating mock user:", mockUser);
        localStorage.setItem('foodexpress_current_user', JSON.stringify(mockUser));
        localStorage.setItem('currentUser', JSON.stringify(mockUser));
        
        // Trigger storage event
        window.dispatchEvent(new Event('storage'));
        
        // Redirect
        setTimeout(() => {
          navigate('/');
          window.location.reload();
        }, 1500);
        
        return;
      } else {
        errorMessage = err.message || 'Something went wrong. Please try again.';
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log("=== SIGNUP DEBUG END ===");
    }
  };
  
  return (
    <Container className="py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <Card className="shadow border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-warning">Create Account</h2>
              <p className="text-center text-muted mb-4">
                Join FoodExpress for delicious meals delivered to your door
              </p>
              
              {success && (
                <Alert variant="success" className="text-center">
                  <i className="fas fa-check-circle me-2"></i>
                  {success}
                </Alert>
              )}
              
              {error && !success && (
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
                
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="At least 6 characters"
                    required
                    disabled={loading}
                    className="py-2"
                  />
                  <Form.Text className="text-muted">
                    Minimum 6 characters
                  </Form.Text>
                </Form.Group>
                
                <Form.Group className="mb-4">
                  <Form.Label>Confirm Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    required
                    disabled={loading}
                    className="py-2"
                  />
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </Form>
              
              <div className="text-center mt-4 pt-3 border-top">
                <p className="mb-0">
                  Already have an account?{' '}
                  <Link to="/login" className="text-warning fw-bold text-decoration-none">
                    Sign In
                  </Link>
                </p>
              </div>
              
              {/* Development notice */}
              <div className="mt-4 p-3 bg-light rounded border">
                <p className="mb-2 small text-muted">
                  <strong>💡 Development Mode Active</strong>
                </p>
                <p className="mb-1 small text-muted">
                  • Using mock authentication system
                </p>
                <p className="mb-0 small text-muted">
                  • Any valid email and password (6+ chars) will work
                </p>
              </div>
              
              {/* Test credentials */}
              <div className="mt-3 text-center">
                <p className="small text-muted mb-1">
                  <strong>Try:</strong> test@example.com / 123456
                </p>
              </div>
              
              {/* Debug button */}
              <div className="mt-3 text-center">
                <button 
                  className="btn btn-sm btn-outline-info"
                  onClick={() => {
                    console.log("=== DEBUG INFO ===");
                    console.log("Auth object:", auth);
                    console.log("Current user:", auth?.currentUser);
                    console.log("localStorage current user:", localStorage.getItem('foodexpress_current_user'));
                    console.log("localStorage all users:", localStorage.getItem('foodexpress_all_users'));
                  }}
                >
                  Debug Info
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Container>
  );
};

export default Signup;