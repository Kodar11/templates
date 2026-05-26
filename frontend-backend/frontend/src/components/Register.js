import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/users/register', formData);
      navigate('/login'); // Redirect to login page after successful registration
    } catch (error) {
      setError('Registration failed. Please try again.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="max-w-md w-full bg-white shadow-xl rounded-lg p-10">
        <h2 className="text-3xl font-extrabold text-center text-orange-600 mb-8">Create an Account</h2>
        
        {error && (
          <div className="bg-red-100 text-red-700 px-4 py-3 rounded-md mb-6 text-center">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="mt-1 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              placeholder="email"
              className="mt-1 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Password</label>
            <input
              type="password"
              name="password"
              placeholder="password"
              className="mt-1 block w-full p-4 bg-gray-100 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition duration-200"
              value={formData.password}
              onChange={handleInputChange}
              required
            />
          </div>
          
          <button
            type="submit"
            className="bg-orange-600 text-white w-full py-3 rounded-lg hover:bg-orange-500 focus:ring-4 focus:ring-orange-300 focus:ring-opacity-50 transition duration-200 shadow-lg"
          >
            Register
          </button>
        </form>
        
        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-orange-600 hover:text-orange-500 hover:underline transition duration-200">
            Login here
          </a>
        </p>
      </div>
    </div>
  );
}

export default Register;
