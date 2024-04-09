import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './views/Login';
// import Register from './views/Register';
import EmployeeList from './views/EmployeeList';

export default function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          {/* <Route path="/register" element={<Register />} /> */}
          <Route path="/employees" element={<EmployeeList />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}
