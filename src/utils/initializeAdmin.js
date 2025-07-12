export const initializeAdmin = () => {
  const users = JSON.parse(localStorage.getItem('users')) || [];
  const hasAdmin = users.some(
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
};
