import React from 'react';
import { BrowserRouter as Router, Routes,Route } from 'react-router-dom';
import './App.css';

import LandingPage from './pages/LandingPage';
import Home from './pages/Home';

function App() {
  return (
   
    <Router>
      <div className='bg-[#fbf7f4] custom-scrollbar '>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/Home" element={<Home />} />
  
        </Routes>
      </div>
    </Router>
    
  );
}

export default App;
