import { render, fireEvent } from '@testing-library/react';
import EmployeeDashboard from '../dashboards/EmployeeDashboard';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
test('updates task status to Done', () => {
  localStorage.setItem('currentUser', JSON.stringify({ email: 'test@xyz.com', manager: 'mgr@xyz.com' }));
  localStorage.setItem('empTasks_mgr@xyz.com', JSON.stringify({
    'test@xyz.com': [{ id: '1', task: 'Test Task', status: 'In Progress' }]
  }));

  const { getByText } = render(<BrowserRouter><EmployeeDashboard /></BrowserRouter>);
  fireEvent.click(getByText(/Done/i));

  const updated = JSON.parse(localStorage.getItem('empTasks_mgr@xyz.com'));
  expect(updated['test@xyz.com'][0].status).toBe('Done');
});
