import React, { useState } from 'react';
import Login from './Login'
export default function Register() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('Attendee');
    const [isRegistered, setIsRegistered] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const payload = {
            user_email: email,
            user_password: password,
            user_role: role
        };

        try {
            const response = await fetch('https://apex.oracle.com/pls/apex/laluna/login/post', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            console.log('Success:', data);
            setIsRegistered(true); // Update state to indicate successful registration
        } catch (error) {
            console.error('Error:', error);
        }
    };

    return (
        <div className="row">
            <div className="col-2"></div>
            <div className="col-8">
                {!isRegistered ? (
                    <form onSubmit={handleSubmit}>
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

                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault1"
                                value="Attendee"
                                checked={role === 'Attendee'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="flexRadioDefault1">
                                Attendee
                            </label>
                        </div>
                        <div className="form-check">
                            <input
                                className="form-check-input"
                                type="radio"
                                name="flexRadioDefault"
                                id="flexRadioDefault2"
                                value="Submitter"
                                checked={role === 'Submitter'}
                                onChange={(e) => setRole(e.target.value)}
                            />
                            <label className="form-check-label" htmlFor="flexRadioDefault2">
                                Submitter
                            </label>
                        </div>

                        <br />
                        <button type="submit" className="btn btn-dark">
                          
                            Register
                        </button>
                    </form>
                ) : (
                    <div>
                        <p>Now log in to your account</p>
                        <button type="submit" className="btn btn-success">
                            Login
                        </button>
                    </div>
                )}
            </div>
            <div className="col-2"></div>
        </div>
    );
    
}
