import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement,
  Title, Tooltip, Legend, PointElement,
  scales
} from 'chart.js';
import { FaHeartbeat, FaFire, FaWalking } from 'react-icons/fa';
import { useVitals } from '../contexts/VitalsContext'; 
import { GiFootsteps } from "react-icons/gi";


ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const VitalPage = ({ externalToken }) => {
  const [fitData, setFitData] = useState({
    heart_rate: [],
    step_count: [],
    calories: [],
    distance: [],
  });

  const [periods, setPeriods] = useState({
    heart_rate: '7d',
    steps: '7d',
    calories: '7d',
    distance: '7d',
  });

  const [loading, setLoading] = useState({
    heart_rate: false,
    steps: false,
    calories: false,
    distance: false,
  });

  const [summaries, setSummaries] = useState({
    current_heart_rate: '--',
    current_steps: '--',
    current_calories: '--',
    current_distance: '--',
  });

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [accessToken, setAccessToken] = useState('');

  // Context for sharing vitals with chat
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
    fetchAllData();
  }, [accessToken]);

  useEffect(() => {
    if (!accessToken) return;
    Object.entries(periods).forEach(([type, period]) => {
      fetchDataForType(type, period);
    });
  }, [periods, accessToken]);

  // Share latest vitals with Context whenever data changes
  useEffect(() => {
    if (
      fitData.heart_rate.length > 0 ||
      fitData.step_count.length > 0 ||
      fitData.calories.length > 0 ||
      fitData.distance.length > 0
    ) {
      setVitals({
        heart_rate: fitData.heart_rate,
        step_count: fitData.step_count,
        calories: fitData.calories,
        distance: fitData.distance,
        summaries
      });
    }
  }, [fitData, summaries, setVitals]);

  const fetchAllData = () => {
    Object.entries(periods).forEach(([type, period]) => {
      fetchDataForType(type, period);
    });
    fetchActivitySummary();
  };

  const fetchDataForType = async (type, period) => {
    setLoading(prev => ({ ...prev, [type]: true }));
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "https://sekmed-fitbit2.vercel.app";
      const endpointMap = {
        heart_rate: 'heart',
        steps: 'steps',
        calories: 'calories',
        distance: 'distance',
      };
      const endpoint = endpointMap[type];
      const response = await fetch(`${baseUrl}/api/data/${endpoint}?period=${period}`, {
        headers: { Authorization: accessToken }
      });
      const data = await response.json();

      if (type === 'heart_rate') {
        const heartData = data?.['activities-heart']?.map(item => ({
          dateTime: item.dateTime,
          value: item.value?.restingHeartRate || 0,
        })) || [];
        setFitData(prev => ({ ...prev, heart_rate: heartData }));
        if (heartData.length > 0) {
          const latestValue = heartData[heartData.length-1].value;
          if (latestValue) {
            setSummaries(prev => ({
              ...prev,
              current_heart_rate: latestValue.toString()
            }));
          }
        }
      } else if (type === 'steps') {
        setFitData(prev => ({
          ...prev,
          step_count: data['activities-steps'] || []
        }));
      } else if (type === 'calories') {
        setFitData(prev => ({
          ...prev,
          calories: data['activities-calories'] || []
        }));
      } else if (type === 'distance') {
        console.log('Raw distance data:', data); // Debug log
        try {
          const distanceData = data['activities-distance'] || [];
          console.log('Parsed distance data:', distanceData); // Debug log
          
          setFitData(prev => ({
            ...prev,
            distance: distanceData.map(item => ({
              dateTime: item.dateTime,
              value: parseFloat(item.value) || 0  // Ensure numeric values
            }))
          }));
        } catch (error) {
          console.error('Error parsing distance data:', error);
          setFitData(prev => ({ ...prev, distance: [] }));
        }
      }
    } catch (error) {
      console.error(`Error fetching ${type} data:`, error);
    } finally {
      setLoading(prev => ({ ...prev, [type]: false }));
    }
  };

  const fetchActivitySummary = async () => {
    try {
      const baseUrl = process.env.REACT_APP_API_URL || "https://sekmed-fitbit2.vercel.app";
      const response = await fetch(`${baseUrl}/api/data/activity_summary`, {
        headers: { Authorization: accessToken }
      });
      const data = await response.json();
      if (data.summary) {
        setSummaries(prev => ({
          ...prev,
          current_steps: formatNumber(data.summary.steps || 0),
          current_calories: formatNumber(data.summary.caloriesOut || 0),
          current_distance: data.summary.distances ? 
            (() => {
              const totalDist = data.summary.distances.find(d => d.activity === 'total');
              return totalDist ? Number(totalDist.distance).toFixed(2) : "--";
            })() : '--',
        }));
      }
    } catch (error) {
      console.error("Error fetching activity summary:", error);
    }
  };

  // Utility functions
  const formatNumber = (number) => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  const extractValues = (data, key = 'value') => data.map(item => Number(item[key]));
  const extractLabels = (data) => data.map(item => formatDate(item.dateTime || ''));

  const handlePeriodChange = (chartType, newPeriod) => {
    setPeriods(prev => ({
      ...prev,
      [chartType]: newPeriod
    }));
  };

  // Chart data configs
  const heartRateData = {
    labels: extractLabels(fitData.heart_rate),
    datasets: [{
      label: 'Heart Rate',
      data: extractValues(fitData.heart_rate),
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
      tension: 0.4,
    }],
  };

  const stepsData = {
    labels: extractLabels(fitData.step_count),
    datasets: [{
      label: 'Steps',
      data: extractValues(fitData.step_count),
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(255, 255, 255, 0)',
      borderWidth: 2,
      borderRadius: 50,
    }],
  };

  const caloriesData = {
    labels: extractLabels(fitData.calories),
    datasets: [{
      label: 'Calories Burned',
      data: extractValues(fitData.calories),
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(255, 255, 255, 0)',
      borderWidth: 2,
      borderRadius: 50,
    }],
  };

  const distanceData = {
    labels: extractLabels(fitData.distance),
    datasets: [{
      label: 'Distance (km)',
      data: extractValues(fitData.distance),
      backgroundColor: 'rgba(255, 255, 255, 1)',
      borderColor: 'rgba(255, 255, 255, 1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
    }],
  };

