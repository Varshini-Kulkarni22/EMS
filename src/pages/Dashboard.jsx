// File: src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react';
import { FaTasks, FaProjectDiagram, FaCheckCircle, FaHourglassHalf, FaUserTie } from 'react-icons/fa';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [managers, setManagers] = useState([]);
  const [adminTasks, setAdminTasks] = useState([]);
  const [completedCount, setCompletedCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const allManagers = users.filter((u) => u.role === 'manager');
    setManagers(allManagers);

    const managerTasks = JSON.parse(localStorage.getItem('managerTasks')) || {};
    let allTasks = [];

    Object.entries(managerTasks).forEach(([managerEmail, taskList]) => {
      allTasks = [
        ...allTasks,
        ...taskList.map(t => ({ ...t, managerEmail, managerName: users.find(u => u.email === managerEmail)?.name || managerEmail }))
      ];
    });

    setAdminTasks(allTasks);

    const completed = allTasks.filter((t) => t.progress === 100).length;
    const pending = allTasks.filter((t) => t.progress < 100).length;

    setCompletedCount(completed);
    setPendingCount(pending);

    const notify = [];
    const newManagers = users.filter((u) => u.role === 'manager' && u.createdAt);
    newManagers.forEach((m) => notify.push(`👨‍💼 New manager added: ${m.name}`));
    allTasks.forEach((t) => {
      if (t.progress === 100) notify.push(`✅ Task completed by ${t.managerName}: "${t.task}"`);
    });

    setNotifications(notify.slice(-5));
  }, []);

  const pieData = [
    { name: 'Completed', value: completedCount },
    { name: 'Pending', value: pendingCount },
  ];

  const COLORS = ['#00C49F', '#FF8042'];

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-all">
      <h1 className="text-3xl font-bold mb-6">📈 Admin Dashboard Overview</h1>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-4">
          <FaUserTie className="text-indigo-600 text-2xl" />
          <div>
            <p className="text-gray-500 dark:text-gray-300">Total Managers</p>
            <h2 className="text-xl font-bold">{managers.length}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-4">
          <FaProjectDiagram className="text-blue-500 text-2xl" />
          <div>
            <p className="text-gray-500 dark:text-gray-300">Total Projects</p>
            <h2 className="text-xl font-bold">{adminTasks.length}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-4">
          <FaCheckCircle className="text-green-500 text-2xl" />
          <div>
            <p className="text-gray-500 dark:text-gray-300">Completed</p>
            <h2 className="text-xl font-bold">{completedCount}</h2>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow flex items-center gap-4">
          <FaHourglassHalf className="text-red-500 text-2xl" />
          <div>
            <p className="text-gray-500 dark:text-gray-300">Pending</p>
            <h2 className="text-xl font-bold">{pendingCount}</h2>
          </div>
        </div>
      </div>

      {/* Pie Chart */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">Project Status Chart</h3>
        <ResponsiveContainer width="100%" height={250}>
          <PieChart>
            <Pie
              data={pieData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {pieData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={{ backgroundColor: '#333', color: '#fff' }} />
            <Legend wrapperStyle={{ color: 'white' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Notifications */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h3 className="text-xl font-semibold mb-4">Notifications</h3>
        <ul className="space-y-2 text-gray-700 dark:text-gray-200">
          {notifications.length > 0
            ? notifications.map((note, idx) => <li key={idx}>🔔 {note}</li>)
            : <li>No notifications available.</li>}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
