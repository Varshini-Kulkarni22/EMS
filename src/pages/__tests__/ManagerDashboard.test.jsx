import { render, fireEvent, waitFor } from '@testing-library/react';
import ManagerDashboard from '../dashboards/ManagerDashboard';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
test('assigns a task to an employee', async () => {
  localStorage.setItem('currentUser', JSON.stringify({ email: 'mgr@xyz.com' }));
  localStorage.setItem('users', JSON.stringify([
    { name: 'Emp1', email: 'emp1@xyz.com', role: 'employee', manager: 'mgr@xyz.com' }
  ]));

  const { getByPlaceholderText, getByText } = render(
    <BrowserRouter>
      <ManagerDashboard />
    </BrowserRouter>
  );

  fireEvent.change(getByPlaceholderText('Task'), { target: { value: 'New Task' } });
  fireEvent.click(getByText('Assign Task'));

  await waitFor(() => {
    const tasks = JSON.parse(localStorage.getItem('empTasks_mgr@xyz.com'));
    expect(tasks['emp1@xyz.com'][0].task).toBe('New Task');
  });
});
