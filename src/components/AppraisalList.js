import React, { useEffect, useState } from 'react';

const AppraisalList = () => {
  const [appraisals, setAppraisals] = useState([]);

  useEffect(() => {
    const fetchAppraisals = async () => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/appraisals`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      const data = await response.json();
      setAppraisals(data);
    };

    fetchAppraisals();
  }, []);

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold">Appraisal List</h2>
      <ul className="space-y-4">
        {appraisals.map((appraisal) => (
          <li key={appraisal.id} className="p-4 border border-gray-300 rounded">
            <h3 className="font-semibold">ID: {appraisal.id}</h3>
            <p>Participant User ID: {appraisal.participantUserId}</p>
            <p>Evaluator User ID: {appraisal.evaluatorUserId}</p>
            <p>Role: {appraisal.role}</p>
            <p>Questions:</p>
            <ul>
              {appraisal.questions.map((q, index) => (
                <li key={index}>
                  <strong>Q:</strong> {q.question} <strong>A:</strong> {q.answer}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppraisalList;
