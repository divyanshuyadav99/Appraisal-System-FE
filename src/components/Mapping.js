import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Mapping = () => {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState([]); // State for employees
  const [selectedSupervisor, setSelectedSupervisor] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [message, setMessage] = useState({ message: "", error: false }); // State for success or error messages

  // Function to decode JWT and extract user information
  const getUserFromToken = (token) => {
    if (!token) return null;
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  };

  useEffect(() => {
    const token = localStorage.getItem('token'); // Get token from local storage
    const user = getUserFromToken(token); // Get user data from token

    // Check if the user is not an Admin
    if (!user || user.role !== 'Admin') {
      navigate('/'); // Redirect to the Protected page
    } else {
      fetchEmployees(); // Fetch employees if admin
    }
  }, [navigate]);

  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setEmployees(data); // Set employees state
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page refresh
    const mappingData = {
      supervisorName: selectedSupervisor,
      employeeName: selectedEmployee,
    };

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${localStorage.getItem('token')}`, // Include token for auth
        },
        body: JSON.stringify(mappingData),
      });

      if (response.ok) {
        setMessage({ message: 'Employee successfully mapped to supervisor!', error: false });
        // Optionally reset the form
        setSelectedSupervisor('');
        setSelectedEmployee('');
      } else {
        throw new Error('Mapping failed, please try again.');
      }
    } catch (error) {
      setMessage({ message: error.message, error: true });
    }
  };

  // Effect to clear message after 2 seconds
  useEffect(() => {
    if (message.message) {
      const timer = setTimeout(() => {
        setMessage({ message: "", error: false }); // Clear message after 2 seconds
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [message]);

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-semibold text-center mb-4">Map Employee to Supervisor</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Supervisor:</label>
          <select
            value={selectedSupervisor}
            onChange={(e) => {
                console.log("supervisorname: ", e.target.value)
                setSelectedSupervisor(e.target.value)}}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          >
            <option value="">Select a supervisor</option>
            {employees.map((supervisor) => (
              <option key={supervisor.userId} value={supervisor.name}>
                {supervisor.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-gray-700">Employee:</label>
          <select
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
            required
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-600 transition duration-200"
          >
            <option value="">Select an employee</option>
            {employees.map((employee) => (
              <option key={employee.userId} value={employee.name}>
                {employee.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="mt-4 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Submit
        </button>
      </form>
      {message.message && (
        <p className={`text-center mt-4 ${message.error ? 'text-red-500' : 'text-green-500'}`}>
          {message.message}
        </p>
      )}
      <button
        onClick={() => navigate(-1)} // Go back to the previous page
        className="mt-4 w-full p-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition duration-300"
      >
        Back
      </button>
    </div>
  );
};

export default Mapping;
