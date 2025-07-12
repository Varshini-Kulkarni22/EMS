import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  if (['/login', '/signup'].includes(location.pathname)) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const username = 'Varshini'; // Replace with context/store if needed
  const role = localStorage.getItem('role') || 'Employee';

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/kanban', label: 'Kanban' },
    { path: '/analytics', label: 'Analytics' },
    { path: '/reports', label: 'Reports' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-blue-700">EMS</h1>
          <div className="hidden md:flex space-x-4">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600 hidden sm:block">
            Welcome, <span className="font-semibold">{username}</span> ({role})
          </span>
          <div className="w-8 h-8 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold">
            {username[0]}
          </div>
          <button
            onClick={handleLogout}
            className="px-3 py-1 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
