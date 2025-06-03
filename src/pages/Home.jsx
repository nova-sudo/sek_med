import React, { useState, useEffect } from 'react';
import { LiaMapSolid } from "react-icons/lia";
import { GoHistory } from "react-icons/go";
import { AiOutlineFundView, AiOutlineUser } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { PiBrainBold } from 'react-icons/pi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { TbMenu4 } from "react-icons/tb";
import { MdEmergency } from 'react-icons/md';
import VitalPage from './VitalPage.jsx';
import SymptomCheckerPage from './SymptomCheckerPage.jsx';
import { CgMenuMotion } from "react-icons/cg";
import { CgMenuLeft } from "react-icons/cg";
import axios from 'axios';

const Home = () => {
  const [isDisabled, setIsDisabled] = useState(false);
  const [activePage, setActivePage] = useState('symptom');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [fitbitToken, setFitbitToken] = useState('');
  const [location, setLocation] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');
    const viewFromURL = params.get('view');
    
    if (tokenFromURL) {
      setFitbitToken(`Bearer ${tokenFromURL}`);
      window.history.replaceState({}, document.title, '/home');
    }
    
    if (viewFromURL === 'vital') {
      setActivePage('vital');
    }

    // Get user location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => console.error('Geolocation error:', error)
      );
    }
  }, []);

  const handleVitalClick = () => {
    if (isDisabled) return;
    
    if (fitbitToken) {
      setActivePage('vital');
    } else {
      window.location.href = 'https://sekmed-fitbit2.vercel.app/api/authorize';
    }
  };

  const handleEmergencyClick = async () => {
    try {
      // Fallback to a default location or prompt user if geolocation fails
      const userLocation = location 
        ? `Latitude: ${location.latitude}, Longitude: ${location.longitude}`
        : 'Unknown location';
      
      // Make API call to your backend
      await axios.post('YOUR_BACKEND_URL/emergency-call', {
        to: '123', // Note: May not work; test with +20 number
        message: `Emergency! Please send medical assistance to ${userLocation}.`,
      });
      alert('Emergency call initiated.');
    } catch (error) {
      console.error('Error initiating emergency call:', error);
      // Fallback to tel: URI if API fails
      window.location.href = 'tel:123';
    }
  };

  return (
    <div className="h-screen bg-opacity-0 custom-scrollbar flex flex-col relative">
      {/* Navbar Section */}
      <div className="flex justify-between m-2 items-center pt-0">
        <div className="flex items-center relative">
          <div
            className="rounded-full flex font-sans cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <h1 className="text-3xl font-cool font-semibold ml-2 text-zinc-800">
              sekmed*
            </h1>
          </div>
        </div>

        <div className="flex">
          <div className="flex items-start justify-start ring-1 ring-gray-200 rounded-full">
            <PiBrainBold
              onClick={() => setActivePage('symptom')}
              className={`text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 cursor-pointer ${
                activePage === 'symptom' ? 'bg-zinc-900 text-white' : 'bg-white'
              }`}
            />
            <TbActivityHeartbeat
              onClick={handleVitalClick} 
              className={`text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 ${
                activePage === 'vital' ? 'bg-zinc-900 text-white' : 'bg-white'
              } ${
                isDisabled
                  ? 'opacity-50 cursor-not-allowed'
                  : 'cursor-pointer hover:bg-gray-200'
              }`}
            />
            <MdEmergency
              onClick={handleEmergencyClick}
              className="text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 cursor-pointer bg-red-500 text-white hover:bg-red-600"
              title="Call Emergency (123)"
            />
          </div>
        </div>
      </div>

      <div className="flex items-start">
        <div className="w-full rounded-3xl">
          {activePage === 'vital' && <VitalPage externalToken={fitbitToken} />}
          {activePage === 'symptom' && <SymptomCheckerPage />}
        </div>
      </div>
    </div>
  );
};

export default Home;