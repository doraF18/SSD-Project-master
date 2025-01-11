import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import './SubmitterDashboard.css';

function SubmitterDashboard() {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  });

  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    // Listen for authentication changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        window.location.href = '/login'; // Redirect to login if not authenticated
      }
    });

    return () => unsubscribe();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;

    try {
      await addDoc(collection(db, 'events'), {
        ...formData,
        userId: user.uid,
        createdAt: new Date(),
      });
      alert('Event submitted successfully!');
      setFormData({ title: '', description: '' });
    } catch (error) {
      console.error('Error submitting event:', error);
    }
  };

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Welcome to the Submitter Dashboard</h2>
      {user && (
        <div className="user-info">
          <p>Logged in as: <strong>{user.email}</strong></p>
        </div>
      )}
      <form className="event-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Title</label>
          <input
            type="text"
            name="title"
            className="form-input"
            value={formData.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Description</label>
          <textarea
            name="description"
            className="form-textarea"
            value={formData.description}
            onChange={handleInputChange}
            required
          />
        </div>
        <button className="submit-button" type="submit">Submit Event</button>
      </form>
    </div>
  );
}

export default SubmitterDashboard;