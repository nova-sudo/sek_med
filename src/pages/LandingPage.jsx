import React, { useEffect, useState } from 'react';
import Spline from '@splinetool/react-spline';
import { Link } from 'react-router-dom';
import sekmed_logo from '../sekmed_big.png';
import Noise from '../Animations/Noise/Noise'
import SplitText from "../TextAnimations/SplitText/SplitText";


function LandingPage() {
  const [deferredPrompt, setDeferredPrompt] = useState(null); // State to store the install prompt event
  const [isInstallable, setIsInstallable] = useState(false); // State to track if app is installable
  const handleAnimationComplete = () => {
    console.log('All letters have animated!');
  };
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
    <div className="h-screen relative flex items-center justify-center overflow-y-hidden">
      
<img 
  src={sekmed_logo} 
  alt="Sekmed Logo" 
  className="absolute  opacity-100 z-[1200] rotate-45 top-2 left-2 w-16 sm:w-20 md:w-24 lg:w-28 xl:w-32 "
/>

      {/* Centered h1 */}
      <SplitText
  text="SEKMED"
  className="absolute md:ml-36 ml-6   sm:text-9xl md:text-[350px] md:mt-10 text-7xl mb-16 font-cool text-zinc-800 drop-shadow-lg font-extrabold mt-10  text-center z-[60] "
  delay={150}
  animationFrom={{ opacity: 0, transform: 'translate3d(0,50px,0)' }}
  animationTo={{ opacity: 1, transform: 'translate3d(0,0,0)' }}
  easing="easeOutCubic"
  threshold={0.2}
  rootMargin="-50px"
  onLetterAnimationComplete={handleAnimationComplete}
/>
     

      {/* Install Button */}
{isInstallable && (
  <button
    onClick={handleInstallClick}
    className="fixed top-5 right-5 z-[60] bg-White drop-shadow-md rounded-full md:text-2xl text-lg text-white px-4 py-2 font-cool shadow-lg hover:bg-white hover:ring-0 bg-zinc-800 hover:drop-shadow-xl  hover:text-zinc-800"
  >
    Install App
  </button>
)}
 


      {/* <Spline
        className="absolute pointer-events-none" // Prevent Spline from capturing clicks
        scene="https://prod.spline.design/cP9EAK5hihk29Fn7/scene.splinecode"
        width="100%"
        height="100%"
      /> */}
      <Noise
    patternSize={350}
    patternScaleX={4}
    patternScaleY={2}
    patternRefreshInterval={50}
    patternAlpha={15}
  />
  {/* Clickable Link */}
 <Link to="/home">
        <button className="font-cool z-[100] drop-shadow-md  md:mt-[550px] md:text-4xl bg-zinc-800   text-white rounded-full  hover:drop-shadow-2xl hover:ring-0 hover:bg-white hover:text-zinc-800 animate-pulse   text-2xl mb-44 px-4 py-2 mt-72 ">
          Get Started
        </button>
      </Link>
    </div>
    
  );
}

export default LandingPage;
