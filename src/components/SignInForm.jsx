import React, { useState } from 'react';

const SignInForm = ({ onSubmit }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(username, password);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm">
      <label className="block mb-2 font-medium" htmlFor="username">Username</label>
      <input
        id="username"
        className="border border-gray-300 rounded p-2 w-full mb-4"
        type="text"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
        autoFocus
      />
      <label className="block mb-2 font-medium" htmlFor="password">Password</label>
      <input
        id="password"
        className="border border-gray-300 rounded p-2 w-full mb-4"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-main text-white px-4 py-2 rounded w-full"
      >
        Sign In
      </button>
    </form>
  );
};

export default SignInForm;
