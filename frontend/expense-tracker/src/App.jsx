import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Home from "./pages/Dashboard/Home";
import Income from "./pages/Dashboard/Income";
import Expense from "./pages/Dashboard/Expense";
import UserProvider from './context/UserContext';
import PrivateRoute from './components/layouts/PrivateRoute';
import {Toaster} from "react-hot-toast";

const App = () => {
  return (
    <UserProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          {/* Private routes are nested under PrivateRoute */}
          <Route path="/" element={<PrivateRoute />}>
            <Route index element={<Home />} /> {/* This becomes the default private route */}
            <Route path="dashboard" element={<Home />} />
            <Route path="income" element={<Income />} />
            <Route path="expense" element={<Expense />} />
          </Route>
        </Routes>
      </Router>
      <div>
        <Toaster
          toastOptions={{
            className:"",
            style:{
              fontSize:"13px"
            
            },
          }}
          />
      </div>
    </UserProvider>

  );
};

export default App;
