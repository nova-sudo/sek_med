import React, { useState } from 'react';
import { LiaMapSolid } from "react-icons/lia";
import { GoHistory } from "react-icons/go";
import { AiOutlineFundView } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { PiBrainBold } from 'react-icons/pi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { RiMenu5Line } from 'react-icons/ri';
import VitalPage from '../components/VitalPage.jsx';
import SymptomCheckerPage from '../components/SymptomCheckerPage.jsx';

const Home = () => {
  const [activePage, setActivePage] = useState('symptom'); // Track the current active page
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const currentDate = new Date().toLocaleDateString(); // Current date

  return (
    <div className="h-screen bg-[#fbf7f4] custom-scrollbar flex flex-col relative">
      {/* Navbar Section */}
      <div className="flex justify-between items-center px-5">
        {/* Left Navbar - Logo and Menu Button */}
        <div className="flex items-center mt-3 relative">
          <div
            className="ring-1 ring-gray-200 rounded-full flex font-sans font-semibold pl-1 px-3 py-1 max-w-44 cursor-pointer"
            onClick={() => setIsDropdownVisible(!isDropdownVisible)} // Toggle dropdown
          >
            <RiMenu5Line className="m-[5.5px] ml-[5.5px] text-3xl bg-black rounded-full p-1 text-white" />
            <h1 className="text-lg ml-3 mt-[6px] font-semibold font-pixel">
              SEKMED <span className="text-xs">_nova_</span>
            </h1>
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="absolute top-12 -left-2  rounded-md p-3 w-10 z-50">
              <div className="flex flex-col gap-3">
                <FaPlus
                  className="text-4xl bg-black ring-1 text-white ring-gray-200 rounded-full p-2 cursor-pointer"
                />
                <LiaMapSolid
                  className="text-4xl bg-black ring-1 text-white ring-gray-200 rounded-full p-2 cursor-pointer"
                />
                <GoHistory
                  className="text-4xl bg-black ring-1  text-white ring-gray-200 rounded-full p-2 cursor-pointer"
                />
                <AiOutlineFundView
                  className="text-4xl bg-black ring-1  text-white ring-gray-200 rounded-full p-2 cursor-pointer"
                />
              </div>
            </div>
          )}
        </div>

        {/* Icons for Page Switching */}
        <div className="flex ml-2 mt-2">
          <div className="flex items-start justify-start ring-1 ring-gray-200 rounded-full p-[2px]">
            <PiBrainBold
              onClick={() => setActivePage('symptom')}
              className={`text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 cursor-pointer ${
                activePage === 'symptom' ? 'bg-blue-200' : 'bg-white'
              }`}
            />
            <TbActivityHeartbeat
              onClick={() => setActivePage('vital')}
              className={`text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 cursor-pointer ${
                activePage === 'vital' ? 'bg-red-200' : 'bg-white'
              }`}
            />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex items-start mx-4 mt-5">
        {/* Main Content */}
        <div className="bg-neutral-200 w-full rounded-3xl px-5">
          {activePage === 'vital' && <VitalPage />}
          {activePage === 'symptom' && <SymptomCheckerPage />}
        </div>
      </div>
    </div>
  );
};

export default Home;
