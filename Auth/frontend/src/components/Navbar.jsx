import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogOut = async (e) => {
    try {
      await api.post(
        '/logout'
      );
    } catch (error) {
      console.error('Error completing the task:', error);
    }

    sessionStorage.clear();
    localStorage.clear();

    navigate("/login");
  };

  return (
    <nav className="bg-black border-b border-green-500 p-4 text-white flex justify-between items-center font-mono">
      <div className="flex items-center">
        <span className="text-green-500 mr-2">$</span>
        <h1 className="text-green-500 font-bold">Auth</h1>
      </div>
      <button
        onClick={handleLogOut}
        className="bg-gray-900 border border-green-500 text-green-500 px-4 py-2 rounded hover:bg-green-500 hover:text-black transition-colors duration-200"
      >
        [logout]
      </button>
    </nav>
  );
};

export default Navbar;
