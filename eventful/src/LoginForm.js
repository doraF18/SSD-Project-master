import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from './firebase'; // Firebase auth and google provider setup
import { useNavigate } from 'react-router-dom';
import { getFirestore, doc, setDoc } from 'firebase/firestore'; // Firestore methods

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(''); // User role (Submitter/Attendee)
  const [message, setMessage] = useState('');
  const [isRegister, setIsRegister] = useState(false); // Switch between login and register form
  const navigate = useNavigate();
  const db = getFirestore(); // Firestore reference

  // Handle login with email and password
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the role in localStorage (if no role, default to 'Attendee')
      const userRole = role || 'Attendee'; 
      localStorage.setItem('role', userRole);

      setMessage('Login successful');
      navigate('/logged'); // Redirect to the "Logged" page after login
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  // Handle registration with email and password
  const handleRegister = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Set the user's role in Firestore (default role is 'Attendee')
      const userRole = role || 'Attendee';
      const userRef = doc(db, 'users', user.uid);
      await setDoc(userRef, { role: userRole });

      // Store the role in localStorage
      localStorage.setItem('role', userRole);

      setMessage('Registration successful. Please log in.');
      setIsRegister(false); // Switch back to login form
    } catch (error) {
      setMessage(`Registration failed: ${error.message}`);
    }
  };

  // Handle Google login
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Assume role is stored in localStorage or Firebase
      const userRole = role || 'Attendee'; 
      localStorage.setItem('role', userRole);

      setMessage('Google login successful');
      navigate('/logged'); // Redirect after Google login
    } catch (error) {
      setMessage(`Google login failed: ${error.message}`);
    }
  };

  // Handle role change
  const handleRoleChange = (event) => {
    setRole(event.target.value);
  };

  return (
    <div>
      <h2>{isRegister ? 'Register' : 'Login'}</h2>

      {/* Email and Password Login / Registration */}
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {isRegister ? (
        <button onClick={handleRegister}>Register</button> // Register button
      ) : (
        <button onClick={handleEmailLogin}>Login with Email</button> // Login button
      )}

      {/* Google Login */}
      <div>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>

      {/* Role Selection (for Registration) */}
      {isRegister && (
        <div>
          <label>Role</label>
          <div>
            <input
              type="radio"
              id="submitter"
              name="role"
              value="Submitter"
              checked={role === 'Submitter'}
              onChange={handleRoleChange}
            />
            <label htmlFor="submitter">Submitter</label>
          </div>
          <div>
            <input
              type="radio"
              id="attendee"
              name="role"
              value="Attendee"
              checked={role === 'Attendee'}
              onChange={handleRoleChange}
            />
            <label htmlFor="attendee">Attendee</label>
          </div>
        </div>
      )}

      {/* Switch between Login and Register */}
      <div>
        {isRegister ? (
          <button onClick={() => setIsRegister(false)}>Already have an account? Login</button>
        ) : (
          <button onClick={() => setIsRegister(true)}>Don't have an account? Register</button>
        )}
      </div>

      {/* Message Display */}
      <div>{message}</div>
    </div>
  );
}
