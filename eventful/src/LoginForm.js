import React, { useState } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // Handle login with email and password
  const handleEmailLogin = async () => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // For simplicity, assume roles are stored in Firebase or your backend
      // In real-world scenarios, you'd fetch the user's role from a database or Firebase Firestore
      const userRole = role || 'Attendee'; // Default to 'Attendee' if no role is selected
      localStorage.setItem('role', userRole);

      setMessage('Login successful');
      navigate('/logged'); // Redirect to the "Logged" page after login
    } catch (error) {
      setMessage(`Login failed: ${error.message}`);
    }
  };

  // Handle login with Google
  const handleGoogleLogin = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Assume you retrieve the role from Firestore or your backend
      const userRole = role || 'Attendee'; // Default to 'Attendee' if no role is selected
      localStorage.setItem('role', userRole);

      setMessage('Google login successful');
      navigate('/logged'); // Redirect to the "Logged" page after login
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
      <h2>Login</h2>

      {/* Email and Password Login */}
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
      <button onClick={handleEmailLogin}>Login with Email</button>

      {/* Google Login */}
      <div>
        <button onClick={handleGoogleLogin}>Login with Google</button>
      </div>

      {/* Role Selection */}
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

      {/* Message Display */}
      <div>{message}</div>
    </div>
  );
}
