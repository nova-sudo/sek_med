import React, { useEffect, useState } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, Title, Tooltip, Legend, PointElement } from 'chart.js';

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
    fetch('http://localhost:8888/api/fit_vitals') // Replace with your API URL
      .then((response) => response.json())
      .then((data) => {
        const now = new Date();
        const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000); // 24 hours ago

        // Filter the data for the last 24 hours
        const filteredData = {
          heart_rate: data.heart_rate.filter((item) => new Date(item.start_time) >= oneDayAgo),
          step_count: data.step_count.filter((item) => new Date(item.start_time) >= oneDayAgo),
          calories: data.calories.filter((item) => new Date(item.start_time) >= oneDayAgo),
          distance: data.distance.filter((item) => new Date(item.start_time) >= oneDayAgo),
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
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
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
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
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
        backgroundColor: 'rgba(153, 102, 255, 0.5)',
        borderColor: 'rgba(153, 102, 255, 1)',
        borderWidth: 2,
      },
    ],
  };

  return (
    <div>
      <h1>Vitals Dashboard</h1>

      <div>
        <h2>Steps</h2>
        <Bar data={stepsData} />
      </div>

      <div>
        <h2>Heart Rate</h2>
        <Line data={heartRateData} />
      </div>

      <div>
        <h2>Calories Burnt</h2>
        <Bar data={caloriesData} />
      </div>

      <div>
        <h2>Distance Covered</h2>
        <Line data={distanceData} />
      </div>
    </div>
  );
};

export default VitalPage;
