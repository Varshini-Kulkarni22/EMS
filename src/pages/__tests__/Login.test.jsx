import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../Login';
import { BrowserRouter } from 'react-router-dom';

beforeAll(() => {
  window.alert = jest.fn(); // mock alert
});

test('logs in valid user and sets currentUser in localStorage', () => {
  const mockUser = { email: 'admin@xyz.com', password: 'admin123', role: 'admin' };
  localStorage.setItem('users', JSON.stringify([mockUser]));

  render(
    <BrowserRouter>
      <Login />
    </BrowserRouter>
  );

  fireEvent.change(screen.getByPlaceholderText(/Email/i), {
    target: { value: 'admin@xyz.com' }
  });

  fireEvent.change(screen.getByPlaceholderText(/Password/i), {
    target: { value: 'admin123' }
  });

  fireEvent.change(screen.getByRole('combobox'), {
    target: { value: 'admin' }
  });

  fireEvent.click(screen.getByRole('button', { name: /Login/i }));

  const saved = JSON.parse(localStorage.getItem('currentUser'));
  expect(saved.email).toBe('admin@xyz.com');
});
