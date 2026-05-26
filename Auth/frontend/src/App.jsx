import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import EmailInput from './components/Register/EmailInput';
import VerifyOtp from './components/Register/VerifyOtp';
import CompleteRegistration from './components/Register/CompleteRegistration';

import Login from './components/Login';
import Home from './components/Home';
import ProtectedRoute from './components/ProtectedRouter';

import ForgetPassword from './components/ForgetPassword/ForgetPassword';
import ResetPasswordVerifyOtp from './components/ForgetPassword/ResetPasswordVerifyOtp';
import ResetPassword from './components/ForgetPassword/ResetPassword';

function App() {
  return (
    <Router>
      <Routes>
        {/* Registration Flow */}
        <Route path="/register" element={<EmailInput />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/complete-registration" element={<CompleteRegistration />} />

        {/* Authentication */}
        <Route path="/login" element={<Login />} />

        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/reset-password-verify-otp" element={<ResetPasswordVerifyOtp />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        {/* Protected Home */}
        <Route path="/" element={<ProtectedRoute element={<Home />} />} />

      </Routes>
    </Router>
  );
}

export default App;
