import React from 'react';
import Spline from '@splinetool/react-spline';
import { TbMedicalCrossCircle } from "react-icons/tb";
import { Link } from 'react-router-dom';

function LandingPage() {
  return (
    <div className="h-screen relative flex items-center justify-center">
      {/* Centered h1 */}
      <h1 className="absolute text-header font-aqem font-extrabold mb-72 translate-y-20 z-20 text-center">
        SEK_
      </h1>
      <h1 className="absolute text-header mt-44 font-aqem font-extrabold translate-y-20 mb-10  text-center">
        *MED
      </h1>
      {/* Clickable Link */}
      <Link to="/home">
        <TbMedicalCrossCircle className=" animate-pulse z-50 font-aqem font-semibold translate-y-28 text-9xl rounded-full px-4 py-2 pt-3 mt-96 cursor-pointer" />
      </Link>
      {/* Background iframe */}
      <Spline
        className="absolute z-10 pointer-events-none" // Prevent Spline from capturing clicks
        scene="https://prod.spline.design/FzMIdQTMYmJo-FPI/scene.splinecode"
      />
    </div>
  );
}

export default LandingPage;
