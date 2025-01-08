import React, { useState } from 'react';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; // Import Firebase config
import { useNavigate } from 'react-router-dom';
import Logged from './Logged';
import './Navbar.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Toggle between login and register
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle email/password login
  const handleEmailLogin = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);
      setMessage('Login successful');
      navigate('/logged');
    } catch (error) {
      setMessage('Invalid credentials or error during login');
      console.error('Login error:', error);
    }
  };

  // Handle email/password registration
  const handleRegister = async (event) => {
    event.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setMessage('Registration successful. Please log in.');
      setIsRegister(false); // Switch back to login form
    } catch (error) {
      setMessage('Error during registration');
      console.error('Registration error:', error);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);
      setMessage('Google login successful');
      navigate('/logged');
    } catch (error) {
      setMessage('Error during Google login');
      console.error('Google login error:', error);
    }
  };

  return (
    <>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          {isRegister ? (
            // Registration Form
            <form onSubmit={handleRegister}>
              <h3>Register</h3>
              <div className="mb-3">
                <label htmlFor="registerEmail" className="form-text">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="registerEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="registerPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="registerPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Register
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsRegister(false)} // Switch back to login
                style={{ marginLeft: '10px' }}
              >
                Switch to Login
              </button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleEmailLogin}>
              <h3>Login</h3>
              <div className="mb-3">
                <label htmlFor="loginEmail" className="form-text">
                  Email address
                </label>
                <input
                  type="email"
                  className="form-control"
                  id="loginEmail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="loginPassword" className="form-label">
                  Password
                </label>
                <input
                  type="password"
                  className="form-control"
                  id="loginPassword"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <button type="submit" className="btn btn-success">
                Login
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleGoogleLogin}
                style={{ marginLeft: '10px' }}
              >
                Login with Google
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => navigate('/register')} // Redirect to register page
                style={{ marginLeft: '10px' }}
              >
                Switch to Register
              </button>
            </form>
          )}
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
        <div className="col-2"></div>
      </div>
    </>
  );
}
