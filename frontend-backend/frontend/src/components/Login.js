// src/pages/Login.js
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/users/login', formData);
            localStorage.setItem('token', response.data.token); // Store the token
            setToken(response.data.token); // Update the token in the app state
            navigate('/contacts'); // Redirect to tasks page
        } catch (error) {
            setError('Login failed. Please check your credentials and try again.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white">
            <div className="max-w-lg w-full bg-white shadow-lg rounded-3xl p-10">
                <h2 className="text-4xl font-extrabold text-orange-600 text-center mb-8">Welcome Back</h2>

                {error && (
                    <div className="bg-red-600 text-white px-4 py-3 rounded-md mb-6 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-6">
                        <label className="block text-sm font-semibold text-gray-700">Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-gray-100 text-gray-800"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="mb-8">
                        <label className="block text-sm font-semibold text-gray-700">Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            className="mt-2 block w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 transition duration-200 bg-gray-100 text-gray-800"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-orange-600 text-white py-3 rounded-lg font-bold hover:bg-orange-500 focus:outline-none focus:ring-4 focus:ring-orange-400 transition duration-200"
                    >
                        Sign In
                    </button>
                </form>

                <div className="text-center mt-6">
                    <p className="text-gray-700">
                        New here?{" "}
                        <a href="/register" className="text-orange-600 font-semibold hover:text-orange-500 transition duration-200">
                            Create an account
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Login;
