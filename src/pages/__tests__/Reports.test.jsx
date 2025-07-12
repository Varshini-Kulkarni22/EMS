import { render, screen } from '@testing-library/react';
import Reports from '../Reports';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
global.ResizeObserver = class {
  observe() {}
  unobserve() {}
  disconnect() {}
};
test('renders task status pie chart and bar chart', () => {
  const mockUser = { email: 'mgr@xyz.com' };
  const mockTasks = {
    'emp1@xyz.com': [
      { task: 'T1', status: 'Done' },
      { task: 'T2', status: 'In Progress' }
    ],
    'emp2@xyz.com': [
      { task: 'T3', status: 'Done' }
    ]
  };

  localStorage.setItem('currentUser', JSON.stringify(mockUser));
  localStorage.setItem('empTasks_mgr@xyz.com', JSON.stringify(mockTasks));

  render(
    <BrowserRouter>
      <Reports />
    </BrowserRouter>
  );

  // Check for headings
  expect(screen.getByText(/Overall Task Status/i)).toBeInTheDocument();
  expect(screen.getByText(/Task Count per Employee/i)).toBeInTheDocument();
});
