import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, orderBy, query, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import './AttendeeDashboard.css'; // Optional: Add custom styles for AttendeeDashboard

function AttendeeDashboard() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const db = getFirestore();

  // Assuming you have the attendee ID somehow (could be passed via props or from user authentication)
  const attendeeId = "attendee_123"; // Example attendee ID

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

    fetchEvents();
  }, [db]);

  // Handle the attend button click
  const handleAttend = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        attendees: arrayUnion(attendeeId), // Add the attendee ID to the attendees array
      });
      alert('You have successfully registered for the event!');
    } catch (error) {
      console.error('Error registering for event:', error);
      alert('There was an error registering for the event.');
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
              >
                Attend
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
