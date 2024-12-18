import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './Navbar';
import Home from './Homepage';
import Logged from './Logged';
import Submit from './Submit';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>

        <Route path="/logged" element={<Logged />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

