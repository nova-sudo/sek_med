import React from 'react';
import { GoClock } from "react-icons/go";
import { Bar } from 'react-chartjs-2'; // Import Chart.js Bar Chart
import { Doughnut } from 'react-chartjs-2'; // Import Chart.js Doughnut Chart
import { Line } from 'react-chartjs-2'; // Import Line Chart from Chart.js
import { Radar } from 'react-chartjs-2'; // Import Radar Chart from Chart.js
import { Chart as ChartJS,RadialLinearScale, CategoryScale, LinearScale, BarElement, DoughnutController, ArcElement, Title, Tooltip, Legend, PointElement, LineElement, RadarController } from 'chart.js'; // Corrected import for Radar and other charts
// Import Material-UI components
import Stack from '@mui/material/Stack';

ChartJS.register(CategoryScale,RadialLinearScale, LinearScale, BarElement, DoughnutController, ArcElement, Title, Tooltip, Legend, PointElement, LineElement, RadarController);

const VitalPage = () => {

    
  // Stamina Radar Chart Data
  const staminaData = {
    labels: ['Endurance', 'Strength', 'Speed', 'Agility', 'Flexibility'],
    datasets: [
      {
        label: 'Stamina',
        data: [75, 85, 90, 70, 80],
        borderColor: 'rgb(220, 20, 60)', // Line color (blue)
        backgroundColor: 'rgba(220, 20, 60, 0.2)', // Background color (for the area inside the radar)
        fill: true,
        borderWidth: 2,
      
      },
    ],
  };

  const staminaOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Stamina Radar Chart',
        font: {
          size: 24,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
    },
    
  };


  // Add a dataset for the calories burnt pie chart
  const caloriesBurntData = {
    labels: ['Calories Burnt        ', 'Remaining Calories'],
    datasets: [
      {
        data: [70, 30], // 70% burnt and 30% remaining
        backgroundColor: ['rgba(220, 20, 60, 0.5)', 'rgba(128, 128, 128, 0.5)'], // Green for oxygen, gray for remaining
        borderColor: ["rgb(220, 20, 60)", "rgb(128, 128, 128)"],
        borderWidth: 2,
      },
    ],
  };

  // Options for the calories burnt pie chart
  const caloriesPieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: 'Calories Burnt',
        font: {
          size: 24,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `${tooltipItem.label}: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // Data for Weekly Steps
  const weeklyStepsData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'], // Labels for X-axis
    datasets: [
      {
        label: 'Weekly Steps',
        data: [6000, 5000, 1500, 2500, 4700, 5500, 3800], // Steps data
        backgroundColor: 'rgba(220, 20, 60, 0.5)', // Bar color with 50% opacity
        borderColor: 'rgb(220, 20, 60)', // Border color of bars
        borderWidth: 2,
        borderRadius: 50, // Rounding the corners of the bars
      },
    ],
  };

  // Doughnut Chart Data for 98% Oxygen Level
  const oxygenLevelData = {
    labels: ['Oxygen perc     ', 'Remaining perc'],
    datasets: [
      {
        data: [98, 2], // 98% oxygen and 2% remaining
        backgroundColor: ['rgba(220, 20, 60, 0.5)', 'rgba(128, 128, 128, 0.5)'], // Green for oxygen, gray for remaining
        borderColor: ["rgb(220, 20, 60)", "rgb(128, 128, 128)"],
        borderWidth: 2, // No border for the doughnut
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false, // Set to false to allow custom width/height
    aspectRatio: 1, // You can adjust the ratio as needed (1 means square shape)
    plugins: {
      title: {
        display: true,
        text: 'Oxygen',
        font: {
          size: 24,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Oxygen: ${tooltipItem.raw}%`;
          },
        },
      },
    },
  };

  // Chart options for the Bar chart
  const chartOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Weekly Steps',
        font: {
          size: 24,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Day: ${tooltipItem.label} \nSteps: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days of the Week',
          font: {
            size: 14,
            weight: 'bold',
            family: 'pixel, sans-serif',
          },
        },
        ticks: {
          font: {
            size: 12,
            family: 'pixel, sans-serif',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'Steps',
          font: {
            size: 14,
            weight: 'bold',
            family: 'pixel, sans-serif',
          },
        },
        ticks: {
          font: {
            size: 12,
            family: 'pixel, sans-serif',
          },
        },
      },
    },
  };

  // Heart BPM (Beats Per Minute) Data
  const heartBpmData = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        label: 'Heart BPM',
        data: [72, 75, 70, 80, 85, 90, 78],
        backgroundColor: 'rgba(220, 20, 60, 0.5)', // Green for oxygen, gray for remaining
        borderColor: "rgb(220, 20, 60)",
        fill: true, // Fill the area under the line
        tension: 0.4, // Smooth curve for the line
        borderWidth: 2, // Line width
      },
    ],
  };

  const heartBpmOptions = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'Heart BPM (Beats Per Minute)',
        font: {
          size: 24,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `BPM: ${tooltipItem.raw}`;
          },
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'Days of the Week',
          font: {
            size: 14,
            weight: 'bold',
            family: 'pixel, sans-serif',
          },
        },
        ticks: {
          font: {
            size: 12,
            family: 'pixel, sans-serif',
          },
        },
      },
      y: {
        title: {
          display: true,
          text: 'BPM',
          font: {
            size: 14,
            weight: 'bold',
            family: 'pixel, sans-serif',
          },
        },
        ticks: {
          font: {
            size: 12,
            family: 'pixel, sans-serif',
          },
        },
      },
    },
  };
 
