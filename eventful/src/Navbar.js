import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './logo.png';
import './Navbar.css';  // Ensure your CSS file is imported
import axios from 'axios';
import { url } from './baseUrl'; // Assuming you have a base URL setup for your API

export default function Navbar() {
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role'); // Clear role on logout
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');
  const isLoggedIn = token !== null;
  const isSubmitter = role === 'Submitter'; // Check if the role is "Submitter"
  const isAttendee = role === 'Attendee'; // Check if the role is "Attendee"

  const handleHomeClick = () => {
    if (isLoggedIn && !isSubmitter) {
      navigate('/attendee-dashboard'); // Redirect to attendee dashboard if not a Submitter
    } else {
      navigate('/'); // Redirect to home page if a Submitter
    }
  };

  // Function to handle search and fetch results from backend
  const handleSearch = async (event) => {
    event.preventDefault();

    if (search.trim() === '') {
      setSearchResults([]); // Clear results if search is empty
      return;
    }

    try {
      // Make an API request to your backend to search events by title
      const response = await axios.get(`${url}/api/search-events`, {
        params: { query: search },
      });

      if (response.status === 200) {
        setSearchResults(response.data); // Assuming response contains event data
      }
    } catch (error) {
      console.error('Error during search:', error);
      setSearchResults([]); // Clear results on error
    }
  };

  return (
    <nav className="navbar navbar-expand-lg bg-body-tertiary">
      <div className="container-fluid">
        <div className="navbar-content">
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <button
                className="nav-link active"
                onClick={handleHomeClick} // Handle home button click here
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'inherit',
                  fontSize: '1.25rem',
                  cursor: 'pointer'
                }}
              >
                Home
              </button>
            </li>
            {!isLoggedIn && (
              <>
                <button className="nav-link active" onClick={() => navigate('/login')}>
                  Login
                </button>
                <button className="nav-link active" onClick={() => navigate('/register')}>
                  Register
                </button>
              </>
            )}
            {/* Only show Submit button if user is a Submitter */}
            {isSubmitter && (
              <li className="nav-item">
                <button className="nav-link active" onClick={() => navigate('/submit')}>
                  Submit
                </button>
              </li>
            )}
            <li className="nav-item dropdown">
              <button
                className="nav-link dropdown-toggle"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                style={{ background: 'none', border: 'none', color: 'inherit' }}
              >
                Category
              </button>
              <ul className="dropdown-menu">
                <li><button className="dropdown-item" onClick={() => navigate('/')}>Arts & Crafts</button></li>
                <li><button className="dropdown-item" onClick={() => navigate('/')}>Outside</button></li>
                <li><button className="dropdown-item" onClick={() => navigate('/')}>Social</button></li>
              </ul>
            </li>
          </ul>
          <div className="navbar-logo-container">
            <button
              className="navbar-logo"
              onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none' }}
            >
              <img src={logo} alt="Logo" className="navbar-logo-img" />
            </button>
          </div>
          <form className="d-flex ms-auto" role="search" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
            <button
              className="btn btn-outline-success"
              type="submit"
            >
              Search
            </button>
          </form>
          {isLoggedIn && (
            <button className="btn btn-danger ms-2" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </div>

      {/* Display Search Results */}
      {searchResults.length > 0 && (
        <div className="search-results">
          <h4>Search Results:</h4>
          <ul>
            {searchResults.map((event) => (
              <li key={event.id}>
                <button onClick={() => navigate(`/event/${event.id}`)}>
                  {event.event_title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </nav>
  );
}
