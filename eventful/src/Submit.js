import React, { useState } from 'react';

export default function Register() {
    const [eventName, setEventName] = useState('');
    const [eventDescription, setEventDescription] = useState('');
    const [eventImage, setEventImage] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const eventPayload = {
            event_title: eventName,
            event_details: eventDescription,
            event_photo: eventImage
        };

        try {
            const eventResponse = await fetch('https://apex.oracle.com/pls/apex/laluna/show/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(eventPayload),
            });

            if (!eventResponse.ok) {
                throw new Error('Network response was not ok');
            }

            const eventData = await eventResponse.json();
            console.log('Event submitted successfully:', eventData);
            setMessage('Event submitted successfully');
        } catch (error) {
            console.error('Error submitting event:', error);
            setMessage('Event submitted');
        }
    };

    return (
        <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
                <form onSubmit={handleSubmit}>
                    {/* Input fields for registration */}
                </form>
                <div>
                    <form onSubmit={handleSubmit}>
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
                            />
                        </div>
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
                            ></textarea>
                        </div>
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
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">
                            Submit Event
                        </button>
                        {message && <div className="alert alert-info mt-3">{message}</div>}
                    </form>
                </div>
            </div>
            <div className="col-2"></div>
        </div>
    );
}
