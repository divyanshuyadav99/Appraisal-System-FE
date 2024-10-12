import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Link } from 'react-router-dom';
const Dashboard = () => {
  const [appraisals, setAppraisals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  // Function to decode JWT and extract user information
  const getUserFromToken = (token) => {
    if (!token) return null;
    const base64Payload = token.split('.')[1];
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  };

  useEffect(() => {
    let token = localStorage.getItem('token'); // Get token from local storage
    const user = getUserFromToken(token); // Get user data from token

    // Fetch appraisals if the user role is Admin
    const fetchAppraisals = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appraisals`, {
          method: 'GET',
          headers: {
            Authorization: `${token}`, // Include 'Bearer ' prefix
            'Content-Type': 'application/json', // Set content type
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch appraisals');
        }

        const data = await response.json(); // Parse JSON response
        setAppraisals(data);
      } catch (err) {
        setError(err.message); // Set error message if fetch fails
      } finally {
        setLoading(false); // Set loading to false when done
      }
    };

    // Check the user's role and fetch appraisals if they are Admin
    if (user && user.role === 'Admin') {
      fetchAppraisals(); // Fetch appraisals if the user is Admin
    } else {
      console.log("users", user);
      setLoading(false); // Set loading to false if the user is not Admin
      setError('You do not have permission to view appraisals.'); // Optional error message
    }
  }, []); // Empty dependency array to run once on mount

  if (loading) {
    return <div className="text-center py-4">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-600 text-center py-4">{error}</div>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Appraisal Dashboard</h1>
      {appraisals.length > 0 ? (
        <ul className="space-y-4">
          {appraisals.map((appraisal) => (
            <li key={appraisal.seqId} className="p-4 border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200">
              <div className="flex justify-between">
                <span className="font-semibold">Appraisal ID:</span>
                <span>{appraisal.seqId}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-semibold">Participant:</span>
                <span>{appraisal.participant.name}</span>
              </div>
              <div className="flex justify-between mt-1">
                <span className="font-semibold">Evaluator:</span>
                <span>{appraisal.evaluator.name}</span>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center py-4">No appraisals available</p>
      )}
      <div className="mt-8">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-200"
          onClick={() => navigate('/mapping')}
        >
          Map Employee to Supervisor
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
