
// src/contexts/UserContext.js
import React, { createContext, useState, useEffect } from 'react';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [users, setUsers] = useState([]);

  // Load from localStorage initially
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem('users')) || [];
    setUsers(storedUsers);
  }, []);

  // Keep localStorage in sync
  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  const addUser = (user) => {
    setUsers((prevUsers) => [...prevUsers, user]);
  };

  const updateUser = (updatedUser) => {
    setUsers((prevUsers) =>
      prevUsers.map((u) => (u.email === updatedUser.email ? updatedUser : u))
    );
  };

  return (
    <UserContext.Provider value={{ users, setUsers, addUser, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};