const bloodPressureData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  datasets: [
    {
      label: 'Systolic BP (mmHg)',
      data: [120, 122, 118, 121, 119],
      fill: false,
      borderColor: 'rgb(220, 20, 60)',
      tension: 0.1,
    },
    {
      label: 'Diastolic BP (mmHg)',
      data: [80, 81, 78, 79, 77],
      fill: false,
      borderColor: 'rgb(128, 128, 128)',
      tension: 0.1,
    },
  ],
};

// Blood Pressure Chart Options
const bloodPressureOptions = {
  responsive: true,
  plugins: {
    title: {
      display: true,
      text: 'Blood Pressure',
      font: {
        size: 24,
        weight: 'bold',
        family: 'pixel, sans-serif',
      },
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          return `${tooltipItem.label}: ${tooltipItem.raw} mmHg`;
        },
      },
    },
  },
  scales: {
    x: {
      title: {
        display: true,
        text: 'Days of the Week',
        font: {
          size: 14,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
      ticks: {
        font: {
          size: 12,
          family: 'pixel, sans-serif',
        },
      },
    },
    y: {
      title: {
        display: true,
        text: 'BPM',
        font: {
          size: 14,
          weight: 'bold',
          family: 'pixel, sans-serif',
        },
      },
      ticks: {
        font: {
          size: 12,
          family: 'pixel, sans-serif',
        },
      },
    },
   
  },
};

  return (
    <div className=" ">
        {/* Header Section */}
        <div className="flex justify-between items-center ">
            {/* "Vitals Dashboard" Section */}
            <div className="flex items-center">
              <div className="h-10  rounded-full  ring-1 ring-gray-200" />
              <h1 className="text-4xl font-semibold font-pixel">Vitals Dashboard</h1>
            </div>

            {/* Clock with Dropdown */}
            <div className="flex justify-end mr-6">
              <div className="ring-1 ring-gray-200 rounded-full flex font-sans font-semibold max-w-96  max-h-36  my-3  ">
                {/* Clock Icon */}
                <div className="h-10 w-[139px] rounded-full pl-0 bg-gray-100 ring-1 ring-gray-300 flex items-center">
                  <GoClock className="m-[5px] mr-0 text-3xl ring-1 ring-gray-300 rounded-full p-1 bg-gray-300" />
                  {/* Dropdown */}
                  <select className="ml-2 text-sm bg-gray-100 ring-1 ring-gray-300 rounded-full p-1 outline-none">
                    <option className="text-gray-700 bg-gray-100 hover:bg-gray-200" value="12">12 Hours</option>
                    <option className="text-gray-700 bg-gray-100 hover:bg-gray-200" value="24">24 Hours</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="grid grid-cols-2 ">
            {/* Weekly Steps Chart */}
            <div className="bg-[#fbf7f4] rounded-3xl w-[655px] ml-3  flex flex-col  items-center h-[300px]">
              <Stack direction="column" spacing={0} sx={{ width: "100%", maxWidth: 600 }} className='mr-8'>
                <Stack direction="row" spacing={3}>
                  <Stack direction="column" spacing={1} flex={1}></Stack>
                </Stack>

                {/* Chart.js Bar Chart */}
                <Bar data={weeklyStepsData} options={chartOptions}   />
              </Stack>
            </div>
           
           {/* Oxygen Levels and Calories Burnt Charts */}
            <div className="   flex flex-row items-center justify-around gap-0  h-[300px]">
  {/* Oxygen Levels Doughnut Chart */}
               <div className="bg-red-200/25 flex  flex-col items-center  p-10 pt-0  w-[300px] h-full rounded-3xl ring-2 ring-[#DC143C]">
                  <Doughnut data={oxygenLevelData} options={doughnutOptions} />
               </div>

  {/* Calories Burnt Doughnut Chart (as Pie) */}
               <div className="bg-red-200/25  flex  flex-col items-center  p-10 pt-0 w-[300px] h-full rounded-3xl ring-2 ring-[#DC143C]">
                 <Doughnut 
                 data={caloriesBurntData} 
                 options={{
                 ...caloriesPieOptions,
                 cutout: "0%", // Make the chart a Pie by removing the inner cutout
                          }}/>
              </div>
           </div>
          </div>
              {/* Heart BPM Line Chart */}
              
              <div className="mt-3 ml-3 py-1 flex flex-row items-center w-full pb-7 space-x-4">
      {/* Heart BPM Line Chart */}
      <div className="bg-[#fbf7f4] rounded-3xl w-[48%] h-[300px]">
        <Line data={heartBpmData} options={heartBpmOptions} className="ml-5" />
      </div>

      {/* Blood Pressure Line Chart */}
      <div className="bg-[#fbf7f4] rounded-3xl w-[49%] h-[300px]">
        <Line data={bloodPressureData} options={bloodPressureOptions} className='ml-7' />
      </div>
              </div>
    </div>
  );
};

export default VitalPage;
