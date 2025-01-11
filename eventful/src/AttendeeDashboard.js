import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import './AttendeeDashboard.css'; // Optional: Add custom styles for AttendeeDashboard
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { url } from './baseUrl';

function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendedEvents, setAttendedEvents] = useState([]); // Track attended events
  const db = getFirestore();

  // Get current logged-in user ID
  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const q = query(collection(db, 'events'), orderBy('event_title', 'desc'));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        setError('Error fetching events');
        console.error('Error fetching events:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchUserHistory = async () => {
      if (!user) return; // If no user is logged in, return

      try {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
          const userHistory = userDoc.data().history || [];
          setAttendedEvents(userHistory); // Set attended events from user's history
        }
      } catch (error) {
        setError('Error fetching user history');
        console.error('Error fetching user history:', error);
      }
    };

    fetchEvents();
    fetchUserHistory();
  }, [db, user]);

  // Handle the attend button click and send the event ID to backend
  const handleAttend = async (eventId) => {
    try {
      if (!user) {
        alert("You must be logged in to attend an event.");
        return;
      }

      // Get the current user's ID token
      const token = await user.getIdToken();

      // Log token and eventId for debugging
      console.log('Sending event ID:', eventId);
      console.log('Using token:', token);

      // Send request to backend to add event ID to user's history
      const response = await axios.post(
        'http://localhost:3001/api/attend-event', // Replace with your backend URL (or dynamic)
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Send the token in Authorization header
          },
        }
      );

      if (response.status === 200) {
        setAttendedEvents((prev) => [...prev, eventId]); // Add the event to attended events
        alert('You have successfully registered for the event!');
      }
    } catch (error) {
      // Log the error response to better understand what went wrong
      console.error('Error registering for event:', error);

      // If error is a response from the backend, show detailed message
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'There was an error registering for the event.'}`);
      } else {
        alert('There was an error registering for the event.');
      }
    }
  };

  return (
    <div className="attendee-dashboard-container">
      <h1 className="attendee-dashboard-title">Attendee Dashboard</h1>
      {loading ? (
        <p>Loading events...</p>
      ) : error ? (
        <p>{error}</p>
      ) : events.length > 0 ? (
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              <h2 className="event-title">{event.event_title}</h2>
              <p className="event-description">{event.event_details}</p>
              <button
                className="attend-button"
                onClick={() => handleAttend(event.id)}
                style={{
                  backgroundColor: attendedEvents.includes(event.id) ? 'grey' : '#007bff', // Change color if attended
                  cursor: attendedEvents.includes(event.id) ? 'not-allowed' : 'pointer', // Disable pointer if attended
                }}
                disabled={attendedEvents.includes(event.id)} // Disable button if event is attended
              >
                {attendedEvents.includes(event.id) ? 'Attended' : 'Attend'} {/* Change button text */}
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p>No events available at the moment.</p>
      )}
    </div>
  );
}

export default AttendeeDashboard;
