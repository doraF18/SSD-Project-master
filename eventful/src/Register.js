import React, { useState } from 'react'; 
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import { useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Attendee');
  const [isRegistered, setIsRegistered] = useState(false);
  const navigate = useNavigate();  // Hook to navigate between pages

  // Handle user registration with email/password
  const handleRegisterEmailPassword = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Store the user role (could be stored in Firestore for better persistence)
      localStorage.setItem('role', role);

      setIsRegistered(true);  // Mark registration as successful
    } catch (error) {
      console.error('Error registering:', error.message);
    }
  };

  // Handle Google registration/login
  const handleGoogleRegister = async () => {
    try {
      const userCredential = await signInWithPopup(auth, googleProvider);
      const user = userCredential.user;

      // Store user role in localStorage (can also be stored in Firestore)
      localStorage.setItem('role', role);

      setIsRegistered(true);  // Mark registration as successful
    } catch (error) {
      console.error('Google login failed:', error.message);
    }
  };

  // Handle role change (Attendee / Submitter)
  const handleRoleChange = (e) => {
    setRole(e.target.value);
  };

  return (
    <div className="row">
      <div className="col-2"></div>
      <div className="col-8">
        {/* If the user has registered, show a success message and offer to navigate to login */}
        {!isRegistered ? (
          <form onSubmit={handleRegisterEmailPassword}>
            <div className="mb-3">
              <label htmlFor="exampleInputEmail1" className="form-label">
                Email address
              </label>
              <input
                type="email"
                className="form-control"
                id="exampleInputEmail1"
                aria-describedby="emailHelp"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div id="emailHelp" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="exampleInputPassword1" className="form-label">
                Password
              </label>
              <input
                type="password"
                className="form-control"
                id="exampleInputPassword1"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* Role Selection */}
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="roleAttendee"
                value="Attendee"
                checked={role === 'Attendee'}
                onChange={handleRoleChange}
              />
              <label className="form-check-label" htmlFor="roleAttendee">
                Attendee
              </label>
            </div>
            <div className="form-check">
              <input
                className="form-check-input"
                type="radio"
                name="role"
                id="roleSubmitter"
                value="Submitter"
                checked={role === 'Submitter'}
                onChange={handleRoleChange}
              />
              <label className="form-check-label" htmlFor="roleSubmitter">
                Submitter
              </label>
            </div>

            <br />
            <button type="submit" className="btn btn-dark">
              Register with Email
            </button>
          </form>
        ) : (
          <div>
            <p>Registration successful! Now log in to your account.</p>
            <button
              type="button"
              className="btn btn-success"
              onClick={() => navigate('/login')}  // Navigate to login page
            >
              Go to Login
            </button>
          </div>
        )}

        <hr />

        {/* Google Registration Button */}
        <button onClick={handleGoogleRegister} className="btn btn-primary">
          Register with Google
        </button>

        <br /><br />

        {/* Switch to login button */}
        <button
          type="button"
          className="btn btn-link"
          onClick={() => navigate('/login')}  // Navigate to login page
        >
          Switch to Login
        </button>
      </div>
      <div className="col-2"></div>
    </div>
  );
}
