import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const emailExists = users.some((user) => user.email === data.email);

    if (emailExists) {
      alert('User already exists with this email!');
    } else {
      users.push(data);
      localStorage.setItem('users', JSON.stringify(users));
      alert('Signup successful!');
      navigate('/login');
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="bg-white p-8 rounded shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
        <input {...register('name')} placeholder="Name" className="w-full p-2 mb-4 border rounded" required />
        <input {...register('email')} type="email" placeholder="Email" className="w-full p-2 mb-4 border rounded" required />
        <input {...register('password')} type="password" placeholder="Password" className="w-full p-2 mb-4 border rounded" required />
        <select {...register('role')} className="w-full p-2 mb-4 border rounded" required>
          <option value="">Select Role</option>
          <option value="admin">Admin</option>
          <option value="manager">Manager</option>
          <option value="employee">Employee</option>
        </select>
        <button type="submit" className="w-full bg-green-600 text-white py-2 rounded">Sign Up</button>
        <p className="mt-4 text-sm text-center">
          Already have an account? <Link to="/login" className="text-blue-600">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
