import React, { useState } from 'react';
import { Form, Button, Container, Card, Alert, Row, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { FaEnvelope, FaLock, FaUser, FaArrowLeft, FaUtensils } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setLoading(true);
    setError('');

    try {
      // Firebase v9 Modular SDK Signup
      const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
      const user = userCredential.user;
      
      // Update profile with name
      await updateProfile(user, {
        displayName: formData.name
      });
      
      // Save user info to local storage
      const userData = {
        uid: user.uid,
        email: user.email,
        displayName: formData.name,
      };
      
      localStorage.setItem('foodexpress_current_user', JSON.stringify(userData));
      
      if (window.updateAuthState) {
        window.updateAuthState(userData);
      }
      
      navigate('/');
    } catch (err) {
      console.error('Signup error:', err);
      let msg = 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already in use.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Invalid email address.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page py-5 min-vh-100 d-flex align-items-center bg-light-premium">
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={5} className="animate-fade-in">
            <div className="text-center mb-4">
              <Link to="/" className="text-decoration-none text-accent fw-900 fs-2">
                <FaUtensils className="me-2" />
                FoodExpress
              </Link>
            </div>
            
            <Card className="checkout-card-premium border-0 shadow-lg">
              <Card.Body className="p-4 p-md-5">
                <div className="mb-4 text-center">
                  <h2 className="fw-900 mb-1">Join FoodExpress</h2>
                  <p className="text-muted small">Create an account for a better experience</p>
                </div>

                {error && <Alert variant="danger" className="rounded-4 border-0 mb-4 py-3 small">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-premium">Full Name</Form.Label>
                    <div className="position-relative">
                      <FaUser className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                      <Form.Control
                        className="form-control-premium ps-5"
                        type="text"
                        name="name"
                        placeholder="John Doe"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-premium">Email Address</Form.Label>
                    <div className="position-relative">
                      <FaEnvelope className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                      <Form.Control
                        className="form-control-premium ps-5"
                        type="email"
                        name="email"
                        placeholder="name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-premium">Password</Form.Label>
                    <div className="position-relative">
                      <FaLock className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                      <Form.Control
                        className="form-control-premium ps-5"
                        type="password"
                        name="password"
                        placeholder="Min. 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="form-label-premium">Confirm Password</Form.Label>
                    <div className="position-relative">
                      <FaLock className="position-absolute translate-middle-y top-50 ms-3 text-muted" />
                      <Form.Control
                        className="form-control-premium ps-5"
                        type="password"
                        name="confirmPassword"
                        placeholder="Re-enter password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </Form.Group>

                  <Button
                    type="submit"
                    className="checkout-btn-premium w-100 py-3 mt-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <div className="text-center mt-4 pt-3 border-top">
                  <p className="mb-0 text-muted small">
                    Already have an account?{' '}
                    <Link to="/login" className="text-accent fw-bold text-decoration-none">
                      Sign In
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            <div className="text-center mt-4">
              <Link to="/" className="text-decoration-none text-muted small hover-accent">
                <FaArrowLeft className="me-2" /> Back to Home
              </Link>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;