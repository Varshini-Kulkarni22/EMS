import { render, screen, fireEvent } from '@testing-library/react';
import Settings from '../Settings';
import { MemoryRouter } from 'react-router-dom';
import React from 'react';
beforeEach(() => {
  const currentUser = {
    email: 'test@xyz.com',
    name: 'Test User',
    role: 'employee',
    avatar: '',
    password: '123',
  };

  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  localStorage.setItem('users', JSON.stringify([currentUser]));
});

test('renders Settings and toggles theme', () => {
  render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );

  const toggleButton = screen.getByText('Toggle Theme');
  expect(toggleButton).toBeInTheDocument();

  fireEvent.click(toggleButton);
  // Optionally assert theme changes (you can inspect HTML classList here if needed)
});

test('updates profile', () => {
  render(
    <MemoryRouter>
      <Settings />
    </MemoryRouter>
  );

  const nameInput = screen.getByPlaceholderText('Your name');
  fireEvent.change(nameInput, { target: { value: 'Updated User' } });

  const saveButton = screen.getByText('Save Profile');
  fireEvent.click(saveButton);

  const updatedUser = JSON.parse(localStorage.getItem('currentUser'));
  expect(updatedUser.name).toBe('Updated User');
});
