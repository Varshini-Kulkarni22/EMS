import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // ✅ Ensure Admin exists on first mount
  useEffect(() => {
    console.log("Creating default admin...");
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const hasAdmin = users.find(
      (u) => u.email === 'admin@gmail.com' && u.role === 'admin'
    );

    if (!hasAdmin) {
      const updatedUsers = [
        ...users,
        {
          name: 'Admin',
          email: 'admin@gmail.com',
          password: 'admin123',
          role: 'admin',
        },
      ];
      localStorage.setItem('users', JSON.stringify(updatedUsers));
    }
  }, []);

  const handleLogin = () => {
    if (!role || !email || !password) {
      alert('Please fill all fields');
      return;
    }

    const users = JSON.parse(localStorage.getItem('users')) || [];
    const userWithRole = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.role === role
    );

    if (!userWithRole || userWithRole.password !== password) {
      alert('Invalid email or password');
      return;
    }

    if (role === 'manager' && !userWithRole.projects) {
      alert('You are not assigned any projects yet!');
      return;
    }

    if (role === 'employee' && !userWithRole.tasks) {
      alert('You are not assigned any tasks yet!');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(userWithRole));

    if (role === 'admin') navigate('/admin');
    else if (role === 'manager') navigate('/manager');
    else if (role === 'employee') navigate('/employee');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-dark blue-200 to-blue-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-all duration-1000 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute w-80 h-80 bg-blue-300 dark:bg-blue-900 opacity-30 rounded-full top-10 left-10 animate-pulse blur-3xl" />
      <div className="absolute w-60 h-60 bg-purple-300 dark:bg-purple-800 opacity-30 rounded-full bottom-10 right-10 animate-ping blur-2xl" />

      {/* Login card */}
      <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-2xl shadow-xl z-10 p-8">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">Login</h2>

        {/* Role selector */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Select Role</label>
          <select
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="employee">Employee</option>
          </select>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-6 relative">
          <label className="block text-gray-700 dark:text-gray-300 font-medium mb-1">Password</label>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Enter your password"
            className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-[38px] text-gray-500 dark:text-gray-400 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
          </span>
        </div>

        {/* Login Button */}
        <button
          onClick={handleLogin}
          className="w-full py-2 bg-blue-700 hover:bg-blue-800 text-white font-semibold rounded-lg shadow-md transition duration-300"
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
