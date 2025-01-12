import React, { useState } from 'react';
import Navbar from '../components/Navbar.jsx';
import { LiaMapSolid } from "react-icons/lia";
import { GoHistory } from "react-icons/go";
import { AiOutlineFundView } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { PiBrainBold } from 'react-icons/pi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { FiBell } from 'react-icons/fi';
import { RiMenu5Line } from 'react-icons/ri';
import VitalPage from '../components/VitalPage.jsx';
import SymptomCheckerPage from '../components/SymptomCheckerPage.jsx';

const Home = () => {
  const [activePage, setActivePage] = useState('symptom'); // Track the current active page
  const currentDate = new Date().toLocaleDateString(); // Current date

  return (
    <div className="h-screen bg-[#fbf7f4] custom-scrollbar flex flex-col">
      {/* Navbar Section */}
      <div className="flex justify-between items-center px-5">
        {/* Left Navbar - Logo and Page Selectors */}
        <div className="flex items-center">
          <div className="ring-1 ring-gray-200 rounded-full flex font-sans font-semibold pl-1 px-3 max-w-44 py-1 max-h-36">
            <div className="h-10 w-10 rounded-full ml-0 pl-0 ring-1 ring-gray-200" />
            <h1 className="text-lg ml-3 mt-[6px] font-semibold font-pixel">
              SEKMED <span className='text-xs'>_nova_</span>
            </h1>
          </div>

          {/* Icons for Page Switching */}
          <div className="flex ml-2">
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

        {/* Right Navbar - Notifications */}
        <div className="flex justify-end">
          <div className="ring-1 ring-gray-200 rounded-full flex font-sans font-semibold pl-1 px-3 max-w-44 py-1 max-h-36 my-5 mx-4">
            <div className="h-10 w-10 rounded-full pl-0 bg-gray-100 ring-1 ring-gray-200">
              <FiBell className="m-[10px] ml-[10.5px] text-lg" />
            </div>
            <h1 className="text-lg ml-3 m-1 font-semibold font-pixel mt-[5px]">
              {currentDate}
            </h1>
            <div className="bg-black rounded-full w-6 h-4 mt-[11px]">
              <h1 className="text-xs text-white ml-[9px]">5</h1>
            </div>
          </div>
          <div className="bg-black h-10 w-10 mt-5 mr-2 rounded-full">
            <RiMenu5Line className="m-[5.5px] ml-[5.5px] text-3xl text-white" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex items-start mt-5">
        {/* Sidebar */}
        <div className="flex text-header flex-col justify-start mx-5 items-start flex-nowrap gap-6 bg-gray-100 w-12 p-[5.5px] rounded-full">
          <FaPlus className="text-4xl ring-1 ring-gray-200 bg-white rounded-full p-2" />
          <LiaMapSolid className="text-4xl ring-1 ring-gray-200 bg-white rounded-full p-2" />
          <GoHistory className="text-4xl ring-1 ring-gray-200 bg-white rounded-full p-2" />
          <AiOutlineFundView className="text-4xl ring-1 ring-gray-200 bg-white rounded-full p-2" />
        </div>

        {/* Main Content */}
        <div className="bg-neutral-200 w-11/12 rounded-3xl px-5">
          {activePage === 'vital' && <VitalPage />}
          {activePage === 'symptom' && <SymptomCheckerPage />}
        </div>
      </div>
    </div>
  );
};

export default Home;
