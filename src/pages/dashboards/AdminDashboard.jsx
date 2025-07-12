// AdminDashboard.jsx
import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../contexts/UserContext';
import { v4 as uuid } from 'uuid';
import { User, BarChart2, Settings, ArrowRightCircle } from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { users } = useContext(UserContext);
  const [taskInputs, setTaskInputs] = useState({});
  const [managerTasks, setManagerTasks] = useState({});
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  const [showWelcome, setShowWelcome] = useState(() => {
    const visited = localStorage.getItem('visited');
    if (!visited) {
      localStorage.setItem('visited', 'true');
      return true;
    }
    return false;
  });

  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem('managerTasks')) || {};
    setManagerTasks(storedTasks);

    const interval = setInterval(() => {
      const updatedTasks = JSON.parse(localStorage.getItem('managerTasks')) || {};
      setManagerTasks(updatedTasks);
    }, 1000);

    const timeout = setTimeout(() => setShowWelcome(false), 4000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  const managers = users.filter((user) => user.role === 'manager');

  const assignTask = (email) => {
    const newTask = { id: uuid(), task: taskInputs[email], progress: 0 };
    const updatedTasks = { ...managerTasks };

    if (!Array.isArray(updatedTasks[email])) updatedTasks[email] = [];
    updatedTasks[email].push(newTask);
    setManagerTasks(updatedTasks);
    localStorage.setItem('managerTasks', JSON.stringify(updatedTasks));

    const kanbanKey = `kanban_${email}`;
    const existingKanban = JSON.parse(localStorage.getItem(kanbanKey)) || {
      todo: { name: 'To Do', items: [] },
      inprogress: { name: 'In Progress', items: [] },
      done: { name: 'Done', items: [] },
    };
    existingKanban.todo.items.push(newTask);
    localStorage.setItem(kanbanKey, JSON.stringify(existingKanban));

    alert(`Task assigned to ${email}`);
    setTaskInputs({ ...taskInputs, [email]: '' });
  };

  const removeTask = (email, taskId) => {
    const updatedTasks = (managerTasks[email] || []).filter(t => t.id !== taskId);
    const newAllTasks = { ...managerTasks, [email]: updatedTasks };
    setManagerTasks(newAllTasks);
    localStorage.setItem('managerTasks', JSON.stringify(newAllTasks));

    const kanbanKey = `kanban_${email}`;
    const existingKanban = JSON.parse(localStorage.getItem(kanbanKey));
    if (existingKanban) {
      for (let key in existingKanban) {
        existingKanban[key].items = existingKanban[key].items.filter(t => t.id !== taskId);
      }
      localStorage.setItem(kanbanKey, JSON.stringify(existingKanban));
    }
  };

  const getProgress = (email) => {
    const tasks = Array.isArray(managerTasks[email]) ? managerTasks[email] : [];
    if (tasks.length === 0) return 0;
    const completed = tasks.filter((t) => t.progress === 100).length;
    return Math.round((completed / tasks.length) * 100);
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white transition-all">
      {showWelcome && (
        <div className="flex items-center gap-3 animate-slide-in-left fixed top-4 left-4 bg-blue-600 text-white py-3 px-6 rounded shadow z-50">
          <img src="https://cdn-icons-png.flaticon.com/512/4333/4333609.png" alt="hi" className="w-10 h-10 animate-wave" />
          <span className="font-semibold">Welcome {currentUser?.name} !!</span>
        </div>
      )}

      <div className="flex justify-end gap-4 mb-6">
        <Link to="/user-management" className="flex items-center gap-2 text-blue-600 hover:underline">
          <User size={18} /> Users
        </Link>
        <Link to="/dashboard" className="flex items-center gap-2 text-purple-600 hover:underline">
          <BarChart2 size={18} /> Analytics
        </Link>
        <Link to="/settings" className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:underline">
          <Settings size={18} /> Settings
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <h2 className="text-xl font-semibold mb-4">Managers</h2>
      {managers.length === 0 ? (
        <p className="text-gray-500">No managers added yet.</p>
      ) : (
        managers.map((manager) => (
          <div key={manager.email} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 rounded-lg shadow mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-2">
              <div>
                <p><strong>Name:</strong> {manager.name}</p>
                <p><strong>Email:</strong> {manager.email}</p>
                <p><strong>Progress:</strong> {getProgress(manager.email)}%</p>
                <div className="w-full bg-gray-300 dark:bg-gray-700 rounded-full h-3 mt-2">
                  <div
                    className="bg-green-500 h-3 rounded-full"
                    style={{ width: `${getProgress(manager.email)}%` }}
                  ></div>
                </div>
              </div>

              <div className="flex flex-col gap-2 w-full sm:w-1/2">
                <div className="flex gap-2">
                  <input
                    placeholder="Assign Task"
                    value={taskInputs[manager.email] || ''}
                    onChange={(e) => setTaskInputs({ ...taskInputs, [manager.email]: e.target.value })}
                    className="border p-2 flex-1 rounded dark:bg-gray-900 dark:text-white"
                  />
                  <button
                    onClick={() => assignTask(manager.email)}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 whitespace-nowrap"
                  >
                    Assign
                  </button>
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h3 className="font-semibold mb-1">Assigned Tasks:</h3>
              <ul className="list-disc pl-6">
                {(managerTasks[manager.email] || []).map((t, idx) => (
                  <li key={idx} className="mb-1 text-sm">
                    {t.task} - {t.progress}%
                    <button
                      onClick={() => removeTask(manager.email, t.id)}
                      className="ml-3 text-red-500 hover:underline text-xs"
                    >
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default AdminDashboard;