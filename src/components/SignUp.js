import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    const data = await response.json();
    if (response.ok) {
      setSuccess(true); // Show success message
    } else {
      alert(data.message); // Handle error case if needed
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  useEffect(() => {
    if (success) {
      // Redirect after 2 seconds
      const timer = setTimeout(() => {
        navigate('/'); // Redirect to Sign In (protected route)
      }, 2000);

      return () => clearTimeout(timer); // Cleanup timer on component unmount
    }
  }, [success, navigate]);

  return (
    <div className="max-w-md mx-auto mt-10">
      <h2 className="text-2xl font-bold">Sign Up</h2>

      {success ? (
        <div className="text-green-500 text-center mb-4">
          User created successfully! Redirecting to Sign In...
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            name="name"
            className="w-full p-2 border border-gray-300 rounded"
            value={formData.name}
            onChange={handleChange}
            required
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 border border-gray-300 rounded"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 border border-gray-300 rounded"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <input
            type="text"
            placeholder="Role"
            className="w-full p-2 border border-gray-300 rounded"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          />
          <button type="submit" className="w-full p-2 bg-blue-600 text-white rounded">
            Register User
          </button>
          <p className="text-center text-gray-600">
            Already have an account?{" "}
            <Link to="/" className="text-blue-600 hover:underline">
              Sign In
            </Link>
          </p>
        </form>
      )}
    </div>
  );
};

export default SignUp;
