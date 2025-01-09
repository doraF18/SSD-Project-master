import React, { useState } from 'react';
import { db, auth } from './firebase'; // Import Firestore and Firebase Auth
import { collection, addDoc } from 'firebase/firestore'; // Firestore functions
import { useNavigate } from 'react-router-dom'; // Navigation after submitting

export default function Register() {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventImage, setEventImage] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    // Handle submitting event data to Firebase Firestore
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Ensure the user is logged in
        if (!auth.currentUser) {
            setMessage('Please log in to submit an event');
            return;
        }

        const eventPayload = {
            event_title: eventName,
            event_details: eventDescription,
            event_photo: eventImage,
            user_id: auth.currentUser.uid, // Associate the event with the logged-in user
        };

        try {
            // Add event data to Firestore
            const docRef = await addDoc(collection(db, 'events'), eventPayload);
            console.log('Event submitted successfully:', docRef.id);
            setMessage('Event submitted successfully');
            setEventName('');
            setEventDescription('');
            setEventImage('');

            // Optionally navigate after successful submission (e.g., back to the event listing)
            navigate('/events'); // Change '/events' to your events page if needed
        } catch (error) {
            console.error('Error submitting event:', error);
            setMessage('Error submitting event');
        }
    };

    return (
        <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
                <form onSubmit={handleSubmit}>
                    {/* Event Name Input */}
                    <div className="mb-3">
                        <label htmlFor="eventName" className="form-label">
                            Event Name
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="eventName"
                            value={eventName}
                            onChange={(e) => setEventName(e.target.value)}
                            required
                        />
                    </div>

                    {/* Event Description Input */}
                    <div className="mb-3">
                        <label htmlFor="eventDescription" className="form-label">
                            Event Description
                        </label>
                        <textarea
                            className="form-control"
                            id="eventDescription"
                            rows="3"
                            value={eventDescription}
                            onChange={(e) => setEventDescription(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    {/* Event Image URL Input */}
                    <div className="mb-3">
                        <label htmlFor="eventImage" className="form-label">
                            Event Image URL
                        </label>
                        <input
                            type="text"
                            className="form-control"
                            id="eventImage"
                            value={eventImage}
                            onChange={(e) => setEventImage(e.target.value)}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary">
                        Submit Event
                    </button>
                </form>

                {/* Message Display */}
                {message && <div className="alert alert-info mt-3">{message}</div>}
            </div>
            <div className="col-2"></div>
        </div>
    );
}
