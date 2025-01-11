import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, orderBy, query, doc, getDoc } from 'firebase/firestore';
import './AttendeeDashboard.css';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import { url } from './baseUrl'; // Assuming baseUrl.js has the backend URL

function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attendedEvents, setAttendedEvents] = useState([]); // Track attended events
  const db = getFirestore();

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

      const token = await user.getIdToken();
      const response = await axios.post(
        `${url}/api/attend-event`, 
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAttendedEvents((prev) => [...prev, eventId]); // Add event to attended list
        alert('You have successfully registered for the event!');
      }
    } catch (error) {
      console.error('Error registering for event:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'There was an error registering for the event.'}`);
      } else {
        alert('There was an error registering for the event.');
      }
    }
  };

  // Handle the unattend button click and remove event ID from user's history
  const handleUnattend = async (eventId) => {
    try {
      if (!user) {
        alert("You must be logged in to unattend an event.");
        return;
      }

      const token = await user.getIdToken();
      const response = await axios.post(
        `${url}/api/unattend-event`, // New backend route to handle unattending
        { eventId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        setAttendedEvents((prev) => prev.filter((id) => id !== eventId)); // Remove event from attended list
        alert('You have successfully unattended the event!');
      }
    } catch (error) {
      console.error('Error removing from attended events:', error);
      if (error.response) {
        alert(`Error: ${error.response.data.message || 'There was an error removing the event from your history.'}`);
      } else {
        alert('There was an error removing the event from your history.');
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
              {attendedEvents.includes(event.id) ? (
                <button
                  className="unattend-button"
                  onClick={() => handleUnattend(event.id)}
                  style={{
                    backgroundColor: 'grey',
                    cursor: 'pointer',
                  }}
                >
                  Unattend
                </button>
              ) : (
                <button
                  className="attend-button"
                  onClick={() => handleAttend(event.id)}
                  style={{
                    backgroundColor: '#007bff',
                    cursor: 'pointer',
                  }}
                >
                  Attend
                </button>
              )}
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
