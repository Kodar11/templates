// src/components/ForgetPassword/ForgetPassword.jsx
import React from 'react';
import EmailOtpInput from '../EmailOtpInput';

function ForgetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-8 shadow-md rounded-xl">
        <h2 className="text-center text-2xl font-bold text-gray-900 mb-6">
          Forgot Password
        </h2>
        <EmailOtpInput redirectTo="/reset-password-verify-otp" />
      </div>
    </div>
  );
}

export default ForgetPassword;
