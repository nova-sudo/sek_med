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
  const [isDisabled, setIsDisabled] = useState(true); // Example: Initially disabled
  const [activePage, setActivePage] = useState('symptom'); // Track the current active page
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const currentDate = new Date().toLocaleDateString(); // Current date

  return (
    <div className="h-screen bg-white custom-scrollbar flex flex-col relative">
      {/* Navbar Section */}
      <div className="flex justify-between items-center pr-2 ml-2 mb-2 -translate-y-2 pt-0">
        {/* Left Navbar - Logo and Menu Button */}
        <div className="flex items-center relative">
          <div
            className="rounded-full flex font-sans    max-w-44 cursor-pointer"
            // onClick={() => setIsDropdownVisible(!isDropdownVisible)} // Toggle dropdown
          >
            <h1 className="text-3xl   font-cool font-bold m-4 text-black">
            SEKMED
            </h1>
          </div>

          {/* Dropdown Menu */}
          {isDropdownVisible && (
            <div className="absolute top-12 -left-[10.5px]  rounded-md p-3 w-10 z-50">
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
        <div className="flex ml-3 mt-4">
          <div className="flex items-start justify-start ring-1 ring-gray-200 rounded-full">
            <PiBrainBold
              onClick={() => setActivePage('symptom')}
              className={`text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 cursor-pointer ${
                activePage === 'symptom' ? 'bg-blue-200' : 'bg-white'
              }`}
            />
            <TbActivityHeartbeat
  onClick={() => {
    if (!isDisabled) setActivePage('vital');
  }}
  className={`text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2 ${
    activePage === 'vital' ? 'bg-red-200' : 'bg-white'
  } ${
    isDisabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer hover:bg-gray-200'
  }`}
/>

          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex items-start  bg-white   ">
        {/* Main Content */}
        <div className=" w-full rounded-3xl ">
          {activePage === 'vital' && <VitalPage/>}
          {activePage === 'symptom' && <SymptomCheckerPage  />}
        </div>
      </div>
    </div>
  );
};

export default Home;
