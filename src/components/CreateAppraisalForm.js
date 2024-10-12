import React, { useState, useEffect } from 'react';

const CreateAppraisalForm = ({ userId }) => {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({
    participantUserId: '',
    evaluatorUserId: '',
    questions: [
      { question: "How would you rate the participant's performance?", answer: '' },
      { question: 'What are the areas for improvement?', answer: '' },
    ],
    role: 'Supervisor', // Default role
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  // Fetch employees for supervisors and participants
  const fetchEmployees = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/employees`, {
        headers: {
          Authorization: `${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setEmployees(data); // Set fetched employees
    } catch (err) {
      console.log('Error fetching employees', err);
    }
  };

  useEffect(() => {
    fetchEmployees(); // Fetch employees when the component mounts
  }, []);

  const handleInputChange = (index, value) => {
    const updatedQuestions = [...form.questions];
    updatedQuestions[index].answer = value;
    setForm({ ...form, questions: updatedQuestions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const token = localStorage.getItem('token'); // Assuming token is stored in localStorage

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appraisals`, {
        method: 'POST',
        headers: {
          Authorization: `${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await response.json(); // Parse the response

      if (!response.ok) {
        // If the API sends a specific error message, display it
        throw new Error(data.message || 'Failed to create appraisal');
      }

      setSuccess('Appraisal created successfully!');
      // Clear the form after successful submission
      setForm({
        participantUserId: '',
        evaluatorUserId: '',
        questions: [
          { question: "How would you rate the participant's performance?", answer: '' },
          { question: 'What are the areas for improvement?', answer: '' },
        ],
        role: 'Supervisor',
      });

      // Clear success message after 2 seconds
      setTimeout(() => {
        setSuccess('');
      }, 2000);
    } catch (err) {
      console.log(err);
      // Show the specific error message from the API, or a generic message
      setError(err.message || 'Error creating appraisal.');

      // Clear error message after 2 seconds
      setTimeout(() => {
        setError('');
        // Optionally, clear the form even when there is an error
        setForm({
          participantUserId: '',
          evaluatorUserId: '',
          questions: [
            { question: "How would you rate the participant's performance?", answer: '' },
            { question: 'What are the areas for improvement?', answer: '' },
          ],
          role: 'Supervisor',
        });
      }, 2000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Create Appraisal</h2>

      {error && <p className="text-red-500 mb-4">{error}</p>}
      {success && <p className="text-green-500 mb-4">{success}</p>}

      <form onSubmit={handleSubmit}>
        {/* Question 1 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            How would you rate the participant's performance?
          </label>
          <textarea
            value={form.questions[0].answer}
            onChange={(e) => handleInputChange(0, e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        {/* Question 2 */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">
            What are the areas for improvement?
          </label>
          <textarea
            value={form.questions[1].answer}
            onChange={(e) => handleInputChange(1, e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            required
          />
        </div>

        {/* Supervisor Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Supervisor</label>
          <select
            value={form.evaluatorUserId}
            onChange={(e) => setForm({ ...form, evaluatorUserId: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select a supervisor</option>
            {employees.map((supervisor) => (
              <option key={supervisor.userId} value={supervisor.userId}>
                {supervisor.name}
              </option>
            ))}
          </select>
        </div>

        {/* Participant Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Select Participant</label>
          <select
            value={form.participantUserId}
            onChange={(e) => setForm({ ...form, participantUserId: e.target.value })}
            className="w-full p-2 border rounded-lg"
            required
          >
            <option value="">Select a participant</option>
            {employees.map((participant) => (
              <option key={participant.userId} value={participant.userId}>
                {participant.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <div className="mt-6">
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white p-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200"
          >
            {loading ? 'Creating...' : 'Create Appraisal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateAppraisalForm;
