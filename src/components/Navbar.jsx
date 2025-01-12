import React from 'react';
import { FiBell } from 'react-icons/fi';
import { RiEyeCloseLine } from 'react-icons/ri';
import { PiBrainBold } from 'react-icons/pi';
import { TbActivityHeartbeat } from 'react-icons/tb';
import { RiMenu5Line } from "react-icons/ri";

const Navbar = () => {
  const currentDate = new Date().toLocaleDateString(); // Get the current date

  return (
    <div className=" ">
      <div className="flex justify-between items-center px-5 ">
        {/* First section with "SEKMED" and Icons section */}
        <div className="flex items-center">
          {/* "SEKMED" section */}
          <div className="ring-1 ring-gray-200 rounded-full flex font-sans font-semibold pl-1 px-3 max-w-44 py-1 max-h-36">
            <div className="h-10 w-10 rounded-full ml-0 pl-0 ring-1 ring-gray-200" />
            <h1 className="text-lg ml-3 mt-[6px] font-semibold font-pixel">SEKMED <span className='text-xs'>_nova_</span></h1>
          </div>

          {/* Icons section next to SEKMED */}
          <div className="flex ml-2">
            <div className="flex items-start justify-start ring-1 ring-gray-200 rounded-full p-[2px]">
              <PiBrainBold className="text-4xl  m-1 ring-1 ring-gray-200 rounded-full p-2" />
              <TbActivityHeartbeat className="text-4xl m-1 ring-1 ring-gray-200 rounded-full p-2" />
            </div>
          </div>
        </div>

        {/* Bell with date and notification */}
        <div className="flex justify-end">
          <div className="ring-1 ring-gray-200 rounded-full flex font-sans font-semibold pl-1 px-3 max-w-44 py-1 max-h-36 my-5 mx-4">
            <div className="h-10 w-10 rounded-full pl-0 bg-gray-100 ring-1 ring-gray-200">
              <FiBell className="m-[10px] ml-[10.5px] text-lg" />
            </div>
            <h1 className="text-lg ml-3 m-1 font-semibold font-pixel mt-[5px]">{currentDate}</h1>
            <div className="bg-black rounded-full w-6 h-4 mt-[11px]">
              <h1 className="text-xs text-white ml-[9px]">5</h1>
            </div>
          </div>
          <div className='bg-black h-10 w-10 mt-5 mr-2 rounded-full '>
            <RiMenu5Line className='m-[5.5px] ml-[5.5px] text-3xl text-white'/>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
