import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await api.post('/user/signup', {
        email,
        password,
      });

      setSuccess('Account created successfully! Please sign in.');
      setTimeout(() => {
        navigate('/signin');
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.msg || 'An error occurred during sign up');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-8 bg-white rounded-lg shadow-xl">
      <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">CREATE ACCOUNT</h2>
      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">
          {success}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-colors"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-black text-white py-3 px-4 rounded-md hover:bg-gray-900 transition-colors duration-200 font-medium"
        >
          CREATE ACCOUNT
        </button>
      </form>
    </div>
  );
};

export default SignUp; 