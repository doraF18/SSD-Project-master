import React, { useState } from 'react';
import { Route, Routes } from 'react-router';
import { Link, useNavigate } from 'react-router-dom';
import Login from './Login';
import Register from './Register';
import Home from './Homepage';
import Submit from './Submit';
import logo from './logo.png';
import './Navbar.css';  // Make sure to import your CSS file

export default function Navbar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const token = localStorage.getItem('token');
  const isLoggedIn = token !== null;
  const isSubmitter = token === 'submitter_token';
  //const isAttendee = isLoggedIn && token === 'attendee_token';

  return (
    <>
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
                <Link className="nav-link active" to="/home">Home</Link>
              </li>
              {!isLoggedIn && (
              <>
                <Link className="nav-link active" to="/login">
                  Login
                </Link>
                <Link className="nav-link active" to="/register">
                  Register
                </Link>
              </>
            )}
            {isSubmitter && (
             <Link className="nav-link active" to="/submit">
             Submit
           </Link>
            )}
              <li className="nav-item dropdown">
                <Link className="nav-link dropdown-toggle" to="/" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                  Category
                </Link>
                <ul className="dropdown-menu">
                  <li><Link className="dropdown-item" to="/">Arts&Crafts</Link></li>
                  <li><Link className="dropdown-item" to="/">Outside</Link></li>
                  <li><Link className="dropdown-item" to="/">Social</Link></li>
                </ul>
              </li>
            </ul>
            <div className="navbar-logo-container">
              <Link className="navbar-logo" to="/home">
                <img src={logo} alt="Logo" className="navbar-logo-img" />
              </Link>
            </div>
            <form className="d-flex ms-auto" role="search">
              <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search" onChange={(event) => setSearch(event.target.value)} />
              <button className="btn btn-outline-success" type="submit" onClick={(event) => { event.preventDefault(); console.log(search) }}>Search</button>
            </form>
            <form>
            {isLoggedIn && (
              <button className="btn btn-danger" onClick={handleLogout}>
                Logout
              </button>
            )}
            </form>
          </div>
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/home' element={<Home searchValue={search} />} />
        <Route path='/submit' element={<Submit />} />
      </Routes>
    </>
  );
}
