import React from 'react';
import { Route, Routes } from 'react-router';
import Navbar from './Navbar';
import Home from './Homepage';

const isLoggedIn = localStorage.getItem('token') !== null;

const Logged = () => {
  return (
    <div>
        <Home />
    </div>
  );
};


export default Logged;
