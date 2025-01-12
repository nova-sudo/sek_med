import React from 'react';
import Spline from '@splinetool/react-spline';
import { TbMedicalCrossCircle } from "react-icons/tb";
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className=" h-screen relative flex items-center justify-center">
      {/* Centered h1 */}
      <h1 className="absolute 
      sm:text-9xl 
      md:text-header md:mb-72 md:mt-0
      text-9xl
      font-aqem font-extrabold  mb-80 mt-12 translate-y-20 z-20 text-center">
        SEK_
      </h1>
      <h1 className="
      absolute 
      sm:text-9xl 
      md:text-header md:mt-44
      text-9xl
      mb-16
      font-aqem font-extrabold mt-10 translate-y-20  text-center">
        *MED
      </h1>
      {/* Clickable Link */}
      <Link to="/home">
        <TbMedicalCrossCircle className=" md:mt-[500px]  animate-pulse z-50 font-aqem font-semibold translate-y-28 text-9xl mb-44 rounded-full px-4 py-2 pt-3 mt-96 cursor-pointer" />
      </Link>
      {/* Background iframe */}
      <Spline
        className="absolute z-10 pointer-events-none" // Prevent Spline from capturing clicks
        scene="https://prod.spline.design/FzMIdQTMYmJo-FPI/scene.splinecode"
        width="100%"
        height="100%"
      />
    </div>
  );
}

export default LandingPage;
