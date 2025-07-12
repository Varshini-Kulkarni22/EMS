import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';

const COLORS = ['#00C49F', '#FF8042'];

const Reports = () => {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [employeeTasks, setEmployeeTasks] = useState({});
  const [taskStatusData, setTaskStatusData] = useState([]);
  const [employeeBarData, setEmployeeBarData] = useState([]);

  useEffect(() => {
    const tasks = JSON.parse(localStorage.getItem(`empTasks_${currentUser.email}`)) || {};
    setEmployeeTasks(tasks);

    let completed = 0, pending = 0;
    const barData = [];

    Object.entries(tasks).forEach(([email, taskList]) => {
      let taskCount = taskList.length;
      let empCompleted = taskList.filter(t => t.status === 'Done').length;
      let empPending = taskCount - empCompleted;

      completed += empCompleted;
      pending += empPending;

      barData.push({
        name: email,
        tasks: taskCount,
      });
    });

    setTaskStatusData([
      { name: 'Completed', value: completed },
      { name: 'Pending', value: pending }
    ]);

    setEmployeeBarData(barData);
  }, [currentUser.email]);

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <h1 className="text-3xl font-bold mb-6">📈 Reports & Analytics</h1>
      <button onClick={() => navigate('/manager')} className="mb-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">← Back to Dashboard</button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pie Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Overall Task Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={taskStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                dataKey="value"
              >
                {taskStatusData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h2 className="text-xl font-semibold mb-4">Task Count per Employee</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={employeeBarData}>
              <XAxis dataKey="name" stroke="#ccc" />
              <YAxis stroke="#ccc" />
              <Tooltip />
              <Legend />
              <Bar dataKey="tasks" fill="#8884d8" name="Tasks Assigned" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Reports;
