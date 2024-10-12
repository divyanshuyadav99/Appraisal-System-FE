import React, { useState } from 'react';

const CreateAppraisal = () => {
  const [participantUserId, setParticipantUserId] = useState('');
  const [evaluatorUserId, setEvaluatorUserId] = useState('');
  const [role, setRole] = useState('');
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appraisals`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`, // Assuming token is stored in localStorage
      },
      body: JSON.stringify({ participantUserId, evaluatorUserId, role, questions }),
    });
    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Create Appraisal</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Participant User ID"
          className="w-full p-2 border border-gray-300 rounded"
          value={participantUserId}
          onChange={(e) => setParticipantUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Evaluator User ID"
          className="w-full p-2 border border-gray-300 rounded"
          value={evaluatorUserId}
          onChange={(e) => setEvaluatorUserId(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Role (Supervisor, Peer, Junior)"
          className="w-full p-2 border border-gray-300 rounded"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          required
        />
        {questions.map((q, index) => (
          <div key={index} className="flex space-x-2">
            <input
              type="text"
              placeholder="Question"
              className="w-full p-2 border border-gray-300 rounded"
              value={q.question}
              onChange={(e) => handleQuestionChange(index, 'question', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Answer"
              className="w-full p-2 border border-gray-300 rounded"
              value={q.answer}
              onChange={(e) => handleQuestionChange(index, 'answer', e.target.value)}
              required
            />
          </div>
        ))}
        <button type="button" onClick={addQuestion} className="w-full p-2 bg-gray-300 rounded">
          Add Question
        </button>
        <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
          Create Appraisal
        </button>
      </form>
    </div>
  );
};

export default CreateAppraisal;
