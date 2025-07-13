// UserManagement.jsx
import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, UserPlus } from 'lucide-react';

const UserManagement = () => {
  const { users, addUser } = useContext(UserContext);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');

  useEffect(() => {
    if (!currentUser?.email) {
      navigate('/login');
      return;
    }
  }, [currentUser, navigate]);

  const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const handleAddManager = () => {
  if (!name || !email || !password) {
    alert("Please fill all fields.");
    return;
  }

  if (!isValidEmail(email)) {
    alert("Please enter a valid email address.");
    return;
  }

  const existing = users.find((u) => u.email === email);
  if (existing) {
    alert("User with this email already exists.");
    return;
  }

  const newManager = { name, email, password, role: 'manager' };
  addUser(newManager);

  setName('');
  setEmail('');
  setPassword('');
  alert('Manager added!');
};


  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white transition-all">
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300 hover:underline"
        >
          <ArrowLeft size={16} /> Back to Dashboard
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md mb-6">
        <div className="flex items-center gap-2 mb-4">
          <UserPlus size={20} className="text-blue-600" />
          <h2 className="text-xl font-semibold">Add Manager</h2>
        </div>
        <input
          type="text"
          placeholder="Manager Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded w-full mb-3 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <input
          type="email"
          placeholder="Manager Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border p-2 rounded w-full mb-3 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border p-2 rounded w-full mb-4 dark:bg-gray-900 dark:border-gray-700 dark:text-white"
        />
        <button
          onClick={handleAddManager}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add Manager
        </button>
      </div>

      <h2 className="text-lg font-semibold mb-2">Managers</h2>
      <ul className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow">
        {users
          .filter((user) => user.role === 'manager')
          .map((user, index) => (
            <li
              key={index}
              className="border-b border-gray-200 dark:border-gray-700 py-2"
            >
              <strong>{user.name}</strong> - {user.email}
            </li>
          ))}
      </ul>
    </div>
  );
};

export default UserManagement;
