// File: src/pages/Analytics.jsx
import React, { useEffect } from 'react';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const Analytics = () => {
  useEffect(() => {
    // Simulate a notification event
    const timeout = setTimeout(() => {
      toast.info("📢 Weekly report generated!", { position: 'bottom-right' });
    }, 1000);

    return () => clearTimeout(timeout);
  }, []);

  const barData = {
    labels: ['Project A', 'Project B', 'Project C'],
    datasets: [
      {
        label: 'Completed Tasks',
        data: [12, 19, 7],
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderRadius: 5,
      },
      {
        label: 'Pending Tasks',
        data: [4, 2, 6],
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
        borderRadius: 5,
      },
    ],
  };

  const pieData = {
    labels: ['Bug', 'Feature', 'Improvement'],
    datasets: [
      {
        label: 'Task Types',
        data: [10, 14, 6],
        backgroundColor: [
          'rgba(255, 206, 86, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(153, 102, 255, 0.6)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Analytics Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Tasks Per Project</h2>
          <Bar data={barData} options={{ responsive: true }} />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Task Type Distribution</h2>
          <Pie data={pieData} options={{ responsive: true }} />
        </div>
      </div>

      <ToastContainer />
    </div>
  );
};

export default Analytics;