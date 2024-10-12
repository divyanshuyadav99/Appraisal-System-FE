import React, { useState, useEffect } from 'react';
import CreateAppraisalForm from './CreateAppraisalForm'; // Import the form component

const UserDashboard = ({ role, userId }) => {
  const [appraisals, setAppraisals] = useState([]); // Appraisals for the current user
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false); // Toggle for showing the form

  // Fetch appraisals for the current user
  const fetchUserAppraisals = async () => {
    setLoading(true);
    const token = localStorage.getItem('token'); // Fetch token

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appraisals/evaluator`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`, 
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch appraisals');
      }

      const data = await response.json();
      setAppraisals(data); // Set the fetched appraisals in state
    } catch (err) {
      console.log(err);
      setError('Error fetching appraisals.');
      setTimeout(() => {
        setError('');
      }, 1000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserAppraisals();
  }, [userId]);

  // Toggle to show or hide the create form
  const handleShowCreateForm = () => {
    setShowCreateForm(!showCreateForm);
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">User Dashboard</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* Section for showing appraisals or form */}
      {!showCreateForm ? (
        <>
          <section>
            <h2 className="text-xl font-semibold mb-4">Your Appraisals</h2>

            {loading ? (
              <p>Loading your appraisals...</p>
            ) : appraisals.length > 0 ? (
              <ul className="space-y-4">
                {appraisals.map((appraisal) => (
                  <li key={appraisal._id} className="p-4 bg-white shadow rounded-lg border border-gray-200">
                    <div className="flex flex-col">
                      {/* Mapping through questions */}
                      {appraisal.questions.map((question, index) => (
                        <div key={question._id} className="mt-2">
                          <p className="text-gray-700">
                            <strong>Question {index + 1}: </strong>
                            {question.question}
                          </p>
                          <p className="text-gray-700">
                            <strong>Answer: </strong>
                            {question.answer}
                          </p>
                        </div>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No appraisals found.</p>
            )}
          </section>

          {/* Button to create new appraisal */}
          <button
            onClick={handleShowCreateForm}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Create Appraisal
          </button>
        </>
      ) : (
        <CreateAppraisalForm onClose={handleShowCreateForm} userId={userId} />
      )}
    </div>
  );
};

export default UserDashboard;
