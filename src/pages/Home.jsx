import React, { useState } from 'react';
import { LiaMapSolid } from "react-icons/lia";
import { GoHistory } from "react-icons/go";
import { AiOutlineFundView, AiOutlineUser } from "react-icons/ai";
import { FaPlus } from "react-icons/fa6";
import { PiBrainBold } from 'react-icons/pi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { TbMenu4 } from "react-icons/tb";
import VitalPage from './VitalPage.jsx';
import SymptomCheckerPage from './SymptomCheckerPage.jsx';
import { CgMenuMotion } from "react-icons/cg";
import { CgMenuLeft } from "react-icons/cg";


const Home = () => {
  const [isDisabled, setIsDisabled] = useState(true); // Example: Initially disabled
  const [activePage, setActivePage] = useState('symptom'); // Track the current active page
  const [isDropdownVisible, setIsDropdownVisible] = useState(false); // Track dropdown visibility
  const currentDate = new Date().toLocaleDateString(); // Current date
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  return (
    <div className="h-screen bg-white custom-scrollbar flex flex-col relative">
      {/* Navbar Section */}
      <div className="flex justify-between m-2 items-center pt-0">
        <div className="flex items-center relative">
          {/* Menu Button */}
          <div
            className="rounded-full flex font-sans  cursor-pointer"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            <h1 className="text-3xl font-cool font-semibold ml-2  text-zinc-800">
              sekmed*
            </h1>
          </div>
       
        </div>

        {/* Icons for Page Switching */}
        <div className="flex ">
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
      {/* Side Menu */}
      

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
