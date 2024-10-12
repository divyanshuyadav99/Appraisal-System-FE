import React, { useContext, useState, useEffect } from "react";
import authContext from "../utils/AuthContext.js";
import { Link } from "react-router-dom";
import Dashboard from "./Dashboard.js";
import UserDashboard from "./UserDashboard.js";

const ProtectedRoute = () => {
  const { login } = useContext(authContext);
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errorMessage, setErrorMessage] = useState("");
  const token = localStorage.getItem("token");
  const [role, setRole] = useState("");

  const getUserFromToken = (token) => {
    if (!token) return null;
    const base64Payload = token.split('.')[1];
    // Decode the base64 string
    const payload = JSON.parse(atob(base64Payload));
    return payload;
  };

  // Check the user role on initial load
  useEffect(() => {
    if (token) {
      const user = getUserFromToken(token);
      if (user) {
        setRole(user.role); // Set the role from the token
        localStorage.setItem("userId", user.id)
      }
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = await fetchToken();
    if (typeof token === "string") {
      login(token);
      setErrorMessage("");
      const user = getUserFromToken(token);
      console.log("Role:", user.role);
      setRole(user.role); // Set the role upon successful login
      console.log("user", user)
      localStorage.setItem("userRole", user.role); // Store the role in local storage
      localStorage.setItem("userId", user.id)
    } else {
      setErrorMessage("Please try again, either email or password is wrong");
    }
  };

  const fetchToken = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });
      if (response.status === 200) {
        const token = await response.text();
        const parsedToken = JSON.parse(token);
        return parsedToken.token;
      } else {
        return new Error(`HTTP error! status: ${response.status}`); // Handle HTTP errors
      }
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      {token ? ( // Check if the token exists
        role === "Admin" ? ( // Check if the role is Admin
          <Dashboard /> // Render Admin Dashboard component
        ) : (
          <UserDashboard userId={localStorage.getItem("userId")} /> // Render User Dashboard component
        )
      ) : (
        <div className="max-w-md mx-auto mt-10">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
            Login to Your Account
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              name="email"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              className="w-full p-2 border border-gray-300 rounded"
              value={formData.password}
              onChange={handleChange}
              required
            />
            {errorMessage && (
              <p className="text-red-500 text-center mb-4">{errorMessage}</p>
            )}
            <button
              type="submit"
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
            <p className="mt-4 text-center text-gray-500">
              Don't have an account?{" "}
              <Link to="/signUp" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      )}
    </>
  );
};

export default ProtectedRoute;
