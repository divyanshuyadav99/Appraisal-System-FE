import React from 'react';
import { Link } from 'react-router-dom';
const Navbar = ({ logout }) => { // Accept logout as a prop

  const handleLogout = () => {
    logout(); // Call the logout function passed from App
  };

  return (
    <nav className="bg-blue-600 p-4 flex justify-between items-center">
      <h1 className="text-white text-2xl font-bold">Appraisal Management System</h1>
      {localStorage.getItem('token') && <button 
        onClick={handleLogout} 
        className="text-white bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>}
    </nav>
  );
};

export default Navbar;
