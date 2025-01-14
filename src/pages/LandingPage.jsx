import React from 'react';
import Spline from '@splinetool/react-spline';
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
        <button className="font-cool md:mt-[500px] md:text-4xl bg-black text-white rounded-full hover:ring-2 hover:ring-black hover:bg-white hover:text-black  animate-pulse z-50   translate-y-28 text-2xl mb-44  px-4 py-2 mt-96 cursor-pointer">
          Get Started
        </button>
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