const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        legend: {
            display: false,
            labels: {
                color: '#e4e4e7', // zinc-100
                font: {
                    family: 'pixel',
                    size: 14,
                    style: 'pixel', // Options: 'normal', 'italic', 'oblique'
                    weight: '500' // Medium weight for modern look
                }
            }
        },
        tooltip: {
            titleColor: '#e4e4e7', // zinc-100
            bodyColor: '#e4e4e7', // zinc-100
            backgroundColor: 'rgba(1, 1, 1, 0.8)',
            titleFont: {
                family: 'pixel',
                size: 13,
                style: 'normal', // Italic for emphasis in tooltips
                weight: '600'
            },
            bodyFont: {
                family: 'pixel',
                size: 12,
                style: 'normal',
                weight: '400'
            }
        }
    },
    scales: {
        y: {
            beginAtZero: true,
            grid: {
                color: 'rgba(200, 200, 200, 0)', // Transparent grid
            },
            ticks: {
                color: '#e4e4e7', // zinc-100
                font: {
                    family: 'pixel',
                    size: 16,
                    style: 'normal',
                    weight: '400'
                }
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                color: '#e4e4e7', // zinc-100
                font: {
                    family: 'pixel',
                    size: 16,
                    style: 'normal',
                    weight: '400'
                }
            }
        }
    },
    backgroundColor: '#18181b' // zinc-900 for chart background
};

  const renderPeriodButtons = (chartType) => {
    const periodOptions = [
      { value: '1d', label: 'Daily' },
      { value: '7d', label: 'Weekly' },
      { value: '30d', label: 'Monthly' }
    ];
    return (
      <div className="flex justify-center font-pixel font-bold  space-x-2 my-3">
        {periodOptions.map(option => (
          <button
            key={option.value}
            onClick={() => handlePeriodChange(chartType, option.value)}
            className={`px-3 py-1 text-md rounded-full transition-colors ${
              periods[chartType] === option.value
                ? 'bg-gray-100 text-gray-700 '
                : 'bg-zinc-900  text-white hover:bg-zinc-400 hover:text-zinc-700'
            }`}
          >
            {option.label}
          </button>
        ))}
      </div>
    );
  };

  const renderLoadingIndicator = (chartType) => {
    if (!loading[chartType]) return null;
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-70 z-10 rounded-lg">
        <div className="w-10 h-10 border-4 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen py-16">
        {/* ... your welcome card ... */}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 px-4 font-pixel py-4">

      

      {/* Distance Card */}
      <div className="bg-zinc-900 shadow rounded-2xl p-6 dashboard-card">
        <h2 className="text-xl font-bold flex items-center text-white mb-4 gap-2">
          <span role="img" aria-label="distance" className="text-white"><GiFootsteps className='text-lg' />
</span> Distance Covered
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="metric-card flex-1 flex flex-col justify-center items-center mb-4 md:mb-0">
            <div className="text-white font-semibold">Today's Distance</div>
            <div className="text-white text-3xl font-bold">{summaries.current_distance} km</div>
            <div className="text-xs text-white">Total Distance Today</div>
          </div>
          <div className="flex-[3]">
            {renderPeriodButtons('distance')}
            <div className="h-[280px] relative bg-zinc-900 rounded-lg">
              {fitData.distance.length <= 1 ? (
                <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                  Not enough data points to display chart. Try a longer time period.
                </div>
              ) : (
                <Line 
                  data={{
                    labels: fitData.distance.map(item => formatDate(item.dateTime || '')),
                    datasets: [{
                      label: 'Distance (km)',
                      data: fitData.distance.map(item => parseFloat(item.value) || 0),
                      backgroundColor: 'rgba(255, 255, 255, 1)',
                      borderColor: 'rgba(255, 255, 255, 1)',
                      borderWidth: 2,
                      tension: 0.4,
                      fill: true,
                      pointRadius: 4,
                      pointBackgroundColor: 'rgba(0, 0, 0, 1)'
                    }]
                  }} 
                  options={{
                    ...chartOptions,
                    scales: {
                      ...chartOptions.scales,
                      y: {
                        ...chartOptions.scales.y,
                        title: {
                          display: true,
                          text: 'Distance (km)'
                        },
                        min: 0,
                        suggestedMax: Math.max(...fitData.distance.map(item => parseFloat(item.value) || 0)) * 1.2 || 1,
                      }
                    }
                  }} 
                />
              )}
              {renderLoadingIndicator('distance')}
            </div>
          </div>
        </div>
      </div>

      {/* Steps Card */}
      <div className="bg-zinc-900 shadow rounded-2xl p-6 dashboard-card">
        <h2 className="text-xl font-bold flex text-white items-center mb-4 gap-2">
          <FaWalking className="text-white" /> Steps Activity
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="metric-card flex-1 flex flex-col justify-center items-center mb-4 md:mb-0">
            <div className="text-white font-semibold">Today's Steps</div>
            <div className="text-white text-3xl font-bold">{summaries.current_steps}</div>
            <div className="text-xs text-white">Total Steps Today</div>
          </div>
          <div className="flex-[3]">
            {renderPeriodButtons('steps')}
            <div className="h-[280px] relative bg-zinc-900 rounded-lg">
              <Bar data={stepsData} options={chartOptions} />
              {renderLoadingIndicator('steps')}
            </div>
          </div>
        </div>
      </div>

      {/* Calories Card */}
      <div className="bg-zinc-900 shadow rounded-2xl p-6 dashboard-card">
        <h2 className="text-xl font-bold text-white flex items-center mb-4 gap-2">
          <FaFire className="text-white" /> Calories Burned
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="metric-card flex-1 flex flex-col justify-center items-center mb-4 md:mb-0">
            <div className="text-white font-semibold">Today's Calories</div>
            <div className="text-white text-3xl font-bold">{summaries.current_calories}</div>
            <div className="text-xs text-white">Total Calories Burned</div>
          </div>
          <div className="flex-[3]">
            {renderPeriodButtons('calories')}
            <div className="h-[280px] relative bg-zinc-900 rounded-lg">
              <Bar data={caloriesData} options={chartOptions} />
              {renderLoadingIndicator('calories')}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default VitalPage;