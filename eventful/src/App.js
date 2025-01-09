import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Homepage';
import Logged from './Logged';
import Submit from './Submit';
import Login from './Login'; // Make sure Login is imported
import Register from './Register'; // Make sure Register is imported
import AttendeeDashboard from './AttendeeDashboard'; // Make sure AttendeeDashboard is imported
import SubmitterDashboard from './SubmitterDashboard'; // Make sure SubmitterDashboard is imported

function App() {
  return (
    <BrowserRouter>
      {/* Navbar should be rendered outside of routes to avoid duplicate rendering */}
      <Navbar />

      <Routes>
        {/* Define the routes for different components */}
        <Route path="/" element={<Home />} />  {/* Home page route */}
        <Route path="/login" element={<Login />} />  {/* Login page */}
        <Route path="/register" element={<Register />} />  {/* Register page */}
        <Route path="/logged" element={<Logged />} />  {/* Logged page */}
        <Route path="/submitter-dashboard" element={<SubmitterDashboard />} />  {/* Submitter dashboard */}
        <Route path="/attendee-dashboard" element={<AttendeeDashboard />} />  {/* Attendee dashboard */}
        <Route path="/submit" element={<Submit />} />  {/* Submit page */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
