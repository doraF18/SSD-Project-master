import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; // Import Firebase config
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore methods
import './Navbar.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const db = getFirestore(); // Firestore reference

  // Fetch user role after login
  const getUserRole = async (uid) => {
    const docRef = doc(db, 'users', uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return docSnap.data().role; // Get role from Firestore
    } else {
      console.error("No such document!");
      return 'attendee'; // Default role if not found
    }
  };

  // Handle email/password login
  const handleEmailLogin = async (event) => {
    event.preventDefault(); // Prevent default form submission
    console.log("Login button clicked"); // Debugging

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      localStorage.setItem('token', user.accessToken);

      // Fetch the user role and navigate based on it
      const userRole = await getUserRole(user.uid);
      localStorage.setItem('role', userRole); // Store the role in localStorage
      setMessage('Login successful');

      if (userRole === 'submitter') {
        navigate('/submitter-dashboard'); // Navigate to submitter dashboard
      } else {
        navigate('/attendee-dashboard'); // Navigate to attendee dashboard
      }
    } catch (error) {
      setMessage('Invalid credentials or error during login');
      console.error('Login error:', error); // Log any errors to the console for debugging
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    console.log("Google login button clicked"); // Debugging
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      localStorage.setItem('token', user.accessToken);

      // Fetch the user role and navigate based on it
      const userRole = await getUserRole(user.uid);
      localStorage.setItem('role', userRole); // Store the role in localStorage
      setMessage('Google login successful');

      if (userRole === 'submitter') {
        navigate('/submitter-dashboard');
      } else {
        navigate('/attendee-dashboard');
      }
    } catch (error) {
      setMessage('Error during Google login');
      console.error('Google login error:', error);
    }
  };

  // Redirect to the register page
  const handleRedirectToRegister = () => {
    navigate('/register'); // Redirect to /register route
  };

  return (
    <>
      <div className="row">
        <div className="col-2"></div>
        <div className="col-8">
          {/* Login Form */}
          <form onSubmit={handleEmailLogin}>
            <h3>Login</h3>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-text">Email address</label>
              <input 
                type="email" 
                className="form-control" 
                id="loginEmail" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input 
                type="password" 
                className="form-control" 
                id="loginPassword" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
              />
            </div>
            <button type="submit" className="btn btn-success">Login</button>
            <button type="button" className="btn btn-primary" onClick={handleGoogleLogin} style={{ marginLeft: '10px' }}>Login with Google</button>
            {/* Redirect to Register page */}
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={handleRedirectToRegister} 
              style={{ marginLeft: '10px' }}
            >
              Go to Register
            </button>
          </form>
          {message && <div className="alert alert-info mt-3">{message}</div>}
        </div>
        <div className="col-2"></div>
      </div>
    </>
  );
}
