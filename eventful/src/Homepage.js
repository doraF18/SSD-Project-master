import React, { useState, useEffect } from 'react';
import { getFirestore, collection, getDocs, orderBy, query } from 'firebase/firestore';
import './HomePage.css'; // Optional: Add custom styles for HomePage

function HomePage() {
  const [events, setEvents] = useState([]);
  const db = getFirestore();

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
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, [db]);

  return (
    <div className="homepage-container">
      <h1 className="homepage-title">All Events</h1>
      <div className="events-grid">
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="event-card">
              {/* Use event_title and event_details from Firestore */}
              <h2 className="event-title">{event.event_title}</h2>
              <p className="event-description">{event.event_details}</p>
            </div>
          ))
        ) : (
          <p className="no-events">No events available at the moment.</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;
