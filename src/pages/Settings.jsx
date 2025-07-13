import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sun,
  Moon,
  UserCircle,
  Lock,
  LogOut,
  Image as ImageIcon,
} from 'lucide-react';

const Settings = () => {
  const navigate = useNavigate();
const [currentUser, setCurrentUser] = useState(() =>
  JSON.parse(localStorage.getItem('currentUser'))
);
 const [theme, setTheme] = useState(() => localStorage.getItem('app_theme') || 'light');

useEffect(() => {
  const html = document.documentElement;
  if (theme === 'dark') {
    html.classList.add('dark');
  } else {
    html.classList.remove('dark');
  }
  localStorage.setItem('app_theme', theme); // global
}, [theme]);
;
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('');

  // Initial Load: Sync name and avatar
useEffect(() => {
  if (currentUser) {
    const userSettings = JSON.parse(localStorage.getItem(`settings_${currentUser.email}`));
    if (userSettings) {
      setUsername(userSettings.name || '');
      setAvatar(userSettings.avatar || '');
    } else {
      setUsername(currentUser.name || '');
      setAvatar(currentUser.avatar || '');
    }
  }
}, [currentUser]);

  // Apply theme on load and when changed
  // useEffect(() => {
  //   const html = document.documentElement;
  //   if (theme === 'dark') {
  //     html.classList.add('dark');
  //   } else {
  //     html.classList.remove('dark');
  //   }
  //   localStorage.setItem('theme', theme);
  // }, [theme]);
  //const [theme, setTheme] = useState('light');

// useEffect(() => {
//   if (currentUser) {
//     const storedTheme = localStorage.getItem(`theme_${currentUser.email}`);
//     if (storedTheme) setTheme(storedTheme);
//   }
// }, [currentUser]);

// useEffect(() => {
//   const html = document.documentElement;
//   if (theme === 'dark') {
//     html.classList.add('dark');
//   } else {
//     html.classList.remove('dark');
//   }
//   if (currentUser) {
//     localStorage.setItem(`theme_${currentUser.email}`, theme);
//   }
// }, [theme, currentUser]);


  const handleThemeToggle = () => {
  setTheme(prev => prev === 'light' ? 'dark' : 'light');
};


  const logout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const handleProfileSave = () => {
    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.map((user) =>
      user.email === currentUser.email ? { ...user, name: username, avatar } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const updatedUser = { ...currentUser, name: username, avatar };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser); // update state to reflect immediately
  localStorage.setItem(`settings_${currentUser.email}`, JSON.stringify({
    name: username,
    avatar,
  }));
    alert('✅ Profile updated successfully!');
  };

  const handleChangePassword = () => {
    if (!password) return alert("Password can't be empty");

    const allUsers = JSON.parse(localStorage.getItem('users')) || [];
    const updatedUsers = allUsers.map((user) =>
      user.email === currentUser.email ? { ...user, password } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    const updatedUser = { ...currentUser, password };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    alert('🔐 Password changed!');
    setPassword('');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatar(reader.result);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="p-6 min-h-screen bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-all">
      <h1 className="text-4xl font-bold mb-10 text-center font-sans tracking-tight">
        Settings
      </h1>

      <div className="max-w-3xl mx-auto space-y-10">

        {/* Theme Toggle */}
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4 gap-2 text-blue-900 dark:text-blue-100">
            {theme === 'light' ? <Sun size={24} /> : <Moon size={24} />}
            <h2 className="text-xl font-semibold">Theme</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-md font-medium">
              {theme === 'light' ? 'Light Mode' : 'Dark Mode'}
            </span>
            <button
              onClick={handleThemeToggle}
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
            >
              Toggle Theme
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4 gap-2 text-blue-900 dark:text-blue-100">
            <UserCircle size={24} />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>

          <div className="flex items-center gap-4 mb-4">
            <img
              src={avatar || 'https://ui-avatars.com/api/?name=User'}
              alt="Avatar"
              className="w-20 h-20 rounded-full border shadow-md"
            />
            <label className="flex items-center gap-2 text-sm cursor-pointer text-gray-800 dark:text-gray-200">
              <ImageIcon size={18} />
              <span>Upload New</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </label>
          </div>

          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="border p-2 rounded w-full mb-4 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700"
            placeholder="Your name"
          />

          <button
            onClick={handleProfileSave}
            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Save Profile
          </button>
        </div>

        {/* Password */}
        <div className="bg-blue-50 dark:bg-blue-900 p-6 rounded-xl shadow-sm">
          <div className="flex items-center mb-4 gap-2 text-blue-900 dark:text-blue-100">
            <Lock size={24} />
            <h2 className="text-xl font-semibold">Change Password</h2>
          </div>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="border p-2 rounded w-full mb-4 text-black dark:text-white dark:bg-gray-800 dark:border-gray-700"
          />

          <button
            onClick={handleChangePassword}
            className="w-full py-2 rounded bg-blue-600 text-white hover:bg-red-700 transition mb-3"
          >
            Update Password
          </button>

          <button
            onClick={logout}
            className="w-full py-2 bg-gray-800 text-white hover:bg-gray-900 rounded flex items-center justify-center gap-2"
          >
            <LogOut size={18} /> Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;