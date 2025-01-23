import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';
import { TbMedicalCrossCircle } from "react-icons/tb";

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement);

const VitalPage = () => {
  const [fitData, setFitData] = useState({
    heart_rate: [],
    step_count: [],
    calories: [],
    distance: [],
  });

  useEffect(() => {
    // Fetch data from the backend API
    fetch('https://symptofy.vercel.app/api/fit_vitals') // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        const twelveHoursAgo = new Date(now.getTime() - 12 * 60 * 60 * 1000); // 12 hours ago
  
        // Filter the data for the last 12 hours
        const filteredData = {
          heart_rate: data.heart_rate.filter((item) => new Date(item.start_time) >= twelveHoursAgo),
          step_count: data.step_count.filter((item) => new Date(item.start_time) >= twelveHoursAgo),
          calories: data.calories.filter((item) => new Date(item.start_time) >= twelveHoursAgo),
          distance: data.distance.filter((item) => new Date(item.start_time) >= twelveHoursAgo),
        };
  
        setFitData(filteredData);
      })
      .catch((error) => {
        console.error('Error fetching fit data:', error);
      });
  }, []);
  
  // Process data for charts
  const heartRateDataset = fitData.heart_rate.map((item) => item.value);
  const stepCountDataset = fitData.step_count.map((item) => item.value);
  const caloriesDataset = fitData.calories.map((item) => item.value);
  const distanceDataset = fitData.distance.map((item) => item.value);
  
  const heartRateLabels = fitData.heart_rate.map((item) => new Date(item.start_time).toLocaleTimeString());
  const stepCountLabels = fitData.step_count.map((item) => new Date(item.start_time).toLocaleTimeString());
  const caloriesLabels = fitData.calories.map((item) => new Date(item.start_time).toLocaleTimeString());
  const distanceLabels = fitData.distance.map((item) => new Date(item.start_time).toLocaleTimeString());
  
  // Bar Chart Data for Steps
  const stepsData = {
    labels: stepCountLabels,
    datasets: [
      {
        label: 'Steps',
        data: stepCountDataset,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 50,
      },
    ],
  };

  // Line Chart Data for Heart Rate
  const heartRateData = {
    labels: heartRateLabels,
    datasets: [
      {
        label: 'Heart Rate (BPM)',
        data: heartRateDataset,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 50,
        tension: 0.4, // Adds smooth curves between points
      },
    ],
  };

  // Bar Chart Data for Calories Burnt
  const caloriesData = {
    labels: caloriesLabels,
    datasets: [
      {
        label: 'Calories Burnt',
        data: caloriesDataset,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        borderRadius: 50,
      },
    ],
  };

  // Line Chart Data for Distance Covered
  const distanceData = {
    labels: distanceLabels,
    datasets: [
      {
        label: 'Distance Covered (km)',
        data: distanceDataset,
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
        tension: 0.4, // Adds smooth curves between points
        
      },
    ],
  };

  return (
    <div className=" ">
     <div className="flex items-center ml-2 py-4 ">
             <div className="h-10 w-10  rounded-full ring-1 ring-red-500 flex items-center justify-center">
               <TbMedicalCrossCircle size={24} className="text-red-500" />
               
             </div>
             <h1 className=" mx-2 text-[20px] md:text-2xl font-cool  font-bold text-gray-800">
               Vital Tracking
             </h1>
     
             
           </div> 

      

      <div className="grid grid-cols-1 bg-white rounded-3xl ring-1 ring-gray-300 sm:grid-cols-2 lg:grid-cols-2 " >
        
        <div className="md:h-[320px] md:w-[600px]  md:ml-16 md:pt-2">
       
          <Bar data={stepsData} />
        </div>
  
        <div className="md:h-[320px] md:w-[600px] md:ml-16 md:pt-2">
         
          <Line data={heartRateData} />
        </div>
  
        <div className="md:h-[320px] md:w-[600px] md:ml-16 md:pt-2">
          <Bar data={caloriesData} />
        </div>
  
        <div className="md:h-[320px] md:w-[600px] md:ml-16 md:pt-2">
          <Line data={distanceData} />
        </div>
      </div>
    </div>
  );
  
};

export default VitalPage;
