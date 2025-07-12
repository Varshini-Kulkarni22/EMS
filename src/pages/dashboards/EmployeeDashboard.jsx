import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ClipboardList, User } from 'lucide-react';

const EmployeeDashboard = () => {
  const navigate = useNavigate();
  const [taskData, setTaskData] = useState([]);
  const [manager, setManager] = useState('');
  const [currentUser, setCurrentUser] = useState(() => JSON.parse(localStorage.getItem('currentUser')));

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const mgr = users.find((u) => u.email === currentUser?.manager);
    setManager(mgr?.name || currentUser?.manager);

    const managerEmail = currentUser?.manager;
    const managerTasks = JSON.parse(localStorage.getItem(`empTasks_${managerEmail}`)) || {};
    const myTasks = managerTasks[currentUser?.email] || [];

    setTaskData(myTasks);
  }, [currentUser]);

  const updateStatus = (index, newStatus) => {
    const updatedTasks = [...taskData];
    updatedTasks[index].status = newStatus;
    setTaskData(updatedTasks);

    const managerEmail = currentUser.manager;
    const allTasks = JSON.parse(localStorage.getItem(`empTasks_${managerEmail}`)) || {};
    allTasks[currentUser.email] = updatedTasks;
    localStorage.setItem(`empTasks_${managerEmail}`, JSON.stringify(allTasks));
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
      <h1 className="text-4xl font-bold mb-6 flex items-center gap-2">
        <ClipboardList size={32} className="text-blue-600 dark:text-blue-400" />
        Employee Dashboard
      </h1>

      <div className="flex justify-between items-center mb-6">
        <Link
          to="/settings"
          className="flex items-center gap-2 text-blue-600 dark:text-blue-300 hover:underline"
        >
          <User size={18} /> Settings
        </Link>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow mb-6">
        <h2 className="text-xl font-semibold text-blue-900 dark:text-blue-200">Manager: {manager}</h2>
      </div>

      <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold mb-4 text-blue-900 dark:text-blue-200">My Tasks</h2>

        {taskData.length > 0 ? (
          taskData.map((task, index) => (
            <div
              key={task.id}
              className="mb-4 p-4 border rounded-lg bg-white dark:bg-gray-700 shadow-md"
            >
              <p className="mb-1 font-medium text-gray-800 dark:text-gray-100">
                📌 <strong>Task:</strong> {task.task}
              </p>
              <p>
                <strong>Status:</strong>{' '}
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">
                  {task.status || 'Not Started'}
                </span>
              </p>
              {task.dueDate && <p>📅 <strong>Due Date:</strong> {task.dueDate}</p>}
              {task.comment && <p>💬 <strong>Comment:</strong> {task.comment}</p>}
              {task.file && (
                <p>
                  📎 <strong>Attachment:</strong>{' '}
                  <a
                    href={task.file}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 underline dark:text-blue-300"
                  >
                    View File
                  </a>
                </p>
              )}

              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => updateStatus(index, 'In Progress')}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-1 rounded-full text-sm"
                >
                  In Progress
                </button>
                <button
                  onClick={() => updateStatus(index, 'Done')}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-1 rounded-full text-sm"
                >
                  Done
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-700 dark:text-gray-300">No tasks assigned yet.</p>
        )}
      </div>
    </div>
  );
};

export default EmployeeDashboard;
