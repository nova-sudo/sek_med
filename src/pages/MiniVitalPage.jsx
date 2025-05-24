import React, { useEffect, useState } from 'react';
import { FaHeartbeat, FaFire, FaWalking } from 'react-icons/fa';
import { GiFootsteps } from 'react-icons/gi';
import { useVitals } from '../contexts/VitalsContext';

const MiniVitalPage = ({ externalToken }) => {
  const [summaries, setSummaries] = useState({
    current_heart_rate: '--',
    current_steps: '--',
    current_calories: '--',
    current_distance: '--',
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const { setVitals } = useVitals();

  useEffect(() => {
    if (externalToken) {
      setAccessToken(externalToken);
      setIsLoggedIn(true);
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const tokenFromURL = params.get('token');
    if (tokenFromURL) {
      setAccessToken(`Bearer ${tokenFromURL}`);
      setIsLoggedIn(true);
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      setIsLoggedIn(false);
    }
  }, [externalToken]);

  useEffect(() => {
    if (!accessToken) return;
    fetchActivitySummary();
  }, [accessToken]);

  useEffect(() => {
    setVitals({ summaries });
  }, [summaries, setVitals]);

  const fetchActivitySummary = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || 'https://sekmed-fitbit2.vercel.app';
      const response = await fetch(`${baseUrl}/api/data/activity_summary`, {
        headers: { Authorization: accessToken },
      });
      const data = await response.json();
      if (data.summary) {
        setSummaries({
          current_heart_rate: data.summary.restingHeartRate?.toString() || '--',
          current_steps: formatNumber(data.summary.steps || 0),
          current_calories: formatNumber(data.summary.caloriesOut || 0),
          current_distance: data.summary.distances
            ? (() => {
                const totalDist = data.summary.distances.find((d) => d.activity === 'total');
                return totalDist ? Number(totalDist.distance).toFixed(2) : '--';
              })()
            : '--',
        });
      }
    } catch (error) {
      console.error('Error fetching activity summary:', error);
    }
  };

  const formatNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  if (!isLoggedIn) {
    return null; // Don't render anything if not logged in
  }

  return (
    <div className="bg-zinc-900 shadow rounded-2xl p-4 font-pixel text-white">
      <h2 className="text-lg font-bold mb-3">Vital Summary</h2>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center gap-2">
          <FaHeartbeat className="text-white" />
          <div>
            <div className="text-sm font-semibold">Heart Rate</div>
            <div className="text-lg font-bold">{summaries.current_heart_rate} BPM</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaWalking className="text-white" />
          <div>
            <div className="text-sm font-semibold">Steps</div>
            <div className="text-lg font-bold">{summaries.current_steps}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <FaFire className="text-white" />
          <div>
            <div className="text-sm font-semibold">Calories</div>
            <div className="text-lg font-bold">{summaries.current_calories}</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <GiFootsteps className="text-white" />
          <div>
            <div className="text-sm font-semibold">Distance</div>
            <div className="text-lg font-bold">{summaries.current_distance} km</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiniVitalPage;