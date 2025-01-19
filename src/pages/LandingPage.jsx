import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';
import sekmed_logo from '../sekmed_big.png';
function LandingPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null); // State to store the install prompt event
  const [isInstallable, setIsInstallable] = useState(false); // State to track if app is installable

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault(); // Prevent automatic prompt
      setDeferredPrompt(e); // Save the event
      setIsInstallable(true); // Enable the install button
    };

    // Add the event listener
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      // Clean up the event listener
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Show the install prompt
      const { outcome } = await deferredPrompt.userChoice; // Wait for the user's choice
      console.log(`User choice: ${outcome}`);
      setDeferredPrompt(null); // Clear the saved prompt
      setIsInstallable(false); // Disable the install button
    }
  };

  return (
    <div className="h-screen relative flex items-center justify-center">
<img 
  src={sekmed_logo} 
  alt="Sekmed Logo" 
  className="absolute rotate-45 top-2 left-2 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 "
/>

      {/* Centered h1 */}
      <h1 className="absolute sm:text-9xl md:text-header md:mb-72 md:mt-0 text-9xl font-aqem font-extrabold mb-80 mt-12 translate-y-20 z-[60] text-center">
        SEK_
      </h1>
      <h1 className="absolute sm:text-9xl md:text-header md:mt-44 text-9xl mb-16 font-aqem font-extrabold mt-10 translate-y-20 text-center z-[60] ">
        *MED
      </h1>
      
      {/* Clickable Link */}
      <Link to="/home">
        <button className="font-cool  md:mt-[500px] md:text-4xl bg-black text-white rounded-full hover:ring-2 hover:ring-black hover:bg-white hover:text-black animate-pulse  translate-y-28 text-2xl mb-44 px-4 py-2 mt-96 ">
          Get Started
        </button>
      </Link>

      {/* Install Button */}
{isInstallable && (
  <button
    onClick={handleInstallClick}
    className="fixed top-5 right-5 z-[60] bg-black rounded-full md:text-2xl text-lg text-white px-4 py-2 font-cool shadow-lg hover:bg-white hover:ring-2 hover:ring-black hover:text-black"
  >
    Install App
  </button>
)}


      {/* Background iframe */}
      <Spline
        className="absolute z-50 pointer-events-none" // Prevent Spline from capturing clicks
        scene="https://prod.spline.design/cP9EAK5hihk29Fn7/scene.splinecode"
        width="100%"
        height="100%"
      />
    </div>
  );
}

export default LandingPage;
