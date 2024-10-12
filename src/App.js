import React from 'react';
import { useState } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import SignUp from './components/SignUp';
import CreateAppraisal from './components/CreateAppraisal';
import AppraisalList from './components/AppraisalList';
import authContext from './utils/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Mapping from './components/Mapping';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute />,
  },

  {
    path: "/mapping",
    element: <Mapping/>
  },

  {
    path: '/signUp',
    element: <SignUp />,
  },
  {
    path: '/create-appraisal',
    element: <CreateAppraisal />,
  },
  {
    path: '/appraisals',
    element: <AppraisalList />,
  },
]);

const App = () => {
  const [token, setToken] = useState("")
  const login = (token) => {
    setToken(token)
    localStorage.setItem('token', token)
  }

  const logout = () => {
    setToken(null)
    localStorage.removeItem('token')
  }

  return (
    <authContext.Provider value={{login, logout, token}}>
      <Navbar logout={logout} />
      <RouterProvider router={router} />
    </authContext.Provider>
  );
};

export default App;
