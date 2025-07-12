import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/dashboards/AdminDashboard';
import ManagerDashboard from './pages/dashboards/ManagerDashboard';
import EmployeeDashboard from './pages/dashboards/EmployeeDashboard';
import Kanban from './pages/Kanban';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import UserManagement from './pages/UserManagement';
import Dashboard from './pages/Dashboard';
import Reports from './pages/Reports';
const App = () => {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <Router>
      <div className="p-4">
        {/* {!currentUser && (
          <div className="flex justify-center gap-4 mb-6">
            <Link to="/login" className="text-blue-600 underline">Login</Link>
            <Link to="/signup" className="text-green-600 underline">Signup</Link>
          </div>
        )} */}
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          {/* <Route path="/signup" element={<Signup />} /> */}
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/manager" element={<ManagerDashboard />} />
          <Route path="/employee" element={<EmployeeDashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Shared/Extra Pages */}
          <Route path="/reports" element={<Reports />} />
          <Route path="/kanban" element={<Kanban />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="/user-management" element={<UserManagement />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
