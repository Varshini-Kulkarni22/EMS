import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ManagerDashboard from '../dashboards/ManagerDashboard';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';

beforeEach(() => {
  const currentUser = {
    email: 'manager@xyz.com',
    name: 'Manager One',
    role: 'manager'
  };

  const users = [
    currentUser,
    {
      name: 'Employee One',
      email: 'emp1@xyz.com',
      password: '123',
      role: 'employee',
      manager: 'manager@xyz.com'
    }
  ];

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('users', JSON.stringify(users));
  localStorage.setItem('empTasks_manager@xyz.com', JSON.stringify({}));
});

test('integration: assign task to employee and check localStorage', async () => {
  render(
    <BrowserRouter>
      <ManagerDashboard />
    </BrowserRouter>
  );

  const taskInput = screen.getByPlaceholderText('Task');
  const dateInput = screen.getByPlaceholderText('Deadline');
  const commentInput = screen.getByPlaceholderText('Comment');
  const assignButton = screen.getByText('Assign Task');

  fireEvent.change(taskInput, { target: { value: 'Integration Task' } });
  fireEvent.change(dateInput, { target: { value: '2025-12-31' } });
  fireEvent.change(commentInput, { target: { value: 'Do it soon' } });

  fireEvent.click(assignButton);

  await waitFor(() => {
    const tasks = JSON.parse(localStorage.getItem('empTasks_manager@xyz.com'));
    expect(tasks['emp1@xyz.com'][0].task).toBe('Integration Task');
    expect(tasks['emp1@xyz.com'][0].comment).toBe('Do it soon');
  });
});
